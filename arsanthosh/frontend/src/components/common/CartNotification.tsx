"use client";

import { useCart } from "@/context/CartContext";

export default function CartNotification() {
    const { notification } = useCart();

    if (!notification || !notification.show) return null;

    return (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] animate-slide-down">
            <div className="bg-white px-6 py-4 shadow-2xl rounded-full border border-gray-100 flex items-center gap-4 min-w-[300px]">
                <div className="w-10 h-10 bg-[var(--accent)] rounded-full flex items-center justify-center text-white">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <div>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-0.5">Added to Cart</p>
                    <p className="text-sm font-bold text-black">{notification.product}</p>
                </div>
            </div>
        </div>
    );
}
