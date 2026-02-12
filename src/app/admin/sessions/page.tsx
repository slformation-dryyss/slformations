import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SessionsManager } from "@/components/admin/SessionsManager";
import { Pagination } from "@/components/admin/Pagination";
import { Plus } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getSessions(page: number = 1, pageSize: number = 10) {
  const skip = (page - 1) * pageSize;
  const [total, sessions] = await Promise.all([
    prisma.courseSession.count(),
    prisma.courseSession.findMany({
      include: {
        course: true,
      },
      orderBy: {
        startDate: "asc",
      },
      skip,
      take: pageSize,
    })
  ]);

  return { 
    sessions, 
    total, 
    totalPages: Math.ceil(total / pageSize) 
  };
}

export default async function AdminSessionsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  await requireAdmin();
  const currentPage = parseInt(params.page || '1') || 1;
  const pageSize = 10;

  const { sessions, total, totalPages } = await getSessions(currentPage, pageSize);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestion des Sessions</h1>
          <p className="text-sm text-slate-500 mt-1">
            Affichage de {total > 0 ? ((currentPage - 1) * pageSize) + 1 : 0} à {Math.min(currentPage * pageSize, total)} sur {total} sessions
          </p>
        </div>
      </div>

      <SessionsManager sessions={sessions as any} />

      {totalPages > 1 && (
        <div className="mt-8 bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            baseUrl="/admin/sessions"
            searchParams={{}}
          />
        </div>
      )}
    </div>
  );
}

