"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    User,
    Calendar,
    CheckCircle,
    XCircle,
    RefreshCw,
    AlertTriangle,
} from "lucide-react";
import { getChangeRequestDetails } from "../actions";
import { approveChangeRequest, rejectChangeRequest, getInstructors } from "../../actions";
import { toast } from "sonner";

type ChangeRequest = {
    id: string;
    reason: string;
    details: string | null;
    preferredGender: string | null;
    courseType: string;
    status: string;
    createdAt: Date;
    student: {
        id: string;
        firstName: string | null;
        lastName: string | null;
        email: string;
        phone: string | null;
    };
    currentInstructor: {
        id: string;
        user: {
            firstName: string | null;
            lastName: string | null;
            email: string;
        };
    };
    requestedInstructor: {
        id: string;
        user: {
            firstName: string | null;
            lastName: string | null;
        };
    } | null;
};

type Instructor = {
    id: string;
    city: string;
    department: string;
    isActive: boolean;
    user: {
        firstName: string | null;
        lastName: string | null;
        email: string;
    };
    _count: {
        assignments: number;
    };
};

export default function ChangeRequestDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const router = useRouter();
    const [request, setRequest] = useState<ChangeRequest | null>(null);
    const [instructors, setInstructors] = useState<Instructor[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [selectedInstructorId, setSelectedInstructorId] = useState<string>("");
    const [rejectNotes, setRejectNotes] = useState("");
    const [showRejectForm, setShowRejectForm] = useState(false);
    const [requestId, setRequestId] = useState<string>("");

    useEffect(() => {
        async function init() {
            const resolvedParams = await params;
            setRequestId(resolvedParams.id);
            await loadData(resolvedParams.id);
        }
        init();
    }, [params]);

    async function loadData(id: string) {
        setLoading(true);

        const [requestResult, instructorsResult] = await Promise.all([
            getChangeRequestDetails(id),
            getInstructors(),
        ]);

        if (requestResult.success && requestResult.data) {
            setRequest(requestResult.data as any);
            // Pre-select requested instructor if exists
            if (requestResult.data.requestedInstructor) {
                setSelectedInstructorId(requestResult.data.requestedInstructor.id);
            }
        }

        if (instructorsResult.success && instructorsResult.data) {
            setInstructors(instructorsResult.data as any);
        }

        setLoading(false);
    }

    async function handleApprove() {
        if (!selectedInstructorId) {
            toast.error("Veuillez sélectionner un instructeur");
            return;
        }

        setSubmitting(true);
        try {
            const result = await approveChangeRequest(requestId, selectedInstructorId);
            if (result.success) {
                toast.success("Demande approuvée avec succès");
                router.push("/admin/driving-lessons");
            } else {
                toast.error(result.error || "Erreur lors de l'approbation");
            }
        } catch (e) {
            toast.error("Erreur de connexion");
        }
        setSubmitting(false);
    }

    async function handleReject() {
        setSubmitting(true);
        try {
            const result = await rejectChangeRequest(requestId, rejectNotes || undefined);
            if (result.success) {
                toast.success("Demande rejetée");
                router.push("/admin/driving-lessons");
            } else {
                toast.error(result.error || "Erreur lors du rejet");
            }
        } catch (e) {
            toast.error("Erreur de connexion");
        }
        setSubmitting(false);
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <RefreshCw className="w-8 h-8 animate-spin text-gold-500" />
            </div>
        );
    }

    if (!request) {
        return (
            <div className="text-center py-12">
                <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <p className="text-slate-600">Demande introuvable</p>
                <Link
                    href="/admin/driving-lessons"
                    className="mt-4 inline-flex items-center gap-2 text-gold-600 hover:text-gold-700"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Retour
                </Link>
            </div>
        );
    }

    if (request.status !== "PENDING") {
        return (
            <div className="text-center py-12">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <p className="text-slate-600">Cette demande a déjà été traitée</p>
                <p className="text-sm text-slate-400 mt-2">
                    Statut: {request.status === "APPROVED" ? "Approuvée" : "Rejetée"}
                </p>
                <Link
                    href="/admin/driving-lessons"
                    className="mt-4 inline-flex items-center gap-2 text-gold-600 hover:text-gold-700"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Retour
                </Link>
            </div>
        );
    }

    const reasonLabels: Record<string, string> = {
        SCHEDULE: "Incompatibilité d'horaires",
        LOCATION: "Problème de localisation",
        PERSONALITY: "Incompatibilité personnelle",
        TEACHING_STYLE: "Méthode pédagogique",
        OTHER: "Autre raison",
    };

    return (
        <div className="max-w-4xl mx-auto pb-8">
            <Link
                href="/admin/driving-lessons"
                className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-6"
            >
                <ArrowLeft className="w-4 h-4" />
                Retour aux demandes
            </Link>

            <h1 className="text-2xl font-bold text-slate-900 mb-6">
                Traiter la Demande de Changement
            </h1>

            {/* Détails de la demande */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Informations de la demande</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Élève */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Élève</h3>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <User className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="font-bold text-slate-900">
                                    {request.student.firstName} {request.student.lastName}
                                </p>
                                <p className="text-sm text-slate-500">{request.student.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Instructeur actuel */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                            Instructeur Actuel
                        </h3>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                                <User className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                                <p className="font-bold text-slate-900">
                                    {request.currentInstructor.user.firstName}{" "}
                                    {request.currentInstructor.user.lastName}
                                </p>
                                <p className="text-sm text-slate-500">
                                    {request.currentInstructor.user.email}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-slate-500">Raison</p>
                            <p className="font-medium text-slate-900">
                                {reasonLabels[request.reason] || request.reason}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Type de formation</p>
                            <p className="font-medium text-slate-900">{request.courseType}</p>
                        </div>
                    </div>
                    {request.details && (
                        <div className="mt-4">
                            <p className="text-sm text-slate-500">Détails</p>
                            <p className="font-medium text-slate-900 bg-slate-50 p-3 rounded-lg mt-1">
                                {request.details}
                            </p>
                        </div>
                    )}
                    {request.preferredGender && (
                        <div className="mt-4">
                            <p className="text-sm text-slate-500">Préférence</p>
                            <p className="font-medium text-slate-900">
                                Instructeur{" "}
                                {request.preferredGender === "MALE"
                                    ? "homme"
                                    : request.preferredGender === "FEMALE"
                                        ? "femme"
                                        : "sans préférence"}
                            </p>
                        </div>
                    )}
                    <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
                        <Calendar className="w-4 h-4" />
                        Demandé le {new Date(request.createdAt).toLocaleDateString("fr-FR")}
                    </div>
                </div>
            </div>

            {/* Sélection du nouvel instructeur */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 mb-4">
                    Sélectionner le Nouvel Instructeur
                </h2>

                <div className="space-y-3">
                    {instructors
                        .filter((i) => i.id !== request.currentInstructor.id && i.isActive)
                        .map((instructor) => (
                            <label
                                key={instructor.id}
                                className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition ${selectedInstructorId === instructor.id
                                    ? "border-gold-500 bg-gold-50"
                                    : "border-slate-200 hover:border-slate-300"
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="instructor"
                                    value={instructor.id}
                                    checked={selectedInstructorId === instructor.id}
                                    onChange={(e) => setSelectedInstructorId(e.target.value)}
                                    className="w-4 h-4 text-gold-500 focus:ring-gold-500"
                                />
                                <div className="flex-1">
                                    <p className="font-bold text-slate-900">
                                        {instructor.user.firstName} {instructor.user.lastName}
                                    </p>
                                    <p className="text-sm text-slate-500">
                                        {instructor.city} ({instructor.department}) •{" "}
                                        {instructor._count.assignments} élève(s) assigné(s)
                                    </p>
                                </div>
                                {request.requestedInstructor?.id === instructor.id && (
                                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                                        Demandé par l'élève
                                    </span>
                                )}
                            </label>
                        ))}
                </div>

                {instructors.filter((i) => i.id !== request.currentInstructor.id && i.isActive)
                    .length === 0 && (
                        <p className="text-center text-slate-500 py-4">
                            Aucun autre instructeur actif disponible
                        </p>
                    )}
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                {showRejectForm ? (
                    <div className="space-y-4">
                        <h3 className="font-bold text-slate-900">Raison du rejet (optionnel)</h3>
                        <textarea
                            value={rejectNotes}
                            onChange={(e) => setRejectNotes(e.target.value)}
                            placeholder="Expliquez pourquoi la demande est rejetée..."
                            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            rows={3}
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={handleReject}
                                disabled={submitting}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition disabled:opacity-50"
                            >
                                <XCircle className="w-5 h-5" />
                                Confirmer le Rejet
                            </button>
                            <button
                                onClick={() => setShowRejectForm(false)}
                                disabled={submitting}
                                className="px-4 py-3 bg-slate-100 text-slate-700 rounded-lg font-bold hover:bg-slate-200 transition"
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex gap-4">
                        <button
                            onClick={handleApprove}
                            disabled={submitting || !selectedInstructorId}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <CheckCircle className="w-5 h-5" />
                            {submitting ? "Traitement..." : "Approuver et Changer"}
                        </button>
                        <button
                            onClick={() => setShowRejectForm(true)}
                            disabled={submitting}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition disabled:opacity-50"
                        >
                            <XCircle className="w-5 h-5" />
                            Rejeter
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
