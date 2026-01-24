
"use server";

import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createSessionAction(formData: FormData) {
  await requireAdmin();

  const courseId = formData.get("courseId") as string;
  const startDate = formData.get("startDate") as string;
  const endDate = formData.get("endDate") as string;
  const location = formData.get("location") as string;
  const maxSpots = parseInt(formData.get("maxSpots") as string) || 10;
  const mainTeacherId = formData.get("mainTeacherId") as string;

  const format = (formData.get("format") as string) || "IN_PERSON";
  const meetingUrl = formData.get("meetingUrl") as string;

  if (!courseId || !startDate || !endDate) {
    throw new Error("Missing required fields");
  }

  // Validation: Start date must be at least 10 days from now
  const startDateObj = new Date(startDate);
  const minStartDate = new Date();
  minStartDate.setDate(minStartDate.getDate() + 10);

  if (startDateObj < minStartDate) {
    throw new Error("La date de début doit être au minimum 10 jours après aujourd'hui");
  }

  // Validation: End date must be after start date
  const endDateObj = new Date(endDate);
  if (endDateObj <= startDateObj) {
    throw new Error("La date de fin doit être postérieure à la date de début");
  }

  await prisma.courseSession.create({
    data: {
      courseId,
      startDate: startDateObj,
      endDate: endDateObj,
      location,
      maxSpots,
      mainTeacherId: mainTeacherId || null,
      isPublished: true,
      meetingUrl: meetingUrl || null,
    },
  });

  revalidatePath("/admin/sessions");
  redirect("/admin/sessions");
}

export async function addParticipantAction(formData: FormData) {
  await requireAdmin();

  const sessionId = formData.get("sessionId") as string;
  const email = formData.get("email") as string;

  if (!sessionId || !email) {
    throw new Error("Missing sessionId or email");
  }

  // 1. Find user by email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    // TODO: Redirect to user creation or show error
    // For now, simple error
    throw new Error("User not found with this email. Please create the user first.");
  }

  // 2. Check if already booked
  const existingBooking = await prisma.courseSessionBooking.findUnique({
    where: {
      courseSessionId_userId: {
        courseSessionId: sessionId,
        userId: user.id
      }
    },
  });

  if (existingBooking) {
    // Already enrolled
    return;
  }

  // 3. Create booking
  await prisma.courseSessionBooking.create({
    data: {
      courseSessionId: sessionId,
      userId: user.id,
      status: "BOOKED",
    },
  });

  // Update session booked spots count
  await prisma.courseSession.update({
    where: { id: sessionId },
    data: {
      bookedSpots: { increment: 1 }
    }
  });

  // 4. Also create Enrollment in the Course context (LMS access)
  // Find the session to get the courseId
  const session = await prisma.courseSession.findUnique({
    where: { id: sessionId },
    select: { courseId: true },
  });

  if (session) {
    await prisma.enrollment.upsert({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: session.courseId,
        }
      },
      update: { status: "ACTIVE" },
      create: {
        userId: user.id,
        courseId: session.courseId,
        status: "ACTIVE",
      }
    });
  }


  revalidatePath(`/admin/sessions/${sessionId}`);
}

export async function createSessionSlotAction(formData: FormData) {
  await requireAdmin();

  const sessionId = formData.get("sessionId") as string;
  const start = new Date(formData.get("start") as string);
  const end = new Date(formData.get("end") as string);
  const moduleId = formData.get("moduleId") as string;
  const teacherId = formData.get("teacherId") as string;
  const location = formData.get("location") as string;
  const meetingUrl = formData.get("meetingUrl") as string;

  await prisma.sessionSlot.create({
    data: {
      sessionId,
      start,
      end,
      moduleId: moduleId || null,
      teacherId: teacherId || null,
      location: location || null,
      meetingUrl: meetingUrl || null,
    }
  });

  revalidatePath(`/admin/sessions/${sessionId}`);
}

export async function deleteSessionSlotAction(formData: FormData) {
  await requireAdmin();
  const slotId = formData.get("slotId") as string;
  const sessionId = formData.get("sessionId") as string;

  if (slotId) {
    await prisma.sessionSlot.delete({ where: { id: slotId } });
    revalidatePath(`/admin/sessions/${sessionId}`);
  }
}

export async function deleteSessionAction(sessionId: string) {
  await requireAdmin();

  if (!sessionId) {
    throw new Error("Missing sessionId");
  }

  // Prisma onDelete: Cascade should handle bookings and slots if defined in schema.
  // However, CourseSessionBooking and SessionSlot both have CourseSession as relation with onDelete: Cascade

  await prisma.courseSession.delete({
    where: { id: sessionId },
  });

  revalidatePath("/admin/sessions");
}

