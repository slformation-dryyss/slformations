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
        <div className="bg-gradient-to-br from-gold-500 to-gold-600 p-8 text-center relative">
          <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
          <div className="relative">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-4 border-4 border-white/30">
              <KeyRound className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Sécurisez votre compte
            </h2>
            <p className="text-gold-100 text-sm">
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
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <KeyRound className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span>Changer mon mot de passe maintenant</span>
            </button>

            {/* Secondary Action */}
            <button
              onClick={handleLater}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-all border border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <Clock className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Me le rappeler plus tard</span>
            </button>

            {/* Tertiary Action */}
            <button
              onClick={handleSkip}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm text-slate-500 hover:text-slate-700 font-medium transition-colors group"
            >
              <X className="w-4 h-4" />
              <span>Ignorer définitivement</span>
              <span className="text-xs text-red-500 ml-1">(non recommandé)</span>
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
