
'use client';

import { Filter, Check } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SidebarFilter() {
  const pathname = usePathname();

  const filters = [
    { name: 'Toutes les formations', href: '/formations/catalogue' },
    { name: 'Permis Auto (B)', href: '/formations/permis-b' },
    { name: 'Permis Moto (A2)', href: '/formations/permis-moto' },
    { name: 'Transport (VTC, Taxi)', href: '/formations/vtc' },
    { name: 'Sécurité (SSIAP, Incendie)', href: '/formations/incendie' },
    { name: 'Manutention (CACES)', href: '/formations/caces' },
    { name: 'Secourisme (SST)', href: '/formations/secourisme' },
    { name: 'Habilitation Électrique', href: '/formations/habilitation-electrique' },
    { name: 'Récupération de Points', href: '/formations/recuperation-points' },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 sticky top-24">
      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
        <Filter className="w-5 h-5 text-gold-500 mr-2" />
        Filtrer par domaine
      </h3>
      
      <nav className="space-y-2">
        {filters.map((filter) => {
           const isActive = pathname === filter.href;
           return (
            <Link
                key={filter.href}
                href={filter.href}
                className={`flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition ${
                    isActive 
                    ? 'bg-slate-900 text-white shadow-md' 
                    : 'bg-slate-50 text-slate-600 hover:bg-white hover:shadow-sm hover:text-gold-600'
                }`}
            >
                <span>{filter.name}</span>
                {isActive && <Check className="w-4 h-4 text-gold-400" />}
            </Link>
           );
        })}
      </nav>

      <div className="mt-8 p-4 bg-gold-50 rounded-xl border border-gold-100">
        <h4 className="font-bold text-gold-800 mb-2 text-sm">Besoin d'aide ?</h4>
        <p className="text-xs text-gold-700 mb-3">
            Nos conseillers sont disponibles pour vous orienter vers la formation adaptée à votre profil.
        </p>
        <Link href="/contact" className="text-xs font-bold text-gold-600 hover:text-gold-800 flex items-center">
            Contacter un conseiller &rarr;
        </Link>
      </div>
    </div>
  );
}

