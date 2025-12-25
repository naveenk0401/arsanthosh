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
            setInquiries(response.data as any[]);
        }
        setIsLoading(false);
    };

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        const response = await api.patch(`/inquiries/${id}/status`, { status: newStatus });
        if (response.success) {
            setInquiries(prev => prev.map(i => i._id === id ? { ...i, status: newStatus } : i));
        } else {
            alert("Failed to update status");
        }
    };

    return (
        <div className="bg-white border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
                <h2 className="font-bold text-lg font-display">Inquiries</h2>
                <button onClick={fetchInquiries} className="text-xs font-bold text-[var(--primary)] uppercase tracking-widest hover:underline">Refresh</button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="px-6 py-4 text-[10px] uppercase font-bold text-gray-500 tracking-wider">Date</th>
                            <th className="px-6 py-4 text-[10px] uppercase font-bold text-gray-500 tracking-wider">Client</th>
                            <th className="px-6 py-4 text-[10px] uppercase font-bold text-gray-500 tracking-wider">Service</th>
                            <th className="px-6 py-4 text-[10px] uppercase font-bold text-gray-500 tracking-wider">Message</th>
                            <th className="px-6 py-4 text-[10px] uppercase font-bold text-gray-500 tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {isLoading ? (
                            <tr><td colSpan={5} className="p-12 text-center text-gray-400 text-sm">Loading inquiries...</td></tr>
                        ) : inquiries.length === 0 ? (
                            <tr><td colSpan={5} className="p-12 text-center text-gray-400 text-sm">No inquiries found.</td></tr>
                        ) : (
                            inquiries.map((inq) => (
                                <tr key={inq._id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 text-xs text-gray-500 whitespace-nowrap">
                                        {new Date(inq.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-sm text-gray-900">{inq.name}</p>
                                        <p className="text-xs text-gray-400">{inq.email}</p>
                                        {inq.phone && <p className="text-xs text-gray-400">{inq.phone}</p>}
                                    </td>
                                    <td className="px-6 py-4 text-xs font-medium text-gray-700">
                                        {inq.serviceType}
                                    </td>
                                    <td className="px-6 py-4 text-xs text-gray-600 max-w-xs truncate" title={inq.message}>
                                        {inq.message}
                                    </td>
                                    <td className="px-6 py-4">
                                        <select
                                            value={inq.status}
                                            onChange={(e) => handleStatusUpdate(inq._id, e.target.value)}
                                            className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 border-none rounded-sm cursor-pointer outline-none focus:ring-1 focus:ring-offset-1 focus:ring-black/10 ${inq.status === 'New' ? 'bg-blue-100 text-blue-700' :
                                                    inq.status === 'Contacted' ? 'bg-yellow-100 text-yellow-700' :
                                                        inq.status === 'Closed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                                }`}
                                        >
                                            <option value="New">New</option>
                                            <option value="Contacted">Contacted</option>
                                            <option value="Closed">Closed</option>
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
