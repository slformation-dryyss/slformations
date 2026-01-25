import { prisma } from "@/lib/prisma";
import Stripe from "stripe";
import { User } from "@prisma/client";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const appUrl = process.env.NEXT_PUBLIC_APP_URL || "";

const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey)
  : null;

/**
 * Prépare et crée une session de paiement Stripe pour une formation donnée.
 */
export async function createCheckoutSession(user: User, courseId: string, sessionId?: string) {
  if (!stripe) {
    throw new Error("Paiement temporairement indisponible (configuration Stripe manquante).");
  }

  const course = await prisma.course.findFirst({
    where: { id: courseId, isPublished: true },
  });

  if (!course) {
    throw new Error("Formation introuvable ou non publiée.");
  }


  const session = await (stripe.checkout.sessions.create as any)({
    mode: "payment",
    payment_method_types: ["card"],
    customer: user.stripeCustomerId || undefined,
    customer_email: user.stripeCustomerId ? undefined : user.email || undefined,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "eur",
          unit_amount: Math.round(course.price * 100),
          product_data: {
            name: course.title,
            description: course.description.slice(0, 200),
          },
        },
      },
    ],
    metadata: {
      userId: user.id,
      courseId: course.id,
      sessionId: sessionId || "",
    },
    success_url: `${appUrl}/paiement/success?session_id={CHECKOUT_SESSION_ID}${sessionId ? `&booked_session=${sessionId}` : ''}`,
    cancel_url: `${appUrl}/formations/${course.slug ?? ""}`,
  });

  return session;
}

