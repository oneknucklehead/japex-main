import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import {
  Client,
  Storage,
  Databases,
  ID,
  Query,
  Permission,
  Role,
} from "node-appwrite";
import { InputFile } from "node-appwrite/file";
import { requireAdmin } from "@/lib/appwrite/auth";

// Server-side popular-features management.
//
// DELETE here fixes a real bug carried over from the Supabase version:
// deleteFeature() removed the catalog row but never scrubbed the id out of
// cars.popular_feature_ids. That left 19 of 25 cars holding dead references
// (found during migration). Cars are updated FIRST so a failure leaves a live
// catalog entry rather than dangling ids.

const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;
const API_KEY = process.env.APPWRITE_API_KEY;
const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "japex";
const BUCKET_ID = "car-images";
const COLLECTION = "popular_features";

// Applies before resizing — see optimiseImage below.
const MAX_BYTES = 25 * 1024 * 1024;
const MAX_WIDTH = 1200; // feature tiles render at ~25% width
const WEBP_QUALITY = 82;

/**
 * Re-encode to WebP. Falls back to the original buffer if sharp is missing or
 * the image can't be processed — a failed resize shouldn't block an upload.
 *
 * The migration found 3-5 MB PNGs in this catalog for illustrations displayed
 * at a few hundred pixels; this stops that recurring.
 */
async function optimiseImage(buffer: Buffer, filename: string) {
  let sharp: any;
  try {
    const req = eval("require") as NodeRequire;
    sharp = req("sharp");
  } catch {
    console.warn("sharp is not installed — uploading the original unresized.");
    return { buffer, filename };
  }
  try {
    const out = await sharp(buffer)
      .rotate()
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toBuffer();
    if (out.length >= buffer.length) return { buffer, filename };
    return {
      buffer: out,
      filename: filename.replace(/\.[^.]+$/, "") + ".webp",
    };
  } catch (e: any) {
    console.error("Image optimisation failed, uploading original:", e?.message);
    return { buffer, filename };
  }
}
const ALLOWED_EXT = ["jpg", "jpeg", "png", "webp", "avif"];

function admin() {
  const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY!);
  return { storage: new Storage(client), databases: new Databases(client) };
}

const viewUrl = (fileId: string) =>
  `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${fileId}/view?project=${PROJECT_ID}`;

const fileIdFromUrl = (url: string) =>
  url?.match(/\/files\/([^/]+)\/view/)?.[1] ?? null;

function configError(): string | null {
  if (!ENDPOINT) return "NEXT_PUBLIC_APPWRITE_ENDPOINT is not set";
  if (!PROJECT_ID) return "NEXT_PUBLIC_APPWRITE_PROJECT_ID is not set";
  if (!API_KEY)
    return "APPWRITE_API_KEY is not set (server-only). Restart the dev server after adding it.";
  return null;
}

