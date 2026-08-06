import { NextRequest, NextResponse } from "next/server";
import { Client, Storage, ID, Query, Databases } from "node-appwrite";
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

const MAX_BYTES = 10 * 1024 * 1024;
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
        failed.push({ name: file.name, reason: "larger than 10MB" });
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
        const buffer = Buffer.from(await file.arrayBuffer());
        const created: any = await storage.createFile(
          BUCKET_ID,
          ID.unique(),
          InputFile.fromBuffer(buffer, file.name),
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
