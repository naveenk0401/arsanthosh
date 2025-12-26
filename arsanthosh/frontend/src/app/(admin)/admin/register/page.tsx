"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function AdminRegisterPage() {
    const [formData, setFormData] = useState({ name: "", email: "", password: "", adminToken: "" });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Admin Register data:", formData);
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

                        <button className="w-full bg-[var(--accent)] text-white py-4 font-bold hover:bg-opacity-90 transition-all uppercase tracking-widest text-sm">
                            Register Admin
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
