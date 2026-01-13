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
        subject: `[Contact Site] ${subject || "Demande d'informations"} - ${name}`,
        html: `
          <div style="font-family: sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
            <div style="background-color: #f8fafc; padding: 20px; border-bottom: 1px solid #e2e8f0;">
              <h2 style="color: #eab308; margin: 0;">Nouveau message reçu</h2>
            </div>
            <div style="padding: 20px;">
              <p style="margin: 0 0 10px 0;"><strong>Expéditeur :</strong> ${name}</p>
              <p style="margin: 0 0 10px 0;"><strong>Email :</strong> <a href="mailto:${email}" style="color: #3b82f6;">${email}</a></p>
              <p style="margin: 0 0 10px 0;"><strong>Téléphone :</strong> ${phone || "Non renseigné"}</p>
              <p style="margin: 0 0 10px 0;"><strong>Sujet :</strong> ${subject || "Renseignements"}</p>
              <div style="margin: 20px 0; padding: 15px; background-color: #f1f5f9; border-radius: 8px; white-space: pre-wrap;">${message}</div>
            </div>
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

