import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  // Fix for client-side redirection loop where the SDK requests /auth/profile
  const url = request.nextUrl.clone();
  url.pathname = "/api/auth/me";
  return NextResponse.redirect(url);
}

