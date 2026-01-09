import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Check, FileText, Download, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { DocumentReviewForm } from "./DocumentReviewForm";
import { REQUIRED_DOCS } from "@/app/dashboard/documents/constants";

interface PageProps {
    params: Promise<{
        userId: string;
    }>;
}

export default async function AdminDocumentDetailPage({ params }: PageProps) {
    await requireAdmin();
    const { userId } = await params;

    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { documents: { orderBy: { uploadedAt: 'desc' }} }
    });

    if (!user) return <div>Utilisateur introuvable</div>;

    const approvedCount = user.documents.filter(d => d.status === "APPROVED").length;
    const isComplete = approvedCount >= REQUIRED_DOCS.length;

    return (
        <div className="max-w-5xl mx-auto pb-10">
            <Link href="/admin/documents" className="inline-flex items-center text-slate-500 hover:text-slate-900 mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" /> Retour à la liste
            </Link>

            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">{user.firstName} {user.lastName}</h1>
                    <p className="text-slate-500">{user.email} • {user.phone || "Pas de téléphone"}</p>
                </div>
                <div className="flex gap-2">
                     <span className={`px-3 py-1 rounded-full text-sm font-bold border ${isComplete ? 'bg-green-50 border-green-200 text-green-700' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
                         {isComplete ? "Dossier Complet" : "Dossier Incomplet"}
                     </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">Pièces reçues</h2>
                    {user.documents.map(doc => (
                        <div key={doc.id} className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                             <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <FileText className="w-6 h-6 text-slate-400" />
                                    <div>
                                        <h3 className="font-bold text-slate-900">{REQUIRED_DOCS.find(d => d.type === doc.type)?.label || doc.type}</h3>
                                        <p className="text-xs text-slate-500">Reçu le {doc.uploadedAt.toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded font-bold ${
                                    doc.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                    doc.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                    'bg-amber-100 text-amber-800'
                                }`}>
                                    {doc.status === 'APPROVED' ? 'VALIDÉ' : 
                                     doc.status === 'REJECTED' ? 'REFUSÉ' : 'À RÉVISER'}
                                </span>
                             </div>

                             {/* PREVIEW LINK */}
                             <div className="mb-4 p-4 bg-slate-50 rounded border border-slate-100 flex items-center justify-between">
                                  <span className="text-sm text-slate-600 truncate max-w-[200px]">{doc.fileUrl.split('/').pop()}</span>
                                  <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 text-sm font-bold flex items-center gap-1">
                                      <Download className="w-4 h-4" /> Voir / Télécharger
                                  </a>
                             </div>

                             {/* ACTIONS */}
                             {doc.status === 'PENDING' && (
                                 <DocumentReviewForm documentId={doc.id} />
                             )}
                        </div>
                    ))}
                    {user.documents.length === 0 && <p className="text-slate-500 italic">Aucun document.</p>}
                </div>

                <div className="bg-slate-50 p-6 rounded-lg self-start">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">Récapitulatif</h2>
                    <ul className="space-y-2 text-sm text-slate-600">
                        {REQUIRED_DOCS.map(req => {
                            const found = user.documents.find(d => d.type === req.type && d.status === "APPROVED");
                             return (
                                 <li key={req.type} className="flex items-center gap-2">
                                     {found ? <Check className="w-4 h-4 text-green-500" /> : <div className="w-4 h-4 rounded-full border border-slate-300" />}
                                     <span className={found ? "text-slate-900 font-medium" : ""}>{req.label}</span>
                                 </li>
                             )
                        })}
                    </ul>
                </div>
            </div>
        </div>
    );
}

