"use client";

import { useEffect, useState } from "react";
import { api } from "@/utils/api";

export default function InquiriesTab() {
    const [inquiries, setInquiries] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchInquiries();
    }, []);

    const fetchInquiries = async () => {
        setIsLoading(true);
        const response = await api.get("/inquiries");
        if (response.success) {
            const allInquiries = response.data as any[];
            setInquiries(allInquiries.filter(i => i.serviceType !== "Consultation" && !i.message?.toLowerCase().includes("consult")));
        }
        setIsLoading(false);
    };

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        const response = await api.patch(`/inquiries/${id}`, { status: newStatus });
        if (response.success) {
            setInquiries(prev => prev.map(i => i._id === id ? { ...i, status: newStatus } : i));
        } else {
            alert("Failed to update status");
        }
    };

    return (
        <div className="bg-white border border-gray-100 shadow-sm animate-in fade-in duration-500">
            <div className="px-5 sm:px-8 py-6 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center gap-4">
                <h2 className="font-bold text-lg font-display uppercase italic tracking-tight text-gray-900 leading-tight">Consultation Inquiries</h2>
                <button onClick={fetchInquiries} className="text-[10px] font-bold text-[var(--primary)] uppercase tracking-widest hover:underline shrink-0">Refresh Feed</button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-50">
                            <th className="px-8 py-5 text-[9px] uppercase font-black text-gray-600 tracking-[0.2em]">Received On</th>
                            <th className="px-8 py-5 text-[9px] uppercase font-black text-gray-600 tracking-[0.2em]">Prospect Details</th>
                            <th className="px-8 py-5 text-[9px] uppercase font-black text-gray-600 tracking-[0.2em]">Requested Service</th>
                            <th className="px-8 py-5 text-[9px] uppercase font-black text-gray-600 tracking-[0.2em]">Operational Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {isLoading ? (
                            <tr><td colSpan={4} className="p-20 text-center text-gray-600 text-[10px] font-bold uppercase tracking-widest animate-pulse">Syncing Inquiries...</td></tr>
                        ) : inquiries.length === 0 ? (
                            <tr><td colSpan={4} className="p-20 text-center text-gray-600 text-[10px] font-bold uppercase tracking-widest">Inquiry Pipeline Empty.</td></tr>
                        ) : (
                            inquiries.map((inq) => (
                                <tr key={inq._id} className="hover:bg-gray-50/30 transition-colors group">
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <p className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">{new Date(inq.createdAt).toLocaleDateString()}</p>
                                        <p className="text-[9px] text-gray-600 font-bold uppercase tracking-tighter mt-1">{new Date(inq.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="font-bold text-sm text-gray-900 tracking-tight">{inq.name}</p>
                                        <div className="flex gap-4 mt-1.5">
                                            <p className="text-[10px] text-[var(--primary)] font-black">{inq.email}</p>
                                            {inq.phone && <p className="text-[10px] text-gray-500 font-bold">{inq.phone}</p>}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="px-3 py-1 bg-gray-50 border border-gray-100 text-[9px] font-black uppercase tracking-widest text-gray-700 rounded-sm">
                                            {inq.serviceType}
                                        </span>
                                        <p className="mt-2 text-[11px] text-gray-600 max-w-xs line-clamp-1 italic font-bold" title={inq.message}>"{inq.message}"</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <select
                                            value={inq.status}
                                            onChange={(e) => handleStatusUpdate(inq._id, e.target.value)}
                                            className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-2 border rounded-sm cursor-pointer outline-none transition-all shadow-sm ${inq.status === 'New' ? 'bg-blue-50 border-blue-100 text-blue-600' :
                                                inq.status === 'Contacted' ? 'bg-yellow-50 border-yellow-100 text-yellow-600' :
                                                    inq.status === 'Closed' ? 'bg-green-50 border-green-100 text-green-600' :
                                                        'bg-gray-50 border-gray-100 text-gray-600'
                                                }`}
                                        >
                                            <option value="New">Pipeline: New</option>
                                            <option value="Contacted">Active: Contacted</option>
                                            <option value="Closed">Archived: Closed</option>
                                        </select>
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
