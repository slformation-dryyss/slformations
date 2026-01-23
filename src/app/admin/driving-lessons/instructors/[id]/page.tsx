import { requireAdmin } from "@/lib/auth";
import { getInstructorDetails } from "../../actions";
import { notFound } from "next/navigation";
import {
    Users,
    Calendar,
    Mail,
    Phone,
    MapPin,
    Car,
    GraduationCap,
    ChevronLeft,
    Clock,
    FileText
} from "lucide-react";
import Link from "next/link";

export default async function InstructorDetailPage({ params }: { params: { id: string } }) {
    await requireAdmin();
    const result = await getInstructorDetails(params.id);

    if (!result.success || !result.data) {
        return notFound();
    }

    const instructor = result.data;

    return (
        <div className="pb-8">
            <div className="mb-6">
                <Link
                    href="/admin/driving-lessons/instructors"
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition mb-4"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Retour à la liste
                </Link>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gold-500 rounded-full flex items-center justify-center text-slate-900">
                            <GraduationCap className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">
                                {instructor.user.firstName} {instructor.user.lastName}
                            </h1>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`px-2 py-0.5 rounded text-xs font-bold ${instructor.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {instructor.isActive ? 'Profil Actif' : 'Profil Inactif'}
                                </span>
                                <span className="text-slate-400 text-sm italic">ID: {instructor.id}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Informations de contact */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Users className="w-5 h-5 text-gold-500" />
                            Coordonnées
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <Mail className="w-4 h-4 text-slate-400 mt-1" />
                                <div>
                                    <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Email</p>
                                    <p className="text-slate-900 font-medium">{instructor.user.email}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Phone className="w-4 h-4 text-slate-400 mt-1" />
                                <div>
                                    <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Téléphone</p>
                                    <p className="text-slate-900 font-medium">{instructor.user.phone || "Non renseigné"}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <MapPin className="w-4 h-4 text-slate-400 mt-1" />
                                <div>
                                    <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Localisation</p>
                                    <p className="text-slate-900 font-medium">{instructor.city} ({instructor.department})</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Car className="w-4 h-4 text-slate-400 mt-1" />
                                <div>
                                    <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Transmission</p>
                                    <p className="text-slate-900 font-medium">
                                        {instructor.vehicleType === 'MANUAL' ? 'Manuelle' : instructor.vehicleType === 'AUTOMATIC' ? 'Automatique' : 'Tous types'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-navy-950 text-white rounded-xl shadow-lg p-6 relative overflow-hidden">
                        <div className="absolute -right-8 -bottom-8 opacity-10">
                            <Clock className="w-32 h-32" />
                        </div>
                        <h2 className="text-lg font-bold mb-4 relative z-10 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-gold-500" />
                            Capacité hebdomadaire
                        </h2>
                        <div className="relative z-10">
                            <div className="text-4xl font-black text-gold-500 mb-1">{instructor.maxStudentsPerWeek}</div>
                            <p className="text-slate-400 text-sm">Élèves maximum par semaine</p>
                        </div>
                    </div>
                </div>

                {/* Élèves attribués et Statistiques */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                        <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <Users className="w-5 h-5 text-gold-500" />
                            Élèves Attribués ({instructor.assignments.length})
                        </h2>

                        {instructor.assignments.length === 0 ? (
                            <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-xl">
                                <Users className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                                <p className="text-slate-500 underline decoration-gold-500">Aucun élève attribué actuellement</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {instructor.assignments.map((assignment: any) => (
                                    <div key={assignment.id} className="p-4 border border-slate-100 rounded-lg hover:border-gold-500/50 transition bg-slate-50/50">
                                        <div className="font-bold text-slate-900">
                                            {assignment.student.firstName} {assignment.student.lastName}
                                        </div>
                                        <div className="text-xs text-slate-500 mb-2 truncate">{assignment.student.email}</div>
                                        <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-200/50">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gold-600">{assignment.courseType}</span>
                                            <Link
                                                href={`/admin/users/${assignment.student.id}`}
                                                className="text-xs font-bold text-slate-900 hover:text-gold-600 transition"
                                            >
                                                Voir profil
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 overflow-hidden relative">
                            <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-gold-500" />
                                Cours prodigués
                            </h2>
                            <div className="text-3xl font-black text-slate-900">{instructor._count.drivingLessons}</div>
                            <p className="text-slate-500 text-xs mt-1">Total historique des heures</p>
                        </div>

                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 overflow-hidden relative">
                            <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-gold-500" />
                                Permis gérés
                            </h2>
                            <div className="flex gap-2 mt-2">
                                {instructor.licenseTypes.map((type: string) => (
                                    <span key={type} className="px-2 py-1 bg-slate-900 text-white text-[10px] font-bold rounded">
                                        {type}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
