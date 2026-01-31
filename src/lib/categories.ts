import { prisma } from "@/lib/prisma";

/**
 * Fetches all course categories including their linked courses.
 * Categories are ordered by the order of creation (matching the seed sequence).
 * Courses are also ordered by creation/ID.
 */
export async function getCategoriesWithCourses() {
  return prisma.courseCategory.findMany({
    include: {
      courses: {
        where: {
          course: {
            isPublished: true
          }
        },
        include: {
          course: {
            select: {
              id: true,
              title: true,
              slug: true,
              type: true,
              isPublished: true,
            }
          }
        },
        orderBy: {
          assignedAt: 'asc'
        }
      }
    },
    orderBy: {
      createdAt: 'asc'
    }
  });
}
