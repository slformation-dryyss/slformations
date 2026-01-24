import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
    try {
        const { getOrCreateUser } = await import("@/lib/auth");
        const userCount = await prisma.user.count();
        const courseCount = await prisma.course.count();

        // Comprehensive table check
        const tableCheck = await prisma.$queryRaw<any[]>`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `;
        const existingTables = tableCheck.map(t => t.table_name);

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
                tables: existingTables.length,
            },
            existing_tables: existingTables,
            column_checks: {
                user_columns: (await prisma.$queryRaw<any[]>`SELECT column_name FROM information_schema.columns WHERE table_name = 'User'`).map(c => c.column_name),
                instructor_columns: (await prisma.$queryRaw<any[]>`SELECT column_name FROM information_schema.columns WHERE table_name = 'InstructorProfile'`).map(c => c.column_name),
                teacher_columns: (await prisma.$queryRaw<any[]>`SELECT column_name FROM information_schema.columns WHERE table_name = 'TeacherProfile'`).map(c => c.column_name),
            },
            users_summary: await prisma.$queryRaw`SELECT id, email, role, roles, "primaryRole" FROM "User" LIMIT 10`,
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
