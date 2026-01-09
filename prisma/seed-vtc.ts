
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding VTC formations (Official T3P 2024)...');

  // 1. Ensure Category exists
  const categoryData = { 
    name: 'VTC & Taxi', 
    slug: 'vtc', 
    description: 'Formation VTC et Taxi - Examen T3P (Théorie et Pratique).' 
  };

  const category = await prisma.courseCategory.upsert({
    where: { slug: categoryData.slug },
    update: {},
    create: {
      name: categoryData.name,
      slug: categoryData.slug,
      description: categoryData.description,
    },
  });

  // 2. VTC Course Data
  const vtcCourses = [
    {
      title: 'Formation VTC Complète (Théorie + Pratique)',
      slug: 'formation-vtc-complete',
      type: 'VTC',
      imageUrl: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop',
      description: `Formation complète pour l'examen VTC (T3P).
Préparez l'épreuve d'admissibilité (Théorie) et d'admission (Pratique).

Objectifs : Réussir l'examen de la Chambre des Métiers (CMA).
Durée : 70h (Théorie) + Pratique.`,
      modules: [
        {
          title: "Théorie : Réglementation T3P & Sécurité",
          lessons: [
            "Réglementation du Transport Public Particulier (T3P)",
            "Sécurité Routière et Code de la Route",
            "Prévention des discriminations et violences (Nouveau 2024)"
          ]
        },
        {
          title: "Théorie : Gestion & Développement",
          lessons: [
            "Gestion d'entreprise (Statuts, TVA, Compta)",
            "Développement commercial et Marketing VTC",
            "Réglementation spécifique VTC"
          ]
        },
        {
          title: "Théorie : Langues",
          lessons: [
            "Compréhension et Expression Française",
            "Anglais niveau A2 (Accueil client, tarification)"
          ]
        },
        {
          title: "Pratique : Examen de Conduite",
          lessons: [
            "Préparation du véhicule et du parcours",
            "Relation client et prise en charge",
            "Conduite en sécurité et souplesse",
            "Facturation et Encaissement"
          ]
        }
      ]
    },
    {
       title: 'Stage de Préparation à l\'Examen Pratique VTC',
       slug: 'stage-pratique-vtc',
       type: 'VTC',
       imageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2070&auto=format&fit=crop',
       description: `Module intensif de préparation à l'épreuve de conduite VTC.
Véhicule double commande fourni.

Objectifs : Maîtriser les attendus de l'examen pratique (Gps, Devis, Facture, Accueil).
Durée : 7h ou 14h.`,
       modules: [
         {
           title: "Mise en situation d'examen",
           lessons: [
             "Accueil et vérification du véhicule",
             "Utilisation du GPS et Waze",
             "Conduite commentée"
           ]
         },
         {
           title: "Gestion de la clientèle",
           lessons: [
             "Attitude professionnelle et tenue",
             "Gérer les imprévus",
             "Établir un devis et une facture"
           ]
         }
       ]
    }
  ];

  for (const courseData of vtcCourses) {
    const course = await prisma.course.upsert({
      where: { slug: courseData.slug },
      update: {
        title: courseData.title,
        description: courseData.description,
        type: courseData.type,
        imageUrl: courseData.imageUrl,
        isPublished: true,
      },
      create: {
        title: courseData.title,
        slug: courseData.slug,
        description: courseData.description,
        type: courseData.type,
        imageUrl: courseData.imageUrl,
        isPublished: true,
        price: 0,
      },
    });

    console.log(`Course upserted: ${course.title}`);

    await prisma.courseOnCategory.upsert({
      where: {
        courseId_categoryId: {
          courseId: course.id,
          categoryId: category.id,
        },
      },
      update: {},
      create: {
        courseId: course.id,
        categoryId: category.id,
      },
    });

    const existingModules = await prisma.module.findMany({ where: { courseId: course.id } });
    if (existingModules.length > 0) {
        for(const m of existingModules) {
            await prisma.lesson.deleteMany({ where: { moduleId: m.id }});
        }
        await prisma.module.deleteMany({ where: { courseId: course.id }});
    }

    let position = 0;
    for (const mod of courseData.modules) {
        const createdModule = await prisma.module.create({
            data: {
                title: mod.title,
                courseId: course.id,
                position: position++,
                isPublished: true,
            }
        });

        let lessonPosition = 0;
        for (const lessonTitle of mod.lessons) {
            await prisma.lesson.create({
                data: {
                    title: lessonTitle,
                    moduleId: createdModule.id,
                    position: lessonPosition++,
                    duration: 3600, 
                    isFree: false,
                    isPublished: true,
                    content: 'Contenu pratique VTC.',
                    videoUrl: '', 
                }
            });
        }
    }
    console.log(` > Modules & Lessons updated for: ${course.title}`);
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
