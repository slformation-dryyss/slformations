
import { NextResponse, NextRequest } from "next/server";
import { getOrCreateUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const user = await getOrCreateUser(req);

        if (!user) {
            return NextResponse.redirect(new URL("/api/auth/login", req.url));
        }

        // On met à jour l'utilisateur en base pour dire que le mot de passe est changé
        await prisma.user.update({
            where: { id: user.id },
            data: {
                mustChangePassword: false,
                passwordChangedAt: new Date()
            }
        });

        // Redirection vers le dashboard, maintenant que c'est ok
        return NextResponse.redirect(new URL("/dashboard", req.url));
    } catch (error) {
        console.error("Password Changed Callback Error:", error);
        // En cas d'erreur de mise à jour, on redirige quand même vers le dashboard 
        // l'utilisateur sera à nouveau redirigé vers la page de changement s'il n'est pas à jour
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }
}
