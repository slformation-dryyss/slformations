
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { requireUser } from "@/lib/auth";
import { KeyRound, ShieldCheck, ArrowRight } from "lucide-react";

export default async function ChangePasswordPage() {
    const user = await requireUser();

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <Header />

            <main className="flex-grow flex items-center justify-center py-20 px-4">
                <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl shadow-gold-500/10 border border-slate-200 overflow-hidden text-center">
                    <div className="h-32 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-0 left-0 w-20 h-20 bg-gold-500 rounded-full blur-3xl" />
                            <div className="absolute bottom-0 right-0 w-20 h-20 bg-blue-500 rounded-full blur-3xl" />
                        </div>
                        <div className="bg-white/10 p-5 rounded-full backdrop-blur-md border border-white/20 shadow-xl relative z-10">
                            <KeyRound className="w-10 h-10 text-gold-400" />
                        </div>
                    </div>

                    <div className="p-10 space-y-8">
                        <div className="space-y-3">
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                                <span className="text-gradient-gold">Sécurité</span> de votre compte
                            </h1>
                            <p className="text-slate-500 text-sm leading-relaxed font-medium">
                                {user.mustChangePassword
                                    ? "Bienvenue sur SL Formations ! Pour garantir la sécurité de vos données, vous devez personnaliser votre mot de passe lors de votre première connexion."
                                    : "Vous avez demandé à modifier votre mot de passe pour renforcer la sécurité de votre compte."
                                }
                            </p>
                        </div>

                        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex items-start gap-4 text-left">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                <ShieldCheck className="w-5 h-5 text-blue-600" />
                            </div>
                            <p className="text-xs text-blue-800 leading-relaxed font-medium">
                                Vous allez être redirigé vers notre interface sécurisée d'authentification pour définir votre nouveau mot de passe.
                            </p>
                        </div>

                        <form action="/api/auth/change-password" method="POST">
                            <button
                                type="submit"
                                className="w-full bg-slate-950 hover:bg-navy-950 text-white font-black py-4.5 rounded-2xl transition-all shadow-xl shadow-slate-950/20 flex items-center justify-center gap-3 group hover:scale-[1.02] active:scale-[0.98]"
                            >
                                Changer mon mot de passe
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-gold-500" />
                            </button>
                        </form>

                        <p className="text-xs text-slate-400">
                            Une fois votre mot de passe modifié, vous pourrez accéder à votre tableau de bord.
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
