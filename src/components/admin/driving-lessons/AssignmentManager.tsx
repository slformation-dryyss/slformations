"use client";

import { useState, useEffect, useRef } from "react";
import { Search, UserPlus, Users, X, Check, Loader2, Info } from "lucide-react";
import { assignInstructorManually, searchStudents } from "@/app/admin/driving-lessons/actions";
import { cn } from "@/lib/utils";

interface Instructor {
    id: string;
    user: {
        firstName: string | null;
        lastName: string | null;
        email: string;
    };
}

interface Student {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
}

interface AssignmentManagerProps {
    instructors: Instructor[];
}

export function AssignmentManager({ instructors }: AssignmentManagerProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<Student[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [selectedInstructorId, setSelectedInstructorId] = useState("");
    const [courseType, setCourseType] = useState("PERMIS_B");
    const [loading, setLoading] = useState(false);
    const [searching, setSearching] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const dropdownRef = useRef<HTMLDivElement>(null);

    // Search students when query changes
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (searchQuery.length > 1 && !selectedStudent) {
                setSearching(true);
                const res = await searchStudents(searchQuery);
                if (res.success && res.data) {
                    setSearchResults(res.data as Student[]);
                }
                setSearching(false);
            } else {
                setSearchResults([]);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery, selectedStudent]);

    // Close dropdown on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setSearchResults([]);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleAssign = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedStudent || !selectedInstructorId) return;

        setLoading(true);
        setMessage(null);

        try {
            const res = await assignInstructorManually({
                studentId: selectedStudent.id,
                instructorId: selectedInstructorId,
                courseType,
            });

            if (res.success) {
                setMessage({ type: "success", text: "Attribution réussie !" });
                setSelectedStudent(null);
                setSearchQuery("");
                setSelectedInstructorId("");
            } else {
                setMessage({ type: "error", text: res.error || "Une erreur est survenue" });
            }
        } catch (error) {
            setMessage({ type: "error", text: "Erreur de connexion" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative">
            <div className="flex items-center gap-2 mb-6 text-gold-600">
                <UserPlus className="w-5 h-5" />
                <h2 className="font-bold text-slate-900">Nouvelle Attribution</h2>
            </div>

            <form onSubmit={handleAssign} className="space-y-4">
                {/* Élève Search */}
                <div className="relative" ref={dropdownRef}>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Élève</label>
                    {selectedStudent ? (
                        <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gold-100 text-gold-700 rounded-full flex items-center justify-center text-xs font-bold">
                                    {selectedStudent.firstName?.[0]}{selectedStudent.lastName?.[0]}
                                </div>
                                <div className="text-sm font-medium text-slate-900">
                                    {selectedStudent.firstName} {selectedStudent.lastName}
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedStudent(null)}
                                className="p-1 hover:bg-slate-200 rounded-full text-slate-400 transition"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <div className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Nom, prénom ou email..."
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 outline-none transition-all text-sm"
                            />
                            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                            {searching && <Loader2 className="w-4 h-4 text-gold-500 absolute right-3.5 top-3 animate-spin" />}
                        </div>
                    )}

                    {/* Results Dropdown */}
                    {searchResults.length > 0 && (
                        <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                            {searchResults.map((student) => (
                                <button
                                    key={student.id}
                                    type="button"
                                    onClick={() => {
                                        setSelectedStudent(student);
                                        setSearchResults([]);
                                        setSearchQuery("");
                                    }}
                                    className="w-full p-3 flex items-start gap-3 hover:bg-slate-50 transition text-left border-b border-slate-50 last:border-0"
                                >
                                    <div className="w-8 h-8 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center text-xs font-bold">
                                        {student.firstName?.[0]}{student.lastName?.[0]}
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-slate-900">{student.firstName} {student.lastName}</div>
                                        <div className="text-xs text-slate-500">{student.email}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Instructeur Select */}
                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Instructeur</label>
                    <div className="relative">
                        <select
                            value={selectedInstructorId}
                            onChange={(e) => setSelectedInstructorId(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 outline-none transition-all text-sm appearance-none"
                            required
                        >
                            <option value="">Sélectionner un moniteur...</option>
                            {instructors.map((instructor) => (
                                <option key={instructor.id} value={instructor.id}>
                                    {instructor.user.firstName} {instructor.user.lastName} ({instructor.user.email})
                                </option>
                            ))}
                        </select>
                        <Users className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    </div>
                </div>

                {/* Type de cours */}
                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Type de formation</label>
                    <select
                        value={courseType}
                        onChange={(e) => setCourseType(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 outline-none transition-all text-sm"
                    >
                        <option value="PERMIS_B">Permis B (Classique)</option>
                        <option value="CONDUITE_ACCOMPAGNEE">Conduite Accompagnée</option>
                        <option value="PERMIS_B78">Permis B78 (Automatique)</option>
                    </select>
                </div>

                {message && (
                    <div className={cn(
                        "p-3 rounded-lg text-sm font-medium flex items-center gap-2 animate-in fade-in zoom-in-95 duration-200",
                        message.type === "success" ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-700 border border-red-100"
                    )}>
                        {message.type === "success" ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                        {message.text}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading || !selectedStudent || !selectedInstructorId}
                    className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-slate-200 flex items-center justify-center gap-2 mt-2"
                >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {loading ? "Attribution en cours..." : "Valider l'attribution"}
                </button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-100">
                <div className="flex items-start gap-2 text-xs text-slate-400 leading-relaxed italic">
                    <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                    <p>L'attribution manuelle désactive automatiquement l'ancienne attribution si elle existe pour ce type de cours.</p>
                </div>
            </div>
        </div>
    );
}
