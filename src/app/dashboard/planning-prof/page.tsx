import { auth0 } from "@/lib/auth0";
import { prisma } from "@/lib/prisma";
import { getTeacherSessions } from "@/lib/courses";
import { Calendar, MapPin, Users, Clock, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function TeacherPlanningPage() {
  const session = await auth0.getSession();
  if (!session?.user) redirect("/api/auth/login");

  const dbUser = await prisma.user.findUnique({
    where: { auth0Id: session.user.sub },
    select: { id: true, role: true }
  });

  if (!dbUser || (dbUser.role !== "INSTRUCTOR" && dbUser.role !== "ADMIN" && dbUser.role !== "OWNER")) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Accès restreint</h2>
        <p className="text-slate-500">Cette section est réservée aux formateurs.</p>
      </div>
    );
  }

  const sessions = await getTeacherSessions(dbUser.id);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Mon Planning <span className="text-gold-500">d'Enseignement</span></h1>
          <p className="text-slate-500 font-medium">Retrouvez les sessions de formation auxquelles vous êtes assigné.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm text-sm font-bold text-slate-600">
          {sessions.length} session(s) prévue(s)
        </div>
      </div>

      <div className="grid gap-6">
        {sessions.length > 0 ? (
          sessions.map((session) => {
            const startDate = new Date(session.startDate);
            const endDate = new Date(session.endDate);
            const studentCount = session.bookings.length;

            return (
              <div 
                key={session.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:border-gold-500/50 transition-all group"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-8">
                  {/* Date Block */}
                  <div className="flex flex-col items-center justify-center w-24 h-24 bg-slate-900 rounded-[2rem] text-white shrink-0 group-hover:bg-gold-500 group-hover:text-slate-900 transition-colors">
                     <span className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">
                       {format(startDate, 'MMM', { locale: fr })}
                     </span>
                     <span className="text-4xl font-black leading-none">
                       {format(startDate, 'dd')}
                     </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                       <span className="px-3 py-1 bg-gold-50 text-gold-600 text-[10px] font-black uppercase tracking-tighter rounded-full border border-gold-100">
                         {session.course.type}
                       </span>
                       {!session.isPublished && (
                         <span className="px-3 py-1 bg-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-tighter rounded-full border border-slate-200">
                           Brouillon
                         </span>
                       )}
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-gold-600 transition-colors">
                      {session.course.title}
                    </h3>
                    <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm font-bold text-slate-500">
                      <div className="flex items-center gap-2">
                         <Clock className="w-4 h-4 text-gold-500" />
                         Du {format(startDate, 'dd/MM')} au {format(endDate, 'dd/MM/yyyy')}
                      </div>
                      <div className="flex items-center gap-2">
                         <MapPin className="w-4 h-4 text-gold-500" />
                         {session.location || "Pontault-Combault"}
                      </div>
                      <div className="flex items-center gap-2">
                         <Users className="w-4 h-4 text-gold-500" />
                         {studentCount} élève(s) inscrit(s)
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Link 
                      href={`/formations/${session.course.slug}`}
                      className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-100 hover:text-slate-600 transition-all border border-slate-100"
                      title="Voir la formation"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </Link>
                    <Link 
                      href={`/dashboard/students?session=${session.id}`}
                      className="px-6 py-4 bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded-3xl hover:bg-gold-500 hover:text-slate-900 transition-all shadow-lg active:scale-95"
                    >
                      Liste des élèves
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-10 h-10 text-slate-200" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">Aucune session</h3>
            <p className="text-slate-500 max-w-sm mx-auto font-medium">Vous n'avez pas encore de sessions de formation assignées.</p>
          </div>
        )}
      </div>
    </div>
  );
}

