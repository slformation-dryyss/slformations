
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// REPLACE THIS WITH YOUR EMAIL IF NEEDED
const TARGET_EMAIL = ""; // Leave empty to use the most recent user

async function main() {
  console.log('--- Start Test Data Injection ---');

  // 1. Find User
  let user;
  if (TARGET_EMAIL) {
    user = await prisma.user.findUnique({ where: { email: TARGET_EMAIL } });
  } else {
    user = await prisma.user.findFirst({
      orderBy: { createdAt: 'desc' },
    });
  }

  if (!user) {
    console.error('❌ No user found. Please sign up on the site first.');
    return;
  }
  console.log(`✅ User found: ${user.email} (${user.name})`);

  // 2. Find Course (CACES R489 Cat 3)
  const courseSlug = 'caces-r489-3';
  const course = await prisma.course.findUnique({ where: { slug: courseSlug } });

  if (!course) {
    console.error(`❌ Course not found: ${courseSlug}. Run 'npx tsx prisma/seed-caces.ts' first.`);
    return;
  }
  console.log(`✅ Course found: ${course.title}`);

  // 3. Create Enrollment
  const enrollment = await prisma.enrollment.upsert({
    where: {
      userId_courseId: {
        userId: user.id,
        courseId: course.id,
      },
    },
    update: {
        status: 'ACTIVE',
        progress: 35, // Mock progress
    },
    create: {
      userId: user.id,
      courseId: course.id,
      status: 'ACTIVE',
      progress: 35,
    },
  });
  console.log(`✅ Enrolled user in course. Progress set to 35%.`);

  // 4. Create a Session Booking (Future)
  // Find a session for this course or create one
  let session = await prisma.courseSession.findFirst({
    where: { 
        courseId: course.id,
        startDate: { gt: new Date() }
    }
  });

  if (!session) {
    console.log('ℹ️ No future session found, creating one...');
    session = await prisma.courseSession.create({
        data: {
            courseId: course.id,
            startDate: new Date(Date.now() + 86400000 * 3), // +3 days
            endDate: new Date(Date.now() + 86400000 * 5),
            location: 'Centre Épinay-sur-Seine',
            maxSpots: 10,
        }
    });
  }

  // Book the user
  await prisma.courseSessionBooking.upsert({
      where: {
          courseSessionId_userId: {
              courseSessionId: session.id,
              userId: user.id
          }
      },
      update: {},
      create: {
          courseSessionId: session.id,
          userId: user.id,
          status: 'BOOKED',
      }
  });
  
  console.log(`✅ Booked session for ${session.startDate.toLocaleDateString()}`);
  console.log('--- Test Data Injection Complete ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
