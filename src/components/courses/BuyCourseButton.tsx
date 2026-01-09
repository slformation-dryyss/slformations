"use client";

import { useState } from "react";

interface BuyCourseButtonProps {
  courseId: string;
  courseSlug: string;
}

export function BuyCourseButton({ courseId }: BuyCourseButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ courseId }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.url) {
        setError(data?.error ?? "Impossible de démarrer le paiement. Veuillez réessayer.");
        setLoading(false);
        return;
      }

      window.location.href = data.url as string;
    } catch (e) {
      console.error("Erreur checkout Stripe", e);
      setError("Erreur réseau. Vérifiez votre connexion et réessayez.");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="w-full py-4 bg-linear-to-r from-gold-500 to-gold-600 text-navy-900 font-bold rounded-xl hover:shadow-lg hover:shadow-gold-500/40 transition-all transform hover:-translate-y-1 text-lg disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Redirection vers le paiement..." : "Accéder à la formation"}
      </button>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}









