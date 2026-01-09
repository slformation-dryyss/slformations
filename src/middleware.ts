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

  // Laisser Auth0 gérer ses propres routes via son middleware interne
  if (pathname.startsWith("/api/auth")) {
    return auth0.middleware(request);
  }

  // Protection Auth0 pour les zones privées : tout l'espace élève vit sous /dashboard
  if (pathname.startsWith("/dashboard")) {


    // Auth0 v4: Récupération de la session via le client Edge-compatible
    try {
      // DEBUG: Log request details
      console.log(`[Middleware] Processing request for: ${pathname}`);
      
      const session = await auth0.getSession(request);
      console.log(`[Middleware] Session found: ${!!session}`);

      // Prioritize AUTH0_BASE_URL as it is reliable in server environment.
      // Fallback to NEXT_PUBLIC_APP_URL, then origin.
      const appUrl = process.env.AUTH0_BASE_URL || process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
      console.log(`[Middleware] Using AppURL: ${appUrl}`);

      // Si pas de session, redirection vers Login
      if (!session) {
        console.log(`[Middleware] No session, redirecting to login...`);
        const loginUrl = new URL("/api/auth/login", appUrl);
        loginUrl.searchParams.set("returnTo", "/dashboard");
        return NextResponse.redirect(loginUrl);
      }

      const user = session.user;
      const isVerifyPage = request.nextUrl.pathname === "/dashboard/verify-email";
      const isVerified = user?.email_verified;

      // 1. Si non vérifié et tente d'accéder à autre chose que la page de verif
      if (!isVerified && !isVerifyPage) {
        console.log(`[Middleware] User not verified, redirecting to verify-email`);
        const url = new URL("/dashboard/verify-email", appUrl);
        return NextResponse.redirect(url);
      }

      // 2. Si déjà vérifié et tente d'accéder à la page de verif (optionnel mais plus propre)
      if (isVerified && isVerifyPage) {
        const url = new URL("/dashboard", appUrl);
        return NextResponse.redirect(url);
      }

      return NextResponse.next();
    } catch (error) {
      // Si erreur lors de getSession (ex: session en cours de création après callback),
      // laisser passer pour éviter la boucle de redirection
      console.error(`[Middleware] Erreur getSession:`, error);
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/formations",
    "/dashboard/:path*",
  ],
};

