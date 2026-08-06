import { Query } from "node-appwrite";
import { createAdminClient, DB_ID } from "@/lib/appwrite/server";
import Link from "next/link";

export default async function AdminDashboard() {
  const { databases } = createAdminClient();

  // Appwrite has no `head: true` count-only request — listDocuments returns a
  // `total` for the query, so ask for a single document and read that.
  const countOf = async (collection: string, queries: string[] = []) => {
    try {
      const res = await databases.listDocuments(DB_ID, collection, [
        ...queries,
        Query.limit(1),
      ]);
      return res.total;
    } catch {
      return 0;
    }
  };

  const [carCount, faqCount, testimonialCount, enquiryCount] =
    await Promise.all([
      countOf("cars", [Query.equal("is_published", true)]),
      countOf("faqs"),
      countOf("testimonials"),
      countOf("enquiries", [Query.equal("is_read", false)]),
    ]);

  const stats = [
    {
      label: "Published Cars",
      value: carCount,
      href: "/admin/cars",
      color: "bg-blue-50 text-blue-700",
    },
    {
      label: "FAQs",
      value: faqCount,
      href: "/admin/faqs",
      color: "bg-green-50 text-green-700",
    },
    {
      label: "Testimonials",
      value: testimonialCount,
      href: "/admin/testimonials",
      color: "bg-purple-50 text-purple-700",
    },
    {
      label: "Unread Enquiries",
      value: enquiryCount,
      href: "/admin/enquiries",
      color: "bg-red-50 text-red-700",
    },
  ];

  return (
    <div className="pt-16 lg:pt-0">
      <h1 className="text-2xl font-extrabold text-gray-900 font-montserrat mb-6">
        Dashboard
      </h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="bg-white rounded-2xl p-5 border border-gray-200 hover:shadow-md transition-shadow"
          >
            <p className="text-xs font-semibold text-gray-400 mb-1">
              {s.label}
            </p>
            <p className={`text-3xl font-black ${s.color.split(" ")[1]}`}>
              {s.value}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
