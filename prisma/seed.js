const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Start seeding formations...')

  // 1. Create ADMIN user if not exists
  const instructor = await prisma.user.upsert({
    where: { email: 'admin@slformations.com' },
    update: {},
    create: {
      email: 'admin@slformations.com',
      auth0Id: 'auth0|admin_seed_id',
      name: 'Admin SL Formations',
      role: 'ADMIN',
    },
  })
  console.log(`✅ Admin user: ${instructor.name}`)

  // 2. Clear existing categories/links to avoid conflicts (optional/selective)
  // We use upsert so we don't necessarily need to clear.

  const formations = [
    // --- PERMIS B (MANUELLE) ---
    {
      title: 'Permis B (Manuelle) - Formule Classique',
      slug: 'permis-b-manuelle-classique',
      description: "L'essentiel pour débuter. 20h de conduite incluses. Accompagnement complet.",
      price: 1095,
      drivingHours: 20,
      type: 'PERMIS_B',
      isPublished: true,
      imageUrl: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop'
    },
    {
      title: 'Permis B (Manuelle) - Formule Sérénité',
      slug: 'permis-b-manuelle-serenite',
      description: "Pour prendre le temps d'apprendre. 30h de conduite incluses. Priorité planning.",
      price: 1595,
      drivingHours: 30,
      type: 'PERMIS_B',
      isPublished: true,
      imageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2070&auto=format&fit=crop'
    },

    // --- PERMIS B (AUTOMATIQUE) ---
    {
      title: 'Permis B (Auto) - Formule Classique',
      slug: 'permis-b-auto-classique',
      description: "Rapide et efficace en boîte automatique. 13h de conduite (minimum légal).",
      price: 980,
      drivingHours: 13,
      type: 'PERMIS_B',
      isPublished: true,
      imageUrl: 'https://images.unsplash.com/photo-1580273916550-e323be2ed5fa?q=80&w=1964&auto=format&fit=crop'
    },
    {
      title: 'Permis B (Auto) - Formule Confort',
      slug: 'permis-b-auto-confort',
      description: "La maîtrise totale en boîte automatique. 20h de conduite incluses.",
      price: 1495,
      drivingHours: 20,
      type: 'PERMIS_B',
      isPublished: true,
      imageUrl: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=2070&auto=format&fit=crop'
    },

    // --- VTC ---
    {
      title: 'Pack VTC Digital',
      slug: 'vtc-pack-digital',
      description: "E-learning complet (Théorique + Pratique). Accès quiz illimité.",
      price: 999,
      drivingHours: 0,
      type: 'VTC',
      isPublished: true,
      imageUrl: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop'
    },
    {
      title: 'Pack VTC Essentiel',
      slug: 'vtc-pack-essentiel',
      description: "2 Semaines de cours en présentiel + E-learning inclus.",
      price: 1199,
      drivingHours: 0,
      type: 'VTC',
      isPublished: true,
      imageUrl: 'https://images.unsplash.com/photo-1511119253457-3fb2e327a4d5?q=80&w=2070&auto=format&fit=crop'
    },
    {
      title: 'Pack VTC Gold',
      slug: 'vtc-pack-gold',
      description: "Recommandé : Pack Essentiel + Frais d'examen offerts + 2h de conduite individuelle.",
      price: 1499,
      drivingHours: 2,
      type: 'VTC',
      isPublished: true,
      imageUrl: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop'
    },
    {
      title: 'Pack VTC Excellence',
      slug: 'vtc-pack-excellence',
      description: "Pack Gold + Assurance Réussite (2ème passage inclus).",
      price: 1999,
      drivingHours: 2,
      type: 'VTC',
      isPublished: true,
      imageUrl: 'https://images.unsplash.com/photo-1473186505569-9c61870c11f9?q=80&w=2070&auto=format&fit=crop'
    },

    // --- MOTO ---
    {
      title: 'Permis Moto A2 - Formule Essentielle',
      slug: 'permis-moto-essentielle',
      description: "Le minimum légal pour le permis A2. 20h de formation incluses.",
      price: 695,
      drivingHours: 20,
      type: 'MOTO',
      isPublished: true,
      imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2070&auto=format&fit=crop'
    },
    {
      title: 'Permis Moto A2 - Formule Maîtrise',
      slug: 'permis-moto-maitrise',
      description: "Pour assurer votre réussite. 25h de formation incluses. Assurance examen.",
      price: 995,
      drivingHours: 25,
      type: 'MOTO',
      isPublished: true,
      imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=2070&auto=format&fit=crop'
    },

    // --- RÉCUPÉRATION DE POINTS ---
    {
      title: 'Stage Récupération de Points',
      slug: 'recup-points-stage',
      description: "Récupérez 4 points en 2 jours. Stage agréé par la préfecture.",
      price: 250,
      drivingHours: 0,
      type: 'P_POINTS',
      isPublished: true,
      imageUrl: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop'
    }
  ]

  for (const f of formations) {
    await prisma.course.upsert({
      where: { slug: f.slug },
      update: {
        title: f.title,
        description: f.description,
        price: f.price,
        drivingHours: f.drivingHours,
        type: f.type,
        isPublished: f.isPublished,
        imageUrl: f.imageUrl
      },
      create: f
    })
  }

  console.log(`✅ ${formations.length} formations synchronisées avec succès !`)
  console.log('🏁 Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
