
'use client';

import { Calendar, MapPin, Clock } from 'lucide-react';
import Link from 'next/link';

interface Session {
  id: string;
  startDate: string | Date; // ISO string or Date object
  endDate: string | Date; // ISO string or Date object
  location: string | null;
  maxSpots: number;
  bookedSpots: number;
  course?: {
    title: string;
    slug: string | null;
  };
}

interface SessionCalendarProps {
  sessions: Session[];
  courseTitle?: string; // Titre du cours si on est sur une page de cours spécifique
}

export default function SessionCalendar({ sessions, courseTitle }: SessionCalendarProps) {
  // Sort sessions by date
  const sortedSessions = [...sessions].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  if (sortedSessions.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 text-center">
        <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-slate-700">Aucune session programmée</h3>
        <p className="text-slate-500 text-sm mt-1">Contactez-nous pour connaître les prochaines dates.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
        <Calendar className="w-5 h-5 text-gold-500 mr-2" />
        Prochaines Sessions
      </h3>
      
      <div className="space-y-4">
        {sortedSessions.map((session) => {
          const spotsLeft = session.maxSpots - session.bookedSpots;
          const isFull = spotsLeft <= 0;

          return (
            <div 
              key={session.id} 
              className="group relative bg-white border border-slate-200 rounded-xl p-5 hover:border-gold-500 hover:shadow-md transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                {/* Date Block */}
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center justify-center w-14 h-14 bg-slate-50 rounded-lg border border-slate-200 text-slate-900">
                    <span className="text-xs font-bold uppercase">{new Date(session.startDate).toLocaleString('default', { month: 'short' })}</span>
                    <span className="text-xl font-bold">{new Date(session.startDate).getDate()}</span>
                  </div>
                  
                  <div>
                    {(session.course?.title || courseTitle) && (
                      <h4 className="font-bold text-slate-900 group-hover:text-gold-600 transition">
                        {session.course?.title || courseTitle}
                      </h4>
                    )}
                    <div className="flex items-center text-sm text-slate-500 mt-1 gap-3">
                        <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1" /> {new Date(session.endDate).getDate() - new Date(session.startDate).getDate() + 1} jours</span>
                        {session.location && (
                            <span className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1" /> {session.location}</span>
                        )}
                    </div>
                  </div>
                </div>

                {/* Status & Action */}
                <div className="flex items-center gap-4 md:pl-4 md:border-l md:border-slate-100">
                   <div className="text-right hidden md:block">
                        <div className={`text-sm font-bold ${isFull ? 'text-red-500' : 'text-green-600'}`}>
                            {isFull ? 'Complet' : `${spotsLeft} places dispo.`}
                        </div>
                        <div className="text-xs text-slate-400">sur {session.maxSpots}</div>
                   </div>

                   <a 
                     href="/contact" 
                     className={`px-4 py-2 rounded-lg text-sm font-bold transition ${
                       isFull 
                         ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                         : 'bg-gold-500 text-white hover:bg-gold-600 shadow-sm hover:shadow'
                     }`}
                   >
                     {isFull ? 'Liste d\'attente' : 'Réserver'}
                   </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 text-center">
        {(() => {
          const finalCourseTitle = courseTitle || (sessions.length > 0 && sessions[0].course?.title) || '';
          return (
            <Link 
              href={`/nos-plannings?course=${encodeURIComponent(finalCourseTitle)}`} 
              className="inline-block text-sm font-medium text-gold-600 hover:text-gold-700 hover:underline"
            >
                Voir le calendrier complet →
            </Link>
          );
        })()}
      </div>
    </div>
  );
}

