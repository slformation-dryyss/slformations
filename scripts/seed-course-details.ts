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
        { title: "Le feu et ses conséquences", dayNumber: 1, duration: 7, description: "Comprendre les mécanismes de la combustion.", lessons: [{ title: "Triangle du feu", content: "Les 3 éléments de la combustion." }, { title: "Classes de feux", content: "A, B, C, D, F." }] },
        { title: "Sécurité incendie", dayNumber: 2, duration: 7, description: "Principes de classement des ERP.", lessons: [{ title: "Évacuation", content: "Mise en sécurité des occupants." }] },
        { title: "Installations techniques", dayNumber: 3, duration: 7, description: "Électricité et systèmes de secours.", lessons: [{ title: "Système de Sécurité Incendie", content: "Détection et alarme." }] }
      ]
    },
    {
      slug: 'ssiap-2',
      objectives: "Encadrer une équipe de sécurité incendie, diriger le poste de sécurité lors de sinistres et gérer les opérations d'entretien.",
      targetAudience: "Titulaires du SSIAP 1 avec 1607h d'expérience. Prérequis : SST/PSC1 valide.",
      prospects: "Chef d'équipe de sécurité incendie.",
      durationText: "70 heures (10 jours)",
      formatText: "Présentiel",
      modules: [
        { title: "Rôles et missions du chef d'équipe", dayNumber: 1, duration: 7, description: "Management et organisation du service.", lessons: [{ title: "Gestion de l'équipe", content: "Encadrement et évaluation." }] },
        { title: "Manipulation des systèmes", dayNumber: 2, duration: 7, description: "Gestion du Poste Central de Sécurité.", lessons: [{ title: "PCS", content: "Conduite à tenir en situation de crise." }] }
      ]
    },
    {
      slug: 'ssiap-3',
      objectives: "Assurer les fonctions de chef de service de sécurité : conseil au chef d'établissement, gestion des budgets et suivi de la réglementation.",
      targetAudience: "Diplômé SSIAP 2 (3 ans d'exp) ou diplôme de niveau 4. Prérequis : SST/PSC1.",
      prospects: "Chef de service de sécurité incendie.",
      durationText: "216 heures (30 jours)",
      formatText: "Présentiel",
      modules: [
        { title: "Réglementation incendie", dayNumber: 1, duration: 7, description: "Maîtrise du cadre législatif complexe.", lessons: [{ title: "Analyses de plans", content: "Outils CLICDVCREM." }] },
        { title: "Gestion et Management", dayNumber: 2, duration: 7, description: "Budget et ressources humaines.", lessons: [{ title: "Budget du service", content: "Maintenance et achats." }] }
      ]
    },
    {
      slug: 'caces-r489-categorie-1a-1b-3-5',
      objectives: "Conduire et manipuler des chariots de manutention en toute sécurité selon la recommandation R489 de la CNAM.",
      targetAudience: "Caristes, préparateurs de commandes, magasiniers.",
      prospects: "Logistique, entreposage, industrie.",
      durationText: "2 à 5 jours selon expérience",
      formatText: "Mixte (Théorie & Pratique)",
      modules: [
        { title: "Théorie Cariste", dayNumber: 1, duration: 7, description: "Règles de sécurité et technologie des engins.", lessons: [{ title: "Stabilité", content: "Notions de physique et centre de gravité." }] },
        { title: "Pratique Conduite", dayNumber: 2, duration: 7, description: "Évolutions et manutention de charges.", lessons: [{ title: "Gerbage", content: "Prise et dépose en hauteur." }] }
      ]
    },
    {
      slug: 'fimo-marchandises',
      objectives: "Obtenir la qualification nécessaire pour conduire des véhicules de plus de 3,5 tonnes de PTAC à titre professionnel.",
      targetAudience: "Conducteurs débutant dans le transport de marchandises. Prérequis : Permis C ou CE.",
      prospects: "Conducteur routier national ou international.",
      durationText: "140 heures (4 semaines)",
      formatText: "Présentiel",
      modules: [
        { title: "Perfectionnement à la conduite", dayNumber: 1, duration: 7, description: "Conduite rationnelle et sécurité routière.", lessons: [{ title: "Éco-conduite", content: "Optimisation de la consommation." }] },
        { title: "Réglementation Sociale", dayNumber: 2, duration: 7, description: "Temps de conduite et de repos.", lessons: [{ title: "Le Chronotachygraphe", content: "Utilisation des cartes conducteur." }] }
      ]
    },
    {
      slug: 'fco-marchandises',
      objectives: "Mettre à jour ses connaissances professionnelles et renouveler sa carte de qualification (obligatoire tous les 5 ans).",
      targetAudience: "Conducteurs routiers en activité. Prérequis : FIMO validée.",
      prospects: "Maintien du titre professionnel.",
      durationText: "35 heures (5 jours)",
      formatText: "Présentiel",
      modules: [
        { title: "Actualisation sécurité", dayNumber: 1, duration: 7, description: "Révision des acquis et nouveautés réglementaires.", lessons: [{ title: "Risques routiers", content: "Actualisation des dangers." }] }
      ]
    },
    {
      slug: 'habitation-electrique-b0-h0-h0v',
      objectives: "Réaliser des opérations non électriques dans des zones présentant des risques électriques en toute sécurité.",
      targetAudience: "Personnel non-électricien : agents d'entretien, peintres, maçons.",
      prospects: "Accès autorisé aux locaux électriques.",
      durationText: "1 jour",
      formatText: "Présentiel",
      modules: [
        { title: "Notions élémentaires", dayNumber: 1, duration: 7, description: "Dangers de l'électricité et mesures de protection.", lessons: [{ title: "Le courant électrique", content: "Effets sur le corps humain." }] }
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
        { title: "Socle de base : Juridique", dayNumber: 1, duration: 7, description: "Cadre légal de la sécurité privée.", lessons: [{ title: "Livre VI du CSI", content: "Réglementation de la profession." }] },
        { title: "Gestion des conflits", dayNumber: 2, duration: 7, description: "Désamorcer les situations tendues.", lessons: [{ title: "Communication verbale", content: "Techniques d'écoute." }] }
      ]
    },
    {
      slug: 'sst-initial',
      objectives: "Devenir le premier maillon de la chaîne des secours en entreprise et participer à la prévention des risques professionnels.",
      targetAudience: "Tout salarié souhaitant être formé aux premiers secours. Aucun prérequis nécessaire.",
      prospects: "Maintien des compétences obligatoire tous les 2 ans (MAC).",
      durationText: "14 heures (2 jours)",
      formatText: "Présentiel",
      modules: [
        { title: "Le cadre juridique et la prévention", dayNumber: 1, duration: 7, description: "Rôle du SST et cadre d'intervention.", lessons: [{ title: "Rôle du SST", content: "Protéger, de l'alerte à l'intervention." }, { title: "Prévention", content: "Repérer les dangers dans l'entreprise." }] },
        { title: "Secourir et Alerter", dayNumber: 2, duration: 7, description: "Gestes de secours adaptés à chaque situation.", lessons: [{ title: "L'alerte", content: "Organiser et transmettre l'alerte." }, { title: "La réanimation", content: "Usage du défibrillateur (DAE)." }] }
      ]
    },
    {
      slug: 'sst-mac',
      objectives: "Maintenir et actualiser les compétences du Sauveteur Secouriste du Travail (renouvellement obligatoire tous les 24 mois).",
      targetAudience: "Titulaires du certificat SST en cours de validité.",
      prospects: "Renouvellement du certificat SST.",
      durationText: "7 heures (1 jour)",
      formatText: "Présentiel",
      modules: [
        { title: "Retour d'expérience et actualisation", dayNumber: 1, duration: 7, description: "Échanges sur les pratiques et mise à jour des techniques.", lessons: [{ title: "Évolution du guide technique", content: "Dernières directives de l'INRS." }, { title: "Mise en situation", content: "Cas concrets de sauvetage." }] }
      ]
    },
    {
      slug: 'evacuation',
      objectives: "Former le personnel aux procédures d'évacuation, au rôle de guide-file et serre-file, et à la gestion du rassemblement.",
      targetAudience: "Tout personnel désigné pour encadrer l'évacuation en cas d'incendie.",
      prospects: "Mise en conformité du registre de sécurité.",
      durationText: "3 h 30 (Demi-journée)",
      formatText: "Présentiel",
      modules: [
        { title: "Théorie de l'évacuation", dayNumber: 1, duration: 2, description: "Comprendre les signaux et les cheminements.", lessons: [{ title: "Signal d'alarme", content: "Reconnaître l'alerte sonore." }, { title: "Rôles", content: "Missions des guide-files et serre-files." }] },
        { title: "Exercice pratique", dayNumber: 1, duration: 1.5, description: "Mise en situation réelle dans l'établissement.", lessons: [{ title: "Reconnaissance", content: "Identifier les sorties de secours." }] }
      ]
    },
    {
      slug: 'extincteurs',
      objectives: "Maîtriser l'utilisation des différents types d'extincteurs et savoir intervenir efficacement on un début d'incendie.",
      targetAudience: "L'ensemble du personnel de l'entreprise (recommandation Code du Travail).",
      prospects: "Sécurité incendie renforcée au travail.",
      durationText: "2 à 3 heures",
      formatText: "Présentiel (Atelier)",
      modules: [
        { title: "Théorie du feu", dayNumber: 1, duration: 1, description: "Le triangle du feu et les agents extincteurs.", lessons: [{ title: "Classes de feux", content: "A, B, C, D et F." }] },
        { title: "Pratique sur bac à feu", dayNumber: 1, duration: 2, description: "Manipulation réelle d'extincteurs Eau/CO2.", lessons: [{ title: "Attaque du feu", content: "Positionnement et distance de sécurité." }] }
      ]
    },
    {
      slug: 'fosst',
      objectives: "Former des référents capables d'organiser les secours et de piloter la santé au travail dans l'entreprise.",
      targetAudience: "Dirigeants, managers, responsables RH ou sécurité.",
      prospects: "Gestionnaire de la santé-sécurité.",
      durationText: "21 heures (3 jours)",
      formatText: "Présentiel",
      modules: [
        { title: "Organisation des secours", dayNumber: 1, duration: 7, description: "Mise en place des protocoles d'urgence.", lessons: [{ title: "Audit interne", content: "Évaluer les besoins en matériels." }] }
      ]
    },
    {
      slug: 'mac-formateur-sst',
      objectives: "Maintenir et actualiser les compétences pédagogiques et techniques des formateurs SST.",
      targetAudience: "Formateurs SST certifiés (renouvellement tous les 3 ans).",
      prospects: "Maintien de l'habilitation formateur SST.",
      durationText: "21 heures (3 jours)",
      formatText: "Présentiel",
      modules: [
        { title: "Ingénierie pédagogique", dayNumber: 1, duration: 7, description: "Conception de modules de formation.", lessons: [{ title: "Évaluation", content: "Critères de certification des stagiaires." }] }
      ]
    },
    {
       slug: 'formation-vtc',
       objectives: "Réussir l'examen pour devenir chauffeur VTC professionnel.",
       targetAudience: "Chauffeurs souhaitant exercer le transport de personnes. Prérequis : Permis B > 3 ans.",
       prospects: "Chauffeur indépendant ou salarié.",
       durationText: "50 heures (7 jours)",
       formatText: "Mixte",
       modules: [
         { title: "Réglementation", dayNumber: 1, duration: 7, description: "Lois encadrant le transport.", lessons: [{ title: "Droit du transport", content: "Loi Grandguillaume." }] },
         { title: "Gestion", dayNumber: 2, duration: 7, description: "Gérer son entreprise.", lessons: [{ title: "Statuts", content: "EURL, SASU, Auto-entrepreneur." }] }
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
