import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { Filter, Search, Clock, Star, ChevronLeft, ChevronRight } from "lucide-react";

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
                    <aside id="filters-sidebar" className="lg:w-80 space-y-6">
                        <div className="glass-effect rounded-2xl p-6 bg-white border border-slate-200 shadow-sm">
                            <h3 className="text-xl font-bold mb-4 flex items-center text-slate-900">
                                <Filter className="text-gold-500 mr-2 w-5 h-5" />
                                Filtres
                            </h3>
                            
                            <div className="mb-6">
                                <div className="relative">
                                    <input type="text" placeholder="Rechercher une formation..." className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 pl-10 text-slate-900 focus:border-gold-500 focus:outline-none placeholder:text-slate-400" />
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                                </div>
                            </div>
                            
                            <div className="mb-6">
                                <h4 className="font-semibold mb-3 text-slate-900">Type de Formation</h4>
                                <div className="space-y-2 text-slate-600">
                                    <label className="flex items-center hover:text-slate-900 transition">
                                        <input type="checkbox" className="mr-3 accent-gold-500 border-slate-300" defaultChecked />
                                        <span>Toutes les formations</span>
                                    </label>
                                    <label className="flex items-center hover:text-slate-900 transition">
                                        <input type="checkbox" className="mr-3 accent-gold-500 border-slate-300" />
                                        <span>Permis (A, B, C, EB)</span>
                                    </label>
                                    <label className="flex items-center hover:text-slate-900 transition">
                                        <input type="checkbox" className="mr-3 accent-gold-500 border-slate-300" />
                                        <span>VTC & Taxi</span>
                                    </label>
                                    <label className="flex items-center hover:text-slate-900 transition">
                                        <input type="checkbox" className="mr-3 accent-gold-500 border-slate-300" />
                                        <span>Sécurité & SSIAP</span>
                                    </label>
                                </div>
                            </div>
                            
                            <div className="mb-6">
                                <h4 className="font-semibold mb-3 text-slate-900">Durée</h4>
                                <div className="space-y-2 text-slate-600">
                                    <label className="flex items-center hover:text-slate-900 transition">
                                        <input type="radio" name="duration" className="mr-3 accent-gold-500 border-slate-300" />
                                        <span>Moins de 30h</span>
                                    </label>
                                    <label className="flex items-center hover:text-slate-900 transition">
                                        <input type="radio" name="duration" className="mr-3 accent-gold-500 border-slate-300" />
                                        <span>30h - 50h</span>
                                    </label>
                                    <label className="flex items-center hover:text-slate-900 transition">
                                        <input type="radio" name="duration" className="mr-3 accent-gold-500 border-slate-300" />
                                        <span>Plus de 50h</span>
                                    </label>
                                </div>
                            </div>
                            
                            <div className="mb-6">
                                <h4 className="font-semibold mb-3 text-slate-900">Budget</h4>
                                <div className="space-y-2 text-slate-600">
                                    <label className="flex items-center hover:text-slate-900 transition">
                                        <input type="radio" name="price" className="mr-3 accent-gold-500 border-slate-300" />
                                        <span>Moins de 1000€</span>
                                    </label>
                                    <label className="flex items-center hover:text-slate-900 transition">
                                        <input type="radio" name="price" className="mr-3 accent-gold-500 border-slate-300" />
                                        <span>1000€ - 1500€</span>
                                    </label>
                                    <label className="flex items-center hover:text-slate-900 transition">
                                        <input type="radio" name="price" className="mr-3 accent-gold-500 border-slate-300" />
                                        <span>Plus de 1500€</span>
                                    </label>
                                </div>
                            </div>
                            
                            <button className="w-full py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-white rounded-lg font-bold hover:shadow-lg hover:shadow-gold-500/50 transition">
                                Appliquer les filtres
                            </button>
                        </div>
                    </aside>
                    
                    {/* Main Grid */}
                    <main id="courses-grid" className="flex-1">
                        <div className="flex items-center justify-between mb-8">
                            <div className="text-slate-500">
                                <span className="font-semibold text-slate-900">24 formations</span> disponibles
                            </div>
                            <div className="flex items-center space-x-4">
                                <span className="text-slate-500">Trier par:</span>
                                <select className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-slate-900 focus:border-gold-500 focus:outline-none">
                                    <option>Plus récent</option>
                                    <option>Prix croissant</option>
                                    <option>Prix décroissant</option>
                                    <option>Durée</option>
                                    <option>Popularité</option>
                                </select>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {/* Course Card 1 */}
                            <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 card-hover shadow-sm hover:shadow-md transition-all">
                                <div className="h-48 overflow-hidden">
                                    <img className="w-full h-full object-cover" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/fc6207cbc0-64789b144a16ff4f1f8d.png" alt="Permis Moto A2" />
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="inline-block px-3 py-1 bg-gold-500/20 text-gold-600 rounded-full text-sm font-semibold">Permis A</div>
                                        <div className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">Débutant</div>
                                    </div>
                                    <h3 className="text-xl font-bold mb-2 text-slate-900">Permis Moto A2</h3>
                                    <p className="text-slate-500 text-sm mb-4 line-clamp-2">Formation complète pour obtenir votre permis moto A2. Théorie et pratique avec moniteurs certifiés.</p>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center space-x-2 text-slate-400 text-sm">
                                            <Clock className="w-4 h-4" />
                                            <span>20h</span>
                                        </div>
                                        <div className="text-slate-900 font-bold text-lg">890€</div>
                                    </div>
                                    <div className="flex items-center justify-between mb-4 pt-4 border-t border-slate-100">
                                        <div className="flex items-center space-x-1">
                                            <span className="text-gold-500 flex items-center"><Star className="w-3 h-3 fill-current" /> 4.8</span>
                                            <span className="text-slate-400 text-xs">(156 avis)</span>
                                        </div>
                                        <span className="text-green-600 text-sm font-medium">📅 Prochaine session: 15 Jan</span>
                                    </div>
                                    <button className="w-full py-3 bg-slate-900 hover:bg-gold-500 hover:text-white text-white rounded-lg font-semibold transition">S'inscrire</button>
                                </div>
                            </div>

                             <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 card-hover shadow-sm hover:shadow-md transition-all">
                                <div className="h-48 overflow-hidden">
                                    <img className="w-full h-full object-cover" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/2c2b07b86f-caef7f9e7b84aa8117b4.png" alt="Permis B" />
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="inline-block px-3 py-1 bg-gold-500/20 text-gold-600 rounded-full text-sm font-semibold">Permis B</div>
                                        <div className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">Débutant</div>
                                    </div>
                                    <h3 className="text-xl font-bold mb-2 text-slate-900">Permis Voiture B</h3>
                                    <p className="text-slate-500 text-sm mb-4 line-clamp-2">Formation permis B avec code et conduite. Véhicules récents et pédagogie moderne.</p>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center space-x-2 text-slate-400 text-sm">
                                            <Clock className="w-4 h-4" />
                                            <span>35h</span>
                                        </div>
                                        <div className="text-slate-900 font-bold text-lg">1200€</div>
                                    </div>
                                    <div className="flex items-center justify-between mb-4 pt-4 border-t border-slate-100">
                                        <div className="flex items-center space-x-1">
                                            <span className="text-gold-500 flex items-center"><Star className="w-3 h-3 fill-current" /> 4.9</span>
                                            <span className="text-slate-400 text-xs">(324 avis)</span>
                                        </div>
                                        <span className="text-green-600 text-sm font-medium">📅 Sessions continues</span>
                                    </div>
                                    <button className="w-full py-3 bg-slate-900 hover:bg-gold-500 hover:text-white text-white rounded-lg font-semibold transition">S'inscrire</button>
                                </div>
                            </div>
                        </div>
                        
                        <div id="pagination" className="flex items-center justify-center mt-12 space-x-2">
                            <button className="px-3 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition">
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button className="px-4 py-2 bg-gold-500 text-white rounded-lg font-semibold">1</button>
                            <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition">2</button>
                            <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition">3</button>
                            <span className="px-4 py-2 text-slate-400">...</span>
                            <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition">8</button>
                            <button className="px-3 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition">
                                <ChevronRight className="w-4 h-4" />
                            </button>
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
