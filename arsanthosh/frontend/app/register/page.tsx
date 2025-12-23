"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Register data:", formData);
        // On successful API signup, redirect to OTP verification
        router.push("/verify-otp");
    };

    return (
        <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-4 py-12">
            <div className="bg-white w-full max-w-md p-6 md:p-12 shadow-2xl border border-gray-50 rounded-sm">
                <div className="text-center mb-8 md:mb-10">
                    <h1 className="text-2xl md:text-3xl font-bold mb-2">Create Account</h1>
                    <p className="text-[var(--muted)] text-xs md:text-sm">Join Architect Santhosh for premium design solutions</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-500">Full Name</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 outline-none focus:border-[var(--accent)] transition-colors text-sm"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-500">Email Address</label>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 outline-none focus:border-[var(--accent)] transition-colors text-sm"
                            placeholder="name@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-500">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 outline-none focus:border-[var(--accent)] transition-colors text-sm"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <button className="w-full bg-[var(--accent)] text-white py-4 font-bold hover:bg-opacity-90 transition-all uppercase tracking-widest text-xs md:text-sm">
                        Register Now
                    </button>
                </form>

                <p className="mt-8 text-center text-xs md:text-sm text-[var(--muted)]">
                    Already have an account?{" "}
                    <Link href="/login" className="text-[var(--primary)] font-bold hover:underline">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
}
