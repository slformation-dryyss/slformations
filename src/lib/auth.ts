import { getSession } from "@auth0/nextjs-auth0";
import { prisma } from "@/lib/prisma";

export async function getOrCreateUser() {
  const session = await getSession();
  if (!session?.user) {
    return null;
  }

  const { user: auth0User } = session;

  // On exige au minimum un email pour identifier l'utilisateur
  if (!auth0User.email) {
    throw new Error("User must have an email");
  }

  // Identifiant unique Auth0 (sub)
  const auth0Id = auth0User.sub;

  // On essaie d'abord de retrouver l'utilisateur via auth0Id,
  // puis on retombe sur l'email si besoin (pour les anciens comptes).
  let dbUser =
    (auth0Id
      ? await prisma.user.findUnique({
          where: { auth0Id },
        })
      : null) ||
    (await prisma.user.findUnique({
      where: { email: auth0User.email },
    }));

  // Si non trouvé, on le crée avec le rôle STUDENT par défaut
  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        auth0Id: auth0Id || auth0User.email, // fallback raisonnable si sub absent
        email: auth0User.email,
        name: auth0User.name || auth0User.nickname || "Utilisateur",
        role: "STUDENT", // rôle par défaut à l'inscription
      },
    });
  }

  return dbUser;
}
