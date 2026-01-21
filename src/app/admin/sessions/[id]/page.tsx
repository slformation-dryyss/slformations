import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { 
  Calendar, 
  MapPin, 
  Users, 
  Plus, 
  Trash2, 
  Video, 
  Clock,
  UserPlus,
  CheckCircle2,
  ExternalLink
} from "lucide-react";
import { addSlotAction, deleteSlotAction, enrollStudentAction } from "./actions";
import Link from "next/link";
import SessionCapacityEditor from "./components/SessionCapacityEditor";
import ParticipantList from "./components/ParticipantList";

export default async function SessionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await prisma.courseSession.findUnique({
    where: { id },
    include: {
      course: {
        include: {
          modules: true,
        },
      },
      slots: {
        include: {
          module: true,
          teacher: true,
        },
        orderBy: {
          start: "asc",
        },
      },
      bookings: {
        include: {
          user: true,
        },
      },
      mainTeacher: true,
    },
  });

  if (!session) {
    notFound();
  }

  const teachers = await prisma.user.findMany({
    where: { role: "TEACHER" },
  });

  const allUsers = await prisma.user.findMany({
    where: { role: "STUDENT" },
    orderBy: { name: "asc" },
  });

  // Filter out users already booked
  const enrolledUserIds = session.bookings.map((b) => b.userId);
  const availableUsers = allUsers.filter((u) => !enrolledUserIds.includes(u.id));

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{session.course.title}</h1>
          <div className="flex items-center gap-4 mt-2 text-slate-600">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {format(session.startDate, "d MMMM yyyy", { locale: fr })}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {session.location || "Lieu non défini"}
            </span>
          </div>
          <div className="mt-4 flex gap-2">
            {session.isPublished ? (
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Publié</span>
            ) : (
              <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">Brouillon</span>
            )}
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full capitalize">
              {((session as any).format || "Présentiel").toLowerCase()}
            </span>
          </div>
        </div>
        
        <SessionCapacityEditor 
          sessionId={session.id} 
          currentBooked={session.bookedSpots} 
          currentMax={session.maxSpots} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Planning */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-600" />
                Planning Détaillé
              </h2>
              <a 
                href="#add-slot-form"
                className="btn btn-primary btn-sm flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Ajouter un créneau
              </a>
            </div>
            
            <div className="p-6">
              {session.slots.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-xl">
                  <Calendar className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                  <p className="text-slate-400">Aucun créneau planifié pour le moment.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {session.slots.map((slot) => (
                    <div key={slot.id} className="group flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-slate-200">
                      <div className="flex gap-4 items-center">
                        <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                          {slot.meetingUrl ? <Video className="w-6 h-6" /> : <MapPin className="w-6 h-6" />}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">
                            {slot.module?.title || "Session générale"}
                          </div>
                          <div className="text-sm text-slate-500 flex items-center gap-3 mt-1">
                            <span className="flex items-center gap-1">
                              {format(slot.start, "HH:mm")} - {format(slot.end, "HH:mm")}
                            </span>
                            {slot.teacher && (
                              <span className="flex items-center gap-1 px-2 py-0.5 bg-slate-200 rounded text-slate-700 text-[10px] uppercase font-bold">
                                {slot.teacher.name}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <form action={deleteSlotAction}>
                        <input type="hidden" name="slotId" value={slot.id} />
                        <input type="hidden" name="sessionId" value={session.id} />
                        <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </form>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Add Slot Form (Minimalist) */}
            <div id="add-slot-form" className="p-6 bg-slate-50 border-t border-slate-100">
              <h3 className="text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wider">Nouveau créneau</h3>
              <form action={addSlotAction} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="hidden" name="sessionId" value={session.id} />
                
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-500">Module</label>
                  <select name="moduleId" className="w-full rounded-lg border-slate-200 text-sm">
                    <option value="">-- Session sans module --</option>
                    {session.course.modules.map(mod => (
                      <option key={mod.id} value={mod.id}>{mod.title}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-500">Formateur</label>
                  <select name="teacherId" className="w-full rounded-lg border-slate-200 text-sm">
                    <option value="">-- Par défaut (Session) --</option>
                    {teachers.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-500">Début</label>
                  <input 
                    type="datetime-local" 
                    name="start" 
                    required 
                    min={format(session.startDate, "yyyy-MM-dd'T'00:00")}
                    max={session.endDate ? format(session.endDate, "yyyy-MM-dd'T'23:59") : undefined}
                    defaultValue={format(session.startDate, "yyyy-MM-dd'T'09:00")}
                    className="w-full rounded-lg border-slate-200 text-sm" 
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-500">Fin</label>
                  <input 
                    type="datetime-local" 
                    name="end" 
                    required 
                    min={format(session.startDate, "yyyy-MM-dd'T'00:00")}
                    max={session.endDate ? format(session.endDate, "yyyy-MM-dd'T'23:59") : undefined}
                    defaultValue={format(session.startDate, "yyyy-MM-dd'T'17:00")}
                    className="w-full rounded-lg border-slate-200 text-sm" 
                  />
                </div>

                <div className="md:col-span-2 space-y-1">
                  <label className="text-xs font-medium text-slate-500">Lieu / URL Visio</label>
                  <input type="text" name="location" placeholder="Adresse physique ou lien meeting" className="w-full rounded-lg border-slate-200 text-sm" />
                </div>

                <div className="md:col-span-2 pt-2">
                  <button type="submit" className="w-full bg-slate-900 text-white rounded-lg py-2 text-sm font-semibold hover:bg-slate-800 transition-colors">
                    Ajouter le créneau
                  </button>
                </div>
              </form>
            </div>
          </div>

            {/* Participants Table */}
            <ParticipantList 
              bookings={session.bookings as any} 
              sessionId={session.id} 
            />
          </div>

        {/* Right Column: Actions */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-md font-semibold text-slate-900 mb-6 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-indigo-600" />
              Inscrire un élève manuellement
            </h3>
            
            <form action={enrollStudentAction} className="space-y-4">
              <input type="hidden" name="sessionId" value={session.id} />
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-500">Choisir un élève</label>
                <select name="userId" required className="w-full rounded-xl border-slate-200 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm h-11">
                  <option value="">-- Choisir un élève --</option>
                  {availableUsers.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.email})
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" className="w-full bg-slate-900 text-white rounded-xl py-3 font-semibold hover:bg-slate-800 shadow-lg shadow-slate-200 transition-all active:scale-95 flex items-center justify-center gap-2">
                <Plus className="w-5 h-5" /> Ajouter
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-100">
              <div className="bg-slate-50 p-4 rounded-xl space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                  <p className="text-xs text-slate-600 leading-relaxed">
                    L'ajout manuel inscrit l'élève à la session et lui donne accès au contenu e-learning associé.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

