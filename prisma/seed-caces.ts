
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding CACES formations (Detailed R489)...');

  // 1. Ensure Category exists
  const categoryData = { 
    name: 'CACES®', 
    slug: 'caces', 
    description: 'Formations CACES® R489 (Chariots) et R486 (PEMP) certifiées.' 
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

  // 2. CACES R489 Data (Detailed)
  const cacesCourses = [
    {
      title: 'CACES® R489 Catégorie 1A - Transpalettes à conducteur porté',
      slug: 'caces-r489-1a',
      type: 'CACES',
      imageUrl: 'https://img.freepik.com/free-photo/logistics-warehouse-worker-driving-forklift_23-2149367448.jpg',
      description: `Formation CACES® R489 Catégorie 1A : Conduite de transpalettes à conducteur porté et préparateurs de commande (levée < 1.20m).

Objectifs : Maîtriser la conduite en sécurité et obtenir le CACES® R489 Cat. 1A.
Durée : 2 à 3 jours selon expérience.
Validité : 5 ans.`,
      modules: [
        {
          title: "Théorie Commune R489",
          lessons: [
            "Réglementation et responsabilités du cariste",
            "Technologie et classification des chariots",
            "Stabilité et plaque de charge",
            "Risques liés à l'utilisation (renversement, chute)",
            "Vérifications prise et fin de poste"
          ]
        },
        {
          title: "Pratique Catégorie 1A",
          lessons: [
            "Prise de poste et vérifications",
            "Circulation à vide et en charge (marche AV/AR)",
            "Prise et dépose de charges au sol",
            "Mise à quai et chargement camion",
            "Manœuvres de précision"
          ]
        }
      ]
    },
    {
      title: 'CACES® R489 Catégorie 3 - Chariots élévateurs en porte-à-faux (< 6t)',
      slug: 'caces-r489-3',
      type: 'CACES',
      imageUrl: 'https://img.freepik.com/free-photo/forklift-driver-industrial-factory_23-2149367455.jpg',
      description: `Formation CACES® R489 Catégorie 3 : Conduite de chariots élévateurs frontaux (type Fenwick) < 6 tonnes.

Objectifs : Maîtriser la conduite, le gerbage et le dégerbage en sécurité.
Durée : 3 à 5 jours selon expérience.
Validité : 5 ans.`,
      modules: [
        {
          title: "Théorie Commune R489",
          lessons: [
            "Réglementation et instances de prévention",
            "Physique et stabilité (Centre de gravité)",
            "Lecture de la plaque de charge",
            "Pictogrammes et produits dangereux",
            "Règles de circulation en entreprise"
          ]
        },
        {
          title: "Pratique Catégorie 3",
          lessons: [
            "Vérifications journalières",
            "Circulation et arrêt en sécurité",
            "Gerbage et dégerbage en pile (hauteur)",
            "Stockage et déstockage en palettier",
            "Chargement Latéral de véhicule (si applicable)",
            "Manutention de charges longues"
          ]
        }
      ]
    },
    {
      title: 'CACES® R489 Catégorie 5 - Chariots à mât rétractable',
      slug: 'caces-r489-5',
      type: 'CACES',
      imageUrl: 'https://img.freepik.com/free-photo/warehouse-worker-operating-forklift_23-2148922378.jpg',
      description: `Formation CACES® R489 Catégorie 5 : Conduite de chariots à mât rétractable (grande hauteur).

Objectifs : Maîtriser le stockage en grande hauteur et la stabilité latérale.
Durée : 3 à 5 jours.
Validité : 5 ans.`,
      modules: [
         {
          title: "Théorie Spécifique Cat. 5",
          lessons: [
            "Spécificités du mât rétractable",
            "Stabilité latérale et hauteur de levée",
            "Abaque de charge spécifique",
            "Risques liés au travail en hauteur"
          ]
        },
        {
          title: "Pratique Catégorie 5",
          lessons: [
            "Prise de poste et vérifications",
            "Maîtrise de la direction 90°/180°/360°",
            "Gerbage en grande hauteur (> 6m)",
            "Stockage en palettier (entrée/sortie)",
            "Circulation en allée étroite"
          ]
        }
      ]
    }
  ];

  // Helper function to create/update course with modules
  for (const courseData of cacesCourses) {
    // 1. Upsert Course
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

    // 3. Create Modules and Lessons
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
                    content: 'Contenu pratique CACES.',
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
