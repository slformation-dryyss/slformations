"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
    format,
    startOfWeek,
    addDays,
    startOfDay,
    isSameDay,
    addWeeks,
    subWeeks,
    parseISO,
    formatISO
} from "date-fns";
import { fr } from "date-fns/locale";
import {
    ChevronLeft,
    ChevronRight,
    Clock,
    Trash2,
    Calendar as CalendarIcon,
    User,
    CheckCircle2,
    XCircle,
    Phone,
    Mail,
    AlertCircle,
    X,
    ExternalLink,
    Filter,
    BarChart3,
    Minimize2,
    Maximize2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { LessonRecapModal } from "@/components/instructor/LessonRecapModal";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

type Availability = {
    id: string;
    date: Date | string | null;
    startTime: string;
    endTime: string;
    isRecurring: boolean;
    recurrenceGroupId: string | null;
    isBooked: boolean;
    licenseTypes?: string[];
    lessons: Array<{
        id: string;
        status: string;
        student: {
            firstName: string | null;
            lastName: string | null;
            email?: string | null;
            nationalIdNumber?: string | null;
        };
    }>;
};

interface WeeklyCalendarProps {
    availabilities: Availability[];
    onDelete: (slot: Availability) => void;
    onConfirmLesson?: (lessonId: string) => Promise<any>;
    onRejectLesson?: (lessonId: string, reason: string) => Promise<any>;
    onCompleteLesson?: (lessonId: string, data: any) => Promise<any>;
}

const COMPACT_HOURS = Array.from({ length: 13 }, (_, i) => i + 8); // 8h to 20h
const EXTENDED_HOURS = Array.from({ length: 17 }, (_, i) => i + 6); // 6h to 22h

const LICENSE_TYPES = [
    { id: "B", label: "Permis B", color: "bg-blue-100 text-blue-700" },
    { id: "VTC", label: "VTC", color: "bg-purple-100 text-purple-700" },
    { id: "MOTO", label: "Moto", color: "bg-orange-100 text-orange-700" },
    { id: "P_POINTS", label: "Récup. Points", color: "bg-green-100 text-green-700" }
];

export function WeeklyCalendar({
    availabilities,
    onDelete,
    onConfirmLesson,
    onRejectLesson,
    onCompleteLesson
}: WeeklyCalendarProps) {
    const router = useRouter();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedSlot, setSelectedSlot] = useState<Availability | null>(null);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const [showRejectInput, setShowRejectInput] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
    const [isCompactView, setIsCompactView] = useState(true);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [studentSearch, setStudentSearch] = useState("");
    const [showRecapModal, setShowRecapModal] = useState(false);
    const [lessonToComplete, setLessonToComplete] = useState<any>(null);

    const weekDays = useMemo(() => {
        const start = startOfWeek(currentDate, { weekStartsOn: 1 }); // Start on Monday
        return Array.from({ length: 7 }, (_, i) => addDays(start, i));
    }, [currentDate]);

    const HOURS = isCompactView ? COMPACT_HOURS : EXTENDED_HOURS;
    const startHour = isCompactView ? 8 : 6;

    const nextWeek = () => setCurrentDate(addWeeks(currentDate, 1));
    const prevWeek = () => setCurrentDate(subWeeks(currentDate, 1));
    const today = () => setCurrentDate(new Date());

    const toggleFilter = (licenseId: string) => {
        if (selectedFilters.includes(licenseId)) {
            setSelectedFilters(selectedFilters.filter(id => id !== licenseId));
        } else {
            setSelectedFilters([...selectedFilters, licenseId]);
        }
    };

    const handleDateJump = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedDate = new Date(e.target.value);
        if (!isNaN(selectedDate.getTime())) {
            setCurrentDate(selectedDate);
            setShowDatePicker(false);
        }
    };

    // Function to calculate slot style based on time
    const getSlotStyle = (startTime: string, endTime: string) => {
        const [startH, startM] = startTime.split(":").map(Number);
        const [endH, endM] = endTime.split(":").map(Number);

        const startPos = (startH - startHour) * 60 + startM;
        const duration = (endH * 60 + endM) - (startH * 60 + startM);

        return {
            top: `${(startPos / 60) * 4}rem`, // 1h = 4rem (h-16)
            height: `${(duration / 60) * 4}rem`,
            minHeight: "2rem"
        };
    };

    const getAvailabilitiesForDay = (day: Date) => {
        return availabilities.filter(a => {
            if (!a.date) return false;
            const slotDate = typeof a.date === 'string' ? parseISO(a.date) : a.date;
            const matchesDate = isSameDay(startOfDay(slotDate), startOfDay(day));

            // Apply license type filter
            let passesFilters = matchesDate;

            if (selectedFilters.length > 0 && a.licenseTypes) {
                const hasMatchingLicense = a.licenseTypes.some(lt => selectedFilters.includes(lt));
                passesFilters = passesFilters && hasMatchingLicense;
            }

            // Apply student search filter
            if (studentSearch.trim() !== "") {
                const query = studentSearch.toLowerCase();
                const lesson = a.lessons[0];
                if (!lesson) return false; // Hide non-booked slots if searching for a student

                const fullName = `${lesson.student.firstName} ${lesson.student.lastName}`.toLowerCase();
                const email = (lesson.student.email || "").toLowerCase();
                const neph = (lesson.student.nationalIdNumber || "").toLowerCase();

                const matchesSearch = fullName.includes(query) || email.includes(query) || neph.includes(query);
                passesFilters = passesFilters && matchesSearch;
            }

            return passesFilters;
        });
    };

    // Calculate weekly statistics
    const weeklyStats = useMemo(() => {
        const weekAvailabilities = weekDays.flatMap(day => getAvailabilitiesForDay(day));

        const totalHours = weekAvailabilities.reduce((acc, slot) => {
            const [startH, startM] = slot.startTime.split(":").map(Number);
            const [endH, endM] = slot.endTime.split(":").map(Number);
            const duration = (endH * 60 + endM - startH * 60 - startM) / 60;
            return acc + duration;
        }, 0);

        const bookedHours = weekAvailabilities
            .filter(slot => slot.isBooked)
            .reduce((acc, slot) => {
                const [startH, startM] = slot.startTime.split(":").map(Number);
                const [endH, endM] = slot.endTime.split(":").map(Number);
                const duration = (endH * 60 + endM - startH * 60 - startM) / 60;
                return acc + duration;
            }, 0);

        const confirmedHours = weekAvailabilities
            .filter(slot => slot.lessons[0]?.status === "CONFIRMED")
            .reduce((acc, slot) => {
                const [startH, startM] = slot.startTime.split(":").map(Number);
                const [endH, endM] = slot.endTime.split(":").map(Number);
                const duration = (endH * 60 + endM - startH * 60 - startM) / 60;
                return acc + duration;
            }, 0);

        const pendingHours = weekAvailabilities
            .filter(slot => slot.lessons[0]?.status === "PENDING")
            .reduce((acc, slot) => {
                const [startH, startM] = slot.startTime.split(":").map(Number);
                const [endH, endM] = slot.endTime.split(":").map(Number);
                const duration = (endH * 60 + endM - startH * 60 - startM) / 60;
                return acc + duration;
            }, 0);

        const availableHours = totalHours - bookedHours;
        const fillRate = totalHours > 0 ? (bookedHours / totalHours) * 100 : 0;

        return {
            totalHours: Math.round(totalHours * 10) / 10,
            bookedHours: Math.round(bookedHours * 10) / 10,
            confirmedHours: Math.round(confirmedHours * 10) / 10,
            pendingHours: Math.round(pendingHours * 10) / 10,
            availableHours: Math.round(availableHours * 10) / 10,
            fillRate: Math.round(fillRate)
        };
    }, [weekDays, availabilities, selectedFilters]);

    const handleConfirm = async (lessonId: string) => {
        if (!onConfirmLesson) return;
        setIsActionLoading(true);
        try {
            await onConfirmLesson(lessonId);
            setSelectedSlot(null);
        } catch (error) {
            console.error(error);
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleReject = async (lessonId: string) => {
        if (!onRejectLesson) return;
        if (!rejectReason) {
            setShowRejectInput(true);
            return;
        }
        setIsActionLoading(true);
        try {
            await onRejectLesson(lessonId, rejectReason);
            setSelectedSlot(null);
            setShowRejectInput(false);
            setRejectReason("");
        } catch (error) {
            console.error(error);
        } finally {
            setIsActionLoading(false);
        }
    };

    return (
        <>
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                {/* Calendar Header */}
                <div className="flex flex-col items-start p-4 border-b border-slate-100 bg-slate-50/50 gap-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4">
                        <div className="flex items-center gap-4 flex-wrap">
                            <h2 className="text-lg font-bold text-slate-900 capitalize italic">
                                {format(weekDays[0], "MMMM yyyy", { locale: fr })}
                            </h2>
                            <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
                                <button
                                    onClick={prevWeek}
                                    className="p-1.5 hover:bg-slate-100 rounded-md transition text-slate-600"
                                    title="Semaine précédente"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={today}
                                    className="px-3 py-1.5 text-xs font-semibold hover:bg-slate-100 rounded-md transition text-slate-700 border-x border-slate-100"
                                >
                                    Aujourd'hui
                                </button>
                                <button
                                    onClick={nextWeek}
                                    className="p-1.5 hover:bg-slate-100 rounded-md transition text-slate-600"
                                    title="Semaine suivante"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="relative">
                                <button
                                    onClick={() => setShowDatePicker(!showDatePicker)}
                                    className="flex items-center gap-2 text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition shadow-sm"
                                >
                                    <CalendarIcon className="w-4 h-4 text-gold-500" />
                                    <span className="font-semibold text-slate-700">Aller à...</span>
                                </button>
                                {showDatePicker && (
                                    <div className="absolute top-full left-0 mt-2 z-50 bg-white p-3 rounded-lg shadow-xl border border-slate-200">
                                        <input
                                            type="date"
                                            onChange={handleDateJump}
                                            className="px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                                        />
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => setIsCompactView(!isCompactView)}
                                className="flex items-center gap-2 text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition shadow-sm"
                                title={isCompactView ? "Vue étendue (6h-22h)" : "Vue compacte (8h-20h)"}
                            >
                                {isCompactView ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                                <span className="font-semibold text-slate-700">{isCompactView ? "Étendre" : "Compacter"}</span>
                            </button>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-slate-500 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
                            <CalendarIcon className="w-4 h-4 text-gold-500" />
                            <span className="font-medium">Semaine du {format(weekDays[0], "dd", { locale: fr })} au {format(weekDays[6], "dd MMMM", { locale: fr })}</span>
                        </div>
                    </div>

                    {/* Filters & Search */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4">
                        <div className="flex items-center gap-3 flex-wrap flex-1">
                            <div className="flex items-center gap-2">
                                <Filter className="w-4 h-4 text-slate-400" />
                                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Filtrer par formation :</span>
                            </div>
                            {LICENSE_TYPES.map(type => (
                                <button
                                    key={type.id}
                                    onClick={() => toggleFilter(type.id)}
                                    className={cn(
                                        "px-3 py-1.5 rounded-full text-xs font-bold transition-all border-2",
                                        selectedFilters.includes(type.id)
                                            ? `${type.color} border-current shadow-sm`
                                            : "bg-white text-slate-400 border-slate-200 hover:border-slate-300"
                                    )}
                                >
                                    {type.label}
                                </button>
                            ))}
                            {(selectedFilters.length > 0 || studentSearch) && (
                                <button
                                    onClick={() => {
                                        setSelectedFilters([]);
                                        setStudentSearch("");
                                    }}
                                    className="text-xs text-slate-500 hover:text-slate-700 underline font-medium"
                                >
                                    Réinitialiser
                                </button>
                            )}
                        </div>

                        <div className="w-full sm:w-auto min-w-[300px] relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-4 w-4 text-slate-400" />
                            </div>
                            <input
                                type="text"
                                value={studentSearch}
                                onChange={(e) => setStudentSearch(e.target.value)}
                                placeholder="Rechercher un élève (Nom, Mail, NEPH)..."
                                className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-all bg-white shadow-sm"
                            />
                        </div>
                    </div>

                    {/* Weekly Statistics */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 w-full">
                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                                <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
                                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Total</span>
                            </div>
                            <div className="text-xl font-black text-blue-900">{weeklyStats.totalHours}h</div>
                        </div>
                        <div className="bg-sky-50 border border-sky-100 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                                <Clock className="w-3.5 h-3.5 text-sky-600" />
                                <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider">Disponible</span>
                            </div>
                            <div className="text-xl font-black text-sky-900">{weeklyStats.availableHours}h</div>
                        </div>
                        <div className="bg-orange-50 border border-orange-100 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                                <AlertCircle className="w-3.5 h-3.5 text-orange-600" />
                                <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">En attente</span>
                            </div>
                            <div className="text-xl font-black text-orange-900">{weeklyStats.pendingHours}h</div>
                        </div>
                        <div className="bg-green-50 border border-green-100 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                                <span className="text-[10px] font-bold text-green-600 uppercase tracking-wider">Confirmé</span>
                            </div>
                            <div className="text-xl font-black text-green-900">{weeklyStats.confirmedHours}h</div>
                        </div>
                        <div className="bg-slate-50 border border-slate-100 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                                <Clock className="w-3.5 h-3.5 text-slate-600" />
                                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Réservé</span>
                            </div>
                            <div className="text-xl font-black text-slate-900">{weeklyStats.bookedHours}h</div>
                        </div>
                        <div className="bg-gold-50 border border-gold-200 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                                <BarChart3 className="w-3.5 h-3.5 text-gold-600" />
                                <span className="text-[10px] font-bold text-gold-600 uppercase tracking-wider">Taux</span>
                            </div>
                            <div className="text-xl font-black text-gold-900">{weeklyStats.fillRate}%</div>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <div className="min-w-[800px]">
                        {/* Days Header */}
                        <div className="grid grid-cols-[80px_repeat(7,1fr)] border-b border-slate-100 bg-slate-50/30">
                            <div className="p-4"></div>
                            {weekDays.map((day, i) => (
                                <div
                                    key={i}
                                    className={cn(
                                        "p-4 text-center border-l border-slate-100",
                                        isSameDay(day, new Date()) && "bg-gold-50/50"
                                    )}
                                >
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                                        {format(day, "eee", { locale: fr })}
                                    </div>
                                    <div
                                        onClick={() => router.push(`/dashboard/instructor/planning?date=${formatISO(day, { representation: 'date' })}`)}
                                        className={cn(
                                            "text-lg font-black w-10 h-10 flex items-center justify-center mx-auto rounded-full transition-all cursor-pointer hover:scale-110",
                                            isSameDay(day, new Date())
                                                ? "bg-gold-500 text-slate-900 shadow-md"
                                                : "text-slate-700 bg-white border border-slate-100 hover:bg-gold-100 hover:border-gold-300 shadow-sm"
                                        )}>
                                        {format(day, "d")}
                                    </div>
                                    <div className="mt-2 flex justify-center">
                                        <button
                                            onClick={() => router.push(`/dashboard/instructor/planning?date=${formatISO(day, { representation: 'date' })}`)}
                                            className="text-[10px] text-slate-400 font-bold hover:text-gold-600 transition-colors flex items-center gap-1"
                                        >
                                            <ExternalLink className="w-2.5 h-2.5" />
                                            Planning
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Time Grid */}
                        <div className={cn(
                            "relative grid grid-cols-[80px_repeat(7,1fr)]",
                            isCompactView ? "h-[52rem]" : "h-[68rem]"
                        )}>
                            {/* Time Labels */}
                            <div className="relative">
                                {HOURS.map((hour) => (
                                    <div
                                        key={hour}
                                        className="h-16 text-right pr-4 text-xs font-bold text-slate-400 -mt-2"
                                    >
                                        {hour}:00
                                    </div>
                                ))}
                            </div>

                            {/* Grid Content */}
                            {weekDays.map((day, i) => (
                                <div
                                    key={i}
                                    className={cn(
                                        "relative border-l border-slate-100",
                                        isSameDay(day, new Date()) && "bg-gold-50/10"
                                    )}
                                >
                                    {/* Horizontal lines */}
                                    {HOURS.map((hour) => (
                                        <div
                                            key={hour}
                                            className="h-16 border-b border-slate-50 last:border-0"
                                        />
                                    ))}

                                    {/* Availabilities Slots */}
                                    {getAvailabilitiesForDay(day).map((slot) => (
                                        <div
                                            key={slot.id}
                                            className={cn(
                                                "absolute left-1 right-1 rounded-lg p-2 text-xs overflow-hidden border shadow-sm group transition-all hover:z-10 hover:shadow-md hover:scale-[1.02] cursor-pointer",
                                                slot.isBooked
                                                    ? (slot.lessons[0]?.status === "CONFIRMED"
                                                        ? "bg-green-50 border-green-200 text-green-800"
                                                        : "bg-orange-50 border-orange-200 text-orange-800")
                                                    : slot.isRecurring
                                                        ? "bg-blue-50 border-blue-200 text-blue-800"
                                                        : "bg-sky-50 border-sky-100 text-sky-700"
                                            )}
                                            style={getSlotStyle(slot.startTime, slot.endTime)}
                                            onClick={() => slot.isBooked && setSelectedSlot(slot)}
                                        >
                                            <div className="flex flex-col h-full font-medium">
                                                <div className="flex items-center justify-between mb-1">
                                                    <div className="flex items-center gap-1 font-bold">
                                                        <Clock className="w-3 h-3 opacity-60" />
                                                        <span>{slot.startTime}</span>
                                                    </div>
                                                    {!slot.isBooked && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                onDelete(slot);
                                                            }}
                                                            className="p-1 hover:bg-white/50 rounded text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    )}
                                                </div>

                                                <div className="truncate">
                                                    {slot.startTime} - {slot.endTime}
                                                </div>

                                                {slot.isBooked && (
                                                    <div className="mt-1 pt-1 border-t border-green-200/50 italic truncate">
                                                        👨‍🎓 {slot.lessons.map(l => `${l.student.firstName} ${l.student.lastName}`).join(", ")}
                                                    </div>
                                                )}

                                                {slot.isRecurring && !slot.isBooked && (
                                                    <div className="mt-auto text-[10px] uppercase font-black tracking-tighter opacity-50">
                                                        Récurrent
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Legend */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-wrap gap-4 text-xs font-semibold text-slate-500">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-sky-50 border border-sky-200"></div>
                        <span>Disponible</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-blue-50 border border-blue-300"></div>
                        <span>Récurrent</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-orange-100 border border-orange-300"></div>
                        <span>En attente (élève)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-green-100 border border-green-300"></div>
                        <span>Validé / Confirmé</span>
                    </div>
                </div>
            </div>
            {/* Detail Modal */}
            <AnimatePresence>
                {selectedSlot && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedSlot(null)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
                        >
                            {/* Modal Header */}
                            <div className={cn(
                                "p-6 flex items-center justify-between",
                                selectedSlot.isBooked ? "bg-green-500 text-white" : "bg-gold-500 text-slate-900"
                            )}>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md">
                                        <CalendarIcon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">Détails du créneau</h3>
                                        <p className="text-sm opacity-90 font-medium">
                                            {selectedSlot.date ? format(typeof selectedSlot.date === 'string' ? parseISO(selectedSlot.date) : selectedSlot.date, "EEEE d MMMM", { locale: fr }) : ""}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedSlot(null)}
                                    className="p-1 hover:bg-black/10 rounded-full transition"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="p-6 space-y-6">
                                {/* Time Info */}
                                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <div className="flex-1 flex items-center gap-3">
                                        <Clock className="w-5 h-5 text-slate-400" />
                                        <div>
                                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Horaire</div>
                                            <div className="font-bold text-slate-900">{selectedSlot.startTime} - {selectedSlot.endTime}</div>
                                        </div>
                                    </div>
                                    {selectedSlot.isRecurring && (
                                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-tighter rounded">Récurrent</span>
                                    )}
                                </div>

                                {/* Student Info (if booked) */}
                                {selectedSlot.isBooked && selectedSlot.lessons[0] && (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                                            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 border-2 border-slate-50 shadow-inner">
                                                <User className="w-6 h-6" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Élève</div>
                                                <div className="text-lg font-bold text-slate-900">
                                                    {selectedSlot.lessons[0].student.firstName} {selectedSlot.lessons[0].student.lastName}
                                                </div>
                                            </div>
                                            <div className={cn(
                                                "px-3 py-1 rounded-full text-xs font-bold shadow-sm",
                                                selectedSlot.lessons[0].status === "CONFIRMED" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                                            )}>
                                                {selectedSlot.lessons[0].status === "CONFIRMED" ? "Confirmé" : "En attente"}
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex flex-col gap-3 pt-2">
                                            <div className="grid grid-cols-2 gap-3">
                                                {selectedSlot.lessons[0].status === "PENDING" && (
                                                    <button
                                                        onClick={() => handleConfirm(selectedSlot.lessons[0].id)}
                                                        disabled={isActionLoading}
                                                        className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-green-200 disabled:opacity-50"
                                                    >
                                                        <CheckCircle2 className="w-5 h-5" />
                                                        Confirmer
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => !showRejectInput ? setShowRejectInput(true) : handleReject(selectedSlot.lessons[0].id)}
                                                    disabled={isActionLoading}
                                                    className={cn(
                                                        "flex items-center justify-center gap-2 font-bold py-3 rounded-xl transition disabled:opacity-50",
                                                        showRejectInput ? "bg-red-500 text-white shadow-red-200" : "bg-red-50 text-red-600 hover:bg-red-100",
                                                        selectedSlot.lessons[0].status !== "PENDING" && "col-span-2"
                                                    )}
                                                >
                                                    <XCircle className="w-5 h-5" />
                                                    {showRejectInput ? "Valider le refus" : "Refuser / Annuler"}
                                                </button>
                                            </div>

                                            {selectedSlot.lessons[0].status === "CONFIRMED" && (
                                                <button
                                                    onClick={() => {
                                                        const lesson = selectedSlot.lessons[0];
                                                        setLessonToComplete({
                                                            id: lesson.id,
                                                            studentName: `${lesson.student.firstName} ${lesson.student.lastName}`,
                                                            date: format(typeof selectedSlot.date === 'string' ? parseISO(selectedSlot.date) : selectedSlot.date!, "EEEE d MMMM", { locale: fr }),
                                                            startTime: selectedSlot.startTime,
                                                            endTime: selectedSlot.endTime,
                                                            duration: (parseInt(selectedSlot.endTime.split(':')[0]) - parseInt(selectedSlot.startTime.split(':')[0]))
                                                        });
                                                        setShowRecapModal(true);
                                                    }}
                                                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-indigo-200"
                                                >
                                                    <CheckCircle2 className="w-5 h-5" />
                                                    Terminer le cours (Récap)
                                                </button>
                                            )}
                                        </div>

                                        {showRejectInput && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                className="space-y-2"
                                            >
                                                <label className="text-sm font-bold text-slate-600">Motif du refus</label>
                                                <textarea
                                                    value={rejectReason}
                                                    onChange={(e) => setRejectReason(e.target.value)}
                                                    placeholder="L'élève sera notifié de ce motif..."
                                                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none text-sm min-h-[100px]"
                                                />
                                            </motion.div>
                                        )}
                                    </div>
                                )}

                                {/* Free slot actions */}
                                {!selectedSlot.isBooked && (
                                    <div className="pt-2">
                                        <button
                                            onClick={() => {
                                                onDelete(selectedSlot);
                                                setSelectedSlot(null);
                                            }}
                                            className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 font-bold py-3 rounded-xl transition"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                            Supprimer ce créneau
                                        </button>
                                        <p className="text-center text-xs text-slate-400 mt-4 italic flex items-center justify-center gap-1">
                                            <AlertCircle className="w-3 h-3" />
                                            Ce créneau est libre et peut être réservé par n'importe quel élève.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {lessonToComplete && (
                <LessonRecapModal
                    isOpen={showRecapModal}
                    onClose={() => {
                        setShowRecapModal(false);
                        setLessonToComplete(null);
                    }}
                    lesson={lessonToComplete}
                    onSubmit={async (data) => {
                        if (onCompleteLesson) {
                            await onCompleteLesson(lessonToComplete.id, data);
                            setSelectedSlot(null);
                        }
                    }}
                />
            )}
        </>
    );
}
