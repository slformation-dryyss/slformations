"use server";

import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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
      // method, // Not in schema
      status: "SUCCEEDED",
      provider: method || "MANUAL", // Store method (ESPECE, VIREMENT) in provider
      providerPaymentId: `MANUAL-${Date.now()}`, // Required field
      // adminNote: ... // Not in schema, skipping for now
    },
  });

  // 3. Create Enrollment
  await prisma.enrollment.upsert({
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

