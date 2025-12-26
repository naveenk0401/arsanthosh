"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface AdminSidebarProps {
    activeTab: string;
    setActiveTab: (tab: any) => void;
}

export default function AdminSidebar({ activeTab, setActiveTab }: AdminSidebarProps) {
    const { logout, user } = useAuth();

    const menuItems = [
        { id: "overview", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
        { id: "products", label: "Products", icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" },
        { id: "inventory", label: "Inventory", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
        { id: "inquiries", label: "Consultations", icon: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" },
        { id: "users", label: "User Management", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
        { id: "payments", label: "Payments", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
        { id: "staff", label: "Admin Staff", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
    ];

    return (
        <aside className="w-64 bg-black text-white h-screen sticky top-0 flex flex-col border-r border-white/10 overflow-y-auto scrollbar-hide">
            <div className="p-8">
                <Link href="/" className="group flex items-center gap-3">
                    <div className="w-8 h-8 bg-[var(--accent)] flex items-center justify-center font-bold text-white text-lg rounded-sm group-hover:rotate-12 transition-transform">A</div>
                    <span className="font-bold text-lg tracking-tighter uppercase font-display italic">ARS Admin</span>
                </Link>
            </div>

            <nav className="flex-1 mt-4">
                <p className="px-8 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-4">Main Menu</p>
                <div className="space-y-1">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-4 px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === item.id
                                ? "bg-[var(--accent)] text-white shadow-lg"
                                : "text-gray-400 hover:text-white hover:bg-white/5"}`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                            </svg>
                            {item.label}
                        </button>
                    ))}
                </div>
            </nav>

            <div className="p-8 border-t border-white/10">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center font-bold text-sm">
                        {user?.name?.[0] || "A"}
                    </div>
                    <div>
                        <p className="text-xs font-bold truncate w-32">{user?.name}</p>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Super Admin</p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="w-full py-3 bg-white/5 border border-white/10 font-bold text-[10px] uppercase tracking-widest hover:bg-red-500 hover:border-red-500 transition-all"
                >
                    Sign Out
                </button>
            </div>
        </aside>
    );
}
