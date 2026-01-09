
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Start Seeding Tech Courses ---');

  // 1. Ensure Category exists
  const categoryData = { 
    name: 'Numérique & Tech', 
    slug: 'tech', 
    description: 'Formations aux métiers du web, cybersécurité et CMS.' 
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

  const techCourses = [
    {
      title: 'Développeur Web Fullstack (JS/React/Node)',
      slug: 'developpeur-web-fullstack',
      type: 'DEV',
      imageUrl: 'https://img.freepik.com/free-photo/programming-background-with-person-working-with-codes-computer_23-2150010125.jpg',
      description: `Devenez développeur web complet. Maîtrisez Javascript, React, Node.js et les bases de données.
      
Objectifs : Créer des applications web modernes, dynamiques et sécurisées.
Durée : 3 à 6 mois (intensif ou soir).
Certification : Titre RNCP Niveau 5.`,
      modules: [
        { title: "Fondamentaux du Web", lessons: ["HTML5 & CSS3", "Algorithmique JS", "Git & GitHub"] },
        { title: "Frontend avec React", lessons: ["Composants & Props", "State & Hooks", "Routing", "Appels API"] },
        { title: "Backend avec Node.js", lessons: ["Express.js", "API REST", "Bases de données (SQL/NoSQL)"] }
      ]
    },
    {
      title: 'Cybersécurité : Les Fondamentaux',
      slug: 'cybersecurite-fondamentaux',
      type: 'CYBER',
      imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop',
      description: `Comprendre les enjeux de la sécurité informatique et protéger les systèmes.
      
Objectifs : Identifier les menaces, sécuriser un poste de travail et un réseau, sensibilisation RGPD.
Public : Tout public souhaitant se protéger ou s'initier.`,
      modules: [
        { title: "Introduction à la Cybersécurité", lessons: ["Les types d'attaques (Phishing, Ransomware)", "Ingénierie sociale"] },
        { title: "Protection des Données", lessons: ["Mots de passe robustes", "Cryptographie de base", "RGPD"] },
        { title: "Sécurité Réseau", lessons: ["Pare-feu & Antivirus", "VPN & Navigation sécurisée"] }
      ]
    },
    {
      title: 'Créer son site avec WordPress & CMS',
      slug: 'wordpress-cms',
      type: 'CMS',
      imageUrl: 'https://img.freepik.com/free-photo/laptop-with-wordpress-logo-screen_23-2149025001.jpg',
      description: `Créez votre site vitrine ou e-commerce sans coder grâce à WordPress.
      
Objectifs : Installer, configurer et personnaliser un site WordPress professionnel.
Idéal pour entrepreneurs et freelances.`,
      modules: [
        { title: "Installation & Configuration", lessons: ["Hébergement & Nom de domaine", "Installation de WordPress"] },
        { title: "Personnalisation", lessons: ["Choix du thème", "Constructeurs de page (Elementor/Divi)", "Menus & Widgets"] },
        { title: "E-Commerce", lessons: ["WooCommerce", "Gestion des produits", "Paiements"] }
      ]
    },
    {
      title: 'Data Analyst : Python & SQL',
      slug: 'data-analyst-python',
      type: 'TECH',
      imageUrl: 'https://img.freepik.com/free-photo/business-woman-working-laptop-analyzing-graph-chart-business-report_1150-51105.jpg',
      description: `Apprenez à analyser des données et créer des tableaux de bord interactifs.
      
Compétences : Python (Pandas, NumPy), SQL, Data Visualization (Tableau/PowerBI).
Métier très recherché !`,
      modules: [
        { title: "Bases de Python", lessons: ["Syntaxe et Variables", "Structures de données", "Fonctions"] },
        { title: "Manipulation de Données", lessons: ["Pandas Dataframes", "Nettoyage de données", "Export CSV/Excel"] },
        { title: "SQL & Bases de données", lessons: ["Requêtes SELECT", "Joitures (JOIN)", "Agrégations"] }
      ]
    },
    {
      title: 'Marketing Digital & Growth',
      slug: 'marketing-digital-growth',
      type: 'TECH',
      imageUrl: 'https://img.freepik.com/free-photo/digital-marketing-with-icons-business-people_53876-47620.jpg',
      description: `Maîtrisez tous les leviers pour acquérir des clients en ligne.
      
Au programme : SEO (Référencement naturel), SEA (Google Ads), Réseaux Sociaux et Copywriting.
Boostez votre activité ou devenez consultant.`,
      modules: [
        { title: "Stratégie & SEO", lessons: ["Audit sémantique", "Optimisation On-page", "Netlinking"] },
        { title: "Publicité (SEA/Social Ads)", lessons: ["Campagnes Google Ads", "Facebook & Instagram Ads", "Targeting"] },
        { title: "Analytics & Conversion", lessons: ["Google Analytics 4", "KPIs", "CRO (Optimisation taux de conversion)"] }
      ]
    },
    {
      title: 'Design UI/UX : Créer des interfaces web',
      slug: 'design-ui-ux',
      type: 'TECH',
      imageUrl: 'https://img.freepik.com/free-photo/web-design-concepts-with-blurred-background_1134-82.jpg',
      description: `Concevez des sites et applications ergonomiques et esthétiques.
      
Outils : Figma, Adobe XD.
Apprenez les règles du design, le prototypage et les tests utilisateurs.`,
      modules: [
        { title: "UX Research", lessons: ["Personas", "User Journey", "Wireframing"] },
        { title: "UI Design avec Figma", lessons: ["Prise en main", "Systèmes de design", "Auto-layout"] },
        { title: "Prototypage", lessons: ["Interactions", "Animations", "Partage client"] }
      ]
    }
  ];

  for (const courseData of techCourses) {
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
        price: 1500, // Prix indicatif
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

    // 3. Create Modules (Delete existing to avoid dupes/complexity in seed)
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
                    content: 'Contenu de formation Tech.',
                }
            });
        }
    }
  }

  console.log('--- Tech Seeding Complete ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
