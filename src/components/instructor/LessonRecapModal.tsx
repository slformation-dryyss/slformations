"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { CheckCircle, AlertCircle, Clock } from "lucide-react";
import { Loader2 } from "lucide-react";

interface LessonRecapModalProps {
    isOpen: boolean;
    onClose: () => void;
    lesson: {
        id: string;
        studentName: string;
        date: string;
        startTime: string;
        endTime: string;
        duration: number;
    };
    onSubmit: (data: {
        instructorNotes?: string;
        studentProgress?: string;
        areasToImprove?: string;
    }) => Promise<void>;
}

export function LessonRecapModal({ isOpen, onClose, lesson, onSubmit }: LessonRecapModalProps) {
    const [notes, setNotes] = useState("");
    const [progress, setProgress] = useState("");
    const [areasToImprove, setAreasToImprove] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await onSubmit({
                instructorNotes: notes || undefined,
                studentProgress: progress || undefined,
                areasToImprove: areasToImprove || undefined
            });

            // Reset form
            setNotes("");
            setProgress("");
            setAreasToImprove("");
            onClose();
        } catch (error) {
            console.error("Error submitting recap:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Récapitulatif du cours" maxWidth="lg">
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Info cours */}
                <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div className="flex-1">
                            <p className="text-lg font-bold text-slate-900 mb-1">
                                {lesson.studentName}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-slate-600">
                                <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {lesson.date}
                                </span>
                                <span className="font-medium">
                                    {lesson.startTime} - {lesson.endTime}
                                </span>
                                <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold">
                                    {lesson.duration}h
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notes générales */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-gold-500" />
                        Notes générales du cours
                    </label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Résumé du cours, comportement au volant, exercices effectués, conditions de circulation..."
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none text-sm min-h-[120px] transition-all"
                    />
                    <p className="text-xs text-slate-500 mt-1 italic">Ces notes seront visibles par l'élève</p>
                </div>

                {/* Progression */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Progression et points maîtrisés
                    </label>
                    <textarea
                        value={progress}
                        onChange={(e) => setProgress(e.target.value)}
                        placeholder="Manœuvres réussies, techniques maîtrisées, améliorations constatées..."
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-sm min-h-[100px] transition-all"
                    />
                </div>

                {/* Points à améliorer */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-orange-500" />
                        Points à travailler pour le prochain cours
                    </label>
                    <textarea
                        value={areasToImprove}
                        onChange={(e) => setAreasToImprove(e.target.value)}
                        placeholder="Axes d'amélioration, exercices à retravailler, conseils pour progresser..."
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm min-h-[100px] transition-all"
                    />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-slate-100">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 px-6 py-3 bg-gold-500 text-slate-900 rounded-xl font-bold hover:bg-gold-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-gold-200"
                    >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {loading ? "Enregistrement..." : "Valider et terminer le cours"}
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition disabled:opacity-50"
                    >
                        Annuler
                    </button>
                </div>
            </form>
        </Modal>
    );
}
