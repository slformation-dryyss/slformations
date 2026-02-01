import { Wallet, CheckCircle2, Building2, CreditCard, Users } from 'lucide-react';

interface CoursePricingProps {
  price: number;
  title: string;
  pricePersonal?: number;  // Prix paiement personnel (optionnel)
  priceCPF?: number;       // Prix CPF (optionnel)
  priceCompany?: number;   // Prix entreprise (optionnel)
}

export function CoursePricing({ price, title, pricePersonal, priceCPF, priceCompany }: CoursePricingProps) {
  // Utiliser les prix personnalisés si fournis, sinon calculer à partir du prix de base
  const personalPrice = pricePersonal || price;
  const cpfPrice = priceCPF || Math.round(price * 1.2);
  const companyPrice = priceCompany || price;

  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 to-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/10 text-gold-600 rounded-full font-bold text-sm mb-4">
            <Wallet className="w-4 h-4" />
            Tarifs et Financement
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
            Choisissez votre mode de financement
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Plusieurs options s'offrent à vous pour financer votre formation {title}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Paiement Personnel */}
          <div className="group bg-white rounded-2xl p-8 border-2 border-slate-200 hover:border-gold-500 hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-500 transition-colors">
              <CreditCard className="w-6 h-6 text-blue-500 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Paiement Personnel</h3>
            <p className="text-sm text-slate-500 mb-6">Financement individuel</p>
            
            <div className="mb-6">
              <div className="flex items-baseline gap-2 mb-2">
                {personalPrice > 0 ? (
                  <>
                    <span className="text-4xl font-black text-slate-900">{personalPrice}€</span>
                    <span className="text-slate-500 text-sm">TTC</span>
                  </>
                ) : (
                  <span className="text-2xl font-black text-slate-900 uppercase">Sur Devis</span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                {personalPrice > 0 ? "Paiement en 1 à 4 fois sans frais" : "Contactez-nous pour un tarif personnalisé"}
              </p>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-slate-600">Paiement sécurisé</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-slate-600">Facilités de paiement</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-slate-600">Inscription immédiate</span>
              </li>
            </ul>

            <a
              href={`/contact?subject=${encodeURIComponent(`Inscription Personnel - ${title}`)}`}
              className="block w-full text-center bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-colors"
            >
              {personalPrice > 0 ? "S'inscrire" : "Demander un devis"}
            </a>
          </div>

          {/* CPF - Recommandé */}
          <div className="group bg-gradient-to-br from-gold-500 to-gold-600 rounded-2xl p-8 border-2 border-gold-400 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-white text-gold-600 text-xs font-black px-4 py-1 rounded-bl-xl">
              RECOMMANDÉ
            </div>
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-6 group-hover:bg-white/30 transition-colors">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-black text-white mb-2">Compte CPF</h3>
            <p className="text-sm text-gold-100 mb-6">100% finançable</p>
            
            <div className="mb-6">
              <div className="flex items-baseline gap-2 mb-2">
                {cpfPrice > 0 ? (
                  <>
                    <span className="text-4xl font-black text-white">{cpfPrice}€</span>
                    <span className="text-gold-100 text-sm">TTC</span>
                  </>
                ) : (
                  <span className="text-2xl font-black text-white uppercase">Sur Devis</span>
                )}
              </div>
              <p className="text-xs text-gold-100">Pris en charge par votre CPF</p>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-white mt-0.5 flex-shrink-0" />
                <span className="text-white">Formation 100% finançable</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-white mt-0.5 flex-shrink-0" />
                <span className="text-white">Aucun frais à avancer</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-white mt-0.5 flex-shrink-0" />
                <span className="text-white">Démarches simplifiées</span>
              </li>
            </ul>

            <a
              href={`/contact?subject=${encodeURIComponent(`Inscription CPF - ${title}`)}`}
              className="block w-full text-center bg-white text-gold-600 font-bold py-3 rounded-xl hover:bg-gold-50 transition-colors"
            >
              {cpfPrice > 0 ? "Utiliser mon CPF" : "Consulter mon solde CPF"}
            </a>
          </div>

          {/* Entreprise */}
          <div className="group bg-white rounded-2xl p-8 border-2 border-slate-200 hover:border-blue-500 hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-500 transition-colors">
              <Building2 className="w-6 h-6 text-green-500 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Entreprise / OPCO</h3>
            <p className="text-sm text-slate-500 mb-6">Formation professionnelle</p>
            
            <div className="mb-6">
              <div className="flex items-baseline gap-2 mb-2">
                {companyPrice > 0 ? (
                  <>
                    <span className="text-4xl font-black text-slate-900">{companyPrice}€</span>
                    <span className="text-slate-500 text-sm">HT</span>
                  </>
                ) : (
                  <span className="text-2xl font-black text-slate-900 uppercase">Sur Devis</span>
                )}
              </div>
              <p className="text-xs text-slate-400">Prise en charge OPCO possible</p>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-slate-600">Facturation entreprise</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-slate-600">Prise en charge OPCO</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-slate-600">Tarif dégressif groupe</span>
              </li>
            </ul>

            <a
              href={`/contact?subject=${encodeURIComponent(`Devis Entreprise - ${title}`)}`}
              className="block w-full text-center bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-colors"
            >
              Demander un devis
            </a>
          </div>
        </div>

        {/* Info supplémentaire */}
        <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-100">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-1">Besoin d'aide pour choisir ?</h4>
              <p className="text-sm text-slate-600">
                Notre équipe vous accompagne dans le choix du meilleur mode de financement adapté à votre situation. 
                Contactez-nous pour un conseil personnalisé.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
