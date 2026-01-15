"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Bell,
  LogOut,
  User,
  Settings,
  Menu,
  X
} from "lucide-react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useState } from "react";

export function DashboardHeader() {
  const { user, isLoading } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/dashboard" className="relative h-8 w-32 md:w-36">
              <Image
                src="/sl_formations_logo_1.jpg"
                alt="SL Formations"
                fill
                className="object-contain"
                priority
              />
            </Link>
          </div>

          {/* Right side icons */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="p-2 text-slate-400 hover:text-slate-600 transition relative">
              <Bell className="w-5 h-5" />
              {/* <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span> */}
            </button>

            <div className="h-6 w-px bg-slate-200 mx-2"></div>

            {isLoading ? (
              <div className="w-8 h-8 rounded-full bg-slate-100 animate-pulse" />
            ) : user ? (
              <div className="flex items-center space-x-3">
                <div className="flex flex-col text-right mr-1">
                  <span className="text-sm font-semibold text-slate-900">{user.name}</span>
                  {/* Note: Ideally we should fetch the real role from DB here. 
                      For now, 'Élève' is a reasonable default for this dashboard. 
                      The specific role is visible in the profile page. */}
                  <span className="text-xs text-slate-500">Espace Membre</span>
                </div>
                <div className="relative h-9 w-9">
                  {user.picture ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.picture}
                      alt={user.name || "User"}
                      className="rounded-full object-cover border border-slate-200"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                      <User className="w-5 h-5" />
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200">
          <div className="pt-2 pb-3 space-y-1 px-4">
            <div className="flex items-center space-x-3 py-3 border-b border-slate-100 mb-2">
              <div className="relative w-10 h-10 flex-shrink-0">
                {user?.picture ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.picture} alt="" className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200">
                    <span className="text-xs font-bold">{user?.name?.charAt(0) || "U"}</span>
                  </div>
                )}
              </div>
              <div>
                <div className="font-medium text-slate-900">{user?.name}</div>
                <div className="text-xs text-slate-500">{user?.email}</div>
              </div>
            </div>
            <Link
              href="/dashboard/profile"
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50"
            >
              <User className="inline-block w-4 h-4 mr-2" /> Mon profil
            </Link>
            <Link
              href="/api/auth/logout"
              className="block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="inline-block w-4 h-4 mr-2" /> Déconnexion
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
