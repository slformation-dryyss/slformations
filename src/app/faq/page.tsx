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
    <div className="min-h-screen bg-navy-900 text-white font-sans">
      <Header />
      <main className="pt-32 pb-20">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Centre d&apos;Aide & <span className="text-gold-500">FAQ</span>
            </h1>
            <p className="text-gray-400">
              Trouvez rapidement des réponses à vos questions fréquentes.
            </p>
          </div>

          <div className="glass-effect rounded-2xl p-6 md:p-8 border border-navy-700">
            <Accordion type="single" collapsible className="w-full space-y-4">
              <AccordionItem value="item-1" className="border-b border-navy-700 pb-4">
                <AccordionTrigger className="text-lg font-semibold hover:text-gold-500 transition-colors">
                  Comment s&apos;inscrire à une formation ?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 mt-2">
                  Il vous suffit de parcourir notre catalogue, de choisir la formation souhaitée, puis de cliquer sur &quot;S&apos;inscrire&quot; ou &quot;Acheter&quot;.
                  Vous serez redirigé vers le paiement sécurisé. Une fois validé, l&apos;accès est immédiat.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border-b border-navy-700 pb-4">
                <AccordionTrigger className="text-lg font-semibold hover:text-gold-500 transition-colors">
                  Quels sont les moyens de paiement acceptés ?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 mt-2">
                  Nous acceptons les paiements par carte bancaire (Visa, Mastercard, Amex) via notre partenaire sécurisé Stripe.
                  Pour les formations présentielles longues, des facilités de paiement peuvent être proposées sur dossier.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border-b border-navy-700 pb-4">
                <AccordionTrigger className="text-lg font-semibold hover:text-gold-500 transition-colors">
                  Puis-je utiliser mon CPF ?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 mt-2">
                  Oui, certaines de nos formations professionnelles (VTC, Poids Lourd, CACES) sont éligibles au CPF.
                  Veuillez nous contacter directement via la page Contact pour monter votre dossier de financement.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border-b border-navy-700 pb-4">
                <AccordionTrigger className="text-lg font-semibold hover:text-gold-500 transition-colors">
                  Comment accéder à mes cours après achat ?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 mt-2">
                  Une fois connecté, cliquez sur &quot;Espace Élève&quot; ou votre avatar en haut à droite, puis &quot;Mes formations&quot;.
                  Vous y retrouverez tous vos contenus débloqués.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="border-b border-navy-700 pb-4">
                <AccordionTrigger className="text-lg font-semibold hover:text-gold-500 transition-colors">
                  J&apos;ai perdu mon mot de passe, que faire ?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 mt-2">
                  Sur la page de connexion, cliquez sur &quot;Mot de passe oublié&quot;. Vous recevrez un email pour réinitialiser votre mot de passe
                  via notre système d&apos;authentification sécurisé.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-400 mb-4">Vous n&apos;avez pas trouvé votre réponse ?</p>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-gold-500 text-navy-900 font-bold hover:bg-gold-600 transition"
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


