import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createContactMessage } from "@/lib/contact-store";
import { sendEmail } from "@/lib/email";

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
    
    // NOUVEAU: Envoyer un mail à l'admin pour le prévenir
    try {
      await sendEmail({
        to: "info@sl-formations.fr", // L'adresse de réception admin
        subject: `[Nouveau Contact] ${subject || "Demande d'informations"}`,
        html: `
          <div style="font-family: sans-serif; color: #1e293b;">
            <h2 style="color: #eab308;">Nouveau message reçu</h2>
            <p><strong>De :</strong> ${name} (<a href="mailto:${email}">${email}</a>)</p>
            <p><strong>Téléphone :</strong> ${phone || "Non renseigné"}</p>
            <p><strong>Sujet :</strong> ${subject || "Renseignements"}</p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
        `
      });
    } catch (emailError) {
      console.error("Failed to send notification email to admin:", emailError);
      // On ne bloque pas la réponse client si seul l'email échoue
    }

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

