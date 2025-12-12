import { requireAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  Bell,
  CalendarDays,
  Car,
  CreditCard,
  Euro,
  FileText,
  Gauge,
  GraduationCap,
  Settings,
  Users,
} from "lucide-react";
import Image from "next/image";

export const metadata = {
  title: "Tableau de bord administrateur | SL Formations",
};

export default async function AdminDashboardPage() {
  const user = await requireAdmin();
  // requireAdmin redirige déjà si pas autorisé (inclut OWNER)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex overflow-hidden">
      {/* Sidebar admin */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-gold-500 to-gold-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="text-navy-900 w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-slate-900">
              SL Formations
              <span className="block text-xs font-normal text-gold-600">
                Administrateur
              </span>
            </span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 text-sm">
          <div className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-gold-500/10 text-gold-600 font-semibold">
            <Gauge className="w-4 h-4" />
            <span>Vue d&apos;ensemble</span>
          </div>
          <button className="flex w-full items-center space-x-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition text-left">
            <Users className="w-4 h-4" />
            <span>Élèves</span>
          </button>
          <button className="flex w-full items-center space-x-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition text-left">
            <GraduationCap className="w-4 h-4" />
            <span>Formations</span>
          </button>
          <button className="flex w-full items-center space-x-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition text-left">
            <CalendarDays className="w-4 h-4" />
            <span>Planning</span>
          </button>
          <button className="flex w-full items-center space-x-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition text-left">
            <Car className="w-4 h-4" />
            <span>Véhicules</span>
          </button>
          <button className="flex w-full items-center space-x-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition text-left">
            <CreditCard className="w-4 h-4" />
            <span>Paiements</span>
          </button>
          <button className="flex w-full items-center space-x-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition text-left">
            <Settings className="w-4 h-4" />
            <span>Paramètres</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center space-x-3 px-4 py-3 rounded-lg">
            <div className="relative w-9 h-9">
              <Image
                src={"/sl_formations_logo_2.jpg"}
                alt={user.name || "Admin"}
                fill
                className="rounded-full object-cover border border-slate-200"
              />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-sm text-slate-900">
                {user.name || "Admin"}
              </div>
              <div className="text-xs text-slate-500">Administrateur</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Contenu admin */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-slate-200 px-6 md:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Tableau de bord administrateur
              </h1>
              <p className="text-slate-500 text-xs md:text-sm">
                Vue d&apos;ensemble de votre plateforme.
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative hidden sm:block">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="bg-slate-100 text-slate-900 px-4 py-2 rounded-lg pl-9 w-56 text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-gold-500 placeholder:text-slate-400"
                />
                <span className="absolute left-3 top-2.5 text-slate-400 text-xs">
                  🔍
                </span>
              </div>
              <button className="relative p-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition">
                <Bell className="w-4 h-4 text-slate-600" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                  3
                </span>
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
          {/* Statistiques principales */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-500" />
                </div>
                <span className="text-green-500 text-xs font-semibold">
                  +12%
                </span>
              </div>
              <div className="text-2xl md:text-3xl font-bold mb-1 text-slate-900">
                2 547
              </div>
              <p className="text-slate-500 text-xs md:text-sm">Élèves actifs</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 bg-gold-500/10 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-gold-500" />
                </div>
                <span className="text-green-500 text-xs font-semibold">
                  +8%
                </span>
              </div>
              <div className="text-2xl md:text-3xl font-bold mb-1 text-slate-900">24</div>
              <p className="text-slate-500 text-xs md:text-sm">
                Formations actives
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <Euro className="w-5 h-5 text-green-500" />
                </div>
                <span className="text-green-500 text-xs font-semibold">
                  +23%
                </span>
              </div>
              <div className="text-2xl md:text-3xl font-bold mb-1 text-slate-900">
                127 450€
              </div>
              <p className="text-slate-500 text-xs md:text-sm">
                Revenus mensuels
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <Car className="w-5 h-5 text-purple-500" />
                </div>
                <span className="text-green-500 text-xs font-semibold">
                  +5%
                </span>
              </div>
              <div className="text-2xl md:text-3xl font-bold mb-1 text-slate-900">87%</div>
              <p className="text-slate-500 text-xs md:text-sm">
                Taux d&apos;occupation véhicules
              </p>
            </div>
          </section>

          {/* Élèves récents + alertes */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900">Élèves récents</h2>
                <button className="text-gold-600 text-xs font-semibold hover:underline">
                  Voir tout
                </button>
              </div>
              <div className="overflow-x-auto text-sm">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-slate-400 text-xs border-b border-slate-100">
                      <th className="pb-2">Élève</th>
                      <th className="pb-2">Formation</th>
                      <th className="pb-2">Progression</th>
                      <th className="pb-2">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {[
                      {
                        name: "Marc Dubois",
                        email: "marc.dubois@email.com",
                        course: "Formation VTC",
                        progress: 75,
                        status: "Actif",
                      },
                      {
                        name: "Sophie Martin",
                        email: "sophie.m@email.com",
                        course: "Permis B",
                        progress: 45,
                        status: "Actif",
                      },
                      {
                        name: "Thomas Bernard",
                        email: "t.bernard@email.com",
                        course: "SSIAP",
                        progress: 90,
                        status: "Actif",
                      },
                    ].map((student) => (
                      <tr key={student.email} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition">
                        <td className="py-3">
                          <div className="flex items-center space-x-3">
                            <div className="relative w-9 h-9">
                              <Image
                                src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg"
                                alt={student.name}
                                fill
                                className="rounded-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-semibold text-sm text-slate-900">
                                {student.name}
                              </div>
                              <div className="text-xs text-slate-500">
                                {student.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 text-slate-600">{student.course}</td>
                        <td className="py-3">
                          <div className="flex items-center space-x-2">
                            <div className="flex-1 bg-slate-100 rounded-full h-2">
                              <div
                                className="bg-gold-500 h-2 rounded-full"
                                style={{ width: `${student.progress}%` }}
                              />
                            </div>
                            <span className="text-xs text-slate-400">
                              {student.progress}%
                            </span>
                          </div>
                        </td>
                        <td className="py-3">
                          <span className="px-3 py-1 bg-green-500/10 text-green-600 rounded-full text-[11px] font-semibold">
                            {student.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 text-sm">
              <h2 className="text-lg font-bold mb-2 text-slate-900">Alertes & tâches</h2>
              <div className="flex items-start space-x-3 p-3 bg-red-500/10 rounded-lg border border-red-500/10 text-xs">
                <span className="mt-0.5">⚠️</span>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">Paiements en retard</p>
                  <p className="text-slate-500 mt-1">
                    3 élèves ont des paiements en retard ce mois-ci.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-orange-500/10 rounded-lg border border-orange-500/10 text-xs">
                <span className="mt-0.5">🛠️</span>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">Maintenance véhicule</p>
                  <p className="text-slate-500 mt-1">
                    1 véhicule arrive à son contrôle technique.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/10 text-xs">
                <span className="mt-0.5">📄</span>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">Dossiers à valider</p>
                  <p className="text-slate-500 mt-1">
                    5 dossiers d&apos;inscription sont en attente de validation.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Placeholder pour futurs graphiques */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-sm">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between min-h-[220px]">
              <div>
                <h2 className="text-lg font-bold mb-2 text-slate-900">Revenus mensuels</h2>
                <p className="text-slate-500 text-xs mb-4">
                  Zone de graphique (à connecter plus tard à vos données
                  réelles).
                </p>
              </div>
              <div className="flex-1 flex items-center justify-center text-slate-400 text-xs border border-dashed border-slate-300 rounded-xl bg-slate-50">
                <span>Graphique à venir</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between min-h-[220px]">
              <div>
                <h2 className="text-lg font-bold mb-2 text-slate-900">
                  Répartition des formations
                </h2>
                <p className="text-slate-500 text-xs mb-4">
                  Zone de graphique circulaire (permis, VTC, CACES, etc.).
                </p>
              </div>
              <div className="flex-1 flex items-center justify-center text-slate-400 text-xs border border-dashed border-slate-300 rounded-xl bg-slate-50">
                <span>Graphique à venir</span>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}



