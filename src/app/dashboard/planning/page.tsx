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
  Info,
  Calendar as CalendarIcon,
  Video,
  Monitor,
  Map,
  CheckCircle
} from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isToday,
  addYears,
  subYears,
  startOfYear,
  endOfYear,
  eachMonthOfInterval,
  getYear
} from 'date-fns';
import { fr } from 'date-fns/locale';

const CATEGORY_MAP: Record<string, { label: string; color: string; border: string; text: string; light: string; dot: string }> = {
  "VTC": { label: "VTC / Taxi", color: "bg-gold-500", border: "border-gold-500", text: "text-gold-600", light: "bg-gold-50", dot: "bg-gold-500" },
  "CACES": { label: "CACES®", color: "bg-blue-600", border: "border-blue-600", text: "text-blue-700", light: "bg-blue-50", dot: "bg-blue-600" },
  "INCENDIE": { label: "Incendie", color: "bg-red-600", border: "border-red-600", text: "text-red-700", light: "bg-red-50", dot: "bg-red-600" },
  "SECOURISME": { label: "Secourisme", color: "bg-green-600", border: "border-green-600", text: "text-green-700", light: "bg-green-50", dot: "bg-green-600" },
  "HABILITATION": { label: "Hab. Élec.", color: "bg-purple-600", border: "border-purple-600", text: "text-purple-700", light: "bg-purple-50", dot: "bg-purple-600" },
  "RECUPERATION_POINTS": { label: "Récupération Points", color: "bg-orange-600", border: "border-orange-600", text: "text-orange-700", light: "bg-orange-50", dot: "bg-orange-600" },
  "TEST_PSYCHOTECHNIQUE": { label: "Test Psychotechnique", color: "bg-pink-500", border: "border-pink-500", text: "text-pink-600", light: "bg-pink-50", dot: "bg-pink-500" },
  "PERMIS": { label: "Permis", color: "bg-slate-900", border: "border-slate-900", text: "text-slate-900", light: "bg-slate-50", dot: "bg-slate-900" },
  "CONDUITE": { label: "Cours de Conduite", color: "bg-indigo-600", border: "border-indigo-600", text: "text-indigo-700", light: "bg-indigo-50", dot: "bg-indigo-600" },
  "DEFAULT": { label: "Formation", color: "bg-slate-500", border: "border-slate-500", text: "text-slate-600", light: "bg-slate-50", dot: "bg-slate-500" },
};

