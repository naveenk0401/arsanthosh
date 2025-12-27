"use client";

import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function PendingApprovalPage() {
    return (
        <main className="min-h-screen bg-[var(--bg)]">
            <Navbar />
            <div className="flex items-center justify-center px-6 py-12 md:py-24">
                <div className="bg-white w-full max-w-md p-8 md:p-12 shadow-xl border border-gray-50 text-center rounded-sm">
                    <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold mb-4">Pending Approval</h1>
                    <p className="text-[var(--muted)] text-sm mb-8 leading-relaxed">
                        Your account has been successfully verified, but since you registered as an <span className="font-bold text-[var(--primary)]">Architect/Admin</span>, it requires authorization from a Super Admin.
                    </p>
                    <div className="space-y-4">
                        <p className="text-xs text-gray-400 bg-gray-50 p-4 rounded-sm italic">
                            You will receive an email once your account is approved. Usually, this takes less than 24 hours.
                        </p>
                        <Link
                            href="/login"
                            className="inline-block w-full bg-[var(--primary)] text-white py-4 font-bold hover:bg-black transition-all uppercase tracking-widest text-sm"
                        >
                            Return to Login
                        </Link>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
