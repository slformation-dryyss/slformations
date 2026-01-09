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
  const getDurationInfo = () => {
    if (course.type === "CACES") return { duration: "2 à 5 jours", format: "Présentiel" };
    if (course.type === "Incendie") return { duration: "1 à 10 jours", format: "Présentiel" };
    if (course.type === "Secourisme") return { duration: "2 jours", format: "Présentiel" };
    if (course.type === "Habilitation Électrique") return { duration: "1 à 3 jours", format: "Présentiel" };
    if (course.type === "VTC") return { duration: "50 heures", format: "Présentiel" };
    return { duration: "Variable", format: "Présentiel" };
  };

  const { duration, format } = getDurationInfo();

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

            <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl leading-relaxed font-medium">
              {course.description?.split('\n')[0] || "Formation professionnelle certifiante pour monter en compétences et obtenir votre diplôme d'État."}
            </p>

            <div className="flex flex-wrap items-center gap-8 text-sm text-white/90 mb-12">
              <div className="flex items-center space-x-3 bg-white/5 backdrop-blur-xl px-5 py-3 rounded-2xl border border-white/10">
                <Clock className="w-5 h-5 text-gold-500" />
                <span className="font-bold">{duration}</span>
              </div>
              <div className="flex items-center space-x-3 bg-white/5 backdrop-blur-xl px-5 py-3 rounded-2xl border border-white/10">
                <Users className="w-5 h-5 text-gold-500" />
                <span className="font-bold uppercase tracking-tight">12 pers. max</span>
              </div>
              <div className="flex items-center space-x-3 bg-white/5 backdrop-blur-xl px-5 py-3 rounded-2xl border border-white/10">
                <BadgeCheck className="w-5 h-5 text-gold-500" />
                <span className="font-bold uppercase tracking-tight">Certification État</span>
              </div>
              <div className="flex items-center space-x-3 bg-white/5 backdrop-blur-xl px-5 py-3 rounded-2xl border border-white/10">
                <MapPin className="w-5 h-5 text-gold-500" />
                <span className="font-bold uppercase tracking-tight">{format}</span>
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

        <div className="max-w-7xl mx-auto px-6 py-24 space-y-24">
          {/* Intro Cards */}
          <div className="grid md:grid-cols-3 gap-8 -mt-36 relative z-20">
            <div className="group bg-white rounded-3xl p-8 border border-slate-200 shadow-[0_20px_50_rgba(0,0,0,0.05)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-2">
              <div className="w-14 h-14 bg-gold-50 rounded-2xl flex items-center justify-center mb-6 border border-gold-100 group-hover:scale-110 transition-transform duration-500">
                <Target className="w-7 h-7 text-gold-500" />
              </div>
              <h3 className="text-xl font-black mb-3 text-slate-900 uppercase tracking-tight">Objectif clé</h3>
              <p className="text-slate-500 leading-relaxed font-medium">
                Maîtrisez les compétences fondamentales et préparez-vous sereinement à l'obtention de votre certification officielle.
              </p>
            </div>

            <div className="group bg-white rounded-3xl p-8 border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-2">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 border border-blue-100 group-hover:scale-110 transition-transform duration-500">
                <GraduationCap className="w-7 h-7 text-blue-500" />
              </div>
              <h3 className="text-xl font-black mb-3 text-slate-900 uppercase tracking-tight">Public visé</h3>
              <p className="text-slate-500 leading-relaxed font-medium">
                Professionnels en quête de spécialisation ou particuliers souhaitant acquérir une expertise reconnue par l'État.
              </p>
            </div>

            <div className="group bg-white rounded-3xl p-8 border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-2">
              <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-6 border border-green-100 group-hover:scale-110 transition-transform duration-500">
                <Award className="w-7 h-7 text-green-500" />
              </div>
              <h3 className="text-xl font-black mb-3 text-slate-900 uppercase tracking-tight">Certification</h3>
              <p className="text-slate-500 leading-relaxed font-medium">
                Titre certifié RNCP/RS, reconnu au niveau national pour faciliter votre insertion professionnelle durable.
              </p>
            </div>
          </div>

          {/* Programme Section */}
          {course.modules && course.modules.length > 0 && (
            <section id="programme">
              <div className="flex items-center gap-3 mb-6">
                <BookOpen className="w-8 h-8 text-gold-500" />
                <h2 className="text-3xl font-bold text-slate-900">
                  Programme de formation
                </h2>
              </div>
              <p className="text-slate-600 mb-8 text-lg">
                Notre formation couvre l'ensemble des compétences nécessaires pour obtenir votre certification.
              </p>
              <Accordion className="space-y-3">
                {course.modules.map((module, index) => (
                  <AccordionItem key={module.id} value={`module-${index}`}>
                    <AccordionTrigger className="text-left hover:no-underline text-slate-900 font-semibold">
                      {module.title}
                    </AccordionTrigger>
                    <AccordionContent className="text-slate-600">
                      <ul className="space-y-2 text-sm">
                        {module.lessons.map((lesson) => (
                          <li key={lesson.id} className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-gold-500 mt-0.5 flex-shrink-0" />
                            <span>{lesson.title}</span>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
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

