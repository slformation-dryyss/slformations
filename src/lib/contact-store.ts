import { prisma } from "@/lib/prisma";

export interface ContactMessageData {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

/**
 * Enregistre un nouveau message de contact.
 */
export async function createContactMessage(data: ContactMessageData) {
  return prisma.contactMessage.create({
    data: {
      name: data.name.trim(),
      email: data.email.trim(),
      phone: data.phone?.trim(),
      subject: data.subject?.trim(),
      message: data.message.trim(),
    },
  });
}

