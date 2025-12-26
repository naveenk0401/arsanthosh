"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { api } from "@/utils/api";

export default function AdminLoginForm() {
    const [formData, setFormData] = useState({ email: "", password: "", secretKey: "" });
    const { login } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    // Security States
    const [showSecretInput, setShowSecretInput] = useState(false);
    const [newSecretGenerated, setNewSecretGenerated] = useState<string | null>(null);
    const [isForgotSecret, setIsForgotSecret] = useState(false);
    const [resetOtp, setResetOtp] = useState("");
    const [resetStep, setResetStep] = useState(1); // 1: email, 2: otp -> new key

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const response = await api.post("/auth/login", {
            email: formData.email,
            password: formData.password,
            secretKey: formData.secretKey
        });

        if (response.success) {
            const data = response.data as any;

            // Handle Super Admin Logic
            if (data.requiresSecret) {
                setShowSecretInput(true);
                setIsLoading(false);
                return;
            }

            if (data.tempSecretKey) {
                setNewSecretGenerated(data.tempSecretKey);
                login(data.user, data.token);
                // We show the key, but user is logged in. 
                // In a real app, maybe block till they confirm.
                return;
            }

            login(data.user, data.token);
            router.push("/admin");
        } else {
            setError(response.error?.message || "Invalid credentials");
            setIsLoading(false);
        }
    };

    const handleForgotSecret = async () => {
        setIsLoading(true);
        const response = await api.post("/auth/forgot-secret", { email: formData.email });
        if (response.success) {
            setResetStep(2);
            setError("");
        } else {
            setError(response.error?.message || "Failed to initiate reset");
        }
        setIsLoading(false);
    };

    const handleVerifyReset = async () => {
        setIsLoading(true);
        const response = await api.post("/auth/reset-secret", { email: formData.email, otp: resetOtp }) as any;
        if (response.success) {
            setNewSecretGenerated(response.data.newSecretKey);
            setIsForgotSecret(false);
            setResetStep(1);
        } else {
            setError(response.error?.message || "Verification failed");
        }
        setIsLoading(false);
    };

    if (newSecretGenerated) {
        return (
            <div className="bg-white border border-[var(--primary)] p-8 shadow-xl animate-in zoom-in-95 duration-500">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--primary)] mb-6 pb-2 border-b border-gray-100">Security Secret Generated</h3>
                <p className="text-xs text-gray-600 font-bold uppercase tracking-widest leading-relaxed mb-6">
                    This is your unique security key. You MUST save this now. You will not see it again.
                </p>
                <div className="bg-gray-50 border border-gray-100 p-6 text-center mb-8">
                    <span className="text-2xl font-black font-display tracking-[0.2em] text-gray-900">{newSecretGenerated}</span>
                </div>
                <button
                    onClick={() => router.push("/admin")}
                    className="w-full bg-gray-900 text-white py-4 font-black uppercase tracking-[0.3em] text-xs hover:bg-[var(--primary)] transition-all"
                >
                    Confirm & Enter Dashboard
                </button>
            </div>
        );
    }

    if (isForgotSecret) {
        return (
            <div className="space-y-6 animate-in slide-in-from-bottom-2">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">Security Override</h3>
                    <button onClick={() => setIsForgotSecret(false)} className="text-[9px] font-bold text-[var(--primary)] uppercase tracking-widest">Back</button>
                </div>
                {resetStep === 1 ? (
                    <div className="space-y-4">
                        <p className="text-[10px] text-gray-700 font-bold uppercase tracking-widest">Enter Super Admin email to receive 2FA override code.</p>
                        <input
                            type="email"
                            className="w-full px-5 py-4 bg-gray-50 border border-gray-100 outline-none text-sm focus:border-[var(--primary)] text-gray-900"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                        <button onClick={handleForgotSecret} className="w-full bg-gray-900 text-white py-4 font-black uppercase tracking-[0.3em] text-xs">Request OTP</button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <p className="text-[10px] text-gray-700 font-bold uppercase tracking-widest">Enter the 6-digit code sent to your email.</p>
                        <input
                            type="text"
                            maxLength={6}
                            className="w-full px-5 py-4 bg-gray-50 border border-gray-100 outline-none text-center text-xl font-bold tracking-[0.5em] focus:border-[var(--primary)] text-gray-900"
                            value={resetOtp}
                            onChange={e => setResetOtp(e.target.value)}
                        />
                        <button onClick={handleVerifyReset} className="w-full bg-gray-900 text-white py-4 font-black uppercase tracking-[0.3em] text-xs">Verify & Regenerate Key</button>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-center animate-in shake-1">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {!showSecretInput ? (
                    <>
                        <div className="space-y-4">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-600 px-1">System Identifier</label>
                            <input
                                type="email"
                                required
                                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 outline-none text-sm focus:border-[var(--primary)] transition-all text-gray-900 shadow-inner"
                                placeholder="E.G. ADMIN@ARSANTHOSH.COM"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between px-1">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Authorization Key</label>
                            </div>
                            <input
                                type="password"
                                required
                                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 outline-none text-sm focus:border-[var(--primary)] transition-all text-gray-900 shadow-inner"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    </>
                ) : (
                    <div className="space-y-4 animate-in slide-in-from-right-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--primary)] px-2">Secondary Security Secret</label>
                        <input
                            type="text"
                            required
                            autoFocus
                            className="w-full px-5 py-4 bg-gray-50 border border-[var(--primary)]/30 outline-none text-xl font-black text-center tracking-[0.4em] text-gray-900 shadow-lg"
                            placeholder="XXXXXXXX"
                            value={formData.secretKey}
                            onChange={(e) => setFormData({ ...formData, secretKey: e.target.value.toUpperCase() })}
                        />
                        <div className="flex justify-between items-center px-1">
                            <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">Required for Super Admin Access</p>
                            <button
                                type="button"
                                onClick={() => setIsForgotSecret(true)}
                                className="text-[9px] font-bold text-[var(--primary)] uppercase tracking-widest hover:underline"
                            >
                                Forgot Secret?
                            </button>
                        </div>
                    </div>
                )}

                <button
                    disabled={isLoading}
                    className="group relative w-full bg-gray-900 text-white py-5 font-black uppercase tracking-[0.3em] text-xs hover:bg-[var(--primary)] transition-all shadow-xl disabled:opacity-50 overflow-hidden"
                >
                    <span className="relative z-10">{isLoading ? "Verifying..." : showSecretInput ? "Authorize Access" : "Initiate System Link"}</span>
                    <div className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </button>
            </form>

            {!showSecretInput && (
                <p className="text-center text-[9px] text-gray-600 font-bold uppercase tracking-[0.2em] mt-8">
                    Architect Santhosh &copy; 2025 | Secure Operations Hub
                </p>
            )}
        </div>
    );
}
