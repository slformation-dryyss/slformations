'use client';

import { useState } from 'react';
import { Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { reviewDocumentAction } from '../actions';

interface DocumentReviewFormProps {
  documentId: string;
}

export function DocumentReviewForm({ documentId }: DocumentReviewFormProps) {
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);

  async function handleReview(status: 'APPROVED' | 'REJECTED') {
    if (status === 'REJECTED' && !reason.trim()) {
      toast.error('Un motif de refus est requis.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await reviewDocumentAction(documentId, status, reason);
      
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(status === 'APPROVED' ? 'Document validé avec succès' : 'Document refusé');
        setShowRejectForm(false);
        setReason('');
      }
    } catch (error) {
      toast.error("Une erreur inattendue est survenue.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mt-4 pt-4 border-t border-slate-100">
      <div className="flex gap-2">
        <button 
          onClick={() => handleReview('APPROVED')}
          disabled={isLoading}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Check className="w-4 h-4" /> Valider
        </button>
        <button 
          onClick={() => setShowRejectForm(!showRejectForm)}
          disabled={isLoading}
          className={`flex-1 ${showRejectForm ? 'bg-slate-200' : 'bg-red-100 hover:bg-red-200'} text-red-700 py-2 rounded text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50`}
        >
          <X className="w-4 h-4" /> Refuser
        </button>
      </div>

      {showRejectForm && (
        <div className="mt-4 animate-in fade-in slide-in-from-top-2">
          <textarea 
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Motif du refus (obligatoire pour rejeter)" 
            className="w-full text-sm p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
            rows={2}
          />
          <button 
            onClick={() => handleReview('REJECTED')}
            disabled={isLoading}
            className="w-full mt-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            Confirmer le Refus
          </button>
        </div>
      )}
    </div>
  );
}

