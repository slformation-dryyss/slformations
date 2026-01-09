
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = "slformation7@gmail.com"; // Email from your screenshot

  console.log(`🔍 Recherche de l'utilisateur ${email}...`);

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    console.error("❌ Utilisateur introuvable en base. Connecte-toi au moins une fois sur le site.");
    return;
  }

  console.log(`✅ Utilisateur trouvé : ${user.name} (Rôle actuel: ${user.role})`);

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { role: 'OWNER' },
  });

  console.log(`🎉 SUCCÈS ! L'utilisateur est maintenant : ${updated.role}`);
  console.log("👉 Tu peux retourner sur /admin (rafraîchis la page).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
