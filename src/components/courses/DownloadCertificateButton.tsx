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
  variant?: "primary" | "outline";
}

export function DownloadCertificateButton({
  userName,
  courseTitle,
  startDate,
  endDate,
  duration,
  score,
  variant = "primary",
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

  const buttonStyles = variant === "primary"
    ? "bg-gold-500 text-navy-900 hover:bg-gold-600 shadow-lg shadow-gold-500/20"
    : "border-2 border-slate-200 text-slate-700 hover:border-gold-500 hover:text-gold-600 bg-white";

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition ${buttonStyles} disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <FileDown className="w-5 h-5" />
      )}
      <span>{loading ? "Génération..." : "Attestation"}</span>
    </button>
  );
}

