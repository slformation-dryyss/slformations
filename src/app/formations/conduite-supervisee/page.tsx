import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PriceCard } from "@/components/cards/PriceCard";
import SidebarFilter from "@/components/formations/SidebarFilter";
import { CheckCircle2, UserCheck, Clock, Shield, Award } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Conduite Supervisée - Auto-école SL Formations",
  description: "Gagnez en expérience à moindre coût avec la conduite supervisée. Dès 18 ans, après la formation initiale.",
};

export default function ConduiteSuperviseePage() {
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
              alt="Conduite Supervisée"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-full font-bold uppercase text-xs tracking-wider mb-6 border border-blue-500/30">
              <UserCheck className="w-4 h-4" />
              Expérience Flexible
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6">
              Conduite <span className="text-gold-500">Supervisée</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Complétez votre formation initiale par une phase de conduite avec un accompagnateur pour gagner en confiance avant l'examen.
            </p>
            <div className="flex justify-center gap-4">
               <Link href="#avantages" className="px-8 py-4 bg-gold-500 text-slate-900 font-bold rounded-xl hover:bg-gold-400 transition shadow-lg">
                  Pourquoi choisir ?
               </Link>
               <Link href="/contact?subject=Renseignement Conduite Supervisée" className="px-8 py-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition backdrop-blur-sm border border-white/20">
                  Nous contacter
               </Link>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col lg:flex-row gap-12">
            <aside className="lg:w-1/4 hidden lg:block">
                <div className="sticky top-24">
                    <SidebarFilter />
                </div>
            </aside>

            <div className="lg:w-3/4">
                <section id="avantages" className="mb-20">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-black text-slate-900 mb-4 uppercase tracking-tight">Les Atouts de la Supervisée</h2>
                        <p className="text-slate-600 max-w-2xl mx-auto">
                            Une formule économique et rassurante pour perfectionner sa conduite.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-gold-500" />
                                Conditions d'accès
                            </h3>
                            <ul className="space-y-4">
                                {[
                                    "Avoir 18 ans minimum",
                                    "Avoir validé la formation initiale (20h min)",
                                    "Avoir obtenu l'accord de l'assurance",
                                    "Après un échec à l'examen (en option)",
                                    "Pas de durée minimale imposée"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-2 text-slate-600">
                                        <div className="w-1.5 h-1.5 bg-gold-500 rounded-full mt-2 shrink-0"></div>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <PriceCard
                            title="Formule Accompagnement"
                            subtitle="Passerelle vers l'examen"
                            price="Sur Devis"
                            features={[
                                "RDV préalable avec l'enseignant",
                                "Suivi pédagogique",
                                "Conseils pour l'accompagnateur",
                                "Réduction du stress",
                                "Meilleur taux de réussite"
                            ]}
                            color="navy"
                            badge="Dès 18 ans"
                            buttonText="Se renseigner"
                            link="/contact?subject=Inscription Conduite Supervisée"
                        />
                    </div>
                </section>

                <section className="py-12 bg-white border-t border-slate-100">
                     <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-gold-50 rounded-xl flex items-center justify-center mx-auto mb-4 text-gold-500">
                                <Shield className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold mb-2 text-sm">Économique</h3>
                            <p className="text-slate-500 text-xs">Moins de leçons payantes.</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4 text-blue-500">
                                <Clock className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold mb-2 text-sm">Flexibilité</h3>
                            <p className="text-slate-500 text-xs">Conduisez quand vous voulez.</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mx-auto mb-4 text-green-500">
                                <Award className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold mb-2 text-sm">Confiance</h3>
                            <p className="text-slate-500 text-xs">Accumulez les kilomètres sereinement.</p>
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
