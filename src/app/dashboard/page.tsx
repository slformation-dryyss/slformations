"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Clock,
  CalendarDays,
  GraduationCap,
  CreditCard,
  MessageSquare,
  Bell,
  Car,
  ChartLine,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import Image from "next/image";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

type ProfileResponse = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  isProfileComplete: boolean;
  createdAt: string;
  firstName: string | null;
  lastName: string | null;
  picture?: string | null;
};

export default function Dashboard() {
  const router = useRouter();
  const { user: auth0User, isLoading } = useUser();
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    if (isLoading) return;

    if (!auth0User) {
      router.replace("/api/auth/login?returnTo=/dashboard");
      return;
    }

    // Email non vérifié → onboarding email
    if (!(auth0User as any).email_verified) {
      router.replace("/dashboard/verify-email");
      return;
    }

    const loadProfile = async () => {
      try {
        const res = await fetch("/api/profile", { cache: "no-store" });
        if (!res.ok) {
          throw new Error("Impossible de charger le profil");
        }
        const data: ProfileResponse = await res.json();

        // Admin → redirection tableau de bord admin
        if (data.role === "ADMIN") {
          router.replace("/admin");
          return;
        }

        // Profil incomplet → onboarding profil (sauf si skippé)
        if (!data.isProfileComplete) {
          // Vérification du cookie "skip"
          const hasSkipped = document.cookie.split("; ").find(row => row.startsWith("sl_onboarding_skipped="));
          
          if (!hasSkipped) {
            router.replace("/dashboard/onboarding");
            return;
          }
        }

        setProfile({
          ...data,
          picture: (auth0User as any).picture ?? null,
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfile();
  }, [auth0User, isLoading, router]);

  if (isLoading || loadingProfile || !auth0User || !profile) {
    return (
      <div className="min-h-screen bg-navy-900 text-white flex items-center justify-center">
        <p className="text-gray-300 text-sm">
          Chargement de votre tableau de bord...
        </p>
      </div>
    );
  }

  const user = profile;
  // Priorité au Prénom, sinon Nom complet, sinon "Élève"
  const displayName = user.firstName 
    ? user.firstName 
    : (user.name || "Élève");

  return (
    <>
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex">
          {/* Sidebar Unifiée (Design Profile) */}
          <aside className="hidden lg:block w-64 mr-6 bg-navy-800 rounded-2xl border border-navy-700 h-[calc(100vh-7rem)] sticky top-24 overflow-y-auto">
            <nav className="p-4 space-y-2 text-sm">
              <Link
                href="/dashboard"
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg bg-gold-500/15 border-l-4 border-gold-500 text-gold-400 text-left"
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
                <span>Mon profil</span>
              </Link>

              <div className="border-t border-slate-200 my-4" />

              <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition text-left">
                <Settings className="w-4 h-4" />
                <span>Paramètres</span>
              </button>
              <Link
                href="/api/auth/logout"
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition text-left"
              >
                <LogOut className="w-4 h-4" />
                <span>Déconnexion</span>
              </Link>
            </nav>
          </aside>

          {/* Contenu Principal */}
          <section className="flex-1">
            {/* En-tête de section */}
            <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-1">
                  Tableau de bord
                </h1>
                <p className="text-slate-500 text-sm">
                  Bonjour <span className="text-gold-600 font-semibold">{displayName}</span>, voici un aperçu de votre progression.
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <button className="relative p-2 bg-white rounded-lg border border-slate-200 text-slate-500 hover:text-slate-900 hover:border-gold-500 transition">
                  <Bell className="w-5 h-5" />
                  {/* <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center">
                    0
                  </span> */}
                </button>
                <Link href="/dashboard/profile" className="flex items-center space-x-3 hover:opacity-80 transition">
                  <div className="relative w-9 h-9">
                    <Image
                      src={user.picture || "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg"}
                      alt={displayName}
                      fill
                      className="rounded-full object-cover border border-gold-500"
                    />
                  </div>
                  <div className="hidden sm:block text-xs text-left">
                    <div className="font-semibold">{displayName}</div>
                    <div className="text-slate-500 truncate max-w-[100px]">
                      {user.role || "Élève"}
                    </div>
                  </div>
                </Link>
              </div>
            </header>

            {/* Statistiques rapides (Vides pour l'instant) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
              <div className="bg-white rounded-xl p-5 border border-slate-200 card-hover shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="text-right text-sm">
                    <div className="text-2xl font-bold text-slate-900">0h</div>
                    <div className="text-slate-400 text-xs">/ 0h</div>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mb-1">Heures effectuées</p>
                <div className="w-full bg-slate-100 rounded-full h-2 mb-1">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: "0%" }}
                  />
                </div>
                <p className="text-xs text-blue-500">0% complété</p>
              </div>

              <div className="bg-white rounded-xl p-5 border border-slate-200 card-hover shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                    <CalendarDays className="w-5 h-5 text-slate-500" />
                  </div>
                  <div className="text-right text-sm">
                    <div className="text-lg font-bold text-slate-400">Aucun</div>
                    {/* <div className="text-gray-400 text-xs">--:--</div> */}
                  </div>
                </div>
                <p className="text-xs text-slate-500 mb-1">Prochain cours</p>
                <p className="text-slate-500 text-sm italic">
                  Pas de session planifiée
                </p>
              </div>

              <div className="bg-white rounded-xl p-5 border border-slate-200 card-hover shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-slate-500" />
                  </div>
                  <div className="text-right text-sm">
                    <div className="text-2xl font-bold text-slate-400">-</div>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mb-2">Taux de réussite</p>
                <p className="text-xs text-slate-500">Pas assez de données</p>
              </div>

              <div className="bg-white rounded-xl p-5 border border-slate-200 card-hover shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                    <Car className="w-5 h-5 text-purple-500" />
                  </div>
                  <div className="text-right text-sm">
                    <div className="text-2xl font-bold text-slate-900">0</div>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mb-1">
                  Prochaines sessions
                </p>
                <p className="text-xs text-slate-400">
                  Aucune session à venir
                </p>
              </div>
            </div>

            {/* Deux colonnes : résumé profil + réservations */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-navy-800 rounded-2xl p-6 border border-navy-700 space-y-3 text-sm">
                <h2 className="text-lg font-semibold mb-2">Mon profil</h2>
                <p>
                  <span className="text-slate-500">Email :</span> {user.email}
                </p>
                <p>
                  <span className="text-slate-500">Rôle :</span>{" "}
                  {user.role || "Élève"}
                </p>
                <p>
                  <span className="text-slate-500">Nom :</span>{" "}
                  {user.lastName || "-"}
                </p>
                <p>
                  <span className="text-slate-500">Membre depuis :</span>{" "}
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
                <Link href="/dashboard/profile" className="inline-block mt-2 text-gold-400 text-xs hover:underline">
                  Modifier mes informations →
                </Link>
              </div>

              <div className="lg:col-span-2 bg-navy-800 rounded-2xl p-6 border border-navy-700">
                <h2 className="text-lg font-semibold mb-3">Mes réservations</h2>
                <p className="text-slate-500 italic text-sm">
                  Aucune réservation pour le moment. Vous pourrez bientôt voir ici
                  vos sessions planifiées (conduite, code, VTC, etc.).
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
