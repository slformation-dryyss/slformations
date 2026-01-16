import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Starting roles migration...");

    try {
        const users = await prisma.user.findMany();
        console.log(`Found ${users.length} users to check.`);

        let updatedCount = 0;

        for (const user of users) {
            const currentRole = user.role;
            const currentRoles = (user as any).roles || []; // Safe access if types are not accurate yet

            // Skip if already migrated (roles array exists and is not empty)
            // Actually, force sync might be better to ensure consistency
            if (currentRoles.length > 0 && currentRoles.includes(currentRole)) {
                continue;
            }

            console.log(`Migrating user ${user.email} (${currentRole})...`);

            // 1. Determine new roles array
            let newRoles = [currentRole];

            // Handle legacy confusion special cases if any? No, generic mapping is 1:1 for now.

            // 2. Determine Primary Role (same as current role for migration)
            const primaryRole = currentRole;

            // 3. Update User
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    roles: newRoles,
                    primaryRole: primaryRole,
                },
            });

            // 4. Create Profiles based on role
            if (newRoles.includes("INSTRUCTOR")) {
                await prisma.instructorProfile.upsert({
                    where: { userId: user.id },
                    create: {
                        userId: user.id,
                        city: user.city || "À définir",
                        department: user.postalCode ? user.postalCode.substring(0, 2) : "À définir",
                        specialty: "DRIVING",
                    },
                    update: {},
                });
                console.log(`  -> Ensured InstructorProfile`);
            }

            if (newRoles.includes("TEACHER")) {
                // Note: Before this update, no one had TEACHER role, but if they did:
                await prisma.teacherProfile.upsert({
                    where: { userId: user.id },
                    create: {
                        userId: user.id,
                        city: user.city || "À définir",
                        department: user.postalCode ? user.postalCode.substring(0, 2) : "À définir",
                    },
                    update: {},
                });
                console.log(`  -> Ensured TeacherProfile`);
            }

            updatedCount++;
        }

        console.log(`Migration complete. Updated ${updatedCount} users.`);

    } catch (error) {
        console.error("Migration failed:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
