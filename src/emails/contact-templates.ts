
const BRAND_COLOR = "#eab308"; // gold-500
const NAVY_COLOR = "#0f172a"; // navy-900
const TEXT_COLOR = "#1e293b"; // slate-800

/**
 * Base layout for all SL Formations emails.
 */
export function baseLayout(content: string, previewText?: string) {
    return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>SL Formations</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; color: ${TEXT_COLOR}; }
        .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
        .header { background-color: ${NAVY_COLOR}; padding: 30px; text-align: center; }
        .logo { color: ${BRAND_COLOR}; font-size: 24px; font-weight: 800; text-decoration: none; text-transform: uppercase; letter-spacing: 2px; }
        .content { padding: 40px 30px; line-height: 1.6; }
        .footer { background-color: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
        .button { display: inline-block; padding: 12px 24px; background-color: ${BRAND_COLOR}; color: ${NAVY_COLOR} !important; text-decoration: none; border-radius: 8px; font-weight: 700; margin-top: 20px; }
        .divider { border-top: 1px solid #e2e8f0; margin: 30px 0; }
        h1, h2 { color: ${NAVY_COLOR}; margin-top: 0; }
        .highlight { color: ${BRAND_COLOR}; font-weight: bold; }
      </style>
    </head>
    <body>
      ${previewText ? `<div style="display: none; max-height: 0px; overflow: hidden;">${previewText}</div>` : ''}
      <div class="container">
        <div class="header">
          <a href="https://sl-formations.fr" style="display: inline-block;">
            <img src="https://sl-formations.fr/LOGO.png" alt="SL Formations" style="height: 60px; width: auto; display: block; margin: 0 auto;" />
          </a>
        </div>
        <div class="content">
          ${content}
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} SL Formations. Tous droits réservés.</p>
          <p>Centre de formation certifié Qualiopi</p>
          <p>77181 Courtry, France | 01 60 28 54 18</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function renderAdminContactEmail(data: { name: string, email: string, phone?: string, subject?: string, message: string, profile?: string }) {
    const content = `
    <h2 style="color: ${BRAND_COLOR};">Nouveau message reçu</h2>
    <p>Une nouvelle demande de contact vient d'être soumise via le site web.</p>
    
    <div style="background-color: #f8fafc; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0;">
      <p style="margin: 0 0 10px 0;"><strong>Expéditeur :</strong> ${data.name}</p>
      <p style="margin: 0 0 10px 0;"><strong>Profil :</strong> ${data.profile || "Non précisé"}</p>
      <p style="margin: 0 0 10px 0;"><strong>Email :</strong> <a href="mailto:${data.email}" style="color: #3b82f6;">${data.email}</a></p>
      <p style="margin: 0 0 10px 0;"><strong>Téléphone :</strong> ${data.phone || "Non renseigné"}</p>
      <p style="margin: 0 0 10px 0;"><strong>Sujet :</strong> ${data.subject || "Demande d'informations"}</p>
      
      <div class="divider"></div>
      
      <p style="font-weight: bold; margin-bottom: 5px;">Message :</p>
      <div style="white-space: pre-wrap; color: ${TEXT_COLOR}; font-style: italic;">${data.message}</div>
    </div>
    
    <div style="text-align: center;">
      <a href="mailto:${data.email}" class="button">Répondre au client</a>
    </div>
  `;

    return baseLayout(content, `Nouveau message de ${data.name} - ${data.subject}`);
}

export function renderUserAutoReplyEmail(name: string, subject: string) {
    const firstName = name.split(' ')[0];
    const content = `
    <h2>Bonjour ${firstName},</h2>
    <p>Nous avons bien reçu votre demande concernant <span class="highlight">"${subject || "votre projet de formation"}"</span>.</p>
    <p>Un conseiller de notre équipe va traiter votre message avec la plus grande attention et reviendra vers vous sous <span class="highlight">24h ouvrées</span>.</p>
    
    <div class="divider"></div>
    
    <h3>Accélérer votre dossier ?</h3>
    <p>Pour gagner du temps, vous pouvez préparer vos documents (permis, pièce d'identité) ou consulter nos programmes détaillés en ligne.</p>
    
    <div style="text-align: center;">
      <a href="https://sl-formations.fr/formations/catalogue" class="button">Voir le catalogue</a>
    </div>
    
    <p style="margin-top: 30px;">À très bientôt,<br/><strong>L'équipe SL Formations</strong></p>
  `;

    return baseLayout(content, `Confirmation de réception - SL Formations`);
}
