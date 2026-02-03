import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createContactMessage } from "@/lib/contact-store";
import { sendEmail } from "@/lib/email";
import { renderAdminContactEmail, renderUserAutoReplyEmail } from "@/emails/contact-templates";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, subject, message, profile } = body ?? {};

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
        html: renderAdminContactEmail({ name, email, phone, subject, message, profile })
      });
    } catch (emailError) {
      console.error("❌ Failed to send ADMIN email:", emailError);
    }

    // 3. Envoyer un accusé de réception au client
    try {
      await sendEmail({
        to: String(email),
        subject: `Confirmation de réception - SL Formations`,
        html: renderUserAutoReplyEmail(name, subject)
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

