"use server";

import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

import { sendEnrollmentConfirmation } from "@/lib/email/transactional";

// ... (existing imports)

export async function enrollUserInSessionAction(formData: FormData) {
    await requireAdmin();

    const sessionId = formData.get("sessionId") as string;
    const userId = formData.get("userId") as string;
    // Optional: Force status (e.g. if paid outside)
    const status = formData.get("status") as string || "BOOKED"; 

    if (!sessionId || !userId) {
        return { error: "Session et Utilisateur requis." };
    }

    try {
        // Fetch session with course AND user details
        const [session, user] = await Promise.all([
            prisma.courseSession.findUnique({
                where: { id: sessionId },
                include: { course: true }
            }),
            prisma.user.findUnique({
                where: { id: userId }
            })
        ]);

        if (!session) return { error: "Session introuvable." };
        if (!user) return { error: "Utilisateur introuvable." };

        // 1. Create Session Booking
        await prisma.courseSessionBooking.create({
            data: {
                courseSessionId: sessionId,
                userId: userId,
                status: status, // BOOKED
            }
        });

        // 2. Ensure Global Enrollment exists
        await prisma.enrollment.upsert({
            where: {
                userId_courseId: {
                    userId,
                    courseId: session.courseId
                }
            },
            update: { status: "ACTIVE" },
            create: {
                userId,
                courseId: session.courseId,
                status: "ACTIVE"
            }
        });

        // 3. Update Spots
        await prisma.courseSession.update({
            where: { id: sessionId },
            data: {
                bookedSpots: { increment: 1 }
            }
        });

        // 4. Send Email
        if (user.email) {
            try {
                await sendEnrollmentConfirmation({
                    userName: user.name || user.email!.split('@')[0],
                    userEmail: user.email!,
                    courseTitle: session.course.title,
                    courseSlug: session.course.slug,
                    enrollmentDate: new Date().toLocaleDateString('fr-FR'),
                });
            } catch (error) {
                console.error("Failed to send session enrollment email:", error);
            }
        }

        revalidatePath(`/admin/sessions/${sessionId}`);
        return { success: true };

    } catch (error: any) {
        console.error("Enrollment error:", error);
        if (error.code === 'P2002') {
             return { error: "Cet élève est déjà inscrit à cette session." };
        }
        return { error: "Erreur lors de l'inscription." };
    }
}

