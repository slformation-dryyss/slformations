import { NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { sendEnrollmentConfirmation, sendInvoice } from "@/lib/email/transactional";

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
            stripeSessionId: session.id || "",
          },
          update: {
            amount: (session.amount_total || 0) / 100,
            currency: session.currency || "eur",
            status: "PAID",
          },
          create: {
            userId,
            courseId,
            amount: (session.amount_total || 0) / 100,
            currency: session.currency || "eur",
            status: "PAID",
            stripeSessionId: session.id || "",
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

        // --- NOUVEAU: Créditer les heures de conduite ---
        try {
          let minutesToCredit = 0;

          // 1. Calculer à partir des métadonnées (plus précis pour les quantités)
          if (metadata.productType === "DRIVING_HOURS" && metadata.hoursPerUnit && metadata.quantity) {
            minutesToCredit = parseInt(metadata.hoursPerUnit) * parseInt(metadata.quantity) * 60;
          } 
          // 2. Fallback sur le produit si métadonnées absentes (compatibilité ascendante)
          else {
            const course = await prisma.course.findUnique({
              where: { id: courseId },
              select: { drivingHours: true }
            });
            if (course?.drivingHours && course.drivingHours > 0) {
              minutesToCredit = course.drivingHours * 60;
            }
          }

          if (minutesToCredit > 0) {
            await prisma.user.update({
              where: { id: userId },
              data: { drivingBalance: { increment: minutesToCredit } }
            });
            console.log(`[Stripe Webhook] ${minutesToCredit} min créditées à l'utilisateur ${userId}`);
          }
        } catch (creditError) {
          console.error("[Stripe Webhook] Erreur lors du crédit des heures:", creditError);
        }

        // --- NOUVEAU: Envoyer un email de confirmation à l'élève ---
        try {
          const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { name: true, email: true }
          });
          const course = await prisma.course.findUnique({
            where: { id: courseId },
            select: { title: true, slug: true }
          });

          if (user && course) {
            await sendEnrollmentConfirmation({
              userName: user.name || "Étudiant",
              userEmail: user.email,
              courseTitle: course.title,
              courseSlug: course.slug || "",
              enrollmentDate: new Date().toLocaleDateString('fr-FR'),
            });
            console.log(`[Stripe Webhook] Email de confirmation envoyé à ${user.email}`);

            // --- NOUVEAU: Envoyer la facture ---
            try {
              await sendInvoice({
                invoiceNumber: `FAC-${Date.now().toString().slice(-6)}`,
                invoiceDate: new Date().toLocaleDateString('fr-FR'),
                dueDate: new Date().toLocaleDateString('fr-FR'),
                clientName: user.name || "Étudiant",
                clientAddress: (user as any).addressLine1 || "",
                clientPostal: (user as any).postalCode || "",
                clientCity: (user as any).city || "",
                companyName: "SL FORMATIONS",
                companyAddress: "123 Avenue de Paris",
                companyPostal: "75001",
                companyCity: "Paris",
                companySIRET: "123 456 789 00012",
                companyTVA: "FR 12 345678901",
                companyAPE: "8559A",
                items: [{
                  description: `Formation : ${course.title}`,
                  quantity: 1,
                  unitPrice: (session.amount_total || 0) / 100,
                  vatRate: 0
                }]
              }, user.email);
              console.log(`[Stripe Webhook] Facture envoyée à ${user.email}`);
            } catch (invoiceError) {
              console.error("[Stripe Webhook] Erreur lors de l'envoi de la facture:", invoiceError);
            }
          }
        } catch (emailError) {
          console.error("[Stripe Webhook] Erreur lors du workflow d'email:", emailError);
        }

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









