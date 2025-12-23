import { auth0 } from "@/lib/auth0";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { quizId: string } }
) {
  const quizId = params.quizId;
  const session = await auth0.getSession();
  const { answers } = await request.json(); // answers: { questionId: [selectedOptionIds] }

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const dbUser = await prisma.user.findUnique({
      where: { auth0Id: session.user.sub },
      select: { id: true }
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          include: { options: true }
        }
      }
    });

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    let correctCount = 0;
    quiz.questions.forEach((question) => {
      const userSelected = answers[question.id] || [];
      const correctOptions = question.options.filter(o => o.isCorrect).map(o => o.id);
      
      const isCorrect = userSelected.length === correctOptions.length && 
                        userSelected.every((id: string) => correctOptions.includes(id));
      
      if (isCorrect) correctCount++;
    });

    const score = Math.round((correctCount / quiz.questions.length) * 100);
    const isPassed = score >= quiz.passingScore;

    // Record the attempt
    await prisma.quizAttempt.create({
      data: {
        userId: dbUser.id,
        quizId: quiz.id,
        score,
        isPassed,
        answers,
        startedAt: new Date(), // Could be improved by passing from client
        completedAt: new Date(),
      }
    });

    return NextResponse.json({ score, isPassed });
  } catch (error) {
    console.error("Quiz submit error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
 Broadway
