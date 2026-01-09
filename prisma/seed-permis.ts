
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
    {
      title: 'Permis B - Classique',
      slug: 'permis-b-classique',
      type: 'PERMIS',
      imageUrl: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=1000&auto=format&fit=crop',
      description: `La formation indispensable pour conduire une voiture. Apprentissage du code et de la conduite.
      
Objectifs : Maîtriser le véhicule, respecter le code de la route, conduire en sécurité.
Durée : Minimum 20h de conduite.
Examen : Code + Conduite.`,
      modules: [
        { title: "Code de la Route", lessons: ["Signalisation", "Priorités", "Règles de circulation"] },
        { title: "Maîtrise du Véhicule", lessons: ["Installation", "Démarrage & Arrêt", "Passage des vitesses"] },
        { title: "Circulation", lessons: ["Insertion", "Dépassement", "Ronds-points", "Conduite écologique"] }
      ]
    },
    {
        title: 'Permis B - Accéléré',
        slug: 'permis-b-accelere',
        type: 'PERMIS',
        imageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1000&auto=format&fit=crop',
        description: `Obtenez votre permis en un temps record (2 à 4 semaines). Stage intensif code et conduite.
        
Objectifs : Même programme que le permis B mais condensé pour une réussite rapide.
Idéal pour : Les personnes pressées ou disponibles à temps plein.`,
        modules: [
          { title: "Stage Code Intensif", lessons: ["Cours théoriques quotidiens", "Tests blancs en série"] },
          { title: "Conduite Intensive", lessons: ["2 à 4h de conduite par jour", "Préparation examen"] }
        ]
    },
      {
        title: 'Permis B - Conduite Accompagnée (AAC)',
        slug: 'permis-b-aac',
        type: 'PERMIS',
        imageUrl: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?q=80&w=1000&auto=format&fit=crop',
        description: `Dès 15 ans, apprenez à conduire avec vos proches pour plus d'expérience.
        
Avantages : Meilleur taux de réussite, période probatoire réduite (2 ans au lieu de 3), coût d'assurance réduit.`,
        modules: [
          { title: "Formation Initiale", lessons: ["Code de la route", "20h de conduite avec moniteur"] },
          { title: "Phase Accompagnée", lessons: ["RDV Pédagogique 1", "3000km avec accompagnateur", "RDV Pédagogique 2"] }
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

     // --- PERMIS Poids Lourds ---
     {
        title: 'Permis C - Poids Lourd (Porteur)',
        slug: 'permis-c',
        type: 'FIMO', // Categorized as Transport/FIMO type typically
        imageUrl: 'https://images.unsplash.com/photo-1519339113688-640c98585698?q=80&w=1000&auto=format&fit=crop',
        description: `Pour conduire des véhicules de transport de marchandises de plus de 3,5 tonnes (camion porteur).
        
Prérequis : Avoir le permis B et 21 ans (ou titre pro).
Inclus : Code, Plateau, Circulation.`,
        modules: [
            { title: "Théorie Professionnelle", lessons: ["Réglementation transport", "Mécanique Poids Lourd", "Sécurité"] },
            { title: "Maniabilité", lessons: ["Vérifications courantes", "Attelage/Dételage (si CE)", "Manœuvres"] },
            { title: "Circulation", lessons: ["Gabarit", "Anticipation", "Conduite économique"] }
        ]
    },
    {
        title: 'Permis CE - Super Lourd',
        slug: 'permis-ce',
        type: 'FIMO',
        imageUrl: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=1000&auto=format&fit=crop',
        description: `Pour conduire des ensembles de véhicules (Poids Lourd + Remorque > 750kg).
        
Le permis des routiers longue distance. Maîtrisez les ensembles articulés.`,
        modules: [
            { title: "Maniabilité Complexe", lessons: ["Marche arrière articulée", "Mise à quai", "Attelage de précision"] },
            { title: "Route", lessons: ["Gestion du gabarit long", "Forces physiques", "Montagne & Descente"] }
        ]
    },

    // --- PERMIS D (Transport en commun) ---
    {
        title: 'Permis D - Transport de Voyageurs',
        slug: 'permis-d',
        type: 'TRANSPORT',
        imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1000&auto=format&fit=crop',
        description: `Pour conduire des bus et autocars (plus de 8 passagers).
        
Responsabilité, confort des passagers et sécurité sont au cœur de cette formation.`,
        modules: [
            { title: "Sécurité & Confort", lessons: ["Accueil des passagers", "Conduite souple", "Réglementation sociale"] },
            { title: "Conduite", lessons: ["Gabarit bus", "Arrêts fréquents", "Gestion des conflits"] }
        ]
    },
     // --- PERMIS BE (Remorque) ---
     {
        title: 'Permis BE - Remorque',
        slug: 'permis-be',
        type: 'PERMIS',
        imageUrl: 'https://images.unsplash.com/photo-1626127117180-2a5cb82bc5fc?q=80&w=1000&auto=format&fit=crop',
        description: `Nécessaire pour tracter une remorque de plus de 750kg si le total (Voiture + Remorque) dépasse 4250kg.
        
Idéal pour caravanes, vans à chevaux, porte-voitures.`,
        modules: [
            { title: "Plateau", lessons: ["Vérifications", "Attelage", "Marche arrière sinueuse"] },
            { title: "Circulation", lessons: ["Adaptation de l'allure", "Dépassement avec remorque"] }
        ]
    }
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
      },
      create: {
        title: courseData.title,
        slug: courseData.slug,
        description: courseData.description,
        type: courseData.type,
        imageUrl: courseData.imageUrl,
        isPublished: true,
        price: 1200, // Prix indicatif moyen
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
