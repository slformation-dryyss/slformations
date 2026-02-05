
import { NextResponse, NextRequest } from "next/server";
import { getOrCreateUser } from "@/lib/auth";
import { triggerPasswordResetEmail } from "@/lib/auth0-mgmt";

import { auth0 } from "@/lib/auth0";

async function handlePasswordChange(req: NextRequest) {
    try {
        const session = await auth0.getSession(req);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const sub = session.user.sub as string;
        const email = session.user.email as string;
        console.log("🔍 [AUTH] Requesting password reset email for:", email);

        if (!sub.startsWith("auth0|")) {
            console.log("ℹ️ [AUTH] Social user detected - skipping reset email:", sub);
            const errorMsg = "Vous utilisez un compte externe (Google, etc.). Modifiez votre mot de passe sur leur plateforme.";
            return NextResponse.redirect(new URL(`/dashboard/change-password?error=${encodeURIComponent(errorMsg)}&social=1`, req.url));
        }

        await getOrCreateUser(req);

        console.log("📨 [AUTH] Triggering reset email for:", email);
        await triggerPasswordResetEmail(email);
        
        console.log("✅ [AUTH] Reset email triggered successfully");
        const successMsg = "Un email de réinitialisation vous a été envoyé. Consultez votre boîte de réception.";
        return NextResponse.redirect(new URL(`/dashboard/change-password?success=${encodeURIComponent(successMsg)}`, req.url));
    } catch (error: any) {
        console.error("❌ [AUTH] Global failure in change-password:", error);
        const errorMessage = `Erreur: ${error.message || "Inconnue"}`;
        return NextResponse.redirect(new URL(`/dashboard/change-password?error=${encodeURIComponent(errorMessage)}`, req.url));
    }
}

export async function POST(req: NextRequest) {
    return handlePasswordChange(req);
}

export async function GET(req: NextRequest) {
    return handlePasswordChange(req);
}
