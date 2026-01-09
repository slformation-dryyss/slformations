import { auth0 } from "@/lib/auth0";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth0.getSession();

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Return EVERYTHING in the session
    return NextResponse.json({
      session: session,
      user: session.user,
      idToken: session.idToken,
      accessToken: session.accessToken,
      accessTokenExpiresAt: session.accessTokenExpiresAt,
      // Check all possible namespaces
      customClaims: {
        "sl-formations.fr/roles": (session.user as any)["https://sl-formations.fr/roles"],
        "sl-formations.fr/role": (session.user as any)["https://sl-formations.fr/role"],
      }
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
}

