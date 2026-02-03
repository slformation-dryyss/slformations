
import { requireAdmin } from "@/lib/auth";
import { AdminLayoutClient } from "@/components/admin/AdminLayoutClient";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Protection de la route : Seul un ADMIN ou OWNER peut accéder
  const user = await requireAdmin();

  return (
    <AdminLayoutClient userRole={user.role}>
      {children}
    </AdminLayoutClient>
  );
}

