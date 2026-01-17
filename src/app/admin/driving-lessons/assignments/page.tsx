import { requireAdmin } from "@/lib/auth";
import { getAllAssignments, getInstructors, searchStudents } from "../actions";
import { Users, UserPlus, Trash2, Mail, Car, ChevronRight } from "lucide-react";
import Link from "next/link";

export default async function AdminAssignmentsPage() {
    await requireAdmin();

    const [assignmentsRes, instructorsRes] = await Promise.all([
        getAllAssignments(),
        getInstructors()
    ]);

    const assignments = assignmentsRes.success && assignmentsRes.data ? assignmentsRes.data : [];
    const instructors = instructorsRes.success && instructorsRes.data ? instructorsRes.data : [];

    return (
        <div className="pb-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Attributions Instructeurs-Élèves</h1>
                    <p className="text-slate-500 mt-1">Gérez qui enseigne à qui pour la conduite</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Liste des attributions */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                            <h2 className="font-bold text-slate-900">Attributions Actives</h2>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {assignments.map((assignment: any) => (
                                <div key={assignment.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                                            <Users className="w-5 h-5 text-slate-500" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900">
                                                {assignment.student.firstName} {assignment.student.lastName}
                                            </div>
                                            <div className="text-sm text-slate-500 flex items-center gap-1">
                                                <ChevronRight className="w-3 h-3" />
                                                Attribué à {assignment.instructor.user.firstName} {assignment.instructor.user.lastName}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right hidden sm:block">
                                            <div className="text-xs font-bold text-slate-400 uppercase">Type</div>
                                            <div className="text-sm font-medium text-slate-700">{assignment.courseType}</div>
                                        </div>
                                        <button className="p-2 text-slate-400 hover:text-red-600 transition">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {assignments.length === 0 && (
                                <div className="p-12 text-center">
                                    <Users className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                                    <p className="text-slate-500">Aucune attribution active.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar pour nouvelle attribution Rapide (Statique pour l'instant) */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <UserPlus className="w-5 h-5 text-gold-500" />
                            <h2 className="font-bold text-slate-900">Nouvelle Attribution</h2>
                        </div>
                        <p className="text-sm text-slate-500 mb-6">
                            Pour attribuer un moniteur, utilisez le moteur de recherche global ou allez dans le profil de l'élève.
                        </p>
                        <Link
                            href="/admin/users"
                            className="block w-full bg-slate-900 text-white text-center py-2.5 rounded-lg font-bold hover:bg-slate-800 transition"
                        >
                            Chercher un élève
                        </Link>
                    </div>

                    <div className="bg-gold-50 p-6 rounded-xl border border-gold-100">
                        <h3 className="font-bold text-gold-900 mb-2">Note</h3>
                        <p className="text-sm text-gold-800 leading-relaxed">
                            L'attribution automatique se fait lors du premier achat de forfait conduite ou via une demande de changement approuvée.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
