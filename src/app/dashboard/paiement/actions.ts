"use server";

import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createCheckoutSession } from "@/lib/checkout-store";
import { revalidatePath } from "next/cache";

export default async function PaiementPage() {
    const user = await requireUser();

    // Fetch pending payment links
    const paymentLinks = await prisma.paymentLink.findMany({
        where: {
            userId: user.id,
            status: "PENDING",
            expiresAt: {
                gte: new Date() // Only show non-expired links
            }
        },
        include: {
            course: true
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    return { paymentLinks };
}

export async function createCheckoutAction(courseId: string, quantity: number = 1) {
    const user = await requireUser();

    try {
        const session = await createCheckoutSession(user as any, courseId, quantity);
        return { success: true, url: session.url };
    } catch (error: any) {
        console.error("Stripe Checkout Error:", error);
        return { success: false, error: error.message || "Erreur lors de la création de la session de paiement" };
    }
}

