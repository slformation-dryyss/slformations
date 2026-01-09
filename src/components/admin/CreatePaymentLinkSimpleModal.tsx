"use client";

import { useState } from "react";
import { CreditCard, X, Loader2, Copy, Check, Mail } from "lucide-react";
import { createPaymentLinkSimpleAction } from "../../app/admin/participants/payment-actions-simple";

interface CreatePaymentLinkSimpleModalProps {
  userId: string;
  userName: string;
  userEmail: string;
  onClose: () => void;
  courses: Array<{ id: string; title: string; price: number }>;
}

export function CreatePaymentLinkSimpleModal({
  userId,
  userName,
  userEmail,
  onClose,
  courses,
}: CreatePaymentLinkSimpleModalProps) {
  const [loading, setLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [paymentUrl, setPaymentUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("courseId", selectedCourse);
      
      const amount = selectedCourse 
        ? courses.find(c => c.id === selectedCourse)?.price.toString() || customAmount
        : customAmount;
      
      formData.append("amount", amount);

      const result = await createPaymentLinkSimpleAction(formData);
      
      if (result.success && result.paymentUrl) {
        setPaymentUrl(result.paymentUrl);
      }
    } catch (error: any) {
      console.error("Error creating payment link:", error);
      alert(error.message || "Erreur lors de la création du lien de paiement");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(paymentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sendByEmail = () => {
    const subject = encodeURIComponent("Votre lien de paiement - SL Formations");
    const body = encodeURIComponent(`Bonjour ${userName},\n\nVoici votre lien de paiement sécurisé :\n\n${paymentUrl}\n\nCordialement,\nL'équipe SL Formations`);
    window.open(`mailto:${userEmail}?subject=${subject}&body=${body}`);
  };

  if (paymentUrl) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <Check className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Lien créé avec succès !</h2>
                <p className="text-sm text-slate-500">Pour {userName}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="bg-slate-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-slate-600 mb-2 font-medium">Lien de paiement Stripe :</p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={paymentUrl}
                readOnly
                className="flex-1 p-3 bg-white border border-slate-300 rounded-lg text-sm font-mono"
              />
              <button
                onClick={copyToClipboard}
                className="px-4 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition flex items-center gap-2"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copié !" : "Copier"}
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={sendByEmail}
              className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition flex items-center justify-center gap-2"
            >
              <Mail className="w-5 h-5" />
              Envoyer par email
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition"
            >
              Fermer
            </button>
          </div>

          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              <strong>Important :</strong> Copiez ce lien et envoyez-le à l'élève par email ou WhatsApp. 
              Le lien est valide et sécurisé par Stripe.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gold-100 rounded-full flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-gold-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Générer un lien de paiement</h2>
              <p className="text-sm text-slate-500">Pour {userName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Formation (optionnel)
            </label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
            >
              <option value="">Paiement personnalisé</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title} - {course.price}€
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Montant (€)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={
                selectedCourse
                  ? courses.find(c => c.id === selectedCourse)?.price || ""
                  : customAmount
              }
              onChange={(e) => setCustomAmount(e.target.value)}
              disabled={!!selectedCourse}
              required
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 disabled:bg-slate-100"
              placeholder="Ex: 1500.00"
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gold-500 text-navy-900 rounded-lg font-bold hover:bg-gold-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Génération...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  Générer le lien
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

