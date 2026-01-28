"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

/**
 * Récupérer les détails d'une demande de changement
 */
export async function getChangeRequestDetails(requestId: string) {
    await requireAdmin();

    try {
        const request = await prisma.changeRequest.findUnique({
            where: { id: requestId },
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
                currentInstructor: {
                    include: {
                        user: {
                            select: {
                                firstName: true,
                                lastName: true,
                                email: true,
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
        });

        if (!request) {
            return { success: false, error: "Demande introuvable" };
        }

        return { success: true, data: request };
    } catch (error: any) {
        console.error("Error fetching change request:", error);
        return { success: false, error: "Erreur lors de la récupération" };
    }
}
