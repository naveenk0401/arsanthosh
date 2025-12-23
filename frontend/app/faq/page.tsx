"use client";

import { useState } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

const faqs = [
    {
        q: "What is your typical project timeline?",
        a: "A standard residential interior project typically takes 45-60 working days from design approval. Structural architectural projects vary based on scale and site conditions."
    },
    {
        q: "Do you handle the execution of the designs?",
        a: "Yes, we offer complete Turnkey solutions where we handle everything from design and material sourcing to construction and final finishing."
    },
    {
        q: "How do you charge for your services?",
        a: "Our fee structure is transparent and varies based on the service level. We offer fixed-fee consultation, percentage-based project management, and area-based (per sq.ft) design fees."
    },
    {
        q: "Do you provide online / virtual consultation?",
        a: "Absolutely. We offer online design consultations for clients globally. This includes 2D layouts and 3D visualization services."
    },
    {
        q: "Can I buy hardware and lights from you even if I'm not using your design services?",
        a: "Yes! Our premium hardware store is open for independent purchases. You can visit our studio or enquire online for specific technical fittings."
    },
    {
        q: "What geographical areas do you serve?",
        a: "While our studio is based in Tirupur, we take on architectural projects and provide design consultancy services across India."
    }
];

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <main className="min-h-screen bg-[var(--bg)]">
            <Header />

            <section className="py-20 md:py-32 bg-white">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-[10px] md:text-sm uppercase tracking-[0.3em] text-[var(--accent)] font-bold mb-6">Clarifications</h2>
                    <h1 className="text-4xl md:text-7xl font-bold leading-tight">Frequently Asked Questions</h1>
                    <p className="mt-8 text-gray-500 max-w-2xl mx-auto leading-relaxed">
                        Find answers to common questions about our design process, pricing, and services.
                    </p>
                </div>
            </section>

            <section className="py-16 md:py-24">
                <div className="max-w-3xl mx-auto px-6">
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div key={index} className="bg-white border border-gray-100 rounded-sm overflow-hidden">
                                <button
                                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                    className="w-full px-6 md:px-8 py-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                                >
                                    <span className="font-bold text-gray-900 text-sm md:text-base pr-8">{faq.q}</span>
                                    <span className="text-[var(--accent)] flex-shrink-0">
                                        {openIndex === index ? (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" /></svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v12m6-6H6" /></svg>
                                        )}
                                    </span>
                                </button>
                                {openIndex === index && (
                                    <div className="px-6 md:px-8 pb-8 text-gray-500 text-xs md:text-sm leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16 md:py-24 bg-white border-t">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h3 className="text-2xl md:text-3xl font-bold mb-6">Still have questions?</h3>
                    <p className="text-gray-500 mb-10 text-sm md:text-base">We&apos;re here to help you understand every step of your project&apos;s lifecycle.</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <button className="bg-[var(--primary)] text-white px-10 py-4 font-bold hover:bg-black transition-all uppercase tracking-widest text-xs">Chat on WhatsApp</button>
                        <button className="border border-gray-900 px-10 py-4 font-bold hover:bg-gray-900 hover:text-white transition-all uppercase tracking-widest text-xs">Email Us Directly</button>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
