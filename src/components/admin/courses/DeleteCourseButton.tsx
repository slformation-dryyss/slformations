"use client";

import { Trash } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { deleteCourseAction } from "@/app/admin/courses/actions";

interface DeleteCourseButtonProps {
    courseId: string;
    courseName: string;
}

export function DeleteCourseButton({ courseId, courseName }: DeleteCourseButtonProps) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        if (window.confirm(`Êtes-vous sûr de vouloir supprimer la formation "${courseName}" ? Cette action est irréversible.`)) {
            startTransition(async () => {
                const formData = new FormData();
                formData.append("courseId", courseId);
                await deleteCourseAction(formData);
                toast.success("Formation supprimée avec succès");
            });
        }
    };

    return (
        <button 
            onClick={handleDelete}
            disabled={isPending}
            className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
            title="Supprimer la formation"
        >
            <Trash className="w-4 h-4" />
        </button>
    );
}
