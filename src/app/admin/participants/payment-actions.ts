"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth0 } from "@/lib/auth0";
import Stripe from "stripe";
import { sendEnrollmentConfirmation } from "@/lib/email/transactional";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
});

async function requireAdmin() {
  const session = await auth0.getSession();
  if (!session?.user) throw new Error("Unauthorized");
  
  const user = await prisma.user.findUnique({
    where: { auth0Id: session.user.sub },
    select: { role: true }
  });
  
  if (user?.role !== "ADMIN" && user?.role !== "OWNER") {
    throw new Error("Forbidden");
  }
  return user;
}

export async function createPaymentLinkAction(formData: FormData) {
  await requireAdmin();
  
  const userId = formData.get("userId") as string;
  const courseId = formData.get("courseId") as string;
  const amount = parseFloat(formData.get("amount") as string);
  const expiresInDays = parseInt(formData.get("expiresInDays") as string) || 7;
  const sendEmail = formData.get("sendEmail") === "true";

  if (!userId || !amount) {
    throw new Error("Données manquantes");
  }

  try {
    // Get user and course info
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, name: true }
    });

    const course = courseId ? await prisma.course.findUnique({
      where: { id: courseId },
      select: { title: true, slug: true }
    }) : null;

    if (!user) {
      throw new Error("Utilisateur introuvable");
    }

    // Create Stripe Payment Link
    const paymentLink = await stripe.paymentLinks.create({
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: course ? `Formation : ${course.title}` : "Paiement SL Formations",
              description: `Paiement pour ${user.name || user.email}`,
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId,
        courseId: courseId || "",
        source: "admin_generated",
      },
    });

    // Calculate expiration date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    // Save to database
    const dbPaymentLink = await prisma.paymentLink.create({
      data: {
        userId,
        courseId: courseId || null,
        stripeSessionId: paymentLink.id,
        stripeUrl: paymentLink.url,
        amount,
        expiresAt,
        status: "PENDING",
      },
    });

    // Send email notification if requested
    if (sendEmail && course) {
      await sendEnrollmentConfirmation({
        userName: user.name || "Étudiant",
        userEmail: user.email,
        courseTitle: course.title,
        courseSlug: course.slug || "",
        enrollmentDate: new Date().toLocaleDateString('fr-FR'),
      });
    }

    revalidatePath("/admin/participants");
    revalidatePath(`/dashboard/paiement`);

    return { success: true, paymentLink: dbPaymentLink };
  } catch (error) {
    console.error("Payment link creation error:", error);
    throw error;
  }
}

export async function cancelPaymentLinkAction(formData: FormData) {
  await requireAdmin();
  
  const paymentLinkId = formData.get("paymentLinkId") as string;

  if (!paymentLinkId) {
    throw new Error("ID du lien de paiement manquant");
  }

  await prisma.paymentLink.update({
    where: { id: paymentLinkId },
    data: { status: "CANCELLED" },
  });

  revalidatePath("/admin/participants");
  revalidatePath(`/dashboard/paiement`);

  return { success: true };
}

