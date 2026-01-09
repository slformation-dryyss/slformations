import { NextResponse } from "next/server";
import { jsPDF } from "jspdf";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const doc = new jsPDF();
    
    // Configuration
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - 2 * margin;
    let yPosition = 20;

    // Titre
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("FORMULAIRE DE RÉTRACTATION", margin, yPosition);
    yPosition += 15;

    // Date
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Date : _______________`, margin, yPosition);
    yPosition += 15;

    // Instructions
    doc.setFontSize(11);
    const instruction = "Le présent formulaire doit être complété et renvoyé uniquement si le Client souhaite se rétracter de la commande passée sur https://sl-formations.fr/ sauf exclusions ou limites à l'exercice du droit de rétractation suivant les Conditions Générales de Vente applicables.";
    const splitInstruction = doc.splitTextToSize(instruction, maxWidth);
    doc.text(splitInstruction, margin, yPosition);
    yPosition += splitInstruction.length * 6 + 10;

    // À l'attention de
    doc.setFont("helvetica", "bold");
    doc.text("À l'attention de :", margin, yPosition);
    yPosition += 7;

    doc.setFont("helvetica", "normal");
    doc.text("SAS SL Formations", margin, yPosition);
    yPosition += 6;
    doc.text("41 avenue de la république", margin, yPosition);
    yPosition += 6;
    doc.text("77340 PONTAULT COMBAULT", margin, yPosition);
    yPosition += 15;

    // Corps du formulaire
    doc.setFont("helvetica", "normal");
    const bodyText = "Je notifie par la présente la rétractation du contrat portant sur la commande de la prestation de service ci-dessous :";
    const splitBody = doc.splitTextToSize(bodyText, maxWidth);
    doc.text(splitBody, margin, yPosition);
    yPosition += splitBody.length * 6 + 10;

    // Champs à remplir
    doc.text("- Commande du (indiquer la date) : _______________", margin, yPosition);
    yPosition += 10;
    doc.text("- Numéro de la commande : _______________", margin, yPosition);
    yPosition += 10;
    doc.text("- Nom du Client : _______________", margin, yPosition);
    yPosition += 10;
    doc.text("- Adresse du Client : _______________", margin, yPosition);
    yPosition += 20;

    // Signature
    doc.text("Signature du Client (uniquement en cas de notification du présent formulaire sur papier)", margin, yPosition);

    // Générer le PDF en base64
    const pdfOutput = doc.output("arraybuffer");

    return new NextResponse(pdfOutput, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="formulaire-retractation-sl-formations.pdf"',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la génération du PDF" },
      { status: 500 }
    );
  }
}
