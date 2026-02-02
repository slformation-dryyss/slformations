import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PriceCard } from "@/components/cards/PriceCard";
import SidebarFilter from "@/components/formations/SidebarFilter";
import { CheckCircle2, Users, Clock, Shield, Award } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Permis AAC (Conduite Accompagnée) - Auto-école SL Formations",
  description: "Apprenez à conduire dès 15 ans avec la conduite accompagnée (AAC). Un meilleur taux de réussite et plus d'expérience.",
};

export default function PermisAACPage() {
  return (
    <div className="min-h-screen text-slate-900 font-sans flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[500px] flex items-center justify-center overflow-hidden pt-20 bg-slate-900">
          <div className="absolute inset-0 z-0">
             <img
              className="w-full h-full object-cover opacity-30"
              src="https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?q=80&w=2070&auto=format&fit=crop"
              alt="Conduite Accompagnée AAC"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/20 text-gold-500 rounded-full font-bold uppercase text-xs tracking-wider mb-6 border border-gold-500/30">
              <Users className="w-4 h-4" />
              Dès 15 ans
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6">
              Permis <span className="text-gold-500">AAC</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              La conduite accompagnée pour une formation progressive, sereine et un taux de réussite optimal à l&apos;examen.
            </p>
            <div className="flex justify-center gap-4">
               <Link href="#tarifs" className="px-8 py-4 bg-gold-500 text-slate-900 font-bold rounded-xl hover:bg-gold-400 transition shadow-lg">
                  Voir les tarifs
               </Link>
               <Link href="/contact?subject=Renseignement Permis AAC" className="px-8 py-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition backdrop-blur-sm border border-white/20">
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
                <section id="tarifs" className="mb-20">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-black text-slate-900 mb-4 uppercase tracking-tight">Nos Forfaits AAC</h2>
                        <p className="text-slate-600 max-w-2xl mx-auto">
                            Choisissez la formule adaptée à votre rythme d&apos;apprentissage.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <PriceCard
                            title="FORFAIT 13H"
                            subtitle="Conduite Accompagnée"
                            price="1255€"
                            features={[
                                "Frais d'inscription",
                                "Démarches ANTS",
                                "13h de conduite",
                                "Kit pédagogique numérique",
                                "Accompagnement examen"
                            ]}
                            footerText="Ne comprend pas les RDV pédagogiques"
                            color="navy"
                            badge="13 Heures"
                            buttonText="S'inscrire"
                            link="/contact?subject=Inscription Permis AAC Forfait 13H"
                        />
                        <PriceCard
                            title="FORFAIT 20H"
                            subtitle="Conduite Accompagnée"
                            price="1495€"
                            features={[
                                "Frais d'inscription",
                                "Démarches ANTS",
                                "20h de conduite",
                                "Kit pédagogique numérique",
                                "Accompagnement examen"
                            ]}
                            footerText="Ne comprend pas les RDV pédagogiques"
                            color="gold"
                            isPopular={true}
                            badge="20 Heures"
                            buttonText="Choisir ce forfait"
                            link="/contact?subject=Inscription Permis AAC Forfait 20H"
                        />
                    </div>

                    {/* Legal Notice about Evaluation */}
                    <div className="mt-12 p-8 bg-slate-900 rounded-3xl border border-white/10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-500">
                            <Clock className="w-32 h-32 text-gold-500" />
                        </div>
                        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
                            <div className="w-20 h-20 bg-gold-500 rounded-2xl flex items-center justify-center flex-shrink-0 animate-pulse">
                                <Users className="w-10 h-10 text-navy-900" />
                            </div>
                            <div>
                                <h4 className="text-xl font-black text-white mb-2 uppercase tracking-tight">
                                    Étape Obligatoire : L'Auto-Évaluation de Départ
                                </h4>
                                <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
                                    Conformément à la réglementation, l'évaluation de départ est <span className="text-gold-500 font-bold italic underline">exclue</span> des forfaits AAC. 
                                    Elle permet de définir précisément vos besoins avant le début de la conduite effectuée <span className="text-white font-bold">avant</span> la signature de votre contrat.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-12 bg-white border-t border-slate-100">
                     <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-gold-50 rounded-xl flex items-center justify-center mx-auto mb-4 text-gold-500">
                                <Shield className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold mb-2 text-sm">Expérience</h3>
                            <p className="text-slate-500 text-xs">Arrivez serein à l&apos;examen.</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4 text-blue-500">
                                <Clock className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold mb-2 text-sm">Réduction Assurance</h3>
                            <p className="text-slate-500 text-xs">Tarifs préférentiels jeunes conducteurs.</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mx-auto mb-4 text-green-500">
                                <Award className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold mb-2 text-sm">Succès Boosté</h3>
                            <p className="text-slate-500 text-xs">+75% de réussite en AAC.</p>
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
