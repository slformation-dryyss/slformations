import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting detailed course seeding...');

  const courseDetails = [
    {
      slug: 'ssiap-1',
      objectives: "Assurer la sécurité des personnes et la sécurité incendie des biens (sensibilisation, intervention face au feu, évacuation, alerte des secours).",
      targetAudience: "Toute personne souhaitant devenir agent de sécurité incendie en ERP ou IGH. Prérequis : SST ou PSC1 valide.",
      prospects: "Agent de sécurité incendie dans des centres commerciaux, hôpitaux, immeubles de grande hauteur.",
      durationText: "77 heures (11 jours)",
      formatText: "Présentiel",
      modules: [
        {
          title: "Le feu et ses conséquences",
          dayNumber: 1,
          duration: 7,
          description: "Comprendre les mécanismes de la combustion et la propagation du feu.",
          lessons: [
            { title: "Le triangle du feu", content: "Les 3 éléments nécessaires à la combustion." },
            { title: "Classes de feux", content: "Classification A, B, C, D, F et agents extincteurs associés." }
          ]
        },
        {
          title: "Sécurité incendie",
          dayNumber: 2,
          duration: 7,
          description: "Principes de classement des ERP et principes fondamentaux de sécurité.",
          lessons: [
            { title: "Cloisonnement", content: "Isolement des risques et barrages au feu." },
            { title: "Évacuation", content: "Principes de mise en sécurité des occupants." }
          ]
        },
        {
          title: "Installations techniques",
          dayNumber: 3,
          duration: 7,
          description: "Découverte des circuits électriques, colonnes sèches et éclairage de sécurité.",
          lessons: [
            { title: "Installations électriques", content: "Risques et sectionnement." },
            { title: "Système de Sécurité Incendie (SSI)", content: "Détection, mise en sécurité et alarme." }
          ]
        }
      ]
    },
    {
      slug: 'tfp-aps-ex-cqp',
      objectives: "Acquérir les compétences pour assurer la sécurité des biens et des personnes et obtenir la carte professionnelle CNAPS.",
      targetAudience: "Toute personne souhaitant travailler dans la sécurité privée. Prérequis : Autorisation préalable du CNAPS.",
      prospects: "Agent de sécurité, agent de surveillance, agent de filtrage.",
      durationText: "175 heures (5 semaines)",
      formatText: "Présentiel",
      modules: [
        {
          title: "Socle de base : Juridique",
          dayNumber: 1,
          duration: 7,
          description: "Cadre légal de la sécurité privée en France.",
          lessons: [
            { title: "Livre VI du CSI", content: "Réglementation de la profession." },
            { title: "Code de Déontologie", content: "Éthique et comportement professionnel." }
          ]
        },
        {
          title: "Gestion des conflits",
          dayNumber: 2,
          duration: 7,
          description: "Désamorcer les situations tendues et gérer l'agressivité.",
          lessons: [
            { title: "Communication verbale", content: "Techniques d'écoute et de dialogue." },
            { title: "Maîtrise de soi", content: "Gérer le stress en situation de crise." }
          ]
        }
      ]
    },
    {
      slug: 'sst-sauveteur-secouriste-du-travail',
      objectives: "Devenir le premier maillon de la chaîne des secours en entreprise et participer à la prévention des risques.",
      targetAudience: "Tout salarié souhaitant être formé aux premiers secours.",
      prospects: "Maintien des compétences obligatoire tous les 2 ans (MAC SST).",
      durationText: "14 heures (2 jours)",
      formatText: "Présentiel",
      modules: [
        {
          title: "Protéger et Alerter",
          dayNumber: 1,
          duration: 7,
          description: "Maîtriser les premières étapes de l'intervention.",
          lessons: [
            { title: "Recherche des dangers", content: "Supprimer ou isoler le danger." },
            { title: "L'alerte", content: "Transmettre les informations aux secours spécialisés." }
          ]
        },
        {
          title: "Secourir",
          dayNumber: 2,
          duration: 7,
          description: "Pratiquer les gestes de secours adaptés à la victime.",
          lessons: [
            { title: "La victime s'étouffe", content: "Claquages dans le dos et compressions." },
            { title: "La victime saigne abondamment", content: "Compression directe et pansement compressif." }
          ]
        }
      ]
    },
    {
       slug: 'formation-vtc',
       objectives: "Réussir l'examen théorique et pratique pour devenir chauffeur VTC professionnel.",
       targetAudience: "Chauffeurs souhaitant exercer le transport de personnes à titre onéreux. Prérequis : Permis B > 3 ans.",
       prospects: "Chauffeur indépendant, auto-entrepreneur ou salarié.",
       durationText: "50 heures (7 jours)",
       formatText: "Mixte (Théorie & Pratique)",
       modules: [
         {
           title: "Réglementation du transport",
           dayNumber: 1,
           duration: 7,
           description: "Connaissance des lois encadrant le transport de personnes.",
           lessons: [
             { title: "Droit du transport", content: "Loi Grandguillaume et code des transports." },
             { title: "Sécurité Routière", content: "Règles spécifiques au VTC." }
           ]
         },
         {
           title: "Gestion et Développement",
           dayNumber: 2,
           duration: 7,
           description: "Apprendre à gérer son entreprise de VTC.",
           lessons: [
             { title: "Statuts juridiques", content: "Choisir entre SASU, EURL, Auto-entrepreneur." },
             { title: "Relation Client", content: "Qualité de service et accueil." }
           ]
         }
       ]
    }
  ];

  for (const detail of courseDetails) {
    const course = await prisma.course.findUnique({
      where: { slug: detail.slug }
    });

    if (course) {
      console.log(`Updating details for: ${course.title} (${detail.slug})`);
      
      // Update basic fields
      await prisma.course.update({
        where: { id: course.id },
        data: {
          objectives: detail.objectives,
          targetAudience: detail.targetAudience,
          prospects: detail.prospects,
          durationText: detail.durationText,
          formatText: detail.formatText,
        }
      });

      // Clear existing modules to avoid duplicates on re-run
      await prisma.module.deleteMany({
        where: { courseId: course.id }
      });

      // Create new modules and lessons
      for (const mod of detail.modules) {
        await prisma.module.create({
          data: {
            title: mod.title,
            dayNumber: mod.dayNumber,
            duration: mod.duration,
            description: mod.description,
            courseId: course.id,
            lessons: {
              create: mod.lessons.map(lesson => ({
                title: lesson.title,
                content: lesson.content,
                isFree: false
              }))
            }
          }
        });
      }
      console.log(`✅ Success for ${detail.slug}`);
    } else {
      console.warn(`⚠️ Course with slug ${detail.slug} not found.`);
    }
  }

  // Update remaining courses with generic high-quality content if they were missed
  const allCourses = await prisma.course.findMany({
    where: {
      objectives: "Maîtriser les compétences fondamentales et se préparer à la certification." // Default value
    }
  });

  for (const c of allCourses) {
    console.log(`Setting realistic defaults for: ${c.title}`);
    let dText = "Variable";
    if (c.type === "CACES") dText = "2 à 5 jours";
    if (c.type === "Incendie") dText = "1 à 3 jours";
    if (c.type === "Secourisme") dText = "2 jours";
    if (c.type === "Transport") dText = "35 à 140 heures";

    await prisma.course.update({
      where: { id: c.id },
      data: {
        durationText: dText,
        // Keep other defaults or set slightly better ones
        targetAudience: `Tout public souhaitant obtenir une qualification dans le domaine : ${c.type}.`,
      }
    });

    // Create a generic module if none exist
    const modCount = await prisma.module.count({ where: { courseId: c.id } });
    if (modCount === 0) {
      await prisma.module.create({
        data: {
          title: "Introduction et Fondamentaux",
          dayNumber: 1,
          duration: 7,
          description: "Introduction théorique et présentation des objectifs de la formation.",
          courseId: c.id,
          lessons: {
            create: [
              { title: "Présentation de la formation", content: "Accueil et tour de table." },
              { title: "Cadre réglementaire", content: "Les lois et normes en vigueur." }
            ]
          }
        }
      });
    }
  }

  console.log('🏁 Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
