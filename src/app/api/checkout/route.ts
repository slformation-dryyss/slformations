import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";
import { requireUser } from "@/lib/auth";
import { createCheckoutSession } from "@/lib/checkout-store";

export async function POST(request: NextRequest) {
  try {
    // 1. Authentification & User Sync
    const user = await requireUser(request);
    
    // 2. Parsing du body
    const body = await request.json().catch(() => null);
    const courseId = body?.courseId as string | undefined;
    const sessionId = body?.sessionId as string | undefined;

    if (!courseId) {
      return NextResponse.json({ error: "courseId manquant." }, { status: 400 });
    }

    // 3. Appel de la logique du store
    console.log(`[API /api/checkout] Demande de session pour User=${user.id}, Course=${courseId}, Session=${sessionId}`);
    const session = await createCheckoutSession(user, courseId, sessionId);

    console.log("[API /api/checkout] Session créée avec succès", {
      checkoutSessionId: session.id,
      url: session.url,
    });

    return NextResponse.json({ url: session.url });
    
  } catch (error: any) {
    console.error("Erreur API /api/checkout:", error);
    // Gestion rudimentaire des erreurs connues
    if (error.message.includes("Stripe")) {
       return NextResponse.json({ error: error.message }, { status: 503 });
    }
    return NextResponse.json(
      { error: error.message || "Erreur interne lors de la création du paiement." },
      { status: 500 },
    );
  }
}


