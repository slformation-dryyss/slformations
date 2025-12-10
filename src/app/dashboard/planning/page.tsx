"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Filter,
  GraduationCap,
  LogOut,
  CreditCard,
  BookOpen,
  MessageSquare,
  User,
  Bell,
  MapPin,
  Clock,
  X,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

type EventId = "event1" | "event2" | "event3" | "event4" | "event5" | null;

export default function DashboardPlanningPage() {
  const [activeEvent, setActiveEvent] = useState<EventId>(null);

  const openModal = (event: EventId) => setActiveEvent(event);
  const closeModal = () => setActiveEvent(null);

  const isModalOpen = activeEvent !== null;

  return (
    <div className="min-h-screen bg-navy-900 text-white font-sans">
      <Header />

      <main className="pt-24 pb-12 px-0 md:px-0">
        <div className="flex h-[calc(100vh-6rem)] overflow-hidden">
          {/* Sidebar élève */}
          <aside className="hidden md:flex w-64 bg-navy-800 border-r border-navy-700 flex-col">
            <div className="p-6 border-b border-navy-700 flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-gold-500 to-gold-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="text-navy-900 w-5 h-5" />
              </div>
              <span className="text-lg font-bold leading-tight">
                SL Formations
                <span className="block text-xs font-normal text-gold-500">
                  Espace élève
                </span>
              </span>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2 text-sm">
              <Link
                href="/dashboard"
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-navy-700 hover:text-white transition text-left"
              >
                <CalendarDays className="w-4 h-4" />
                <span>Tableau de bord</span>
              </Link>
              <Link
                href="/dashboard/mes-formations"
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-navy-700 hover:text-white transition text-left"
              >
                <BookOpen className="w-4 h-4" />
                <span>Mes formations</span>
              </Link>
              <Link
                href="/dashboard/planning"
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg bg-navy-700 text-white text-left"
              >
                <CalendarDays className="w-4 h-4" />
                <span>Mon planning</span>
              </Link>
              <Link
                href="/dashboard/paiement"
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-navy-700 hover:text-white transition text-left"
              >
                <CreditCard className="w-4 h-4" />
                <span>Mes paiements</span>
              </Link>
              <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-navy-700 hover:text-white transition text-left">
                <MessageSquare className="w-4 h-4" />
                <span>Messages</span>
              </button>
              <Link
                href="/dashboard/profile"
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-navy-700 hover:text-white transition text-left"
              >
                <User className="w-4 h-4" />
                <span>Profil</span>
              </Link>
            </nav>

            <div className="p-4 border-t border-navy-700">
              <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-navy-700 hover:text-red-400 transition text-left text-sm">
                <LogOut className="w-4 h-4" />
                <span>Déconnexion</span>
              </button>
            </div>
          </aside>

          {/* Contenu principal : planning */}
          <section className="flex-1 flex flex-col overflow-hidden">
            {/* En-tête planning */}
            <header className="bg-navy-800 border-b border-navy-700 px-4 md:px-8 py-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl md:text-2xl font-bold">
                    Mon planning
                  </h1>
                  <p className="text-gray-400 text-xs md:text-sm">
                    Visualisez et gérez vos sessions de formation
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  <button className="relative p-2 text-gray-400 hover:text-white transition">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                  </button>
                  <div className="hidden sm:flex items-center space-x-3 pl-4 border-l border-navy-700">
                    <div className="relative w-10 h-10">
                      <Image
                        src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg"
                        alt="Avatar élève"
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">Pierre Durand</div>
                      <div className="text-xs text-gray-400">Élève</div>
                    </div>
                  </div>
                </div>
              </div>
            </header>

            {/* Contrôles calendrier */}
            <div className="bg-navy-800 border-b border-navy-700 px-4 md:px-8 py-4">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <button className="px-4 py-2 bg-gradient-to-r from-gold-500 to-gold-600 text-navy-900 rounded-lg font-semibold hover:shadow-lg transition text-sm">
                    + Réserver un créneau
                  </button>

                  <div className="flex items-center space-x-2 bg-navy-700 rounded-lg p-1 text-xs md:text-sm">
                    <button className="px-3 md:px-4 py-1.5 bg-navy-900 text-white rounded-md font-medium">
                      Semaine
                    </button>
                    <button className="px-3 md:px-4 py-1.5 text-gray-400 hover:text-white transition">
                      Mois
                    </button>
                    <button className="px-3 md:px-4 py-1.5 text-gray-400 hover:text-white transition">
                      Jour
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-3">
                    <button className="w-8 h-8 glass-effect rounded-lg flex items-center justify-center hover:bg-navy-700 transition">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <div className="text-sm md:text-lg font-bold">
                      Décembre 2025
                    </div>
                    <button className="w-8 h-8 glass-effect rounded-lg flex items-center justify-center hover:bg-navy-700 transition">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <button className="px-3 md:px-4 py-2 glass-effect rounded-lg hover:bg-navy-700 transition text-xs md:text-sm">
                    Aujourd&apos;hui
                  </button>
                </div>
              </div>
            </div>

            {/* Barre de filtres */}
            <div className="bg-navy-800/50 px-4 md:px-8 py-3 flex flex-wrap items-center gap-3 border-b border-navy-800">
              <div className="flex items-center space-x-2 text-xs md:text-sm text-gray-400">
                <Filter className="w-3 h-3" />
                <span>Filtrer par :</span>
              </div>

              <select className="px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-xs md:text-sm focus:outline-none focus:border-gold-500">
                <option>Toutes les formations</option>
                <option>Permis B</option>
                <option>Formation VTC</option>
                <option>SSIAP</option>
              </select>

              <select className="px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-xs md:text-sm focus:outline-none focus:border-gold-500">
                <option>Tous les professeurs</option>
                <option>Marc Lefebvre</option>
                <option>Sophie Martin</option>
                <option>Thomas Bernard</option>
              </select>

              <select className="px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-xs md:text-sm focus:outline-none focus:border-gold-500">
                <option>Tous les lieux</option>
                <option>Centre Paris 15e</option>
                <option>Centre Neuilly</option>
                <option>Piste moto Rungis</option>
              </select>

              <div className="flex-1" />

              <div className="flex items-center gap-3 text-[11px] md:text-xs">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 bg-blue-500 rounded" />
                  <span className="text-gray-400">Théorique</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 bg-green-500 rounded" />
                  <span className="text-gray-400">Pratique</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 bg-gold-500 rounded" />
                  <span className="text-gray-400">Examen</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 bg-orange-500 rounded" />
                  <span className="text-gray-400">Coaching</span>
                </div>
              </div>
            </div>

            {/* Vue calendrier (statique pour l’instant) */}
            <div className="flex-1 overflow-auto p-4 md:p-8">
              <div className="bg-navy-800 rounded-xl border border-navy-700 overflow-hidden min-w-full md:min-w-[900px]">
                {/* En-têtes jours */}
                <div className="grid grid-cols-8 border-b border-navy-700 text-xs md:text-sm">
                  <div className="p-3 md:p-4 bg-navy-800/50" />
                  {["LUN 15", "MAR 16", "MER 17", "JEU 18", "VEN 19", "SAM 20", "DIM 21"].map(
                    (label, index) => {
                      const [day, date] = label.split(" ");
                      const isToday = index === 2;
                      return (
                        <div
                          key={label}
                          className={`p-3 md:p-4 text-center border-l border-navy-700 ${
                            isToday ? "bg-navy-700/50" : ""
                          }`}
                        >
                          <div
                            className={`text-[10px] mb-1 ${
                              isToday ? "text-gold-500" : "text-gray-400"
                            }`}
                          >
                            {day}
                          </div>
                          <div
                            className={`text-xl md:text-2xl font-bold ${
                              isToday ? "text-gold-500" : ""
                            }`}
                          >
                            {date}
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>

                {/* Heures + colonnes */}
                <div className="grid grid-cols-8 text-xs md:text-sm">
                  {/* Colonne heures */}
                  <div className="bg-navy-800/50">
                    {[
                      "08:00",
                      "09:00",
                      "10:00",
                      "11:00",
                      "12:00",
                      "13:00",
                      "14:00",
                      "15:00",
                      "16:00",
                      "17:00",
                      "18:00",
                      "19:00",
                    ].map((time) => (
                      <div
                        key={time}
                        className="time-slot p-3 text-right text-[10px] md:text-xs text-gray-500 border-t border-navy-700/60"
                      >
                        {time}
                      </div>
                    ))}
                  </div>

                  {/* Colonnes jours avec événements statiques */}
                  <div className="border-l border-navy-700 relative">
                    <div className="time-slot h-8 md:h-16" />
                    <div className="time-slot h-8 md:h-16" />
                    <button
                      onClick={() => openModal("event1")}
                      className="absolute top-16 md:top-32 left-2 right-2 event-slot bg-green-500/20 border-l-4 border-green-500 rounded p-2 text-left"
                    >
                      <div className="text-[11px] font-bold text-green-400">
                        Pratique conduite
                      </div>
                      <div className="text-[11px] text-gray-300">
                        10:00 - 12:00
                      </div>
                    </button>
                  </div>

                  <div className="border-l border-navy-700 relative">
                    <div className="time-slot h-8 md:h-16" />
                    <div className="time-slot h-8 md:h-16" />
                    <div className="time-slot h-8 md:h-16" />
                    <div className="time-slot h-8 md:h-16" />
                    <button
                      onClick={() => openModal("event2")}
                      className="absolute top-24 md:top-96 left-2 right-2 event-slot bg-blue-500/20 border-l-4 border-blue-500 rounded p-2 text-left"
                    >
                      <div className="text-[11px] font-bold text-blue-400">
                        Code de la route
                      </div>
                      <div className="text-[11px] text-gray-300">
                        14:00 - 16:00
                      </div>
                    </button>
                  </div>

                  <div className="border-l border-navy-700 bg-navy-700/20 relative">
                    <div className="time-slot h-8 md:h-16" />
                    <button
                      onClick={() => openModal("event3")}
                      className="absolute top-4 md:top-16 left-2 right-2 event-slot bg-gold-500/20 border-l-4 border-gold-500 rounded p-2 text-left"
                    >
                      <div className="text-[11px] font-bold text-gold-400">
                        Examen pratique
                      </div>
                      <div className="text-[11px] text-gray-300">
                        09:00 - 10:30
                      </div>
                    </button>
                  </div>

                  <div className="border-l border-navy-700 relative">
                    <div className="time-slot h-8 md:h-16" />
                    <div className="time-slot h-8 md:h-16" />
                    <button
                      onClick={() => openModal("event4")}
                      className="absolute top-12 md:top-48 left-2 right-2 event-slot bg-green-500/20 border-l-4 border-green-500 rounded p-2 text-left"
                    >
                      <div className="text-[11px] font-bold text-green-400">
                        Pratique moto
                      </div>
                      <div className="text-[11px] text-gray-300">
                        11:00 - 13:00
                      </div>
                    </button>
                  </div>

                  <div className="border-l border-navy-700 relative">
                    <div className="time-slot h-8 md:h-16" />
                    <div className="time-slot h-8 md:h-16" />
                    <div className="time-slot h-8 md:h-16" />
                    <button
                      onClick={() => openModal("event5")}
                      className="absolute top-20 md:top-80 left-2 right-2 event-slot bg-orange-500/20 border-l-4 border-orange-500 rounded p-2 text-left"
                    >
                      <div className="text-[11px] font-bold text-orange-400">
                        Coaching VTC
                      </div>
                      <div className="text-[11px] text-gray-300">
                        13:00 - 14:00
                      </div>
                    </button>
                  </div>

                  <div className="border-l border-navy-700" />
                  <div className="border-l border-navy-700" />
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Modal de détails de session (statique, contenu d’exemple) */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="bg-navy-800 rounded-2xl border border-navy-700 w-full max-w-lg mx-4 overflow-hidden">
            <div className="bg-gradient-to-r from-gold-500 to-gold-600 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-navy-900">
                Détails de la session
              </h3>
              <button
                onClick={closeModal}
                className="text-navy-900 hover:text-navy-800 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6 text-sm">
              <div>
                <div className="text-xs text-gray-400 mb-1">
                  Type de session
                </div>
                <div className="text-lg font-bold">
                  {activeEvent === "event3"
                    ? "Examen pratique"
                    : activeEvent === "event2"
                    ? "Code de la route"
                    : activeEvent === "event4"
                    ? "Pratique moto"
                    : activeEvent === "event5"
                    ? "Coaching VTC"
                    : "Pratique conduite"}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-400 mb-1">Date</div>
                  <div className="font-semibold">Lundi 15 Décembre</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">Horaire</div>
                  <div className="font-semibold flex items-center space-x-1">
                    <Clock className="w-4 h-4 text-gold-500" />
                    <span>10:00 - 12:00</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-400 mb-2">Professeur</div>
                <div className="flex items-center space-x-3">
                  <div className="relative w-12 h-12">
                    <Image
                      src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg"
                      alt="Formateur"
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-semibold">Marc Lefebvre</div>
                    <div className="text-xs text-gray-400">
                      Moniteur auto-école
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-400 mb-1">Lieu</div>
                <div className="font-semibold flex items-center space-x-1">
                  <MapPin className="w-4 h-4 text-gold-500" />
                  <span>Centre Paris 15e</span>
                </div>
                <div className="text-xs text-gray-400">
                  123 Avenue de Paris, 75015
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-400 mb-1">Formation</div>
                <span className="inline-block px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold">
                  Permis B
                </span>
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  onClick={closeModal}
                  className="flex-1 px-4 py-3 bg-navy-700 hover:bg-navy-600 text-white rounded-lg font-semibold transition text-sm"
                >
                  Fermer
                </button>
                <button className="flex-1 px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg font-semibold transition text-sm">
                  Annuler la session
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

