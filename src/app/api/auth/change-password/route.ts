
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

        const auth0User = session.user;
        const sub = auth0User.sub as string;

        // 2. Vérification compte social
        if (!sub.startsWith("auth0|")) {
            console.log("ℹ️ [AUTH] Social user detected, cannot create password ticket:", sub);
            const errorMsg = "Vous utilisez un compte externe (Google, etc.). Modifiez votre mot de passe sur leur plateforme.";
            return NextResponse.redirect(new URL(`/dashboard/change-password?error=${encodeURIComponent(errorMsg)}&social=1`, req.url));
        }

        // 3. Synchronisation/Vérification DB
        await getOrCreateUser(req);

        const origin = req.nextUrl.origin;
        const resultUrl = `${origin}/api/auth/password-changed-callback`;

        console.log("🔐 [AUTH] Creating password change ticket for:", sub);
        const ticketUrl = await createPasswordChangeTicket(sub, resultUrl);
        
        return NextResponse.redirect(new URL(ticketUrl));
    } catch (error: any) {
        console.error("❌ [AUTH] Change Password API Error:", error.message || error);
        
        const errorMessage = error.message?.includes("User does not exist") 
            ? "L'identifiant utilisateur n'est pas reconnu par Auth0."
            : "Une erreur technique est survenue.";

        return NextResponse.redirect(new URL(`/dashboard/change-password?error=${encodeURIComponent(errorMessage)}`, req.url));
    }
}

export async function POST(req: NextRequest) {
    return handlePasswordChange(req);
}

export async function GET(req: NextRequest) {
    return handlePasswordChange(req);
}
