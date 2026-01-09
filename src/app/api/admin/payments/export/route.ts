import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await requireAdmin();

    const payments = await prisma.payment.findMany({
      include: {
        order: {
          include: {
            user: true,
            course: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    // Generate CSV
    const headers = [
      "ID Paiement",
      "Date",
      "Eleve",
      "Email",
      "Formation",
      "Montant",
      "Mode",
      "Status",
      "Note Admin"
    ];

    const rows = payments.map(p => [
      p.id,
      p.createdAt.toISOString(),
      p.order.user.name || "",
      p.order.user.email,
      p.order.course?.title || "Panier",
      p.amount.toString(),
      p.provider || "STRIPE",
      p.status,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${(cell || "").replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="historique_paiements.csv"',
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

