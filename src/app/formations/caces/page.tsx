
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getCoursesByType, getAllSessionsByType } from "@/lib/courses";
import Link from "next/link";
import { ArrowRight, Clock, ShieldCheck, CheckCircle2, Calendar } from "lucide-react";
import SessionCalendar from "@/components/formations/SessionCalendar";
import SidebarFilter from "@/components/formations/SidebarFilter";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Formations CACES® | SL Formations",
  description:
    "Passez votre CACES R489 (Chariots), R486 (Nacelles), R482 (Engins de chantier) avec SL Formations. Formation certifiante pour la conduite en sécurité.",
};

export default async function CacesPage() {
  const courses = await getCoursesByType("CACES");
  const upcomingSessions = await getAllSessionsByType("CACES");

  return (
    <div className="min-h-screen flex flex-col text-slate-900 font-sans bg-slate-50">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-32 pb-24 bg-slate-900 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              className="w-full h-full object-cover opacity-20 scale-105 animate-slow-zoom"
              src="https://www.flobel.fr/wp-content/uploads/2023/04/R489-CACES-850x425.jpg"
              alt="Formation CACES"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/95 to-slate-900/60" />
            
            {/* Abstract Shapes */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-2/3 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-xs font-bold uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-gold-500 animate-pulse" />
                  Sécurité & Manutention
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                  Formations <span className="text-gold-500">CACES®</span> <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-400 text-3xl md:text-5xl lg:text-6xl">Certifiées & Reconnues</span>
                </h1>
                <p className="text-lg text-slate-300 max-w-xl mb-8 leading-relaxed">
                  Validez vos compétences de conduite d'engins en sécurité (R489, R486, R482). 
                  Nos centres agréés vous préparent aux tests théoriques et pratiques pour une conformité totale.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                    <a href="#sessions" className="px-8 py-3.5 bg-gold-500 hover:bg-gold-600 text-white font-bold rounded-xl transition shadow-lg shadow-gold-500/20 flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Voir les prochaines dates
                    </a>
                    <a href="#programme" className="px-8 py-3.5 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl border border-white/10 transition backdrop-blur-sm">
                        Découvrir les catégories
                    </a>
                </div>
            </div>
            {/* Hero Card/Stats */}
            <div className="md:w-1/3 hidden md:block">
                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-gold-500 text-white flex items-center justify-center font-bold text-xl">98%</div>
                            <div className="text-slate-200 text-sm">de taux de réussite<br/><span className="text-slate-400 text-xs">sur nos sessions 2024</span></div>
                        </div>
                        <div className="h-px bg-white/10" />
                        <div className="flex items-center gap-4">
                             <div className="w-12 h-12 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xl">
                                <CheckCircle2 className="w-6 h-6" />
                             </div>
                             <div className="text-slate-200 text-sm">Centres agréés<br/><span className="text-slate-400 text-xs">partout en Île-de-France</span></div>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12">
            {/* Sidebar */}
            <aside className="lg:w-1/4 hidden lg:block relative">
                <div className="sticky top-24">
                    <SidebarFilter />
                </div>
            </aside>

            {/* Main Content */}
            <div className="lg:w-3/4 space-y-12">
                
                {/* Intro */}
                <section className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-8 items-center">
                    <div className="flex-1">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Qu'est-ce que le CACES® ?</h2>
                        <div className="prose text-slate-600 text-base leading-relaxed mb-6">
                            <p>
                                Le <strong>CACES® (Certificat d’Aptitude à la Conduite En Sécurité)</strong> est bien plus qu'une simple autorisation : c'est la garantie pour les employeurs que vous maîtrisez les règles de sécurité et le maniement des engins.
                            </p>
                            <p>
                                Obligatoire pour de nombreux métiers de la logistique et du BTP, il constitue un véritable atout pour votre employabilité.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {['Sécurité des opérateurs', 'Conformité légale', 'Validité 5 ou 10 ans', 'Valable toute l\'UE'].map((item, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                    <CheckCircle2 className="text-gold-500 w-4 h-4 flex-shrink-0" />
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Visual decoration */}
                    <div className="w-full md:w-1/3 bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col items-center justify-center text-center">
                        <ShieldCheck className="w-16 h-16 text-gold-500 mb-4" />
                        <div className="text-slate-900 font-bold text-lg mb-1">Reconnu par l'État</div>
                        <p className="text-xs text-slate-500">Recommandations CNAM R489, R486...</p>
                    </div>
                </section>

                {/* Course List Grid */}
                <section id="programme">
                     <div className="flex items-center justify-between mb-8">
                         <h3 className="text-2xl font-bold text-slate-900 flex items-center">
                            <span className="bg-gold-500 w-2 h-8 rounded-full mr-3" />
                            Nos formations disponibles
                        </h3>
                     </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                        {courses.map((course) => (
                            <div key={course.id} className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                <div className="h-48 overflow-hidden relative">
                                    <img 
                                        src={course.imageUrl || '/placeholder-course.jpg'} 
                                        alt={course.title} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-slate-900 text-xs font-bold rounded-full shadow-sm">
                                            {course.type}
                                        </span>
                                    </div>
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <h4 className="font-bold text-white text-xl line-clamp-2 leading-tight drop-shadow-md">{course.title}</h4>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <p className="text-slate-500 text-sm line-clamp-2 mb-6 h-10">{course.description}</p>
                                    
                                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Durée</span>
                                            <span className="text-sm font-semibold text-slate-700">3 à 5 jours</span>
                                        </div>
                                        <Link href={`/formations/${course.slug}`} className="group/btn flex items-center gap-2 text-gold-600 font-bold hover:text-gold-700 transition">
                                            Voir le détail
                                            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Calendar */}
                <section id="sessions">
                    <SessionCalendar sessions={upcomingSessions} />
                </section>

                 <div className="p-8 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
                    <div className="relative z-10">
                        <h4 className="font-bold text-white text-2xl mb-2">Besoin d'une formation sur mesure ?</h4>
                        <p className="text-slate-300">Nous organisons des sessions intra-entreprise adaptées à vos besoins.</p>
                    </div>
                    <Link href="/contact" className="relative z-10 px-6 py-3 bg-gold-500 hover:bg-gold-600 text-white font-bold rounded-xl transition shadow-lg shadow-gold-500/20 whitespace-nowrap">
                        Demander un devis
                    </Link>
                    
                     {/* Decor */}
                    <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
                </div>
            </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

