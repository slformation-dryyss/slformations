
"use server";

import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
// import { slugify } from "@/lib/utils"; // Using local helper below

// Helper if not exists
function slugifyTitle(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

export async function createCourseAction(formData: FormData) {
  await requireAdmin();

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const type = formData.get("type") as string;
  const drivingHours = parseInt(formData.get("drivingHours") as string) || 0;

  if (!title || !description || isNaN(price)) {
    throw new Error("Missing required fields");
  }

  const imageUrl = formData.get("imageUrl") as string;

  const slug = slugifyTitle(title) + "-" + Date.now().toString().slice(-4);

  const objectives = formData.get("objectives") as string;
  const targetAudience = formData.get("targetAudience") as string;
  const prospects = formData.get("prospects") as string;
  const durationText = formData.get("durationText") as string;
  const formatText = formData.get("formatText") as string;

  const course = await prisma.course.create({
    data: {
      title,
      slug,
      description,
      price,
      type: type || "AUTRE",
      isPublished: false, // Default draft
      imageUrl: imageUrl || "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80", // Better placeholder
      drivingHours,
      objectives: objectives || "Maîtriser les compétences fondamentales et se préparer à la certification.",
      targetAudience: targetAudience || "Particuliers ou professionnels souhaitant se former aux métiers du transport et de la sécurité.",
      prospects: prospects || "Insertion professionnelle immédiate dans le secteur visé.",
      durationText: durationText || "Variable",
      formatText: formatText || "Présentiel",
    },
  });

  revalidatePath("/admin/courses");
  redirect(`/admin/courses/${course.id}`); // Redirect to edit page
}

export async function updateCourseAction(formData: FormData) {
  try {
    await requireAdmin();
    const courseId = formData.get("courseId") as string;
    const title = (formData.get("title") as string) || "Sans titre";
    const description = (formData.get("description") as string) || "";
    let price = parseFloat(formData.get("price") as string);
    if (isNaN(price)) price = 0;
    const type = (formData.get("type") as string) || "AUTRE";
    const isPublished = formData.get("isPublished") === "on";
    let imageUrl: string | null = formData.get("imageUrl") as string;
    if (!imageUrl || imageUrl.trim() === "") imageUrl = null;
    let maxStudents = parseInt(formData.get("maxStudents") as string);
    if (isNaN(maxStudents)) maxStudents = 0;
    const drivingHours = parseInt(formData.get("drivingHours") as string) || 0;

    const objectives = formData.get("objectives") as string;
    const targetAudience = formData.get("targetAudience") as string;
    const prospects = formData.get("prospects") as string;
    const durationText = formData.get("durationText") as string;
    const formatText = formData.get("formatText") as string;

    if (!courseId) throw new Error("Course ID is missing");

    await prisma.course.update({
      where: { id: courseId },
      data: { 
        title, 
        description, 
        price, 
        type, 
        isPublished, 
        imageUrl, 
        maxStudents, 
        drivingHours,
        objectives,
        targetAudience,
        prospects,
        durationText,
        formatText
      },
    });

    revalidatePath(`/admin/courses/${courseId}`);
    revalidatePath("/admin/courses");
  } catch (error: any) {
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    console.error("Failed to update course:", error);
    throw error;
  }
}

export async function createModuleAction(formData: FormData) {
  await requireAdmin();

  const courseId = formData.get("courseId") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const dayNumber = parseInt(formData.get("dayNumber") as string) || 1;
  const duration = parseInt(formData.get("duration") as string) || 7;

  if (!courseId || !title) return;

  // Get max position
  const lastModule = await prisma.module.findFirst({
    where: { courseId },
    orderBy: { position: "desc" },
  });

  await prisma.module.create({
    data: {
      courseId,
      title,
      description,
      position: (lastModule?.position ?? -1) + 1,
      isPublished: true,
      dayNumber,
      duration,
    },
  });

  revalidatePath(`/admin/courses/${courseId}`);
}

export async function updateModuleAction(formData: FormData) {
  await requireAdmin();

  const moduleId = formData.get("moduleId") as string;
  const courseId = formData.get("courseId") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const dayNumber = parseInt(formData.get("dayNumber") as string) || 1;
  const duration = parseInt(formData.get("duration") as string) || 7;

  if (!moduleId || !title) return;

  await prisma.module.update({
    where: { id: moduleId },
    data: {
      title,
      description,
      dayNumber,
      duration,
    },
  });

  revalidatePath(`/admin/courses/${courseId}`);
}

export async function deleteModuleAction(formData: FormData) {
  await requireAdmin();
  const moduleId = formData.get("moduleId") as string;
  const courseId = formData.get("courseId") as string;

  if (moduleId) {
    await prisma.module.delete({ where: { id: moduleId } });
    revalidatePath(`/admin/courses/${courseId}`);
  }
}

export async function createLessonAction(formData: FormData) {
  await requireAdmin();

  const moduleId = formData.get("moduleId") as string;
  const courseId = formData.get("courseId") as string;
  const title = formData.get("title") as string;
  const videoUrl = formData.get("videoUrl") as string;
  const content = formData.get("content") as string;
  const isFree = formData.get("isFree") === "on";

  if (!moduleId || !title) return;

  // Get max position in module
  const lastLesson = await prisma.lesson.findFirst({
    where: { moduleId },
    orderBy: { position: "desc" },
  });

  await prisma.lesson.create({
    data: {
      moduleId,
      title,
      videoUrl,
      content,
      isFree,
      position: (lastLesson?.position ?? -1) + 1,
      isPublished: true,
    },
  });

  revalidatePath(`/admin/courses/${courseId}`);
}

export async function deleteLessonAction(formData: FormData) {
  await requireAdmin();
  const lessonId = formData.get("lessonId") as string;
  const courseId = formData.get("courseId") as string;

  if (lessonId) {
    await prisma.lesson.delete({ where: { id: lessonId } });
    revalidatePath(`/admin/courses/${courseId}`);
  }
}

export async function deleteCourseAction(formData: FormData) {
  await requireAdmin();
  const courseId = formData.get("courseId") as string;
  if (!courseId) return;

  try {
    await prisma.course.delete({
      where: { id: courseId },
    });
    revalidatePath("/admin/courses");
  } catch (error) {
    console.error("Failed to delete course:", error);
    // On pourrait retourner une erreur ici pour l'afficher côté client
  }
}
