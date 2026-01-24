import { requireUser, hasRole } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function TeacherStudentsPage() {
    const user = await requireUser();

    if (!hasRole(user, "TEACHER") && !hasRole(user, "ADMIN")) {
        redirect("/dashboard");
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-slate-900 mb-6">Stagiaires (Pro)</h1>
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500">
                La liste de vos stagiaires sera disponible prochainement.
            </div>
        </div>
    );
}
