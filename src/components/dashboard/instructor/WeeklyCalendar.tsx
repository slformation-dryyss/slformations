"use client";

import { useState, useMemo } from "react";
import {
    format,
    startOfWeek,
    addDays,
    startOfDay,
    isSameDay,
    addWeeks,
    subWeeks,
    parseISO
} from "date-fns";
import { fr } from "date-fns/locale";
import {
    ChevronLeft,
    ChevronRight,
    Clock,
    Trash2,
    Calendar as CalendarIcon
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
    lessons: Array<{
        id: string;
        status: string;
        student: { firstName: string | null; lastName: string | null };
    }>;
};

interface WeeklyCalendarProps {
    availabilities: Availability[];
    onDelete: (slot: Availability) => void;
}

const HOURS = Array.from({ length: 13 }, (_, i) => i + 8); // 8h to 20h

export function WeeklyCalendar({ availabilities, onDelete }: WeeklyCalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const weekDays = useMemo(() => {
        const start = startOfWeek(currentDate, { weekStartsOn: 1 }); // Start on Monday
        return Array.from({ length: 7 }, (_, i) => addDays(start, i));
    }, [currentDate]);

    const nextWeek = () => setCurrentDate(addWeeks(currentDate, 1));
    const prevWeek = () => setCurrentDate(subWeeks(currentDate, 1));
    const today = () => setCurrentDate(new Date());

    // Function to calculate slot style based on time
    const getSlotStyle = (startTime: string, endTime: string) => {
        const [startH, startM] = startTime.split(":").map(Number);
        const [endH, endM] = endTime.split(":").map(Number);

        const startPos = (startH - 8) * 60 + startM;
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
            return isSameDay(startOfDay(slotDate), startOfDay(day));
        });
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            {/* Calendar Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50 gap-4">
                <div className="flex items-center gap-4">
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
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-500 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
                    <CalendarIcon className="w-4 h-4 text-gold-500" />
                    <span>Semaine du {format(weekDays[0], "dd", { locale: fr })} au {format(weekDays[6], "dd MMMM", { locale: fr })}</span>
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
                                <div className={cn(
                                    "text-lg font-black w-10 h-10 flex items-center justify-center mx-auto rounded-full transition-colors",
                                    isSameDay(day, new Date())
                                        ? "bg-gold-500 text-slate-900 shadow-md"
                                        : "text-slate-700 hover:bg-slate-100"
                                )}>
                                    {format(day, "d")}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Time Grid */}
                    <div className="relative grid grid-cols-[80px_repeat(7,1fr)] h-[52rem]">
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
                                            "absolute left-1 right-1 rounded-lg p-2 text-xs overflow-hidden border shadow-sm group transition-all hover:z-10 hover:shadow-md hover:scale-[1.02]",
                                            slot.isBooked
                                                ? "bg-green-50 border-green-200 text-green-800"
                                                : slot.isRecurring
                                                    ? "bg-blue-50 border-blue-200 text-blue-800"
                                                    : "bg-gold-50 border-gold-200 text-gold-900"
                                        )}
                                        style={getSlotStyle(slot.startTime, slot.endTime)}
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
                    <div className="w-3 h-3 rounded bg-gold-100 border border-gold-300"></div>
                    <span>Disponible</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-blue-100 border border-blue-300"></div>
                    <span>Récurrent</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-green-100 border border-green-300"></div>
                    <span>Réservé / Cours</span>
                </div>
            </div>
        </div>
    );
}
