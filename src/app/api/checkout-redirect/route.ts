import { NextResponse } from "next/server";
import { requireVerifiedUser } from "@/lib/auth";
import { createCheckoutSession } from "@/lib/checkout-store";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");
    const sessionId = searchParams.get("sessionId");

    if (!courseId) {
      return new NextResponse("Missing courseId", { status: 400 });
    }

    const auth = await requireVerifiedUser();
    if (!auth) {
      return NextResponse.redirect(new URL("/api/auth/login", req.url));
    }

    const checkoutSession = await createCheckoutSession(auth.user, courseId, 1, sessionId || undefined);
    
    if (checkoutSession.url) {
      return NextResponse.redirect(checkoutSession.url);
    }

    return new NextResponse("Failed to create checkout session", { status: 500 });
  } catch (error) {
    console.error("Error in checkout-redirect:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

