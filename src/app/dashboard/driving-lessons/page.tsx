"use client";

import { useState, useEffect } from "react";
import {
    Calendar,
    Clock,
    User,
    MapPin,
    Car,
    Phone,
    Mail,
    AlertCircle,
    CheckCircle,
    XCircle,
    RefreshCw,
} from "lucide-react";
import Link from "next/link";
import {
    getAvailableSlots,
    bookLesson,
    cancelLesson,
    getMyLessonsAsStudent,
    requestInstructorChange,
    getMyDrivingBalance,
} from "./actions";
import { Modal } from "@/components/ui/Modal";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

type Instructor = {
    id: string;
    city: string;
    department: string;
    licenseTypes: string[];
    vehicleType: string | null;
    user: {
        firstName: string | null;
        lastName: string | null;
        email: string;
        phone: string | null;
    };
};

type Availability = {
    id: string;
    date: Date | null;
    startTime: string;
    endTime: string;
    isRecurring: boolean;
    recurrencePattern: string | null;
    recurrenceDays: number[];
};

type Lesson = {
    id: string;
    date: Date;
    startTime: string;
    endTime: string;
    duration: number;
    status: string;
    studentConfirmed: boolean;
    instructorConfirmed: boolean;
    city: string;
    meetingPoint: string | null;
    isDeducted: boolean;
    instructor: {
        user: {
            firstName: string | null;
            lastName: string | null;
        };
    };
};

