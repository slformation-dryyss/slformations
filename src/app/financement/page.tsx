import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Check, Wallet, Building2, Handshake, ArrowRight, Phone } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Financement de votre formation - SL Formations",
  description: "Découvrez comment financer votre formation (CPF, France Travail, OPCO) avec SL Formations.",
};

export default function FinancementPage() {
  return (
    <div className="min-h-screen text-slate-900 font-sans flex flex-col">
      <Header />

      <main className="flex-1 pt-32 pb-20">
        <section className="max-w-7xl mx-auto px-6 mb-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-black mb-6 text-slate-900">
              Solutions de <span className="text-gold-500">Financement</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Nous vous accompagnons dans toutes vos démarches pour obtenir une prise en charge totale ou partielle de vos formations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* CPF Section */}
            <div id="cpf" className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 flex flex-col h-full hover:shadow-2xl transition-all">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                <Wallet className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Compte Personnel de Formation (CPF)</h2>
              <p className="text-slate-600 mb-6 flex-1">
                Le CPF est utilisable par tout salarié, demandeur d'emploi ou travailleur indépendant pour financer des formations certifiantes.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm">Disponible pour tous les travailleurs</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm">Financement direct et rapide</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm">Formations permis B éligibles</span>
                </li>
              </ul>
              <Link
                href="https://www.moncompteformation.gouv.fr"
                target="_blank"
                className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl text-center hover:bg-blue-700 transition shadow-lg"
              >
                Accéder à mon CPF
              </Link>
            </div>

            {/* France Travail Section */}
            <div id="france-travail" className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 flex flex-col h-full hover:shadow-2xl transition-all">
              <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-6">
                <Building2 className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-4">France Travail (Pôle Emploi)</h2>
              <p className="text-slate-600 mb-6 flex-1">
                Aides individuelles à la formation (AIF) ou préparation opérationnelle à l'emploi (POE) pour faciliter votre retour au travail.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm">AIF (Aide Individuelle à la Formation)</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm">Prise en charge via votre conseiller</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm">Dossier monté par notre centre</span>
                </li>
              </ul>
              <Link
                href="/contact?subject=Demande financement France Travail"
                className="w-full py-4 bg-green-600 text-white font-bold rounded-xl text-center hover:bg-green-700 transition shadow-lg"
              >
                Démarrer mon dossier
              </Link>
            </div>

            {/* OPCO / Entreprise Section */}
            <div id="opco" className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 flex flex-col h-full hover:shadow-2xl transition-all">
              <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mb-6">
                <Handshake className="w-8 h-8 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Financement Entreprise (OPCO)</h2>
              <p className="text-slate-600 mb-6 flex-1">
                Prise en charge par l'Opérateur de Compétences (OPCO) de votre secteur d'activité pour le développement des compétences des salariés.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm">Plan de développement de compétences</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm">Financement Pro-A ou FNE</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm">Devis sous 24h</span>
                </li>
              </ul>
              <Link
                href="/contact?subject=Devis formation entreprise"
                className="w-full py-4 bg-purple-600 text-white font-bold rounded-xl text-center hover:bg-purple-700 transition shadow-lg"
              >
                Demander un devis
              </Link>
            </div>
          </div>
        </section>

        {/* Call to action */}
        <section className="bg-slate-900 py-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Un doute sur votre éligibilité ?</h2>
            <p className="text-slate-300 mb-10 text-lg">
              Nos conseillers sont experts dans les dispositifs de financement et vous aident à monter votre dossier gratuitement.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link
                href="/contact"
                className="px-8 py-4 bg-gold-500 text-slate-900 font-bold rounded-xl hover:bg-gold-400 transition shadow-lg flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5" />
                Contactez-nous
              </Link>
              <Link
                href="mailto:financement@sl-formations.fr"
                className="px-8 py-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition border border-white/20 flex items-center justify-center gap-2"
              >
                Nous envoyer un email
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
