import { Resend } from 'resend';
import { generateInvoice } from '@/lib/pdf/invoices';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EnrollmentEmailData {
  userName: string;
  userEmail: string;
  courseTitle: string;
  courseSlug: string;
  enrollmentDate: string;
}

interface QuizResultEmailData {
  userName: string;
  userEmail: string;
  quizTitle: string;
  score: number;
  isPassed: boolean;
  passingScore: number;
  courseSlug: string;
}

interface CertificateEmailData {
  userName: string;
  userEmail: string;
  courseTitle: string;
  certificateUrl: string;
}

export async function sendEnrollmentConfirmation(data: EnrollmentEmailData) {
  try {
    const { data: emailData, error } = await resend.emails.send({
      from: 'SL Formations <info@sl-formations.fr>',
      to: [data.userEmail],
      subject: `Confirmation d'inscription - ${data.courseTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #334155; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1e293b 0%, #334155 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e2e8f0; border-top: none; }
            .button { display: inline-block; background: #eab308; color: #1e293b; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #64748b; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">Bienvenue chez SL Formations !</h1>
            </div>
            <div class="content">
              <p>Bonjour <strong>${data.userName}</strong>,</p>
              
              <p>Nous avons le plaisir de confirmer votre inscription à la formation :</p>
              
              <h2 style="color: #eab308; margin: 20px 0;">${data.courseTitle}</h2>
              
              <p>Date d'inscription : ${data.enrollmentDate}</p>
              
              <p>Vous pouvez dès maintenant accéder à votre espace de formation et commencer votre parcours d'apprentissage.</p>
              
              <div style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/learn/${data.courseSlug}" class="button">
                  Accéder à ma formation
                </a>
              </div>
              
              <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 14px; color: #64748b;">
                <strong>Besoin d'aide ?</strong><br>
                Notre équipe est à votre disposition : <a href="mailto:info@sl-formations.fr">info@sl-formations.fr</a>
              </p>
            </div>
            <div class="footer">
              <p>SL FORMATIONS - Organisme de formation enregistré sous le numéro 11 75 XXXXX 75</p>
              <p>123 Avenue de Paris, 75001 Paris - SIRET: 123 456 789 00012</p>
            </div>
          </div>
        </body>
        </html>
      `
    });

    if (error) {
      console.error('Email sending error:', error);
      return { success: false, error };
    }

    return { success: true, data: emailData };
  } catch (error) {
    console.error('Email sending exception:', error);
    return { success: false, error };
  }
}

export async function sendQuizResult(data: QuizResultEmailData) {
  const resultMessage = data.isPassed
    ? `<p style="color: #10b981; font-weight: bold; font-size: 18px;">✓ Félicitations ! Vous avez réussi l'évaluation.</p>`
    : `<p style="color: #ef4444; font-weight: bold; font-size: 18px;">Vous n'avez pas atteint le score minimum requis.</p>`;

  try {
    const { data: emailData, error } = await resend.emails.send({
      from: 'SL Formations <info@sl-formations.fr>',
      to: [data.userEmail],
      subject: `Résultats de l'évaluation - ${data.quizTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #334155; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1e293b 0%, #334155 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e2e8f0; border-top: none; }
            .score-box { background: #f8fafc; border: 2px solid #eab308; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #64748b; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">Résultats de votre évaluation</h1>
            </div>
            <div class="content">
              <p>Bonjour <strong>${data.userName}</strong>,</p>
              
              <p>Vous avez terminé l'évaluation : <strong>${data.quizTitle}</strong></p>
              
              <div class="score-box">
                <h2 style="margin: 0 0 10px 0; color: #1e293b;">Votre score</h2>
                <p style="font-size: 48px; font-weight: bold; margin: 10px 0; color: #eab308;">${data.score}%</p>
                <p style="margin: 0; color: #64748b;">Score minimum requis : ${data.passingScore}%</p>
              </div>
              
              ${resultMessage}
              
              ${!data.isPassed ? `
                <p>Nous vous encourageons à revoir le contenu du module et à retenter l'évaluation.</p>
                <div style="text-align: center;">
                  <a href="${process.env.NEXT_PUBLIC_APP_URL}/learn/${data.courseSlug}" style="display: inline-block; background: #eab308; color: #1e293b; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0;">
                    Retourner au cours
                  </a>
                </div>
              ` : ''}
            </div>
            <div class="footer">
              <p>SL FORMATIONS - Organisme de formation enregistré sous le numéro 11 75 XXXXX 75</p>
            </div>
          </div>
        </body>
        </html>
      `
    });

    if (error) {
      console.error('Email sending error:', error);
      return { success: false, error };
    }

    return { success: true, data: emailData };
  } catch (error) {
    console.error('Email sending exception:', error);
    return { success: false, error };
  }
}

