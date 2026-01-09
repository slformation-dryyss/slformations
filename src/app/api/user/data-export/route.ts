import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
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
    
    // Create data export request
    const exportRequest = await prisma.dataExportRequest.create({
      data: {
        userId: dbUser.id,
        status: "PENDING"
      }
    });
    
    // TODO: Trigger background job to generate export
    // For now, we'll just return the request ID
    
    return NextResponse.json({
      success: true,
      requestId: exportRequest.id,
      message: "Votre demande d'export a été enregistrée. Vous recevrez un email avec le lien de téléchargement dans les 48h."
    });
    
  } catch (error) {
    console.error("Data export request error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

