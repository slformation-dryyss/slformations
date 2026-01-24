import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
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

        const fs = require('fs');
        const path = require('path');
        const listDir = (dir: string): any => {
            try {
                if (!fs.existsSync(dir)) return `Not found: ${dir}`;
                return {
                    path: dir,
                    contents: fs.readdirSync(dir)
                };
            } catch (e: any) { return e.message; }
        };

        const headers: Record<string, string> = {};
        request.headers.forEach((val, key) => {
            headers[key] = key.toLowerCase().includes('cookie') || key.toLowerCase().includes('auth') ? '***' : val;
        });

        // Try to find app directory in standalone build structure
        const possibleAppDirs = [
            path.join(process.cwd(), '.next/server/app/dashboard/teacher'),
            path.join(process.cwd(), 'server/app/dashboard/teacher'),
            path.join(process.cwd(), 'src/app/dashboard/teacher'),
        ];

        return NextResponse.json({
            status: "success",
            timestamp: new Date().toISOString(),
            database: "reachable",
            request: {
                url: request.url,
                method: request.method,
                headers,
                has_auth_cookie: request.cookies.has('appSession') || Array.from(request.cookies.getAll()).some(c => c.name.includes('auth')),
                cookies_list: request.cookies.getAll().map(c => c.name),
            },
            file_system: {
                cwd: process.cwd(),
                possible_teacher_dirs: possibleAppDirs.map(d => ({ dir: d, result: listDir(d) })),
            },
            counts: {
                users: userCount,
                courses: courseCount,
                tables: existingTables.length,
            },
            column_checks: {
                user_columns: (await prisma.$queryRaw<any[]>`SELECT column_name FROM information_schema.columns WHERE table_name = 'User'`).map(c => c.column_name),
                instructor_columns: (await prisma.$queryRaw<any[]>`SELECT column_name FROM information_schema.columns WHERE table_name = 'InstructorProfile'`).map(c => c.column_name),
                availability_columns: (await prisma.$queryRaw<any[]>`SELECT column_name FROM information_schema.columns WHERE table_name = 'InstructorAvailability'`).map(c => c.column_name),
            },
            currentUserSession: userResult,
            users_summary: await prisma.$queryRaw`SELECT id, email, role, roles, "primaryRole" FROM "User" LIMIT 5`,
        });
    } catch (error: any) {
        return NextResponse.json({
            status: "error",
            message: error.message,
        }, { status: 500 });
    }
}
