import { createClient } from "@/utils/supabase/server";

export default async function AdminEnquiriesPage() {
  const supabase = await createClient();
  const { data: enquiries } = await supabase
    .from("enquiries")
    .select("*, cars(make, model, year)")
    .order("created_at", { ascending: false });

  // Mark all as read
  await supabase
    .from("enquiries")
    .update({ is_read: true })
    .eq("is_read", false);

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
