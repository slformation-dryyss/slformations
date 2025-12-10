import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { withMiddlewareAuthRequired } from "@auth0/nextjs-auth0/edge";

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirection publique : /formations -> /formations/catalogue
  if (pathname === "/formations") {
    const url = request.nextUrl.clone();
    url.pathname = "/formations/catalogue";
    return NextResponse.redirect(url);
  }

  // Protection Auth0 pour les zones privées : tout l'espace élève vit sous /dashboard
  if (pathname.startsWith("/dashboard")) {
    console.log(`[Middleware] 🔒 Tentative d'accès à la zone protégée : ${pathname}`);

    // On utilise la version Edge de getSession
    const { getSession } = await import("@auth0/nextjs-auth0/edge");

    // withMiddlewareAuthRequired protège la route (redirection login si non connecté)
    // et injecte la session si on fournit une fonction.
    const authMiddleware = withMiddlewareAuthRequired(async (req) => {
      const res = NextResponse.next();
      const session = await getSession(req, res);
      
      const user = session?.user;
      const isVerifyPage = req.nextUrl.pathname === "/dashboard/verify-email";
      const isVerified = user?.email_verified;

      console.log(`[Middleware] Session trouvée pour : ${user?.email || "Inconnu"}`);
      console.log(`[Middleware] Email vérifié : ${isVerified}, Page actuelle : ${req.nextUrl.pathname}`);

      // 1. Si non vérifié et tente d'accéder à autre chose que la page de verif
      if (!isVerified && !isVerifyPage) {
        console.warn(`[Middleware] ⛔ Accès refusé (Email non vérifié) -> Redirection /dashboard/verify-email`);
        const url = req.nextUrl.clone();
        url.pathname = "/dashboard/verify-email";
        return NextResponse.redirect(url);
      }

      // 2. Si déjà vérifié et tente d'accéder à la page de verif (optionnel mais plus propre)
      if (isVerified && isVerifyPage) {
        console.log(`[Middleware] ✅ Déjà vérifié, inutile de rester sur verify-email -> Redirection /dashboard`);
        const url = req.nextUrl.clone();
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
      }

      console.log(`[Middleware] ✅ Accès autorisé à ${pathname}`);
      return res;
    });

    return authMiddleware(request, {} as any);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/formations",
    "/dashboard/:path*",
  ],
};
