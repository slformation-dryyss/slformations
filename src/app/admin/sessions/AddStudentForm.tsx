"use client";

import { useState } from "react";
import { enrollUserInSessionAction } from "./enroll-action";
import { UserPlus, Loader2, Check } from "lucide-react";

interface UserCompact {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
}

export default function AddStudentForm({ sessionId, users }: { sessionId: string, users: UserCompact[] }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError(null);
        setSuccess(false);

        const result = await enrollUserInSessionAction(formData);

        if (result.error) {
            setError(result.error);
        } else {
            setSuccess(true);
            // Reset form? native reset or just show success
        }
        setLoading(false);
    }

    if (success) {
        return (
            <div className="bg-green-50 p-4 rounded border border-green-200 flex items-center justify-between">
                <span className="text-green-800 font-bold flex items-center gap-2">
                    <Check className="w-5 h-5" /> Élève inscrit ! Email de confirmation envoyé.
                </span>
                <button onClick={() => setSuccess(false)} className="text-sm underline text-green-700">Ajouter un autre</button>
            </div>
        )
    }

    return (
        <form action={handleSubmit} className="bg-slate-50 p-4 rounded border border-slate-200">
            <h3 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
                <UserPlus className="w-5 h-5" /> Inscrire un élève manuellement
            </h3>
            
            <input type="hidden" name="sessionId" value={sessionId} />
            
            <div className="flex gap-2">
                <select name="userId" required className="flex-1 text-sm border-slate-300 rounded focus:ring-gold-500 focus:border-gold-500">
                    <option value="">-- Choisir un élève --</option>
                    {users.map(u => (
                        <option key={u.id} value={u.id}>
                            {u.firstName} {u.lastName} ({u.email})
                        </option>
                    ))}
                </select>
                <button 
                    type="submit" 
                    disabled={loading}
                    className="bg-slate-900 text-white px-4 py-2 rounded text-sm font-bold hover:bg-slate-800 disabled:opacity-50"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Ajouter"}
                </button>
            </div>
            {error && <p className="text-red-500 text-xs mt-2 font-bold">{error}</p>}
        </form>
    );
}

