'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  Search, 
  Clock, 
  MapPin, 
  ArrowRight, 
  LayoutList, 
  Grid3X3, 
  ChevronLeft, 
  ChevronRight,
  Info,
  Video,
  VideoOff,
  Monitor,
  Map
} from "lucide-react";
import Link from "next/link";
import { 
  format, 
  startOfYear, 
  endOfYear, 
  eachMonthOfInterval, 
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
  getMonth,
  getYear
} from 'date-fns';
import { fr } from 'date-fns/locale';

interface Session {
  id: string;
  startDate: string | Date;
  endDate: string | Date;
  location: string | null;
  maxSpots: number;
  bookedSpots: number;
  course: {
    title: string;
    slug: string | null;
    type: string;
    imageUrl: string | null;
  };
  format?: string;
}

const CATEGORY_MAP: Record<string, { label: string; color: string; border: string; text: string; light: string; dot: string }> = {
  "VTC": { label: "VTC / Taxi", color: "bg-gold-500", border: "border-gold-500", text: "text-gold-600", light: "bg-gold-50", dot: "bg-gold-500" },
  "CACES": { label: "CACES®", color: "bg-blue-600", border: "border-blue-600", text: "text-blue-700", light: "bg-blue-50", dot: "bg-blue-600" },
  "INCENDIE": { label: "Incendie", color: "bg-red-600", border: "border-red-600", text: "text-red-700", light: "bg-red-50", dot: "bg-red-600" },
  "SECOURISME": { label: "Secourisme", color: "bg-green-600", border: "border-green-600", text: "text-green-700", light: "bg-green-50", dot: "bg-green-600" },
  "HABILITATION": { label: "Hab. Élec.", color: "bg-purple-600", border: "border-purple-600", text: "text-purple-700", light: "bg-purple-50", dot: "bg-purple-600" },
  "RECUPERATION_POINTS": { label: "Récupération Points", color: "bg-orange-600", border: "border-orange-600", text: "text-orange-700", light: "bg-orange-50", dot: "bg-orange-600" },
  "TEST_PSYCHOTECHNIQUE": { label: "Test Psychotechnique", color: "bg-pink-500", border: "border-pink-500", text: "text-pink-600", light: "bg-pink-50", dot: "bg-pink-500" },
  "PERMIS": { label: "Permis", color: "bg-slate-900", border: "border-slate-900", text: "text-slate-900", light: "bg-slate-50", dot: "bg-slate-900" },
  "DEFAULT": { label: "Formation", color: "bg-slate-500", border: "border-slate-500", text: "text-slate-600", light: "bg-slate-50", dot: "bg-slate-500" },
};

