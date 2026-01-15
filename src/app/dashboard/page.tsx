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
import { WelcomeTour } from "@/components/dashboard/WelcomeTour";

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

type DashboardStats = {
  stats: {
    completedHours: number;
    totalHours: number;
    progressPercentage: number;
    futureSessionsCount: number;
  };
  nextSession: {
    id: string;
    date: string;
    title: string;
    location: string | null;
  } | null;
  recentBookings: Array<{
    id: string;
    date: string;
    title: string;
    location: string | null;
  }>;
};

export default function Dashboard() {
  const router = useRouter();
  const { user: auth0User, isLoading } = useUser();
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
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

    const loadData = async () => {
      try {
        setLoadingProfile(true);
        // Load Profile
        const profileRes = await fetch("/api/profile", { cache: "no-store" });
        if (!profileRes.ok) {
          // Si l'API profile échoue, on redirige vers login
          router.replace("/api/auth/login?returnTo=/dashboard");
          return;
        }
        const profileData: ProfileResponse = await profileRes.json();

        // Admin/Owner → redirection tableau de bord admin (IMMÉDIATE)
        if (profileData.role === "ADMIN" || profileData.role === "OWNER") {
          router.replace("/admin");
          return;
        }

        // Profil incomplet → onboarding profil (sauf si skippé)
        if (!profileData.isProfileComplete) {
          const hasSkipped = document.cookie.split("; ").find(row => row.startsWith("sl_onboarding_skipped="));
          if (!hasSkipped) {
            router.replace("/dashboard/onboarding");
            return;
          }
        }

        setProfile({
          ...profileData,
          picture: (auth0User as any).picture ?? null,
        });

        // Load Stats
        const statsRes = await fetch("/api/dashboard/stats", { cache: "no-store" });
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }

      } catch (e) {
        console.error(e);
      } finally {
        setLoadingProfile(false);
      }
    };

    loadData();
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

  const completedHours = stats?.stats.completedHours || 0;
  // const totalHours = stats?.stats.totalHours || 0;
  const progressPct = stats?.stats.progressPercentage || 0;
  const futureSessions = stats?.stats.futureSessionsCount || 0;
  const nextSession = stats?.nextSession;

  const isInstructor = user.role === "INSTRUCTOR" || user.role === "ADMIN" || user.role === "OWNER";

  return (
    <>
      <WelcomeTour role={user.role} onClose={() => { }} />
      <div className="pt-6">
        <div className="max-w-7xl mx-auto">
          {/* En-tête de section */}
          <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-1">
                Tableau de bord
              </h1>
              <p className="text-slate-500 text-sm">
                Bonjour <span className="text-gold-600 font-semibold">{displayName}</span>, voici un aperçu de votre {isInstructor ? "activité" : "progression"}.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 bg-white rounded-lg border border-slate-200 text-slate-500 hover:text-slate-900 hover:border-gold-500 transition">
                <Bell className="w-5 h-5" />
              </button>
              <Link href="/dashboard/profile" className="flex items-center space-x-3 hover:opacity-80 transition">
                <div className="relative w-9 h-9">
                  {user.picture ? (
                    <Image
                      src={user.picture}
                      alt={displayName}
                      fill
                      className="rounded-full object-cover border border-gold-500"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-slate-100 border border-gold-500 flex items-center justify-center text-slate-500">
                      <User className="w-5 h-5" />
                    </div>
                  )}
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

          {/* Statistiques dynamiques */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            <div className="bg-white rounded-xl p-5 border border-slate-200 card-hover shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-500" />
                </div>
                <div className="text-right text-sm">
                  <div className="text-2xl font-bold text-slate-900">{completedHours}h</div>
                </div>
              </div>
              <p className="text-xs text-slate-500 mb-1">{isInstructor ? "Heures dispensées" : "Heures effectuées"}</p>
              {!isInstructor && (
                <>
                  <div className="w-full bg-slate-100 rounded-full h-2 mb-1">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${Math.min(progressPct, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-blue-500">{progressPct}% completé (moy.)</p>
                </>
              )}
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-200 card-hover shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                  <CalendarDays className="w-5 h-5 text-slate-500" />
                </div>
                <div className="text-right text-sm">
                  {nextSession ? (
                    <>
                      <div className="text-lg font-bold text-slate-900 truncate max-w-[120px]" title={nextSession.title}>{nextSession.title}</div>
                      <div className="text-gold-600 text-xs font-semibold">{new Date(nextSession.date).toLocaleDateString()}</div>
                    </>
                  ) : (
                    <div className="text-lg font-bold text-slate-400">Aucun</div>
                  )}
                </div>
              </div>
              <p className="text-xs text-slate-500 mb-1">{isInstructor ? "Prochain cours à donner" : "Prochain cours"}</p>
              <p className="text-slate-500 text-xs italic truncate">
                {nextSession ? nextSession.location || "En ligne/Centre" : "Pas de session planifiée"}
              </p>
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-200 card-hover shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-slate-500" />
                </div>
                <div className="text-right text-sm">
                  <div className="text-2xl font-bold text-slate-400">
                    {isInstructor ? (stats?.stats.futureSessionsCount || 0) : "-"}
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-500 mb-2">{isInstructor ? "Sessions futures" : "Taux de réussite"}</p>
              <p className="text-xs text-slate-500">{isInstructor ? "Prévues au planning" : "Pas assez de données"}</p>
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-200 card-hover shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <Car className="w-5 h-5 text-purple-500" />
                </div>
                <div className="text-right text-sm">
                  <div className="text-2xl font-bold text-slate-900">{futureSessions}</div>
                </div>
              </div>
              <p className="text-xs text-slate-500 mb-1">
                {isInstructor ? "Total Créneaux" : "Prochaines sessions"}
              </p>
              <p className="text-xs text-slate-400">
                {futureSessions > 0 ? (isInstructor ? "À venir" : "Réservations confirmées") : "Aucune session à venir"}
              </p>
            </div>
          </div>

          {/* Deux colonnes : résumé profil + réservations */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-3 text-sm shadow-sm">
              <h2 className="text-lg font-semibold mb-2 text-slate-900">Mon profil</h2>
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
              <Link href="/dashboard/profile" className="inline-block mt-2 text-gold-600 text-xs hover:underline">
                Modifier mes informations →
              </Link>
            </div>

            <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h2 className="text-lg font-semibold mb-3 text-slate-900">{isInstructor ? "Mon planning d'enseignement" : "Mes sessions à venir"}</h2>
              {stats?.recentBookings && stats.recentBookings.length > 0 ? (
                <div className="space-y-3">
                  {stats.recentBookings.map((session) => (
                    <div key={session.id} className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="bg-white p-2 rounded text-gold-500 border border-slate-100">
                          <CalendarDays className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-sm text-slate-900">{session.title}</div>
                          <div className="text-xs text-slate-400">{session.location || "Lieu non précisé"}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-sm font-bold text-slate-700">{new Date(session.date).toLocaleDateString()}</div>
                        <div className="text-xs text-slate-500">{new Date(session.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 italic text-sm">
                  {isInstructor ? "Aucun cours programmé prochainement." : "Aucune réservation trouvée. Consultez le planning pour réserver une session."}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

