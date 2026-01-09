"use client";

import { useState } from "react";
import { LayoutList, Calendar as CalendarIcon, MapPin, Users, Calendar, Plus } from "lucide-react";
import Link from "next/link";
import { SessionsCalendar } from "./SessionsCalendar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

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

export function SessionsManager({ sessions }: { sessions: Session[] }) {
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        
        {/* Toggle Mode */}
        <div className="bg-slate-100 p-1 rounded-lg inline-flex self-start">
          <button
            onClick={() => setViewMode("list")}
            className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-all ${
              viewMode === "list"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <LayoutList className="w-4 h-4" />
            Liste
          </button>
          <button
            onClick={() => setViewMode("calendar")}
            className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-all ${
              viewMode === "calendar"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <CalendarIcon className="w-4 h-4" />
            Calendrier
          </button>
        </div>

        <Link
          href="/admin/sessions/create"
          className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-slate-900 px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Nouvelle Session
        </Link>
      </div>

      {viewMode === "calendar" ? (
        <SessionsCalendar sessions={sessions} />
      ) : (
        <div className="space-y-4">
            {/* Recherche et Filtres (à venir si besoin) */}

            {sessions.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                    <p className="text-slate-500">Aucune session planifiée.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {sessions.map((session) => (
                        <Link
                            key={session.id}
                            href={`/admin/sessions/${session.id}`}
                            className="bg-white rounded-xl border border-slate-200 p-4 hover:border-gold-500 hover:shadow-md transition-all group flex flex-col md:flex-row md:items-center justify-between gap-4"
                        >
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-14 h-14 bg-slate-100 rounded-lg flex flex-col items-center justify-center text-slate-900 border border-slate-200">
                                    <span className="text-xs font-bold uppercase text-slate-500">{format(new Date(session.startDate), "MMM", {locale: fr})}</span>
                                    <span className="text-xl font-bold">{format(new Date(session.startDate), "dd")}</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 text-lg group-hover:text-gold-600 transition-colors">
                                        {session.course.title}
                                    </h3>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-slate-500">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            {format(new Date(session.startDate), "HH:mm")} - {format(new Date(session.endDate), "HH:mm")}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-4 h-4" />
                                            {session.location || "En ligne"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                                <div className="flex items-center gap-2">
                                     <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${
                                        session.isPublished 
                                            ? "bg-green-50 text-green-700 border-green-200" 
                                            : "bg-yellow-50 text-yellow-700 border-yellow-200"
                                    }`}>
                                        {session.isPublished ? "Publié" : "Brouillon"}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5 text-sm font-medium bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
                                    <Users className="w-4 h-4 text-slate-400" />
                                    <span className={session.bookedSpots >= session.maxSpots ? "text-red-600" : "text-slate-700"}>
                                        {session.bookedSpots}
                                        <span className="text-slate-400 font-normal"> / {session.maxSpots}</span>
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
      )}
    </div>
  );
}

