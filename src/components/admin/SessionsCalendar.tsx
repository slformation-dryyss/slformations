"use client";

import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronLeft, ChevronRight, MapPin, Users } from "lucide-react";
import Link from "next/link";

interface Session {
  id: string;
  course: {
    title: string;
    type: string;
  };
  startDate: Date | string;
  endDate: Date | string;
  location: string | null;
  maxSpots: number;
  bookedSpots: number;
  isPublished: boolean;
}

export function SessionsCalendar({ sessions }: { sessions: Session[] }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const firstDayCurrentMonth = startOfMonth(currentMonth);
  const days = eachDayOfInterval({
    start: startOfWeek(firstDayCurrentMonth, { weekStartsOn: 1 }), // Lundi
    end: endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 }),
  });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const getSessionsForDay = (day: Date) => {
    return sessions.filter((session) =>
      isSameDay(new Date(session.startDate), day)
    );
  };

  const dayNames = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header du calendrier */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
        <h2 className="text-lg font-semibold text-slate-900 capitalize">
          {format(currentMonth, "MMMM yyyy", { locale: fr })}
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={prevMonth}
            className="p-2 hover:bg-slate-200 rounded-lg transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-slate-200 rounded-lg transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Jours de la semaine */}
      <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50/50">
        {dayNames.map((day) => (
          <div
            key={day}
            className="py-2 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Grille du calendrier */}
      <div className="grid grid-cols-7 auto-rows-fr">
        {days.map((day, dayIdx) => {
          const sessionsToday = getSessionsForDay(day);
          const isCurrentMonth = isSameMonth(day, firstDayCurrentMonth);

          return (
            <div
              key={day.toString()}
              className={`min-h-[120px] p-2 border-b border-r border-slate-100 relative group transition-colors hover:bg-slate-50/50 ${
                !isCurrentMonth ? "bg-slate-50/30 text-slate-400" : "bg-white"
              } ${dayIdx % 7 === 6 ? "border-r-0" : ""}`} // Pas de bordure droite pour le dernier jour
            >
              <div className="text-right text-xs font-medium mb-1">
                <span
                  className={`inline-block w-6 h-6 leading-6 text-center rounded-full ${
                    isSameDay(day, new Date())
                      ? "bg-gold-500 text-white"
                      : "text-slate-700"
                  }`}
                >
                  {format(day, "d")}
                </span>
              </div>

              <div className="space-y-1">
                {sessionsToday.map((session) => (
                  <Link
                    key={session.id}
                    href={`/admin/sessions/${session.id}`}
                    className="block text-xs p-1.5 rounded border border-l-2 border-slate-200 bg-white hover:border-gold-500 hover:shadow-sm transition-all text-left truncate"
                    style={{
                        borderLeftColor: session.isPublished ? '#10b981' : '#fbbf24' // Green if published, yellow if draft
                    }}
                  >
                    <div className="font-semibold truncate text-slate-900">
                      {session.course.title}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5 flex items-center justify-between">
                       <span>{format(new Date(session.startDate), 'HH:mm')}</span>
                       <span className={session.bookedSpots >= session.maxSpots ? "text-red-500 font-bold" : ""}>
                         {session.bookedSpots}/{session.maxSpots}
                       </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

