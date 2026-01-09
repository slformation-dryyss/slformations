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

  // Branding
  doc.setFontSize(22);
  doc.setTextColor(30, 41, 59); // Slate 800
  doc.text("ATTESTATION DE FIN DE FORMATION", 105, 40, { align: "center" });

  doc.setDrawColor(234, 179, 8); // Gold 500
  doc.setLineWidth(1);
  doc.line(40, 45, 170, 45);

  // Content
  doc.setFontSize(14);
  doc.setTextColor(51, 65, 85); // Slate 700
  doc.text(`Je soussigné, Monsieur/Madame [Responsable Formation],`, 20, 70);
  doc.text(`Responsable de l'organisme de formation SL FORMATIONS,`, 20, 78);
  
  doc.text(`CERTIFIE QUE`, 105, 95, { align: "center" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(data.userName.toUpperCase(), 105, 110, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);
  doc.text(`A suivi avec assiduité l'action de formation intitulée :`, 20, 130);
  
  doc.setFont("helvetica", "bold");
  doc.text(data.courseTitle, 20, 140);

  doc.setFont("helvetica", "normal");
  doc.text(`S'étant déroulée du ${data.startDate} au ${data.endDate}.`, 20, 155);
  doc.text(`Durée totale de la formation : ${data.duration} heures.`, 20, 163);

  if (data.score !== undefined) {
    doc.text(`Score obtenu à l'évaluation finale : ${data.score}%`, 20, 175);
  }

  // Legal footer
  doc.setFontSize(10);
  doc.setTextColor(148, 163, 184); // Slate 400
  doc.text("Fait pour valoir ce que de droit,", 20, 210);
  doc.text(`A Paris, le ${new Date().toLocaleDateString('fr-FR')}`, 20, 218);

  // Placeholder for signature
  doc.setDrawColor(203, 213, 225); // Slate 200
  doc.rect(130, 205, 60, 30);
  doc.text("Cachet et signature", 140, 215);

  // Company info footer
  doc.line(20, 275, 190, 275);
  doc.setFontSize(8);
  doc.text("SL FORMATIONS - 123 Avenue de Paris, 75001 Paris - SIRET: 123 456 789 00012", 105, 282, { align: "center" });
  doc.text("Déclaration d'activité enregistrée sous le numéro 11 75 XXXXX 75 auprès du préfet d'Île-de-France", 105, 287, { align: "center" });

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


