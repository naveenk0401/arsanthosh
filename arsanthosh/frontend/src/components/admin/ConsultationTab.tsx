"use client";

import { useEffect, useState } from "react";
import { api } from "@/utils/api";

export default function ConsultationTab() {
    const [consultations, setConsultations] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchConsultations();
    }, []);

    const fetchConsultations = async () => {
        setIsLoading(true);
        const response = await api.get("/inquiries");
        if (response.success) {
            const allInquiries = response.data as any[];
            setConsultations(allInquiries.filter(i => i.serviceType === "Consultation" || i.message?.toLowerCase().includes("consult")));
        }
        setIsLoading(false);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center bg-white p-6 border border-gray-100 shadow-sm">
                <div>
                    <h2 className="font-bold text-lg font-display uppercase italic tracking-tight text-gray-900 leading-tight">Consultation Hub</h2>
                    <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-1">Specialized consultation requests and bookings</p>
                </div>
                <button onClick={fetchConsultations} className="px-6 py-2 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-[var(--primary)] transition-colors shadow-sm">
                    Sync Consultations
                </button>
            </div>

            <div className="bg-white border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-50">
                                <th className="px-8 py-5 text-[9px] uppercase font-black text-gray-600 tracking-[0.2em]">Requester</th>
                                <th className="px-8 py-5 text-[9px] uppercase font-black text-gray-600 tracking-[0.2em]">Contact Details</th>
                                <th className="px-8 py-5 text-[9px] uppercase font-black text-gray-600 tracking-[0.2em]">Requirement</th>
                                <th className="px-8 py-5 text-[9px] uppercase font-black text-gray-600 tracking-[0.2em]">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                <tr><td colSpan={4} className="p-20 text-center text-gray-400 font-bold uppercase tracking-widest text-[10px]">Filtering Consultation Leads...</td></tr>
                            ) : consultations.length === 0 ? (
                                <tr><td colSpan={4} className="p-20 text-center text-gray-400 font-bold uppercase tracking-widest text-[10px]">No Consultation Requests Found</td></tr>
                            ) : consultations.map((c, i) => (
                                <tr key={i} className="hover:bg-gray-50/30 transition-colors">
                                    <td className="px-8 py-6">
                                        <p className="font-bold text-sm text-gray-900">{c.name}</p>
                                        <p className="text-[9px] text-gray-500 font-bold uppercase mt-1">{new Date(c.createdAt).toLocaleDateString()}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-xs font-bold text-gray-900">{c.email}</p>
                                        <p className="text-[9px] text-gray-500 uppercase font-bold tracking-tighter mt-1">{c.phone}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-xs text-gray-700 line-clamp-2 italic">"{c.message}"</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-2 py-1 text-[8px] font-black uppercase tracking-widest border ${c.status === "New" ? "bg-blue-50 text-blue-600 border-blue-100" :
                                                c.status === "Contacted" ? "bg-yellow-50 text-yellow-600 border-yellow-100" :
                                                    "bg-gray-50 text-gray-600 border-gray-100"
                                            }`}>
                                            {c.status}
                                        </span>
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
