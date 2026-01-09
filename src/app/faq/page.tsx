import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata = {
  title: "FAQ & Support | SL Formations",
  description: "Questions fréquentes et support client SL Formations.",
};

export default function FAQPage() {
  return (
    <div className="min-h-screen text-slate-900 font-sans">
      <Header />
      <main className="pt-32 pb-20">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              FAQ – Vos questions, <span className="text-gold-500">nos réponses</span>
            </h1>
            <p className="text-slate-600">
              Trouvez rapidement des réponses à vos questions fréquentes.
            </p>
          </div>

          <div className="glass-effect rounded-2xl p-6 md:p-8 border border-slate-200 bg-white">
            <Accordion className="w-full space-y-4">
              {/* 1 */}
              <AccordionItem
                value="item-1"
                className="border-b border-navy-700 pb-4"
              >
                <AccordionTrigger className="text-lg font-semibold hover:text-gold-500 transition-colors">
                  Quelles formations proposez-vous ?
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 mt-2 space-y-2 text-sm leading-relaxed">
                  <p>
                    Nous proposons des formations en conduite (permis B, A), en transport routier (FIMO, FCO), ainsi qu&apos;en
                    manutention (CACES pour engins de chantier, chariots
                    élévateurs et grues).
                  </p>
                  <p>
                    SL Formations vous accompagne aussi sur des parcours
                    professionnels complets (VTC / Taxi, sécurité, transport,
                    remise à niveau, perfectionnement à la conduite, etc.), avec
                    des programmes construits autour de modules théoriques,
                    pratiques et d&apos;un suivi personnalisé.
                  </p>
                </AccordionContent>
              </AccordionItem>

              {/* 2 */}
              <AccordionItem
                value="item-2"
                className="border-b border-navy-700 pb-4"
              >
                <AccordionTrigger className="text-lg font-semibold hover:text-gold-500 transition-colors">
                  Vos formations sont‑elles certifiées ?
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 mt-2 space-y-2 text-sm leading-relaxed">
                  <p>
                    Oui, nos formations réglementées (VTC / Taxi, transport
                    routier, certaines catégories CACES, etc.) sont dispensées
                    dans le respect des référentiels officiels et préparent à
                    des examens ou certifications reconnues par l&apos;État ou
                    les organismes compétents.
                  </p>
                  <p>
                    Pour chaque parcours, nous indiquons clairement si une
                    attestation, un titre ou une certification est délivré en
                    fin de formation, ainsi que les conditions d&apos;obtention
                    (présence, examen, évaluation continue, etc.).
                  </p>
                </AccordionContent>
              </AccordionItem>

              {/* 3 */}
              <AccordionItem
                value="item-3"
                className="border-b border-navy-700 pb-4"
              >
                <AccordionTrigger className="text-lg font-semibold hover:text-gold-500 transition-colors">
                  Vos formations sont‑elles éligibles au CPF ou à un financement
                  ?
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 mt-2 space-y-2 text-sm leading-relaxed">
                  <p>
                    Certaines de nos formations peuvent être financées via le
                    CPF, Pôle Emploi, l&apos;OPCO de votre entreprise ou
                    d&apos;autres dispositifs (aide régionale, transition pro,
                    plan de développement des compétences, etc.).
                  </p>
                  <p>
                    Les règles de prise en charge évoluant régulièrement, nous
                    étudions chaque situation au cas par cas. Le plus simple
                    est de nous contacter via la page{" "}
                    <span className="font-semibold">Contact</span> pour que
                    nous vérifiions avec vous les dispositifs possibles et vous
                    aidions, si besoin, à constituer votre dossier.
                  </p>
                </AccordionContent>
              </AccordionItem>

              {/* 4 */}
              <AccordionItem
                value="item-4"
                className="border-b border-navy-700 pb-4"
              >
                <AccordionTrigger className="text-lg font-semibold hover:text-gold-500 transition-colors">
                  Qui peut suivre vos formations ?
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 mt-2 space-y-2 text-sm leading-relaxed">
                  <p>
                    Nos formations s&apos;adressent aux particuliers (jeunes
                    conducteurs, personnes en reconversion, demandeurs
                    d&apos;emploi) comme aux professionnels (chauffeurs,
                    salariés, indépendants, chefs d&apos;entreprise, etc.).
                  </p>
                  <p>
                    Certaines formations nécessitent des prérequis (âge
                    minimum, permis en cours de validité, casier judiciaire
                    vierge, aptitude médicale, niveau de français, etc.). Tous
                    ces éléments sont détaillés sur la fiche formation et
                    rappelés lors de votre inscription.
                  </p>
                </AccordionContent>
              </AccordionItem>

              {/* 5 */}
              <AccordionItem
                value="item-5"
                className="border-b border-navy-700 pb-4"
              >
                <AccordionTrigger className="text-lg font-semibold hover:text-gold-500 transition-colors">
                  Peut‑on suivre les formations en accéléré ?
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 mt-2 space-y-2 text-sm leading-relaxed">
                  <p>
                    Oui, pour certaines formations (permis, VTC, remises à
                    niveau, CACES, etc.), nous proposons des formules
                    intensives sur une courte période avec un planning
                    resserré.
                  </p>
                  <p>
                    Lors de votre demande, indiquez‑nous vos contraintes de
                    dates : nous pourrons vous orienter vers une session
                    accélérée, vous proposer un parcours sur‑mesure ou une
                    préparation en ligne en amont afin d&apos;optimiser votre
                    temps.
                  </p>
                </AccordionContent>
              </AccordionItem>

              {/* 6 */}
              <AccordionItem
                value="item-6"
                className="border-b border-navy-700 pb-4"
              >
                <AccordionTrigger className="text-lg font-semibold hover:text-gold-500 transition-colors">
                  Comment se passent les cours (présentiel, en ligne, mixte) ?
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 mt-2 space-y-2 text-sm leading-relaxed">
                  <p>
                    La plupart de nos formations pratiques (conduite, examens
                    VTC / Taxi, CACES, etc.) se déroulent en présentiel dans
                    nos centres partenaires, sur piste ou sur route.
                  </p>
                  <p>
                    Selon les parcours, une partie de la théorie peut être
                    suivie à distance via votre espace élève : classes
                    virtuelles, vidéos, supports téléchargeables, quiz. Le
                    format précis (présentiel, distanciel ou mixte) est indiqué
                    pour chaque formation.
                  </p>
                </AccordionContent>
              </AccordionItem>

              {/* 7 */}
              <AccordionItem
                value="item-7"
                className="border-b border-navy-700 pb-0"
              >
                <AccordionTrigger className="text-lg font-semibold hover:text-gold-500 transition-colors">
                  Puis‑je annuler ou reporter ma formation ?
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 mt-2 space-y-2 text-sm leading-relaxed">
                  <p>
                    En cas d&apos;empêchement, il est généralement possible de
                    reporter votre session à une autre date, sous réserve de
                    nous prévenir dans les délais prévus et selon les
                    conditions précisées dans votre devis, convention ou
                    contrat de formation.
                  </p>
                  <p>
                    Pour une annulation, les modalités (frais éventuels,
                    remboursement, délais) varient selon le mode de
                    financement. Nous vous invitons à nous contacter rapidement afin que nous trouvions avec vous
                    la solution la plus adaptée.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-400 mb-4">Vous n&apos;avez pas trouvé votre réponse ?</p>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-gold-500 text-slate-900 font-bold hover:bg-gold-600 transition"
            >
              Contacter le support
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}




