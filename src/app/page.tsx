import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import {
  ArrowRight,
  Car,
  Clock,
  Euro,
  Users,
  Settings,
  Zap,
  Star,
  Shield,
  UserCheck,
  Tag,
  Wrench,
  Headphones,
  Wallet,
  Building2,
  Handshake,
  Check,
  Phone,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata = {
  title: "SL Formations | Centre de Formation Professionnelle Pluridisciplinaire",
  description:
    "SL Formations, votre centre de formation agréé à Pontault-Combault. Permis de conduire (A, B, C), CACES, Sécurité, VTC, Taxi, et Formations Numériques. Financement CPF & France Travail.",
  keywords: "auto-école, formation professionnelle, permis moto, permis voiture, CACES, VTC, taxi, sécurité, SSIAP, Pontault-Combault, CPF",
  icons: {
    icon: '/favicon.png',
  },
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col text-slate-900 font-sans">
      <Header />

      <main className="flex-1">
        {/* Hero Section - Bienvenue */}
        <section
          id="hero"
          className="relative min-h-[620px] flex items-center overflow-hidden mt-20"
        >
          <div className="absolute inset-0 z-0">
            <img
              className="w-full h-full object-cover"
              src="https://ls-formation.fr/wp-content/uploads/2025/03/femme-auto-ecole-2304w.webp"
              alt="Élève en leçon de conduite"
            />
            {/* Overlay un peu moins sombre pour améliorer la lisibilité */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/60 to-transparent" />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto px-6 py-16 flex flex-col gap-10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-black/60 border border-gold-500/30 mb-4 text-xs md:text-sm font-semibold text-gold-500">
                Centre de formation professionnelle pluridisciplinaire
              </div>

              <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight drop-shadow-[0_10px_40px_rgba(0,0,0,0.8)] text-white">
                Bienvenue chez{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-500 to-gold-600 drop-shadow-sm">
                  SL Formations
                </span>
              </h1>

              <p className="text-lg md:text-xl text-white mb-3 max-w-2xl font-medium drop-shadow-[0_6px_20px_rgba(0,0,0,0.85)]">
                Votre partenaire formation : Transport, Logistique, Sécurité, Informatique & Pédagogie.
              </p>
              <p className="text-base md:text-lg text-slate-100 mb-6 max-w-2xl leading-relaxed drop-shadow-[0_6px_20px_rgba(0,0,0,0.85)]">
                Centre certifié Qualiopi, nous vous accompagnons vers la réussite avec des parcours sur-mesure.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Link
                  href="/contact"
                  className="px-8 py-4 bg-gold-500 text-slate-900 rounded-full font-bold text-lg hover:bg-gold-600 shadow-lg hover:shadow-gold-500/30 transition flex items-center space-x-2"
                >
                  <span>Appelez-nous</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/formations"
                  className="px-8 py-4 rounded-full font-semibold text-slate-900 bg-white hover:bg-slate-100 border border-white/80 transition flex items-center space-x-2 shadow-md/40"
                >
                  <span>Découvrir nos formations</span>
                </Link>
              </div>
            </div>

            {/* Carte domaines : design premium avec grille et icônes */}
            <div className="rounded-2xl p-6 md:p-8 bg-white/95 border border-slate-200 shadow-2xl max-w-4xl backdrop-blur-sm">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-6 text-slate-900 flex items-center gap-2">
                    <Star className="w-5 h-5 text-gold-500 fill-gold-500" />
                    Nos domaines d'excellence
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                    {[
                      "Permis de conduire (A, B, C)",
                      "Transport & Logistique",
                      "Formations VTC & Taxi",
                      "Informatique & Bureautique",
                      "CACES & Engins",
                      "Sécurité & Surveillance",
                      "Habilitations Électriques",
                      "Enseignement & Pédagogie",
                      "Sécurité Incendie (SSIAP)",
                      "Récupération de points",
                    ].map((item, index) => (
                      <div key={index} className="flex items-center space-x-2.5 group">
                        <div className="w-1.5 h-1.5 rounded-full bg-gold-500 group-hover:scale-125 transition-transform" />
                        <span className="text-slate-700 text-sm font-medium group-hover:text-slate-900 transition-colors">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Séparateur vertical pour desktop */}
                <div className="hidden md:block w-px bg-slate-100 self-stretch" />

                {/* Partie Stats compacte */}
                <div className="flex flex-row md:flex-col items-center md:items-start justify-between md:justify-center gap-4 md:min-w-[140px]">
                  <div className="text-center md:text-left">
                    <div className="text-2xl font-black text-slate-900">95%</div>
                    <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">Satisfaction</div>
                  </div>
                  <div className="text-center md:text-left">
                    <div className="text-2xl font-black text-gold-600">+2000</div>
                    <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">Élèves formés</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Nos permis */}
        {/* Pôles d'Expertise (moved up) */}
        <section id="formations-pro" className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-3 text-slate-900">
                Nos <span className="text-gold-500">Pôles d'Expertise</span>
              </h2>
              <p className="text-lg text-slate-600 mb-4 max-w-3xl mx-auto">
                Logistique, CACES, Sécurité, Informatique... Développez votre employabilité.
              </p>
              <p className="text-slate-600 max-w-2xl mx-auto">
                <span className="font-semibold text-slate-900">
                  Votre avenir commence ici.
                  <span className="text-gold-500"> Certifié Qualiopi.</span>
                </span>
                <br />
                Formez-vous aux métiers qui recrutent : agent de sécurité, CACES, numérique... 
                Financement CPF, France Travail et OPCO.
              </p>
              <div className="mt-6">
                <Link
                  href="/formations"
                  className="inline-flex items-center px-6 py-3 rounded-lg bg-gold-500 text-white font-semibold hover:bg-gold-600 transition shadow-lg hover:shadow-gold-500/20"
                >
                  formation professionnelle
                </Link>
              </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Formation Transport */}
              {/* Formation IT */}
              <article className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm card-hover flex flex-col">
                <div className="h-48 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=800"
                    alt="Informatique et Bureautique"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-2xl font-bold mb-2 text-slate-900">Numérique & Bureautique</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    Pack Office, outils collaboratifs et initiation web.
                    Certifications TOSA pour valoriser votre CV digital.
                  </p>
                  <Link
                    href="/formations"
                    className="mt-auto inline-flex items-center text-gold-500 text-sm font-semibold hover:text-gold-400"
                  >
                    Découvrir le pôle IT
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </article>

              {/* Formation Travaux publics */}
              <article className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm card-hover flex flex-col">
                <div className="h-48 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=800"
                    alt="Formation travaux publics"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-2xl font-bold mb-2 text-slate-900">
                    Formation Travaux publics
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    CACES R482 (engins de chantier) et R483 (grues mobiles). 
                    Formations réglementaires pour travailler en toute sécurité.
                  </p>
                  <Link
                    href="/formations"
                    className="mt-auto inline-flex items-center text-gold-500 text-sm font-semibold hover:text-gold-400"
                  >
                    En savoir plus
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </article>

              {/* Formation CACES */}
              <article className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm card-hover flex flex-col">
                <div className="h-48 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&q=80&w=800"
                    alt="Formation CACES"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-2xl font-bold mb-2 text-slate-900">Formation CACES</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    Obtenez votre CACES pour nacelles, grues et engins de chantier. 
                    Nous vous guidons vers la certification adaptée à vos besoins.
                  </p>
                  <Link
                    href="/formations"
                    className="mt-auto inline-flex items-center text-gold-500 text-sm font-semibold hover:text-gold-400"
                  >
                    En savoir plus
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </article>

              {/* Formation Sécurité */}
              <article className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm card-hover flex flex-col">
                <div className="h-48 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800"
                    alt="Sécurité Privée et Incendie"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-2xl font-bold mb-2 text-slate-900">
                    Sécurité & Prévention
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    Agent de sécurité (Titre RNCP), SSIAP 1-2-3, SST et Habilitations Électriques. 
                    Des diplômes reconnus pour des métiers en tension.
                  </p>
                  <Link
                    href="/formations"
                    className="mt-auto inline-flex items-center text-gold-500 text-sm font-semibold hover:text-gold-400"
                  >
                    Formations Sécurité
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* Nos permis */}
        <section id="permis" className="py-20 bg-white border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-2 text-slate-900">
                Formations <span className="text-gold-500">Permis & Conduite</span>
              </h2>
              <p className="text-lg text-slate-600">
                Un centre de formation certifié pour votre mobilité professionnelle et personnelle
              </p>
              <p className="text-slate-500 mt-4 max-w-2xl mx-auto">
                Permis A, B, VTC & Taxi. Nos formateurs diplômés vous accompagnent vers la réussite.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Permis A */}
              <article className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm card-hover flex flex-col">
                <div className="h-48 overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    src="https://ls-formation.fr/wp-content/uploads/2025/03/moto-ecole-397w.webp"
                    alt="Permis moto"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <span className="inline-block px-3 py-1 mb-3 rounded-full bg-gold-500/15 text-gold-500 text-xs font-semibold">
                    Permis A - Moto
                  </span>
                  <h3 className="text-2xl font-bold mb-3 text-slate-900">Permis A - Moto</h3>
                  <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                    Formez-vous aux permis A1, A2 et A. Bénéficiez d'un suivi complet avec des moniteurs expérimentés pour une conduite 100% sécurisée.
                  </p>
                  <div className="mt-auto flex items-center justify-between text-sm text-gray-400">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>20h de conduite</span>
                    </span>
                    <span className="flex items-center space-x-1 text-gold-500 font-semibold">
                      <Euro className="w-4 h-4" />
                      <span>à partir de 695€</span>
                    </span>
                  </div>
                </div>
              </article>

              {/* Permis B */}
              <article className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm card-hover flex flex-col">
                <div className="h-48 overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    src="https://ls-formation.fr/wp-content/uploads/2025/03/father-teaching-his-teenage-son-to-drive.jpg"
                    alt="Permis B"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <span className="inline-block px-3 py-1 mb-3 rounded-full bg-gold-500/15 text-gold-500 text-xs font-semibold">
                    Permis B – Voiture
                  </span>
                  <h3 className="text-2xl font-bold mb-3 text-slate-900">
                    Permis B - Boîte automatique et manuelle
                  </h3>
                  <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                    Choisissez votre formule : boîte automatique ou manuelle. Nous vous proposons un forfait personnalisé adapté à votre profil pour une réussite rapide.
                  </p>
                  <div className="mt-auto flex items-center justify-between text-sm text-gray-400">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>20h de conduite</span>
                    </span>
                    <span className="flex flex-col items-end text-gold-500 font-semibold">
                      <span>Auto : 980€</span>
                      <span>Manuelle : 1095€</span>
                    </span>
                  </div>
                </div>
              </article>

              {/* Formation VTC */}
              <article className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm card-hover flex flex-col">
                <div className="h-48 overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    src="https://ls-formation.fr/wp-content/uploads/2025/03/taxis-2304w.webp"
                    alt="Formation VTC"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <span className="inline-block px-3 py-1 mb-3 rounded-full bg-gold-500/15 text-gold-500 text-xs font-semibold">
                    Formation Pro
                  </span>
                  <h3 className="text-2xl font-bold mb-3 text-slate-900">
                    Formation VTC & Taxi
                  </h3>
                  <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                    Préparez votre examen théorique et pratique avec nos experts. Formation complète incluant réglementation, gestion et sécurité pour lancer votre carrière.
                  </p>
                  <div className="mt-auto flex items-center justify-between text-sm text-gray-400">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>Formation intensive</span>
                    </span>
                    <span className="flex items-center space-x-1 text-gold-500 font-semibold">
                      <Euro className="w-4 h-4" />
                      <span>à partir de 399€</span>
                    </span>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>



        {/* Statistiques & atouts */}
        <section id="stats" className="py-24 bg-white relative overflow-hidden">
          {/* Subtle background decorative element */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-gold-500/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-6 relative space-y-20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
              <div className="flex flex-col items-center">
                <div className="p-4 bg-gold-500/10 rounded-2xl mb-4 group hover:bg-gold-500/20 transition-colors">
                  <Star className="w-8 h-8 text-gold-600" />
                </div>
                <div className="text-4xl md:text-5xl font-black text-slate-900 mb-1">
                  95<span className="text-gold-500">%</span>
                </div>
                <div className="text-slate-500 text-sm font-medium uppercase tracking-wider">
                  Satisfaction
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="p-4 bg-gold-500/10 rounded-2xl mb-4 group hover:bg-gold-500/20 transition-colors">
                  <UserCheck className="w-8 h-8 text-gold-600" />
                </div>
                <div className="text-4xl md:text-5xl font-black text-slate-900 mb-1">
                  +10
                </div>
                <div className="text-slate-500 text-sm font-medium uppercase tracking-wider">
                  Experts
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="p-4 bg-gold-500/10 rounded-2xl mb-4 group hover:bg-gold-500/20 transition-colors">
                  <Users className="w-8 h-8 text-gold-600" />
                </div>
                <div className="text-4xl md:text-5xl font-black text-slate-900 mb-1">
                  +200
                </div>
                <div className="text-slate-500 text-sm font-medium uppercase tracking-wider">
                  Élèves Réussis
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="p-4 bg-gold-500/10 rounded-2xl mb-4 group hover:bg-gold-500/20 transition-colors">
                  <Zap className="w-8 h-8 text-gold-600" />
                </div>
                <div className="text-4xl md:text-5xl font-black text-slate-900 mb-1">
                  +50
                </div>
                <div className="text-slate-500 text-sm font-medium uppercase tracking-wider">
                  Sessions / Semaine
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[0.8fr,1.2fr] gap-16 items-center">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-gold-500 to-gold-600 rounded-3xl opacity-10 group-hover:opacity-20 transition-opacity blur-xl" />
                <div className="relative glass-effect rounded-2xl p-8 bg-white/60 border border-gold-500/20 shadow-xl overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Car className="w-32 h-32 -rotate-12" />
                  </div>
                  <h3 className="text-3xl font-bold mb-4 text-slate-900">
                    Des formations <span className="text-gold-500">d&apos;excellence</span>
                  </h3>
                  <p className="text-slate-600 text-lg leading-relaxed">
                    Formateurs qualifiés, programmes sur-mesure. Du permis aux certifications pro (CACES, Sécurité...), nous garantissons votre réussite.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-3xl font-bold mb-6 text-slate-900 leading-tight">
                  L’apprentissage en toute sérénité avec{" "}
                  <span className="text-gradient-gold">SL Formations</span>
                </h3>
                <p className="text-slate-600 text-lg mb-8">
                  Véhicules récents, pédagogie innovante et accompagnement premium.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                  {[
                    { icon: Shield, text: "Sécurité Maximale" },
                    { icon: UserCheck, text: "Instructeurs Certifiés" },
                    { icon: Tag, text: "Meilleur Rapport Qualité/Prix" },
                    { icon: Wrench, text: "Flotte Récente" },
                    { icon: Headphones, text: "Support Dédié" },
                    { icon: Star, text: "Certifié Qualiopi" },
                  ].map((feature, i) => (
                    <div key={i} className="flex flex-col items-start p-4 rounded-2xl bg-slate-50 hover:bg-white border border-transparent hover:border-gold-500/30 transition-all shadow-sm hover:shadow-md group">
                      <feature.icon className="w-10 h-10 text-gold-500 mb-3 group-hover:scale-110 transition-transform" />
                      <span className="font-bold text-slate-900 leading-tight">{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Financement */}
        <section id="financing" className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 bg-gold-500/10 border border-gold-500/20 rounded-full px-4 py-2 mb-6">
                <Euro className="w-4 h-4 text-gold-500" />
                <span className="text-sm font-semibold text-slate-900">
                  Financement Simplifié
                </span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
                Ne Payez Rien de Votre Poche
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Nous vous guidons pour une prise en charge totale ou partielle de votre formation.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {/* CPF */}
              <div className="bg-white rounded-3xl p-8 shadow-lg card-hover border border-gray-100">
                <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mb-6">
                  <Wallet className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  Compte Personnel de Formation
                </h3>
                <p className="text-slate-600 mb-6">
                  Financement jusqu'à 100% via vos droits acquis.
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-green-500 mt-1" />
                    <span className="text-slate-700">Démarche 100% en ligne</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-green-500 mt-1" />
                    <span className="text-slate-700">Paiement direct</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-green-500 mt-1" />
                    <span className="text-slate-700">Aucune avance de frais</span>
                  </li>
                </ul>
                <Link
                  href="/financement"
                  className="inline-flex items-center space-x-2 text-blue-600 font-semibold hover:underline"
                >
                  <span>Vérifier mes droits</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* France Travail */}
              <div className="bg-white rounded-3xl p-8 shadow-lg card-hover border border-gray-100">
                <div className="w-20 h-20 bg-green-50 rounded-2xl flex items-center justify-center mb-6">
                  <Building2 className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  France Travail / Pôle Emploi
                </h3>
                <p className="text-slate-600 mb-6">
                  Aide au financement pour votre reconversion.
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-green-500 mt-1" />
                    <span className="text-slate-700">AIF (Aide Individuelle)</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-green-500 mt-1" />
                    <span className="text-slate-700">AFPR / POEI</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-green-500 mt-1" />
                    <span className="text-slate-700">
                      Accompagnement personnalisé
                    </span>
                  </li>
                </ul>
                <Link
                  href="/financement"
                  className="inline-flex items-center space-x-2 text-green-600 font-semibold hover:underline"
                >
                  <span>Monter mon dossier</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Entreprise */}
              <div className="bg-white rounded-3xl p-8 shadow-lg card-hover border border-gray-100">
                <div className="w-20 h-20 bg-purple-50 rounded-2xl flex items-center justify-center mb-6">
                  <Handshake className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  Financement Entreprise
                </h3>
                <p className="text-slate-600 mb-6">
                  Financement via OPCO pour salariés et employeurs.
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-green-500 mt-1" />
                    <span className="text-slate-700">Plan de développement</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-green-500 mt-1" />
                    <span className="text-slate-700">Pro-A / FNE</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-green-500 mt-1" />
                    <span className="text-slate-700">Devis personnalisé</span>
                  </li>
                </ul>
                <Link
                  href="/contact"
                  className="inline-flex items-center space-x-2 text-purple-600 font-semibold hover:underline"
                >
                  <span>Demander un devis</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="bg-gradient-to-r from-gold-500 to-gold-400 rounded-3xl p-12 text-center text-slate-900">
              <h3 className="text-3xl font-bold mb-4">
                Besoin d'aide pour votre financement ?
              </h3>
              <p className="text-xl mb-8 max-w-2xl mx-auto">
                Nous gérons vos démarches administratives gratuitement.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center space-x-2 bg-white text-gold-600 px-8 py-4 rounded-lg font-bold hover:shadow-xl transition"
              >
                <Phone className="w-5 h-5" />
                <span>Être rappelé gratuitement</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Processus */}
        <section id="processus" className="py-24 bg-slate-50 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 relative">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 text-slate-900">
                Notre <span className="text-gradient-gold">processus</span> de réussite
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Un accompagnement structuré en trois étapes clés pour obtenir votre permis en toute confiance.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
              {/* Desktop connecting lines */}
              <div className="hidden md:block absolute top-1/4 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-gold-500/0 via-gold-500/20 to-gold-500/0" />
              
              {[
                {
                  step: "01",
                  title: "Choisissez votre permis",
                  desc: "Sélectionnez la catégorie (A, B, C, VTC, Taxi) qui correspond à votre projet professionnel ou personnel.",
                },
                {
                  step: "02",
                  title: "Programme Personnalisé",
                  desc: "Planifiez vos séances selon vos disponibilités avec nos moniteurs experts pour une progression à votre rythme.",
                },
                {
                  step: "03",
                  title: "Succès à l'Examen",
                  desc: "Passez votre examen avec sérénité grâce à notre préparation intensive et obtenez votre précieux sésame.",
                },
              ].map((item, i) => (
                <div key={i} className="group relative">
                  <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl hover:shadow-2xl hover:border-gold-500/50 transition-all duration-300 relative z-10 flex flex-col h-full">
                    <div className="w-16 h-16 bg-gradient-to-br from-gold-400 to-gold-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black mb-6 shadow-lg shadow-gold-500/20 group-hover:scale-110 transition-transform">
                      {item.step}
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-slate-900 group-hover:text-gold-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 text-lg leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                  {/* Decorative background number */}
                  <div className="absolute -bottom-4 -right-2 text-9xl font-black text-slate-100/50 pointer-events-none select-none z-0 group-hover:text-gold-500/5 transition-colors">
                    {item.step}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Témoignages */}
        <section id="testimonials" className="py-32 bg-white relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl" />
          
          <div className="max-w-7xl mx-auto px-6 relative">
            <div className="text-center mb-20">
              <span className="inline-block px-4 py-1.5 rounded-full bg-gold-500/10 text-gold-600 text-xs font-bold uppercase tracking-widest mb-4">Avis clients</span>
              <h2 className="text-4xl md:text-6xl font-black mb-6 text-slate-900 tracking-tight">
                Ce que nos <span className="text-gradient-gold">élèves</span> disent
              </h2>
              <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
                La réussite de nos élèves est notre plus grande fierté. Découvrez leurs expériences vécues au sein de SL Formations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[
                {
                  name: "Inès Bouraoui",
                  role: "Élève Permis B",
                  text: "Je suis actuellement inscrite à cette école. Un accueil très chaleureux et une équipe qui motive. Ma monitrice est très patiente et passionnée, elle adapte parfaitement les cours à mes lacunes.",
                  stars: 5,
                },
                {
                  name: "Clara C",
                  role: "Élève Permis Moto",
                  text: "Excellente auto-école ! Les moniteurs sont pédagogues et l'ambiance est vraiment propice à l'apprentissage. Je recommande les yeux fermés ! ✅",
                  stars: 5,
                },
                {
                  name: "Marc D",
                  role: "Formation VTC",
                  text: "Formation VTC au top. Très professionnel, contenu clair et préparation intensive pour l'examen. J'ai eu mon attestation du premier coup !",
                  stars: 5,
                },
              ].map((testimonial, i) => (
                <div key={i} className="group relative bg-white rounded-[2rem] p-10 border border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-500 flex flex-col h-full hover:-translate-y-2">
                  <div className="absolute top-8 right-10 text-gold-500/10 group-hover:text-gold-500/20 transition-colors">
                    <Zap className="w-16 h-16 fill-current" />
                  </div>
                  
                  <div className="flex items-center gap-5 mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-gold-500/20 transition-transform">
                      {testimonial.name[0]}
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 group-hover:text-gold-600 transition-colors tracking-tight">
                        {testimonial.name}
                      </h4>
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{testimonial.role}</p>
                    </div>
                  </div>

                  <div className="flex text-gold-500 mb-6 space-x-1">
                    {[...Array(testimonial.stars)].map((_, s) => (
                      <Star key={s} className="w-5 h-5 fill-current" />
                    ))}
                  </div>

                  <p className="text-slate-600 italic text-lg leading-loose relative z-10 flex-1">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>

                  <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex -space-x-2">
                       <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100" />
                       <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" />
                    </div>
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Verified</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Permis */}
        <section id="pricing-permis" className="py-32 bg-slate-50 relative overflow-hidden">
          {/* Abstract background shapes */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gold-500/5 -skew-x-12 translate-x-1/2" />
          
          <div className="max-w-7xl mx-auto px-6 relative">
            <div className="text-center mb-24">
              <span className="inline-block px-4 py-1.5 rounded-full bg-gold-500/10 text-gold-600 text-xs font-bold uppercase tracking-widest mb-4">Investissez dans votre avenir</span>
              <h2 className="text-4xl md:text-6xl font-black mb-6 text-slate-900 tracking-tight">
                Nos <span className="text-gradient-gold">Formules</span> Permis
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Des tarifs transparents et compétitifs pour des formations d&apos;excellence. Trouvez le pack qui vous correspond.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-stretch">
              {/* Permis A – Moto */}
              <article className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-xl flex flex-col transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 group">
                <div className="mb-10">
                  <span className="text-gold-600 font-black text-xs uppercase tracking-[0.25em]"> Liberté totale</span>
                  <h3 className="text-3xl font-black text-slate-900 mt-2 tracking-tight group-hover:text-gold-600 transition-colors">Permis A – Moto</h3>
                </div>
                
                <div className="mb-10 flex flex-col">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">à partir de</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-6xl font-black text-slate-900 tracking-tighter">695</span>
                    <span className="text-3xl font-bold text-gold-500">€</span>
                  </div>
                </div>

                <ul className="space-y-5 mb-12 flex-1">
                  {["8h plateau + 12h circulation", "Accès code moto interactif", "Livret pédagogique inclus", "Accompagnement examen"].map((f, i) => (
                    <li key={i} className="flex items-start gap-4 text-slate-600 group/item">
                      <div className="w-6 h-6 rounded-full bg-gold-500/10 flex items-center justify-center shrink-0 mt-0.5 group-hover/item:bg-gold-500 group-hover/item:text-white transition-colors">
                        <ArrowRight className="w-3 h-3" />
                      </div>
                      <span className="font-bold text-sm tracking-tight">{f}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/formations/permis-moto" className="group/btn relative w-full py-5 text-center rounded-[1.5rem] bg-slate-900 text-white font-black overflow-hidden shadow-xl shadow-slate-900/10 transition-all hover:scale-[1.02] active:scale-95">
                  <span className="relative z-10">DÉCOUVRIR LES FORFAITS</span>
                  <div className="absolute inset-0 bg-gold-500 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                </Link>
              </article>

              {/* Permis B – Voiture - ELITE */}
              <article className="relative rounded-[3rem] p-12 bg-slate-900 text-white flex flex-col shadow-2xl transition-all duration-500 scale-110 z-20 border-[6px] border-gold-500/20 group overflow-hidden">
                <div className="absolute top-10 right-10 opacity-10 rotate-12">
                   <Star className="w-32 h-32 fill-current" />
                </div>
                
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-gold-400 via-gold-600 to-gold-400" />
                
                <div className="mb-10">
                  <span className="bg-gold-500 text-slate-900 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Le plus populaire</span>
                  <h3 className="text-4xl font-black text-white mt-4 tracking-tight">Permis B</h3>
                  <p className="text-slate-400 text-sm mt-2 font-bold uppercase tracking-widest opacity-60">Pack Excellence</p>
                </div>

                <div className="mb-10 flex flex-col">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-1 opacity-80">à partir de</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-7xl font-black text-white tracking-tighter">980</span>
                    <span className="text-4xl font-bold text-gold-500">€</span>
                  </div>
                </div>

                <ul className="space-y-6 mb-12 flex-1">
                  {["20h de conduite individuelle", "Accès code illimité 24/7", "Formation intensive VIP", "Gestion administrative offerte", "Accompagnement examen"].map((f, i) => (
                    <li key={i} className="flex items-start gap-5 text-slate-300">
                      <div className="w-7 h-7 rounded-full bg-gold-500 flex items-center justify-center shrink-0 mt-0.5 shadow-lg shadow-gold-500/30">
                        <Star className="w-4 h-4 text-slate-900 fill-current" />
                      </div>
                      <span className="font-black text-sm tracking-tight">{f}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/formations/permis-b" className="w-full py-6 text-center rounded-[2rem] bg-gold-500 text-slate-900 font-black text-lg transition-all shadow-[0_0_30px_rgba(251,191,36,0.4)] hover:shadow-[0_0_50px_rgba(251,191,36,0.6)] hover:scale-[1.03] active:scale-95">
                  VOIR LES OFFRES
                </Link>
              </article>

              {/* Formation VTC */}
              <article className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-xl flex flex-col transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 group">
                <div className="mb-10">
                  <span className="text-gold-600 font-black text-xs uppercase tracking-[0.25em]"> Carrière Pro</span>
                  <h3 className="text-3xl font-black text-slate-900 mt-2 tracking-tight group-hover:text-gold-600 transition-colors">VTC & Taxi</h3>
                </div>
                
                <div className="mb-10 flex flex-col">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">à partir de</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-6xl font-black text-slate-900 tracking-tighter">399</span>
                    <span className="text-3xl font-bold text-gold-500">€</span>
                  </div>
                </div>

                <ul className="space-y-5 mb-12 flex-1">
                  {["Formation théorique & pratique", "Préparation examen T3P", "Véhicule double commande", "Aide installation pro"].map((f, i) => (
                    <li key={i} className="flex items-start gap-4 text-slate-600 group/item">
                      <div className="w-6 h-6 rounded-full bg-gold-500/10 flex items-center justify-center shrink-0 mt-0.5 group-hover/item:bg-gold-500 group-hover/item:text-white transition-colors">
                        <ArrowRight className="w-3 h-3" />
                      </div>
                      <span className="font-bold text-sm tracking-tight">{f}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/formations/vtc" className="group/btn relative w-full py-5 text-center rounded-[1.5rem] bg-slate-900 text-white font-black overflow-hidden shadow-xl shadow-slate-900/10 transition-all hover:scale-[1.02] active:scale-95">
                  <span className="relative z-10">DÉCOUVRIR LE PROGRAMME</span>
                  <div className="absolute inset-0 bg-gold-500 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                </Link>
              </article>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-20 bg-white border-top border-slate-200">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-3 text-slate-900">
                FAQ – Vos questions, nos réponses
              </h2>
              <p className="text-slate-500">
                Tout ce qu&apos;il faut savoir pour démarrer votre formation sereinement.
              </p>
            </div>

            <div className="glass-effect rounded-2xl p-6 md:p-8 border border-slate-200 bg-white shadow-sm">
              <Accordion className="w-full space-y-2">
                <AccordionItem value="item-1" className="border-b border-slate-100 last:border-0">
                  <AccordionTrigger className="text-lg font-semibold hover:text-gold-500 transition-colors text-slate-900">
                    Quelles formations proposez-vous ?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 leading-relaxed">
                    Nous proposons une large gamme de formations : permis de conduire (B, moto A/A1/A2),
                    formations professionnelles VTC et Taxi, ainsi que des formations CACES pour la conduite d&apos;engins de chantier.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="border-b border-slate-100 last:border-0">
                  <AccordionTrigger className="text-lg font-semibold hover:text-gold-500 transition-colors text-slate-900">
                    Vos formations sont-elles certifiées ?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 leading-relaxed">
                    Oui, toutes nos formations professionnelles sont certifiantes et reconnues par l&apos;État.
                    Notre centre est agréé et respecte les normes de qualité en vigueur (Qualiopi), garantissant la valeur de votre diplôme sur le marché du travail.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3" className="border-b border-slate-100 last:border-0">
                  <AccordionTrigger className="text-lg font-semibold hover:text-gold-500 transition-colors text-slate-900">
                    Vos formations sont-elles éligibles au CPF ?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 leading-relaxed">
                    Tout à fait ! La majorité de nos formations (Permis B, VTC, CACES) sont éligibles au financement par le Compte Personnel de Formation (CPF).
                    Nous acceptons également les financements Pôle Emploi et OPCO.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4" className="border-b border-slate-100 last:border-0">
                  <AccordionTrigger className="text-lg font-semibold hover:text-gold-500 transition-colors text-slate-900">
                    Qui peut suivre vos formations ?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 leading-relaxed">
                    Nos cours sont ouverts à tous : débutants souhaitant obtenir leur premier permis, professionnels en reconversion (devenir chauffeur VTC ou routier),
                    ou conducteurs expérimentés cherchant à valider de nouvelles compétences (CACES).
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5" className="border-b border-slate-100 last:border-0">
                  <AccordionTrigger className="text-lg font-semibold hover:text-gold-500 transition-colors text-slate-900">
                    Peut-on passer les formations en accéléré ?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 leading-relaxed">
                    Absolument. Nous comprenons que votre temps est précieux. C&apos;est pourquoi nous proposons des formules accélérées pour le permis B (code + conduite en 30 jours)
                    ainsi que pour nos formations VTC, afin de vous permettre d&apos;exercer rapidement.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>

        {/* CTA finale */}
        <section
          id="cta"
          className="py-20 bg-gradient-to-r from-gold-500 to-gold-600"
        >
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-sm">
              Prêt à démarrer votre formation ?
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto font-medium">
              Rejoignez plus de 200 élèves qui ont choisi SL Formations pour
              réussir leur permis et leur projet professionnel.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/formations"
                className="px-8 py-4 bg-slate-900 text-white rounded-lg font-bold text-lg hover:bg-slate-800 shadow-lg hover:shadow-slate-900/30 transition"
              >
                Voir toutes les formations
              </Link>
              <Link
                href="/contact"
                className="px-8 py-4 bg-white text-slate-900 rounded-lg font-bold text-lg hover:bg-slate-100 shadow-lg hover:shadow-white/30 transition"
              >
                Contactez-nous
              </Link>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

