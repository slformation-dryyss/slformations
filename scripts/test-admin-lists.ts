
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testAdminLists() {
    console.log("🔍 Testing Admin Courses List query...");
    try {
        const courses = await prisma.course.findMany({
            include: {
                _count: {
                    select: { modules: true, enrollments: true }
                }
            }
        });
        console.log(`✅ Courses query successful: found ${courses.length} courses.`);
        
        // Check for any potential null issues in fields used in the UI
        courses.forEach(c => {
            if (c.drivingHours === undefined) console.warn(`⚠️ Course ${c.id} has undefined drivingHours`);
            if (c.type === undefined) console.warn(`⚠️ Course ${c.id} has undefined type`);
        });
    } catch (error) {
        console.error("❌ Courses List query FAILED:", error);
    }

    console.log("\n🔍 Testing Admin Sessions query...");
    try {
        const sessions = await prisma.courseSession.findMany({
            include: {
                course: true,
            }
        });
        console.log(`✅ Sessions query successful: found ${sessions.length} sessions.`);
    } catch (error) {
        console.error("❌ Sessions query FAILED:", error);
    } finally {
        await prisma.$disconnect();
    }
}

testAdminLists();
