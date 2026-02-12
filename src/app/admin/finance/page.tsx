
import { requireOwner } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Euro, TrendingUp, ShoppingBag, CreditCard } from "lucide-react";
import ExportOrdersButton from "@/components/admin/finance/ExportOrdersButton";
import { Pagination } from "@/components/admin/Pagination";

async function getFinanceStats(page: number = 1, pageSize: number = 10) {
  const skip = (page - 1) * pageSize;
  
  const [totalRevenueAgg, totalOrdersCount, recentOrders] = await Promise.all([
    prisma.order.aggregate({
      _sum: { amount: true },
      where: { status: "PAID" },
    }),
    prisma.order.count({
      where: { status: "PAID" },
    }),
    prisma.order.findMany({
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      include: { user: true, items: true },
      where: { status: "PAID" },
    })
  ]);

  const totalRevenue = totalRevenueAgg._sum.amount || 0;

  return { 
    totalRevenue, 
    recentOrders,
    totalOrdersCount,
    totalPages: Math.ceil(totalOrdersCount / pageSize)
  };
}

export default async function AdminFinancePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  // STRICTLY PROTECTED: ONLY OWNER CAN ACCESS
  await requireOwner();
  
  const currentPage = parseInt(params.page || '1') || 1;
  const pageSize = 10;
  const stats = await getFinanceStats(currentPage, pageSize);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-8">Tableau de bord Financier</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg border border-slate-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-gold-100 rounded-md p-3">
                <Euro className="h-6 w-6 text-gold-600" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-slate-500 truncate">Chiffre d&apos;Affaires Total</dt>
                  <dd>
                    <div className="text-2xl font-bold text-slate-900">{stats.totalRevenue.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg border border-slate-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                <TrendingUp className="h-6 w-6 text-green-600" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-slate-500 truncate">Croissance (Mois)</dt>
                  <dd>
                    <div className="text-2xl font-bold text-slate-900">+0%</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg border border-slate-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                <ShoppingBag className="h-6 w-6 text-blue-600" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-slate-500 truncate">Total Transactions</dt>
                  <dd>
                    <div className="text-2xl font-bold text-slate-900">{stats.totalOrdersCount}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions List */}
      <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">Dernières Transactions</h2>
          <ExportOrdersButton orders={stats.recentOrders} />
      </div>
      <div className="bg-white shadow overflow-hidden sm:rounded-md border border-slate-200">
        <ul role="list" className="divide-y divide-slate-200">
          {stats.recentOrders.length === 0 ? (
            <li className="px-6 py-12 text-center text-slate-500 flex flex-col items-center">
                <CreditCard className="w-12 h-12 text-slate-300 mb-2" />
                <p>Aucune transaction enregistrée pour le moment.</p>
                <p className="text-sm">Les paiements validés apparaîtront ici.</p>
            </li>
          ) : (
            stats.recentOrders.map((order) => (
              <li key={order.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition">
                  <div className="flex items-center gap-4">
                      <div className="bg-slate-100 p-2 rounded-full text-slate-500">
                          <ShoppingBag className="w-5 h-5" />
                      </div>
                      <div>
                          <p className="text-sm font-medium text-slate-900">
                              {order.items.length > 0 ? `Formation(s) x${order.items.length}` : "Commande simple"}
                          </p>
                          <p className="text-xs text-slate-500">
                              {order.user?.email || "Utilisateur inconnu"} • {format(new Date(order.createdAt), "dd MMM yyyy", { locale: fr })}
                          </p>
                      </div>
                  </div>
                  <div className="text-right">
                      <p className="text-sm font-bold text-slate-900">{order.amount.toFixed(2)} €</p>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Payé
                      </span>
                  </div>
              </li>
            ))
          )}
        </ul>

        {stats.totalPages > 1 && (
          <div className="p-4 bg-slate-50 border-t border-slate-200">
            <Pagination 
                currentPage={currentPage}
                totalPages={stats.totalPages}
                baseUrl="/admin/finance"
                searchParams={{}}
            />
          </div>
        )}
      </div>
    </div>
  );
}

