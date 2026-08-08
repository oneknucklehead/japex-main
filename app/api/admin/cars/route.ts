import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { Client, Databases, Storage, ID, Query } from "node-appwrite";
import { toCarDocument, type CarWriteInput } from "@/lib/appwrite/cars";
import { requireAdmin } from "@/lib/appwrite/auth";

// All car writes happen here.
//
// The collections grant read to anyone but no public write, so the browser SDK
// can't create or update documents — that's the "current user is not authorized"
// error. Writing server-side with the API key keeps the key off the client and
// avoids having to loosen collection permissions.

const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;
const API_KEY = process.env.APPWRITE_API_KEY;
const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "japex";
const BUCKET_ID = "car-images";
const CARS = "cars";
const CAR_IMAGES = "car_images";

function admin() {
  const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY!);
  return { databases: new Databases(client), storage: new Storage(client) };
}

function configError(): string | null {
  if (!ENDPOINT) return "NEXT_PUBLIC_APPWRITE_ENDPOINT is not set";
  if (!PROJECT_ID) return "NEXT_PUBLIC_APPWRITE_PROJECT_ID is not set";
  if (!API_KEY)
    return "APPWRITE_API_KEY is not set (server-only). Restart the dev server after adding it.";
  return null;
}

const fileIdFromUrl = (url: string) =>
  url?.match(/\/files\/([^/]+)\/view/)?.[1] ?? null;

/** Replace a car's image rows. Appwrite has no "delete where car_id = x". */
async function replaceImages(
  databases: Databases,
  carId: string,
  images: { url: string; alt?: string }[],
) {
  const existing = await databases.listDocuments(DB_ID, CAR_IMAGES, [
    Query.equal("car_id", carId),
    Query.limit(1000),
  ]);
  await Promise.all(
    existing.documents.map((d: any) =>
      databases.deleteDocument(DB_ID, CAR_IMAGES, d.$id),
    ),
  );
  await Promise.all(
    images.map((img, i) =>
      databases.createDocument(DB_ID, CAR_IMAGES, ID.unique(), {
        car_id: carId,
        url: img.url,
        alt: img.alt ?? "",
        position: i,
      }),
    ),
  );
}

/**
 * Drop the cached HTML for every page that lists or shows cars.
 *
 * Public pages are statically rendered with `revalidate = 60`. Without this,
 * an admin edit wouldn't show up for up to a minute — and a delete would leave
 * the car visible on the homepage, which looks like the delete failed.
 *
 * `revalidatePath("/cars/[slug]", "page")` invalidates every car detail page
 * at once rather than needing the specific slug.
 */
function revalidateCarPages(slug?: string) {
  try {
    revalidatePath("/"); // homepage: arrivals + budget sections
    revalidatePath("/cars"); // listing
    revalidatePath("/cars/[slug]", "page"); // all detail pages
    revalidatePath("/admin/cars"); // admin list
    if (slug) revalidatePath(`/cars/${slug}`);
  } catch (e) {
    // Never fail a successful write because cache invalidation hiccuped.
    console.error("revalidate failed:", e);
  }
}

