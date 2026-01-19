"use server";

import { prisma } from "@/lib/prisma";
import { requireUser, hasRole } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import {
    generateRecurringDates,
    validateRecurringSlot,
    type RecurrencePattern,
} from "@/lib/lessons/recurrence";
import { notifyLessonConfirmed, notifyLessonCancelled } from "@/lib/lessons/notifications";

/**
 * Créer un créneau de disponibilité (ponctuel ou récurrent)
 */
export async function createAvailabilitySlot(formData: {
    date?: string; // ISO date pour ponctuel
    startTime: string; // "HH:mm"
    endTime: string; // "HH:mm"
    isRecurring: boolean;
    recurrencePattern?: RecurrencePattern;
    recurrenceDays?: number[];
    recurrenceEndDate?: string; // ISO date
}) {
    const user = await requireUser();

    // Vérifier que l'utilisateur est instructeur
    if (!hasRole(user, "INSTRUCTOR")) {
        return { success: false, error: "Accès réservé aux instructeurs (ou administrateurs)" };
    }

    // Récupérer le profil instructeur
    const instructorProfile = await prisma.instructorProfile.findUnique({
        where: { userId: user.id },
    });

    if (!instructorProfile) {
        return { success: false, error: "Profil instructeur introuvable" };
    }

    try {
        // Si récurrent, valider et générer les dates
        if (formData.isRecurring) {
            if (!formData.recurrencePattern || !formData.recurrenceEndDate) {
                return {
                    success: false,
                    error: "Pattern et date de fin requis pour un créneau récurrent",
                };
            }

            const validation = validateRecurringSlot({
                startTime: formData.startTime,
                endTime: formData.endTime,
                recurrencePattern: formData.recurrencePattern,
                recurrenceDays: formData.recurrenceDays,
                recurrenceEndDate: new Date(formData.recurrenceEndDate),
            });

            if (!validation.valid) {
                return { success: false, error: validation.error };
            }

            // Créer le créneau récurrent
            const slot = await prisma.instructorAvailability.create({
                data: {
                    instructorId: instructorProfile.id,
                    startTime: formData.startTime,
                    endTime: formData.endTime,
                    isRecurring: true,
                    recurrencePattern: formData.recurrencePattern,
                    recurrenceDays: formData.recurrenceDays || [],
                    recurrenceEndDate: new Date(formData.recurrenceEndDate),
                },
            });

            revalidatePath("/instructor/availability");
            return { success: true, data: slot };
        } else {
            // Créneau ponctuel
            if (!formData.date) {
                return { success: false, error: "Date requise pour un créneau ponctuel" };
            }

            const slot = await prisma.instructorAvailability.create({
                data: {
                    instructorId: instructorProfile.id,
                    date: new Date(formData.date),
                    startTime: formData.startTime,
                    endTime: formData.endTime,
                    isRecurring: false,
                },
            });

            revalidatePath("/instructor/availability");
            return { success: true, data: slot };
        }
    } catch (error: any) {
        console.error("Error creating availability slot:", error);
        return { success: false, error: error.message || "Erreur lors de la création du créneau" };
    }
}

/**
 * Récupérer les disponibilités d'un instructeur
 */
