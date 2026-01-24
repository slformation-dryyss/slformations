import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
    try {
        const { getOrCreateUser } = await import("@/lib/auth");
        const userCount = await prisma.user.count();
        const courseCount = await prisma.course.count();

        let userResult = null;
        try {
            // @ts-ignore
            userResult = await getOrCreateUser(request);
        } catch (e: any) {
            userResult = { error: e.message, stack: e.stack };
        }

        return NextResponse.json({
            status: "success",
            database: "reachable",
            env: {
                has_db_url: !!process.env.DATABASE_URL,
                db_url_masked: process.env.DATABASE_URL ? process.env.DATABASE_URL.replace(/:[^@:]+@/, ":****@") : null,
                node_env: process.env.NODE_ENV,
            },
            counts: {
                users: userCount,
                courses: courseCount,
            },
            currentUserTest: userResult ? {
                id: (userResult as any).id,
                email: (userResult as any).email,
                role: (userResult as any).role
            } : "No session or failed",
            _details: userResult && (userResult as any).error ? userResult : undefined
        });
    } catch (error: any) {
        return NextResponse.json({
            status: "error",
            message: error.message,
            code: error.code,
            meta: error.meta,
            env_check: {
                has_db_url: !!process.env.DATABASE_URL,
            },
            stack: process.env.NODE_ENV === "development" ? error.stack : undefined
        }, { status: 500 });
    }
}
