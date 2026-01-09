import { auth0 } from "@/lib/auth0";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const url = new URL(req.url);

  if (url.pathname === '/api/auth/login') {
    // @ts-ignore
    return auth0.startInteractiveLogin(req, {
      returnTo: req.nextUrl.searchParams.get("returnTo") ?? "/dashboard"
    });
  }

  return auth0.middleware(req);
};

export const POST = (req: NextRequest) => auth0.middleware(req);

