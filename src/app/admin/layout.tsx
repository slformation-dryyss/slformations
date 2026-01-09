
import { requireAdmin } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Protection de la route : Seul un ADMIN ou OWNER peut accéder
  const user = await requireAdmin();

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      <AdminSidebar role={user.role} />
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}

