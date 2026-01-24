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
                if (!fs.existsSync(dir)) return "Directory not found";
                return {
                    path: dir,
                    contents: fs.readdirSync(dir)
                };
            } catch (e: any) { return e.message; }
        };

        return NextResponse.json({
            status: "success",
            timestamp: new Date().toISOString(),
            database: "reachable",
            counts: {
                users: userCount,
                courses: courseCount,
                tables: existingTables.length,
            },
            file_system: {
                cwd: process.cwd(),
                teacher_root: listDir(path.join(process.cwd(), 'src/app/dashboard/teacher')),
                teacher_courses: listDir(path.join(process.cwd(), 'src/app/dashboard/teacher/courses')),
                teacher_sessions: listDir(path.join(process.cwd(), 'src/app/dashboard/teacher/sessions')),
            },
            column_checks: {
                user_columns: (await prisma.$queryRaw<any[]>`SELECT column_name FROM information_schema.columns WHERE table_name = 'User'`).map(c => c.column_name),
                instructor_columns: (await prisma.$queryRaw<any[]>`SELECT column_name FROM information_schema.columns WHERE table_name = 'InstructorProfile'`).map(c => c.column_name),
                teacher_columns: (await prisma.$queryRaw<any[]>`SELECT column_name FROM information_schema.columns WHERE table_name = 'TeacherProfile'`).map(c => c.column_name),
                availability_columns: (await prisma.$queryRaw<any[]>`SELECT column_name FROM information_schema.columns WHERE table_name = 'InstructorAvailability'`).map(c => c.column_name),
                lesson_columns: (await prisma.$queryRaw<any[]>`SELECT column_name FROM information_schema.columns WHERE table_name = 'DrivingLesson'`).map(c => c.column_name),
            },
            currentUserSession: userResult,
            users_summary: await prisma.$queryRaw`SELECT id, email, role, roles, "primaryRole" FROM "User" LIMIT 10`,
        });
    } catch (error: any) {
        return NextResponse.json({
            status: "error",
            message: error.message,
        }, { status: 500 });
    }
}
