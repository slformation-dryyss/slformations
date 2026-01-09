"use client";

import { useState, useEffect } from "react";
import { CheckCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface LessonPlayerClientProps {
  lessonId: string;
  videoUrl?: string | null;
  title: string;
  isCompleted?: boolean;
}

export function LessonPlayerClient({ lessonId, videoUrl, title, isCompleted }: LessonPlayerClientProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(isCompleted ?? false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!lessonId) return;

    // First heartbeat on load
    const sendHeartbeat = async () => {
      try {
        await fetch(`/api/lessons/${lessonId}/heartbeat`, { method: "POST" });
      } catch (e) {
        console.error("Heartbeat error", e);
      }
    };

    sendHeartbeat();

    // Regular heartbeat every 30 seconds
    const interval = setInterval(sendHeartbeat, 30000);

    return () => clearInterval(interval);
  }, [lessonId]);

  async function markCompleted() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ lessonId, isCompleted: true }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Impossible d'enregistrer la progression.");
        setSaving(false);
        return;
      }
      setDone(true);
      router.refresh();
    } catch (e) {
      console.error("Erreur progression leçon", e);
      setError("Erreur réseau. Réessayez plus tard.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="aspect-video w-full rounded-xl overflow-hidden bg-black/60 border border-navy-700">
        {videoUrl ? (
          <iframe
            src={videoUrl}
            title={title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
            Vidéo non disponible pour cette leçon.
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold mb-1">{title}</h2>
          {done && (
            <p className="text-sm text-emerald-400 flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              Leçon marquée comme terminée.
            </p>
          )}
          {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
        </div>
        <button
          type="button"
          onClick={markCompleted}
          disabled={saving || done}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold-500 text-gold-500 text-sm font-semibold hover:bg-gold-500 hover:text-navy-900 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Enregistrement...
            </>
          ) : done ? (
            <>
              <CheckCircle className="w-4 h-4" />
              Terminé
            </>
          ) : (
            "Marquer comme terminée"
          )}
        </button>
      </div>
    </div>
  );
}