export async function getMyAvailabilities() {
    const user = await requireUser();

    if (!hasRole(user, "INSTRUCTOR")) {
        return { success: false, error: "Accès réservé aux instructeurs (ou administrateurs)" };
    }

    try {
        const instructorProfile = await prisma.instructorProfile.findUnique({
            where: { userId: user.id },
            include: {
                availabilities: {
                    orderBy: [
                        { isRecurring: "desc" }, // Recurring first
                        { date: "asc" },         // Then by date for one-time slots
                        { startTime: "asc" }     // Then by start time
                    ],
                    include: {
                        lessons: {
                            select: {
                                id: true,
                                status: true,
                                student: {
                                    select: { firstName: true, lastName: true },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (!instructorProfile) {
            return { success: false, error: "Profil instructeur introuvable" };
        }

        return { success: true, data: instructorProfile.availabilities || [] };
    } catch (error: any) {
        console.error("Error fetching instructor availabilities:", error);
        return { success: false, error: error.message || "Erreur lors de la récupération des disponibilités" };
    }
}

/**
 * Supprimer un créneau de disponibilité
 */
export async function deleteAvailabilitySlot(slotId: string) {
    const user = await requireUser();

    if (!hasRole(user, "INSTRUCTOR")) {
        return { success: false, error: "Accès réservé aux instructeurs (ou administrateurs)" };
    }

    try {
        // Vérifier que le créneau appartient à l'instructeur
        const slot = await prisma.instructorAvailability.findFirst({
            where: {
                id: slotId,
                instructor: {
                    userId: user.id,
                },
            },
            include: {
                lessons: {
                    where: {
                        status: { in: ["PENDING", "CONFIRMED"] },
                    },
                },
            },
        });

        if (!slot) {
            return { success: false, error: "Créneau introuvable" };
        }

        // Vérifier qu'il n'y a pas de cours réservés
        if (slot.lessons.length > 0) {
            return {
                success: false,
                error: "Impossible de supprimer un créneau avec des cours réservés",
            };
        }

        await prisma.instructorAvailability.delete({
            where: { id: slotId },
        });

        revalidatePath("/instructor/availability");
        return { success: true };
    } catch (error: any) {
        console.error("Error deleting availability slot:", error);
        return { success: false, error: error.message || "Erreur lors de la suppression" };
    }
}

/**
 * Récupérer les cours réservés de l'instructeur
 */
export async function getMyLessons(status?: string) {
    const user = await requireUser();

    if (!hasRole(user, "INSTRUCTOR")) {
        return { success: false, error: "Accès réservé aux instructeurs (ou administrateurs)" };
    }

    try {
        const instructorProfile = await prisma.instructorProfile.findUnique({
            where: { userId: user.id },
        });

        if (!instructorProfile) {
            return { success: false, error: "Profil instructeur introuvable" };
        }

        const lessons = await prisma.drivingLesson.findMany({
            where: {
                instructorId: instructorProfile.id,
                ...(status && { status }),
            },
            include: {
                student: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        phone: true,
                    },
                },
            },
            orderBy: [{ date: "asc" }, { startTime: "asc" }],
        });

        return { success: true, data: lessons || [] };
    } catch (error: any) {
        console.error("Error fetching instructor lessons:", error);
        return { success: false, error: error.message || "Erreur lors de la récupération des cours" };
    }
}

/**
 * Confirmer un cours (côté instructeur)
 */
export async function confirmLesson(lessonId: string) {
    const user = await requireUser();

    if (!hasRole(user, "INSTRUCTOR")) {
        return { success: false, error: "Accès réservé aux instructeurs (ou administrateurs)" };
    }

    try {
        const lesson = await prisma.drivingLesson.findFirst({
            where: {
                id: lessonId,
                instructor: {
                    userId: user.id,
                },
            },
        });

        if (!lesson) {
            return { success: false, error: "Cours introuvable" };
        }

        if (lesson.status !== "PENDING") {
            return { success: false, error: "Ce cours ne peut plus être confirmé" };
        }

        // Marquer comme confirmé par l'instructeur
        const updated = await prisma.drivingLesson.update({
            where: { id: lessonId },
            data: {
                instructorConfirmed: true,
                // Si les deux ont confirmé, passer en CONFIRMED
                ...(lesson.studentConfirmed && {
                    status: "CONFIRMED",
                    confirmedAt: new Date(),
                }),
            },
        });

        // Notification à l'élève
        const student = await prisma.user.findUnique({
            where: { id: lesson.studentId },
            select: { email: true, firstName: true, lastName: true }
        });

        if (student && updated.status === "CONFIRMED") {
            await notifyLessonConfirmed(student.email!, {
                date: lesson.date,
                startTime: lesson.startTime,
                endTime: lesson.endTime,
                studentName: `${student.firstName} ${student.lastName}`,
                instructorName: `${user.firstName} ${user.lastName}`,
            });
        }

        revalidatePath("/instructor/lessons");
        return { success: true, data: updated };
    } catch (error: any) {
        console.error("Error confirming lesson:", error);
        return { success: false, error: error.message || "Erreur lors de la confirmation" };
    }
}

/**
 * Refuser un cours
 */
export async function rejectLesson(lessonId: string, reason?: string) {
    const user = await requireUser();

    if (!hasRole(user, "INSTRUCTOR")) {
        return { success: false, error: "Accès réservé aux instructeurs (ou administrateurs)" };
    }

    try {
        const lesson = await prisma.drivingLesson.findFirst({
            where: {
                id: lessonId,
                instructor: {
                    userId: user.id,
                },
            },
        });

        if (!lesson) {
            return { success: false, error: "Cours introuvable" };
        }

        if (lesson.status !== "PENDING") {
            return { success: false, error: "Ce cours ne peut plus être refusé" };
        }

        // Annuler le cours
        const updated = await prisma.drivingLesson.update({
            where: { id: lessonId },
            data: {
                status: "CANCELLED",
                cancelledAt: new Date(),
                cancelledBy: user.id,
                cancellationReason: reason || "Refusé par l'instructeur",
            },
        });

        // Notification à l'élève
        const student = await prisma.user.findUnique({
            where: { id: lesson.studentId },
            select: { email: true, firstName: true, lastName: true }
        });

        if (student) {
            await notifyLessonCancelled(
                student.email!,
                `${student.firstName} ${student.lastName}`,
                {
                    date: lesson.date,
                    startTime: lesson.startTime,
                    endTime: lesson.endTime,
                    studentName: `${student.firstName} ${student.lastName}`,
                    instructorName: `${user.firstName} ${user.lastName}`,
                },
                `${user.firstName} ${user.lastName}`,
                reason || "Refusé par l'instructeur"
            );
        }

        // Libérer le créneau
        if (lesson.availabilityId) {
            await prisma.instructorAvailability.update({
                where: { id: lesson.availabilityId },
                data: { isBooked: false },
            });
        }

        revalidatePath("/instructor/lessons");
        return { success: true, data: updated };
    } catch (error: any) {
        console.error("Error rejecting lesson:", error);
        return { success: false, error: error.message || "Erreur lors du refus" };
    }
}

/**
 * Récupérer les élèves attribués à l'instructeur
 */
export async function getMyStudents() {
    const user = await requireUser();

    if (!hasRole(user, "INSTRUCTOR")) {
        return { success: false, error: "Accès réservé aux instructeurs (ou administrateurs)" };
    }

    try {
        const instructorProfile = await prisma.instructorProfile.findUnique({
            where: { userId: user.id },
        });

        if (!instructorProfile) {
            return { success: false, error: "Profil instructeur introuvable" };
        }

        const assignments = await prisma.instructorAssignment.findMany({
            where: {
                instructorId: instructorProfile.id,
                isActive: true,
            },
            include: {
                student: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        phone: true,
                        city: true,
                        addressLine1: true,
                        postalCode: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        // Transformer pour n'avoir que l'objet student avec les infos d'attribution
        const students = assignments.map(a => ({
            ...a.student,
            courseType: a.courseType,
            assignedAt: a.createdAt,
        }));

        return { success: true, data: students || [] };
    } catch (error: any) {
        console.error("Error fetching instructor students:", error);
        return { success: false, error: error.message || "Erreur lors de la récupération des élèves" };
    }
}
