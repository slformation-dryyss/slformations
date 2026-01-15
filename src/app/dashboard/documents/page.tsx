import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Upload, X, Check, Clock, AlertTriangle, FileText, Trash2, Eye, Download } from "lucide-react";
import { deleteDocumentAction } from "./actions";
import { REQUIRED_DOCS, OPTIONAL_DOCS, DocType } from "./constants";
import UploadZone from "./UploadZone";
import Link from "next/link";

export default async function DocumentsPage() {
    const user = await requireUser();

    const documents = await prisma.userDocument.findMany({
        where: { userId: user.id },
        orderBy: { uploadedAt: "desc" }
    });

    // Check completeness
    const approvedDocs = documents.filter(d => d.status === "APPROVED").map(d => d.type);
    const pendingDocs = documents.filter(d => d.status === "PENDING").map(d => d.type);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "APPROVED": return <Check className="text-green-500" />;
            case "REJECTED": return <X className="text-red-500" />;
            case "PENDING": return <Clock className="text-amber-500" />;
            default: return <FileText className="text-slate-400" />;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "APPROVED": return <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-bold">Validé</span>;
            case "REJECTED": return <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-bold">Refusé</span>;
            case "PENDING": return <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs font-bold">En attente</span>;
            default: return null;
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-slate-900">Mes Documents Administratifs</h1>
            <p className="text-slate-600">
                Pour valider votre inscription définitive, veuillez fournir les pièces justificatives ci-dessous.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* --- UPLOAD SECTION --- */}
                <div className="space-y-6">
                    {REQUIRED_DOCS.map((reqDoc) => {
                        const uploaded = documents.filter(d => d.type === reqDoc.type);
                        const isApproved = uploaded.some(d => d.status === "APPROVED");
                        const isPending = uploaded.some(d => d.status === "PENDING");

                        // Count uploads for this type
                        const uploadCount = uploaded.length;

                        const latestDoc = uploaded[0];
                        const isLatestRejected = latestDoc?.status === "REJECTED";
                        const rejectionReason = latestDoc?.rejectionReason;

                        const canUpload = !isApproved;

                        return (
                            <div key={reqDoc.type} className={`bg-white p-6 rounded-lg shadow-sm border ${isLatestRejected ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}>
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-800">{reqDoc.label}</h3>
                                        {uploadCount > 0 && (
                                            <p className="text-xs text-slate-500 mt-1">
                                                {uploadCount} fichier{uploadCount > 1 ? 's' : ''} envoyé{uploadCount > 1 ? 's' : ''}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-1 items-end">
                                        {isApproved && getStatusBadge("APPROVED")}
                                        {isPending && !isApproved && getStatusBadge("PENDING")}
                                        {isLatestRejected && !isPending && !isApproved && getStatusBadge("REJECTED")}
                                    </div>
                                </div>

                                {isLatestRejected && (
                                    <div className="mb-4 p-3 bg-red-100 border border-red-200 rounded-md text-red-800 text-sm flex items-start gap-2 animate-in fade-in slide-in-from-top-1">
                                        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                                        <div>
                                            <span className="font-bold block">Document refusé</span>
                                            <p>{rejectionReason || "Le document n'est pas conforme. Veuillez vérifier la qualité et la validité du fichier."}</p>
                                        </div>
                                    </div>
                                )}

                                {canUpload ? (
                                    <UploadZone docType={reqDoc.type} docLabel={reqDoc.label} />
                                ) : (
                                    <div className="text-sm text-green-700 font-medium mt-2 flex items-center gap-2">
                                        <Check className="w-4 h-4" /> Document validé par l'administration.
                                    </div>
                                )}
                            </div>
                        )
                    })}

                    <div className="pt-4 mt-4 border-t border-slate-200">
                        <h2 className="text-xl font-bold text-slate-800 mb-4">Documents Optionnels</h2>
                        <div className="grid grid-cols-1 gap-6">
                            {OPTIONAL_DOCS.map((optDoc) => {
                                const uploaded = documents.filter(d => d.type === optDoc.type);
                                const isApproved = uploaded.some(d => d.status === "APPROVED");
                                const isPending = uploaded.some(d => d.status === "PENDING");
                                const uploadCount = uploaded.length;
                                const latestDoc = uploaded[0];
                                const isLatestRejected = latestDoc?.status === "REJECTED";

                                return (
                                    <div key={optDoc.type} className={`bg-white p-6 rounded-lg shadow-sm border ${isLatestRejected ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}>
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="font-bold text-lg text-slate-800">{optDoc.label}</h3>
                                                {optDoc.description && (
                                                    <p className="text-sm text-slate-500 mt-0.5">{optDoc.description}</p>
                                                )}
                                                {uploadCount > 0 && (
                                                    <p className="text-xs text-slate-500 mt-1">
                                                        {uploadCount} fichier{uploadCount > 1 ? 's' : ''} envoyé{uploadCount > 1 ? 's' : ''}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex flex-col gap-1 items-end">
                                                {isApproved && getStatusBadge("APPROVED")}
                                                {isPending && !isApproved && getStatusBadge("PENDING")}
                                                {isLatestRejected && !isPending && !isApproved && getStatusBadge("REJECTED")}
                                            </div>
                                        </div>
                                        <UploadZone docType={optDoc.type} docLabel={optDoc.label} />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* --- HISTORY SECTION --- */}
                <div className="bg-slate-50 p-6 rounded-lg h-fit sticky top-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-4">Historique des envois</h3>
                    {documents.length === 0 ? (
                        <p className="text-slate-500 italic">Aucun document envoyé.</p>
                    ) : (
                        <ul className="space-y-3">
                            {documents.map(doc => (
                                <li key={doc.id} className="bg-white p-3 rounded shadow-sm">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3 overflow-hidden flex-1">
                                            <div className="p-2 bg-slate-100 rounded text-slate-500">
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-medium truncate text-slate-800">
                                                    <span className="font-bold text-slate-900">
                                                        {[...REQUIRED_DOCS, ...OPTIONAL_DOCS].find(d => d.type === doc.type)?.label || doc.type}
                                                    </span>
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    Le {doc.uploadedAt.toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(doc.status)}
                                            {doc.status !== "APPROVED" && (
                                                <form action={deleteDocumentAction.bind(null, doc.id)}>
                                                    <button type="submit" className="text-slate-400 hover:text-red-500 transition">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </form>
                                            )}
                                        </div>
                                    </div>

                                    {/* Preview/Download buttons */}
                                    <div className="flex gap-2 mt-2">
                                        <Link
                                            href={doc.fileUrl}
                                            target="_blank"
                                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition"
                                        >
                                            <Eye className="w-4 h-4" />
                                            Visualiser
                                        </Link>
                                        <a
                                            href={doc.fileUrl}
                                            download
                                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs bg-gold-100 hover:bg-gold-200 text-gold-700 rounded transition"
                                        >
                                            <Download className="w-4 h-4" />
                                            Télécharger
                                        </a>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}

