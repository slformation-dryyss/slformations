
import { NextResponse, NextRequest } from "next/server";
import { getOrCreateUser } from "@/lib/auth";
import { createPasswordChangeTicket } from "@/lib/auth0-mgmt";

export async function POST(req: NextRequest) {
    try {
        const user = await getOrCreateUser(req);

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        /* 
        Temporairement désactivé pour éviter erreur de build (colonne manquante en DB)
        if (!user.mustChangePassword) {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }
        */

        const appUrl = process.env.AUTH0_BASE_URL || "https://sl-formations.fr";
        const resultUrl = `${appUrl}/api/auth/password-changed-callback`;

        const ticketUrl = await createPasswordChangeTicket(user.auth0Id, resultUrl);

        return NextResponse.redirect(new URL(ticketUrl));
    } catch (error: any) {
        console.error("Change Password API Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
