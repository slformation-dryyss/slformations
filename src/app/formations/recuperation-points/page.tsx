
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getCoursesByType, getAllSessionsByType } from "@/lib/courses";
import Link from "next/link";
import { CheckCircle2, MapPin, Calendar, Clock, AlertTriangle, ShieldCheck, Car } from "lucide-react";
import SessionCalendar from "@/components/formations/SessionCalendar";
import SidebarFilter from "@/components/formations/SidebarFilter";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Stage Récupération de Points - 4 points en 2 jours | SL Formations",
  description:
    "Récupérez 4 points sur votre permis de conduire en 2 jours. Stages agréés par la préfecture partout en France.",
};

export default async function RecuperationPointsPage() {
  const upcomingSessions = await getAllSessionsByType("RECUPERATION_POINTS");
  // If no sessions found in DB, we might want to show empty state or fallback. SessionCalendar handles empty state.

  return (
    <div className="min-h-screen flex flex-col text-slate-900 font-sans">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 bg-slate-900 overflow-hidden">
             <div className="absolute inset-0 z-0 opacity-20">
                <div className="absolute inset-0 bg-slate-900" />
                <img 
                    src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop" 
                    alt="Conduite" 
                    className="w-full h-full object-cover"
                />
             </div>
          <div className="relative z-10 max-w-7xl mx-auto px-6 text-center md:text-left">
             <span className="inline-block px-3 py-1 mb-4 rounded-full bg-gold-500/20 text-gold-400 text-sm font-semibold border border-gold-500/30">
              Agréé par la préfecture
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Stage de récupération de points<br/>
              <span className="text-gold-500">4 points en 2 jours</span>
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl mb-8 leading-relaxed">
              Stage de sensibilisation à la sécurité routière agréé. Récupérez vos points rapidement et évitez l'invalidation de votre permis.
            </p>
             <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
               <a href="#sessions" className="px-8 py-4 bg-gold-500 hover:bg-gold-600 text-slate-900 font-bold rounded-xl transition shadow-lg shadow-gold-500/20">
                 Voir les prochaines dates
               </a>
               <a href="#eligibilite" className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl backdrop-blur-sm transition border border-white/10">
                 Vérifier mon éligibilité
               </a>
            </div>
          </div>
        </section>

        {/* Info Bar */}
        <div className="bg-slate-50 border-b border-slate-200">
             <div className="max-w-7xl mx-auto px-6 py-6 grid md:grid-cols-3 gap-6 text-center md:text-left">
                 <div className="flex items-center gap-4 justify-center md:justify-start">
                     <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                         <ShieldCheck className="w-6 h-6" />
                     </div>
                     <div>
                         <h3 className="font-bold text-slate-900">100% Agréé</h3>
                         <p className="text-sm text-slate-600">Préfecture & ANTS</p>
                     </div>
                 </div>
                 <div className="flex items-center gap-4 justify-center md:justify-start">
                     <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                         <Clock className="w-6 h-6" />
                     </div>
                     <div>
                         <h3 className="font-bold text-slate-900">Rapide</h3>
                         <p className="text-sm text-slate-600">2 jours consécutifs</p>
                     </div>
                 </div>
                 <div className="flex items-center gap-4 justify-center md:justify-start">
                     <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
                         <AlertTriangle className="w-6 h-6" />
                     </div>
                     <div>
                         <h3 className="font-bold text-slate-900">Sauvez votre permis</h3>
                         <p className="text-sm text-slate-600">Évitez l'annulation</p>
                     </div>
                 </div>
             </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="lg:w-1/4 hidden lg:block">
                <SidebarFilter />
            </aside>

            {/* Main Content */}
            <div className="lg:w-3/4 space-y-12">
                
                {/* Sessions List */}
                <section id="sessions">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                        <Calendar className="w-6 h-6 text-gold-500 mr-2" />
                        Prochaines sessions disponibles
                    </h2>
                    <p className="text-slate-600 mb-6">Paris et Île-de-France • Places limitées</p>
                    <SessionCalendar sessions={upcomingSessions} />
                     <p className="text-sm text-slate-500 mt-4 italic">
                        * Le capital de points est crédité en date de valeur le lendemain du 2ème jour de stage.
                    </p>
                </section>

                {/* Content: Les cas de stage */}
                <section id="eligibilite">
                    <div className="grid lg:grid-cols-2 gap-12">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-6">Dans quel cas faire un stage ?</h2>
                            <div className="space-y-4">
                                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-lg text-slate-900">Cas 1 : Stage Volontaire</h3>
                                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">+4 points</span>
                                    </div>
                                    <p className="text-slate-600 text-sm">Vous avez perdu des points et souhaitez les récupérer avant de recevoir une lettre 48SI (invalidation). Limité à un stage par an.</p>
                                </div>

                                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-lg text-slate-900">Cas 2 : Permis Probatoire (48N)</h3>
                                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">+4 points + Remboursement amende</span>
                                    </div>
                                    <p className="text-slate-600 text-sm">
                                        Obligatoire si vous avez perdu 3 points ou plus en période probatoire et reçu la lettre 48N.
                                    </p>
                                </div>

                                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 opacity-75">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-lg text-slate-900">Cas 3 & 4 : Justice</h3>
                                        <span className="bg-slate-100 text-slate-500 px-2 py-1 rounded text-xs font-bold">0 point</span>
                                    </div>
                                    <p className="text-slate-600 text-sm">
                                        Stage obligatoire suite à une composition pénale ou une peine complémentaire. Ne permet pas de récupérer de points, mais évite des sanctions plus lourdes.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div>
                                    <h2 className="text-3xl font-bold text-slate-900 mb-6">Conditions d'éligibilité</h2>
                                    <ul className="space-y-4">
                                        <li className="flex gap-3">
                                            <CheckCircle2 className="w-6 h-6 text-gold-500 shrink-0" />
                                            <span className="text-slate-700">Avoir un permis de conduire valide (pas de lettre 48SI reçue).</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <CheckCircle2 className="w-6 h-6 text-gold-500 shrink-0" />
                                            <span className="text-slate-700">Avoir perdu des points (solde inférieur à 12).</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <CheckCircle2 className="w-6 h-6 text-gold-500 shrink-0" />
                                            <span className="text-slate-700">Ne pas avoir effectué de stage de récupération de points depuis 1 an et 1 jour.</span>
                                        </li>
                                    </ul>
                            </div>
                            
                            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                                <h3 className="font-bold text-blue-900 mb-2">Information Importante</h3>
                                <p className="text-sm text-blue-800">
                                    Tous les stages proposés par SL Formations sont agréés par la préfecture et organisés dans le cadre légal (arrêté du 26 juin 2012).
                                </p>
                            </div>
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

