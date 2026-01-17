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
  Car,
  Globe,
  Facebook,
  Instagram,
  Linkedin,
  Ghost,
  Video
} from "lucide-react";

interface SidebarProps {
  role?: string;
  roles?: string[];
  socialLinks?: Record<string, string>;
}

export function StudentSidebar({ role = "STUDENT", roles, socialLinks = {} }: SidebarProps) {
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

      {/* Social Links Mini-Section */}
      <div className="px-4 py-3 border-t border-slate-800">
        <div className="flex items-center justify-around gap-2">
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
