"use client";

import { FileDown, Loader2, Award, FileCheck } from "lucide-react";
import { useState } from "react";
import { generateAttestation, generateCertificatRealisation } from "@/lib/pdf/certificates";

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
  const [loadingType, setLoadingType] = useState<"attestation" | "certificat" | null>(null);

  const handleDownload = async (type: "attestation" | "certificat") => {
    setLoadingType(type);
    try {
      const data = {
        userName,
        courseTitle,
        startDate,
        endDate,
        duration,
        score,
      };
      
      const doc = type === "attestation" 
        ? generateAttestation(data)
        : generateCertificatRealisation(data);
        
      const fileName = type === "attestation" 
        ? `Attestation_${courseTitle.replace(/\s+/g, "_")}.pdf`
        : `Certificat_Realisation_${courseTitle.replace(/\s+/g, "_")}.pdf`;
        
      doc.save(fileName);
    } catch (error) {
      console.error("PDF generation error", error);
    } finally {
      setLoadingType(null);
    }
  };

  return (
    <div className="space-y-3">
      <button
        onClick={() => handleDownload("attestation")}
        disabled={!!loadingType}
        className="w-full flex items-center gap-3 p-4 rounded-xl bg-gold-500 text-navy-900 font-bold hover:bg-gold-600 transition shadow-lg shadow-gold-500/20 disabled:opacity-70 group"
      >
        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
          {loadingType === "attestation" ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Award className="w-6 h-6" />
          )}
        </div>
        <div className="text-left">
          <p className="text-sm font-black uppercase tracking-tight">Attestation de fin de formation</p>
          <p className="text-[10px] opacity-70">Télécharger au format PDF</p>
        </div>
        <FileDown className="w-5 h-5 ml-auto opacity-40 group-hover:opacity-100 transition" />
      </button>

      <button
        onClick={() => handleDownload("certificat")}
        disabled={!!loadingType}
        className="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-slate-200 bg-white text-slate-700 font-bold hover:border-gold-500 hover:text-gold-600 transition disabled:opacity-70 group"
      >
        <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-gold-50 group-hover:text-gold-500 transition">
          {loadingType === "certificat" ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <FileCheck className="w-6 h-6" />
          )}
        </div>
        <div className="text-left">
          <p className="text-sm font-black uppercase tracking-tight">Certificat de réalisation</p>
          <p className="text-[10px] opacity-70">Modèle officiel CPF / OPCO</p>
        </div>
        <FileDown className="w-5 h-5 ml-auto opacity-20 group-hover:opacity-100 transition text-slate-400 group-hover:text-gold-500" />
      </button>
    </div>
  );
}

