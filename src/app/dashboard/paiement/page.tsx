import { Metadata } from 'next';
import PaiementContent from './PaiementContent';
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Mes paiements | SL Formations",
};

export default async function DashboardPaiementPage() {
    const user = await requireUser();

    // Fetch pending payment links
    const paymentLinks = await prisma.paymentLink.findMany({
        where: {
            userId: user.id,
            status: "PENDING",
            expiresAt: {
                gte: new Date() // Only show non-expired links
            }
        },
        include: {
            course: true
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    // Fetch available driving packs (formations with hours)
    const drivingPacks = await prisma.course.findMany({
        where: {
            isPublished: true,
            drivingHours: {
                gt: 0
            }
        },
        orderBy: {
            price: "asc"
        }
    });

    return <PaiementContent paymentLinks={paymentLinks} drivingPacks={drivingPacks as any} />;
}
