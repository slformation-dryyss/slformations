
import { requireAdmin } from "@/lib/auth";
import { createCourseAction } from "../actions";

export default async function CreateCoursePage() {
  await requireAdmin();

  return (
    <div className="max-w-3xl mx-auto py-8">
      
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-slate-200 -z-10" />
            <div className="flex flex-col items-center bg-white px-2">
                <div className="w-8 h-8 rounded-full bg-gold-500 text-slate-900 font-bold flex items-center justify-center mb-1">1</div>
                <span className="text-xs font-semibold text-slate-900">Infos Générales</span>
            </div>
             <div className="flex flex-col items-center bg-white px-2">
                <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 font-bold flex items-center justify-center mb-1">2</div>
                <span className="text-xs font-medium text-slate-500">Contenu & Modules</span>
            </div>
        </div>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Initialiser une nouvelle formation</h1>
        <p className="text-slate-500 mt-1">Commencez par définir les informations de base. Vous pourrez ajouter les modules, leçons et vidéos à l&apos;étape suivante.</p>
      </div>

      <form action={createCourseAction} className="bg-white shadow-lg rounded-xl border border-slate-200 p-8 space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
            <label htmlFor="title" className="block text-sm font-bold text-slate-900 mb-1">
                Titre de la formation <span className="text-red-500">*</span>
            </label>
            <input
                type="text"
                name="title"
                id="title"
                required
                placeholder="Ex: Permis B Accéléré - Formule Complète"
                className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-gold-500 focus:ring-gold-500 sm:text-sm p-3 border"
            />
            </div>

            <div>
                <label htmlFor="type" className="block text-sm font-bold text-slate-900 mb-1">
                    Catégorie <span className="text-red-500">*</span>
                </label>
                <select
                    name="type"
                    id="type"
                    className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-gold-500 focus:ring-gold-500 sm:text-sm p-3 border bg-white"
                >
                    <option value="PERMIS">🚗 Permis (Auto/Moto)</option>
                    <option value="FIMO">🚛 Poids Lourd / FIMO</option>
                    <option value="VTC">🚕 VTC / Taxi</option>
                    <option value="CACES">🏗️ CACES / Logistique</option>
                    <option value="CYBER">💻 Cybersécurité</option>
                    <option value="TECH">📱 Développement / Tech</option>
                    <option value="CMS">🌐 CMS / No-Code</option>
                    <option value="AUTRE">✨ Autre</option>
                </select>
            </div>

            <div>
            <label htmlFor="price" className="block text-sm font-bold text-slate-900 mb-1">
                Prix Public (TTC)
            </label>
            <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-slate-500 sm:text-sm">€</span>
                </div>
                <input
                    type="number"
                    name="price"
                    id="price"
                    min={0}
                    step="0.01"
                    defaultValue={0}
                    className="block w-full rounded-lg border-slate-300 pl-7 focus:border-gold-500 focus:ring-gold-500 sm:text-sm p-3 border"
                />
            </div>
            <p className="mt-1 text-xs text-slate-500">Laisser à 0 pour afficher &quot;Sur devis&quot;.</p>
            </div>

             <div className="md:col-span-2">
                <label htmlFor="imageUrl" className="block text-sm font-bold text-slate-900 mb-1">
                    URL de l&apos;image de couverture (Optionnel)
                </label>
                <input
                    type="url"
                    name="imageUrl"
                    id="imageUrl"
                    placeholder="https://exemple.com/image.jpg"
                    className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-gold-500 focus:ring-gold-500 sm:text-sm p-3 border"
                />
            </div>

            <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-bold text-slate-900 mb-1">
                Description courte <span className="text-red-500">*</span>
            </label>
            <textarea
                name="description"
                id="description"
                rows={4}
                required
                placeholder="Une brève présentation qui apparaîtra sur la carte de la formation..."
                className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-gold-500 focus:ring-gold-500 sm:text-sm p-3 border"
            />
            </div>
        </div>

        <div className="pt-6 flex items-center justify-between border-t border-slate-100 mt-6">
            <span className="text-xs text-slate-400">* Champs obligatoires</span>
          <button
            type="submit"
            className="bg-slate-900 text-white px-6 py-3 rounded-lg hover:bg-slate-800 transition-colors font-bold shadow-md hover:shadow-lg transform active:scale-95 transition-all"
          >
            Suivant : Créer le Programme &rarr;
          </button>
        </div>
      </form>
    </div>
  );
}

