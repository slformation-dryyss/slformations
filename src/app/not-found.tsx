import Link from "next/link";
import Image from "next/image";
import { MoveLeft, Home, User } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-navy-900 flex items-center justify-center px-4 overflow-hidden relative">
            {/* Background patterns for premium feel */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-gold-500 blur-[120px]"></div>
                <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-blue-600 blur-[120px]"></div>
            </div>

            <div className="max-w-2xl w-full text-center relative z-10">
                {/* Logo */}
                <div className="flex justify-center mb-12">
                    <Link href="/">
                        <div className="relative h-12 w-48 md:h-16 md:w-64 transform hover:scale-105 transition-transform duration-300">
                            <Image
                                src="/logo.svg"
                                alt="SL Formations"
                                fill
                                className="object-contain drop-shadow-2xl brightness-110"
                                priority
                            />
                        </div>
                    </Link>
                </div>

                {/* Big Error Code */}
                <div className="mb-2">
                    <h1 className="text-[12rem] md:text-[18rem] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-gold-400 via-gold-500 to-gold-600 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
                        404
                    </h1>
                </div>

                {/* Brand Decoration */}
                <div className="flex items-center justify-center gap-4 mb-8">
                    <div className="h-[1px] w-12 bg-gold-500/50"></div>
                    <span className="text-gold-500 font-bold uppercase tracking-[0.3em] text-sm md:text-base">SL Formations</span>
                    <div className="h-[1px] w-12 bg-gold-500/50"></div>
                </div>

                {/* Subtitle */}
                <p className="text-white text-xl md:text-2xl font-light mb-12 max-w-lg mx-auto leading-relaxed">
                    La page que vous recherchez est introuvable ou a été déplacée.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <Link
                        href="/"
                        className="w-full sm:w-auto px-10 py-4 bg-gold-500 text-navy-900 font-black rounded-full hover:bg-gold-600 transition-all shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:scale-105 active:scale-95 flex items-center justify-center gap-3 uppercase tracking-wider text-sm"
                    >
                        <Home className="w-5 h-5" />
                        Retour à l&apos;accueil
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="w-full sm:w-auto px-10 py-4 bg-navy-800 text-gold-500 font-bold rounded-full border border-gold-500/30 hover:border-gold-500 hover:bg-navy-700 transition-all flex items-center justify-center gap-3 uppercase tracking-wider text-sm"
                    >
                        <MoveLeft className="w-5 h-5" />
                        Page précédente
                    </button>
                </div>

                {/* Footer info */}
                <div className="mt-16 text-slate-500 text-sm flex items-center justify-center gap-6">
                    <Link href="/contact" className="hover:text-gold-500 transition">Assistance technique</Link>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
                    <Link href="/formations" className="hover:text-gold-500 transition">Nos formations</Link>
                </div>
            </div>
        </div>
    );
}
