
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Search, User as UserIcon } from "lucide-react";
import { UserRoleSelector } from "@/components/admin/UserRoleSelector";
import { DeleteUserButton } from "@/components/admin/DeleteUserButton";
import { CreateUserButton } from "@/components/admin/CreateUserButton";
import { BlockUserButton } from "@/components/admin/BlockUserButton";
import { FirstLoginModal } from "@/components/dashboard/FirstLoginModal";
import { Pagination } from "@/components/admin/Pagination";

// Improved role badge with distinct colors and better visual hierarchy
function RoleBadge({ roles, role }: { roles?: string[], role?: string }) {
  const allRoles = roles || (role ? [role] : []);
  
  const roleConfig: Record<string, { bg: string; text: string; border: string; icon: string }> = {
    OWNER: { 
      bg: 'bg-purple-100', 
      text: 'text-purple-800', 
      border: 'border-purple-300',
      icon: '👑'
    },
    ADMIN: { 
      bg: 'bg-blue-100', 
      text: 'text-blue-800', 
      border: 'border-blue-300',
      icon: '🛡️'
    },
    SECRETARY: { 
      bg: 'bg-pink-100', 
      text: 'text-pink-800', 
      border: 'border-pink-300',
      icon: '📋'
    },
    INSTRUCTOR: { 
      bg: 'bg-green-100', 
      text: 'text-green-800', 
      border: 'border-green-300',
      icon: '🚗'
    },
    TEACHER: { 
      bg: 'bg-amber-100', 
      text: 'text-amber-800', 
      border: 'border-amber-300',
      icon: '👨‍🏫'
    },
    STUDENT: { 
      bg: 'bg-slate-100', 
      text: 'text-slate-700', 
      border: 'border-slate-300',
      icon: '🎓'
    },
  };

  return (
    <div className="flex flex-wrap gap-1.5">
      {allRoles.map((r) => {
        const config = roleConfig[r] || roleConfig.STUDENT;
        return (
          <span
            key={r}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${config.bg} ${config.text} ${config.border}`}
          >
            <span className="text-sm">{config.icon}</span>
            {r}
          </span>
        );
      })}
    </div>
  );
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; role?: string; page?: string }>;
}) {
  const adminUser = await requireAdmin();
  const isOwner = adminUser.role === "OWNER" || (adminUser.roles && adminUser.roles.includes("OWNER"));

  const { q, role, page: pageParam } = await searchParams;
  const query = q?.toLowerCase() || "";
  const selectedRole = role || "ALL";
  const currentPage = parseInt(pageParam || '1') || 1;
  const pageSize = 10;

  const whereClause = {
    AND: [
      query ? {
        OR: [
          { email: { contains: query, mode: 'insensitive' as const } },
          { firstName: { contains: query, mode: 'insensitive' as const } },
          { lastName: { contains: query, mode: 'insensitive' as const } }
        ]
      } : {},
      selectedRole !== "ALL" ? {
        OR: [
          { role: selectedRole as any },
          { roles: { has: selectedRole } }
        ]
      } : {}
    ]
  };

  // Run count and findMany in parallel
  const [totalCount, users] = await Promise.all([
    prisma.user.count({ where: whereClause }),
    prisma.user.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
    })
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  // Role priority for "Général" view
  const rolePriority: Record<string, number> = {
    OWNER: 0,
    ADMIN: 1,
    SECRETARY: 2,
    TEACHER: 3,
    INSTRUCTOR: 3,
    STUDENT: 4
  };

  const sortedUsers = [...users].sort((a, b) => {
    if (selectedRole === "ALL") {
      const pA = rolePriority[a.role] ?? 99;
      const pB = rolePriority[b.role] ?? 99;
      if (pA !== pB) return pA - pB;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const tabs = [
    { label: "Général", value: "ALL" },
    { label: "Admins", value: "ADMIN" },
    { label: "Instructeurs (Auto)", value: "INSTRUCTOR" },
    { label: "Formateurs (Pro)", value: "TEACHER" },
    { label: "Secrétaires", value: "SECRETARY" },
    { label: "Élèves", value: "STUDENT" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900 shrink-0">Annuaire Utilisateurs</h1>

        {/* Centered Search Bar */}
        <div className="flex-1 max-w-md mx-auto w-full">
          <form className="relative">
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Rechercher par nom ou email..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-full focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 transition-all outline-none"
            />
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
            {selectedRole !== "ALL" && <input type="hidden" name="role" value={selectedRole} />}
          </form>
        </div>

        <div className="shrink-0">
          <CreateUserButton />
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-8 overflow-x-auto pb-1">
          {tabs.map((tab) => (
            <Link
              key={tab.value}
              href={`/admin/users?${new URLSearchParams({
                ...(query ? { q: query } : {}),
                role: tab.value
              }).toString()}`}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${selectedRole === tab.value
                ? "border-gold-500 text-gold-600"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                }`}
            >
              {tab.label}
              <span className="ml-2 text-xs text-slate-300">
                {/* Visual indicator of count could go here if fetched separately */}
              </span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="bg-white shadow-sm overflow-hidden sm:rounded-xl border border-slate-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Utilisateur ({((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, totalCount)} sur {totalCount})
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Rôles
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Inscription
                </th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {sortedUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                    Aucun utilisateur trouvé
                  </td>
                </tr>
              ) : (
                sortedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                          {user.firstName ? (
                            <span className="font-bold text-sm">{user.firstName[0]}{user.lastName?.[0]}</span>
                          ) : (
                            <UserIcon className="h-5 w-5" />
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-slate-900">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-slate-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {/* RoleBadge removed - displayed in Actions column */}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <UserRoleSelector
                          userId={user.id}
                          currentRoles={user.roles || []}
                          currentRole={user.role}
                        />
                        <BlockUserButton 
                          userId={user.id} 
                          userName={user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email}
                          isBlocked={user.isBlocked}
                        />
                        <DeleteUserButton
                          userId={user.id} 
                          userName={user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email}
                        />

                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="border-t border-slate-200 bg-slate-50/50">
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              baseUrl="/admin/users"
              searchParams={{ q: query, role: selectedRole }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

