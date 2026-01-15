'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { RefreshCw, Home, MessageSquare } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('[SL Global Error]:', error);
    }, [error]);

    return (
        <div className="min-h-screen bg-navy-900 flex items-center justify-center px-4 overflow-hidden relative text-white">
            {/* Background patterns */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-red-600 blur-[120px]"></div>
                <div className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-gold-600 blur-[120px]"></div>
            </div>

            <div className="max-w-2xl w-full text-center relative z-10">
                {/* Error Code Headline */}
                <div className="mb-4">
                    <h1 className="text-[12rem] md:text-[18rem] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-red-400 via-red-500 to-red-600 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
                        500
                    </h1>
                </div>

                {/* Brand Decoration */}
                <div className="flex items-center justify-center gap-4 mb-8">
                    <div className="h-[1px] w-12 bg-red-500/50"></div>
                    <span className="text-red-500 font-bold uppercase tracking-[0.3em] text-sm md:text-base">Erreur Technique</span>
                    <div className="h-[1px] w-12 bg-red-500/50"></div>
                </div>

                {/* Subtitle */}
                <p className="text-slate-300 text-xl md:text-2xl font-light mb-12 max-w-lg mx-auto leading-relaxed">
                    Une erreur inattendue s&apos;est produite sur nos serveurs. Nous mettons tout en œuvre pour la corriger rapidement.
                </p>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-md mx-auto">
                    <button
                        onClick={() => reset()}
                        className="w-full px-8 py-4 bg-white text-navy-900 font-black rounded-full hover:bg-slate-100 transition-all shadow-xl hover:scale-105 active:scale-95 flex items-center justify-center gap-3 uppercase tracking-wider text-sm"
                    >
                        <RefreshCw className="w-5 h-5 text-red-600" />
                        Réessayer
                    </button>
                    <Link
                        href="/"
                        className="w-full px-8 py-4 bg-navy-800 text-gold-500 font-bold rounded-full border border-gold-500/30 hover:border-gold-500 hover:bg-navy-700 transition-all flex items-center justify-center gap-3 uppercase tracking-wider text-sm shadow-lg"
                    >
                        <Home className="w-5 h-5" />
                        Accueil
                    </Link>
                </div>

                {/* Support Section */}
                <div className="mt-16 pt-8 border-t border-white/10">
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-3 text-gold-500 hover:text-white transition font-semibold uppercase tracking-widest text-xs"
                    >
                        <MessageSquare className="w-5 h-5" />
                        Signaler le problème au support
                    </Link>
                </div>

                {/* Technical Hint */}
                {error.digest && (
                    <p className="mt-8 text-[10px] text-white/20 font-mono tracking-widest">
                        REF: {error.digest}
                    </p>
                )}
            </div>
        </div>
    );
}
