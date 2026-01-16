"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { assignInstructorToStudent, changeInstructor } from "@/lib/lessons/assignment";
import { notifyChangeRequestApproved, notifyChangeRequestRejected } from "@/lib/lessons/notifications";

/**
 * Attribuer manuellement un instructeur à un élève
 */
export async function assignInstructorManually(data: {
    studentId: string;
    instructorId: string;
    courseType: string;
    reason?: string;
}) {
    await requireAdmin();

    try {
        // Vérifier si une attribution existe déjà
        const existingAssignment = await prisma.instructorAssignment.findFirst({
            where: {
                studentId: data.studentId,
                courseType: data.courseType,
                isActive: true,
            },
        });

        if (existingAssignment) {
            // Désactiver l'ancienne attribution
            await changeInstructor(
                data.studentId,
                existingAssignment.instructorId,
                data.instructorId,
                data.courseType,
                "MANUAL"
            );
        } else {
            // Créer une nouvelle attribution
            await prisma.instructorAssignment.create({
                data: {
                    studentId: data.studentId,
                    instructorId: data.instructorId,
                    courseType: data.courseType,
                    assignmentReason: "MANUAL",
                    isActive: true,
                },
            });
        }

        revalidatePath("/admin/driving-lessons");
        return { success: true };
    } catch (error: any) {
        console.error("Error assigning instructor:", error);
        return { success: false, error: error.message || "Erreur lors de l'attribution" };
    }
}

/**
 * Approuver une demande de changement d'instructeur
 */
export async function approveChangeRequest(requestId: string, newInstructorId?: string) {
    const admin = await requireAdmin();

    try {
        const request = await prisma.changeRequest.findUnique({
            where: { id: requestId },
            include: {
                student: true,
                currentInstructor: true,
            },
        });

        if (!request) {
            return { success: false, error: "Demande introuvable" };
        }

        if (request.status !== "PENDING") {
            return { success: false, error: "Cette demande a déjà été traitée" };
        }

        // Déterminer le nouvel instructeur
        const targetInstructorId = newInstructorId || request.requestedInstructorId;

        if (!targetInstructorId) {
            return { success: false, error: "Aucun instructeur cible spécifié" };
        }

        // Effectuer le changement
        await changeInstructor(
            request.studentId,
            request.currentInstructorId,
            targetInstructorId,
            "PERMIS_B", // TODO: récupérer le courseType depuis la demande
            "PREFERENCE_CHANGE"
        );

        // Marquer la demande comme approuvée
        await prisma.changeRequest.update({
            where: { id: requestId },
            data: {
                status: "APPROVED",
                reviewedBy: admin.id,
                reviewedAt: new Date(),
            },
        });

        // Notifications
        const student = await prisma.user.findUnique({
            where: { id: request.studentId },
            select: { email: true, firstName: true, lastName: true }
        });

        const newInstructor = await prisma.instructorProfile.findUnique({
            where: { id: targetInstructorId },
            include: { user: { select: { firstName: true, lastName: true } } }
        });

        if (student && newInstructor) {
            await notifyChangeRequestApproved(
                student.email!,
                `${student.firstName} ${student.lastName}`,
                `${newInstructor.user.firstName} ${newInstructor.user.lastName}`
            );
        }

        revalidatePath("/admin/driving-lessons");
        return { success: true };
    } catch (error: any) {
        console.error("Error approving change request:", error);
        return { success: false, error: error.message || "Erreur lors de l'approbation" };
    }
}

/**
 * Rejeter une demande de changement d'instructeur
 */
export async function rejectChangeRequest(requestId: string, reviewNotes?: string) {
    const admin = await requireAdmin();

    try {
        const request = await prisma.changeRequest.findUnique({
            where: { id: requestId },
        });

        if (!request) {
            return { success: false, error: "Demande introuvable" };
        }

        if (request.status !== "PENDING") {
            return { success: false, error: "Cette demande a déjà été traitée" };
        }

        await prisma.changeRequest.update({
            where: { id: requestId },
            data: {
                status: "REJECTED",
                reviewedBy: admin.id,
                reviewedAt: new Date(),
                reviewNotes,
            },
        });

        // Notifications
        const student = await prisma.user.findUnique({
            where: { id: request.studentId },
            select: { email: true, firstName: true, lastName: true }
        });

        if (student) {
            await notifyChangeRequestRejected(
                student.email!,
                `${student.firstName} ${student.lastName}`,
                reviewNotes
            );
        }

        revalidatePath("/admin/driving-lessons");
        return { success: true };
    } catch (error: any) {
        console.error("Error rejecting change request:", error);
        return { success: false, error: error.message || "Erreur lors du rejet" };
    }
}

/**
 * Valider une annulation d'urgence
 */
