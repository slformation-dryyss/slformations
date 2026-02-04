"use server";

import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createCheckoutSession } from "@/lib/checkout-store";
import { revalidatePath } from "next/cache";

export async function createCheckoutAction(courseId: string, quantity: number = 1) {
    try {
        const user = await requireUser();
        const session = await createCheckoutSession(user as any, courseId, quantity);

        // REMOVED: Do not create a PaymentLink for direct dashboard purchases.
        // This was casing confusion for users seeing "Pending Payments" for their own attempts.
        // if (session.id && session.url) {
        //     await prisma.paymentLink.create({ ... });
        // }

        return { success: true, url: session.url };
    } catch (error: any) {
        console.error("Stripe Checkout Error:", error);

        // Handle Next.js redirect "error" (it's not actually an error but a signal)
        if (error.digest?.startsWith('NEXT_REDIRECT')) {
            throw error;
        }

        return {
            success: false,
            error: error.message || "Une erreur est survenue lors de la préparation du paiement."
        };
    }
}

