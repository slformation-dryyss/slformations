
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding Secourisme formations (Detailed)...');

  // 1. Ensure Category exists
  const categoryData = { 
    name: 'Secourisme', 
    slug: 'secourisme', 
    description: 'Formations Secourisme et Premiers Secours (SST, DAE, etc.)' 
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

  // 2. SST Initial Data
  const sstInitial = {
    title: 'Sauveteur Secouriste du Travail (SST) - Initial',
    slug: 'sst-initial',
    type: 'SECOURISME',
    imageUrl: 'https://img.freepik.com/free-photo/training-first-aid-cpr-dummy_23-2149367440.jpg',
    description: `Devenez acteur en Sauvetage Secourisme du Travail (SST).

Objectifs :
- Intervenir efficacement face à une situation d’accident du travail en tant que secouriste.
- Contribuer à la prévention des risques professionnels dans l’entreprise.

Public concerné :
- Toute personne, membre du personnel, devant exercer la fonction de Sauveteur Secouriste du Travail (SST) dans son établissement.

Durée : 2 jours (14 heures).
Certification : Certificat SST (valable 24 mois), équivalence PSC1.

Le + SL Formations :
Remise aux apprenants d’un fascicule illustré rappelant les bons gestes + Matériel diversifié de démonstration (mannequins, défibrillateur) + Quiz prévention.`,
    modules: [
      {
        title: "Dispositif SST et Cadre Juridique",
        lessons: [
            "Le cadre juridique du secourisme",
            "Le rôle du SST dans l'organisation des secours"
        ]
      },
      {
        title: "Prévention des Risques Professionnels",
        lessons: [
            "Situer son rôle de SST dans la prévention",
            "Caractériser des risques professionnels",
            "Participer à la maîtrise des risques"
        ]
      },
      {
        title: "Intervention face à un accident",
        lessons: [
            "Identifier le mécanisme de l'accident",
            "Protéger et examiner la victime",
            "Alerter ou faire alerter",
            "Secourir : Saignements abondants",
            "Secourir : Étouffement",
            "Secourir : Malaises",
            "Secourir : Brûlures",
            "Secourir : Douleurs et plaies",
            "Secourir : Victime inconsciente qui respire (PLS)",
            "Secourir : Arrêt cardiaque (RCP + Défibrillateur)"
        ]
      }
    ]
  };

  // 3. MAC SST Data
  const macSst = {
    title: 'Recyclage Sauveteur Secouriste du Travail (MAC SST)',
    slug: 'mac-sst-recyclage',
    type: 'SECOURISME',
    imageUrl: 'https://img.freepik.com/free-photo/group-people-learning-first-aid-together_23-2149367425.jpg',
    description: `Maintenir et actualiser les compétences acteur en Sauvetage Secourisme du Travail (SST).

Objectifs :
- Continuer à intervenir efficacement face à une situation d’accident du travail.
- Mettre en application ses compétences de SST au service de la prévention.

Public concerné :
- Membre du personnel titulaire du certificat SST souhaitant maintenir ses compétences.

Durée : 1 jour (7 heures).
Pré-requis : Être titulaire d’un certificat SST.
Certification : Nouveau certificat SST (valable 24 mois).`,
    modules: [
      {
        title: "Retour d'expérience et Rappels",
        lessons: [
            "Retour sur les actions menées en prévention/secours",
            "Rappels sur le cadre juridique et le rôle du SST"
        ]
      },
      {
        title: "Actualisation des Compétences",
        lessons: [
            "Révision : Protection et Examen",
            "Révision : Alerte",
            "Révision : Saignements et Étouffements",
            "Révision : Malaises et Brûlures",
            "Révision : PLS et Arrêt Cardiaque (RCP + DAE)"
        ]
      },
      {
        title: "Épreuves Certificatives",
        lessons: [
            "Mise en situation d'accident simulé",
            "Questionnement sur la prévention"
        ]
      }
    ]
  };

  const coursesData = [sstInitial, macSst];

  // Helper function to create/update course with modules
  for (const courseData of coursesData) {
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

    // 3. Create Modules and Lessons (Delete existing first to avoid duplication/complexity on updates for this seed)
    // Note: In a prod env with user progress, we wouldn't delete. But this is a seed script for a fresh catalog.
    
    // Check if we can find existing modules to delete them (simple reset approach)
    const existingModules = await prisma.module.findMany({ where: { courseId: course.id } });
    if (existingModules.length > 0) {
        // Delete lessons first
        for(const m of existingModules) {
            await prisma.lesson.deleteMany({ where: { moduleId: m.id }});
        }
        // Delete modules
        await prisma.module.deleteMany({ where: { courseId: course.id }});
    }

    // Create new modules structure
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
                    duration: 3600, // Placeholder duration 1h
                    isFree: false,
                    isPublished: true,
                    content: 'Contenu pratique en présentiel.',
                    videoUrl: '', 
                }
            });
        }
    }
    console.log(` > Modules & Lessons updated for: ${course.title}`);
  }

  // Also ensuring the other Secourisme courses (DAE, etc.) are kept or updated if needed. 
  // For now, focusing on SST/MAC as requested.

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
