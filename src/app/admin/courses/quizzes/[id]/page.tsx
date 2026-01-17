import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { addQuestionAction } from "../actions";
import { QuestionItem } from "@/components/admin/QuestionItem";

async function getQuiz(id: string) {
  return await prisma.quiz.findUnique({
    where: { id },
    include: {
      questions: {
        orderBy: { position: "asc" },
        include: { options: true }
      }
    }
  });
}

export default async function QuizAdminPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await requireAdmin();
  const quiz = await getQuiz(id);

  if (!quiz) notFound();

  return (
    <div className="pb-20">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href={`/admin/courses`}
          className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Retour à la formation
        </Link>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">{quiz.title}</h1>
          <p className="text-slate-500">{quiz.description || "Évaluation pédagogique"}</p>
          <span className="inline-block mt-2 px-2 py-1 bg-gold-500/10 text-gold-600 rounded-full text-xs font-bold">
            Score de passage : {quiz.passingScore}%
          </span>
        </div>

        {/* Questions List */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Questions ({quiz.questions.length})</h2>
          
          {quiz.questions.map((question: any, idx: number) => (
            <QuestionItem 
              key={question.id} 
              question={question} 
              quizId={quiz.id} 
              index={idx} 
            />
          ))}

          {/* New Question Form */}
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-8">
            <h3 className="font-bold text-slate-900 mb-4">Ajouter une question</h3>
            <form action={addQuestionAction} className="space-y-4">
              <input type="hidden" name="quizId" value={quiz.id} />
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Texte de la question</label>
                <input required name="text" className="w-full p-2 border border-slate-300 rounded text-sm" placeholder="Ex: Quelle est la durée d'une formation VTC ?" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Options (Format JSON)</label>
                <textarea required name="options" className="w-full p-2 border border-slate-300 rounded text-sm h-24 font-mono text-xs" defaultValue={`[
  {"text": "Option 1", "isCorrect": true},
  {"text": "Option 2", "isCorrect": false}
]`}></textarea>
              </div>

              <button type="submit" className="bg-slate-900 text-white px-4 py-2 rounded text-sm hover:bg-slate-800 flex items-center gap-2">
                <Plus className="w-4 h-4" /> Enregistrer la question
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
