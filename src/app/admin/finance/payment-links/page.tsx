import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DollarSign } from "lucide-react";
import ClientPaymentForm from "./ClientPaymentForm";

export default async function PaymentLinksPage() {
    await requireAdmin();

    // Fetch only students (not admins, instructors, or owners)
    const users = await prisma.user.findMany({
        where: {
            role: "STUDENT"
        },
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            enrollments: {
                select: {
                    courseId: true,
                    status: true
                }
            }
        },
        orderBy: {
            email: "asc"
        }
    });

    const courses = await prisma.course.findMany({
        where: {
            isPublished: true
        },
        select: {
            id: true,
            title: true,
            price: true,
        },
        orderBy: {
            title: "asc"
        }
    });

    // Fetch previous generated links history
    const previousLinks = await prisma.paymentLink.findMany({
        orderBy: { createdAt: "desc" },
        take: 50,
        include: {
            user: { select: { email: true, firstName: true, lastName: true } },
            course: { select: { title: true } }
        }
    });

    return (
        <div className="max-w-4xl mx-auto pb-10">
            <h1 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <DollarSign className="w-8 h-8 text-gold-500" />
                Générateur de Lien de Paiement
            </h1>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                <p className="text-slate-600 mb-6">
                    Générez un lien de paiement unique pour un élève. Lorsqu&apos;il paiera via ce lien, 
                    la commande sera automatiquement créée et validée, et l&apos;accès à la formation débloqué.
                </p>

                <ClientPaymentForm users={users} courses={courses} previousLinks={previousLinks} />
            </div>
        </div>
    );
}
