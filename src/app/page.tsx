import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { ArrowRight, Car, Clock, Euro, Users, Settings, Zap, Star } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-navy-900 text-white font-sans">
      <Header />

      <main>
        {/* Hero Section */}
        <section id="hero" className="relative h-[700px] flex items-center justify-center overflow-hidden mt-20">
          <div className="absolute inset-0 z-0">
            <img 
              className="w-full h-full object-cover" 
              src="https://storage.googleapis.com/uxpilot-auth.appspot.com/4857025603-2ea2e73559d51288016e.png" 
              alt="luxury black Tesla Model 3 driving on modern city road at sunset" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-navy-900/95 via-navy-900/80 to-navy-900/60"></div>
          </div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
            <div className="inline-block glass-effect px-4 py-2 rounded-full mb-6">
              <span className="text-gold-500 font-semibold">🎓 +2500 élèves formés avec succès</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Votre Avenir Professionnel<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-500 to-gold-600">Commence Ici</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Formations Permis, VTC, Taxi et Location de Véhicules Premium pour votre réussite professionnelle
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/formations" className="px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-navy-900 rounded-lg font-bold text-lg hover:shadow-xl hover:shadow-gold-500/50 transition flex items-center space-x-2">
                <span>Découvrir nos formations</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/location" className="px-8 py-4 glass-effect text-white rounded-lg font-bold text-lg hover:border-gold-500 transition flex items-center space-x-2">
                <span>Louer un véhicule</span>
                <Car className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section id="stats" className="py-20 bg-navy-800/50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-5xl font-bold text-gold-500 mb-2">2500+</div>
                <div className="text-gray-400">Élèves Formés</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-gold-500 mb-2">95%</div>
                <div className="text-gray-400">Taux de Réussite</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-gold-500 mb-2">15</div>
                <div className="text-gray-400">Années d'Expérience</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-gold-500 mb-2">50+</div>
                <div className="text-gray-400">Véhicules Premium</div>
              </div>
            </div>
          </div>
        </section>

        {/* Formations Section */}
        <section id="formations" className="py-24 bg-navy-900">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Nos <span className="text-gold-500">Formations</span></h2>
              <p className="text-xl text-gray-400">Des programmes complets pour votre réussite professionnelle</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1 */}
              <div className="bg-navy-800 rounded-2xl overflow-hidden border border-navy-700 card-hover">
                <div className="h-48 overflow-hidden">
                  <img className="w-full h-full object-cover" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/fc6207cbc0-b20c618d2d44c7cd4904.png" alt="modern motorcycle" />
                </div>
                <div className="p-6">
                  <div className="inline-block px-3 py-1 bg-gold-500/20 text-gold-500 rounded-full text-sm font-semibold mb-4">Permis</div>
                  <h3 className="text-2xl font-bold mb-3">Permis Moto & Auto</h3>
                  <p className="text-gray-400 mb-6">Formations complètes permis A, B, C, EB avec instructeurs certifiés et véhicules modernes</p>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2 text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>35h</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gold-500 font-bold">
                      <Euro className="w-4 h-4" />
                      <span>1200</span>
                    </div>
                  </div>
                  <Link href="/formations/permis" className="block w-full py-3 bg-navy-700 hover:bg-gold-500 hover:text-navy-900 text-white text-center rounded-lg font-semibold transition">En savoir plus</Link>
                </div>
              </div>
              
              {/* Card 2 */}
              <div className="bg-navy-800 rounded-2xl overflow-hidden border border-navy-700 card-hover">
                <div className="h-48 overflow-hidden">
                  <img className="w-full h-full object-cover" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/3eeb01f1b1-caef3ce5998f8d5fb2ea.png" alt="taxi driver" />
                </div>
                <div className="p-6">
                  <div className="inline-block px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-semibold mb-4">VTC/Taxi</div>
                  <h3 className="text-2xl font-bold mb-3">Formation VTC & Taxi</h3>
                  <p className="text-gray-400 mb-6">Devenez chauffeur professionnel VTC ou Taxi avec notre formation complète et certifiante</p>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2 text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>50h</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gold-500 font-bold">
                      <Euro className="w-4 h-4" />
                      <span>1800</span>
                    </div>
                  </div>
                  <Link href="/formations/vtc" className="block w-full py-3 bg-navy-700 hover:bg-gold-500 hover:text-navy-900 text-white text-center rounded-lg font-semibold transition">En savoir plus</Link>
                </div>
              </div>
              
              {/* Card 3 */}
              <div className="bg-navy-800 rounded-2xl overflow-hidden border border-navy-700 card-hover">
                <div className="h-48 overflow-hidden">
                  <img className="w-full h-full object-cover" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/af9a0550ea-0b25228232c72d35e1a1.png" alt="fire safety" />
                </div>
                <div className="p-6">
                  <div className="inline-block px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-semibold mb-4">Sécurité</div>
                  <h3 className="text-2xl font-bold mb-3">SSIAP & Sécurité</h3>
                  <p className="text-gray-400 mb-6">Formations sécurité incendie, prévention et SSIAP pour professionnels exigeants</p>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2 text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>67h</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gold-500 font-bold">
                      <Euro className="w-4 h-4" />
                      <span>950</span>
                    </div>
                  </div>
                  <Link href="/formations/ssiap" className="block w-full py-3 bg-navy-700 hover:bg-gold-500 hover:text-navy-900 text-white text-center rounded-lg font-semibold transition">En savoir plus</Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Location Section */}
        <section id="location" className="py-24 bg-navy-800/50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Location <span className="text-gold-500">Véhicules VTC</span></h2>
              <p className="text-xl text-gray-400">Véhicules premium pour chauffeurs professionnels diplômés</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Vehicle 1 */}
              <div className="glass-effect rounded-2xl overflow-hidden card-hover">
                <div className="relative h-56 overflow-hidden">
                  <img className="w-full h-full object-cover" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/7432e9d0d4-c268d5c530784938a7cc.png" alt="Tesla Model 3" />
                  <div className="absolute top-4 right-4 px-3 py-1 bg-green-500 text-white rounded-full text-sm font-semibold">Disponible</div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2">Tesla Model 3</h3>
                  <div className="flex items-center space-x-4 text-gray-400 text-sm mb-4">
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
                    <span className="text-gray-400 text-sm">(127 avis)</span>
                  </div>
                  <div className="mb-6">
                    <div className="text-3xl font-bold text-gold-500 mb-1">49€<span className="text-lg text-gray-400">/jour</span></div>
                    <div className="text-sm text-gray-400">280€/semaine</div>
                  </div>
                  <button className="w-full py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-navy-900 rounded-lg font-bold hover:shadow-lg hover:shadow-gold-500/50 transition">Réserver maintenant</button>
                </div>
              </div>
              
              {/* Vehicle 2 */}
              <div className="glass-effect rounded-2xl overflow-hidden card-hover">
                <div className="relative h-56 overflow-hidden">
                  <img className="w-full h-full object-cover" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/21c3465555-971897d9b9633071990d.png" alt="Lexus UX" />
                  <div className="absolute top-4 right-4 px-3 py-1 bg-green-500 text-white rounded-full text-sm font-semibold">Disponible</div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2">Lexus UX</h3>
                  <div className="flex items-center space-x-4 text-gray-400 text-sm mb-4">
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
                      <span>Hybride</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-gold-500 flex items-center"><Star className="w-4 h-4 fill-current" /> 4.9</span>
                    <span className="text-gray-400 text-sm">(89 avis)</span>
                  </div>
                  <div className="mb-6">
                    <div className="text-3xl font-bold text-gold-500 mb-1">55€<span className="text-lg text-gray-400">/jour</span></div>
                    <div className="text-sm text-gray-400">320€/semaine</div>
                  </div>
                  <button className="w-full py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-navy-900 rounded-lg font-bold hover:shadow-lg hover:shadow-gold-500/50 transition">Réserver maintenant</button>
                </div>
              </div>
              
              {/* Vehicle 3 */}
              <div className="glass-effect rounded-2xl overflow-hidden card-hover">
                <div className="relative h-56 overflow-hidden">
                  <img className="w-full h-full object-cover" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/bf0a23550a-39f96e5636007eae13b2.png" alt="Mercedes E-Class" />
                  <div className="absolute top-4 right-4 px-3 py-1 bg-orange-500 text-white rounded-full text-sm font-semibold">Bientôt</div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2">Mercedes Classe E</h3>
                  <div className="flex items-center space-x-4 text-gray-400 text-sm mb-4">
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
                      <span>Diesel</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-gold-500 flex items-center"><Star className="w-4 h-4 fill-current" /> 5.0</span>
                    <span className="text-gray-400 text-sm">(156 avis)</span>
                  </div>
                  <div className="mb-6">
                    <div className="text-3xl font-bold text-gold-500 mb-1">65€<span className="text-lg text-gray-400">/jour</span></div>
                    <div className="text-sm text-gray-400">380€/semaine</div>
                  </div>
                  <button className="w-full py-3 bg-navy-700 text-gray-400 rounded-lg font-bold cursor-not-allowed">Bientôt disponible</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-24 bg-navy-900">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Ils Nous Font <span className="text-gold-500">Confiance</span></h2>
              <p className="text-xl text-gray-400">Découvrez les témoignages de nos élèves</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-navy-800 rounded-2xl p-8 border border-navy-700">
                <div className="flex items-center mb-6">
                  <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg" alt="Avatar" className="w-16 h-16 rounded-full mr-4" />
                  <div>
                    <div className="font-bold text-lg">Marc Dubois</div>
                    <div className="text-gray-400 text-sm">Chauffeur VTC</div>
                  </div>
                </div>
                <div className="text-gold-500 mb-4 flex"><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /></div>
                <p className="text-gray-300">"Formation VTC exceptionnelle ! J'ai obtenu ma carte professionnelle en 3 mois et je loue maintenant une Tesla Model 3. Le suivi est parfait."</p>
              </div>
              
              <div className="bg-navy-800 rounded-2xl p-8 border border-navy-700">
                <div className="flex items-center mb-6">
                  <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg" alt="Avatar" className="w-16 h-16 rounded-full mr-4" />
                  <div>
                    <div className="font-bold text-lg">Sophie Martin</div>
                    <div className="text-gray-400 text-sm">Permis B</div>
                  </div>
                </div>
                <div className="text-gold-500 mb-4 flex"><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /></div>
                <p className="text-gray-300">"Moniteurs patients et pédagogues. J'ai eu mon permis du premier coup ! Les véhicules sont récents et l'ambiance est vraiment top."</p>
              </div>
              
              <div className="bg-navy-800 rounded-2xl p-8 border border-navy-700">
                <div className="flex items-center mb-6">
                  <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-8.jpg" alt="Avatar" className="w-16 h-16 rounded-full mr-4" />
                  <div>
                    <div className="font-bold text-lg">Thomas Bernard</div>
                    <div className="text-gray-400 text-sm">SSIAP</div>
                  </div>
                </div>
                <div className="text-gold-500 mb-4 flex"><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /></div>
                <p className="text-gray-300">"Formation SSIAP très professionnelle avec des formateurs expérimentés. Matériel de qualité et mise en situation réaliste. Je recommande !"</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="cta" className="py-24 bg-gradient-to-r from-gold-500 to-gold-600">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-navy-900 mb-6">Prêt à Démarrer Votre Formation ?</h2>
            <p className="text-xl text-navy-800 mb-10">Rejoignez plus de 2500 élèves qui ont réussi avec DriveAcademy Pro</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/formations" className="px-8 py-4 bg-navy-900 text-white rounded-lg font-bold text-lg hover:bg-navy-800 transition">Voir toutes les formations</Link>
              <Link href="/contact" className="px-8 py-4 bg-white text-navy-900 rounded-lg font-bold text-lg hover:bg-gray-100 transition">Contactez-nous</Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
