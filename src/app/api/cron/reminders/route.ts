
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail, generateReminderEmailHtml } from '@/lib/email';
import { addDays, startOfDay, endOfDay } from 'date-fns';

export const dynamic = 'force-dynamic'; // No caching

export async function GET(request: Request) {
    // Check for secret header to prevent unauthorized calls (if exposing publicly)
    // const authHeader = request.headers.get('authorization');
    // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    //     return new NextResponse('Unauthorized', { status: 401 });
    // }

    try {
        // Target: Sessions starting in 3 days (e.g. Current Date is 20th, Target 23rd)
        // We look for start dates between [Now + 2 days] and [Now + 3.5 days] roughly, or strictly J+3
        const today = new Date();
        const targetDate = addDays(today, 3);
        const startOfTarget = startOfDay(targetDate);
        const endOfTarget = endOfDay(targetDate);

        // Fetch Default Location
        const defaultLocationSetting = await prisma.systemSetting.findUnique({
            where: { key: 'DEFAULT_LOCATION' }
        });
        const defaultLocation = defaultLocationSetting?.value || "Lieu à confirmer";

        // Find sessions
        const upcomingSessions = await prisma.courseSession.findMany({
            where: {
                startDate: {
                    gte: startOfTarget,
                    lte: endOfTarget
                },
                isPublished: true,
            },
            include: {
                course: { select: { title: true } },
                bookings: {
                    include: { user: { select: { email: true, firstName: true, name: true } } }
                }
            }
        });

        const results = [];

        for (const session of upcomingSessions) {
            const isRemote = !!session.meetingUrl;
            const location = session.location || defaultLocation; // Fallback to system default

            for (const booking of session.bookings) {
                const studentName = booking.user.firstName || booking.user.name || "Stagiaire";
                
                const html = generateReminderEmailHtml(studentName, {
                    courseTitle: session.course.title,
                    start: session.startDate,
                    isRemote,
                    location,
                    link: session.meetingUrl || "#"
                });

                const sent = await sendEmail({
                    to: booking.user.email,
                    subject: `Rappel : Votre formation ${session.course.title} dans 3 jours`,
                    html
                });

                results.push({ email: booking.user.email, sessionId: session.id, success: sent.success });
            }
        }

        return NextResponse.json({ 
            success: true, 
            processed: upcomingSessions.length, 
            emailsSent: results.length,
            details: results 
        });

    } catch (error) {
        console.error("Cron Error using Prisma:", error as any);
         // Fallback/Recovery logic if needed
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
    }
}

