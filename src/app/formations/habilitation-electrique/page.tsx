
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getCoursesByType } from "@/lib/courses";
import Link from "next/link";
import { ArrowRight, Zap, AlertTriangle, BookOpen } from "lucide-react";

export const metadata = {
  title: "Habilitation Électrique (Non Électricien) | SL Formations",
  description:
    "Formations Habilitation Électrique H0B0, BS, BE Manœuvre pour non-électriciens. Respectez la norme NF C 18-510.",
};

export default async function HabilitationPage() {
  const courses = await getCoursesByType("HABILITATION");

  return (
    <div className="min-h-screen flex flex-col text-slate-900 font-sans">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 bg-blue-900 overflow-hidden">
             <div className="absolute inset-0 z-0">
             <img
              className="w-full h-full object-cover opacity-20"
              src="https://www.flobel.fr/wp-content/uploads/2023/02/HABELEC-H0B0-850x425.jpg"
              alt="Habilitation Electrique"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-950 via-blue-900/90 to-blue-900/60" />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-6 text-center md:text-left">
             <span className="inline-block px-3 py-1 mb-4 rounded-full bg-blue-500/20 text-blue-300 text-sm font-semibold">
              Norme NF C 18-510
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Habilitation Électrique <br/>
              <span className="text-blue-400">Non Électricien</span>
            </h1>
            <p className="text-lg text-blue-100 max-w-2xl mb-8 leading-relaxed">
              Pour travailler en sécurité à proximité d'installations électriques. Nos formations H0B0, BS, BE Manœuvre vous permettent d'obtenir l'habilitation obligatoire.
            </p>
          </div>
        </section>

        {/* Content */}
         <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-12 text-slate-600">
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold text-slate-900">Pour qui sont ces formations ?</h2>
                        <p>
                            Les formations d’habilitation électrique <strong>non électricien</strong> s’adressent aux travailleurs dont les tâches impliquent une proximité avec des installations électriques sans être des électriciens de métier.
                        </p>
                         <ul className="space-y-4 mt-6">
                            <li className="flex gap-4">
                                <div className="p-2 bg-blue-50 rounded-lg h-fit">
                                    <Zap className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <strong className="block text-slate-900">Travailleurs non-électriciens</strong>
                                    <span className="text-sm">Peintres, maçons, agents d'entretien, agents de logistique travaillant en zone électrique.</span>
                                </div>
                            </li>
                             <li className="flex gap-4">
                                <div className="p-2 bg-blue-50 rounded-lg h-fit">
                                    <AlertTriangle className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <strong className="block text-slate-900">Encadrement & Sécurité</strong>
                                    <span className="text-sm">Managers et responsables sécurité devant superviser des travaux.</span>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8">
                        <h3 className="text-xl font-bold text-slate-900 mb-4">Objectifs & Validité</h3>
                        <p className="text-sm mb-6 leading-relaxed">
                            L'objectif principal est d'acquérir la <strong>connaissance des risques électriques</strong> et la maîtrise des mesures de prévention pour éviter tout accident.
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                             <div className="p-4 bg-white rounded-xl shadow-sm">
                                <span className="block text-3xl font-bold text-blue-600 mb-1">3 ans</span>
                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Validité</span>
                            </div>
                            <div className="p-4 bg-white rounded-xl shadow-sm">
                                <span className="block text-3xl font-bold text-blue-600 mb-1">Obligatoire</span>
                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Réglementation</span>
                            </div>
                        </div>
                         <p className="text-xs text-slate-400 mt-4 italic">
                            Après 3 ans, un recyclage est nécessaire pour maintenir l'habilitation.
                        </p>
                    </div>
                </div>
            </div>
         </section>

        {/* Courses List */}
        <section className="py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">Nos sessions Habilitation Électrique</h2>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
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
                         <Zap className="w-12 h-12 text-blue-300" />
                      </div>
                    )}
                     <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded uppercase tracking-wider">
                        Habilitation
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-slate-600 text-sm mb-6 line-clamp-3 leading-relaxed">
                      {course.description}
                    </p>
                    
                     <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                      {course.slug && (
                        <Link
                          href={`/formations/${course.slug}`}
                          className="text-blue-600 font-bold text-sm flex items-center hover:text-blue-700 transition"
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
