import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Search, Filter, Users, Settings, Zap, Star, ChevronLeft, ChevronRight, Phone, Calendar, Fuel, LayoutGrid, List } from "lucide-react";

export default function LocationPage() {
  return (
    <div className="min-h-screen text-slate-900 font-sans">
      <Header />

      <main>
        {/* Hero Section */}
        <section id="page-hero" className="pt-32 pb-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
                        Location <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-500 to-gold-600">Véhicules VTC</span>
                    </h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                        Découvrez notre flotte de véhicules premium pour chauffeurs VTC professionnels diplômés
                    </p>
                </div>
                
                <div id="quick-stats" className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="glass-effect rounded-xl p-6 text-center border border-white/10 bg-white/5 backdrop-blur-sm">
                        <div className="text-3xl font-bold text-gold-500 mb-2">50+</div>
                        <div className="text-slate-300">Véhicules Disponibles</div>
                    </div>
                    <div className="glass-effect rounded-xl p-6 text-center border border-white/10 bg-white/5 backdrop-blur-sm">
                        <div className="text-3xl font-bold text-gold-500 mb-2">24/7</div>
                        <div className="text-slate-300">Service Client</div>
                    </div>
                    <div className="glass-effect rounded-xl p-6 text-center border border-white/10 bg-white/5 backdrop-blur-sm">
                        <div className="text-3xl font-bold text-gold-500 mb-2">98%</div>
                        <div className="text-slate-300">Satisfaction Client</div>
                    </div>
                    <div className="glass-effect rounded-xl p-6 text-center border border-white/10 bg-white/5 backdrop-blur-sm">
                        <div className="text-3xl font-bold text-gold-500 mb-2">5★</div>
                        <div className="text-slate-300">Note Moyenne</div>
                    </div>
                </div>
            </div>
        </section>

        {/* Filters Section */}
        <section id="filters-section" className="py-12 bg-slate-100 border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-6">
                <div id="filters-container" className="glass-effect rounded-2xl p-8 bg-white border border-slate-200 shadow-sm">
                    <div className="flex flex-col lg:flex-row items-center gap-6">
                        <div className="flex-1 w-full">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Rechercher un véhicule</label>
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <input type="text" placeholder="Tesla Model 3, Mercedes, Lexus..." className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:border-gold-500 focus:outline-none" />
                            </div>
                        </div>
                        
                        <div className="flex-1 w-full">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Type de véhicule</label>
                            <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:border-gold-500 focus:outline-none">
                                <option>Tous les types</option>
                                <option>Berline</option>
                                <option>SUV</option>
                                <option>Électrique</option>
                                <option>Hybride</option>
                            </select>
                        </div>
                        
                        <div className="flex-1 w-full">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Prix par jour</label>
                            <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:border-gold-500 focus:outline-none">
                                <option>Tous les prix</option>
                                <option>30€ - 50€</option>
                                <option>50€ - 70€</option>
                                <option>70€ - 100€</option>
                                <option>100€+</option>
                            </select>
                        </div>
                        
                        <div className="flex-1 w-full">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Disponibilité</label>
                            <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:border-gold-500 focus:outline-none">
                                <option>Toutes</option>
                                <option>Disponible maintenant</option>
                                <option>Cette semaine</option>
                                <option>Ce mois</option>
                            </select>
                        </div>
                        
                        <button className="px-8 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-slate-900 rounded-lg font-bold hover:shadow-lg hover:shadow-gold-500/50 transition flex items-center space-x-2">
                            <Filter className="w-4 h-4" />
                            <span>Filtrer</span>
                        </button>
                    </div>
                </div>
            </div>
        </section>

        {/* Vehicles Grid */}
        <section id="vehicles-grid" className="py-16 bg-slate-100">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Véhicules Disponibles</h2>
                        <p className="text-slate-500">42 véhicules correspondent à vos critères</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <select className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:border-gold-500 focus:outline-none">
                            <option>Trier par prix croissant</option>
                            <option>Trier par prix décroissant</option>
                            <option>Trier par note</option>
                            <option>Trier par disponibilité</option>
                        </select>
                        <div className="flex border border-slate-200 rounded-lg overflow-hidden">
                            <button className="px-3 py-2 bg-gold-500 text-slate-900">
                                <LayoutGrid className="w-4 h-4" />
                            </button>
                            <button className="px-3 py-2 bg-white text-slate-400 hover:text-slate-900">
                                <List className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Vehicle 1 */}
                    <div className="glass-effect rounded-2xl overflow-hidden card-hover bg-white border border-slate-200 shadow-sm transition-all duration-300 hover:shadow-md">
                        <div className="relative h-56 overflow-hidden">
                            <img className="w-full h-full object-cover" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/7432e9d0d4-891813ec552ad6192df3.png" alt="Tesla Model 3" />
                            <div className="absolute top-4 right-4 px-3 py-1 bg-green-500 text-white rounded-full text-sm font-semibold">Disponible</div>
                            <div className="absolute top-4 left-4 px-3 py-1 bg-gold-500/90 text-slate-900 rounded-full text-sm font-semibold">Premium</div>
                        </div>
                        <div className="p-6">
                            <h3 className="text-2xl font-bold mb-2 text-slate-900">Tesla Model 3</h3>
                            <div className="flex items-center space-x-4 text-slate-500 text-sm mb-4">
                                <div className="flex items-center space-x-1">
                                    <Users className="w-4 h-4" />
                                    <span>5 places</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <Settings className="w-4 h-4" />
                                    <span>Auto</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <Zap className="w-4 h-4" />
                                    <span>Électrique</span>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 mb-4">
                                <span className="text-gold-500 flex items-center"><Star className="w-4 h-4 fill-current" /> 4.8</span>
                                <span className="text-slate-400 text-sm">(127 avis)</span>
                            </div>
                            <div className="mb-6">
                                <div className="text-3xl font-bold text-gold-500 mb-1">49€<span className="text-lg text-slate-400">/jour</span></div>
                                <div className="text-sm text-slate-400">280€/semaine • 1050€/mois</div>
                            </div>
                            <button className="w-full py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-slate-900 rounded-lg font-bold hover:shadow-lg hover:shadow-gold-500/50 transition">Réserver maintenant</button>
                        </div>
                    </div>

                    {/* Vehicle 2 */}
                    <div className="glass-effect rounded-2xl overflow-hidden card-hover bg-white border border-slate-200 shadow-sm transition-all duration-300 hover:shadow-md">
                        <div className="relative h-56 overflow-hidden">
                            <img className="w-full h-full object-cover" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/21c3465555-390ef9af48a20786749e.png" alt="Lexus UX" />
                            <div className="absolute top-4 right-4 px-3 py-1 bg-green-500 text-white rounded-full text-sm font-semibold">Disponible</div>
                        </div>
                        <div className="p-6">
                            <h3 className="text-2xl font-bold mb-2 text-slate-900">Lexus UX</h3>
                            <div className="flex items-center space-x-4 text-slate-500 text-sm mb-4">
                                <div className="flex items-center space-x-1">
                                    <Users className="w-4 h-4" />
                                    <span>5 places</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <Settings className="w-4 h-4" />
                                    <span>Auto</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <Fuel className="w-4 h-4" />
                                    <span>Hybride</span>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 mb-4">
                                <span className="text-gold-500 flex items-center"><Star className="w-4 h-4 fill-current" /> 4.9</span>
                                <span className="text-slate-400 text-sm">(89 avis)</span>
                            </div>
                            <div className="mb-6">
                                <div className="text-3xl font-bold text-gold-500 mb-1">55€<span className="text-lg text-slate-400">/jour</span></div>
                                <div className="text-sm text-slate-400">320€/semaine • 1200€/mois</div>
                            </div>
                            <button className="w-full py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-slate-900 rounded-lg font-bold hover:shadow-lg hover:shadow-gold-500/50 transition">Réserver maintenant</button>
                        </div>
                    </div>
                </div>
                
                <div id="pagination" className="flex items-center justify-center mt-12 space-x-2">
                    <button className="px-4 py-2 bg-white border border-slate-200 text-slate-400 rounded-lg hover:bg-slate-50 transition">
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button className="px-4 py-2 bg-gold-500 text-white rounded-lg font-semibold">1</button>
                    <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition">2</button>
                    <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition">3</button>
                    <span className="px-4 py-2 text-slate-400">...</span>
                    <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition">12</button>
                    <button className="px-4 py-2 bg-white border border-slate-200 text-slate-400 rounded-lg hover:bg-slate-50 transition">
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </section>

        {/* CTA Section */}
        <section id="cta-rental" className="py-20 bg-gradient-to-r from-gold-500 to-gold-600">
            <div className="max-w-4xl mx-auto px-6 text-center">
                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Besoin d'Aide pour Choisir ?</h2>
                <p className="text-xl text-slate-900 mb-8">Nos conseillers vous accompagnent dans le choix du véhicule parfait pour votre activité VTC</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button className="px-8 py-4 bg-slate-900 text-white rounded-lg font-bold text-lg hover:bg-slate-800 transition flex items-center space-x-2">
                        <Phone className="w-5 h-5" />
                        <span>Appeler un conseiller</span>
                    </button>
                    <button className="px-8 py-4 bg-white text-slate-900 rounded-lg font-bold text-lg hover:bg-gray-100 transition flex items-center space-x-2">
                        <Calendar className="w-5 h-5" />
                        <span>Prendre RDV</span>
                    </button>
                </div>
            </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
