
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding VTC Packs...');

  const category = await prisma.courseCategory.findUnique({
    where: { slug: 'vtc' }
  });

  if (!category) {
    console.error('VTC Category not found!');
    return;
  }

  const vtcPacks = [
    {
      title: 'Pack Digital',
      slug: 'vtc-pack-digital',
      price: 999,
      type: 'VTC',
      imageUrl: 'https://images.unsplash.com/photo-1556125574-d7f27ec36a10?q=80&w=2070&auto=format&fit=crop',
      description: 'E-learning Théorique et Pratique. Accès Quiz illimité. Pas de cours en salle.'
    },
    {
      title: 'Pack Essentiel',
      slug: 'vtc-pack-essentiel',
      price: 1199,
      type: 'VTC',
      imageUrl: 'https://images.unsplash.com/photo-1556125574-d7f27ec36a10?q=80&w=2070&auto=format&fit=crop',
      description: '2 Semaines de cours. E-learning inclus. Présentiel avec formateur.'
    },
    {
      title: 'Pack Gold',
      slug: 'vtc-pack-gold',
      price: 1499,
      type: 'VTC',
      imageUrl: 'https://images.unsplash.com/photo-1556125574-d7f27ec36a10?q=80&w=2070&auto=format&fit=crop',
      description: 'Tout inclus Pack Essentiel. Frais d\'examen (206€) offerts. 2h de conduite individuelle.'
    },
    {
      title: 'Pack Excellence',
      slug: 'vtc-pack-excellence',
      price: 1999,
      type: 'VTC',
      imageUrl: 'https://images.unsplash.com/photo-1556125574-d7f27ec36a10?q=80&w=2070&auto=format&fit=crop',
      description: 'Tout inclus Pack Gold. Assurance Réussite. 2ème passage Examen inclus.'
    }
  ];

  for (const pack of vtcPacks) {
    const course = await prisma.course.upsert({
      where: { slug: pack.slug },
      update: {
        price: pack.price,
        title: pack.title,
        description: pack.description,
        isPublished: true
      },
      create: {
        ...pack,
        isPublished: true
      }
    });

    await prisma.courseOnCategory.upsert({
      where: {
        courseId_categoryId: {
          courseId: course.id,
          categoryId: category.id
        }
      },
      update: {},
      create: {
        courseId: course.id,
        categoryId: category.id
      }
    });
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
