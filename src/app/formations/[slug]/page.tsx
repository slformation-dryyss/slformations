import { notFound } from "next/navigation";
import { getCourseBySlug } from "@/lib/courses";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import SessionCalendar from "@/components/formations/SessionCalendar";
import Link from "next/link";
import {
  Clock, Users, BadgeCheck, Shield, CheckCircle2,
  BookOpen, Target, Award, GraduationCap, Wallet,
  ArrowRight, Calendar, MapPin
} from "lucide-react";
import { CoursePricing } from "@/components/formations/CoursePricing";

export const dynamic = 'force-dynamic';

export default async function FormationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  // Récupérer les sessions à venir pour cette formation
  // @ts-ignore - courseSessions ajouté dans getCourseBySlug
  const upcomingSessions = course.courseSessions?.filter(
    (session: any) => new Date(session.startDate) > new Date() && session.isPublished
  ) || [];

  // Déterminer la durée et le format selon le type
  const duration = course.durationText || "Variable";
  const format = course.formatText || "Présentiel";

  return (
    <div className="min-h-screen text-slate-900 font-sans flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Formation */}
        <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden pt-32 pb-20 bg-slate-900 text-white">
          <div className="absolute inset-0 z-0">
            {course.imageUrl && (
              <img
                className="w-full h-full object-cover opacity-40 scale-105"
                src={course.imageUrl}
                alt={course.title}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-900/95" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/60 to-transparent" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
            <div className="flex items-center space-x-3 mb-8 text-sm text-gray-400">
              <Link href="/formations/catalogue" className="hover:text-gold-400 transition-colors uppercase tracking-widest font-bold">
                Catalogue
              </Link>
              <span className="text-gray-600 font-bold">•</span>
              <span className="text-white/80 font-medium">{course.title}</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-8">
              <span className="px-4 py-1.5 bg-gold-500 text-slate-900 text-xs font-black uppercase tracking-tighter rounded-sm">
                {course.type}
              </span>
              <span className="px-4 py-1.5 bg-white/10 backdrop-blur-md text-white text-xs font-bold uppercase tracking-tighter rounded-sm border border-white/20">
                Certifiante
              </span>
              <div className="flex items-center gap-2 px-4 py-1.5 bg-blue-600/20 backdrop-blur-md text-blue-300 text-xs font-bold uppercase tracking-tighter rounded-sm border border-blue-500/30">
                <Shield className="w-3.5 h-3.5" />
                Éligible CPF
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-7xl font-black mb-8 leading-[1.1] tracking-tight text-white max-w-4xl">
              {course.title}
            </h1>



            <div className="flex flex-wrap items-center gap-8 text-sm text-white/90 mb-12">
              <div className="flex items-center space-x-3 bg-white/5 backdrop-blur-xl px-5 py-3 rounded-2xl border border-white/10">
                <Clock className="w-5 h-5 text-gold-500" />
                <span className="font-bold">{duration}</span>
              </div>
              <div className="flex items-center space-x-3 bg-white/5 backdrop-blur-xl px-5 py-3 rounded-2xl border border-white/10">
                <Users className="w-5 h-5 text-gold-500" />
                <span className="font-bold uppercase tracking-tight">{course.maxStudents || 12} pers. max</span>
              </div>
              <div className="flex items-center space-x-3 bg-white/5 backdrop-blur-xl px-5 py-3 rounded-2xl border border-white/10">
                <BadgeCheck className="w-5 h-5 text-gold-500" />
                <span className="font-bold uppercase tracking-tight">Certification État</span>
              </div>
              <div className="flex items-center space-x-3 bg-white/5 backdrop-blur-xl px-5 py-3 rounded-2xl border border-white/10">
                <MapPin className="w-5 h-5 text-gold-500" />
                <span className="font-bold uppercase tracking-tight">{format}</span>
              </div>
              <div className="flex items-center space-x-3 bg-gold-500 text-slate-900 px-5 py-3 rounded-2xl shadow-[0_0_20px_rgba(234,179,8,0.3)]">
                <Wallet className="w-5 h-5" />
                <span className="font-black">
                  {course.price && course.price > 0 ? `${course.price}€ TTC` : "SUR DEVIS"}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-5">
              <Link
                href={`/contact?subject=${encodeURIComponent(`Inscription - ${course.title}`)}`}
                className="group relative overflow-hidden inline-flex items-center gap-3 bg-gold-500 text-slate-900 font-black px-10 py-5 rounded-2xl hover:bg-gold-400 transition-all shadow-[0_0_50px_-12px_rgba(234,179,8,0.5)] hover:scale-105 active:scale-95"
              >
                S'inscrire à cette session
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#programme"
                className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md text-white font-bold px-10 py-5 rounded-2xl hover:bg-white/20 transition-all border border-white/20"
              >
                Explorer le programme
                <BookOpen className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        {course.price !== undefined && (
          <CoursePricing price={course.price} title={course.title} />
        )}

        <div className="max-w-7xl mx-auto px-6 py-24 space-y-24">
          {/* Intro Cards */}
          <div className="grid md:grid-cols-3 gap-8 -mt-36 relative z-20">
            <div className="group bg-white rounded-3xl p-8 border border-slate-200 shadow-[0_20px_50_rgba(0,0,0,0.05)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-2">
              <div className="w-14 h-14 bg-gold-50 rounded-2xl flex items-center justify-center mb-6 border border-gold-100 group-hover:scale-110 transition-transform duration-500">
                <Target className="w-7 h-7 text-gold-500" />
              </div>
              <h3 className="text-xl font-black mb-3 text-slate-900 uppercase tracking-tight">Objectif clé</h3>
              <p className="text-slate-500 leading-relaxed font-medium">
                {course.objectives || "Maîtrisez les compétences fondamentales et préparez-vous sereinement à l'obtention de votre certification officielle."}
              </p>
            </div>

            <div className="group bg-white rounded-3xl p-8 border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-2">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 border border-blue-100 group-hover:scale-110 transition-transform duration-500">
                <GraduationCap className="w-7 h-7 text-blue-500" />
              </div>
              <h3 className="text-xl font-black mb-3 text-slate-900 uppercase tracking-tight">Public visé</h3>
              <p className="text-slate-500 leading-relaxed font-medium">
                {course.targetAudience || "Professionnels en quête de spécialisation ou particuliers souhaitant acquérir une expertise reconnue par l'État."}
              </p>
            </div>

            <div className="group bg-white rounded-3xl p-8 border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-2">
              <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-6 border border-green-100 group-hover:scale-110 transition-transform duration-500">
                <Award className="w-7 h-7 text-green-500" />
              </div>
              <h3 className="text-xl font-black mb-3 text-slate-900 uppercase tracking-tight">Certification</h3>
              <p className="text-slate-500 leading-relaxed font-medium">
                {course.prospects || "Titre certifié RNCP/RS, reconnu au niveau national pour faciliter votre insertion professionnelle durable."}
              </p>
            </div>
          </div>

          {/* Presentation Section */}
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-black text-slate-900 mb-6">Présentation de la formation</h2>
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-medium">
              {course.description}
            </p>
          </div>

          {/* Programme Section */}
          {course.modules && course.modules.length > 0 && (
            <section id="programme" className="scroll-mt-32">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gold-500/10 rounded-2xl flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-gold-500" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tight">
                      Programme détaillé
                    </h2>
                  </div>
                  <p className="text-slate-500 text-lg max-w-2xl font-medium">
                    Une approche pédagogique structurée pour garantir votre réussite et une assimilation optimale des compétences.
                  </p>
                </div>
                <div className="flex items-center gap-4 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100">
                  <div className="text-right">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total</p>
                    <p className="text-slate-900 font-black">{course.modules.length} Modules</p>
                  </div>
                  <div className="w-px h-8 bg-slate-200" />
                  <div className="text-right">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Format</p>
                    <p className="text-slate-900 font-black">Présentiel</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {course.modules.map((module, index) => (
                  <div key={module.id} className="group bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-gold-200 transition-all duration-500 overflow-hidden">
                    <Accordion>
                      <AccordionItem value={`module-${index}`} className="border-none">
                        <AccordionTrigger className="w-full px-8 py-6 hover:no-underline group/trigger">
                          <div className="flex items-center gap-6 text-left w-full">
                            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex flex-col items-center justify-center border border-slate-100 group-hover/trigger:bg-gold-500 group-hover/trigger:border-gold-400 transition-all duration-500">
                              <span className="text-[10px] font-black text-slate-400 group-hover/trigger:text-slate-900 uppercase leading-none">Jour</span>
                              <span className="text-xl font-black text-slate-900 group-hover/trigger:text-slate-900">{module.dayNumber || index + 1}</span>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-xl font-black text-slate-900 group-hover/trigger:text-gold-600 transition-colors">
                                {module.title}
                              </h3>
                              <div className="flex items-center gap-4 mt-1">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                  <Clock className="w-3 h-3" />
                                  {module.duration || 7} Heures
                                </span>
                                <span className="w-1 h-1 rounded-full bg-slate-200" />
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                  {module.lessons.length} Séquences
                                </span>
                              </div>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-8 pb-8 pt-2">
                          {module.description && (
                            <div className="mb-8 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line italic font-medium">
                                "{module.description}"
                              </p>
                            </div>
                          )}
                          <div className="grid gap-4">
                            {module.lessons.map((lesson, lIndex) => (
                              <div key={lesson.id} className="flex gap-4 p-4 rounded-2xl border border-slate-50 hover:border-gold-100 hover:bg-gold-50/30 transition-all group/lesson">
                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-xs font-black text-slate-400 border border-slate-100 shadow-sm flex-shrink-0 group-hover/lesson:bg-gold-500 group-hover/lesson:text-slate-900 group-hover/lesson:border-gold-500 transition-all">
                                  {lIndex + 1}
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-bold text-slate-900 mb-1">{lesson.title}</h4>
                                  {lesson.content && (
                                    <p className="text-sm text-slate-500 leading-relaxed whitespace-pre-line font-medium">
                                      {lesson.content}
                                    </p>
                                  )}
                                </div>
                                {lesson.isFree && (
                                  <span className="h-fit px-2 py-0.5 bg-green-100 text-[10px] font-black text-green-700 rounded uppercase tracking-tighter">Gratuit</span>
                                )}
                              </div>
                            ))}
                            {module.quiz && (
                              <div className="flex items-center gap-4 p-4 rounded-2xl border-2 border-dashed border-gold-200 bg-gold-50/20">
                                <div className="w-10 h-10 rounded-xl bg-gold-500 flex items-center justify-center text-slate-900 shadow-lg shadow-gold-500/20">
                                  <Award className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest">Évaluation des connaissances</h4>
                                  <p className="text-sm text-slate-600 font-medium">Quiz de validation du module</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Prérequis & Financement */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Shield className="w-6 h-6 text-gold-500" />
                Prérequis
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-gold-500 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700">Être majeur(e)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-gold-500 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700">Maîtrise du français (lu, écrit, parlé)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-gold-500 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700">Aptitude médicale selon la formation</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-8 border border-green-100 shadow-sm">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Wallet className="w-6 h-6 text-green-600" />
                Financement
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900 block">CPF (Compte Personnel de Formation)</span>
                    <span className="text-sm text-slate-600">Formation 100% finançable</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900 block">France Travail (Pôle Emploi)</span>
                    <span className="text-sm text-slate-600">Aide au financement possible</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900 block">OPCO</span>
                    <span className="text-sm text-slate-600">Pour les salariés en reconversion</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Pourquoi SL Formations */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-10 text-white shadow-xl">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <Shield className="w-8 h-8 text-gold-500" />
              Pourquoi choisir SL Formations ?
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-gold-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-1">Formateurs certifiés</h3>
                  <p className="text-gray-300 text-sm">Experts en activité avec expérience terrain</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-gold-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-1">Équipements modernes</h3>
                  <p className="text-gray-300 text-sm">Matériel récent et conforme aux normes</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-gold-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-1">Accompagnement complet</h3>
                  <p className="text-gray-300 text-sm">Suivi jusqu'à l'obtention de votre certification</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-gold-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-1">Taux de réussite élevé</h3>
                  <p className="text-gray-300 text-sm">Plus de 85% de nos élèves obtiennent leur certification</p>
                </div>
              </div>
            </div>
          </div>

          {/* Prochaines Sessions */}
          {upcomingSessions.length > 0 && (
            <section>
              {/* @ts-ignore */}
              <SessionCalendar sessions={upcomingSessions} courseTitle={course.title} />
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

