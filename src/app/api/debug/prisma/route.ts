import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const userCount = await prisma.user.count();
        const courseCount = await prisma.course.count();
        return NextResponse.json({
            status: "success",
            database: "reachable",
            counts: {
                users: userCount,
                courses: courseCount,
            }
        });
    } catch (error: any) {
        return NextResponse.json({
            status: "error",
            message: error.message,
            code: error.code,
            meta: error.meta,
            stack: process.env.NODE_ENV === "development" ? error.stack : undefined
        }, { status: 500 });
    }
}
