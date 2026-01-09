"use client";

import { deleteUserAction } from "@/app/admin/users/actions";
import { Trash2 } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

interface DeleteUserButtonProps {
  userId: string;
  userName: string;
}

export function DeleteUserButton({ userId, userName }: DeleteUserButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur "${userName}" ? Cette action est irréversible.`)) {
      return;
    }

    startTransition(async () => {
      try {
        await deleteUserAction(userId);
        toast.success(`L'utilisateur ${userName} a été supprimé.`);
      } catch (error: any) {
        toast.error(error.message || "Erreur lors de la suppression");
      }
    });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className={`p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ${
        isPending ? "opacity-50 cursor-not-allowed" : ""
      }`}
      title="Supprimer l'utilisateur"
    >
      <Trash2 className="w-5 h-5" />
    </button>
  );
}

