import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata = {
  title: "CGV | SL Formations",
  description: "Conditions Générales de Vente de SL Formations.",
};

export default function CGVPage() {
  return (
    <div className="min-h-screen text-slate-900 font-sans">
      <Header />
      <main className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gold-500">
            Conditions Générales de Vente (CGV)
          </h1>
          
          <div className="space-y-8 text-slate-600 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">1. Objet</h2>
              <p>
                Les présentes Conditions Générales de Vente (CGV) régissent l&apos;ensemble des transactions réalisées sur le site SL Formations.
                Toute commande passée sur ce site implique l&apos;acceptation inconditionnelle et irrévocable de ces conditions par le client.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">2. Produits et Services</h2>
              <p>
                SL Formations propose des formations en ligne (e-learning), des formations présentielles (conduite, CACES) et de la location de véhicules.
                Les caractéristiques essentielles des services sont décrites sur chaque page produit.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">3. Prix et Paiement</h2>
              <p>
                Les prix sont indiqués en euros (€) toutes taxes comprises (TTC). SL Formations se réserve le droit de modifier ses prix à tout moment,
                mais le service sera facturé sur la base du tarif en vigueur au moment de la validation de la commande.
                Le paiement est exigible immédiatement à la commande via Stripe (Carte Bancaire).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">4. Accès aux Formations</h2>
              <p>
                L&apos;accès aux formations en ligne est ouvert immédiatement après validation du paiement.
                L&apos;accès est personnel, non cessible et disponible 24h/24 et 7j/7, sauf cas de force majeure ou maintenance.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">5. Droit de Rétractation</h2>
              <p>
                Conformément à la législation en vigueur (article L221-28 du Code de la consommation), le droit de rétractation ne peut être exercé pour les contrats
                de fourniture de contenu numérique non fourni sur un support matériel dont l&apos;exécution a commencé après accord préalable exprès du consommateur
                et renoncement exprès à son droit de rétractation.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">6. Responsabilité</h2>
              <p>
                SL Formations ne saurait être tenu pour responsable des dommages résultant d&apos;une mauvaise utilisation du service ou d&apos;un problème technique indépendant de sa volonté (coupure internet chez le client, etc.).
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}






