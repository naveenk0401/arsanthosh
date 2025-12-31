"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function CheckoutPage() {
    const { cartTotal, cart } = useCart();
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);
    const [payuParams, setPayuParams] = useState<any>(null);
    const [formData, setFormData] = useState({
        fullName: "",
        mobile: "",
        email: "",
        address: "",
        street: "",
        city: "",
        state: "",
        country: "India",
        pincode: "",
        savePreference: false
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        const { fullName, email, mobile, address, street, city, state, country, pincode } = formData;

        if (!fullName || !email || !mobile || !address || !city || !state || !pincode) {
            alert("Please fill in all required shipping details");
            setIsProcessing(false);
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/payments/initiate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    amount: cartTotal * 1.18,
                    firstname: fullName,
                    email,
                    phone: mobile,
                    address,
                    street,
                    city,
                    state,
                    country,
                    pincode,
                    productinfo: `Order for ${fullName}`,
                    cart: cart.map(item => ({
                        ...item,
                        price: typeof item.price === "string" ? parseInt(item.price.replace(/[^\d]/g, "")) : item.price
                    }))
                })
            });

            const data = await response.json();

            if (data.success) {
                setPayuParams(data.data);
                // The form will auto-submit via useEffect when payuParams is set
            } else {
                alert("Payment initiation failed: " + (data.message || "Unknown error"));
                setIsProcessing(false);
            }
        } catch (error) {
            console.error(error);
            alert("Order failed due to network error");
            setIsProcessing(false);
        }
    };

    // Auto-submit PayU form when params are received
    useEffect(() => {
        if (payuParams) {
            const form = document.getElementById("payu_form") as HTMLFormElement;
            if (form) form.submit();
        }
    }, [payuParams]);

    if (cart.length === 0) {
        return (
            <div className="min-h-screen pt-32 pb-16 px-6 text-center">
                 <h2 className="text-2xl font-bold mb-4 uppercase tracking-[0.2em]">Your Cart is Empty</h2>
                 <button onClick={() => router.push("/store")} className="px-12 py-4 bg-black text-white font-bold uppercase tracking-widest text-[10px] hover:bg-[var(--accent)] transition-all">
                    Return to Store
                 </button>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50">
            <Navbar />
            {/* PayU Hidden Form */}
            {payuParams && (
                <form id="payu_form" action={payuParams.action} method="POST">
                    {Object.entries(payuParams.params).map(([key, value]) => (
                        <input key={key} type="hidden" name={key} value={value as string} />
                    ))}
                </form>
            )}

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
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--primary)] mb-6 border-b border-gray-100 pb-2">Shipping Details</h2>
                            <form onSubmit={handlePayment} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1 block">Full Name</label>
                                    <input name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Ex: John Doe" required className="w-full p-4 bg-white border border-gray-200 focus:border-[var(--primary)] outline-none transition-colors text-sm" />
                                </div>
                                <div>
                                    <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1 block">Mobile Number</label>
                                    <input name="mobile" value={formData.mobile} onChange={handleInputChange} placeholder="Ex: 9876543210" required className="w-full p-4 bg-white border border-gray-200 focus:border-[var(--primary)] outline-none transition-colors text-sm" />
                                </div>
                                <div>
                                    <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1 block">Email Address</label>
                                    <input name="email" value={formData.email} onChange={handleInputChange} type="email" placeholder="Ex: john@example.com" required className="w-full p-4 bg-white border border-gray-200 focus:border-[var(--primary)] outline-none transition-colors text-sm" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1 block">Address (House/Flat No.)</label>
                                    <input name="address" value={formData.address} onChange={handleInputChange} placeholder="Ex: Flat 402, Skyline Apartments" required className="w-full p-4 bg-white border border-gray-200 focus:border-[var(--primary)] outline-none transition-colors text-sm" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1 block">Street / Area</label>
                                    <input name="street" value={formData.street} onChange={handleInputChange} placeholder="Ex: MG Road, Indiranagar" required className="w-full p-4 bg-white border border-gray-200 focus:border-[var(--primary)] outline-none transition-colors text-sm" />
                                </div>
                                <div>
                                    <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1 block">City</label>
                                    <input name="city" value={formData.city} onChange={handleInputChange} placeholder="Ex: Bangalore" required className="w-full p-4 bg-white border border-gray-200 focus:border-[var(--primary)] outline-none transition-colors text-sm" />
                                </div>
                                <div>
                                    <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1 block">State</label>
                                    <input name="state" value={formData.state} onChange={handleInputChange} placeholder="Ex: Karnataka" required className="w-full p-4 bg-white border border-gray-200 focus:border-[var(--primary)] outline-none transition-colors text-sm" />
                                </div>
                                <div>
                                    <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1 block">Country</label>
                                    <input name="country" value={formData.country} onChange={handleInputChange} required className="w-full p-4 bg-gray-50 border border-gray-200 focus:border-[var(--primary)] outline-none transition-colors text-sm" />
                                </div>
                                <div>
                                    <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1 block">Pincode</label>
                                    <input name="pincode" value={formData.pincode} onChange={handleInputChange} placeholder="Ex: 560001" required className="w-full p-4 bg-white border border-gray-200 focus:border-[var(--primary)] outline-none transition-colors text-sm" />
                                </div>

                                <div className="md:col-span-2 flex items-center gap-3 mt-4">
                                    <input type="checkbox" id="savePreference" name="savePreference" checked={formData.savePreference} onChange={handleInputChange} className="w-4 h-4 accent-black" />
                                    <label htmlFor="savePreference" className="text-xs text-gray-600 font-medium cursor-pointer">Save address for next time preference</label>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isProcessing}
                                    className="md:col-span-2 w-full bg-black text-white py-5 font-bold uppercase tracking-widest text-xs hover:bg-[var(--accent)] transition-all shadow-lg flex items-center justify-center gap-4 mt-6 disabled:opacity-50"
                                >
                                    {isProcessing ? "Processing..." : `Proceed to Pay ₹${(cartTotal * 1.18).toLocaleString()}`}
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="lg:sticky lg:top-32 h-fit">
                        <div className="bg-[var(--primary)] text-white p-8 rounded-sm shadow-2xl overflow-hidden relative">
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
                             <img src="https://upload.wikimedia.org/wikipedia/commons/2/24/PayU_logo.svg" className="h-4 grayscale opacity-30" alt="PayU" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4 grayscale opacity-30" alt="Visa" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-6 grayscale opacity-30" alt="Mastercard" />
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