export default function DrivingLessonsPage() {
    const [instructor, setInstructor] = useState<Instructor | null>(null);
    const [availabilities, setAvailabilities] = useState<Availability[]>([]);
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [loading, setLoading] = useState(true);
    const [showBookingForm, setShowBookingForm] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<Availability | null>(null);
    const [bookingDate, setBookingDate] = useState("");
    const [duration, setDuration] = useState<1 | 2>(1);
    const [meetingPoint, setMeetingPoint] = useState("");
    const [notes, setNotes] = useState("");
    const [balance, setBalance] = useState<{ minutes: number; hours: number } | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Modal state for instructor change
    const [showChangeModal, setShowChangeModal] = useState(false);
    const [changeReason, setChangeReason] = useState("");
    const [requestLoading, setRequestLoading] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        setLoading(true);

        // Charger l'instructeur et ses disponibilités
        const slotsResult = await getAvailableSlots();
        if (slotsResult.success && slotsResult.data) {
            setInstructor(slotsResult.data.instructor as any);
            setAvailabilities(slotsResult.data.availabilities as any);
        }

        // Charger les cours de l'élève
        const lessonsResult = await getMyLessonsAsStudent();
        if (lessonsResult.success && lessonsResult.data) {
            setLessons(lessonsResult.data as any);
        }

        // Charger le solde
        const balanceResult = await getMyDrivingBalance();
        if (balanceResult.success && balanceResult.data) {
            setBalance(balanceResult.data as any);
        }

        setLoading(false);
    }

    async function handleBooking(e: React.FormEvent) {
        e.preventDefault();
        if (!selectedSlot) return;

        setSubmitting(true);
        setError(null);

        const [hours, minutes] = selectedSlot.startTime.split(":").map(Number);
        const endHours = hours + duration;
        const endTime = `${endHours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;

        const result = await bookLesson({
            availabilityId: selectedSlot.id,
            date: bookingDate,
            startTime: selectedSlot.startTime,
            endTime,
            duration,
            meetingPoint: meetingPoint || undefined,
            notes: notes || undefined,
        });

        if (result.success) {
            setShowBookingForm(false);
            setSelectedSlot(null);
            setBookingDate("");
            setMeetingPoint("");
            setNotes("");
            loadData();
        } else {
            setError(result.error || "Erreur lors de la réservation");
        }

        setSubmitting(false);
    }

    async function handleCancel(lessonId: string) {
        if (!confirm("Êtes-vous sûr de vouloir annuler ce cours ?")) return;

        const reason = prompt("Raison de l'annulation (optionnel) :");
        const result = await cancelLesson(lessonId, reason || undefined);

        if (result.success) {
            loadData();
        } else {
            alert(result.error);
        }
    }

    async function handleSubmitChangeRequest(e: React.FormEvent) {
        e.preventDefault();
        if (!instructor || !changeReason.trim()) return;

        setRequestLoading(true);
        try {
            const result = await requestInstructorChange({
                currentInstructorId: instructor.id,
                courseType: "PERMIS_B",
                reason: "OTHER",
                details: changeReason,
            });

            if (result.success) {
                toast.success("Demande envoyée à l'administration");
                setShowChangeModal(false);
                setChangeReason("");
            } else {
                toast.error(result.error || "Une erreur est survenue");
            }
        } catch (e) {
            toast.error("Erreur de connexion");
        } finally {
            setRequestLoading(false);
        }
    }

    const upcomingLessons = lessons.filter(
        (l) => new Date(l.date) >= new Date() && l.status !== "CANCELLED"
    );
    const pastLessons = lessons.filter(
        (l) => new Date(l.date) < new Date() || l.status === "CANCELLED"
    );

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Mes Cours de Conduite</h1>
                <p className="text-slate-500 mt-1">Réservez vos heures avec votre instructeur</p>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <RefreshCw className="w-8 h-8 animate-spin text-gold-500 mx-auto mb-4" />
                    <p className="text-slate-500">Chargement...</p>
                </div>
            ) : !instructor ? (
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                        <div>
                            <p className="text-orange-700 mb-4">
                                Vous n'avez pas encore d'instructeur assigné. Si vous n'avez pas encore de forfait, vous pouvez en acheter un pour commencer.
                            </p>
                            <Link
                                href="/dashboard/paiement"
                                className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-700 transition"
                            >
                                Acheter des heures / Voir les forfaits
                            </Link>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    {/* Solde d'heures */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex items-center justify-between col-span-1 md:col-span-2">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                                    <Clock className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Votre solde de conduite</p>
                                    <div className="flex items-baseline gap-2">
                                        <h2 className="text-3xl font-black text-slate-900">{balance?.hours || 0}h</h2>
                                        {balance && balance.minutes % 60 !== 0 && (
                                            <span className="text-sm text-slate-500 font-medium">({balance.minutes % 60}min)</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <Link
                                href="/dashboard/paiement"
                                className="px-4 py-2 bg-gold-500 text-slate-900 rounded-lg font-bold hover:bg-gold-600 transition shadow-sm"
                            >
                                Acheter des heures
                            </Link>
                        </div>

                        <div className="bg-gold-50 border border-gold-100 rounded-xl p-6 shadow-sm flex flex-col justify-center">
                            <div className="flex items-center gap-2 text-gold-700 mb-1">
                                <AlertCircle className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase tracking-wider">Note</span>
                            </div>
                            <p className="text-sm text-gold-800 leading-relaxed font-medium">
                                Une heure de conduite correspond à 60 minutes créditées sur votre solde.
                            </p>
                        </div>
                    </div>

                    {/* Carte Instructeur */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8 shadow-sm">
                        <div className="flex items-start gap-4">
                            <div className="w-16 h-16 rounded-full bg-gold-100 flex items-center justify-center flex-shrink-0">
                                <User className="w-8 h-8 text-gold-600" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-xl font-bold text-slate-900 mb-1">
                                    {instructor.user.firstName} {instructor.user.lastName}
                                </h2>
                                <p className="text-slate-600 mb-3">Votre instructeur de conduite</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <MapPin className="w-4 h-4" />
                                        <span>
                                            {instructor.city} ({instructor.department})
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <Car className="w-4 h-4" />
                                        <span>
                                            Véhicule:{" "}
                                            {instructor.vehicleType === "MANUAL"
                                                ? "Manuelle"
                                                : instructor.vehicleType === "AUTOMATIC"
                                                    ? "Automatique"
                                                    : "Les deux"}
                                        </span>
                                    </div>
                                    {instructor.user.email && (
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <Mail className="w-4 h-4" />
                                            <span>{instructor.user.email}</span>
                                        </div>
                                    )}
                                    {instructor.user.phone && (
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <Phone className="w-4 h-4" />
                                            <span>{instructor.user.phone}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={() => setShowChangeModal(true)}
                                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition text-sm"
                            >
                                Demander un changement
                            </button>
                        </div>
                    </div>

                    {/* Modal pour le changement d'instructeur */}
                    <Modal
                        isOpen={showChangeModal}
                        onClose={() => setShowChangeModal(false)}
                        title="Demander un changement d'instructeur"
                        maxWidth="md"
                    >
                        <form onSubmit={handleSubmitChangeRequest} className="space-y-4">
                            <p className="text-sm text-slate-500">
                                Expliquez brièvement pourquoi vous souhaitez changer d'instructeur. Votre demande sera examinée par l'administration.
                            </p>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                    Raison du changement
                                </label>
                                <textarea
                                    value={changeReason}
                                    onChange={(e) => setChangeReason(e.target.value)}
                                    placeholder="Ex: Je souhaite un moniteur avec d'autres disponibilités..."
                                    className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-gold-100 focus:border-gold-500 transition-all min-h-[120px]"
                                    required
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                  type="submit"
                                  disabled={requestLoading || !changeReason.trim()}
                                  className="flex-1 px-6 py-3 bg-gold-500 text-slate-900 rounded-2xl font-black hover:bg-gold-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                  {requestLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                                  ENVOYER LA DEMANDE
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setShowChangeModal(false)}
                                  className="px-6 py-3 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition"
                                >
                                  ANNULER
                                </button>
                            </div>
                        </form>
                    </Modal>

                    {/* Créneaux disponibles - Vue Calendrier */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-slate-900">Prochains créneaux disponibles</h2>
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                                <Calendar className="w-3 h-3" />
                                14 PROCHAINS JOURS
                            </div>
                        </div>

                        {availabilities.length === 0 ? (
                            <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                                <Clock className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                                <p className="text-slate-500 font-medium">Aucun créneau disponible pour le moment</p>
                                <p className="text-slate-400 text-sm">Réessayez plus tard ou contactez votre moniteur.</p>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {Object.entries(
                                    availabilities.reduce((acc: any, slot: any) => {
                                        const dateKey = new Date(slot.date).toDateString();
                                        if (!acc[dateKey]) acc[dateKey] = [];
                                        acc[dateKey].push(slot);
                                        return acc;
                                    }, {})
                                ).map(([dateKey, daySlots]: [string, any]) => (
                                    <div key={dateKey} className="animate-in fade-in slide-in-from-left-2 duration-300">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="h-px flex-1 bg-slate-100"></div>
                                            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                {new Date(dateKey).toLocaleDateString("fr-FR", {
                                                    weekday: "long",
                                                    day: "numeric",
                                                    month: "long",
                                                })}
                                            </h3>
                                            <div className="h-px flex-1 bg-slate-100"></div>
                                        </div>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                            {daySlots.map((slot: any) => (
                                                <button
                                                    key={slot.id + slot.date}
                                                    onClick={() => {
                                                        setSelectedSlot(slot);
                                                        setShowBookingForm(true);
                                                        setBookingDate(new Date(slot.date).toISOString().split("T")[0]);
                                                    }}
                                                    className="group relative p-3 bg-white border border-slate-200 rounded-2xl hover:border-gold-500 hover:bg-gold-50 hover:shadow-md transition-all text-center"
                                                >
                                                    <div className="text-sm font-black text-slate-900 group-hover:text-gold-700">
                                                        {slot.startTime}
                                                    </div>
                                                    <div className="text-[10px] font-bold text-slate-400 group-hover:text-gold-500 uppercase mt-0.5">
                                                        {slot.endTime}
                                                    </div>
                                                    {slot.isRecurring && (
                                                        <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-blue-500 text-white rounded-full flex items-center justify-center border-2 border-white shadow-sm" title="Récurrent">
                                                            <RefreshCw className="w-2 h-2" />
                                                        </div>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Formulaire de réservation */}
                    {showBookingForm && selectedSlot && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                            <div className="bg-white rounded-xl max-w-md w-full p-6">
                                <h3 className="text-xl font-bold mb-4">Réserver un cours</h3>
                                {error && (
                                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                                        {error}
                                    </div>
                                )}
                                <form onSubmit={handleBooking} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Date
                                        </label>
                                        <input
                                            type="date"
                                            value={bookingDate}
                                            onChange={(e) => setBookingDate(e.target.value)}
                                            required
                                            min={new Date().toISOString().split("T")[0]}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Heure
                                        </label>
                                        <input
                                            type="text"
                                            value={`${selectedSlot.startTime} - ${selectedSlot.endTime}`}
                                            disabled
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Durée
                                        </label>
                                        <select
                                            value={duration}
                                            onChange={(e) => setDuration(Number(e.target.value) as 1 | 2)}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                                        >
                                            <option value={1}>1 heure</option>
                                            <option value={2}>2 heures</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Point de rendez-vous (optionnel)
                                        </label>
                                        <input
                                            type="text"
                                            value={meetingPoint}
                                            onChange={(e) => setMeetingPoint(e.target.value)}
                                            placeholder="Ex: Devant l'auto-école"
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Notes (optionnel)
                                        </label>
                                        <textarea
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            placeholder="Informations complémentaires..."
                                            rows={3}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                                        />
                                    </div>
                                    <div className="flex gap-3 pt-4">
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="flex-1 px-4 py-2 bg-gold-500 text-slate-900 rounded-lg font-semibold hover:bg-gold-600 transition disabled:opacity-50"
                                        >
                                            {submitting ? "Réservation..." : "Réserver"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowBookingForm(false);
                                                setSelectedSlot(null);
                                                setError(null);
                                            }}
                                            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition"
                                        >
                                            Annuler
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Cours à venir */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8 shadow-sm">
                        <h2 className="text-xl font-bold text-slate-900 mb-4">
                            Cours à venir ({upcomingLessons.length})
                        </h2>
                        {upcomingLessons.length === 0 ? (
                            <p className="text-slate-500 text-center py-8">Aucun cours réservé</p>
                        ) : (
                            <div className="space-y-4">
                                {upcomingLessons.map((lesson) => (
                                    <div
                                        key={lesson.id}
                                        className={`border rounded-lg p-4 ${lesson.status === "CONFIRMED"
                                            ? "border-green-200 bg-green-50"
                                            : "border-orange-200 bg-orange-50"
                                            }`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <Calendar className="w-5 h-5 text-slate-400" />
                                                    <span className="font-bold text-slate-900">
                                                        {new Date(lesson.date).toLocaleDateString("fr-FR", {
                                                            weekday: "long",
                                                            day: "numeric",
                                                            month: "long",
                                                        })}
                                                    </span>
                                                    <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded">
                                                        {lesson.startTime} - {lesson.endTime}
                                                    </span>
                                                </div>
                                                <div className="text-sm text-slate-600 mb-2">
                                                    <MapPin className="w-4 h-4 inline mr-1" />
                                                    {lesson.meetingPoint || lesson.city}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    {lesson.status === "CONFIRMED" ? (
                                                        <span className="flex items-center gap-1 text-green-700">
                                                            <CheckCircle className="w-4 h-4" />
                                                            Confirmé
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center gap-1 text-orange-700">
                                                            <Clock className="w-4 h-4" />
                                                            En attente de confirmation
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            {lesson.status !== "CONFIRMED" && (
                                                <button
                                                    onClick={() => handleCancel(lesson.id)}
                                                    className="px-3 py-1 bg-red-500 text-white rounded font-semibold hover:bg-red-600 transition text-sm"
                                                >
                                                    Annuler
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Historique */}
                    {pastLessons.length > 0 && (
                        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                            <h2 className="text-xl font-bold text-slate-900 mb-4">Historique</h2>
                            <div className="space-y-3">
                                {pastLessons.slice(0, 5).map((lesson) => (
                                    <div key={lesson.id} className="border border-slate-200 rounded-lg p-3">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-slate-900">
                                                {new Date(lesson.date).toLocaleDateString()} - {lesson.startTime}
                                            </span>
                                            <span
                                                className={`px-2 py-1 rounded text-xs font-bold ${lesson.status === "COMPLETED"
                                                    ? "bg-blue-100 text-blue-700"
                                                    : "bg-red-100 text-red-700"
                                                    }`}
                                            >
                                                {lesson.status === "COMPLETED" ? "Terminé" : "Annulé"}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
