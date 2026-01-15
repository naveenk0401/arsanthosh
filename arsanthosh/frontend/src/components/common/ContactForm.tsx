"use client";

import { useState } from "react";
import { api } from "@/utils/api";
import { useToast } from "@/context/ToastContext";

export default function ContactForm() {
    const { showToast } = useToast();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        mobile: "",
        service: "Home Interior Design",
        message: ""
    });

    const [loading, setLoading] = useState(false);
    const [showPopup, setShowPopup] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Map frontend service choice to backend enum
        let serviceType = "Other";
        const s = formData.service.toLowerCase();
        if (s.includes("interior")) serviceType = "Interior Design";
        else if (s.includes("architect")) serviceType = "Architectural Design";
        else if (s.includes("construct")) serviceType = "Construction";
        else if (s.includes("consult")) serviceType = "Consultation";

        const finalMessage = `Service Interest: ${formData.service}\n\n${formData.message}`;

        try {
            const response = await api.post("/inquiries", {
                name: formData.name,
                email: formData.email,
                phone: formData.mobile,
                serviceType,
                message: finalMessage
            });

            if (response.success) {
                setShowPopup(true); // Show custom popup
                setFormData({
                    name: "",
                    email: "",
                    mobile: "",
                    service: "Home Interior Design",
                    message: ""
                });
                // Auto-close after 5 seconds
                setTimeout(() => setShowPopup(false), 5000);
            } else {
                showToast(response.error?.message || "Failed to send inquiry. Please try again.", "error");
            }
        } catch (error) {
            console.error("Inquiry Error:", error);
            showToast("Something went wrong. Please try again later.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="py-16 md:py-24 bg-white relative">
            {/* Custom Popup Modal */}
            {showPopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white p-8 md:p-12 max-w-md w-full text-center shadow-2xl rounded-sm border-t-4 border-[var(--accent)] animate-slide-up relative">
                        <button 
                            onClick={() => setShowPopup(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                        
                        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                        </div>
                        
                        <h3 className="text-2xl font-bold mb-4">Thank You!</h3>
                        <p className="text-gray-500 mb-8 leading-relaxed">
                            Thank you for reaching out. <br/> Our team will contact you shortly.
                        </p>
                        
                        <button
                            onClick={() => setShowPopup(false)}
                            className="w-full bg-[var(--primary)] text-white py-3 font-bold uppercase tracking-widest text-xs hover:bg-[var(--accent)] transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            <div className="max-w-4xl mx-auto px-6">
                <div className="text-center mb-10 md:mb-12">
                    <h2 className="text-2xl md:text-4xl font-bold mb-4">Let&apos;s Discuss Your Project</h2>
                    <p className="text-xs md:text-base text-[var(--muted)] px-4 md:px-0">Fill out the form below and we&apos;ll get back to you within 24 hours.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6 bg-gray-50 p-6 md:p-12 border border-gray-100 rounded-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-500">Full Name</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="John Doe"
                                className="w-full px-4 py-3 bg-white border border-gray-100 outline-none focus:border-[var(--accent)] transition-colors text-sm"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-500">Email Address</label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="john@example.com"
                                className="w-full px-4 py-3 bg-white border border-gray-100 outline-none focus:border-[var(--accent)] transition-colors text-sm"
                            />
                        </div>
                    </div>

                     {/* Mobile Number Logic */}
                    <div className="space-y-2">
                         <label className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-500">Mobile Number</label>
                         <input
                             type="tel"
                             required
                             value={formData.mobile}
                             onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                             placeholder="+91 98765 43210"
                             className="w-full px-4 py-3 bg-white border border-gray-100 outline-none focus:border-[var(--accent)] transition-colors text-sm"
                         />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-500">Service Required</label>
                        <select
                            value={formData.service}
                            onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                            className="w-full px-4 py-3 bg-white border border-gray-100 outline-none focus:border-[var(--accent)] transition-colors appearance-none text-sm"
                        >
                            <option>Home Interior Design</option>
                            <option>Office Interior Design</option>
                            <option>Modular Kitchen</option>
                            <option>Hardware Store Inquiry</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-500">Your Message</label>
                        <textarea
                            rows={4}
                            required
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            placeholder="Tell us about your project or inquiry..."
                            className="w-full px-4 py-3 bg-white border border-gray-100 outline-none focus:border-[var(--accent)] transition-colors text-sm"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[var(--primary)] text-white py-4 font-bold hover:bg-black transition-all uppercase tracking-widest text-xs md:text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? "Sending..." : "Send Inquiry"}
                    </button>
                </form>
            </div>
        </section>
    );
}
