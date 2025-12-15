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
import { useState } from "react";

type EventId = "event1" | "event2" | "event3" | "event4" | "event5" | null;

import { useUser } from "@auth0/nextjs-auth0/client";

export default function DashboardPlanningPage() {
  const { user } = useUser();
  const [activeEvent, setActiveEvent] = useState<EventId>(null);

  // États pour les vues et la date
  const [view, setView] = useState<"week" | "month" | "day">("week");
  const [currentDate, setCurrentDate] = useState(new Date());

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

  const openModal = (event: EventId) => setActiveEvent(event);
  const closeModal = () => setActiveEvent(null);

  const isModalOpen = activeEvent !== null;

  return (
    <>
      <div className="pt-24 pb-12 px-0 md:px-0">
        <div className="flex h-[calc(100vh-6rem)] overflow-hidden">
          {/* Sidebar élève */}
          <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 flex-col">
            <div className="p-6 border-b border-slate-200 flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-gold-500 to-gold-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="text-navy-900 w-5 h-5" />
              </div>
              <span className="text-lg font-bold leading-tight text-slate-900">
                SL Formations
                <span className="block text-xs font-normal text-gold-600">
                  Espace élève
                </span>
              </span>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2 text-sm">
              <Link
                href="/dashboard"
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition text-left"
              >
                <CalendarDays className="w-4 h-4" />
                <span>Tableau de bord</span>
              </Link>
              <Link
                href="/dashboard/mes-formations"
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition text-left"
              >
                <BookOpen className="w-4 h-4" />
                <span>Mes formations</span>
              </Link>
              <Link
                href="/dashboard/planning"
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg bg-gold-500 text-navy-900 font-semibold text-left"
              >
                <CalendarDays className="w-4 h-4" />
                <span>Mon planning</span>
              </Link>
              <Link
                href="/dashboard/paiement"
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition text-left"
              >
                <CreditCard className="w-4 h-4" />
                <span>Mes paiements</span>
              </Link>
              <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition text-left">
                <MessageSquare className="w-4 h-4" />
                <span>Messages</span>
              </button>
              <Link
                href="/dashboard/profile"
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition text-left"
              >
                <User className="w-4 h-4" />
                <span>Profil</span>
              </Link>
            </nav>

            <div className="p-4 border-t border-slate-200">
              <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-red-50 hover:text-red-500 transition text-left text-sm">
                <LogOut className="w-4 h-4" />
                <span>Déconnexion</span>
              </button>
            </div>
          </aside>

          {/* Contenu principal : planning */}
          <section className="flex-1 flex flex-col overflow-hidden">
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

                <div className="flex items-center space-x-4">
                  <button className="relative p-2 text-slate-400 hover:text-slate-900 transition">
                    <Bell className="w-5 h-5" />
                    {/* <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" /> */}
                  </button>
                  <div className="hidden sm:flex items-center space-x-3 pl-4 border-l border-slate-200">
                    <div className="relative w-10 h-10">
                      <Image
                        src={user?.picture || "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg"}
                        alt="Avatar élève"
                        fill
                        className="rounded-full object-cover border border-slate-200"
                      />
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-slate-900">{user?.name || "Élève"}</div>
                      <div className="text-xs text-slate-500">Élève</div>
                    </div>
                  </div>
                </div>
              </div>
            </header>

            {/* Contrôles calendrier */}
            <div className="bg-white border-b border-slate-200 px-4 md:px-8 py-4">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <button className="px-4 py-2 bg-gradient-to-r from-gold-500 to-gold-600 text-navy-900 rounded-lg font-semibold hover:shadow-lg transition text-sm">
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
                    <button
                      onClick={() => setView("day")}
                      className={`px-3 md:px-4 py-1.5 rounded-md font-medium transition ${
                        view === "day"
                          ? "bg-white text-slate-900 shadow-sm"
                          : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      Jour
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

            {/* Barre de filtres */}
            <div className="bg-slate-50 px-4 md:px-8 py-3 flex flex-wrap items-center gap-3 border-b border-slate-200">
              <div className="flex items-center space-x-2 text-xs md:text-sm text-slate-500">
                <Filter className="w-3 h-3" />
                <span>Filtrer par :</span>
              </div>

              <select className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs md:text-sm text-slate-700 focus:outline-none focus:border-gold-500">
                <option>Toutes les formations</option>
                {/* <option>Permis B</option>
                <option>Formation VTC</option> */}
              </select>

              <select className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs md:text-sm text-slate-700 focus:outline-none focus:border-gold-500">
                <option>Tous les professeurs</option>
              </select>

              <select className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs md:text-sm text-slate-700 focus:outline-none focus:border-gold-500">
                <option>Tous les lieux</option>
              </select>

              <div className="flex-1" />

              <div className="flex items-center gap-3 text-[11px] md:text-xs">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 bg-blue-500 rounded" />
                  <span className="text-slate-500">Théorique</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 bg-green-500 rounded" />
                  <span className="text-slate-500">Pratique</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 bg-gold-500 rounded" />
                  <span className="text-slate-500">Examen</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 bg-orange-500 rounded" />
                  <span className="text-slate-500">Coaching</span>
                </div>
              </div>
            </div>

            {/* Vue calendrier dynamique */}
            <div className="flex-1 overflow-auto p-4 md:p-8">
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden min-w-full md:min-w-[900px] shadow-sm">
                
                {/* --- VUE SEMAINE --- */}
                {view === "week" && (
                  <>
                    <div className="grid grid-cols-8 border-b border-slate-200 text-xs md:text-sm bg-slate-50">
                      <div className="p-3 md:p-4 text-center flex items-center justify-center text-slate-500 font-medium border-r border-slate-200">
                        {/* GMT+1 */}
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

                    <div className="grid grid-cols-8 text-xs md:text-sm bg-white">
                      {/* Colonne heures */}
                      <div className="bg-slate-50 border-r border-slate-200">
                        {[
                          "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", 
                          "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"
                        ].map((time) => (
                          <div
                            key={time}
                            className="h-16 p-2 text-right text-[10px] md:text-xs text-slate-500 border-b border-slate-100 relative"
                          >
                            <span className="relative -top-2">{time}</span>
                          </div>
                        ))}
                      </div>

                      {/* Colonnes jours (Vides pour l'instant) */}
                      {Array.from({ length: 7 }).map((_, i) => (
                        <div key={i} className="border-l border-slate-100 relative h-[calc(12*4rem)]">
                          {/* Lignes grises pour chaque heure */}
                          {Array.from({ length: 12 }).map((_, h) => (
                            <div key={h} className="h-16 border-b border-slate-50" />
                          ))}
                        </div>
                      ))}
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
                        const lastDayOfMonth = new Date(year, month + 1, 0); // Last day of current month
                        
                        // Calculate padding days (previous month)
                        // getDay(): 0=Sun, 1=Mon... need 0=Mon, 6=Sun
                        let startDay = firstDayOfMonth.getDay(); 
                        startDay = startDay === 0 ? 6 : startDay - 1; // 0=Mon, 6=Sun

                        const totalDays = lastDayOfMonth.getDate();
                        const prevMonthLastDay = new Date(year, month, 0).getDate();

                        const daysArray = [];

                        // Previous month padding
                        for (let i = 0; i < startDay; i++) {
                          daysArray.push({
                            day: prevMonthLastDay - startDay + 1 + i,
                            currentMonth: false
                          });
                        }

                        // Current month days
                        for (let i = 1; i <= totalDays; i++) {
                          daysArray.push({
                            day: i,
                            currentMonth: true
                          });
                        }

                        // Next month padding (fill up to 42 for 6 rows or 35 for 5 rows)
                         const remaining = 42 - daysArray.length; // Ensure 6 rows for consistency
                        for (let i = 1; i <= remaining; i++) {
                          daysArray.push({
                            day: i,
                            currentMonth: false
                          });
                        }

                        return daysArray.map((item, idx) => {
                           const isToday = 
                            item.currentMonth && 
                            item.day === new Date().getDate() && 
                            month === new Date().getMonth() && 
                            year === new Date().getFullYear();

                           return (
                            <div 
                              key={idx} 
                              className={`
                                min-h-[80px] border-b border-r border-slate-100 p-2 relative transition hover:bg-slate-50
                                ${!item.currentMonth ? "bg-slate-50/50 text-slate-300" : "text-slate-900"}
                              `}
                            >
                              <div className={`
                                w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium
                                ${isToday ? "bg-gold-500 text-white" : ""}
                              `}>
                                {item.day}
                              </div>
                            </div>
                           );
                        });
                      })()}
                    </div>
                  </div>
                )}

                {/* --- VUE JOUR --- */}
                {view === "day" && (
                  <div className="flex flex-col bg-white">
                     {/* Header du jour */}
                     <div className="p-4 border-b border-slate-200 text-center bg-slate-50">
                        <div className="text-gold-500 font-bold uppercase text-sm">
                          {currentDate.toLocaleDateString('fr-FR', { weekday: 'long' })}
                        </div>
                        <div className="text-3xl font-bold text-slate-900">
                          {currentDate.getDate()} {currentDate.toLocaleDateString('fr-FR', { month: 'long' })}
                        </div>
                     </div>

                    <div className="grid grid-cols-[80px_1fr] overflow-auto h-[600px]">
                       <div className="border-r border-slate-200 bg-slate-50">
                          {[
                            "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", 
                            "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"
                          ].map((time) => (
                            <div key={time} className="h-24 p-2 text-right text-xs text-slate-500 border-b border-slate-200 relative">
                               <span className="relative -top-2">{time}</span>
                            </div>
                          ))}
                       </div>
                       <div className="relative">
                          {/* Lignes horaires */}
                          {Array.from({ length: 12 }).map((_, i) => (
                             <div key={i} className="h-24 border-b border-slate-100" />
                          ))}
                       </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Modal de détails de session (statique, contenu d’exemple) */}
      {isModalOpen && (
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
                  Type de session
                </div>
                <div className="text-lg font-bold text-slate-900">
                  {activeEvent === "event3"
                    ? "Examen pratique"
                    : activeEvent === "event2"
                    ? "Code de la route"
                    : activeEvent === "event4"
                    ? "Pratique moto"
                    : activeEvent === "event5"
                    ? "Coaching VTC"
                    : "Pratique conduite"}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-slate-500 mb-1">Date</div>
                  <div className="font-semibold text-slate-900">Lundi 15 Décembre</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Horaire</div>
                  <div className="font-semibold text-slate-900 flex items-center space-x-1">
                    <Clock className="w-4 h-4 text-gold-500" />
                    <span>10:00 - 12:00</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-500 mb-2">Professeur</div>
                <div className="flex items-center space-x-3">
                  <div className="relative w-12 h-12">
                    <Image
                      src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg"
                      alt="Formateur"
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Marc Lefebvre</div>
                    <div className="text-xs text-slate-500">
                      Moniteur auto-école
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-500 mb-1">Lieu</div>
                <div className="font-semibold text-slate-900 flex items-center space-x-1">
                  <MapPin className="w-4 h-4 text-gold-500" />
                  <span>Centre Paris 15e</span>
                </div>
                <div className="text-xs text-slate-500">
                  123 Avenue de Paris, 75015
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-500 mb-1">Formation</div>
                <span className="inline-block px-3 py-1 bg-green-500/10 text-green-600 rounded-full text-xs font-semibold">
                  Permis B
                </span>
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  onClick={closeModal}
                  className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition text-sm"
                >
                  Fermer
                </button>
                <button className="flex-1 px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-600 rounded-lg font-semibold transition text-sm">
                  Annuler la session
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


    </>
  );
}








