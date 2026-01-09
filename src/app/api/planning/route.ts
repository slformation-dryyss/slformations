import { NextRequest, NextResponse } from "next/server";
import { getPublicSessions } from "@/lib/courses";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || undefined;
  const type = searchParams.get("type") || undefined;

  try {
    const sessions = await getPublicSessions({ search, type });
    return NextResponse.json(sessions);
  } catch (error) {
    console.error("Planning API Error:", error);
    return NextResponse.json({ error: "Failed to fetch planning sessions" }, { status: 500 });
  }
}

