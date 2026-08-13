import { NextRequest, NextResponse } from "next/server";
import { Client, Databases } from "node-appwrite";
import { requireAdmin } from "@/lib/appwrite/auth";

// Status updates for test drive bookings.
//
// The collection grants create to anyone but no read or update, so changes
// have to run server-side with the API key — behind requireAdmin(), like every
// other /api/admin route.

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "japex";
const COLLECTION = "test_drives";
const STATUSES = ["Pending", "Confirmed", "Completed", "Cancelled"];

function admin() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
    .setKey(process.env.APPWRITE_API_KEY!);
  return new Databases(client);
}

export async function PATCH(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const { id, status } = await req.json();
    if (!id)
      return NextResponse.json({ error: "id required" }, { status: 400 });
    // Validate against the enum — an unknown value is rejected by Appwrite
    // anyway, but failing here gives a clearer error.
    if (!STATUSES.includes(status)) {
      return NextResponse.json({ error: "Unknown status" }, { status: 400 });
    }

    await admin().updateDocument(DB_ID, COLLECTION, id, {
      status,
      is_read: true,
    });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("test-drives PATCH:", e?.message);
    return NextResponse.json(
      { error: e?.message ?? "Update failed" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const { id } = await req.json();
    if (!id)
      return NextResponse.json({ error: "id required" }, { status: 400 });
    await admin().deleteDocument(DB_ID, COLLECTION, id);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("test-drives DELETE:", e?.message);
    return NextResponse.json(
      { error: e?.message ?? "Delete failed" },
      { status: 500 },
    );
  }
}
