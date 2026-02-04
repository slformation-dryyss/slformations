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
  ArrowRight,
  CalendarDays,
  GraduationCap,
  CreditCard as CreditCardIcon,
  LayoutDashboard,
  FileText,
  AlertTriangle,
} from "lucide-react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useState, useEffect } from "react";

interface UserProfile {
  role: string;
  isProfileComplete: boolean;
}

interface Course {
  id: string;
  title: string;
  slug: string;
  type: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  courses: Course[];
}

export function Header() {
  const { user, isLoading: isAuthLoading } = useUser();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isStudentMenuOpen, setIsStudentMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(false);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState<string | null>(null);

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  useEffect(() => {
    if (user) {
      setIsProfileLoading(true);
      fetch("/api/profile")
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          setProfile(data);
          setIsProfileLoading(false);
        })
        .catch((err) => {
          setIsProfileLoading(false);
        });
    } else {
      setProfile(null);
    }
  }, [user]);

  useEffect(() => {
    setIsCategoriesLoading(true);
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
        setIsCategoriesLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch categories:", err);
        setIsCategoriesLoading(false);
      });
  }, []);

  const isLoading = isAuthLoading || isProfileLoading;
  // Fallback to session role (set by afterCallback) to ensure instant Admin access
  const userRole = profile?.role || (user as any)?.role || "STUDENT";
  const isInstructor = userRole === "INSTRUCTOR";
  const isAdmin = userRole === "ADMIN" || userRole === "OWNER";

  return (
    <header id="header" className="fixed w-full top-0 z-50 glass-effect">
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <div className="relative h-10 w-40 md:w-48">
              <Image
                src="/logo.svg"
                alt="SL Formations"
                fill
                className="object-contain drop-shadow-md"
                priority
              />
            </div>
          </Link>

          <nav className="hidden lg:flex items-center space-x-4">
            {/* Link 'Accueil' removed to save space */}
            <Link
              href="/nos-plannings"
              className="text-slate-600 hover:text-gold-500 transition font-medium text-sm"
            >
              Plannings
            </Link>

            {/* Dropdown Nos Permis */}
            <div
              className="relative group"
              onMouseEnter={() => setActiveDropdown("permis")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                className={`flex items-center space-x-1 transition focus:outline-none text-sm ${activeDropdown === "permis" ? "text-gold-500" : "text-slate-600 group-hover:text-gold-500"}`}
                onClick={() => toggleDropdown("permis")}
              >
                <span>Nos Permis</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${activeDropdown === "permis" ? "rotate-180" : "group-hover:rotate-180"}`} />
              </button>

              <div className={`absolute top-full left-0 w-64 pt-2 transition-all duration-200 transform ${activeDropdown === "permis"
                ? "opacity-100 visible translate-y-0"
                : "opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0"
                }`}>
                <div className="bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden py-2">
                  <Link
                    href="/formations/permis-b"
                    className="flex items-center space-x-3 px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-gold-600 transition"
                  >
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span>Permis B (Auto)</span>
                  </Link>
                  <Link
                    href="/formations/permis-moto"
                    className="flex items-center space-x-3 px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-gold-600 transition"
                  >
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span>Permis Moto A2</span>
                  </Link>
                  <Link
                    href="/formations/permis-accelere"
                    className="flex items-center space-x-3 px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-gold-600 transition"
                  >
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span>Permis en Accéléré</span>
                  </Link>

                  <Link
                    href="/formations/permis-aac"
                    className="flex items-center space-x-3 px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-gold-600 transition"
                  >
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span>Conduite Accompagnée (AAC)</span>
                  </Link>
                  <div className="my-2 border-t border-slate-100"></div>
                  <Link
                    href="/formations/recuperation-points"
                    className="flex items-center space-x-3 px-4 py-2 hover:bg-slate-50 text-red-600 font-medium hover:text-red-700 transition"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span>Récupération de Points</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Dropdown Formations Professionnelles */}
            <div
              className="relative group"
              onMouseEnter={() => setActiveDropdown("pro")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                className={`flex items-center space-x-1 transition focus:outline-none text-sm group ${activeDropdown === "pro" ? "text-gold-500" : "text-slate-600 group-hover:text-gold-500"}`}
                onClick={() => toggleDropdown("pro")}
              >
                <span className="font-medium">Nos Formations Professionnelles</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${activeDropdown === "pro" ? "rotate-180" : "group-hover:rotate-180"}`} />
              </button>

              <div className={`absolute top-full left-0 w-80 pt-2 transition-all duration-200 transform ${activeDropdown === "pro"
                  ? "opacity-100 visible translate-y-0"
                  : "opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0"
                }`}>
                <div className="bg-white rounded-xl shadow-2xl border border-slate-100 overflow-visible py-3">
                  <Link
                    href="/formations/catalogue"
                    className="flex items-center justify-between px-5 py-2.5 hover:bg-gold-50 text-slate-900 font-bold border-b border-slate-50 transition group/item"
                  >
                    <span>Tout le catalogue</span>
                    <ArrowRight className="w-3.5 h-3.5 text-gold-500 opacity-0 group-hover/item:opacity-100 transition-all -translate-x-2 group-hover/item:translate-x-0" />
                  </Link>

                  <div className="space-y-1 mt-2">
                    {isCategoriesLoading ? (
                      <div className="px-5 py-4 flex items-center justify-center">
                        <Loader2 className="w-5 h-5 animate-spin text-gold-500" />
                      </div>
                    ) : (
                      categories.map((category) => {
                          const categoryUrlMap: Record<string, string> = {
                              'permis-b': '/formations/permis-b',
                              'permis-moto': '/formations/permis-moto',
                              'formations-video': '/formations/catalogue?category=formations-video',
                              // Add other mappings if needed, or rely on slug matching conventions
                              // For now, these are the ones with dedicated Landing Pages
                          }; 
                          
                          // Also check by name/slug conventions if needed
                          let targetUrl = categoryUrlMap[category.slug];
                          
                          // Transport logic: if slug is 'transport', maybe link to /formations/vtc? 
                          // Or keep as catalogue filter.
                          if (category.slug === 'transport') targetUrl = '/formations/vtc'; // Approximate mapping based on Sidebar
                          if (category.slug === 'securite') targetUrl = '/formations/incendie';
                          
                          return (
                        <div key={category.id} className="relative group/sub">
                          {category.courses.length > 0 ? (
                            <>
                              <div className="flex items-center justify-between px-5 py-2 hover:bg-slate-50 text-slate-700 hover:text-gold-600 cursor-pointer transition">
                                {targetUrl ? (
                                    <Link href={targetUrl} className="flex-1 text-sm font-semibold hover:text-gold-600">
                                        {category.name}
                                    </Link>
                                ) : (
                                    <span className="text-sm font-semibold flex-1">{category.name}</span>
                                )}
                                <ChevronDown className="w-3.5 h-3.5 -rotate-90" />
                              </div>
                              <div className="absolute left-full top-0 w-72 ml-0 opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible group-hover/sub:translate-x-0 translate-x-2 transition-all duration-200">
                                <div className="bg-white rounded-xl shadow-xl border border-slate-100 py-2 ml-1 max-h-[80vh] overflow-y-auto">
                                  {category.courses.map((course) => (
                                    <Link
                                      key={course.id}
                                      href={`/formations/${course.slug}`}
                                      className="block px-4 py-2 text-sm text-slate-600 hover:text-gold-600 hover:bg-slate-50 transition"
                                    >
                                      {course.title}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            </>
                          ) : (
                            <Link
                              href={targetUrl || `/formations/catalogue?category=${category.slug}`}
                              className="flex items-center space-x-3 px-5 py-2 hover:bg-slate-50 text-slate-700 hover:text-gold-600 transition"
                            >
                              <span className="text-sm font-semibold">{category.name}</span>
                            </Link>
                          )}
                        </div>
                      )})
                    )}
                  </div>
                </div>
              </div>
            </div>
          </nav>

          <div className="flex items-center space-x-3">
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin text-gold-500" />
            ) : user ? (
              <div className="flex items-center space-x-4 relative">
                <Link
                  href="/profile"
                  className="flex items-center space-x-2 text-slate-900 hover:text-gold-500 transition"
                >
                  {user.picture ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <div className="relative w-8 h-8">
                      <img
                        src={user.picture}
                        alt={user.name || "User"}
                        className="w-8 h-8 rounded-full border border-gold-500 object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500">
                      <span className="text-[10px] font-bold">{user?.name?.charAt(0) || <User className="w-4 h-4" />}</span>
                    </div>
                  )}
                  <span className="hidden xl:block text-sm font-medium">
                    {user?.name}
                  </span>
                </Link>
                <a
                  href="/api/auth/logout"
                  className="p-2 text-slate-500 hover:text-slate-900 transition"
                  title="Se déconnecter"
                >
                  <LogOut className="w-5 h-5" />
                </a>

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
                {/* Dropdown Menu Desktop */}
                <div
                  className={`absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden transition-all duration-200 transform origin-top-right ${isStudentMenuOpen
                    ? "opacity-100 visible scale-100"
                    : "opacity-0 invisible scale-95"
                    }`}
                >
                  <div className="py-2">
                    <div className="px-4 py-2 border-b border-slate-50 mb-1">
                      <p className="text-sm font-bold text-slate-900 truncate">{user?.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                    </div>

                    <Link
                      href={isAdmin ? "/admin" : "/dashboard"}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-gold-600 transition"
                      onClick={() => setIsStudentMenuOpen(false)}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>{isAdmin ? "Administration" : "Tableau de bord"}</span>
                    </Link>

                    <Link
                      href="/profile"
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-gold-600 transition"
                      onClick={() => setIsStudentMenuOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      <span>Mon Profil</span>
                    </Link>

                    {isAdmin && (
                      <Link
                        href="/admin/finance"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-gold-600 transition"
                        onClick={() => setIsStudentMenuOpen(false)}
                      >
                        <CreditCardIcon className="w-4 h-4" />
                        <span>Finances</span>
                      </Link>
                    )}

                    <div className="border-t border-slate-50 my-1"></div>

                    <a
                      href="/api/auth/logout"
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                      onClick={() => setIsStudentMenuOpen(false)}
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Se déconnecter</span>
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <Link
                  href="/contact?subject=recrutement"
                  className="hidden lg:block px-3 py-1.5 text-slate-600 hover:text-gold-500 transition font-medium text-xs border-r border-slate-200 pr-3 mr-2"
                >
                  Vous êtes formateur ?
                </Link>
                {/* Desktop : lien texte Demande d'accès à gauche */}
                <Link
                  href="/demande-acces"
                  className="hidden xl:block px-3 py-1.5 text-slate-900 hover:text-gold-500 transition font-medium text-xs"
                >
                  Demande d&apos;accès
                </Link>
                {/* CTA principal : Accéder à mon espace (redirige vers le login) */}
                <a
                  href="/api/auth/login?returnTo=/dashboard"
                  className="hidden lg:block px-4 py-2 bg-gradient-to-r from-gold-500 to-gold-600 text-slate-900 rounded-lg font-semibold text-xs hover:shadow-lg hover:shadow-gold-500/50 transition"
                >
                  Accéder à mon espace
                </a>
              </>
            )}
            <button
              className="lg:hidden text-slate-900"
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
        <div className="lg:hidden bg-white/95 border-t border-slate-200 backdrop-blur px-6 pb-4 pt-2 h-[calc(100vh-80px)] overflow-y-auto">
          <nav className="flex flex-col space-y-3 pt-2 text-sm">
            <Link
              href="/"
              className="py-2 text-slate-900 hover:text-gold-500 transition"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Accueil
            </Link>

            <Link
              href="/nos-plannings"
              className="py-2 text-slate-600 hover:text-gold-500 transition"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Plannings
            </Link>

            {/* Mobile Dropdowns */}
            <div className="py-2 space-y-1">
              <span className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Nos Permis</span>
              <Link
                href="/formations/permis-b"
                className="block py-2 px-3 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-gold-500 transition ml-2 border-l border-slate-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Permis B (Auto)
              </Link>
              <Link
                href="/formations/permis-moto"
                className="block py-2 px-3 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-gold-500 transition ml-2 border-l border-slate-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Permis Moto A2
              </Link>
              <Link
                href="/formations/recuperation-points"
                className="block py-2 px-3 rounded-lg text-red-600 font-medium hover:bg-red-50 hover:text-red-700 transition ml-2 border-l border-red-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Récupération de Points
              </Link>
            </div>

            <div className="py-2 space-y-1">
              <span className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Nos Formations Professionnelles</span>
              <Link
                href="/formations/catalogue"
                className="block py-2 px-3 rounded-lg text-slate-900 font-bold bg-slate-50 transition ml-2 border-l-2 border-gold-500"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Tout le catalogue
              </Link>
              
              <div className="ml-4 border-l border-slate-100 mt-2 space-y-2">
                {isCategoriesLoading ? (
                  <div className="px-3 py-2">
                    <Loader2 className="w-4 h-4 animate-spin text-gold-500" />
                  </div>
                ) : (
                  categories.map((category) => (
                    <div key={category.id} className="border-b border-slate-50 last:border-0/0">
                      <button
                        onClick={() =>
                          setExpandedMobileCategory(
                            expandedMobileCategory === category.id ? null : category.id
                          )
                        }
                        className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-slate-700 hover:text-gold-600 hover:bg-slate-50 transition rounded-lg"
                      >
                        <span>{category.name}</span>
                        <ChevronDown 
                          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                            expandedMobileCategory === category.id ? "rotate-180 text-gold-500" : ""
                          }`} 
                        />
                      </button>
                      
                      <div 
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          expandedMobileCategory === category.id ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="pl-4 pr-2 pb-2 space-y-1">
                          {category.courses.map((course) => (
                            <Link
                              key={course.id}
                              href={`/formations/${course.slug}`}
                              className="block py-1.5 px-3 text-sm text-slate-500 hover:text-gold-500 hover:bg-slate-50 rounded-md transition"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {course.title}
                            </Link>
                          ))}
                          {category.courses.length === 0 && (
                            <Link
                              href={`/formations/catalogue?category=${category.slug}`}
                              className="block py-1.5 px-3 text-sm text-slate-500 hover:text-gold-500 hover:bg-slate-50 rounded-md transition italic"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              Voir les formations
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="py-2 border-t border-slate-100 my-2"></div>

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
                {isAdmin ? "Espace Admin" : isInstructor ? "Espace Formateur" : "Espace élève"}
              </p>

              {/* Mobile User Menu Items (Dashboard etc) */}
              <div className="flex flex-col space-y-2">
                {/* ... existing mobile user items ... */}
                <Link
                  href={isAdmin ? "/admin" : "/dashboard"}
                  className="flex items-center space-x-2 py-1 text-slate-600 hover:text-gold-500 transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Tableau de bord</span>
                </Link>
                {/* ... other items are handled by existing logic but ensure Login is present if !user ... */}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 mt-2 pb-8">
              {isLoading ? (
                <div className="flex items-center space-x-2 text-slate-500 py-2">
                  <Loader2 className="w-4 h-4 animate-spin text-gold-500" />
                  <span>Chargement...</span>
                </div>
              ) : user ? (
                <div className="flex items-center justify-between py-2">
                  <Link
                    href="/profile"
                    className="flex items-center space-x-3 text-slate-900 hover:text-gold-500 transition"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {/* User Info with Picture Fallback */}
                    <div className="relative w-8 h-8 flex-shrink-0">
                      {user.picture ? (
                        <img src={user.picture} alt="" className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200">
                          <span className="text-[10px] font-bold">{user?.name?.charAt(0) || "U"}</span>
                        </div>
                      )}
                    </div>
                    <span className="text-sm font-medium truncate max-w-[140px]">
                      {user?.name}
                    </span>
                  </Link>
                  <a
                    href="/api/auth/logout"
                    className="p-2 text-slate-500 hover:text-slate-900 transition"
                    title="Se déconnecter"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <LogOut className="w-5 h-5" />
                  </a>
                </div>
              ) : (
                <div className="flex flex-col gap-3 pt-1">
                  <a
                    href="/api/auth/login?returnTo=/dashboard"
                    className="w-full px-4 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-gold-500 hover:text-white transition text-center shadow-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Se connecter / Espace élève
                  </a>
                  <div className="grid grid-cols-1 gap-3">
                    <Link
                      href="/demande-acces"
                      className="px-4 py-2 text-sm text-slate-900 border border-slate-200 rounded-lg hover:border-gold-500 hover:text-gold-500 transition text-center"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Demande d&apos;accès
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

