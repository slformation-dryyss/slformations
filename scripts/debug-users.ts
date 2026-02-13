
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Checking Users with role INSTRUCTOR ---');
  try {
    const instructors = await prisma.user.findMany({
      where: { role: 'INSTRUCTOR' },
      select: { id: true, email: true, role: true, roles: true, primaryRole: true, firstName: true, lastName: true }
    });
    console.log(`Found ${instructors.length} users with role="INSTRUCTOR"`);
    console.log(JSON.stringify(instructors, null, 2));
  } catch (e) {
    console.error("Error fetching INSTRUCTOR role:", e);
  }

  console.log('\n--- Checking All Users (First 50) ---');
  try {
    const allUsers = await prisma.user.findMany({
      take: 50,
      select: { id: true, email: true, role: true, roles: true, primaryRole: true }
    });

    const potentialInstructors = allUsers.filter(u => 
      (u.role && u.role.includes('INSTRUCT')) || 
      (u.role && u.role.includes('TEACH')) ||
      (u.roles && u.roles.some(r => r.includes('INSTRUCT') || r.includes('TEACH'))) ||
      (u.primaryRole && u.primaryRole.includes('INSTRUCT')) ||
      (u.primaryRole && u.primaryRole.includes('TEACH'))
    );

    console.log(`\nFound ${potentialInstructors.length} potential instructors (fuzzy match) out of ${allUsers.length} users checked:`);
    console.log(JSON.stringify(potentialInstructors, null, 2));
  } catch (e) {
    console.error("Error fetching all users:", e);
  }

  console.log('\n--- Checking InstructorProfiles ---');
  try {
    const instructorProfiles = await prisma.instructorProfile.findMany({
      include: { user: { select: { email: true, role: true } } }
    });
    console.log(`Found ${instructorProfiles.length} InstructorProfiles`);
    console.log(JSON.stringify(instructorProfiles.map(p => ({ 
      id: p.id, 
      email: p.user.email, 
      userRole: p.user.role,
      isActive: p.isActive 
    })), null, 2));
  } catch (e) {
    console.error("Error fetching InstructorProfiles:", e);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
