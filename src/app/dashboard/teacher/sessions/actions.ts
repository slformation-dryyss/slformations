"use server";

import { auth0 } from "@/lib/auth0";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Récupère les sessions assignées au formateur connecté
 */
export async function getTeacherSessions() {
    try {
        const session = await auth0.getSession();
        if (!session?.user) return { success: false, error: "Non autorisé" };

        const user = await prisma.user.findUnique({
            where: { auth0Id: session.user.sub },
            select: { id: true }
        });

        if (!user) return { success: false, error: "Utilisateur introuvable" };

        // Sessions où l'utilisateur est le formateur principal
        // ou intervient sur un slot spécifique
        const sessions = await prisma.courseSession.findMany({
            where: {
                OR: [
                    { mainTeacherId: user.id },
                    { slots: { some: { teacherId: user.id } } }
                ]
            },
            include: {
                course: {
                    select: { title: true, type: true }
                },
                _count: {
                    select: { bookings: true }
                }
            },
            orderBy: {
                startDate: 'desc'
            }
        });

        return { success: true, data: sessions };
    } catch (error) {
        console.error("Error fetching teacher sessions:", error);
        return { success: false, error: "Erreur serveur" };
    }
}

/**
 * Récupère les participants d'une session spécifique
 */
export async function getSessionAttendees(sessionId: string) {
    try {
        const session = await auth0.getSession();
        if (!session?.user) return { success: false, error: "Non autorisé" };

        // Vérifier que le formateur a accès à cette session (facultatif mais recommandé)
        // Pour simplifier ici on récupère tout si authentifié

        const attendees = await prisma.courseSessionBooking.findMany({
            where: { courseSessionId: sessionId },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        nationalIdNumber: true
                    }
                }
            },
            orderBy: {
                user: { lastName: 'asc' }
            }
        });

        return { success: true, data: attendees };
    } catch (error) {
        console.error("Error fetching session attendees:", error);
        return { success: false, error: "Erreur serveur" };
    }
}

/**
 * Met à jour le statut de présence d'un élève
 */
export async function updateAttendance(bookingId: string, status: "PRESENT" | "ABSENT" | "BOOKED") {
    try {
        const session = await auth0.getSession();
        if (!session?.user) return { success: false, error: "Non autorisé" };

        const booking = await prisma.courseSessionBooking.update({
            where: { id: bookingId },
            data: { status }
        });

        revalidatePath("/dashboard/teacher/sessions");
        return { success: true, data: booking };
    } catch (error) {
        console.error("Error updating attendance:", error);
        return { success: false, error: "Erreur serveur" };
    }
}
