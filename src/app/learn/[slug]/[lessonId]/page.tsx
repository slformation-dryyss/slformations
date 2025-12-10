import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getLessonWithCourseBySlug } from "@/lib/lessons";
import { requireUser } from "@/lib/auth";
import { LessonPlayerClient } from "@/components/courses/LessonPlayerClient";
import { prisma } from "@/lib/prisma";
import { Lock, PlayCircle, ChevronLeft, ChevronRight } from "lucide-react";

export default async function LearnPage({
  params,
}: {
  params: Promise<{ slug: string; lessonId: string }>;
}) {
  const { slug, lessonId } = await params;
  const user = await requireUser();

  const data = await getLessonWithCourseBySlug(slug, lessonId);
  if (!data) {
    notFound();
  }

  const { course, currentLesson, prevLesson, nextLesson } = data;

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: user.id,
        courseId: course.id,
      },
    },
  });

  if (!enrollment && !currentLesson.isFree) {
    redirect(`/formations/${course.slug ?? ""}`);
  }

  return (
    <div className="min-h-screen bg-navy-900 text-white font-sans">
      <Header />

      <main className="pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-[1.7fr,1.1fr] gap-10">
          {/* Player & navigation */}
          <div className="space-y-6">
            <LessonPlayerClient
              lessonId={currentLesson.id}
              videoUrl={currentLesson.videoUrl}
              title={currentLesson.title}
            />

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>Formation :</span>
                <Link
                  href={`/formations/${course.slug ?? ""}`}
                  className="text-gold-500 hover:underline"
                >
                  {course.title}
                </Link>
              </div>

              <div className="flex items-center gap-3">
                {prevLesson && (
                  <Link
                    href={`/learn/${course.slug}/${prevLesson.id}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-navy-700 text-sm hover:border-gold-500 hover:text-gold-500 transition"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Précédent
                  </Link>
                )}
                {nextLesson && (
                  <Link
                    href={`/learn/${course.slug}/${nextLesson.id}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-gold-500 bg-gold-500/10 text-sm text-gold-500 hover:bg-gold-500 hover:text-navy-900 transition"
                  >
                    Suivant
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar curriculum */}
          <aside className="space-y-4">
            <h2 className="text-lg font-semibold mb-2">Programme de la formation</h2>
            <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
              {course.modules.map((module) => (
                <div key={module.id} className="bg-navy-800/70 rounded-xl border border-navy-700">
                  <div className="px-4 py-3 border-b border-navy-700/70">
                    <p className="font-semibold text-gold-500 text-sm">{module.title}</p>
                  </div>
                  <div className="divide-y divide-navy-700/70">
                    {module.lessons.map((lesson) => {
                      const isCurrent = lesson.id === currentLesson.id;
                      const isLocked = !lesson.isFree && !enrollment;
                      return (
                        <Link
                          key={lesson.id}
                          href={isLocked ? "#" : `/learn/${course.slug}/${lesson.id}`}
                          className={`flex items-center gap-3 px-4 py-3 text-sm hover:bg-white/5 transition ${
                            isCurrent ? "bg-white/10" : ""
                          } ${isLocked ? "cursor-not-allowed opacity-60" : ""}`}
                        >
                          {lesson.isFree || enrollment ? (
                            <PlayCircle className="w-4 h-4 text-gold-500 shrink-0" />
                          ) : (
                            <Lock className="w-4 h-4 text-gray-500 shrink-0" />
                          )}
                          <span className="flex-1 truncate">{lesson.title}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}

