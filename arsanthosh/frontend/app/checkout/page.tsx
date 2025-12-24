"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function CheckoutPage() {
    const { cart, cartTotal, clearCart } = useCart();
    const router = useRouter();
    const [step, setStep] = useState(1); // 1: Auth, 2: Billing, 3: Success
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [billingData, setBillingData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        pincode: "",
    });

    useEffect(() => {
        // Mock auth check
        const user = localStorage.getItem("user");
        if (user) {
            setIsLoggedIn(true);
            setStep(2);
            const userData = JSON.parse(user);
            setBillingData(prev => ({ ...prev, name: userData.name || "", email: userData.email || "" }));
        }
    }, []);

    const handleMockLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const mockUser = { name: "Guest User", email: "guest@example.com" };
        localStorage.setItem("user", JSON.stringify(mockUser));
        setIsLoggedIn(true);
        setStep(2);
    };

    const handlePlaceOrder = (e: React.FormEvent) => {
        e.preventDefault();

        const phoneNumber = "9843237459";
        const itemSummary = cart.map(item => `${item.name} (x${item.quantity})`).join("%0A");
        const message = `*NEW ORDER PLACED*%0A%0A*Customer:* ${billingData.name}%0A*Phone:* ${billingData.phone}%0A*Address:* ${billingData.address}, ${billingData.city} - ${billingData.pincode}%0A%0A*Items:*%0A${itemSummary}%0A%0A*Total Amount: ₹${cartTotal.toLocaleString()}*%0A%0APlease contact me for payment!`;

        window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
        setStep(3);
        clearCart();
    };

    if (cart.length === 0 && step !== 3) {
        return (
            <main className="min-h-screen bg-[var(--bg)]">
                <Header />
                <div className="max-w-7xl mx-auto px-6 py-32 text-center">
                    <h1 className="text-3xl font-bold mb-6">Your cart is empty</h1>
                    <button onClick={() => router.push("/store")} className="bg-black text-white px-10 py-4 font-bold uppercase tracking-widest text-xs">Return to Store</button>
                </div>
                <Footer />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[var(--bg)]">
            <Header />

            <section className="py-16 md:py-24">
                <div className="max-w-4xl mx-auto px-6">
                    {/* Progress Bar */}
                    <div className="flex items-center justify-between mb-16 relative">
                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2 z-0" />
                        {[1, 2, 3].map((s) => (
                            <div key={s} className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${step >= s ? "bg-[var(--accent)] text-white shadow-lg" : "bg-white text-gray-400 border border-gray-200"}`}>
                                {s}
                            </div>
                        ))}
                    </div>

                    <div className="bg-white p-8 md:p-16 shadow-2xl border border-gray-50 rounded-sm">
                        {step === 1 && (
                            <div className="text-center">
                                <h1 className="text-2xl md:text-3xl font-bold mb-4">Identify Yourself</h1>
                                <p className="text-gray-500 mb-10 text-sm">Please sign in or create an account to proceed with your order.</p>

                                <form onSubmit={handleMockLogin} className="space-y-6 max-w-sm mx-auto">
                                    <button className="w-full bg-black text-white py-4 font-bold uppercase tracking-widest text-xs hover:bg-[var(--accent)] transition-all">
                                        Continue as Guest
                                    </button>
                                    <div className="flex items-center gap-4 text-gray-300">
                                        <div className="flex-1 h-px bg-gray-200" />
                                        <span className="text-[10px] uppercase font-bold tracking-widest">OR</span>
                                        <div className="flex-1 h-px bg-gray-200" />
                                    </div>
                                    <div className="flex gap-4">
                                        <button onClick={() => router.push("/login")} type="button" className="flex-1 border-2 border-black py-4 font-bold uppercase tracking-widest text-[10px] hover:bg-black hover:text-white transition-all">Sign In</button>
                                        <button onClick={() => router.push("/register")} type="button" className="flex-1 border-2 border-[var(--accent)] text-[var(--accent)] py-4 font-bold uppercase tracking-widest text-[10px] hover:bg-[var(--accent)] hover:text-white transition-all">Register</button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {step === 2 && (
                            <div>
                                <h1 className="text-2xl font-bold mb-8">Billing Details</h1>
                                <form onSubmit={handlePlaceOrder} className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Full Name</label>
                                            <input required type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 outline-none focus:border-[var(--accent)] text-sm" value={billingData.name} onChange={e => setBillingData({ ...billingData, name: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Phone Number</label>
                                            <input required type="tel" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 outline-none focus:border-[var(--accent)] text-sm" value={billingData.phone} onChange={e => setBillingData({ ...billingData, phone: e.target.value })} />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Delivery Address</label>
                                        <textarea required rows={3} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 outline-none focus:border-[var(--accent)] text-sm resize-none" value={billingData.address} onChange={e => setBillingData({ ...billingData, address: e.target.value })} />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">City</label>
                                            <input required type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 outline-none focus:border-[var(--accent)] text-sm" value={billingData.city} onChange={e => setBillingData({ ...billingData, city: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Pincode</label>
                                            <input required type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 outline-none focus:border-[var(--accent)] text-sm" value={billingData.pincode} onChange={e => setBillingData({ ...billingData, pincode: e.target.value })} />
                                        </div>
                                    </div>

                                    <div className="pt-8 border-t">
                                        <div className="flex justify-between items-center mb-8">
                                            <span className="text-gray-500">Total payable amount</span>
                                            <span className="text-2xl font-bold">₹{cartTotal.toLocaleString()}</span>
                                        </div>
                                        <button className="w-full bg-black text-white py-5 font-bold uppercase tracking-widest text-xs hover:bg-[var(--accent)] transition-all">
                                            Place Order via WhatsApp
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="text-center py-10">
                                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
                                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                </div>
                                <h1 className="text-3xl font-bold mb-4">Order Placed!</h1>
                                <p className="text-gray-500 mb-10 max-w-sm mx-auto text-sm">We have received your order request. Please complete the WhatsApp conversation to confirm delivery and payment.</p>
                                <button onClick={() => router.push("/store")} className="bg-black text-white px-10 py-4 font-bold uppercase tracking-widest text-xs hover:bg-[var(--accent)] transition-all">Continue Shopping</button>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
