"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle, Info, XCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "danger" | "warning" | "info" | "success";
    showCancel?: boolean;
}

const variantStyles = {
    danger: {
        icon: XCircle,
        iconColor: "text-red-500",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        buttonBg: "bg-red-500 hover:bg-red-600",
    },
    warning: {
        icon: AlertTriangle,
        iconColor: "text-orange-500",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-200",
        buttonBg: "bg-orange-500 hover:bg-orange-600",
    },
    info: {
        icon: Info,
        iconColor: "text-blue-500",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        buttonBg: "bg-blue-500 hover:bg-blue-600",
    },
    success: {
        icon: CheckCircle,
        iconColor: "text-green-500",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        buttonBg: "bg-green-500 hover:bg-green-600",
    },
};

export function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirmer",
    cancelText = "Annuler",
    variant = "danger",
    showCancel = true,
}: ConfirmDialogProps) {
    const style = variantStyles[variant];
    const Icon = style.icon;

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
                    >
                        {/* Header with Icon */}
                        <div
                            className={cn(
                                "flex items-center gap-4 p-6 border-b",
                                style.bgColor,
                                style.borderColor
                            )}
                        >
                            <div className={cn("p-3 rounded-full bg-white/80 shadow-sm")}>
                                <Icon className={cn("w-6 h-6", style.iconColor)} />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 flex-1">
                                {title}
                            </h3>
                            <button
                                onClick={onClose}
                                className="p-1.5 rounded-full hover:bg-white/50 text-slate-400 hover:text-slate-600 transition-colors"
                                aria-label="Fermer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            <p className="text-slate-700 leading-relaxed">{message}</p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 p-6 bg-slate-50 border-t border-slate-100">
                            {showCancel && (
                                <button
                                    onClick={onClose}
                                    className="flex-1 px-4 py-2.5 bg-white border-2 border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
                                >
                                    {cancelText}
                                </button>
                            )}
                            <button
                                onClick={handleConfirm}
                                className={cn(
                                    "flex-1 px-4 py-2.5 text-white rounded-xl font-bold transition-all shadow-lg",
                                    style.buttonBg,
                                    showCancel ? "" : "w-full"
                                )}
                            >
                                {confirmText}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
