import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
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

export default function PaiementPage() {
  return (
    <div className="min-h-screen bg-navy-900 text-white font-sans">
      <Header />

      <main className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex">
          {/* Sidebar */}
          <aside className="hidden lg:block w-64 mr-6 bg-navy-800 rounded-2xl border border-navy-700 h-[calc(100vh-7rem)] sticky top-24">
            <nav className="p-6 space-y-2 text-sm">
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
              <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg bg-gold-500 text-navy-900 font-semibold text-left">
                <CreditCard className="w-4 h-4" />
                <span>Mes paiements</span>
              </button>
              <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-navy-700 hover:text-white transition text-left">
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
                <p className="text-gray-400 text-sm md:text-base">
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
              <div className="lg:col-span-2 bg-navy-800 rounded-2xl p-6 border border-navy-700">
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
                    <div className="flex items-center space-x-2 mb-2 text-gray-300">
                      <Euro className="w-4 h-4 text-green-400" />
                      <span>Total payé</span>
                    </div>
                    <div className="text-2xl font-bold text-green-400">
                      2 450€
                    </div>
                  </div>

                  <div className="bg-navy-700 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2 text-gray-300">
                      <Clock className="w-4 h-4 text-orange-400" />
                      <span>En attente</span>
                    </div>
                    <div className="text-2xl font-bold text-orange-400">
                      350€
                    </div>
                  </div>

                  <div className="bg-navy-700 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2 text-gray-300">
                      <CalendarDays className="w-4 h-4 text-blue-400" />
                      <span>Prochain paiement</span>
                    </div>
                    <div className="text-lg font-bold text-blue-400">
                      15 jan.
                    </div>
                    <div className="text-xs text-gray-400">200€</div>
                  </div>
                </div>
              </div>

              <div className="bg-navy-800 rounded-2xl p-6 border border-navy-700 text-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">Moyens de paiement</h3>
                  <button className="text-gold-500 hover:text-gold-400 transition text-xs">
                    + Ajouter
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-navy-700 rounded-lg">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <span className="text-blue-400 text-sm font-semibold">
                        VISA
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">•••• 4532</div>
                      <div className="text-xs text-gray-400">Exp : 12/26</div>
                    </div>
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-[11px]">
                      Principal
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-navy-700 rounded-lg">
                    <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                      <span className="text-red-400 text-sm font-semibold">
                        MC
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">•••• 8901</div>
                      <div className="text-xs text-gray-400">Exp : 08/27</div>
                    </div>
                  </div>

                  <button className="w-full p-3 border border-dashed border-navy-600 rounded-lg text-gray-400 hover:border-gold-500 hover:text-gold-500 transition text-xs">
                    Ajouter une carte
                  </button>
                </div>
              </div>
            </div>

            {/* Historique de paiements (table statique) */}
            <div className="bg-navy-800 rounded-2xl border border-navy-700 overflow-hidden">
              <div className="p-4 md:p-6 border-b border-navy-700 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
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
                  <thead className="bg-navy-700 text-left text-xs uppercase tracking-wide">
                    <tr>
                      <th className="p-4 font-semibold">Date</th>
                      <th className="p-4 font-semibold">Formation</th>
                      <th className="p-4 font-semibold">Montant</th>
                      <th className="p-4 font-semibold">Statut</th>
                      <th className="p-4 font-semibold">Méthode</th>
                      <th className="p-4 text-center font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy-700">
                    <tr className="hover:bg-navy-700/40 transition">
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
                    </tr>

                    <tr className="hover:bg-navy-700/40 transition">
                      <td className="p-4">
                        <div className="font-medium">02 déc. 2024</div>
                        <div className="text-xs text-gray-400">09:18</div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium">
                          Permis B – forfait initial
                        </div>
                        <div className="text-xs text-gray-400">
                          Règlement échelonné
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-base">200€</div>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-orange-500/15 text-orange-400 text-xs font-semibold space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>En attente</span>
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">Prélèvement SEPA</div>
                      </td>
                      <td className="p-4 text-center">
                        <button className="px-3 py-1.5 text-xs rounded-lg border border-navy-600 hover:border-gold-500 hover:text-gold-500 transition">
                          Voir le détail
                        </button>
                      </td>
                    </tr>

                    <tr className="hover:bg-navy-700/40 transition">
                      <td className="p-4">
                        <div className="font-medium">18 nov. 2024</div>
                        <div className="text-xs text-gray-400">11:05</div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium">
                          Acompte – Formation CACES
                        </div>
                        <div className="text-xs text-gray-400">Session mars</div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-base">150€</div>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-red-500/15 text-red-400 text-xs font-semibold space-x-1">
                          <XCircle className="w-3 h-3" />
                          <span>Échoué</span>
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">Carte Mastercard</div>
                      </td>
                      <td className="p-4 text-center">
                        <button className="px-3 py-1.5 text-xs rounded-lg border border-red-500/40 text-red-400 hover:bg-red-500/10 transition">
                          Régler à nouveau
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}


