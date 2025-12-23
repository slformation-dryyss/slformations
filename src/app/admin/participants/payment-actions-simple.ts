"use server";

import { auth0 } from "@/lib/auth0";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

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

export async function createPaymentLinkSimpleAction(formData: FormData) {
  console.log("🔵 [Payment Link] Starting creation...");
  
  try {
    await requireAdmin();
    console.log("✅ [Payment Link] Admin check passed");
  } catch (error: any) {
    console.error("❌ [Payment Link] Admin check failed:", error.message);
    throw new Error("Accès non autorisé");
  }
  
  const userId = formData.get("userId") as string;
  const courseId = formData.get("courseId") as string;
  const amount = parseFloat(formData.get("amount") as string);

  console.log("📊 [Payment Link] Data:", { userId, courseId, amount });

  if (!userId || !amount) {
    console.error("❌ [Payment Link] Missing data");
    throw new Error("Données manquantes");
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    console.error("❌ [Payment Link] STRIPE_SECRET_KEY not configured");
    throw new Error("Stripe n'est pas configuré. Veuillez ajouter STRIPE_SECRET_KEY dans .env");
  }

  try {
    // Get user and course info
    console.log("🔍 [Payment Link] Fetching user...");
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, name: true }
    });

    console.log("🔍 [Payment Link] Fetching course...");
    const course = courseId ? await prisma.course.findUnique({
      where: { id: courseId },
      select: { title: true }
    }) : null;

    if (!user) {
      console.error("❌ [Payment Link] User not found");
      throw new Error("Utilisateur introuvable");
    }

    console.log("✅ [Payment Link] User found:", user.email);

    // Create Stripe Payment Link (simplified version)
    console.log("💳 [Payment Link] Creating Stripe link...");
    const paymentLink = await stripe.paymentLinks.create({
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: course ? `Formation : ${course.title}` : "Paiement SL Formations",
              description: `Paiement pour ${user.name || user.email}`,
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId,
        courseId: courseId || "",
        userEmail: user.email,
        source: "admin_generated",
      },
    });

    console.log("✅ [Payment Link] Stripe link created:", paymentLink.url);

    // Save to Database for tracking
    await prisma.paymentLink.create({
      data: {
        userId,
        courseId: courseId || "custom", // Handle custom payments without specific course
        stripeSessionId: paymentLink.id, // Storing Payment Link ID instead of Session ID
        stripeUrl: paymentLink.url,
        amount: amount,
        status: "PENDING",
        justification: formData.get("justification") as string || null,
      }
    });

    return { 
      success: true, 
      paymentUrl: paymentLink.url,
      userEmail: user.email,
      userName: user.name || user.email
    };
  } catch (error: any) {
    console.error("❌ [Payment Link] Error:", error);
    console.error("❌ [Payment Link] Error details:", error.message, error.type, error.code);
    
    if (error.type === 'StripeInvalidRequestError') {
      throw new Error(`Erreur Stripe: ${error.message}`);
    }
    
    throw new Error(error.message || "Erreur lors de la création du lien");
  }
}
