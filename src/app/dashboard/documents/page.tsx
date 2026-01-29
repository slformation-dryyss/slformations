import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Upload, X, Check, Clock, AlertTriangle, FileText, Trash2, Eye, Download, Award, ShieldCheck } from "lucide-react";
import { deleteDocumentAction } from "./actions";
import { REQUIRED_DOCS, OPTIONAL_DOCS, DocType } from "./constants";
import UploadZone from "./UploadZone";
import Link from "next/link";
import { DownloadCertificateButton } from "@/components/courses/DownloadCertificateButton";

export default async function DocumentsPage() {
    const user = await requireUser();

    // 1. Fetch user administrative documents
    const documents = await prisma.userDocument.findMany({
        where: { userId: user.id },
        orderBy: { uploadedAt: "desc" }
    });

    // 2. Fetch completed enrollments for certificates
    const completedEnrollments = await prisma.enrollment.findMany({
        where: {
            userId: user.id,
            progress: 100, // For now we rely on the main progress field
            status: "ACTIVE" // Or 'COMPLETED' if we had that status
        },
        include: {
            course: true
        }
    });

    // Check completeness of identity docs
    const approvedDocs = documents.filter(d => d.status === "APPROVED").map(d => d.type);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "APPROVED": return <Check className="text-green-500 w-5 h-5" />;
            case "REJECTED": return <X className="text-red-500 w-5 h-5" />;
            case "PENDING": return <Clock className="text-amber-500 w-5 h-5" />;
            default: return <FileText className="text-slate-400 w-5 h-5" />;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "APPROVED": return <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-[10px] font-bold uppercase">Validé</span>;
            case "REJECTED": return <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-[10px] font-bold uppercase">Refusé</span>;
            case "PENDING": return <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-[10px] font-bold uppercase">En attente</span>;
            default: return null;
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-10 p-6">
            <div className="border-b border-slate-200 pb-8">
                <h1 className="text-3xl font-bold text-slate-900">Gestion Documentaire</h1>
                <p className="text-slate-500 mt-2">Accédez à vos justificatifs administratifs et vos attestations de formation.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1.5fr,1fr] gap-12">

                {/* --- LEFT COLUMN: ADMINISTRATIVE & TRAINING DOCS --- */}
                <div className="space-y-12">

                    {/* TRAINING DOCUMENTS SECTION */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-2 text-navy-900 border-l-4 border-gold-500 pl-4">
                            <Award className="w-6 h-6 text-gold-600" />
                            <h2 className="text-xl font-bold uppercase tracking-tight">Mes Documents de Formation</h2>
                        </div>

                        {completedEnrollments.length === 0 ? (
                            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 text-center">
                                <FileText className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                                <p className="text-slate-500 italic text-sm">Vos attestations apparaîtront ici une fois vos formations terminées à 100%.</p>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {completedEnrollments.map((enrollment) => (
                                    <div key={enrollment.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:border-gold-500/50 transition">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gold-50 rounded-xl flex items-center justify-center text-gold-600">
                                                <ShieldCheck className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-900">{enrollment.course.title}</h3>
                                                <p className="text-xs text-slate-500">Terminée le {new Date(enrollment.updatedAt).toLocaleDateString('fr-FR')}</p>
                                            </div>
                                        </div>
                                        <div className="shrink-0">
                                            <DownloadCertificateButton
                                                userName={`${user.firstName} ${user.lastName}`}
                                                courseTitle={enrollment.course.title}
                                                startDate={new Date(enrollment.createdAt).toLocaleDateString('fr-FR')}
                                                endDate={new Date(enrollment.updatedAt).toLocaleDateString('fr-FR')}
                                                // @ts-ignore
                                                duration={enrollment.course.drivingHours ?? 35} // Placeholder duration
                                                variant="outline"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* IDENTITY DOCUMENTS SECTION */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-2 text-navy-900 border-l-4 border-slate-300 pl-4">
                            <FileText className="w-6 h-6 text-slate-600" />
                            <h2 className="text-xl font-bold uppercase tracking-tight">Justificatifs d&apos;Identité</h2>
                        </div>

                        <div className="space-y-4">
                            {REQUIRED_DOCS.map((reqDoc) => {
                                const uploaded = documents.filter(d => d.type === reqDoc.type);
                                const isApproved = uploaded.some(d => d.status === "APPROVED");
                                const isPending = uploaded.some(d => d.status === "PENDING");
                                const latestDoc = uploaded[0];
                                const isLatestRejected = latestDoc?.status === "REJECTED";

                                return (
                                    <div key={reqDoc.type} className={`bg-white p-6 rounded-2xl shadow-sm border ${isLatestRejected ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}>
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="font-bold text-slate-900">{reqDoc.label}</h3>
                                                {uploaded.length > 0 && (
                                                    <p className="text-[10px] uppercase font-bold text-slate-400 mt-1 tracking-wider">
                                                        {uploaded.length} Fichier{uploaded.length > 1 ? 's' : ''} transmis
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
                                            <div className="mb-4 p-3 bg-red-100 border border-red-200 rounded-xl text-red-800 text-sm flex items-start gap-2">
                                                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                                                <div>
                                                    <span className="font-bold block">Document refusé</span>
                                                    <p>{latestDoc?.rejectionReason || "Le document n'est pas conforme."}</p>
                                                </div>
                                            </div>
                                        )}

                                        {!isApproved ? (
                                            <UploadZone docType={reqDoc.type} docLabel={reqDoc.label} />
                                        ) : (
                                            <div className="text-sm text-green-700 font-bold bg-green-50 p-3 rounded-lg flex items-center gap-2">
                                                <Check className="w-5 h-5" /> Document validé par l&apos;administration
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </section>
                </div>

                {/* --- RIGHT COLUMN: HISTORY STICKY --- */}
                <aside className="space-y-6">
                    <div className="bg-slate-900 rounded-3xl p-8 text-white h-fit sticky top-28 shadow-2xl">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                            <Clock className="w-6 h-6 text-gold-500" />
                            Historique des flux
                        </h3>

                        {documents.length === 0 ? (
                            <p className="text-slate-400 italic text-sm">Aucune activité récente.</p>
                        ) : (
                            <div className="space-y-4">
                                {documents.map(doc => (
                                    <div key={doc.id} className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div className="p-2 bg-slate-700 rounded-lg text-slate-400">
                                                    <FileText className="w-4 h-4" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-bold truncate text-slate-100">
                                                        {[...REQUIRED_DOCS, ...OPTIONAL_DOCS].find(d => d.type === doc.type)?.label || doc.type}
                                                    </p>
                                                    <p className="text-[10px] text-slate-500 font-bold">
                                                        {new Date(doc.uploadedAt).toLocaleDateString('fr-FR')}
                                                    </p>
                                                </div>
                                            </div>
                                            <div>
                                                {getStatusIcon(doc.status)}
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <Link
                                                href={doc.fileUrl}
                                                target="_blank"
                                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-[10px] font-bold bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition"
                                            >
                                                <Eye className="w-3 h-3" />
                                                VOIR
                                            </Link>
                                            <a
                                                href={doc.fileUrl}
                                                download
                                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-[10px] font-bold bg-gold-500 hover:bg-gold-600 text-navy-900 rounded-lg transition"
                                            >
                                                <Download className="w-3 h-3" />
                                                SAVE
                                            </a>
                                            {doc.status !== "APPROVED" && (
                                                <form action={deleteDocumentAction.bind(null, doc.id)} className="shrink-0">
                                                    <button type="submit" className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </form>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </aside>
            </div>
        </div>
    );
}

