"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MailCheck, MailWarning, Loader2 } from "lucide-react";

export default function VerifyEmailPage() {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/api/auth/login");
        return;
      }
      if (user.email_verified) {
        router.push("/dashboard");
      }
    }
  }, [user, isLoading, router]);

  const handleVerificationCheck = () => {
    setIsChecking(true);
    // On force une redirection vers le login pour rafraîchir le cookie de session
    // C'est le seul moyen sûr de mettre à jour le claim "email_verified" côté serveur (Middleware)
    window.location.href = "/api/auth/login?returnTo=/dashboard";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center text-white">
        <Loader2 className="w-8 h-8 animate-spin text-gold-500" />
      </div>
    );
  }

  const email = user?.email || "votre adresse email";

  return (
    <>
      <div className="pt-28 pb-16">
        <div className="max-w-xl mx-auto px-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xl text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold-500/15 border border-gold-500/60">
              <MailWarning className="w-7 h-7 text-gold-600" />
            </div>

            <h1 className="text-2xl md:text-3xl font-bold mb-3 text-slate-900">
              Vérifiez votre adresse email
            </h1>

            <p className="text-slate-500 text-sm md:text-base mb-4">
              Merci pour votre inscription sur <span className="font-semibold">SL Formations</span>.
              Pour accéder à votre espace élève, nous devons d&apos;abord vérifier votre adresse email :
            </p>

            <p className="text-gold-600 font-semibold mb-6">{email}</p>

            <div className="space-y-3 text-xs md:text-sm text-slate-500 text-left bg-slate-50 rounded-xl p-5 mb-6 border border-slate-100">
              <p>1. Ouvrez votre boîte mail et cliquez sur le lien de vérification envoyé par Auth0.</p>
              <p>2. Une fois votre email vérifié, revenez sur le site et cliquez sur le bouton ci-dessous.</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleVerificationCheck}
                disabled={isChecking}
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-gold-500 text-navy-900 font-semibold text-sm hover:bg-gold-600 transition cursor-pointer disabled:opacity-70 disabled:cursor-wait"
              >
                {isChecking ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Actualisation...
                  </>
                ) : (
                  <>
                    <MailCheck className="w-4 h-4 mr-2" />
                    J&apos;ai vérifié mon email
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}








