'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
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
} from 'lucide-react';
import Image from 'next/image';
import { useUser } from '@auth0/nextjs-auth0/client';
import { ProfileForm } from '@/components/dashboard/ProfileForm';

type ProfileResponse = {
  id: string;
  auth0Id: string;
  email: string;
  name: string | null;
  role: string;
  isProfileComplete: boolean;
  createdAt: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  birthDate: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  postalCode: string | null;
  city: string | null;
  country: string | null;
  profession: string | null;
  employerName: string | null;
  wantsVtcTraining: boolean | null;
  wantsTaxiTraining: boolean | null;
  nationalIdNumber: string | null;
  drivingLicenseNumber: string | null;
  drivingLicenseType: string | null;
  drivingLicenseIssuedAt: string | null;
};

export function ProfilePageClient({
  searchParams,
}: {
  searchParams?: { onboarding?: string };
}) {
  const router = useRouter();
  const params = useSearchParams();
  const { user: auth0User, isLoading } = useUser();
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const isOnboarding = (searchParams?.onboarding ?? params?.get('onboarding')) === '1';

  useEffect(() => {
    if (isLoading) return;

    if (!auth0User) {
      router.replace('/api/auth/login?returnTo=/dashboard/profile');
      return;
    }

    // Si email non vérifié, on renvoie vers la page de vérification
    if (!(auth0User as any).email_verified) {
      router.replace('/dashboard/verify-email');
      return;
    }

    const loadProfile = async () => {
      try {
        const params = new URLSearchParams();
        if (auth0User?.email) {
          params.set('email', auth0User.email);
        }

        const res = await fetch(`/api/profile?${params.toString()}`, {
          cache: 'no-store',
        });
        if (!res.ok) {
          throw new Error('Impossible de charger le profil');
        }
        const data: ProfileResponse = await res.json();
        setProfile(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfile();
  }, [auth0User, isLoading, router, searchParams, params]);

  if (isLoading || loadingProfile || !auth0User || !profile) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-300 text-sm">Chargement de votre profil...</p>
      </div>
    );
  }

  const user = profile;

  return (
    <>
      {/* Sidebar */}
      <aside className="hidden lg:block w-64 mr-6 bg-navy-800 rounded-2xl border border-navy-700 h-[calc(100vh-7rem)] sticky top-24 overflow-y-auto">
        <nav className="p-4 space-y-2 text-sm">
          <Link
            href="/dashboard"
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-navy-700 hover:text-white transition text-left"
          >
            <ChartLine className="w-4 h-4" />
            <span>Tableau de bord</span>
          </Link>
          <Link
            href="/dashboard/mes-formations"
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-navy-700 hover:text-white transition text-left"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Mes formations</span>
          </Link>
          <Link
            href="/dashboard/planning"
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-navy-700 hover:text-white transition text-left"
          >
            <CalendarDays className="w-4 h-4" />
            <span>Mon planning</span>
          </Link>
          <Link
            href="/dashboard/paiement"
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-navy-700 hover:text-white transition text-left"
          >
            <CreditCard className="w-4 h-4" />
            <span>Mes paiements</span>
          </Link>
          <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-navy-700 hover:text-white transition text-left">
            <MessageSquare className="w-4 h-4" />
            <span>Messages</span>
          </button>
          <Link
            href="/dashboard/profile"
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg bg-gold-500/15 border-l-4 border-gold-500 text-gold-400 text-left"
          >
            <User className="w-4 h-4" />
            <span>Mon profil</span>
          </Link>

          <div className="border-t border-navy-700 my-4" />

          <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-navy-700 hover:text-white transition text-left">
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

      {/* Contenu principal */}
      <section className="flex-1">
        <div className="mb-8 space-y-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-1">Mon profil</h1>
            <p className="text-gray-400 text-sm md:text-base">
              Gérez vos informations personnelles et vos préférences.
            </p>
          </div>

          {isOnboarding && (
            <div className="rounded-xl border border-gold-500/40 bg-gold-500/10 px-4 py-3 text-xs md:text-sm text-gold-100">
              <p className="font-semibold mb-1">Bienvenue sur votre espace élève 🎓</p>
              <p>
                Pour accéder à toutes les fonctionnalités du tableau de bord (planning,
                paiements, formations), merci de compléter votre profil ci-dessous. Cela ne
                prend que quelques minutes.
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Carte profil */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-navy-800 rounded-2xl p-6 md:p-8 border border-navy-700 text-center">
              <div className="relative inline-block mb-6">
                <div className="relative w-28 h-28 md:w-32 md:h-32">
                  <Image
                    src={auth0User.picture || "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg"}
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
                {[user.firstName, user.lastName].filter(Boolean).length > 0
                  ? [user.firstName, user.lastName].filter(Boolean).join(" ")
                  : user.name && user.name !== user.email
                  ? user.name
                  : "Bienvenue"}
              </h2>
              <p className="text-gray-400 text-sm mb-3">{user.email}</p>
              {/* <div className="inline-flex items-center px-4 py-1.5 bg-blue-500/20 text-blue-400 rounded-full text-xs font-semibold mb-6">
                <span className="mr-2">🚗</span> Élève VTC
              </div> */}

              <div className="space-y-3 text-left text-xs md:text-sm mt-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Membre depuis</span>
                  <span className="font-semibold">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Rôle</span>
                  <span className="font-semibold">{user.role}</span>
                </div>
                {/* <div className="flex items-center justify-between">
                  <span className="text-gray-400">Heures effectuées</span>
                  <span className="font-semibold">0h / --</span>
                </div> */}
              </div>
            </div>

            <div className="bg-navy-800 rounded-2xl p-6 border border-navy-700 text-xs md:text-sm">
              <h3 className="font-bold text-base mb-4">Progression</h3>
              <div className="text-center text-gray-500 py-4 italic">
                Aucune formation en cours
              </div>
            </div>
          </div>

          {/* Formulaire informations + documents */}
          <div className="lg:col-span-2 space-y-6">
            <ProfileForm
              user={{
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone,
                birthDate: user.birthDate,
                addressLine1: user.addressLine1,
                addressLine2: user.addressLine2,
                postalCode: user.postalCode,
                city: user.city,
                country: user.country,
                profession: user.profession,
                employerName: user.employerName,
                wantsVtcTraining: user.wantsVtcTraining,
                wantsTaxiTraining: user.wantsTaxiTraining,
                nationalIdNumber: user.nationalIdNumber,
                drivingLicenseNumber: user.drivingLicenseNumber,
                drivingLicenseType: user.drivingLicenseType,
                drivingLicenseIssuedAt: user.drivingLicenseIssuedAt,
              }}
            />

            <section className="bg-navy-800 rounded-2xl p-6 md:p-8 border border-navy-700 text-xs md:text-sm">
              <h3 className="text-lg md:text-2xl font-bold mb-4">Mes documents</h3>
              <div className="text-center text-gray-500 py-8 italic border border-navy-700 border-dashed rounded-lg">
                Aucun document disponible pour le moment.
              </div>
            </section>
          </div>
        </div>
      </section>
    </>
  );
}





