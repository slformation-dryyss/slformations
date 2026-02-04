import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  
  // Client
  clientName: string;
  clientAddress: string;
  clientPostal: string;
  clientCity: string;
  
  // Company (SL Formations)
  companyName: string;
  companyAddress: string;
  companyPostal: string;
  companyCity: string;
  companySIRET: string;
  companyTVA: string;
  companyAPE: string;
  
  // Items
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    vatRate: number; // 0, 5.5, 10, 20
  }>;
  
  // Payment
  paymentMethod?: string;
  bankDetails?: string;

  // Logo
  logoBase64?: string;
}

export const generateInvoice = (data: InvoiceData) => {
  const doc = new jsPDF();
  
  // Header - Logo & Company Info
  if (data.logoBase64) {
    try {
      doc.addImage(data.logoBase64, 'PNG', 20, 10, 30, 10); // Adjust dimensions as needed
    } catch (e) {
      console.error("Error adding logo to PDF:", e);
    }
  }

  doc.setFontSize(20);
  doc.setTextColor(30, 41, 59);
  doc.text(data.companyName, 20, 25); // Shifted down a bit if needed, or keep same if logo is small/side-by-sde
  
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(data.companyAddress, 20, 28);
  doc.text(`${data.companyPostal} ${data.companyCity}`, 20, 33);
  doc.text(`SIRET: ${data.companySIRET}`, 20, 38);
  doc.text(`TVA: ${data.companyTVA}`, 20, 43);
  doc.text(`APE: ${data.companyAPE}`, 20, 48);
  
  // Invoice Title
  doc.setFontSize(24);
  doc.setTextColor(234, 179, 8); // Gold
  doc.text("FACTURE", 150, 25);
  
  doc.setFontSize(10);
  doc.setTextColor(51, 65, 85);
  doc.text(`N° ${data.invoiceNumber}`, 150, 33);
  doc.text(`Date: ${data.invoiceDate}`, 150, 39);
  doc.text(`Échéance: ${data.dueDate}`, 150, 45);
  
  // Client Info
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("FACTURÉ À", 20, 65);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(data.clientName, 20, 72);
  doc.text(data.clientAddress, 20, 78);
  doc.text(`${data.clientPostal} ${data.clientCity}`, 20, 84);
  
  // Items Table
  const tableStartY = 100;
  
  const tableData = data.items.map(item => {
    const totalHT = item.quantity * item.unitPrice;
    const vatAmount = totalHT * (item.vatRate / 100);
    const totalTTC = totalHT + vatAmount;
    
    return [
      item.description,
      item.quantity.toString(),
      `${item.unitPrice.toFixed(2)} €`,
      `${item.vatRate}%`,
      `${totalHT.toFixed(2)} €`,
      `${totalTTC.toFixed(2)} €`
    ];
  });
  
  autoTable(doc, {
    startY: tableStartY,
    head: [['Description', 'Qté', 'Prix Unit. HT', 'TVA', 'Total HT', 'Total TTC']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontSize: 9 },
    bodyStyles: { fontSize: 9 },
    columnStyles: {
      0: { cellWidth: 70 },
      1: { cellWidth: 15, halign: 'center' },
      2: { cellWidth: 25, halign: 'right' },
      3: { cellWidth: 15, halign: 'center' },
      4: { cellWidth: 25, halign: 'right' },
      5: { cellWidth: 25, halign: 'right' }
    }
  });

  // Totals
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  
  let totalHT = 0;
  let totalTVA = 0;
  let totalTTC = 0;
  
  data.items.forEach(item => {
    const ht = item.quantity * item.unitPrice;
    const tva = ht * (item.vatRate / 100);
    totalHT += ht;
    totalTVA += tva;
    totalTTC += ht + tva;
  });
  
  doc.setFontSize(10);
  doc.text(`Total HT:`, 140, finalY);
  doc.text(`${totalHT.toFixed(2)} €`, 180, finalY, { align: 'right' });
  
  doc.text(`Total TVA:`, 140, finalY + 6);
  doc.text(`${totalTVA.toFixed(2)} €`, 180, finalY + 6, { align: 'right' });
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(`Total TTC:`, 140, finalY + 14);
  doc.text(`${totalTTC.toFixed(2)} €`, 180, finalY + 14, { align: 'right' });
  
  // Payment Info
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  
  const paymentY = finalY + 30;
  doc.text("Conditions de paiement:", 20, paymentY);
  doc.text(data.paymentMethod || "Paiement à réception", 20, paymentY + 5);
  
  if (data.bankDetails) {
    doc.text("Coordonnées bancaires:", 20, paymentY + 12);
    doc.text(data.bankDetails, 20, paymentY + 17);
  }
  
  // Legal Mentions (MANDATORY in France)
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  const legalY = 270;
  doc.text("Organisme de formation enregistré sous le numéro 11 75 XXXXX 75 auprès du préfet d'Île-de-France.", 105, legalY, { align: 'center' });
  doc.text("Cet enregistrement ne vaut pas agrément de l'État. TVA non applicable, art. 293 B du CGI.", 105, legalY + 4, { align: 'center' });
  doc.text("En cas de retard de paiement, pénalités de 3 fois le taux d'intérêt légal + indemnité forfaitaire de 40€.", 105, legalY + 8, { align: 'center' });
  
  return doc;
};

