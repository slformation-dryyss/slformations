import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata = {
  title: "Contact | SL Formations",
  description:
    "Contactez SL Formations pour toute question sur les permis, les formations VTC / Taxi, CACES ou les formations professionnelles.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-navy-900 text-white font-sans">
      <Header />
      <main className="pt-32 pb-20">
        <div className="max-w-5xl mx-auto px-6 space-y-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Contactez <span className="text-gold-500">SL Formations</span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
              Une question sur une formation, un financement (CPF, France Travail),
              ou besoin d&apos;un devis personnalisé ? Remplissez le formulaire ci-dessous,
              notre équipe vous répond rapidement.
            </p>
          </div>

          <ContactForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
