"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, CheckCircle, XCircle, User, MapPin, RefreshCw, Search, CheckCircle2 } from "lucide-react";
import { getMyLessons, confirmLesson, rejectLesson } from "../availability/actions";
import { completeLesson } from "../../driving-lessons/actions";
import { LessonRecapModal } from "@/components/instructor/LessonRecapModal";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

import { useRouter, useSearchParams } from "next/navigation";
import { Pagination } from "@/components/admin/Pagination";

type Lesson = {
    id: string;
    date: Date;
    startTime: string;
    endTime: string;
    duration: number;
    status: string;
    studentConfirmed: boolean;
    instructorConfirmed: boolean;
    meetingPoint: string | null;
    city: string;
    studentNotes: string | null;
    student: {
        id: string;
        firstName: string | null;
        lastName: string | null;
        email: string;
        phone: string | null;
        nationalIdNumber?: string | null;
    };
};

export default function InstructorLessonsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<string>("ALL");
    const [searchQuery, setSearchQuery] = useState("");
    const [showRecapModal, setShowRecapModal] = useState(false);
    const [lessonToComplete, setLessonToComplete] = useState<any>(null);
    
    // Pagination state
    const currentPage = parseInt(searchParams.get("page") || "1");
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    const pageSize = 10;

    useEffect(() => {
        loadLessons();
    }, [filter, currentPage]);

    async function loadLessons() {
        setLoading(true);
        setError(null);
        try {
            const result = await getMyLessons(filter === "ALL" ? undefined : filter, currentPage, pageSize);
            if (result.success && result.data) {
                setLessons(result.data as any);
                setTotalPages(result.totalPages || 1);
                setTotalCount(result.total || 0);
            } else {
                setError(result.error || "Erreur lors de la récupération des cours");
            }
        } catch (e) {
            setError("Erreur de connexion au serveur");
        }
        setLoading(false);
    }

    async function handleConfirm(lessonId: string) {
        const result = await confirmLesson(lessonId);
        if (result.success) {
            loadLessons();
        } else {
            alert(result.error);
        }
    }

    async function handleReject(lessonId: string) {
        const reason = prompt("Raison du refus (optionnel) :");
        const result = await rejectLesson(lessonId, reason || undefined);
        if (result.success) {
            loadLessons();
        } else {
            alert(result.error);
        }
    }

    async function handleComplete(lessonId: string, data: any) {
        const result = await completeLesson(lessonId, data);
        if (result.success) {
            loadLessons();
        } else {
            alert(result.error);
        }
    }

    const filteredLessons = lessons.filter((l) => {
        if (searchQuery.trim() === "") return true;
        const query = searchQuery.toLowerCase();
        const fullName = `${l.student.firstName} ${l.student.lastName}`.toLowerCase();
        const email = l.student.email.toLowerCase();
        const neph = (l.student.nationalIdNumber || "").toLowerCase();
        return fullName.includes(query) || email.includes(query) || neph.includes(query);
    });

    const pendingLessonsCount = lessons.filter((l) => l.status === "PENDING").length;
    const confirmedLessonsCount = lessons.filter((l) => l.status === "CONFIRMED").length;
    const completedLessonsCount = lessons.filter((l) => l.status === "COMPLETED").length;

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Mes Cours</h1>
                <p className="text-slate-500 mt-1">Gérez vos réservations et confirmez les cours</p>
            </div>

            {/* Filtres */}
            <div className="flex gap-2 mb-6">
                {["ALL", "PENDING", "CONFIRMED", "COMPLETED"].map((status) => (
                    <button
                        key={status}
                        onClick={() => {
                            setFilter(status);
                            router.push("/dashboard/instructor/lessons?page=1");
                        }}
                        className={`px-4 py-2 rounded-lg font-medium transition ${filter === status
                            ? "bg-gold-500 text-slate-900"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                    >
                        {status === "ALL" && "Tous"}
                        {status === "PENDING" && `En attente`}
                        {status === "CONFIRMED" && `Confirmés`}
                        {status === "COMPLETED" && `Terminés`}
                    </button>
                ))}
            </div>

            {/* Range display */}
            {!loading && totalCount > 0 && (
                <div className="mb-4 text-sm text-slate-500 font-medium">
                    Affichage de {((currentPage - 1) * pageSize) + 1} à {Math.min(currentPage * pageSize, totalCount)} sur {totalCount} cours
                </div>
            )}

            {/* Barre de recherche */}
            <div className="relative mb-6">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Filtrer par élève (Nom, Mail, NEPH)..."
                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 sm:text-sm transition-all shadow-sm"
                />
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-center font-medium">
                    {error}
                </div>
            )}

            {/* Liste des cours */}
            {loading ? (
                <div className="text-center py-12">
                    <RefreshCw className="w-8 h-8 animate-spin text-gold-500 mx-auto mb-4" />
                    <p className="text-slate-500">Chargement...</p>
                </div>
            ) : filteredLessons.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                    <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Aucun cours</h3>
                    <p className="text-slate-500">
                        {filter === "PENDING"
                            ? "Aucune demande en attente"
                            : filter === "CONFIRMED"
                                ? "Aucun cours confirmé"
                                : filter === "COMPLETED"
                                    ? "Aucun cours terminé"
                                    : "Aucun cours réservé pour le moment"}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredLessons.map((lesson) => {
                        const lessonDate = new Date(lesson.date);
                        const isPast = lessonDate < new Date();

                        return (
                            <div
                                key={lesson.id}
                                className={`bg-white rounded-xl border p-6 ${lesson.status === "PENDING"
                                    ? "border-orange-200 bg-orange-50"
                                    : lesson.status === "CONFIRMED"
                                        ? "border-green-200 bg-green-50"
                                        : "border-slate-200"
                                    }`}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Calendar className="w-5 h-5 text-slate-400" />
                                            <span className="font-bold text-slate-900">
                                                {lessonDate.toLocaleDateString("fr-FR", {
                                                    weekday: "long",
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                })}
                                            </span>
                                            <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded">
                                                {lesson.startTime} - {lesson.endTime} ({lesson.duration}h)
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                                            <User className="w-4 h-4" />
                                            <span className="font-medium">
                                                {lesson.student.firstName} {lesson.student.lastName}
                                            </span>
                                            <span className="text-slate-400">•</span>
                                            <span>{lesson.student.email}</span>
                                            {lesson.student.nationalIdNumber && (
                                                <>
                                                    <span className="text-slate-400">•</span>
                                                    <span className="font-bold text-slate-800">NEPH: {lesson.student.nationalIdNumber}</span>
                                                </>
                                            )}
                                            {lesson.student.phone && (
                                                <>
                                                    <span className="text-slate-400">•</span>
                                                    <span>{lesson.student.phone}</span>
                                                </>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <MapPin className="w-4 h-4" />
                                            <span>
                                                {lesson.meetingPoint || lesson.city}
                                            </span>
                                        </div>
                                        {lesson.studentNotes && (
                                            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                                <p className="text-sm text-blue-900">
                                                    <strong>Note de l'élève :</strong> {lesson.studentNotes}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-bold ${lesson.status === "PENDING"
                                                ? "bg-orange-100 text-orange-700"
                                                : lesson.status === "CONFIRMED"
                                                    ? "bg-green-100 text-green-700"
                                                    : lesson.status === "COMPLETED"
                                                        ? "bg-blue-100 text-blue-700"
                                                        : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {lesson.status === "PENDING" && "En attente"}
                                            {lesson.status === "CONFIRMED" && "Confirmé"}
                                            {lesson.status === "COMPLETED" && "Terminé"}
                                            {lesson.status === "CANCELLED" && "Annulé"}
                                        </span>
                                    </div>
                                </div>

                                {/* Statut de confirmation */}
                                {lesson.status === "PENDING" && (
                                    <div className="mb-4 p-3 bg-slate-50 rounded-lg">
                                        <div className="flex items-center gap-4 text-sm">
                                            <div className="flex items-center gap-2">
                                                {lesson.studentConfirmed ? (
                                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                                ) : (
                                                    <Clock className="w-4 h-4 text-slate-400" />
                                                )}
                                                <span className={lesson.studentConfirmed ? "text-green-700" : "text-slate-600"}>
                                                    Élève {lesson.studentConfirmed ? "confirmé" : "en attente"}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {lesson.instructorConfirmed ? (
                                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                                ) : (
                                                    <Clock className="w-4 h-4 text-slate-400" />
                                                )}
                                                <span className={lesson.instructorConfirmed ? "text-green-700" : "text-slate-600"}>
                                                    Vous {lesson.instructorConfirmed ? "confirmé" : "en attente"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Actions */}
                                {lesson.status === "PENDING" && !lesson.instructorConfirmed && !isPast && (
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => handleConfirm(lesson.id)}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition"
                                        >
                                            <CheckCircle className="w-5 h-5" />
                                            Confirmer
                                        </button>
                                        <button
                                            onClick={() => handleReject(lesson.id)}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition"
                                        >
                                            <XCircle className="w-5 h-5" />
                                            Refuser
                                        </button>
                                    </div>
                                )}

                                {/* Completion button for confirmed lessons */}
                                {lesson.status === "CONFIRMED" && (
                                    <button
                                        onClick={() => {
                                            setLessonToComplete({
                                                id: lesson.id,
                                                studentName: `${lesson.student.firstName} ${lesson.student.lastName}`,
                                                date: format(new Date(lesson.date), "EEEE d MMMM", { locale: fr }),
                                                startTime: lesson.startTime,
                                                endTime: lesson.endTime,
                                                duration: lesson.duration
                                            });
                                            setShowRecapModal(true);
                                        }}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 mt-2"
                                    >
                                        <CheckCircle2 className="w-5 h-5" />
                                        Terminer le cours (Saisir récap)
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {!loading && totalPages > 1 && (
                <div className="mt-8">
                    <Pagination 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        baseUrl="/dashboard/instructor/lessons"
                        searchParams={{}} // Filter state is handled by the URL if needed, but here it's local state + URL page
                    />
                </div>
            )}

            {lessonToComplete && (
                <LessonRecapModal
                    isOpen={showRecapModal}
                    onClose={() => {
                        setShowRecapModal(false);
                        setLessonToComplete(null);
                    }}
                    lesson={lessonToComplete}
                    onSubmit={async (data) => {
                        await handleComplete(lessonToComplete.id, data);
                    }}
                />
            )}
        </div>
    );
}
