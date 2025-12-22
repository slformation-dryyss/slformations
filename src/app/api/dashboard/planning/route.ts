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

    if (user.role === "INSTRUCTOR" || user.role === "ADMIN") {
        // Collect Main Teacher Sessions
        const mainSessions = await prisma.courseSession.findMany({
            where: { mainTeacherId: user.id },
            include: { course: true }
        });

        // Map Main Sessions
        const mainEvents = mainSessions.map(session => ({
            id: session.id,
            title: session.course.title,
            start: session.startDate.toISOString(),
            end: session.endDate.toISOString(),
            location: session.location,
            meetingUrl: session.meetingUrl,
            type: "TEACHING",
            courseType: session.course.type,
            role: "MAIN_TEACHER"
        }));

        // Map Slots (Specific assignments)
        const slotEvents = user.teachingSlots.map(slot => ({
            id: slot.id,
            title: `${slot.session.course.title} ${slot.module?.title ? `(${slot.module.title})` : ''}`,
            start: slot.start.toISOString(),
            end: slot.end.toISOString(),
            location: slot.location || slot.session.location,
            meetingUrl: slot.meetingUrl || slot.session.meetingUrl,
            type: "TEACHING",
            courseType: slot.session.course.type,
            role: "INSTRUCTOR"
        }));

        events = [...mainEvents, ...slotEvents];

    } else {
        // Student View
        events = user.sessionBookings.map(booking => {
            const session = booking.session;
            return {
                id: booking.id,
                title: session.course.title,
                start: session.startDate.toISOString(),
                end: session.endDate.toISOString(),
                location: session.location,
                meetingUrl: session.meetingUrl,
                type: "LEARNING",
                courseType: session.course.type
            };
        });
    }

    return NextResponse.json({ events });

  } catch (error) {
    console.error("Error fetching planning:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
