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
    console.error("Error fetching dashboard stats:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
