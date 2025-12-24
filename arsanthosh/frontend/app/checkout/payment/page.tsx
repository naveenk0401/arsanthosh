"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../context/CartContext";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function PaymentGateway() {
    const { cartTotal, clearCart } = useCart();
    const router = useRouter();
    const [method, setMethod] = useState("card");
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handlePayment = (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        // Simulate processing
        setTimeout(() => {
            setIsProcessing(false);
            setIsSuccess(true);
            clearCart();
        }, 3000);
    };

    if (isSuccess) {
        return (
            <main className="min-h-screen bg-[var(--bg)] flex flex-col">
                <Header />
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-8 animate-bounce">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <h1 className="text-4xl font-bold mb-4">Payment Successful!</h1>
                    <p className="text-gray-500 mb-10 max-w-sm">Your order has been confirmed. A receipt has been sent to your email.</p>
                    <button onClick={() => router.push("/store")} className="bg-black text-white px-10 py-4 font-bold uppercase tracking-widest text-xs hover:bg-[var(--accent)] transition-all">Back to Store</button>
                </div>
                <Footer />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50">
            <div className="bg-white border-b py-6 mb-12">
                <div className="max-w-4xl mx-auto px-6 flex justify-between items-center">
                    <h1 className="text-lg font-bold uppercase tracking-[0.2em]">Secure Checkout</h1>
                    <div className="flex items-center gap-2 text-gray-400">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                        <span className="text-[10px] font-bold uppercase tracking-widest">SSL Encrypted</span>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left: Payment Method Selection */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">Payment Method</h2>
                            <div className="grid grid-cols-1 gap-4">
                                {[
                                    { id: "card", name: "Credit / Debit Card", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" },
                                    { id: "upi", name: "UPI (Google Pay / PhonePe)", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
                                    { id: "net", name: "Net Banking", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m4 0h1m-5 4h1m4 0h1m-5 4h1m4 0h1" }
                                ].map((m) => (
                                    <button
                                        key={m.id}
                                        onClick={() => setMethod(m.id)}
                                        className={`flex items-center gap-4 p-5 border-2 transition-all text-left ${method === m.id ? "border-[var(--accent)] bg-white shadow-md" : "border-gray-100 bg-gray-50 hover:bg-white"}`}
                                    >
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${method === m.id ? "bg-[var(--accent)] text-white" : "bg-gray-200 text-gray-500"}`}>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={m.icon} /></svg>
                                        </div>
                                        <span className={`font-bold text-sm ${method === m.id ? "text-black" : "text-gray-500"}`}>{m.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {method === "card" && (
                            <form onSubmit={handlePayment} className="bg-white p-8 border border-gray-100 shadow-sm space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Cardholder Name</label>
                                    <input required type="text" className="w-full px-4 py-3 bg-gray-50 border border-transparent outline-none focus:bg-white focus:border-[var(--accent)] text-sm transition-all" placeholder="JOHN DOE" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Card Number</label>
                                    <input required type="text" className="w-full px-4 py-3 bg-gray-50 border border-transparent outline-none focus:bg-white focus:border-[var(--accent)] text-sm transition-all" placeholder="XXXX XXXX XXXX XXXX" />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Expiry (MM/YY)</label>
                                        <input required type="text" className="w-full px-4 py-3 bg-gray-50 border border-transparent outline-none focus:bg-white focus:border-[var(--accent)] text-sm transition-all" placeholder="MM/YY" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">CVV</label>
                                        <input required type="text" className="w-full px-4 py-3 bg-gray-50 border border-transparent outline-none focus:bg-white focus:border-[var(--accent)] text-sm transition-all" placeholder="123" />
                                    </div>
                                </div>
                                <button
                                    disabled={isProcessing}
                                    className="w-full bg-black text-white py-5 font-bold uppercase tracking-widest text-xs hover:bg-[var(--accent)] transition-all shadow-lg flex items-center justify-center gap-4"
                                >
                                    {isProcessing ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                            Processing...
                                        </>
                                    ) : `Pay ₹${cartTotal.toLocaleString()}`}
                                </button>
                            </form>
                        )}

                        {(method === "upi" || method === "net") && (
                            <div className="bg-white p-8 border border-gray-100 shadow-sm text-center">
                                <p className="text-gray-400 text-sm mb-6">Payment method selection for <strong>{method.toUpperCase()}</strong> will be available in the next integration step.</p>
                                <button
                                    onClick={handlePayment}
                                    disabled={isProcessing}
                                    className="w-full bg-black text-white py-5 font-bold uppercase tracking-widest text-xs hover:bg-[var(--accent)] transition-all shadow-lg flex items-center justify-center gap-4"
                                >
                                    {isProcessing ? "Connecting to Gateway..." : "Proceed to Sandbox"}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Right: Summary Container */}
                    <div className="lg:sticky lg:top-32 h-fit">
                        <div className="bg-[var(--primary)] text-white p-8 rounded-sm shadow-2xl overflow-hidden relative">
                            {/* Decorative Background Element */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 -mr-16 -mt-16 rounded-full blur-3xl" />

                            <h2 className="text-sm font-bold uppercase tracking-widest mb-8 opacity-50">Order Summary</h2>
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-sm opacity-80">
                                    <span>Subtotal</span>
                                    <span>₹{cartTotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm opacity-80">
                                    <span>Shipping</span>
                                    <span className="text-green-400 font-bold uppercase text-[10px] tracking-widest">Free</span>
                                </div>
                                <div className="flex justify-between text-sm opacity-80">
                                    <span>Tax (GST 18%)</span>
                                    <span>₹{(cartTotal * 0.18).toLocaleString()}</span>
                                </div>
                            </div>
                            <div className="pt-8 border-t border-white/10 flex justify-between items-end">
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-50 mb-1">Total Payable</p>
                                    <p className="text-3xl font-bold">₹{(cartTotal * 1.18).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex items-center justify-center gap-4 text-gray-400">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-4 grayscale opacity-30" alt="Payment Logos" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4 grayscale opacity-30" alt="Payment Logos" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-6 grayscale opacity-30" alt="Payment Logos" />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
