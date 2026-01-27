"use server";

import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { canCancelLesson, shouldDeductHour, isSlotAvailable } from "@/lib/lessons/validation";
import { getStudentInstructor } from "@/lib/lessons/assignment";
import { notifyLessonBooked, notifyLessonCancelled, notifyChangeRequest } from "@/lib/lessons/notifications";

/**
 * Récupérer les créneaux disponibles de l'instructeur attitré (étendu sur 14 jours)
 */
export async function getAvailableSlots(courseType: string = "PERMIS_B") {
    const user = await getOrCreateUser();
    if (!user) return { success: false, error: "AUTH_REQUIRED" };

    const assignment = await getStudentInstructor(user.id, courseType);
    if (!assignment) return { success: false, error: "Aucun instructeur attitré" };

    const licenseFilter = courseType.replace("PERMIS_", "");

    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + 14);

    const availabilities = await prisma.instructorAvailability.findMany({
        where: {
            instructorId: assignment.instructorId,
            isBooked: false,
            date: { gte: startDate, lte: endDate },
            licenseTypes: { has: licenseFilter }
        },
        orderBy: [{ date: "asc" }, { startTime: "asc" }],
    });

    return {
        success: true,
        data: {
            instructor: assignment.instructor,
            availabilities,
        },
    };
}

/**
 * Réserver un cours
 */
export async function bookLesson(data: {
    availabilityId: string;
    date: string; // ISO date
    startTime: string;
    endTime: string;
    duration: number;
    meetingPoint?: string;
    notes?: string;
    courseType?: string;
}) {
    const user = await getOrCreateUser();
    if (!user) return { success: false, error: "AUTH_REQUIRED" };
    const courseType = data.courseType || "PERMIS_B";

    try {
        // Vérifier l'attribution
        const assignment = await getStudentInstructor(user.id, courseType);
        if (!assignment) {
            return { success: false, error: "Aucun instructeur attitré" };
        }

        // Vérifier que le créneau existe et est disponible
        const availability = await prisma.instructorAvailability.findUnique({
            where: { id: data.availabilityId },
            include: {
                instructor: {
                    select: { city: true },
                },
            },
        });

        if (!availability) {
            return { success: false, error: "Créneau introuvable" };
        }

        // Vérifier la compatibilité du type de permis
        const licenseFilter = courseType.replace("PERMIS_", "");
        if (availability.licenseTypes && !availability.licenseTypes.includes(licenseFilter)) {
            return { success: false, error: `Ce moniteur ne propose pas de cours de type ${licenseFilter} sur ce créneau.` };
        }

        if (availability.isBooked) {
            return { success: false, error: "Ce créneau est déjà réservé" };
        }

        // Vérifier les chevauchements
        const existingLessons = await prisma.drivingLesson.findMany({
            where: {
                studentId: user.id,
                date: new Date(data.date),
                status: { in: ["PENDING", "CONFIRMED"] },
            },
            select: {
                date: true,
                startTime: true,
                endTime: true,
                status: true,
            },
        });

        const slotCheck = isSlotAvailable(
            new Date(data.date),
            data.startTime,
            data.endTime,
            existingLessons as any
        );

        if (!slotCheck.available) {
            return { success: false, error: slotCheck.reason };
        }

        // --- NOUVEAU: Vérifier le solde d'heures ---
        const userWithBalance = await prisma.user.findUnique({
            where: { id: user.id },
            select: { drivingBalance: true }
        });

        if (!userWithBalance || userWithBalance.drivingBalance < (data.duration * 60)) {
            const missingMin = (data.duration * 60) - (userWithBalance?.drivingBalance || 0);
            const missingHours = Math.ceil(missingMin / 60);
            return {
                success: false,
                error: `Solde insuffisant. Il vous manque ${missingHours}h pour réserver ce créneau.`,
                code: "INSUFFICIENT_BALANCE"
            };
        }

        // Créer la réservation
        const lesson = await prisma.drivingLesson.create({
            data: {
                studentId: user.id,
                instructorId: assignment.instructorId,
                availabilityId: data.availabilityId,
                date: new Date(data.date),
                startTime: data.startTime,
                endTime: data.endTime,
                duration: data.duration,
                city: availability.instructor.city,
                meetingPoint: data.meetingPoint,
                studentNotes: data.notes,
                status: "PENDING",
                studentConfirmed: true, // L'élève confirme en réservant
            },
        });

        // Débiter le solde (duration est en heures, le solde est en minutes)
        await prisma.user.update({
            where: { id: user.id },
            data: { drivingBalance: { decrement: data.duration * 60 } }
        });

        // Marquer le créneau comme réservé
        await prisma.instructorAvailability.update({
            where: { id: data.availabilityId },
            data: { isBooked: true },
        });

        // Notifications
        const instructor = await prisma.user.findUnique({
            where: { id: assignment.instructorId },
            select: { email: true, firstName: true, lastName: true }
        });

        if (instructor) {
            await notifyLessonBooked(
                user.email!,
                instructor.email,
                {
                    date: new Date(data.date),
                    startTime: data.startTime,
                    endTime: data.endTime,
                    studentName: `${user.firstName} ${user.lastName}`,
                    instructorName: `${instructor.firstName} ${instructor.lastName}`,
                    meetingPoint: data.meetingPoint,
                }
            );
        }

        revalidatePath("/dashboard/driving-lessons");
        return { success: true, data: lesson };
    } catch (error: any) {
        console.error("Error booking lesson:", error);
        return { success: false, error: error.message || "Erreur lors de la réservation" };
    }
}