// ── POST: create or update a car (+ its image rows) ──────────────────────
export async function POST(req: NextRequest) {
  // These routes use the API key, which bypasses all permissions.
  // Verify the caller is a signed-in admin before doing anything.
  const denied = await requireAdmin();
  if (denied) return denied;

  const cfg = configError();
  if (cfg) return NextResponse.json({ error: cfg }, { status: 500 });

  try {
    const body = await req.json();
    const {
      input,
      mode,
      carId,
      images,
    }: {
      input: CarWriteInput;
      mode: "create" | "edit";
      carId?: string;
      images?: { url: string; alt?: string }[];
    } = body;

    if (!input)
      return NextResponse.json({ error: "input required" }, { status: 400 });
    if (mode === "edit" && !carId) {
      return NextResponse.json(
        { error: "carId required in edit mode" },
        { status: 400 },
      );
    }

    const { databases } = admin();
    // toCarDocument writes search_blob + availability_rank (both were Postgres
    // generated columns) and trims text so filter facets don't split.
    const doc = toCarDocument(input);

    // Check uniqueness up front rather than parsing the failure.
    //
    // Appwrite reports a unique-index violation as:
    //   "Document with the requested ID '<the OTHER doc>' already exists."
    // It never names the offending attribute, so string-matching for "vin"
    // can't work — and the message is actively misleading, since the id it
    // prints belongs to the conflicting row, not the one being saved.
    for (const field of ["vin", "slug"] as const) {
      const val = doc[field];
      if (!val) continue;
      const clash = await databases.listDocuments(DB_ID, CARS, [
        Query.equal(field, val),
        Query.limit(1),
      ]);
      const other = clash.documents.find((d: any) => d.$id !== carId);
      if (other) {
        return NextResponse.json(
          {
            error:
              field === "vin"
                ? `A car with VIN "${val}" already exists (${(other as any).year} ${(other as any).make} ${(other as any).model}).`
                : `The URL slug "${val}" is already used by another car.`,
            duplicateVin: field === "vin",
            duplicateSlug: field === "slug",
            conflictingCarId: (other as any).$id,
          },
          { status: 409 },
        );
      }
    }

    let savedId: string;
    try {
      if (mode === "create") {
        const created: any = await databases.createDocument(
          DB_ID,
          CARS,
          ID.unique(),
          doc,
        );
        savedId = created.$id;
      } else {
        await databases.updateDocument(DB_ID, CARS, carId!, doc);
        savedId = carId!;
      }
    } catch (e: any) {
      const msg = String(e?.message ?? "");
      // Fallback: a race between the check above and the write.
      if (e?.code === 409 || msg.includes("already exists")) {
        return NextResponse.json(
          {
            error:
              "This car conflicts with an existing one (duplicate VIN or slug).",
            duplicateVin: true,
          },
          { status: 409 },
        );
      }
      console.error("car save failed:", e?.code, e?.type, msg);
      return NextResponse.json(
        { error: msg || "Could not save this car." },
        { status: 500 },
      );
    }

    if (Array.isArray(images)) {
      try {
        await replaceImages(databases, savedId, images);
      } catch (e: any) {
        console.error("replaceImages failed:", e?.message);
        return NextResponse.json(
          {
            carId: savedId,
            error: `Car saved, but images could not be updated: ${e?.message}`,
          },
          { status: 500 },
        );
      }
    }

    revalidateCarPages(doc.slug);
    return NextResponse.json({ carId: savedId });
  } catch (e: any) {
    console.error("cars POST:", e);
    return NextResponse.json(
      { error: e?.message ?? "Request failed" },
      { status: 500 },
    );
  }
}

// ── DELETE: car + image rows + storage files ─────────────────────────────
export async function DELETE(req: NextRequest) {
  // These routes use the API key, which bypasses all permissions.
  // Verify the caller is a signed-in admin before doing anything.
  const denied = await requireAdmin();
  if (denied) return denied;

  const cfg = configError();
  if (cfg) return NextResponse.json({ error: cfg }, { status: 500 });

  try {
    const { carId } = await req.json();
    if (!carId)
      return NextResponse.json({ error: "carId required" }, { status: 400 });

    const { databases, storage } = admin();

    const imgs = await databases.listDocuments(DB_ID, CAR_IMAGES, [
      Query.equal("car_id", carId),
      Query.limit(1000),
    ]);

    // Storage first — the Supabase version deleted rows and left files behind,
    // which is where the 194 orphaned files in the old bucket came from.
    let filesDeleted = 0;
    for (const doc of imgs.documents as any[]) {
      const fileId = fileIdFromUrl(doc.url);
      if (!fileId) continue;
      try {
        await storage.deleteFile(BUCKET_ID, fileId);
        filesDeleted++;
      } catch (e: any) {
        console.error("file delete failed:", fileId, e?.message);
      }
    }

    await Promise.all(
      imgs.documents.map((d: any) =>
        databases.deleteDocument(DB_ID, CAR_IMAGES, d.$id),
      ),
    );
    await databases.deleteDocument(DB_ID, CARS, carId);

    revalidateCarPages();
    return NextResponse.json({
      ok: true,
      filesDeleted,
      rowsDeleted: imgs.documents.length,
    });
  } catch (e: any) {
    console.error("cars DELETE:", e);
    return NextResponse.json(
      { error: e?.message ?? "Delete failed" },
      { status: 500 },
    );
  }
}
