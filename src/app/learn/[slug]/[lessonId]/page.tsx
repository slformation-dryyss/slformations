import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getLessonWithCourseBySlug } from "@/lib/lessons";
import { requireUser } from "@/lib/auth";
import { LessonPlayerClient } from "@/components/courses/LessonPlayerClient";
import { prisma } from "@/lib/prisma";
import { Lock, PlayCircle, ChevronLeft, ChevronRight, CheckCircle, Trophy } from "lucide-react";

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

  // Fetch all completed lessons for this user in this course
  const completedProgress = await prisma.lessonProgress.findMany({
    where: {
      userId: user.id,
      lessonId: {
        in: course.modules.flatMap(m => m.lessons.map(l => l.id))
      },
      isCompleted: true
    },
    select: { lessonId: true }
  });

  const completedLessonIds = new Set(completedProgress.map(p => p.lessonId));

  return (
    <div className="min-h-screen text-slate-900 font-sans">
      <Header />

      <main className="pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-[1.7fr,1.1fr] gap-10">
          {/* Player & navigation */}
          <div className="space-y-6">
            <LessonPlayerClient
              lessonId={currentLesson.id}
              videoUrl={currentLesson.videoUrl}
              title={currentLesson.title}
              isCompleted={completedLessonIds.has(currentLesson.id)}
            />

            {/* Lesson Content */}
            {currentLesson.content && (
              <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm prose prose-slate max-w-none">
                <div dangerouslySetInnerHTML={{ __html: currentLesson.content }} />
              </div>
            )}

            <div className="flex items-center justify-between gap-4 py-6 border-t border-slate-100">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span>Formation :</span>
                <Link
                  href={`/formations/${course.slug ?? ""}`}
                  className="text-gold-500 hover:underline font-medium"
                >
                  {course.title}
                </Link>
              </div>

              <div className="flex items-center gap-3">
                {prevLesson && (
                  <Link
                    href={`/learn/${course.slug}/${prevLesson.id}`}
                    className="inline-flex items-center gap-1 px-4 py-2 rounded-lg border border-slate-200 text-sm bg-white text-slate-700 hover:border-gold-500 hover:text-gold-500 transition shadow-sm"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Précédent
                  </Link>
                )}
                {nextLesson && (
                  <Link
                    href={`/learn/${course.slug}/${nextLesson.id}`}
                    className="inline-flex items-center gap-1 px-5 py-2 rounded-lg bg-slate-900 text-sm text-white hover:bg-slate-800 transition font-semibold shadow-sm"
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
            <div className="flex items-center justify-between mb-4">
               <h2 className="text-lg font-bold text-slate-900">Programme</h2>
               <span className="text-xs font-bold px-2 py-1 bg-gold-500/10 text-gold-600 rounded-full">
                  {completedLessonIds.size} / {course.modules.flatMap(m => m.lessons).length} terminés
               </span>
            </div>
            <div className="space-y-3 max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
              {course.modules.map((module) => (
                <div key={module.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                    <p className="font-bold text-slate-800 text-xs uppercase tracking-wider">{module.title}</p>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {module.lessons.map((lesson) => {
                      const isCurrent = lesson.id === currentLesson.id;
                      const isCompleted = completedLessonIds.has(lesson.id);
                      const isLocked = !lesson.isFree && !enrollment;
                      
                      return (
                        <Link
                          key={lesson.id}
                          href={isLocked ? "#" : `/learn/${course.slug}/${lesson.id}`}
                          className={`flex items-center gap-3 px-4 py-3.5 text-sm hover:bg-slate-50 transition group ${
                            isCurrent ? "bg-gold-500/5 text-gold-600 font-semibold border-l-4 border-gold-500" : "text-slate-600"
                          } ${isLocked ? "cursor-not-allowed opacity-60 text-slate-400" : ""}`}
                        >
                          <div className="shrink-0">
                            {isCompleted ? (
                              <CheckCircle className="w-5 h-5 text-emerald-500" />
                            ) : isLocked ? (
                              <Lock className="w-4 h-4 text-slate-300" />
                            ) : isCurrent ? (
                              <PlayCircle className="w-5 h-5 text-gold-500 animate-pulse" />
                            ) : (
                              <PlayCircle className="w-5 h-5 text-slate-300 group-hover:text-slate-400" />
                            )}
                          </div>
                          <span className="flex-1 truncate leading-tight">{lesson.title}</span>
                          {lesson.isFree && !enrollment && (
                             <span className="text-[10px] font-bold px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded border border-blue-100 italic">Offert</span>
                          )}
                        </Link>
                      );
                    })}

                    {/* Module Quiz Link */}
                    {module.quiz && (
                      <Link
                        href={`/learn/${course.slug}/quiz/${module.quiz.id}`}
                        className="flex items-center gap-3 px-4 py-4 text-sm bg-slate-50 hover:bg-gold-50 transition border-t border-slate-100"
                      >
                         <div className="shrink-0 w-5 h-5 bg-gold-500 rounded-full flex items-center justify-center">
                            <Trophy className="w-3 h-3 text-navy-900" />
                         </div>
                         <div className="flex-1">
                            <span className="block font-bold text-slate-900">Évaluation : {module.quiz.title}</span>
                            <span className="block text-[10px] text-slate-500 text-xs">Vérifiez vos acquis pour ce module</span>
                         </div>
                         <ChevronRight className="w-4 h-4 text-slate-400" />
                      </Link>
                    )}
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









