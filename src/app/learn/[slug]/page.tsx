import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export default async function LearnSlugRedirectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: slugOrId } = await params;
  const user = await requireUser();

  const course = await prisma.course.findFirst({
    where: {
      OR: [
        { slug: slugOrId },
        { id: slugOrId }
      ],
      isPublished: true
    },
    include: {
      modules: {
        where: { isPublished: true },
        orderBy: { position: "asc" },
        include: {
          lessons: {
            where: { isPublished: true },
            orderBy: { position: "asc" },
            take: 1,
          },
        },
      },
      enrollments: {
        where: { userId: user.id }
      }
    },
  });

  if (!course) {
    notFound();
  }

  const enrollment = course.enrollments[0];

  // If student has already started, redirect to last accessed lesson
  // @ts-ignore
  if (enrollment?.lastLessonId) {
    // @ts-ignore
    redirect(`/learn/${course.slug || course.id}/${enrollment.lastLessonId}`);
  }

  const firstLesson = course.modules
    .filter(m => m.lessons.length > 0)[0]?.lessons[0];

  if (!firstLesson) {
    redirect(`/formations/${course.slug || course.id}`);
  }

  if (!enrollment && !firstLesson.isFree) {
    redirect(`/formations/${course.slug || course.id}`);
  }

  redirect(`/learn/${course.slug || course.id}/${firstLesson.id}`);
}

