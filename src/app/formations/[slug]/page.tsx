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
        <section className="relative h-[500px] flex items-center justify-center overflow-hidden mt-20 bg-slate-900">
          <div className="absolute inset-0 z-0">
            {course.imageUrl && (
              <img
                className="w-full h-full object-cover opacity-30"
                src={course.imageUrl}
                alt={course.title}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/90 to-slate-900/70" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
            <div className="flex items-center space-x-3 mb-4 text-sm text-gray-300">
              <Link href="/formations/catalogue" className="hover:text-gold-400 transition">
                Formations
              </Link>
              <span className="text-gray-500">/</span>
              <span className="text-white">{course.title}</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-6 text-xs md:text-sm">
              <span className="px-4 py-2 bg-gold-500/20 text-gold-400 rounded-full font-semibold backdrop-blur-sm border border-gold-500/30">
                {course.type}
              </span>
              <span className="px-4 py-2 bg-green-500/20 text-green-300 rounded-full font-semibold backdrop-blur-sm border border-green-500/30">
                Certifiante
              </span>
              <span className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-full font-semibold backdrop-blur-sm border border-blue-500/30">
                Éligible CPF
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-white drop-shadow-lg">
              {course.title}
            </h1>

            <p className="text-xl text-white mb-8 max-w-3xl leading-relaxed drop-shadow-md">
              {course.description?.split('\n')[0] || "Formation professionnelle certifiante"}
            </p>

            <div className="flex flex-wrap items-center gap-6 text-sm text-white mb-8 drop-shadow">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-gold-400" />
                <span className="font-medium">{duration}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-gold-400" />
                <span className="font-medium">Groupe de 12 max</span>
              </div>
              <div className="flex items-center space-x-2">
                <BadgeCheck className="w-5 h-5 text-gold-400" />
                <span className="font-medium">Certification officielle</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-gold-400" />
                <span className="font-medium">{format}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 bg-gold-500 text-slate-900 font-bold px-8 py-4 rounded-lg hover:bg-gold-400 transition-all shadow-xl hover:shadow-2xl hover:scale-105"
              >
                Réserver cette formation
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#programme"
                className="inline-flex items-center gap-2 bg-white text-slate-900 font-semibold px-8 py-4 rounded-lg hover:bg-gray-100 transition-all shadow-lg border border-white"
              >
                Voir le programme
                <BookOpen className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6 py-16 space-y-16">
          {/* Intro Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-gold-50 to-white rounded-2xl p-6 border border-gold-100 shadow-sm">
              <Target className="w-10 h-10 text-gold-500 mb-4" />
              <h3 className="text-lg font-bold mb-2 text-slate-900">Objectif</h3>
              <p className="text-sm text-slate-600">
                Obtenir la certification officielle et maîtriser tous les aspects de la formation
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6 border border-blue-100 shadow-sm">
              <GraduationCap className="w-10 h-10 text-blue-500 mb-4" />
              <h3 className="text-lg font-bold mb-2 text-slate-900">Public</h3>
              <p className="text-sm text-slate-600">
                Toute personne souhaitant se former et obtenir cette certification
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-6 border border-green-100 shadow-sm">
              <Award className="w-10 h-10 text-green-500 mb-4" />
              <h3 className="text-lg font-bold mb-2 text-slate-900">Certification</h3>
              <p className="text-sm text-slate-600">
                Certification officielle reconnue par l'État et les professionnels
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
              <SessionCalendar sessions={upcomingSessions} />
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
