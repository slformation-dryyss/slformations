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

    // Fetch user driving balance
    const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: { drivingBalance: true }
    });

    // Fetch successful orders (purchases)
    const orders = await prisma.order.findMany({
        where: {
            userId: user.id,
            status: "COMPLETED"
        },
        include: {
            course: true,
            items: {
                include: {
                    course: true
                }
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    // Calculate total paid
    const totalPaid = orders.reduce((acc, order) => acc + order.amount, 0);

    // Calculate total hours ever purchased
    const totalHoursPurchased = orders.reduce((acc, order) => {
        const orderHours = order.items.reduce((sum, item) => sum + (item.course?.drivingHours || 0) * item.quantity, 0);
        return acc + orderHours;
    }, 0);

    // Calculate pending amount from links
    const totalPending = paymentLinks.reduce((acc, link) => acc + link.amount, 0);

    return <PaiementContent 
        paymentLinks={paymentLinks} 
        drivingPacks={drivingPacks as any} 
        drivingBalance={dbUser?.drivingBalance || 0}
        totalPaid={totalPaid}
        totalPending={totalPending}
        totalHoursPurchased={totalHoursPurchased}
        orders={orders as any}
    />;
}
