import { NextRequest, NextResponse } from "next/server";
import {
  Client,
  Storage,
  ID,
  Query,
  Databases,
  Permission,
  Role,
} from "node-appwrite";
import { InputFile } from "node-appwrite/file";
import { requireAdmin } from "@/lib/appwrite/auth";

// Server-side storage operations.
//
// Uploads go through the server so the Appwrite API key never reaches the
// browser. (The Appwrite bucket grants public read but no public write.)

const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;
const API_KEY = process.env.APPWRITE_API_KEY;
const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "japex";
const BUCKET_ID = "car-images";

// The cap applies to the file BEFORE resizing. It can be generous now that
// everything is re-encoded on the way in — a 25 MB camera JPEG becomes a
// ~150 KB WebP, so rejecting it would only inconvenience the dealer.
const MAX_BYTES = 25 * 1024 * 1024;
const ALLOWED = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/avif",
];
// The bucket was created with an allowed-extension list. A file whose name
// doesn't end in one of these is rejected by Appwrite, so catch it here with a
// clear message instead of a cryptic server error.
const ALLOWED_EXT = ["jpg", "jpeg", "png", "webp", "avif"];

// Every upload is re-encoded before it reaches storage.
//
// Dealer photos come straight off a camera or phone — the migration found a
// 703 KB median and files up to 5 MB, for images displayed at ~320px in a card.
// Transformations hide that at delivery time, but the originals still cost
// storage, upload time, and (as the 19 MB service banner proved) can be large
// enough to break Appwrite's transformer outright.
//
// Resizing here means the problem can't come back: no oversized file ever
// enters the bucket in the first place.
const MAX_WIDTH = 1600; // generous for a full-screen gallery view
const WEBP_QUALITY = 82; // visually indistinguishable from the original here

/**
 * Re-encode to WebP at MAX_WIDTH. Returns the original buffer unchanged if
 * sharp isn't installed or the image can't be processed — a failed resize must
 * never block an upload, since an oversized image beats no image.
 */
async function optimiseImage(
  buffer: Buffer,
  filename: string,
): Promise<{ buffer: Buffer; filename: string; note?: string }> {
  // Resolved at runtime, hidden from the bundler: a static import would make
  // sharp a hard build dependency even for deployments that don't want it.
  let sharp: any;
  try {
    const req = eval("require") as NodeRequire;
    sharp = req("sharp");
  } catch {
    console.warn("sharp is not installed — uploading the original unresized.");
    return { buffer, filename, note: "not resized (sharp missing)" };
  }

  try {
    const out = await sharp(buffer)
      .rotate() // honour EXIF orientation, or phone photos arrive sideways
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toBuffer();

    // Keep whichever is smaller. A small, already-optimised WebP can come out
    // bigger after a re-encode.
    if (out.length >= buffer.length) {
      return { buffer, filename, note: "kept original (already smaller)" };
    }

    return {
      buffer: out,
      filename: filename.replace(/\.[^.]+$/, "") + ".webp",
    };
  } catch (e: any) {
    console.error("Image optimisation failed, uploading original:", e?.message);
    return { buffer, filename, note: "not resized (processing failed)" };
  }
}

function admin() {
  const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY!);
  return { storage: new Storage(client), databases: new Databases(client) };
}

function viewUrl(fileId: string) {
  return `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${fileId}/view?project=${PROJECT_ID}`;
}

function fileIdFromUrl(url: string): string | null {
  const m = url?.match(/\/files\/([^/]+)\/view/);
  return m ? m[1] : null;
}

/** Fail fast with a clear message rather than a confusing 401 later. */
function configError(): string | null {
  if (!ENDPOINT) return "NEXT_PUBLIC_APPWRITE_ENDPOINT is not set";
  if (!PROJECT_ID) return "NEXT_PUBLIC_APPWRITE_PROJECT_ID is not set";
  if (!API_KEY)
    return "APPWRITE_API_KEY is not set (server-only, no NEXT_PUBLIC_ prefix). Restart the dev server after adding it to .env.local";
  return null;
}

// ── GET: self-test. Visit /api/admin/storage in the browser. ─────────────
export async function GET() {
  // These routes use the API key, which bypasses all permissions.
  // Verify the caller is a signed-in admin before doing anything.
  const denied = await requireAdmin();
  if (denied) return denied;

  const cfg = configError();
  const report: Record<string, unknown> = {
    endpoint: ENDPOINT ?? null,
    projectId: PROJECT_ID ?? null,
    apiKeyPresent: Boolean(API_KEY),
    apiKeyLength: API_KEY?.length ?? 0,
    bucketId: BUCKET_ID,
  };
  if (cfg)
    return NextResponse.json(
      { ok: false, problem: cfg, ...report },
      { status: 500 },
    );

  try {
    const { storage } = admin();
    const bucket: any = await storage.getBucket(BUCKET_ID);
    const files: any = await storage.listFiles(BUCKET_ID, [Query.limit(1)]);
    return NextResponse.json({
      ok: true,
      ...report,
      bucketFound: true,
      bucketName: bucket.name,
      fileSecurity: bucket.fileSecurity,
      allowedFileExtensions: bucket.allowedFileExtensions,
      maximumFileSize: bucket.maximumFileSize,
      totalFilesInBucket: files.total,
    });
  } catch (e: any) {
    return NextResponse.json(
      {
        ok: false,
        ...report,
        bucketFound: false,
        appwriteError: e?.message,
        code: e?.code,
        type: e?.type,
      },
      { status: 500 },
    );
  }
}

