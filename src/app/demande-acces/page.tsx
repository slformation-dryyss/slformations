
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ContactForm } from "@/components/contact/ContactForm";
import { Suspense } from "react";

export const metadata = {
  title: "Demande d'accès | SL Formations",
};

export default function AccessRequestPage() {
  return (
    <div className="min-h-screen flex flex-col text-slate-900 font-sans bg-slate-50">
      <Header />

      <main className="flex-1 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 text-slate-900">
              Demande d&apos;accès espace élève
            </h1>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Vous êtes déjà inscrit mais vous n&apos;avez pas vos identifiants ? 
              Remplissez ce formulaire pour recevoir vos accès ou contacter l&apos;administration.
            </p>
          </div>

          <Suspense fallback={<div className="text-center py-8">Chargement...</div>}>
            <ContactForm defaultSubject="Demande d'accès (Compte élève)" />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  );
}

