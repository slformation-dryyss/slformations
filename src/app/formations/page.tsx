import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { Clock } from "lucide-react";
import SidebarFilter from "@/components/formations/SidebarFilter";

export default function FormationsPage() {
  return (
      <div className="min-h-screen flex flex-col text-slate-900 font-sans">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section id="catalog-hero" className="pt-32 pb-16 bg-gradient-to-b from-slate-900 to-slate-800">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-12">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
                        Catalogue des <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-500">Formations</span>
                    </h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                        Découvrez nos formations professionnelles pour réussir dans le transport et la sécurité
                    </p>
                </div>
            </div>
        </section>

        <section id="catalog-main" className="py-8 bg-slate-100">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col lg:flex-row gap-8">
                    
                    {/* Sidebar */}
                    <aside className="lg:w-1/4">
                       <SidebarFilter />
                    </aside>
                    
                    {/* Main Grid */}
                    <main id="courses-grid" className="flex-1">
                        <div className="flex items-center justify-between mb-8">
                            <div className="text-slate-500">
                                <span className="font-semibold text-slate-900">Nos formations</span> disponibles
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {/* Course Card 1 - Permis Moto */}
                             <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 card-hover shadow-sm hover:shadow-md transition-all flex flex-col">
                                <Link href="/formations/permis-moto" className="h-48 overflow-hidden block">
                                    <img className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2070&auto=format&fit=crop" alt="Permis Moto A2" />
                                </Link>
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="inline-block px-3 py-1 bg-gold-500/20 text-gold-600 rounded-full text-sm font-semibold">Permis A2</div>
                                        <div className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">Débutant</div>
                                    </div>
                                    <h3 className="text-xl font-bold mb-2 text-slate-900">
                                        <Link href="/formations/permis-moto" className="hover:text-gold-500 transition">Permis Moto A2</Link>
                                    </h3>
                                    <p className="text-slate-500 text-sm mb-4 line-clamp-2">Formation complète sur piste privée. Formules 20h ou 25h.</p>
                                    <div className="flex items-center justify-between mb-4 mt-auto">
                                        <div className="flex items-center space-x-2 text-slate-400 text-sm">
                                            <Clock className="w-4 h-4" />
                                            <span>20h min</span>
                                        </div>
                                        <div className="text-slate-900 font-bold text-lg">Dès 695€</div>
                                    </div>
                                    <Link href="/formations/permis-moto" className="w-full py-3 bg-slate-900 hover:bg-gold-500 hover:text-white text-white rounded-lg font-semibold transition text-center block">
                                        Voir les forfaits
                                    </Link>
                                </div>
                            </div>

                             {/* Course Card 2 - Permis B */}
                             <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 card-hover shadow-sm hover:shadow-md transition-all flex flex-col">
                                <Link href="/formations/permis-b" className="h-48 overflow-hidden block">
                                    <img className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop" alt="Permis B" />
                                </Link>
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="inline-block px-3 py-1 bg-gold-500/20 text-gold-600 rounded-full text-sm font-semibold">Permis B</div>
                                        <div className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">Tous niveaux</div>
                                    </div>
                                    <h3 className="text-xl font-bold mb-2 text-slate-900">
                                        <Link href="/formations/permis-b" className="hover:text-gold-500 transition">Permis Voiture</Link>
                                    </h3>
                                    <p className="text-slate-500 text-sm mb-4 line-clamp-2">Manuelle ou Automatique. Formules accélérées disponibles.</p>
                                    <div className="flex items-center justify-between mb-4 mt-auto">
                                        <div className="flex items-center space-x-2 text-slate-400 text-sm">
                                            <Clock className="w-4 h-4" />
                                            <span>13h min</span>
                                        </div>
                                        <div className="text-slate-900 font-bold text-lg">Dès 980€</div>
                                    </div>
                                    <Link href="/formations/permis-b" className="w-full py-3 bg-slate-900 hover:bg-gold-500 hover:text-white text-white rounded-lg font-semibold transition text-center block">
                                        Voir les formules
                                    </Link>
                                </div>
                            </div>

                             {/* Course Card 3 - VTC */}
                             <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 card-hover shadow-sm hover:shadow-md transition-all flex flex-col">
                                <Link href="/formations/vtc" className="h-48 overflow-hidden block">
                                    <img className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" src="https://images.unsplash.com/photo-1556125574-d7f27ec36a10?q=80&w=2070&auto=format&fit=crop" alt="VTC" />
                                </Link>
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="inline-block px-3 py-1 bg-gold-500/20 text-gold-600 rounded-full text-sm font-semibold">Transport</div>
                                        <div className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">Pro</div>
                                    </div>
                                    <h3 className="text-xl font-bold mb-2 text-slate-900">
                                        <Link href="/formations/vtc" className="hover:text-gold-500 transition">Formation VTC</Link>
                                    </h3>
                                    <p className="text-slate-500 text-sm mb-4 line-clamp-2">Devenez chauffeur VTC. Préparation examen théorique et pratique.</p>
                                    <div className="flex items-center justify-between mb-4 mt-auto">
                                        <div className="flex items-center space-x-2 text-slate-400 text-sm">
                                            <Clock className="w-4 h-4" />
                                            <span>Variable</span>
                                        </div>
                                        <div className="text-slate-900 font-bold text-lg">Sur devis</div>
                                    </div>
                                    <Link href="/formations/vtc" className="w-full py-3 bg-slate-900 hover:bg-gold-500 hover:text-white text-white rounded-lg font-semibold transition text-center block">
                                        Découvrir
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

