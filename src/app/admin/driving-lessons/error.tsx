"use client";

import { useEffect } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  const isPrismaError = error.message.includes("PrismaClient") || error.message.includes("schema");

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
        <AlertCircle className="w-8 h-8 text-red-600" />
      </div>

      <h2 className="text-2xl font-bold text-slate-900 mb-3">
        Une erreur est survenue
      </h2>

      <p className="max-w-md text-slate-500 mb-8">
        {isPrismaError
          ? "Impossible de synchroniser les données. Cela peut arriver après une mise à jour. Veuillez réessayer."
          : "Le chargement des leçons de conduite a échoué. Si le problème persiste, contactez le support."}
      </p>

      <div className="flex gap-4">
        <button
          onClick={reset}
          className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Réessayer
        </button>
      </div>

      {process.env.NODE_ENV === "development" && (
        <div className="mt-8 p-4 bg-slate-100 rounded-lg text-left max-w-2xl w-full overflow-auto">
          <p className="font-mono text-xs text-red-600 mb-2 font-bold">DEBUG INFO:</p>
          <pre className="font-mono text-xs text-slate-600">
            {error.message}
            {error.digest && `\nDigest: ${error.digest}`}
          </pre>
        </div>
      )}
    </div>
  );
}
