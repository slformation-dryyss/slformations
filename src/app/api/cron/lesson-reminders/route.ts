import { NextResponse } from "next/server";
import { sendLessonReminders } from "@/lib/lessons/notifications";

/**
 * Route API pour déclencher les rappels automatiques (24h avant)
 * Peut être appelée par un service de CRON externe (ex: Clever Cloud Cron, GitHub Actions)
 */
export async function GET(request: Request) {
    // Vérification basique de sécurité (Optionnel: ajouter un header d'auth)
    const authHeader = request.headers.get("authorization");
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        console.log("[CRON] Starting lesson reminders...");
        const count = await sendLessonReminders();
        console.log(`[CRON] Successfully sent ${count} reminders.`);

        return NextResponse.json({
            success: true,
            sentCount: count,
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
        console.error("[CRON] Failed to send reminders:", error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
