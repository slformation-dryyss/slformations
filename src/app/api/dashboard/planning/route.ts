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
        sessionBookings: {
          where: {
             status: { not: 'CANCELLED' }
          },
          include: {
            session: {
              include: {
                course: true
              }
            }
          },
          orderBy: {
            session: {
              startsAt: 'asc'
            }
          }
        },
        teachingSlots: { // For instructors
             include: {
                 module: true,
                 session: {
                     include: {
                         course: true
                     }
                 }
             }
        }
      }
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Combine bookings and teaching slots based on role (though user usually has one role)
    // If student, use sessionBookings. If instructor, use teachingSlots (or both if hybrid?)
    
    let events = [];

    // 1. Collect Learning Events (All roles can be students)
    const legacyLearningEvents = user.sessionBookings.map(booking => {
        const session = booking.session;
        return {
            id: booking.id,
            title: session.course.title,
            start: session.startsAt.toISOString(),
            end: session.endsAt.toISOString(),
            location: session.location,
            type: "LEARNING",
            courseType: session.course.type,
            source: 'LEGACY'
        };
    });

    const modernBookings = await prisma.courseSessionBooking.findMany({
        where: { 
            userId: user.id,
            status: { not: 'CANCELLED' }
        },
        include: {
            courseSession: {
                include: {
                    course: true,
                    slots: {
                        include: {
                            module: true
                        },
                        orderBy: {
                            start: 'asc'
                        }
                    }
                }
            }
        }
    });

    const modernLearningEvents = modernBookings.map(booking => {
        const session = booking.courseSession as any;
        return {
            id: booking.id,
            title: session.course.title,
            start: session.startDate.toISOString(),
            end: session.endDate.toISOString(),
            location: session.location,
            meetingUrl: session.meetingUrl,
            format: session.format,
            type: "LEARNING",
            courseType: session.course.type,
            source: 'MODERN',
            slots: session.slots.map((s: any) => ({
                id: s.id,
                title: s.module?.title || "Module",
                start: s.start.toISOString(),
                end: s.end.toISOString(),
                location: s.location,
                meetingUrl: s.meetingUrl,
                dayNumber: s.module?.dayNumber,
                duration: s.module?.duration
            }))
        };
    });

    // 2. Collect Teaching Events (For Instructors and Admins)
    let teachingEvents: any[] = [];
    if (user.role === "INSTRUCTOR" || user.role === "ADMIN") {
        const mainSessions = await prisma.courseSession.findMany({
            where: { mainTeacherId: user.id },
            include: { 
                course: true,
                slots: {
                    include: { module: true },
                    orderBy: { start: 'asc' }
                }
            }
        });

        const mainTeacherEvents = mainSessions.map((session: any) => ({
            id: session.id,
            title: `[ENSEIGNANT] ${session.course.title}`,
            start: session.startDate.toISOString(),
            end: session.endDate.toISOString(),
            location: session.location,
            meetingUrl: session.meetingUrl,
            format: session.format,
            type: "TEACHING",
            courseType: session.course.type,
            role: "MAIN_TEACHER",
            slots: session.slots.map((s: any) => ({
                id: s.id,
                title: s.module?.title || "Module",
                start: s.start.toISOString(),
                end: s.end.toISOString(),
                location: s.location,
                meetingUrl: s.meetingUrl,
                dayNumber: s.module?.dayNumber,
                duration: s.module?.duration
            }))
        }));

        const slotEvents = user.teachingSlots.map((slot: any) => ({
            id: slot.id,
            title: `[SLOT] ${slot.session.course.title} ${slot.module?.title ? `(${slot.module.title})` : ''}`,
            start: slot.start.toISOString(),
            end: slot.end.toISOString(),
            location: slot.location || slot.session.location,
            meetingUrl: slot.meetingUrl || slot.session.meetingUrl,
            format: slot.session.format,
            type: "TEACHING",
            courseType: slot.session.course.type,
            role: "INSTRUCTOR"
        }));

        teachingEvents = [...mainTeacherEvents, ...slotEvents];
    }

    events = [...legacyLearningEvents, ...modernLearningEvents, ...teachingEvents];

    return NextResponse.json({ events });

  } catch (error) {
    console.error("Error fetching planning:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

