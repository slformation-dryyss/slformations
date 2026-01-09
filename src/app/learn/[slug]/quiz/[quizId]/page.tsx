import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { QuizPlayer } from "@/components/courses/QuizPlayer";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function QuizPage({
  params,
}: {
  params: Promise<{ slug: string; quizId: string }>;
}) {
  const { slug, quizId } = await params;
  const user = await requireUser();

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: {
      questions: {
        orderBy: { position: "asc" },
        include: { options: true }
      }
    }
  });

  if (!quiz) notFound();

  const course = await prisma.course.findUnique({
    where: { slug },
    select: { id: true, title: true }
  });

  if (!course) notFound();

  // Check enrollment
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: user.id,
        courseId: course.id
      }
    }
  });

  if (!enrollment) {
    redirect(`/formations/${slug}`);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <Link 
            href={`/learn/${slug}`}
            className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-8 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au cours
          </Link>

          <div className="mb-10">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">{quiz.title}</h1>
            <p className="text-slate-500">{quiz.description || "Évaluation des acquis de la formation."}</p>
          </div>

          <QuizPlayer quiz={quiz as any} courseSlug={slug} />
        </div>
      </main>

      <Footer />
    </div>
  );
}

