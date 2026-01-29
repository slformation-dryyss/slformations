import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth0.getSession();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { auth0Id: session.user.sub },
      include: {
        enrollments: {
          include: {
            course: {
              include: {
                _count: {
                  select: {
                    modules: true
                  }
                }
              }
            }
          },
          orderBy: {
            updatedAt: 'desc'
          }
        },
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Transform data for frontend
    const enrollments = await Promise.all(user.enrollments.map(async (enrollment) => {
      // Distance progress (VOD/Quiz)
      // Count total lessons in modules that have NO session slots
      const course = await prisma.course.findUnique({
        where: { id: enrollment.courseId },
        include: {
          modules: {
            include: {
              _count: { select: { lessons: true, sessionSlots: true } }
            }
          }
        }
      });

      const distanceModules = course?.modules.filter(m => m._count.sessionSlots === 0) || [];
      const totalDistanceLessons = distanceModules.reduce((acc, m) => acc + m._count.lessons, 0);

      // Count completed lessons for this user in these modules
      const completedLessons = await prisma.lessonProgress.count({
        where: {
          userId: user.id,
          isCompleted: true,
          lesson: { moduleId: { in: distanceModules.map(m => m.id) } }
        }
      });

      const distanceProgress = totalDistanceLessons > 0
        ? Math.round((completedLessons / totalDistanceLessons) * 100)
        : 0;

      // Session progress (Presentiel/Visio)
      // Count sessions for this course that the user is booked for
      const sessionBookings = await prisma.courseSessionBooking.findMany({
        where: {
          userId: user.id,
          courseSession: { courseId: enrollment.courseId }
        }
      });

      const totalSessions = sessionBookings.length;
      const presentSessions = sessionBookings.filter(b => b.status === "PRESENT").length;
      const sessionProgress = totalSessions > 0
        ? Math.round((presentSessions / totalSessions) * 100)
        : 0;

      return {
        id: enrollment.id,
        courseId: enrollment.courseId,
        title: enrollment.course.title,
        slug: enrollment.course.slug,
        imageUrl: enrollment.course.imageUrl,
        progress: enrollment.progress, // Overall progress
        distanceProgress,
        sessionProgress,
        hasDistance: totalDistanceLessons > 0,
        hasSessions: totalSessions > 0,
        // @ts-ignore
        lastLessonId: enrollment.lastLessonId,
        status: enrollment.status,
        lastAccessedAt: enrollment.updatedAt,
        enrollmentCreatedAt: enrollment.createdAt,
        totalModules: enrollment.course._count.modules || 0
      };
    }));

    // Stats calculation
    const activeCoursesCount = enrollments.filter(e => e.status === 'ACTIVE').length;

    return NextResponse.json({
      enrollments,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
      },
      stats: {
        activeCourses: activeCoursesCount,
        completedHours: 0,
        totalHours: enrollments.length * 35
      }
    });

  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

