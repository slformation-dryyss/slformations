import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PriceCard } from "@/components/cards/PriceCard";
import SidebarFilter from "@/components/formations/SidebarFilter";
import { CheckCircle2, Car, Clock, Shield, Award } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Permis B - Auto-école SL Formations",
  description: "Passez votre permis B en boîte manuelle ou automatique avec SL Formations. Forfaits adaptés et instructeurs qualifiés.",
};

export default function PermisBPage() {
  return (
    <div className="min-h-screen text-slate-900 font-sans flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[500px] flex items-center justify-center overflow-hidden pt-20 bg-slate-900">
          <div className="absolute inset-0 z-0">
            <img
              className="w-full h-full object-cover opacity-30"
              src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop"
              alt="Conduite Permis B"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/20 text-gold-500 rounded-full font-bold uppercase text-xs tracking-wider mb-6 border border-gold-500/30">
              <Car className="w-4 h-4" />
              Permis Voiture
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6">
              Permis <span className="text-gold-500">B</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              La route vers votre liberté commence ici. Choisissez la formation qui vous correspond, en boîte manuelle ou automatique.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="#tarifs" className="px-8 py-4 bg-gold-500 text-slate-900 font-bold rounded-xl hover:bg-gold-400 transition shadow-lg">
                Voir les formules
              </Link>
              <Link href="/contact?subject=Renseignement Permis B" className="px-8 py-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition backdrop-blur-sm border border-white/20">
                Nous contacter
              </Link>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <aside className="lg:w-1/4 hidden lg:block">
            <div className="sticky top-24">
              <SidebarFilter />
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:w-3/4">

            {/* Pricing Section */}
            <section id="tarifs" className="mb-20">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-black text-slate-900 mb-4 uppercase tracking-tight">Nos Formules Permis B</h2>
                <p className="text-slate-600 max-w-2xl mx-auto">
                  Des forfaits tout inclus pour vous accompagner jusqu'à la réussite.
                </p>
              </div>

              {/* Boîte Manuelle */}
              <div className="mb-20">
                <div className="flex items-center gap-4 mb-10 justify-center">
                  <div className="h-[1px] bg-slate-200 w-20"></div>
                  <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                    <span className="w-10 h-10 bg-slate-900 text-white rounded-lg flex items-center justify-center text-sm font-black">BM</span>
                    Boîte Manuelle
                  </h3>
                  <div className="h-[1px] bg-slate-200 w-20"></div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <PriceCard
                    title="Formule Classique"
                    subtitle="L'essentiel pour débuter"
                    price="1095€"
                    features={[
                      "Frais d'inscription inclus",
                      "Démarches administratives ANTS",
                      "Évaluation de départ",
                      "20h de conduite",
                      "Kit pédagogique numérique",
                      "Accompagnement à l'examen"
                    ]}
                    color="navy"
                    badge="20 Heures"
                    buttonText="S'inscrire"
                    link="/contact?subject=Inscription Permis B Manuelle Classique (20h)"
                  />
                  <PriceCard
                    title="Formule Sérénité"
                    subtitle="Pour prendre le temps d'apprendre"
                    price="1595€"
                    features={[
                      "Tout inclus Formule Classique",
                      "30h de conduite (10h supplémentaires)",
                      "Préparation intensive examen",
                      "Bilan de compétences inclus",
                      "Priorité sur le planning"
                    ]}
                    color="gold"
                    isPopular={true}
                    badge="30 Heures"
                    buttonText="Choisir cette formule"
                    link="/contact?subject=Inscription Permis B Manuelle Sérénité (30h)"
                  />
                </div>
              </div>

              {/* Boîte Automatique */}
              <div>
                <div className="flex items-center gap-4 mb-10 justify-center">
                  <div className="h-[1px] bg-slate-200 w-20"></div>
                  <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                    <span className="w-10 h-10 bg-gold-500 text-slate-900 rounded-lg flex items-center justify-center text-sm font-black">BA</span>
                    Boîte Automatique
                  </h3>
                  <div className="h-[1px] bg-slate-200 w-20"></div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <PriceCard
                    title="Formule Classique"
                    subtitle="Rapide et efficace"
                    price="980€"
                    features={[
                      "Frais d'inscription inclus",
                      "Démarches administratives ANTS",
                      "Évaluation de départ",
                      "13h de conduite (Minimum légal)",
                      "Apprentissage facilité",
                      "Accompagnement à l'examen"
                    ]}
                    color="blue"
                    badge="13 Heures"
                    buttonText="S'inscrire"
                    link="/contact?subject=Inscription Permis B Auto Classique (13h)"
                  />
                  <PriceCard
                    title="Formule Confort"
                    subtitle="La maîtrise totale"
                    price="1495€"
                    features={[
                      "Tout inclus Formule Classique",
                      "20h de conduite",
                      "Perfectionnement manœuvres",
                      "Conduite autonome",
                      "Préparation examen blanc"
                    ]}
                    color="navy"
                    badge="20 Heures"
                    buttonText="Choisir cette formule"
                    link="/contact?subject=Inscription Permis B Auto Confort (20h)"
                  />
                </div>
              </div>
            </section>

            {/* Info Section */}
            <section className="py-12 bg-white border-t border-slate-100">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gold-50 rounded-xl flex items-center justify-center mx-auto mb-4 text-gold-500">
                    <Shield className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold mb-2 text-sm">Paiement Sécurisé</h3>
                  <p className="text-slate-500 text-xs">Paiement en 3x ou 4x sans frais.</p>
                  <div className="flex flex-wrap justify-center items-center gap-3 mt-4 opacity-40 grayscale hover:grayscale-0 transition-all duration-300">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4 w-auto" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-2.5 w-auto" />
                    <img src="https://www.klarna.com/assets/img/logos/klarna-logo.svg" alt="Klarna" className="h-3.5 w-auto" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo_%282018%29.svg" alt="Amex" className="h-3.5 w-auto" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-3.5 w-auto" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg" alt="Apple Pay" className="h-4.5 w-auto" />
                  </div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4 text-blue-500">
                    <Clock className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold mb-2 text-sm">Planning Flexible</h3>
                  <p className="text-slate-500 text-xs">Leçons 6j/7, de 8h à 20h.</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mx-auto mb-4 text-green-500">
                    <Award className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold mb-2 text-sm">Réussite Maximum</h3>
                  <p className="text-slate-500 text-xs">&gt; 85% de réussite examen.</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
