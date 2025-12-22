import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ArrowLeft, Mail, Phone } from "lucide-react";
// import { addParticipantAction } from "../actions"; // REPLACED

import { SessionPlanning } from "@/components/admin/SessionPlanning";
import AddStudentForm from "../AddStudentForm";

async function getSession(id: string) {
  const session = await prisma.courseSession.findUnique({
    where: { id },
    include: {
      course: true,
      mainTeacher: true,
      bookings: {
        include: {
          user: true, 
        },
        orderBy: {
            createdAt: 'desc'
        }
      },
      slots: {
          include: {
              teacher: true,
              module: true,
          },
          orderBy: {
              start: 'asc'
          }
      }
    },
  });

  if (!session) return null;
  return session;
}

export default async function SessionDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await requireAdmin();
  const session = await getSession(id);

  if (!session) {
    notFound();
  }

  // Fetch context data for planning
  const modules = await prisma.module.findMany({
      where: { courseId: session.courseId },
      orderBy: { position: 'asc' },
      select: { id: true, title: true }
  });

  const teachers = await prisma.user.findMany({
      where: {
          role: { in: ['INSTRUCTOR', 'ADMIN', 'OWNER'] }
      },
      select: { id: true, name: true, firstName: true, lastName: true },
      orderBy: { name: 'asc' }
  });

  // Fetch students for the Add Form
  const students = await prisma.user.findMany({
      where: { role: "STUDENT" },
      select: { id: true, email: true, firstName: true, lastName: true },
      orderBy: { lastName: 'asc' }
  });

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/sessions"
          className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Retour aux sessions
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{session.course.title}</h1>
          <p className="mt-2 text-lg text-slate-600">
            {format(session.startDate, "d MMMM yyyy", { locale: fr })} - {session.location || "Lieu non défini"}
          </p>
          {session.mainTeacher && (
             <p className="text-sm text-slate-500 mt-1 flex items-center gap-1">
                <span className="font-semibold">Formateur Principal :</span> {session.mainTeacher.firstName} {session.mainTeacher.lastName}
             </p>
          )}
          <span className={`mt-3 inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
            session.isPublished ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
          }`}>
             {session.isPublished ? "Publié" : "Brouillon"}
          </span>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm min-w-[200px]">
          <p className="text-sm font-medium text-slate-500">Places occupées</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">
            {session.bookedSpots} <span className="text-sm font-normal text-slate-400">/ {session.maxSpots}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-8">
             {/* Session Planning Section */}
            <section className="bg-white shadow rounded-lg border border-slate-200 p-6">
                <SessionPlanning 
                    sessionId={session.id}
                    slots={session.slots}
                    modules={modules}
                    teachers={teachers}
                />
            </section>

             {/* Participants List */}
            <section>
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    Participants
                    <span className="bg-slate-100 text-slate-600 text-xs font-semibold px-2 py-1 rounded-full">{session.bookedSpots}</span>
                </h2>
                
              <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-slate-200">
                 <ul className="divide-y divide-slate-200">
                    {session.bookings.length === 0 ? (
                        <li className="px-6 py-8 text-center text-slate-500">
                            Aucun participant inscrit.
                        </li>
                    ) : (
                        session.bookings.map((booking) => (
                            <li key={booking.id} className="px-6 py-4 hover:bg-slate-50">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10 bg-gold-100 rounded-full flex items-center justify-center text-gold-700 font-bold text-sm">
                                            {booking.user.firstName?.[0] || booking.user.name?.[0] || "?"}{booking.user.lastName?.[0] || ""}
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-slate-900">
                                                {booking.user.firstName} {booking.user.lastName} <span className="text-slate-400 font-normal">({booking.user.name})</span>
                                            </p>
                                            <div className="flex items-center gap-3 mt-1">
                                                 <div className="flex items-center text-xs text-slate-500">
                                                    <Mail className="w-3 h-3 mr-1" />
                                                    {booking.user.email}
                                                 </div>
                                                 {booking.user.phone && (
                                                    <div className="flex items-center text-xs text-slate-500">
                                                        <Phone className="w-3 h-3 mr-1" />
                                                        {booking.user.phone}
                                                    </div>
                                                 )}
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            booking.status === 'BOOKED' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {booking.status}
                                        </span>
                                    </div>
                                </div>
                            </li>
                        ))
                    )}
                 </ul>
              </div>
            </section>
        </div>

        {/* Add Participant Form */}
        <div>
           <div className="sticky top-6 space-y-6">
                <AddStudentForm sessionId={session.id} users={students} />
           </div>
        </div>
      </div>
    </div>
  );
}
