import { prisma } from "@/lib/prisma";
import { auth0 } from "@/lib/auth0";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const diag: any = {
    timestamp: new Date().toISOString(),
    env: {
      NODE_ENV: process.env.NODE_ENV,
      AUTH0_BASE_URL: process.env.AUTH0_BASE_URL ? "SET (length: " + process.env.AUTH0_BASE_URL.length + ")" : "MISSING",
      DATABASE_URL: process.env.DATABASE_URL ? "SET" : "MISSING",
    },
    auth: {},
    db: {}
  };

  try {
    const session = await auth0.getSession();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Only allow staff/admin to see diagnostic data
    const roles = (session.user as any)["https://sl-formations.fr/roles"] || [];
    const isStaff = roles.some((r: string) => ["ADMIN", "OWNER", "TEACHER", "INSTRUCTOR"].includes(r.toUpperCase()));
    
    if (!isStaff) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    diag.auth.hasSession = !!session;
    if (session) {
      diag.auth.user = {
        sub: session.user.sub,
        email: session.user.email,
        role: (session.user as any).role,
      };
    }
  } catch (e: any) {
    diag.auth.error = e.message;
  }

  try {
    // Check DB connection and schema
    const userCount = await prisma.user.count();
    diag.db.status = "CONNECTED";
    diag.db.userCount = userCount;
    
    // Check if new fields exist
    try {
        const testAvailability = await prisma.instructorAvailability.findFirst({
            select: { id: true, recurrenceGroupId: true }
        });
        diag.db.recurrenceGroupId_exists = true;
    } catch (e: any) {
        diag.db.recurrenceGroupId_exists = false;
        diag.db.schema_error = e.message;
    }
  } catch (e: any) {
    diag.db.status = "ERROR";
    diag.db.error = e.message;
  }

  return NextResponse.json(diag);
}
