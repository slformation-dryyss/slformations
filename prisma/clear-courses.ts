import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearCourses() {
  console.log('🗑️  Clearing all courses and related data...');

  try {
    // Delete in order to respect foreign key constraints
    await prisma.quizAttempt.deleteMany({});
    await prisma.quizQuestion.deleteMany({});
    await prisma.quiz.deleteMany({});
    await prisma.userProgress.deleteMany({});
    await prisma.lesson.deleteMany({});
    await prisma.module.deleteMany({});
    await prisma.courseSession.deleteMany({});
    await prisma.enrollment.deleteMany({});
    await prisma.course.deleteMany({});

    console.log('✅ All courses and related data have been deleted!');
  } catch (error) {
    console.error('❌ Error clearing courses:', error);
  } finally {
    await prisma.$disconnect();
  }
}

clearCourses();
