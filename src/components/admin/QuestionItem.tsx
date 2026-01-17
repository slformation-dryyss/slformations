"use client";

import { useState } from "react";
import { CheckCircle, Pencil, Trash2, X, Save } from "lucide-react";
import { deleteQuestionAction, updateQuestionAction } from "@/app/admin/courses/quizzes/actions";

interface QuestionItemProps {
  question: any;
  quizId: string;
  index: number;
}

export function QuestionItem({ question, quizId, index }: QuestionItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form state
  const [text, setText] = useState(question.text);
  const [type, setType] = useState(question.type);
  const [optionsJson, setOptionsJson] = useState(
    JSON.stringify(question.options.map((o: any) => ({ text: o.text, isCorrect: o.isCorrect })), null, 2)
  );

  async function handleDelete() {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette question ?")) return;
    setIsDeleting(true);
    try {
      const formData = new FormData();
      formData.append("id", question.id);
      formData.append("quizId", quizId);
      await deleteQuestionAction(formData);
    } catch (error) {
      alert("Erreur lors de la suppression");
      setIsDeleting(false);
    }
  }

  async function handleUpdate(formData: FormData) {
    try {
      await updateQuestionAction(formData);
      setIsEditing(false);
    } catch (e) {
      alert("Erreur lors de la modification. Vérifiez le JSON.");
    }
  }

  if (isEditing) {
    return (
      <div className="bg-white border-2 border-gold-500 rounded-xl p-6 shadow-md transition-all">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-slate-800">Modifier la question {index + 1}</h3>
          <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form action={handleUpdate} className="space-y-4">
          <input type="hidden" name="id" value={question.id} />
          <input type="hidden" name="quizId" value={quizId} />

          <div className="grid grid-cols-1md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Question</label>
              <input
                required
                name="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded text-sm"
              />
            </div>
            <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
               <select 
                  name="type" 
                  value={type} 
                  onChange={(e) => setType(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded text-sm bg-white"
               >
                 <option value="SINGLE">Choix unique (Radio)</option>
                 <option value="MULTIPLE">Choix multiple (Checkbox)</option>
               </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Options (JSON)</label>
            <textarea
              required
              name="options"
              value={optionsJson}
              onChange={(e) => setOptionsJson(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded text-sm h-32 font-mono text-xs"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              Format: [{'{'}"text": "Réponse A", "isCorrect": true{'}'}, ...]
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
             <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded text-sm"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="bg-gold-500 text-white px-4 py-2 rounded text-sm hover:bg-gold-600 flex items-center gap-2 font-bold"
            >
              <Save className="w-4 h-4" /> Enregistrer
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className={`bg-white border border-slate-200 rounded-xl p-6 shadow-sm group hover:border-slate-300 transition-all ${isDeleting ? 'opacity-50' : ''}`}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-bold text-slate-800 flex-1 pr-4">
          {index + 1}. {question.text}
        </h3>
        
        <div className="flex items-center gap-2">
             <span className="text-[10px] font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-500 mr-2">
                {question.type === 'SINGLE' ? 'Choix unique' : 'Choix multiple'}
             </span>
             
             <button 
                onClick={() => setIsEditing(true)}
                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                title="Modifier"
             >
                <Pencil className="w-4 h-4" />
             </button>
             
             <button 
                onClick={handleDelete}
                disabled={isDeleting}
                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                title="Supprimer"
             >
                <Trash2 className="w-4 h-4" />
             </button>
        </div>
      </div>

      <ul className="space-y-2">
        {question.options.map((opt: any) => (
          <li key={opt.id} className="flex items-center gap-2 text-sm">
            {opt.isCorrect ? (
              <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            ) : (
              <div className="w-4 h-4 rounded-full border border-slate-300 flex-shrink-0" />
            )}
            <span className={opt.isCorrect ? "text-emerald-700 font-medium" : "text-slate-600"}>
              {opt.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
