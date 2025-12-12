
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getCoursesByType } from "@/lib/courses";
import Link from "next/link";
import { ArrowRight, Clock, ShieldCheck, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Formations CACES® | SL Formations",
  description:
    "Passez votre CACES R489 (Chariots), R486 (Nacelles), R482 (Engins de chantier) avec SL Formations. Formation certifiante pour la conduite en sécurité.",
};

export default async function CacesPage() {
  const courses = await getCoursesByType("CACES");

  return (
    <div className="min-h-screen flex flex-col text-slate-900 font-sans">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 bg-navy-900 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              className="w-full h-full object-cover opacity-20"
              src="https://www.flobel.fr/wp-content/uploads/2023/04/R489-CACES-850x425.jpg"
              alt="Formation CACES"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-navy-900 via-navy-900/90 to-navy-900/50" />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-6 text-center md:text-left">
            <span className="inline-block px-3 py-1 mb-4 rounded-full bg-gold-500/20 text-gold-500 text-sm font-semibold">
              Sécurité & Manutention
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Nos formations <span className="text-gold-500">CACES®</span>
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mb-8 leading-relaxed">
              Les Certificats d’Aptitude à la Conduite En Sécurité (CACES®) sont indispensables pour prévenir les risques liés à la manipulation d’engins de chantier. Assurez la sécurité et la conformité de votre activité avec nos formations certifiantes.
            </p>
          </div>
        </section>

        {/* Introduction & Info */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-slate-600 leading-relaxed">
              <h2 className="text-3xl font-bold text-slate-900">
                Qu’est-ce que le CACES® ?
              </h2>
              <p>
                Le CACES® (Certificat d’Aptitude à la Conduite En Sécurité) atteste de la compétence d’un professionnel à conduire certains types d’engins de chantier ou d’équipements en toute sécurité.
              </p>
              <p>
                Cette certification vise à garantir la sécurité du conducteur, des autres travailleurs et des installations. Elle est souvent une exigence légale ou réglementaire pour les opérateurs dans les secteurs de la logistique, du BTP et de l'industrie.
              </p>
              <div className="bg-slate-50 p-6 rounded-xl border-l-4 border-gold-500">
                <h3 className="font-bold text-slate-900 mb-2">Objectifs de la formation</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-5 h-5 text-gold-500 shrink-0" />
                    <span>Assurer la sécurité des opérateurs et de l'environnement.</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-5 h-5 text-gold-500 shrink-0" />
                    <span>Développer les compétences techniques de conduite.</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-5 h-5 text-gold-500 shrink-0" />
                    <span>Connaître et respecter la réglementation en vigueur.</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="grid gap-6">
               <div className="glass-effect p-6 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm">
                  <ShieldCheck className="w-10 h-10 text-gold-500 mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Obligations & Avantages</h3>
                  <p className="text-slate-600 text-sm">
                    L’obligation de détenir un CACES® dépend de l'engin utilisé. Cependant, c'est un atout majeur pour la sécurité, la conformité légale, et la productivité, réduisant les risques d'accidents et les coûts associés.
                  </p>
               </div>
               <div className="glass-effect p-6 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm">
                  <Clock className="w-10 h-10 text-gold-500 mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Durée & Recyclage</h3>
                  <p className="text-slate-600 text-sm">
                    La durée varie selon la catégorie (2 à 5 jours). Il est recommandé de suivre des formations de recyclage régulières (généralement tous les 5 ou 10 ans selon la famille CACES) pour maintenir ses compétences.
                  </p>
               </div>
            </div>
          </div>
        </section>

        {/* Liste des formations */}
        <section className="py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">Nos formations CACES® disponibles</h2>
            
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
                      <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                        <span className="text-slate-400">Image non disponible</span>
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-navy-900/90 text-white text-xs font-bold rounded uppercase tracking-wider">
                        {course.type}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-gold-600 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-slate-600 text-sm mb-6 line-clamp-3 leading-relaxed">
                      {course.description}
                    </p>
                    
                    <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                      {course.slug && (
                        <Link
                          href={`/formations/${course.slug}`}
                          className="text-gold-600 font-bold text-sm flex items-center hover:text-gold-700 transition"
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
