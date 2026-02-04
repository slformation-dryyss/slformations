import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PriceCard } from "@/components/cards/PriceCard";
import SidebarFilter from "@/components/formations/SidebarFilter";
import { Bike, Clock, Shield, Award, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Permis Moto A2 - Auto-école SL Formations",
  description: "Passez votre permis moto A2 avec SL Formations. Formation plateau et circulation sur pistes privées.",
};

export default async function PermisMotoPage() {
  const courses = await prisma.course.findMany({
    where: {
      type: 'PERMIS',
      slug: {
        in: ['permis-a1', 'permis-a2']
      }
    }
  });

  const getCourse = (slug: string) => courses.find(c => c.slug === slug);
  const a2 = getCourse('permis-a2');
  const a1 = getCourse('permis-a1');

  return (
    <div className="min-h-screen text-slate-900 font-sans flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[500px] flex items-center justify-center overflow-hidden pt-20 bg-slate-900">
          <div className="absolute inset-0 z-0">
             <img
              className="w-full h-full object-cover opacity-40 transform scale-105"
              src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2070&auto=format&fit=crop"
              alt="Permis Moto A2"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/20 text-gold-500 rounded-full font-bold uppercase text-xs tracking-wider mb-6 border border-gold-500/30">
              <Bike className="w-4 h-4" />
              Permis A2
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6">
              Permis <span className="text-gold-500">Moto</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Sensation de liberté et maîtrise technique. Apprenez à piloter en toute sécurité avec nos experts moto.
            </p>
            <div className="flex justify-center gap-4">
               <Link href="#tarifs" className="px-8 py-4 bg-gold-500 text-slate-900 font-bold rounded-xl hover:bg-gold-400 transition shadow-lg">
                  Voir les forfaits
               </Link>
               <Link href="/contact?subject=Renseignement Moto" className="px-8 py-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition backdrop-blur-sm border border-white/20">
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
                    <h2 className="text-3xl font-black text-slate-900 mb-4 uppercase tracking-tight">Formules Permis A2</h2>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        Accès piste privée et équipement radio inclus.
                    </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <PriceCard
                        title="Formule Essentielle"
                        subtitle="Permis A1 (125cc)"
                        price={a1?.price ? `${a1.price}€` : "695€"}
                        features={[
                            "Frais d'inscription inclus",
                            "Démarches administratives ANTS",
                            "8h de Plateau (hors circulation)",
                            "12h de Circulation",
                            "Accès Piste Privée",
                            "Accompagnement Examen Plateau",
                            "Accompagnement Examen Circulation"
                        ]}
                        color="navy"
                        badge="20 Heures"
                        buttonText="Je m'inscris"
                        link="/contact?subject=Inscription Permis Moto Essentielle"
                        />
                        <PriceCard
                        title="Formule Maîtrise"
                        subtitle="Permis A2 (35kW)"
                        price={a2?.price ? `${a2.price}€` : "995€"}
                        features={[
                            "Tout inclus Formule Essentielle",
                            "25h de formation (5h supplémentaires)",
                            "Perfectionnement Plateau intensif",
                            "Mise en situation examen blanc",
                            "Priorité planning piste",
                            "Assurance examen incluse"
                        ]}
                        color="gold"
                        isPopular={true}
                        badge="25 Heures"
                        buttonText="Choisir ce forfait"
                        link="/contact?subject=Inscription Permis Moto Maîtrise"
                        />
                    </div>
                </section>

                {/* Info Piste */}
                <section className="bg-slate-900 text-white overflow-hidden relative rounded-3xl p-10">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gold-500/5 rotate-12 transform translate-x-1/4"></div>
                    <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
                        <div className="md:w-1/2">
                            <h2 className="text-2xl font-black mb-6">Piste Privée Dédiée</h2>
                            <p className="text-gray-300 mb-8 leading-relaxed text-sm">
                                Ne perdez pas de temps dans les embouteillages. Notre piste privée est située à proximité immédiate de l'auto-école.
                            </p>
                            <ul className="space-y-4 text-sm">
                                <li className="flex items-center gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-gold-500" />
                                    <span>Piste sécurisée et éclairée</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-gold-500" />
                                    <span>Parcours lents et rapides officiels</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-gold-500" />
                                    <span>Motos récentes (Yamaha MT-07)</span>
                                </li>
                            </ul>
                        </div>
                        <div className="md:w-1/2">
                            <img 
                                src="https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=2070&auto=format&fit=crop" 
                                alt="Piste Moto" 
                                className="rounded-2xl shadow-2xl border-2 border-white/10 w-full"
                            />
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
