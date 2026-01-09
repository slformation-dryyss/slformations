
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getCoursesByType, getAllSessionsByType } from "@/lib/courses";
import Link from "next/link";
import { ArrowRight, Zap, AlertTriangle, BookOpen, Calendar } from "lucide-react";
import SessionCalendar from "@/components/formations/SessionCalendar";
import SidebarFilter from "@/components/formations/SidebarFilter";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Habilitation Électrique (Non Électricien) | SL Formations",
  description:
    "Formations Habilitation Électrique H0B0, BS, BE Manœuvre pour non-électriciens. Respectez la norme NF C 18-510.",
};

export default async function HabilitationPage() {
  const courses = await getCoursesByType("HABILITATION");
  const upcomingSessions = await getAllSessionsByType("HABILITATION");

  return (
    <div className="min-h-screen flex flex-col text-slate-900 font-sans">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 bg-blue-900 overflow-hidden">
             <div className="absolute inset-0 z-0">
             <img
              className="w-full h-full object-cover opacity-20"
              src="https://www.flobel.fr/wp-content/uploads/2023/02/HABELEC-H0B0-850x425.jpg"
              alt="Habilitation Electrique"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-950 via-blue-900/90 to-blue-900/60" />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-6 text-center md:text-left">
             <span className="inline-block px-3 py-1 mb-4 rounded-full bg-blue-500/20 text-blue-300 text-sm font-semibold">
              Norme NF C 18-510
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Habilitation Électrique <br/>
              <span className="text-blue-400">Non Électricien</span>
            </h1>
            <p className="text-lg text-blue-100 max-w-2xl mb-8 leading-relaxed">
              Pour travailler en sécurité à proximité d'installations électriques. Nos formations H0B0, BS, BE Manœuvre vous permettent d'obtenir l'habilitation obligatoire.
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="lg:w-1/4 hidden lg:block">
                <SidebarFilter />
            </aside>

            {/* Main Content */}
            <div className="lg:w-3/4 space-y-12">
                 {/* Content */}
                 <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                    <div className="grid lg:grid-cols-2 gap-12 text-slate-600">
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold text-slate-900">Pour qui sont ces formations ?</h2>
                            <p>
                                Les formations d’habilitation électrique <strong>non électricien</strong> s’adressent aux travailleurs dont les tâches impliquent une proximité avec des installations électriques sans être des électriciens de métier.
                            </p>
                                <ul className="space-y-4 mt-6">
                                <li className="flex gap-4">
                                    <div className="p-2 bg-blue-50 rounded-lg h-fit">
                                        <Zap className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <strong className="block text-slate-900">Travailleurs non-électriciens</strong>
                                        <span className="text-sm">Peintres, maçons, agents d'entretien, agents de logistique travaillant en zone électrique.</span>
                                    </div>
                                </li>
                                    <li className="flex gap-4">
                                    <div className="p-2 bg-blue-50 rounded-lg h-fit">
                                        <AlertTriangle className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <strong className="block text-slate-900">Encadrement & Sécurité</strong>
                                        <span className="text-sm">Managers et responsables sécurité devant superviser des travaux.</span>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8">
                            <h3 className="text-xl font-bold text-slate-900 mb-4">Objectifs & Validité</h3>
                            <p className="text-sm mb-6 leading-relaxed">
                                L'objectif principal est d'acquérir la <strong>connaissance des risques électriques</strong> et la maîtrise des mesures de prévention pour éviter tout accident.
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-white rounded-xl shadow-sm">
                                    <span className="block text-3xl font-bold text-blue-600 mb-1">3 ans</span>
                                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Validité</span>
                                </div>
                                <div className="p-4 bg-white rounded-xl shadow-sm">
                                    <span className="block text-3xl font-bold text-blue-600 mb-1">Obligatoire</span>
                                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Réglementation</span>
                                </div>
                            </div>
                                <p className="text-xs text-slate-400 mt-4 italic">
                                Après 3 ans, un recyclage est nécessaire pour maintenir l'habilitation.
                            </p>
                        </div>
                    </div>
                 </section>

                {/* Calendar */}
                <section>
                    <SessionCalendar sessions={upcomingSessions} />
                </section>

                {/* Courses List */}
                <section>
                     <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                        <Zap className="w-6 h-6 text-blue-500 mr-2" />
                        Nos formations Habilitation Électrique
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                    {courses.map((course) => (
                        <div key={course.id} className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition group">
                        <div className="h-40 overflow-hidden relative">
                            {course.imageUrl ? (
                            <img
                                src={course.imageUrl}
                                alt={course.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                            />
                            ) : (
                            <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                                <Zap className="w-12 h-12 text-blue-300" />
                            </div>
                            )}
                            <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                                Habilitation
                            </div>
                        </div>
                        
                        <div className="p-5 flex flex-col">
                            <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                            {course.title}
                            </h3>
                            <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                            {course.description}
                            </p>

                             {/* @ts-ignore */}
                            {course.courseSessions && course.courseSessions.length > 0 && (
                                <div className="mb-4 pt-4 border-t border-slate-100">
                                    <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Prochaines dates</p>
                                    <div className="space-y-2">
                                        {/* @ts-ignore */}
                                        {course.courseSessions.slice(0, 2).map((session: any) => (
                                            <div key={session.id} className="flex justify-between items-center text-sm bg-slate-50 p-2 rounded">
                                                <div className="flex items-center text-slate-700">
                                                    <Calendar className="w-3 h-3 mr-2 text-blue-500" />
                                                    {new Date(session.startDate).toLocaleDateString()}
                                                </div>
                                                <span className="text-xs font-medium text-green-600">Dispo</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            <Link
                                href={`/formations/${course.slug}`}
                                className="block w-full text-center bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition mt-auto"
                            >
                                Voir le programme
                            </Link>
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

