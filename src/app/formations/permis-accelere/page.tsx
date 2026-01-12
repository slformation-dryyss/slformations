import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PriceCard } from "@/components/cards/PriceCard";
import SidebarFilter from "@/components/formations/SidebarFilter";
import { CheckCircle2, Zap, Clock, Shield, Award } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Permis en Accéléré - Auto-école SL Formations",
  description: "Obtenez votre permis en un temps record avec notre stage intensif. Idéal pour les emplois du temps serrés.",
};

export default function PermisAccelerePage() {
  return (
    <div className="min-h-screen text-slate-900 font-sans flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[500px] flex items-center justify-center overflow-hidden pt-20 bg-slate-900">
          <div className="absolute inset-0 z-0">
             <img
              className="w-full h-full object-cover opacity-30"
              src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2070&auto=format&fit=crop"
              alt="Permis Accéléré"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/20 text-gold-500 rounded-full font-bold uppercase text-xs tracking-wider mb-6 border border-gold-500/30">
              <Zap className="w-4 h-4" />
              Formation Intensive
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6">
              Permis <span className="text-gold-500">Accéléré</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Passez votre permis en 2 à 4 semaines grâce à nos stages intensifs. Une immersion totale pour une réussite rapide.
            </p>
            <div className="flex justify-center gap-4">
               <Link href="#formules" className="px-8 py-4 bg-gold-500 text-slate-900 font-bold rounded-xl hover:bg-gold-400 transition shadow-lg">
                  Découvrir le stage
               </Link>
               <Link href="/contact?subject=Renseignement Permis Accéléré" className="px-8 py-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition backdrop-blur-sm border border-white/20">
                  Demander un devis
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
                <section id="formules" className="mb-20">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-black text-slate-900 mb-4 uppercase tracking-tight">Le Stage Accéléré</h2>
                        <p className="text-slate-600 max-w-2xl mx-auto">
                            Une organisation optimisée pour vous mener à l'examen dans les plus brefs délais.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-gold-500" />
                                Rythme au choix
                            </h3>
                            <ul className="space-y-3">
                                {[
                                    "Stage 2 semaines (Intensif)",
                                    "Stage 4 semaines (Semi-intensif)",
                                    "Code en ligne illimité",
                                    "Heures de conduite regroupées",
                                    "Examen blanc en fin de stage"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-2 text-slate-600">
                                        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <PriceCard
                            title="Formule Stage"
                            subtitle="Tout inclus et rapide"
                            price="Sur Devis"
                            features={[
                                "Évaluation initiale offerte",
                                "Code de la route accéléré",
                                "20h à 30h de conduite",
                                "Place d'examen prioritaire",
                                "Suivi personnalisé quotidien"
                            ]}
                            color="gold"
                            isPopular={true}
                            badge="Intensif"
                            buttonText="Demander un devis"
                            link="/contact?subject=Devis Permis Accéléré"
                        />
                    </div>
                </section>

                <section className="py-12 bg-white border-t border-slate-100">
                     <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-gold-50 rounded-xl flex items-center justify-center mx-auto mb-4 text-gold-500">
                                <Shield className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold mb-2 text-sm">Garantie Qualité</h3>
                            <p className="text-slate-500 text-xs">Formation certifiée Qualiopi.</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4 text-blue-500">
                                <Zap className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold mb-2 text-sm">Rapidité</h3>
                            <p className="text-slate-500 text-xs">Passage d'examen accéléré.</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mx-auto mb-4 text-green-500">
                                <Award className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold mb-2 text-sm">Expertise</h3>
                            <p className="text-slate-500 text-xs">Formateurs spécialisés stages.</p>
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
