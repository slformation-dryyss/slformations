
import { Resend } from 'resend';
import { prisma } from '@/lib/prisma';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailPayload) {
  let fromName = "SL Formations";
  let fromAddress = "ne-pas-repondre@sl-formations.fr";

  try {
    // Fetch settings dynamically
    const settingsList = await prisma.systemSetting.findMany({
      where: { key: { in: ["MAIL_FROM_NAME", "MAIL_FROM_ADDRESS"] } }
    });
    const settings = settingsList.reduce((acc, curr) => { acc[curr.key] = curr.value; return acc; }, {} as Record<string, string>);

    if (settings["MAIL_FROM_NAME"]) fromName = settings["MAIL_FROM_NAME"];
    if (settings["MAIL_FROM_ADDRESS"]) fromAddress = settings["MAIL_FROM_ADDRESS"];
  } catch (error) {
    console.warn("⚠️ Could not fetch email settings from DB (using defaults):", error);
  }

  if (!resend) {
    console.log("--------------------------------------------------");
    console.log("⚠️ RESEND_API_KEY MOCK MODE (Key missing)");
    console.log(`FROM: ${fromName} <${fromAddress}>`);
    console.log(`TO: ${to}`);
    console.log(`SUBJECT: ${subject}`);
    console.log("--------------------------------------------------");
    return { success: true, id: 'mock-id' };
  }

  try {
    const data = await resend.emails.send({
      from: `${fromName} <${fromAddress}>`,
      to,
      subject,
      html,
    });
    return { success: true, data };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error };
  }
}

export function generateReminderEmailHtml(studentName: string, session: { courseTitle: string, start: Date, isRemote: boolean, location?: string, link?: string }) {
  const dateStr = session.start.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });

  return `
    <div style="font-family: sans-serif; color: #334155;">
        <h2>Rappel de formation : ${session.courseTitle}</h2>
        <p>Bonjour ${studentName},</p>
        <p>Votre session de formation commencera bientôt :</p>
        <p><strong>Date :</strong> ${dateStr}</p>
        ${session.isRemote
      ? `<p><strong>Format :</strong> Distanciel (Visioconférence)</p>
               <p><strong>Lien de connexion :</strong> <a href="${session.link}">${session.link}</a></p>
               <p><em>Pensez à vous connecter 5-10 minutes à l'avance.</em></p>`
      : `<p><strong>Format :</strong> Présentiel</p>
               <p><strong>Lien :</strong> ${session.location}</p>`
    }
        <br/>
        <p>Cordialement,<br/>L'équipe SL Formations</p>
    </div>
    `;
}

