import Image from "next/image";
import { notFound } from "next/navigation";
import { getCourseBySlug } from "@/lib/courses";
import { Clock, PlayCircle, Lock, FileText, ShieldCheck } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BuyCourseButton } from "@/components/courses/BuyCourseButton";

// Fonction utilitaire pour formater la durée (secondes -> h min)
function formatDuration(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes} min`;
}

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  // Next.js 15+ : params est une Promise
  const { slug } = await params;
  const course = await getCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  // Calculs statistiques
  const totalModules = course.modules.length;
  const totalLessons = course.modules.reduce((acc, mod) => acc + mod.lessons.length, 0);
  const totalDuration = course.modules.reduce(
    (acc, mod) => acc + mod.lessons.reduce((lAcc, lesson) => lAcc + lesson.duration, 0),
    0
  );

  return (
    <div className="min-h-screen bg-navy-900 text-white font-sans">
      <Header />

      <main>
        {/* Hero Header */}
        <div className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0 z-0">
            {course.imageUrl && (
              <Image
                src={course.imageUrl}
                alt={course.title}
                fill
                className="object-cover opacity-20 blur-sm"
                priority
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-navy-900/80 to-navy-900" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-[1.2fr,0.8fr] gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-gold-500/20 text-gold-500 text-sm font-semibold">
                  Formation Certifiante
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  {course.title}
                </h1>
                <p className="text-xl text-gray-300 leading-relaxed max-w-2xl">
                  {course.description}
                </p>
                <div className="flex flex-wrap gap-6 text-sm text-gray-400 pt-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gold-500" />
                    <span>{formatDuration(totalDuration)} de contenu</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-gold-500" />
                    <span>{totalModules} modules • {totalLessons} leçons</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-gold-500" />
                    <span>Accès à vie</span>
                  </div>
                </div>
              </div>

              {/* Pricing Card */}
              <div className="glass-effect rounded-2xl p-8 border border-gold-500/30 shadow-2xl shadow-gold-500/10 relative">
                <div className="text-center space-y-4">
                  <p className="text-gray-400 text-sm uppercase tracking-wider">Prix de lancement</p>
                  <div className="text-5xl font-bold text-white">
                    {course.price}€
                  </div>
                  <p className="text-gray-400 text-sm">Paiement unique • Satisfait ou remboursé</p>
                  
                  {/* Bouton client Stripe */}
                  <BuyCourseButton courseId={course.id} courseSlug={course.slug ?? ""} />
                  
                  <p className="text-xs text-gray-500 mt-4">
                    Accès immédiat après paiement sécurisé via Stripe.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Programme détaillé */}
        <section className="py-20 bg-navy-800/50">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-10 text-center">Programme de la formation</h2>
            
            <div className="space-y-6">
              {course.modules.map((module) => (
                <div key={module.id} className="glass-effect rounded-xl overflow-hidden border border-navy-700">
                  <div className="bg-navy-800/80 px-6 py-4 flex items-center justify-between border-b border-navy-700/50">
                    <h3 className="font-semibold text-lg text-gold-500">{module.title}</h3>
                    <span className="text-sm text-gray-400">{module.lessons.length} leçons</span>
                  </div>
                  <div className="divide-y divide-navy-700/50">
                    {module.lessons.map((lesson) => (
                      <div key={lesson.id} className="px-6 py-4 flex items-center gap-4 hover:bg-white/5 transition-colors">
                        {lesson.isFree ? (
                          <PlayCircle className="w-5 h-5 text-gold-500 shrink-0" />
                        ) : (
                          <Lock className="w-5 h-5 text-gray-500 shrink-0" />
                        )}
                        <div className="flex-1">
                          <p className="text-gray-200 font-medium">{lesson.title}</p>
                        </div>
                        <span className="text-xs text-gray-500">{formatDuration(lesson.duration)}</span>
                        {lesson.isFree && (
                          <span className="hidden sm:inline-block px-2 py-1 rounded text-xs bg-gold-500/10 text-gold-500 font-medium">
                            Aperçu gratuit
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Spécifique */}
        <section className="py-20">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-12">Questions Fréquentes</h2>
            <div className="grid gap-6 text-left">
              <div className="bg-navy-800 p-6 rounded-xl border border-navy-700">
                <h3 className="font-bold text-lg mb-2">Quand commence la formation ?</h3>
                <p className="text-gray-400 text-sm">Immédiatement ! C&apos;est une formation en ligne à votre rythme. Vous commencez quand vous voulez.</p>
              </div>
              <div className="bg-navy-800 p-6 rounded-xl border border-navy-700">
                <h3 className="font-bold text-lg mb-2">J&apos;ai accès pendant combien de temps ?</h3>
                <p className="text-gray-400 text-sm">À vie. Une fois achetée, la formation reste accessible dans votre espace membre de manière illimitée.</p>
              </div>
              <div className="bg-navy-800 p-6 rounded-xl border border-navy-700">
                <h3 className="font-bold text-lg mb-2">Y a-t-il un certificat ?</h3>
                <p className="text-gray-400 text-sm">Oui, une attestation de fin de formation est générée automatiquement une fois que vous avez complété 100% du cours.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Sticky CTA Mobile */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-navy-900 border-t border-navy-700 lg:hidden z-50">
          <button className="w-full py-3 bg-gold-500 text-navy-900 font-bold rounded-lg shadow-lg">
            Rejoindre pour {course.price}€
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
