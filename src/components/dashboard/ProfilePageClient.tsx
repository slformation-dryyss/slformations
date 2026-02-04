'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  GraduationCap,
  User,
  KeyRound,
  Sparkles,
  Lock,
} from 'lucide-react';
import Image from 'next/image';
import { useUser } from '@auth0/nextjs-auth0/client';
import { ProfileForm } from '@/components/dashboard/ProfileForm';
import { WelcomeTour } from '@/components/dashboard/WelcomeTour';

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
  nationalIdNumber: string | null;
  drivingLicenseNumber: string | null;
  drivingLicenseType: string | null;
  drivingLicenseIssuedAt: string | null;
  bio: string | null;
  diplomas: string[];
  badges: string[];
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
  const [showTour, setShowTour] = useState(false);

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


      {/* Contenu principal */}
      <section className="flex-1">
        <div className="mb-8 space-y-3">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-black mb-2 tracking-tight">
                <span className="text-gradient-gold">Mon profil</span>
              </h1>
              <p className="text-gray-500 font-medium">
                Gérez vos informations personnelles et vos préférences.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-full text-slate-500">
              <Lock className="w-3.5 h-3.5" />
              Espace sécurisé
            </div>
          </div>

          {isOnboarding && (
            <div className="rounded-xl border border-gold-500/40 bg-gold-500/10 px-4 py-3 text-xs md:text-sm text-gold-100">
              <p className="font-semibold mb-1">
                {user.role === "INSTRUCTOR" ? "Bienvenue sur votre espace formateur 🎓" : "Bienvenue sur votre espace élève 🎓"}
              </p>
              <p>
                {user.role === "INSTRUCTOR"
                  ? "Merci de compléter votre profil pour faciliter la gestion administrative et le planning."
                  : "Pour accéder à toutes les fonctionnalités du tableau de bord, merci de compléter votre profil ci-dessous."}
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Carte profil */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xl shadow-slate-200/50">
              <div className="h-24 bg-gradient-to-r from-navy-950 to-navy-800 relative">
                <div className="absolute -bottom-12 inset-x-0 flex justify-center">
                  <div className="relative w-24 h-24 md:w-28 md:h-28">
                    {auth0User.picture ? (
                      <Image
                        src={auth0User.picture}
                        alt="Profil utilisateur"
                        fill
                        className="rounded-full border-4 border-white object-cover shadow-lg"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full border-4 border-white bg-slate-100 flex items-center justify-center shadow-lg">
                        <User className="w-10 h-10 text-slate-400" />
                      </div>
                    )}
                    <button className="absolute bottom-1 right-1 w-8 h-8 bg-gold-500 rounded-full flex items-center justify-center text-navy-900 hover:bg-gold-600 transition shadow-md border-2 border-white">
                      <Sparkles className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-16 pb-8 px-6 text-center">
                <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-1">
                  {[user.firstName, user.lastName].filter(Boolean).length > 0
                    ? [user.firstName, user.lastName].filter(Boolean).join(" ")
                    : user.name && user.name !== user.email
                      ? user.name
                      : "Bienvenue"}
                </h2>
                <p className="text-slate-500 text-sm mb-6 flex items-center justify-center gap-1.5 font-medium">
                  {user.email}
                  {auth0User.email_verified && (
                    <span className="w-3 h-3 bg-green-500 rounded-full border-2 border-white" title="Email vérifié"></span>
                  )}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
                    <span className="block text-[10px] uppercase font-bold text-slate-400 mb-1 tracking-wider">Membre</span>
                    <span className="font-black text-slate-700">{new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
                    <span className="block text-[10px] uppercase font-bold text-slate-400 mb-1 tracking-wider">Rôle</span>
                    <span className="font-black text-gold-600 uppercase text-xs">{user.role}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => setShowTour(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-slate-100 text-slate-700 rounded-2xl text-xs font-black hover:border-gold-500/50 hover:bg-gold-50/30 transition-all group"
                  >
                    <Sparkles className="w-4 h-4 text-gold-500 group-hover:scale-110 transition-transform" />
                    Revoir le tutoriel bienvenue
                  </button>

                  <Link
                    href="/dashboard/change-password"
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10"
                  >
                    <KeyRound className="w-4 h-4" />
                    Modifier mon mot de passe
                  </Link>
                </div>
              </div>
            </div>

            {showTour && <WelcomeTour role={user.role} forced onClose={() => setShowTour(false)} />}

            {user.role === "STUDENT" && (
              <div className="bg-navy-800 rounded-2xl p-6 border border-navy-700 text-xs md:text-sm">
                <h3 className="font-bold text-base mb-4">Progression</h3>
                <div className="text-center text-gray-500 py-4 italic">
                  Aucune formation en cours
                </div>
              </div>
            )}
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
                nationalIdNumber: user.nationalIdNumber,
                drivingLicenseNumber: user.drivingLicenseNumber,
                drivingLicenseType: user.drivingLicenseType,
                drivingLicenseIssuedAt: user.drivingLicenseIssuedAt,
                role: user.role,
                bio: user.bio,
                diplomas: user.diplomas,
                badges: user.badges,
              }}
            />

            {/* Badges Section for Instructors (or everyone if we gameify later) */}
            {(user.role === "INSTRUCTOR" || (user.badges && user.badges.length > 0)) && (
              <div className="bg-navy-800 rounded-2xl p-6 border border-navy-700 text-xs md:text-sm">
                <h3 className="font-bold text-base mb-4">Badges & Certifications</h3>
                {(!user.badges || user.badges.length === 0) ? (
                  <div className="text-center text-gray-500 py-4 italic">
                    Aucun badge obtenu pour le moment.
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-4">
                    {user.badges.map((badge: string, idx: number) => (
                      <div key={idx} className="flex flex-col items-center gap-2 p-3 bg-navy-900 rounded-lg border border-navy-600 min-w-[100px]">
                        <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-500 text-xl">
                          🏆
                        </div>
                        <span className="text-xs font-semibold capitalize">{badge.replace(/_/g, " ")}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}


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









