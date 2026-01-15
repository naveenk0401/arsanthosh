"use client";

import { useToast } from "@/context/ToastContext";
import { useEffect, useState } from "react";

export default function ToastContainer() {
    const { toasts, removeToast } = useToast();

    return (
        <div className="fixed top-24 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
            ))}
        </div>
    );
}

function ToastItem({ toast, onRemove }: { toast: any; onRemove: () => void }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const typeStyles = {
        success: "border-green-500/20 bg-green-50/10 text-green-400",
        error: "border-red-500/20 bg-red-50/10 text-red-400",
        info: "border-blue-500/20 bg-blue-50/10 text-blue-400",
        warning: "border-yellow-500/20 bg-yellow-50/10 text-yellow-500"
    };

    const icon = {
        success: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
        ),
        error: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
        ),
        info: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        warning: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        )
    };

    return (
        <div
            className={`pointer-events-auto min-w-[300px] p-4 rounded-sm border backdrop-blur-md shadow-2xl flex items-center gap-4 transition-all duration-500 ${isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
                } ${typeStyles[toast.type as keyof typeof typeStyles]}`}
        >
            <div className="shrink-0">{icon[toast.type as keyof typeof icon]}</div>
            <p className="text-[10px] font-black uppercase tracking-widest flex-1">{toast.message}</p>
            <button
                onClick={() => {
                    setIsVisible(false);
                    setTimeout(onRemove, 500);
                }}
                className="hover:scale-110 transition-transform p-1 opacity-50 hover:opacity-100"
            >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
}
