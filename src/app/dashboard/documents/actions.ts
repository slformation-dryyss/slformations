"use server";

import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { promises as fs } from 'fs';
import path from 'path';

// Define required documents
import { REQUIRED_DOCS, OPTIONAL_DOCS, DocType } from "./constants";

export async function uploadDocumentAction(formData: FormData) {
    const user = await requireUser();

    try {
        const file = formData.get("file") as File;
        const type = formData.get("type") as string;

        if (!file || !type) {
            return { error: "Fichier ou type manquant." };
        }

        // Validate type
        const allAllowedTypes = [...REQUIRED_DOCS, ...OPTIONAL_DOCS].map(d => d.type);
        if (!allAllowedTypes.includes(type as DocType)) {
            return { error: "Type de document invalide." };
        }

        // File saving logic (MVP: Save to disk in public folder)
        // In prod, this should be S3/R2 presigned upload.
        const buffer = Buffer.from(await file.arrayBuffer());
        const ext = path.extname(file.name);
        const filename = `${user.id}-${type}-${Date.now()}${ext}`;

        // Ensure upload dir exists
        const uploadDir = path.join(process.cwd(), "public", "uploads", "documents");
        await fs.mkdir(uploadDir, { recursive: true });

        const filePath = path.join(uploadDir, filename);
        await fs.writeFile(filePath, buffer);

        const fileUrl = `/uploads/documents/${filename}`;

        // Create DB record
        await prisma.userDocument.create({
            data: {
                userId: user.id,
                type,
                fileUrl,
                status: "PENDING",
            }
        });

        // Update User Onboarding status if it was NEW
        if (user.onboardingStatus === "NEW") {
            await prisma.user.update({
                where: { id: user.id },
                data: { onboardingStatus: "PENDING_DOCS" }
            });
        }

        revalidatePath("/dashboard/documents");
        return { success: true };

    } catch (error) {
        console.error("Upload error:", error);
        return { error: "Erreur lors de l'upload." };
    }
}

export async function deleteDocumentAction(documentId: string, _formData?: FormData): Promise<void> {
    const user = await requireUser();

    // Ensure ownership
    const doc = await prisma.userDocument.findFirst({
        where: { id: documentId, userId: user.id }
    });

    if (!doc) return;

    // Only allow delete if PENDING or REJECTED (not APPROVED!)
    if (doc.status === "APPROVED") {
        return;
    }

    await prisma.userDocument.delete({
        where: { id: documentId }
    });

    // Optional: Delete file from disk (omitted for MVP safety)

    revalidatePath("/dashboard/documents");
}

