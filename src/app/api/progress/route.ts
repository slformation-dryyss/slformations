import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";
import { requireUser } from "@/lib/auth";
import { updateLessonProgress } from "@/lib/progress-store";

export async function POST(request: NextRequest) {
  try {
    // 1. Auth check
    const user = await requireUser(request);
    
    // 2. Parsing request
    const body = await request.json().catch(() => null);
    const lessonId = body?.lessonId as string | undefined;
    const isCompleted = (body?.isCompleted as boolean | undefined) ?? true;

    if (!lessonId) {
      return NextResponse.json({ error: "lessonId manquant" }, { status: 400 });
    }

    // 3. Delegate to store
    const progress = await updateLessonProgress(user.id, lessonId, isCompleted);

    return NextResponse.json({ success: true, progress });
    
  } catch (error: any) {
    console.error("Erreur API /api/progress:", error);
    // Erreurs métier spécifiques (rejetées par le store)
    if (error.message === "Accès non autorisé à cette leçon") {
       return NextResponse.json({ error: error.message }, { status: 403 });
    }
    if (error.message.includes("introuvable")) {
       return NextResponse.json({ error: error.message }, { status: 404 });
    }
    
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}









