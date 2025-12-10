"use client";

import { useState } from "react";
import { Phone, Mail, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, subject, message }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Erreur lors de l'envoi du message.");
      }

      setSuccess("Votre message a bien été envoyé. Nous vous répondrons rapidement.");
      setName("");
      setEmail("");
      setPhone("");
      setSubject("");
      setMessage("");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Erreur lors de l'envoi du message.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.2fr,0.8fr] gap-10">
      <form
        onSubmit={handleSubmit}
        className="glass-effect rounded-2xl p-6 md:p-8 border border-navy-700 space-y-4"
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Envoyer un message</h2>
        <p className="text-gray-400 text-sm mb-4">
          Dites-nous en plus sur votre projet (permis, VTC, CACES, formation pro). Nous vous recontactons sous 24h ouvrées.
        </p>

        {success && (
          <div className="flex items-center space-x-2 px-4 py-3 rounded-lg bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 text-sm">
            <CheckCircle2 className="w-4 h-4" />
            <span>{success}</span>
          </div>
        )}

        {error && (
          <div className="flex items-center space-x-2 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/40 text-red-300 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Nom complet *</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-navy-800 border border-navy-700 text-sm focus:outline-none focus:border-gold-500"
              placeholder="Votre nom et prénom"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Email *</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-navy-800 border border-navy-700 text-sm focus:outline-none focus:border-gold-500"
              placeholder="vous@example.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Téléphone</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-navy-800 border border-navy-700 text-sm focus:outline-none focus:border-gold-500"
              placeholder="+33 6 12 34 56 78"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Sujet</label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-navy-800 border border-navy-700 text-sm focus:outline-none focus:border-gold-500"
              placeholder="Permis B, VTC, CACES, ..."
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">Message *</label>
          <textarea
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full min-h-[140px] px-4 py-3 rounded-lg bg-navy-800 border border-navy-700 text-sm resize-y focus:outline-none focus:border-gold-500"
            placeholder="Expliquez votre besoin (permis, planning souhaité, financement, etc.)"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-gradient-to-r from-gold-500 to-gold-600 text-navy-900 font-semibold text-sm hover:shadow-lg hover:shadow-gold-500/40 transition disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              <span>Envoi en cours...</span>
            </>
          ) : (
            <span>Envoyer le message</span>
          )}
        </button>

        <p className="text-[11px] text-gray-500 mt-2">
          En envoyant ce formulaire, vous acceptez que nous vous contactions à propos de votre demande. Vos données sont traitées conformément à notre politique de confidentialité.
        </p>
      </form>

      <aside className="space-y-4">
        <div className="glass-effect rounded-2xl p-6 md:p-8 border border-navy-700">
          <h3 className="text-xl font-bold mb-3">Nos coordonnées</h3>
          <p className="text-gray-300 text-sm mb-4">
            Vous pouvez également nous joindre directement pour toute question sur les permis, les financements ou les formations professionnelles.
          </p>
          <div className="space-y-3 text-sm">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-gold-500/15 flex items-center justify-center">
                <Phone className="w-4 h-4 text-gold-500" />
              </div>
              <div>
                <p className="text-gray-400 text-xs">Téléphone</p>
                <p className="font-semibold">01 23 45 67 89</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-gold-500/15 flex items-center justify-center">
                <Mail className="w-4 h-4 text-gold-500" />
              </div>
              <div>
                <p className="text-gray-400 text-xs">Email</p>
                <p className="font-semibold">contact@slformations.com</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
