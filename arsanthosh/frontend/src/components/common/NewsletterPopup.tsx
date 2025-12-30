"use client";

import { useState, useEffect } from "react";
import { api } from "@/utils/api";

export default function NewsletterPopup() {
    const [isVisible, setIsVisible] = useState(false);
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    useEffect(() => {
        // Check if user has already seen or subscribed
        const hasSeenNewsletter = localStorage.getItem("ars_newsletter_seen");
        
        if (!hasSeenNewsletter) {
            // Show after 8 seconds
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 8000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        // Mark as seen so it doesn't pop up again this session/day
        // For testing, maybe session is better, but for prod use date
        localStorage.setItem("ars_newsletter_seen", "true");
    };

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");

        try {
            const response = await api.post("/subscribers", { email });

            if (response.success) {
                setStatus("success");
                setMessage((response.data as any)?.message || "Successfully subscribed!");
                localStorage.setItem("ars_newsletter_subs", "true");
                // Close after 2 seconds
                setTimeout(() => {
                    handleClose();
                }, 2500);
            } else {
                setStatus("error");
                setMessage(response.error?.message || "Failed to subscribe.");
            }
        } catch (error) {
            setStatus("error");
            setMessage("Something went wrong.");
        }
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white p-8 md:p-10 max-w-lg w-full text-center shadow-2xl rounded-sm border-t-4 border-[var(--accent)] animate-slide-up relative">
                <button 
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                {status === "success" ? (
                    <div className="py-8 animate-fade-in">
                         <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Welcome Aboard!</h3>
                        <p className="text-gray-500">{message}</p>
                    </div>
                ) : (
                    <>
                        <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--accent)] mb-3">Don&apos;t Miss Out</h3>
                        <h2 className="text-3xl font-bold mb-4 font-display">Join Our Exclusive List</h2>
                        <p className="text-gray-500 mb-8 text-sm leading-relaxed px-4">
                            Get early access to our latest architectural designs, premium hardware collections, and limited-time offers.
                        </p>

                        <form onSubmit={handleSubscribe} className="flex flex-col gap-4">
                            <input
                                type="email"
                                required
                                placeholder="Enter your email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 outline-none focus:border-[var(--accent)] transition-colors text-sm text-center"
                            />
                            
                            {status === "error" && (
                                <p className="text-xs text-red-500 font-bold">{message}</p>
                            )}

                            <button
                                type="submit"
                                disabled={status === "loading"}
                                className="w-full bg-[var(--primary)] text-white py-4 font-bold uppercase tracking-widest text-xs hover:bg-black transition-all disabled:opacity-70"
                            >
                                {status === "loading" ? "Subscribing..." : "Subscribe Now"}
                            </button>
                        </form>
                        
                        <p className="text-[10px] text-gray-400 mt-6 uppercase tracking-wider cursor-pointer hover:text-gray-600" onClick={handleClose}>
                            No thanks, I&apos;ll browse first
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}
