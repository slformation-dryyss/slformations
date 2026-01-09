import { auth0 } from "@/lib/auth0";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: lessonId } = await params;
  const session = await auth0.getSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const dbUser = await prisma.user.findUnique({
      where: { auth0Id: session.user.sub },
      select: { id: true }
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Increment timeSpent by 30 seconds (standard heartbeat interval)
    // and update lastAccessedAt
    const progress = await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: dbUser.id,
          lessonId: lessonId
        }
      },
      update: {
        timeSpent: { increment: 30 },
        lastAccessedAt: new Date()
      },
      create: {
        userId: dbUser.id,
        lessonId: lessonId,
        isCompleted: false,
        timeSpent: 30,
        lastAccessedAt: new Date()
      }
    });

    return NextResponse.json({ 
      success: true, 
      timeSpent: progress.timeSpent 
    });
  } catch (error) {
    console.error("Heartbeat error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

