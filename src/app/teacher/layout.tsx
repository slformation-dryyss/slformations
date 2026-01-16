import { StudentSidebar } from "@/components/dashboard/StudentSidebar";
import { requireTeacher } from "@/lib/auth";

export default async function TeacherLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Protection de la route : Seul un TEACHER ou supérieur peut accéder
    // (ou ADMIN/OWNER via hiérarchie gérée par requireTeacher)
    const user = await requireTeacher();

    return (
        <div className="flex bg-slate-50 min-h-screen font-sans text-slate-900">
            {/* Sidebar Fixe */}
            <StudentSidebar role={user.role} roles={user.roles} />

            <div className="flex-1 flex flex-col ml-64 min-h-screen">
                <main className="flex-1 p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
