"use client";

import { useState, useTransition } from "react";
import { X, Loader2 } from "lucide-react";
import { createVehicle } from "../actions";
import { useRouter } from "next/navigation";

type Instructor = {
    id: string;
    user: {
        firstName: string | null;
        lastName: string | null;
        email: string;
    };
};

interface CreateVehicleModalProps {
    instructors: Instructor[];
    onClose: () => void;
}

export function CreateVehicleModal({ instructors, onClose }: CreateVehicleModalProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        const formData = new FormData(e.currentTarget);

        startTransition(async () => {
            const result = await createVehicle(formData);
            if (result.success) {
                router.refresh();
                onClose();
            } else {
                setError(result.error || "Une erreur est survenue");
            }
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900">Ajouter un véhicule</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-lg transition"
                        disabled={isPending}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Marque <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="brand"
                                required
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                                placeholder="Renault, Peugeot, etc."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Modèle <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="model"
                                required
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                                placeholder="Clio, 208, etc."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Plaque d'immatriculation <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="licensePlate"
                                required
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gold-500 focus:border-transparent uppercase"
                                placeholder="AB-123-CD"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Année <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="year"
                                required
                                min="1990"
                                max={new Date().getFullYear() + 1}
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                                placeholder="2023"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Transmission <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="transmission"
                                required
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                            >
                                <option value="">Sélectionner...</option>
                                <option value="MANUAL">Manuelle</option>
                                <option value="AUTOMATIC">Automatique</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Carburant <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="fuelType"
                                required
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                            >
                                <option value="">Sélectionner...</option>
                                <option value="DIESEL">Diesel</option>
                                <option value="GASOLINE">Essence</option>
                                <option value="ELECTRIC">Électrique</option>
                                <option value="HYBRID">Hybride</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Attribuer à un instructeur (optionnel)
                        </label>
                        <select
                            name="assignedInstructorId"
                            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                        >
                            <option value="">Non attribué</option>
                            {instructors.map((instructor) => (
                                <option key={instructor.id} value={instructor.id}>
                                    {instructor.user.firstName} {instructor.user.lastName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition"
                            disabled={isPending}
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="px-6 py-2 bg-gold-500 text-navy-900 rounded-lg font-semibold hover:bg-gold-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                            {isPending ? "Création..." : "Créer le véhicule"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
