"use client";

import { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, Calendar, Search, RefreshCw, GraduationCap } from "lucide-react";
import { getMyStudents } from "../availability/actions";

type Student = {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
    phone: string | null;
    city: string | null;
    addressLine1: string | null;
    postalCode: string | null;
    courseType: string;
    assignedAt: Date;
};

export default function InstructorStudentsPage() {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        loadStudents();
    }, []);

    async function loadStudents() {
        setLoading(true);
        const result = await getMyStudents();
        if (result.success && result.data) {
            setStudents(result.data as any);
        }
        setLoading(false);
    }

    const filteredStudents = students.filter((s) => {
        const fullName = `${s.firstName || ""} ${s.lastName || ""}`.toLowerCase();
        const email = s.email.toLowerCase();
        const query = searchQuery.toLowerCase();
        return fullName.includes(query) || email.includes(query);
    });

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Mes Élèves</h1>
                    <p className="text-slate-500 mt-1">Liste des élèves qui vous sont attribués pour la conduite</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Rechercher un élève..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg w-full md:w-64 focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                    />
                </div>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <RefreshCw className="w-8 h-8 animate-spin text-gold-500 mx-auto mb-4" />
                    <p className="text-slate-500">Chargement de vos élèves...</p>
                </div>
            ) : students.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                    <GraduationCap className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Aucun élève attribué</h3>
                    <p className="text-slate-500">
                        Dès que l'administration vous attribuera des élèves, ils apparaîtront ici.
                    </p>
                </div>
            ) : filteredStudents.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                    <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Aucun résultat</h3>
                    <p className="text-slate-500">
                        Aucun élève ne correspond à votre recherche "{searchQuery}".
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredStudents.map((student) => (
                        <div key={student.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition">
                            <div className="p-6">
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="w-12 h-12 bg-gold-50 rounded-full flex items-center justify-center text-gold-600 flex-shrink-0">
                                        <User className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-xl font-bold text-slate-900 truncate">
                                            {student.firstName} {student.lastName}
                                        </h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded">
                                                {student.courseType}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-sm text-slate-600">
                                        <Mail className="w-4 h-4 text-slate-400" />
                                        <a href={`mailto:${student.email}`} className="hover:text-gold-600 transition truncate">
                                            {student.email}
                                        </a>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-slate-600">
                                        <Phone className="w-4 h-4 text-slate-400" />
                                        <span>{student.phone || "Non renseigné"}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-slate-600">
                                        <MapPin className="w-4 h-4 text-slate-400" />
                                        <span className="truncate">
                                            {[student.city, student.postalCode].filter(Boolean).join(", ") || "Ville non renseignée"}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-slate-600 pt-2 border-t border-slate-100">
                                        <Calendar className="w-4 h-4 text-slate-400" />
                                        <span>Attribué le {new Date(student.assignedAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
