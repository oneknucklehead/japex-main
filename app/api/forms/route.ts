import { NextRequest, NextResponse } from "next/server";
import { Client, Databases, ID } from "node-appwrite";
import { sendNotification } from "@/lib/email";

// Single endpoint for all three public forms.
//
// It writes to Appwrite AND emails the dealership in one request. Doing the
// write here rather than from the browser means the record and the
// notification can't diverge — previously the client wrote the document and
// nothing told anyone about it.
//
// Deliberately unauthenticated (these are public forms), but it can only ever
// write to the three collections below and only ever emails the fixed
// NOTIFY_TO address, so there's nothing to redirect or exfiltrate.

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "japex";

function db() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
    .setKey(process.env.APPWRITE_API_KEY!);
  return new Databases(client);
}

const str = (v: unknown, max = 500) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const kind = payload?.kind;
    const databases = db();

    // ── Enquiry ─────────────────────────────────────────────────────────
    if (kind === "enquiry") {
      const name = str(payload.name, 150);
      const email = str(payload.email, 200);
      if (!name || !email) {
        return NextResponse.json(
          { error: "Name and email are required." },
          { status: 400 },
        );
      }
      const phone = str(payload.phone, 30);
      const message = str(payload.message, 5000);
      const carName = str(payload.carName, 200);

      await databases.createDocument(DB_ID, "enquiries", ID.unique(), {
        car_id: str(payload.carId, 64),
        name,
        email,
        phone,
        message,
        is_read: false,
      });

      await sendNotification({
        subject: `New enquiry — ${carName || "general"}`,
        replyTo: email,
        rows: [
          ["Name", name],
          ["Email", email],
          ["Phone", phone],
          ["Vehicle", carName],
        ],
        body: message,
      });

      return NextResponse.json({ ok: true });
    }

    // ── Contact form ────────────────────────────────────────────────────
    if (kind === "contact") {
      const name = str(payload.name, 150);
      const email = str(payload.email, 200);
      if (!name || !email) {
        return NextResponse.json(
          { error: "Name and email are required." },
          { status: 400 },
        );
      }
      const phone = str(payload.phone, 30);
      const message = str(payload.message, 5000);
      const source = payload.source === "cta" ? "cta" : "contact_page";

      await databases.createDocument(
        DB_ID,
        "contact_submissions",
        ID.unique(),
        {
          name,
          email,
          phone,
          message,
          source,
          is_read: false,
        },
      );

      await sendNotification({
        subject: `New contact message (${source === "cta" ? "site CTA" : "contact page"})`,
        replyTo: email,
        rows: [
          ["Name", name],
          ["Email", email],
          ["Phone", phone],
        ],
        body: message,
      });

      return NextResponse.json({ ok: true });
    }

    // ── Test drive booking ──────────────────────────────────────────────
    if (kind === "test_drive") {
      const name = str(payload.name, 150);
      const email = str(payload.email, 200);
      const phone = str(payload.phone, 30);
      if (!name || !email || !phone) {
        return NextResponse.json(
          { error: "Name, email and phone are required." },
          { status: 400 },
        );
      }
      const carName = str(payload.carName, 200);
      const date = str(payload.preferred_date, 20);
      const time = str(payload.preferred_time, 30);
      const notes = str(payload.notes, 5000);

      await databases.createDocument(DB_ID, "test_drives", ID.unique(), {
        car_id: str(payload.carId, 64),
        car_name: carName,
        car_slug: str(payload.carSlug, 200),
        name,
        phone,
        email,
        postcode: str(payload.postcode, 10),
        preferred_date: date,
        preferred_time: time,
        notes,
        status: "Pending",
        is_read: false,
      });

      const readableDate = date
        ? new Date(date + "T00:00:00").toLocaleDateString("en-AU", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : "not specified";

      await sendNotification({
        subject: `TEST DRIVE REQUEST — ${carName}`,
        replyTo: email,
        rows: [
          ["Vehicle", carName],
          ["Date", readableDate],
          ["Time", time],
          ["Name", name],
          ["Phone", phone],
          ["Email", email],
          ["Postcode", str(payload.postcode, 10)],
        ],
        body: notes,
      });

      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Unknown form type" }, { status: 400 });
  } catch (e: any) {
    console.error("forms POST:", e?.message);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
