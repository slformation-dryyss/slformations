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
} from "lucide-react";
import Image from "next/image";
import { useUser } from "@auth0/nextjs-auth0/client";

type ProfileResponse = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  isProfileComplete: boolean;
  createdAt: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
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

        // Profil incomplet → onboarding profil
        if (!data.isProfileComplete) {
          router.replace("/dashboard/profile?onboarding=1");
          return;
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

  return (
    <div className="min-h-screen bg-navy-900 text-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex">
        {/* Sidebar simple */}
        <aside className="hidden lg:block w-64 mr-6 bg-navy-800 rounded-2xl border border-navy-700 h-[calc(100vh-7rem)] sticky top-24">
          <div className="p-6 border-b border-navy-700">
            <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">
              Espace élève
            </p>
            <p className="text-sm font-semibold">Bonjour, {user.name}</p>
          </div>
          <nav className="p-4 space-y-2 text-sm">
            <div className="px-4 py-2.5 rounded-lg bg-gold-500/15 border-l-4 border-gold-500 text-gold-400 font-semibold">
              Tableau de bord
            </div>
            <Link
              href="/dashboard/mes-formations"
              className="block px-4 py-2.5 rounded-lg text-gray-300 hover:bg-navy-700 hover:text-white transition flex items-center space-x-2"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Mes formations</span>
            </Link>
            <Link
              href="/dashboard/planning"
              className="block px-4 py-2.5 rounded-lg text-gray-300 hover:bg-navy-700 hover:text-white transition flex items-center space-x-2"
            >
              <CalendarDays className="w-4 h-4" />
              <span>Mon planning</span>
            </Link>
            <Link
              href="/dashboard/paiement"
              className="block px-4 py-2.5 rounded-lg text-gray-300 hover:bg-navy-700 hover:text-white transition flex items-center space-x-2"
            >
              <CreditCard className="w-4 h-4" />
              <span>Mes paiements</span>
            </Link>
            <div className="px-4 py-2.5 rounded-lg text-gray-300 flex items-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <span>Messages</span>
            </div>
          </nav>
        </aside>

        {/* Contenu */}
        <section className="flex-1">
          {/* En-tête */}
          <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-1">
                Tableau de bord
              </h1>
              <p className="text-gray-400 text-sm">
                Bonjour {user.name}, voici un aperçu de votre progression.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 bg-navy-800 rounded-lg border border-navy-700 text-gray-300 hover:text-white hover:border-gold-500 transition">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center">
                  3
                </span>
              </button>
              <div className="flex items-center space-x-3">
                <div className="relative w-9 h-9">
                  <Image
                    src={user.picture || "/sl_formations_logo_2.jpg"}
                    alt={user.name || "Utilisateur"}
                    fill
                    className="rounded-full object-cover border border-gold-500"
                  />
                </div>
                <div className="hidden sm:block text-xs">
                  <div className="font-semibold">{user.name}</div>
                  <div className="text-gray-400">
                    {user.role || "Élève SL Formations"}
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Statistiques rapides */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            <div className="bg-navy-800 rounded-xl p-5 border border-navy-700 card-hover">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-400" />
                </div>
                <div className="text-right text-sm">
                  <div className="text-2xl font-bold">24h</div>
                  <div className="text-gray-400 text-xs">/ 35h</div>
                </div>
              </div>
              <p className="text-xs text-gray-400 mb-1">Heures effectuées</p>
              <div className="w-full bg-navy-700 rounded-full h-2 mb-1">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: "68%" }}
                />
              </div>
              <p className="text-xs text-blue-400">68% complété</p>
            </div>

            <div className="bg-navy-800 rounded-xl p-5 border border-navy-700 card-hover">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-gold-500/20 rounded-lg flex items-center justify-center">
                  <CalendarDays className="w-5 h-5 text-gold-500" />
                </div>
                <div className="text-right text-sm">
                  <div className="text-lg font-bold">Demain</div>
                  <div className="text-gray-400 text-xs">14h30</div>
                </div>
              </div>
              <p className="text-xs text-gray-400 mb-1">Prochain cours</p>
              <p className="text-gold-500 text-sm font-semibold">
                Pratique VTC
              </p>
              <p className="text-xs text-gray-400 mt-1">dans 18h 25 min</p>
            </div>

            <div className="bg-navy-800 rounded-xl p-5 border border-navy-700 card-hover">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-green-400" />
                </div>
                <div className="text-right text-sm">
                  <div className="text-2xl font-bold">95%</div>
                </div>
              </div>
              <p className="text-xs text-gray-400 mb-2">Taux de réussite</p>
              <p className="text-xs text-green-400">+5% ce mois-ci</p>
            </div>

            <div className="bg-navy-800 rounded-xl p-5 border border-navy-700 card-hover">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Car className="w-5 h-5 text-purple-400" />
                </div>
                <div className="text-right text-sm">
                  <div className="text-2xl font-bold">3</div>
                </div>
              </div>
              <p className="text-xs text-gray-400 mb-1">
                Prochaines sessions cette semaine
              </p>
              <p className="text-xs text-gray-300">
                2 pratiques, 1 code de la route
              </p>
            </div>
          </div>

          {/* Deux colonnes : résumé profil + réservations */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-navy-800 rounded-2xl p-6 border border-navy-700 space-y-3 text-sm">
              <h2 className="text-lg font-semibold mb-2">Mon profil</h2>
              <p>
                <span className="text-gray-400">Email :</span> {user.email}
              </p>
              <p>
                <span className="text-gray-400">Rôle :</span>{" "}
                {user.role || "Élève"}
              </p>
              <p>
                <span className="text-gray-400">Membre depuis :</span>{" "}
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="lg:col-span-2 bg-navy-800 rounded-2xl p-6 border border-navy-700">
              <h2 className="text-lg font-semibold mb-3">Mes réservations</h2>
              <p className="text-gray-400 italic text-sm">
                Aucune réservation pour le moment. Vous pourrez bientôt voir ici
                vos sessions planifiées (conduite, code, VTC, etc.).
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
