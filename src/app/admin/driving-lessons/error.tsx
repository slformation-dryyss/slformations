"use client";

import { useEffect } from "react";
import { AlertCircle, RotateCcw, ShieldAlert } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Driving Lessons Error]:", error);
  }, [error]);

  const isPrismaError = error.message.includes("PrismaClient") || error.message.includes("schema");

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 antialiased">
      <div className="max-w-xl w-full bg-[#0f172a] rounded-3xl border border-slate-800 shadow-2xl overflow-hidden relative group">
        {/* Abstract background glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-3xl group-hover:bg-red-500/20 transition-all duration-700" />

        <div className="p-8 md:p-12 flex flex-col items-center text-center relative z-10">
          <div className="w-20 h-20 bg-red-500/10 rounded-2xl flex items-center justify-center mb-8 rotate-3 group-hover:rotate-6 transition-transform">
            <ShieldAlert className="w-10 h-10 text-red-500" />
          </div>

          <h2 className="text-3xl font-black text-white mb-4 tracking-tight">
            Oops ! Un incident est survenu
          </h2>

          <p className="text-slate-400 text-lg mb-10 leading-relaxed font-medium">
            {isPrismaError
              ? "Une erreur de synchronisation avec la base de données a été détectée. Cela arrive parfois après une mise à jour système."
              : "Nous avons rencontré un problème lors du chargement des données de conduite. Notre système de monitoring a été notifié."}
          </p>

          <div className="w-full flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={reset}
              className="flex items-center justify-center gap-3 px-8 py-4 bg-white text-[#0f172a] font-black rounded-2xl hover:bg-slate-100 transition-all hover:-translate-y-1 active:scale-95 shadow-xl shadow-white/5"
            >
              <RotateCcw className="w-5 h-5 text-red-600" />
              Relancer la page
            </button>
          </div>

          {process.env.NODE_ENV === "development" && (
            <div className="mt-12 w-full text-left">
              <div className="h-px w-full bg-slate-800 mb-6" />
              <p className="font-mono text-[10px] text-red-500 font-black mb-3 flex items-center gap-2 tracking-widest uppercase">
                <AlertCircle className="w-3 h-3" />
                Informations de débogage
              </p>
              <div className="p-4 bg-black/40 rounded-xl border border-white/5 font-mono text-[11px] text-slate-500 max-h-40 overflow-auto scrollbar-hide">
                {error.message}
                {error.digest && <div className="mt-2 text-gold-500/50 italic">Digest: {error.digest}</div>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
