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
import UsersTab from "@/components/admin/UsersTab";
import ConsultationTab from "@/components/admin/ConsultationTab";
import InventoryTab from "@/components/admin/InventoryTab";
import NewsletterTab from "@/components/admin/NewsletterTab";
import SettingsTab from "@/components/admin/SettingsTab";

export default function AdminDashboard() {
    const { user, token, logout, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<string>("overview");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activities, setActivities] = useState<any[]>([]);
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
            router.push("/admin/login");
        }
    }, [user, authLoading, router]);

    const fetchStats = async () => {
        setIsLoading(true);
        const statsRes = await api.get("/admin/stats?range=monthly");

        if (statsRes.success) {
            const data = statsRes.data as any;
            const overview = data.overview;
            const monthlySummary = data.summary;

            setStats({
                projects: overview.projects || 0,
                products: overview.products || 0,
                inquiries: overview.inquiries || 0,
                users: overview.users || 0,
                payments: monthlySummary?.totalRevenue || 0,
                pendingConsults: overview.pendingConsults || 0
            });

            setActivities(overview.activities || []);
        }
        setIsLoading(false);
    };

    const getRelativeTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return "Just now";
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        return date.toLocaleDateString();
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
                                { id: "inquiries", label: "Total Inquiries", value: stats.inquiries, sub: `${stats.pendingConsults} Pending`, icon: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z", color: "text-blue-600" },
                                { id: "products", label: "Live Products", value: stats.products, sub: "In Catalog", icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z", color: "text-green-600" },
                                { id: "analytics", label: "Gross Revenue", value: `₹${stats.payments.toLocaleString()}`, sub: "Monthly", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", color: "text-yellow-600" },
                                { id: "staff", label: "Studio Staff", value: "1", sub: "Active Admins", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", color: "text-purple-600" },
                            ].map((stat, i) => (
                                <div
                                    key={i}
                                    onClick={() => {
                                        setActiveTab(stat.id);
                                        window.scrollTo({ top: 0, behavior: "smooth" });
                                    }}
                                    className="bg-white border border-gray-100 p-8 hover:border-[var(--primary)]/30 transition-all group shadow-sm cursor-pointer active:scale-[0.98]"
                                >
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
                                    <div className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                                        <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Live Updates</span>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    {activities.length > 0 ? (
                                        activities.map((act, i) => {
                                            // Fallback tab detection for older records
                                            const effectiveTab = (act.targetTab && act.targetTab !== 'overview')
                                                ? act.targetTab
                                                : act.type === 'INQUIRY' ? 'inquiries'
                                                    : act.type === 'PRODUCT' ? 'products'
                                                        : act.type === 'PAYMENT' ? 'payments'
                                                            : act.type === 'STAFF' ? 'staff'
                                                                : null;

                                            const isClickable = !!effectiveTab;

                                            return (
                                                <div
                                                    key={i}
                                                    onClick={() => {
                                                        if (isClickable) {
                                                            setActiveTab(effectiveTab);
                                                            window.scrollTo({ top: 0, behavior: "smooth" });
                                                        }
                                                    }}
                                                    className={`group flex gap-6 items-start pb-6 border-b border-gray-50 last:border-0 ${isClickable ? 'cursor-pointer hover:bg-gray-50/50 transition-colors -mx-4 px-4' : ''}`}
                                                >
                                                    <span className={`text-[9px] font-black px-2 py-1 rounded-[2px] w-20 text-center tracking-tighter shadow-sm ${act.type === 'INQUIRY' ? 'bg-blue-50 text-blue-700' :
                                                        act.type === 'PRODUCT' ? 'bg-green-50 text-green-700' :
                                                            act.type === 'STAFF' ? 'bg-purple-50 text-purple-700' :
                                                                act.type === 'PAYMENT' ? 'bg-yellow-50 text-yellow-700' :
                                                                    'bg-gray-100 text-gray-700'
                                                        }`}>
                                                        {act.type}
                                                    </span>
                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <p className={`text-xs font-bold text-gray-900 ${isClickable ? 'group-hover:text-[var(--primary)] group-hover:underline decoration-[var(--primary)]/30 underline-offset-4 transition-all' : ''}`}>{act.message}</p>
                                                                {isClickable && (
                                                                    <span className="text-[9px] font-bold text-[var(--primary)] opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest mt-1 block">Click to view details</span>
                                                                )}
                                                            </div>
                                                            {isClickable && (
                                                                <svg className="w-3 h-3 text-gray-300 group-hover:text-[var(--primary)] group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                                                </svg>
                                                            )}
                                                        </div>
                                                        <p className="text-[10px] text-gray-600 mt-1 uppercase tracking-widest font-bold">
                                                            {getRelativeTime(act.createdAt)}
                                                            {act.adminId && <span className="ml-2 text-[9px] text-[var(--primary)]">• By {act.adminId.name}</span>}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="py-20 text-center">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">No activities recorded yet.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white border border-gray-100 p-8 shadow-sm h-full flex flex-col">
                                <h3 className="font-bold text-sm uppercase tracking-[0.2em] mb-10 italic text-gray-800 pb-4 border-b border-gray-50 flex justify-between items-center">
                                    Quick Links
                                    <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                </h3>
                                <div className="grid grid-cols-1 gap-4 flex-1">
                                    {[
                                        { tab: "products", label: "Product Catalog", sub: "Update shop items", icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" },
                                        { tab: "inventory", label: "Inventory Control", sub: "Manage stock levels", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
                                        { tab: "payments", label: "Order Management", sub: "Approve & track orders", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2" },
                                        { tab: "inquiries", label: "Consultation Hub", sub: "Respond to leads", icon: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" },
                                        { tab: "staff", label: "Staff Control", sub: "Manage admin team", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944" }
                                    ].map((link, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => {
                                                setActiveTab(link.tab);
                                                window.scrollTo({ top: 0, behavior: "smooth" });
                                            }}
                                            className="w-full text-left p-4 bg-gray-50/50 border border-gray-100 hover:bg-white hover:border-[var(--primary)]/30 hover:shadow-md transition-all group flex items-start gap-4"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-gray-100 group-hover:bg-[var(--primary)] group-hover:text-white transition-colors">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={link.icon} /></svg>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-900">{link.label}</p>
                                                <p className="text-[9px] text-gray-500 mt-0.5 group-hover:text-gray-900 transition-colors uppercase tracking-tight">{link.sub}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Other Tabs */}
                <div className="admin-content-area text-gray-900">
                    {activeTab === "products" && <ProductsTab />}
                    {activeTab === "inventory" && <InventoryTab />}
                    {activeTab === "inquiries" && <InquiriesTab />}
                    {activeTab === "users" && <UsersTab />}
                    {activeTab === "payments" && <PaymentsTab />}
                    {activeTab === "staff" && <StaffTab />}
                    {activeTab === "consultation" && <ConsultationTab />}
                    {activeTab === "newsletter" && <NewsletterTab />}
                    {activeTab === "settings" && <SettingsTab />}
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
