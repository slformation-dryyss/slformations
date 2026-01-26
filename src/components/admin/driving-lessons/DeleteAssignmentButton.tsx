"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { removeAssignment } from "@/app/admin/driving-lessons/actions";
import { toast } from "sonner";

interface DeleteAssignmentButtonProps {
    assignmentId: string;
}

export function DeleteAssignmentButton({ assignmentId }: DeleteAssignmentButtonProps) {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!confirm("Êtes-vous sûr de vouloir désactiver cette attribution ?")) return;

        setLoading(true);
        try {
            const res = await removeAssignment(assignmentId);
            if (res.success) {
                toast.success("Attribution désactivée avec succès");
            } else {
                toast.error(res.error || "Une erreur est survenue");
            }
        } catch (error) {
            toast.error("Erreur de connexion");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={loading}
            className="p-2 text-slate-400 hover:text-red-600 transition disabled:opacity-50"
            title="Supprimer l'attribution"
        >
            {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
                <Trash2 className="w-5 h-5" />
            )}
        </button>
    );
}
