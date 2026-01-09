import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await auth0.getSession();
  const { consentType, isGranted } = await request.json();
  
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
    
    // Get IP and User Agent from request
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    // Log consent
    await prisma.consentLog.create({
      data: {
        userId: dbUser.id,
        consentType,
        isGranted,
        ipAddress,
        userAgent
      }
    });
    
    // Update user consent fields
    const updateData: any = {};
    if (consentType === "GDPR") {
      updateData.gdprConsent = isGranted;
      if (isGranted) updateData.gdprConsentDate = new Date();
    } else if (consentType === "MARKETING") {
      updateData.marketingConsent = isGranted;
    }
    
    if (Object.keys(updateData).length > 0) {
      await prisma.user.update({
        where: { id: dbUser.id },
        data: updateData
      });
    }
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error("Consent logging error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

