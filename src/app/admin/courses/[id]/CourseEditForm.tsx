"use client";

import { useState } from "react";
import { Save, Check, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { updateCourseAction } from "../actions";
import type { Course } from "@prisma/client";

interface CourseEditFormProps {
    course: Course;
}

export function CourseEditForm({ course }: CourseEditFormProps) {
    const [status, setStatus] = useState<"idle" | "saving" | "success">("idle");

    async function handleSubmit(formData: FormData) {
        setStatus("saving");
        try {
            await updateCourseAction(formData);
            setStatus("success");
            // Reset to idle after 2 seconds
            setTimeout(() => setStatus("idle"), 2000);
        } catch (e) {
            console.error(e);
            setStatus("idle");
            // Optionally handle error state
        }
    }

    return (
        <form action={handleSubmit} className="space-y-4">
            <input type="hidden" name="courseId" value={course.id} />

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Titre</label>
                <input type="text" name="title" defaultValue={course.title} className="w-full text-sm border-slate-300 rounded p-2 border" />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Image URL</label>
                <input type="text" name="imageUrl" defaultValue={course.imageUrl || ""} className="w-full text-sm border-slate-300 rounded p-2 border" />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Prix (€)</label>
                <input type="number" name="price" defaultValue={course.price} className="w-full text-sm border-slate-300 rounded p-2 border" />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre d'heures de conduite (si applicable)</label>
                <input type="number" name="drivingHours" defaultValue={course.drivingHours || 0} className="w-full text-sm border-slate-300 rounded p-2 border" placeholder="Ex: 20 pour un pack permis B" />
                <p className="text-[10px] text-slate-400 mt-1 italic">Crédit automatique au solde de l'élève après paiement.</p>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Limite de Participants (0 = illimité)</label>
                <input type="number" name="maxStudents" defaultValue={course.maxStudents || 0} className="w-full text-sm border-slate-300 rounded p-2 border" />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Statut</label>
                <div className="flex items-center gap-2 p-3 bg-slate-50 rounded border border-slate-200">
                    <input type="checkbox" name="isPublished" defaultChecked={course.isPublished} className="h-4 w-4 text-gold-600 rounded border-gray-300" />
                    <span className="text-sm text-slate-700">Publié (Visible sur le site)</span>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Durée Affichée</label>
                <input type="text" name="durationText" defaultValue={course.durationText || ""} className="w-full text-sm border-slate-300 rounded p-2 border" placeholder="Ex: 77 heures (11 jours)" />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Format</label>
                <input type="text" name="formatText" defaultValue={course.formatText || ""} className="w-full text-sm border-slate-300 rounded p-2 border" placeholder="Ex: Présentiel, Distanciel..." />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                <select name="type" defaultValue={course.type} className="w-full text-sm border-slate-300 rounded p-2 border">
                    <option value="PERMIS">Permis</option>
                    <option value="TRANSPORT">Transport</option>
                    <option value="CACES">CACES</option>
                    <option value="SECOURISME">Secourisme / SST</option>
                    <option value="INCENDIE">Incendie / SSIAP</option>
                    <option value="CYBER">Cyber (Tech)</option>
                    <option value="DEV">Dev (Tech)</option>
                    <option value="MARKETING">Marketing (Tech)</option>
                    <option value="DESIGN">Design (Tech)</option>
                    <option value="AUTRE">Autre</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description (Courte)</label>
                <textarea name="description" rows={3} defaultValue={course.description} className="w-full text-sm border-slate-300 rounded p-2 border" />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Objectifs (Pédagogiques)</label>
                <textarea name="objectives" rows={3} defaultValue={course.objectives || ""} className="w-full text-sm border-slate-300 rounded p-2 border" />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Public Visé</label>
                <textarea name="targetAudience" rows={2} defaultValue={course.targetAudience || ""} className="w-full text-sm border-slate-300 rounded p-2 border" />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Débouchés / Perspectives</label>
                <textarea name="prospects" rows={2} defaultValue={course.prospects || ""} className="w-full text-sm border-slate-300 rounded p-2 border" />
            </div>

            <motion.button
                type="submit"
                disabled={status === "saving"}
                className="w-full font-bold py-2 rounded transition-colors flex items-center justify-center gap-2 overflow-hidden relative"
                initial={{ backgroundColor: "#EAB308", color: "#0F172A" }}
                animate={{ 
                    backgroundColor: status === "success" ? "#10B981" : "#EAB308",
                    color: status === "success" ? "#FFFFFF" : "#0F172A"
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.3 }}
            >
                <AnimatePresence mode="wait" initial={false}>
                    {status === "success" ? (
                        <motion.div
                            key="success"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            className="flex items-center gap-2"
                        >
                            <Check className="w-4 h-4" />
                            <span>Enregistré !</span>
                        </motion.div>
                    ) : status === "saving" ? (
                        <motion.div
                            key="saving"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            className="flex items-center gap-2"
                        >
                             <Loader2 className="w-4 h-4 animate-spin" />
                             <span>Enregistrement...</span>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="idle"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                             className="flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            <span>Enregistrer les modifications</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>
        </form>
    );
}
