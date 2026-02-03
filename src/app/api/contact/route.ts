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

    // 1. Sauvegarde en base de données (Non bloquant)
    try {
      await createContactMessage({
        name: String(name),
        email: String(email),
        phone: phone ? String(phone) : undefined,
        subject: subject ? String(subject) : undefined,
        message: String(message),
      });
    } catch (dbError) {
      console.error("⚠️ DB Error (Contact Message not saved):", dbError);
      // On continue pour envoyer les mails même si la DB est down
    }

    // 2. Envoyer un mail à l'admin
    try {
      await sendEmail({
        to: "info@sl-formations.fr",
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
            <div style="background-color: #f8fafc; padding: 15px; text-align: center; font-size: 12px; color: #64748b;">
               ce message a été envoyé depuis le formulaire de contact du site.
            </div>
          </div>
        `
      });
    } catch (emailError) {
      console.error("❌ Failed to send ADMIN email:", emailError);
    }

    // 3. Envoyer un accusé de réception au client
    try {
      const firstName = String(name).split(' ')[0];
      await sendEmail({
        to: String(email),
        subject: `Confirmation de réception - SL Formations`,
        html: `
          <div style="font-family: sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto;">
            <p>Bonjour ${firstName},</p>
            <p>Nous avons bien reçu votre message concernant "<strong>${subject || "Votre demande"}</strong>".</p>
            <p>Notre équipe va traiter votre demande et reviendra vers vous sous 24h ouvrées.</p>
            <br/>
            <p>En attendant, n'hésitez pas à consulter <a href="https://sl-formations.fr/formations/catalogue">notre catalogue de formations</a>.</p>
            <br/>
            <p>Cordialement,<br/><strong>L'équipe SL Formations</strong></p>
            <p style="font-size: 12px; color: #94a3b8; margin-top: 20px;">Ceci est un message automatique, merci de ne pas y répondre.</p>
          </div>
        `
      });
    } catch (autoReplyError) {
      console.error("❌ Failed to send AUTO-REPLY email:", autoReplyError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("🔥 Critical Error handling contact form:", error);
    // Même en cas d'erreur critique, on essaie de renvoyer un statut 500 propre
    return NextResponse.json(
      { error: "Une erreur technique est survenue, mais nous avons peut-être reçu votre message." },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";

