
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding Incendie (SSIAP + EPI) formations...');

  // 1. Category
  const categoryData = { 
    name: 'Sécurité Incendie', 
    slug: 'incendie', 
    description: 'Formations Sécurité Incendie (SSIAP, Équipier, Extincteurs)' 
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

  // 2. Courses
  const coursesData = [
    {
      title: 'SSIAP 1 - Agent de Service de Sécurité Incendie',
      slug: 'ssiap-1',
      type: 'INCENDIE',
      imageUrl: 'https://img.freepik.com/free-photo/firefighter-uniform-holding-helmet_23-2149367468.jpg',
      description: `Formation d'Agent de Service de Sécurité Incendie et d'Assistance à Personnes (SSIAP 1).
Diplômante et reconnue. 10 jours (70h).`,
      modules: [
        {
          title: "Partie 1 : Le feu et ses conséquences",
          lessons: ["Le feu (éclosion, propagation)", "Comportement au feu", "Exercices en local enfumé"]
        },
        {
          title: "Partie 2 : Sécurité Incendie",
          lessons: ["Classement ERP/IGH", "Principes fondamentaux", "Desserte et Évacuation", "Moyens de secours"]
        },
        {
          title: "Partie 3 : Installations Techniques",
          lessons: ["Installations électriques", "Ascenseurs", "Extinction automatique", "SSI"]
        },
        {
          title: "Partie 4 : Rôles et Missions",
          lessons: ["Service de sécurité", "Rondes et surveillance", "Appel des secours", "Mise en œuvre des moyens"]
        },
        {
          title: "Partie 5 : Concrétisation des acquis",
          lessons: ["Visites applicatives", "Mise en situation feu/évacuation", "Levée de doute"]
        }
      ]
    },
    {
      title: 'Guide-File et Serre-File (Évacuation)',
      slug: 'guide-file-serre-file',
      type: 'INCENDIE',
      imageUrl: 'https://img.freepik.com/free-photo/emergency-evacuation-sign_23-2148922375.jpg',
      description: `Formation pour Guide-File et Serre-File.
Objectifs : Assurer l'évacuation rapide et sûre du personnel lors d'une alarme incendie.
Durée : 0.5 jour (4h).`,
      modules: [
        {
          title: "Théorie de l'Évacuation",
          lessons: ["Le processus d'évacuation", "Rôle du Guide-File", "Rôle du Serre-File", "Point de rassemblement"]
        },
        {
          title: "Pratique",
          lessons: ["Reconnaissance des itinéraires", "Exercice d'évacuation simulé", "Debriefing"]
        }
      ]
    },
    {
      title: 'Équipier de Première Intervention (EPI)',
      slug: 'equipier-premiere-intervention-epi',
      type: 'INCENDIE',
      imageUrl: 'https://img.freepik.com/free-photo/fire-extinguisher-wall_23-2149367460.jpg',
      description: `Formation Équipier de Première Intervention (EPI).
Conforme Code du Travail (R4227-28).

Objectifs :
- Alerter les secours.
- Intervenir efficacement sur un début d'incendie avec les moyens disponibles.
- Faciliter l'intervention des secours.

Durée : 1 jour (7h) ou 0.5 jour selon module.`,
      modules: [
        {
          title: "La Théorie du Feu",
          lessons: [
            "Le triangle du feu et la combustion",
            "Classes de feux (A, B, C, D, F)",
            "Les procédés d'extinction",
            "Les dangers des fumées"
          ]
        },
        {
          title: "Les Moyens d'Extinction",
          lessons: [
            "Les différents extincteurs (Eau, Poudre, CO2)",
            "Le Robinet d'Incendie Armé (RIA)",
            "Mode d'emploi et distances d'attaque"
          ]
        },
        {
          title: "Pratique sur Feux",
          lessons: [
            "Exercices d'extinction sur bac à feu (réel ou écologique)",
            "Utilisation d'extincteurs sur feu simulé",
            "Mise en œuvre d'un RIA (si disponible)"
          ]
        }
      ]
    }
  ];

  for (const courseData of coursesData) {
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
                    content: 'Contenu pratique Incendie.',
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
