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
            <div className="relative h-10 w-40 md:w-48">
              <Image
                src="/sl_formations_logo_1.jpg"
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
              className="text-white hover:text-gold-500 transition font-medium"
            >
              Accueil
            </Link>
            <Link
              href="/formations"
              className="text-gray-300 hover:text-gold-500 transition"
            >
              Formations
            </Link>
            <Link
              href="/location"
              className="text-gray-300 hover:text-gold-500 transition"
            >
              Location
            </Link>
            <Link
              href="/#testimonials"
              className="text-gray-300 hover:text-gold-500 transition"
            >
              Témoignages
            </Link>
            <Link
              href="/contact"
              className="text-gray-300 hover:text-gold-500 transition"
            >
              Contact
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin text-gold-500" />
            ) : user ? (
              <div className="flex items-center space-x-4 relative">
                {/* Bouton d'accès direct à l'espace élève (desktop) */}
                <Link
                  href="/dashboard"
                  className="hidden md:inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-gold-500 to-gold-600 text-navy-900 rounded-lg font-semibold text-sm hover:shadow-lg hover:shadow-gold-500/40 transition"
                >
                  Accéder à mon espace
                </Link>

                <Link
                  href="/profile"
                  className="flex items-center space-x-2 text-white hover:text-gold-500 transition"
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
                  className="p-2 text-gray-400 hover:text-white transition"
                  title="Se déconnecter"
                >
                  <LogOut className="w-5 h-5" />
                </Link>

                {/* Icône profil avec menu déroulant espace élève */}
                <button
                  type="button"
                  onClick={() => setIsStudentMenuOpen((open) => !open)}
                  className="p-2 rounded-lg text-gray-300 hover:text-gold-500 hover:bg-navy-800 transition flex items-center justify-center"
                  aria-label="Menu espace élève"
                >
                  <User className="w-5 h-5" />
                  <ChevronDown className="w-4 h-4 ml-0.5" />
                </button>

                {isStudentMenuOpen && (
                  <div className="absolute right-0 top-11 w-56 rounded-xl bg-navy-900 border border-navy-700 shadow-xl py-2 text-sm">
                    <Link
                      href="/dashboard"
                      className="flex items-center space-x-2 px-4 py-2 text-gray-200 hover:bg-navy-800 hover:text-gold-500 transition"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Tableau de bord</span>
                    </Link>
                    <Link
                      href="/dashboard/mes-formations"
                      className="flex items-center space-x-2 px-4 py-2 text-gray-200 hover:bg-navy-800 hover:text-gold-500 transition"
                    >
                      <GraduationCap className="w-4 h-4" />
                      <span>Mes formations</span>
                    </Link>
                    <Link
                      href="/dashboard/planning"
                      className="flex items-center space-x-2 px-4 py-2 text-gray-200 hover:bg-navy-800 hover:text-gold-500 transition"
                    >
                      <CalendarDays className="w-4 h-4" />
                      <span>Mon planning</span>
                    </Link>
                    <Link
                      href="/dashboard/paiement"
                      className="flex items-center space-x-2 px-4 py-2 text-gray-200 hover:bg-navy-800 hover:text-gold-500 transition"
                    >
                      <CreditCardIcon className="w-4 h-4" />
                      <span>Mes paiements</span>
                    </Link>
                    <Link
                      href="/dashboard/profile"
                      className="flex items-center space-x-2 px-4 py-2 text-gray-200 hover:bg-navy-800 hover:text-gold-500 transition"
                    >
                      <User className="w-4 h-4" />
                      <span>Mon profil</span>
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* Desktop : lien texte Connexion à gauche */}
                <Link
                  href="/api/auth/login?returnTo=/dashboard"
                  className="hidden md:block px-5 py-2 text-white hover:text-gold-500 transition font-medium"
                >
                  Connexion
                </Link>
                {/* CTA principal : Accéder à mon espace (redirige vers le login) */}
                <Link
                  href="/api/auth/login?returnTo=/dashboard"
                  className="px-6 py-2.5 bg-gradient-to-r from-gold-500 to-gold-600 text-navy-900 rounded-lg font-semibold hover:shadow-lg hover:shadow-gold-500/50 transition"
                >
                  Accéder à mon espace
                </Link>
              </>
            )}
            <button
              className="md:hidden text-white"
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
        <div className="md:hidden bg-navy-900/95 border-t border-navy-800 backdrop-blur px-6 pb-4">
          <nav className="flex flex-col space-y-3 pt-2 text-sm">
            <Link
              href="/"
              className="py-2 text-white hover:text-gold-500 transition"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Accueil
            </Link>
            <Link
              href="/formations"
              className="py-2 text-gray-300 hover:text-gold-500 transition"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Formations
            </Link>
            <Link
              href="/location"
              className="py-2 text-gray-300 hover:text-gold-500 transition"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Location
            </Link>
            <Link
              href="/#testimonials"
              className="py-2 text-gray-300 hover:text-gold-500 transition"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Témoignages
            </Link>
            <Link
              href="/contact"
              className="py-2 text-gray-300 hover:text-gold-500 transition"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>

            <div className="pt-2 border-t border-navy-800 mt-2">
              <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                Espace élève
              </p>
              <div className="flex flex-col space-y-2">
                <Link
                  href="/dashboard"
                  className="flex items-center space-x-2 py-1 text-gray-200 hover:text-gold-500 transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Tableau de bord</span>
                </Link>
                <Link
                  href="/dashboard/mes-formations"
                  className="flex items-center space-x-2 py-1 text-gray-200 hover:text-gold-500 transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Mes formations</span>
                </Link>
                <Link
                  href="/dashboard/planning"
                  className="flex items-center space-x-2 py-1 text-gray-200 hover:text-gold-500 transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <CalendarDays className="w-4 h-4" />
                  <span>Mon planning</span>
                </Link>
                <Link
                  href="/dashboard/paiement"
                  className="flex items-center space-x-2 py-1 text-gray-200 hover:text-gold-500 transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <CreditCardIcon className="w-4 h-4" />
                  <span>Mes paiements</span>
                </Link>
                <Link
                  href="/dashboard/profile"
                  className="flex items-center space-x-2 py-1 text-gray-200 hover:text-gold-500 transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User className="w-4 h-4" />
                  <span>Mon profil</span>
                </Link>
              </div>
            </div>

            <div className="pt-3 border-t border-navy-800 mt-2">
              {isLoading ? (
                <div className="flex items-center space-x-2 text-gray-300 py-2">
                  <Loader2 className="w-4 h-4 animate-spin text-gold-500" />
                  <span>Chargement...</span>
                </div>
              ) : user ? (
                <div className="flex items-center justify-between py-2">
                  <Link
                    href="/profile"
                    className="flex items-center space-x-2 text-white hover:text-gold-500 transition"
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
                    className="p-2 text-gray-400 hover:text-white transition"
                    title="Se déconnecter"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <LogOut className="w-5 h-5" />
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-1">
                  <Link
                    href="/api/auth/login?returnTo=/dashboard"
                    className="px-4 py-2 text-sm text-white hover:text-gold-500 transition text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Connexion
                  </Link>
                  <Link
                    href="/api/auth/login?screen_hint=signup&returnTo=/dashboard"
                    className="px-4 py-2 bg-gradient-to-r from-gold-500 to-gold-600 text-navy-900 rounded-lg font-semibold hover:shadow-lg hover:shadow-gold-500/50 transition text-center text-sm"
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
