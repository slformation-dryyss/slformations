"use server";

import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

import { sendEnrollmentConfirmation } from "@/lib/email/transactional";

// ... (existing imports)

export async function addManualPaymentAction(formData: FormData) {
  const admin = await requireAdmin();

  const userId = formData.get("userId") as string;
  const courseId = formData.get("courseId") as string;
  const amount = parseFloat(formData.get("amount") as string);
  const method = formData.get("method") as string; // VIREMENT, ESPECE, CPF
  const adminNote = formData.get("adminNote") as string;

  if (!userId || !courseId || isNaN(amount)) {
    throw new Error("Champs manquants");
  }

  // Fetch details for email
  const [user, course] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.course.findUnique({ where: { id: courseId } })
  ]);

  if (!user || !course) {
    throw new Error("Utilisateur ou Formation introuvable");
  }

  // 1. Create Order
  const order = await prisma.order.create({
    data: {
      userId,
      courseId,
      amount,
      status: "PAID",
    },
  });

  // 2. Create Payment record
  await prisma.payment.create({
    data: {
      orderId: order.id,
      amount,
      status: "SUCCEEDED",
      provider: method || "MANUAL",
      providerPaymentId: `MANUAL-${Date.now()}`,
    },
  });

  // 3. Create Enrollment
  const enrollment = await prisma.enrollment.upsert({
    where: {
      userId_courseId: {
        userId,
        courseId,
      },
    },
    update: { status: "ACTIVE" },
    create: {
      userId,
      courseId,
      status: "ACTIVE",
    },
  });

  // 4. Send Confirmation Email
  if (user.email) {
    try {
      await sendEnrollmentConfirmation({
        userName: user.name || user.email!.split('@')[0],
        userEmail: user.email!,
        courseTitle: course.title,
        courseSlug: course.slug || '',
        enrollmentDate: new Date().toLocaleDateString('fr-FR'),
      });
    } catch (error) {
      console.error("Failed to send manual payment confirmation email:", error);
      // Don't block the UI for email failure
    }
  }

  revalidatePath("/admin/payments");
  revalidatePath("/dashboard/mes-formations");
}

export async function deletePaymentAction(formData: FormData) {
  await requireAdmin();
  const paymentId = formData.get("paymentId") as string;

  if (!paymentId) return;

  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: { order: true },
  });

  if (!payment) return;

  // Delete payment
  await prisma.payment.delete({
    where: { id: paymentId },
  });

  // If order has no more payments, maybe update its status? 
  // For simplicity, we just delete the individual payment record.
  // In a more robust system, we'd check if the order is still "PAID".

  revalidatePath("/admin/payments");
}

