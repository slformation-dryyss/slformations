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
    include: {
      modules: {
        include: {
          lessons: true,
        },
        orderBy: { position: 'asc' },
      },
      courseSessions: {
        where: {
          startDate: {
            gte: new Date(),
          },
          isPublished: true,
        },
        orderBy: { startDate: 'asc' },
        take: 10,
      },
    },
  });
}

export async function getCoursesByType(type: string) {
  return prisma.course.findMany({
    where: {
      type: type,
      isPublished: true,
    },
    include: {
        courseSessions: {
            where: {
                startDate: {
                    gte: new Date(), // Future sessions only
                }, 
                isPublished: true
            },
            orderBy: { startDate: 'asc' },
            take: 5
        }
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAllSessionsByType(type: string) {
    return prisma.courseSession.findMany({
        where: {
            course: {
                type: type,
                isPublished: true,
            },
            startDate: { gte: new Date() },
            isPublished: true,
        },
        include: {
            course: {
                select: { title: true, slug: true }
            }
        },
        orderBy: { startDate: 'asc' },
        take: 10
    });
}


export async function getPublicSessions(filters?: { search?: string; type?: string; courseId?: string }) {
    return prisma.courseSession.findMany({
        where: {
            isPublished: true,
            startDate: { gte: new Date() },
            course: {
                isPublished: true,
                ...(filters?.type ? { type: filters.type.toUpperCase() } : {}),
                ...(filters?.search ? {
                    OR: [
                        { title: { contains: filters.search, mode: 'insensitive' } },
                        { description: { contains: filters.search, mode: 'insensitive' } }
                    ]
                } : {}),
                ...(filters?.courseId ? { id: filters.courseId } : {})
            }
        },
        include: {
            course: {
                select: {
                    title: true,
                    slug: true,
                    type: true,
                    imageUrl: true
                }
            }
        },
        orderBy: { startDate: 'asc' }
    });
}

export async function getTeacherSessions(teacherId: string) {
    return prisma.courseSession.findMany({
        where: {
            mainTeacherId: teacherId,
        },
        include: {
            course: {
                select: {
                    title: true,
                    slug: true,
                    type: true,
                }
            },
            bookings: {
                select: {
                    id: true,
                }
            }
        },
        orderBy: { startDate: 'asc' }
    });
}

export async function getTeacherStudents(teacherId: string) {
    return prisma.courseSessionBooking.findMany({
        where: {
            courseSession: {
                mainTeacherId: teacherId,
            }
        },
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                }
            },
            courseSession: {
                include: {
                    course: {
                        select: {
                            title: true,
                            type: true,
                        }
                    }
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    });
}