export default function DashboardPlanningPage() {
  const { user } = useUser();
  const [activeEvent, setActiveEvent] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    async function loadEvents() {
      try {
        // Vérifier le rôle pour redirection
        const profileRes = await fetch('/api/profile');
        if (profileRes.ok) {
          const profile = await profileRes.json();
          if (profile.role === 'INSTRUCTOR') {
            window.location.href = '/dashboard/planning-prof';
            return;
          }
          // Redirection removed for ADMIN to allow viewing personal planning
        }

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

  const openModal = (event: any) => setActiveEvent(event);
  const closeModal = () => setActiveEvent(null);

  // Calendar logic
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDay = days[0].getDay() === 0 ? 6 : days[0].getDay() - 1; // Monday start

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const handleToday = () => setCurrentDate(new Date());

  return (
    <div className="h-full flex flex-col space-y-8 pb-10">
      {/* Header Planning Style from Home Page */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter">
            Mon <span className="text-gold-500">Planning</span>
          </h1>
          <p className="text-lg text-slate-500 font-medium max-w-xl">
            Retrouvez toutes vos sessions de formation réservées et à venir.
          </p>
        </div>
        <div className="flex bg-slate-900 p-2 rounded-2xl shadow-xl">
          <button
            onClick={handlePrevMonth}
            className="p-3 text-white hover:text-gold-500 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="px-6 flex items-center justify-center min-w-[150px]">
            <span className="text-sm font-black text-white uppercase tracking-widest whitespace-nowrap">
              {format(currentDate, 'MMMM yyyy', { locale: fr })}
            </span>
          </div>
          <button
            onClick={handleNextMonth}
            className="p-3 text-white hover:text-gold-500 transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center py-20 bg-white rounded-[3rem] border border-slate-100 shadow-sm">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gold-500 border-t-transparent shadow-xl mb-4" />
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Chargement de votre planning...</span>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Main Grid High Visibility */}
          <div className="bg-white p-6 md:p-10 rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-white">
            {/* Day Labels */}
            <div className="grid grid-cols-7 gap-4 mb-4">
              {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
                <div key={day} className="text-center">
                  <span className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">{day}</span>
                </div>
              ))}
            </div>

            {/* The Grid */}
            <div className="grid grid-cols-7 gap-4 overflow-hidden p-1">
              {Array.from({ length: startDay }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square bg-slate-50 border border-slate-100 rounded-3xl" />
              ))}
              {days.map(day => {
                const dayDate = new Date(day);
                dayDate.setHours(0, 0, 0, 0);

                const dayEvents = events.filter(e => {
                  const s = new Date(e.start);
                  s.setHours(0, 0, 0, 0);
                  const end = new Date(e.end);
                  end.setHours(0, 0, 0, 0);
                  return dayDate >= s && dayDate <= end;
                }).sort((a, b) => a.id.localeCompare(b.id));

                const hasEvents = dayEvents.length > 0;
                const isCurrent = isToday(day);

                return (
                  <div
                    key={day.toString()}
                    className={`relative aspect-square sm:aspect-auto sm:min-h-[140px] p-2 sm:p-4 rounded-3xl border-2 transition-all group/day cursor-pointer ${hasEvents
                      ? "bg-white border-gold-200 shadow-lg shadow-gold-500/5 hover:border-gold-500 hover:scale-[1.02] z-10"
                      : "bg-white border-slate-200 hover:border-slate-300"
                      } ${isCurrent ? 'ring-2 ring-gold-500 ring-offset-4 ring-offset-slate-50' : ''}`}
                    onClick={() => hasEvents && dayEvents.length === 1 && openModal(dayEvents[0])}
                  >
                    <div className="flex justify-between items-start mb-2 relative z-20">
                      <span className={`text-lg sm:text-2xl font-black tabular-nums transition-colors ${isCurrent ? 'text-gold-500' : hasEvents ? 'text-slate-900' : 'text-slate-400'
                        }`}>
                        {format(day, 'd')}
                      </span>
                    </div>

                    <div className="hidden sm:flex flex-col gap-1.5">
                      {dayEvents.slice(0, 3).map((ev, idx) => {
                        const cat = CATEGORY_MAP[ev.courseType] || CATEGORY_MAP.DEFAULT;

                        const s = new Date(ev.start);
                        s.setHours(0, 0, 0, 0);
                        const end = new Date(ev.end);
                        end.setHours(0, 0, 0, 0);

                        const isStart = isSameDay(dayDate, s);
                        const isEnd = isSameDay(dayDate, end);
                        const isMultiDay = !isSameDay(s, end);

                        const dayOfWeek = day.getDay(); // 0 is Sun, 1 is Mon
                        const isWeekStart = dayOfWeek === 1;
                        const isWeekEnd = dayOfWeek === 0;

                        const roundedLeft = isStart || isWeekStart;
                        const roundedRight = isEnd || isWeekEnd;

                        return (
                          <button
                            key={ev.id}
                            onClick={(e) => { e.stopPropagation(); openModal(ev); }}
                            className={`block w-full text-left p-2 rounded-xl transition-all relative z-10 border-l-4 ${cat.border} ${cat.light} group-hover/day:shadow-sm`}
                          >
                            <p className={`truncate text-[11px] font-black uppercase tracking-tight ${cat.text}`}>
                              {ev.title}
                            </p>
                          </button>
                        );
                      })}
                      {dayEvents.length > 3 && (
                        <span className="text-[9px] font-bold text-slate-400 pl-2">+{dayEvents.length - 3} autres</span>
                      )}
                    </div>

                    <div className="sm:hidden flex flex-wrap gap-0.5 justify-center mt-auto">
                      {dayEvents.map((ev, idx) => (
                        <div key={idx} className={`w-1.5 h-1.5 rounded-full ${CATEGORY_MAP[ev.courseType]?.dot || 'bg-slate-400'}`} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Yearly Heatmap Vision */}
          <div className="bg-slate-900 p-8 md:p-12 rounded-[3.5rem] shadow-2xl text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-12 opacity-10">
              <CalendarDays className="w-64 h-64 text-white" />
            </div>

            <div className="relative z-10 mb-10">
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-1">
                Vision Annuelle <span className="text-gold-500">{getYear(currentDate)}</span>
              </h3>
              <p className="text-sm font-medium text-slate-400 italic">Un aperçu rapide de vos engagements sur toute l'année.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6 relative z-10">
              {eachMonthOfInterval({ start: startOfYear(currentDate), end: endOfYear(currentDate) }).map(month => {
                const monthEvents = events.filter(e => isSameMonth(new Date(e.start), month));
                const isSelected = isSameMonth(month, currentDate);

                return (
                  <button
                    key={month.toString()}
                    onClick={() => setCurrentDate(month)}
                    className={`flex flex-col items-center p-5 rounded-3xl border-2 transition-all ${isSelected ? "border-gold-500 bg-white/10 shadow-lg shadow-gold-500/20" : "border-white/5 bg-white/5 hover:bg-white/10"
                      }`}
                  >
                    <span className={`text-[10px] font-black uppercase tracking-widest mb-4 ${isSelected ? 'text-gold-500' : 'text-slate-400'}`}>
                      {format(month, 'MMM', { locale: fr })}
                    </span>
                    <div className="flex gap-1 flex-wrap justify-center min-h-[16px]">
                      {monthEvents.slice(0, 10).map((e, idx) => (
                        <div key={idx} className={`w-2 h-2 rounded-full ${CATEGORY_MAP[e.courseType]?.dot || 'bg-slate-500'}`} />
                      ))}
                      {monthEvents.length > 10 && <div className="text-[8px] font-black text-slate-400">+{monthEvents.length - 10}</div>}
                      {monthEvents.length === 0 && <div className="w-2 h-2 rounded-full bg-white/10" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tips / Legend Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-3">
                <Info className="w-4 h-4 text-gold-500" />
                Légende des catégories
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {Object.entries(CATEGORY_MAP).filter(([k]) => k !== 'DEFAULT').map(([key, config]) => (
                  <div key={key} className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${config.color}`} />
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-tight">{config.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gold-500 p-8 rounded-[2.5rem] shadow-xl shadow-gold-500/20 text-slate-900">
              <p className="text-sm font-bold leading-relaxed">
                Vous pouvez cliquer sur chaque événement pour voir les détails de la session, incluant le lieu et les horaires précis.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tooltip Refined */}
      {activeEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-200"
            onClick={e => e.stopPropagation()}
          >
            <div className={`h-3 ${CATEGORY_MAP[activeEvent.courseType]?.color || 'bg-slate-900'}`} />
            <div className="p-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border-2 ${CATEGORY_MAP[activeEvent.courseType]?.border} ${CATEGORY_MAP[activeEvent.courseType]?.text} ${CATEGORY_MAP[activeEvent.courseType]?.light}`}>
                    {CATEGORY_MAP[activeEvent.courseType]?.label || "Formation"}
                  </span>
                </div>
                <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-2xl transition-all">
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              <h3 className="text-3xl font-black text-slate-900 mb-8 tracking-tighter leading-tight">
                {activeEvent.title}
              </h3>

              <div className="space-y-6 mb-10">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center shrink-0">
                    <CalendarDays className="w-6 h-6 text-slate-900" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Date de la session</p>
                    <p className="text-lg font-black text-slate-900">{format(new Date(activeEvent.start), 'eeee d MMMM yyyy', { locale: fr })}</p>
                  </div>
                </div>

                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6 text-slate-900" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Horaires</p>
                    <p className="text-lg font-black text-slate-900">
                      {format(new Date(activeEvent.start), 'HH:mm')} - {format(new Date(activeEvent.end), 'HH:mm')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center shrink-0">
                    {activeEvent.format === 'VIDEO' ? <Video className="w-6 h-6 text-slate-900" /> :
                      activeEvent.format === 'REMOTE' ? <Monitor className="w-6 h-6 text-slate-900" /> :
                        <MapPin className="w-6 h-6 text-slate-900" />}
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">
                      {activeEvent.format === 'VIDEO' ? 'Format' :
                        activeEvent.format === 'REMOTE' ? 'Plateforme' : 'Lieu / Salle'}
                    </p>
                    <p className="text-lg font-black text-slate-900">
                      {activeEvent.format === 'VIDEO' ? 'E-learning (Vidéo)' :
                        activeEvent.format === 'REMOTE' ? 'Visioconférence' :
                          (activeEvent.location || "Pontault-Combault")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Driving Lesson Specific Info */}
              {activeEvent.type === 'DRIVING_LESSON' && (
                <>
                  <div className="flex items-center gap-5 mt-6">
                    <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center shrink-0">
                      <CheckCircle className="w-6 h-6 text-slate-900" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Statut du cours</p>
                      <p className="text-lg font-black text-slate-900">
                        {activeEvent.status === 'COMPLETED' ? '✓ Terminé' :
                          activeEvent.status === 'CONFIRMED' ? 'Confirmé' :
                            'En attente de confirmation'}
                      </p>
                    </div>
                  </div>

                  {activeEvent.instructorNotes && (
                    <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100 mt-6">
                      <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-3 flex items-center gap-2">
                        <Info className="w-4 h-4" />
                        Notes du moniteur
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed">{activeEvent.instructorNotes}</p>
                    </div>
                  )}

                  {activeEvent.duration && (
                    <div className="flex items-center gap-5 mt-6">
                      <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center shrink-0">
                        <Clock className="w-6 h-6 text-slate-900" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Durée</p>
                        <p className="text-lg font-black text-slate-900">{activeEvent.duration} heure{activeEvent.duration > 1 ? 's' : ''}</p>
                      </div>
                    </div>
                  )}
                </>
              )}

              {activeEvent.slots && activeEvent.slots.length > 0 && (
                <div className="mb-10">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 px-1">Programme / Modules</p>
                  <div className="space-y-3">
                    {activeEvent.slots.map((slot: any) => (
                      <div key={slot.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="flex justify-between items-start mb-1">
                          <p className="font-black text-slate-900 text-sm flex items-center gap-2">
                            {slot.title}
                            {slot.dayNumber && (
                              <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded">
                                J{slot.dayNumber}
                              </span>
                            )}
                          </p>
                          <span className="text-[9px] font-bold text-gold-600 bg-gold-50 px-2 py-0.5 rounded-lg border border-gold-100">
                            {format(new Date(slot.start), 'HH:mm')} - {format(new Date(slot.end), 'HH:mm')}
                            {slot.duration && <span className="ml-1 opacity-60">({slot.duration}h)</span>}
                          </span>
                        </div>
                        {slot.location && slot.location !== activeEvent.location && (
                          <p className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {slot.location}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeEvent.meetingUrl && (
                <a
                  href={activeEvent.meetingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-gold-500 hover:text-slate-900 transition-all shadow-xl mb-4"
                >
                  <MessageSquare className="w-5 h-5" />
                  Rejoindre la visio
                </a>
              )}

              <button
                onClick={closeModal}
                className="w-full py-5 bg-slate-100 text-slate-600 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

