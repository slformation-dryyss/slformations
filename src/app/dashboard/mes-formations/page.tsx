import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
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

export default function DashboardMesFormationsPage() {
  return (
    <>
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex">
          {/* Sidebar type dashboard */}
          <aside className="hidden lg:block w-64 mr-6 bg-navy-800 rounded-2xl border border-navy-700 h-[calc(100vh-7rem)] sticky top-24">
            <nav className="p-6 space-y-2 text-sm">
              <Link
                href="/dashboard"
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition text-left"
              >
                <ChartLine className="w-4 h-4" />
                <span>Tableau de bord</span>
              </Link>
              <Link
                href="/dashboard/mes-formations"
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg bg-gold-500 text-navy-900 font-semibold text-left"
              >
                <BookOpen className="w-4 h-4" />
                <span>Mes formations</span>
              </Link>
              <Link
                href="/dashboard/planning"
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition text-left"
              >
                <CalendarDays className="w-4 h-4" />
                <span>Mon planning</span>
              </Link>
              <Link
                href="/dashboard/paiement"
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition text-left"
              >
                <CreditCard className="w-4 h-4" />
                <span>Mes paiements</span>
              </Link>
              <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition text-left">
                <MessageSquare className="w-4 h-4" />
                <span>Messages</span>
              </button>
              <Link
                href="/dashboard/profile"
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition text-left"
              >
                <User className="w-4 h-4" />
                <span>Profil</span>
              </Link>
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
                <p className="text-slate-500 text-sm md:text-base">
                  Suivez votre progression et accédez à vos cours.
                </p>
              </div>
              <button className="hidden sm:inline-flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-gold-500 to-gold-600 text-navy-900 rounded-lg font-semibold text-sm hover:shadow-lg hover:shadow-gold-500/40 transition">
                <Plus className="w-4 h-4" />
                <span>Nouvelle formation</span>
              </button>
            </div>

            {/* Statistiques rapides (Vides pour l'instant) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 mb-8">
              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-blue-500" />
                  </div>
                  <span className="text-2xl font-bold text-slate-900">0</span>
                </div>
                <h3 className="font-semibold text-sm text-slate-900">Formations actives</h3>
                <p className="text-slate-500 text-xs">En cours</p>
              </div>

              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-green-500" />
                  </div>
                  <span className="text-2xl font-bold text-slate-900">0h</span>
                </div>
                <h3 className="font-semibold text-sm text-slate-900">Heures effectuées</h3>
                <p className="text-slate-500 text-xs">Total</p>
              </div>

              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                    <CalendarDays className="w-5 h-5 text-slate-500" />
                  </div>
                  <span className="text-lg font-bold text-slate-400">Aucun</span>
                </div>
                <h3 className="font-semibold text-sm text-slate-900">Prochain cours</h3>
                <p className="text-slate-500 text-xs italic">Pas encore planifié</p>
              </div>

              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                    <ChartLine className="w-5 h-5 text-slate-500" />
                  </div>
                  <span className="text-2xl font-bold text-slate-400">-</span>
                </div>
                <h3 className="font-semibold text-sm text-slate-900">Progression globale</h3>
                <p className="text-slate-500 text-xs">Pas de données</p>
              </div>
            </div>

            {/* Liste des formations (Vide) */}
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-slate-900">Aucune formation en cours</h3>
              <p className="text-slate-500 max-w-md mx-auto mb-6">
                Vous n'êtes inscrit à aucune formation pour le moment. Découvrez nos programmes et commencez votre apprentissage.
              </p>
              <Link 
                href="/formations" 
                className="inline-flex items-center px-4 py-2 bg-gold-500 text-navy-900 rounded-lg font-semibold hover:bg-gold-600 transition"
              >
                <Plus className="w-4 h-4 mr-2" />
                Découvrir les formations
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}



