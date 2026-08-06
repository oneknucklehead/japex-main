import { Query } from "node-appwrite";
import { createAdminClient, DB_ID } from "@/lib/appwrite/server";

const SOURCE_LABEL: Record<string, string> = {
  contact_page: "Contact page",
  cta: "Site CTA",
};

export default async function AdminContactPage() {
  const { databases } = createAdminClient();

  const res = await databases.listDocuments(DB_ID, "contact_submissions", [
    Query.orderDesc("$createdAt"),
    Query.limit(1000),
  ]);

  const submissions = (res.documents as any[]).map((d) => ({
    ...d,
    id: d.$id,
    created_at: d.$createdAt,
  }));

  // Mark all as read — no bulk update in Appwrite, so patch each unread one.
  await Promise.all(
    submissions
      .filter((s) => !s.is_read)
      .map((s) =>
        databases.updateDocument(DB_ID, "contact_submissions", s.id, {
          is_read: true,
        }),
      ),
  );

  return (
    <div className="pt-16 lg:pt-0">
      <h1 className="text-2xl font-extrabold text-gray-900 font-montserrat mb-6">
        Contact Messages
      </h1>
      <div className="space-y-3">
        {(submissions ?? []).map((s) => (
          <div
            key={s.id}
            className="bg-white rounded-2xl p-5 border border-gray-200"
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <p className="font-bold text-gray-900">{s.name}</p>
                <p className="text-xs text-gray-400">
                  <a
                    href={`mailto:${s.email}`}
                    className="hover:text-red-600 transition-colors"
                  >
                    {s.email}
                  </a>
                  {s.phone && (
                    <>
                      {" • "}
                      <a
                        href={`tel:${s.phone.replace(/\s/g, "")}`}
                        className="hover:text-red-600 transition-colors"
                      >
                        {s.phone}
                      </a>
                    </>
                  )}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs font-semibold text-red-600">
                  {SOURCE_LABEL[s.source] ?? s.source}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {new Date(s.created_at).toLocaleDateString("en-AU")}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 bg-gray-50 rounded-xl px-4 py-3 whitespace-pre-wrap">
              {s.message}
            </p>
          </div>
        ))}
        {(submissions ?? []).length === 0 && (
          <p className="text-center text-gray-400 py-12">
            No contact messages yet.
          </p>
        )}
      </div>
    </div>
  );
}
