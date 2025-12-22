
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
