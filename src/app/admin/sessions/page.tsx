import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SessionsManager } from "@/components/admin/SessionsManager";
import { Plus } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getSessions() {
  return await prisma.courseSession.findMany({
    include: {
      course: true,
      // bookings relation removed as per schema
    },
    orderBy: {
      startDate: "asc", // Upcoming first
    },
  });
}

export default async function AdminSessionsPage({
  searchParams,
}: {
  searchParams?: Promise<any>;
}) {
  await searchParams; // Await searchParams for Next.js 15 consistency
  await requireAdmin();
  const sessions = await getSessions();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Gestion des Sessions</h1>
        {/* Bouton déplacé dans SessionsManager mais on peut le garder ici ou le masquer */}
      </div>

      <SessionsManager sessions={sessions} />
    </div>
  );
}

