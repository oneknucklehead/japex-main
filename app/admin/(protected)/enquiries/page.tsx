import { Query } from "node-appwrite";
import { createAdminClient, DB_ID } from "@/lib/appwrite/server";

export default async function AdminEnquiriesPage() {
  const { databases } = createAdminClient();

  const res = await databases.listDocuments(DB_ID, "enquiries", [
    Query.orderDesc("$createdAt"),
    Query.limit(1000),
  ]);

  // No joins — resolve the referenced cars in one extra query and attach.
  const carIds = [
    ...new Set((res.documents as any[]).map((e) => e.car_id).filter(Boolean)),
  ];
  const carsById: Record<string, any> = {};
  if (carIds.length) {
    const carRes = await databases.listDocuments(DB_ID, "cars", [
      Query.equal("$id", carIds),
      Query.limit(1000),
    ]);
    for (const c of carRes.documents as any[]) {
      carsById[c.$id] = { make: c.make, model: c.model, year: c.year };
    }
  }

  const enquiries = (res.documents as any[]).map((e) => ({
    ...e,
    id: e.$id,
    created_at: e.$createdAt,
    cars: e.car_id ? (carsById[e.car_id] ?? null) : null,
  }));

  // Mark all as read. Appwrite has no bulk update, so this patches each unread
  // document; the route does it server-side with the API key.
  const unread = enquiries.filter((e) => !e.is_read);
  await Promise.all(
    unread.map((e) =>
      databases.updateDocument(DB_ID, "enquiries", e.id, { is_read: true }),
    ),
  );

  return (
    <div className="pt-16 lg:pt-0">
      <h1 className="text-2xl font-extrabold text-gray-900 font-montserrat mb-6">
        Enquiries
      </h1>
      <div className="space-y-3">
        {(enquiries ?? []).map((e) => (
          <div
            key={e.id}
            className="bg-white rounded-2xl p-5 border border-gray-200"
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <p className="font-bold text-gray-900">{e.name}</p>
                <p className="text-xs text-gray-400">
                  {e.email} {e.phone && `• ${e.phone}`}
                </p>
              </div>
              <div className="text-right shrink-0">
                {e.cars && (
                  <p className="text-xs font-semibold text-red-600">
                    {e.cars.year} {e.cars.make} {e.cars.model}
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-0.5">
                  {new Date(e.created_at).toLocaleDateString("en-AU")}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 bg-gray-50 rounded-xl px-4 py-3">
              {e.message}
            </p>
          </div>
        ))}
        {(enquiries ?? []).length === 0 && (
          <p className="text-center text-gray-400 py-12">No enquiries yet.</p>
        )}
      </div>
    </div>
  );
}
