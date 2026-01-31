
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  Users,
  Calendar,
  BookOpen,
  Euro,
  FileText,
  UserPlus,
  GraduationCap,
  Clock,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import Link from "next/link";
import DashboardCharts from "@/components/admin/DashboardCharts";
import { AdminWelcomeWrapper } from "@/components/admin/AdminWelcomeWrapper";

async function getAdminStats() {
  const userCount = await prisma.user.count();
  const courseCount = await prisma.course.count();

  const now = new Date();

  // Session stats
  const pastSessions = await prisma.courseSession.count({
    where: { endDate: { lt: now } }
  });
  const currentSessions = await prisma.courseSession.count({
    where: {
      startDate: { lte: now },
      endDate: { gte: now }
    }
  });
  const futureSessions = await prisma.courseSession.count({
    where: { startDate: { gt: now } }
  });

  // Enrollment stats
  const currentEnrollees = await prisma.courseSessionBooking.count({
    where: {
      courseSession: {
        startDate: { lte: now },
        endDate: { gte: now }
      },
      status: "BOOKED"
    }
  });

  const futureEnrollees = await prisma.courseSessionBooking.count({
    where: {
      courseSession: {
        startDate: { gt: now }
      },
      status: "BOOKED"
    }
  });

  const salesAgg = await prisma.order.aggregate({
    _sum: { amount: true },
    where: { status: "PAID" },
  });
  const salesTotal = salesAgg._sum.amount || 0;

  // Monthly stats for the last 6 months
  const monthlyStats = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const monthStart = new Date(d.getFullYear(), d.getMonth(), 1);
    const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0);

    const count = await prisma.enrollment.count({
      where: {
        createdAt: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
    });

    monthlyStats.push({
      name: monthStart.toLocaleString('fr-FR', { month: 'short' }),
      inscriptions: count,
    });
  }

  // Recent activities (keep existing)
  const recentUsers = await prisma.user.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
    },
  });

  const recentEnrollments = await prisma.enrollment.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { email: true, name: true },
      },
      course: {
        select: { title: true },
      },
    },
  });

  const recentDocuments = await prisma.userDocument.findMany({
    take: 5,
    orderBy: { uploadedAt: "desc" },
    where: { status: "PENDING" },
    include: {
      user: {
        select: { email: true, name: true },
      },
    },
  });

  // New: Incomplete Registrations (Users who still need to upload docs)
  const incompleteUsers = await prisma.user.findMany({
    take: 5,
    where: {
      onboardingStatus: "PENDING_DOCS",
    },
    include: {
      documents: {
        select: { status: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  const incompleteCount = await prisma.user.count({
    where: { onboardingStatus: "PENDING_DOCS" }
  });

  return {
    userCount,
    courseCount,
    salesTotal,
    pastSessions,
    currentSessions,
    futureSessions,
    currentEnrollees,
    futureEnrollees,
    monthlyStats,
    recentUsers,
    recentEnrollments,
    recentDocuments,
    incompleteUsers,
    incompleteCount,
  };
}

export default async function AdminDashboardPage() {
  try {
    const user = await requireAdmin();
    const stats = await getAdminStats();
    const isOwner = user.role === "OWNER";

    return (
      <div className="pb-8 relative">
        <AdminWelcomeWrapper role={user.role} />
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Vue d&apos;ensemble</h1>
          <div className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full px-3 py-1 bg-slate-100 rounded-full">
            Rôle: <span className="font-semibold text-slate-700">{user.role}</span>
          </div>
        </div>

        {/* Primary Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {/* Card 1: Users */}
          <div className="bg-white overflow-hidden shadow rounded-lg border border-slate-200">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-blue-500" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-slate-500 truncate">Total Utilisateurs</dt>
                    <dd className="text-lg font-medium text-slate-900">{stats.userCount}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Courses */}
          <div className="bg-white overflow-hidden shadow rounded-lg border border-slate-200">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BookOpen className="h-6 w-6 text-indigo-500" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-slate-500 truncate">Formations Actives</dt>
                    <dd className="text-lg font-medium text-slate-900">{stats.courseCount}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Active Sessions */}
          <div className="bg-white overflow-hidden shadow rounded-lg border border-slate-200">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Calendar className="h-6 w-6 text-green-500" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-slate-500 truncate">Sessions en cours</dt>
                    <dd className="text-lg font-medium text-slate-900">{stats.currentSessions}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Sales (Owner Only) */}
          {isOwner && (
            <div className="bg-white overflow-hidden shadow rounded-lg border border-slate-200">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Euro className="h-6 w-6 text-amber-500" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-slate-500 truncate">Chiffre d&apos;affaires</dt>
                      <dd className="text-lg font-medium text-slate-900">{stats.salesTotal.toLocaleString()} €</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Advanced Session Stats for Owner */}
        {isOwner && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-slate-400" />
              Statistiques Détaillées des Sessions
            </h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-slate-600">Sessions Passées</span>
                  <CheckCircle className="w-4 h-4 text-slate-400" />
                </div>
                <div className="text-2xl font-bold text-slate-900">{stats.pastSessions}</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-green-700">Inscrits (En cours)</span>
                  <GraduationCap className="w-4 h-4 text-green-500" />
                </div>
                <div className="text-2xl font-bold text-green-900">{stats.currentEnrollees}</div>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-amber-700">Inscrits (À venir)</span>
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-2xl font-bold text-amber-900">{stats.futureEnrollees}</div>
              </div>
            </div>
          </div>
        )}

        {/* Visual Analytics for Owner */}
        {isOwner && (
          <DashboardCharts
            monthlyData={stats.monthlyStats}
            sessionStats={{
              past: stats.pastSessions,
              current: stats.currentSessions,
              future: stats.futureSessions
            }}
          />
        )}

        {/* Recent Activities Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Users */}
          <div className="bg-white shadow rounded-lg border border-slate-200">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-500" />
                <h3 className="text-base font-medium text-slate-900">Nouveaux Utilisateurs</h3>
              </div>
              <Link href="/admin/users" className="text-xs text-slate-500 hover:text-gold-600">Tout voir</Link>
            </div>
            <div className="p-4">
              {stats.recentUsers.length === 0 ? (
                <div className="text-center py-8">
                  <UserPlus className="w-10 h-10 text-slate-200 mx-auto mb-2" />
                  <p className="text-xs text-slate-400">Aucun utilisateur récent</p>
                </div>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {stats.recentUsers.map((user) => (
                    <li key={user.id} className="py-3 flex items-center justify-between">
                      <div className="min-w-0 pr-4">
                        <p className="text-sm font-medium text-slate-900 truncate">{user.name || user.email}</p>
                        <p className="text-xs text-slate-500">{new Date(user.createdAt).toLocaleDateString('fr-FR')}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Recent Enrollments */}
          <div className="bg-white shadow rounded-lg border border-slate-200">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-green-500" />
                <h3 className="text-base font-medium text-slate-900">Inscriptions</h3>
              </div>
            </div>
            <div className="p-4">
              {stats.recentEnrollments.length === 0 ? (
                <div className="text-center py-8">
                  <GraduationCap className="w-10 h-10 text-slate-200 mx-auto mb-2" />
                  <p className="text-xs text-slate-400">Aucune inscription</p>
                </div>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {stats.recentEnrollments.map((enrollment) => (
                    <li key={enrollment.id} className="py-3">
                      <p className="text-sm font-medium text-slate-900 truncate">{enrollment.course.title}</p>
                      <p className="text-xs text-slate-500 truncate">
                        {enrollment.user.name || enrollment.user.email} • {new Date(enrollment.createdAt).toLocaleDateString('fr-FR')}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Incomplete Folders / Missing Docs */}
          <div className="bg-white shadow rounded-lg border border-slate-200">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-medium text-slate-900">Dossiers Incomplets</h3>
              </div>
              <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                {stats.incompleteCount}
              </span>
            </div>
            <div className="p-4">
              {stats.incompleteUsers.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-10 h-10 text-green-100 mx-auto mb-2" />
                  <p className="text-xs text-slate-400">Tous les dossiers sont complets</p>
                </div>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {stats.incompleteUsers.map((u) => {
                    const approvedCount = u.documents.filter(d => d.status === "APPROVED").length;
                    return (
                      <li key={u.id} className="py-3 flex items-center justify-between">
                        <div className="min-w-0 pr-4">
                          <p className="text-sm font-medium text-slate-900 truncate">{u.name || u.email}</p>
                          <p className="text-xs text-slate-500 uppercase">
                            {approvedCount} / 4 documents validés
                          </p>
                        </div>
                        <Link
                          href={`/admin/documents/${u.id}`}
                          className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 uppercase tracking-tighter"
                        >
                          Voir
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>

          {/* Pending Documents Verification */}
          <div className="bg-white shadow rounded-lg border border-slate-200">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                <h3 className="text-base font-medium text-slate-900">Docs à valider</h3>
              </div>
              <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                {stats.recentDocuments.length}
              </span>
            </div>
            <div className="p-4">
              {stats.recentDocuments.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-10 h-10 text-slate-200 mx-auto mb-2" />
                  <p className="text-xs text-slate-400">Aucun document en attente</p>
                </div>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {stats.recentDocuments.map((doc) => (
                    <li key={doc.id} className="py-3 flex items-center justify-between">
                      <div className="min-w-0 pr-4">
                        <p className="text-sm font-medium text-slate-900 truncate">{doc.user.name || doc.user.email}</p>
                        <p className="text-xs text-slate-500 uppercase">
                          {doc.type === "ID_CARD" ? "Carte d'identité" :
                            doc.type === "DRIVING_LICENSE" ? "Permis" :
                              doc.type === "JUSTIF_DOMICILE" ? "Justificatif" :
                                doc.type === "PHOTO" ? "Photo" : doc.type}
                        </p>
                      </div>
                      <Link
                        href={`/admin/documents/${doc.userId}`}
                        className="text-[10px] font-bold text-gold-600 hover:text-gold-700 uppercase tracking-tighter"
                      >
                        Vérifier
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    if (String(error).includes("NEXT_REDIRECT")) {
      throw error;
    }
    console.error("Admin Page Error:", error);
    return (
      <div className="flex min-h-[50vh] items-center justify-center p-8">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-red-100 max-w-lg w-full">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Erreur Admin</h2>
          <p className="text-slate-500 mb-6 text-sm">
            Une erreur est survenue lors du chargement des statistiques.
          </p>
          <div className="bg-slate-900 text-red-400 p-4 rounded-lg text-xs font-mono overflow-auto mb-6 max-h-40">
            {error instanceof Error ? error.message : String(error)}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="block w-full text-center py-2.5 px-4 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition"
          >
            Actualiser la page
          </button>
        </div>
      </div>
    );
  }
}


