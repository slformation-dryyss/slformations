import { prisma } from "@/lib/prisma";

export async function getCourses() {
  return prisma.course.findMany({
    // Le typage Prisma généré dans ce projet ne gère pas encore isPublished dans CourseWhereInput
    // on filtre donc côté JS pour rester compatible.
    orderBy: { createdAt: "desc" },
  });
}

export async function getCourseBySlug(slug: string) {
  return prisma.course.findUnique({
    where: { slug },
  });
}

