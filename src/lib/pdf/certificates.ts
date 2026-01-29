import { jsPDF } from "jspdf";
import "jspdf-autotable";

interface CertificateData {
  userName: string;
  courseTitle: string;
  startDate: string;
  endDate: string;
  duration: number;
  score?: number;
  companyName?: string;
}

export const generateAttestation = (data: CertificateData) => {
  const doc = new jsPDF();
  const primaryColor = [15, 23, 42]; // Navy 900
  const accentColor = [234, 179, 8]; // Gold 500

  // Header Background
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, 210, 40, "F");

  // Logo / Branding
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.text("SL FORMATIONS", 20, 25);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("L'EXCELLENCE DE LA FORMATION PROFESSIONNELLE", 20, 32);

  // Title
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("ATTESTATION DE FIN DE FORMATION", 105, 60, { align: "center" });

  doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.setLineWidth(1.5);
  doc.line(70, 65, 140, 65);

  // Content
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(51, 65, 85); // Slate 700

  const bodyY = 85;
  doc.text(`Je soussigné, Monsieur/Madame le Responsable de Formation,`, 20, bodyY);
  doc.text(`de l'organisme de formation SL FORMATIONS (Déclaration d'activité n° 11 75 XXXXX 75),`, 20, bodyY + 7);

  doc.setFont("helvetica", "bold");
  doc.text(`CERTIFIE QUE`, 105, bodyY + 25, { align: "center" });

  doc.setFontSize(20);
  doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.text(data.userName.toUpperCase(), 105, bodyY + 40, { align: "center" });

  doc.setFontSize(12);
  doc.setTextColor(51, 65, 85);
  doc.setFont("helvetica", "normal");
  doc.text(`A suivi avec assiduité l'action de formation intitulée :`, 20, bodyY + 60);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(data.courseTitle, 20, bodyY + 70);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(`S'étant déroulée du ${data.startDate} au ${data.endDate}.`, 20, bodyY + 85);
  doc.text(`Durée totale de la formation : ${data.duration} heures.`, 20, bodyY + 92);

  if (data.score !== undefined) {
    doc.setFont("helvetica", "bold");
    doc.text(`Score obtenu à l'évaluation finale : ${data.score}%`, 20, bodyY + 105);
  }

  // Legal footer
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139); // Slate 500
  doc.text("Fait pour valoir ce que de droit,", 20, 230);
  doc.text(`Le ${new Date().toLocaleDateString('fr-FR')}`, 20, 237);

  // Signature Block
  doc.setDrawColor(203, 213, 225); // Slate 200
  doc.setLineWidth(0.5);
  doc.roundedRect(130, 220, 60, 40, 3, 3);
  doc.setFontSize(9);
  doc.text("Cachet et signature", 160, 228, { align: "center" });
  doc.text("de l'Organisme", 160, 233, { align: "center" });

  // Company info footer
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.line(20, 280, 190, 280);
  doc.setFontSize(8);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text("SL FORMATIONS - 123 Avenue de Paris, 75001 Paris - SIRET: 123 456 789 00012", 105, 286, { align: "center" });
  doc.text("www.sl-formations.fr - contact@sl-formations.fr", 105, 291, { align: "center" });

  return doc;
};

export const generateCertificatRealisation = (data: CertificateData) => {
  const doc = new jsPDF();

  doc.setFontSize(22);
  doc.setTextColor(30, 41, 59);
  doc.text("CERTIFICAT DE RÉALISATION", 105, 40, { align: "center" });
  doc.text("(Modèle officiel CPF / OPCO)", 105, 50, { align: "center" });

  doc.setFontSize(12);
  doc.text("Dispense de formation effectuée conformément à l'article L. 6331-21 du Code du travail", 105, 65, { align: "center" });

  // Add more formal fields as required by the official Cerfa-like structure
  // ...

  return doc;
};


