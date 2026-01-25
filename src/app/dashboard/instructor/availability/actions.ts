"use server";

import { prisma } from "@/lib/prisma";
import { getOrCreateUser, hasRole } from "@/lib/auth";
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
    licenseTypes?: string[];
}) {
    console.log("🚀 [CREATE_SLOT] Action started", { isRecurring: formData.isRecurring });

    try {
        const user = await getOrCreateUser();
        if (!user) {
            console.warn("🚫 [CREATE_SLOT] No session found");
            return { success: false, error: "Votre session a expiré. Merci de vous reconnecter." };
        }
        console.log("👤 [CREATE_SLOT] User authenticated", user.id);

        // Vérifier que l'utilisateur est instructeur
        if (!hasRole(user, "INSTRUCTOR")) {
            console.warn("🚫 [CREATE_SLOT] User is not an instructor");
            return { success: false, error: "Accès réservé aux instructeurs (ou administrateurs)" };
        }

        // Récupérer le profil instructeur
        const instructorProfile = await prisma.instructorProfile.findUnique({
            where: { userId: user.id },
        });

        if (!instructorProfile) {
            console.warn("🚫 [CREATE_SLOT] Instructor profile not found for user", user.id);
            return { success: false, error: "Profil instructeur introuvable" };
        }

        console.log("📋 [CREATE_SLOT] Instructor profile found", instructorProfile.id);

        // Si récurrent, valider et générer les dates
        if (formData.isRecurring) {
            console.log("🔄 [CREATE_SLOT] Handling recurring slot");
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
                console.warn("⚠️ [CREATE_SLOT] Validation failed", validation.error);
                return { success: false, error: validation.error };
            }

            const dates = generateRecurringDates(
                new Date(),
                formData.recurrencePattern,
                new Date(formData.recurrenceEndDate),
                formData.recurrenceDays
            );

            console.log(`📅 [CREATE_SLOT] Generated ${dates.length} dates`);

            if (dates.length === 0) {
                return { success: false, error: "Aucune date générée pour cette récurrence" };
            }

            const recurrenceGroupId = Date.now().toString(36) + Math.random().toString(36).substring(2);
            console.log("🆔 [CREATE_SLOT] Group ID created", recurrenceGroupId);

            // Créer les créneaux en rafale (plus performant que $transaction avec des crée individuels)
            await prisma.instructorAvailability.createMany({
                data: dates.map((date) => ({
                    instructorId: instructorProfile.id,
                    date,
                    startTime: formData.startTime,
                    endTime: formData.endTime,
                    isRecurring: true,
                    recurrenceGroupId: recurrenceGroupId,
                    licenseTypes: formData.licenseTypes || ["B"],
                })),
            });

            console.log("✅ [CREATE_SLOT] All slots created successfully (recurring batch)");
            revalidatePath("/dashboard/instructor/availability");
            return { success: true };
        } else {
            // Créneau ponctuel
            console.log("📅 [CREATE_SLOT] Handling one-time slot");
            if (!formData.date) {
                return { success: false, error: "Date requise pour un créneau ponctuel" };
            }

            const slotDate = new Date(formData.date);
            if (isNaN(slotDate.getTime())) {
                return { success: false, error: "Format de date invalide" };
            }

            console.log("💾 [CREATE_SLOT] Creating one-time slot in DB...");
            const slot = await prisma.instructorAvailability.create({
                data: {
                    instructorId: instructorProfile.id,
                    date: slotDate,
                    startTime: formData.startTime,
                    endTime: formData.endTime,
                    isRecurring: false,
                    licenseTypes: formData.licenseTypes || ["B"],
                },
            });

            console.log("✅ [CREATE_SLOT] One-time slot created", slot.id);
            revalidatePath("/dashboard/instructor/availability");
            return { success: true, data: slot };
        }
    } catch (error: any) {
        // Important for Next.js: Don't catch redirect errors
        if (error.digest?.includes("NEXT_REDIRECT")) {
            throw error;
        }

        console.error("❌ [CREATE_SLOT] Critical error:", error);
        return {
            success: false,
            error: `Erreur lors de la création : ${error.message || "Erreur inconnue"}`,
            _debug: { message: error.message, stack: error.stack }
        };
    }
}

/**
 * Récupérer les disponibilités d'un instructeur
 */
export async function getMyAvailabilities() {
    const user = await getOrCreateUser();
    if (!user) return { success: false, error: "AUTH_REQUIRED" };

    try {
        const instructorProfile = await prisma.instructorProfile.findUnique({
            where: { userId: user.id },
            include: {
                availabilities: {
                    orderBy: [
                        { date: "asc" },
                        { startTime: "asc" }
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
export async function deleteAvailabilitySlot(slotId: string, deleteAllInGroup: boolean = false) {
    const user = await getOrCreateUser();
    if (!user) return { success: false, error: "AUTH_REQUIRED" };

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

        if (deleteAllInGroup && (slot as any).recurrenceGroupId) {
            // Supprimer tous les futurs créneaux du groupe qui ne sont pas réservés
            await prisma.instructorAvailability.deleteMany({
                where: {
                    recurrenceGroupId: (slot as any).recurrenceGroupId,
                    instructor: { userId: user.id },
                    isBooked: false,
                    date: { gte: slot.date || new Date() }
                } as any
            });
        } else {
            await prisma.instructorAvailability.delete({
                where: { id: slotId },
            });
        }

        revalidatePath("/dashboard/instructor/availability");
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
    const user = await getOrCreateUser();
    if (!user) return { success: false, error: "AUTH_REQUIRED" };

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
    const user = await getOrCreateUser();
    if (!user) return { success: false, error: "AUTH_REQUIRED" };

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

        revalidatePath("/dashboard/instructor/lessons");
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
    const user = await getOrCreateUser();
    if (!user) return { success: false, error: "AUTH_REQUIRED" };

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

        revalidatePath("/dashboard/instructor/lessons");
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
    const user = await getOrCreateUser();
    if (!user) return { success: false, error: "AUTH_REQUIRED" };

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
