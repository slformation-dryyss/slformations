'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { KeyRound, Shield, Clock, X, AlertTriangle } from 'lucide-react';

interface FirstLoginModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

export function FirstLoginModal({ isOpen, onClose }: FirstLoginModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleChangeNow = async () => {
    setIsLoading(true);
    // Redirect to password change flow
    window.location.href = '/api/auth/change-password';
  };

  const handleSkip = async () => {
    setIsLoading(true);
    try {
      await fetch('/api/auth/skip-password-change', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'skip' }),
      });
      router.refresh();
      onClose?.();
    } catch (error) {
      console.error('Error skipping password change:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLater = () => {
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header with gradient */}
        {/* Header with gradient */}
        <div className="bg-navy-950 p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-navy-900/50 to-transparent"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold-400/10 blur-3xl rounded-full -mr-16 -mt-16"></div>
          <div className="relative">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-md rounded-full mb-6 border border-white/20 shadow-2xl">
              <KeyRound className="w-10 h-10 text-gold-500" />
            </div>
            <h2 className="text-3xl font-black text-white mb-2 tracking-tight">
              <span className="text-gradient-gold">Sécurité</span> du compte
            </h2>
            <p className="text-slate-400 text-sm font-medium">
              Première connexion détectée
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Info Alert */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-blue-900 mb-1">
                  Recommandation de sécurité
                </p>
                <p className="text-xs text-blue-800">
                  Pour protéger vos données personnelles et votre progression, nous vous recommandons vivement de personnaliser votre mot de passe temporaire.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {/* Primary Action */}
            <button
              onClick={handleChangeNow}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-6 py-4.5 bg-slate-950 text-white font-black rounded-2xl transition-all shadow-xl shadow-slate-950/20 hover:bg-navy-900 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <KeyRound className="w-5 h-5 text-gold-500 group-hover:rotate-12 transition-transform" />
              <span>Changer mon mot de passe</span>
            </button>

            {/* Secondary Action */}
            <button
              onClick={handleLater}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold rounded-2xl transition-all border border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <Clock className="w-5 h-5 text-slate-400 group-hover:scale-110 transition-transform" />
              <span>Me le rappeler plus tard</span>
            </button>

            {/* Tertiary Action */}
            <button
              onClick={handleSkip}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm text-slate-400 hover:text-red-500 font-bold transition-colors group"
            >
              <X className="w-4 h-4" />
              <span>Ignorer définitivement</span>
              <span className="text-[10px] bg-red-50 text-red-500 px-1.5 py-0.5 rounded ml-1 border border-red-100 uppercase tracking-tighter">Non recommandé</span>
            </button>
          </div>

          {/* Warning for skip action */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800">
                <strong>Important :</strong> Si vous ignorez cette étape, vous continuerez à utiliser le mot de passe temporaire généré automatiquement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
