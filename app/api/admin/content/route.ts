import { NextRequest, NextResponse } from "next/server";
import { Client, Databases, ID, Query } from "node-appwrite";
import { requireAdmin } from "@/lib/appwrite/auth";

// Generic admin CRUD for simple content collections (faqs, testimonials).
//
// These pages did browser-side inserts/updates against Supabase, which RLS
// allowed for authenticated users. Appwrite collections here grant public read
// but no public write, so mutations run server-side with the API key.
//
// Only collections on this allow-list can be touched — without it, a crafted
// request could write to `cars` or read `enquiries`.
const ALLOWED = {
  faqs: ["question", "answer", "position"],
  testimonials: [
    "name",
    "role",
    "review",
    "rating",
    "is_published",
    "position",
    "avatar_url",
  ],
} as const;

type Collection = keyof typeof ALLOWED;

const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;
const API_KEY = process.env.APPWRITE_API_KEY;
const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "japex";

function admin() {
  const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY!);
  return new Databases(client);
}

function configError(): string | null {
  if (!ENDPOINT || !PROJECT_ID)
    return "Appwrite endpoint/project not configured";
  if (!API_KEY)
    return "APPWRITE_API_KEY is not set (server-only). Restart the dev server.";
  return null;
}

function validate(collection: unknown): collection is Collection {
  return typeof collection === "string" && collection in ALLOWED;
}

/** Drop anything not on the allow-list for this collection. */
function pick(collection: Collection, data: Record<string, any>) {
  const allowed = ALLOWED[collection] as readonly string[];
  const out: Record<string, any> = {};
  for (const k of allowed) {
    if (data[k] !== undefined) out[k] = data[k];
  }
  return out;
}

// ── POST: create ─────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // These routes use the API key, which bypasses all permissions.
  // Verify the caller is a signed-in admin before doing anything.
  const denied = await requireAdmin();
  if (denied) return denied;

  const cfg = configError();
  if (cfg) return NextResponse.json({ error: cfg }, { status: 500 });

  try {
    const { collection, data } = await req.json();
    if (!validate(collection)) {
      return NextResponse.json(
        { error: "Unknown collection" },
        { status: 400 },
      );
    }

    const databases = admin();
    const doc: any = await databases.createDocument(
      DB_ID,
      collection,
      ID.unique(),
      pick(collection, data ?? {}),
    );
    return NextResponse.json({ document: { ...doc, id: doc.$id } });
  } catch (e: any) {
    console.error("content POST:", e?.message);
    return NextResponse.json(
      { error: e?.message ?? "Create failed" },
      { status: 500 },
    );
  }
}

// ── PATCH: update ────────────────────────────────────────────────────────
export async function PATCH(req: NextRequest) {
  // These routes use the API key, which bypasses all permissions.
  // Verify the caller is a signed-in admin before doing anything.
  const denied = await requireAdmin();
  if (denied) return denied;

  const cfg = configError();
  if (cfg) return NextResponse.json({ error: cfg }, { status: 500 });

  try {
    const { collection, id, data } = await req.json();
    if (!validate(collection)) {
      return NextResponse.json(
        { error: "Unknown collection" },
        { status: 400 },
      );
    }
    if (!id)
      return NextResponse.json({ error: "id required" }, { status: 400 });

    const databases = admin();
    const doc: any = await databases.updateDocument(
      DB_ID,
      collection,
      id,
      pick(collection, data ?? {}),
    );
    return NextResponse.json({ document: { ...doc, id: doc.$id } });
  } catch (e: any) {
    console.error("content PATCH:", e?.message);
    return NextResponse.json(
      { error: e?.message ?? "Update failed" },
      { status: 500 },
    );
  }
}

// ── DELETE ───────────────────────────────────────────────────────────────
export async function DELETE(req: NextRequest) {
  // These routes use the API key, which bypasses all permissions.
  // Verify the caller is a signed-in admin before doing anything.
  const denied = await requireAdmin();
  if (denied) return denied;

  const cfg = configError();
  if (cfg) return NextResponse.json({ error: cfg }, { status: 500 });

  try {
    const { collection, id } = await req.json();
    if (!validate(collection)) {
      return NextResponse.json(
        { error: "Unknown collection" },
        { status: 400 },
      );
    }
    if (!id)
      return NextResponse.json({ error: "id required" }, { status: 400 });

    await admin().deleteDocument(DB_ID, collection, id);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("content DELETE:", e?.message);
    return NextResponse.json(
      { error: e?.message ?? "Delete failed" },
      { status: 500 },
    );
  }
}

// ── PUT: mark every unread document as read ──────────────────────────────
// Used by the enquiries and contact pages. Postgres did this with a single
// `update ... where is_read = false`; Appwrite has no bulk update, so the
// unread documents are listed and patched individually.
export async function PUT(req: NextRequest) {
  // These routes use the API key, which bypasses all permissions.
  // Verify the caller is a signed-in admin before doing anything.
  const denied = await requireAdmin();
  if (denied) return denied;

  const cfg = configError();
  if (cfg) return NextResponse.json({ error: cfg }, { status: 500 });

  try {
    const { collection } = await req.json();
    if (collection !== "enquiries" && collection !== "contact_submissions") {
      return NextResponse.json(
        { error: "Unsupported collection" },
        { status: 400 },
      );
    }

    const databases = admin();
    const unread = await databases.listDocuments(DB_ID, collection, [
      Query.equal("is_read", false),
      Query.limit(1000),
    ]);
    await Promise.all(
      unread.documents.map((d: any) =>
        databases.updateDocument(DB_ID, collection, d.$id, { is_read: true }),
      ),
    );
    return NextResponse.json({ ok: true, marked: unread.documents.length });
  } catch (e: any) {
    console.error("content PUT:", e?.message);
    return NextResponse.json(
      { error: e?.message ?? "Update failed" },
      { status: 500 },
    );
  }
}
