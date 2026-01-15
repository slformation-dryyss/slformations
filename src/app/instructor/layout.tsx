import { StudentSidebar } from "@/components/dashboard/StudentSidebar";
import { auth0 } from "@/lib/auth0";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { requireTeacher } from "@/lib/auth";

export default async function InstructorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Protection de la route : Seul un INSTRUCTOR ou supérieur peut accéder
    const user = await requireTeacher();

    return (
        <div className="flex bg-slate-50 min-h-screen font-sans text-slate-900">
            {/* Sidebar Fixe (on réutilise le StudentSidebar qui gère les rôles) */}
            <StudentSidebar role={user.role} />

            <div className="flex-1 flex flex-col ml-64 min-h-screen">
                <main className="flex-1 p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
