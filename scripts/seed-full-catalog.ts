import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Start seeding full catalog...');

  const categoriesData = [
    {
      name: 'FORMATION CACES',
      slug: 'caces',
      courses: [
        { title: 'CACES® R489 (Chariots élévateurs)', slug: 'caces-r489', type: 'CACES', description: 'Conduite de chariots de manutention à conducteur porté.' },
        { title: 'CACES® R486 (PEMP)', slug: 'caces-r486', type: 'CACES', description: 'Plateformes élévatrices mobiles de personnes.' },
        { title: 'CACES® R482 (Engins de chantier)', slug: 'caces-r482', type: 'CACES', description: 'Conduite d\'engins de chantier.' },
      ]
    },
    {
      name: 'FORMATION TRANSPORT',
      slug: 'transport',
      courses: [
        { title: 'FIMO Marchandises', slug: 'fimo-marchandises', type: 'TRANSPORT', description: 'Formation Initiale Minimale Obligatoire pour le transport de marchandises.' },
        { title: 'FCO Marchandises', slug: 'fco-marchandises', type: 'TRANSPORT', description: 'Formation Continue Obligatoire pour le transport de marchandises.' },
      ]
    },
    {
      name: 'FORMATION VTC',
      slug: 'vtc',
      courses: [
        { title: 'Formation VTC', slug: 'vtc-initiale', type: 'VTC', description: 'Préparation complète à l\'examen VTC (Théorie + Pratique).' },
        { title: 'Formation Continue VTC', slug: 'vtc-continue', type: 'VTC', description: 'Stage obligatoire de 14h tous les 5 ans pour le renouvellement de la carte.' },
        { title: 'Formation Chauffeur VTC en ligne', slug: 'vtc-online', type: 'VTC', description: 'Formation e-learning pour préparer l\'examen théorique à votre rythme.' },
        { title: 'Formation Passerelle Taxi vers VTC', slug: 'vtc-passerelle', type: 'VTC', description: 'Formation courte pour les chauffeurs de taxi souhaitant obtenir la carte VTC.' },
      ]
    },
    {
      name: 'FORMATION TAXI',
      slug: 'taxi',
      courses: [
        { title: 'Formation Taxi Initiale', slug: 'taxi-initiale', type: 'TAXI', description: 'Préparation au Certificat de Capacité Professionnelle de Conducteur de Taxi (CCPCT).' },
        { title: 'Formation Continue Taxi', slug: 'taxi-continue', type: 'TAXI', description: 'Stage obligatoire de 14h tous les 5 ans pour le renouvellement de la carte.' },
        { title: 'Formation Mobilité Taxi', slug: 'taxi-mobilite', type: 'TAXI', description: 'Pour les chauffeurs souhaitant exercer dans un autre département.' },
        { title: 'Formation Mobilité Taxi Parisienne et Banlieue', slug: 'taxi-mobilite-paris', type: 'TAXI', description: 'Spécificités pour exercer dans la zone des taxis parisiens.' },
        { title: 'Formation Passerelle Taxi Banlieue vers Taxi Parisien', slug: 'taxi-passerelle-paris', type: 'TAXI', description: 'Accès à la zone de prise en charge parisienne.' },
        { title: 'Formation Passerelle Taxi', slug: 'taxi-passerelle', type: 'TAXI', description: 'Formation pour les chauffeurs VTC souhaitant devenir Taxi.' },
      ]
    },
    {
      name: 'LA SÉCURITÉ INCENDIE',
      slug: 'incendie',
      courses: [
        { title: 'SSIAP 1', slug: 'ssiap-1', type: 'INCENDIE', description: 'Agent de service de sécurité incendie et d\'assistance à personnes.' },
        { title: 'RAN SSIAP 1', slug: 'ran-ssiap-1', type: 'INCENDIE', description: 'Remise à niveau SSIAP 1 (obligatoire si diplôme périmé).' },
        { title: 'Recyclage SSIAP 1', slug: 'recyclage-ssiap-1', type: 'INCENDIE', description: 'Maintien des acquis SSIAP 1 (tous les 3 ans).' },
        { title: 'SSIAP 1 Module Complémentaire', slug: 'ssiap-1-complement', type: 'INCENDIE', description: 'Accès au SSIAP 1 par équivalence.' },
        { title: 'SSIAP 2', slug: 'ssiap-2', type: 'INCENDIE', description: 'Chef d\'équipe de sécurité incendie.' },
        { title: 'RAN SSIAP 2', slug: 'ran-ssiap-2', type: 'INCENDIE', description: 'Remise à niveau SSIAP 2.' },
        { title: 'Recyclage SSIAP 2', slug: 'recyclage-ssiap-2', type: 'INCENDIE', description: 'Maintien des acquis SSIAP 2.' },
        { title: 'Compléments SSIAP 2', slug: 'ssiap-2-complement', type: 'INCENDIE', description: 'Modules complémentaires pour SSIAP 2.' },
        { title: 'SSIAP 3', slug: 'ssiap-3', type: 'INCENDIE', description: 'Chef de service de sécurité incendie.' },
        { title: 'RAN SSIAP 3', slug: 'ran-ssiap-3', type: 'INCENDIE', description: 'Remise à niveau SSIAP 3.' },
        { title: 'Recyclage SSIAP 3', slug: 'recyclage-ssiap-3', type: 'INCENDIE', description: 'Maintien des acquis SSIAP 3.' },
        { title: 'Technicien de maintenance et de travaux SSI', slug: 'ssi-technicien', type: 'INCENDIE', description: 'Maintenance des systèmes de sécurité incendie.' },
      ]
    },
    {
      name: 'LA PRÉVENTION ET LA SÉCURITÉ',
      slug: 'prevention',
      courses: [
        { title: 'TFP APS (Ex CQP)', slug: 'tfp-aps', type: 'SURVEILLANCE', description: 'Titre à Finalité Professionnelle d\'Agent de Prévention et de Sécurité.' },
        { title: 'TFP APS - PACK', slug: 'tfp-aps-pack', type: 'SURVEILLANCE', description: 'Pack complet incluant TFP APS et modules complémentaires.' },
        { title: 'Formation APS Titre III', slug: 'aps-titre-3', type: 'SURVEILLANCE', description: 'Formation avancée en sécurité privée.' },
        { title: 'Surveillance Grands Évènements', slug: 'surveillance-evenements', type: 'SURVEILLANCE', description: 'Sécurité spécifique pour les manifestations sportives et culturelles.' },
        { title: 'MAC APS', slug: 'mac-aps', type: 'SURVEILLANCE', description: 'Maintien et Actualisation des Compétences APS (renouvellement carte).' },
        { title: 'Recyclage Carte Professionnelle', slug: 'recyclage-carte-pro', type: 'SURVEILLANCE', description: 'Formation obligatoire pour le renouvellement de la carte CNAPS.' },
        { title: 'Palpation de Sécurité', slug: 'palpation', type: 'SURVEILLANCE', description: 'Techniques de contrôle et palpation de sécurité.' },
        { title: 'Agent de Sûreté et de Sécurité Privée', slug: 'agent-surete', type: 'SURVEILLANCE', description: 'Formation polyvalente aux métiers de la sûreté.' },
      ]
    },
    {
      name: 'LA SANTÉ ET LA SÉCURITÉ AU TRAVAIL',
      slug: 'sante-securite',
      courses: [
        { title: 'SST INITIAL', slug: 'sst-initial', type: 'SECOURISME', description: 'Sauvetage Secourisme du Travail - Formation initiale.' },
        { title: 'H0/B0', slug: 'habilitation-b0', type: 'HABILITATION', description: 'Habilitation électrique pour personnel non électricien.' },
        { title: 'RECYCLAGE SST', slug: 'sst-mac', type: 'SECOURISME', description: 'Maintien et Actualisation des Compétences du Sauveteur Secouriste du Travail.' },
        { title: 'ÉVACUATION D’UN ÉTABLISSEMENT', slug: 'evacuation', type: 'SÉCURITÉ', description: 'Formation guide-file et serre-file pour l\'évacuation incendie.' },
        { title: 'EPI – MANIPULATION EXTINCTEURS', slug: 'extincteurs', type: 'SÉCURITÉ', description: 'Équipier de Première Intervention : manipuler un extincteur sur un début d\'incendie.' },
        { title: 'FORMATION FOSST', slug: 'fosst', type: 'SÉCURITÉ', description: 'Formation à l\'Organisation des Secours et à la Santé au Travail.' },
        { title: 'MAC FORMATEUR SST', slug: 'mac-formateur-sst', type: 'SECOURISME', description: 'Maintien et Actualisation des Compétences pour les formateurs SST.' },
      ]
    }
  ];

  for (const cat of categoriesData) {
    // 1. Create Category
    const category = await prisma.courseCategory.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name },
      create: {
        name: cat.name,
        slug: cat.slug,
      }
    });
    console.log(`✅ Category: ${category.name}`);

    // 2. Create Courses and Link
    for (const c of cat.courses) {
      const course = await prisma.course.upsert({
        where: { slug: c.slug },
        update: {
          title: c.title,
          type: c.type,
          description: c.description,
          isPublished: true,
        },
        create: {
          title: c.title,
          slug: c.slug,
          type: c.type,
          description: c.description,
          isPublished: true,
          price: 0, // Default to 0, to be updated manually
        }
      });

      // 3. Link Course to Category
      await prisma.courseOnCategory.upsert({
        where: {
          courseId_categoryId: {
            courseId: course.id,
            categoryId: category.id,
          }
        },
        update: {},
        create: {
          courseId: course.id,
          categoryId: category.id,
        }
      });
      console.log(`   🔗 Linked: ${course.title}`);
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