// ── POST: create a catalog entry (image + row) ───────────────────────────
export async function POST(req: NextRequest) {
  // These routes use the API key, which bypasses all permissions.
  // Verify the caller is a signed-in admin before doing anything.
  const denied = await requireAdmin();
  if (denied) return denied;

  const cfg = configError();
  if (cfg) return NextResponse.json({ error: cfg }, { status: 500 });

  try {
    const form = await req.formData();
    const name = String(form.get("name") ?? "").trim();
    const file = form.get("file");
    const position = Number(form.get("position") ?? 0);

    if (!name)
      return NextResponse.json(
        { error: "A name is required." },
        { status: 400 },
      );
    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "An image is required." },
        { status: 400 },
      );
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "Image is larger than 25MB." },
        { status: 400 },
      );
    }
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    if (!ALLOWED_EXT.includes(ext)) {
      return NextResponse.json(
        {
          error: `Extension .${ext} not allowed (use: ${ALLOWED_EXT.join(", ")}).`,
        },
        { status: 400 },
      );
    }

    const { storage, databases } = admin();

    // 1. upload
    const raw = Buffer.from(await file.arrayBuffer());
    const { buffer, filename } = await optimiseImage(raw, file.name);
    console.log(
      `${file.name}: ${(raw.length / 1024).toFixed(0)}KB -> ${(buffer.length / 1024).toFixed(0)}KB`,
    );

    const created: any = await storage.createFile(
      BUCKET_ID,
      ID.unique(),
      InputFile.fromBuffer(buffer, filename),
      // Explicit public read. Files inherit bucket permissions only while
      // fileSecurity is off; being explicit means an upload can't end up
      // private if that setting is ever flipped.
      [Permission.read(Role.any())],
    );
    if (!created?.$id) {
      return NextResponse.json(
        { error: "Upload failed — no file id returned." },
        { status: 500 },
      );
    }
    // verify it persisted before writing a row that points at it
    try {
      await storage.getFile(BUCKET_ID, created.$id);
    } catch {
      return NextResponse.json(
        { error: "Upload reported success but the file is not in the bucket." },
        { status: 500 },
      );
    }

    // 2. catalog row — roll back the upload if this fails, so no orphan file
    try {
      const doc: any = await databases.createDocument(
        DB_ID,
        COLLECTION,
        ID.unique(),
        {
          name,
          image_url: viewUrl(created.$id),
          position,
        },
      );
      return NextResponse.json({
        feature: {
          id: doc.$id,
          name: doc.name,
          image_url: doc.image_url,
          position: doc.position,
        },
      });
    } catch (e: any) {
      try {
        await storage.deleteFile(BUCKET_ID, created.$id);
      } catch {
        /* best effort */
      }
      console.error("popular_features create failed:", e?.message);
      return NextResponse.json(
        { error: e?.message ?? "Could not save feature." },
        { status: 500 },
      );
    }
  } catch (e: any) {
    console.error("popular-features POST:", e);
    return NextResponse.json(
      { error: e?.message ?? "Request failed" },
      { status: 500 },
    );
  }
}

// ── DELETE: remove entry, scrub references, delete image ─────────────────
export async function DELETE(req: NextRequest) {
  // These routes use the API key, which bypasses all permissions.
  // Verify the caller is a signed-in admin before doing anything.
  const denied = await requireAdmin();
  if (denied) return denied;

  const cfg = configError();
  if (cfg) return NextResponse.json({ error: cfg }, { status: 500 });

  try {
    const { id } = await req.json();
    if (!id)
      return NextResponse.json({ error: "id required" }, { status: 400 });

    const { storage, databases } = admin();

    // 1. Scrub the id from every car FIRST. Small inventory, so listing all
    //    cars and filtering in JS avoids depending on array-contains query
    //    semantics or an extra index.
    const cars = await databases.listDocuments(DB_ID, "cars", [
      Query.limit(1000),
    ]);
    const affected = (cars.documents as any[]).filter((c) =>
      (c.popular_feature_ids ?? []).includes(id),
    );
    for (const car of affected) {
      await databases.updateDocument(DB_ID, "cars", car.$id, {
        popular_feature_ids: (car.popular_feature_ids ?? []).filter(
          (x: string) => x !== id,
        ),
      });
    }

    // 2. Delete the image (best effort — an orphan file is harmless)
    let feature: any = null;
    try {
      feature = await databases.getDocument(DB_ID, COLLECTION, id);
    } catch {
      /* already gone */
    }
    const fileId = feature ? fileIdFromUrl(feature.image_url ?? "") : null;
    if (fileId) {
      try {
        await storage.deleteFile(BUCKET_ID, fileId);
      } catch (e: any) {
        console.error(
          "popular feature image delete failed:",
          fileId,
          e?.message,
        );
      }
    }

    // 3. Delete the catalog row last
    await databases.deleteDocument(DB_ID, COLLECTION, id);

    try {
      revalidatePath("/cars/[slug]", "page");
    } catch (e) {
      console.error("revalidate failed:", e);
    }
    return NextResponse.json({ ok: true, carsUpdated: affected.length });
  } catch (e: any) {
    console.error("popular-features DELETE:", e);
    return NextResponse.json(
      { error: e?.message ?? "Delete failed" },
      { status: 500 },
    );
  }
}
