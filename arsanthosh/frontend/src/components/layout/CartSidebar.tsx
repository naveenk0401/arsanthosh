"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { useEffect } from "react";

export default function CartSidebar() {
    const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartTotal } = useCart();

    // Prevent body scroll when cart is open
    useEffect(() => {
        if (isCartOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isCartOpen]);

    if (!isCartOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
                onClick={() => setIsCartOpen(false)}
            />

            {/* Sidebar */}
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white">
                    <h2 className="font-display text-xl font-bold uppercase tracking-tight">Your Cart</h2>
                    <button
                        onClick={() => setIsCartOpen(false)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                            <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            <p className="text-sm font-bold uppercase tracking-widest">Your cart is empty</p>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="text-xs underline hover:text-[var(--accent)]"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        cart.map((item, idx) => (
                            <div key={`${item.name}-${idx}`} className="flex gap-4">
                                {/* Image Placeholder or Real Image if available */}
                                <div className="w-20 h-20 bg-gray-100 flex-shrink-0 relative overflow-hidden">
                                    {item.image ? (
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">IMG</div>
                                    )}
                                </div>

                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-bold text-sm text-gray-900 leading-tight">{item.name}</h3>
                                        <p className="text-xs text-gray-500 mt-1">{item.category || "Furniture"}</p>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center border border-gray-200">
                                            <button
                                                onClick={() => updateQuantity(item.name, -1)}
                                                className="px-2 py-1 hover:bg-gray-50 transition-colors text-gray-500"
                                            >
                                                -
                                            </button>
                                            <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.name, 1)}
                                                className="px-2 py-1 hover:bg-gray-50 transition-colors text-gray-500"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-sm">₹{item.price}</p>
                                            <button
                                                onClick={() => removeFromCart(item.name)}
                                                className="text-[10px] text-red-500 hover:text-red-700 underline mt-1"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {cart.length > 0 && (
                    <div className="p-6 bg-gray-50 border-t border-gray-100 space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Subtotal</span>
                                <span className="font-bold">₹{cartTotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Tax (18%)</span>
                                <span className="font-bold">₹{(cartTotal * 0.18).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2 text-[var(--accent)]">
                                <span>Total</span>
                                <span>₹{(cartTotal * 1.18).toLocaleString()}</span>
                            </div>
                        </div>
                        <Link
                            href="/checkout/payment"
                            onClick={() => setIsCartOpen(false)}
                            className="block w-full bg-black text-white text-center py-4 font-bold uppercase tracking-widest text-xs hover:bg-[var(--accent)] transition-colors shadow-lg"
                        >
                            Proceed to Checkout
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
