const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const email = "andrys.magar@hotmail.fr";
    console.log(`Checking user: ${email}`);

    const user = await prisma.user.findUnique({
        where: { email },
        select: {
            id: true,
            email: true,
            role: true,
            roles: true
        }
    });

    console.log("User Data:", JSON.stringify(user, null, 2));

    // Check the other one too just in case
    const email2 = "andrys972@gmail.com";
    console.log(`Checking user: ${email2}`);
    const user2 = await prisma.user.findUnique({
        where: { email: email2 },
        select: {
            id: true,
            email: true,
            role: true,
            roles: true
        }
    });
    console.log("User 2 Data:", JSON.stringify(user2, null, 2));
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
