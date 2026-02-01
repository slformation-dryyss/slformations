"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, FileDown, RefreshCcw, Loader2, Copy } from "lucide-react";
import { syncPaymentLinkStatusAction } from "../actions";
import { ManualPaymentModal } from "./ManualPaymentModal";

interface PaymentLink {
    id: string;
    createdAt: Date;
    amount: number;
    status: string;
    stripeUrl: string;
    user: { email: string; firstName: string | null; lastName: string | null; phone: string | null };
    course: { title: string };
}

interface HistoryTableProps {
    links: PaymentLink[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
    users: { id: string; email: string; firstName: string | null; lastName: string | null }[];
    courses: { id: string; title: string }[];
}

export default function HistoryTable({ links, totalCount, currentPage, totalPages, users, courses }: HistoryTableProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
    const [syncingId, setSyncingId] = useState<string | null>(null);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());
            if (searchQuery) {
                params.set("search", searchQuery);
            } else {
                params.delete("search");
            }
            params.set("page", "1"); // Reset to page 1 on search
            router.push(`${pathname}?${params.toString()}`);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery, pathname, router, searchParams]);

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", newPage.toString());
        router.push(`${pathname}?${params.toString()}`);
    };

    const handleSyncStatus = async (linkId: string) => {
        setSyncingId(linkId);
        const formData = new FormData();
        formData.append("linkId", linkId);

        const result = await syncPaymentLinkStatusAction(formData) as any;
        if (result.error) {
            alert(result.error);
        } else if (result.updated) {
            alert("Paiement confirmé par Stripe ! Le statut a été mis à jour.");
            router.refresh();
        } else if (result.alreadyPaid) {
            alert("Ce lien est déjà marqué comme payé.");
        } else {
            alert(`Stripe indique que le paiement est : ${result.currentStatus || "en attente"}`);
        }
        setSyncingId(null);
    };

    const handleExportCSV = () => {
        // Here we could either export the current page or all links. 
        // For simplicity, let's export the current view.
        if (links.length === 0) return;

        const headers = ["Date", "Élève", "Email", "Téléphone", "Formation", "Montant", "Statut", "URL Stripe"];
        const rows = links.map(link => [
            new Date(link.createdAt).toLocaleDateString('fr-FR'),
            `${link.user?.firstName || ""} ${link.user?.lastName || ""}`.trim(),
            link.user?.email || "",
            link.user?.phone || "",
            link.course?.title || "",
            link.amount.toFixed(2),
            link.status === "PAID" ? "Payé" : "En attente",
            link.stripeUrl
        ]);

        const csvContent = [headers, ...rows]
            .map(e => e.map(cell => `"${(cell || "").toString().replace(/"/g, '""')}"`).join(";"))
            .join("\n");

        const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `historique_paiements_page_${currentPage}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h3 className="text-lg font-bold text-slate-900">Historique des liens</h3>
                    <p className="text-sm text-slate-500">{totalCount} liens trouvés au total</p>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={handleExportCSV}
                        title="Exporter la page actuelle en CSV"
                        className="p-2 text-slate-500 hover:text-slate-900 rounded-md border border-slate-200 hover:border-slate-300 transition-colors"
                    >
                        <FileDown className="w-4 h-4" />
                    </button>
                    <ManualPaymentModal users={users} courses={courses} />
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Rechercher (Nom, Email...)"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 border-slate-300 rounded-md shadow-sm focus:border-gold-500 focus:ring-gold-500 text-sm py-2"
                        />
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto border border-slate-100 rounded-lg">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                            <th className="py-3 px-4">Date</th>
                            <th className="py-3 px-4">Élève</th>
                            <th className="py-3 px-4">Formation</th>
                            <th className="py-3 px-4">Montant</th>
                            <th className="py-3 px-4">Statut</th>
                            <th className="py-3 px-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {links.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="py-12 text-center text-slate-400 text-sm italic">
                                    Aucun lien trouvé.
                                </td>
                            </tr>
                        ) : (
                            links.map((link) => (
                                <tr key={link.id} className="hover:bg-slate-50 transition-colors text-sm">
                                    <td className="py-3 px-4 text-slate-500">
                                        {new Date(link.createdAt).toLocaleDateString('fr-FR')}
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="font-medium text-slate-900">
                                            {link.user?.firstName} {link.user?.lastName}
                                        </div>
                                        <div className="text-xs text-slate-400">{link.user?.email}</div>
                                    </td>
                                    <td className="py-3 px-4 text-slate-600">
                                        {link.course?.title}
                                    </td>
                                    <td className="py-3 px-4 font-bold text-slate-900">
                                        {link.amount.toFixed(2)} €
                                    </td>
                                    <td className="py-3 px-4">
                                        {link.status === "PAID" ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Payé
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                En attente
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {link.status !== "PAID" && (
                                                <button
                                                    onClick={() => handleSyncStatus(link.id)}
                                                    disabled={syncingId === link.id}
                                                    className="p-1.5 text-blue-600 hover:text-blue-700 rounded border border-transparent hover:border-blue-100 transition-all flex items-center gap-1 text-xs font-bold"
                                                >
                                                    {syncingId === link.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCcw className="w-4 h-4" />}
                                                    Vérifier
                                                </button>
                                            )}
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(link.stripeUrl);
                                                    alert("Lien Stripe copié !");
                                                }}
                                                className="p-1.5 text-slate-400 hover:text-slate-600"
                                            >
                                                <Copy className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {
                totalPages > 1 && (
                    <div className="flex items-center justify-between pt-4">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Précédent
                        </button>
                        <span className="text-sm text-slate-600">
                            Page {currentPage} sur {totalPages}
                        </span>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Suivant
                        </button>
                    </div>
                )
            }
        </div>
    );
}
