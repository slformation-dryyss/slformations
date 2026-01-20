import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedSSIAP() {
  console.log('🔥 Creating SSIAP formations...');

  try {
    // Ensure Incendie category exists
    const category = await prisma.courseCategory.upsert({
      where: { slug: 'incendie' },
      update: {},
      create: {
        name: 'Incendie',
        slug: 'incendie',
        description: 'Formations Sécurité Incendie (SSIAP, EPI, Évacuation)',
      },
    });

    console.log(`✅ Category: ${category.name}`);

    // ==========================================
    // SSIAP 1
    // ==========================================

    // 1. Initial
    const ssiap1 = await prisma.course.upsert({
      where: { slug: 'ssiap-1-agent-securite-incendie' },
      update: {
        title: 'SSIAP 1 - Agent de Sécurité Incendie',
        description: `Le SSIAP 1 correspond à Agent de Service de Sécurité Incendie et d'Assistance à Personnes. Ils ont pour mission d'assurer la sécurité des personnes et la sécurité incendie des biens dans des établissements recevant du public (ERP).`,
        type: 'INCENDIE',
        imageUrl: 'https://ls-formation.fr/wp-content/uploads/2025/05/Formation-Initiale_ssiap1_535x300.webp',
        isPublished: true,
        price: 700,
        // duration: 67, 
      },
      create: {
        title: 'SSIAP 1 - Agent de Sécurité Incendie',
        slug: 'ssiap-1-agent-securite-incendie',
        description: `Le SSIAP 1 correspond à Agent de Service de Sécurité Incendie et d'Assistance à Personnes. Ils ont pour mission d'assurer la sécurité des personnes et la sécurité incendie des biens dans des établissements recevant du public (ERP).`,
        type: 'INCENDIE',
        imageUrl: 'https://ls-formation.fr/wp-content/uploads/2025/05/Formation-Initiale_ssiap1_535x300.webp',
        isPublished: true,
        price: 700,
        // duration: 67, 
      },
    });
    console.log(`✅ SSIAP 1 Initial created`);

    // 2. Recyclage
    const recyclageSsiap1 = await prisma.course.upsert({
      where: { slug: 'recyclage-ssiap-1' },
      update: {
        title: 'Recyclage SSIAP 1',
        description: `Le recyclage triennal obligatoire pour maintenir la validité du diplôme SSIAP 1.`,
        type: 'INCENDIE',
        imageUrl: 'https://ls-formation.fr/wp-content/uploads/2025/05/Formation-Initiale_ssiap1_535x300.webp',
        isPublished: true,
        price: 250,
        // duration: 14, 
      },
      create: {
        title: 'Recyclage SSIAP 1',
        slug: 'recyclage-ssiap-1',
        description: `Le recyclage triennal obligatoire pour maintenir la validité du diplôme SSIAP 1.`,
        type: 'INCENDIE',
        imageUrl: 'https://ls-formation.fr/wp-content/uploads/2025/05/Formation-Initiale_ssiap1_535x300.webp',
        isPublished: true,
        price: 250,
        // duration: 14, 
      },
    });
    console.log(`✅ Recyclage SSIAP 1 created`);

    // 3. Remise à Niveau
    const ranSsiap1 = await prisma.course.upsert({
      where: { slug: 'ran-ssiap-1-remise-a-niveau' },
      update: {
        title: 'Remise à niveau SSIAP 1',
        description: `Pour les agents ayant dépassé la date limite de recyclage ou n'ayant pas atteint le quota d'heures.`,
        type: 'INCENDIE',
        imageUrl: 'https://ls-formation.fr/wp-content/uploads/2025/05/Formation-RAN_SSIAP1_535x300.webp',
        isPublished: true,
        price: 300,
        // duration: 21, 
      },
      create: {
        title: 'Remise à niveau SSIAP 1',
        slug: 'ran-ssiap-1-remise-a-niveau',
        description: `Pour les agents ayant dépassé la date limite de recyclage ou n'ayant pas atteint le quota d'heures.`,
        type: 'INCENDIE',
        imageUrl: 'https://ls-formation.fr/wp-content/uploads/2025/05/Formation-RAN_SSIAP1_535x300.webp',
        isPublished: true,
        price: 300,
        // duration: 21, 
      },
    });
    console.log(`✅ RAN SSIAP 1 created`);

    // 4. Module Complémentaire
    const moduleCompSsiap1 = await prisma.course.upsert({
      where: { slug: 'module-complementaire-ssiap-1' },
      update: {
        title: 'Module complémentaire SSIAP 1',
        description: `Module pour acquérir des compétences spécifiques ou pour l'équivalence.`,
        type: 'INCENDIE',
        imageUrl: 'https://ls-formation.fr/wp-content/uploads/2025/05/Formation-Initiale_ssiap1_535x300.webp',
        isPublished: true,
        price: 350,
        // duration: 21, 
      },
      create: {
        title: 'Module complémentaire SSIAP 1',
        slug: 'module-complementaire-ssiap-1',
        description: `Module pour acquérir des compétences spécifiques ou pour l'équivalence.`,
        type: 'INCENDIE',
        imageUrl: 'https://ls-formation.fr/wp-content/uploads/2025/05/Formation-Initiale_ssiap1_535x300.webp',
        isPublished: true,
        price: 350,
        // duration: 21, 
      },
    });
    console.log(`✅ Module Complémentaire SSIAP 1 created`);


    // ==========================================
    // SSIAP 2
    // ==========================================

    // 1. Initial
    const ssiap2 = await prisma.course.upsert({
      where: { slug: 'ssiap-2-chef-equipe-securite-incendie' },
      update: {
        title: 'SSIAP 2 - Chef d\'Équipe',
        description: `Formation pour devenir Chef d'Équipe de Service de Sécurité Incendie.`,
        type: 'INCENDIE',
        imageUrl: 'https://ls-formation.fr/wp-content/uploads/2025/05/SSIAP-2-300x150.jpg',
        isPublished: true,
        price: 900,
        // duration: 70, 
      },
      create: {
        title: 'SSIAP 2 - Chef d\'Équipe',
        slug: 'ssiap-2-chef-equipe-securite-incendie',
        description: `Formation pour devenir Chef d'Équipe de Service de Sécurité Incendie.`,
        type: 'INCENDIE',
        imageUrl: 'https://ls-formation.fr/wp-content/uploads/2025/05/SSIAP-2-300x150.jpg',
        isPublished: true,
        price: 900,
        // duration: 70, 
      },
    });
    console.log(`✅ SSIAP 2 Initial created`);

    // 2. Recyclage
    const recyclageSsiap2 = await prisma.course.upsert({
      where: { slug: 'recyclage-ssiap-2' },
      update: {
        title: 'Recyclage SSIAP 2',
        description: `Maintien des compétences pour Chef d'Équipe SSIAP 2.`,
        type: 'INCENDIE',
        imageUrl: 'https://ls-formation.fr/wp-content/uploads/2025/05/SSIAP-2-300x150.jpg',
        isPublished: true,
        price: 350,
        // duration: 14, 
      },
      create: {
        title: 'Recyclage SSIAP 2',
        slug: 'recyclage-ssiap-2',
        description: `Maintien des compétences pour Chef d'Équipe SSIAP 2.`,
        type: 'INCENDIE',
        imageUrl: 'https://ls-formation.fr/wp-content/uploads/2025/05/SSIAP-2-300x150.jpg',
        isPublished: true,
        price: 350,
        // duration: 14, 
      },
    });
    console.log(`✅ Recyclage SSIAP 2 created`);

    // 3. Remise à Niveau
    const ranSsiap2 = await prisma.course.upsert({
      where: { slug: 'remise-a-niveau-ssiap-2' },
      update: {
        title: 'Remise à niveau SSIAP 2',
        description: `Pour retrouver la qualification de Chef d'Équipe SSIAP 2.`,
        type: 'INCENDIE',
        imageUrl: 'https://ls-formation.fr/wp-content/uploads/2025/05/SSIAP-2-300x150.jpg',
        isPublished: true,
        price: 450,
        // duration: 21, 
      },
      create: {
        title: 'Remise à niveau SSIAP 2',
        slug: 'remise-a-niveau-ssiap-2',
        description: `Pour retrouver la qualification de Chef d'Équipe SSIAP 2.`,
        type: 'INCENDIE',
        imageUrl: 'https://ls-formation.fr/wp-content/uploads/2025/05/SSIAP-2-300x150.jpg',
        isPublished: true,
        price: 450,
        // duration: 21, 
      },
    });
    console.log(`✅ RAN SSIAP 2 created`);

    // 4. Module Complémentaire
    const moduleCompSsiap2 = await prisma.course.upsert({
      where: { slug: 'module-complementaire-ssiap-2' },
      update: {
        title: 'Module complémentaire SSIAP 2',
        description: `Module spécifique pour SSIAP 2.`,
        type: 'INCENDIE',
        imageUrl: 'https://ls-formation.fr/wp-content/uploads/2025/05/SSIAP-2-300x150.jpg',
        isPublished: true,
        price: 500,
        // duration: 28, 
      },
      create: {
        title: 'Module complémentaire SSIAP 2',
        slug: 'module-complementaire-ssiap-2',
        description: `Module spécifique pour SSIAP 2.`,
        type: 'INCENDIE',
        imageUrl: 'https://ls-formation.fr/wp-content/uploads/2025/05/SSIAP-2-300x150.jpg',
        isPublished: true,
        price: 500,
        // duration: 28, 
      },
    });
    console.log(`✅ Module Complémentaire SSIAP 2 created`);


    // ==========================================
    // SSIAP 3
    // ==========================================

    // 1. Initial
    const ssiap3 = await prisma.course.upsert({
      where: { slug: 'ssiap-3-chef-service-securite-incendie' },
      update: {
        title: 'SSIAP 3 - Chef de Service',
        description: `Formation de Chef de Service de Sécurité Incendie.`,
        type: 'INCENDIE',
        imageUrl: 'https://ls-formation.fr/wp-content/uploads/2025/05/SSIAP-3-300x206.jpg',
        isPublished: true,
        price: 2500,
        // duration: 216, 
      },
      create: {
        title: 'SSIAP 3 - Chef de Service',
        slug: 'ssiap-3-chef-service-securite-incendie',
        description: `Formation de Chef de Service de Sécurité Incendie.`,
        type: 'INCENDIE',
        imageUrl: 'https://ls-formation.fr/wp-content/uploads/2025/05/SSIAP-3-300x206.jpg',
        isPublished: true,
        price: 2500,
        // duration: 216, 
      },
    });
    console.log(`✅ SSIAP 3 Initial created`);

    // 2. Recyclage
    const recyclageSsiap3 = await prisma.course.upsert({
      where: { slug: 'recyclage-ssiap-3' },
      update: {
        title: 'Recyclage SSIAP 3',
        description: `Recyclage triennal pour Chef de Service SSIAP 3.`,
        type: 'INCENDIE',
        imageUrl: 'https://ls-formation.fr/wp-content/uploads/2025/05/SSIAP-3-300x206.jpg',
        isPublished: true,
        price: 600,
        // duration: 21, 
      },
      create: {
        title: 'Recyclage SSIAP 3',
        slug: 'recyclage-ssiap-3',
        description: `Recyclage triennal pour Chef de Service SSIAP 3.`,
        type: 'INCENDIE',
        imageUrl: 'https://ls-formation.fr/wp-content/uploads/2025/05/SSIAP-3-300x206.jpg',
        isPublished: true,
        price: 600,
        // duration: 21, 
      },
    });
    console.log(`✅ Recyclage SSIAP 3 created`);

    // 3. Remise à Niveau
    const ranSsiap3 = await prisma.course.upsert({
      where: { slug: 'remise-a-niveau-ssiap-3' },
      update: {
        title: 'Remise à niveau SSIAP 3',
        description: `Remise à niveau pour SSIAP 3.`,
        type: 'INCENDIE',
        imageUrl: 'https://ls-formation.fr/wp-content/uploads/2025/05/SSIAP-3-300x206.jpg',
        isPublished: true,
        price: 800,
        // duration: 35, 
      },
      create: {
        title: 'Remise à niveau SSIAP 3',
        slug: 'remise-a-niveau-ssiap-3',
        description: `Remise à niveau pour SSIAP 3.`,
        type: 'INCENDIE',
        imageUrl: 'https://ls-formation.fr/wp-content/uploads/2025/05/SSIAP-3-300x206.jpg',
        isPublished: true,
        price: 800,
        // duration: 35, 
      },
    });
    console.log(`✅ RAN SSIAP 3 created`);

    // 4. Module Complémentaire
    const moduleCompSsiap3 = await prisma.course.upsert({
      where: { slug: 'module-complementaire-ssiap-3' },
      update: {
        title: 'Module complémentaire SSIAP 3',
        description: `Pour obtenir l'équivalence SSIAP 3.`,
        type: 'INCENDIE',
        imageUrl: 'https://ls-formation.fr/wp-content/uploads/2025/05/SSIAP-3-300x206.jpg',
        isPublished: true,
        price: 1000,
        // duration: 45, 
      },
      create: {
        title: 'Module complémentaire SSIAP 3',
        slug: 'module-complementaire-ssiap-3',
        description: `Pour obtenir l'équivalence SSIAP 3.`,
        type: 'INCENDIE',
        imageUrl: 'https://ls-formation.fr/wp-content/uploads/2025/05/SSIAP-3-300x206.jpg',
        isPublished: true,
        price: 1000,
        // duration: 45, 
      },
    });
    console.log(`✅ Module Complémentaire SSIAP 3 created`);


    // Link all to category
    const courses = [
        ssiap1, recyclageSsiap1, ranSsiap1, moduleCompSsiap1,
        ssiap2, recyclageSsiap2, ranSsiap2, moduleCompSsiap2,
        ssiap3, recyclageSsiap3, ranSsiap3, moduleCompSsiap3
    ];

    for (const c of courses) {
        await prisma.courseOnCategory.upsert({
            where: { courseId_categoryId: { courseId: c.id, categoryId: category.id } },
            update: {},
            create: { courseId: c.id, categoryId: category.id },
        });
    }

    console.log('\n🎉 All 12 SSIAP formations created successfully!');

  } catch (error) {
    console.error('❌ Error creating SSIAP formations:', error);
    throw error;
  }
}

async function main() {
  try {
    await seedSSIAP();
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
