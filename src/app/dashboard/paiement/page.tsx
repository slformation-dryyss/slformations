import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import {
  CalendarDays,
  ChartLine,
  CreditCard,
  Euro,
  GraduationCap,
  MessageSquare,
  Download,
  Bell,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import Image from "next/image";

export const metadata = {
  title: "Mes paiements | SL Formations",
};

import { useUser } from "@auth0/nextjs-auth0/client";

export default function DashboardPaiementPage() {
  const { user } = useUser();
  return (
    <>
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex">
          {/* Sidebar */}
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
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition text-left"
              >
                <GraduationCap className="w-4 h-4" />
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
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg bg-gold-500 text-navy-900 font-semibold text-left"
              >
                <CreditCard className="w-4 h-4" />
                <span>Mes paiements</span>
              </Link>
              <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition text-left">
                <MessageSquare className="w-4 h-4" />
                <span>Messages</span>
              </button>
            </nav>
          </aside>

          {/* Contenu principal */}
          <section className="flex-1">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-1">
                  Mes paiements
                </h1>
                <p className="text-slate-500 text-sm md:text-base">
                  Gérez vos paiements, téléchargez vos factures et consultez
                  votre historique.
                </p>
              </div>
              <div className="hidden sm:flex items-center space-x-4">
                <button className="relative p-2 text-gray-400 hover:text-white transition">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center">
                    2
                  </span>
                </button>
                <div className="relative w-9 h-9">
                  <Image
                    src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg"
                    alt="Avatar élève"
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Résumé financier + moyens de paiement */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg md:text-xl font-bold">
                    Récapitulatif financier
                  </h2>
                  <div className="flex items-center space-x-2 text-green-400 text-xs md:text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Paiements sécurisés</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 text-sm">
                  <div className="bg-navy-700 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2 text-slate-500">
                      <Euro className="w-4 h-4 text-green-500" />
                      <span>Total payé</span>
                    </div>
                    <div className="text-2xl font-bold text-green-500">
                      0€
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                    <div className="flex items-center space-x-2 mb-2 text-slate-500">
                      <Clock className="w-4 h-4 text-orange-500" />
                      <span>En attente</span>
                    </div>
                    <div className="text-2xl font-bold text-orange-500">
                      0€
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                    <div className="flex items-center space-x-2 mb-2 text-slate-500">
                      <CalendarDays className="w-4 h-4 text-slate-400" />
                      <span>Prochain paiement</span>
                    </div>
                    <div className="text-lg font-bold text-slate-400">
                      Aucun
                    </div>
                    <div className="text-xs text-slate-400">Pas de paiement prévu</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm text-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">Moyens de paiement</h3>
                  <button className="text-gold-500 hover:text-gold-400 transition text-xs">
                    + Ajouter
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="text-center text-slate-400 py-6 italic text-xs">
                    Aucun moyen de paiement enregistré
                  </div>

                  <button className="w-full p-3 border border-dashed border-slate-300 rounded-lg text-slate-400 hover:border-gold-500 hover:text-gold-500 transition text-xs">
                    Ajouter une carte
                  </button>
                </div>
              </div>
            </div>

            {/* Historique de paiements (table statique) */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-4 md:p-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <h2 className="text-lg md:text-xl font-bold">
                  Historique des paiements
                </h2>
                <div className="flex items-center space-x-3 text-xs md:text-sm">
                  <select className="bg-navy-700 border border-navy-600 rounded-lg px-3 py-2">
                    <option>Tous les statuts</option>
                    <option>Payé</option>
                    <option>En attente</option>
                    <option>Échoué</option>
                  </select>
                  <button className="inline-flex items-center px-4 py-2 bg-gold-500 text-navy-900 rounded-lg font-semibold hover:bg-gold-600 transition">
                    <Download className="w-4 h-4 mr-2" />
                    Exporter
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="p-4 font-semibold">Date</th>
                      <th className="p-4 font-semibold">Formation</th>
                      <th className="p-4 font-semibold">Montant</th>
                      <th className="p-4 font-semibold">Statut</th>
                      <th className="p-4 font-semibold">Méthode</th>
                      <th className="p-4 text-center font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400 italic">
                        Aucun historique de paiement disponible.
                      </td>
                    </tr>
                    {/* <tr className="hover:bg-navy-700/40 transition">
                      <td className="p-4">
                        <div className="font-medium">15 déc. 2024</div>
                        <div className="text-xs text-gray-400">14:32</div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium">
                          Formation VTC complète
                        </div>
                        <div className="text-xs text-gray-400">Module 3/5</div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-base">450€</div>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-green-500/15 text-green-400 text-xs font-semibold space-x-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Payé</span>
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">Carte Visa</div>
                        <div className="text-xs text-gray-400">•••• 4532</div>
                      </td>
                      <td className="p-4 text-center">
                        <button className="px-3 py-1.5 text-xs rounded-lg border border-navy-600 hover:border-gold-500 hover:text-gold-500 transition">
                          Télécharger la facture
                        </button>
                      </td>
                    </tr> */}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}








