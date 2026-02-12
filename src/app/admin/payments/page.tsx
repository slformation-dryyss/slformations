
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { 
    CreditCard, 
    Banknote, 
    ArrowDownToLine, 
    Plus, 
    Trash, 
    Search,
    Filter,
    FileSpreadsheet,
    Wallet
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { addManualPaymentAction, deletePaymentAction } from "./actions";
import { Pagination } from "@/components/admin/Pagination";
import Link from "next/link";

export default async function AdminPaymentsPage({
    searchParams
}: {
    searchParams: Promise<{ 
        method?: string; 
        query?: string; 
        page?: string;
        from?: string;
        to?: string;
    }>
}) {
    await requireAdmin();
    const params = await searchParams;
    const methodFilter = params.method;
    const query = params.query;
    const currentPage = parseInt(params.page || '1') || 1;
    const pageSize = 10;
    const { from, to } = params;

    const where: any = {
        AND: [
            methodFilter ? { provider: methodFilter } : {},
            query ? {
                OR: [
                    { order: { user: { name: { contains: query, mode: "insensitive" } } } },
                    { order: { user: { email: { contains: query, mode: "insensitive" } } } },
                ]
            } : {},
            (from || to) ? {
                createdAt: {
                    ...(from ? { gte: new Date(from) } : {}),
                    ...(to ? { lte: new Date(to) } : {})
                }
            } : {}
        ]
    };

    const [totalCount, payments] = await Promise.all([
        prisma.payment.count({ where }),
        prisma.payment.findMany({
            where,
            include: {
                order: {
                    include: {
                        user: true,
                        course: true
                    }
                }
            },
            orderBy: { createdAt: "desc" },
            skip: (currentPage - 1) * pageSize,
            take: pageSize
        })
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    const users = await prisma.user.findMany({
        orderBy: { name: "asc" },
        select: { id: true, name: true, email: true }
    });

    const courses = await prisma.course.findMany({
        where: { isPublished: true },
        orderBy: { title: "asc" },
        select: { id: true, title: true, price: true }
    });

    const totalAmountResult = await prisma.payment.aggregate({
        where: {
            ...where,
            status: "SUCCEEDED"
        },
        _sum: {
            amount: true
        }
    });
    const totalAmount = totalAmountResult._sum.amount || 0;

    return (
        <div className="space-y-8 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Gestion des <span className="text-gold-500">Paiements</span></h1>
                    <p className="text-slate-500 font-medium">Historique complet, export et saisie manuelle.</p>
                </div>
                <div className="flex gap-3">
                    <a 
                        href="/api/admin/payments/export" 
                        className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
                    >
                        <FileSpreadsheet className="w-4 h-4 text-green-600" />
                        Exporter CSV
                    </a>
                    <button 
                        className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-gold-500 hover:text-slate-900 transition-all shadow-lg shadow-slate-900/10"
                    >
                        <Plus className="w-4 h-4" />
                        Nouveau Paiement
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center gap-5">
                    <div className="w-14 h-14 bg-gold-50 rounded-2xl flex items-center justify-center">
                        <Wallet className="w-7 h-7 text-gold-600" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Total Encaissé (Filtré)</p>
                        <p className="text-2xl font-black text-slate-900">{totalAmount.toLocaleString('fr-FR')} €</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center gap-5">
                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center">
                        <CreditCard className="w-7 h-7 text-slate-400" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Paiements Stripe</p>
                        <p className="text-2xl font-black text-slate-900">{totalCount > 0 ? totalCount : 0}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center gap-5">
                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center">
                        <Banknote className="w-7 h-7 text-slate-400" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Paiements Manuels</p>
                        <p className="text-2xl font-black text-slate-900">{totalCount}</p>
                    </div>
                </div>
            </div>

            {/* Manual Payment Form (Simplified as a section for now) */}
            <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
                <details className="group">
                    <summary className="list-none cursor-pointer p-8 flex justify-between items-center hover:bg-slate-50 transition-all">
                        <div className="flex items-center gap-4">
                            <Plus className="w-6 h-6 text-gold-500" />
                            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Enregistrer un paiement manuel</h3>
                        </div>
                        <ArrowDownToLine className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" />
                    </summary>
                    <div className="p-8 pt-0 border-t border-slate-100">
                        <form action={addManualPaymentAction} className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="md:col-span-1">
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Choisir l'élève</label>
                                <select name="userId" required className="w-full bg-slate-50 border-0 rounded-2xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-gold-500">
                                    <option value="">Sélectionner...</option>
                                    {users.map(u => (
                                        <option key={u.id} value={u.id}>{u.name || u.email}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="md:col-span-1">
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Formation</label>
                                <select name="courseId" required className="w-full bg-slate-50 border-0 rounded-2xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-gold-500">
                                    <option value="">Sélectionner...</option>
                                    {courses.map(c => (
                                        <option key={c.id} value={c.id}>{c.title} ({c.price}€)</option>
                                    ))}
                                </select>
                            </div>
                            <div className="md:col-span-1">
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Mode de paiement</label>
                                <select name="method" required className="w-full bg-slate-50 border-0 rounded-2xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-gold-500">
                                    <option value="VIREMENT">Virement Bancaire</option>
                                    <option value="ESPECE">Espèces</option>
                                    <option value="CPF">Dossier CPF / Financeur</option>
                                </select>
                            </div>
                            <div className="md:col-span-1">
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Montant (€)</label>
                                <input name="amount" type="number" step="0.01" required placeholder="0.00" className="w-full bg-slate-50 border-0 rounded-2xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-gold-500" />
                            </div>
                            <div className="md:col-span-3">
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Note Admin / Référence</label>
                                <input name="adminNote" type="text" placeholder="Ex: Virement reçu le 22/12, Dossier CPF n°123..." className="w-full bg-slate-50 border-0 rounded-2xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-gold-500" />
                            </div>
                            <div className="flex items-end">
                                <button type="submit" className="w-full px-6 py-3 bg-gold-500 text-slate-900 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-gold-600 transition-all shadow-lg shadow-gold-500/20">
                                    Enregistrer
                                </button>
                            </div>
                        </form>
                    </div>
                </details>
            </div>

            {/* Payments List */}
            <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-100 flex flex-col lg:flex-row justify-between items-center gap-6">
                    <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter shrink-0">Historique des transactions</h2>
                    
                    <form className="flex flex-wrap lg:flex-nowrap gap-4 w-full justify-end">
                        <div className="relative flex-1 max-w-xs">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input 
                                type="text" 
                                name="query"
                                defaultValue={query}
                                placeholder="Nom ou email..." 
                                className="w-full bg-slate-50 border-transparent rounded-2xl pl-12 pr-4 py-3 text-sm font-bold focus:ring-2 focus:ring-gold-500 focus:bg-white transition-all outline-none"
                            />
                        </div>

                        <select 
                            name="method"
                            defaultValue={methodFilter}
                            className="bg-slate-50 border-transparent rounded-2xl px-6 py-3 text-sm font-bold focus:ring-2 focus:ring-gold-500 focus:bg-white transition-all outline-none cursor-pointer"
                        >
                            <option value="">Tous les modes</option>
                            <option value="STRIPE">Stripe</option>
                            <option value="VIREMENT">Virement</option>
                            <option value="ESPECE">Espèces</option>
                            <option value="CPF">CPF</option>
                        </select>

                        <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-2xl">
                            <input
                                type="date"
                                name="from"
                                defaultValue={from}
                                className="bg-transparent border-none text-sm font-bold outline-none cursor-pointer"
                                title="Depuis le"
                            />
                            <span className="text-slate-400 text-xs font-black">AU</span>
                            <input
                                type="date"
                                name="to"
                                defaultValue={to}
                                className="bg-transparent border-none text-sm font-bold outline-none cursor-pointer"
                                title="Jusqu'au"
                            />
                        </div>

                        <button 
                            type="submit"
                            className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-gold-500 hover:text-slate-900 transition-all shadow-lg shadow-slate-900/10 active:scale-95 whitespace-nowrap"
                        >
                            Filtrer
                        </button>
                    </form>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Date</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Élève</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Formation</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Mode</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Montant</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Statut</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {payments.map((p) => (
                                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-5 text-sm font-bold text-slate-500">
                                        {format(p.createdAt, "dd/MM/yyyy", { locale: fr })}
                                    </td>
                                    <td className="px-8 py-5">
                                        <p className="font-bold text-slate-900 text-sm">{p.order.user.name}</p>
                                        <p className="text-[10px] text-slate-400 font-medium">{p.order.user.email}</p>
                                    </td>
                                    <td className="px-8 py-5">
                                        <p className="font-bold text-slate-900 text-sm truncate max-w-[200px]">{p.order.course?.title || "Panier Multi"}</p>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2">
                                            {p.provider === "STRIPE" ? <CreditCard className="w-3 h-3 text-blue-500" /> : <Banknote className="w-3 h-3 text-gold-500" />}
                                            <span className="text-xs font-black text-slate-900 uppercase">{p.provider}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right font-black text-slate-900 italic">
                                        {p.amount.toLocaleString('fr-FR')} €
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter border ${
                                            p.status === "SUCCEEDED" 
                                            ? "bg-green-50 text-green-600 border-green-100" 
                                            : "bg-slate-100 text-slate-400 border-slate-200"
                                        }`}>
                                            {p.status === "SUCCEEDED" ? "Succès" : p.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <form action={deletePaymentAction} onSubmit={(e) => !confirm("Supprimer ce paiement ?") && e.preventDefault()}>
                                            <input type="hidden" name="paymentId" value={p.id} />
                                            <button type="submit" className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                                                <Trash className="w-4 h-4" />
                                            </button>
                                        </form>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="p-8 border-t border-slate-100 bg-slate-50/30">
                        <Pagination 
                            currentPage={currentPage}
                            totalPages={totalPages}
                            baseUrl="/admin/payments"
                            searchParams={{
                                method: methodFilter,
                                query,
                                from,
                                to
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

