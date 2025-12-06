import Link from "next/link";
import { GraduationCap, Menu } from "lucide-react";

export function Header() {
  return (
    <header id="header" className="fixed w-full top-0 z-50 glass-effect">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-gold-500 to-gold-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="text-navy-900 w-6 h-6" />
            </div>
            <span className="text-xl font-bold">
              DriveAcademy<span className="text-gold-500">Pro</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-white hover:text-gold-500 transition font-medium">
              Accueil
            </Link>
            <Link href="/formations" className="text-gray-300 hover:text-gold-500 transition">
              Formations
            </Link>
            <Link href="/location" className="text-gray-300 hover:text-gold-500 transition">
              Location
            </Link>
            <Link href="/#testimonials" className="text-gray-300 hover:text-gold-500 transition">
              Témoignages
            </Link>
            <Link href="/contact" className="text-gray-300 hover:text-gold-500 transition">
              Contact
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link
              href="/api/auth/login"
              className="hidden md:block px-5 py-2 text-white hover:text-gold-500 transition font-medium"
            >
              Connexion
            </Link>
            <Link
              href="/api/auth/signup"
              className="px-6 py-2.5 bg-gradient-to-r from-gold-500 to-gold-600 text-navy-900 rounded-lg font-semibold hover:shadow-lg hover:shadow-gold-500/50 transition"
            >
              S'inscrire
            </Link>
            <button className="md:hidden text-white">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
