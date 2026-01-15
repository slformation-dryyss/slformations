"use client";

import { useState, useMemo } from "react";
import { createManualPaymentLinkAction } from "../actions";
import { Copy, Check, Loader2, Send, Search, AlertCircle, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface User {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
    enrollments: {
        courseId: string;
        status: string; // "PENDING", "ACTIVE", "COMPLETED", "CANCELLED"
    }[];
}

interface Course { id: string; title: string; price: number; }

export default function ClientPaymentForm({ users, courses }: { users: User[], courses: Course[] }) {
    const router = useRouter();
    const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    // Search state
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedUserId, setSelectedUserId] = useState("");
    const [amount, setAmount] = useState("");
    const [selectedCourseId, setSelectedCourseId] = useState("");

    // Confirmation Modal State
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    // Filter users based on search (Name, Email, Phone)
    const filteredUsers = useMemo(() => {
        if (!searchQuery) return users;
        const lowerQuery = searchQuery.toLowerCase();
        return users.filter(user =>
            (user.firstName && user.firstName.toLowerCase().includes(lowerQuery)) ||
            (user.lastName && user.lastName.toLowerCase().includes(lowerQuery)) ||
            user.email.toLowerCase().includes(lowerQuery) ||
            (user.phone && user.phone.toLowerCase().includes(lowerQuery))
        );
    }, [users, searchQuery]);

    // Enrichir la liste des cours avec le statut de l'élève sélectionné
    const enrichedCourses = useMemo(() => {
        if (!selectedUserId) return [];
        const user = users.find(u => u.id === selectedUserId);
        if (!user) return [];

        const enrolledCourseIds = new Set(user.enrollments.map(e => e.courseId));
        const paidCourseIds = new Set(
            user.enrollments
                .filter(e => e.status === "ACTIVE" || e.status === "COMPLETED")
                .map(e => e.courseId)
        );

        return courses.map(course => ({
            ...course,
            isEnrolled: enrolledCourseIds.has(course.id),
            isPaid: paidCourseIds.has(course.id)
        }));
    }, [courses, users, selectedUserId]);

    // Conserver la liste des cours "impayés" uniquement pour l'affichage du compteur informatif
    const unpaidCount = enrichedCourses.filter(c => c.isEnrolled && !c.isPaid).length;

    const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const courseId = e.target.value;
        setSelectedCourseId(courseId);
        if (courseId) {
            const course = courses.find(c => c.id === courseId);
            if (course) {
                setAmount(course.price.toString());
            }
        } else {
            setAmount("");
        }
    };

    const handleInitialSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowConfirmModal(true);
    };

    const handleConfirmAndGenerate = async () => {
        setLoading(true);
        setError(null);
        setGeneratedUrl(null);
        setShowConfirmModal(false);

        const formData = new FormData();
        formData.append("userId", selectedUserId);
        formData.append("courseId", selectedCourseId);
        formData.append("amount", amount);

        const result = await createManualPaymentLinkAction(formData);

        if (result.error) {
            setError(result.error);
        } else if (result.url) {
            setGeneratedUrl(result.url);
        }
        setLoading(false);
    };

    const copyToClipboard = () => {
        if (generatedUrl) {
            navigator.clipboard.writeText(generatedUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const selectedUser = users.find(u => u.id === selectedUserId);
    const selectedCourse = courses.find(c => c.id === selectedCourseId);

    return (
        <div className="space-y-6 relative">
            <form onSubmit={handleInitialSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700">Rechercher un élève</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Nom, prénom, email ou téléphone..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 border-slate-300 rounded-md shadow-sm focus:border-gold-500 focus:ring-gold-500 text-sm"
                            />
                        </div>

                        <label className="block text-sm font-medium text-slate-700 mt-2">Sélectionner l'élève</label>
                        <select
                            name="userId"
                            required
                            className="w-full border-slate-300 rounded-md shadow-sm focus:border-gold-500 focus:ring-gold-500"
                            value={selectedUserId}
                            onChange={(e) => setSelectedUserId(e.target.value)}
                        >
                            <option value="">-- Sélectionner un élève ({filteredUsers.length}) --</option>
                            {filteredUsers.map(u => {
                                const displayName = u.firstName && u.lastName
                                    ? `${u.firstName} ${u.lastName}`
                                    : u.email;
                                return (
                                    <option key={u.id} value={u.id}>
                                        {displayName} ({u.email})
                                    </option>
                                );
                            })}
                        </select>
                        {searchQuery && filteredUsers.length === 0 && (
                            <p className="text-xs text-red-500">Aucun élève trouvé pour "{searchQuery}"</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Formation (Formations impayées)
                        </label>
                        <select
                            name="courseId"
                            required
                            className="w-full border-slate-300 rounded-md shadow-sm focus:border-gold-500 focus:ring-gold-500 disabled:bg-slate-100 disabled:text-slate-400"
                            disabled={!selectedUserId}
                            value={selectedCourseId}
                            onChange={handleCourseChange}
                        >
                            <option value="">-- Sélectionner une formation --</option>
                            {enrichedCourses.length > 0 ? (
                                enrichedCourses.map((c: any) => (
                                    <option key={c.id} value={c.id}>
                                        {c.title} - {c.price}€ {c.isPaid ? "✅" : c.isEnrolled ? "⏳" : ""}
                                    </option>
                                ))
                            ) : (
                                selectedUserId && <option value="" disabled>Aucune formation disponible</option>
                            )}
                        </select>

                        {selectedUserId && (
                            <div className="mt-1">
                                {unpaidCount > 0 ? (
                                    <p className="text-xs text-slate-500">
                                        {unpaidCount} formation(s) en attente de paiement.
                                    </p>
                                ) : (
                                    <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                                        <Check className="w-3 h-3" /> Cet élève est à jour (ou non inscrit).
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="pt-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Montant (€)</label>
                    <input
                        type="number"
                        name="amount"
                        step="0.01"
                        required
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Ex: 1500.00"
                        className="w-full md:w-1/2 border-slate-300 rounded-md shadow-sm focus:border-gold-500 focus:ring-gold-500"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading || !selectedUserId || !amount}
                    className="w-full bg-slate-900 text-white py-2 px-4 rounded-md hover:bg-slate-800 disabled:opacity-50 flex items-center justify-center font-bold transition-colors"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : "Générer le lien de paiement"}
                </button>

                {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
            </form>

            {/* CONFIRMATION MODAL */}
            {showConfirmModal && selectedUser && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-gold-500" />
                                Confirmer la génération
                            </h3>
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-lg space-y-3 mb-6">
                            <div>
                                <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Élève</span>
                                <p className="font-medium text-slate-900">
                                    {selectedUser.firstName} {selectedUser.lastName}
                                </p>
                                <p className="text-sm text-slate-500">{selectedUser.email}</p>
                            </div>

                            <div className="h-px bg-slate-200" />

                            <div>
                                <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Formation</span>
                                <p className="font-medium text-slate-900">
                                    {selectedCourse ? selectedCourse.title : "Formation personnalisée"}
                                </p>
                            </div>

                            <div className="h-px bg-slate-200" />

                            <div>
                                <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Montant à régler</span>
                                <p className="text-2xl font-bold text-slate-900">{amount} €</p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="flex-1 py-2 px-4 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleConfirmAndGenerate}
                                className="flex-1 py-2 px-4 bg-gold-500 text-navy-900 rounded-lg font-bold hover:bg-gold-600 transition-colors shadow-sm"
                            >
                                Confirmer et Générer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {generatedUrl && (
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg animate-in fade-in slide-in-from-top-2">
                    <h3 className="text-green-800 font-bold mb-2 flex items-center gap-2">
                        <Check className="w-5 h-5" /> Lien créé avec succès
                    </h3>
                    <div className="flex items-center gap-2">
                        <input
                            readOnly
                            value={generatedUrl}
                            className="flex-1 bg-white border-green-300 text-slate-600 text-sm p-2 rounded focus:ring-0"
                        />
                        <button
                            onClick={copyToClipboard}
                            className="bg-green-100 hover:bg-green-200 text-green-800 p-2 rounded transition-colors"
                            title="Copier"
                        >
                            {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                        </button>
                    </div>

                    <div className="mt-4 flex gap-3">
                        <a
                            href={`mailto:?subject=Lien de paiement - Formation&body=Bonjour, voici le lien pour régler votre formation : ${generatedUrl}`}
                            className="text-sm font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                        >
                            <Send className="w-4 h-4" /> Envoyer par email (Client mail)
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}
