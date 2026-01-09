"use client";

import { useState, useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  X,
  Calendar as CalendarIcon,
  Video
} from "lucide-react";

export default function InstructorPlanningPage() {
  const { user } = useUser();
  const [activeEvent, setActiveEvent] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [view, setView] = useState<"week" | "month">("week");
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
      async function loadEvents() {
          try {
              const res = await fetch('/api/dashboard/planning'); // API checks role and returns teacher events
              if (res.ok) {
                  const data = await res.json();
                  setEvents(data.events);
              }
          } catch (e) {
              console.error("Failed to load events", e);
          } finally {
              setLoading(false);
          }
      }
      loadEvents();
  }, []);

  const navigateDate = (direction: "prev" | "next" | "today") => {
    const newDate = new Date(currentDate);
    if (direction === "today") {
      setCurrentDate(new Date());
      return;
    }
    if (view === "month") {
      newDate.setMonth(currentDate.getMonth() + (direction === "next" ? 1 : -1));
    } else {
      newDate.setDate(currentDate.getDate() + (direction === "next" ? 7 : -7));
    }
    setCurrentDate(newDate);
  };

  const openModal = (event: any) => setActiveEvent(event);
  const closeModal = () => setActiveEvent(null);

  const getEventsForDay = (date: Date) => {
      return events.filter(e => {
          const eventDate = new Date(e.start);
          return eventDate.getDate() === date.getDate() &&
                 eventDate.getMonth() === date.getMonth() &&
                 eventDate.getFullYear() === date.getFullYear();
      });
  };

  return (
    <div className="h-full flex flex-col pt-6"> 
        <header className="bg-white border-b border-slate-200 px-4 md:px-8 py-4">
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2">
                <CalendarIcon className="w-6 h-6 text-gold-500" />
                Planning Formateur
            </h1>
        </header>

        {/* Controls */}
        <div className="bg-white border-b border-slate-200 px-4 md:px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
             <div className="flex bg-slate-100 rounded-lg p-1 text-sm">
                <button onClick={() => setView("week")} className={`px-4 py-1.5 rounded-md ${view === "week" ? "bg-white shadow text-slate-900" : "text-slate-500"}`}>Semaine</button>
                <button onClick={() => setView("month")} className={`px-4 py-1.5 rounded-md ${view === "month" ? "bg-white shadow text-slate-900" : "text-slate-500"}`}>Mois</button>
            </div>
            
            <div className="flex items-center gap-3">
                 <button onClick={() => navigateDate("prev")} className="p-2 hover:bg-slate-100 rounded-full"><ChevronLeft className="w-5 h-5" /></button>
                 <span className="font-bold min-w-[140px] text-center capitalize">
                    {currentDate.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
                 </span>
                 <button onClick={() => navigateDate("next")} className="p-2 hover:bg-slate-100 rounded-full"><ChevronRight className="w-5 h-5" /></button>
                 <button onClick={() => navigateDate("today")} className="text-sm bg-slate-100 px-3 py-1 rounded-md hover:bg-slate-200">Aujourd&apos;hui</button>
            </div>
        </div>

        {/* Calendar Grid - Reusing similar logic as Student but simplified/customized */}
        <div className="flex-1 overflow-auto p-4 bg-slate-50">
           {view === "week" && (
             <div className="bg-white rounded-lg shadow border border-slate-200 min-w-[800px]">
                <div className="grid grid-cols-8 border-b border-slate-200 bg-slate-50">
                    <div className="p-4 border-r border-slate-200"></div>
                    {Array.from({ length: 7 }).map((_, i) => {
                        const date = new Date(currentDate);
                        const day = currentDate.getDay();
                        const diff = currentDate.getDate() - day + (day === 0 ? -6 : 1);
                        date.setDate(diff + i);
                        const isToday = new Date().toDateString() === date.toDateString();
                        return (
                            <div key={i} className={`p-2 text-center border-l border-slate-200 ${isToday ? "bg-gold-50" : ""}`}>
                                <div className="text-xs font-semibold text-slate-500 uppercase">{date.toLocaleDateString('fr-FR', { weekday: 'short' })}</div>
                                <div className={`text-xl font-bold ${isToday ? "text-gold-600" : "text-slate-900"}`}>{date.getDate()}</div>
                            </div>
                        )
                    })}
                </div>
                <div className="grid grid-cols-8 bg-white relative">
                     <div className="bg-slate-50 border-r border-slate-200">
                        {Array.from({length: 13}).map((_, i) => (
                            <div key={i} className="h-20 border-b border-slate-100 text-xs text-right pr-2 pt-1 text-slate-400">
                                {i + 7}:00
                            </div>
                        ))}
                     </div>
                     {Array.from({ length: 7 }).map((_, i) => {
                        const date = new Date(currentDate);
                        const day = currentDate.getDay();
                        const diff = currentDate.getDate() - day + (day === 0 ? -6 : 1);
                        date.setDate(diff + i);
                        const dayEvents = getEventsForDay(date);

                        return (
                            <div key={i} className="border-l border-slate-100 relative h-[calc(13*5rem)]">
                                {Array.from({length: 13}).map((_, h) => <div key={h} className="h-20 border-b border-slate-50" />)}
                                {dayEvents.map((ev, idx) => {
                                    const start = new Date(ev.start);
                                    const end = new Date(ev.end);
                                    const startH = start.getHours();
                                    const startM = start.getMinutes();
                                    const durationMins = (end.getTime() - start.getTime()) / (1000 * 60);
                                    
                                    const top = ((startH - 7) * 80) + ((startM/60) * 80);
                                    const height = (durationMins / 60) * 80;

                                    if (startH < 7) return null;

                                    return (
                                        <div
                                            key={idx}
                                            onClick={() => openModal(ev)}
                                            className="absolute left-1 right-1 rounded p-1.5 text-xs cursor-pointer hover:brightness-95 transition border overflow-hidden shadow-sm z-10 bg-blue-50 border-blue-200 text-blue-800"
                                            style={{ top: `${top}px`, height: `${height}px` }}
                                        >
                                            <div className="font-bold truncate">{ev.title}</div>
                                            <div className="flex items-center gap-1 opacity-80">
                                                <Clock className="w-3 h-3" />
                                                {startH}:{startM.toString().padStart(2,'0')}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )
                     })}
                </div>
             </div>
           )}
           {view === "month" && (
               <div className="text-center py-10 text-slate-500">Vue Mois simplifiée pour formateurs (à venir). Utilisez la vue Semaine pour les détails horaires.</div>
           )}
        </div>

        {/* Modal */}
        {activeEvent && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={closeModal}>
                <div className="bg-white rounded-xl shadow-xl w-full max-w-md m-4 overflow-hidden" onClick={e => e.stopPropagation()}>
                    <div className="bg-navy-900 text-white p-4 flex justify-between items-center">
                        <h3 className="font-bold">{activeEvent.title}</h3>
                        <button onClick={closeModal}><X className="w-5 h-5" /></button>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="flex items-center gap-3 text-slate-700">
                             <Clock className="w-5 h-5 text-gold-500" />
                             <div>
                                <div className="text-xs text-slate-500">Horaire</div>
                                <div className="font-semibold">
                                    {new Date(activeEvent.start).toLocaleDateString()} <br/>
                                    {new Date(activeEvent.start).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})} - 
                                    {new Date(activeEvent.end).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                                </div>
                             </div>
                        </div>

                        <div className="flex items-center gap-3 text-slate-700">
                             <MapPin className="w-5 h-5 text-gold-500" />
                             <div>
                                <div className="text-xs text-slate-500">Lieu</div>
                                <div className="font-semibold">{activeEvent.location || "Non défini"}</div>
                             </div>
                        </div>

                        {activeEvent.meetingUrl && (
                             <div className="flex items-center gap-3 text-slate-700">
                                <Video className="w-5 h-5 text-gold-500" />
                                <div>
                                    <div className="text-xs text-slate-500">Visio</div>
                                    <a href={activeEvent.meetingUrl} target="_blank" className="text-blue-600 hover:underline break-all">Rejoindre</a>
                                </div>
                             </div>
                        )}

                        <div className="pt-4 border-t border-slate-100">
                            <span className="inline-block px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-medium">
                                {activeEvent.role === "MAIN_TEACHER" ? "Responsable Principal" : "Intervenant Créneau"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
}

