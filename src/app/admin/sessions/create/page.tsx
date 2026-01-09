
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createSessionAction } from "../actions";

async function getData() {
  const courses = await prisma.course.findMany({
    where: { isPublished: true },
    select: { id: true, title: true, slug: true },
  });
  
  const teachers = await prisma.user.findMany({
    where: { role: "INSTRUCTOR" },
    select: { id: true, firstName: true, lastName: true, email: true },
    orderBy: { lastName: "asc" },
  });

  return { courses, teachers };
}

export default async function CreateSessionPage() {
  await requireAdmin();
  const { courses, teachers } = await getData();

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Créer une nouvelle session</h1>

      <form action={createSessionAction} className="bg-white shadow rounded-lg border border-slate-200 p-6 space-y-6">
        
        {/* Course Selection */}
        <div>
          <label htmlFor="courseId" className="block text-sm font-medium text-slate-700 mb-1">
            Formation
          </label>
          <select
            name="courseId"
            id="courseId"
            required
            className="block w-full rounded-md border-slate-300 shadow-sm focus:border-gold-500 focus:ring-gold-500 sm:text-sm p-2 border"
          >
            <option value="">Sélectionner une formation...</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-slate-700 mb-1">
              Date de début
            </label>
            <input
              type="date"
              name="startDate"
              id="startDate"
              required
              min={new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
              className="block w-full rounded-md border-slate-300 shadow-sm focus:border-gold-500 focus:ring-gold-500 sm:text-sm p-2 border"
            />
            <p className="mt-1 text-xs text-slate-500">La session doit débuter au minimum 10 jours après aujourd'hui</p>
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-slate-700 mb-1">
              Date de fin
            </label>
             <input
              type="date"
              name="endDate"
              id="endDate"
              required
              className="block w-full rounded-md border-slate-300 shadow-sm focus:border-gold-500 focus:ring-gold-500 sm:text-sm p-2 border"
            />
          </div>
        </div>

        {/* Location & Spots */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-slate-700 mb-1">
              Lieu
            </label>
            <input
              type="text"
              name="location"
              placeholder="Ex: Paris 10 ou En ligne"
              className="block w-full rounded-md border-slate-300 shadow-sm focus:border-gold-500 focus:ring-gold-500 sm:text-sm p-2 border"
            />
          </div>

          <div>
            <label htmlFor="mainTeacherId" className="block text-sm font-medium text-slate-700 mb-1">
              Formateur Principal (Optionnel)
            </label>
            <select
              name="mainTeacherId"
              id="mainTeacherId"
              className="block w-full rounded-md border-slate-300 shadow-sm focus:border-gold-500 focus:ring-gold-500 sm:text-sm p-2 border"
            >
              <option value="">-- Aucun --</option>
              {teachers.map(t => (
                <option key={t.id} value={t.id}>
                  {t.firstName} {t.lastName} ({t.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="format" className="block text-sm font-medium text-slate-700 mb-1">
              Modalité
            </label>
            <select
              name="format"
              id="format"
              required
              className="block w-full rounded-md border-slate-300 shadow-sm focus:border-gold-500 focus:ring-gold-500 sm:text-sm p-2 border"
            >
              <option value="IN_PERSON">📍 Présentiel (Adresse)</option>
              <option value="REMOTE">🌐 Distanciel (Teams/Zoom)</option>
              <option value="VIDEO">🎥 Vidéo (E-learning)</option>
            </select>
          </div>

          <div>
            <label htmlFor="maxSpots" className="block text-sm font-medium text-slate-700 mb-1">
              Places Disponibles
            </label>
             <input
              type="number"
              name="maxSpots"
              id="maxSpots"
              defaultValue={10}
              min={1}
              className="block w-full rounded-md border-slate-300 shadow-sm focus:border-gold-500 focus:ring-gold-500 sm:text-sm p-2 border"
            />
          </div>
        </div>

        {/* Meeting URL (Conditional-lite) */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <label htmlFor="meetingUrl" className="block text-sm font-medium text-slate-700 mb-1">
            Lien de réunion (Teams, Zoom, etc.)
          </label>
          <input
            type="url"
            name="meetingUrl"
            id="meetingUrl"
            placeholder="https://teams.microsoft.com/l/meetup-join/..."
            className="block w-full rounded-md border-slate-300 shadow-sm focus:border-gold-500 focus:ring-gold-500 sm:text-sm p-2 border"
          />
          <p className="mt-1 text-xs text-slate-500">Requis pour le format Distanciel ou Vidéo si différent du cours.</p>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-800 transition-colors font-medium"
          >
            Créer la session
          </button>
        </div>
      </form>
    </div>
  );
}

