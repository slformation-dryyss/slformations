const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding ...')

  // 1. Créer un utilisateur admin/instructeur
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

  console.log(`Created user: ${instructor.name}`)

  // 2. Créer le cours VTC
  const vtcCourse = await prisma.course.upsert({
    where: { slug: 'formation-vtc-complete' },
    update: {},
    create: {
      title: 'Formation VTC Complète',
      slug: 'formation-vtc-complete',
      description: 'Devenez chauffeur VTC professionnel. Formation complète incluant la préparation aux examens théoriques et pratiques, la gestion d\'entreprise et la relation client.',
      price: 1499.00,
      type: 'VTC',
      isPublished: true,
      imageUrl: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop', // Image générique voiture
      modules: {
        create: [
          {
            title: 'Module 1 : Réglementation du Transport Public Particulier',
            position: 1,
            isPublished: true,
            lessons: {
              create: [
                {
                  title: 'Introduction au métier de VTC',
                  description: 'Comprendre les enjeux et le cadre légal.',
                  content: 'Le métier de VTC (Voiture de Transport avec Chauffeur) est réglementé...',
                  videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder
                  duration: 600,
                  position: 1,
                  isPublished: true,
                  isFree: true
                },
                {
                  title: 'Les obligations du chauffeur',
                  description: 'Documents, tenue, comportement.',
                  content: 'Tout chauffeur doit avoir sa carte professionnelle...',
                  duration: 900,
                  position: 2,
                  isPublished: true
                }
              ]
            }
          },
          {
            title: 'Module 2 : Sécurité Routière',
            position: 2,
            isPublished: true,
            lessons: {
              create: [
                {
                  title: 'Conduite rationnelle et sécurité',
                  description: 'Adopter une conduite souple et sûre.',
                  duration: 1200,
                  position: 1,
                  isPublished: true
                },
                {
                  title: 'Prise en charge des personnes à mobilité réduite',
                  description: 'Les bons gestes et attitudes.',
                  duration: 800,
                  position: 2,
                  isPublished: true
                }
              ]
            }
          },
          {
            title: 'Module 3 : Gestion et Développement Commercial',
            position: 3,
            isPublished: true,
            lessons: {
              create: [
                {
                  title: 'Créer sa structure juridique',
                  description: 'SASU, EURL ou Micro-entreprise ?',
                  duration: 1500,
                  position: 1,
                  isPublished: true
                },
                {
                  title: 'Fidéliser sa clientèle',
                  description: 'Techniques de marketing et service premium.',
                  duration: 1000,
                  position: 2,
                  isPublished: true
                }
              ]
            }
          }
        ]
      }
    },
  })

  console.log(`Created course: ${vtcCourse.title}`)

  // 3. Créer le cours Permis B (plus simple)
  const permisB = await prisma.course.upsert({
    where: { slug: 'permis-b-accelere' },
    update: {},
    create: {
      title: 'Permis B Accéléré',
      slug: 'permis-b-accelere',
      description: 'Passez votre permis de conduire en 30 jours. Code + Conduite intensive.',
      price: 1290.00,
      type: 'PERMIS_AUTO',
      isPublished: true,
      imageUrl: 'https://images.unsplash.com/photo-1580273916550-e323be2ed5fa?q=80&w=1964&auto=format&fit=crop',
      modules: {
        create: [
          {
            title: 'Code de la route : Les bases',
            position: 1,
            isPublished: true,
            lessons: {
              create: [
                {
                  title: 'La signalisation',
                  position: 1,
                  isPublished: true,
                  isFree: true
                },
                {
                  title: 'Les priorités',
                  position: 2,
                  isPublished: true
                }
              ]
            }
          }
        ]
      }
    }
  })

  console.log(`Created course: ${permisB.title}`)

  console.log('Seeding finished.')
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
