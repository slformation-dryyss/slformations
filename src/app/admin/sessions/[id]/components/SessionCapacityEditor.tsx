"use client";

import { useState } from "react";
import { updateSessionCapacityAction } from "../actions";
import { Check, Edit2, X, Loader2 } from "lucide-react";

interface SessionCapacityEditorProps {
    sessionId: string;
    currentBooked: number;
    currentMax: number;
}

export default function SessionCapacityEditor({ sessionId, currentBooked, currentMax }: SessionCapacityEditorProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [maxSpots, setMaxSpots] = useState(currentMax);
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        setLoading(true);
        const formData = new FormData();
        formData.append("sessionId", sessionId);
        formData.append("maxSpots", maxSpots.toString());

        await updateSessionCapacityAction(formData);
        
        setLoading(false);
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <div className="flex items-center gap-2 bg-slate-100 p-2 rounded-lg animate-in fade-in zoom-in duration-200">
                <input 
                    type="number" 
                    min={currentBooked}
                    value={maxSpots}
                    onChange={(e) => setMaxSpots(parseInt(e.target.value))}
                    className="w-16 h-8 text-sm text-center border-slate-300 rounded focus:border-indigo-500 focus:ring-indigo-500"
                />
                <button 
                    onClick={handleSave} 
                    disabled={loading}
                    className="p-1.5 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                </button>
                <button 
                    onClick={() => setIsEditing(false)} 
                    className="p-1.5 bg-slate-300 text-slate-600 rounded hover:bg-slate-400 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 text-center min-w-[140px] group relative hover:border-indigo-200 transition-colors">
            <button 
                onClick={() => setIsEditing(true)}
                className="absolute top-2 right-2 p-1 text-slate-300 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Modifier la capacité"
            >
                <Edit2 className="w-3 h-3" />
            </button>
            <p className="text-sm text-slate-500 font-medium">Places occupées</p>
            <p className="text-2xl font-bold text-slate-900">
                {currentBooked} <span className="text-slate-400 font-normal text-lg">/ {currentMax}</span>
            </p>
        </div>
    );
}

