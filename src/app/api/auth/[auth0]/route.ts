import { handleAuth } from "@auth0/nextjs-auth0/edge";
import type { NextRequest } from "next/server";

const authHandler = handleAuth();

// Next 16 passe désormais `params` comme une Promise,
// on la résout avant de déléguer à Auth0 pour éviter l'erreur "params is a Promise".
export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ auth0: string }> }
) {
  const params = await ctx.params;
  console.log(`[Auth0] GET route hit: /api/auth/${params.auth0}`);
  try {
    return await authHandler(req, { params: params } as any);
  } catch (error: any) {
    console.error(`[Auth0] ❌ Error in GET /api/auth/${params.auth0}:`, error);
    throw error; // Let nextjs handle or bubble up
  }
}

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ auth0: string }> }
) {
  const params = await ctx.params;
  console.log(`[Auth0] POST route hit: /api/auth/${params.auth0}`);
  try {
    return await authHandler(req, { params: params } as any);
  } catch (error: any) {
    console.error(`[Auth0] ❌ Error in POST /api/auth/${params.auth0}:`, error);
    throw error;
  }
}

// Évite la mise en cache / static pour ces routes d'authentification
export const dynamic = "force-dynamic";
