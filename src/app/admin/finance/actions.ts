"use server";

import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const appUrl = process.env.NEXT_PUBLIC_APP_URL || "";

const stripe = stripeSecretKey
    ? new Stripe(stripeSecretKey)
    : null;

import { z } from "zod";

const ManualPaymentSchema = z.object({
    userId: z.string().min(1, "ID Utilisateur requis"),
    courseId: z.string().min(1, "ID Formation requis"),
    amount: z.coerce.number().positive("Le montant doit être supérieur à 0").max(10000, "Montant maximum autorisé dépassé (10,000€)"),
});

export async function createManualPaymentLinkAction(formData: FormData) {
    await requireAdmin();

    const rawData = {
        userId: formData.get("userId"),
        courseId: formData.get("courseId"),
        amount: formData.get("amount"),
    };

    const validatedFields = ManualPaymentSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return { error: validatedFields.error.flatten().fieldErrors };
    }

    const { userId, courseId, amount } = validatedFields.data;

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
        const session = await (stripe.checkout.sessions.create as any)({
            mode: "payment",
            payment_method_types: ["card", "paypal", "klarna", "sepa_debit"],
            customer: user.stripeCustomerId || undefined,
            customer_email: user.stripeCustomerId ? undefined : user.email,
            line_items: [
                {
                    quantity: 1,
                    price_data: {
                        currency: "eur",
                        unit_amount: Math.round(amount * 100),
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
                isManual: "true",
                quantity: "1",
                productType: (course.drivingHours || 0) > 0 ? "DRIVING_HOURS" : "COURSE",
                hoursPerUnit: (course.drivingHours || 0).toString(),
            },
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
                amount: amount,
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

export async function validatePaymentLinkAction(formData: FormData) {
    await requireAdmin();
    const linkId = formData.get("linkId") as string;

    if (!linkId) return { error: "ID manquant." };

    try {
        const link = await prisma.paymentLink.update({
            where: { id: linkId },
            data: { status: "PAID" },
            include: { user: true, course: true }
        });

        // Simuler le succès du webhook pour inscrire l'élève si besoin
        if (link.userId && link.courseId) {
            await prisma.enrollment.upsert({
                where: {
                    userId_courseId: {
                        userId: link.userId,
                        courseId: link.courseId
                    }
                },
                update: { status: "ACTIVE" },
                create: {
                    userId: link.userId,
                    courseId: link.courseId,
                    status: "ACTIVE"
                }
            });
        }

        return { success: true };
    } catch (error: any) {
        return { error: "Erreur lors de la validation." };
    }
}

export async function syncStripePaymentStatus(linkId: string) {
    if (!stripe) return { error: "Stripe non configuré." };

    const link = await prisma.paymentLink.findUnique({
        where: { id: linkId },
    });

    if (!link || !link.stripeSessionId) return { error: "Lien introuvable." };
    if (link.status === "PAID") return { success: true, alreadyPaid: true };

    try {
        // Vérifier auprès de Stripe
        const session = await stripe.checkout.sessions.retrieve(link.stripeSessionId);

        if (session.payment_status === "paid") {
            // Mettre à jour le lien
            await prisma.paymentLink.update({
                where: { id: linkId },
                data: { status: "PAID" }
            });

            // Inscrire l'élève si besoin
            if (link.userId && link.courseId) {
                await prisma.enrollment.upsert({
                    where: {
                        userId_courseId: {
                            userId: link.userId,
                            courseId: link.courseId
                        }
                    },
                    update: { status: "ACTIVE" },
                    create: {
                        userId: link.userId,
                        courseId: link.courseId,
                        status: "ACTIVE"
                    }
                });
            }
            return { success: true, updated: true };
        }

        return { success: true, updated: false, currentStatus: session.payment_status };
    } catch (error: any) {
        console.error(`[Stripe Sync Error] LinkID: ${linkId}:`, error.message);
        return { error: "Erreur lors de la récupération du statut Stripe." };
    }
}

export async function syncPaymentLinkStatusAction(formData: FormData) {
    await requireAdmin();
    const linkId = formData.get("linkId") as string;

    if (!linkId) return { error: "ID manquant." };

    try {
        return await syncStripePaymentStatus(linkId);
    } catch (error: any) {
        console.error("Sync Action Error:", error);
        return { error: "Échec de la synchronisation." };
    }
}

export async function createManualPayment(formData: FormData) {
    await requireAdmin();

    const userId = formData.get("userId") as string;
    const courseId = formData.get("courseId") as string;
    const amount = parseFloat(formData.get("amount") as string);
    const paymentMethod = formData.get("paymentMethod") as string;
    const date = formData.get("date") as string;

    if (!userId || !courseId || isNaN(amount)) {
        return { error: "Données invalides." };
    }

    try {
        return await prisma.$transaction(async (tx) => {
            // 1. Create Order
            const order = await tx.order.create({
                data: {
                    userId,
                    courseId,
                    amount,
                    status: "PAID",
                    createdAt: new Date(date),
                }
            });

            // 2. Create Payment record
            await tx.payment.create({
                data: {
                    orderId: order.id,
                    provider: paymentMethod, // Virement, Especes, etc.
                    providerPaymentId: `MANUAL-${Date.now()}`,
                    status: "COMPLETED",
                    amount,
                }
            });

            // 3. Create or Update Enrollment
            await tx.enrollment.upsert({
                where: {
                    userId_courseId: { userId, courseId }
                },
                update: { status: "ACTIVE" },
                create: {
                    userId,
                    courseId,
                    status: "ACTIVE"
                }
            });

            return { success: true };
        });
    } catch (error: any) {
        console.error("Manual Payment Error:", error);
        return { error: "Erreur lors de l'enregistrement du paiement." };
    }
}

