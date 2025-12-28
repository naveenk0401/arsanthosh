"use client";

import { useEffect, useState } from "react";
import { api } from "@/utils/api";

export default function UsersTab() {
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setIsLoading(true);
        const response = await api.get("/admin/users");
        if (response.success) {
            setUsers(response.data as any[]);
        }
        setIsLoading(false);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center bg-white p-6 border border-gray-100 shadow-sm">
                <div>
                    <h2 className="font-bold text-lg font-display uppercase italic tracking-tight text-gray-900 leading-tight">User Management</h2>
                    <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-1">Directory of registered customer accounts</p>
                </div>
                <button onClick={fetchUsers} className="px-6 py-2 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-[var(--primary)] transition-colors shadow-sm">
                    Sync Users
                </button>
            </div>

            <div className="bg-white border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-50">
                                <th className="px-8 py-5 text-[9px] uppercase font-black text-gray-600 tracking-[0.2em]">Identity</th>
                                <th className="px-8 py-5 text-[9px] uppercase font-black text-gray-600 tracking-[0.2em]">Contact</th>
                                <th className="px-8 py-5 text-[9px] uppercase font-black text-gray-600 tracking-[0.2em]">Joined Date</th>
                                <th className="px-8 py-5 text-[9px] uppercase font-black text-gray-600 tracking-[0.2em]">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                <tr><td colSpan={4} className="p-20 text-center text-gray-400 font-bold uppercase tracking-widest text-[10px]">Loading User Records...</td></tr>
                            ) : users.length === 0 ? (
                                <tr><td colSpan={4} className="p-20 text-center text-gray-400 font-bold uppercase tracking-widest text-[10px]">No Registered Users Found</td></tr>
                            ) : users.map((u, i) => (
                                <tr key={i} className="hover:bg-gray-50/30 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-sm bg-gray-50 border border-gray-100 flex items-center justify-center font-bold text-xs text-[var(--primary)] shadow-inner uppercase italic">{u.name[0]}</div>
                                            <p className="font-bold text-sm text-gray-900">{u.name}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-xs font-bold text-gray-900">{u.email}</p>
                                        <p className="text-[9px] text-gray-500 uppercase font-bold tracking-tighter mt-1">{u.phone}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-xs font-bold text-gray-600">{new Date(u.createdAt).toLocaleDateString()}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-1.5 h-1.5 rounded-full ${u.isVerified ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-gray-300'}`} />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">
                                                {u.isVerified ? 'VERIFIED' : 'PENDING'}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
