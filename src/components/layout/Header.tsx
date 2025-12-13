'use client';

import Link from "next/link";
import Image from "next/image";
import {
  Menu,
  X,
  User,
  LogOut,
  Loader2,
  ChevronDown,
  CalendarDays,
  GraduationCap,
  CreditCard as CreditCardIcon,
  LayoutDashboard,
  AlertTriangle,
} from "lucide-react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useState } from "react";

export function Header() {
  const { user, isLoading } = useUser();
  const [isStudentMenuOpen, setIsStudentMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header id="header" className="fixed w-full top-0 z-50 glass-effect">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative h-12 w-48 md:w-56">
              <Image
                src="/LOGO long.png"
                alt="SL Formations"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-slate-900 hover:text-gold-500 transition font-medium"
            >
              Accueil
            </Link>

            {/* Dropdown Formations */}
            <div 
              className="relative group"
            >
              <button 
                className="flex items-center space-x-1 text-slate-600 group-hover:text-gold-500 transition focus:outline-none"
              >
                <span>Formations</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              <div className="absolute top-full left-0 w-64 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                <div className="bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden py-2">
                   <Link
                    href="/formations/catalogue"
                    className="flex items-center space-x-3 px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-gold-600 transition"
                  >
                    <span className="w-1 h-1 rounded-full bg-gold-500"></span>
                    <span>Tout le catalogue</span>
                  </Link>
                  <div className="my-2 border-t border-slate-100"></div>
                  <Link
                    href="/formations/recuperation-points"
                    className="flex items-center space-x-3 px-4 py-2 hover:bg-slate-50 text-red-600 font-medium hover:text-red-700 transition"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span>Récupération de Points</span>
                  </Link>
                   <Link
                    href="/formations/vtc"
                    className="flex items-center space-x-3 px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-gold-600 transition"
                  >
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span>VTC / Taxi</span>
                  </Link>
                  <Link
                    href="/formations/caces"
                    className="flex items-center space-x-3 px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-gold-600 transition"
                  >
                     <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span>CACES®</span>
                  </Link>
                   <Link
                    href="/formations/secourisme"
                    className="flex items-center space-x-3 px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-gold-600 transition"
                  >
                     <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span>Secourisme (SST)</span>
                  </Link>
                   <Link
                    href="/formations/incendie"
                    className="flex items-center space-x-3 px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-gold-600 transition"
                  >
                     <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span>Sécurité Incendie</span>
                  </Link>
                  <Link
                    href="/formations/habilitation-electrique"
                    className="flex items-center space-x-3 px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-gold-600 transition"
                  >
                     <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span>Habilitation Élec.</span>
                  </Link>
                </div>
              </div>
            </div>
          </nav>

          <div className="flex items-center space-x-4">
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin text-gold-500" />
            ) : user ? (
              <div className="flex items-center space-x-4 relative">
                {/* Bouton d'accès direct à l'espace élève (desktop) supprimé */}

                <Link
                  href="/profile"
                  className="flex items-center space-x-2 text-slate-900 hover:text-gold-500 transition"
                >
                  {user.picture ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.picture}
                      alt={user.name || "User"}
                      className="w-8 h-8 rounded-full border border-gold-500"
                    />
                  ) : (
                    <User className="w-6 h-6" />
                  )}
                  <span className="hidden lg:block text-sm font-medium">
                    {user.name}
                  </span>
                </Link>
                <Link
                  href="/api/auth/logout"
                  className="p-2 text-slate-500 hover:text-slate-900 transition"
                  title="Se déconnecter"
                >
                  <LogOut className="w-5 h-5" />
                </Link>

                {/* Icône profil avec menu déroulant espace élève */}
                <button
                  type="button"
                  onClick={() => setIsStudentMenuOpen((open) => !open)}
                  className="p-2 rounded-lg text-slate-600 hover:text-gold-500 hover:bg-slate-100 transition flex items-center justify-center"
                  aria-label="Menu espace élève"
                >
                  <User className="w-5 h-5" />
                  <ChevronDown className="w-4 h-4 ml-0.5" />
                </button>

                {isStudentMenuOpen && (
                  <div className="absolute right-0 top-11 w-56 rounded-xl bg-white border border-slate-200 shadow-xl py-2 text-sm">
                    <Link
                      href="/dashboard"
                      className="flex items-center space-x-2 px-4 py-2 text-slate-600 hover:bg-slate-50 hover:text-gold-500 transition"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Tableau de bord</span>
                    </Link>
                    <Link
                      href="/dashboard/mes-formations"
                      className="flex items-center space-x-2 px-4 py-2 text-slate-600 hover:bg-slate-50 hover:text-gold-500 transition"
                    >
                      <GraduationCap className="w-4 h-4" />
                      <span>Mes formations</span>
                    </Link>
                    <Link
                      href="/dashboard/planning"
                      className="flex items-center space-x-2 px-4 py-2 text-slate-600 hover:bg-slate-50 hover:text-gold-500 transition"
                    >
                      <CalendarDays className="w-4 h-4" />
                      <span>Mon planning</span>
                    </Link>
                    <Link
                      href="/dashboard/paiement"
                      className="flex items-center space-x-2 px-4 py-2 text-slate-600 hover:bg-slate-50 hover:text-gold-500 transition"
                    >
                      <CreditCardIcon className="w-4 h-4" />
                      <span>Mes paiements</span>
                    </Link>
                    <Link
                      href="/dashboard/profile"
                      className="flex items-center space-x-2 px-4 py-2 text-slate-600 hover:bg-slate-50 hover:text-gold-500 transition"
                    >
                      <User className="w-4 h-4" />
                      <span>Mon profil</span>
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* Desktop : lien texte Demande d'accès à gauche */}
                <Link
                  href="/demande-acces"
                  className="hidden md:block px-5 py-2 text-slate-900 hover:text-gold-500 transition font-medium"
                >
                  Demande d&apos;accès
                </Link>
                {/* CTA principal : Accéder à mon espace (redirige vers le login) */}
                <Link
                  href="/api/auth/login?returnTo=/dashboard"
                  className="px-6 py-2.5 bg-gradient-to-r from-gold-500 to-gold-600 text-slate-900 rounded-lg font-semibold hover:shadow-lg hover:shadow-gold-500/50 transition"
                >
                  Accéder à mon espace
                </Link>
              </>
            )}
            <button
              className="md:hidden text-slate-900"
              type="button"
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              aria-label={isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/95 border-t border-slate-200 backdrop-blur px-6 pb-4">
          <nav className="flex flex-col space-y-3 pt-2 text-sm">
            <Link
              href="/"
              className="py-2 text-slate-900 hover:text-gold-500 transition"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Accueil
            </Link>
            <div className="py-2 space-y-1">
              <span className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Formations</span>
              <Link
                href="/formations/catalogue"
                 className="block py-2 px-3 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-gold-500 transition"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Tout le catalogue
              </Link>
               <Link
                href="/formations/recuperation-points"
                 className="block py-2 px-3 rounded-lg text-red-600 font-medium hover:bg-red-50 hover:text-red-700 transition ml-2 border-l border-red-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Récupération de Points
              </Link>
              <Link
                href="/formations/vtc"
                 className="block py-2 px-3 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-gold-500 transition ml-2 border-l border-slate-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                VTC / Taxi
              </Link>
               <Link
                href="/formations/caces"
                 className="block py-2 px-3 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-gold-500 transition ml-2 border-l border-slate-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                CACES®
              </Link>
               <Link
                href="/formations/secourisme"
                 className="block py-2 px-3 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-gold-500 transition ml-2 border-l border-slate-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Secourisme
              </Link>
               <Link
                href="/formations/incendie"
                 className="block py-2 px-3 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-gold-500 transition ml-2 border-l border-slate-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Incendie
              </Link>
               <Link
                href="/formations/habilitation-electrique"
                 className="block py-2 px-3 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-gold-500 transition ml-2 border-l border-slate-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Habilitation Élec.
              </Link>
            </div>
            <Link
              href="/location"
              className="py-2 text-slate-600 hover:text-gold-500 transition"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Location
            </Link>
            <Link
              href="/#testimonials"
              className="py-2 text-slate-600 hover:text-gold-500 transition"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Témoignages
            </Link>
            <Link
              href="/contact"
              className="py-2 text-slate-600 hover:text-gold-500 transition"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>

            <div className="pt-2 border-t border-slate-200 mt-2">
              <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">
                Espace élève
              </p>
              <div className="flex flex-col space-y-2">
                <Link
                  href="/dashboard"
                  className="flex items-center space-x-2 py-1 text-slate-600 hover:text-gold-500 transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Tableau de bord</span>
                </Link>
                <Link
                  href="/dashboard/mes-formations"
                  className="flex items-center space-x-2 py-1 text-slate-600 hover:text-gold-500 transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Mes formations</span>
                </Link>
                <Link
                  href="/dashboard/planning"
                  className="flex items-center space-x-2 py-1 text-slate-600 hover:text-gold-500 transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <CalendarDays className="w-4 h-4" />
                  <span>Mon planning</span>
                </Link>
                <Link
                  href="/dashboard/paiement"
                  className="flex items-center space-x-2 py-1 text-slate-600 hover:text-gold-500 transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <CreditCardIcon className="w-4 h-4" />
                  <span>Mes paiements</span>
                </Link>
                <Link
                  href="/dashboard/profile"
                  className="flex items-center space-x-2 py-1 text-slate-600 hover:text-gold-500 transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User className="w-4 h-4" />
                  <span>Mon profil</span>
                </Link>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 mt-2">
              {isLoading ? (
                <div className="flex items-center space-x-2 text-slate-500 py-2">
                  <Loader2 className="w-4 h-4 animate-spin text-gold-500" />
                  <span>Chargement...</span>
                </div>
              ) : user ? (
                <div className="flex items-center justify-between py-2">
                  <Link
                    href="/profile"
                    className="flex items-center space-x-2 text-slate-900 hover:text-gold-500 transition"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {user.picture ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={user.picture}
                        alt={user.name || "User"}
                        className="w-8 h-8 rounded-full border border-gold-500"
                      />
                    ) : (
                      <User className="w-6 h-6" />
                    )}
                    <span className="text-sm font-medium truncate max-w-[140px]">
                      {user.name}
                    </span>
                  </Link>
                  <Link
                    href="/api/auth/logout"
                    className="p-2 text-slate-500 hover:text-slate-900 transition"
                    title="Se déconnecter"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <LogOut className="w-5 h-5" />
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-1">
                  <Link
                    href="/demande-acces"
                    className="px-4 py-2 text-sm text-slate-900 hover:text-gold-500 transition text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Demande d&apos;accès
                  </Link>
                  <Link
                    href="/api/auth/login?screen_hint=signup&returnTo=/dashboard"
                    className="px-4 py-2 bg-gradient-to-r from-gold-500 to-gold-600 text-slate-900 rounded-lg font-semibold hover:shadow-lg hover:shadow-gold-500/50 transition text-center text-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    S&apos;inscrire
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
