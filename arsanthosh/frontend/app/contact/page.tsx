"use client";

import { useState } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        service: "Home Interior Design",
        message: ""
    });

    const phoneNumber = "919876543210"; // Updated phone number

    const handleWhatsAppRedirect = (e: React.FormEvent) => {
        e.preventDefault();
        const text = `Hello! I'm ${formData.name}. %0A%0A*Service:* ${formData.service}%0A*Email:* ${formData.email}%0A*Message:* ${formData.message}`;
        window.open(`https://wa.me/${phoneNumber}?text=${text}`, "_blank");
    };

    return (
        <main className="min-h-screen bg-[var(--bg)]">
            <Header />

            <section className="py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        {/* Contact Information */}
                        <div className="space-y-12">
                            <div>
                                <h2 className="text-[10px] md:text-sm uppercase tracking-[0.3em] text-[var(--accent)] font-bold mb-4">Contact Us</h2>
                                <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                                    Let's Start Your <br />
                                    <span className="text-[var(--accent)]">Dream Project</span>
                                </h1>
                                <p className="mt-6 text-gray-500 max-w-md leading-relaxed">
                                    Whether you're looking for bespoke interior design or premium hardware solutions, our team is here to help you every step of the way.
                                </p>
                            </div>

                            <div className="space-y-8">
                                <div className="flex items-start gap-6">
                                    <div className="w-12 h-12 bg-white flex items-center justify-center shadow-sm border border-gray-100 flex-shrink-0">
                                        <svg className="w-5 h-5 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Email Us</h4>
                                        <p className="font-bold text-gray-900">hello@arsanthosh.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-6">
                                    <div className="w-12 h-12 bg-white flex items-center justify-center shadow-sm border border-gray-100 flex-shrink-0">
                                        <svg className="w-5 h-5 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Call Us</h4>
                                        <p className="font-bold text-gray-900">+91 98765 43210</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-6">
                                    <div className="w-12 h-12 bg-white flex items-center justify-center shadow-sm border border-gray-100 flex-shrink-0">
                                        <svg className="w-5 h-5 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Visit Us</h4>
                                        <p className="font-bold text-gray-900 leading-relaxed">Balaji Nagar, Muthanampalyam,<br />Tirupur, Tamil Nadu</p>
                                    </div>
                                </div>
                            </div>

                            {/* Social / WhatsApp Direct */}
                            <div className="pt-8 border-t border-gray-200">
                                <a
                                    href={`https://wa.me/${phoneNumber}`}
                                    target="_blank"
                                    className="inline-flex items-center gap-4 bg-[#25D366] text-white px-8 py-4 font-bold hover:bg-[#128C7E] transition-all uppercase tracking-widest text-xs shadow-lg rounded-sm group"
                                >
                                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.319 1.592 5.548 0 10.058-4.51 10.06-10.059 0-2.689-1.047-5.215-2.948-7.115-1.9-1.9-4.425-2.947-7.114-2.948-5.551 0-10.06 4.509-10.062 10.059 0 2.132.563 3.991 1.57 5.807l-1.015 3.703 3.845-.371-3.354-1.062zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.496.099-.198.05-.371-.025-.52-.075-.148-.669-1.611-.916-2.205-.24-.579-.48-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                                    </svg>
                                    <span className="group-hover:translate-x-1 transition-transform">Chat with Expert</span>
                                </a>
                            </div>
                        </div>

                        {/* Form */}
                        <div className="bg-white p-8 md:p-12 shadow-2xl border border-gray-100 rounded-sm">
                            <form onSubmit={handleWhatsAppRedirect} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-500">Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 outline-none focus:border-[var(--accent)] transition-colors text-sm"
                                        placeholder="Your full name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-500">Email</label>
                                        <input
                                            type="email"
                                            required
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 outline-none focus:border-[var(--accent)] transition-colors text-sm"
                                            placeholder="hello@example.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-500">Service</label>
                                        <select
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 outline-none focus:border-[var(--accent)] transition-colors text-sm appearance-none"
                                            value={formData.service}
                                            onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                                        >
                                            <option>Home Interior Design</option>
                                            <option>Office Interior Design</option>
                                            <option>Modular Kitchen</option>
                                            <option>Hardware Store Inquiry</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-500">Message</label>
                                    <textarea
                                        rows={5}
                                        required
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 outline-none focus:border-[var(--accent)] transition-colors text-sm"
                                        placeholder="How can we help you?"
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    />
                                </div>

                                <button className="w-full bg-[var(--primary)] text-white py-5 font-bold hover:bg-black transition-all uppercase tracking-widest text-xs shadow-lg flex items-center justify-center gap-3 group">
                                    <span>Send via WhatsApp</span>
                                    <svg className="w-5 h-5 fill-white group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.319 1.592 5.548 0 10.058-4.51 10.06-10.059 0-2.689-1.047-5.215-2.948-7.115-1.9-1.9-4.425-2.947-7.114-2.948-5.551 0-10.06 4.509-10.062 10.059 0 2.132.563 3.991 1.57 5.807l-1.015 3.703 3.845-.371-3.354-1.062zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.496.099-.198.05-.371-.025-.52-.075-.148-.669-1.611-.916-2.205-.24-.579-.48-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                                    </svg>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Floating WhatsApp Button */}
            <a
                href={`https://wa.me/${phoneNumber}`}
                target="_blank"
                className="fixed bottom-8 right-8 z-[60] bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all group"
                aria-label="Contact on WhatsApp"
            >
                <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.319 1.592 5.548 0 10.058-4.51 10.06-10.059 0-2.689-1.047-5.215-2.948-7.115-1.9-1.9-4.425-2.947-7.114-2.948-5.551 0-10.06 4.509-10.062 10.059 0 2.132.563 3.991 1.57 5.807l-1.015 3.703 3.845-.371-3.354-1.062zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.496.099-.198.05-.371-.025-.52-.075-.148-.669-1.611-.916-2.205-.24-.579-.48-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
                {/* Tooltip */}
                <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-black text-white px-3 py-1 text-xs rounded-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none uppercase tracking-widest font-bold">
                    Chat with us
                </span>
            </a>

            <Footer />
        </main>
    );
}
