import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { prisma } from "@/lib/prisma";
import { generateInvoice } from "@/lib/pdf/invoices";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ orderId: string }> }
) {
    const { orderId } = await params;
    const session = await auth0.getSession();

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const dbUser = await prisma.user.findUnique({
            where: { auth0Id: session.user.sub },
            select: { id: true, name: true, email: true, role: true }
        });

        if (!dbUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                course: true,
                user: true,
                items: {
                    include: {
                        course: true
                    }
                }
            }
        });

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        // Security: Only the user or admin can download
        if (order.userId !== dbUser.id) {
            if (dbUser.role !== "ADMIN" && dbUser.role !== "OWNER") {
                return NextResponse.json({ error: "Forbidden" }, { status: 403 });
            }
        }

        // Generate invoice number (format: SLFORM-YYYY-XXXXX)
        const year = new Date(order.createdAt).getFullYear();
        const invoiceNumber = `FAC-${year}-${order.id.slice(-5).toUpperCase()}`;

        // Read Logo
        let logoBase64: string | undefined = undefined;
        try {
            const fs = await import("fs");
            const path = await import("path");
            const logoPath = path.join(process.cwd(), "public", "LOGO.png");
            if (fs.existsSync(logoPath)) {
                const logoBuffer = fs.readFileSync(logoPath);
                logoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`;
            }
        } catch (e) {
            console.error("Error loading invoice logo:", e);
        }

        const invoiceData = {
            invoiceNumber,
            invoiceDate: new Date(order.createdAt).toLocaleDateString('fr-FR'),
            dueDate: new Date(order.createdAt).toLocaleDateString('fr-FR'),

            clientName: order.user.name || "Client",
            clientAddress: "Adresse du client", // TODO: Add address from user profile if available
            clientPostal: (order.user as any).postalCode || "",
            clientCity: (order.user as any).city || "",

            companyName: "SL FORMATIONS",
            companyAddress: "123 Avenue de Paris",
            companyPostal: "75001",
            companyCity: "Paris",
            companySIRET: "123 456 789 00012",
            companyTVA: "FR12345678901",
            companyAPE: "8559A",

            items: order.items.length > 0 ? order.items.map(item => ({
                description: `Formation : ${item.course.title}`,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                vatRate: 0 // Formation professionnelle = TVA 0%
            })) : [{
                description: `Formation : ${order.course?.title || "Formation"}`,
                quantity: 1,
                unitPrice: order.amount,
                vatRate: 0
            }],

            paymentMethod: "Carte Bancaire (Stripe)",
            bankDetails: "",
            logoBase64: logoBase64
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