export async function sendCertificate(data: CertificateEmailData) {
  try {
    const { data: emailData, error } = await resend.emails.send({
      from: 'SL Formations <info@sl-formations.fr>',
      to: [data.userEmail],
      subject: `Votre attestation de formation - ${data.courseTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #334155; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1e293b 0%, #334155 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e2e8f0; border-top: none; }
            .button { display: inline-block; background: #eab308; color: #1e293b; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #64748b; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">🎓 Félicitations !</h1>
            </div>
            <div class="content">
              <p>Bonjour <strong>${data.userName}</strong>,</p>
              
              <p>Toutes nos félicitations pour avoir terminé avec succès la formation :</p>
              
              <h2 style="color: #eab308; margin: 20px 0;">${data.courseTitle}</h2>
              
              <p>Votre attestation de fin de formation est maintenant disponible.</p>
              
              <div style="text-align: center;">
                <a href="${data.certificateUrl}" class="button">
                  📄 Télécharger mon attestation
                </a>
              </div>
              
              <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 14px; color: #64748b;">
                Ce document officiel atteste de votre participation et de votre réussite à cette formation professionnelle.
              </p>
            </div>
            <div class="footer">
              <p>SL FORMATIONS - Organisme de formation enregistré sous le numéro 11 75 XXXXX 75</p>
              <p>123 Avenue de Paris, 75001 Paris - SIRET: 123 456 789 00012</p>
            </div>
          </div>
        </body>
        </html>
      `
    });

    if (error) {
      console.error('Email sending error:', error);
      return { success: false, error };
    }

    return { success: true, data: emailData };
  } catch (error) {
    console.error('Email sending exception:', error);
    return { success: false, error };
  }
}

export async function sendInvoice(data: any, userEmail: string) {
  try {
    const doc = generateInvoice(data);
    const pdfBase64 = doc.output('datauristring').split(',')[1];

    const { data: emailData, error } = await resend.emails.send({
      from: 'SL Formations <info@sl-formations.fr>',
      to: [userEmail],
      subject: `Votre facture - ${data.invoiceNumber}`,
      attachments: [
        {
          filename: `facture-${data.invoiceNumber}.pdf`,
          content: pdfBase64,
        },
      ],
      html: `
        <div style="font-family: sans-serif; color: #1e293b;">
          <h2 style="color: #eab308;">Merci pour votre confiance !</h2>
          <p>Bonjour,</p>
          <p>Vous trouverez ci-joint la facture relative à votre inscription à la formation : <strong>${data.items[0].description}</strong>.</p>
          <p>Votre règlement a bien été pris en compte.</p>
          <p>À bientôt sur votre espace de formation !</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="font-size: 12px; color: #64748b;">SL FORMATIONS - Organisme de formation</p>
        </div>
      `,
    });

    if (error) {
      console.error('Email sending error:', error);
      return { success: false, error };
    }

    return { success: true, data: emailData };
  } catch (error) {
    console.error('Email sending exception:', error);
    return { success: false, error };
  }
}

