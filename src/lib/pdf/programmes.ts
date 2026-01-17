import { jsPDF } from "jspdf";
import "jspdf-autotable";

interface ProgramData {
  title: string;
  description: string;
  duration?: string;
  price?: number;
  modules: {
    title: string;
    description: string;
    lessons: {
      title: string;
      description: string;
      duration: number;
    }[];
  }[];
}

export const generateProgramPDF = async (data: ProgramData) => {
  const doc = new jsPDF() as any; // Using any to avoid type issues with autotable plugin

  // Helper to load images (needs to be async or handle base64)
  const loadImage = (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      // In a real browser environment, we'd fetch or use an Image object.
      // Since this runs client-side, we can use fetch + FileReader.
      fetch(url)
        .then(res => res.blob())
        .then(blob => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        })
        .catch(reject);
    });
  };

  try {
    // 1. Header with Logo
    const logoBase64 = await loadImage("/LOGO long.png");
    doc.addImage(logoBase64, "PNG", 20, 15, 50, 15);

    const qualiopiBase64 = await loadImage("/LogoQualiopi-Marianne-150dpi-31.jpg");
    doc.addImage(qualiopiBase64, "JPG", 155, 10, 35, 20);

    // 2. Main Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(30, 41, 59); // Slate 800
    doc.text("PROGRAMME DE FORMATION", 105, 50, { align: "center" });

    doc.setDrawColor(234, 179, 8); // Gold 500
    doc.setLineWidth(1.5);
    doc.line(70, 55, 140, 55);

    // 3. Course Title and Description
    doc.setFontSize(18);
    doc.setTextColor(51, 65, 85); // Slate 700
    doc.text(data.title.toUpperCase(), 105, 75, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(71, 85, 105); // Slate 600
    const splitDesc = doc.splitTextToSize(data.description, 170);
    doc.text(splitDesc, 20, 90);

    let currentY = 90 + (splitDesc.length * 5) + 15;

    // 4. Quick Info (Duration, Price)
    doc.setFillColor(248, 250, 252); // Slate 50
    doc.roundedRect(20, currentY, 170, 15, 2, 2, "F");
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    doc.text(`DURÉE : ${data.duration || "N/A"}`, 30, currentY + 9);
    doc.text(`TARIF : ${data.price ? data.price + "€" : "Sur devis"}`, 120, currentY + 9);

    currentY += 25;

    // 5. Modules and Lessons Table
    doc.setFontSize(14);
    doc.text("CONTENU ET OBJECTIFS", 20, currentY);
    currentY += 5;

    const tableRows: any[] = [];
    data.modules.forEach((module, mIdx) => {
      // Module header row
      tableRows.push([
        { 
          content: `MODULE ${mIdx + 1}: ${module.title}`, 
          colSpan: 2, 
          styles: { fillColor: [241, 158, 21], textColor: [255, 255, 255], fontStyle: 'bold' } 
        }
      ]);
      
      module.lessons.forEach((lesson) => {
        tableRows.push([
          lesson.title,
          `${lesson.duration} min`
        ]);
      });
    });

    doc.autoTable({
      startY: currentY + 5,
      head: [['Leçon', 'Durée']],
      body: tableRows,
      theme: 'grid',
      headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255] },
      styles: { fontSize: 9, cellPadding: 3 },
      columnStyles: {
        1: { cellWidth: 30, halign: 'center' }
      }
    });

    // 6. Footer on every page
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184); // Slate 400
        doc.line(20, 280, 190, 280);
        doc.text(`SL FORMATIONS - Document généré le ${new Date().toLocaleDateString('fr-FR')} - Page ${i} sur ${pageCount}`, 105, 286, { align: "center" });
    }

    doc.save(`Programme-${data.title.replace(/\s+/g, '-')}.pdf`);

  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
};
