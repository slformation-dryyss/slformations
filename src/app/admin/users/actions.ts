
"use server";

import { requireOwner, requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createAuth0User } from "@/lib/auth0-mgmt";
import { sendEmail } from "@/lib/email";
import { renderWelcomeEmail } from "@/emails/user-onboarding-templates";

export async function createUserAction(formData: {
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}) {
  await requireAdmin();

  const { email, firstName, lastName, roles } = formData;

  if (!email || !firstName || !lastName || !roles || roles.length === 0) {
    throw new Error("Tous les champs sont obligatoires");
  }

  // 1. Check if user already exists
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error("Un utilisateur avec cet email existe déjà");
  }

  // 2. Generate temporary password
  const tempPassword = Math.random().toString(36).slice(-10) + "A1!";

  // 3. Create in Auth0
  let auth0User;
  try {
    auth0User = await createAuth0User({
      email,
      firstName,
      lastName,
      password: tempPassword
    });
  } catch (error: any) {
    throw new Error(`Erreur Auth0: ${error.message}`);
  }

  const auth0Id = auth0User.user_id;

  // 4. Create in Prisma
  const rolePriority = ["OWNER", "ADMIN", "SECRETARY", "TEACHER", "INSTRUCTOR", "STUDENT"];
  const primaryRole = [...roles].sort((a, b) =>
    rolePriority.indexOf(a) - rolePriority.indexOf(b)
  )[0] || "STUDENT";

  const user = await prisma.user.create({
    data: {
      email,
      firstName,
      lastName,
      name: `${firstName} ${lastName}`,
      auth0Id,
      roles,
      primaryRole,
      role: primaryRole,
      mustChangePassword: true,
      onboardingStatus: "NEW",
    }
  });

  // 5. Send Welcome Email
  try {
    await sendEmail({
      to: email,
      subject: "Bienvenue chez SL Formations - Vos accès",
      html: renderWelcomeEmail({ firstName, email, password: tempPassword })
    });
  } catch (emailError) {
    console.error("Failed to send welcome email:", emailError);
    // On ne fait pas échouer l'action si seul le mail échoue, mais l'admin devra fournir le MDP manuellement
  }

  revalidatePath("/admin/users");
  return user;
}


export async function updateUserRolesAction(userId: string, newRoles: string[]) {
  // STRICTLY OWNER ONLY: Promoting/Demoting users is sensitive
  await requireOwner();

  if (!userId || !newRoles || newRoles.length === 0) {
    throw new Error("Missing required fields");
  }

  // Déterminer le rôle principal (le plus élevé)
  const rolePriority = ["OWNER", "ADMIN", "SECRETARY", "TEACHER", "INSTRUCTOR", "STUDENT"];
  const primaryRole = [...newRoles].sort((a, b) =>
    rolePriority.indexOf(a) - rolePriority.indexOf(b)
  )[0] || "STUDENT";

  await prisma.user.update({
    where: { id: userId },
    data: {
      roles: newRoles,
      primaryRole: primaryRole,
      role: primaryRole // Legacy support
    },
  });

  // Créer/Mettre à jour les profils nécessaires
  if (newRoles.includes("TEACHER")) {
    await prisma.teacherProfile.upsert({
      where: { userId },
      create: {
        userId,
        city: "À définir",
        department: "À définir"
      },
      update: {}, // On ne touche pas s'il existe déjà
    });
  }

  if (newRoles.includes("INSTRUCTOR")) {
    await prisma.instructorProfile.upsert({
      where: { userId },
      create: {
        userId,
        city: "À définir",
        department: "À définir"
      },
      update: {},
    });
  }

  revalidatePath("/admin/users");
}

export async function deleteUserAction(userId: string) {
  // 1. Get current user & ensure they are at least ADMIN
  const currentUser = await requireAdmin();

  if (!userId) {
    throw new Error("ID de l'utilisateur manquant");
  }

  // 2. Prevent self-deletion
  if (currentUser.id === userId) {
    throw new Error("Vous ne pouvez pas supprimer votre propre compte");
  }

  // 3. Find target user
  const targetUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true, roles: true }
  });

  if (!targetUser) {
    throw new Error("Utilisateur introuvable");
  }

  // 4. Permission Logic
  // OWNER can delete anyone (except self, checked above)
  // ADMIN can only delete INSTRUCTOR/TEACHER and STUDENT
  const isOwner = currentUser.role === "OWNER" || (currentUser.roles && currentUser.roles.includes("OWNER"));

  if (!isOwner) {
    // Current user is ADMIN (guaranteed by requireAdmin)
    const targetIsAdmin = targetUser.role === "ADMIN" || (targetUser.roles && targetUser.roles.includes("ADMIN"));
    const targetIsOwner = targetUser.role === "OWNER" || (targetUser.roles && targetUser.roles.includes("OWNER"));

    if (targetIsAdmin || targetIsOwner) {
      throw new Error("Permission insuffisante : Un administrateur ne peut pas supprimer un autre administrateur ou propriétaire");
    }
  }

  // 5. Delete from DB
  await prisma.user.delete({
    where: { id: userId }
  });

  revalidatePath("/admin/users");
}

