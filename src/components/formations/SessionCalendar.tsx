
'use client';

import { Calendar, MapPin, Clock } from 'lucide-react';

interface Session {
  id: string;
  startDate: string; // ISO string
  endDate: string; // ISO string
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
        {sortedSessions.map((session) => (
          <div key={session.id} className="group border-l-4 border-gold-500 bg-slate-50 p-4 rounded-r-lg hover:bg-white hover:shadow-md transition cursor-pointer">
            <div className="flex justify-between items-start mb-2">
              {(session.course?.title || courseTitle) && (
                <h4 className="font-semibold text-slate-800 text-sm group-hover:text-gold-600 transition">
                  {session.course?.title || courseTitle}
                </h4>
              )}
             <span className="text-xs font-bold bg-gold-100 text-gold-700 px-2 py-1 rounded">
                {(session.maxSpots - session.bookedSpots) > 0 ? `${session.maxSpots - session.bookedSpots} places` : 'Complet'}
             </span>
            </div>
            
            <div className="space-y-1 text-xs text-slate-500">
              <div className="flex items-center">
                <Clock className="w-3 h-3 mr-1.5" />
                <span>
                    {new Date(session.startDate).toLocaleDateString()} - {new Date(session.endDate).toLocaleDateString()}
                </span>
              </div>
              {session.location && (
                <div className="flex items-center">
                  <MapPin className="w-3 h-3 mr-1.5" />
                  <span>{session.location}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <a href="/contact" className="inline-block text-sm font-medium text-gold-600 hover:text-gold-700 hover:underline">
            Voir le calendrier complet →
        </a>
      </div>
    </div>
  );
}
