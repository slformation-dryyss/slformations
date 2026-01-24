import { requireUser, hasRole } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function TeacherCoursesPage() {
    const user = await requireUser();

    if (!hasRole(user, "TEACHER") && !hasRole(user, "ADMIN")) {
        redirect("/dashboard");
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-slate-900 mb-6">Mes Cours (Pro)</h1>
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500">
                L'affichage de vos cours professionnels sera disponible prochainement.
            </div>
        </div>
    );
}
