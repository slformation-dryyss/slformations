import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { prisma } from "@/lib/prisma";
import { generateInvoice } from "@/lib/pdf/invoices";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ enrollmentId: string }> }
) {
  const { enrollmentId } = await params;
  const session = await auth0.getSession();
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  try {
    const dbUser = await prisma.user.findUnique({
      where: { auth0Id: session.user.sub },
      select: { id: true, name: true, email: true }
    });
    
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    const enrollment = await prisma.enrollment.findUnique({
      where: { id: enrollmentId },
      include: {
        course: true,
        user: true
      }
    });
    
    if (!enrollment) {
      return NextResponse.json({ error: "Enrollment not found" }, { status: 404 });
    }
    
    // Security: Only the user or admin can download
    if (enrollment.userId !== dbUser.id) {
      const userRole = await prisma.user.findUnique({
        where: { id: dbUser.id },
        select: { role: true }
      });
      
      if (userRole?.role !== "ADMIN" && userRole?.role !== "OWNER") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }
    
    // Generate invoice number (format: SLFORM-YYYY-XXXXX)
    const year = new Date().getFullYear();
    const invoiceNumber = `SLFORM-${year}-${enrollment.id.slice(-5).toUpperCase()}`;
    
    const invoiceData = {
      invoiceNumber,
      invoiceDate: new Date(enrollment.createdAt).toLocaleDateString('fr-FR'),
      dueDate: new Date(enrollment.createdAt).toLocaleDateString('fr-FR'), // Immediate payment
      
      clientName: enrollment.user.name || "Client",
      clientAddress: "Adresse du client", // TODO: Add address fields to User model
      clientPostal: "75001",
      clientCity: "Paris",
      
      companyName: "SL FORMATIONS",
      companyAddress: "123 Avenue de Paris",
      companyPostal: "75001",
      companyCity: "Paris",
      companySIRET: "123 456 789 00012",
      companyTVA: "FR12345678901",
      companyAPE: "8559A",
      
      items: [
        {
          description: `Formation : ${enrollment.course.title}`,
          quantity: 1,
          unitPrice: enrollment.course.price,
          vatRate: 0 // Formation professionnelle = TVA 0%
        }
      ],
      
      paymentMethod: "Paiement en ligne (Stripe)",
      bankDetails: "IBAN: FR76 XXXX XXXX XXXX XXXX XXXX XXX - BIC: XXXXXXXX"
    };
    
    const pdf = generateInvoice(invoiceData);
    const pdfBuffer = Buffer.from(pdf.output('arraybuffer'));
    
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Facture_${invoiceNumber}.pdf"`
      }
    });
    
  } catch (error) {
    console.error("Invoice generation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

