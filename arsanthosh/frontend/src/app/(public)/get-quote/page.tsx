"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { api } from "@/utils/api";

export default function GetQuotePage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        service: "Home Interior Design",
        scale: "Small (< 1000 sq.ft)",
        budget: "Basic (Affordable)",
        message: ""
    });

    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");
        setErrorMessage("");

        // Combine detailed quote info into the message field for the backend/email
        const detailedMessage = `
**Quote Request Details**
Service: ${formData.service}
Scale: ${formData.scale}
Budget: ${formData.budget}

**User Requirements:**
${formData.message}
        `.trim();

        // Best-effort mapping for common services, otherwise "Other"
        let serviceType = "Other";
        if (formData.service.includes("Interior")) serviceType = "Interior Design";
        if (formData.service.includes("Architecture")) serviceType = "Architectural Design";

        const response = await api.post("/inquiries", {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            serviceType,
            message: detailedMessage
        });

        if (response.success) {
            setStatus("success");
            setFormData({
                name: "", email: "", phone: "", service: "Home Interior Design",
                scale: "Small (< 1000 sq.ft)", budget: "Basic (Affordable)", message: ""
            });
        } else {
            setStatus("error");
            setErrorMessage(response.error?.message || "Failed to submit request.");
        }
    };

    return (
        <main className="min-h-screen bg-[var(--bg)]">
            <Navbar />

            <section className="py-16 md:py-32 bg-white">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-[10px] md:text-sm uppercase tracking-[0.3em] text-[var(--accent)] font-bold mb-6">Start a Project</h2>
                    <h1 className="text-3xl md:text-7xl font-bold leading-tight max-w-5xl mx-auto">
                        Get a Custom <br />
                        <span className="text-[var(--accent)]">Project Quote</span>
                    </h1>
                    <p className="mt-8 text-gray-500 max-w-2xl mx-auto leading-relaxed">
                        Tell us about your vision, and we&apos;ll provide a personalized estimate and roadmap for your dream space.
                    </p>
                </div>
            </section>

            <section className="py-12 md:py-24">
                <div className="max-w-4xl mx-auto px-4 md:px-6">
                    <div className="bg-white p-6 md:p-16 shadow-2xl border border-gray-100 rounded-sm">
                        {status === "success" ? (
                            <div className="text-center py-16">
                                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
                                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                </div>
                                <h3 className="text-2xl font-bold font-display mb-4">Request Received!</h3>
                                <p className="text-gray-500 max-w-md mx-auto mb-8">
                                    Thank you for sharing your details. Our team has been notified via email and will review your requirements. We will get back to you shortly.
                                </p>
                                <button
                                    onClick={() => setStatus("idle")}
                                    className="text-xs font-bold uppercase tracking-widest text-[var(--primary)] hover:underline"
                                >
                                    Submit Another Request
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Personal Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-500">Full Name</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 outline-none focus:border-[var(--accent)] transition-colors text-sm"
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
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 outline-none focus:border-[var(--accent)] transition-colors text-sm"
                                            placeholder="hello@example.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-500">Phone Number</label>
                                        <input
                                            type="tel"
                                            required
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 outline-none focus:border-[var(--accent)] transition-colors text-sm"
                                            placeholder="+91 XXXXX XXXXX"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-500">Service Required</label>
                                        <select
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 outline-none focus:border-[var(--accent)] transition-colors text-sm appearance-none"
                                            value={formData.service}
                                            onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                                        >
                                            <option>Home Interior Design</option>
                                            <option>Office Interior Design</option>
                                            <option>Residential Architecture</option>
                                            <option>Commercial Architecture</option>
                                            <option>Renovation & Retrofitting</option>
                                            <option>Modular Kitchen / Wardrobes</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-500">Project Scale</label>
                                        <select
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 outline-none focus:border-[var(--accent)] transition-colors text-sm appearance-none"
                                            value={formData.scale}
                                            onChange={(e) => setFormData({ ...formData, scale: e.target.value })}
                                        >
                                            <option>Small (Below 1000 sq.ft)</option>
                                            <option>Medium (1000 - 2500 sq.ft)</option>
                                            <option>Large (2500 - 5000 sq.ft)</option>
                                            <option>Extra Large (Above 5000 sq.ft)</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-500">Estimated Budget</label>
                                        <select
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 outline-none focus:border-[var(--accent)] transition-colors text-sm appearance-none"
                                            value={formData.budget}
                                            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                                        >
                                            <option>Basic (Affordable & Functional)</option>
                                            <option>Standard (Premium Materials)</option>
                                            <option>Luxury (Bespoke / High-End)</option>
                                            <option>Ultra-Luxury (No Compromise)</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-500">Project Requirements / Description</label>
                                    <textarea
                                        rows={5}
                                        required
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 outline-none focus:border-[var(--accent)] transition-colors text-sm"
                                        placeholder="Tell us about the space, your style preferences, or any specific must-haves..."
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    />
                                </div>

                                {status === "error" && (
                                    <div className="p-4 bg-red-50 text-red-600 text-sm border border-red-100 rounded-sm">
                                        {errorMessage}
                                    </div>
                                )}

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={status === "loading"}
                                        className="w-full bg-[var(--primary)] text-white py-6 font-bold hover:bg-black transition-all uppercase tracking-[0.2em] text-xs shadow-xl flex items-center justify-center gap-4 group disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {status === "loading" ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                <span>Submitting Request...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Submit Quote Request</span>
                                                <svg className="w-5 h-5 fill-white group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24">
                                                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                                                </svg>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
