import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata = {
  title: "Confidentialité | SL Formations",
  description: "Politique de confidentialité et protection des données de SL Formations.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen text-slate-900 font-sans">
      <Header />
      <main className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gold-500">
            Politique de Confidentialité
          </h1>
          
          <div className="space-y-8 text-slate-600 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">1. Collecte des Données</h2>
              <p>
                Nous collectons les informations que vous nous fournissez lors de votre inscription, de vos commandes ou lors de vos échanges avec notre support :
                nom, prénom, adresse email, numéro de téléphone, historique de progression.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">2. Utilisation des Données</h2>
              <p>
                Vos données sont utilisées pour :
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Gérer votre compte et vos accès aux formations.</li>
                <li>Traiter vos paiements et commandes.</li>
                <li>Vous envoyer des informations importantes sur vos cours (mises à jour, suivi).</li>
                <li>Améliorer nos services et votre expérience utilisateur.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">3. Partage des Données</h2>
              <p>
                SL Formations ne vend pas vos données personnelles. Elles peuvent être partagées uniquement avec nos prestataires tiers indispensables au service :
                Stripe (paiement), Auth0 (authentification), Vercel (hébergement).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">4. Cookies</h2>
              <p>
                Nous utilisons des cookies essentiels pour le fonctionnement du site (session, sécurité) et des cookies d&apos;analyse pour comprendre l&apos;utilisation du site.
                Vous pouvez gérer vos préférences via les paramètres de votre navigateur.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">5. Vos Droits (RGPD)</h2>
              <p>
                Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification, de suppression et de portabilité de vos données.
                Pour exercer ces droits, contactez-nous à : info@sl-formations.fr.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}










