
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getCoursesByType } from "@/lib/courses";
import Link from "next/link";
import { ArrowRight, HeartPulse, Activity, Users, Clock, ShieldCheck, HelpCircle, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Formation SST : Sauveteur Secouriste du Travail | SL Formations",
  description:
    "Devenez Sauveteur Secouriste du Travail (SST). Formation certifiante pour la prévention des risques et les premiers secours en entreprise.",
};

export default async function SecourismePage() {
  const courses = await getCoursesByType("SECOURISME");

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

        {/* Qu'est-ce que le SST + Déroulement */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6">
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
          </div>
        </section>

        {/* Programme Détaillé */}
        <section className="py-16 bg-slate-50">
           <div className="max-w-5xl mx-auto px-6">
              <div className="text-center mb-12">
                 <h2 className="text-3xl font-bold text-slate-900 mb-4">Le programme en détail</h2>
                 <p className="text-slate-600">Un parcours complet pour maîtriser la conduite à tenir en cas d'accident.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                 <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-xl text-red-600 mb-4 flex items-center gap-2">
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
                    <h3 className="font-bold text-xl text-red-600 mb-4 flex items-center gap-2">
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
           </div>
        </section>

        {/* Public & Infos Pratiques */}
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                 <div className="lg:col-span-2">
                     <h2 className="text-2xl font-bold text-slate-900 mb-6">Qui peut se former ?</h2>
                     <p className="text-slate-600 text-sm leading-relaxed mb-6">
                         La formation est accessible à <strong>tous les salariés</strong>, du secteur privé ou public, sans prérequis particulier. Elle est particulièrement recommandée (et parfois obligatoire) dans les environnements à risques (industrie, BTP, etc.), mais reste pertinente pour toute entreprise souhaitant renforcer sa sécurité.
                     </p>
                     
                     <div className="bg-red-50 p-6 rounded-xl">
                         <h3 className="text-lg font-bold text-slate-900 mb-2">Renouvellement (MAC SST)</h3>
                         <p className="text-sm text-slate-700">
                             Pour maintenir la validité du certificat, le Sauveteur Secouriste du Travail doit suivre une session de <strong>Maintien et Actualisation des Compétences (MAC SST)</strong> tous les <strong>24 mois</strong>. Durée : 7 heures.
                         </p>
                     </div>
                 </div>

                 <div className="glass-effect bg-slate-50 border border-slate-200 p-6 rounded-2xl h-fit">
                     <h3 className="text-xl font-bold text-slate-900 mb-4">Informations Clés</h3>
                     <ul className="space-y-4 text-sm">
                         <li className="flex justify-between items-center py-2 border-b border-slate-200">
                             <span className="flex items-center gap-2 text-slate-600"><Clock className="w-4 h-4"/> Durée</span>
                             <span className="font-semibold">14 heures (2 jours)</span>
                         </li>
                          <li className="flex justify-between items-center py-2 border-b border-slate-200">
                             <span className="flex items-center gap-2 text-slate-600"><Users className="w-4 h-4"/> Participants</span>
                             <span className="font-semibold">4 à 10 pers.</span>
                         </li>
                          <li className="flex justify-between items-center py-2 border-b border-slate-200">
                             <span className="flex items-center gap-2 text-slate-600"><ShieldCheck className="w-4 h-4"/> Validité</span>
                             <span className="font-semibold">24 mois</span>
                         </li>
                          <li className="flex justify-between items-center py-2">
                             <span className="flex items-center gap-2 text-slate-600">Prix</span>
                             <span className="font-semibold text-gold-600">Nous consulter</span>
                         </li>
                     </ul>
                     <Link href="/contact?subject=Devis%20Formation%20SST" className="mt-6 w-full block text-center py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition">
                         Demander un devis
                     </Link>
                 </div>
            </div>
        </section>

        {/* Liste des formations dynamiques */}
        <section className="py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">Nos sessions disponibles</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                <article key={course.id} className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
                  <div className="h-48 overflow-hidden relative">
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
                     <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded uppercase tracking-wider">
                        SST / Secourisme
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-red-600 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-slate-600 text-sm mb-6 line-clamp-3 leading-relaxed">
                      {course.description}
                    </p>
                    
                     <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                      {course.slug && (
                        <Link
                          href={`/formations/${course.slug}`}
                          className="text-red-600 font-bold text-sm flex items-center hover:text-red-700 transition"
                        >
                          Voir le programme
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

         {/* FAQ */}
        <section className="py-16 bg-white">
            <div className="max-w-3xl mx-auto px-6">
                <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">Questions Fréquentes (SST)</h2>
                 <div className="space-y-4">
                     <div className="border border-slate-200 rounded-xl p-6 hover:border-red-200 transition">
                         <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-2">
                             <HelpCircle className="w-5 h-5 text-red-500"/>
                             La formation est-elle obligatoire ?
                         </h3>
                         <p className="text-slate-600 text-sm">
                             Oui, dans certains contextes (chantiers, ateliers dangereux), le Code du travail exige la présence de secouristes. C'est une obligation légale de sécurité pour l'employeur.
                         </p>
                     </div>
                     <div className="border border-slate-200 rounded-xl p-6 hover:border-red-200 transition">
                         <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-2">
                             <HelpCircle className="w-5 h-5 text-red-500"/>
                             Qui finance la formation ?
                         </h3>
                         <p className="text-slate-600 text-sm">
                             Généralement l'employeur. Elle peut aussi être prise en charge par votre OPCO (Organisme Paritaire Collecteur Agréé).
                         </p>
                     </div>
                      <div className="border border-slate-200 rounded-xl p-6 hover:border-red-200 transition">
                         <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-2">
                             <HelpCircle className="w-5 h-5 text-red-500"/>
                             Quelle est la durée de validité ?
                         </h3>
                         <p className="text-slate-600 text-sm">
                             24 mois. Un recyclage (MAC SST) est obligatoire tous les 2 ans pour conserver la certification.
                         </p>
                     </div>
                 </div>
            </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
