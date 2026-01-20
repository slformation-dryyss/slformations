import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔥 Seeding Secourisme formations with detailed content...');

  // 1. Ensure Category exists
  const category = await prisma.courseCategory.upsert({
    where: { slug: 'secourisme' },
    update: {},
    create: {
      name: 'Secourisme',
      slug: 'secourisme',
      description: 'Formations Secourisme et Premiers Secours (SST, DAE, etc.)' 
    },
  });
  console.log(`✅ Category: ${category.name}`);

  // 2. SST Initial Data
  const sstInitial = {
    title: 'Sauveteur Secouriste du Travail (SST) - Initial',
    slug: 'sst-initial',
    type: 'SECOURISME',
    imageUrl: 'https://ls-formation.fr/wp-content/uploads/2025/05/SST_Mise-en-avant.jpg',
    description: `La formation SST permet de devenir un acteur majeur de la prévention et des secours dans l'entreprise.
    
Objectifs pédagogiques :
- Intervenir efficacement face à une situation d'accident du travail.
- Mettre en application ses compétences au profit de la santé et sécurité au travail (prévention).`,
    price: 250,
    modules: [
      {
        title: "Domaine de compétences 1 : Intervenir face à une situation d'accident",
        description: "Être capable d'intervenir face à une situation d'accident du travail.",
        lessons: [
            { title: "Situer le cadre juridique", content: "Le cadre juridique de l'intervention du SST (Code du travail, Code pénal).\nResponsabilité civile et pénale." },
            { title: "Protéger", content: "Rechercher les risques persistants pour protéger : phase d'analyse et d'action (supprimer le danger, isoler la zone)." },
            { title: "Examiner la victime", content: "Rechercher les signes de détresse vitale : saignement abondant, étouffement, conscience, respiration." },
            { title: "Faire alerter ou alerter", content: "Transmettre les informations aux secours appropriés (15, 18, 112) : qui appeler, quel message transmettre." },
            { title: "Secourir : Saignements", content: "Arrêter un saignement abondant (compression manuelle, pansement compressif, garrot)." },
            { title: "Secourir : Étouffement", content: "Désobstruction des voies aériennes (tapes dans le dos, méthode de Heimlich)." },
            { title: "Secourir : Malaises", content: "Mise au repos et observation des signes, questionnement." },
            { title: "Secourir : Brûlures", content: "Arrosage, refroidissement et protection des brûlures thermiques et chimiques." },
            { title: "Secourir : Traumatismes", content: "Conduite à tenir face à des douleurs, plaies ou fractures (ne pas mobiliser, protéger)." },
            { title: "Secourir : Inconscience (PLS)", content: "Libération des voies aériennes et mise en Position Latérale de Sécurité (PLS)." },
            { title: "Secourir : Arrêt cardiaque", content: "Réanimation Cardio-Pulmonaire (RCP) et utilisation du Défibrillateur Automatisé Externe (DAE)." }
        ]
      },
      {
        title: "Domaine de compétences 2 : Contribuer à la prévention",
        description: "Être capable de mettre en application ses compétences de SST au service de la prévention.",
        lessons: [
            { title: "Rôle de prévention du SST", content: "Situer son rôle dans l'organisation de la prévention de l'entreprise.\nActeurs internes et externes." },
            { title: "Repérer les dangers", content: "Identifier les dangers et les situations dangereuses dans son environnement de travail." },
            { title: "Supprimer ou réduire les risques", content: "Proposer des pistes d'amélioration et des mesures de prévention." },
            { title: "Informer", content: "Remonter les informations à la hiérarchie et aux personnes concernées." }
        ]
      }
    ]
  };

  // 3. MAC SST Data
  const macSst = {
    title: 'Recyclage Sauveteur Secouriste du Travail (MAC SST)',
    slug: 'mac-sst-recyclage',
    type: 'SECOURISME',
    imageUrl: 'https://ls-formation.fr/wp-content/uploads/2025/05/SST_Mise-en-avant.jpg',
    description: `Le Maintien et Actualisation des Compétences (MAC) est obligatoire tous les 24 mois pour conserver sa certification SST.`,
    price: 150,
    modules: [
        {
            title: "Retour d'expérience et actualisation",
            description: "Partage d'expériences et mise à jour des connaissances.",
            lessons: [
                { title: "Retours d'expérience", content: "Échanges sur les actions de prévention ou de secours réalisées par les stagiaires depuis la dernière formation." },
                { title: "Actualisation réglementaire", content: "Nouveautés dans le guide des données techniques et conduites à tenir (INRS)." }
            ]
        },
        {
            title: "Révision des gestes de secours",
            description: "Révision pratique de l'ensemble des gestes techniques.",
            lessons: [
                { title: "Protéger et Alerter", content: "Révision des scénarios de protection et du message d'alerte." },
                { title: "Secourir : Urgences vitales", content: "Pratique de la RCP et utilisation du défibrillateur (DAE).\nArrêt des hémorragies." },
                { title: "Secourir : Autres atteintes", content: "Révision des gestes face aux malaises, plaies, brûlures et traumatismes." }
            ]
        },
        {
            title: "Application à la prévention",
            description: "Mise en situation de prévention.",
            lessons: [
                { title: "Repérage des risques", content: "Exercice de repérage de situations dangereuses." },
                { title: "Propositions d'amélioration", content: "Formulation de mesures de prévention adaptées." }
            ]
        },
        {
            title: "Épreuves certificatives",
            description: "Validation des compétences pour le nouveau certificat.",
            lessons: [
                { title: "Épreuve 1 : Intervention", content: "Mise en situation d'accident du travail simulé." },
                { title: "Épreuve 2 : Prévention", content: "Questionnement ou mise en situation sur la prévention." }
            ]
        }
    ]
  };

  const coursesData = [sstInitial, macSst];

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
        price: courseData.price,
      },
      create: {
        title: courseData.title,
        slug: courseData.slug,
        description: courseData.description,
        type: courseData.type,
        imageUrl: courseData.imageUrl,
        isPublished: true,
        price: courseData.price,
      },
    });

    console.log(`Updated course: ${course.title}`);

    // 2. Link to Category
    await prisma.courseOnCategory.upsert({
      where: { courseId_categoryId: { courseId: course.id, categoryId: category.id } },
      update: {},
      create: { courseId: course.id, categoryId: category.id },
    });

    // 3. Update Modules & Lessons
    // Clear existing content to avoid duplicates and complex updates
    const existingModules = await prisma.module.findMany({ where: { courseId: course.id } });
    for(const m of existingModules) {
        await prisma.lesson.deleteMany({ where: { moduleId: m.id }});
    }
    await prisma.module.deleteMany({ where: { courseId: course.id }});

    // Create new content
    let position = 0;
    for (const mod of courseData.modules) {
        const createdModule = await prisma.module.create({
            data: {
                title: mod.title,
                description: mod.description,
                courseId: course.id,
                position: position++,
                isPublished: true,
            }
        });

        let lessonPosition = 0;
        for (const lesson of mod.lessons) {
            await prisma.lesson.create({
                data: {
                    title: lesson.title,
                    moduleId: createdModule.id,
                    position: lessonPosition++,
                    duration: 3600, 
                    isFree: false,
                    isPublished: true,
                    content: lesson.content,
                    videoUrl: '', 
                }
            });
        }
    }
  }

  console.log('🎉 Secourisme courses updated successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
