
import { Resend } from 'resend';
import { prisma } from '@/lib/prisma';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailPayload) {
  // Fetch settings dynamically
  const settingsList = await prisma.systemSetting.findMany({
      where: { key: { in: ["MAIL_FROM_NAME", "MAIL_FROM_ADDRESS"] } }
  });
  const settings = settingsList.reduce((acc, curr) => { acc[curr.key] = curr.value; return acc; }, {} as Record<string, string>);
  
  const fromName = settings["MAIL_FROM_NAME"] || "SL Formations";
  const fromAddress = settings["MAIL_FROM_ADDRESS"] || "ne-pas-repondre@sl-formations.fr";

  if (!resend) {
    console.log("⚠️ RESEND_API_KEY missing. Mocking email send:");
    console.log(`From: ${fromName} <${fromAddress}>`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    // console.log(`HTML: ${html}`);
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

