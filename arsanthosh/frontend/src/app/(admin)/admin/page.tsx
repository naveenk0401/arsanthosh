"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

export default function AdminDashboard() {
    return (
        <main className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <div className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                        <p className="text-gray-500 mt-2">Welcome to the Architect Santhosh Studio Management Portal.</p>
                    </div>
                    <div className="flex gap-4">
                        <Link href="/admin/login" className="px-6 py-2 bg-white border border-gray-200 font-bold text-sm hover:bg-gray-50 transition-colors uppercase tracking-widest">Logout</Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {[
                        { label: "Total Orders", value: "124", color: "bg-blue-500" },
                        { label: "Products", value: "48", color: "bg-green-500" },
                        { label: "Services", value: "6", color: "bg-purple-500" },
                        { label: "Customers", value: "1.2k", color: "bg-orange-500" }
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-6 border border-gray-100 shadow-sm rounded-sm">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">{stat.label}</p>
                            <p className="text-3xl font-bold">{stat.value}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-white border border-gray-100 shadow-sm rounded-sm overflow-hidden">
                    <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                        <h2 className="font-bold text-lg">System Status</h2>
                        <span className="flex items-center gap-2 text-xs font-bold text-green-600 uppercase tracking-widest">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            System Online
                        </span>
                    </div>
                    <div className="p-12 text-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                        </div>
                        <h3 className="text-xl font-bold mb-2">Management Portal Initialization</h3>
                        <p className="text-gray-500 max-w-md mx-auto text-sm leading-relaxed mb-8">
                            The studio management modules are being synchronized with the new source architecture. Full inventory and order management functionality will be available shortly.
                        </p>
                        <div className="flex justify-center gap-6">
                            <Link href="/admin/login" className="text-xs font-bold uppercase tracking-widest text-[var(--accent)] hover:underline">Configure Settings</Link>
                            <Link href="/store" className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors">View Storefront</Link>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
