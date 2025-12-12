import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth0 } from "./lib/auth0";

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

    // Auth0 v4: Récupération de la session via le client Edge-compatible
    const session = await auth0.getSession(request);

    // Si pas de session, redirection vers Login
    if (!session) {
      console.log(`[Middleware] ⛔ Pas de session -> Redirection Login`);
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/api/auth/login";
      loginUrl.searchParams.set("returnTo", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const user = session.user;
    const isVerifyPage = request.nextUrl.pathname === "/dashboard/verify-email";
    const isVerified = user?.email_verified;

    console.log(`[Middleware] Session trouvée pour : ${user?.email || "Inconnu"}`);
    console.log(`[Middleware] Email vérifié : ${isVerified}, Page actuelle : ${request.nextUrl.pathname}`);

    // 1. Si non vérifié et tente d'accéder à autre chose que la page de verif
    if (!isVerified && !isVerifyPage) {
      console.warn(`[Middleware] ⛔ Accès refusé (Email non vérifié) -> Redirection /dashboard/verify-email`);
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard/verify-email";
      return NextResponse.redirect(url);
    }

    // 2. Si déjà vérifié et tente d'accéder à la page de verif (optionnel mais plus propre)
    if (isVerified && isVerifyPage) {
      console.log(`[Middleware] ✅ Déjà vérifié, inutile de rester sur verify-email -> Redirection /dashboard`);
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }

    console.log(`[Middleware] ✅ Accès autorisé à ${pathname}`);
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/formations",
    "/dashboard/:path*",
  ],
};
