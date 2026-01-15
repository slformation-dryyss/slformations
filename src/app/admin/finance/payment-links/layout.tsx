"use client";

import { DollarSign, History, PlusCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function PaymentLinksLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const tabs = [
        {
            name: "Générateur",
            href: "/admin/finance/payment-links/generator",
            icon: PlusCircle,
            active: pathname.includes("/generator") || pathname === "/admin/finance/payment-links"
        },
        {
            name: "Historique",
            href: "/admin/finance/payment-links/history",
            icon: History,
            active: pathname.includes("/history")
        }
    ];

    return (
        <div className="max-w-5xl mx-auto pb-10">
            <h1 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <DollarSign className="w-8 h-8 text-gold-500" />
                Gestion des Paiements
            </h1>

            <div className="flex border-b border-slate-200 mb-6">
                {tabs.map((tab) => (
                    <Link
                        key={tab.name}
                        href={tab.href}
                        className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${tab.active
                                ? "border-gold-500 text-gold-600"
                                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.name}
                    </Link>
                ))}
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                {children}
            </div>
        </div>
    );
}
