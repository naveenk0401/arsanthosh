"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

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

    const phoneNumber = "919876543210";

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const text = `*New Quote Request*%0A%0A*Name:* ${formData.name}%0A*Email:* ${formData.email}%0A*Phone:* ${formData.phone}%0A*Service:* ${formData.service}%0A*Scale:* ${formData.scale}%0A*Budget:* ${formData.budget}%0A%0A*Requirements:* ${formData.message}`;
        window.open(`https://wa.me/${phoneNumber}?text=${text}`, "_blank");
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

                            <div className="pt-4">
                                <button className="w-full bg-[var(--primary)] text-white py-6 font-bold hover:bg-black transition-all uppercase tracking-[0.2em] text-xs shadow-xl flex items-center justify-center gap-4 group">
                                    <span>Generate Quote Request</span>
                                    <svg className="w-5 h-5 fill-white group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24">
                                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.319 1.592 5.548 0 10.058-4.51 10.06-10.059 0-2.689-1.047-5.215-2.948-7.115-1.9-1.9-4.425-2.947-7.114-2.948-5.551 0-10.06 4.509-10.062 10.059 0 2.132.563 3.991 1.57 5.807l-1.015 3.703 3.845-.371-3.354-1.062zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.496.099-.198.05-.371-.025-.52-.075-.148-.669-1.611-.916-2.205-.24-.579-.48-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                                    </svg>
                                </button>
                                <p className="text-center mt-6 text-[10px] text-gray-400 uppercase tracking-widest leading-relaxed">
                                    Submitting this form redirects you to WhatsApp <br /> for instant priority discussion.
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
