
import { requireAdmin, requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Search, Shield, User as UserIcon, MoreVertical } from "lucide-react";
import { UserRoleSelector } from "@/components/admin/UserRoleSelector";

// Helper components (could be extracted)
function RoleBadge({ role }: { role: string }) {
  const colors: any = {
    OWNER: "bg-purple-100 text-purple-800",
    ADMIN: "bg-gold-100 text-gold-800",
    INSTRUCTOR: "bg-blue-100 text-blue-800",
    SECRETARY: "bg-pink-100 text-pink-800",
    STUDENT: "bg-slate-100 text-slate-800",
  };
  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colors[role] || colors.STUDENT}`}>
      {role}
    </span>
  );
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const user = await requireAdmin(); // Access control
  const isOwner = user.role === "OWNER";
  
  const { q } = await searchParams;
  const query = q?.toLowerCase() || "";

  const users = await prisma.user.findMany({
    where: {
      OR: query ? [
        { email: { contains: query, mode: 'insensitive' } },
        { name: { contains: query, mode: 'insensitive' } },
        { firstName: { contains: query, mode: 'insensitive' } },
        { lastName: { contains: query, mode: 'insensitive' } }
      ] : undefined
    },
    orderBy: { createdAt: 'desc' },
    take: 50, // Limit for performance
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Annuaire Utilisateurs</h1>
        <div className="relative">
             <form className="relative">
                <input
                    type="text"
                    name="q"
                    defaultValue={query}
                    placeholder="Rechercher..."
                    className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-gold-500 focus:border-gold-500"
                />
                <Search className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
             </form>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-slate-200">
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
                <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Utilisateur
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Rôle
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Inscription
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Actions
                    </th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
                {users.length === 0 ? (
                     <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                            Aucun utilisateur trouvé.
                        </td>
                    </tr>
                ) : (
                    users.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                                        <UserIcon className="w-5 h-5" />
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-slate-900">
                                            {u.firstName} {u.lastName}
                                        </div>
                                        <div className="text-sm text-slate-500">
                                            {u.email}
                                        </div>
                                        {u.name && u.name !== "Utilisateur" && (
                                             <div className="text-xs text-slate-400">
                                                Auth0: {u.name}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <RoleBadge role={u.role} />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                {new Date(u.createdAt).toLocaleDateString('fr-FR')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                {isOwner && u.role !== "OWNER" ? (
                                    <UserRoleSelector userId={u.id} currentRole={u.role} />
                                ) : (
                                    <span className="text-slate-400 cursor-not-allowed">
                                        {u.role === "OWNER" ? "Propriétaire" : "Consultation"}
                                    </span>
                                )}
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}
