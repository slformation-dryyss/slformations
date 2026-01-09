"use client";

import { useState } from "react";
import { CheckCircle, XCircle, ChevronRight, Loader2, Trophy, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface Option {
  id: string;
  text: string;
}

interface Question {
  id: string;
  text: string;
  type: string;
  options: Option[];
}

interface QuizPlayerProps {
  quiz: {
    id: string;
    title: string;
    description: string | null;
    passingScore: number;
    questions: Question[];
  };
  courseSlug: string;
}

export function QuizPlayer({ quiz, courseSlug }: QuizPlayerProps) {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ score: number; isPassed: boolean } | null>(null);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  const handleOptionToggle = (optionId: string) => {
    const questionId = currentQuestion.id;
    const currentAnswers = answers[questionId] || [];

    if (currentQuestion.type === "SINGLE") {
      setAnswers({ ...answers, [questionId]: [optionId] });
    } else {
      if (currentAnswers.includes(optionId)) {
        setAnswers({ ...answers, [questionId]: currentAnswers.filter(id => id !== optionId) });
      } else {
        setAnswers({ ...answers, [questionId]: [...currentAnswers, optionId] });
      }
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      handleSubmit();
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/quizzes/${quiz.id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });

      if (res.ok) {
        const data = await res.json();
        setResult(data);
      }
    } catch (e) {
      console.error("Quiz submission error", e);
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center shadow-xl max-w-2xl mx-auto">
        {result.isPassed ? (
          <>
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-10 h-10 text-emerald-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Félicitations !</h2>
            <p className="text-slate-500 mb-6">Vous avez réussi l'évaluation avec un score de {result.score}%.</p>
          </>
        ) : (
          <>
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Presque...</h2>
            <p className="text-slate-500 mb-6">Votre score est de {result.score}%. Le score minimum requis est de {quiz.passingScore}%.</p>
          </>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {!result.isPassed && (
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition"
            >
              Réessayer le Quiz
            </button>
          )}
          <button 
            onClick={() => router.push(`/learn/${courseSlug}`)} 
            className="px-6 py-3 border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition"
          >
            Retour au programme
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden max-w-3xl mx-auto">
      {/* Progress bar */}
      <div className="h-1.5 w-full bg-slate-100">
        <div 
          className="h-full bg-gold-500 transition-all duration-500" 
          style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
        />
      </div>

      <div className="p-8 md:p-10">
        <div className="flex items-center justify-between mb-8">
          <span className="text-xs font-bold text-gold-600 uppercase tracking-widest bg-gold-50 px-3 py-1 rounded-full">
            Question {currentQuestionIndex + 1} sur {quiz.questions.length}
          </span>
          <span className="text-xs text-slate-400 italic">
            {currentQuestion.type === "SINGLE" ? "Un seul choix possible" : "Plusieurs choix possibles"}
          </span>
        </div>

        <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-8 leading-tight">
          {currentQuestion.text}
        </h2>

        <div className="space-y-4 mb-10">
          {currentQuestion.options.map((option) => {
            const isSelected = (answers[currentQuestion.id] || []).includes(option.id);
            return (
              <button
                key={option.id}
                onClick={() => handleOptionToggle(option.id)}
                className={`w-full text-left p-5 rounded-xl border-2 transition-all flex items-center justify-between group ${
                  isSelected 
                  ? "border-gold-500 bg-gold-50 text-gold-900" 
                  : "border-slate-100 bg-slate-50 hover:border-slate-300 text-slate-600"
                }`}
              >
                <span className="font-medium">{option.text}</span>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  isSelected ? "bg-gold-500 border-gold-500" : "bg-white border-slate-300"
                }`}>
                  {isSelected && <CheckCircle className="w-4 h-4 text-white" />}
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleNext}
            disabled={submitting || (answers[currentQuestion.id] || []).length === 0}
            className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition transform hover:scale-105 active:scale-95"
          >
            {submitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : isLastQuestion ? (
              "Terminer l'évaluation"
            ) : (
              <>
                Suivant
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

