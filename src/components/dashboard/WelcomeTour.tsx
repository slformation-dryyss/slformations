"use client";

import { useState, useEffect } from "react";
import {
    X,
    ChevronRight,
    ChevronLeft,
    Sparkles,
    UserCheck,
    FileText,
    Calendar,
    CreditCard,
    BarChart3,
    ShieldCheck,
    CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Step = {
    title: string;
    description: string;
    icon: React.ReactNode;
    image?: string;
};

type WelcomeTourProps = {
    role: string;
    onClose: () => void;
    forced?: boolean;
};

export function WelcomeTour({ role, onClose, forced }: WelcomeTourProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (forced) {
            setIsVisible(true);
            return;
        }
        const hasCompleted = localStorage.getItem(`sl_tour_completed_${role}`);
        if (!hasCompleted) {
            const timer = setTimeout(() => setIsVisible(true), 1500); // Small delay for effect
            return () => clearTimeout(timer);
        }
    }, [role, forced]);

    const steps: Record<string, Step[]> = {
        STUDENT: [
            {
                title: "Bienvenue sur votre Espace Élève",
                description: "Nous sommes ravis de vous accompagner dans votre formation. Voici un petit tour d'horizon pour bien démarrer.",
                icon: <Sparkles className="w-12 h-12 text-gold-500" />,
            },
            {
                title: "Complétez votre profil",
                description: "Assurez-vous que vos informations personnelles sont à jour. C'est essentiel pour la création de votre dossier administratif.",
                icon: <UserCheck className="w-12 h-12 text-blue-500" />,
            },
            {
                title: "Gestion des documents",
                description: "Téléchargez vos pièces justificatives (Pièce d'identité, NEPH, etc.) directement depuis l'onglet documents pour validation.",
                icon: <FileText className="w-12 h-12 text-purple-500" />,
            },
            {
                title: "Planning & Réservations",
                description: "Consultez vos sessions à venir et réservez vos prochains créneaux de conduite ou de formation en quelques clics.",
                icon: <Calendar className="w-12 h-12 text-green-500" />,
            },
            {
                title: "Suivi des paiements",
                description: "Retrouvez vos factures, vos paiements effectués et réglez vos échéances en toute sécurité.",
                icon: <CreditCard className="w-12 h-12 text-amber-500" />,
            },
        ],
        INSTRUCTOR: [
            {
                title: "Bienvenue sur votre Espace Formateur",
                description: "Gérez vos cours, vos élèves et votre planning en un seul endroit.",
                icon: <Sparkles className="w-12 h-12 text-gold-500" />,
            },
            {
                title: "Votre Planning",
                description: "Visualisez vos sessions d'enseignement passées et futures pour une organisation optimale.",
                icon: <Calendar className="w-12 h-12 text-blue-500" />,
            },
            {
                title: "Gestion des élèves",
                description: "Consultez la liste des inscrits à vos sessions et suivez leur progression.",
                icon: <UserCheck className="w-12 h-12 text-green-500" />,
            },
        ],
        ADMIN: [
            {
                title: "Tableau de Bord Administratif",
                description: "Bienvenue sur votre centre de contrôle. Voici comment gérer efficacement l'auto-école.",
                icon: <ShieldCheck className="w-12 h-12 text-gold-500" />,
            },
            {
                title: "Analytiques & Performance",
                description: "Suivez l'évolution des inscriptions, le chiffre d'affaires et l'activité des sessions en temps réel.",
                icon: <BarChart3 className="w-12 h-12 text-blue-500" />,
            },
            {
                title: "Validation des dossiers",
                description: "Vérifiez les documents envoyés par les élèves et validez leur inscription définitive.",
                icon: <FileText className="w-12 h-12 text-purple-500" />,
            },
            {
                title: "Gestion Financière",
                description: "Générez des liens de paiement personnalisés pour vos clients et suivez les règlements.",
                icon: <CreditCard className="w-12 h-12 text-amber-500" />,
            },
        ],
    };

    // Default to Student steps if role not found, but Admin/Owner use Admin steps
    const roleKey = (role === "ADMIN" || role === "OWNER") ? "ADMIN" : role === "INSTRUCTOR" ? "INSTRUCTOR" : "STUDENT";
    const currentSteps = steps[roleKey] || steps.STUDENT;

    const nextStep = () => {
        if (currentStep < currentSteps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            completeTour();
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const completeTour = () => {
        localStorage.setItem(`sl_tour_completed_${role}`, "true");
        setIsVisible(false);
        onClose();
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-navy-950/80 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-lg w-full relative"
            >
                {/* Close Button */}
                <button
                    onClick={completeTour}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition z-10"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-8 sm:p-10 text-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex flex-col items-center"
                        >
                            <div className="mb-8 p-6 bg-slate-50 rounded-2xl">
                                {currentSteps[currentStep].icon}
                            </div>

                            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4 leading-tight">
                                {currentSteps[currentStep].title}
                            </h2>

                            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                                {currentSteps[currentStep].description}
                            </p>
                        </motion.div>
                    </AnimatePresence>

                    {/* Progress dots */}
                    <div className="flex justify-center gap-2 mt-10">
                        {currentSteps.map((_, idx) => (
                            <div
                                key={idx}
                                className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentStep ? 'w-8 bg-gold-500' : 'w-2 bg-slate-200'
                                    }`}
                            />
                        ))}
                    </div>

                    <div className="flex items-center justify-between mt-10">
                        <button
                            onClick={prevStep}
                            disabled={currentStep === 0}
                            className={`flex items-center gap-1 text-sm font-bold transition ${currentStep === 0 ? 'text-slate-300 pointer-events-none' : 'text-slate-500 hover:text-slate-800'
                                }`}
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Retour
                        </button>

                        <button
                            onClick={nextStep}
                            className="flex items-center gap-2 px-6 py-3 bg-gold-500 text-navy-900 rounded-xl font-bold hover:bg-gold-600 shadow-lg shadow-gold-500/20 active:scale-95 transition"
                        >
                            {currentStep === currentSteps.length - 1 ? (
                                <>
                                    Démarrer
                                    <CheckCircle2 className="w-5 h-5" />
                                </>
                            ) : (
                                <>
                                    Suivant
                                    <ChevronRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
