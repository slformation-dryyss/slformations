"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";

interface MobileNavbarProps {
  onToggleSidebar: () => void;
  isOpen: boolean;
}

export function MobileNavbar({ onToggleSidebar, isOpen }: MobileNavbarProps) {
  return (
    <div className="md:hidden flex items-center justify-between px-6 h-16 bg-navy-900 border-b border-white/10 sticky top-0 z-50">
      <Link href="/dashboard" className="flex items-center gap-2">
        <span className="text-xl font-bold text-white tracking-wider">
          SL <span className="text-gold-500">FORMATION</span>
        </span>
      </Link>

      <button
        onClick={onToggleSidebar}
        className="p-2 text-slate-300 hover:text-white transition-colors"
        aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>
    </div>
  );
}
