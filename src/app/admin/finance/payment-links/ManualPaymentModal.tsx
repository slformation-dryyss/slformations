"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createManualPayment } from "../actions";

interface ManualPaymentModalProps {
    users: { id: string; email: string; firstName: string | null; lastName: string | null }[];
    courses: { id: string; title: string }[];
}

export function ManualPaymentModal({ users, courses }: ManualPaymentModalProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Form states
    const [userId, setUserId] = useState("");
    const [courseId, setCourseId] = useState("");
    const [amount, setAmount] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("Virement");
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!userId || !courseId || !amount) {
                toast.error("Veuillez remplir tous les champs obligatoires");
                setLoading(false);
                return;
            }

            const formData = new FormData();
            formData.append("userId", userId);
            formData.append("courseId", courseId);
            formData.append("amount", amount);
            formData.append("paymentMethod", paymentMethod);
            formData.append("date", date);

            const result = await createManualPayment(formData) as { success?: boolean; error?: string };

            if (result.success) {
                toast.success("Paiement enregistré avec succès");
                setOpen(false);
                // Reset form
                setUserId("");
                setCourseId("");
                setAmount("");
                setPaymentMethod("Virement");
            } else {
                toast.error(result.error || "Erreur lors de l'enregistrement");
            }
        } catch (error) {
            console.error(error);
            toast.error("Une erreur est survenue");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="inline-flex items-center gap-2 bg-slate-900 text-white hover:bg-slate-800 px-4 py-2 rounded-md font-medium text-sm transition-colors shadow-sm"
            >
                <Plus className="w-4 h-4" />
                Saisir un paiement
            </button>

            <Modal isOpen={open} onClose={() => setOpen(false)} title="Nouveau Paiement Manuel" maxWidth="md">
                <form onSubmit={handleSubmit} className="space-y-4 py-2">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Élève</label>
                        <select
                            className="w-full rounded-md border border-slate-300 p-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            required
                        >
                            <option value="">Sélectionner un élève...</option>
                            {users.map(user => (
                                <option key={user.id} value={user.id}>
                                    {user.firstName} {user.lastName} ({user.email})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Formation / Produit</label>
                        <select
                            className="w-full rounded-md border border-slate-300 p-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none"
                            value={courseId}
                            onChange={(e) => setCourseId(e.target.value)}
                            required
                        >
                            <option value="">Sélectionner une formation...</option>
                            {courses.map(course => (
                                <option key={course.id} value={course.id}>
                                    {course.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Montant (€ TTC)</label>
                            <input
                                type="number"
                                step="0.01"
                                className="w-full rounded-md border border-slate-300 p-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Date</label>
                            <input
                                type="date"
                                className="w-full rounded-md border border-slate-300 p-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Moyen de paiement</label>
                        <select
                            className="w-full rounded-md border border-slate-300 p-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none"
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            required
                        >
                            <option value="Virement">Virement Bancaire</option>
                            <option value="Especes">Espèces</option>
                            <option value="Cheque">Chèque</option>
                            <option value="Autre">Autre</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex items-center px-4 py-2 text-sm font-bold text-slate-900 bg-gold-500 rounded-md hover:bg-gold-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            Enregistrer
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    );
}
