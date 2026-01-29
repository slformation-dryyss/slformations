"use client";

import { useState, useEffect } from "react";
import { User, CheckCircle, XCircle, RefreshCw, ChevronLeft } from "lucide-react";
import { getSessionAttendees, updateAttendance } from "@/app/dashboard/teacher/sessions/actions";

interface AttendanceListProps {
    sessionId: string;
    sessionTitle: string;
    onBack: () => void;
}

export function AttendanceList({ sessionId, sessionTitle, onBack }: AttendanceListProps) {
    const [attendees, setAttendees] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<string | null>(null);

    useEffect(() => {
        loadAttendees();
    }, [sessionId]);

    async function loadAttendees() {
        setLoading(true);
        const result = await getSessionAttendees(sessionId);
        if (result.success && result.data) {
            setAttendees(result.data);
        }
        setLoading(false);
    }

    async function handleStatusChange(bookingId: string, newStatus: "PRESENT" | "ABSENT" | "BOOKED") {
        setUpdating(bookingId);
        const result = await updateAttendance(bookingId, newStatus);
        if (result.success) {
            setAttendees(prev => prev.map(a => a.id === bookingId ? { ...a, status: newStatus } : a));
        } else {
            alert("Erreur lors de la mise à jour");
        }
        setUpdating(null);
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <button
                    onClick={onBack}
                    className="flex items-center text-slate-500 hover:text-slate-900 transition mb-2"
                >
                    <ChevronLeft className="w-5 h-5 mr-1" />
                    Retour aux sessions
                </button>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-slate-900">{sessionTitle}</h2>
                    <p className="text-slate-500 text-sm">Émargement numérique des stagiaires</p>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <RefreshCw className="w-8 h-8 animate-spin text-gold-500 mx-auto mb-4" />
                        <p className="text-slate-500">Chargement des participants...</p>
                    </div>
                ) : attendees.length === 0 ? (
                    <p className="text-center py-12 text-slate-500 italic">Aucun élève inscrit à cette session.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-100 italic text-slate-400 text-xs">
                                    <th className="pb-4 font-medium">Stagiaire</th>
                                    <th className="pb-4 font-medium">Contact / NEPH</th>
                                    <th className="pb-4 font-medium text-center">Status</th>
                                    <th className="pb-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {attendees.map((booking) => (
                                    <tr key={booking.id} className="group">
                                        <td className="py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                                                    <User className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900">
                                                        {booking.user.lastName?.toUpperCase()} {booking.user.firstName}
                                                    </p>
                                                    <p className="text-xs text-slate-500">ID: {booking.user.id.slice(-6)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <p className="text-sm text-slate-600">{booking.user.email}</p>
                                            {booking.user.nationalIdNumber && (
                                                <p className="text-xs font-mono text-slate-400">NEPH: {booking.user.nationalIdNumber}</p>
                                            )}
                                        </td>
                                        <td className="py-4 text-center">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${booking.status === "PRESENT" ? "bg-green-100 text-green-700" :
                                                    booking.status === "ABSENT" ? "bg-red-100 text-red-700" :
                                                        "bg-slate-100 text-slate-600"
                                                }`}>
                                                {booking.status === "PRESENT" ? "Présent" :
                                                    booking.status === "ABSENT" ? "Absent" :
                                                        "Inscrit"}
                                            </span>
                                        </td>
                                        <td className="py-4 text-right">
                                            {updating === booking.id ? (
                                                <RefreshCw className="w-5 h-5 animate-spin text-slate-300 ml-auto" />
                                            ) : (
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleStatusChange(booking.id, booking.status === "PRESENT" ? "BOOKED" : "PRESENT")}
                                                        className={`p-2 rounded-lg transition ${booking.status === "PRESENT"
                                                                ? "bg-green-500 text-white"
                                                                : "bg-slate-50 text-slate-400 hover:bg-green-50 hover:text-green-500"
                                                            }`}
                                                        title="Marquer Présent"
                                                    >
                                                        <CheckCircle className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusChange(booking.id, booking.status === "ABSENT" ? "BOOKED" : "ABSENT")}
                                                        className={`p-2 rounded-lg transition ${booking.status === "ABSENT"
                                                                ? "bg-red-500 text-white"
                                                                : "bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500"
                                                            }`}
                                                        title="Marquer Absent"
                                                    >
                                                        <XCircle className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
