"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Filter,
  GraduationCap,
  LogOut,
  CreditCard,
  BookOpen,
  MessageSquare,
  User,
  Bell,
  MapPin,
  Clock,
  X,
} from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";

export default function DashboardPlanningPage() {
  const { user } = useUser();
  const [activeEvent, setActiveEvent] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // États pour les vues et la date
  const [view, setView] = useState<"week" | "month" | "day">("week");
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
      async function loadEvents() {
          try {
              const res = await fetch('/api/dashboard/planning');
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
    } else if (view === "week") {
      newDate.setDate(currentDate.getDate() + (direction === "next" ? 7 : -7));
    } else {
      newDate.setDate(currentDate.getDate() + (direction === "next" ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  const openModal = (event: any) => setActiveEvent(event);
  const closeModal = () => setActiveEvent(null);

  const isModalOpen = activeEvent !== null;

  const getEventsForDay = (date: Date) => {
      return events.filter(e => {
          const eventDate = new Date(e.start);
          return eventDate.getDate() === date.getDate() &&
                 eventDate.getMonth() === date.getMonth() &&
                 eventDate.getFullYear() === date.getFullYear();
      });
  };

  return (
    <>
      <div className="h-full flex flex-col pt-6"> 
          {/* Contenu principal : planning */}
          <section className="flex-1 flex flex-col overflow-hidden h-full">
            {/* En-tête planning */}
            <header className="bg-white border-b border-slate-200 px-4 md:px-8 py-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-slate-900">
                    Mon planning
                  </h1>
                  <p className="text-slate-500 text-xs md:text-sm">
                    Visualisez et gérez vos sessions de formation
                  </p>
                </div>
              </div>
            </header>

            {/* Contrôles calendrier */}
            <div className="bg-white border-b border-slate-200 px-4 md:px-8 py-4">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <button className="hidden sm:block px-4 py-2 bg-gradient-to-r from-gold-500 to-gold-600 text-navy-900 rounded-lg font-semibold hover:shadow-lg transition text-sm">
                    + Réserver un créneau
                  </button>

                  <div className="flex items-center space-x-2 bg-slate-100 rounded-lg p-1 text-xs md:text-sm">
                    <button
                      onClick={() => setView("week")}
                      className={`px-3 md:px-4 py-1.5 rounded-md font-medium transition ${
                        view === "week"
                          ? "bg-white text-slate-900 shadow-sm"
                          : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      Semaine
                    </button>
                    <button
                      onClick={() => setView("month")}
                      className={`px-3 md:px-4 py-1.5 rounded-md font-medium transition ${
                        view === "month"
                          ? "bg-white text-slate-900 shadow-sm"
                          : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      Mois
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => navigateDate("prev")}
                      className="w-8 h-8 glass-effect rounded-lg flex items-center justify-center hover:bg-slate-100 text-slate-600 transition"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <div className="text-sm md:text-lg font-bold min-w-[140px] text-center text-slate-900">
                      {currentDate.toLocaleDateString("fr-FR", {
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                    <button
                      onClick={() => navigateDate("next")}
                      className="w-8 h-8 glass-effect rounded-lg flex items-center justify-center hover:bg-slate-100 text-slate-600 transition"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => navigateDate("today")}
                    className="px-3 md:px-4 py-2 glass-effect rounded-lg hover:bg-slate-100 text-slate-600 transition text-xs md:text-sm"
                  >
                    Aujourd&apos;hui
                  </button>
                </div>
              </div>
            </div>

            {/* Vue calendrier dynamique */}
            <div className="flex-1 overflow-auto p-4 md:p-8">
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden min-w-full md:min-w-[900px] shadow-sm min-h-[500px]">
                
                {/* --- VUE SEMAINE --- */}
                {view === "week" && (
                  <>
                    <div className="grid grid-cols-8 border-b border-slate-200 text-xs md:text-sm bg-slate-50">
                      <div className="p-3 md:p-4 text-center flex items-center justify-center text-slate-500 font-medium border-r border-slate-200">
                        GMT+1
                      </div>
                      {(() => {
                        const startOfWeek = new Date(currentDate);
                        const day = startOfWeek.getDay();
                        const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
                        startOfWeek.setDate(diff);

                        return Array.from({ length: 7 }).map((_, index) => {
                          const date = new Date(startOfWeek);
                          date.setDate(startOfWeek.getDate() + index);
                          
                          const dayName = date.toLocaleDateString('fr-FR', { weekday: 'short' }).toUpperCase().replace('.', '');
                          const dayNumber = date.getDate();
                          const isToday = new Date().toDateString() === date.toDateString();

                          return (
                            <div
                              key={index}
                              className={`p-3 md:p-4 text-center border-l border-slate-200 ${
                                isToday ? "bg-gold-50" : ""
                              }`}
                            >
                              <div
                                className={`text-[10px] mb-1 font-semibold ${
                                  isToday ? "text-gold-600" : "text-slate-400"
                                }`}
                              >
                                {dayName}
                              </div>
                              <div
                                className={`text-xl md:text-2xl font-bold ${
                                  isToday ? "text-gold-600" : "text-slate-900"
                                }`}
                              >
                                {dayNumber}
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>

                    <div className="grid grid-cols-8 text-xs md:text-sm bg-white relative">
                      {/* Colonne heures */}
                      <div className="bg-slate-50 border-r border-slate-200">
                        {[
                          "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", 
                          "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"
                        ].map((time) => (
                          <div
                            key={time}
                            className="h-20 p-2 text-right text-[10px] md:text-xs text-slate-500 border-b border-slate-100 relative"
                          >
                            <span className="relative -top-2">{time}</span>
                          </div>
                        ))}
                      </div>

                      {/* Colonnes jours */}
                      {(() => {
                        const startOfWeek = new Date(currentDate);
                        const day = startOfWeek.getDay();
                        const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
                        startOfWeek.setDate(diff);

                        return Array.from({ length: 7 }).map((_, i) => {
                            const date = new Date(startOfWeek);
                            date.setDate(startOfWeek.getDate() + i);
                            const dayEvents = getEventsForDay(date);

                            return (
                                <div key={i} className="border-l border-slate-100 relative h-[calc(12*5rem)]">
                                    {/* Lignes grises pour chaque heure */}
                                    {Array.from({ length: 12 }).map((_, h) => (
                                        <div key={h} className="h-20 border-b border-slate-50" />
                                    ))}

                                    {/* Événements */}
                                    {dayEvents.map((ev, idx) => {
                                        const startH = new Date(ev.start).getHours();
                                        const startM = new Date(ev.start).getMinutes();
                                        const endH = new Date(ev.end).getHours();
                                        const endM = new Date(ev.end).getMinutes();
                                        
                                        const startOffset = (startH - 8) * 80 + (startM / 60) * 80; // 80px per hour
                                        const duration = (endH - startH) * 60 + (endM - startM);
                                        const height = (duration / 60) * 80;

                                        if (startH < 8) return null; // Too early to show

                                        return (
                                            <div
                                                key={idx}
                                                onClick={() => openModal(ev)}
                                                className="absolute left-1 right-1 rounded-md p-2 text-xs cursor-pointer hover:opacity-90 transition border overflow-hidden shadow-sm z-10"
                                                style={{
                                                    top: `${startOffset}px`,
                                                    height: `${height}px`,
                                                    backgroundColor: ev.type === 'TEACHING' ? '#ebf8ff' : '#fffbeb', // Blue for teacher, Gold/Yellow for student
                                                    borderColor: ev.type === 'TEACHING' ? '#4299e1' : '#f59e0b',
                                                    color: ev.type === 'TEACHING' ? '#2b6cb0' : '#92400e'
                                                }}
                                            >
                                                <div className="font-bold truncate">{ev.title}</div>
                                                <div className="truncate opacity-75">{startH}h{startM > 0 ? startM : ''} - {ev.location}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        });
                      })()}
                    </div>
                  </>
                )}

                {/* --- VUE MOIS --- */}
                {view === "month" && (
                  <div className="flex flex-col h-full">
                    {/* Header jours semaine */}
                    <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
                      {["LUN", "MAR", "MER", "JEU", "VEN", "SAM", "DIM"].map((d) => (
                        <div key={d} className="p-3 text-center text-xs font-semibold text-slate-500">
                          {d}
                        </div>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-7 auto-rows-fr bg-white h-[600px]">
                      {(() => {
                        const year = currentDate.getFullYear();
                        const month = currentDate.getMonth();
                        
                        const firstDayOfMonth = new Date(year, month, 1);
                        const lastDayOfMonth = new Date(year, month + 1, 0); 
                        
                        let startDay = firstDayOfMonth.getDay(); 
                        startDay = startDay === 0 ? 6 : startDay - 1; 

                        const totalDays = lastDayOfMonth.getDate();
                        const prevMonthLastDay = new Date(year, month, 0).getDate();

                        const daysArray = [];

                        // Previous month padding
                        for (let i = 0; i < startDay; i++) {
                          daysArray.push({ day: prevMonthLastDay - startDay + 1 + i, currentMonth: false });
                        }

                        // Current month days
                        for (let i = 1; i <= totalDays; i++) {
                          daysArray.push({ day: i, currentMonth: true });
                        }

                        // Next month padding
                         const remaining = 42 - daysArray.length; 
                        for (let i = 1; i <= remaining; i++) {
                          daysArray.push({ day: i, currentMonth: false });
                        }

                        return daysArray.map((item, idx) => {
                           const isToday = 
                            item.currentMonth && 
                            item.day === new Date().getDate() && 
                            month === new Date().getMonth() && 
                            year === new Date().getFullYear();
                            
                           // Find events for this day
                           const checkDate = item.currentMonth ? new Date(year, month, item.day) : new Date(); // Only checking current month accurate
                           const dayEvents = item.currentMonth ? getEventsForDay(checkDate) : [];

                           return (
                            <div 
                              key={idx} 
                              className={`
                                min-h-[80px] border-b border-r border-slate-100 p-2 relative transition hover:bg-slate-50 flex flex-col gap-1
                                ${!item.currentMonth ? "bg-slate-50/50 text-slate-300" : "text-slate-900"}
                              `}
                            >
                              <div className={`
                                w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium
                                ${isToday ? "bg-gold-500 text-white" : ""}
                              `}>
                                {item.day}
                              </div>
                              
                              {/* Dots for events */}
                              {dayEvents.slice(0, 3).map((ev: any, i) => (
                                  <div key={i} className="text-[10px] truncate bg-gold-100 text-gold-800 rounded px-1">
                                      {ev.title}
                                  </div>
                              ))}
                              {dayEvents.length > 3 && (
                                  <div className="text-[10px] text-slate-400">+{dayEvents.length - 3} autres</div>
                              )}
                            </div>
                           );
                        });
                      })()}
                    </div>
                  </div>
                )}

                {/* --- VUE JOUR --- */}
                {view === "day" && (
                    <div className="flex items-center justify-center h-48 text-slate-500">
                        Vue Jour non implémentée (Utilisez la vue Semaine)
                    </div>
                )}
              </div>
            </div>
          </section>
      </div>

      {/* Modal de détails de session */}
      {isModalOpen && activeEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-lg mx-4 overflow-hidden shadow-xl">
            <div className="bg-gradient-to-r from-gold-500 to-gold-600 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-navy-900">
                Détails de la session
              </h3>
              <button
                onClick={closeModal}
                className="text-navy-900 hover:text-navy-800 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6 text-sm">
              <div>
                <div className="text-xs text-slate-500 mb-1">
                  Formation
                </div>
                <div className="text-lg font-bold text-slate-900">
                  {activeEvent.title}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-slate-500 mb-1">Date</div>
                  <div className="font-semibold text-slate-900">{new Date(activeEvent.start).toLocaleDateString()}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Horaire</div>
                  <div className="font-semibold text-slate-900 flex items-center space-x-1">
                    <Clock className="w-4 h-4 text-gold-500" />
                    <span>
                        {new Date(activeEvent.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - 
                        {new Date(activeEvent.end).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-500 mb-1">Lieu</div>
                <div className="font-semibold text-slate-900 flex items-center space-x-1">
                  <MapPin className="w-4 h-4 text-gold-500" />
                  <span>{activeEvent.location || "En ligne / À définir"}</span>
                </div>
              </div>

               {activeEvent.meetingUrl && (
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Lien de connexion</div>
                    <a 
                        href={activeEvent.meetingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium break-all"
                    >
                        Rejoindre la visioconférence
                    </a>
                  </div>
              )}

              <div className="flex space-x-3 pt-2">
                <button
                  onClick={closeModal}
                  className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition text-sm"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
