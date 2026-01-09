
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding Habilitation Electrique formations (Detailed NFC 18-510)...');

  // 1. Ensure Category exists
  const categoryData = { 
    name: 'Habilitation Électrique', 
    slug: 'habilitation-electrique', 
    description: 'Formations Habilitation Électrique NFC 18-510 (H0B0, BS, BE, etc.)' 
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
  console.log(`Category upserted: ${category.name}`);

  // 2. Habilitation Data (Detailed)
  const elecCourses = [
    {
      title: 'Habilitation Électrique H0/B0 - Exécutant non électricien',
      slug: 'habilitation-h0-b0',
      type: 'HABILITATION',
      imageUrl: 'https://img.freepik.com/free-photo/electrician-engineer-works-with-electric-cable-wires-installation-inspect-service-maintenance_293060-2646.jpg',
      description: `Formation Habilitation Électrique H0B0 pour personnel non électricien.

Public : Peintres, maçons, agents de ménage, etc., devant accéder à des zones réservées aux électriciens ou travailler à proximité.
Objectifs : Identifier les risques et se protéger.
Durée : 1 jour (7h).
Prérequis : Aucun.`,
      modules: [
        {
          title: "Notions Élémentaires d'Électricité",
          lessons: [
            "Tension, intensité, résistance",
            "Effets du courant sur le corps humain",
            "Les domaines de tension (BT/HT)"
          ]
        },
        {
          title: "Dangers et Prévention (NFC 18-510)",
          lessons: [
            "Zones d'environnement et limites",
            "Habilitation : définitions et symboles (H0, B0)",
            "Moyens de protection (EPC / EPI)",
            "Conduite à tenir en cas d'accident"
          ]
        },
        {
          title: "Savoir-faire (Pratique)",
          lessons: [
            "Repérage des environnements et distances",
            "Application des consignes de sécurité",
            "Analyse des risques sur site"
          ]
        }
      ]
    },
    {
      title: 'Habilitation Électrique BS / BE Manœuvre',
      slug: 'habilitation-bs-be-manoeuvre',
      type: 'HABILITATION',
      imageUrl: 'https://img.freepik.com/free-photo/electrician-working-switchboard_1303-22872.jpg',
      description: `Formation Habilitation BS (Intervention élémentaire) et BE Manœuvre.

Public : Gardiens, agents techniques, chauffeurs, devant réaliser des interventions simples (remplacement ampoule, fusible, réarmement) ou des manœuvres.
Durée : 2 jours (14h).
Objectifs : Réaliser des interventions BT élémentaires en sécurité.`,
      modules: [
        {
          title: "Module Tronc Commun 2",
          lessons: [
            "Les grandeurs électriques et dangers",
            "Limites de l'habilitation BS / BE Manœuvre",
            "Les équipements de protection individuelle (EPI)",
            "Procédures d'intervention élémentaire (BS)"
          ]
        },
        {
          title: "Module Technique BS",
          lessons: [
            "Mise en sécurité d'un circuit",
            "Remplacement de fusibles, lampes, accessoires",
            "Raccordement sur bornes",
            "Mesures sur installations"
          ]
        },
        {
          title: "Module Technique BE Manœuvre",
          lessons: [
            "Manœuvres d'exploitation",
            "Réarmement de protections",
            "Mise hors tension / sous tension"
          ]
        },
        {
          title: "Pratique sur installations",
          lessons: [
            "Mises en situation réelles",
            "Remplacement d'un appareillage (PC, Inter)",
            "Manœuvre de disjoncteur"
          ]
        }
      ]
    }
  ];

  // Helper function
  for (const courseData of elecCourses) {
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
                    content: 'Contenu pratique Habilitation.',
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
