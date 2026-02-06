import { requireAdmin } from "@/lib/auth";
import { getAllLessons } from "../actions";
import { Calendar, Clock, User, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Pagination } from "@/components/admin/Pagination";

export default async function AdminAllLessonsPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>;
}) {
    await requireAdmin();
    const { page: pageParam } = await searchParams;
    const currentPage = parseInt(pageParam || '1') || 1;
    const pageSize = 10;

    const result = await getAllLessons(currentPage, pageSize);
    const lessons = result.success && result.data ? result.data : [];
    const total = result.success ? (result as any).total : 0;
    const totalPages = result.success ? (result as any).totalPages : 0;

    return (
        <div className="pb-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Historique des Cours</h1>
                    <p className="text-slate-500 mt-1">Tous les cours de conduite passés et futurs</p>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden text-sm sm:text-base">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 font-bold text-slate-700">
                                    Date & Heure ({((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, total)} sur {total})
                                </th>
                                <th className="px-6 py-4 font-bold text-slate-700">Élève</th>
                                <th className="px-6 py-4 font-bold text-slate-700">Moniteur</th>
                                <th className="px-6 py-4 font-bold text-slate-700">Statut</th>
                                <th className="px-6 py-4 font-bold text-slate-700">Type</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {lessons.map((lesson: any) => (
                                <tr key={lesson.id} className="hover:bg-slate-50 transition">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-900">
                                                {new Date(lesson.date).toLocaleDateString()}
                                            </span>
                                            <span className="text-sm text-slate-500">
                                                {lesson.startTime} - {lesson.endTime}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-slate-700">
                                        {lesson.student.firstName} {lesson.student.lastName}
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
                                            {lesson.status}
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
                                        Aucun cours enregistré pour le moment.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="border-t border-slate-200 bg-slate-50/50">
                        <Pagination 
                            currentPage={currentPage}
                            totalPages={totalPages}
                            baseUrl="/admin/driving-lessons/lessons"
                            searchParams={{}}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
