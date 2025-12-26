"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/utils/api";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

// Tabs
import ProjectsTab from "@/components/admin/ProjectsTab";
import InquiriesTab from "@/components/admin/InquiriesTab";
import ProductsTab from "@/components/admin/ProductsTab";
import StaffTab from "@/components/admin/StaffTab";
import PaymentsTab from "@/components/admin/PaymentsTab";

export default function AdminDashboard() {
    const { user, token, logout, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<string>("overview");
    const [stats, setStats] = useState({
        projects: 0,
        products: 0,
        inquiries: 0,
        users: 0,
        payments: 0,
        pendingConsults: 0
    });

    useEffect(() => {
        if (!authLoading && (!user || (user.role !== "admin" && user.role !== "super-admin"))) {
            router.push("/login");
        }
    }, [user, authLoading, router]);

    const fetchStats = async () => {
        const [projRes, prodRes, inqRes, userRes] = await Promise.all([
            api.get("/projects"),
            api.get("/products?status=all"),
            api.get("/inquiries"),
            api.get("/auth/users")
        ]);

        const inqs = inqRes.success ? (inqRes.data as any[]) : [];

        setStats({
            projects: projRes.success ? (projRes.data as any[]).length : 0,
            products: prodRes.success ? (prodRes.data as any[]).length : 0,
            inquiries: inqs.length,
            users: userRes.success ? (userRes.data as any[]).length : 0,
            payments: 0, // Placeholder
            pendingConsults: inqs.filter(i => i.status === "New").length
        });
    };

    useEffect(() => {
        if (token) fetchStats();
    }, [token]);

    if (authLoading) return <div className="min-h-screen bg-black flex items-center justify-center text-white font-bold tracking-widest uppercase text-xs">Initializing Secure Environment...</div>;
    if (!user) return null;

    return (
        <div className="flex min-h-screen bg-[#0a0a0a] text-white">
            <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            <main className="flex-1 p-8 lg:p-12 overflow-y-auto h-screen scrollbar-hide">
                {/* Header Area */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <h1 className="text-3xl font-bold font-display tracking-tight text-white uppercase italic">Studio Management</h1>
                        <p className="text-gray-500 mt-2 text-xs font-bold uppercase tracking-widest">
                            Authenticated as <span className="text-[var(--accent)]">{user.name}</span>
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Server: Online</span>
                        </div>
                    </div>
                </div>

                {/* Dashboard Overview */}
                {activeTab === "overview" && (
                    <div className="space-y-12">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { label: "Total Inquiries", value: stats.inquiries, sub: `${stats.pendingConsults} Pending`, icon: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z", color: "text-blue-500" },
                                { label: "Live Products", value: stats.products, sub: "In Catalog", icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z", color: "text-green-500" },
                                { label: "Gross Revenue", value: "₹0.00", sub: "Monthly", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", color: "text-yellow-500" },
                                { label: "Studio Staff", value: "1", sub: "Active Admins", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", color: "text-purple-500" },
                            ].map((stat, i) => (
                                <div key={i} className="bg-[#111111] border border-white/5 p-8 hover:border-[var(--accent)]/30 transition-all group">
                                    <div className={`w-12 h-12 rounded-sm bg-[#1a1a1a] flex items-center justify-center mb-6 border border-white/5 group-hover:border-[var(--accent)]/20 ${stat.color}`}>
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={stat.icon} /></svg>
                                    </div>
                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-1">{stat.label}</p>
                                    <h2 className="text-3xl font-bold font-display mb-2">{stat.value}</h2>
                                    <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{stat.sub}</p>
                                </div>
                            ))}
                        </div>

                        {/* Secondary View */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 bg-[#111111] border border-white/5 p-8">
                                <div className="flex justify-between items-center mb-10">
                                    <h3 className="font-bold text-sm uppercase tracking-[0.2em] italic">System Activities</h3>
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Live Updates</span>
                                </div>
                                <div className="space-y-6">
                                    {[
                                        { type: "INQUIRY", msg: "New consultation request from Naveen K", time: "2 mins ago" },
                                        { type: "PRODUCT", msg: "Inventory updated for Premium Brass Handle", time: "1 hour ago" },
                                        { type: "PAYMENT", msg: "Payment verification pending for Order #2041", time: "3 hours ago" },
                                        { type: "STAFF", msg: "New admin account approved: Santhosh", time: "Yesterday" },
                                    ].map((act, i) => (
                                        <div key={i} className="flex gap-6 items-start pb-6 border-b border-white/5 last:border-0">
                                            <span className="text-[9px] font-black bg-white/5 text-gray-400 px-2 py-1 rounded-[2px] w-20 text-center tracking-tighter">{act.type}</span>
                                            <div className="flex-1">
                                                <p className="text-xs font-bold text-gray-300">{act.msg}</p>
                                                <p className="text-[10px] text-gray-600 mt-1 uppercase tracking-widest font-bold">{act.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-[#111111] border border-white/5 p-8">
                                <h3 className="font-bold text-sm uppercase tracking-[0.2em] mb-10 italic">Quick Links</h3>
                                <div className="space-y-4">
                                    <button onClick={() => setActiveTab("products")} className="w-full text-left p-4 bg-white/5 border border-white/5 hover:bg-[var(--accent)] hover:text-white transition-all group">
                                        <p className="text-[10px] font-bold uppercase tracking-widest">Update Shop</p>
                                        <p className="text-[9px] text-gray-500 mt-1 group-hover:text-white/70">Add new architectural products</p>
                                    </button>
                                    <button onClick={() => setActiveTab("inquiries")} className="w-full text-left p-4 bg-white/5 border border-white/5 hover:bg-[var(--accent)] hover:text-white transition-all group">
                                        <p className="text-[10px] font-bold uppercase tracking-widest">Open Consults</p>
                                        <p className="text-[9px] text-gray-500 mt-1 group-hover:text-white/70">Respond to customer inquiries</p>
                                    </button>
                                    <button onClick={() => setActiveTab("users")} className="w-full text-left p-4 bg-white/5 border border-white/5 hover:bg-[var(--accent)] hover:text-white transition-all group">
                                        <p className="text-[10px] font-bold uppercase tracking-widest">Client List</p>
                                        <p className="text-[9px] text-gray-500 mt-1 group-hover:text-white/70">Manage user accounts and roles</p>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Other Tabs */}
                <div className="admin-content-area">
                    {activeTab === "products" && <ProductsTab />}
                    {activeTab === "inventory" && <ProductsTab />} {/* Shared for now, can be filtered later */}
                    {activeTab === "inquiries" && <InquiriesTab />}
                    {activeTab === "users" && <div className="p-12 text-center text-gray-500 uppercase tracking-widest font-bold text-xs ring-1 ring-white/5 bg-[#111111]">User Management Module Loading...</div>}
                    {activeTab === "payments" && <PaymentsTab />}
                    {activeTab === "staff" && <StaffTab />}
                </div>
            </main>

            <style jsx global>{`
                :root {
                    --accent: #d4a373; /* Example studio accent color */
                }
                .font-display {
                    font-family: 'Inter', sans-serif;
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}
