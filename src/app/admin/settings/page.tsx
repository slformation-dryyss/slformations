import { requireOwner } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateSystemSettingsAction } from "./actions";
import { MapPin, Save, Phone, Mail, Globe, Lock } from "lucide-react";

export default async function AdminSettingsPage() {
  await requireOwner();

  const settingsList = await prisma.systemSetting.findMany();
  const settings = settingsList.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Paramètres Système</h1>
      <p className="text-slate-500 mb-8">Configurez les informations globales de la plateforme.</p>

      <form action={updateSystemSettingsAction} className="space-y-8">
        
        {/* --- CONTACT INFO --- */}
        <div className="bg-white shadow rounded-lg border border-slate-200 p-6">
           <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5 text-gold-500" />
              Informations de Contact
           </h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                 <label htmlFor="CONTACT_ADDRESS" className="block text-sm font-medium text-slate-700 mb-1">
                    Adresse Postale (Pied de page & Lieu par défaut)
                 </label>
                 <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                    <input
                        type="text"
                        name="CONTACT_ADDRESS"
                        id="CONTACT_ADDRESS"
                        defaultValue={settings["CONTACT_ADDRESS"] || settings["DEFAULT_LOCATION"] || ""}
                        className="block w-full rounded-md border-slate-300 pl-10 focus:border-gold-500 focus:ring-gold-500 sm:text-sm p-2 border"
                        placeholder="123 Avenue des Champs-Élysées, 75008 Paris"
                    />
                 </div>
                 {/* Synced with Default Location for simplicity, or we separate them logic-wise */}
                 <input type="hidden" name="DEFAULT_LOCATION" value={settings["CONTACT_ADDRESS"] || ""} /> 
              </div>

              <div>
                 <label htmlFor="CONTACT_PHONE" className="block text-sm font-medium text-slate-700 mb-1">
                    Téléphone
                 </label>
                 <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                    <input
                        type="text"
                        name="CONTACT_PHONE"
                        id="CONTACT_PHONE"
                        defaultValue={settings["CONTACT_PHONE"] || ""}
                        className="block w-full rounded-md border-slate-300 pl-10 focus:border-gold-500 focus:ring-gold-500 sm:text-sm p-2 border"
                        placeholder="01 60 28 54 18"
                    />
                 </div>
              </div>

              <div>
                 <label htmlFor="CONTACT_EMAIL" className="block text-sm font-medium text-slate-700 mb-1">
                    Email de contact (Public)
                 </label>
                 <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                    <input
                        type="email"
                        name="CONTACT_EMAIL"
                        id="CONTACT_EMAIL"
                        defaultValue={settings["CONTACT_EMAIL"] || ""}
                        className="block w-full rounded-md border-slate-300 pl-10 focus:border-gold-500 focus:ring-gold-500 sm:text-sm p-2 border"
                        placeholder="contact@sl-formations.fr"
                    />
                 </div>
              </div>
           </div>
        </div>

        {/* --- EMAILING CONFIG --- */}
        <div className="bg-white shadow rounded-lg border border-slate-200 p-6">
           <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5 text-gold-500" />
              Configuration Emailing
           </h2>
           <p className="text-sm text-slate-500 mb-4">Ces informations apparaissent comme expéditeur des emails automatiques.</p>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                 <label htmlFor="MAIL_FROM_NAME" className="block text-sm font-medium text-slate-700 mb-1">
                    Nom de l&apos;expéditeur
                 </label>
                 <input
                    type="text"
                    name="MAIL_FROM_NAME"
                    id="MAIL_FROM_NAME"
                    defaultValue={settings["MAIL_FROM_NAME"] || "SL Formations"}
                    className="block w-full rounded-md border-slate-300 focus:border-gold-500 focus:ring-gold-500 sm:text-sm p-2 border"
                 />
              </div>
              <div>
                 <label htmlFor="MAIL_FROM_ADDRESS" className="block text-sm font-medium text-slate-700 mb-1">
                    Adresse d&apos;expédition (Doit être vérifiée)
                 </label>
                 <input
                    type="email"
                    name="MAIL_FROM_ADDRESS"
                    id="MAIL_FROM_ADDRESS"
                    defaultValue={settings["MAIL_FROM_ADDRESS"] || "ne-pas-repondre@sl-formations.fr"}
                    className="block w-full rounded-md border-slate-300 focus:border-gold-500 focus:ring-gold-500 sm:text-sm p-2 border"
                 />
              </div>
           </div>
        </div>

        {/* --- SOCIAL MEDIA --- */}
        <div className="bg-white shadow rounded-lg border border-slate-200 p-6">
           <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-gold-500" />
              Réseaux Sociaux
           </h2>
           <div className="space-y-4">
              {['FACEBOOK', 'INSTAGRAM', 'LINKEDIN'].map((network) => (
                  <div key={network}>
                    <label htmlFor={`SOCIAL_${network}`} className="block text-sm font-medium text-slate-700 mb-1 capitalize">
                        {network.toLowerCase()} URL
                    </label>
                    <input
                        type="url"
                        name={`SOCIAL_${network}`}
                        id={`SOCIAL_${network}`}
                        defaultValue={settings[`SOCIAL_${network}`] || ""}
                        className="block w-full rounded-md border-slate-300 focus:border-gold-500 focus:ring-gold-500 sm:text-sm p-2 border"
                        placeholder={`https://${network.toLowerCase()}.com/...`}
                    />
                  </div>
              ))}
           </div>
        </div>

        {/* --- MAINTENANCE --- */}
        <div className="bg-white shadow rounded-lg border border-red-200 p-6">
           <h2 className="text-xl font-bold text-red-700 mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Maintenance
           </h2>
           <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                name="MAINTENANCE_MODE" 
                id="MAINTENANCE_MODE" 
                value="true"
                defaultChecked={settings["MAINTENANCE_MODE"] === "true"}
                className="h-5 w-5 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label htmlFor="MAINTENANCE_MODE" className="text-sm text-slate-700">
                Activer le mode maintenance (Bloque l&apos;accès étudiant)
              </label>
           </div>
        </div>

        <div className="flex justify-end sticky bottom-6 z-10">
            <button
              type="submit"
              className="bg-slate-900 text-white px-8 py-3 rounded-lg hover:bg-slate-800 transition-colors font-bold shadow-lg flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              Enregistrer tous les paramètres
            </button>
        </div>

      </form>
    </div>
  );
}

