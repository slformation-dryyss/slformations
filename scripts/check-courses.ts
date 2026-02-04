
import { prisma } from "../src/lib/prisma";

async function main() {
  const courses = await prisma.course.findMany({
    select: {
      id: true,
      title: true,
      slug: true,
      price: true,
      isPublished: true,
    },
    orderBy: { title: 'asc' }
  });
  console.log(JSON.stringify(courses, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
