
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getCoursesByType } from "@/lib/courses";
import Link from "next/link";
import { ArrowRight, Flame, Truck, Users } from "lucide-react";

export const metadata = {
  title: "Formations Incendie & Unité Mobile | SL Formations",
  description:
    "Formations sécurité incendie avec Unité Mobile (Camion Feu), manipulation d'extincteurs et équipier d'évacuation.",
};

export default async function IncendiePage() {
  const courses = await getCoursesByType("INCENDIE");

  return (
    <div className="min-h-screen flex flex-col text-slate-900 font-sans">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 bg-orange-900 overflow-hidden">
             <div className="absolute inset-0 z-0">
             <img
              className="w-full h-full object-cover opacity-20"
              src="https://img.freepik.com/free-photo/firefighter-extinguishing-fire_23-2149367460.jpg"
              alt="Formation Incendie"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-orange-950 via-orange-900/90 to-orange-900/60" />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-6 text-center md:text-left">
             <span className="inline-block px-3 py-1 mb-4 rounded-full bg-orange-500/20 text-orange-400 text-sm font-semibold">
              Sécurité Incendie
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Formations Incendie <br/>
              <span className="text-orange-500">avec Unité Mobile</span>
            </h1>
            <p className="text-lg text-orange-100 max-w-2xl mb-8 leading-relaxed">
              Préparez vos équipes à réagir face au feu grâce à nos formations immersives. Notre unité mobile (Camion Feu) se déplace sur votre site pour des mises en situation réalistes et sécurisées.
            </p>
          </div>
        </section>

         {/* Content Block */}
         <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-12">
                    <div className="space-y-6 text-slate-600">
                        <h2 className="text-3xl font-bold text-slate-900">Une formation pratique et immersive</h2>
                        <p>
                            La formation incendie dispensée à l’aide d’unités mobiles offre une opportunité sécurisée pour se familiariser avec l’utilisation des équipements de prévention. Elle permet de reproduire fidèlement la réalité d’une intervention incendie (fumées, chaleur, maniement des lances) sans les risques associés.
                        </p>
                        <h3 className="text-xl font-bold text-slate-900 mt-6">Avantages de l'Unité Mobile</h3>
                        <ul className="space-y-4">
                            <li className="flex gap-4">
                                <div className="p-3 rounded-full bg-orange-100 text-orange-600 h-fit">
                                    <Truck className="w-6 h-6" />
                                </div>
                                <div>
                                    <strong className="block text-slate-900">Réactivité & Flexibilité</strong>
                                    <span className="text-sm">Nous venons à vous. Pas de déplacement de personnel, gain de temps et d'organisation.</span>
                                </div>
                            </li>
                             <li className="flex gap-4">
                                <div className="p-3 rounded-full bg-orange-100 text-orange-600 h-fit">
                                    <Flame className="w-6 h-6" />
                                </div>
                                <div>
                                    <strong className="block text-slate-900">Simulation Réaliste</strong>
                                    <span className="text-sm">Simulateurs de feux réels pour un apprentissage par la pratique en toute sécurité.</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                    
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8">
                        <h3 className="text-2xl font-bold text-slate-900 mb-6">Informations Pratiques</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-3 border-b border-slate-200">
                                <span className="text-slate-600 font-medium">Lieu</span>
                                <span className="font-bold text-slate-900">Sur votre site (Intra)</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-slate-200">
                                <span className="text-slate-600 font-medium">Capacité</span>
                                <span className="font-bold text-slate-900">10 à 60 pers. / jour</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-slate-200">
                                <span className="text-slate-600 font-medium">Durée</span>
                                <span className="font-bold text-slate-900">1h à 1 journée</span>
                            </div>
                             <div className="flex justify-between items-center py-3">
                                <span className="text-slate-600 font-medium">Fréquence</span>
                                <span className="font-bold text-slate-900">Annuelle conseillée</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
         </section>

        {/* Courses List */}
        <section className="py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">Nos programmes Incendie</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                <article key={course.id} className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
                  <div className="h-48 overflow-hidden relative">
                    {course.imageUrl ? (
                      <img
                        src={course.imageUrl}
                        alt={course.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                         <Flame className="w-12 h-12 text-orange-400" />
                      </div>
                    )}
                     <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-orange-600 text-white text-xs font-bold rounded uppercase tracking-wider">
                        Incendie
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-orange-600 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-slate-600 text-sm mb-6 line-clamp-3 leading-relaxed">
                      {course.description}
                    </p>
                    
                     <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                      {course.slug && (
                        <Link
                          href={`/formations/${course.slug}`}
                          className="text-orange-600 font-bold text-sm flex items-center hover:text-orange-700 transition"
                        >
                          Voir le programme
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
