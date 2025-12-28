"use client";

import { useState } from "react";
import { api } from "@/utils/api";

interface AdminOnboardingProps {
    user: any;
    onComplete: (secretKey: string) => void;
}

export default function AdminOnboarding({ user, onComplete }: AdminOnboardingProps) {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [step, setStep] = useState(1); // 1: Reset Password, 2: Show Secret Key
    const [generatedKey, setGeneratedKey] = useState("");

    const handleOnboarding = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const response = await api.post("/admin/onboarding", { newPassword });
            if (response.success) {
                setGeneratedKey((response.data as any).secretKey);
                setStep(2);
            } else {
                setError(response.error?.message || "Onboarding failed. Please try again.");
            }
        } catch (err) {
            setError("A connection error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    if (step === 2) {
        return (
            <div className="bg-white border-2 border-[var(--primary)] p-10 shadow-2xl animate-in zoom-in-95 duration-500 max-w-md mx-auto relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 -rotate-45 translate-x-16 -translate-y-16" />

                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--primary)] mb-8 pb-4 border-b border-gray-100 italic">Security Protocol Complete</h3>

                <p className="text-sm font-bold text-gray-900 mb-4 leading-relaxed">
                    Account verified and secured.
                </p>
                <p className="text-xs text-gray-600 font-bold uppercase tracking-widest leading-relaxed mb-8">
                    Your unique 12-digit Administrative Secret Key is below. <span className="text-red-500 underline">Save this immediately.</span> You will require this for every future login.
                </p>

                <div className="bg-gray-50 border border-gray-100 p-8 rounded-sm text-center mb-10 flex flex-col items-center">
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-4">Your Private Secret Key</p>
                    <span className="text-3xl font-black font-display tracking-[0.2em] text-gray-900 select-all">{generatedKey}</span>
                </div>

                <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1" />
                        <p className="text-[10px] font-bold text-blue-700 uppercase tracking-tight leading-normal">
                            Encryption Layer Active. This key is your primary bypass for the secondary authentication gate.
                        </p>
                    </div>

                    <button
                        onClick={() => onComplete(generatedKey)}
                        className="w-full bg-gray-900 text-white py-5 font-black uppercase tracking-[0.3em] text-xs hover:bg-[var(--primary)] transition-all shadow-xl italic"
                    >
                        Confirm Backup & Enter Portal
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white border border-gray-100 p-10 shadow-xl animate-in slide-in-from-bottom-4 duration-500 max-w-md mx-auto">
            <div className="mb-10 text-center">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-4 italic">Security Verification</h3>
                <h2 className="text-xl font-bold font-display text-gray-900 italic tracking-tight">Personnel Onboarding</h2>
                <div className="w-10 h-0.5 bg-[var(--primary)] mx-auto mt-4" />
            </div>

            <p className="text-xs text-gray-600 font-bold uppercase tracking-widest leading-relaxed mb-8 text-center italic">
                Welcome, {user.name}. As a new administrator, you must update your temporary credentials to activate your secure access layer.
            </p>

            {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 p-4 mb-8 text-[10px] font-bold uppercase tracking-widest text-center animate-in shake-1">
                    {error}
                </div>
            )}

            <form onSubmit={handleOnboarding} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 px-1">Permanent Password</label>
                    <input
                        type="password"
                        required
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 outline-none text-sm focus:border-[var(--primary)] transition-all text-gray-900 font-bold"
                        placeholder="MIN. 6 CHARACTERS"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 px-1">Confirm Permanent Password</label>
                    <input
                        type="password"
                        required
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 outline-none text-sm focus:border-[var(--primary)] transition-all text-gray-900 font-bold"
                        placeholder="RE-ENTER PASSWORD"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>

                <button
                    disabled={isLoading}
                    className="w-full bg-gray-900 text-white py-5 font-black uppercase tracking-[0.3em] text-xs hover:bg-[var(--primary)] transition-all shadow-lg disabled:opacity-50 italic mt-4"
                >
                    {isLoading ? "Activating Security..." : "Secure Account & Generate Key"}
                </button>
            </form>

            <p className="text-center text-[8px] font-black text-gray-400 uppercase tracking-widest mt-10">
                Authorized Personnel Only | System ID: {user.id.slice(-8).toUpperCase()}
            </p>
        </div>
    );
}
