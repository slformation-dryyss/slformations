"use client";

import { useState } from "react";
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
import { cn } from "@/lib/utils";
import { createCheckoutAction } from "./actions";
import { syncUserPaymentHistory } from "./sync-actions";
import { toast } from "sonner";
import { Loader2, RefreshCw } from "lucide-react";

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
  drivingPacks?: {
    id: string;
    title: string;
    description: string;
    price: number;
    drivingHours: number;
    imageUrl: string | null;
    slug: string;
    type: string;
  }[];
  drivingBalance?: number;
  totalPaid?: number;
  totalPending?: number;
  totalHoursPurchased?: number;
  orders?: any[];
};

export default function PaiementContent({
  paymentLinks,
  drivingPacks = [],
  drivingBalance = 0,
  totalPaid = 0,
  totalPending = 0,
  totalHoursPurchased = 0,
  orders = []
}: Props) {
  const { user } = useUser();
  const [selectedLicense, setSelectedLicense] = useState<string | null>(null);
  const [buyingId, setBuyingId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [hourlyQuantities, setHourlyQuantities] = useState<Record<string, number>>({});

  async function handleSync() {
    setIsSyncing(true);
    try {
      const result = await syncUserPaymentHistory();
      if (result.success) {
        toast.success(result.message || "Synchronisation terminée");
        // Reload to show new data
        window.location.reload();
      } else {
        toast.error(result.error || "Échec de la synchronisation");
      }
    } catch (e) {
      toast.error("Erreur technique lors de la synchronisation");
    } finally {
      setIsSyncing(false);
    }
  }

  async function handleBuy(courseId: string, quantity: number = 1) {
    setBuyingId(courseId);
    try {
      const result = await createCheckoutAction(courseId, quantity);
      if (result.success && result.url) {
        window.location.href = result.url;
      } else {
        toast.error(result.error || "Une erreur est survenue");
        setBuyingId(null);
      }
    } catch (e: any) {
      console.error("Checkout error:", e);
      toast.error("Erreur : " + (e.message || "Problème de connexion au serveur"));
      setBuyingId(null);
    }
  }

  // Define license types for filtering
  const licenseTypes = [
    { id: "B", label: "Permis B", icon: "🚗", description: "Voiture classique" },
    { id: "VTC", label: "Permis VTC", icon: "🎩", description: "Transport de personnes" },
    { id: "MOTO", label: "Permis Moto", icon: "🏍️", description: "Deux roues" },
  ];

  // Filter packs based on selected license
  const filteredPacks = selectedLicense
    ? drivingPacks.filter(p => {
      if (p.drivingHours === 1) return false; // Hide hourly products from pack grid

      const content = (p.title + " " + p.description + " " + p.type).toUpperCase();
      if (selectedLicense === "B") return content.includes("B") || content.includes("VOITURE");
      if (selectedLicense === "VTC") return content.includes("VTC");
      if (selectedLicense === "MOTO") return content.includes("MOTO");
      return true;
    })
    : [];

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
                <button
                  onClick={handleSync}
                  disabled={isSyncing}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-200 transition disabled:opacity-50"
                  title="Récupérer mes achats Stripe"
                >
                  <RefreshCw className={cn("w-3.5 h-3.5", isSyncing && "animate-spin")} />
                  {isSyncing ? "SYNCHRO..." : "SYNCHRONISER"}
                </button>
                <div className="relative h-9 w-9">
                  {user?.picture ? (
                    <Image
                      src={user.picture}
                      alt="Avatar élève"
                      fill
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                      <span className="text-xs font-bold">{user?.name?.charAt(0) || "U"}</span>
                    </div>
                  )}
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

            {/* Multi-step Driving Packs Section */}
            <div className="mb-12 bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
              <div className="bg-slate-900 p-8 text-white">
                <h2 className="text-2xl font-black mb-2 flex items-center gap-3">
                  <CreditCardIcon className="text-gold-500" />
                  Prêt à commencer ?
                </h2>
                <p className="text-slate-400">Choisissez votre formation et créditez vos heures de conduite en quelques clics.</p>
              </div>

              <div className="p-8">
                {/* Step 1: License Selection */}
                <div className="mb-10">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                    <span className="w-6 h-6 bg-gold-500 text-slate-900 rounded-full flex items-center justify-center text-[10px]">1</span>
                    QUELLE FORMATION PRÉPAREZ-VOUS ?
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {licenseTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setSelectedLicense(type.id)}
                        className={cn(
                          "relative p-6 rounded-2xl border-2 transition-all text-left group",
                          selectedLicense === type.id
                            ? "border-gold-500 bg-gold-50 ring-4 ring-gold-100 shadow-lg"
                            : "border-slate-100 bg-slate-50 hover:border-gold-300 hover:bg-white"
                        )}
                      >
                        <span className="text-4xl mb-4 block group-hover:scale-110 transition-transform">{type.icon}</span>
                        <div className="font-black text-slate-900 text-lg leading-tight">{type.label}</div>
                        <div className="text-xs text-slate-500 mt-1">{type.description}</div>
                        {selectedLicense === type.id && (
                          <div className="absolute top-4 right-4 bg-gold-500 text-white rounded-full p-1 shadow-md">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 2: Pack Selection (Conditionnel) */}
                {selectedLicense && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                      <span className="w-6 h-6 bg-gold-500 text-slate-900 rounded-full flex items-center justify-center text-[10px]">2</span>
                      SÉLECTIONNEZ VOTRE FORFAIT
                    </h3>

                    {filteredPacks.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPacks.map((pack) => (
                          <div key={pack.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-lg transition-all group">
                            <div className="relative h-40 w-full">
                              <Image
                                src={pack.imageUrl || "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80"}
                                alt={pack.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              <div className="absolute top-3 right-3 bg-gold-500 text-slate-900 px-3 py-1 rounded-full text-xs font-black shadow-lg">
                                {pack.drivingHours}H INCLUSES
                              </div>
                            </div>
                            <div className="p-5 flex-1 flex flex-col">
                              <h3 className="font-bold text-lg text-slate-900 mb-2 truncate">{pack.title}</h3>
                              <p className="text-sm text-slate-500 mb-6 line-clamp-2">{pack.description}</p>
                              <div className="mt-auto flex items-center justify-between border-t pt-4">
                                <div className="text-2xl font-black text-slate-900 tracking-tight">{pack.price}€</div>
                                <button
                                  onClick={() => handleBuy(pack.id)}
                                  disabled={buyingId === pack.id}
                                  className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-black hover:bg-gold-500 hover:text-slate-900 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                  {buyingId === pack.id && <Loader2 className="w-4 h-4 animate-spin" />}
                                  {buyingId === pack.id ? "REDIRECTION..." : "ACHETER"}
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center">
                        <div className="text-slate-300 text-5xl mb-4">🔍</div>
                        <p className="text-slate-500 font-bold">Aucun forfait n'est actuellement disponible pour ce type de permis.</p>
                        <p className="text-slate-400 text-sm mt-2">Veuillez contacter l'administration pour plus d'informations.</p>
                      </div>
                    )}

                    {/* Section Heures à l'unité */}
                    {selectedLicense && drivingPacks.some(p => p.drivingHours === 1 && (
                      (selectedLicense === "B" && p.type === "PERMIS_B") ||
                      (selectedLicense === "VTC" && p.type === "VTC") ||
                      (selectedLicense === "MOTO" && p.type === "MOTO") ||
                      // Fallback if type is not strictly matched
                      (selectedLicense === "B" && (p.title.toUpperCase().includes("B") || p.title.toUpperCase().includes("MANUELLE") || p.title.toUpperCase().includes("AUTO")))
                    )) && (
                        <div className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                            <span className="w-6 h-6 bg-slate-900 text-white rounded-full flex items-center justify-center text-[10px]">3</span>
                            ACHETER DES HEURES À L'UNITÉ
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {drivingPacks.filter(p => p.drivingHours === 1 && (
                              (selectedLicense === "B" && p.type === "PERMIS_B") ||
                              (selectedLicense === "VTC" && p.type === "VTC") ||
                              (selectedLicense === "MOTO" && p.type === "MOTO") ||
                              (selectedLicense === "B" && (p.title.toUpperCase().includes("B") || p.title.toUpperCase().includes("MANUELLE") || p.title.toUpperCase().includes("AUTO")))
                            )).map((pack) => {
                              const qty = hourlyQuantities[pack.id] || 1;
                              return (
                                <div key={pack.id} className="bg-slate-50 rounded-2xl p-6 border border-slate-200 flex items-center justify-between group hover:border-gold-500 transition-all">
                                  <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl shadow-sm border border-slate-100">
                                      {selectedLicense === "B" ? "🚗" : selectedLicense === "VTC" ? "🎩" : "🏍️"}
                                    </div>
                                    <div>
                                      <h4 className="font-bold text-slate-900">{pack.title}</h4>
                                      <p className="text-xs text-slate-500">{pack.price}€ / heure</p>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-6">
                                    <div className="flex items-center bg-white rounded-lg border border-slate-200 p-1">
                                      <button
                                        onClick={() => setHourlyQuantities(prev => ({ ...prev, [pack.id]: Math.max(1, (prev[pack.id] || 1) - 1) }))}
                                        className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-slate-100 transition"
                                      >
                                        -
                                      </button>
                                      <span className="w-8 text-center font-black text-slate-900">{qty}</span>
                                      <button
                                        onClick={() => setHourlyQuantities(prev => ({ ...prev, [pack.id]: (prev[pack.id] || 1) + 1 }))}
                                        className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-slate-100 transition"
                                      >
                                        +
                                      </button>
                                    </div>
                                    <div className="text-right min-w-[80px]">
                                      <div className="text-lg font-black text-slate-900">{pack.price * qty}€</div>
                                      <button
                                        onClick={() => handleBuy(pack.id, qty)}
                                        disabled={buyingId === pack.id}
                                        className="text-xs font-black text-gold-600 hover:text-gold-700 uppercase tracking-wider"
                                      >
                                        {buyingId === pack.id ? "..." : "ACHETER"}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                  </div>
                )}

                {!selectedLicense && (
                  <div className="bg-slate-50 rounded-2xl p-12 text-center border-2 border-dashed border-slate-200">
                    <p className="text-slate-400 italic">Veuillez sélectionner un type de permis ci-dessus pour voir les forfaits adaptés.</p>
                  </div>
                )}
              </div>
            </div>
            <div className="mb-8">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg md:text-xl font-bold">
                    Récapitulatif financier
                  </h2>
                  <div className="flex items-center space-x-2 text-green-400 text-xs md:text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Paiements sécurisés</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 text-sm">
                  <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                    <div className="flex items-center space-x-2 mb-2 text-slate-500">
                      <Euro className="w-4 h-4 text-green-600" />
                      <span>Total payé</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      {totalPaid}€
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                    <div className="flex items-center space-x-2 mb-2 text-slate-500">
                      <Clock className="w-4 h-4 text-orange-500" />
                      <span>En attente</span>
                    </div>
                    <div className="text-2xl font-bold text-orange-500">
                      {totalPending}€
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                    <div className="flex items-center space-x-2 mb-2 text-slate-500">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <span>Heures achetées</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-500">
                      {totalHoursPurchased}h
                    </div>
                    <div className="text-xs text-slate-400">Total cumulé acheté</div>
                  </div>

                  <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                    <div className="flex items-center space-x-2 mb-2 text-slate-500">
                      <Clock className="w-4 h-4 text-gold-500" />
                      <span>Solde actuel</span>
                    </div>
                    <div className="text-2xl font-bold text-gold-500">
                      {Math.floor(drivingBalance / 60)}h
                    </div>
                    <div className="text-xs text-slate-400">Heures restantes à réserver</div>
                  </div>
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
                  <button
                    onClick={() => {
                      if (!orders.length) {
                        toast.error("Aucune donnée à exporter");
                        return;
                      }

                      // Excel nécessite un séparateur ; pour la locale FR et un BOM pour l'UTF-8
                      const separator = ";";
                      const headers = ["Date", "Formation", "Montant", "Statut", "Méthode"];
                      const csvContent = [
                        headers.join(separator),
                        ...orders.map(order => [
                          new Date(order.createdAt).toLocaleDateString(),
                          `"${(order.course?.title || (order.items && order.items[0]?.course?.title) || "Achat divers").replace(/"/g, '""').replace(/\n/g, ' ')}"`,
                          (order.amount + "").replace('.', ','), // Format numéraire FR
                          "Payé",
                          "Carte Bancaire"
                        ].join(separator))
                      ].join("\n");

                      // Ajout du BOM (\uFEFF) pour forcer Excel à lire en UTF-8
                      const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement("a");
                      link.setAttribute("href", url);
                      link.setAttribute("download", `paiements_slformations_${new Date().toISOString().split('T')[0]}.csv`);
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    className="inline-flex items-center px-4 py-2 bg-gold-500 text-navy-900 rounded-lg font-semibold hover:bg-gold-600 transition"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Exporter CSV
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
                    {orders.length > 0 ? (
                      orders.map((order) => (
                        <tr key={order.id}>
                          <td className="p-4 text-slate-600">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-4 font-bold text-slate-900">
                            {order.course?.title || (order.items && order.items[0]?.course?.title) || "Achat divers"}
                            {order.items && order.items[0]?.quantity > 1 && ` (x${order.items[0].quantity})`}
                          </td>
                          <td className="p-4 font-black">
                            {order.amount}€
                          </td>
                          <td className="p-4">
                            <span className="bg-green-100 text-green-700 text-[10px] font-black px-2 py-1 rounded-full uppercase">
                              Payé
                            </span>
                          </td>
                          <td className="p-4 text-slate-500">
                            <CreditCardIcon className="w-4 h-4" />
                          </td>
                          <td className="p-4 text-center">
                            {order.invoiceUrl ? (
                              <Link
                                href={order.invoiceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gold-600 hover:text-gold-700"
                                title="Télécharger la facture Stripe"
                              >
                                <Download className="w-4 h-4" />
                              </Link>
                            ) : (
                              <button
                                onClick={() => {
                                  window.open(`/api/orders/${order.id}/invoice`, '_blank');
                                }}
                                className="text-gold-600 hover:text-gold-700"
                                title="Télécharger la facture (Générée)"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-400 italic">
                          Aucun historique de paiement disponible.
                        </td>
                      </tr>
                    )}
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

