"use client";

import { WelcomeTour } from "@/components/dashboard/WelcomeTour";
import { useState } from "react";
import { HelpCircle } from "lucide-react";

export function AdminWelcomeWrapper({ role }: { role: string }) {
    const [showForced, setShowForced] = useState(false);

    return (
        <>
            <WelcomeTour role={role} onClose={() => setShowForced(false)} forced={showForced} />
            <div className="absolute top-8 right-8 flex items-center gap-2">
                <button
                    onClick={() => setShowForced(true)}
                    className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-500 hover:text-gold-600 transition shadow-sm"
                >
                    <HelpCircle className="w-3.5 h-3.5" />
                    Aide / Tutoriel
                </button>
            </div>
        </>
    );
}
