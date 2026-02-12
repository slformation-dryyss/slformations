import { requireAdmin } from "@/lib/auth";
import { getAllLessons, getInstructors } from "../actions";
import { Calendar, Clock, User, CheckCircle, XCircle, Search, Filter } from "lucide-react";
import { Pagination } from "@/components/admin/Pagination";

export default async function AdminAllLessonsPage({
    searchParams,
}: {
    searchParams: Promise<{ 
        page?: string;
        instructorId?: string;
        status?: string;
        from?: string;
        to?: string;
        q?: string;
    }>;
}) {
    await requireAdmin();
    const params = await searchParams;
    const currentPage = parseInt(params.page || '1') || 1;
    const pageSize = 10;

    const [lessonsResult, instructorsResult] = await Promise.all([
        getAllLessons(currentPage, pageSize, {
            instructorId: params.instructorId,
            status: params.status,
            from: params.from,
            to: params.to,
            query: params.q
        }),
        getInstructors()
    ]);

    const lessons = lessonsResult.success && lessonsResult.data ? lessonsResult.data : [];
    const instructors = instructorsResult.success && instructorsResult.data ? instructorsResult.data : [];
    const total = lessonsResult.success ? (lessonsResult as any).total : 0;
    const totalPages = lessonsResult.success ? (lessonsResult as any).totalPages : 0;

    const currentFilters = {
        instructorId: params.instructorId,
        status: params.status,
        from: params.from,
        to: params.to,
        q: params.q
    };

    return (
        <div className="pb-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Historique des Cours</h1>
                    <p className="text-slate-500 mt-1">Tous les cours de conduite passés et futurs</p>
                </div>
            </div>

            {/* Advanced Filters */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm mb-8">
                <form className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
                    <div className="lg:col-span-2 relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-gold-500 transition-colors" />
                        <input
                            type="text"
                            name="q"
                            defaultValue={params.q}
                            placeholder="Élève (Nom, Email...)"
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-transparent rounded-lg text-sm focus:bg-white focus:border-gold-500/30 focus:ring-2 focus:ring-gold-500/10 outline-none transition-all"
                        />
                    </div>

                    <select
                        name="instructorId"
                        defaultValue={params.instructorId}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-transparent rounded-lg text-sm focus:bg-white focus:border-gold-500/30 focus:ring-2 focus:ring-gold-500/10 outline-none transition-all cursor-pointer"
                    >
                        <option value="">Tous les moniteurs</option>
                        {instructors.map((ins: any) => (
                            <option key={ins.id} value={ins.id}>
                                {ins.user.firstName} {ins.user.lastName}
                            </option>
                        ))}
                    </select>

                    <select
                        name="status"
                        defaultValue={params.status}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-transparent rounded-lg text-sm focus:bg-white focus:border-gold-500/30 focus:ring-2 focus:ring-gold-500/10 outline-none transition-all cursor-pointer"
                    >
                        <option value="">Tous les statuts</option>
                        <option value="PENDING">En attente</option>
                        <option value="CONFIRMED">Confirmé</option>
                        <option value="COMPLETED">Terminé</option>
                        <option value="CANCELLED">Annulé</option>
                    </select>

                    <div className="lg:col-span-2 flex items-center gap-2">
                        <div className="flex-1 flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-transparent focus-within:bg-white focus-within:border-gold-500/30 focus-within:ring-2 focus-within:ring-gold-500/10 transition-all">
                            <input
                                type="date"
                                name="from"
                                defaultValue={params.from}
                                className="w-full bg-transparent border-none text-sm outline-none cursor-pointer"
                                title="Début"
                            />
                            <span className="text-slate-400 text-xs font-bold uppercase">au</span>
                            <input
                                type="date"
                                name="to"
                                defaultValue={params.to}
                                className="w-full bg-transparent border-none text-sm outline-none cursor-pointer"
                                title="Fin"
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-5 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-black uppercase tracking-widest hover:bg-gold-500 hover:text-slate-900 transition-all shadow-lg shadow-slate-900/10 active:scale-95 whitespace-nowrap"
                        >
                            Filtrer
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden text-sm sm:text-base">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/80 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 font-bold text-slate-700">
                                    Date & Heure ({total > 0 ? ((currentPage - 1) * pageSize) + 1 : 0} - {Math.min(currentPage * pageSize, total)} sur {total})
                                </th>
                                <th className="px-6 py-4 font-bold text-slate-700">Élève</th>
                                <th className="px-6 py-4 font-bold text-slate-700">Moniteur</th>
                                <th className="px-6 py-4 font-bold text-slate-700">Statut</th>
                                <th className="px-6 py-4 font-bold text-slate-700">Type</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {lessons.map((lesson: any) => (
                                <tr key={lesson.id} className="hover:bg-slate-50 transition group">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-900">
                                                {new Date(lesson.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                            </span>
                                            <span className="text-sm text-slate-500">
                                                {lesson.startTime} - {lesson.endTime}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-900">{lesson.student.firstName} {lesson.student.lastName}</div>
                                        <div className="text-xs text-slate-500">{lesson.student.email}</div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 font-medium">
                                        {lesson.instructor.user.firstName} {lesson.instructor.user.lastName}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${lesson.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                            lesson.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-700' :
                                                lesson.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {lesson.status === 'COMPLETED' ? <CheckCircle className="w-3.5 h-3.5" /> :
                                                lesson.status === 'CANCELLED' ? <XCircle className="w-3.5 h-3.5" /> :
                                                    <Clock className="w-3.5 h-3.5" />}
                                            {lesson.status === 'PENDING' ? 'En attente' :
                                             lesson.status === 'CONFIRMED' ? 'Confirmé' :
                                             lesson.status === 'COMPLETED' ? 'Terminé' : 'Annulé'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 font-medium whitespace-nowrap">
                                        {lesson.type}
                                    </td>
                                </tr>
                            ))}
                            {lessons.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        Aucun cours ne correspond à vos critères.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="border-t border-slate-200 bg-slate-50/50 p-4">
                        <Pagination 
                            currentPage={currentPage}
                            totalPages={totalPages}
                            baseUrl="/admin/driving-lessons/lessons"
                            searchParams={currentFilters}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