// ── POST: upload one or more images ──────────────────────────────────────
export async function POST(req: NextRequest) {
  // These routes use the API key, which bypasses all permissions.
  // Verify the caller is a signed-in admin before doing anything.
  const denied = await requireAdmin();
  if (denied) return denied;

  const cfg = configError();
  if (cfg) return NextResponse.json({ error: cfg }, { status: 500 });

  try {
    const form = await req.formData();
    const files = form
      .getAll("files")
      .filter((f): f is File => f instanceof File);
    if (!files.length) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const { storage } = admin();
    const uploaded: { url: string; name: string }[] = [];
    const failed: { name: string; reason: string }[] = [];

    for (const file of files) {
      if (file.size > MAX_BYTES) {
        failed.push({ name: file.name, reason: "larger than 25MB" });
        continue;
      }
      if (file.type && !ALLOWED.includes(file.type.toLowerCase())) {
        failed.push({
          name: file.name,
          reason: `unsupported type ${file.type}`,
        });
        continue;
      }
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
      if (!ALLOWED_EXT.includes(ext)) {
        failed.push({
          name: file.name,
          reason: `extension .${ext} not allowed by the bucket (allowed: ${ALLOWED_EXT.join(", ")})`,
        });
        continue;
      }

      try {
        const raw = Buffer.from(await file.arrayBuffer());
        const { buffer, filename, note } = await optimiseImage(raw, file.name);

        if (note) {
          console.warn(`${file.name}: ${note}`);
        } else {
          const saved = (
            ((raw.length - buffer.length) / raw.length) *
            100
          ).toFixed(0);
          console.log(
            `${file.name}: ${(raw.length / 1024).toFixed(0)}KB -> ` +
              `${(buffer.length / 1024).toFixed(0)}KB (${saved}% smaller)`,
          );
        }

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
          failed.push({
            name: file.name,
            reason: "Appwrite returned no file id",
          });
          continue;
        }

        // Verify it actually persisted. Without this the route can hand back a
        // URL for a file that was never stored — the form then shows a preview
        // that 404s and the save-time guard rejects it.
        try {
          await storage.getFile(BUCKET_ID, created.$id);
        } catch {
          failed.push({
            name: file.name,
            reason: "upload reported success but the file is not in the bucket",
          });
          continue;
        }

        uploaded.push({ url: viewUrl(created.$id), name: file.name });
      } catch (e: any) {
        // Surface the real Appwrite message — this is what was being lost.
        const reason = [
          e?.message,
          e?.type && `(${e.type})`,
          e?.code && `[${e.code}]`,
        ]
          .filter(Boolean)
          .join(" ");
        console.error("Appwrite upload failed:", file.name, reason);
        failed.push({ name: file.name, reason: reason || "upload failed" });
      }
    }

    return NextResponse.json({ uploaded, failed });
  } catch (e: any) {
    console.error("Upload route error:", e);
    return NextResponse.json(
      { error: e?.message ?? "Upload failed" },
      { status: 500 },
    );
  }
}

// ── DELETE: remove a file and any car_images row pointing at it ──────────
export async function DELETE(req: NextRequest) {
  // These routes use the API key, which bypasses all permissions.
  // Verify the caller is a signed-in admin before doing anything.
  const denied = await requireAdmin();
  if (denied) return denied;

  const cfg = configError();
  if (cfg) return NextResponse.json({ error: cfg }, { status: 500 });

  try {
    const { url } = await req.json();
    if (!url)
      return NextResponse.json({ error: "url required" }, { status: 400 });

    const { storage, databases } = admin();
    const fileId = fileIdFromUrl(url);
    let fileDeleted = false;

    // Storage first, then rows — a partial failure leaves a visible broken row
    // rather than an invisible orphaned file.
    if (fileId) {
      try {
        await storage.deleteFile(BUCKET_ID, fileId);
        fileDeleted = true;
      } catch (e: any) {
        console.error("Appwrite file delete failed:", fileId, e?.message);
      }
    }

    const rows = await databases.listDocuments(DB_ID, "car_images", [
      Query.equal("url", url),
      Query.limit(100),
    ]);
    await Promise.all(
      rows.documents.map((d: any) =>
        databases.deleteDocument(DB_ID, "car_images", d.$id),
      ),
    );

    return NextResponse.json({
      ok: true,
      fileDeleted,
      deletedRows: rows.documents.length,
    });
  } catch (e: any) {
    console.error("Delete route error:", e);
    return NextResponse.json(
      { error: e?.message ?? "Delete failed" },
      { status: 500 },
    );
  }
}
