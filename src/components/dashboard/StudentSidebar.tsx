"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  GraduationCap,
  CalendarDays,
  CreditCard,
  User,
  Settings,
  LogOut,
  FileText,
  Car,
  Globe,
  Facebook,
  Instagram,
  Linkedin,
  Ghost,
  Video,
  X
} from "lucide-react";

interface SidebarProps {
  role?: string;
  roles?: string[];
  socialLinks?: Record<string, string>;
  isOpen?: boolean;
  onClose?: () => void;
}

export function StudentSidebar({ role = "STUDENT", roles, socialLinks = {}, isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();

  // Consolidation des rôles
  const userRoles = roles || [role];

  const isOwner = userRoles.includes("OWNER");
  const isAdmin = userRoles.includes("ADMIN") || isOwner;

  // INSTRUCTOR = Moniteur de conduite (gère uniquement la conduite)
  const isInstructor = userRoles.includes("INSTRUCTOR") || isAdmin;

  // TEACHER = Formateur professionnel (VTC, CACES...)
  const isTeacher = userRoles.includes("TEACHER") || isAdmin;

  const isStudent = userRoles.includes("STUDENT");

  // SECTION ÉLÈVE (Toujours visible si on est élève ou si on n'a pas d'autre rôle)
  // Si on est Admin/Instructor/Teacher, on voit quand même l'accès élève ? Souvent oui pour tester.
  // Mais pour alléger, on peut masquer si on est admin.
  // Ici on laisse visible pour tous sauf si on veut explicitement séparer.
  const showStudentSection = true;

  const navigation = [
    { name: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard },
  ];

  if (isStudent && showStudentSection) {
    navigation.push(
      { name: "Mes formations", href: "/dashboard/mes-formations", icon: GraduationCap },
      { name: "Conduite / Auto-école", href: "/dashboard/driving-lessons", icon: Car },
      { name: "Mon planning", href: "/dashboard/planning", icon: CalendarDays },
      { name: "Mes documents", href: "/dashboard/documents", icon: FileText },
      { name: "Mes paiements", href: "/dashboard/paiement", icon: CreditCard },
    );
  }

  // SECTION INSTRUCTEUR (Conduite)
  if (isInstructor) {
    // On pourrait ajouter un séparateur ou un header de section ici visuellement
    // Mais pour l'instant on ajoute à la liste
    navigation.push(
      { name: "Dispos Conduite", href: "/dashboard/instructor/availability", icon: CalendarDays },
      { name: "Cours Conduite", href: "/dashboard/instructor/lessons", icon: Car },
      { name: "Mes Élèves (Conduite)", href: "/dashboard/instructor/students", icon: User },
    );
  }

  // SECTION TEACHER (Formation Pro)
  if (isTeacher) {
    navigation.push(
      { name: "Mes Cours (Pro)", href: "/dashboard/teacher/courses", icon: GraduationCap },
      { name: "Sessions (Pro)", href: "/dashboard/teacher/sessions", icon: CalendarDays },
      { name: "Stagiaires (Pro)", href: "/dashboard/teacher/students", icon: User },
    );
  }

  // Toujours ajouter le profil à la fin
  navigation.push({ name: "Mon Profil", href: "/dashboard/profile", icon: Settings });

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
        className={`flex flex-col w-64 bg-slate-900 border-r border-white/5 min-h-screen fixed top-0 left-0 h-full z-50 transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
      >
        <div className="flex items-center justify-between px-6 h-16 border-b border-white/5">
          <span className="text-xl font-bold text-white tracking-wider">
            SL <span className="text-gold-500">FORMATION</span>
          </span>
          <button
            onClick={onClose}
            className="md:hidden p-1 text-slate-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 flex flex-col overflow-y-auto pt-5 pb-4">
          <nav className="mt-5 flex-1 px-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={`group flex items-center px-3 py-3 text-sm font-semibold rounded-xl transition-all ${isActive
                    ? "bg-gold-500 text-navy-900 shadow-lg shadow-gold-500/20"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }`}
                >
                  <item.icon
                    className={`mr-3 flex-shrink-0 h-5 w-5 ${isActive ? "text-navy-900" : "text-slate-500 group-hover:text-gold-500"
                      }`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Social Links Mini-Section */}
        <div className="px-6 py-4 border-t border-white/5">
          <div className="flex items-center gap-4">
            {Object.entries(socialLinks).map(([key, url]) => {
              if (!url) return null;
              let Icon = Globe;
              if (key.includes("FACEBOOK")) Icon = Facebook;
              if (key.includes("INSTAGRAM")) Icon = Instagram;
              if (key.includes("LINKEDIN")) Icon = Linkedin;
              if (key.includes("SNAPCHAT")) Icon = Ghost;
              if (key.includes("TIKTOK")) Icon = Video;

              return (
                <a key={key} href={url} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-gold-500 transition-colors" title={key.replace("SOCIAL_", "")}>
                  <Icon className="w-4 h-4" />
                </a>
              );
            })}
          </div>
        </div>

        <div className="flex-shrink-0 flex border-t border-white/5 p-4">
          <a
            href="/api/auth/logout"
            className="flex-shrink-0 w-full group px-2 py-3 rounded-xl hover:bg-red-500/10 transition-colors"
          >
            <div className="flex items-center text-red-500 hover:text-red-400">
              <LogOut className="inline-block w-5 h-5 mr-3" />
              <span className="text-sm font-bold">Déconnexion</span>
            </div>
          </a>
        </div>
      </div>
    </>
  );
}
