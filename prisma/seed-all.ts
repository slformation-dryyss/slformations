import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...\n');

  const seedScripts = [
    'seed-permis.ts',
    'seed-vtc.ts',
    'seed-caces.ts',
    'seed-tech.ts',
    'seed-secourisme.ts',
    'seed-incendie.ts',
    'seed-habilitation-electrique.ts',
    'seed-recovery-points.ts',
    'seed-sessions.ts',
  ];

  for (const script of seedScripts) {
    try {
      console.log(`📦 Running ${script}...`);
      execSync(`npx tsx prisma/${script}`, { stdio: 'inherit' });
      console.log(`✅ ${script} completed\n`);
    } catch (error) {
      console.error(`❌ Error running ${script}:`, error);
    }
  }

  console.log('🎉 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
