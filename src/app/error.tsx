'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home, MessageCircle } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('[Global Error Boundary]:', error);
    }, [error]);

    return (
        <div className="min-h-screen bg-navy-900 flex items-center justify-center px-4">
            <div className="max-w-lg w-full bg-white rounded-3xl p-8 md:p-12 shadow-2xl text-center">
                {/* Error Icon */}
                <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 border-2 border-red-500">
                    <AlertTriangle className="w-10 h-10 text-red-600" />
                </div>

                {/* Title & Message */}
                <h1 className="text-3xl font-bold text-slate-900 mb-4">
                    Un problème est survenu
                </h1>
                <p className="text-slate-500 mb-8 leading-relaxed">
                    Nous nous excusons pour ce désagrément. Une erreur technique a empêché le chargement de cette page.
                    Pendant que nos équipes sont alertées, vous pouvez essayer de rafraîchir ou revenir plus tard.
                </p>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                        onClick={() => reset()}
                        className="flex items-center justify-center gap-2 px-6 py-4 bg-gold-500 text-navy-900 font-bold rounded-2xl hover:bg-gold-600 transition shadow-lg"
                    >
                        <RefreshCw className="w-5 h-5" />
                        Réessayer
                    </button>
                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 px-6 py-4 bg-slate-100 text-slate-700 font-bold rounded-2xl hover:bg-slate-200 transition"
                    >
                        <Home className="w-5 h-5" />
                        Accueil
                    </Link>
                </div>

                {/* Support Link */}
                <div className="mt-10 pt-8 border-t border-slate-100">
                    <p className="text-sm text-slate-400 mb-4">L&apos;erreur persiste ?</p>
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 text-navy-900 font-bold hover:text-gold-600 transition"
                    >
                        <MessageCircle className="w-5 h-5" />
                        Contacter le support technique
                    </Link>
                </div>

                {/* Technical Hint (Optional/Small) */}
                {error.digest && (
                    <p className="mt-6 text-[10px] text-slate-300 font-mono">
                        Error ID: {error.digest}
                    </p>
                )}
            </div>
        </div>
    );
}
