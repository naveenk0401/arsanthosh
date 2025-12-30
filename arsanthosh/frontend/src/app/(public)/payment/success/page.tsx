"use client";

import Link from "next/link";

export default function PaymentSuccess() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
            <div className="bg-white p-12 max-w-lg w-full text-center border-t-8 border-green-500 shadow-xl rounded-sm">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 text-green-500">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                </div>
                <h1 className="text-3xl font-bold font-display mb-4 text-gray-900">Payment Successful</h1>
                <p className="text-gray-500 mb-8 leading-relaxed">
                    Thank you for your order. We have received your payment and will begin processing your request shortly.
                </p>
                <div className="flex flex-col gap-4">
                    <Link href="/store" className="w-full py-4 bg-black text-white font-bold uppercase tracking-widest text-xs hover:bg-gray-800 transition-colors">
                        Continue Shopping
                    </Link>
                    <Link href="/contact" className="w-full py-4 border border-black text-black font-bold uppercase tracking-widest text-xs hover:bg-gray-50 transition-colors">
                        Contact Support
                    </Link>
                </div>
            </div>
        </div>
    );
}
