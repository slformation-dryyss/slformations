
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getCoursesByType, getAllSessionsByType } from "@/lib/courses";
import Link from "next/link";
import { ArrowRight, HeartPulse, Activity, Users, Clock, ShieldCheck, HelpCircle, CheckCircle2, Calendar } from "lucide-react";
import SessionCalendar from "@/components/formations/SessionCalendar";
import SidebarFilter from "@/components/formations/SidebarFilter";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Formation SST : Sauveteur Secouriste du Travail | SL Formations",
  description:
    "Devenez Sauveteur Secouriste du Travail (SST). Formation certifiante pour la prévention des risques et les premiers secours en entreprise.",
};

export default async function SecourismePage() {
  const courses = await getCoursesByType("SECOURISME");
  const upcomingSessions = await getAllSessionsByType("SECOURISME");

  return (
    <div className="min-h-screen flex flex-col text-slate-900 font-sans">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 bg-red-900 overflow-hidden">
             <div className="absolute inset-0 z-0">
             <img
              className="w-full h-full object-cover opacity-20"
              src="https://img.freepik.com/free-photo/training-first-aid-cpr-dummy_23-2149367440.jpg"
              alt="Formation Secourisme"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-red-900 via-red-900/90 to-red-950/60" />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-6 text-center md:text-left">
             <span className="inline-block px-3 py-1 mb-4 rounded-full bg-white/20 text-white text-sm font-semibold">
              Santé & Sécurité au Travail
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Formation <span className="text-red-400">SST</span><br/>
              Sauveteur Secouriste du Travail
            </h1>
            <p className="text-lg text-red-100 max-w-2xl mb-8 leading-relaxed">
              Devenez un acteur clé de la prévention dans votre entreprise. Acquérez les compétences pour intervenir efficacement face à une situation d'accident du travail.
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
                 {/* Qu'est-ce que le SST */}
                 <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                    <div className="grid lg:grid-cols-2 gap-12 text-slate-600 leading-relaxed">
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold text-slate-900">Qu’est-ce que la formation SST ?</h2>
                            <p>
                                La formation Sauveteur Secouriste du Travail (SST) est une certification essentielle dans certains environnements professionnels. Elle prépare les employés à intervenir efficacement en cas d’accident ou de situation d’urgence sur leur lieu de travail.
                            </p>
                            <p>
                                Elle couvre les techniques de premiers secours adaptées au milieu professionnel : reconnaître les signes de détresse, réaliser les gestes qui sauvent, et utiliser les équipements d'urgence comme les défibrillateurs. C'est un atout pour la sécurité des salariés et une réponse aux obligations légales des entreprises.
                            </p>
                        </div>
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold text-slate-900">Comment se déroule la formation ?</h2>
                            <p>
                                La formation se déroule généralement sur <strong>2 jours (14h)</strong> et s'articule en deux phases :
                            </p>
                            <ul className="space-y-4">
                                <li className="flex gap-3">
                                    <div className="p-2 bg-red-50 rounded-lg h-fit text-red-600 font-bold">1</div>
                                    <div>
                                        <strong className="block text-slate-900">Théorie & Prévention</strong>
                                        <span className="text-sm">Principes de base, cadre juridique, protection, examen, alerte.</span>
                                    </div>
                                </li>
                                <li className="flex gap-3">
                                    <div className="p-2 bg-red-50 rounded-lg h-fit text-red-600 font-bold">2</div>
                                    <div>
                                        <strong className="block text-slate-900">Pratique & Mises en situation</strong>
                                        <span className="text-sm">Apprentissage des gestes (RCP, hémorragies, étouffement) et simulations d'accidents.</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                 </section>

                {/* Calendar */}
                <section>
                    <SessionCalendar sessions={upcomingSessions} />
                </section>

                {/* Course List */}
                <section>
                     <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                        <HeartPulse className="w-6 h-6 text-red-500 mr-2" />
                        Nos sessions disponibles
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                    {courses.map((course) => (
                        <div key={course.id} className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition group">
                        <div className="h-40 overflow-hidden relative">
                            {course.imageUrl ? (
                            <img
                                src={course.imageUrl}
                                alt={course.title}
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                            />
                            ) : (
                            <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                                <HeartPulse className="w-12 h-12 text-red-300" />
                            </div>
                            )}
                            <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                                SST
                            </div>
                        </div>
                        
                        <div className="p-5 flex flex-col">
                            <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-red-600 transition-colors">
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
                                                    <Calendar className="w-3 h-3 mr-2 text-red-500" />
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
                                className="block w-full text-center bg-red-600 text-white font-medium py-2 rounded-lg hover:bg-red-700 transition bottom-0 mt-auto"
                            >
                                Voir le programme
                            </Link>

                        </div>
                        </div>
                    ))}
                    </div>
                </section>

                {/* Detailed Program (Compact) */}
                <section className="bg-slate-50 p-8 rounded-2xl border border-slate-200">
                  <div className="text-center mb-8">
                     <h2 className="text-2xl font-bold text-slate-900 mb-2">Le programme en détail</h2>
                     <p className="text-slate-600 text-sm">Un parcours complet pour maîtriser la conduite à tenir en cas d'accident.</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                     <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <h3 className="font-bold text-lg text-red-600 mb-4 flex items-center gap-2">
                            <Activity className="w-5 h-5" />
                            Domaine de compétence 1
                        </h3>
                        <ul className="space-y-3 text-sm text-slate-700">
                            <li className="flex gap-2">
                                 <CheckCircle2 className="w-4 h-4 text-red-400 mt-1 shrink-0" />
                                 <span>Notions de prévention, rôle et prérogatives du SST.</span>
                            </li>
                            <li className="flex gap-2">
                                 <CheckCircle2 className="w-4 h-4 text-red-400 mt-1 shrink-0" />
                                 <span>Rechercher les risques persistants pour protéger.</span>
                            </li>
                             <li className="flex gap-2">
                                 <CheckCircle2 className="w-4 h-4 text-red-400 mt-1 shrink-0" />
                                 <span>De "Protéger" à "Prévenir".</span>
                            </li>
                             <li className="flex gap-2">
                                 <CheckCircle2 className="w-4 h-4 text-red-400 mt-1 shrink-0" />
                                 <span>Examiner la victime et faire alerter.</span>
                            </li>
                        </ul>
                     </div>

                     <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <h3 className="font-bold text-lg text-red-600 mb-4 flex items-center gap-2">
                            <HeartPulse className="w-5 h-5" />
                            Domaine de compétence 2
                        </h3>
                         <p className="text-sm text-slate-500 mb-3 italic">Secourir la victime qui :</p>
                        <ul className="space-y-3 text-sm text-slate-700">
                            <li className="flex gap-2">
                                 <CheckCircle2 className="w-4 h-4 text-red-400 mt-1 shrink-0" />
                                 <span>Saigne abondamment.</span>
                            </li>
                            <li className="flex gap-2">
                                 <CheckCircle2 className="w-4 h-4 text-red-400 mt-1 shrink-0" />
                                 <span>S'étouffe.</span>
                            </li>
                             <li className="flex gap-2">
                                 <CheckCircle2 className="w-4 h-4 text-red-400 mt-1 shrink-0" />
                                 <span>Se plaint de malaise, brûlures, douleurs, ou plaies.</span>
                            </li>
                             <li className="flex gap-2">
                                 <CheckCircle2 className="w-4 h-4 text-red-400 mt-1 shrink-0" />
                                 <span>Ne répond pas mais respire (PLS).</span>
                            </li>
                            <li className="flex gap-2">
                                 <CheckCircle2 className="w-4 h-4 text-red-400 mt-1 shrink-0" />
                                 <span>Ne répond pas et ne respire pas (RCP + Défibrillateur).</span>
                            </li>
                        </ul>
                     </div>
                  </div>
               </section>

               {/* FAQ */}
               <section>
                    <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                        <HelpCircle className="w-5 h-5 text-red-500 mr-2"/>
                        Questions Fréquentes
                    </h2>
                     <div className="space-y-4">
                         <div className="bg-white border border-slate-200 rounded-xl p-6 hover:border-red-200 transition">
                             <h3 className="font-bold text-slate-900 mb-2 text-sm">
                                 La formation est-elle obligatoire ?
                             </h3>
                             <p className="text-slate-600 text-sm">
                                 Oui, dans certains contextes (chantiers, ateliers dangereux), le Code du travail exige la présence de secouristes.
                             </p>
                         </div>
                         <div className="bg-white border border-slate-200 rounded-xl p-6 hover:border-red-200 transition">
                             <h3 className="font-bold text-slate-900 mb-2 text-sm">
                                 Quelle est la durée de validité ?
                             </h3>
                             <p className="text-slate-600 text-sm">
                                 24 mois. Un recyclage (MAC SST) est obligatoire tous les 2 ans.
                             </p>
                         </div>
                     </div>
               </section>

             </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

