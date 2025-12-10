import { prisma } from "@/lib/prisma";
import Stripe from "stripe";
import { User } from "@prisma/client";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, { apiVersion: "2024-06-20" })
  : null;

/**
 * Prépare et crée une session de paiement Stripe pour une formation donnée.
 */
export async function createCheckoutSession(user: User, courseId: string) {
  if (!stripe) {
    throw new Error("Paiement temporairement indisponible (configuration Stripe manquante).");
  }

  const course = await prisma.course.findFirst({
    where: { id: courseId, isPublished: true },
  });

  if (!course) {
    throw new Error("Formation introuvable ou non publiée.");
  }

  console.log("[Store:Checkout] Création session Stripe", {
    userId: user.id,
    courseId: course.id,
    amount: course.price,
  });

  const session = await stripe.checkout.sessions.create({
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
    },
    success_url: `${appUrl}/mes-formations?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/formations/${course.slug ?? ""}`,
  });

  return session;
}
