"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth0 } from "@/lib/auth0";

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

export async function createQuizAction(formData: FormData) {
  await requireAdmin();
  
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const passingScore = parseInt(formData.get("passingScore") as string) || 80;
  const moduleId = formData.get("moduleId") as string || null;
  const courseId = formData.get("courseId") as string || null;

  if (!title) throw new Error("Titre requis");

  const quiz = await prisma.quiz.create({
    data: {
      title,
      description,
      passingScore,
      moduleId,
      courseId,
      isPublished: true,
    }
  });

  if (moduleId) revalidatePath(`/admin/courses/modules/${moduleId}`);
  if (courseId) revalidatePath(`/admin/courses/${courseId}`);
  
  return quiz;
}

export async function addQuestionAction(formData: FormData) {
  await requireAdmin();
  
  const quizId = formData.get("quizId") as string;
  const text = formData.get("text") as string;
  const type = formData.get("type") as string || "SINGLE";
  const optionsJson = formData.get("options") as string; // JSON array of {text, isCorrect}

  if (!quizId || !text) throw new Error("Données manquantes");

  const options = JSON.parse(optionsJson);

  await prisma.question.create({
    data: {
      quizId,
      text,
      type,
      options: {
        create: options.map((opt: any) => ({
          text: opt.text,
          isCorrect: opt.isCorrect
        }))
      }
    }
  });

  revalidatePath(`/admin/courses/quizzes/${quizId}`);
}

export async function deleteQuizAction(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id") as string;
  await prisma.quiz.delete({ where: { id } });
  revalidatePath("/admin/courses");
}