export default function PlanningClient() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [view, setView] = useState<'list' | 'calendar'>('calendar'); // Default to calendar now
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    async function fetchSessions() {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        if (search) query.append('search', search);
        if (type) query.append('type', type);
        
        const res = await fetch(`/api/planning?${query.toString()}`);
        const data = await res.json();
        setSessions(data);
      } catch (error) {
        console.error("Failed to fetch sessions", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSessions();
  }, [search, type]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const course = params.get('course');
    const typeParam = params.get('type');
    if (course) setSearch(course);
    if (typeParam) setType(typeParam.toUpperCase());
  }, []);

  const filteredSessions = useMemo(() => sessions, [sessions]);

  // Calendar logic
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDay = days[0].getDay() === 0 ? 6 : days[0].getDay() - 1; // Monday start

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const handleToday = () => setCurrentDate(new Date());

  const categories = [
    { label: "Tous", value: "" },
    { label: "VTC / Taxi", value: "VTC" },
    { label: "CACES®", value: "CACES" },
    { label: "Récupération Points", value: "RECUPERATION_POINTS" },
    { label: "Secourisme", value: "SECOURISME" },
    { label: "Incendie", value: "INCENDIE" },
    { label: "Habilitation Élec.", value: "HABILITATION" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      {/* Hero Header */}
      <div className="text-center mb-10">
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-4 uppercase tracking-tighter">
          Nos <span className="text-gold-500">Plannings</span>
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
          Visualisez nos sessions de formation en un clin d'œil et réservez votre place immédiatement.
        </p>
      </div>

      {/* Control Bar */}
      <div className="bg-white p-6 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-white mb-8">
        <div className="flex flex-col lg:flex-row gap-8 items-end">
          
          {/* Search */}
          <div className="w-full lg:max-w-xs">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block px-1">
              Recherche libre
            </label>
            <div className="relative group">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-gold-500 transition-colors" />
               <input 
                 type="text"
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 placeholder="Titre, ville..."
                 className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-gold-500 transition-all text-slate-900 font-bold placeholder:text-slate-300 shadow-sm"
               />
            </div>
          </div>

          {/* Categories */}
          <div className="flex-1 w-full overflow-x-auto no-scrollbar">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block px-1">
              Catégories de formation
            </label>
            <div className="flex flex-nowrap lg:flex-wrap gap-2 pb-2 lg:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat.label}
                  onClick={() => setType(cat.value)}
                  className={`px-5 py-3 rounded-2xl text-xs font-black transition-all border-2 shrink-0 ${
                    type === cat.value
                      ? "bg-gold-500 text-slate-900 border-gold-500 shadow-lg shadow-gold-500/20 -translate-y-0.5"
                      : "bg-white text-slate-500 border-slate-100 hover:border-gold-200 hover:text-gold-600"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* View Toggles */}
          <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner shrink-0">
            <button 
              onClick={() => setView('calendar')}
              className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${view === 'calendar' ? 'bg-white shadow-md text-slate-900 font-bold' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <CalendarIcon className="w-4 h-4" />
              <span className="text-[10px] uppercase font-black tracking-widest">Calendrier</span>
            </button>
            <button 
              onClick={() => setView('list')}
              className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${view === 'list' ? 'bg-white shadow-md text-slate-900 font-bold' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <LayoutList className="w-4 h-4" />
              <span className="text-[10px] uppercase font-black tracking-widest">Liste</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative">
        {loading && (
          <div className="absolute inset-x-0 top-0 pt-20 z-10 flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gold-500 border-t-transparent shadow-xl mb-4" />
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Actualisation...</span>
          </div>
        )}

        <div className={`transition-opacity duration-300 ${loading ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
          {view === 'calendar' ? (
            /* DETAILED MONTHLY VIEW */
            <div className="space-y-8">
              {/* Calendar Header Controls */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-slate-900 p-6 rounded-[2.5rem] shadow-2xl">
                 <div className="flex items-center gap-6">
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
                      {format(currentDate, 'MMMM', { locale: fr })} <span className="text-gold-500">{format(currentDate, 'yyyy')}</span>
                    </h2>
                 </div>
                 <div className="flex items-center gap-2">
                    <button 
                      onClick={handlePrevMonth}
                      className="p-3 bg-slate-800 text-white rounded-2xl hover:bg-gold-500 hover:text-slate-900 transition-all active:scale-90 border border-slate-700"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button 
                      onClick={handleToday}
                      className="px-6 py-3 bg-slate-800 text-white rounded-2xl hover:bg-white hover:text-slate-900 transition-all font-black text-[10px] uppercase tracking-widest border border-slate-700"
                    >
                      Aujourd'hui
                    </button>
                    <button 
                      onClick={handleNextMonth}
                      className="p-3 bg-slate-800 text-white rounded-2xl hover:bg-gold-500 hover:text-slate-900 transition-all active:scale-90 border border-slate-700"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                 </div>
              </div>

              {/* Day Labels */}
              <div className="grid grid-cols-7 gap-4 mb-4">
                {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].map(day => (
                  <div key={day} className="text-center">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hidden sm:block">{day}</span>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 sm:hidden">{day[0]}</span>
                  </div>
                ))}
              </div>

              {/* The Grid */}
              <div className="grid grid-cols-7 gap-4">
                {Array.from({ length: startDay }).map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square sm:aspect-video bg-slate-100/30 rounded-3xl" />
                ))}
                {days.map(day => {
                   const daySessions = filteredSessions.filter(s => isSameDay(new Date(s.startDate), day));
                   const hasSessions = daySessions.length > 0;
                   const isCurrent = isToday(day);

                   return (
                     <div 
                       key={day.toString()} 
                       className={`relative aspect-square sm:aspect-auto sm:min-h-[140px] p-2 sm:p-4 rounded-3xl border-2 transition-all group/day ${
                         hasSessions 
                           ? "bg-white border-gold-200 shadow-lg shadow-gold-500/5 hover:border-gold-500 hover:scale-[1.02] z-10" 
                           : "bg-white border-slate-100 hover:border-slate-200"
                       } ${isCurrent ? 'ring-2 ring-gold-500 ring-offset-4 ring-offset-slate-50' : ''}`}
                     >
                       {/* Day number */}
                       <div className="flex justify-between items-start mb-2">
                         <span className={`text-lg sm:text-2xl font-black tabular-nums transition-colors ${
                           isCurrent ? 'text-gold-500' : hasSessions ? 'text-slate-900' : 'text-slate-400'
                         }`}>
                           {format(day, 'd')}
                         </span>
                         {hasSessions && (
                           <div className="bg-gold-100 text-gold-600 text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-full sm:hidden">
                             {daySessions.length}
                           </div>
                         )}
                       </div>

                       {/* Session items (Desktop only) */}
                       <div className="hidden sm:flex flex-col gap-1.5">
                         {daySessions.slice(0, 3).map(s => {
                           const cat = CATEGORY_MAP[s.course.type] || CATEGORY_MAP.DEFAULT;
                           return (
                             <Link 
                               key={s.id}
                               href={`/formations/${s.course.slug}`}
                               className={`block p-2 rounded-xl border-l-4 ${cat.border} ${cat.light} group-hover/day:shadow-sm transition-all`}
                             >
                                <p className={`truncate text-[9px] font-black uppercase tracking-tight ${cat.text}`}>
                                  {s.course.title}
                                </p>
                             </Link>
                           );
                         })}
                         {daySessions.length > 3 && (
                           <span className="text-[9px] font-bold text-slate-400 pl-2">+{daySessions.length - 3} autres...</span>
                         )}
                       </div>

                       {/* Mobile session indicator */}
                       <div className="sm:hidden flex flex-wrap gap-0.5 justify-center mt-auto">
                          {daySessions.map(s => (
                            <div key={s.id} className={`w-1.5 h-1.5 rounded-full ${CATEGORY_MAP[s.course.type]?.dot || 'bg-slate-400'}`} />
                          ))}
                       </div>

                       {/* Detailed Tooltip on Mobile-Tap or Grid-Click could go here, but focusing on visibility first */}
                     </div>
                   );
                })}
              </div>

              {/* Legend & Summary */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8 items-start">
                  {/* Legend */}
                  <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                      <Info className="w-4 h-4" />
                      Légende des catégories
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                      {Object.entries(CATEGORY_MAP).filter(([k]) => k !== 'DEFAULT').map(([key, config]) => (
                        <div key={key} className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-lg shadow-sm ${config.color}`} />
                          <span className="text-[11px] font-black text-slate-600 uppercase tracking-tight">{config.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gold-500 p-8 rounded-[2.5rem] shadow-xl shadow-gold-500/20 text-slate-900">
                     <h3 className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Bilan du mois</h3>
                     <div className="text-4xl font-black mb-6 tracking-tighter">
                        {filteredSessions.filter(s => isSameMonth(new Date(s.startDate), currentDate)).length} <span className="text-xl uppercase opacity-80">sessions</span>
                     </div>
                     <div className="space-y-4">
                        <div className="flex items-center gap-3">
                           <Map className="w-4 h-4 opacity-60" />
                           <p className="text-xs font-bold leading-tight">Présentiel : Sessions en centre avec formateur.</p>
                        </div>
                        <div className="flex items-center gap-3">
                           <Monitor className="w-4 h-4 opacity-60" />
                           <p className="text-xs font-bold leading-tight">Distanciel : Cours en direct via visioconférence.</p>
                        </div>
                        <div className="flex items-center gap-3">
                           <Video className="w-4 h-4 opacity-60" />
                           <p className="text-xs font-bold leading-tight">Vidéo : Accès immédiat au contenu E-learning.</p>
                        </div>
                     </div>
                  </div>
              </div>

              {/* YEARLY OVERVIEW (COMPACT HEATMAP) */}
              <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
                   <div>
                      <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-1">Vision Annuelle <span className="text-gold-500">{getYear(currentDate)}</span></h3>
                      <p className="text-xs font-bold text-slate-400">Densité des formations prévues sur l'ensemble de l'année.</p>
                   </div>
                   <div className="flex gap-2">
                      <button onClick={() => setCurrentDate(subYears(currentDate, 1))} className="p-2 hover:bg-slate-100 rounded-xl transition-all"><ChevronLeft className="w-5 h-5"/></button>
                      <button onClick={() => setCurrentDate(addYears(currentDate, 1))} className="p-2 hover:bg-slate-100 rounded-xl transition-all"><ChevronRight className="w-5 h-5"/></button>
                   </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6">
                   {eachMonthOfInterval({ start: startOfYear(currentDate), end: endOfYear(currentDate) }).map(month => {
                      const monthSessions = filteredSessions.filter(s => isSameMonth(new Date(s.startDate), month));
                      const isTargetMonth = isSameMonth(month, currentDate);

                      return (
                        <button 
                          key={month.toString()}
                          onClick={() => setCurrentDate(month)}
                          className={`flex flex-col items-center p-4 rounded-2xl border-2 transition-all ${
                            isTargetMonth ? "border-gold-500 bg-gold-50" : "border-slate-50 bg-slate-50/50 hover:bg-white hover:border-slate-200"
                          }`}
                        >
                           <span className={`text-[10px] font-black uppercase tracking-widest mb-3 ${isTargetMonth ? 'text-gold-600' : 'text-slate-400'}`}>
                             {format(month, 'MMM', { locale: fr })}
                           </span>
                           <div className="flex gap-1 flex-wrap justify-center min-h-[16px]">
                              {monthSessions.slice(0, 12).map((s, idx) => (
                                <div key={idx} className={`w-2 h-2 rounded-full ${CATEGORY_MAP[s.course.type]?.dot || 'bg-slate-300'}`} />
                              ))}
                              {monthSessions.length > 12 && <div className="text-[8px] font-black text-slate-400">+{monthSessions.length - 12}</div>}
                              {monthSessions.length === 0 && <div className="w-2 h-2 rounded-full bg-slate-200 opacity-30" />}
                           </div>
                        </button>
                      );
                   })}
                </div>
              </div>
            </div>
          ) : (
            /* LIST VIEW (Already refined previously) */
            <div className="grid gap-6">
               {filteredSessions.length > 0 ? (
                filteredSessions.map((session) => {
                  const cat = CATEGORY_MAP[session.course.type] || CATEGORY_MAP.DEFAULT;
                  const spotsLeft = session.maxSpots - session.bookedSpots;
                  const isFull = spotsLeft <= 0;

                  return (
                    <div 
                      key={session.id}
                      className="group bg-white rounded-[2.5rem] p-8 border-2 border-transparent hover:border-gold-500 shadow-xl shadow-slate-200/60 hover:shadow-2xl hover:shadow-gold-500/10 transition-all duration-300 flex flex-col md:flex-row md:items-center gap-10"
                    >
                      <div className={`flex flex-col items-center justify-center w-28 h-28 rounded-[2.2rem] text-white shadow-xl shrink-0 group-hover:rotate-3 transition-transform duration-300 ${cat.color}`}>
                        <span className="text-xs font-black uppercase tracking-[0.2em] opacity-80 mb-1">
                          {format(new Date(session.startDate), 'MMM', { locale: fr })}
                        </span>
                        <span className="text-5xl font-black leading-none tracking-tighter">
                          {format(new Date(session.startDate), 'dd')}
                        </span>
                      </div>

                      <div className="flex-1">
                         <div className="flex items-center gap-3 mb-4">
                           <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border-2 ${cat.border} ${cat.text} ${cat.light}`}>
                             {cat.label}
                           </span>
                           {isFull ? (
                             <span className="px-5 py-2 bg-red-50 text-red-600 border-2 border-red-100 rounded-full text-[10px] font-black uppercase tracking-widest">
                               Complet
                             </span>
                           ) : (
                             <span className="flex items-center gap-2 text-green-600 font-black text-[10px] uppercase tracking-widest bg-green-50 px-5 py-2 rounded-full border-2 border-green-100">
                               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                               {spotsLeft} places dispo.
                             </span>
                           )}
                         </div>
                         <h3 className="text-3xl font-black text-slate-900 mb-6 tracking-tight leading-tight group-hover:text-gold-600 transition-colors">
                           {session.course.title}
                         </h3>
                         <div className="flex flex-wrap gap-x-10 gap-y-4 text-sm font-bold text-slate-400 uppercase tracking-widest">
                            <div className="flex items-center gap-3">
                               <MapPin className="w-5 h-5 text-gold-500" />
                               {session.location || "Pontault-Combault"}
                            </div>
                            <div className="flex items-center gap-3">
                               <Clock className="w-5 h-5 text-gold-500" />
                               Du {format(new Date(session.startDate), 'dd/MM')} au {format(new Date(session.endDate), 'dd/MM/yyyy')}
                            </div>
                         </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full md:w-auto">
                         <Link 
                           href={`/formations/${session.course.slug}`}
                           className="w-full sm:w-auto px-10 py-5 bg-slate-50 text-slate-900 font-black text-xs uppercase tracking-widest rounded-3xl border-2 border-slate-100 hover:bg-slate-100 transition-all active:scale-95 text-center"
                         >
                           Explorer
                         </Link>
                         
                         {session.format === 'VIDEO' ? (
                           <Link 
                             href={`/learn/${session.course.slug}`}
                             className="w-full sm:w-auto px-12 py-5 bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded-3xl transition-all shadow-xl active:scale-95 flex items-center justify-center gap-4 hover:bg-gold-500 hover:text-slate-900"
                           >
                             Voir Formation
                             <Video className="w-4 h-4" />
                           </Link>
                         ) : (
                           <Link 
                             href={isFull ? "/contact" : `/api/checkout-redirect?courseId=${session.id}&sessionId=${session.id}`}
                             className={`w-full sm:w-auto px-12 py-5 font-black text-xs uppercase tracking-widest rounded-3xl transition-all shadow-xl active:scale-95 flex items-center justify-center gap-4 ${
                               isFull 
                                 ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                                 : 'bg-gold-500 text-slate-900 hover:bg-gold-600 shadow-gold-500/30'
                             }`}
                           >
                             {isFull ? 'Complet' : (session.format === 'REMOTE' ? 'S\'inscrire (Visio)' : 'Réserver (Centre)')}
                             <ArrowRight className="w-4 h-4" />
                           </Link>
                         )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <EmptyState onReset={() => { setSearch(''); setType(''); }} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="text-center py-32 bg-white rounded-[3rem] border-4 border-dashed border-slate-100">
      <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
        <CalendarIcon className="w-10 h-10 text-slate-200" />
      </div>
      <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter uppercase">Aucun résultat</h3>
      <p className="text-slate-500 mb-12 max-w-sm mx-auto font-medium">
        Nous n'avons trouvé aucune session correspondant exactement à vos filtres.
      </p>
      <button 
        onClick={onReset}
        className="px-12 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-gold-500 hover:text-slate-900 transition-all shadow-2xl active:scale-95"
      >
        Réinitialiser tout
      </button>
    </div>
  );
}

