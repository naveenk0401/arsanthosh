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
        <div className="bg-white w-full max-w-md p-8 md:p-12 shadow-xl border border-gray-100">
            <div className="text-center mb-10">
                <div className="w-12 h-12 bg-[var(--accent)] rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                </div>
                <h1 className="text-3xl font-bold mb-2">Check Your Email</h1>
                <p className="text-[var(--muted)] text-sm">We&apos;ve sent a 6-digit verification code to <span className="font-bold text-[var(--primary)]">{email}</span></p>
            </div>

            <form onSubmit={handleVerify} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500 text-center block w-full">Verification Code</label>
                    <input
                        type="text"
                        maxLength={6}
                        autoFocus
                        disabled={isLoading}
                        className="w-full text-center text-4xl font-bold tracking-[0.5em] py-4 bg-gray-50 border border-gray-200 outline-none focus:border-[var(--accent)] transition-colors disabled:opacity-50"
                        placeholder="000000"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    />
                    {error && <p className="text-red-500 text-xs text-center mt-2 font-medium">{error}</p>}
                </div>

                <button
                    disabled={isLoading}
                    className="w-full bg-[var(--primary)] text-white py-4 font-bold hover:bg-black transition-all uppercase tracking-widest text-sm disabled:bg-gray-400"
                >
                    {isLoading ? "Verifying..." : "Verify & Create Account"}
                </button>
            </form>

            <p className="mt-8 text-center text-sm text-[var(--muted)]">
                Didn&apos;t receive the code?{" "}
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
                <Suspense fallback={<div className="text-center p-12 bg-white shadow-xl border border-gray-100 w-full max-w-md">Loading...</div>}>
                    <VerifyOTPContent />
                </Suspense>
            </div>
            <Footer />
        </main>
    );
}
