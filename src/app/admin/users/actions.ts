
"use server";

import { requireOwner, requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateUserRoleAction(formData: FormData) {
  // STRICTLY OWNER ONLY: Promoting/Demoting users is sensitive
  await requireOwner();

  const userId = formData.get("userId") as string;
  const newRole = formData.get("role") as string;

  if (!userId || !newRole) {
    throw new Error("Missing required fields");
  }

  await prisma.user.update({
    where: { id: userId },
    data: { role: newRole },
  });

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
    select: { id: true, role: true }
  });

  if (!targetUser) {
    throw new Error("Utilisateur introuvable");
  }

  // 4. Permission Logic
  // OWNER can delete anyone (except self, checked above)
  // ADMIN can only delete INSTRUCTOR and STUDENT
  if (currentUser.role === "ADMIN") {
    if (targetUser.role !== "INSTRUCTOR" && targetUser.role !== "STUDENT") {
      throw new Error("Permission insuffisante : Un administrateur ne peut supprimer que les formateurs ou les élèves");
    }
  } else if (currentUser.role !== "OWNER") {
    // Should be redundant due to requireAdmin() but for safety:
    throw new Error("Permission refusée");
  }

  // 5. Delete from DB
  await prisma.user.delete({
    where: { id: userId }
  });

  revalidatePath("/admin/users");
}

