import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

const COURSES = [
  {
    title: 'Stage de Récupération de Points (4 points)',
    slug: 'stage-recuperation-points',
    description: 'Stage de sensibilisation à la sécurité routière. Récupérez 4 points sur votre permis de conduire en 2 jours consécutifs.',
    price: 250,
    type: 'RECUPERATION_POINTS',
    imageUrl: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop',
    isPublished: true,
  }
];

async function main() {
  console.log('Seeding Recovery Points courses...');

  for (const course of COURSES) {
    await prisma.course.upsert({
      where: { slug: course.slug },
      update: {
        title: course.title,
        description: course.description,
        price: course.price,
        type: course.type,
        imageUrl: course.imageUrl,
        isPublished: course.isPublished,
      },
      create: {
        title: course.title,
        slug: course.slug,
        description: course.description,
        price: course.price,
        type: course.type,
        imageUrl: course.imageUrl,
        isPublished: course.isPublished,
      },
    });
    console.log(` > Upserted course: ${course.title}`);
  }

  console.log('Done.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
