
import { baseLayout } from "./contact-templates";

/**
 * Template for the welcome email sent to manually created users.
 */
export function renderWelcomeEmail(data: { firstName: string; email: string; password?: string }) {
    const content = `
    <h2 style="color: #0f172a;">Bienvenue chez <span style="color: #eab308;">SL Formations</span></h2>
    <p>Bonjour ${data.firstName},</p>
    <p>Un compte utilisateur a été créé pour vous par l'administration de SL Formations.</p>
    
    <div style="background-color: #f8fafc; padding: 25px; border-radius: 12px; border: 1px solid #e2e8f0; margin: 25px 0;">
      <p style="margin: 0 0 10px 0;"><strong>Identifiant :</strong> ${data.email}</p>
      ${data.password ? `<p style="margin: 0 0 10px 0;"><strong>Mot de passe provisoire :</strong> <code style="background: #fff; padding: 2px 6px; border-radius: 4px; border: 1px solid #cbd5e1;">${data.password}</code></p>` : ''}
    </div>
    
    <p>Pour votre sécurité, il vous sera demandé de <strong>changer votre mot de passe</strong> lors de votre première connexion.</p>
    
    <div style="text-align: center; margin: 35px 0;">
      <a href="https://sl-formations.fr/api/auth/login" style="display: inline-block; padding: 14px 32px; background-color: #eab308; color: #0f172a; text-decoration: none; border-radius: 10px; font-weight: 800; font-size: 16px;">Se connecter à mon espace</a>
    </div>
    
    <div style="border-top: 1px solid #e2e8f0; margin: 30px 0; padding-top: 20px;">
      <p style="font-size: 14px; color: #64748b;">Si vous avez des questions sur l'utilisation de la plateforme ou sur votre formation, notre équipe est à votre disposition.</p>
    </div>
    
    <p>À très bientôt,<br/><strong>L'équipe SL Formations</strong></p>
  `;

    return baseLayout(content, `Votre compte SL Formations est prêt !`);
}
