import { requireAdmin } from "@/lib/auth";
import { getInstructors } from "../actions";
import { GraduationCap, Mail, Phone, MapPin, Car, Calendar } from "lucide-react";
import Link from "next/link";

export default async function AdminInstructorsPage() {
    await requireAdmin();
    const result = await getInstructors();
    const instructors = result.success && result.data ? result.data : [];

    return (
        <div className="pb-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Gestion des Instructeurs</h1>
                    <p className="text-slate-500 mt-1">Liste des profils moniteurs et leur charge de travail</p>
                </div>
                <Link
                    href="/admin/users?role=INSTRUCTOR"
                    className="bg-gold-500 text-slate-900 px-4 py-2 rounded-lg font-bold hover:bg-gold-600 transition shadow-sm flex items-center gap-2"
                >
                    Modifier les rôles
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {instructors.map((instructor: any) => (
                    <div key={instructor.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition">
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 bg-gold-100 rounded-full flex items-center justify-center">
                                    <GraduationCap className="w-6 h-6 text-gold-600" />
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-bold ${instructor.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {instructor.isActive ? 'Actif' : 'Inactif'}
                                </span>
                            </div>

                            <h3 className="text-lg font-bold text-slate-900 mb-1">
                                {instructor.user.firstName} {instructor.user.lastName}
                            </h3>

                            <div className="space-y-2 mt-4 text-sm text-slate-600">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-slate-400" />
                                    <span>{instructor.city} ({instructor.department})</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Car className="w-4 h-4 text-slate-400" />
                                    <span>{instructor.vehicleType === 'MANUAL' ? 'Manuelle' : instructor.vehicleType === 'AUTOMATIC' ? 'Automatique' : 'Tous types'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-slate-400" />
                                    <span className="truncate">{instructor.user.email}</span>
                                </div>
                                {instructor.user.phone && (
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-slate-400" />
                                        <span>{instructor.user.phone}</span>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
                                <div className="text-center">
                                    <div className="text-xl font-bold text-slate-900">{instructor._count.assignments}</div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wider">Élèves actifs</p>
                                </div>
                                <div className="text-center border-l border-slate-100">
                                    <div className="text-xl font-bold text-slate-900">{instructor.maxStudentsPerWeek}</div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wider">Capacité</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-slate-50 p-3 flex gap-2">
                            <Link
                                href={`/admin/driving-lessons/instructors/${instructor.id}`}
                                className="flex-1 bg-white border border-slate-200 text-slate-700 py-1.5 rounded text-sm font-medium hover:bg-slate-100 text-center transition"
                            >
                                Gérer Planning
                            </Link>
                        </div>
                    </div>
                ))}

                {instructors.length === 0 && (
                    <div className="col-span-full py-12 text-center bg-white border border-slate-200 rounded-xl">
                        <GraduationCap className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                        <p className="text-slate-500 font-medium">Aucun instructeur configuré.</p>
                        <p className="text-sm text-slate-400">Assurez-vous qu'un utilisateur a le rôle INSTRUCTOR et un profil créé.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
