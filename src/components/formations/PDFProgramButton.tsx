"use client";

import { useState } from "react";
import { FileDown, Loader2 } from "lucide-react";
import { generateProgramPDF } from "@/lib/pdf/programmes";

interface PDFProgramButtonProps {
  course: {
    title: string;
    description: string;
    price: number;
    modules: any[];
  };
  durationText?: string;
}

export function PDFProgramButton({ course, durationText }: PDFProgramButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      // Map database structure to PDF generator structure
      const programData = {
        title: course.title,
        description: course.description,
        duration: durationText,
        price: course.price,
        modules: course.modules.map((m: any) => ({
          title: m.title,
          description: m.description || "",
          lessons: (m.lessons || []).map((l: any) => ({
            title: l.title,
            description: l.description || "",
            duration: Math.round(l.duration / 60) // Convert seconds to minutes
          }))
        }))
      };

      await generateProgramPDF(programData);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      alert("Une erreur est survenue lors de la génération du PDF. Veuillez réessayer.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isGenerating}
      className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md text-white font-bold px-10 py-5 rounded-2xl hover:bg-white/20 transition-all border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed group"
    >
      {isGenerating ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Génération...
        </>
      ) : (
        <>
          Télécharger le programme
          <FileDown className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
        </>
      )}
    </button>
  );
}
