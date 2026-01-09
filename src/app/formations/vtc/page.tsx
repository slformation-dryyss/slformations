import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getCoursesByType, getAllSessionsByType } from "@/lib/courses";
import Link from "next/link";
import { 
  ArrowRight, Clock, Users, BadgeCheck, Shield, CheckCircle2, 
  FileText, CalendarDays, Calendar, BookOpen, Target, Award,
  GraduationCap, Wallet, MapPin
} from "lucide-react";
import SessionCalendar from "@/components/formations/SessionCalendar";
import SidebarFilter from "@/components/formations/SidebarFilter";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Formation VTC Professionnel | SL Formations",
  description: "Devenez chauffeur VTC certifié avec notre formation complète. Obtenez votre carte professionnelle et lancez votre activité.",
};

export default async function FormationVTCPage() {
  const courses = await getCoursesByType("VTC");
  const upcomingSessions = await getAllSessionsByType("VTC");

  const programmeModules = [
    {
      title: "Module 1 : Réglementation du transport de personnes",
      content: (
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-gold-500 mt-0.5 flex-shrink-0" />
            <span>Cadre juridique et réglementaire du transport de personnes</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-gold-500 mt-0.5 flex-shrink-0" />
            <span>Différences entre VTC, Taxi et LOTI</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-gold-500 mt-0.5 flex-shrink-0" />
            <span>Obligations et responsabilités du chauffeur VTC</span>
          </li>
        </ul>
      ),
    },
    {
      title: "Module 2 : Gestion d'entreprise",
      content: (
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-gold-500 mt-0.5 flex-shrink-0" />
            <span>Création et gestion d'une entreprise VTC</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-gold-500 mt-0.5 flex-shrink-0" />
            <span>Comptabilité et fiscalité spécifique</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-gold-500 mt-0.5 flex-shrink-0" />
            <span>Marketing et développement commercial</span>
          </li>
        </ul>
      ),
    },
    {
      title: "Module 3 : Sécurité routière",
      content: (
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-gold-500 mt-0.5 flex-shrink-0" />
            <span>Code de la route et règles de circulation</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-gold-500 mt-0.5 flex-shrink-0" />
            <span>Conduite défensive et éco-conduite</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-gold-500 mt-0.5 flex-shrink-0" />
            <span>Gestion des situations d'urgence</span>
          </li>
        </ul>
      ),
    },
    {
      title: "Module 4 : Relation client et service",
      content: (
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-gold-500 mt-0.5 flex-shrink-0" />
            <span>Accueil et communication avec la clientèle</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-gold-500 mt-0.5 flex-shrink-0" />
            <span>Gestion des conflits et situations difficiles</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-gold-500 mt-0.5 flex-shrink-0" />
            <span>Qualité de service et fidélisation</span>
          </li>
        </ul>
      ),
    },
    {
      title: "Module 5 : Pratique professionnelle",
      content: (
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-gold-500 mt-0.5 flex-shrink-0" />
            <span>Mises en situation réelles</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-gold-500 mt-0.5 flex-shrink-0" />
            <span>Utilisation des applications et GPS</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-gold-500 mt-0.5 flex-shrink-0" />
            <span>Préparation à l'examen final</span>
          </li>
        </ul>
      ),
    },
  ];

  return (
    <div className="min-h-screen text-slate-900 font-sans flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Formation VTC */}
        <section
          id="course-hero"
          className="relative h-[600px] flex items-center justify-center overflow-hidden mt-20"
        >
          <div className="absolute inset-0 z-0">
            <img
              className="w-full h-full object-cover"
              src="https://ls-formation.fr/wp-content/uploads/2025/03/taxis-2304w.webp"
              alt="Chauffeur VTC professionnel"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/90 to-slate-900/70" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
            <div className="flex items-center space-x-3 mb-4 text-sm text-gray-300">
              <span className="text-gray-400">Formations</span>
              <span className="text-gray-500">/</span>
              <span>Formation VTC Professionnel</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-6 text-xs md:text-sm">
              <span className="px-4 py-2 bg-gold-500/20 text-gold-500 rounded-full font-semibold backdrop-blur-sm">
                VTC / Taxi
              </span>
              <span className="px-4 py-2 bg-green-500/20 text-green-400 rounded-full font-semibold backdrop-blur-sm">
                Certifiante
              </span>
              <span className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-full font-semibold backdrop-blur-sm">
                Éligible CPF
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-white">
              Formation VTC{" "}
              <span className="text-gold-500">Professionnel</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-3xl leading-relaxed">
              Devenez chauffeur VTC certifié avec notre formation complète.
              Obtenez votre carte professionnelle et lancez votre activité de
              transport de personnes dans les meilleures conditions.
            </p>

            <div className="flex flex-wrap items-center gap-6 text-sm text-white mb-10">
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

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 bg-gold-500 text-navy-900 font-bold px-8 py-4 rounded-lg hover:bg-gold-400 transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                Réserver ma formation
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#programme"
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white font-semibold px-8 py-4 rounded-lg hover:bg-white/20 transition-all border border-white/20"
              >
                Voir le programme
                <BookOpen className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <aside className="lg:w-1/4 hidden lg:block">
            <SidebarFilter />
          </aside>

          {/* Main Content */}
          <div className="lg:w-3/4 space-y-16">
            
            {/* Intro Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-gold-50 to-white rounded-2xl p-6 border border-gold-100 shadow-sm">
                <Target className="w-10 h-10 text-gold-500 mb-4" />
                <h3 className="text-lg font-bold mb-2 text-slate-900">Objectif</h3>
                <p className="text-sm text-slate-600">
                  Obtenir la carte professionnelle VTC et maîtriser tous les aspects du métier
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6 border border-blue-100 shadow-sm">
                <GraduationCap className="w-10 h-10 text-blue-500 mb-4" />
                <h3 className="text-lg font-bold mb-2 text-slate-900">Public</h3>
                <p className="text-sm text-slate-600">
                  Toute personne souhaitant devenir chauffeur VTC professionnel
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-6 border border-green-100 shadow-sm">
                <Award className="w-10 h-10 text-green-500 mb-4" />
                <h3 className="text-lg font-bold mb-2 text-slate-900">Certification</h3>
                <p className="text-sm text-slate-600">
                  Examen officiel délivré par la Chambre des Métiers
                </p>
              </div>
            </div>

            {/* Programme Section */}
            <section id="programme">
              <div className="flex items-center gap-3 mb-6">
                <BookOpen className="w-8 h-8 text-gold-500" />
                <h2 className="text-3xl font-bold text-slate-900">
                  Programme de formation
                </h2>
              </div>
              <p className="text-slate-600 mb-8 text-lg">
                Notre formation VTC couvre l'ensemble des compétences nécessaires pour exercer le métier de chauffeur VTC professionnel.
              </p>
              <Accordion className="space-y-3">
                {programmeModules.map((module, index) => (
                  <AccordionItem key={index} value={`module-${index}`}>
                    <AccordionTrigger className="text-left hover:no-underline text-slate-900 font-semibold">
                      {module.title}
                    </AccordionTrigger>
                    <AccordionContent className="text-slate-600">
                      {module.content}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

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
                    <span className="text-slate-700">Permis B depuis 3 ans minimum</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-gold-500 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Casier judiciaire volet B2 vierge</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-gold-500 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Aptitude médicale à la conduite</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-gold-500 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Maîtrise du français (lu, écrit, parlé)</span>
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
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-10 text-white">
              <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <Shield className="w-8 h-8 text-gold-500" />
                Pourquoi choisir SL Formations ?
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-gold-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Formateurs expérimentés</h3>
                    <p className="text-gray-300 text-sm">Chauffeurs VTC en activité, connaissant parfaitement le métier</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-gold-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Véhicules récents</h3>
                    <p className="text-gray-300 text-sm">Flotte de véhicules adaptés aux standards VTC</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-gold-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Accompagnement complet</h3>
                    <p className="text-gray-300 text-sm">Suivi jusqu'à l'obtention de votre carte professionnelle</p>
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

            {/* Pricing Section (New) */}
            <section id="pricing" className="py-10">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-black text-slate-900 mb-4">Nos Formules VTC</h2>
                <p className="text-slate-600">Choisissez le niveau d'accompagnement qui vous convient.</p>
              </div>
              
              <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition-all h-full flex flex-col">
                        <h3 className="text-lg font-black text-slate-900 uppercase mb-2">Pack Digital</h3>
                        <p className="text-xs text-slate-500 mb-4 italic">"Vous avez des bases mais il faut les consolider !"</p>
                        <div className="text-3xl font-black text-slate-900 mb-6">999€</div>
                        <ul className="space-y-3 text-sm flex-1 mb-6">
                            <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-slate-900 mt-0.5" /> E-learning Théorique</li>
                            <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-slate-900 mt-0.5" /> E-learning Pratique</li>
                            <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-slate-900 mt-0.5" /> Accès Quiz illimité</li>
                            <li className="flex items-start gap-2 text-gray-400"><CheckCircle2 className="w-4 h-4 mt-0.5" /> Pas de cours en salle</li>
                        </ul>
                         <Link href="/contact?subject=VTC-Pack-Digital" className="block text-center py-3 border-2 border-slate-900 text-slate-900 font-bold rounded-xl hover:bg-slate-900 hover:text-white transition">Choisir</Link>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl p-6 border-2 border-blue-100 shadow-md hover:shadow-xl transition-all h-full flex flex-col relative overflow-hidden">
                         <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 rounded-bl-full -mr-8 -mt-8"></div>
                        <h3 className="text-lg font-black text-blue-900 uppercase mb-2">Pack Essentiel</h3>
                        <p className="text-xs text-slate-500 mb-4 italic">"Vous avez quelques notions et voulez apprendre les bases"</p>
                        <div className="text-3xl font-black text-blue-600 mb-6">1199€</div>
                        <ul className="space-y-3 text-sm flex-1 mb-6">
                            <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5" /> <strong>2 Semaines</strong> de cours</li>
                            <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5" /> E-learning inclus</li>
                            <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5" /> Présentiel avec formateur</li>
                            <li className="flex items-start gap-2 text-gray-400"><CheckCircle2 className="w-4 h-4 mt-0.5" /> Frais d'examen non inclus</li>
                        </ul>
                         <Link href="/contact?subject=VTC-Pack-Essentiel" className="block text-center py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition">Choisir</Link>
                    </div>
                </div>

                 <div className="lg:col-span-1">
                    <div className="bg-slate-900 rounded-2xl p-6 border-2 border-gold-500 shadow-xl hover:scale-105 transition-all h-full flex flex-col relative transform lg:-translate-y-4">
                        <div className="absolute top-0 inset-x-0 bg-gold-500 text-slate-900 text-xs font-bold text-center py-1 uppercase tracking-wider">Recommandé</div>
                        <h3 className="text-lg font-black text-white uppercase mb-2 mt-4">Pack Gold</h3>
                        <p className="text-xs text-gray-400 mb-4 italic">"Vous n'avez aucune base et voulez tout apprendre !"</p>
                        <div className="text-3xl font-black text-gold-400 mb-6">1599€</div>
                        <ul className="space-y-3 text-sm flex-1 mb-6 text-gray-300">
                            <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-gold-500 mt-0.5" /> Tout inclus Pack Essentiel</li>
                            <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-gold-500 mt-0.5" /> <strong>Frais d'examen (206€) offerts</strong></li>
                            <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-gold-500 mt-0.5" /> Briefing Pratique 3h en salle</li>
                            <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-gold-500 mt-0.5" /> <strong>2h de conduite individuelle</strong></li>
                            <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-gold-500 mt-0.5" /> Voiture pour l'examen</li>
                        </ul>
                         <Link href="/contact?subject=VTC-Pack-Gold" className="block text-center py-3 bg-gold-500 text-slate-900 font-bold rounded-xl hover:bg-gold-400 transition">Choisir</Link>
                    </div>
                </div>

                 <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition-all h-full flex flex-col">
                        <h3 className="text-lg font-black text-slate-900 uppercase mb-2">Pack Excellence</h3>
                        <p className="text-xs text-slate-500 mb-4 italic">"Vous voulez mettre toutes les chances de votre côté !"</p>
                        <div className="text-3xl font-black text-slate-900 mb-6">1999€</div>
                        <ul className="space-y-3 text-sm flex-1 mb-6">
                            <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" /> Tout inclus Pack Gold</li>
                            <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" /> <strong>Assurance Réussite</strong></li>
                            <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" /> 2ème passage Examen inclus</li>
                            <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" /> (Théorique ou Pratique)</li>
                        </ul>
                         <Link href="/contact?subject=VTC-Pack-Excellence" className="block text-center py-3 border-2 border-slate-900 text-slate-900 font-bold rounded-xl hover:bg-slate-900 hover:text-white transition">Choisir</Link>
                    </div>
                </div>

              </div>
            </section>

            {/* Calendar */}
            <section>
              <SessionCalendar sessions={upcomingSessions} />
            </section>

            {/* Course List (Dynamic) */}
            {courses.length > 0 && (
              <section>
                <h3 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                  <BadgeCheck className="w-8 h-8 text-gold-500" />
                  Nos programmes VTC
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {courses.map((course) => (
                    <div key={course.id} className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all group">
                      <div className="h-48 overflow-hidden relative">
                        <img src={course.imageUrl || '/placeholder-course.jpg'} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
                        <div className="absolute top-4 left-4 bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">VTC</div>
                      </div>
                      <div className="p-6">
                        <h4 className="font-bold text-slate-900 text-xl mb-3 group-hover:text-gold-600 transition">{course.title}</h4>
                        <p className="text-slate-600 text-sm line-clamp-2 mb-5">{course.description}</p>
                        <Link href={`/formations/${course.slug}`} className="block w-full text-center bg-slate-900 text-white font-semibold py-3 rounded-lg hover:bg-gold-600 transition-all shadow-sm hover:shadow-md">
                          Découvrir le programme
                        </Link>
                        {/* @ts-ignore */}
                        {course.courseSessions && course.courseSessions.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center text-sm text-slate-500">
                            <Calendar className="w-4 h-4 mr-2 text-gold-500" />
                            Prochaine session : {new Date(course.courseSessions[0].startDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}







