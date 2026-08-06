import { getLoggedInUser } from "@/lib/appwrite/server";
import { redirect } from "next/navigation";
import AdminNav from "@/components/admin/AdminNav";

export const metadata = {
  title: "Admin Dashboard",
  description: "Dashboard to manage your application settings and data",
  robots: "noindex, nofollow",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Real auth check. The middleware only sees whether a cookie exists; this
  // verifies the session is actually valid with Appwrite, so a forged or
  // expired cookie can't reach the admin UI.
  const user = await getLoggedInUser();
  if (!user) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminNav userEmail={user.email ?? ""} />
      <main className="flex-1 lg:ml-64 p-6 min-h-screen">{children}</main>
    </div>
  );
}
