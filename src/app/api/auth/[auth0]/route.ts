import { auth0 } from "@/lib/auth0";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, { params }: { params: Promise<{ auth0: string }> }) => {
  const { auth0: slug } = await params;
  // @ts-ignore
  const client = auth0.authClient;

  // Use the specific handlers from the internal authClient
  try {
    switch (slug) {
      case 'login':
        return client.handleLogin(req, {
           returnTo: req.nextUrl.searchParams.get("returnTo") ?? "/dashboard"
        });
      case 'logout':
        return client.handleLogout(req);
      case 'callback':
        return client.handleCallback(req);
      case 'me':
        return client.handleProfile(req);
      default:
        return new NextResponse("Not Found", { status: 404 });
    }
  } catch (error: any) {
    console.error(`[Auth0] Error handling ${slug}:`, error);
    return new NextResponse(error.message || "Internal Server Error", { status: 500 });
  }
};

export const POST = async (req: NextRequest, { params }: { params: Promise<{ auth0: string }> }) => {
  const { auth0: slug } = await params;
  // @ts-ignore
  const client = auth0.authClient;

  try {
    switch (slug) {
      case 'callback':
        return client.handleCallback(req);
      case 'logout':
        return client.handleLogout(req);
      default:
        return new NextResponse("Method Not Allowed", { status: 405 });
    }
  } catch (error: any) {
    console.error(`[Auth0] Error handling ${slug}:`, error);
    return new NextResponse(error.message || "Internal Server Error", { status: 500 });
  }
};


