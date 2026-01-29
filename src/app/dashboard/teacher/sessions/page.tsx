import { requireUser, hasRole } from "@/lib/auth";
import { redirect } from "next/navigation";
import TeacherSessionsClient from "@/components/teacher/TeacherSessionsClient";

export const dynamic = "force-dynamic";

export default async function TeacherSessionsPage() {
    const user = await requireUser();

    if (!hasRole(user, "TEACHER") && !hasRole(user, "ADMIN")) {
        redirect("/dashboard");
    }

    return (
        <div className="p-6">
            <TeacherSessionsClient />
        </div>
    );
}
