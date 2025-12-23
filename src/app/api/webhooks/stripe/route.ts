import { NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (!stripeSecretKey || !webhookSecret) {
   
  console.warn("[Stripe] STRIPE_SECRET_KEY ou STRIPE_WEBHOOK_SECRET manquant.");
}

const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey)
  : null;

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: "Webhook Stripe non configuré." }, { status: 500 });
  }

  const sig = (await headers()).get("stripe-signature");
  const body = await request.text();

  let event: Stripe.Event;

  try {
    if (!sig) throw new Error("Signature Stripe manquante");
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("Erreur de validation du webhook Stripe:", err);
    return NextResponse.json({ error: "Signature invalide" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const metadata = session.metadata || {};
        const userId = metadata.userId;
        const courseId = metadata.courseId;
        const sessionId = metadata.sessionId;

        console.log(`[Stripe Webhook] Paiement réussi pour Session=${session.id}, User=${userId}, Course=${courseId}, PlannedSession=${sessionId}`);

        if (!userId || !courseId) {
          console.warn("Webhook Stripe: metadata manquante", metadata);
          break;
        }

        // Créer ou mettre à jour la commande
        await prisma.order.upsert({
          where: {
            stripeSessionId: session.id,
          },
          update: {
            status: "PAID",
            stripePaymentId: session.payment_intent as string | null,
          },
          create: {
            userId,
            courseId,
            amount: (session.amount_total || 0) / 100,
            currency: session.currency || "eur",
            status: "PAID",
            stripeSessionId: session.id,
            stripePaymentId: session.payment_intent as string | null,
          },
        });

        // Créer l'enrolment si pas déjà présent
        await prisma.enrollment.upsert({
          where: {
            userId_courseId: {
              userId,
              courseId,
            },
          },
          update: {},
          create: {
            userId,
            courseId,
            status: "ACTIVE",
          },
        });

        // --- NOUVEAU: Auto-booking de la session ---
        if (sessionId) {
          try {
            await prisma.courseSessionBooking.upsert({
              where: {
                courseSessionId_userId: {
                  courseSessionId: sessionId,
                  userId: userId,
                }
              },
              update: { status: "BOOKED" },
              create: {
                courseSessionId: sessionId,
                userId: userId,
                status: "BOOKED",
              }
            });
            
            // Incrémenter les places réservées
            await prisma.courseSession.update({
              where: { id: sessionId },
              data: { bookedSpots: { increment: 1 } }
            });
            
            console.log(`[Stripe Webhook] Réservation automatique effectuée pour Session=${sessionId}`);
          } catch (e) {
            console.error(`[Stripe Webhook] Erreur lors de la réservation automatique de la session ${sessionId}:`, e);
          }
        }

        // Mettre à jour le lien de paiement s'il s'agit d'un lien manuel/dashboard
        await prisma.paymentLink.updateMany({
          where: { stripeSessionId: session.id },
          data: { status: "PAID" }
        });

        break;
      }
      default:
        // Pour l'instant, on log juste les autres événements
        console.log(`[Stripe] Événement non géré: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Erreur lors du traitement du webhook Stripe:", error);
    return NextResponse.json({ error: "Erreur interne webhook" }, { status: 500 });
  }
}








