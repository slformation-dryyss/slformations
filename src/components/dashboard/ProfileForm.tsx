'use client';

import { useState } from 'react';
import { Mail, AlertCircle } from 'lucide-react';

interface ProfileFormProps {
  user: {
    email: string;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
    birthDate: string | null;
    addressLine1: string | null;
    addressLine2: string | null;
    postalCode: string | null;
    city: string | null;
    country: string | null;
    profession: string | null;
    employerName: string | null;
    nationalIdNumber: string | null;
    drivingLicenseNumber: string | null;
    drivingLicenseType: string | null;
    drivingLicenseIssuedAt: string | null;
    role?: string;
    bio?: string | null;
    diplomas?: string[];
    badges?: string[];
  };
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [firstName, setFirstName] = useState(user.firstName ?? '');
  const [lastName, setLastName] = useState(user.lastName ?? '');
  const [phone, setPhone] = useState(user.phone ?? '');
  const [birthDate, setBirthDate] = useState<string>(
    user.birthDate ? user.birthDate.slice(0, 10) : ''
  );
  const [addressLine1, setAddressLine1] = useState(user.addressLine1 ?? '');
  const [addressLine2, setAddressLine2] = useState(user.addressLine2 ?? '');
  const [postalCode, setPostalCode] = useState(user.postalCode ?? '');
  const [city, setCity] = useState(user.city ?? '');
  const [country, setCountry] = useState(user.country ?? 'France');
  const [profession, setProfession] = useState(user.profession ?? '');
  const [employerName, setEmployerName] = useState(user.employerName ?? '');
  const [nationalIdNumber, setNationalIdNumber] = useState(
    user.nationalIdNumber ?? ''
  );
  const [drivingLicenseNumber, setDrivingLicenseNumber] = useState(
    user.drivingLicenseNumber ?? ''
  );
  const [drivingLicenseType, setDrivingLicenseType] = useState(
    user.drivingLicenseType ?? ''
  );
  const [drivingLicenseIssuedAt, setDrivingLicenseIssuedAt] = useState<string>(
    user.drivingLicenseIssuedAt
      ? user.drivingLicenseIssuedAt.slice(0, 10)
      : ''
  );

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          firstName,
          lastName,
          phone,
          birthDate: birthDate || null,
          addressLine1,
          addressLine2,
          postalCode,
          city,
          country,
          profession,
          employerName,
          nationalIdNumber,
          drivingLicenseNumber,
          drivingLicenseType,
          drivingLicenseIssuedAt: drivingLicenseIssuedAt || null,
        }),
      });

      if (!res.ok) {
        throw new Error('Erreur lors de la sauvegarde du profil');
      }

      setMessage('Profil mis à jour avec succès');
    } catch (err: any) {
      setError(err.message ?? 'Une erreur est survenue');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-xl shadow-slate-200/40">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-xl font-black text-slate-900">Informations personnelles</h3>
          <p className="text-xs text-slate-500 mt-1">Complétez votre profil pour un meilleur suivi</p>
        </div>
        <button
          type="submit"
          form="profile-form"
          className="px-6 py-2.5 bg-gold-500 text-navy-900 rounded-xl font-black text-xs md:text-sm hover:bg-gold-600 transition-all shadow-lg shadow-gold-500/20 disabled:opacity-60 disabled:cursor-not-allowed hover:scale-105 active:scale-95 flex items-center gap-2"
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-navy-900/30 border-t-navy-900 rounded-full animate-spin" />
              Sauvegarde...
            </>
          ) : (
            'Enregistrer les modifications'
          )}
        </button>
      </div>

      {message && (
        <p className="mb-4 text-xs md:text-sm text-green-400">{message}</p>
      )}
      {error && (
        <p className="mb-4 text-xs md:text-sm text-red-400">{error}</p>
      )}

      <form
        id="profile-form"
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 text-xs md:text-sm"
      >
        {/* Bloc identité */}
        <div>
          <label className="block text-slate-500 font-bold mb-1.5 uppercase tracking-wide text-[10px]">Prénom</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 outline-none transition-all text-slate-700 font-medium placeholder:text-slate-400"
          />
        </div>
        <div>
          <label className="block text-slate-500 font-bold mb-1.5 uppercase tracking-wide text-[10px]">Nom</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 outline-none transition-all text-slate-700 font-medium placeholder:text-slate-400"
          />
        </div>
        <div>
          <label className="block text-slate-500 font-bold mb-1.5 flex items-center justify-between">
            Email
            <span className="text-[10px] bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full text-slate-500 font-bold uppercase tracking-tighter">
              Lecture seule
            </span>
          </label>
          <div className="space-y-2">
            <input
              type="email"
              value={user.email}
              readOnly
              className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl opacity-80 cursor-not-allowed text-slate-400 font-medium"
            />
            <button
              type="button"
              onClick={() => {
                const subject = encodeURIComponent("Demande de modification d'email");
                const body = encodeURIComponent(`Bonjour,\n\nSouhaitant modifier l'adresse email associée à mon compte (${user.email}), je vous contacte pour effectuer cette démarche.\n\nNom : ${lastName}\nPrénom : ${firstName}\nNouvel email souhaité : `);
                window.location.href = `mailto:contact@sl-formations.fr?subject=${subject}&body=${body}`;
              }}
              className="flex items-center gap-2 text-[10px] md:text-xs text-gold-500/80 hover:text-gold-500 transition-colors py-1"
            >
              <Mail className="w-3.5 h-3.5" />
              Demander la modification au secrétariat
            </button>
          </div>
        </div>
        <div>
          <label className="block text-slate-500 font-bold mb-1.5 uppercase tracking-wide text-[10px]">Téléphone</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 outline-none transition-all text-slate-700 font-medium placeholder:text-slate-400"
          />
        </div>
        <div>
          <label className="block text-slate-500 font-bold mb-1.5 uppercase tracking-wide text-[10px]">Date de naissance</label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 outline-none transition-all text-slate-700 font-medium placeholder:text-slate-400"
          />
        </div>

        {/* Adresse */}
        <div>
          <label className="block text-slate-500 font-bold mb-1.5 uppercase tracking-wide text-[10px]">Code postal</label>
          <input
            type="text"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 outline-none transition-all text-slate-700 font-medium placeholder:text-slate-400"
          />
        </div>
        <div>
          <label className="block text-slate-500 font-bold mb-1.5 uppercase tracking-wide text-[10px]">Ville</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 outline-none transition-all text-slate-700 font-medium placeholder:text-slate-400"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-slate-500 font-bold mb-1.5 uppercase tracking-wide text-[10px]">Adresse</label>
          <input
            type="text"
            value={addressLine1}
            onChange={(e) => setAddressLine1(e.target.value)}
            className="w-full px-4 py-2.5 bg-navy-700 border border-navy-600 rounded-lg mb-2"
          />
          <input
            type="text"
            value={addressLine2}
            onChange={(e) => setAddressLine2(e.target.value)}
            placeholder="Complément d'adresse (facultatif)"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 outline-none transition-all text-slate-700 font-medium placeholder:text-slate-400"
          />
        </div>
        <div>
          <label className="block text-gray-400 mb-1">Pays</label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 outline-none transition-all text-slate-700 font-medium placeholder:text-slate-400"
          />
        </div>

        {/* Projet & pro */}
        <div>
          <label className="block text-gray-400 mb-1">Profession actuelle</label>
          <input
            type="text"
            value={profession}
            onChange={(e) => setProfession(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 outline-none transition-all text-slate-700 font-medium placeholder:text-slate-400"
          />
        </div>
        <div>
          <label className="block text-gray-400 mb-1">Employeur (facultatif)</label>
          <input
            type="text"
            value={employerName}
            onChange={(e) => setEmployerName(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 outline-none transition-all text-slate-700 font-medium placeholder:text-slate-400"
          />
        </div>




      </form>
    </section>
  );
}


