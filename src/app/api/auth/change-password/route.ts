
import { NextResponse, NextRequest } from "next/server";
import { getOrCreateUser } from "@/lib/auth";
import { createPasswordChangeTicket } from "@/lib/auth0-mgmt";

import { auth0 } from "@/lib/auth0";

async function handlePasswordChange(req: NextRequest) {
    try {
        // 1. Récupérer la session brute pour avoir le 'sub' le plus fiable
        const session = await auth0.getSession(req);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const sub = session.user.sub as string;
        console.log("🔍 [AUTH] Change attempt for sub:", sub);

        // 2. Vérification compte social
        if (!sub.startsWith("auth0|")) {
            console.log("ℹ️ [AUTH] Social user detected - skipping ticket:", sub);
            const errorMsg = "Vous utilisez un compte externe (Google, etc.). Modifiez votre mot de passe sur leur plateforme.";
            return NextResponse.redirect(new URL(`/dashboard/change-password?error=${encodeURIComponent(errorMsg)}&social=1`, req.url));
        }

        // 3. Synchronisation DB
        const dbUser = await getOrCreateUser(req);
        console.log("👤 [AUTH] Database user matched:", dbUser?.id);

        const origin = req.nextUrl.origin;
        const resultUrl = `${origin}/api/auth/password-changed-callback`;

        console.log("🔐 [AUTH] Creating ticket with resultUrl:", resultUrl);
        const ticketUrl = await createPasswordChangeTicket(sub, resultUrl);
        
        console.log("✅ [AUTH] Ticket created successfully, redirecting...");
        return NextResponse.redirect(new URL(ticketUrl));
    } catch (error: any) {
        console.error("❌ [AUTH] Global failure in change-password:", error);
        
        const errorMessage = error.message?.includes("User does not exist") 
            ? "L'identifiant utilisateur n'est pas reconnu par Auth0."
            : `Erreur: ${error.message || "Inconnue"}`;

        return NextResponse.redirect(new URL(`/dashboard/change-password?error=${encodeURIComponent(errorMessage)}`, req.url));
    }
}

export async function POST(req: NextRequest) {
    return handlePasswordChange(req);
}

export async function GET(req: NextRequest) {
    return handlePasswordChange(req);
}
