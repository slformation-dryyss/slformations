"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, CheckCircle, XCircle, User, MapPin, RefreshCw } from "lucide-react";
import { getMyLessons, confirmLesson, rejectLesson } from "../availability/actions";

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
    };
};

export default function InstructorLessonsPage() {
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<string>("ALL");

    useEffect(() => {
        loadLessons();
    }, [filter]);

    async function loadLessons() {
        setLoading(true);
        setError(null);
        try {
            const result = await getMyLessons(filter === "ALL" ? undefined : filter);
            if (result.success && result.data) {
                setLessons(result.data as any);
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

    const pendingLessons = lessons.filter((l) => l.status === "PENDING");
    const confirmedLessons = lessons.filter((l) => l.status === "CONFIRMED");
    const completedLessons = lessons.filter((l) => l.status === "COMPLETED");

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
                        onClick={() => setFilter(status)}
                        className={`px-4 py-2 rounded-lg font-medium transition ${filter === status
                            ? "bg-gold-500 text-slate-900"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                    >
                        {status === "ALL" && "Tous"}
                        {status === "PENDING" && `En attente (${pendingLessons.length})`}
                        {status === "CONFIRMED" && `Confirmés (${confirmedLessons.length})`}
                        {status === "COMPLETED" && `Terminés (${completedLessons.length})`}
                    </button>
                ))}
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
            ) : lessons.length === 0 ? (
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
                    {lessons.map((lesson) => {
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
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
