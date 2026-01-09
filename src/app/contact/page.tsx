import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ContactForm } from "@/components/contact/ContactForm";
import { Suspense } from "react";

export const metadata = {
  title: "Contact | SL Formations",
  description:
    "Contactez SL Formations pour toute question sur les permis, les formations VTC / Taxi, CACES ou les formations professionnelles.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col text-slate-900 font-sans">
      <Header />
      <main className="flex-1 pt-32 pb-20">
        <div className="max-w-5xl mx-auto px-6 space-y-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Contactez <span className="text-gold-500">SL Formations</span>
            </h1>
            <p className="text-slate-600 max-w-2xl mx-auto text-sm md:text-base">
              Une question sur une formation, un financement (CPF, France Travail), ou besoin d'envoyer des documents pour votre dossier ?
              Utilisez le formulaire ci-dessous ou contactez-nous directement par email à : <span className="text-gold-600 font-bold">info@sl-formations.fr</span>
            </p>
          </div>

          <Suspense fallback={<div className="text-center py-8">Chargement...</div>}>
            <ContactForm />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  );
}

