"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowRight, SkipForward } from "lucide-react";

export function OnboardingForm({ userPromise }: { userPromise?: Promise<any> }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    addressLine1: "",
    postalCode: "",
    city: "",
    country: "France",
    birthDate: "",
    profession: "",
  });

  const capitalize = (str: string) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let newValue = value;

    // Champs à capitaliser automatiquement (Title Case)
    if (["firstName", "lastName", "city", "addressLine1", "profession", "country"].includes(name)) {
      // On garde l'espace à la fin si l'utilisateur est train de taper
      const endsWithSpace = value.endsWith(" ");
      newValue = capitalize(value);
      if (endsWithSpace && !newValue.endsWith(" ")) {
        newValue += " ";
      }
    }

    setFormData({ ...formData, [name]: newValue });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          isOnboarding: true, // Signal key for API
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Erreur lors de la sauvegarde");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue. Veuillez réessayer.");
      setIsLoading(false);
    }
  };

  const handleSkip = async () => {
    // On définit un cookie "sl_onboarding_skipped" pour la session
    document.cookie = "sl_onboarding_skipped=true; path=/";
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-xl max-w-2xl w-full mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold mb-2 text-slate-900">Bienvenue ! 👋</h2>
        <p className="text-slate-500 text-sm">
          Pour compléter votre dossier de formation, nous avons besoin de quelques informations.
          Vous pouvez aussi compléter cela plus tard.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Prénom</label>
            <input
              type="text"
              name="firstName"
              required
              value={formData.firstName}
              onChange={handleChange}
              className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition placeholder:text-slate-400"
              placeholder="Jean"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Nom</label>
            <input
              type="text"
              name="lastName"
              required
              value={formData.lastName}
              onChange={handleChange}
              className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition placeholder:text-slate-400"
              placeholder="Dupont"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Téléphone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition placeholder:text-slate-400"
            placeholder="06 12 34 56 78"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Adresse</label>
          <input
            type="text"
            name="addressLine1"
            value={formData.addressLine1}
            onChange={handleChange}
            className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition placeholder:text-slate-400"
            placeholder="123 Avenue de la République"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Code Postal</label>
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition placeholder:text-slate-400"
              placeholder="75001"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Ville</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition placeholder:text-slate-400"
              placeholder="Paris"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Date de naissance</label>
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate || ""}
              onChange={handleChange}
              className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Métier actuel (optionnel)</label>
            <input
              type="text"
              name="profession"
              value={formData.profession}
              onChange={handleChange}
              className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition placeholder:text-slate-400"
              placeholder="Chauffeur, étudiant, sans emploi..."
            />
          </div>
        </div>

        <div className="pt-4 flex flex-col md:flex-row gap-4 justify-between items-center">
          <button
            type="button"
            onClick={handleSkip}
            className="text-slate-500 hover:text-slate-900 text-sm flex items-center gap-2 px-4 py-2 hover:bg-slate-100 rounded-lg transition"
          >
            <SkipForward className="w-4 h-4" />
            Passer pour le moment
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="bg-gold-500 hover:bg-gold-600 text-navy-900 font-bold py-3 px-8 rounded-lg flex items-center gap-2 transition disabled:opacity-70 disabled:cursor-not-allowed w-full md:w-auto justify-center shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Enregistrer et continuer
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

