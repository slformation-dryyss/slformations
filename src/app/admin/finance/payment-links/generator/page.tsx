import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ClientPaymentForm from "../ClientPaymentForm";
import { syncStripePaymentStatus } from "../../actions";

export default async function GeneratorPage() {
    await requireAdmin();

    // Fetch pending links to sync (limited to 10 for performance)
    const pendingLinks = await prisma.paymentLink.findMany({
        where: { status: "PENDING" },
        orderBy: { createdAt: "desc" },
        take: 10
    });

    if (pendingLinks.length > 0) {
        try {
            await Promise.all(pendingLinks.map(link => syncStripePaymentStatus(link.id)));
        } catch (e) {
            console.error("Background Sync Failed in GeneratorPage:", e);
        }
    }

    const users = await prisma.user.findMany({
        where: { role: "STUDENT" },
        select: {
            id: true, email: true, firstName: true, lastName: true, phone: true,
            enrollments: { select: { courseId: true, status: true } }
        },
        orderBy: { email: "asc" }
    });

    const courses = await prisma.course.findMany({
        where: { isPublished: true },
        select: { id: true, title: true, price: true },
        orderBy: { title: "asc" }
    });

    return (
        <div>
            <p className="text-slate-600 mb-6">
                Générez un lien de paiement unique pour un élève. Lorsqu&apos;il paiera via ce lien,
                la commande sera automatiquement créée et validée, et l&apos;accès à la formation débloqué.
            </p>

            <ClientPaymentForm users={users} courses={courses} />
        </div>
    );
}
