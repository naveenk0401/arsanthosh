"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function VerifyOTPPage() {
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleVerify = (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.length === 6) {
            console.log("Verifying OTP:", otp);
            // Logic for API call will go here
            router.push("/login");
        } else {
            setError("Please enter a valid 6-digit OTP");
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-6">
            <div className="bg-white w-full max-w-md p-8 md:p-12 shadow-xl border border-gray-100">
                <div className="text-center mb-10">
                    <div className="w-12 h-12 bg-[var(--accent)] rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold mb-2">Check Your Email</h1>
                    <p className="text-[var(--muted)] text-sm">We&apos;ve sent a 6-digit verification code to your email.</p>
                </div>

                <form onSubmit={handleVerify} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 text-center block w-full">Verification Code</label>
                        <input
                            type="text"
                            maxLength={6}
                            autoFocus
                            className="w-full text-center text-4xl font-bold tracking-[0.5em] py-4 bg-gray-50 border border-gray-200 outline-none focus:border-[var(--accent)] transition-colors"
                            placeholder="000000"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                        />
                        {error && <p className="text-red-500 text-xs text-center mt-2">{error}</p>}
                    </div>

                    <button className="w-full bg-[var(--primary)] text-white py-4 font-bold hover:bg-black transition-all uppercase tracking-widest text-sm">
                        Verify & Create Account
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-[var(--muted)]">
                    Didn&apos;t receive the code?{" "}
                    <button className="text-[var(--accent)] font-bold hover:underline">
                        Resend OTP
                    </button>
                </p>
            </div>
        </div>
    );
}
