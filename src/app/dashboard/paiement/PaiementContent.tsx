"use client";

import {
  CalendarDays,
  Euro,
  Download,
  Bell,
  CheckCircle2,
  Clock,
  ExternalLink,
  CreditCard as CreditCardIcon,
} from "lucide-react";
import Image from "next/image";
import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";

type PaymentLink = {
  id: string;
  stripeUrl: string;
  amount: number;
  expiresAt: Date | null;
  createdAt: Date;
  course: {
    title: string;
    imageUrl: string | null;
  } | null;
};

type Props = {
  paymentLinks: PaymentLink[];
};

export default function PaiementContent({ paymentLinks }: Props) {
  const { user } = useUser();

  return (
    <>
      <div className="pt-6">
        <div className="max-w-7xl mx-auto">
          {/* Contenu principal */}
          <section className="w-full">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-1">
                  Mes paiements
                </h1>
                <p className="text-slate-500 text-sm md:text-base">
                  Gérez vos paiements, téléchargez vos factures et consultez
                  votre historique.
                </p>
              </div>
              <div className="hidden sm:flex items-center space-x-4">
                <button className="relative p-2 text-gray-400 hover:text-white transition">
                  <Bell className="w-5 h-5" />
                  {paymentLinks.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center">
                      {paymentLinks.length}
                    </span>
                  )}
                </button>
                <div className="relative w-9 h-9">
                  <Image
                    src={user?.picture || "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg"}
                    alt="Avatar élève"
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Payment Links Section */}
            {paymentLinks.length > 0 && (
              <div className="mb-8 bg-gradient-to-r from-gold-50 to-amber-50 border border-gold-200 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCardIcon className="w-5 h-5 text-gold-600" />
                  <h2 className="text-lg font-bold text-slate-900">
                    Paiements en attente
                  </h2>
                  <span className="bg-gold-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {paymentLinks.length}
                  </span>
                </div>
                <p className="text-sm text-slate-600 mb-4">
                  Votre administrateur a généré des liens de paiement pour vous. Cliquez pour procéder au paiement sécurisé.
                </p>
                
                <div className="space-y-3">
                  {paymentLinks.map((link) => {
                    const expiresIn = link.expiresAt 
                      ? Math.floor((new Date(link.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60))
                      : null;
                    
                    return (
                      <div key={link.id} className="bg-white rounded-lg p-4 border border-slate-200 hover:shadow-md transition">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            {link.course?.imageUrl && (
                              <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                <Image
                                  src={link.course.imageUrl}
                                  alt={link.course.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <div>
                              <h3 className="font-bold text-slate-900">{link.course?.title || "Paiement Divers"}</h3>
                              <p className="text-sm text-slate-500">
                                Montant: <span className="font-semibold text-slate-700">{link.amount}€</span>
                              </p>
                              {expiresIn !== null && (
                                <p className="text-xs text-amber-600 flex items-center gap-1 mt-1">
                                  <Clock className="w-3 h-3" />
                                  Expire dans {expiresIn}h
                                </p>
                              )}
                            </div>
                          </div>
                          <Link
                            href={link.stripeUrl}
                            target="_blank"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500 text-navy-900 rounded-lg font-semibold hover:bg-gold-600 transition"
                          >
                            Payer maintenant
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Résumé financier + moyens de paiement */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg md:text-xl font-bold">
                    Récapitulatif financier
                  </h2>
                  <div className="flex items-center space-x-2 text-green-400 text-xs md:text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Paiements sécurisés</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 text-sm">
                  <div className="bg-navy-700 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2 text-slate-500">
                      <Euro className="w-4 h-4 text-green-500" />
                      <span>Total payé</span>
                    </div>
                    <div className="text-2xl font-bold text-green-500">
                      0€
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                    <div className="flex items-center space-x-2 mb-2 text-slate-500">
                      <Clock className="w-4 h-4 text-orange-500" />
                      <span>En attente</span>
                    </div>
                    <div className="text-2xl font-bold text-orange-500">
                      0€
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                    <div className="flex items-center space-x-2 mb-2 text-slate-500">
                      <CalendarDays className="w-4 h-4 text-slate-400" />
                      <span>Prochain paiement</span>
                    </div>
                    <div className="text-lg font-bold text-slate-400">
                      Aucun
                    </div>
                    <div className="text-xs text-slate-400">Pas de paiement prévu</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm text-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">Moyens de paiement</h3>
                  <button className="text-gold-500 hover:text-gold-400 transition text-xs">
                    + Ajouter
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="text-center text-slate-400 py-6 italic text-xs">
                    Aucun moyen de paiement enregistré
                  </div>

                  <button className="w-full p-3 border border-dashed border-slate-300 rounded-lg text-slate-400 hover:border-gold-500 hover:text-gold-500 transition text-xs">
                    Ajouter une carte
                  </button>
                </div>
              </div>
            </div>

            {/* Historique de paiements (table statique) */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-4 md:p-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <h2 className="text-lg md:text-xl font-bold">
                  Historique des paiements
                </h2>
                <div className="flex items-center space-x-3 text-xs md:text-sm">
                  <select className="bg-navy-700 border border-navy-600 rounded-lg px-3 py-2">
                    <option>Tous les statuts</option>
                    <option>Payé</option>
                    <option>En attente</option>
                    <option>Échoué</option>
                  </select>
                  <button className="inline-flex items-center px-4 py-2 bg-gold-500 text-navy-900 rounded-lg font-semibold hover:bg-gold-600 transition">
                    <Download className="w-4 h-4 mr-2" />
                    Exporter
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="p-4 font-semibold">Date</th>
                      <th className="p-4 font-semibold">Formation</th>
                      <th className="p-4 font-semibold">Montant</th>
                      <th className="p-4 font-semibold">Statut</th>
                      <th className="p-4 font-semibold">Méthode</th>
                      <th className="p-4 text-center font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400 italic">
                        Aucun historique de paiement disponible.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

