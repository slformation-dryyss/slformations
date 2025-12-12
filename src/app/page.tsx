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
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata = {
  title: "SL Formations | Auto-école & centre de formation professionnelle",
  description:
    "Auto-école et centre de formation SL Formations : permis A, B, C, formations VTC & Taxi, CACES et formations professionnelles transport & logistique.",
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
                Auto-école & centre de formation professionnelle
              </div>

              <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight drop-shadow-[0_10px_40px_rgba(0,0,0,0.8)] text-white">
                Bienvenue chez{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-500 to-gold-600 drop-shadow-sm">
                  SL Formations
                </span>
              </h1>

              <p className="text-lg md:text-xl text-white mb-3 max-w-2xl font-medium drop-shadow-[0_6px_20px_rgba(0,0,0,0.85)]">
                Vous souhaitez passer votre permis moto ou voiture ? Vous
                envisagez une formation pour devenir conducteur de VTC ou de
                taxi ?
              </p>
              <p className="text-base md:text-lg text-slate-100 mb-6 max-w-2xl leading-relaxed drop-shadow-[0_6px_20px_rgba(0,0,0,0.85)]">
                Notre auto-école et centre de formation professionnelle vous
                propose un accompagnement personnalisé pour les permis
                deux-roues, automobile et poids lourds, ainsi que pour vos
                formations CACES. Apprenez à conduire un véhicule de transport,
                un engin de travaux publics, un VTC ou un taxi. Avec SL
                Formations, passez à la vitesse supérieure !
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

            {/* Carte domaines : fond plus clair + texte très contrasté */}
            <div className="rounded-2xl p-6 md:p-7 bg-white/95 border border-slate-200 shadow-xl max-w-3xl">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <div>
                  <h3 className="text-lg md:text-xl font-semibold mb-3 text-slate-900">
                    Nos domaines de formation
                  </h3>
                  <ul className="space-y-1.5 text-slate-700 text-sm md:text-[15px]">
                    <li>• Permis moto (A1, A2, A)</li>
                    <li>• Permis B boîte automatique et manuelle</li>
                    <li>• Permis C – Poids lourd</li>
                    <li>• Formations professionnelles transport & logistique</li>
                    <li>• Formations CACES & travaux publics</li>
                    <li>• Formations VTC & Taxi</li>
                  </ul>
                </div>
                <div className="flex flex-col items-start md:items-end text-sm gap-2 md:min-w-[160px]">
                  <span className="text-slate-500">
                    95 % de taux de satisfaction
                  </span>
                  <span className="text-gold-600 font-semibold">
                    +200 élèves inscrits
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Nos permis */}
        <section id="permis" className="py-20 bg-slate-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-2 text-slate-900">
                Nos <span className="text-gold-500">permis</span>
              </h2>
              <p className="text-lg text-slate-600">
                Une école de formation au savoir-faire reconnu pour réussir les
                examens
              </p>
              <p className="text-slate-500 mt-4 max-w-2xl mx-auto">
                Choisissez SL Formations pour décrocher votre permis A, B ou C.
                Avec l’expertise de nos moniteurs diplômés d’État, vous êtes
                très bien accompagné !
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
                    Vous êtes épris de liberté ? Avec le permis moto, partez à
                    la rencontre de sensations uniques. Notre auto-école à
                    Pontault-Combault vous forme aux permis motos A1, A2 et A.
                    Bénéficiez d’un suivi complet avec des moniteurs
                    expérimentés.
                  </p>
                  <div className="mt-auto flex items-center justify-between text-sm text-gray-400">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>20h de conduite</span>
                    </span>
                    <span className="flex items-center space-x-1 text-gold-500 font-semibold">
                      <Euro className="w-4 h-4" />
                      <span>à partir de 649€</span>
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
                    Vous recherchez une auto-école sérieuse pour passer votre
                    permis B ? Choisissez la formule que vous souhaitez : permis
                    B en boîte automatique à 799 € ou en boîte manuelle à 899
                    €. Selon votre profil, nous vous proposons un forfait de
                    conduite personnalisé. Contactez-nous pour obtenir davantage
                    d’informations !
                  </p>
                  <div className="mt-auto flex items-center justify-between text-sm text-gray-400">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>20h de conduite</span>
                    </span>
                    <span className="flex flex-col items-end text-gold-500 font-semibold">
                      <span>Auto : 799€</span>
                      <span>Manuelle : 899€</span>
                    </span>
                  </div>
                </div>
              </article>

              {/* Permis C */}
              <article className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm card-hover flex flex-col">
                <div className="h-48 overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    src="https://ls-formation.fr/wp-content/uploads/2025/03/conducteur-camion-397w.webp"
                    alt="Permis poids lourd"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <span className="inline-block px-3 py-1 mb-3 rounded-full bg-gold-500/15 text-gold-500 text-xs font-semibold">
                    Permis C – Poids lourd
                  </span>
                  <h3 className="text-2xl font-bold mb-3 text-slate-900">
                    Permis C – Poids lourd
                  </h3>
                  <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                    Vous souhaitez devenir chauffeur routier ? Passez votre
                    permis poids lourd C, C1 ou C1E dans notre auto-école ! Vous
                    êtes assuré d’être entouré de moniteurs expérimentés. Ces
                    derniers, diplômés d’État, vous forment sur la partie
                    théorique (la conduite hors circulation) et à la conduite en
                    circulation. N’hésitez pas un seul instant, appelez-nous !
                  </p>
                  <div className="mt-auto flex items-center justify-between text-sm text-gray-400">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>30h de conduite</span>
                    </span>
                    <span className="flex items-center space-x-1 text-gold-500 font-semibold">
                      <Euro className="w-4 h-4" />
                      <span>à partir de 2 990€</span>
                    </span>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* Conduite supervisée / permis accéléré */}
        <section
          id="conduite-supervisee"
          className="py-20 bg-white border-y border-slate-200"
        >
          <div className="max-w-7xl mx-auto px-6 grid gap-10 md:grid-cols-[1.2fr,1.3fr] items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
                Conduite supervisée, permis accéléré :{" "}
                <span className="text-gold-500">
                  une offre adaptée à chaque profil
                </span>
              </h2>
              <p className="text-slate-600 mb-4">
                Vous avez obtenu votre code et suivi la formation des 20 heures
                de conduite dans notre auto-école, mais vous ne vous sentez pas
                encore sûr au volant ? La solution : la conduite supervisée.
              </p>
              <p className="text-slate-600 mb-4">
                Avec cette formule, développez vos compétences avec un
                accompagnateur à votre rythme. Si vous souhaitez avoir votre
                permis rapidement, optez pour notre session de code et de permis
                en accéléré.
              </p>
              <p className="text-slate-600 mb-6">
                Prenez contact avec notre centre auto-école pour connaître nos
                modalités d’inscription et nos tarifs.
              </p>

              <div className="flex flex-wrap gap-3">
                <span className="px-4 py-2 rounded-full border border-gold-500/60 text-gold-500 text-sm">
                  Conduite supervisée
                </span>
                <span className="px-4 py-2 rounded-full border border-gold-500/60 text-gold-500 text-sm">
                  Permis en accéléré
                </span>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden glass-effect">
              <img
                src="https://ls-formation.fr/wp-content/uploads/2025/03/conduite-supervisee-1920w.webp"
                alt="Conduite supervisée"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* Formations professionnelles */}
        <section id="formations-pro" className="py-20 bg-slate-100">
          <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-3 text-slate-900">
                Nos <span className="text-gold-500">formations professionnelles</span>
              </h2>
              <p className="text-lg text-slate-600 mb-4 max-w-3xl mx-auto">
                Des formations aux métiers du transport et de la logistique
                financées par France Travail ou votre CPF.
              </p>
              <p className="text-slate-600 max-w-2xl mx-auto">
                <span className="font-semibold text-slate-900">
                  Un centre de formation professionnelle certifié{" "}
                  <span className="text-gold-500">Qualiopi</span>
                </span>
                <br />
                Vous travaillez dans le domaine de la logistique, dans le
                transport ou les travaux publics ? Vous avez besoin d’une
                formation professionnelle spécifique ? Grâce à notre
                certification Qualiopi, vous bénéficiez de fonds publics ou
                mutualisés et d’une formation de qualité.
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
              <article className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm card-hover flex flex-col">
                <div className="h-48 overflow-hidden">
                  <img
                    src="https://ls-formation.fr/wp-content/uploads/2025/03/truck-driver-occupation-service.jpg"
                    alt="Formation transport"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-2xl font-bold mb-2 text-slate-900">Formation Transport</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    Vous souhaitez exercer la profession de chauffeur de poids
                    lourd ? Après l’obtention de votre permis C, C1, C1E ou CE,
                    la FIMO marchandises est la certification obligatoire pour
                    pratiquer votre activité. Plusieurs moyens de financement
                    sont possibles, renseignez-vous auprès de notre équipe !
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

              {/* Formation Travaux publics */}
              <article className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm card-hover flex flex-col">
                <div className="h-48 overflow-hidden">
                  <img
                    src="https://ls-formation.fr/wp-content/uploads/2025/03/chariot-elevateur-2304w.webp"
                    alt="Formation travaux publics"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-2xl font-bold mb-2 text-slate-900">
                    Formation Travaux publics
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    Conducteur d’engins de chantier, de grues mobiles… Pour
                    travailler dans les travaux publics, SL Formations dispense
                    les formations réglementaires nécessaires : le CACES R482
                    pour la conduite des engins de chantiers et le CACES R483,
                    certificat obligatoire pour manipuler une grue mobile en
                    toute sécurité.
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
                    src="https://ls-formation.fr/wp-content/uploads/2025/03/1e3ce169ed.jpg"
                    alt="Formation CACES"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-2xl font-bold mb-2 text-slate-900">Formation CACES</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    Pour les conducteurs de nacelles, grues de chargement,
                    engins de chantier et pour les conducteurs accompagnants de
                    gerbeurs automoteurs, une formation s’impose. Nous vous
                    guidons pour que vous obteniez le Certificat d’Aptitude à la
                    Conduite En Sécurité (CACES). Selon le véhicule, nous vous
                    orientons vers la formation adéquate.
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

              {/* Formation VTC & Taxi */}
              <article className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm card-hover flex flex-col">
                <div className="h-48 overflow-hidden">
                  <img
                    src="https://ls-formation.fr/wp-content/uploads/2025/03/taxis-2304w.webp"
                    alt="Formation VTC et Taxi"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-2xl font-bold mb-2 text-slate-900">
                    Formation VTC & Taxi
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    Vous connaissez Pontault-Combault et ses alentours sur le
                    bout des doigts, vous êtes toujours ponctuel ? Vous avez
                    déjà de bons atouts pour devenir chauffeur VTC ou chauffeur
                    de taxi. Inscrivez-vous dans notre centre de formation
                    professionnelle à Pontault-Combault.
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
            </div>
            </div>
          </section>

        {/* Statistiques & atouts */}
        <section id="stats" className="py-16 bg-white border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-6 space-y-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-gold-500 mb-1">
                  95%
                </div>
                <div className="text-slate-500 text-sm">
                  Taux de satisfaction
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-gold-500 mb-1">
                  +10
                </div>
                <div className="text-slate-500 text-sm">Moniteurs qualifiés</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-gold-500 mb-1">
                  +200
                </div>
                <div className="text-slate-500 text-sm">
                  Élèves déjà inscrits
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-gold-500 mb-1">
                  +50
                </div>
                <div className="text-slate-500 text-sm">
                  Sessions de conduite / semaine
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1.2fr,1.4fr] gap-10 items-center">
              <div className="glass-effect rounded-2xl p-6 bg-slate-50/50 border border-slate-200">
                <h3 className="text-2xl font-bold mb-3 text-slate-900">
                  Des cours de conduite
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Apprenez à conduire en toute confiance avec nos moniteurs
                  expérimentés. Que vous soyez débutant ou que vous souhaitiez
                  perfectionner votre conduite, nous vous accompagnons à chaque
                  étape pour assurer votre réussite.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900">
                  L’apprentissage de la conduite en toute sérénité avec{" "}
                  <span className="text-gold-500">SL Formations</span>
                </h3>
                <p className="text-slate-600 text-sm mb-6">
                  Nous offrons des formations professionnelles de qualité,
                  adaptées aux exigences du secteur, avec des formateurs
                  expérimentés et des outils modernes.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div className="glass-effect rounded-xl p-4 flex flex-col items-start space-y-2">
                    <Shield className="w-6 h-6 text-gold-500" />
                    <span className="font-semibold">Sécurité garantie</span>
                  </div>
                  <div className="glass-effect rounded-xl p-4 flex flex-col items-start space-y-2">
                    <UserCheck className="w-6 h-6 text-gold-500" />
                    <span className="font-semibold">
                      Instructeurs expérimentés
                    </span>
                  </div>
                  <div className="glass-effect rounded-xl p-4 flex flex-col items-start space-y-2">
                    <Tag className="w-6 h-6 text-gold-500" />
                    <span className="font-semibold">Meilleurs prix</span>
                  </div>
                  <div className="glass-effect rounded-xl p-4 flex flex-col items-start space-y-2">
                    <Wrench className="w-6 h-6 text-gold-500" />
                    <span className="font-semibold">Matériel haut de gamme</span>
                  </div>
                  <div className="glass-effect rounded-xl p-4 flex flex-col items-start space-y-2">
                    <Headphones className="w-6 h-6 text-gold-500" />
                    <span className="font-semibold">Service client</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Processus */}
        <section id="processus" className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-3 text-slate-900">
                Notre <span className="text-gold-500">processus</span>
              </h2>
              <p className="text-lg text-slate-500">
                Obtenez votre permis avec SL Formations
              </p>
              <p className="text-slate-400 mt-2">
                Passez votre permis en toute simplicité
              </p>
            </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="glass-effect rounded-2xl p-6 border border-slate-200 bg-white">
                <div className="text-gold-500 font-bold text-sm mb-2">01</div>
                <h3 className="text-xl font-semibold mb-3 text-slate-900">
                  Choisissez votre permis
                </h3>
                <p className="text-slate-600 text-sm">
                  Nous avons la formation adaptée à vos besoins. Sélectionnez
                  la catégorie qui vous correspond et commencez votre formation
                  dès aujourd’hui !
                </p>
              </div>

              <div className="glass-effect rounded-2xl p-6 border border-slate-200 bg-white">
                <div className="text-gold-500 font-bold text-sm mb-2">02</div>
                <h3 className="text-xl font-semibold mb-3 text-slate-900">
                  Organisez votre programme de conduite
                </h3>
                <p className="text-slate-600 text-sm">
                  Planifiez vos séances de conduite selon votre disponibilité.
                  Nos moniteurs s’adaptent à votre rythme pour une progression
                  optimale.
                </p>
              </div>

              <div className="glass-effect rounded-2xl p-6 border border-slate-200 bg-white">
                <div className="text-gold-500 font-bold text-sm mb-2">03</div>
                <h3 className="text-xl font-semibold mb-3 text-slate-900">
                  Passez l’examen et obtenez votre permis
                </h3>
                <p className="text-slate-600 text-sm">
                  Nous organisons votre passage à l’examen officiel dans les
                  meilleures conditions pour maximiser vos chances de réussite
                  du premier coup.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Témoignages */}
        <section id="testimonials" className="py-20 bg-white border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-3 text-slate-900">
                Vos <span className="text-gold-500">avis</span>
              </h2>
              <p className="text-lg text-slate-600">
                Ce que nos clients disent de nous
              </p>
            </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <article className="bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-lg text-slate-900">Inès Bouraoui</h3>
                  <div className="flex text-gold-500">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">
                  « Je suis actuellement inscrite à cette école de conduite. Un
                  accueil très chaleureux et une équipe qui conseille et motive
                  ses élèves. J&apos;effectue des cours avec une monitrice très
                  patiente et certainement passionnée par son métier.
                  J&apos;apprécie beaucoup son sens du détail et sa façon
                  d&apos;adapter le cours aux lacunes de l&apos;élève. Elle me
                  met toujours à l&apos;aise pour que je puisse gérer au mieux
                  mon stress... »
                </p>
              </article>

              <article className="bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-lg text-slate-900">Clara C</h3>
                  <div className="flex text-gold-500">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">
                  « Excellente auto-école ! Je recommande les yeux fermés ✅ »
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* Pricing Permis */}
        <section id="pricing-permis" className="py-20 bg-slate-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-3 text-slate-900">
                Nos <span className="text-gold-500">pricing permis</span>
              </h2>
            </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Permis A – Moto */}
              <article className="glass-effect rounded-2xl p-6 border border-slate-200 bg-white flex flex-col shadow-sm">
                <h3 className="text-xl font-bold mb-2 text-slate-900">Permis A – Moto</h3>
                <p className="text-slate-500 text-sm mb-4">
                  Apprenez à piloter une moto en toute sécurité avec une
                  formation adaptée aux débutants et confirmés.
                </p>
                <div className="text-3xl font-bold text-gold-500 mb-2">
                  649€
                </div>
                <ul className="text-slate-500 text-sm space-y-1 mb-4">
                  <li>• 8 heures de plateau + 12 heures de circulation</li>
                  <li>• Accès au code moto en ligne</li>
                  <li>• Accompagnement personnalisé</li>
                  <li>• Préparation à l’examen pratique</li>
                </ul>
              </article>

              {/* Permis B – Voiture */}
              <article className="glass-effect rounded-2xl p-6 border border-slate-200 bg-white flex flex-col shadow-sm">
                <h3 className="text-xl font-bold mb-2 text-slate-900">Permis B – Voiture</h3>
                <p className="text-slate-500 text-sm mb-4">
                  Le permis idéal pour conduire une voiture en toute autonomie.
                  Formation complète avec moniteurs expérimentés.
                </p>
                <div className="text-3xl font-bold text-gold-500 mb-2">
                  1 325€
                </div>
                <ul className="text-slate-500 text-sm space-y-1 mb-4">
                  <li>• 20 heures de conduite avec un moniteur</li>
                  <li>• Accès illimité au code de la route en ligne</li>
                  <li>• Formation théorique et pratique complète</li>
                  <li>• Préparation intensive à l’examen</li>
                  <li>• Accompagnement administratif</li>
                </ul>
              </article>

              {/* Permis Poids Lourd */}
              <article className="glass-effect rounded-2xl p-6 border border-slate-200 bg-white flex flex-col shadow-sm">
                <h3 className="text-xl font-bold mb-2 text-slate-900">Permis Poids Lourd</h3>
                <p className="text-slate-500 text-sm mb-4">
                  Formation professionnelle pour obtenir votre permis camion et
                  accéder aux métiers du transport routier.
                </p>
                <div className="text-3xl font-bold text-gold-500 mb-2">
                  2 990€
                </div>
                <ul className="text-slate-500 text-sm space-y-1 mb-4">
                  <li>• 30 heures de conduite avec moniteur PL</li>
                  <li>• Formation théorique et réglementaire</li>
                  <li>• Préparation aux épreuves de l&apos;examen</li>
                  <li>• Techniques de conduite en sécurité</li>
                  <li>• Accompagnement pour les démarches administratives</li>
                </ul>
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
                    Nous proposons une large gamme de formations : permis de conduire (B, moto A/A1/A2, poids lourd C/CE),
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
                    Tout à fait ! La majorité de nos formations (Permis B, Poids Lourd, VTC, CACES) sont éligibles au financement par le Compte Personnel de Formation (CPF).
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
              <Link
                href="/location"
                className="px-8 py-4 text-white font-bold text-lg border-2 border-white/30 hover:bg-white/10 hover:border-white transition flex items-center space-x-2 rounded-lg"
              >
                <Car className="w-5 h-5" />
                <span>Louer un véhicule</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
