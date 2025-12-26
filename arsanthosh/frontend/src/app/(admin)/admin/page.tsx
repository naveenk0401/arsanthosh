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
import AnalyticsTab from "@/components/admin/AnalyticsTab";

export default function AdminDashboard() {
    const { user, token, logout, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<string>("overview");
    const [sidebarOpen, setSidebarOpen] = useState(false);
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
        const [projRes, prodRes, inqRes, userRes, statsRes] = await Promise.all([
            api.get("/projects"),
            api.get("/products?status=all"),
            api.get("/inquiries"),
            api.get("/auth/users"),
            user?.role === "super-admin" ? api.get("/stats/business?range=monthly") : Promise.resolve({ success: false })
        ]);

        const inqs = inqRes.success ? (inqRes.data as any[]) : [];
        const monthlyStats = (statsRes as any).success ? ((statsRes as any).data as any).summary : null;

        setStats({
            projects: projRes.success ? (projRes.data as any[]).length : 0,
            products: prodRes.success ? (prodRes.data as any[]).length : 0,
            inquiries: inqs.length,
            users: userRes.success ? (userRes.data as any[]).length : 0,
            payments: monthlyStats?.totalRevenue || 0,
            pendingConsults: inqs.filter(i => i.status === "New").length
        });
    };

    useEffect(() => {
        if (token) fetchStats();
    }, [token]);

    if (authLoading) return <div className="min-h-screen bg-white flex items-center justify-center text-black font-bold tracking-widest uppercase text-xs">Initializing Secure Environment...</div>;
    if (!user) return null;

    return (
        <div className="flex min-h-screen bg-gray-50 text-gray-900 overflow-x-hidden">
            <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <main className="flex-1 p-5 sm:p-8 lg:p-12 overflow-y-auto h-screen scrollbar-hide">
                {/* Mobile Top Bar */}
                <div className="lg:hidden flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-900 flex items-center justify-center font-bold text-white text-lg rounded-sm shadow-md italic">A</div>
                        <span className="font-bold text-sm tracking-tighter uppercase font-display italic text-gray-900">Management</span>
                    </div>
                    <button onClick={() => setSidebarOpen(true)} className="p-2 bg-white border border-gray-100 rounded-sm shadow-sm text-gray-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                    </button>
                </div>

                {/* Header Area */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <h1 className="text-3xl font-bold font-display tracking-tight text-gray-900 uppercase italic">Studio Management</h1>
                        <p className="text-gray-700 mt-2 text-xs font-bold uppercase tracking-widest">
                            Authenticated as <span className="text-[var(--primary)] font-black">{user.name}</span>
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="px-4 py-2 bg-green-500/5 border border-green-500/10 rounded-full flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest">System Status: Active</span>
                        </div>
                    </div>
                </div>

                {/* Dashboard Overview */}
                {activeTab === "overview" && (
                    <div className="space-y-12">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                            {[
                                { label: "Total Inquiries", value: stats.inquiries, sub: `${stats.pendingConsults} Pending`, icon: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z", color: "text-blue-600" },
                                { label: "Live Products", value: stats.products, sub: "In Catalog", icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z", color: "text-green-600" },
                                { label: "Gross Revenue", value: `₹${stats.payments.toLocaleString()}`, sub: "Monthly", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", color: "text-yellow-600" },
                                { label: "Studio Staff", value: "1", sub: "Active Admins", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", color: "text-purple-600" },
                            ].map((stat, i) => (
                                <div key={i} className="bg-white border border-gray-100 p-8 hover:border-[var(--primary)]/30 transition-all group shadow-sm">
                                    <div className={`w-12 h-12 rounded-sm bg-gray-50 flex items-center justify-center mb-6 border border-gray-100 group-hover:border-[var(--primary)]/20 shadow-inner ${stat.color}`}>
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={stat.icon} /></svg>
                                    </div>
                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600 mb-1">{stat.label}</p>
                                    <h2 className="text-3xl font-bold font-display mb-2 text-gray-900">{stat.value}</h2>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{stat.sub}</p>
                                </div>
                            ))}
                        </div>

                        {/* Secondary View */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 bg-white border border-gray-100 p-8 shadow-sm">
                                <div className="flex justify-between items-center mb-10 pb-4 border-b border-gray-50">
                                    <h3 className="font-bold text-sm uppercase tracking-[0.2em] italic text-gray-900">System Activities</h3>
                                    <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Live Updates</span>
                                </div>
                                <div className="space-y-6">
                                    {[
                                        { type: "INQUIRY", msg: "New consultation request from Naveen K", time: "2 mins ago" },
                                        { type: "PRODUCT", msg: "Inventory updated for Premium Brass Handle", time: "1 hour ago" },
                                        { type: "PAYMENT", msg: "Payment verification pending for Order #2041", time: "3 hours ago" },
                                        { type: "STAFF", msg: "New admin account approved: Santhosh", time: "Yesterday" },
                                    ].map((act, i) => (
                                        <div key={i} className="flex gap-6 items-start pb-6 border-b border-gray-50 last:border-0">
                                            <span className="text-[9px] font-black bg-gray-100 text-gray-700 px-2 py-1 rounded-[2px] w-20 text-center tracking-tighter shadow-sm">{act.type}</span>
                                            <div className="flex-1">
                                                <p className="text-xs font-bold text-gray-900">{act.msg}</p>
                                                <p className="text-[10px] text-gray-600 mt-1 uppercase tracking-widest font-bold">{act.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white border border-gray-100 p-8 shadow-sm">
                                <h3 className="font-bold text-sm uppercase tracking-[0.2em] mb-10 italic text-gray-800 pb-4 border-b border-gray-50">Quick Links</h3>
                                <div className="space-y-4">
                                    <button onClick={() => setActiveTab("products")} className="w-full text-left p-4 bg-gray-50 border border-gray-100 hover:bg-[var(--primary)] hover:text-white transition-all group">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-900 group-hover:text-white">Update Shop</p>
                                        <p className="text-[9px] text-gray-600 mt-1 group-hover:text-white/80">Add new architectural products</p>
                                    </button>
                                    <button onClick={() => setActiveTab("inquiries")} className="w-full text-left p-4 bg-gray-50 border border-gray-100 hover:bg-[var(--primary)] hover:text-white transition-all group">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-900 group-hover:text-white">Open Consults</p>
                                        <p className="text-[9px] text-gray-600 mt-1 group-hover:text-white/80">Respond to customer inquiries</p>
                                    </button>
                                    <button onClick={() => setActiveTab("users")} className="w-full text-left p-4 bg-gray-50 border border-gray-100 hover:bg-[var(--primary)] hover:text-white transition-all group">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-900 group-hover:text-white">Client List</p>
                                        <p className="text-[9px] text-gray-600 mt-1 group-hover:text-white/80">Manage user accounts and roles</p>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Other Tabs */}
                <div className="admin-content-area text-gray-900">
                    {activeTab === "products" && <ProductsTab />}
                    {activeTab === "inventory" && <ProductsTab />}
                    {activeTab === "inquiries" && <InquiriesTab />}
                    {activeTab === "users" && <div className="p-12 text-center text-gray-400 uppercase tracking-widest font-bold text-xs border border-gray-100 bg-white shadow-sm">User Management Module Loading...</div>}
                    {activeTab === "payments" && <PaymentsTab />}
                    {activeTab === "staff" && <StaffTab />}
                    {activeTab === "analytics" && user.role === "super-admin" && <AnalyticsTab />}
                </div>
            </main>

            <style jsx global>{`
                :root {
                    --primary: #c5a880; /* Premium Architectural Gold/Brass */
                    --accent: #c5a880; 
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
                /* Smooth Admin Transitions */
                .admin-content-area {
                    animation: fadeIn 0.4s ease-out;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
