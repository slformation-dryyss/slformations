import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  Bell,
  BookOpen,
  CalendarDays,
  ChartLine,
  CreditCard,
  GraduationCap,
  MessageSquare,
  Plus,
  User,
  Clock,
} from "lucide-react";
import Image from "next/image";

export const metadata = {
  title: "Mes formations | SL Formations",
};

export default function MesFormationsPage() {
  return (
    <div className="min-h-screen bg-navy-900 text-white font-sans">
      <Header />

      <main className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex">
          {/* Sidebar type dashboard */}
          <aside className="hidden lg:block w-64 mr-6 bg-navy-800 rounded-2xl border border-navy-700 h-[calc(100vh-7rem)] sticky top-24">
            <nav className="p-6 space-y-2 text-sm">
              <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-navy-700 hover:text-white transition text-left">
                <ChartLine className="w-4 h-4" />
                <span>Tableau de bord</span>
              </button>
              <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg bg-gold-500 text-navy-900 font-semibold text-left">
                <BookOpen className="w-4 h-4" />
                <span>Mes formations</span>
              </button>
              <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-navy-700 hover:text-white transition text-left">
                <CalendarDays className="w-4 h-4" />
                <span>Mon planning</span>
              </button>
              <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-navy-700 hover:text-white transition text-left">
                <CreditCard className="w-4 h-4" />
                <span>Mes paiements</span>
              </button>
              <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-navy-700 hover:text-white transition text-left">
                <MessageSquare className="w-4 h-4" />
                <span>Messages</span>
              </button>
              <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-navy-700 hover:text-white transition text-left">
                <User className="w-4 h-4" />
                <span>Profil</span>
              </button>
            </nav>
          </aside>

          {/* Contenu principal */}
          <section className="flex-1">
            {/* En-tête page */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-1">
                  Mes formations
                </h1>
                <p className="text-gray-400 text-sm md:text-base">
                  Suivez votre progression et accédez à vos cours.
                </p>
              </div>
              <button className="hidden sm:inline-flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-gold-500 to-gold-600 text-navy-900 rounded-lg font-semibold text-sm hover:shadow-lg hover:shadow-gold-500/40 transition">
                <Plus className="w-4 h-4" />
                <span>Nouvelle formation</span>
              </button>
            </div>

            {/* Statistiques rapides */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 mb-8">
              <div className="bg-navy-800 rounded-xl p-5 border border-navy-700">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-blue-400" />
                  </div>
                  <span className="text-2xl font-bold">3</span>
                </div>
                <h3 className="font-semibold text-sm">Formations actives</h3>
                <p className="text-gray-400 text-xs">En cours</p>
              </div>

              <div className="bg-navy-800 rounded-xl p-5 border border-navy-700">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-green-400" />
                  </div>
                  <span className="text-2xl font-bold">127h</span>
                </div>
                <h3 className="font-semibold text-sm">Heures effectuées</h3>
                <p className="text-gray-400 text-xs">Sur 180h au total</p>
              </div>

              <div className="bg-navy-800 rounded-xl p-5 border border-navy-700">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-gold-500/20 rounded-lg flex items-center justify-center">
                    <CalendarDays className="w-5 h-5 text-gold-500" />
                  </div>
                  <span className="text-lg font-bold">Demain</span>
                </div>
                <h3 className="font-semibold text-sm">Prochain cours</h3>
                <p className="text-gray-400 text-xs">Formation VTC – 14h00</p>
              </div>

              <div className="bg-navy-800 rounded-xl p-5 border border-navy-700">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <ChartLine className="w-5 h-5 text-purple-400" />
                  </div>
                  <span className="text-2xl font-bold">87%</span>
                </div>
                <h3 className="font-semibold text-sm">Progression globale</h3>
                <p className="text-gray-400 text-xs">Très bon niveau</p>
              </div>
            </div>

            {/* Liste des formations (exemples statiques) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Formation VTC */}
              <article className="bg-navy-800 rounded-xl border border-navy-700 overflow-hidden card-hover">
                <div className="relative h-44 md:h-52 overflow-hidden">
                  <Image
                    src="https://storage.googleapis.com/uxpilot-auth.appspot.com/7c4c89ea87-d8565a378a6823db4fed.png"
                    alt="Formation VTC professionnelle"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 bg-blue-500 text-white rounded-full text-xs font-semibold">
                    En cours
                  </div>
                  <div className="absolute top-3 right-3 px-3 py-1 glass-effect rounded-full text-xs">
                    <span className="font-semibold">72% terminé</span>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold">
                      Formation VTC professionnelle
                    </h3>
                    <span className="text-blue-400 text-sm font-semibold">
                      50h
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-400">Progression</span>
                      <span className="font-semibold">36h / 50h</span>
                    </div>
                    <div className="w-full bg-navy-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full progress-bar"
                        style={{ width: "72%" }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="relative w-10 h-10">
                      <Image
                        src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg"
                        alt="Formateur VTC"
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Pierre Dubois</p>
                      <p className="text-gray-400 text-xs">
                        Formateur VTC certifié
                      </p>
                    </div>
                  </div>

                  <div className="bg-navy-700/50 rounded-lg p-4 text-xs flex items-center justify-between">
                    <div>
                      <div className="text-gray-400 mb-1">Prochaine session</div>
                      <div className="font-semibold">Demain – 14h00</div>
                    </div>
                    <button className="px-3 py-2 bg-gold-500 text-navy-900 rounded-lg font-semibold text-xs hover:bg-gold-600 transition">
                      Rejoindre la classe
                    </button>
                  </div>
                </div>
              </article>

              {/* Autres formations (permis, SSIAP) – maquette statique */}
              <article className="bg-navy-800 rounded-xl border border-navy-700 overflow-hidden card-hover">
                <div className="relative h-44 md:h-52 overflow-hidden">
                  <Image
                    src="https://ls-formation.fr/wp-content/uploads/2025/03/father-teaching-his-teenage-son-to-drive.jpg"
                    alt="Permis B"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 bg-green-500 text-white rounded-full text-xs font-semibold">
                    Terminé
                  </div>
                  <div className="absolute top-3 right-3 px-3 py-1 glass-effect rounded-full text-xs">
                    <span className="font-semibold">100% terminé</span>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold">
                      Permis B – Boîte manuelle
                    </h3>
                    <span className="text-green-400 text-sm font-semibold">
                      20h
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-400">Progression</span>
                      <span className="font-semibold">20h / 20h</span>
                    </div>
                    <div className="w-full bg-navy-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full progress-bar"
                        style={{ width: "100%" }}
                      />
                    </div>
                  </div>

                  <p className="text-xs text-gray-400">
                    Formation terminée. Votre attestation de réussite est
                    disponible dans vos documents.
                  </p>

                  <div className="flex items-center justify-end space-x-2 text-xs">
                    <button className="px-3 py-2 border border-navy-600 rounded-lg text-gray-200 hover:border-gold-500 hover:text-gold-500 transition">
                      Voir les documents
                    </button>
                  </div>
                </div>
              </article>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}


