import { prisma } from "@/lib/prisma";

export async function getLessonWithCourseBySlug(
  courseSlug: string,
  lessonId: string,
) {
  const course = await prisma.course.findUnique({
    where: { slug: courseSlug, isPublished: true },
    include: {
      modules: {
        where: { isPublished: true },
        orderBy: { position: "asc" },
        include: {
          lessons: {
            where: { isPublished: true },
            orderBy: { position: "asc" },
            select: {
              id: true,
              title: true,
              description: true,
              videoUrl: true,
              content: true,
              position: true,
              isFree: true,
              duration: true,
              moduleId: true,
            }
          },
          quiz: true
        },
      },
    },
  });

  if (!course) return null;

  let currentLesson = null as (typeof course.modules[number]["lessons"][number]) | null;
  let prevLesson: typeof currentLesson = null;
  let nextLesson: typeof currentLesson = null;

  const flatLessons: typeof course.modules[number]["lessons"] = [];

  for (const module of course.modules) {
    for (const lesson of module.lessons) {
      flatLessons.push(lesson);
    }
  }

  for (let i = 0; i < flatLessons.length; i++) {
    const l = flatLessons[i];
    if (l.id === lessonId) {
      currentLesson = l;
      prevLesson = i > 0 ? flatLessons[i - 1] : null;
      nextLesson = i < flatLessons.length - 1 ? flatLessons[i + 1] : null;
      break;
    }
  }

  if (!currentLesson) return null;

  return { course, currentLesson, prevLesson, nextLesson };
}









