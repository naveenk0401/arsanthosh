"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { api } from "@/utils/api";
import { useAuth } from "@/context/AuthContext";

function LoginContent() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login } = useAuth();

    const isVerified = searchParams.get("verified") === "true";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const response = await api.post("/auth/login", formData);

        setIsLoading(false);

        if (response.success) {
            const { user, token } = (response.data as any);
            login(user, token);

            // Redirect based on role
            if (user.role === "admin" || user.role === "super-admin") {
                router.push("/admin");
            } else {
                router.push("/store");
            }
        } else {
            setError(response.error?.message || "Invalid email or password");
        }
    };

    return (
        <div className="bg-white w-full max-w-md p-6 md:p-12 shadow-2xl border border-gray-50 rounded-sm">
            <div className="text-center mb-8 md:mb-10">
                <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome Back</h1>
                <p className="text-[var(--muted)] text-xs md:text-sm">Sign in to your account to continue</p>
            </div>

            {isVerified && !error && (
                <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 text-xs font-medium">
                    Email verified successfully! Please log in.
                </div>
            )}

            {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs font-medium">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
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

                <div className="flex items-center justify-between text-[10px] md:text-xs">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="accent-[var(--accent)]" />
                        <span className="text-gray-500">Remember me</span>
                    </label>
                    <a href="#" className="text-[var(--accent)] font-bold hover:underline">Forgot?</a>
                </div>

                <button
                    disabled={isLoading}
                    className="w-full bg-[var(--primary)] text-white py-4 font-bold hover:bg-black transition-all uppercase tracking-widest text-xs md:text-sm disabled:bg-gray-400"
                >
                    {isLoading ? "Signing in..." : "Sign In"}
                </button>
            </form>

            <p className="mt-8 text-center text-xs md:text-sm text-[var(--muted)]">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-[var(--accent)] font-bold hover:underline">
                    Create Account
                </Link>
            </p>
        </div>
    );
}

export default function LoginPage() {
    return (
        <main className="min-h-screen bg-[var(--bg)]">
            <Navbar />
            <div className="flex items-center justify-center px-4 py-12 md:py-24">
                <Suspense fallback={<div className="p-12 bg-white shadow-2xl border border-gray-50 rounded-sm w-full max-w-md text-center">Loading...</div>}>
                    <LoginContent />
                </Suspense>
            </div>
            <Footer />
        </main>
    );
}
