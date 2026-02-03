
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { Filter, Search, Clock, MapPin, Laptop, Shield, Code, ArrowUpDown } from "lucide-react";
import { getCourses } from "@/lib/courses";
import { CatalogueSearch } from "@/components/formations/CatalogueSearch";
import { getCourseImage } from "@/lib/course-image-helper";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Catalogue des formations | SL Formations",
};

export default async function CatalogueFormationsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string; sort?: string }>;
}) {
  const allCourses = await getCourses();
  const resolvedSearchParams = await searchParams;
  const category = resolvedSearchParams.category;
  const query = resolvedSearchParams.q?.toLowerCase();
  const sort = resolvedSearchParams.sort || 'newest'; // 'newest', 'alpha-asc', 'alpha-desc'

  // Logic de filtrage
  let courses = allCourses.filter((course) => {
    // 1. Filtrer par catégorie
    if (category && category !== 'all') {
      const type = course.type.toUpperCase();
      let match = false;
      switch (category) {
        case 'transport':
          match = ['PERMIS', 'RECUP_POINTS', 'TRANSPORT'].includes(type);
          break;
        case 'securite':
          match = ['SSIAP', 'CACES', 'INCENDIE', 'SECOURISME', 'HABILITATION'].includes(type);
          break;
        case 'vtc':
          match = ['VTC', 'TAXI'].includes(type);
          break;
        case 'tech':
          match = ['DEV', 'CYBER', 'CMS', 'TECH'].includes(type);
          break;
        default:
          match = true;
      }
      if (!match) return false;
    }

    // 2. Filtrer par recherche (titre ou description)
    if (query) {
      const titleMatch = course.title.toLowerCase().includes(query);
      const descMatch = course.description.toLowerCase().includes(query);
      if (!titleMatch && !descMatch) return false;
    }

    return true;
  });

  // Logic de tri
  courses = courses.sort((a, b) => {
    switch (sort) {
      case 'alpha-asc':
        return a.title.localeCompare(b.title);
      case 'alpha-desc':
        return b.title.localeCompare(a.title);
      case 'newest':
      default:
        // Assuming createdAt is available or sorting by ID/implicit order if not. 
        // If createdAt is needed, ensure it is in the course object. Currently getCourses sorts by desc createdAt by default.
        // So we might not need to re-sort for 'newest' if we don't change the default order, but let's be explicit if possible.
        // Since getCourses() returns order desc, we trust that order.
        return 0;
    }
  });

  const filters = [
    { name: 'Toutes les formations', value: 'all' },
    { name: 'Transport (Permis)', value: 'transport' },
    { name: 'Sécurité (SSIAP, CACES)', value: 'securite' },
    { name: 'VTC & Taxi', value: 'vtc' },
    { name: 'Numérique & Tech', value: 'tech' },
  ];

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
              <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-8">
                Découvrez l’ensemble de nos formations : Transport, Sécurité, VTC et Numérique !
              </p>

              {/* Search Bar Integration */}
              <CatalogueSearch />
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
                    {filters.map((filter) => {
                      const isActive = (category === filter.value) || (!category && filter.value === 'all');
                      return (
                        <Link
                          key={filter.value}
                          href={filter.value === 'all' ? `/formations/catalogue?q=${query || ''}` : `/formations/catalogue?category=${filter.value}&q=${query || ''}`}
                          className={`block w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                            ? 'bg-slate-900 text-white shadow-md'
                            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                            }`}
                        >
                          {filter.name}
                        </Link>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden hidden lg:block">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gold-400/10 rounded-bl-full -mr-4 -mt-4"></div>
                  <h4 className="font-bold text-slate-900 mb-2 relative z-10">Une question ?</h4>
                  <p className="text-sm text-slate-600 mb-4 relative z-10">
                    Nos conseillers vous répondent directement au :<br />
                    <span className="font-bold text-slate-900">01 60 28 54 18</span>
                  </p>
                  <a href="/contact" className="inline-flex items-center text-sm font-bold text-gold-600 hover:text-gold-700 relative z-10">
                    Nous contacter
                    <MapPin className="w-3 h-3 ml-1 transform rotate-[-45deg]" />
                  </a>
                </div>
              </aside>

              {/* Grille formations redesign */}
              <section
                id="courses-grid"
                className="flex-1 order-1 lg:order-2"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Nos programmes</h2>
                    <div className="text-sm text-slate-500 mt-1">
                      <span className="font-semibold text-slate-900">{courses.length}</span> résultats
                      {query && <span> pour &quot;<span className="text-slate-900 font-medium">{query}</span>&quot;</span>}
                    </div>
                  </div>

                  {/* Tri */}
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="text-slate-500 hidden sm:inline">Trier par :</span>
                    <div className="flex bg-white border border-slate-200 rounded-lg p-1">
                      <Link
                        href={`?${new URLSearchParams({ ...resolvedSearchParams, sort: 'newest' }).toString()}`}
                        className={`px-3 py-1.5 rounded-md transition-colors ${sort === 'newest' ? 'bg-slate-100 text-slate-900 font-medium' : 'text-slate-500 hover:bg-slate-50'}`}
                      >
                        Nouveautés
                      </Link>
                      <Link
                        href={`?${new URLSearchParams({ ...resolvedSearchParams, sort: 'alpha-asc' }).toString()}`}
                        className={`px-3 py-1.5 rounded-md transition-colors ${sort === 'alpha-asc' ? 'bg-slate-100 text-slate-900 font-medium' : 'text-slate-500 hover:bg-slate-50'}`}
                      >
                        A-Z
                      </Link>
                    </div>
                  </div>
                </div>

                {courses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {courses.map((course) => (
                      <article
                        key={course.id}
                        className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col"
                      >
                        <div className="h-56 overflow-hidden relative bg-slate-100">
                          {course.imageUrl || getCourseImage(course) ? (
                            <img
                              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                              src={getCourseImage(course)}
                              alt={course.title}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                              <Clock className="w-12 h-12" />
                            </div>
                          )}
                          <div className="absolute top-4 left-4">
                            <span className="inline-block px-3 py-1 bg-slate-900/95 backdrop-blur-sm text-white rounded-md text-xs font-semibold tracking-wide uppercase shadow-sm">
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
                              <span>En centre / Hybride</span>
                            </div>
                          </div>

                          <div className="mt-auto flex items-center justify-between gap-4">
                            {course.slug && (
                              <Link
                                href={`/formations/${course.slug}`}
                                className="flex-1 py-3 px-4 bg-slate-900 text-white rounded-lg font-semibold text-sm text-center hover:bg-gold-500 hover:text-slate-900 hover:shadow-lg transition-all duration-300"
                              >
                                Découvrir
                              </Link>
                            )}
                            <div className="text-right">
                              <div className="text-[10px] font-black text-slate-400 uppercase leading-none">Prix</div>
                              <div className="text-lg font-black text-slate-900">{course.price > 0 ? `${course.price}€` : "Devis"}</div>
                            </div>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                    <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Aucun résultat trouvé</h3>
                    <p className="text-slate-500 text-base mb-6">
                      Nous n&apos;avons pas trouvé de formation correspondant à votre recherche.
                      Essayez d&apos;autres mots-clés ou consultez toutes nos formations.
                    </p>
                    <Link href="/formations/catalogue" className="inline-block px-6 py-3 bg-gold-500 text-slate-900 font-bold rounded-lg hover:bg-gold-400 transition-colors">
                      Voir tout le catalogue
                    </Link>
                  </div>
                )}
              </section>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}



