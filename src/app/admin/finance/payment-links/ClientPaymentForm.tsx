"use client";

import { useState } from "react";
import { createManualPaymentLinkAction } from "../actions";
import { Copy, Check, Loader2, Send } from "lucide-react";

interface User { id: string; email: string; firstName: string | null; lastName: string | null; }
interface Course { id: string; title: string; price: number; }

export default function ClientPaymentForm({ users, courses }: { users: User[], courses: Course[] }) {
    const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError(null);
        setGeneratedUrl(null);

        const result = await createManualPaymentLinkAction(formData);

        if (result.error) {
            setError(result.error);
        } else if (result.url) {
            setGeneratedUrl(result.url);
        }
        setLoading(false);
    }

    const copyToClipboard = () => {
        if (generatedUrl) {
            navigator.clipboard.writeText(generatedUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="space-y-6">
            <form action={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Élève</label>
                        <select name="userId" required className="w-full border-slate-300 rounded-md shadow-sm focus:border-gold-500 focus:ring-gold-500">
                            <option value="">-- Sélectionner un élève --</option>
                            {users.map(u => {
                                const displayName = u.firstName && u.lastName 
                                    ? `${u.firstName} ${u.lastName}` 
                                    : u.email;
                                return (
                                    <option key={u.id} value={u.id}>
                                        {displayName} ({u.email})
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Formation</label>
                        <select name="courseId" required className="w-full border-slate-300 rounded-md shadow-sm focus:border-gold-500 focus:ring-gold-500">
                            <option value="">-- Sélectionner une formation --</option>
                            {courses.map(c => (
                                <option key={c.id} value={c.id}>
                                    {c.title} - {c.price}€
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-slate-900 text-white py-2 px-4 rounded-md hover:bg-slate-800 disabled:opacity-50 flex items-center justify-center font-bold"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : "Générer le lien de paiement"}
                </button>

                {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
            </form>

            {generatedUrl && (
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg animate-in fade-in slide-in-from-top-2">
                    <h3 className="text-green-800 font-bold mb-2 flex items-center gap-2">
                        <Check className="w-5 h-5" /> Lien créé avec succès
                    </h3>
                    <div className="flex items-center gap-2">
                        <input 
                            readOnly 
                            value={generatedUrl} 
                            className="flex-1 bg-white border-green-300 text-slate-600 text-sm p-2 rounded focus:ring-0"
                        />
                        <button 
                            onClick={copyToClipboard}
                            className="bg-green-100 hover:bg-green-200 text-green-800 p-2 rounded transition-colors"
                            title="Copier"
                        >
                            {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                        </button>
                    </div>
                    
                    <div className="mt-4 flex gap-3">
                        <a 
                            href={`mailto:?subject=Lien de paiement - Formation&body=Bonjour, voici le lien pour régler votre formation : ${generatedUrl}`}
                            className="text-sm font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                        >
                            <Send className="w-4 h-4" /> Envoyer par email (Client mail)
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}
