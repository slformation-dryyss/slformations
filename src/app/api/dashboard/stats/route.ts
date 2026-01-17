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
            course: true
          }
        },
        sessionBookings: {
          where: {
            session: {
              startsAt: {
                gte: new Date(),
              },
            },
          },
          include: {
            session: {
              include: {
                course: true
              }
            },
          },
          orderBy: {
            session: {
              startsAt: "asc",
            },
          },
          take: 5,
        },
        progress: {
          include: {
            lesson: true
          }
        }
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Check role from DB user (more reliable than session claims for logic)
    const isInstructor = user.role === "INSTRUCTOR" || user.role === "ADMIN" || user.role === "OWNER";

    if (isInstructor) {
      // Fetch teacher specific stats (Professional Training)
      const teachingSlots = await prisma.sessionSlot.findMany({
        where: {
          teacherId: user.id,
          start: {
            gte: new Date()
          }
        },
        include: {
          session: {
            include: {
              course: true
            }
          },
          module: true
        },
        orderBy: {
          start: 'asc'
        },
        take: 5
      });

      // Calculate past hours taught in Pro Training
      const pastSlots = await prisma.sessionSlot.findMany({
        where: {
          teacherId: user.id,
          end: {
            lt: new Date()
          }
        },
        select: {
          start: true,
          end: true
        }
      });

      let hoursTaught = pastSlots.reduce((acc, slot) => {
        return acc + (slot.end.getTime() - slot.start.getTime()) / (1000 * 60 * 60);
      }, 0);

      // --- NEW: Add Driving Lessons Stats (for INSTRUCTOR profile) ---
      const instructorProfile = await prisma.instructorProfile.findUnique({
        where: { userId: user.id }
      });

      let drivingLessonsCount = 0;
      let upcomingDrivingLessons: any[] = [];
      let nextDrivingLesson: any = null;

      if (instructorProfile) {
        // Count completed driving lessons hours
        const pastDrivingLessons = await prisma.drivingLesson.findMany({
          where: {
            instructorId: instructorProfile.id,
            status: "COMPLETED"
          },
          select: { duration: true }
        });

        const drivingHours = pastDrivingLessons.reduce((acc, lesson) => acc + lesson.duration, 0);
        hoursTaught += drivingHours;

        // Fetch upcoming driving lessons
        upcomingDrivingLessons = await prisma.drivingLesson.findMany({
          where: {
            instructorId: instructorProfile.id,
            date: { gte: new Date() },
            status: { in: ["PENDING", "CONFIRMED"] }
          },
          include: {
            student: {
              select: { firstName: true, lastName: true }
            }
          },
          orderBy: [{ date: "asc" }, { startTime: "asc" }],
          take: 5
        });

        drivingLessonsCount = upcomingDrivingLessons.length;
        nextDrivingLesson = upcomingDrivingLessons[0] || null;
      }

      const nextSlot = teachingSlots[0] || null;

      // Combine summaries for Display
      const combinedNextSession = nextDrivingLesson ? {
        id: nextDrivingLesson.id,
        date: nextDrivingLesson.date.toISOString(),
        title: `Cours conduite - ${nextDrivingLesson.student.firstName || ""} ${nextDrivingLesson.student.lastName || ""}`,
        location: nextDrivingLesson.meetingPoint || nextDrivingLesson.city
      } : nextSlot ? {
        id: nextSlot.session.id,
        date: nextSlot.start.toISOString(),
        title: nextSlot.session.course.title + (nextSlot.module ? ` - ${nextSlot.module.title}` : ""),
        location: nextSlot.location || nextSlot.session.location
      } : null;

      const combinedRecentBookings = [
        ...upcomingDrivingLessons.map(l => ({
          id: l.id,
          date: l.date.toISOString(),
          title: `Conduite: ${l.student.firstName} ${l.student.lastName}`,
          location: l.meetingPoint || l.city
        })),
        ...teachingSlots.map(slot => ({
          id: slot.id,
          date: slot.start.toISOString(),
          title: slot.session.course.title + (slot.module ? ` - ${slot.module.title}` : ""),
          location: slot.location || slot.session.location
        }))
      ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0, 5);

      return NextResponse.json({
        role: user.role,
        stats: {
          completedHours: Math.round(hoursTaught * 10) / 10,
          futureSessionsCount: teachingSlots.length + drivingLessonsCount,
          progressPercentage: 0,
          totalHours: 0
        },
        nextSession: combinedNextSession,
        recentBookings: combinedRecentBookings
      });
    }

    // Student Logic (Existing)
    // Calcul des statistiques
    const completedLessons = user.progress.filter(p => p.isCompleted);
    const completedHours = completedLessons.reduce((acc, curr) => acc + (curr.lesson.duration || 0), 0) / 3600; // En heures

    // Pour l'instant, on n'a pas facilement le total des heures du programme entier sans requêtes lourdes, 
    // on va supposer que chaque enrollment ajoute un volume d'heures estimé ou on met 0.
    // Une solution simple : totalHours = sum of all lessons duration in enrolled courses.
    // On simplifie pour l'instant : totalHours = 0 (à implémenter si critique).
    const totalHours = 0;

    // Prochaine session
    const nextBooking = user.sessionBookings[0] || null;
    const futureSessionsCount = user.sessionBookings.length;

    // Taux de réussite (Mock ou basé sur enrollments completed)
    // Ici on prend le % moyen des enrollments
    const averageProgress = user.enrollments.length > 0
      ? user.enrollments.reduce((acc, curr) => acc + curr.progress, 0) / user.enrollments.length
      : 0;

    return NextResponse.json({
      role: user.role,
      stats: {
        completedHours: Math.round(completedHours * 10) / 10,
        totalHours,
        progressPercentage: Math.round(averageProgress),
        futureSessionsCount,
      },
      nextSession: nextBooking ? {
        id: nextBooking.session.id,
        date: nextBooking.session.startsAt,
        title: nextBooking.session.course.title,
        location: nextBooking.session.location
      } : null,
      recentBookings: user.sessionBookings.map(b => ({
        id: b.id,
        date: b.session.startsAt,
        title: b.session.course.title,
        location: b.session.location
      }))
    });


  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

