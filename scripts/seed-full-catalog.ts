import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Synchronizing full catalog (cleaning duplicates)...');

  const categoriesData = [
    {
      name: 'FORMATION CACES',
      slug: 'caces',
      courses: [
        { title: 'CACES® R489 (Chariots élévateurs)', slug: 'caces-r489', type: 'CACES', description: 'Conduite de chariots de manutention à conducteur porté.', price: 0 },
        { title: 'CACES® R486 (PEMP)', slug: 'caces-r486', type: 'CACES', description: 'Plateformes élévatrices mobiles de personnes.', price: 0 },
        { title: 'CACES® R482 (Engins de chantier)', slug: 'caces-r482', type: 'CACES', description: 'Conduite d\'engins de chantier.', price: 0 },
      ]
    },
    {
      name: 'FORMATION TRANSPORT',
      slug: 'transport',
      courses: [
        { title: 'FIMO Marchandises', slug: 'fimo-marchandises', type: 'TRANSPORT', description: 'Formation Initiale Minimale Obligatoire.', price: 0 },
        { title: 'FCO Marchandises', slug: 'fco-marchandises', type: 'TRANSPORT', description: 'Formation Continue Obligatoire.', price: 0 },
      ]
    },
    {
      name: 'FORMATION VTC',
      slug: 'vtc',
      courses: [
        { title: 'Formation VTC', slug: 'vtc-initiale', type: 'VTC', description: 'Préparation complète à l\'examen VTC.', price: 0 },
        { title: 'Pack VTC Digital', slug: 'vtc-pack-digital', type: 'VTC', description: 'Formation VTC 100% en ligne.', price: 999 },
        { title: 'Pack VTC Essentiel', slug: 'vtc-pack-essentiel', type: 'VTC', description: 'Formation théorique en présentiel.', price: 1199 },
        { title: 'Pack VTC Gold', slug: 'vtc-pack-gold', type: 'VTC', description: 'Formation théorique + 2h de conduite.', price: 1499, drivingHours: 2 },
        { title: 'Pack VTC Excellence', slug: 'vtc-pack-excellence', type: 'VTC', description: 'Formation Premium avec accompagnement complet.', price: 1999, drivingHours: 2 },
        { title: 'Formation Continue VTC', slug: 'vtc-continue', type: 'VTC', description: 'Stage obligatoire tous les 5 ans.', price: 0 },
        { title: 'Formation Passerelle Taxi vers VTC', slug: 'vtc-passerelle', type: 'VTC', description: 'Accès VTC pour les Taxis.', price: 0 },
        { title: 'Formation Chauffeur VTC en ligne', slug: 'vtc-online', type: 'VTC', description: 'E-learning VTC.', price: 0 },
      ]
    },
    {
      name: 'FORMATION TAXI',
      slug: 'taxi',
      courses: [
        { title: 'Formation Taxi Initiale', slug: 'taxi-initiale', type: 'TAXI', description: 'Préparation au certificat pro Taxi.', price: 0 },
        { title: 'Formation Continue Taxi', slug: 'taxi-continue', type: 'TAXI', description: 'Stage obligatoire tous les 5 ans.', price: 0 },
        { title: 'Formation Mobilité Taxi', slug: 'taxi-mobilite', type: 'TAXI', description: 'Changement de département.', price: 0 },
        { title: 'Formation Mobilité Taxi Parisienne et Banlieue', slug: 'taxi-mobilite-paris', type: 'TAXI', description: 'Spécificité zone Taxi Parisien.', price: 0 },
        { title: 'Formation Passerelle Taxi Banlieue vers Taxi Parisien', slug: 'taxi-passerelle-paris', type: 'TAXI', description: 'Extension CPTP.', price: 0 },
        { title: 'Formation Passerelle Taxi', slug: 'taxi-passerelle', type: 'TAXI', description: 'Accès Taxi pour les VTC.', price: 0 },
      ]
    },
    {
      name: 'LA SÉCURITÉ INCENDIE',
      slug: 'incendie',
      courses: [
        { title: 'SSIAP 1 - Agent de Service de Sécurité Incendie', slug: 'ssiap-1', type: 'INCENDIE', description: 'Formation initiale Agent de Sécurité Incendie.', price: 700 },
        { title: 'SSIAP 2 - Chef d\'Équipe de Sécurité Incendie', slug: 'ssiap-2', type: 'INCENDIE', description: 'Formation initiale Chef d\'Équipe.', price: 900 },
        { title: 'SSIAP 3 - Chef de Service de Sécurité Incendie', slug: 'ssiap-3', type: 'INCENDIE', description: 'Formation initiale Chef de Service.', price: 2500 },
        { title: 'Remise à niveau (RAN) SSIAP 1', slug: 'ran-ssiap-1', type: 'INCENDIE', description: 'RAN SSIAP 1 obligatoire si diplôme périmé.', price: 300 },
        { title: 'Remise à niveau (RAN) SSIAP 2', slug: 'ran-ssiap-2', type: 'INCENDIE', description: 'RAN SSIAP 2 obligatoire si diplôme périmé.', price: 450 },
        { title: 'Remise à niveau (RAN) SSIAP 3', slug: 'ran-ssiap-3', type: 'INCENDIE', description: 'RAN SSIAP 3 obligatoire si diplôme périmé.', price: 800 },
        { title: 'Recyclage SSIAP 1', slug: 'recyclage-ssiap-1', type: 'INCENDIE', description: 'MAC SSIAP 1 triennal.', price: 250 },
        { title: 'Recyclage SSIAP 2', slug: 'recyclage-ssiap-2', type: 'INCENDIE', description: 'MAC SSIAP 2 triennal.', price: 350 },
        { title: 'Recyclage SSIAP 3', slug: 'recyclage-ssiap-3', type: 'INCENDIE', description: 'MAC SSIAP 3 triennal.', price: 600 },
        { title: 'Module Complémentaire SSIAP 1', slug: 'ssiap-1-complement', type: 'INCENDIE', description: 'Accès SSIAP 1 par équivalence.', price: 350 },
        { title: 'Module Complémentaire SSIAP 2', slug: 'ssiap-2-complement', type: 'INCENDIE', description: 'Accès SSIAP 2 par équivalence.', price: 500 },
        { title: 'Module Complémentaire SSIAP 3', slug: 'ssiap-3-complement', type: 'INCENDIE', description: 'Accès SSIAP 3 par équivalence.', price: 1000 },
        { title: 'Technicien de maintenance et de travaux SSI', slug: 'ssi-technicien', type: 'INCENDIE', description: 'Maintenance des systèmes incendie.', price: 0 },
      ]
    },
    {
      name: 'LA PRÉVENTION ET LA SÉCURITÉ',
      slug: 'prevention',
      courses: [
        { title: 'TFP APS (Ex CQP)', slug: 'tfp-aps', type: 'SURVEILLANCE', description: 'Formation Agent de Prévention et de Sécurité.', price: 0 },
        { title: 'TFP APS - PACK', slug: 'tfp-aps-pack', type: 'SURVEILLANCE', description: 'Pack complet sécurité privée.', price: 0 },
        { title: 'Formation APS Titre III', slug: 'aps-titre-3', type: 'SURVEILLANCE', description: 'Formation avancée Titre 3.', price: 0 },
        { title: 'Surveillance Grands Évènements', slug: 'surveillance-evenements', type: 'SURVEILLANCE', description: 'Sécurité évènementielle.', price: 0 },
        { title: 'MAC APS', slug: 'mac-aps', type: 'SURVEILLANCE', description: 'Renouvellement carte professionnelle.', price: 0 },
        { title: 'Recyclage Carte Professionnelle', slug: 'recyclage-carte-pro', type: 'SURVEILLANCE', description: 'Mise à jour CNAPS.', price: 0 },
        { title: 'Palpation de Sécurité', slug: 'palpation', type: 'SURVEILLANCE', description: 'Contrôle et palpation.', price: 0 },
        { title: 'Agent de Sûreté et de Sécurité Privée', slug: 'agent-surete', type: 'SURVEILLANCE', description: 'Formation polyvalente.', price: 0 },
      ]
    },
    {
      name: 'LA SANTÉ ET LA SÉCURITÉ AU TRAVAIL',
      slug: 'sante-securite',
      courses: [
        { title: 'Sauveteur Secouriste du Travail (SST) - Initial', slug: 'sst-initial', type: 'SECOURISME', description: 'Devenir secouriste en entreprise.', price: 250 },
        { title: 'Recyclage Sauveteur Secouriste du Travail (MAC SST)', slug: 'sst-mac', type: 'SECOURISME', description: 'Maintien des compétences SST.', price: 150 },
        { title: 'Habilitation Électrique B0 H0 H0V', slug: 'habilitation-b0', type: 'HABILITATION', description: 'Habilitation personnel non-électricien.', price: 0 },
        { title: 'Habilitation Électrique BS BE Manoeuvre', slug: 'habilitation-bs', type: 'HABILITATION', description: 'Interventions simples sur circuits basse tension.', price: 0 },
        { title: 'ÉVACUATION D’UN ÉTABLISSEMENT', slug: 'evacuation', type: 'SÉCURITÉ', description: 'Guide-file et serre-file.', price: 0 },
        { title: 'EPI – MANIPULATION EXTINCTEURS', slug: 'extincteurs', type: 'SÉCURITÉ', description: 'Usage des extincteurs.', price: 0 },
        { title: 'FORMATION FOSST', slug: 'fosst', type: 'SÉCURITÉ', description: 'Référent santé-sécurité.', price: 0 },
        { title: 'MAC FORMATEUR SST', slug: 'mac-formateur-sst', type: 'SECOURISME', description: 'Actualisation formateur SST.', price: 0 },
      ]
    },
    {
      name: 'PERMIS_B',
      slug: 'permis-b',
      courses: [
        { title: 'Permis B (Auto) - Formule Classique', slug: 'permis-b-auto-classique', type: 'PERMIS_B', description: 'Formule 13h Boîte Auto.', price: 980, drivingHours: 13 },
        { title: 'Permis B (Auto) - Formule Confort', slug: 'permis-b-auto-confort', type: 'PERMIS_B', description: 'Formule 20h Boîte Auto.', price: 1495, drivingHours: 20 },
        { title: 'Permis B (Manuelle) - Formule Classique', slug: 'permis-b-manuelle-classique', type: 'PERMIS_B', description: 'Formule 20h Boîte Manuelle.', price: 1095, drivingHours: 20 },
        { title: 'Permis B (Manuelle) - Formule Sérénité', slug: 'permis-b-manuelle-serenite', type: 'PERMIS_B', description: 'Formule 30h Boîte Manuelle.', price: 1595, drivingHours: 30 },
        { title: '1h de conduite (Boîte Manuelle)', slug: 'permis-b-h-manuelle', type: 'PERMIS_B', description: 'Session individuelle.', price: 50, drivingHours: 1 },
        { title: '1h de conduite (Boîte Auto)', slug: 'permis-b-h-auto', type: 'PERMIS_B', description: 'Session individuelle.', price: 40, drivingHours: 1 },
      ]
    },
    {
      name: 'MOTO',
      slug: 'moto',
      courses: [
        { title: 'Permis Moto A2 - Formule Essentielle', slug: 'moto-a2-essentielle', type: 'MOTO', description: '20h de formation.', price: 695, drivingHours: 20 },
        { title: 'Permis Moto A2 - Formule Maîtrise', slug: 'moto-a2-maitrise', type: 'MOTO', description: '25h de formation.', price: 995, drivingHours: 25 },
        { title: '1h de conduite (Moto)', slug: 'moto-h', type: 'MOTO', description: 'Session individuelle.', price: 50, drivingHours: 1 },
      ]
    },
    {
      name: 'RÉCUPÉRATION DE POINTS',
      slug: 'p-points',
      courses: [
        { title: 'Stage Récupération de Points', slug: 'stage-points', type: 'P_POINTS', description: 'Stage de 2 jours (4 points récupérés).', price: 250 },
      ]
    },
  ];

  for (const cat of categoriesData) {
    const category = await prisma.courseCategory.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name },
      create: { name: cat.name, slug: cat.slug }
    });

    for (const c of cat.courses) {
      await prisma.course.upsert({
        where: { slug: c.slug },
        update: {
          title: c.title,
          type: c.type,
          description: c.description,
          price: c.price,
          drivingHours: c.drivingHours || 0,
          isPublished: true,
        },
        create: {
          title: c.title,
          slug: c.slug,
          type: c.type,
          description: c.description,
          price: c.price,
          drivingHours: c.drivingHours || 0,
          isPublished: true,
        }
      });

      const course = await prisma.course.findUnique({ where: { slug: c.slug } });
      if (course) {
        await prisma.courseOnCategory.upsert({
          where: {
            courseId_categoryId: {
              courseId: course.id,
              categoryId: category.id,
            }
          },
          update: {},
          create: { courseId: course.id, categoryId: category.id }
        });
      }
    }
  }

  // Final cleanup of slugs that are definitely redundant now
  const redundant = [
    'sst', 'ssiap-1-complement-redundant'
  ];
  await prisma.course.deleteMany({ where: { slug: { in: redundant } } });

  console.log('🏁 Seeding finished.');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
