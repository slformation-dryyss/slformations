import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    try {
        const { getOrCreateUser } = await import("@/lib/auth");
        const userCount = await prisma.user.count();
        const courseCount = await prisma.course.count();

        // 1. Comprehensive table check
        const tableCheck = await prisma.$queryRaw<any[]>`
            SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'
        `;
        const existingTables = tableCheck.map(t => t.table_name);

        // 2. Session Attempt
        let userResult = null;
        try {
            // @ts-ignore
            userResult = await getOrCreateUser(request);
        } catch (e: any) {
            userResult = { error: e.message };
        }

        // 3. File System Check (Deep)
        const fs = require('fs');
        const path = require('path');
        const checkPath = (p: string) => {
            try {
                if (!fs.existsSync(p)) return `Missing: ${p}`;
                const stats = fs.statSync(p);
                if (stats.isDirectory()) return { type: "dir", contents: fs.readdirSync(p) };
                return { type: "file", size: stats.size };
            } catch (e: any) { return `Error: ${e.message}`; }
        };

        const root = process.cwd();
        // Trace the teacher dashboard files in the standalone build
        const teacherPath = path.join(root, ".next/server/app/dashboard/teacher");

        // 4. Headers & Cookies
        const allCookies = request.cookies.getAll().map(c => ({ name: c.name, value: "***" }));

        return NextResponse.json({
            status: "success",
            timestamp: new Date().toISOString(),
            env: {
                AUTH0_BASE_URL: process.env.AUTH0_BASE_URL ? "Set (Check domain match)" : "NOT SET",
                NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "NOT SET",
                AUTH0_ISSUER_BASE_URL: process.env.AUTH0_ISSUER_BASE_URL ? "Set" : "NOT SET",
            },
            request: {
                host: request.headers.get("host"),
                proto: request.headers.get("x-forwarded-proto"),
                url: request.url,
                cookies: allCookies,
            },
            file_system: {
                cwd: root,
                teacher_dir: checkPath(teacherPath),
                teacher_courses: checkPath(path.join(teacherPath, "courses")),
                teacher_courses_page: checkPath(path.join(teacherPath, "courses/page.js")),
            },
            database: {
                users: userCount,
                tables_count: existingTables.length,
            },
            currentUserSession: userResult,
            users_summary: await prisma.$queryRaw`SELECT id, email, role, roles, "primaryRole" FROM "User" LIMIT 5`,
        });
    } catch (error: any) {
        return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
    }
}
