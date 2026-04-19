import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import AdminNav from "@/components/admin/AdminNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Not logged in → redirect to login
  if (!user) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminNav userEmail={user.email ?? ""} />
      <main className="flex-1 lg:ml-64 p-6 min-h-screen">{children}</main>
    </div>
  );
}
