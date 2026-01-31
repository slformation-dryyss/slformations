
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Edit, Eye, Trash } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

import { CourseFilters } from "@/components/admin/CourseFilters";
import { DeleteCourseButton } from "@/components/admin/courses/DeleteCourseButton";

async function getCourses(params: { q?: string; type?: string; sort?: string }) {
  const { q, type, sort } = params;

  let orderBy: any = [{ type: "asc" }, { title: "asc" }];

  if (sort === "recent") {
    orderBy = { createdAt: "desc" };
  } else if (sort === "oldest") {
    orderBy = { createdAt: "asc" };
  } else if (sort === "price_asc") {
    orderBy = { price: "asc" };
  } else if (sort === "price_desc") {
    orderBy = { price: "desc" };
  } else if (sort === "category") {
    orderBy = [{ type: "asc" }, { title: "asc" }];
  }

  const where: any = {};

  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { type: { contains: q, mode: "insensitive" } },
    ];
  }

  if (type && type !== "ALL") {
    where.type = type;
  }

  return await prisma.course.findMany({
    where,
    orderBy,
    include: {
      _count: {
        select: { modules: true, enrollments: true }
      }
    }
  });
}

export default async function AdminCoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string; sort?: string }>;
}) {
  await requireAdmin();
  // Await searchParams before using properties
  const params = await searchParams;
  const courses = await getCourses(params);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Gestion des Formations (CMS)</h1>
        <Link
          href="/admin/courses/create"
          className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-slate-900 px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nouvelle Formation
        </Link>
      </div>

      <CourseFilters />

      <div className="space-y-8">
        {courses.length === 0 ? (
          <div className="bg-white shadow rounded-lg border border-slate-200 px-6 py-12 text-center text-slate-500">
            Aucune formation trouvée avec ces critères.
          </div>
        ) : (
          Object.entries(
            courses.reduce((acc: any, course) => {
              const type = course.type || "AUTRE";
              if (!acc[type]) acc[type] = [];
              acc[type].push(course);
              return acc;
            }, {})
          ).map(([type, typeCourses]: [string, any]) => (
            <div key={type} className="space-y-4">
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2 px-1">
                <span className="w-2 h-2 bg-gold-500 rounded-full"></span>
                {type} ({typeCourses.length})
              </h2>
              <div className="bg-white shadow overflow-hidden sm:rounded-md border border-slate-200">
                <ul role="list" className="divide-y divide-slate-200">
                  {typeCourses.map((course: any) => (
                    <li key={course.id}>
                      <div className="block hover:bg-slate-50 transition duration-150 ease-in-out px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center truncate">
                            <p className="text-lg font-medium text-slate-900 truncate mr-4">
                              {course.title}
                            </p>
                            {course.drivingHours > 0 && (
                              <span className="mr-2 px-2 inline-flex text-xs leading-5 font-bold rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                                {course.drivingHours}h conduite
                              </span>
                            )}
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${course.isPublished ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                              }`}>
                              {course.isPublished ? "Publié" : "Brouillon"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/admin/courses/${course.id}`} // Edit CMS
                              className="p-2 text-slate-400 hover:text-gold-600 transition-colors"
                              title="Éditer le contenu"
                            >
                              <Edit className="w-5 h-5" />
                            </Link>
                            <Link
                              href={`/formations/${course.slug}`} // Public View
                              target="_blank"
                              className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                              title="Voir la page publique"
                            >
                              <Eye className="w-5 h-5" />
                            </Link>
                            <DeleteCourseButton courseId={course.id} courseName={course.title} />
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex sm:gap-6">
                            <p className="flex items-center text-sm text-slate-500">
                              {course.price > 0 ? `${course.price} €` : "Gratuit / Sur devis"}
                            </p>
                            <p className="mt-2 flex items-center text-sm text-slate-500 sm:mt-0 sm:ml-6">
                              {course._count.modules} Modules • {course._count.enrollments} Inscrits
                            </p>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

