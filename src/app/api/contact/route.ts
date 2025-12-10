import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createContactMessage } from "@/lib/contact-store";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, subject, message } = body ?? {};

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Les champs nom, email et message sont obligatoires." },
        { status: 400 }
      );
    }

    await createContactMessage({
      name: String(name),
      email: String(email),
      phone: phone ? String(phone) : undefined,
      subject: subject ? String(subject) : undefined,
      message: String(message),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error handling contact form:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi du message." },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
