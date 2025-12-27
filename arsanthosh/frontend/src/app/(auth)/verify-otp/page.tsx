"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { api } from "@/utils/api";

function VerifyOTPContent() {
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email") || "";

    useEffect(() => {
        if (!email) {
            router.push("/register");
        }
    }, [email, router]);

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.length !== 6) {
            setError("Please enter a valid 6-digit OTP");
            return;
        }

        setIsLoading(true);
        setError("");

        const response = await api.post("/auth/verify-otp", { email, otp });

        setIsLoading(false);

        if (response.success) {
            // Redirect based on role if possible, or just to login
            // The backend returns user data on verification
            const user = (response.data as any).user;
            if (user?.role === "admin" || user?.role === "super-admin") {
                router.push("/pending-approval");
            } else {
                router.push("/login?verified=true");
            }
        } else {
            setError(response.error?.message || "Invalid OTP or verification failed");
        }
    };

    return (
        <div className="bg-white w-full max-w-md p-6 md:p-12 shadow-2xl border border-gray-50 rounded-sm">
            <div className="text-center mb-8 md:mb-10">
                <div className="w-16 h-16 bg-[var(--accent)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">Verify Account</h1>
                <p className="text-[var(--muted)] text-xs md:text-sm">We&apos;ve sent a 6-digit code to <span className="text-[var(--primary)] font-bold">{email}</span></p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs font-medium">
                    {error}
                </div>
            )}

            <form onSubmit={handleVerify} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-500">Verification Code</label>
                    <input
                        type="text"
                        required
                        maxLength={6}
                        className="w-full px-4 py-4 bg-gray-50 border border-gray-100 outline-none focus:border-[var(--accent)] transition-colors text-center text-2xl tracking-[0.5em] font-bold"
                        placeholder="000000"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    />
                </div>

                <button
                    disabled={isLoading}
                    className="w-full bg-[var(--primary)] text-white py-4 font-bold hover:bg-black transition-all uppercase tracking-widest text-xs md:text-sm disabled:bg-gray-400"
                >
                    {isLoading ? "Verifying..." : "Verify & Register"}
                </button>
            </form>

            <p className="mt-8 text-center text-xs md:text-sm text-[var(--muted)]">
                Didn&apos;t receive code?{" "}
                <button className="text-[var(--accent)] font-bold hover:underline">
                    Resend OTP
                </button>
            </p>
        </div>
    );
}

export default function VerifyOTPPage() {
    return (
        <main className="min-h-screen bg-[var(--bg)]">
            <Navbar />
            <div className="flex items-center justify-center px-6 py-12 md:py-24">
                <Suspense fallback={<div className="text-center p-12 bg-white shadow-xl border border-gray-50 w-full max-w-md">Loading...</div>}>
                    <VerifyOTPContent />
                </Suspense>
            </div>
            <Footer />
        </main>
    );
}
