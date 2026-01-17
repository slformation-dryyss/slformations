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
        <>
            {children}
        </>
    );
}
