
"use client";

import { useState } from "react";
import { Plus, X, Loader2, UserPlus } from "lucide-react";
import { createUserAction } from "@/app/admin/users/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function CreateUserButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        roles: ["STUDENT"] as string[]
    });

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            await createUserAction(formData);
            toast.success("Utilisateur créé avec succès et mail envoyé.");
            setIsOpen(false);
            setFormData({ firstName: "", lastName: "", email: "", roles: ["STUDENT"] });
        } catch (error: any) {
            toast.error(error.message || "Erreur lors de la création");
        } finally {
            setLoading(false);
        }
    }

    const toggleRole = (role: string) => {
        setFormData(prev => {
            const nextRoles = prev.roles.includes(role)
                ? prev.roles.filter(r => r !== role)
                : [...prev.roles, role];

            return { ...prev, roles: nextRoles.length > 0 ? nextRoles : ["STUDENT"] };
        });
    };

    const roles = [
        { value: "ADMIN", label: "Admin" },
        { value: "SECRETARY", label: "Secrétariat" },
        { value: "TEACHER", label: "Formateur Pro" },
        { value: "INSTRUCTOR", label: "Moniteur Conduite" },
        { value: "STUDENT", label: "Élève" },
    ];

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl font-semibold text-sm hover:bg-slate-800 transition shadow-sm"
            >
                <UserPlus className="w-4 h-4" />
                <span>Nouvel Utilisateur</span>
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-200">
                        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                            <h2 className="font-bold text-slate-900 flex items-center gap-2">
                                <UserPlus className="w-5 h-5 text-gold-600" />
                                Créer un utilisateur
                            </h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-slate-500" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Prénom</label>
                                    <input
                                        required
                                        value={formData.firstName}
                                        onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 outline-none transition-all"
                                        placeholder="Jean"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Nom</label>
                                    <input
                                        required
                                        value={formData.lastName}
                                        onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 outline-none transition-all"
                                        placeholder="Dupont"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase">Email</label>
                                <input
                                    required
                                    type="email"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 outline-none transition-all"
                                    placeholder="jean.dupont@example.com"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase block">Rôles attribués</label>
                                <div className="flex flex-wrap gap-2">
                                    {roles.map(role => (
                                        <button
                                            key={role.value}
                                            type="button"
                                            onClick={() => toggleRole(role.value)}
                                            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${formData.roles.includes(role.value)
                                                    ? "bg-gold-500 border-gold-400 text-slate-900"
                                                    : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                                                }`}
                                        >
                                            {role.label}
                                        </button>
                                    ))}
                                </div>
                                <p className="text-[10px] text-slate-400 italic">
                                    * L'utilisateur recevra un mail avec un mot de passe temporaire.
                                </p>
                            </div>

                            <div className="pt-4 flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="flex-1 py-2.5 px-4 border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-[2] py-2.5 px-4 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Configuration...
                                        </>
                                    ) : (
                                        "Créer l'utilisateur"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
