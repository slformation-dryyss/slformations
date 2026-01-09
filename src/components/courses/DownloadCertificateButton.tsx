"use client";

import { FileDown, Loader2 } from "lucide-react";
import { useState } from "react";
import { generateAttestation } from "@/lib/pdf/certificates";

interface DownloadCertificateButtonProps {
  userName: string;
  courseTitle: string;
  startDate: string;
  endDate: string;
  duration: number;
  score?: number;
}

export function DownloadCertificateButton({
  userName,
  courseTitle,
  startDate,
  endDate,
  duration,
  score,
}: DownloadCertificateButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const doc = generateAttestation({
        userName,
        courseTitle,
        startDate,
        endDate,
        duration,
        score,
      });
      doc.save(`Attestation_${courseTitle.replace(/\s+/g, "_")}.pdf`);
    } catch (error) {
      console.error("PDF generation error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="flex items-center gap-2 px-6 py-3 bg-gold-500 text-navy-900 rounded-xl font-bold hover:bg-gold-600 transition shadow-lg shadow-gold-500/20"
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <FileDown className="w-5 h-5" />
      )}
      <span>Télécharger mon attestation</span>
    </button>
  );
}

