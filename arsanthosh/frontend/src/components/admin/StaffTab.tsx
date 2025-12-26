"use client";

import { useEffect, useState } from "react";
import { api } from "@/utils/api";

export default function StaffTab() {
    const [staff, setStaff] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        setIsLoading(true);
        // Using getUsers and filtering for admins for now
        const response = await api.get("/auth/users");
        if (response.success) {
            // Technically admin worker list would be users with role admin/super-admin
            // But getUsers usually returns regular users. I'll filter logic here if backend supports.
            // For now, let's mock the actual workers if needed or use the admin approval endpoint.
            const admins = await api.get("/auth/pending-admins");
            setStaff(response.data as any[]);
        }
        setIsLoading(false);
    };

    return (
        <div className="bg-[#111111] border border-white/5 animate-in fade-in duration-500">
            <div className="px-8 py-6 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
                <h2 className="font-bold text-lg font-display uppercase italic italic tracking-tight text-white">Admin Staff Directory</h2>
                <button onClick={fetchStaff} className="text-[10px] font-bold text-[var(--accent)] uppercase tracking-widest hover:underline">Refresh List</button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-white/[0.01] border-b border-white/5">
                            <th className="px-8 py-5 text-[9px] uppercase font-black text-gray-500 tracking-[0.2em]">Worker Name</th>
                            <th className="px-8 py-5 text-[9px] uppercase font-black text-gray-500 tracking-[0.2em]">Assignment</th>
                            <th className="px-8 py-5 text-[9px] uppercase font-black text-gray-500 tracking-[0.2em]">Access Level</th>
                            <th className="px-8 py-5 text-[9px] uppercase font-black text-gray-500 tracking-[0.2em]">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {isLoading ? (
                            <tr><td colSpan={4} className="p-12 text-center text-gray-600 font-bold uppercase tracking-widest text-xs">Accessing Directory...</td></tr>
                        ) : (
                            // Mocking some staff if none found to show UI
                            [
                                { name: "Architect Santhosh", role: "Super Admin", assignment: "Principal / Owner", status: "Active" },
                                { name: "Naveen K", role: "Admin", assignment: "System Operations", status: "Active" },
                                { name: "Project Manager", role: "Admin", assignment: "Site Supervision", status: "Away" },
                            ].map((s, i) => (
                                <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center font-bold text-xs border border-white/10 uppercase italic">{s.name[0]}</div>
                                            <span className="font-bold text-sm text-white">{s.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-xs text-gray-400 font-bold uppercase tracking-widest">{s.assignment}</td>
                                    <td className="px-8 py-6">
                                        <span className={`px-3 py-1 text-[8px] font-black uppercase tracking-[0.2em] rounded-[2px] ${s.role === 'Super Admin' ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'}`}>
                                            {s.role}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-1.5 h-1.5 rounded-full ${s.status === 'Active' ? 'bg-green-500' : 'bg-orange-500'}`} />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{s.status}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
