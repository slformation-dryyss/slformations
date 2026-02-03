
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const courses = await prisma.course.findMany({
        where: {
            OR: [
                { imageUrl: null },
                { imageUrl: "" }
            ]
        },
        select: {
            id: true,
            title: true,
            type: true,
            slug: true
        }
    });

    console.log("Courses with missing images:");
    if (courses.length === 0) {
        console.log("None");
    } else {
        courses.forEach(c => console.log(`- [${c.type}] ${c.title} (ID: ${c.id})`));
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
