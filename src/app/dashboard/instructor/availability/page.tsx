"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, Plus, Trash2, RefreshCw } from "lucide-react";
import {
    createAvailabilitySlot,
    getMyAvailabilities,
    deleteAvailabilitySlot,
    confirmLesson,
    rejectLesson,
} from "./actions";
import { WeeklyCalendar } from "@/components/dashboard/instructor/WeeklyCalendar";
import { List, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

type RecurrencePattern = "DAILY" | "WEEKLY" | "MONTHLY";

type Availability = {
    id: string;
    date: Date | string | null;
    startTime: string;
    endTime: string;
    isRecurring: boolean;
    recurrenceGroupId: string | null;
    isBooked: boolean;
    lessons: Array<{
        id: string;
        status: string;
        student: { firstName: string | null; lastName: string | null };
    }>;
};

const DAYS_OF_WEEK = [
    { value: 1, label: "Lun" },
    { value: 2, label: "Mar" },
    { value: 3, label: "Mer" },
    { value: 4, label: "Jeu" },
    { value: 5, label: "Ven" },
    { value: 6, label: "Sam" },
    { value: 7, label: "Dim" },
];

export default function AvailabilityPage() {
    const [availabilities, setAvailabilities] = useState<Availability[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [viewMode, setViewMode] = useState<"list" | "calendar">("calendar");

    // Form state
    const [isRecurring, setIsRecurring] = useState(false);
    const [date, setDate] = useState("");
    const [startTime, setStartTime] = useState("09:00");
    const [endTime, setEndTime] = useState("18:00");
    const [recurrencePattern, setRecurrencePattern] = useState<RecurrencePattern>("WEEKLY");
    const [recurrenceDays, setRecurrenceDays] = useState<number[]>([1, 2, 3, 4, 5]); // Lun-Ven par défaut
    const [recurrenceEndDate, setRecurrenceEndDate] = useState("");
    const [licenseTypes, setLicenseTypes] = useState<string[]>(["B"]);
    const [hasBreak, setHasBreak] = useState(false);
    const [breakStartTime, setBreakStartTime] = useState("12:00");
    const [breakEndTime, setBreakEndTime] = useState("13:00");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadAvailabilities();
    }, []);

    async function loadAvailabilities() {
        setLoading(true);
        setError(null);
        try {
            const result = await getMyAvailabilities();
            if (result.success && result.data) {
                setAvailabilities(result.data as any);
            } else {
                setError(result.error || "Une erreur est survenue lors du chargement");
            }
        } catch (e) {
            setError("Erreur de connexion au serveur");
        }
        setLoading(false);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        const result = await createAvailabilitySlot({
            date: isRecurring ? undefined : date,
            startTime,
            endTime,
            isRecurring,
            recurrencePattern: isRecurring ? recurrencePattern : undefined,
            recurrenceDays: isRecurring ? recurrenceDays : undefined,
            recurrenceEndDate: isRecurring ? recurrenceEndDate : undefined,
            licenseTypes,
            breakStartTime: hasBreak ? breakStartTime : undefined,
            breakEndTime: hasBreak ? breakEndTime : undefined,
        });

        if (result.success) {
            setShowForm(false);
            loadAvailabilities();
            // Reset form
            setDate("");
            setStartTime("09:00");
            setEndTime("18:00");
            setRecurrenceDays([1, 2, 3, 4, 5]);
            setLicenseTypes(["B"]);
        } else {
            setError(result.error || "Erreur lors de la création");
        }

        setSubmitting(false);
    }

    async function handleDelete(slot: Availability) {
        let deleteAllInGroup = false;

        if (slot.recurrenceGroupId) {
            const choice = confirm(
                "Ce créneau fait partie d'une série récurrente.\n\n" +
                "Voulez-vous supprimer toute la série (OK) ou juste ce créneau (Annuler) ?"
            );
            if (choice) {
                if (!confirm("Êtes-vous sûr de vouloir supprimer TOUTE la série ?")) return;
                deleteAllInGroup = true;
            } else {
                if (!confirm("Voulez-vous supprimer ce créneau unique ?")) return;
            }
        } else {
            if (!confirm("Êtes-vous sûr de vouloir supprimer ce créneau ?")) return;
        }

        const result = await deleteAvailabilitySlot(slot.id, deleteAllInGroup);
        if (result.success) {
            loadAvailabilities();
        } else {
            alert(result.error);
        }
    }

    function toggleDay(day: number) {
        if (recurrenceDays.includes(day)) {
            setRecurrenceDays(recurrenceDays.filter((d) => d !== day));
        } else {
            setRecurrenceDays([...recurrenceDays, day].sort());
        }
    }

    function toggleLicense(type: string) {
        if (licenseTypes.includes(type)) {
            if (licenseTypes.length > 1) {
                setLicenseTypes(licenseTypes.filter(t => t !== type));
            }
        } else {
            setLicenseTypes([...licenseTypes, type]);
        }
    }

    async function handleConfirmLesson(lessonId: string) {
        const result = await confirmLesson(lessonId);
        if (result.success) {
            loadAvailabilities();
        } else {
            alert(result.error);
        }
    }

    async function handleRejectLesson(lessonId: string, reason: string) {
        const result = await rejectLesson(lessonId, reason);
        if (result.success) {
            loadAvailabilities();
        } else {
            alert(result.error);
        }
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Mes Disponibilités</h1>
                    <p className="text-slate-500 mt-1">
                        Gérez vos créneaux disponibles pour les cours de conduite
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex bg-slate-100 p-1 rounded-lg">
                        <button
                            onClick={() => setViewMode("calendar")}
                            className={cn(
                                "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition",
                                viewMode === "calendar"
                                    ? "bg-white text-slate-900 shadow-sm"
                                    : "text-slate-500 hover:text-slate-700"
                            )}
                        >
                            <LayoutGrid className="w-4 h-4" />
                            Planning
                        </button>
                        <button
                            onClick={() => setViewMode("list")}
                            className={cn(
                                "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition",
                                viewMode === "list"
                                    ? "bg-white text-slate-900 shadow-sm"
                                    : "text-slate-500 hover:text-slate-700"
                            )}
                        >
                            <List className="w-4 h-4" />
                            Liste
                        </button>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="flex items-center gap-2 px-4 py-2 bg-gold-500 text-slate-900 rounded-lg font-semibold hover:bg-gold-600 transition"
                    >
                        <Plus className="w-5 h-5" />
                        Ajouter un créneau
                    </button>
                </div>
            </div>

            {error && !showForm && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-center font-medium">
                    {error}
                </div>
            )}

            {/* Form */}
            {showForm && (
                <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6 shadow-sm">
                    <h2 className="text-xl font-bold mb-4">Nouveau créneau</h2>
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Type de créneau */}
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    checked={!isRecurring}
                                    onChange={() => setIsRecurring(false)}
                                    className="w-4 h-4"
                                />
                                <span>Créneau ponctuel</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    checked={isRecurring}
                                    onChange={() => setIsRecurring(true)}
                                    className="w-4 h-4"
                                />
                                <span>Créneau récurrent</span>
                            </label>
                        </div>

                        {/* Date (si ponctuel) */}
                        {!isRecurring && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Date
                                </label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    required
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                                />
                            </div>
                        )}

                        {/* Heures */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Heure de début
                                </label>
                                <input
                                    type="time"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    required
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Heure de fin
                                </label>
                                <input
                                    type="time"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    required
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                                />
                            </div>
                        </div>

                        {/* Heure de pause */}
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                            <label className="flex items-center gap-2 cursor-pointer mb-3">
                                <input
                                    type="checkbox"
                                    checked={hasBreak}
                                    onChange={(e) => setHasBreak(e.target.checked)}
                                    className="w-4 h-4 rounded text-gold-500 focus:ring-gold-500"
                                />
                                <span className="text-sm font-bold text-slate-700">Inclure une pause (déjeuner, etc.)</span>
                            </label>
                            
                            {hasBreak && (
                                <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-1 duration-200">
                                    <div>
                                        <label className="block text-xs font-medium text-slate-500 mb-1">
                                            Début de pause
                                        </label>
                                        <input
                                            type="time"
                                            value={breakStartTime}
                                            onChange={(e) => setBreakStartTime(e.target.value)}
                                            required
                                            className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-500 mb-1">
                                            Fin de pause
                                        </label>
                                        <input
                                            type="time"
                                            value={breakEndTime}
                                            onChange={(e) => setBreakEndTime(e.target.value)}
                                            required
                                            className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-sm"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Types de formation couverts */}
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                            <label className="block text-sm font-bold text-slate-700 mb-3">
                                Formations couvertes par ce créneau
                            </label>
                            <div className="flex flex-wrap gap-3">
                                {[
                                    { id: "B", label: "Permis B" },
                                    { id: "VTC", label: "VTC" },
                                    { id: "MOTO", label: "Moto" },
                                    { id: "P_POINTS", label: "Récup. Points" }
                                ].map((type) => (
                                    <button
                                        key={type.id}
                                        type="button"
                                        onClick={() => toggleLicense(type.id)}
                                        className={cn(
                                            "px-4 py-2 rounded-full text-sm font-bold border transition-all",
                                            licenseTypes.includes(type.id)
                                                ? "bg-gold-500 border-gold-600 text-slate-900 shadow-sm"
                                                : "bg-white border-slate-200 text-slate-500 hover:border-gold-300"
                                        )}
                                    >
                                        {type.label}
                                    </button>
                                ))}
                            </div>
                            <p className="text-[10px] text-slate-400 mt-2 italic">
                                Seuls les élèves inscrits à ces formations verront ce créneau.
                            </p>
                        </div>

                        {/* Récurrence */}
                        {isRecurring && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Fréquence
                                    </label>
                                    <select
                                        value={recurrencePattern}
                                        onChange={(e) => setRecurrencePattern(e.target.value as RecurrencePattern)}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                                    >
                                        <option value="WEEKLY">Hebdomadaire</option>
                                        <option value="DAILY">Quotidien</option>
                                        <option value="MONTHLY">Mensuel</option>
                                    </select>
                                </div>

                                {recurrencePattern === "WEEKLY" && (
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Jours de la semaine
                                        </label>
                                        <div className="flex gap-2">
                                            {DAYS_OF_WEEK.map((day) => (
                                                <button
                                                    key={day.value}
                                                    type="button"
                                                    onClick={() => toggleDay(day.value)}
                                                    className={`px-3 py-2 rounded-lg font-medium transition ${recurrenceDays.includes(day.value)
                                                        ? "bg-gold-500 text-slate-900"
                                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                                        }`}
                                                >
                                                    {day.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Jusqu'au
                                    </label>
                                    <input
                                        type="date"
                                        value={recurrenceEndDate}
                                        onChange={(e) => setRecurrenceEndDate(e.target.value)}
                                        required
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                                    />
                                </div>
                            </>
                        )}

                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex-1 px-4 py-2 bg-gold-500 text-slate-900 rounded-lg font-semibold hover:bg-gold-600 transition disabled:opacity-50"
                            >
                                {submitting ? "Création..." : "Créer le créneau"}
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition"
                            >
                                Annuler
                            </button>
                        </div>
                    </form>
                </div >
            )
            }

            {/* Liste des créneaux */}
            {
                loading ? (
                    <div className="text-center py-12">
                        <RefreshCw className="w-8 h-8 animate-spin text-gold-500 mx-auto mb-4" />
                        <p className="text-slate-500">Chargement...</p>
                    </div>
                ) : availabilities.length === 0 ? (
                    <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                        <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Aucun créneau disponible</h3>
                        <p className="text-slate-500 mb-6">
                            Commencez par ajouter vos disponibilités pour que les élèves puissent réserver des cours
                        </p>
                    </div>
                ) : viewMode === "calendar" ? (
                    <WeeklyCalendar
                        availabilities={availabilities}
                        onDelete={handleDelete}
                        onConfirmLesson={handleConfirmLesson}
                        onRejectLesson={handleRejectLesson}
                    />
                ) : (
                    <div className="space-y-4">
                        {availabilities.map((slot) => (
                            <div
                                key={slot.id}
                                className={cn(
                                    "bg-white rounded-xl border p-4 transition-colors",
                                    slot.isBooked ? "border-green-200 bg-green-50" : "border-slate-200"
                                )}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Clock className="w-5 h-5 text-slate-400" />
                                            <span className="font-bold text-slate-900">
                                                {slot.startTime} - {slot.endTime}
                                            </span>
                                            {slot.isRecurring && (
                                                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded">
                                                    Récurrent
                                                </span>
                                            )}
                                            {slot.isBooked && (
                                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">
                                                    Réservé
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-slate-600">
                                            {slot.date ? new Date(slot.date).toLocaleDateString("fr-FR", {
                                                weekday: "long",
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            }) : "Date non définie"}
                                            {slot.isRecurring && " (Série récurrente)"}
                                        </p>
                                        {slot.lessons.length > 0 && (
                                            <div className="mt-2 text-sm text-slate-600">
                                                Cours réservé par:{" "}
                                                {slot.lessons.map((l) => `${l.student.firstName} ${l.student.lastName}`).join(", ")}
                                            </div>
                                        )}
                                    </div>
                                    {!slot.isBooked && (
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleDelete(slot)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )
            }
        </div >
    );
}
