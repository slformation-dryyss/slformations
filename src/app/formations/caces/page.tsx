
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getCoursesByType, getAllSessionsByType } from "@/lib/courses";
import Link from "next/link";
import { ArrowRight, Clock, ShieldCheck, CheckCircle2, Calendar } from "lucide-react";
import SessionCalendar from "@/components/formations/SessionCalendar";
import SidebarFilter from "@/components/formations/SidebarFilter";

export const metadata = {
  title: "Formations CACES® | SL Formations",
  description:
    "Passez votre CACES R489 (Chariots), R486 (Nacelles), R482 (Engins de chantier) avec SL Formations. Formation certifiante pour la conduite en sécurité.",
};

export default async function CacesPage() {
  const courses = await getCoursesByType("CACES");
  const upcomingSessions = await getAllSessionsByType("CACES");

  return (
    <div className="min-h-screen flex flex-col text-slate-900 font-sans">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 bg-navy-900 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              className="w-full h-full object-cover opacity-20"
              src="https://www.flobel.fr/wp-content/uploads/2023/04/R489-CACES-850x425.jpg"
              alt="Formation CACES"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-navy-900 via-navy-900/90 to-navy-900/50" />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-6 text-center md:text-left">
            <span className="inline-block px-3 py-1 mb-4 rounded-full bg-gold-500/20 text-gold-500 text-sm font-semibold">
              Sécurité & Manutention
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Nos formations <span className="text-gold-500">CACES®</span>
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mb-8 leading-relaxed">
              Les Certificats d’Aptitude à la Conduite En Sécurité (CACES®) sont indispensables pour prévenir les risques liés à la manipulation d’engins de chantier. Assurez la sécurité et la conformité de votre activité avec nos formations certifiantes.
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
                
                {/* Intro */}
                <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                    <h2 className="text-3xl font-bold text-slate-900 mb-6">Qu'est-ce que le CACES® ?</h2>
                    <div className="prose text-slate-600 max-w-none">
                        <p className="mb-4">
                            Le CACES® (Certificat d’Aptitude à la Conduite En Sécurité) est essentiel pour valider vos compétences de conduite
                            d'engins en sécurité. Il garantit la conformité avec la réglementation (R489, R486, etc.) et réduit les risques d'accidents.
                        </p>
                        <ul className="grid sm:grid-cols-2 gap-4 mt-6">
                            <li className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg"><CheckCircle2 className="text-gold-500 w-5 h-5"/> Sécurité des opérateurs</li>
                            <li className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg"><CheckCircle2 className="text-gold-500 w-5 h-5"/> Conformité légale</li>
                            <li className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg"><CheckCircle2 className="text-gold-500 w-5 h-5"/> Compétences techniques</li>
                            <li className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg"><CheckCircle2 className="text-gold-500 w-5 h-5"/> Employabilité accrue</li>
                        </ul>
                    </div>
                </section>

                {/* Calendar */}
                <section>
                    <SessionCalendar sessions={upcomingSessions} />
                </section>

                {/* Course List */}
                <section>
                    <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                        <ShieldCheck className="w-6 h-6 text-gold-500 mr-2" />
                        Nos formations CACES® disponibles
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        {courses.map((course) => (
                            <div key={course.id} className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition group">
                                <div className="h-40 overflow-hidden relative">
                                    <img src={course.imageUrl || '/placeholder-course.jpg'} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500"/>
                                    <div className="absolute top-3 left-3 bg-gold-500 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">{course.type}</div>
                                </div>
                                <div className="p-5">
                                    <h4 className="font-bold text-slate-900 text-lg mb-2 group-hover:text-gold-600 transition">{course.title}</h4>
                                    <p className="text-slate-500 text-sm line-clamp-2 mb-4">{course.description}</p>
                                    <Link href={`/formations/${course.slug}`} className="block w-full text-center bg-slate-900 text-white font-medium py-2 rounded-lg hover:bg-gold-600 transition">
                                        Voir le programme
                                    </Link>
                                    {/* Mini sessions preview if needed */}
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

                 <div className="p-6 bg-gold-50 rounded-2xl border border-gold-100 items-center justify-between flex flex-col md:flex-row gap-4">
                    <div>
                        <h4 className="font-bold text-gold-900 mb-1">Vous ne trouvez pas votre formation ?</h4>
                        <p className="text-gold-700 text-sm">Nous organisons des sessions sur mesure pour les entreprises.</p>
                    </div>
                    <Link href="/contact" className="bg-gold-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-gold-700 transition">
                        Nous contacter
                    </Link>
                </div>
            </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
