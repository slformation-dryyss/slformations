import { prisma } from "@/lib/prisma";

/**
 * Met à jour la progression d'une leçon pour un utilisateur.
 * Vérifie l'inscription et les droits d'accès avant la mise à jour.
 */
export async function updateLessonProgress(userId: string, lessonId: string, isCompleted: boolean) {
  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
  if (!lesson) {
    throw new Error("Leçon introuvable");
  }

  const module = await prisma.module.findUnique({
    where: { id: lesson.moduleId },
  });

  if (!module) {
    throw new Error("Module introuvable");
  }

  // Vérification de l'inscription
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: userId,
        courseId: module.courseId,
      },
    },
  });

  if (!enrollment && !lesson.isFree) {
    throw new Error("Accès non autorisé à cette leçon");
  }

  // Upsert progress
  const progress = await prisma.lessonProgress.upsert({
    where: {
      userId_lessonId: {
        userId: userId,
        lessonId,
      },
    },
    update: {
      isCompleted,
    },
    create: {
      userId: userId,
      lessonId,
      isCompleted,
    },
  });

  // Calculate and Update Enrollment Progress
  const allLessons = await prisma.lesson.findMany({
    where: {
      module: {
        courseId: module.courseId,
        isPublished: true,
      },
      isPublished: true,
    },
    select: { id: true },
  });

  const totalLessons = allLessons.length;
  if (totalLessons > 0) {
    const completedLessonsCount = await prisma.lessonProgress.count({
      where: {
        userId: userId,
        lessonId: {
          in: allLessons.map((l) => l.id),
        },
        isCompleted: true,
      },
    });

    const progressPercentage = Math.round((completedLessonsCount / totalLessons) * 100);

    await prisma.enrollment.update({
      where: {
        userId_courseId: {
          userId: userId,
          courseId: module.courseId,
        },
      },
      data: {
        progress: progressPercentage,
        updatedAt: new Date(),
      },
    });
  }

  return progress;
}

