
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Search, User as UserIcon } from "lucide-react";
import { UserRoleSelector } from "@/components/admin/UserRoleSelector";
import { DeleteUserButton } from "@/components/admin/DeleteUserButton";

// Helper components
function RoleBadge({ roles, role }: { roles?: string[], role?: string }) {
  const colors: any = {
    OWNER: "bg-purple-100 text-purple-800",
    ADMIN: "bg-gold-100 text-gold-800",
    INSTRUCTOR: "bg-blue-100 text-blue-800",
    TEACHER: "bg-emerald-100 text-emerald-800",
    SECRETARY: "bg-pink-100 text-pink-800",
    STUDENT: "bg-slate-100 text-slate-800",
  };

  // Normalize roles
  const displayRoles = roles && roles.length > 0 ? roles : (role ? [role] : ["STUDENT"]);

  return (
    <div className="flex flex-wrap gap-1">
      {displayRoles.map(r => (
        <span key={r} className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colors[r] || colors.STUDENT}`}>
          {r}
        </span>
      ))}
    </div>
  );
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; role?: string }>;
}) {
  const adminUser = await requireAdmin();
  const isOwner = adminUser.role === "OWNER" || (adminUser.roles && adminUser.roles.includes("OWNER"));

  const { q, role } = await searchParams;
  const query = q?.toLowerCase() || "";
  const selectedRole = role || "ALL";

  const users = await prisma.user.findMany({
    where: {
      AND: [
        query ? {
          OR: [
            { email: { contains: query, mode: 'insensitive' } },
            { firstName: { contains: query, mode: 'insensitive' } },
            { lastName: { contains: query, mode: 'insensitive' } }
          ]
        } : {},
        // Filter by role check using array containment if possible, or fallback to legacy role
        // Prisma standard filtering on arrays: roles: { has: selectedRole }
        selectedRole !== "ALL" ? {
          OR: [
            { role: selectedRole as any }, // Legacy check
            { roles: { has: selectedRole } } // New check
          ]
        } : {}
      ]
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

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

        <div className="w-[200px] hidden md:block" /> {/* Spacer to keep search centered visually */}
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
                  Utilisateur
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
                      {/* Pass both explicit roles array and legacy role for fallback */}
                      <RoleBadge roles={user.roles} role={user.role} />
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
      </div>
    </div>
  );
}

