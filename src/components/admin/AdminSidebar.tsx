
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Settings,
  Euro,
  LogOut,
  Calendar,
  FileText,
  Car
} from "lucide-react";

interface AdminSidebarProps {
  role: string;
}

export function AdminSidebar({ role, isOpen, onClose }: { role: string; isOpen?: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  const isOwner = role === "OWNER";

  const adminLinks = [
    { href: "/admin", label: "Vue d'ensemble", icon: LayoutDashboard },
    { href: "/admin/users", label: "Participants", icon: Users },
    { href: "/admin/courses", label: "Formations (CMS)", icon: BookOpen },
    { href: "/admin/documents", label: "Dossiers Élèves", icon: FileText },
    { href: "/admin/sessions", label: "Sessions", icon: Calendar },
    { href: "/admin/driving-lessons", label: "Gestion Conduite", icon: Car },
  ];

  if (isOwner) {
    adminLinks.push({ label: "Finance (Générateur)", href: "/admin/finance/payment-links", icon: Euro });
    adminLinks.push({ label: "Paramètres", href: "/admin/settings", icon: Settings });
  }

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={`flex flex-col w-64 bg-slate-900 border-r border-slate-800 min-h-screen fixed top-0 left-0 h-full z-50 transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
      >
        <div className="flex items-center justify-between px-6 h-16 border-b border-slate-800">
          <span className="text-xl font-bold text-white tracking-wider">
            SL <span className="text-gold-500">ADMIN</span>
          </span>
          {/* Mobile Close Button */}
          <button onClick={onClose} className="md:hidden text-slate-400 hover:text-white">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 flex flex-col overflow-y-auto pt-5 pb-4">
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {adminLinks.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={onClose} // Close sidebar on navigation on mobile
                  className={`group flex items-center px-2 py-3 text-sm font-medium rounded-md transition-colors ${isActive
                      ? "bg-gold-500 text-slate-900"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`}
                >
                  <item.icon
                    className={`mr-3 flex-shrink-0 h-5 w-5 ${isActive ? "text-slate-900" : "text-slate-400 group-hover:text-gold-400"
                      }`}
                    aria-hidden="true"
                  />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex-shrink-0 flex border-t border-slate-800 p-4">
          <a href="/api/auth/logout" className="flex-shrink-0 w-full group block">
            <div className="flex items-center">
              <LogOut className="text-slate-400 group-hover:text-red-400 w-5 h-5 mr-3" />
              <div className="ml-3">
                <p className="text-sm font-medium text-white group-hover:text-red-400">
                  Déconnexion
                </p>
              </div>
            </div>
          </a>
        </div>
      </div>
    </>
  );
}

