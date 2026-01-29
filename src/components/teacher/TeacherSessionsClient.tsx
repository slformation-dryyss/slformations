"use client";

import { useState, useEffect } from "react";
import { Calendar, Users, GraduationCap, ArrowRight, RefreshCw, MapPin } from "lucide-react";
import { getTeacherSessions } from "@/app/dashboard/teacher/sessions/actions";
import { AttendanceList } from "@/components/teacher/AttendanceList";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function TeacherSessionsClient() {
    const [sessions, setSessions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSession, setSelectedSession] = useState<any | null>(null);

    useEffect(() => {
        loadSessions();
    }, []);

    async function loadSessions() {
        setLoading(true);
        const result = await getTeacherSessions();
        if (result.success && result.data) {
            setSessions(result.data);
        }
        setLoading(false);
    }

    if (selectedSession) {
        return (
            <AttendanceList
                sessionId={selectedSession.id}
                sessionTitle={`${selectedSession.course.title} - ${format(new Date(selectedSession.startDate), "d MMMM yyyy", { locale: fr })}`}
                onBack={() => {
                    setSelectedSession(null);
                    loadSessions(); // Refresh to see updated counts/status if needed
                }}
            />
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Mes Sessions</h1>
                <p className="text-slate-500 mt-1">Gérez vos formations professionnelles et l&apos;émargement</p>
            </div>

            {loading ? (
                <div className="text-center py-20">
                    <RefreshCw className="w-10 h-10 animate-spin text-gold-500 mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">Chargement de votre planning...</p>
                </div>
            ) : sessions.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
                    <Calendar className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Aucune session assignée</h3>
                    <p className="text-slate-500 max-w-sm mx-auto">
                        Vous n&apos;avez pas encore de sessions de formation planifiées pour le moment.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sessions.map((session) => (
                        <div
                            key={session.id}
                            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all group border-l-4 border-l-gold-500"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-slate-50 rounded-lg text-gold-600">
                                    <GraduationCap className="w-6 h-6" />
                                </div>
                                <span className="px-2 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold rounded uppercase">
                                    {session.course.type}
                                </span>
                            </div>

                            <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 min-h-[3.5rem]">
                                {session.course.title}
                            </h3>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center text-sm text-slate-600 gap-2">
                                    <Calendar className="w-4 h-4 text-slate-400" />
                                    <span>{format(new Date(session.startDate), "EEEE d MMMM yyyy", { locale: fr })}</span>
                                </div>
                                <div className="flex items-center text-sm text-slate-600 gap-2">
                                    <MapPin className="w-4 h-4 text-slate-400" />
                                    <span className="truncate">{session.location || "Lieu à confirmer"}</span>
                                </div>
                                <div className="flex items-center text-sm text-slate-600 gap-2">
                                    <Users className="w-4 h-4 text-slate-400" />
                                    <span>{session._count.bookings} / {session.maxSpots} stagiaires</span>
                                </div>
                            </div>

                            <button
                                onClick={() => setSelectedSession(session)}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition group"
                            >
                                <span>Faire l&apos;émargement</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
