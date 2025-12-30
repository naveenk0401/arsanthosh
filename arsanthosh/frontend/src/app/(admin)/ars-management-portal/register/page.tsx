"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { api } from "@/utils/api";
import { useRouter } from "next/navigation";

export default function AdminRegisterPage() {
    const [formData, setFormData] = useState({ 
        name: "", 
        email: "", 
        password: "", 
        confirmPassword: "",
        phone: "",
        adminToken: "" 
    });

    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setIsLoading(true);
        setError("");

        const response = await api.post("/auth/register", {
            ...formData,
            role: "admin"
        });
        if (response.success) {
            router.push(`/verify-otp?email=${encodeURIComponent(formData.email)}`);
        } else {
            setError(response.error?.message || "Registration failed");
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#111111]">
            <Navbar />
            <div className="flex items-center justify-center px-6 py-12 md:py-24">
                <div className="bg-[#1a1a1a] w-full max-w-md p-8 md:p-12 shadow-2xl border border-gray-800">
                    <div className="text-center mb-10">
                        <div className="w-16 h-1 bg-[var(--accent)] mx-auto mb-6" />
                        <h1 className="text-white text-3xl font-bold mb-2">Admin Registration</h1>
                        <p className="text-gray-500 text-sm">Create a new administrator account</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 mb-6 text-xs font-bold uppercase tracking-widest text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Full Name</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-3 bg-[#222222] border border-gray-700 text-white outline-none focus:border-[var(--accent)] transition-colors"
                                placeholder="Admin Name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Admin Email</label>
                            <input
                                type="email"
                                required
                                className="w-full px-4 py-3 bg-[#222222] border border-gray-700 text-white outline-none focus:border-[var(--accent)] transition-colors"
                                placeholder="admin@arsanthosh.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Phone Number</label>
                            <input
                                type="tel"
                                required
                                className="w-full px-4 py-3 bg-[#222222] border border-gray-700 text-white outline-none focus:border-[var(--accent)] transition-colors"
                                placeholder="1234567890"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Password</label>
                                <input
                                    type="password"
                                    required
                                    className="w-full px-4 py-3 bg-[#222222] border border-gray-700 text-white outline-none focus:border-[var(--accent)] transition-colors"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Confirm</label>
                                <input
                                    type="password"
                                    required
                                    className="w-full px-4 py-3 bg-[#222222] border border-gray-700 text-white outline-none focus:border-[var(--accent)] transition-colors"
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Master Secret Key</label>
                            <input
                                type="password"
                                required
                                className="w-full px-4 py-3 bg-[#222222] border border-gray-700 text-white outline-none focus:border-[var(--accent)] transition-colors"
                                placeholder="Enter Secret Key"
                                value={formData.adminToken}
                                onChange={(e) => setFormData({ ...formData, adminToken: e.target.value })}
                            />
                        </div>

                        <button
                            disabled={isLoading}
                            className="w-full bg-[var(--accent)] text-white py-4 font-bold hover:bg-opacity-90 transition-all uppercase tracking-widest text-sm disabled:opacity-50"
                        >
                            {isLoading ? "Processing..." : "Register Admin"}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-gray-500">
                        Already have an account?{" "}
                        <Link href="/admin/login" className="text-[var(--accent)] font-bold hover:underline">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
            <Footer />
        </main>
    );
}
