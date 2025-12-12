import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { Filter, Search, Clock, MapPin } from "lucide-react";
import { getCourses } from "@/lib/courses";

export const metadata = {
  title: "Catalogue des formations | SL Formations",
};

export default async function CatalogueFormationsPage() {
  const courses = await getCourses();
  return (
    <div className="min-h-screen flex flex-col text-slate-900 font-sans">
      <Header />

      <main className="flex-1">
        {/* Hero catalogue */}
        <section
          id="catalog-hero"
          className="pt-32 pb-16 bg-gradient-to-b from-slate-900 to-slate-800"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-10">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
                Catalogue des{" "}
                <span className="text-gold-400">
                  Formations
                </span>
              </h1>
              <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
                Découvrez l’ensemble de nos formations permis, VTC / Taxi et
                sécurité pour réussir votre projet professionnel.
              </p>
            </div>
          </div>
        </section>

        {/* Liste + filtres redesign */}
        <section id="catalog-main" className="py-12 bg-slate-50 min-h-[60vh]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col lg:flex-row gap-10">
              {/* Sidebar filtres épurée */}
              <aside
                id="filters-sidebar"
                className="lg:w-72 space-y-8 order-2 lg:order-1"
              >
                <div>
                  <h3 className="text-lg font-bold mb-4 text-slate-900 flex items-center">
                    <Filter className="w-5 h-5 mr-2 text-gold-500" />
                    Filtrer par domaine
                  </h3>
                  <div className="space-y-3">
                    {['Toutes les formations', 'Transport (Permis, FIMO)', 'Sécurité (SSIAP, CACES)', 'VTC & Taxi'].map((filter, idx) => (
                      <button 
                        key={idx}
                        className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${idx === 0 ? 'bg-navy-900 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gold-400/10 rounded-bl-full -mr-4 -mt-4"></div>
                  <h4 className="font-bold text-slate-900 mb-2 relative z-10">Besoin d&apos;aide ?</h4>
                  <p className="text-sm text-slate-600 mb-4 relative z-10">
                    Nos conseillers sont disponibles pour vous orienter vers la formation adaptée à votre profil.
                  </p>
                  <a href="/contact" className="inline-flex items-center text-sm font-bold text-gold-600 hover:text-gold-700 relative z-10">
                    Contacter un conseiller
                    <MapPin className="w-3 h-3 ml-1 transform rotate-[-45deg]" /> 
                  </a>
                </div>
              </aside>

              {/* Grille formations redesign */}
              <section
                id="courses-grid"
                className="flex-1 order-1 lg:order-2"
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-slate-900">Nos programmes de formation</h2>
                  <div className="text-sm text-slate-500">
                    <span className="font-semibold text-slate-900">{courses.length}</span> résultats
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {courses.map((course) => (
                    <article
                      key={course.id}
                      className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col"
                    >
                      <div className="h-56 overflow-hidden relative bg-slate-100">
                        {course.imageUrl ? (
                          <img
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                            src={course.imageUrl}
                            alt={course.title}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <Clock className="w-12 h-12" />
                          </div>
                        )}
                        <div className="absolute top-4 left-4">
                          <span className="inline-block px-3 py-1 bg-navy-900/95 backdrop-blur-sm text-white rounded-md text-xs font-semibold tracking-wide uppercase shadow-sm">
                            {course.type}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-6 flex flex-col flex-1">
                        <div className="mb-4">
                          <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-gold-600 transition-colors">
                            {course.title}
                          </h3>
                          <p className="text-slate-600 text-sm leading-relaxed line-clamp-2">
                            {course.description}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6 pt-4 border-t border-slate-100">
                          <div className="flex items-center space-x-2 text-sm text-slate-600">
                            <Clock className="w-4 h-4 text-gold-500" />
                            <span>Durée : 35h</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-slate-600">
                            <MapPin className="w-4 h-4 text-gold-500" />
                            <span>En centre</span>
                          </div>
                        </div>

                        <div className="mt-auto">
                          {course.slug && (
                            <Link
                              href={`/formations/${course.slug}`}
                              className="block w-full py-3 px-4 bg-slate-900 text-white rounded-lg font-semibold text-sm text-center hover:bg-gold-500 hover:text-slate-900 hover:shadow-lg transition-all duration-300"
                            >
                              Découvrir le programme
                            </Link>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}


