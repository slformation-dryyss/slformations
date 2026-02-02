import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { prisma } from "@/lib/prisma";
import { getUserExportData } from "@/lib/user-data";

export async function POST(request: Request) {
  const session = await auth0.getSession();
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  try {
    const dbUser = await prisma.user.findUnique({
      where: { auth0Id: session.user.sub },
      select: { id: true, email: true }
    });
    
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    // Create data export request
    const exportRequest = await prisma.dataExportRequest.create({
      data: {
        userId: dbUser.id,
        status: "PROCESSING"
      }
    });

    // In a real app, this would be a background job. 
    // For this implementation, we process it immediately.
    const data = await getUserExportData(dbUser.id);
    
    if (data) {
      // We simulate storing the file by creating a temporary reachable URL or just marking as completed
      // In this environment, we'll mark as COMPLETED and the frontend can potentially download it
      await prisma.dataExportRequest.update({
        where: { id: exportRequest.id },
        data: {
          status: "COMPLETED",
          exportUrl: `/api/user/data-export?id=${exportRequest.id}`
        }
      });
    } else {
      await prisma.dataExportRequest.update({
        where: { id: exportRequest.id },
        data: { status: "FAILED" }
      });
    }
    
    return NextResponse.json({
      success: true,
      requestId: exportRequest.id,
      message: "Votre export de données a été généré avec succès. Vous pouvez le télécharger dans l'historique ci-dessous."
    });
    
  } catch (error) {
    console.error("Data export request error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const session = await auth0.getSession();
  const { searchParams } = new URL(request.url);
  const requestId = searchParams.get("id");

  if (!session?.user || !requestId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const exportRequest = await prisma.dataExportRequest.findUnique({
      where: { id: requestId },
      include: { user: true }
    });

    if (!exportRequest || exportRequest.user.auth0Id !== session.user.sub) {
      return NextResponse.json({ error: "NotFound" }, { status: 404 });
    }

    if (exportRequest.status !== "COMPLETED") {
      return NextResponse.json({ error: "Incomplete" }, { status: 400 });
    }

    const data = await getUserExportData(exportRequest.userId);

    return new NextResponse(JSON.stringify(data, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="export_donnees_${exportRequest.userId}.json"`,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

