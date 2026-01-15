"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  GraduationCap,
  CalendarDays,
  CreditCard,
  MessageSquare,
  User,
  Settings,
  LogOut,
  HelpCircle,
  FileText,
  Car
} from "lucide-react";

interface SidebarProps {
  role?: string;
}

export function StudentSidebar({ role = "STUDENT" }: SidebarProps) {
  const pathname = usePathname();

  const isTeacher = role === "INSTRUCTOR" || role === "ADMIN" || role === "OWNER";

  const navigation = isTeacher ? [
    { name: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard },
    { name: "Dispos Conduite", href: "/instructor/availability", icon: CalendarDays },
    { name: "Cours Conduite", href: "/instructor/lessons", icon: GraduationCap },
    { name: "Mon Profil", href: "/dashboard/profile", icon: Settings },
  ] : [
    { name: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard },
    { name: "Mes formations", href: "/dashboard/mes-formations", icon: GraduationCap },
    { name: "Conduite / Auto-école", href: "/dashboard/driving-lessons", icon: Car },
    { name: "Mon planning", href: "/dashboard/planning", icon: CalendarDays },
    { name: "Mes documents", href: "/dashboard/documents", icon: FileText },
    { name: "Mes paiements", href: "/dashboard/paiement", icon: CreditCard },
    { name: "Mon profil", href: "/dashboard/profile", icon: User },
  ];

  return (
    <div className="flex flex-col w-64 bg-slate-900 border-r border-slate-800 min-h-screen fixed top-0 left-0 h-full z-40">
      <div className="flex items-center justify-center h-16 border-b border-slate-800">
        <span className="text-xl font-bold text-white tracking-wider">
          SL <span className="text-gold-500">FORMATION</span>
        </span>
      </div>
      <div className="flex-1 flex flex-col overflow-y-auto pt-5 pb-4">
        <nav className="mt-5 flex-1 px-2 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
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
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="flex-shrink-0 flex border-t border-slate-800 p-4">
        <Link
          href="/api/auth/logout"
          className="flex-shrink-0 w-full group block"
        >
          <div className="flex items-center">
            <div className="flex items-center text-red-400 group-hover:text-red-300">
              <LogOut className="inline-block w-5 h-5 mr-3" />
              <span className="text-sm font-medium">Déconnexion</span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

