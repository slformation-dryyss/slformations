import { auth0 } from "@/lib/auth0";
import { prisma } from "@/lib/prisma";
import { getTeacherStudents } from "@/lib/courses";
import { User, Mail, Calendar, Search, GraduationCap } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { redirect } from "next/navigation";

export default async function TeacherStudentsPage(props: {
  searchParams: Promise<{ session?: string }>;
}) {
  const searchParams = await props.searchParams;
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

  const allStudents = await getTeacherStudents(dbUser.id);
  
  // Filter by session if requested
  const filteredStudents = searchParams.session 
    ? allStudents.filter(s => s.courseSessionId === searchParams.session)
    : allStudents;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Mes <span className="text-gold-500">Élèves</span></h1>
          <p className="text-slate-500 font-medium tracking-tight">Liste des stagiaires inscrits à vos sessions de formation.</p>
        </div>
        <div className="bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-sm text-sm font-black text-slate-600 uppercase tracking-widest">
          {filteredStudents.length} élève(s)
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                <th className="px-8 py-5">Élève</th>
                <th className="px-8 py-5">Formation</th>
                <th className="px-8 py-5">Session</th>
                <th className="px-8 py-5">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gold-100 rounded-2xl flex items-center justify-center text-gold-600 font-black text-lg group-hover:bg-gold-500 group-hover:text-slate-900 transition-colors">
                          {booking.user.name?.charAt(0) || <User className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 group-hover:text-gold-600 transition-colors">{booking.user.name}</p>
                          <p className="text-xs font-bold text-slate-400 flex items-center gap-1">
                            <Mail className="w-3 h-3 text-gold-500" />
                            {booking.user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-gold-500" />
                        <div>
                          <p className="font-bold text-slate-700">{booking.courseSession.course.title}</p>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{booking.courseSession.course.type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                        <Calendar className="w-4 h-4 text-gold-500" />
                        {format(new Date(booking.courseSession.startDate), 'dd/MM/yyyy')}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border-2 ${
                        booking.status === 'BOOKED' 
                          ? 'bg-green-50 text-green-600 border-green-100' 
                          : 'bg-slate-50 text-slate-400 border-slate-100'
                      }`}>
                        {booking.status === 'BOOKED' ? 'Confirmé' : booking.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <User className="w-8 h-8 text-slate-200" />
                    </div>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Aucun élève trouvé</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

