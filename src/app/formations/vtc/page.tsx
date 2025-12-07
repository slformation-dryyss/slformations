import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  ArrowRight,
  Clock,
  Users,
  BadgeCheck,
  Shield,
  CheckCircle2,
  FileText,
  CalendarDays,
} from "lucide-react";

export const metadata = {
  title: "Formation VTC Professionnel | SL Formations",
};

export default function FormationVTCPage() {
  return (
    <div className="min-h-screen bg-navy-900 text-white font-sans">
      <Header />

      <main>
        {/* Hero Formation VTC */}
        <section
          id="course-hero"
          className="relative h-[520px] flex items-center justify-center overflow-hidden mt-20"
        >
          <div className="absolute inset-0 z-0">
            <img
              className="w-full h-full object-cover"
              src="https://ls-formation.fr/wp-content/uploads/2025/03/taxis-2304w.webp"
              alt="Chauffeur VTC professionnel"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-navy-900/90 via-navy-900/80 to-navy-900/50" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6">
            <div className="flex items-center space-x-3 mb-4 text-sm text-gray-300">
              <span className="text-gray-400">Formations</span>
              <span className="text-gray-500">/</span>
              <span>Formation VTC Professionnel</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-6 text-xs md:text-sm">
              <span className="px-4 py-2 bg-gold-500/20 text-gold-500 rounded-full font-semibold">
                VTC / Taxi
              </span>
              <span className="px-4 py-2 bg-green-500/20 text-green-400 rounded-full font-semibold">
                Certifiante
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              Formation VTC{" "}
              <span className="text-gold-500">Professionnel</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-3xl">
              Devenez chauffeur VTC certifié avec notre formation complète.
              Obtenez votre carte professionnelle et lancez votre activité de
              transport de personnes dans les meilleures conditions.
            </p>

            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-gold-500" />
                <span className="font-medium">50 heures de formation</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-gold-500" />
                <span className="font-medium">Groupe de 12 élèves max</span>
              </div>
              <div className="flex items-center space-x-2">
                <BadgeCheck className="w-5 h-5 text-gold-500" />
                <span className="font-medium">Certification officielle</span>
              </div>
            </div>
          </div>
        </section>

        {/* Contenu de la formation */}
        <section id="course-content" className="py-16 bg-navy-900">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Colonne contenu */}
            <div className="lg:col-span-2 space-y-8">
              {/* Programme */}
              <div className="bg-navy-800 rounded-2xl p-8 border border-navy-700">
                <h2 className="text-2xl font-bold mb-6">
                  Programme de la formation VTC
                </h2>

                <div className="space-y-6">
                  <div className="border-l-4 border-gold-500 pl-5">
                    <h3 className="text-xl font-semibold mb-3 text-gold-500">
                      Module 1 : Réglementation (14h)
                    </h3>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li className="flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-gold-500 mt-1" />
                        <span>Code des transports et réglementation VTC</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-gold-500 mt-1" />
                        <span>Conditions d&apos;exercice et obligations</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-gold-500 mt-1" />
                        <span>Sanctions, contrôles et déontologie</span>
                      </li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-blue-500 pl-5">
                    <h3 className="text-xl font-semibold mb-3 text-blue-400">
                      Module 2 : Sécurité routière (10h)
                    </h3>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li className="flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-400 mt-1" />
                        <span>Conduite défensive et éco-conduite</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-400 mt-1" />
                        <span>Gestion des risques routiers</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-400 mt-1" />
                        <span>Premiers secours et situations d&apos;urgence</span>
                      </li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-green-500 pl-5">
                    <h3 className="text-xl font-semibold mb-3 text-green-400">
                      Module 3 : Service client (14h)
                    </h3>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li className="flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-green-400 mt-1" />
                        <span>Accueil, posture professionnelle et relation client</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-green-400 mt-1" />
                        <span>Gestion des conflits et des situations difficiles</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-green-400 mt-1" />
                        <span>Communication en français et en anglais</span>
                      </li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-purple-500 pl-5">
                    <h3 className="text-xl font-semibold mb-3 text-purple-400">
                      Module 4 : Gestion d&apos;entreprise (12h)
                    </h3>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li className="flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-purple-400 mt-1" />
                        <span>Création et gestion d&apos;entreprise VTC</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-purple-400 mt-1" />
                        <span>Comptabilité, facturation et fiscalité</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-purple-400 mt-1" />
                        <span>Marketing digital et plateformes VTC</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Prérequis */}
              <div className="bg-navy-800 rounded-2xl p-8 border border-navy-700">
                <h2 className="text-2xl font-bold mb-6">
                  Prérequis pour la formation VTC
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gold-500 flex items-center space-x-2">
                      <FileText className="w-5 h-5" />
                      <span>Documents requis</span>
                    </h3>
                    <ul className="space-y-2 text-gray-300">
                      <li>Permis B depuis 3 ans minimum</li>
                      <li>Casier judiciaire vierge</li>
                      <li>Aptitude médicale</li>
                      <li>Niveau 3ème minimum</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-blue-400 flex items-center space-x-2">
                      <Shield className="w-5 h-5" />
                      <span>Compétences recommandées</span>
                    </h3>
                    <ul className="space-y-2 text-gray-300">
                      <li>Bon relationnel client</li>
                      <li>Bonne connaissance géographique</li>
                      <li>Maîtrise des outils numériques</li>
                      <li>Disponibilité et ponctualité</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Planning & FAQ simplifiés */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-navy-800 rounded-2xl p-6 border border-navy-700">
                  <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
                    <CalendarDays className="w-5 h-5 text-gold-500" />
                    <span>Planning type</span>
                  </h2>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li>• Durée totale : 50 heures</li>
                    <li>• Sessions en semaine ou week-end</li>
                    <li>• Alternance théorie / pratique</li>
                    <li>• Préparation à l&apos;examen théorique et pratique</li>
                  </ul>
                </div>

                <div className="bg-navy-800 rounded-2xl p-6 border border-navy-700">
                  <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
                    <ArrowRight className="w-5 h-5 text-gold-500" />
                    <span>FAQ rapide</span>
                  </h2>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li>
                      • Finançable via CPF / France Travail (sous réserve
                      d&apos;éligibilité)
                    </li>
                    <li>• Possibilité de formation accélérée</li>
                    <li>• Accompagnement pour les démarches administratives</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Colonne latérale : infos rapides */}
            <aside className="space-y-6">
              <div className="glass-effect rounded-2xl p-6 border border-navy-700">
                <h2 className="text-xl font-bold mb-4">
                  Informations principales
                </h2>
                <ul className="space-y-3 text-sm text-gray-200">
                  <li className="flex items-center justify-between">
                    <span>Durée</span>
                    <span className="font-semibold text-gold-500">
                      50 heures
                    </span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Prix</span>
                    <span className="font-semibold text-gold-500">
                      1 800 € TTC
                    </span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Lieu</span>
                    <span className="font-semibold">Pontault-Combault</span>
                  </li>
                </ul>
                <button className="mt-6 w-full py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-navy-900 rounded-lg font-bold hover:shadow-lg hover:shadow-gold-500/50 transition flex items-center justify-center space-x-2 text-sm">
                  <span>Demander un devis</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="glass-effect rounded-2xl p-6 border border-navy-700">
                <h2 className="text-lg font-bold mb-3">
                  Pourquoi choisir SL Formations ?
                </h2>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• Formateurs expérimentés et en activité</li>
                  <li>• Véhicules récents et adaptés au VTC</li>
                  <li>• Accompagnement jusqu&apos;à l&apos;installation</li>
                  <li>• Taux de satisfaction très élevé</li>
                </ul>
              </div>
            </aside>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}


