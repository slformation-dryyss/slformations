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
    const enrollments = user.enrollments.map(enrollment => ({
        id: enrollment.id,
        courseId: enrollment.courseId,
        title: enrollment.course.title,
        slug: enrollment.course.slug,
        imageUrl: enrollment.course.imageUrl,
        progress: enrollment.progress,
        status: enrollment.status,
        lastAccessedAt: enrollment.updatedAt,
        totalModules: enrollment.course._count.modules || 0
    }));

    // Stats calculation
    const activeCourses = enrollments.filter(e => e.status === 'ACTIVE').length;
    // Mock hours per course if not tracked per lesson yet
    const estimatedHours = enrollments.length * 35; // Mock 35h per course average for now

    return NextResponse.json({
        enrollments,
        stats: {
            activeCourses,
            completedHours: 0, // TODO: calculate from detailed progress
            totalHours: estimatedHours 
        }
    });

  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

