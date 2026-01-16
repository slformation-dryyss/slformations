import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
    Users,
    Calendar,
    CheckCircle,
    XCircle,
    AlertTriangle,
    RefreshCw,
    GraduationCap,
    Car,
} from "lucide-react";
import Link from "next/link";
import { getDrivingLessonsStats, getPendingChangeRequests } from "./actions";

export default async function AdminDrivingLessonsPage() {
    await requireAdmin();

    const statsResult = await getDrivingLessonsStats();
    const requestsResult = await getPendingChangeRequests();

    const stats = statsResult.success ? statsResult.data : null;
    const changeRequests = requestsResult.success ? requestsResult.data : [];

    return (
        <div className="pb-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Gestion des Cours de Conduite</h1>
                    <p className="text-slate-500 mt-1">
                        Attributions, demandes de changement et statistiques
                    </p>
                </div>
            </div>

            {/* Statistiques */}
            {stats && (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                    <div className="bg-white overflow-hidden shadow rounded-lg border border-slate-200">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <Calendar className="h-6 w-6 text-blue-600" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-slate-500 truncate">
                                            Total Cours
                                        </dt>
                                        <dd className="text-2xl font-bold text-slate-900">{stats.totalLessons}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg border border-slate-200">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <AlertTriangle className="h-6 w-6 text-orange-600" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-slate-500 truncate">
                                            En Attente
                                        </dt>
                                        <dd className="text-2xl font-bold text-slate-900">{stats.pendingLessons}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg border border-slate-200">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <Users className="h-6 w-6 text-green-600" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-slate-500 truncate">
                                            Instructeurs Actifs
                                        </dt>
                                        <dd className="text-2xl font-bold text-slate-900">{stats.activeInstructors}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg border border-slate-200">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <RefreshCw className="h-6 w-6 text-purple-600" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-slate-500 truncate">
                                            Demandes Changement
                                        </dt>
                                        <dd className="text-2xl font-bold text-slate-900">
                                            {stats.pendingChangeRequests}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Demandes de changement en attente */}
            <div className="bg-white shadow rounded-lg border border-slate-200 mb-8">
                <div className="px-6 py-4 border-b border-slate-200">
                    <h2 className="text-lg font-bold text-slate-900">
                        Demandes de Changement d'Instructeur ({changeRequests?.length || 0})
                    </h2>
                </div>
                <div className="p-6">
                    {!changeRequests || changeRequests.length === 0 ? (
                        <p className="text-slate-500 text-center py-8">
                            Aucune demande de changement en attente
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {changeRequests.map((request: any) => (
                                <div
                                    key={request.id}
                                    className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="font-bold text-slate-900">
                                                    {request.student.firstName} {request.student.lastName}
                                                </span>
                                                <span className="text-slate-400">→</span>
                                                <span className="text-sm text-slate-600">
                                                    De: {request.currentInstructor.user.firstName}{" "}
                                                    {request.currentInstructor.user.lastName}
                                                </span>
                                                {request.requestedInstructor && (
                                                    <>
                                                        <span className="text-slate-400">→</span>
                                                        <span className="text-sm text-slate-600">
                                                            Vers: {request.requestedInstructor.user.firstName}{" "}
                                                            {request.requestedInstructor.user.lastName}
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                            <div className="text-sm text-slate-600 mb-2">
                                                <strong>Raison:</strong> {request.reason}
                                            </div>
                                            {request.details && (
                                                <div className="text-sm text-slate-600 mb-2">
                                                    <strong>Détails:</strong> {request.details}
                                                </div>
                                            )}
                                            {request.preferredGender && (
                                                <div className="text-sm text-slate-600">
                                                    <strong>Préférence:</strong> Instructeur{" "}
                                                    {request.preferredGender === "MALE"
                                                        ? "homme"
                                                        : request.preferredGender === "FEMALE"
                                                            ? "femme"
                                                            : "sans préférence"}
                                                </div>
                                            )}
                                            <div className="text-xs text-slate-400 mt-2">
                                                Demandé le {new Date(request.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Link
                                                href={`/admin/driving-lessons/change-requests/${request.id}`}
                                                className="px-3 py-1 bg-gold-500 text-slate-900 rounded font-semibold hover:bg-gold-600 transition text-sm"
                                            >
                                                Traiter
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Actions rapides */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Link
                    href="/admin/driving-lessons/assignments"
                    className="bg-white p-6 rounded-lg border border-slate-200 hover:border-gold-500 transition shadow-sm"
                >
                    <Users className="w-8 h-8 text-gold-500 mb-3" />
                    <h3 className="font-bold text-slate-900 mb-2">Attributions</h3>
                    <p className="text-sm text-slate-600">
                        Gérer les attributions instructeur-élève
                    </p>
                </Link>

                <Link
                    href="/admin/driving-lessons/lessons"
                    className="bg-white p-6 rounded-lg border border-slate-200 hover:border-gold-500 transition shadow-sm"
                >
                    <Calendar className="w-8 h-8 text-gold-500 mb-3" />
                    <h3 className="font-bold text-slate-900 mb-2">Tous les Cours</h3>
                    <p className="text-sm text-slate-600">
                        Voir l'historique complet des cours
                    </p>
                </Link>

                <Link
                    href="/admin/driving-lessons/instructors"
                    className="bg-white p-6 rounded-lg border border-slate-200 hover:border-gold-500 transition shadow-sm"
                >
                    <GraduationCap className="w-8 h-8 text-gold-500 mb-3" />
                    <h3 className="font-bold text-slate-900 mb-2">Instructeurs</h3>
                    <p className="text-sm text-slate-600">
                        Gérer les profils instructeurs
                    </p>
                </Link>

                <Link
                    href="/admin/driving-lessons/vehicles"
                    className="bg-white p-6 rounded-lg border border-slate-200 hover:border-gold-500 transition shadow-sm"
                >
                    <Car className="w-8 h-8 text-gold-500 mb-3" />
                    <h3 className="font-bold text-slate-900 mb-2">Véhicules</h3>
                    <p className="text-sm text-slate-600">
                        Gérer la flotte et la maintenance
                    </p>
                </Link>
            </div>
        </div>
    );
}
