import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getCoursesByType, getAllSessionsByType } from "@/lib/courses";
import Link from "next/link";
import { ArrowRight, Clock, Users, BadgeCheck, Shield, CheckCircle2, FileText, CalendarDays, Calendar } from "lucide-react";
import SessionCalendar from "@/components/formations/SessionCalendar";
import SidebarFilter from "@/components/formations/SidebarFilter";

export const metadata = {
  title: "Formation VTC Professionnel | SL Formations",
};

export default async function FormationVTCPage() {
  const courses = await getCoursesByType("VTC");
  const upcomingSessions = await getAllSessionsByType("VTC");

  return (
    <div className="min-h-screen text-slate-900 font-sans flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Formation VTC */}
        <section
          id="course-hero"
          className="relative h-[520px] flex items-center justify-center overflow-hidden mt-20"
        >
          <div className="absolute inset-0 z-0">
            <img
              className="w-full h-full object-cover"
              src="https://ls-formation.fr/wp-content/uploads/2025/03/taxis-2304w.webp"
              alt="Chauffeur VTC professionnel"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-navy-900/90 via-navy-900/80 to-navy-900/50" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
            <div className="flex items-center space-x-3 mb-4 text-sm text-gray-300">
              <span className="text-gray-400">Formations</span>
              <span className="text-gray-500">/</span>
              <span>Formation VTC Professionnel</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-6 text-xs md:text-sm">
              <span className="px-4 py-2 bg-gold-500/20 text-gold-500 rounded-full font-semibold">
                VTC / Taxi
              </span>
              <span className="px-4 py-2 bg-green-500/20 text-green-400 rounded-full font-semibold">
                Certifiante
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight text-white">
              Formation VTC{" "}
              <span className="text-gold-500">Professionnel</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-3xl">
              Devenez chauffeur VTC certifié avec notre formation complète.
              Obtenez votre carte professionnelle et lancez votre activité de
              transport de personnes dans les meilleures conditions.
            </p>

            <div className="flex flex-wrap items-center gap-6 text-sm text-white">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-gold-500" />
                <span className="font-medium">50 heures de formation</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-gold-500" />
                <span className="font-medium">Groupe de 12 élèves max</span>
              </div>
              <div className="flex items-center space-x-2">
                <BadgeCheck className="w-5 h-5 text-gold-500" />
                <span className="font-medium">Certification officielle</span>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="lg:w-1/4 hidden lg:block">
                <SidebarFilter />
            </aside>

            {/* Main Content */}
            <div className="lg:w-3/4 space-y-12">
                
                {/* Intro / Static Info */}
                <div className="grid md:grid-cols-2 gap-8">
                     <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                        <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
                            <Shield className="w-5 h-5 text-gold-500" />
                            <span>Pourquoi choisir SL Formations ?</span>
                        </h2>
                        <ul className="space-y-3 text-sm text-slate-600">
                            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-gold-500"/> Formateurs expérimentés et en activité</li>
                            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-gold-500"/> Véhicules récents et adaptés au VTC</li>
                            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-gold-500"/> Accompagnement jusqu'à l'installation</li>
                            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-gold-500"/> Taux de réussite élevé</li>
                        </ul>
                     </div>

                     <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                        <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
                            <FileText className="w-5 h-5 text-gold-500" />
                            <span>Prérequis & Financement</span>
                        </h2>
                         <ul className="space-y-3 text-sm text-slate-600">
                            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-slate-400"/> Permis B depuis 3 ans minimum</li>
                            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-slate-400"/> Casier judiciaire volet B2 vierge</li>
                            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-slate-400"/> Éligible CPF & France Travail</li>
                        </ul>
                     </div>
                </div>

                {/* Calendar */}
                <section>
                    <SessionCalendar sessions={upcomingSessions} />
                </section>

                {/* Course List (Dynamic) */}
                <section>
                    <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                        <BadgeCheck className="w-6 h-6 text-gold-500 mr-2" />
                        Nos programmes VTC
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        {courses.map((course) => (
                            <div key={course.id} className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition group">
                                <div className="h-40 overflow-hidden relative">
                                    <img src={course.imageUrl || '/placeholder-course.jpg'} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500"/>
                                    <div className="absolute top-3 left-3 bg-navy-900 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">VTC</div>
                                </div>
                                <div className="p-5">
                                    <h4 className="font-bold text-slate-900 text-lg mb-2 group-hover:text-gold-600 transition">{course.title}</h4>
                                    <p className="text-slate-500 text-sm line-clamp-2 mb-4">{course.description}</p>
                                    <Link href={`/formations/${course.slug}`} className="block w-full text-center bg-navy-900 text-white font-medium py-2 rounded-lg hover:bg-gold-600 transition">
                                        Voir le programme
                                    </Link>
                                     {/* @ts-ignore */}
                                    {course.courseSessions && course.courseSessions.length > 0 && (
                                        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center text-xs text-slate-500">
                                            <Calendar className="w-3 h-3 mr-1" />
                                            Prochaine : {new Date(course.courseSessions[0].startDate).toLocaleDateString()}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}





