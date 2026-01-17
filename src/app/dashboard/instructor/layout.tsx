import { StudentSidebar } from "@/components/dashboard/StudentSidebar";
import { requireInstructor } from "@/lib/auth";

export default async function InstructorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Protection de la route : Seul un INSTRUCTOR ou supérieur peut accéder
    // (ou ADMIN/OWNER via hiérarchie gérée par requireInstructor)
    const user = await requireInstructor();

    return (
        <>
            {children}
        </>
    );
}
