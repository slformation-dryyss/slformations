"use server";

import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey)
  : null;

export async function createManualPaymentLinkAction(formData: FormData) {
    await requireAdmin();

    const userId = formData.get("userId") as string;
    const courseId = formData.get("courseId") as string;

    if (!userId || !courseId) {
        return { error: "Utilisateur et Formation requis." };
    }

    if (!stripe) {
        return { error: "Stripe non configuré." };
    }

    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        const course = await prisma.course.findUnique({ where: { id: courseId } });

        if (!user || !course) {
            return { error: "Utilisateur ou Formation introuvable." };
        }

        // Create Checkout Session
        // We reuse the same metadata logic as the public store to ensure the webhook works.
        const session = await (stripe.checkout.sessions.create as any)({
            mode: "payment",
            automatic_payment_methods: {
              enabled: true,
            },
            customer: user.stripeCustomerId || undefined,
            customer_email: user.stripeCustomerId ? undefined : user.email,
            line_items: [
                {
                    quantity: 1,
                    price_data: {
                        currency: "eur",
                        unit_amount: Math.round(course.price * 100),
                        product_data: {
                            name: course.title,
                            description: `Paiement manuel généré par l'administration`,
                        },
                    },
                },
            ],
            metadata: {
                userId: user.id,
                courseId: course.id,
                isManual: "true"
            },
            // Urls can point to dashboard/paiements or similar
            success_url: `${appUrl}/paiement/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${appUrl}/dashboard/paiement`,
        });

        // Save Payment Link to DB so student can see it
        await prisma.paymentLink.create({
            data: {
                userId: user.id,
                courseId: course.id,
                stripeSessionId: session.id,
                stripeUrl: session.url || "",
                amount: course.price,
                status: "PENDING",
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h expiration
            }
        });

        return { 
            success: true, 
            url: session.url,
            userEmail: user.email 
        };

    } catch (error: any) {
        console.error("Manual Payment Link Error:", error);
        return { error: error.message || "Erreur lors de la génération du lien." };
    }
}