export async function validateUrgentCancellation(lessonId: string, approved: boolean, notes?: string) {
    const admin = await requireAdmin();

    try {
        const lesson = await prisma.drivingLesson.findUnique({
            where: { id: lessonId },
        });

        if (!lesson) {
            return { success: false, error: "Cours introuvable" };
        }

        if (!lesson.isUrgentCancellation) {
            return { success: false, error: "Ce cours n'est pas marqué comme urgence" };
        }

        if (lesson.urgencyValidatedBy) {
            return { success: false, error: "Cette urgence a déjà été validée" };
        }

        await prisma.drivingLesson.update({
            where: { id: lessonId },
            data: {
                urgencyValidatedBy: admin.id,
                isDeducted: !approved, // Si approuvé, ne pas décompter
                instructorNotes: notes,
            },
        });

        revalidatePath("/admin/driving-lessons");
        return { success: true };
    } catch (error: any) {
        console.error("Error validating urgent cancellation:", error);
        return { success: false, error: error.message || "Erreur lors de la validation" };
    }
}

/**
 * Récupérer toutes les demandes de changement en attente
 */
export async function getPendingChangeRequests() {
    await requireAdmin();

    const requests = await prisma.changeRequest.findMany({
        where: { status: "PENDING" },
        include: {
            student: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                },
            },
            currentInstructor: {
                include: {
                    user: {
                        select: {
                            firstName: true,
                            lastName: true,
                        },
                    },
                },
            },
            requestedInstructor: {
                include: {
                    user: {
                        select: {
                            firstName: true,
                            lastName: true,
                        },
                    },
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });

    return { success: true, data: requests };
}

/**
 * Récupérer les statistiques du système de réservation
 */
export async function getDrivingLessonsStats() {
    await requireAdmin();

    const [
        totalLessons,
        pendingLessons,
        confirmedLessons,
        completedLessons,
        cancelledLessons,
        activeInstructors,
        activeAssignments,
        pendingChangeRequests,
    ] = await Promise.all([
        prisma.drivingLesson.count(),
        prisma.drivingLesson.count({ where: { status: "PENDING" } }),
        prisma.drivingLesson.count({ where: { status: "CONFIRMED" } }),
        prisma.drivingLesson.count({ where: { status: "COMPLETED" } }),
        prisma.drivingLesson.count({ where: { status: "CANCELLED" } }),
        prisma.instructorProfile.count({ where: { isActive: true } }),
        prisma.instructorAssignment.count({ where: { isActive: true } }),
        prisma.changeRequest.count({ where: { status: "PENDING" } }),
    ]);

    return {
        success: true,
        data: {
            totalLessons,
            pendingLessons,
            confirmedLessons,
            completedLessons,
            cancelledLessons,
            activeInstructors,
            activeAssignments,
            pendingChangeRequests,
        },
    };
}
/**
 * Récupérer tous les instructeurs avec leurs profils
 */
export async function getInstructors() {
    await requireAdmin();

    try {
        const instructors = await prisma.instructorProfile.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        phone: true,
                    },
                },
                _count: {
                    select: {
                        assignments: { where: { isActive: true } },
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        return { success: true, data: instructors };
    } catch (error: any) {
        console.error("Error fetching instructors:", error);
        return { success: false, error: "Erreur lors de la récupération des instructeurs" };
    }
}

/**
 * Récupérer toutes les attributions actives
 */
export async function getAllAssignments() {
    await requireAdmin();

    try {
        const assignments = await prisma.instructorAssignment.findMany({
            where: { isActive: true },
            include: {
                student: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
                instructor: {
                    include: {
                        user: {
                            select: {
                                firstName: true,
                                lastName: true,
                            },
                        },
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        return { success: true, data: assignments };
    } catch (error: any) {
        console.error("Error fetching assignments:", error);
        return { success: false, error: "Erreur lors de la récupération des attributions" };
    }
}

/**
 * Récupérer tous les cours de conduite
 */
export async function getAllLessons(limit: number = 50) {
    await requireAdmin();

    try {
        const lessons = await prisma.drivingLesson.findMany({
            include: {
                student: {
                    select: {
                        firstName: true,
                        lastName: true,
                    },
                },
                instructor: {
                    include: {
                        user: {
                            select: {
                                firstName: true,
                                lastName: true,
                            },
                        },
                    },
                },
            },
            orderBy: { date: "desc" },
            take: limit,
        });

        return { success: true, data: lessons };
    } catch (error: any) {
        console.error("Error fetching lessons:", error);
        return { success: false, error: "Erreur lors de la récupération des cours" };
    }
}

/**
 * Rechercher des élèves pour l'attribution
 */
export async function searchStudents(query: string) {
    await requireAdmin();

    try {
        const students = await prisma.user.findMany({
            where: {
                OR: [
                    { firstName: { contains: query, mode: "insensitive" } },
                    { lastName: { contains: query, mode: "insensitive" } },
                    { email: { contains: query, mode: "insensitive" } },
                ],
                // On peut filtrer par rôle si besoin, mais souvent on veut n'importe qui
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
            },
            take: 10,
        });

        return { success: true, data: students };
    } catch (error: any) {
        console.error("Error searching students:", error);
        return { success: false, error: "Erreur lors de la recherche" };
    }
}
