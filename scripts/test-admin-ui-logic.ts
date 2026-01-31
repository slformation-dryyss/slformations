
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testAdminUIData() {
    console.log("🔍 [DIAGNOSTIC] Testing Courses page logic...");
    try {
        const courses = await prisma.course.findMany({
            include: {
                _count: {
                    select: { modules: true, enrollments: true }
                }
            }
        });
        
        console.log(`✅ Fetched ${courses.length} courses.`);
        
        // Simulating the grouping logic in src/app/admin/courses/page.tsx
        const grouped = courses.reduce((acc: any, course) => {
            const type = course.type || "AUTRE";
            if (!acc[type]) acc[type] = [];
            acc[type].push(course);
            return acc;
        }, {});
        
        const entries = Object.entries(grouped);
        console.log(`✅ Grouping successful into ${entries.length} types.`);
        
        entries.forEach(([type, typeCourses]: [string, any]) => {
            console.log(`- ${type}: ${typeCourses.length} courses`);
            typeCourses.forEach((c: any) => {
                // Testing property access
                const countModules = c._count.modules;
                const countEnrollments = c._count.enrollments;
                const dh = c.drivingHours;
                if (dh === undefined) throw new Error("drivingHours is undefined");
            });
        });
        console.log("✅ Courses logic simulation passed.");

    } catch (error) {
        console.error("❌ Courses logic FAILED:", error);
    }

    console.log("\n🔍 [DIAGNOSTIC] Testing Sessions page logic...");
    try {
        const sessions = await prisma.courseSession.findMany({
            include: {
                course: true,
            },
            orderBy: {
                startDate: "asc", 
            },
        });
        console.log(`✅ Fetched ${sessions.length} sessions.`);
        
        // Simulating SessionsManager logic
        sessions.forEach(s => {
            if (!s.course) throw new Error(`Session ${s.id} is missing linked course`);
            console.log(`- Session for ${s.course.title} starting on ${s.startDate}`);
        });
        console.log("✅ Sessions logic simulation passed.");

    } catch (error) {
        console.error("❌ Sessions logic FAILED:", error);
    } finally {
        await prisma.$disconnect();
    }
}

testAdminUIData();
