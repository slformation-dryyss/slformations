
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Start Seeding Permis Courses ---');

  // 1. Ensure Category exists for Transport
  const categoryData = { 
    name: 'Transport & Permis', 
    slug: 'transport', 
    description: 'Formations qualifiantes pour tous les types de permis de conduire.' 
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

  const courses = [
    // --- PERMIS B (Voiture) ---
    // 1. Boîte Manuelle
    {
      title: 'Permis B - Manuelle - Classique',
      slug: 'permis-b-manuelle-classique',
      type: 'PERMIS',
      imageUrl: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d',
      description: 'L\'essentiel pour débuter en boîte manuelle.',
      price: 1200,
      drivingHours: 20,
      modules: [
        { title: "Code de la Route", lessons: ["Signalisation", "Règles"] },
        { title: "Conduite Manuelle", lessons: ["Passage vitesses", "Mécanique"] }
      ]
    },
    {
      title: 'Permis B - Manuelle - Sérénité',
      slug: 'permis-b-manuelle-serenite',
      type: 'PERMIS',
      imageUrl: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d',
      description: 'Pour prendre le temps d\'apprendre en boîte manuelle.',
      price: 1700,
      drivingHours: 30,
      modules: [
        { title: "Code de la Route", lessons: ["Signalisation", "Règles"] },
        { title: "Conduite Intensive", lessons: ["30h de conduite", "Préparation examen"] }
      ]
    },

    // 2. Boîte Automatique
    {
      title: 'Permis B - Automatique - Classique',
      slug: 'permis-b-auto-classique',
      type: 'PERMIS',
      imageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2',
      description: 'Rapide et efficace (Minimum légal 13h).',
      price: 980,
      drivingHours: 13,
      modules: [
        { title: "Code de la Route", lessons: ["Signalisation"] },
        { title: "Conduite Auto", lessons: ["13h de conduite"] }
      ]
    },
    {
      title: 'Permis B - Automatique - Confort',
      slug: 'permis-b-auto-confort',
      type: 'PERMIS',
      imageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2',
      description: 'La maîtrise totale en automatique.',
      price: 1400,
      drivingHours: 20,
      modules: [
        { title: "Code de la Route", lessons: ["Signalisation"] },
        { title: "Conduite Auto", lessons: ["20h de conduite", "Perfectionnement"] }
      ]
    },

    // 3. Conduite Accompagnée (AAC)
    {
        title: 'Permis B - AAC - Manuelle',
        slug: 'permis-b-aac-manuelle',
        type: 'PERMIS',
        imageUrl: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98',
        description: 'Conduite accompagnée en boîte manuelle (dès 15 ans).',
        price: 1400,
        drivingHours: 20,
        modules: [
          { title: "Formation Initiale", lessons: ["20h de conduite"] },
          { title: "Phase Accompagnée", lessons: ["RDV Pédagogiques"] }
        ]
    },
    {
        title: 'Permis B - AAC - Automatique',
        slug: 'permis-b-aac-auto',
        type: 'PERMIS',
        imageUrl: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98',
        description: 'Conduite accompagnée en boîte automatique (dès 15 ans).',
        price: 1200,
        drivingHours: 13,
        modules: [
          { title: "Formation Initiale", lessons: ["13h de conduite"] },
          { title: "Phase Accompagnée", lessons: ["RDV Pédagogiques"] }
        ]
    },

     // --- PERMIS A (Moto) ---
     {
        title: 'Permis A1 (125cc) - Dès 16 ans',
        slug: 'permis-a1',
        type: 'PERMIS',
        imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=1000&auto=format&fit=crop',
        description: `Pour conduire des motos légères (max 125cm3 / 11kW).
        
Contenu : Code moto (ETM), Plateau, Circulation.`,
        modules: [
          { title: "Plateau", lessons: ["Maniabilité à allure lente", "Freinage d'urgence", "Évitement"] },
          { title: "Circulation", lessons: ["Positionnement", "Trajectoire de sécurité", "Conduite en agglomération"] }
        ]
    },
    {
        title: 'Permis A2 - Moto (Max 35kW)',
        slug: 'permis-a2',
        type: 'PERMIS',
        imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=1000&auto=format&fit=crop',
        description: `Le permis moto standard pour les motards de tous âges (machines bridées à 47.5ch).
        
Formation complète pour maîtriser un deux-roues en toute circonstance.
Passerelle vers le permis A (Full) possible après 2 ans.`,
        modules: [
            { title: "Théorie Moto", lessons: ["Code Moto (ETM)", "Équipement du motard", "Mécanique simple"] },
            { title: "Pratique Plateau", lessons: ["Parcours lent", "Parcours rapide", "Freinage", "Passager"] },
            { title: "Pratique Circulation", lessons: ["Radio-guidage", "Conduite autonome", "Situation d'urgence"] }
        ]
    },

    
  ];

  for (const courseData of courses) {
    // 1. Upsert Course
    const course = await prisma.course.upsert({
      where: { slug: courseData.slug },
      update: {
        title: courseData.title,
        description: courseData.description,
        type: courseData.type,
        imageUrl: courseData.imageUrl,
        isPublished: true,
        price: (courseData as any).price || 0,
        drivingHours: (courseData as any).drivingHours || 0,
      },
      create: {
        title: courseData.title,
        slug: courseData.slug,
        description: courseData.description,
        type: courseData.type,
        imageUrl: courseData.imageUrl,
        isPublished: true,
        price: (courseData as any).price || 0,
        drivingHours: (courseData as any).drivingHours || 0,
      },
    });

    console.log(`Course upserted: ${course.title}`);

    // 2. Link to Category
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

    // 3. Create Modules
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
                    content: 'Contenu pédagogique Permis.',
                }
            });
        }
    }
  }

  console.log('--- Permis Seeding Complete ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
