import { Query } from "node-appwrite";
import { createAdminClient, DB_ID } from "@/lib/appwrite/server";
import TestDrivesClient from "./TestDrivesClient";

export default async function AdminTestDrivesPage() {
  const { databases } = createAdminClient();

  // Newest first. The collection grants no public read, so this only works
  // via the API key — which is why the fetch is server-side.
  const res = await databases.listDocuments(DB_ID, "test_drives", [
    Query.orderDesc("$createdAt"),
    Query.limit(1000),
  ]);
  const bookings = (res.documents as any[]).map((d) => ({
    id: d.$id,
    vin: d.vin,
    car_id: d.car_id,
    car_name: d.car_name,
    car_slug: d.car_slug,
    name: d.name,
    phone: d.phone,
    email: d.email,
    postcode: d.postcode,
    preferred_date: d.preferred_date,
    preferred_time: d.preferred_time,
    notes: d.notes,
    status: d.status ?? "Pending",
    is_read: d.is_read ?? false,
    created_at: d.$createdAt,
  }));

  return <TestDrivesClient bookings={bookings} />;
}
