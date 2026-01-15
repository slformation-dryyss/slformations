import Link from "next/link";
import { MoveLeft, Home, Search } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                {/* Illustration / Icon */}
                <div className="mb-8 relative">
                    <div className="text-9xl font-black text-slate-100 select-none">404</div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="p-5 bg-gold-500 rounded-2xl shadow-xl rotate-3">
                            <Search className="w-12 h-12 text-navy-900" />
                        </div>
                    </div>
                </div>

                {/* Text Content */}
                <h1 className="text-3xl font-bold text-slate-900 mb-4">
                    Oups ! Page introuvable
                </h1>
                <p className="text-slate-500 mb-10 leading-relaxed">
                    La page que vous recherchez semble avoir pris un mauvais virage ou n&apos;existe plus.
                    Pas de panique, nous vous aidons à retrouver votre chemin.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/"
                        className="w-full sm:w-auto px-8 py-3 bg-navy-900 text-white font-bold rounded-xl hover:bg-slate-800 transition shadow-lg flex items-center justify-center gap-2"
                    >
                        <Home className="w-5 h-5 text-gold-500" />
                        Accueil
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="w-full sm:w-auto px-8 py-3 bg-white text-slate-700 font-bold rounded-xl border border-slate-200 hover:border-gold-500 transition shadow-sm flex items-center justify-center gap-2"
                    >
                        <MoveLeft className="w-5 h-5" />
                        Retour
                    </button>
                </div>

                {/* Help Link */}
                <p className="mt-12 text-sm text-slate-400">
                    Besoin d&apos;aide ? <Link href="/contact" className="text-gold-600 hover:underline font-semibold">Contactez le support</Link>
                </p>
            </div>
        </div>
    );
}
