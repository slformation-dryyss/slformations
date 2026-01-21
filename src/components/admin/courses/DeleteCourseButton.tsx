"use client";

import { Trash } from "lucide-react";
import { useTransition, useState } from "react";
import { toast } from "sonner";
import { deleteCourseAction } from "@/app/admin/courses/actions";

interface DeleteCourseButtonProps {
    courseId: string;
    courseName: string;
}

export function DeleteCourseButton({ courseId, courseName }: DeleteCourseButtonProps) {
    const [isPending, startTransition] = useTransition();
    const [isOpen, setIsOpen] = useState(false);

    const handleDelete = () => {
        startTransition(async () => {
            const formData = new FormData();
            formData.append("courseId", courseId);
            await deleteCourseAction(formData);
            toast.success("Formation supprimée avec succès");
            setIsOpen(false);
        });
    };

    return (
        <>
            <button 
                onClick={() => setIsOpen(true)}
                disabled={isPending}
                className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                title="Supprimer la formation"
            >
                <Trash className="w-4 h-4" />
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200 space-y-4 border border-slate-100">
                        <div className="flex flex-col items-center text-center gap-2">
                            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-2">
                                <Trash className="w-6 h-6 text-red-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">Supprimer la formation ?</h3>
                            <p className="text-slate-500 text-sm">
                                Êtes-vous sûr de vouloir supprimer <span className="font-semibold text-slate-700">"{courseName}"</span> ? 
                                <br/>Cette action est irréversible.
                            </p>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors"
                            >
                                Annuler
                            </button>
                            <button 
                                onClick={handleDelete}
                                disabled={isPending}
                                className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors shadow-lg shadow-red-200 disabled:opacity-70 flex items-center justify-center gap-2"
                            >
                                {isPending ? (
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Trash className="w-4 h-4" />
                                        Supprimer
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
