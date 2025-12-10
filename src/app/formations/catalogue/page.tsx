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
    <div className="min-h-screen bg-navy-900 text-white font-sans">
      <Header />

      <main>
        {/* Hero catalogue */}
        <section
          id="catalog-hero"
          className="pt-32 pb-16 bg-gradient-to-b from-navy-800 to-navy-900"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-10">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                Catalogue des{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-500 to-gold-600">
                  Formations
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
                Découvrez l’ensemble de nos formations permis, VTC / Taxi et
                sécurité pour réussir votre projet professionnel.
              </p>
            </div>
          </div>
        </section>

        {/* Liste + filtres */}
        <section id="catalog-main" className="py-10 bg-navy-900">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar filtres (maquette, non fonctionnel) */}
              <aside
                id="filters-sidebar"
                className="lg:w-80 space-y-6 order-2 lg:order-1"
              >
                <div className="glass-effect rounded-2xl p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <Filter className="text-gold-500 mr-2 w-5 h-5" />
                    Affiner votre recherche
                  </h3>

                  <div className="mb-6">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Rechercher une thématique, un code formation..."
                        className="w-full bg-navy-800 border border-navy-700 rounded-lg px-4 py-3 pl-10 text-white focus:border-gold-500 focus:outline-none"
                      />
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold mb-3 text-sm">
                      Type de formation
                    </h4>
                    <div className="space-y-2 text-sm">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="mr-3 accent-gold-500"
                          defaultChecked
                        />
                        <span>Toutes les formations</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="mr-3 accent-gold-500"
                        />
                        <span>Permis (A, B, C)</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="mr-3 accent-gold-500"
                        />
                        <span>VTC &amp; Taxi</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="mr-3 accent-gold-500"
                        />
                        <span>Sécurité &amp; SSIAP</span>
                      </label>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold mb-3 text-sm">Durée</h4>
                    <div className="space-y-2 text-sm">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="duration"
                          className="mr-3 accent-gold-500"
                        />
                        <span>Moins de 30h</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="duration"
                          className="mr-3 accent-gold-500"
                        />
                        <span>30h - 50h</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="duration"
                          className="mr-3 accent-gold-500"
                        />
                        <span>Plus de 50h</span>
                      </label>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold mb-3 text-sm">
                      Dispositif de financement
                    </h4>
                    <div className="space-y-2 text-sm">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="mr-3 accent-gold-500"
                        />
                        <span>Éligible CPF</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="mr-3 accent-gold-500"
                        />
                        <span>Financement entreprise</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="mr-3 accent-gold-500"
                        />
                        <span>Financement personnel</span>
                      </label>
                    </div>
                  </div>

                  <button className="w-full py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-navy-900 rounded-lg font-bold hover:shadow-lg hover:shadow-gold-500/50 transition">
                    Appliquer les filtres
                  </button>
                </div>
              </aside>

              {/* Grille formations */}
              <section
                id="courses-grid"
                className="flex-1 order-1 lg:order-2 space-y-6"
              >
                <div className="flex items-center justify-between">
                  <div className="text-gray-400 text-sm">
                    <span className="font-semibold text-white">
                      {courses.length} formations
                    </span>{" "}
                    disponibles
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <span className="text-gray-400 hidden sm:inline">
                      Trier les résultats :
                    </span>
                    <select className="bg-navy-800 border border-navy-700 rounded-lg px-3 py-2 text-sm text-white focus:border-gold-500 focus:outline-none">
                      <option>Pertinence (par défaut)</option>
                      <option>Prochaine session</option>
                      <option>Intitulé A-Z</option>
                      <option>Durée croissante</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {courses.map((course) => (
                    <article
                      key={course.id}
                      className="bg-navy-800 rounded-2xl overflow-hidden border border-navy-700 card-hover"
                    >
                      <div className="h-48 overflow-hidden">
                        {course.imageUrl && (
                          <img
                            className="w-full h-full object-cover"
                            src={course.imageUrl}
                            alt={course.title}
                          />
                        )}
                      </div>
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <span className="inline-block px-3 py-1 bg-gold-500/20 text-gold-500 rounded-full text-xs font-semibold">
                            {course.type}
                          </span>
                          <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-[11px] font-medium">
                            En ligne
                          </span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">
                          {course.title}
                        </h3>
                        <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                          {course.description}
                        </p>
                        <div className="flex items-center justify-between mb-3 text-sm text-gray-300">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4" />
                            <span>Programme structuré</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4" />
                            <span>Centre SL Formations</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mb-3 text-sm">
                          <span className="text-gray-400">
                            Public visé : professionnels & particuliers
                          </span>
                          <span className="text-gray-300">
                            À partir de{" "}
                            <span className="font-semibold text-gold-500/90">
                              {course.price}€
                            </span>
                          </span>
                        </div>
                        <div className="flex items-center justify-between mb-4 text-xs text-gray-300">
                          <span>📅 Inscription toute l&apos;année</span>
                          <span className="text-gray-400">
                            Accès en ligne 24/7
                          </span>
                        </div>
                        <div className="space-y-2">
                          {course.slug && (
                            <Link
                              href={`/formations/${course.slug}`}
                              className="block w-full py-3 bg-navy-700 hover:bg-gold-500 hover:text-navy-900 text-white rounded-lg font-semibold text-sm text-center transition"
                            >
                              Voir la fiche formation
                            </Link>
                          )}
                          <button className="w-full py-2 border border-navy-600 text-gray-200 hover:border-gold-500 hover:text-gold-500 rounded-lg text-xs font-medium transition">
                            Demander un devis / Inscription
                          </button>
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


