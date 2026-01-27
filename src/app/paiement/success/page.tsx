'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, PlayCircle, Loader2 } from 'lucide-react';
import { verifyAndSyncSession } from '@/app/dashboard/paiement/sync-actions';
import { toast } from 'sonner';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    async function sync() {
      if (sessionId) {
        setIsSyncing(true);
        try {
          const result = await verifyAndSyncSession(sessionId);
          if (result.success) {
            setSyncMessage(result.message || null);
          }
        } catch (e) {
          console.error("Auto-sync error:", e);
        } finally {
          setIsSyncing(false);
        }
      }
    }
    sync();
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-slate-100">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-12 h-12 text-green-600 animate-bounce" />
        </div>
        
        <h1 className="text-3xl font-bold text-slate-900 mb-4 font-serif">
          Paiement Validé !
        </h1>
        
        <p className="text-slate-600 mb-6 leading-relaxed">
          Merci pour votre confiance. Votre inscription est en cours de finalisation. 
        </p>

        {isSyncing ? (
          <div className="flex items-center justify-center gap-2 text-gold-600 font-bold mb-8 animate-pulse">
            <Loader2 className="w-5 h-5 animate-spin" />
            Mise à jour de votre compte...
          </div>
        ) : syncMessage ? (
          <div className="bg-green-50 text-green-700 p-4 rounded-xl mb-8 flex items-center gap-3 text-sm font-bold border border-green-100 shadow-sm">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            {syncMessage}
          </div>
        ) : (
          <p className="text-slate-500 mb-8 text-sm italic">
            Un email de confirmation vous a été envoyé.
          </p>
        )}

        <div className="space-y-4">
          <Link 
            href="/dashboard/mes-formations"
            className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl active:scale-95"
          >
            Accéder à mes formations
            <PlayCircle className="w-5 h-5" />
          </Link>
          
          <Link 
            href="/dashboard"
            className="w-full flex items-center justify-center gap-2 text-slate-500 font-semibold py-2 hover:text-slate-900 transition"
          >
            Retour au tableau de bord
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {sessionId && (
          <div className="mt-8 pt-8 border-t border-slate-100">
            <p className="text-[10px] text-slate-400 uppercase tracking-widest">
              ID de transaction : {sessionId.split('_').slice(0, 2).join('_')}...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}

