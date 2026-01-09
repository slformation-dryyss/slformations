"use client";

import { useState, useEffect } from "react";
import { Phone, Mail, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

interface ContactFormProps {
  defaultSubject?: string;
  defaultProfile?: string;
}

export function ContactForm({ defaultSubject = "Renseignements - Permis de conduire", defaultProfile = "Particulier" }: ContactFormProps) {
  const searchParams = useSearchParams();
  const urlSubject = searchParams.get('subject');

  const [profile, setProfile] = useState(defaultProfile);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState(defaultSubject);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (urlSubject) {
      if (urlSubject === 'recrutement') {
        setSubject("Recrutement (Formateur)");
        setMessage("Bonjour, je suis formateur et je souhaite postuler pour rejoindre votre équipe. Voici mes informations...");
      } else {
        setSubject(urlSubject);
        if (!message) {
          setMessage(`Bonjour, je souhaite m'inscrire à la formation : ${urlSubject.replace('Inscription - ', '')}.`);
        }
      }
    }
  }, [urlSubject, message]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, name, email, phone, subject, message }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        // throw new Error(data.error || "Erreur lors de l'envoi du message."); // Replaced
        toast.error(data.error || "Erreur lors de l'envoi du message.");
      } else {
        toast.success("Votre message a bien été envoyé. Nous vous répondrons rapidement.");
        setName("");
        setEmail("");
        setPhone("");
        setMessage("");
        setSubject(defaultSubject);
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Erreur lors de l'envoi du message.";
      // setError(message); // Replaced
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.2fr,0.8fr] gap-10">
      <form
        onSubmit={handleSubmit}
        className="glass-effect rounded-2xl p-6 md:p-8 border border-slate-200 bg-white space-y-4 shadow-sm"
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-2 text-slate-900">Envoyer un message</h2>
        <p className="text-slate-500 text-sm mb-4">
          Dites-nous en plus sur votre projet (permis, VTC, CACES, formation pro). Nous vous recontactons sous 24h ouvrées.
        </p>

        {/* Removed success alert section */}
        {/* Removed error alert section */}

        {/* Row 1: Name | Email - 2 cols */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-700 mb-1">Nom complet *</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-gold-500 placeholder:text-slate-400"
              placeholder="Votre nom et prénom"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-700 mb-1">Email *</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-gold-500 placeholder:text-slate-400"
              placeholder="vous@example.com"
            />
          </div>
        </div>

        {/* Row 2: Profile (Small) | Phone (Small) | Subject (Small) - 3 cols */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           <div>
            <label className="block text-sm text-slate-700 mb-1">Vous êtes *</label>
            <select
              required
              value={profile}
              onChange={(e) => setProfile(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-gold-500"
            >
              <option value="Particulier">Particulier</option>
              <option value="Entreprise">Entreprise</option>
              <option value="Organisme (France Travail, Mission Locale...)">Organisme</option>
              <option value="Autre">Autre</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-slate-700 mb-1">Téléphone</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-gold-500 placeholder:text-slate-400"
              placeholder="+33 6 12 34 56 78"
            />
          </div>
           <div>
            <label className="block text-sm text-slate-700 mb-1">Sujet *</label>
            <select
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-gold-500"
            >
              {urlSubject && <option value={subject}>{subject}</option>}
              <option value="Renseignements - Permis de conduire">Renseignements - Permis (B, Moto, Poids lourd)</option>
              <option value="Formation VTC / Taxi">Formation VTC / Taxi</option>
              <option value="Formation CACES / Sécurité">Formation CACES / Sécurité</option>
              <option value="Recrutement (Formateur)">Recrutement (Formateur)</option>
              <option value="Demande d'accès (Compte élève)">Demande d&apos;accès (Compte élève)</option>
              <option value="Questions Financement (CPF, etc.)">Questions Financement (CPF, etc.)</option>
              <option value="Partenariat / Presse">Partenariat / Presse</option>
              <option value="Autre demande">Autre demande</option>
            </select>
          </div>
        </div>


        <div>
          <label className="block text-sm text-slate-700 mb-1">Message *</label>
          <textarea
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full min-h-[140px] px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-900 resize-y focus:outline-none focus:border-gold-500 placeholder:text-slate-400"
            placeholder="Expliquez votre besoin (permis, planning souhaité, financement, etc.)"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-gradient-to-r from-gold-500 to-gold-600 text-slate-900 font-semibold text-sm hover:shadow-lg hover:shadow-gold-500/40 transition disabled:opacity-70 disabled:cursor-not-allowed"
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

        <p className="text-[11px] text-slate-500 mt-2">
          En envoyant ce formulaire, vous acceptez que nous vous contactions à propos de votre demande. Vos données sont traitées conformément à notre politique de confidentialité.
        </p>
      </form>

      <aside className="space-y-4">
        <div className="glass-effect rounded-2xl p-6 md:p-8 border border-slate-200 bg-white shadow-sm">
          <h3 className="text-xl font-bold mb-3 text-slate-900">Nos coordonnées</h3>
          <p className="text-slate-500 text-sm mb-4">
            Vous pouvez également nous joindre directement pour toute question sur les permis, les financements ou les formations professionnelles.
          </p>
          <div className="space-y-3 text-sm">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-gold-500/15 flex items-center justify-center">
                <Phone className="w-4 h-4 text-gold-500" />
              </div>
              <div>
                <p className="text-slate-400 text-xs">Téléphone</p>
                <p className="font-semibold text-slate-900">01 60 28 54 18</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-9 h-9 rounded-full bg-gold-500/15 flex items-center justify-center mt-1">
                <Mail className="w-4 h-4 text-gold-500" />
              </div>
              <div>
                <p className="text-slate-400 text-[10px] uppercase font-bold">Email</p>
                <p className="font-semibold text-slate-900 text-sm">info@sl-formations.fr</p>
                <p className="text-slate-400 text-[10px] italic">Informations, Inscriptions & Documents</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

