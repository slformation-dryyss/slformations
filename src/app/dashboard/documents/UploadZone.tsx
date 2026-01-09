"use client";

import { Upload } from "lucide-react";
import { useState, useRef, useTransition } from "react";
import { uploadDocumentAction } from "./actions";
import { useRouter } from "next/navigation";

type UploadZoneProps = {
    docType: string;
    docLabel: string;
};

export default function UploadZone({ docType, docLabel }: UploadZoneProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            await handleFileUpload(file);
        }
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            await handleFileUpload(file);
            // Reset the input value to allow re-uploading the same file
            e.target.value = '';
        }
    };

    const handleFileUpload = async (file: File) => {
        setError(null);
        setSuccess(false);
        
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", docType);

        try {
            const result = await uploadDocumentAction(formData);
            
            if (result.error) {
                setError(result.error);
            } else {
                setSuccess(true);
                
                // Use startTransition to refresh without causing re-render loop
                startTransition(() => {
                    router.refresh();
                });
                
                // Reset success message after 3s
                setTimeout(() => setSuccess(false), 3000);
            }
        } catch (error) {
            console.error("Upload error:", error);
            setError("Erreur lors de l'upload du fichier.");
        }
    };

    const isUploading = isPending;

    return (
        <div className="mt-4">
            <input type="hidden" name="type" value={docType} />
            
            {/* Drag & Drop Zone */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`
                    relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                    transition-all duration-200
                    ${isDragging 
                        ? 'border-gold-500 bg-gold-50' 
                        : 'border-slate-300 bg-slate-50 hover:border-gold-400 hover:bg-gold-50/50'
                    }
                    ${isUploading ? 'opacity-50 pointer-events-none' : ''}
                `}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    name="file"
                    onChange={handleFileSelect}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                />
                
                <div className="flex flex-col items-center gap-3">
                    <div className={`p-3 rounded-full ${isDragging ? 'bg-gold-100' : 'bg-slate-100'}`}>
                        <Upload className={`w-6 h-6 ${isDragging ? 'text-gold-600' : 'text-slate-500'}`} />
                    </div>
                    
                    {isUploading ? (
                        <div className="text-sm text-slate-600">
                            <div className="animate-spin w-5 h-5 border-2 border-gold-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                            Envoi en cours...
                        </div>
                    ) : success ? (
                        <div className="text-sm text-green-600 font-semibold">
                            ✓ Fichier envoyé avec succès !
                        </div>
                    ) : (
                        <>
                            <div className="text-sm text-slate-700">
                                <span className="font-semibold text-gold-600">Cliquez pour parcourir</span>
                                {' '}ou glissez-déposez votre fichier
                            </div>
                            <p className="text-xs text-slate-500">
                                PDF, JPG, PNG (Max 5Mo)
                            </p>
                        </>
                    )}
                </div>
            </div>
            
            {error && (
                <p className="text-xs text-red-600 mt-2 text-center font-semibold">
                    ⚠️ {error}
                </p>
            )}
            
            {!error && (
                <p className="text-xs text-slate-400 mt-2 text-center">
                    💡 Vous pouvez envoyer plusieurs fichiers (ex: recto + verso)
                </p>
            )}
        </div>
    );
}

