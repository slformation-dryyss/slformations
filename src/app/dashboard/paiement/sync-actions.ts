"use server";

import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";
import { revalidatePath } from "next/cache";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

export async function syncUserPaymentHistory() {
    const user = await requireUser();
    if (!stripe) return { success: false, error: "Stripe non configuré" };

    try {
        console.log(`[SYNC] Démarrage de la synchro pour ${user.email} (ID: ${user.id})`);

        // 1. Trouver ou confirmer le Customer ID
        let stripeCustomerId = user.stripeCustomerId;
        
        if (!stripeCustomerId) {
            // Chercher par email si non renseigné
            const customers = await stripe.customers.list({ email: user.email, limit: 1 });
            if (customers.data.length > 0) {
                stripeCustomerId = customers.data[0].id;
                // Optionnel: mettre à jour l'utilisateur localement
                await prisma.user.update({
                    where: { id: user.id },
                    data: { stripeCustomerId }
                });
            }
        }

        if (!stripeCustomerId) {
            return { success: true, count: 0, message: "Aucun profil Stripe trouvé pour cet e-mail." };
        }

        // 2. Récupérer les sessions de paiement réussies
        // Note: Stripe limite à 100 par défaut, on pourrait paginer si besoin
        const sessions = await stripe.checkout.sessions.list({
            customer: stripeCustomerId,
            status: "complete",
            limit: 50,
            expand: ['data.line_items']
        });

        let syncCount = 0;
        let hoursCredited = 0;

        for (const session of sessions.data) {
            if (session.payment_status !== "paid") continue;

            // Vérifier si déja présent en base
            const existingOrder = await prisma.order.findUnique({
                where: { stripeSessionId: session.id }
            });

            if (!existingOrder) {
                console.log(`[SYNC] Récupération de la session ${session.id}`);

                // Extraire metadata
                const courseId = session.metadata?.courseId;
                const qty = parseInt(session.metadata?.quantity || "1");
                const hoursPerUnit = parseInt(session.metadata?.hoursPerUnit || "0");

                if (!courseId) {
                    console.warn(`[SYNC] Session ${session.id} sans metadata courseId, ignorée.`);
                    continue;
                }

                // Récupérer le produit pour confirmer les heures (fallback)
                const course = await prisma.course.findUnique({
                    where: { id: courseId },
                    select: { drivingHours: true }
                });

                // Créer la commande
                const order = await prisma.order.create({
                    data: {
                        userId: user.id,
                        courseId,
                        amount: (session.amount_total || 0) / 100,
                        currency: session.currency || "eur",
                        status: "PAID",
                        stripeSessionId: session.id,
                        createdAt: new Date(session.created * 1000),
                    }
                });

                // Créer le OrderItem
                await prisma.orderItem.create({
                    data: {
                        id: `item_${order.id}`,
                        orderId: order.id,
                        courseId,
                        quantity: qty,
                        unitPrice: ((session.amount_total || 0) / 100) / qty,
                    }
                });

                // Créditer les heures si applicable
                const realHoursPerUnit = hoursPerUnit || course?.drivingHours || 0;
                if (realHoursPerUnit > 0) {
                    const minutesToCredit = realHoursPerUnit * qty * 60;
                    await prisma.user.update({
                        where: { id: user.id },
                        data: { drivingBalance: { increment: minutesToCredit } }
                    });
                    hoursCredited += (realHoursPerUnit * qty);
                }

                syncCount++;
            }
        }

        revalidatePath("/dashboard/paiement");
        
        return { 
            success: true, 
            count: syncCount, 
            hours: hoursCredited,
            message: syncCount > 0 
                ? `${syncCount} commande(s) synchronisée(s). ${hoursCredited}h créditées.` 
                : "Votre historique est déjà à jour."
        };

    } catch (error: any) {
        console.error("[SYNC_ERROR]", error);
        return { success: false, error: error.message };
    }
}
