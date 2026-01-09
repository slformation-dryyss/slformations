"use server";

import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function reviewDocumentAction(documentId: string, status: "APPROVED" | "REJECTED", reason?: string) {
    await requireAdmin();

    if (status === "REJECTED" && !reason) {
        return { error: "Un motif est requis pour rejeter un document." };
    }

    try {
        const doc = await prisma.userDocument.update({
             where: { id: documentId },
             data: {
                 status,
                 rejectionReason: status === "REJECTED" ? reason : null,
                 reviewedAt: new Date(),
             },
             include: { user: true }
        });

        // Update User Status logic?
        // Check if all required docs are approved
        // This is complex, let's keep it simple: Just update doc.
        // Ideally we check if all required types are present and approved.
        
        revalidatePath(`/admin/documents/${doc.userId}`);
        return { success: true };
    } catch (error) {
        console.error("Review error:", error);
        return { error: "Erreur lors de la mise à jour." };
    }
}

