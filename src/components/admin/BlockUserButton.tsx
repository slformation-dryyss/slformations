"use client";

import { toggleBlockUserAction } from "@/app/admin/users/actions";
import { Ban, CheckCircle } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface BlockUserButtonProps {
  userId: string;
  userName: string;
  isBlocked: boolean;
}

export function BlockUserButton({ userId, userName, isBlocked }: BlockUserButtonProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleToggleBlock = () => {
    const action = isBlocked ? "débloquer" : "bloquer";
    
    if (!window.confirm(`Êtes-vous sûr de vouloir ${action} l'utilisateur "${userName}" ?`)) {
      return;
    }

    startTransition(async () => {
      try {
        await toggleBlockUserAction(userId, !isBlocked);
        toast.success(`L'utilisateur ${userName} a été ${isBlocked ? "débloqué" : "bloqué"}.`);
        router.refresh();
      } catch (error: any) {
        toast.error(error.message || "Erreur lors de l'action");
      }
    });
  };

  return (
    <button
      onClick={handleToggleBlock}
      disabled={isPending}
      className={`p-2 rounded-lg transition-colors ${
        isBlocked 
          ? "text-red-600 bg-red-50 hover:bg-red-100" 
          : "text-slate-400 hover:text-orange-600 hover:bg-orange-50"
      } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
      title={isBlocked ? "Débloquer l'utilisateur" : "Bloquer l'utilisateur"}
    >
      {isBlocked ? <CheckCircle className="w-5 h-5" /> : <Ban className="w-5 h-5" />}
    </button>
  );
}
