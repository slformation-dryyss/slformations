import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const courses = await prisma.course.findMany({
    select: {
      id: true,
      title: true,
      slug: true,
      price: true,
      _count: {
        select: { modules: true, enrollments: true }
      }
    },
    orderBy: { title: 'asc' }
  });

  console.log('--- Current Courses in DB ---');
  courses.forEach(c => {
    console.log(`[${c.id}] ${c.title} (Slug: ${c.slug}) - ${c.price}€ - ${c._count.modules} modules, ${c._count.enrollments} enrollments`);
  });
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
