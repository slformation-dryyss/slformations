"use client";

import { FileDown } from "lucide-react";

interface Order {
    id: string;
    createdAt: Date | string;
    amount: number;
    currency: string;
    status: string;
    user: { email: string } | null;
    items: any[];
}

export default function ExportOrdersButton({ orders }: { orders: any[] }) {
    const handleExport = () => {
        if (!orders || orders.length === 0) return;

        // Header
        const headers = ["ID Commande", "Date", "Client", "Montant", "Devise", "Statut", "Articles"];
        
        // Rows
        const rows = orders.map(order => [
            order.id,
            new Date(order.createdAt).toLocaleDateString('fr-FR'),
            order.user?.email || "Inconnu",
            order.amount.toFixed(2),
            order.currency.toUpperCase(),
            order.status === "PAID" ? "Payé" : order.status,
            order.items?.length || 0
        ]);

        // Build CSV string
        const csvContent = [headers, ...rows]
            .map(e => e.map(cell => `"${(cell || "").toString().replace(/"/g, '""')}"`).join(";"))
            .join("\n");

        // BOM for Excel UTF-8
        const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `comptabilite_transactions_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <button 
            onClick={handleExport}
            title="Exporter en Excel (CSV)"
            className="p-2 text-slate-500 hover:text-slate-900 rounded-md border border-slate-200 hover:border-slate-300 transition-colors flex items-center gap-2 text-sm font-medium"
        >
            <FileDown className="w-4 h-4" />
            Exporter
        </button>
    );
}

