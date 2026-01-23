"use client";

import Link from "next/link";
import Image from "next/image";
import { MoveLeft, Home, Search, MessageSquare } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 overflow-hidden relative font-sans antialiased text-white">
            {/* Background Atmosphere */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gold-600/10 blur-[130px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/10 blur-[130px]" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] bg-[length:50px_50px]" />
            </div>

            <div className="max-w-2xl w-full text-center relative z-10 px-6">
                {/* Logo Section */}
                <div className="flex justify-center mb-16">
                    <Link href="/">
                        <div className="relative h-14 w-56 md:h-20 md:w-80 group">
                            <div className="absolute inset-0 bg-gold-500/10 blur-2xl group-hover:bg-gold-500/20 transition-all duration-500 rounded-full" />
                            <Image
                                src="/logo.svg"
                                alt="SL Formations"
                                fill
                                className="object-contain relative z-10 brightness-110 drop-shadow-[0_0_15px_rgba(251,191,36,0.2)]"
                                priority
                            />
                        </div>
                    </Link>
                </div>

                {/* Main Visual Component */}
                <div className="relative mb-8 flex justify-center items-center">
                    <div className="absolute text-[12rem] md:text-[20rem] font-black text-white/5 tracking-tightest leading-none pointer-events-none select-none">
                        404
                    </div>
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gold-500/20 blur-[50px] group-hover:blur-[80px] transition-all opacity-50" />
                        <h1 className="text-8xl md:text-[10rem] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-gold-400 to-gold-600 drop-shadow-2xl">
                            404
                        </h1>
                    </div>
                </div>

                {/* Textual Content */}
                <div className="space-y-6 mb-12">
                    <div className="flex items-center justify-center gap-4">
                        <div className="h-px w-16 bg-gradient-to-r from-transparent via-gold-500 to-transparent"></div>
                        <span className="text-gold-500 text-sm md:text-base font-black uppercase tracking-[0.5em] drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]">Page Introuvable</span>
                        <div className="h-px w-16 bg-gradient-to-r from-transparent via-gold-500 to-transparent"></div>
                    </div>
                    <p className="text-slate-300 text-lg md:text-2xl font-light max-w-lg mx-auto leading-relaxed">
                        Désolé, mais l'adresse que vous cherchez n'existe pas ou a été déplacée définitivement.
                    </p>
                </div>

                {/* Primary Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <Link
                        href="/"
                        className="w-full sm:w-auto min-w-[220px] px-10 py-5 bg-gold-500 text-[#0a0a0a] font-black rounded-full hover:bg-gold-400 transition-all shadow-[0_10px_40px_rgba(251,191,36,0.2)] hover:shadow-[0_15px_60px_rgba(251,191,36,0.4)] hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
                    >
                        <Home className="w-5 h-5" />
                        Retour à l'accueil
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="w-full sm:w-auto min-w-[220px] px-10 py-5 bg-white/5 text-white font-black rounded-full border border-white/10 hover:border-gold-500/50 hover:bg-white/10 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 uppercase tracking-widest text-xs backdrop-blur-sm"
                    >
                        <MoveLeft className="w-5 h-5 text-gold-500" />
                        Page précédente
                    </button>
                </div>

                {/* Secondary Help / Links */}
                <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-center gap-8 text-slate-500 text-xs font-bold uppercase tracking-widest">
                    <Link href="/contact" className="hover:text-gold-500 transition flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        Support technique
                    </Link>
                    <div className="hidden md:block w-1 h-1 rounded-full bg-slate-800" />
                    <Link href="/formations" className="hover:text-gold-500 transition flex items-center gap-2">
                        <Search className="w-4 h-4" />
                        Nos formations
                    </Link>
                </div>
            </div>
        </div>
    );
}
