"use client";

import { useState } from "react";
import { api } from "@/utils/api";
import CustomDatePicker from "../common/CustomDatePicker";

export default function BookingForm({ isOpen, onCloseAction }: { isOpen: boolean, onCloseAction: () => void }) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        service: "Residential Architecture",
        date: "",
        phone: ""
    });
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");
        setErrorMessage("");

        // Map frontend service to backend enum if needed (Backend: Architectural Design, Interior Design, etc.)
        // We will do a best effort mapping or pass as "Other" with details in message
        let serviceType = "Other";
        const s = formData.service.toLowerCase();
        if (s.includes("architect")) serviceType = "Architectural Design";
        else if (s.includes("interior")) serviceType = "Interior Design";
        else if (s.includes("commercial")) serviceType = "Other"; // Or map typically
        else if (s.includes("consult")) serviceType = "Consultation";

        const message = `**Consultation Request**
Preferred Date: ${formData.date || "Not specified"}
Project Type: ${formData.service}`;

        const response = await api.post("/inquiries", {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            serviceType,
            message
        });

        if (response.success) {
            setStatus("success");
            // Optional: Close after delay? For now just show success state.
        } else {
            setStatus("error");
            setErrorMessage(response.error?.message || "Failed to book consultation.");
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onCloseAction} />

            <div className="relative bg-white w-full max-w-xl p-8 md:p-12 shadow-2xl rounded-sm animate-in zoom-in-95 duration-300">
                <button
                    onClick={onCloseAction}
                    className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                <div className="text-center mb-10">
                    <h3 className="text-2xl md:text-3xl font-bold mb-2">Book Consultation</h3>
                    <p className="text-gray-500 text-xs md:text-sm uppercase tracking-widest font-bold">1-on-1 Design Discussion</p>
                </div>

                {status === "success" ? (
                    <div className="text-center py-10">
                        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <h4 className="text-xl font-bold mb-2">Request Sent!</h4>
                        <p className="text-gray-600 mb-8">We will contact you shortly to confirm your appointment.</p>
                        <button onClick={onCloseAction} className="text-sm font-bold uppercase tracking-widest text-[var(--accent)] hover:underline">Close</button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-bold tracking-widest text-gray-600">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full border-b border-gray-300 py-3 focus:border-[var(--accent)] outline-none text-sm transition-colors text-black placeholder-gray-400"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-bold tracking-widest text-gray-600">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full border-b border-gray-300 py-3 focus:border-[var(--accent)] outline-none text-sm transition-colors text-black placeholder-gray-400"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-bold tracking-widest text-gray-600">Project Type</label>
                                <select
                                    className="w-full border-b border-gray-300 py-3 focus:border-[var(--accent)] outline-none text-sm bg-white cursor-pointer text-black"
                                    value={formData.service}
                                    onChange={e => setFormData({ ...formData, service: e.target.value })}
                                >
                                    <option>Residential Architecture</option>
                                    <option>Home Interior</option>
                                    <option>Commercial / Retail</option>
                                    <option>Online Consultation</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <CustomDatePicker
                                    label="Preferred Date"
                                    value={formData.date}
                                    placeholder="Select Appointment Date"
                                    onChange={(val) => setFormData({ ...formData, date: val })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-bold tracking-widest text-gray-600">Contact Number</label>
                            <input
                                type="tel"
                                required
                                className="w-full border-b border-gray-300 py-3 focus:border-[var(--accent)] outline-none text-sm text-black placeholder-gray-400"
                                placeholder="+91 XXXX XXX XXX"
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>

                        {status === "error" && (
                            <div className="p-3 bg-red-50 text-red-600 text-xs border border-red-100">
                                {errorMessage}
                            </div>
                        )}

                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={status === "loading"}
                                className="w-full bg-[var(--accent)] text-white py-4 font-bold uppercase tracking-widest text-sm hover:bg-opacity-90 transition-all shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {status === "loading" ? "Processing..." : "Request Booking"}
                            </button>
                            <p className="mt-4 text-center text-[10px] text-gray-400 uppercase tracking-widest">Our team will call you to confirm the time slot</p>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
