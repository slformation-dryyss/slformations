import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  CalendarDays,
  ChartLine,
  CreditCard,
  FileText,
  GraduationCap,
  LogOut,
  MessageSquare,
  Settings,
  User,
} from "lucide-react";
import Image from "next/image";

export const metadata = {
  title: "Mon profil | SL Formations",
};

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-navy-900 text-white font-sans">
      <Header />

      <main className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex">
          {/* Sidebar */}
          <aside className="hidden lg:block w-64 mr-6 bg-navy-800 rounded-2xl border border-navy-700 h-[calc(100vh-7rem)] sticky top-24 overflow-y-auto">
            <nav className="p-4 space-y-2 text-sm">
              <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-navy-700 hover:text-white transition text-left">
                <ChartLine className="w-4 h-4" />
                <span>Tableau de bord</span>
              </button>
              <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-navy-700 hover:text-white transition text-left">
                <GraduationCap className="w-4 h-4" />
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
              <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg bg-gold-500/15 border-l-4 border-gold-500 text-gold-400 text-left">
                <User className="w-4 h-4" />
                <span>Mon profil</span>
              </button>

              <div className="border-t border-navy-700 my-4" />

              <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-navy-700 hover:text-white transition text-left">
                <Settings className="w-4 h-4" />
                <span>Paramètres</span>
              </button>
              <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition text-left">
                <LogOut className="w-4 h-4" />
                <span>Déconnexion</span>
              </button>
            </nav>
          </aside>

          {/* Contenu principal */}
          <section className="flex-1">
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold mb-1">
                Mon profil
              </h1>
              <p className="text-gray-400 text-sm md:text-base">
                Gérez vos informations personnelles et vos préférences.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Carte profil */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-navy-800 rounded-2xl p-6 md:p-8 border border-navy-700 text-center">
                  <div className="relative inline-block mb-6">
                    <div className="relative w-28 h-28 md:w-32 md:h-32">
                      <Image
                        src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg"
                        alt="Profil utilisateur"
                        fill
                        className="rounded-full border-4 border-gold-500 object-cover"
                      />
                    </div>
                    <button className="absolute bottom-0 right-0 w-9 h-9 bg-gold-500 rounded-full flex items-center justify-center text-navy-900 hover:bg-gold-600 transition text-sm">
                      ✎
                    </button>
                  </div>

                  <h2 className="text-xl md:text-2xl font-bold mb-1">
                    Marc Dubois
                  </h2>
                  <p className="text-gray-400 text-sm mb-3">
                    marc.dubois@email.com
                  </p>
                  <div className="inline-flex items-center px-4 py-1.5 bg-blue-500/20 text-blue-400 rounded-full text-xs font-semibold mb-6">
                    <span className="mr-2">🚗</span> Élève VTC
                  </div>

                  <div className="space-y-3 text-left text-xs md:text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Membre depuis</span>
                      <span className="font-semibold">Janvier 2024</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Formations suivies</span>
                      <span className="font-semibold">2</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Heures effectuées</span>
                      <span className="font-semibold">24h / 50h</span>
                    </div>
                  </div>
                </div>

                <div className="bg-navy-800 rounded-2xl p-6 border border-navy-700 text-xs md:text-sm">
                  <h3 className="font-bold text-base mb-4">Progression</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-400">Formation VTC</span>
                        <span className="text-gold-500 font-semibold">48%</span>
                      </div>
                      <div className="w-full bg-navy-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-gold-500 to-gold-600 h-2 rounded-full"
                          style={{ width: "48%" }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-400">Permis B</span>
                        <span className="text-green-500 font-semibold">
                          100%
                        </span>
                      </div>
                      <div className="w-full bg-navy-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                          style={{ width: "100%" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Formulaire informations + documents */}
              <div className="lg:col-span-2 space-y-6">
                <section className="bg-navy-800 rounded-2xl p-6 md:p-8 border border-navy-700">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg md:text-2xl font-bold">
                      Informations personnelles
                    </h3>
                    <button className="px-4 py-2 bg-gold-500 text-navy-900 rounded-lg font-semibold text-xs md:text-sm hover:bg-gold-600 transition">
                      Enregistrer
                    </button>
                  </div>

                  <form className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 text-xs md:text-sm">
                    <div>
                      <label className="block text-gray-400 mb-1">
                        Prénom
                      </label>
                      <input
                        type="text"
                        defaultValue="Marc"
                        className="w-full px-4 py-2.5 bg-navy-700 border border-navy-600 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 mb-1">Nom</label>
                      <input
                        type="text"
                        defaultValue="Dubois"
                        className="w-full px-4 py-2.5 bg-navy-700 border border-navy-600 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        defaultValue="marc.dubois@email.com"
                        className="w-full px-4 py-2.5 bg-navy-700 border border-navy-600 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 mb-1">
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        defaultValue="+33 6 12 34 56 78"
                        className="w-full px-4 py-2.5 bg-navy-700 border border-navy-600 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 mb-1">
                        Date de naissance
                      </label>
                      <input
                        type="date"
                        defaultValue="1995-03-15"
                        className="w-full px-4 py-2.5 bg-navy-700 border border-navy-600 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 mb-1">Ville</label>
                      <input
                        type="text"
                        defaultValue="Paris"
                        className="w-full px-4 py-2.5 bg-navy-700 border border-navy-600 rounded-lg"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-gray-400 mb-1">
                        Adresse
                      </label>
                      <input
                        type="text"
                        defaultValue="123 Avenue de Paris, 75001"
                        className="w-full px-4 py-2.5 bg-navy-700 border border-navy-600 rounded-lg"
                      />
                    </div>
                  </form>
                </section>

                <section className="bg-navy-800 rounded-2xl p-6 md:p-8 border border-navy-700 text-xs md:text-sm">
                  <h3 className="text-lg md:text-2xl font-bold mb-4">
                    Mes documents
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-navy-700 rounded-lg border border-navy-600">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                          <div className="font-semibold">
                            Attestation de réussite Permis B
                          </div>
                          <div className="text-[11px] text-gray-400">
                            PDF • Mis à jour le 12/10/2024
                          </div>
                        </div>
                      </div>
                      <button className="px-3 py-2 border border-navy-500 rounded-lg hover:border-gold-500 hover:text-gold-500 transition">
                        Télécharger
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-navy-700 rounded-lg border border-navy-600">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <div className="font-semibold">
                            Convention de formation VTC
                          </div>
                          <div className="text-[11px] text-gray-400">
                            PDF • Mis à jour le 05/09/2024
                          </div>
                        </div>
                      </div>
                      <button className="px-3 py-2 border border-navy-500 rounded-lg hover:border-gold-500 hover:text-gold-500 transition">
                        Télécharger
                      </button>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}


