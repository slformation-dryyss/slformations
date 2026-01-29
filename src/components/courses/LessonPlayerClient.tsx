"use client";

import { useState, useEffect } from "react";
import { CheckCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface LessonPlayerClientProps {
  lessonId: string;
  videoUrl?: string | null;
  title: string;
  isCompleted?: boolean;
  resources?: { id: string; title: string; url: string; type: string }[];
}

export function LessonPlayerClient({ lessonId, videoUrl, title, isCompleted, resources = [] }: LessonPlayerClientProps) {
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

      {/* Resources Section */}
      {resources.length > 0 && (
        <div className="mt-8 border-t border-slate-100 pt-6">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Ressources & Documents</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {resources.map((resource) => (
              <a
                key={resource.id}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-gold-500 hover:bg-gold-50/30 transition group"
              >
                <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 group-hover:text-gold-500 transition">
                  {resource.type === "PDF" ? (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.172 13.828a4 4 0 015.656 0l4 4a4 4 0 11-5.656 5.656l-1.102-1.101" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{resource.title}</p>
                  <p className="text-[10px] text-slate-500 uppercase">{resource.type}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

