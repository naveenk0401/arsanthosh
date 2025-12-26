"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/utils/api";

export default function RegisterPage() {
    const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "user" });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const response = await api.post("/auth/register", formData);

            setIsLoading(false);

            if (response.success) {
                router.push(`/verify-otp?email=${encodeURIComponent(formData.email)}`);
            } else {
                setError(response.error?.message || "Registration failed");
            }
        } catch (err: any) {
            setIsLoading(false);
            setError("Network error. Please try again.");
        }
    };

    return (
        <main className="min-h-screen bg-[var(--bg)]">
            <div className="flex items-center justify-center px-4 py-12 md:py-24">
                <div className="bg-white w-full max-w-md p-6 md:p-12 shadow-2xl border border-gray-50 rounded-sm">
                    <div className="text-center mb-8 md:mb-10">
                        <h1 className="text-2xl md:text-3xl font-bold mb-2">Create Account</h1>
                        <p className="text-[var(--muted)] text-xs md:text-sm">Join Architect Santhosh for premium design solutions</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs font-medium">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
                        <div className="flex gap-4 mb-4">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: "user" })}
                                className={`flex-1 py-3 text-[10px] md:text-xs font-bold uppercase tracking-widest border transition-all ${formData.role === "user"
                                    ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                                    : "bg-gray-50 text-gray-400 border-gray-100 hover:border-gray-300"
                                    }`}
                            >
                                Customer
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: "admin" })}
                                className={`flex-1 py-3 text-[10px] md:text-xs font-bold uppercase tracking-widest border transition-all ${formData.role === "admin"
                                    ? "bg-[var(--accent)] text-white border-[var(--accent)]"
                                    : "bg-gray-50 text-gray-400 border-gray-100 hover:border-gray-300"
                                    }`}
                            >
                                Architect / Admin
                            </button>
                        </div>

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

                        <button
                            disabled={isLoading}
                            className="w-full bg-[var(--accent)] text-white py-4 font-bold hover:bg-opacity-90 disabled:bg-gray-400 transition-all uppercase tracking-widest text-xs md:text-sm"
                        >
                            {isLoading ? "creating account..." : "Register Now"}
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
        </main>
    );
}
