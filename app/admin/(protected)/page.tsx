import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [
    { count: carCount },
    { count: faqCount },
    { count: testimonialCount },
    { count: enquiryCount },
  ] = await Promise.all([
    supabase
      .from("cars")
      .select("*", { count: "exact", head: true })
      .eq("is_published", true),
    supabase.from("faqs").select("*", { count: "exact", head: true }),
    supabase.from("testimonials").select("*", { count: "exact", head: true }),
    supabase
      .from("enquiries")
      .select("*", { count: "exact", head: true })
      .eq("is_read", false),
  ]);

  const stats = [
    {
      label: "Published Cars",
      value: carCount ?? 0,
      href: "/admin/cars",
      color: "bg-blue-50 text-blue-700",
    },
    {
      label: "FAQs",
      value: faqCount ?? 0,
      href: "/admin/faqs",
      color: "bg-green-50 text-green-700",
    },
    {
      label: "Testimonials",
      value: testimonialCount ?? 0,
      href: "/admin/testimonials",
      color: "bg-purple-50 text-purple-700",
    },
    {
      label: "Unread Enquiries",
      value: enquiryCount ?? 0,
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
