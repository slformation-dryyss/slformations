"use client";

import { useState } from "react";
import { CreditCard, Send, X, Loader2 } from "lucide-react";
import { createPaymentLinkAction } from "../../app/admin/participants/payment-actions";

interface CreatePaymentLinkModalProps {
  userId: string;
  userName: string;
  userEmail: string;
  onClose: () => void;
  courses: Array<{ id: string; title: string; price: number }>;
}

export function CreatePaymentLinkModal({
  userId,
  userName,
  userEmail,
  onClose,
  courses,
}: CreatePaymentLinkModalProps) {
  const [loading, setLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [expiresInDays, setExpiresInDays] = useState("7");
  const [sendEmail, setSendEmail] = useState(true);

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
      formData.append("expiresInDays", expiresInDays);
      formData.append("sendEmail", sendEmail.toString());

      await createPaymentLinkAction(formData);
      onClose();
    } catch (error) {
      console.error("Error creating payment link:", error);
      alert("Erreur lors de la création du lien de paiement");
    } finally {
      setLoading(false);
    }
  };

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

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Expiration (jours)
            </label>
            <select
              value={expiresInDays}
              onChange={(e) => setExpiresInDays(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
            >
              <option value="1">1 jour</option>
              <option value="3">3 jours</option>
              <option value="7">7 jours (recommandé)</option>
              <option value="14">14 jours</option>
              <option value="30">30 jours</option>
            </select>
          </div>

          <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <input
              type="checkbox"
              id="sendEmail"
              checked={sendEmail}
              onChange={(e) => setSendEmail(e.target.checked)}
              className="mt-1"
            />
            <div className="flex-1">
              <label htmlFor="sendEmail" className="text-sm font-medium text-slate-900 cursor-pointer">
                Envoyer un email de notification
              </label>
              <p className="text-xs text-slate-600 mt-1">
                L'élève recevra un email à <strong>{userEmail}</strong> avec le lien de paiement
              </p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-800">
              <strong>Note :</strong> Le lien de paiement sera automatiquement visible dans le dashboard de l'élève
              dans la section "Mes paiements".
            </p>
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
                  <Send className="w-5 h-5" />
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

