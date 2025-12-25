"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { api } from "@/utils/api";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
    const { user, token, logout, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"overview" | "users">("overview");

    useEffect(() => {
        if (!authLoading && (!user || (user.role !== "admin" && user.role !== "super-admin"))) {
            router.push("/login");
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (activeTab === "users" && token) {
            fetchUsers();
        }
    }, [activeTab, token]);

    const fetchUsers = async () => {
        setIsLoading(true);
        const response = await api.get("/auth/users");
        if (response.success) {
            setUsers(response.data as any[]);
        }
        setIsLoading(false);
    };

    const handleApproveAdmin = async (userId: string) => {
        const response = await api.patch(`/auth/approve-admin/${userId}`, {});
        if (response.success) {
            fetchUsers();
            alert("Admin approved successfully!");
        } else {
            alert(response.error?.message || "Failed to approve admin");
        }
    };

    if (authLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!user) return null;

    return (
        <main className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <div className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 font-display">Studio Management</h1>
                        <p className="text-gray-500 mt-2">Welcome back, <span className="text-[var(--primary)] font-bold">{user.name}</span> ({user.role})</p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={logout}
                            className="px-6 py-2 bg-white border border-gray-200 font-bold text-xs hover:bg-black hover:text-white transition-all uppercase tracking-widest"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 mb-8 gap-8">
                    <button
                        onClick={() => setActiveTab("overview")}
                        className={`pb-4 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === "overview" ? "border-b-2 border-[var(--primary)] text-[var(--primary)]" : "text-gray-400 hover:text-gray-600"}`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab("users")}
                        className={`pb-4 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === "users" ? "border-b-2 border-[var(--primary)] text-[var(--primary)]" : "text-gray-400 hover:text-gray-600"}`}
                    >
                        User Management
                    </button>
                    <button className="pb-4 text-xs font-bold uppercase tracking-widest text-gray-300 cursor-not-allowed">Orders</button>
                    <button className="pb-4 text-xs font-bold uppercase tracking-widest text-gray-300 cursor-not-allowed">Inventory</button>
                </div>

                {activeTab === "overview" && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                            {[
                                { label: "Total Orders", value: "124", color: "bg-blue-500" },
                                { label: "Products", value: "48", color: "bg-green-500" },
                                { label: "Services", value: "6", color: "bg-purple-500" },
                                { label: "Active Users", value: users.length || "...", color: "bg-orange-500" }
                            ].map((stat, i) => (
                                <div key={i} className="bg-white p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">{stat.label}</p>
                                    <p className="text-3xl font-bold font-display">{stat.value}</p>
                                </div>
                            ))}
                        </div>

                        <div className="bg-white border border-gray-100 shadow-sm rounded-sm overflow-hidden">
                            <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                                <h2 className="font-bold text-lg font-display">System Status</h2>
                                <span className="flex items-center gap-2 text-xs font-bold text-green-600 uppercase tracking-widest">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                    Live Environment
                                </span>
                            </div>
                            <div className="p-12 text-center">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                </div>
                                <h3 className="text-xl font-bold mb-2 font-display">Source Architecture Sync</h3>
                                <p className="text-gray-500 max-w-md mx-auto text-sm leading-relaxed mb-8">
                                    The studio management modules are now connected. You can manage users and monitor system stability. Orders and inventory modules are undergoing final validation.
                                </p>
                                <div className="flex justify-center gap-6">
                                    <button onClick={() => setActiveTab("users")} className="text-xs font-bold uppercase tracking-widest text-[var(--accent)] hover:underline">Manage Users</button>
                                    <Link href="/store" className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors">View Storefront</Link>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {activeTab === "users" && (
                    <div className="bg-white border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-8 py-6 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
                            <h2 className="font-bold text-lg font-display">Registered Users</h2>
                            <button onClick={fetchUsers} className="text-xs font-bold text-[var(--primary)] uppercase tracking-widest hover:underline">Refresh List</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        <th className="px-8 py-4 text-[10px] uppercase font-bold text-gray-500 tracking-wider">User Details</th>
                                        <th className="px-8 py-4 text-[10px] uppercase font-bold text-gray-500 tracking-wider">Role</th>
                                        <th className="px-8 py-4 text-[10px] uppercase font-bold text-gray-500 tracking-wider">Status</th>
                                        <th className="px-8 py-4 text-[10px] uppercase font-bold text-gray-500 tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {isLoading ? (
                                        <tr><td colSpan={4} className="p-12 text-center text-gray-400 text-sm">Loading users...</td></tr>
                                    ) : users.length === 0 ? (
                                        <tr><td colSpan={4} className="p-12 text-center text-gray-400 text-sm">No users found.</td></tr>
                                    ) : (
                                        users.map((u) => (
                                            <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-8 py-4">
                                                    <p className="font-bold text-sm">{u.name}</p>
                                                    <p className="text-xs text-gray-400">{u.email}</p>
                                                </td>
                                                <td className="px-8 py-4">
                                                    <span className={`px-2 py-1 text-[9px] font-bold uppercase tracking-widest rounded-sm ${u.role === "super-admin" ? "bg-purple-100 text-purple-700" :
                                                            u.role === "admin" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"
                                                        }`}>
                                                        {u.role}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`w-1.5 h-1.5 rounded-full ${u.isVerified ? "bg-green-500" : "bg-red-400"}`} />
                                                        <span className="text-xs font-medium text-gray-600">{u.isVerified ? "Verified" : "Unverified"}</span>
                                                        {u.role === "admin" && (
                                                            <span className={`ml-2 px-2 py-0.5 text-[8px] font-bold uppercase rounded-full ${u.isApproved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                                                                {u.isApproved ? "Approved" : "Pending Approval"}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-4 text-right">
                                                    {u.role === "admin" && !u.isApproved && user.role === "super-admin" && (
                                                        <button
                                                            onClick={() => handleApproveAdmin(u.id)}
                                                            className="text-[10px] font-bold text-white bg-green-600 px-3 py-1 hover:bg-green-700 transition-colors uppercase tracking-widest"
                                                        >
                                                            Approve
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </main>
    );
}
