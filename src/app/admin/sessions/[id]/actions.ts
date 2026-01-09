"use server";

import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Ajoute un créneau (slot) à une session
 */
export async function addSlotAction(formData: FormData) {
  await requireAdmin();

  const sessionId = formData.get("sessionId") as string;
  const moduleId = formData.get("moduleId") as string || null;
  const teacherId = formData.get("teacherId") as string || null;
  const startDate = formData.get("start") as string;
  const endDate = formData.get("end") as string;
  const location = formData.get("location") as string;
  const meetingUrl = formData.get("meetingUrl") as string;

  if (!sessionId || !startDate || !endDate) {
    throw new Error("Dates obligatoires");
  }

  await prisma.sessionSlot.create({
    data: {
      sessionId,
      moduleId: moduleId || null,
      teacherId: teacherId || null,
      start: new Date(startDate),
      end: new Date(endDate),
      location: location || null,
      meetingUrl: meetingUrl || null,
    },
  });

  revalidatePath(`/admin/sessions/${sessionId}`);
}

/**
 * Supprime un créneau
 */
export async function deleteSlotAction(formData: FormData) {
  await requireAdmin();
  const slotId = formData.get("slotId") as string;
  const sessionId = formData.get("sessionId") as string;

  if (slotId) {
    await prisma.sessionSlot.delete({
      where: { id: slotId },
    });
  }

  revalidatePath(`/admin/sessions/${sessionId}`);
}

/**
 * Inscrit manuellement un élève à une session
 */
export async function enrollStudentAction(formData: FormData) {
  await requireAdmin();
  const sessionId = formData.get("sessionId") as string;
  const userId = formData.get("userId") as string;

  if (!sessionId || !userId) return;

  // 1. Créer la réservation
  await prisma.courseSessionBooking.upsert({
    where: {
      courseSessionId_userId: {
        courseSessionId: sessionId,
        userId: userId,
      },
    },
    update: { status: "BOOKED" },
    create: {
      courseSessionId: sessionId,
      userId: userId,
      status: "BOOKED",
    },
  });

  // 2. Incrémenter les places occupées
  await prisma.courseSession.update({
    where: { id: sessionId },
    data: { bookedSpots: { increment: 1 } },
  });

  // 3. Créer une inscription au cours si elle n'existe pas
  const session = await prisma.courseSession.findUnique({
    where: { id: sessionId },
    select: { courseId: true }
  });

  if (session) {
    await prisma.enrollment.upsert({
      where: {
        userId_courseId: {
          userId,
          courseId: session.courseId,
        },
      },
      update: { status: "ACTIVE" },
      create: {
        userId,
        courseId: session.courseId,
        status: "ACTIVE",
      },
    });
  }

  revalidatePath(`/admin/sessions/${sessionId}`);
}

/**
 * Met à jour la capacité de la session
 */
export async function updateSessionCapacityAction(formData: FormData) {
  await requireAdmin();
  const sessionId = formData.get("sessionId") as string;
  const maxSpots = parseInt(formData.get("maxSpots") as string);

  if (!sessionId || isNaN(maxSpots)) return;

  await prisma.courseSession.update({
    where: { id: sessionId },
    data: { maxSpots },
  });

  revalidatePath(`/admin/sessions/${sessionId}`);
}

/**
 * Met à jour le statut d'une réservation (Mettre en attente, Supprimer, Valider)
 */
export async function updateBookingStatusAction(formData: FormData) {
  await requireAdmin();
  const sessionId = formData.get("sessionId") as string;
  const bookingId = formData.get("bookingId") as string;
  const action = formData.get("action") as "DELETE" | "ON_HOLD" | "VALIDATE";
  const justification = formData.get("justification") as string || null;

  if (!sessionId || !bookingId || !action) return;

  if (action === "DELETE") {
    // 1. Supprimer la réservation de session
    await prisma.courseSessionBooking.delete({
      where: { id: bookingId }
    });

    // 2. Décrémenter le compteur de places
    await prisma.courseSession.update({
      where: { id: sessionId },
      data: { bookedSpots: { decrement: 1 } }
    });
    
    // Note: On ne supprime pas forcément l'Enrollment global car l'élève peut être replacé ailleurs
    // Mais on pourrait le passer en PENDING si c'était sa seule session. Pour l'instant on laisse l'Enrollment.
  } 
  else if (action === "ON_HOLD") {
    await prisma.courseSessionBooking.update({
      where: { id: bookingId },
      data: { 
        status: "ON_HOLD",
        justification: justification
      }
    });
  }
  else if (action === "VALIDATE") {
    await prisma.courseSessionBooking.update({
      where: { id: bookingId },
      data: { 
        status: "BOOKED",
        justification: null // On nettoie la justification
      }
    });
  }

  revalidatePath(`/admin/sessions/${sessionId}`);
}

