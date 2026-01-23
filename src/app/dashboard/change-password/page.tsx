
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { requireUser } from "@/lib/auth";
import { KeyRound, ShieldCheck, ArrowRight } from "lucide-react";

export default async function ChangePasswordPage() {
    const user = await requireUser();

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Header />

            <main className="flex-grow flex items-center justify-center py-20 px-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                    <div className="bg-gold-500 p-8 flex justify-center">
                        <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
                            <KeyRound className="w-12 h-12 text-slate-900" />
                        </div>
                    </div>

                    <div className="p-8 text-center space-y-6">
                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold text-slate-900">Sécurité de votre compte</h1>
                            <p className="text-slate-500">
                                Bienvenue sur <strong>SL Formations</strong> ! Pour garantir la sécurité de vos données, vous devez personnaliser votre mot de passe lors de votre première connexion.
                            </p>
                        </div>

                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3 text-left">
                            <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                            <p className="text-sm text-blue-800">
                                Vous allez être redirigé vers notre plateforme sécurisée d'authentification pour définir votre nouveau mot de passe.
                            </p>
                        </div>

                        <form action="/api/auth/change-password" method="POST">
                            <button
                                type="submit"
                                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-slate-200 flex items-center justify-center gap-2 group"
                            >
                                Changer mon mot de passe
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
