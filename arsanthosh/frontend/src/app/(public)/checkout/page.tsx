"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/utils/api";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
    const { cart, cartTotal } = useCart();
    const { user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [details, setDetails] = useState({
        name: user?.name || "",
        email: user?.email || "",
        phone: "",
        address: ""
    });

    if (cart.length === 0) {
        return (
            <div className="min-h-screen pt-32 pb-16 px-6 text-center">
                 <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
                 <button onClick={() => router.push("/store")} className="px-8 py-3 bg-black text-white font-bold uppercase tracking-widest text-xs">
                    Return to Store
                 </button>
            </div>
        );
    }

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Get Hash & Params from Backend
            const response = await api.post("/payments/initiate", {
                amount: cartTotal,
                firstname: details.name,
                email: details.email,
                phone: details.phone,
                productinfo: `Order of ${cart.length} items`,
                userId: (user as any)?._id,
                address: details.address,
                cart: cart
            });

            if (response.success && response.data) {
                const { action, params } = response.data as any;

                // 2. Create Form and Submit
                const form = document.createElement("form");
                form.action = action;
                form.method = "POST";

                Object.keys(params).forEach(key => {
                    const input = document.createElement("input");
                    input.type = "hidden";
                    input.name = key;
                    input.value = params[key];
                    form.appendChild(input);
                });

                document.body.appendChild(form);
                form.submit();
            } else {
                alert("Failed to initiate payment. Please try again.");
                setLoading(false);
            }
        } catch (err) {
            console.error(err);
            alert("Something went wrong.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-16 bg-gray-50">
            <div className="max-w-4xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
                
                {/* Order Summary */}
                <div className="bg-white p-8 border border-gray-100 shadow-sm h-fit">
                     <h3 className="text-sm font-bold uppercase tracking-widest mb-6 border-b border-gray-100 pb-4">Order Summary</h3>
                     <div className="space-y-4 mb-6">
                        {cart.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-sm">
                                <div>
                                    <span className="font-bold text-gray-900">{item.name}</span>
                                    <span className="text-gray-500 text-xs ml-2">x{item.quantity}</span>
                                </div>
                                <div className="font-mono text-gray-600">{item.price}</div>
                            </div>
                        ))}
                     </div>
                     <div className="flex justify-between items-center pt-4 border-t border-gray-100 mb-8">
                         <span className="font-bold text-gray-900 uppercase">Total</span>
                         <span className="text-xl font-bold font-display text-[var(--primary)]">₹{cartTotal.toLocaleString()}</span>
                     </div>
                </div>

                {/* Form */}
                <div className="bg-white p-8 border border-gray-100 shadow-sm">
                    <h3 className="text-sm font-bold uppercase tracking-widest mb-6 border-b border-gray-100 pb-4">Billing Details</h3>
                    <form onSubmit={handlePayment} className="space-y-4">
                         <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Full Name</label>
                            <input 
                                required
                                type="text" 
                                value={details.name}
                                onChange={e => setDetails({...details, name: e.target.value})}
                                className="w-full p-3 bg-gray-50 border border-gray-200 outline-none focus:border-[var(--accent)] text-xs"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Email Address</label>
                            <input 
                                required
                                type="email" 
                                value={details.email}
                                onChange={e => setDetails({...details, email: e.target.value})}
                                className="w-full p-3 bg-gray-50 border border-gray-200 outline-none focus:border-[var(--accent)] text-xs"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Phone Number</label>
                            <input 
                                required
                                type="tel" 
                                value={details.phone}
                                onChange={e => setDetails({...details, phone: e.target.value})}
                                className="w-full p-3 bg-gray-50 border border-gray-200 outline-none focus:border-[var(--accent)] text-xs"
                            />
                        </div>
                        <div className="space-y-1 mb-6">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Address</label>
                            <textarea 
                                required
                                rows={3}
                                value={details.address}
                                onChange={e => setDetails({...details, address: e.target.value})}
                                className="w-full p-3 bg-gray-50 border border-gray-200 outline-none focus:border-[var(--accent)] text-xs"
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full py-4 bg-[var(--primary)] hover:bg-black text-white font-bold uppercase tracking-widest text-xs transition-colors disabled:opacity-70"
                        >
                            {loading ? "Processing..." : "Pay Now (Test Mode)"}
                        </button>
                        <p className="text-[10px] text-center text-gray-400 mt-2">Secured by PayU</p>
                    </form>
                </div>

            </div>
        </div>
    );
}
