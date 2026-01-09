"use client";

import { useState } from "react";
import { updateBookingStatusAction } from "../actions";
import { MoreVertical, UserX, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

interface Participant {
    id: string;
    userId: string;
    status: string;
    justification: string | null;
    user: {
        id: string;
        name: string | null;
        email: string;
    };
}

interface ParticipantListProps {
    bookings: Participant[];
    sessionId: string;
}

export default function ParticipantList({ bookings, sessionId }: ParticipantListProps) {
    const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
    const [actionType, setActionType] = useState<"DELETE" | "ON_HOLD" | null>(null);
    const [justification, setJustification] = useState("");
    const [loading, setLoading] = useState(false);

    const handleActionClick = (bookingId: string, type: "DELETE" | "ON_HOLD") => {
        setSelectedBookingId(bookingId);
        setActionType(type);
        setJustification("");
    };

    const handleConfirm = async () => {
        if (!selectedBookingId || !actionType) return;
        setLoading(true);

        const formData = new FormData();
        formData.append("sessionId", sessionId);
        formData.append("bookingId", selectedBookingId);
        formData.append("action", actionType);
        if (actionType === "ON_HOLD") {
            formData.append("justification", justification);
        }

        await updateBookingStatusAction(formData);

        setLoading(false);
        setSelectedBookingId(null);
        setActionType(null);
    };

    const handleValidate = async (bookingId: string) => {
        if (!confirm("Valider et réintégrer cet élève ?")) return;
        const formData = new FormData();
        formData.append("sessionId", sessionId);
        formData.append("bookingId", bookingId);
        formData.append("action", "VALIDATE");
        await updateBookingStatusAction(formData);
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    <div className="bg-indigo-100 p-2 rounded-lg">
                         <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                         </svg>
                    </div>
                    Participants <span className="ml-2 px-2 py-0.5 bg-slate-100 text-slate-500 text-xs rounded-full">{bookings.filter(b => b.status === "BOOKED").length}</span>
                </h2>
            </div>
            <div className="overflow-x-auto">
                {bookings.length === 0 ? (
                    <div className="p-12 text-center text-slate-400">
                        Aucun participant inscrit.
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Élève</th>
                                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Email</th>
                                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Statut</th>
                                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {bookings.map((booking) => (
                                <tr key={booking.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full border flex items-center justify-center font-bold text-xs ${booking.status === "ON_HOLD" ? "bg-amber-100 border-amber-200 text-amber-700" : "bg-indigo-50 border-indigo-100 text-indigo-600"}`}>
                                                {booking.user.name?.charAt(0) || "U"}
                                            </div>
                                            <span className={`font-medium ${booking.status === "ON_HOLD" ? "text-slate-500 line-through decoration-slate-400" : "text-slate-900"}`}>
                                                {booking.user.name}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 text-sm">
                                        {booking.user.email}
                                    </td>
                                    <td className="px-6 py-4">
                                        {booking.status === "ON_HOLD" ? (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800" title={booking.justification || "Aucune raison"}>
                                                <Clock className="w-3 h-3" /> En attente
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                <CheckCircle className="w-3 h-3" /> Confirmé
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                                        <Link href={`/admin/users/${booking.user.id}`} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors" title="Voir profil">
                                            <ExternalLink className="w-4 h-4" />
                                        </Link>
                                        
                                        <div className="relative group/menu">
                                            <button className="p-2 text-slate-400 hover:text-slate-600">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-100 py-1 hidden group-hover/menu:block z-10">
                                                {booking.status === "ON_HOLD" ? (
                                                    <button 
                                                        onClick={() => handleValidate(booking.id)}
                                                        className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50 flex items-center gap-2"
                                                    >
                                                        <CheckCircle className="w-4 h-4" /> Réintégrer
                                                    </button>
                                                ) : (
                                                    <button 
                                                        onClick={() => handleActionClick(booking.id, "ON_HOLD")}
                                                        className="w-full text-left px-4 py-2 text-sm text-amber-600 hover:bg-amber-50 flex items-center gap-2"
                                                    >
                                                        <Clock className="w-4 h-4" /> Mettre en attente
                                                    </button>
                                                )}
                                                <button 
                                                    onClick={() => handleActionClick(booking.id, "DELETE")}
                                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                                >
                                                    <UserX className="w-4 h-4" /> Supprimer
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* ACTION MODAL */}
            {selectedBookingId && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200">
                        <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                            {actionType === "DELETE" ? (
                                <>
                                    <UserX className="w-5 h-5 text-red-500" /> Supprimer le participant
                                </>
                            ) : (
                                <>
                                    <AlertTriangle className="w-5 h-5 text-amber-500" /> Mettre en attente
                                </>
                            )}
                        </h3>
                        
                        <p className="text-sm text-slate-600 mb-4">
                            {actionType === "DELETE" 
                                ? "Êtes-vous sûr de vouloir supprimer cet élève de la session ? Cette action libérera une place." 
                                : "L'élève sera mis en attente et sa place ne sera pas officiellement libérée (il reste dans la liste)."}
                        </p>

                        {actionType === "ON_HOLD" && (
                            <div className="mb-4">
                                <label className="block text-xs font-medium text-slate-700 mb-1">Raison (Obligatoire)</label>
                                <textarea 
                                    className="w-full border-slate-300 rounded-lg text-sm"
                                    rows={3}
                                    placeholder="Ex: Dossier incomplet, paiement non reçu..."
                                    value={justification}
                                    onChange={(e) => setJustification(e.target.value)}
                                />
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button 
                                onClick={() => { setSelectedBookingId(null); setActionType(null); }}
                                className="flex-1 py-2 border rounded-lg hover:bg-slate-50 text-sm font-medium"
                            >
                                Annuler
                            </button>
                            <button 
                                onClick={handleConfirm}
                                disabled={loading || (actionType === "ON_HOLD" && !justification)}
                                className={`flex-1 py-2 rounded-lg text-white text-sm font-bold shadow-sm ${
                                    actionType === "DELETE" ? "bg-red-500 hover:bg-red-600" : "bg-amber-500 hover:bg-amber-600"
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {loading ? "Traitement..." : "Confirmer"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

