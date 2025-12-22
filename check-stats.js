const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("--- User Document Statuses ---");
    const docStats = await prisma.userDocument.groupBy({
        by: ['status'],
        _count: true
    });
    console.log(JSON.stringify(docStats, null, 2));

    console.log("\n--- User Onboarding Statuses ---");
    const userStats = await prisma.user.groupBy({
        by: ['onboardingStatus'],
        _count: true
    });
    console.log(JSON.stringify(userStats, null, 2));

    console.log("\n--- Enrollment Statuses ---");
    const enrollStats = await prisma.enrollment.groupBy({
        by: ['status'],
        _count: true
    });
    console.log(JSON.stringify(enrollStats, null, 2));

    console.log("\n--- Order Statuses ---");
    const orderStats = await prisma.order.groupBy({
        by: ['status'],
        _count: true
    });
    console.log(JSON.stringify(orderStats, null, 2));
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
