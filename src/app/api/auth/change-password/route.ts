
import { NextResponse, NextRequest } from "next/server";
import { getOrCreateUser } from "@/lib/auth";
import { createPasswordChangeTicket } from "@/lib/auth0-mgmt";

async function handlePasswordChange(req: NextRequest) {
    try {
        const user = await getOrCreateUser(req);

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const origin = req.nextUrl.origin;
        const resultUrl = `${origin}/api/auth/password-changed-callback`;

        console.log("🔐 [AUTH] Creating password change ticket for:", user.auth0Id);
        const ticketUrl = await createPasswordChangeTicket(user.auth0Id, resultUrl);
        
        return NextResponse.redirect(new URL(ticketUrl));
    } catch (error: any) {
        console.error("❌ [AUTH] Change Password API Error:", error.message || error);
        return NextResponse.json({ 
            error: "Erreur technique lors de la génération du lien.",
            details: error.message 
        }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    return handlePasswordChange(req);
}

export async function GET(req: NextRequest) {
    return handlePasswordChange(req);
}
