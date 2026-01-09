import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata = {
  title: "Conditions Générales de Vente | SL Formations",
  description: "Conditions générales de vente de SL Formations - Auto-école et centre de formation professionnelle",
};

export default function CGVPage() {
  return (
    <div className="min-h-screen flex flex-col text-slate-900 font-sans">
      <Header />
      
      <main className="flex-1 pt-32 pb-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-4 text-slate-900">
            Conditions Générales de Vente
          </h1>
          <p className="text-slate-600 mb-8">En vigueur au 01/12/2025</p>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 space-y-8">
            
            <section>
              <h2 className="text-2xl font-bold mb-4 text-slate-900">ARTICLE 1 - Champ d'application</h2>
              <div className="space-y-4 text-slate-700 leading-relaxed">
                <p>
                  Les présentes Conditions Générales de Vente (dites « CGV ») s'appliquent, sans restriction ni réserve à tout achat des services suivants : Auto école / Vente de formations, tels que proposés par le Prestataire aux clients non professionnels (« Les Clients ou le Client ») sur le site{" "}
                  <a href="https://sl-formations.fr" className="text-gold-600 hover:underline whitespace-nowrap">https://sl-formations.fr/</a>.
                </p>
                <p>
                  Les caractéristiques principales des Services sont présentées sur le site internet{" "}
                  <a href="https://sl-formations.fr" className="text-gold-600 hover:underline whitespace-nowrap">https://sl-formations.fr/</a>.
                </p>
                <p>
                  Le Client est tenu d'en prendre connaissance avant toute passation de commande. Le choix et l'achat d'un Service est de la seule responsabilité du Client.
                </p>
                <p>
                  Ces CGV sont accessibles à tout moment sur le site{" "}
                  <a href="https://sl-formations.fr" className="text-gold-600 hover:underline whitespace-nowrap">https://sl-formations.fr/</a>{" "}
                  et prévaudront sur toute autre document.
                </p>
                <p>
                  Le Client déclare avoir pris connaissance des présentes CGV et les avoir acceptées en cochant la case prévue à cet effet avant la mise en œuvre de la procédure de commande en ligne du site{" "}
                  <a href="https://sl-formations.fr" className="text-gold-600 hover:underline whitespace-nowrap">https://sl-formations.fr/</a>.
                </p>
                <p>
                  Sauf preuve contraire, les données enregistrées dans le système informatique du Prestataire constituent la preuve de l'ensemble des transactions conclues avec le Client.
                </p>
                
                <div className="bg-slate-50 p-4 rounded-lg mt-4">
                  <p className="font-semibold mb-2">Les coordonnées du Prestataire sont les suivantes :</p>
                  <p><strong>SL Formations</strong>, SAS</p>
                  <p>Capital social de 20 000 euros</p>
                  <p>Immatriculé au RCS de Melun, sous le numéro 941918062</p>
                  <p>41 avenue de la république 77340 PONTAULT COMBAULT</p>
                  <p>Email :{" "}
                    <a href="mailto:info@sl-formations.fr" className="text-gold-600 hover:underline whitespace-nowrap">info@sl-formations.fr</a>
                  </p>
                  <p>Téléphone : 01 60 28 54 18</p>
                </div>

                <p className="text-sm italic">
                  Des droits de douane ou autres taxes locales ou droits d'importation ou taxes d'état sont susceptibles d'être exigibles. Ils seront à la charge et relèvent de la seule responsabilité du Client.
                </p>
              </div>
            </section>

            {/* Article 2 */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-slate-900">ARTICLE 2 - Prix</h2>
              <div className="space-y-4 text-slate-700 leading-relaxed">
                <p>
                  Les Services sont fournis aux tarifs en vigueur figurant sur le site <a href="https://sl-formations.fr" className="text-gold-600 hover:underline">https://sl-formations.fr/</a>, lors de l'enregistrement de la commande par le Prestataire.
                </p>
                <p>Les prix sont exprimés en Euros, HT et TTC.</p>
                <p>
                  Les tarifs tiennent compte d'éventuelles réductions qui seraient consenties par le Prestataire sur le site <a href="https://sl-formations.fr" className="text-gold-600 hover:underline">https://sl-formations.fr/</a>.
                </p>
                <p>
                  Ces tarifs sont fermes et non révisables pendant leur période de validité mais le Prestataire se réserve le droit, hors période de validité, d'en modifier les prix à tout moment.
                </p>
                <p>
                  Les prix ne comprennent pas les frais de traitement, d'expédition, de transport et de livraison, qui sont facturés en supplément, dans les conditions indiquées sur le site et calculés préalablement à la passation de la commande.
                </p>
                <p>Le paiement demandé au Client correspond au montant total de l'achat, y compris ces frais.</p>
                <p>Une facture est établie par le Prestataire et remise au Client lors de la fourniture des Services commandés.</p>
                <p>Certaines commandes peuvent faire l'objet d'un devis préalablement accepté. Les devis établis par le Prestataire sont valables pour une durée de 30 jours après leur établissement.</p>
              </div>
            </section>

            {/* Article 3 */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-slate-900">ARTICLE 3 - Commandes</h2>
              <div className="space-y-4 text-slate-700 leading-relaxed">
                <p>
                  Il appartient au Client de sélectionner sur le site <a href="https://sl-formations.fr" className="text-gold-600 hover:underline">https://sl-formations.fr/</a> les Services qu'il désire commander.
                </p>
                <p>
                  La vente ne sera considérée comme valide qu'après paiement intégral du prix. Il appartient au Client de vérifier l'exactitude de la commande et de signaler immédiatement toute erreur.
                </p>
                <p>
                  Toute commande passée sur le site <a href="https://sl-formations.fr" className="text-gold-600 hover:underline">https://sl-formations.fr/</a> constitue la formation d'un contrat conclu à distance entre le Client et le Prestataire.
                </p>
                <p>
                  Le Prestataire se réserve le droit d'annuler ou de refuser toute commande d'un Client avec lequel il existerait un litige relatif au paiement d'une commande antérieure.
                </p>
                <p>Le Client pourra suivre l'évolution de sa commande sur le site.</p>
              </div>
            </section>

            {/* Article 4 */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-slate-900">ARTICLE 4 - Conditions de paiement</h2>
              <div className="space-y-4 text-slate-700 leading-relaxed">
                <p>Le prix est payé par voie de paiement sécurisé, selon les modalités suivantes :</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Paiement par carte bancaire</li>
                  <li>Ou paiement par virement bancaire sur le compte bancaire du Vendeur (dont les coordonnées sont communiquées au Client lors de la passation de la commande)</li>
                </ul>
                <p>Le prix est payable comptant par le Client, en totalité au jour de la passation de la commande.</p>
                <p>
                  Les données de paiement sont échangées en mode crypté grâce au protocole défini par le prestataire de paiement agréé intervenant pour les transactions bancaires réalisées sur le site <a href="https://sl-formations.fr" className="text-gold-600 hover:underline">https://sl-formations.fr/</a>.
                </p>
                <p>Les paiements effectués par le Client ne seront considérés comme définitifs qu'après encaissement effectif des sommes dues, par le Prestataire.</p>
                <p>Le Prestataire ne sera pas tenu de procéder à la fourniture des Services commandés par le Client si celui-ci ne lui en paye pas le prix en totalité dans les conditions ci-dessus indiquées.</p>
              </div>
            </section>

            {/* Article 5 */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-slate-900">ARTICLE 5 - Fourniture des Prestations</h2>
              <div className="space-y-4 text-slate-700 leading-relaxed">
                <p>
                  Les Services commandés par le Client seront fournis dans les délais convenus à compter de la validation définitive de la commande du Client, dans les conditions prévues aux présentes CGV à l'adresse indiquée par le Client lors de sa commande sur le site <a href="https://sl-formations.fr" className="text-gold-600 hover:underline">https://sl-formations.fr/</a>.
                </p>
                <p>Le Prestataire s'engage à faire ses meilleurs efforts pour fournir les Services commandés par le Client, dans le cadre d'une obligation de moyen et dans les délais ci-dessus précisés.</p>
                <p>
                  Si les Services commandés n'ont pas été fournis dans un délai raisonnable après la date indicative de fourniture, pour toute autre cause que la force majeure ou le fait du Client, la vente des Services pourra être résolue à la demande écrite du Client dans les conditions prévues aux articles L 216-2, L 216-3 et L241-4 du Code de la consommation.
                </p>
                <p>En cas de demande particulière du Client concernant les conditions de fourniture des Services, dûment acceptées par écrit par le Prestataire, les coûts y étant liés feront l'objet d'une facturation spécifique complémentaire ultérieure.</p>
                <p>A défaut de réserves ou réclamations expressément émises par le Client lors de la réception des Services, ceux-ci seront réputés conformes à la commande, en quantité et qualité.</p>
                <p>Le Client disposera d'un délai de 7 jours à compter de la fourniture des Services pour émettre des réclamations par mail, avec tous les justificatifs y afférents, auprès du Prestataire.</p>
                <p>Le Prestataire remboursera ou rectifiera dans les plus brefs délais et à ses frais les Services dont le défaut de conformité aura été dûment prouvé par le Client.</p>
              </div>
            </section>

            {/* Article 6 */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-slate-900">ARTICLE 6 - Droit de rétractation</h2>
              <div className="space-y-4 text-slate-700 leading-relaxed">
                <p>
                  Selon les modalités de l'article L221-18 du Code de la Consommation : « Pour les contrats prévoyant la livraison régulière de biens pendant une période définie, le délai court à compter de la réception du premier bien. »
                </p>
                <p>Le droit de rétractation peut être exercé en ligne, à l'aide du formulaire de rétractation disponible sur le site ou de toute autre déclaration, dénuée d'ambiguïté, exprimant la volonté de se rétracter.</p>
                <p>En cas d'exercice du droit de rétractation dans le délai susvisé, seul le prix des Services commandés est remboursé.</p>
                <p>Le remboursement des sommes effectivement réglées par le Client sera effectué dans un délai de 14 jours à compter de la réception, par le Prestataire, de la notification de la rétractation du Client.</p>
              </div>
            </section>

            {/* Article 7 */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-slate-900">ARTICLE 7 - Responsabilité du Prestataire - Garanties</h2>
              <div className="space-y-4 text-slate-700 leading-relaxed">
                <p>Le Prestataire garantit, conformément aux dispositions légales et sans paiement complémentaire, le Client, contre tout défaut de conformité ou vice caché, provenant d'un défaut de conception ou de réalisation des Services commandés.</p>
                
                <div className="bg-slate-50 p-4 rounded-lg space-y-3">
                  <p className="font-semibold">Dispositions relatives aux garanties légales</p>
                  
                  <div>
                    <p className="font-medium">Article L217-4 du Code de la consommation</p>
                    <p className="text-sm">« Le vendeur est tenu de livrer un bien conforme au contrat et répond des défauts de conformité existant lors de la délivrance. »</p>
                  </div>

                  <div>
                    <p className="font-medium">Article L217-12 du Code de la consommation</p>
                    <p className="text-sm">« L'action résultant du défaut de conformité se prescrit par deux ans à compter de la délivrance du bien. »</p>
                  </div>
                </div>

                <p>Afin de faire valoir ses droits, le Client devra informer le Prestataire, par écrit (mail ou courrier), de l'existence des vices ou défauts de conformité.</p>
                <p>Le Prestataire remboursera ou rectifiera les services jugés défectueux dans les meilleurs délais et au plus tard dans les 30 jours suivant la constatation par le Prestataire du défaut ou du vice.</p>
                <p>La garantie du Prestataire est limitée au remboursement des Services effectivement payés par le Client.</p>
              </div>
            </section>

            {/* Article 8 */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-slate-900">ARTICLE 8 - Données personnelles</h2>
              <div className="space-y-4 text-slate-700 leading-relaxed">
                <p>Le Client est informé que la collecte de ses données à caractère personnel est nécessaire à la vente des Services et leur réalisation et délivrance, confiées au Prestataire.</p>
                
                <h3 className="font-semibold text-lg mt-4">8.1 Collecte des données à caractère personnel</h3>
                <p>Les données à caractère personnel qui sont collectées sur le site <a href="https://sl-formations.fr" className="text-gold-600 hover:underline">https://sl-formations.fr/</a> incluent : noms, prénoms, adresse postale, numéro de téléphone, adresse e-mail, et données financières relatives au compte bancaire ou à la carte de crédit.</p>

                <h3 className="font-semibold text-lg mt-4">8.2 Destinataires des données</h3>
                <p>Les données à caractère personnel sont réservées à l'usage unique du Prestataire et de ses salariés.</p>

                <h3 className="font-semibold text-lg mt-4">8.4 Limitation du traitement</h3>
                <p>Sauf si le Client exprime son accord exprès, ses données à caractère personnelles ne sont pas utilisées à des fins publicitaires ou marketing.</p>

                <h3 className="font-semibold text-lg mt-4">8.5 Durée de conservation</h3>
                <p>Le Prestataire conservera les données ainsi recueillies pendant un délai de 5 ans.</p>

                <h3 className="font-semibold text-lg mt-4">8.7 Droits des Clients</h3>
                <p>Les Clients disposent des droits d'accès, de rectification, de suppression et de portabilité de leurs données. Ces droits peuvent être exercés en contactant le Prestataire.</p>
                <p>En cas de refus, le Client peut introduire une réclamation auprès de la CNIL (3 place de Fontenoy, 75007 PARIS).</p>
              </div>
            </section>

            {/* Article 9 */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-slate-900">ARTICLE 9 - Propriété intellectuelle</h2>
              <div className="space-y-4 text-slate-700 leading-relaxed">
                <p>
                  Le contenu du site <a href="https://sl-formations.fr" className="text-gold-600 hover:underline">https://sl-formations.fr/</a> est la propriété du Vendeur et de ses partenaires et est protégé par les lois françaises et internationales relatives à la propriété intellectuelle.
                </p>
                <p>Toute reproduction totale ou partielle de ce contenu est strictement interdite et est susceptible de constituer un délit de contrefaçon.</p>
              </div>
            </section>

            {/* Article 10 */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-slate-900">ARTICLE 10 - Droit applicable - Langue</h2>
              <div className="space-y-4 text-slate-700 leading-relaxed">
                <p>Les présentes CGV et les opérations qui en découlent sont régies et soumises au droit français.</p>
                <p>Les présentes CGV sont rédigées en langue française. Dans le cas où elles seraient traduites en une ou plusieurs langues étrangères, seul le texte français ferait foi en cas de litige.</p>
              </div>
            </section>

            {/* Article 11 */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-slate-900">ARTICLE 11 - Litiges</h2>
              <div className="space-y-4 text-slate-700 leading-relaxed">
                <p>Pour toute réclamation merci de contacter le service clientèle à l'adresse mail : <a href="mailto:info@sl-formations.fr" className="text-gold-600 hover:underline">info@sl-formations.fr</a></p>
                <p>Le Client est informé qu'il peut en tout état de cause recourir à une médiation conventionnelle en cas de contestation.</p>
                
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="font-semibold mb-2">Médiateur désigné :</p>
                  <p>Maison de justice et de droit</p>
                  <p>107 avenue de la république 77340 Pontault Combault</p>
                  <p>Email : <a href="mailto:mjd-pontault-combault@justice.fr" className="text-gold-600 hover:underline">mjd-pontault-combault@justice.fr</a></p>
                </div>

                <p>
                  Le Client peut également recourir à la plateforme de Règlement en Ligne des Litiges (RLL) : <a href="https://webgate.ec.europa.eu/odr/main/index.cfm?event=main.home.show" target="_blank" rel="noopener noreferrer" className="text-gold-600 hover:underline">https://webgate.ec.europa.eu/odr</a>
                </p>
              </div>
            </section>


          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