/**
 * Annuler un cours
 */
export async function cancelLesson(lessonId: string, reason?: string) {
    const user = await getOrCreateUser();
    if (!user) return { success: false, error: "AUTH_REQUIRED" };

    try {
        const lesson = await prisma.drivingLesson.findFirst({
            where: {
                id: lessonId,
                studentId: user.id,
            },
        });

        if (!lesson) {
            return { success: false, error: "Cours introuvable" };
        }

        if (lesson.status === "CANCELLED") {
            return { success: false, error: "Ce cours est déjà annulé" };
        }

        if (lesson.status === "COMPLETED") {
            return { success: false, error: "Impossible d'annuler un cours terminé" };
        }

        // Vérifier la règle des 48h
        const cancellationCheck = canCancelLesson(lesson.date, lesson.startTime);
        const shouldDeduct = shouldDeductHour(
            lesson.date,
            lesson.startTime,
            false, // Pas une urgence pour l'instant
            false
        );

        // Annuler le cours
        const updated = await prisma.drivingLesson.update({
            where: { id: lessonId },
            data: {
                status: "CANCELLED",
                cancelledAt: new Date(),
                cancelledBy: user.id,
                cancellationReason: reason,
                isDeducted: shouldDeduct,
            },
        });

        // --- NOUVEAU: Recréditer le solde si annulation valide (duration est en heures, le solde est en minutes)
        if (!shouldDeduct) {
            await prisma.user.update({
                where: { id: user.id },
                data: { drivingBalance: { increment: lesson.duration * 60 } }
            });
        }

        // Libérer le créneau si applicable
        if (lesson.availabilityId) {
            await prisma.instructorAvailability.update({
                where: { id: lesson.availabilityId },
                data: { isBooked: false },
            });
        }

        // Notification à l'instructeur
        const instructor = await prisma.instructorProfile.findUnique({
            where: { id: lesson.instructorId },
            include: { user: { select: { email: true, firstName: true, lastName: true } } }
        });

        if (instructor) {
            await notifyLessonCancelled(
                instructor.user.email,
                `${instructor.user.firstName} ${instructor.user.lastName}`,
                {
                    date: lesson.date,
                    startTime: lesson.startTime,
                    endTime: lesson.endTime,
                    studentName: `${user.firstName} ${user.lastName}`,
                    instructorName: `${instructor.user.firstName} ${instructor.user.lastName}`,
                },
                `${user.firstName} ${user.lastName}`,
                reason
            );
        }

        revalidatePath("/dashboard/driving-lessons");

        return {
            success: true,
            data: updated,
            warning: shouldDeduct
                ? "Annulation tardive : l'heure sera décomptée. Pour une urgence justifiée, contactez l'administration."
                : undefined,
        };
    } catch (error: any) {
        console.error("Error cancelling lesson:", error);
        return { success: false, error: error.message || "Erreur lors de l'annulation" };
    }
}

/**
 * Récupérer les cours de l'élève
 */
export async function getMyLessonsAsStudent(courseType: string = "PERMIS_B") {
    const user = await getOrCreateUser();
    if (!user) return { success: false, error: "AUTH_REQUIRED" };

    const lessons = await prisma.drivingLesson.findMany({
        where: {
            studentId: user.id,
        },
        include: {
            instructor: {
                include: {
                    user: {
                        select: {
                            firstName: true,
                            lastName: true,
                            email: true,
                            phone: true,
                        },
                    },
                },
            },
        },
        orderBy: [{ date: "desc" }, { startTime: "desc" }],
    });

    return { success: true, data: lessons };
}

/**
 * Demander un changement d'instructeur
 */
export async function requestInstructorChange(data: {
    currentInstructorId: string;
    reason: string;
    details?: string;
    preferredGender?: "MALE" | "FEMALE" | "NO_PREFERENCE";
    requestedInstructorId?: string;
    courseType: string;
}) {
    const user = await getOrCreateUser();
    if (!user) return { success: false, error: "AUTH_REQUIRED" };

    try {
        const changeRequest = await prisma.changeRequest.create({
            data: {
                studentId: user.id,
                currentInstructorId: data.currentInstructorId,
                requestedInstructorId: data.requestedInstructorId,
                courseType: data.courseType,
                reason: data.reason,
                details: data.details,
                preferredGender: data.preferredGender,
                status: "PENDING",
            },
        });

        // Notification aux administrateurs
        const admins = await prisma.user.findMany({
            where: { role: "ADMIN" },
            select: { email: true }
        });

        for (const admin of admins) {
            await notifyChangeRequest(
                admin.email,
                `${user.firstName} ${user.lastName}`,
                data.reason
            );
        }

        revalidatePath("/dashboard/driving-lessons");
        return { success: true, data: changeRequest };
    } catch (error: any) {
        console.error("Error requesting instructor change:", error);
        return { success: false, error: error.message || "Erreur lors de la demande" };
    }
}

/**
 * Récupérer le solde de l'élève
 */
export async function getMyDrivingBalance() {
    const user = await getOrCreateUser();
    if (!user) return { success: false, error: "AUTH_REQUIRED" };

    const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: { drivingBalance: true }
    });

    return {
        success: true,
        data: {
            minutes: dbUser?.drivingBalance || 0,
            hours: Math.floor((dbUser?.drivingBalance || 0) / 60)
        }
    };
}
