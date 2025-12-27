"use client";

import { useEffect, useState } from "react";
import { api } from "@/utils/api";
import CustomDatePicker from "../common/CustomDatePicker";

export default function StaffTab() {
    const [staff, setStaff] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRegistering, setIsRegistering] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        dob: "",
        idProofType: "adhar",
        idProofNumber: "",
        password: ""
    });
    const [message, setMessage] = useState({ type: "", text: "" });

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        setIsLoading(true);
        const response = await api.get("/auth/staff/directory");
        if (response.success) {
            setStaff(response.data as any[]);
        }
        setIsLoading(false);
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage({ type: "info", text: "Processing Registration..." });
        const response = await api.post("/auth/staff/create", formData);
        if (response.success) {
            setMessage({ type: "success", text: "Admin created and credentials sent!" });
            setFormData({ name: "", email: "", phone: "", dob: "", idProofType: "adhar", idProofNumber: "", password: "" });
            setIsRegistering(false);
            fetchStaff();
        } else {
            const errorMsg = (response.error && typeof response.error === 'object') ? (response.error as any).message : response.error;
            setMessage({ type: "error", text: errorMsg || "Failed to create staff" });
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header & Toggle */}
            <div className="flex justify-between items-center bg-white p-6 border border-gray-100 shadow-sm">
                <div>
                    <h2 className="font-bold text-lg font-display uppercase italic tracking-tight text-gray-900 leading-tight">Staff Management</h2>
                    <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-1">Manage administrative personnel & security</p>
                </div>
                <button
                    onClick={() => setIsRegistering(!isRegistering)}
                    className="px-6 py-2 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-[var(--primary)] transition-colors shadow-sm"
                >
                    {isRegistering ? "Close Form" : "Register New Admin"}
                </button>
            </div>

            {/* Registration Form */}
            {isRegistering && (
                <div className="bg-white border border-gray-100 p-8 shadow-sm animate-in slide-in-from-top duration-300">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-8 pb-4 border-b border-gray-100">Official Registration Portal</h3>
                    {message.text && (
                        <div className={`p-4 mb-8 text-[10px] font-bold uppercase tracking-widest border ${message.type === 'success' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                            {message.text}
                        </div>
                    )}
                    <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Full Name</label>
                            <input required type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-100 focus:border-[var(--primary)] outline-none text-sm font-bold transition-all" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Email Address</label>
                            <input required type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-100 focus:border-[var(--primary)] outline-none text-sm font-bold transition-all" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Mobile Number</label>
                            <input required type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-100 focus:border-[var(--primary)] outline-none text-sm font-bold transition-all" />
                        </div>
                        <div className="space-y-2">
                            <CustomDatePicker
                                label="Date of Birth"
                                value={formData.dob}
                                onChange={(val) => setFormData({ ...formData, dob: val })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">ID Proof Type</label>
                            <select value={formData.idProofType} onChange={(e) => setFormData({ ...formData, idProofType: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-100 focus:border-[var(--primary)] outline-none text-sm font-bold transition-all uppercase">
                                <option value="adhar">Adhaar Card</option>
                                <option value="pan">PAN Card</option>
                                <option value="10th mark sheet">10th Mark Sheet</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">ID Proof Number</label>
                            <input required type="text" value={formData.idProofNumber} onChange={(e) => setFormData({ ...formData, idProofNumber: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-100 focus:border-[var(--primary)] outline-none text-sm font-bold transition-all" />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Temporary Password</label>
                            <input required type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-100 focus:border-[var(--primary)] outline-none text-sm font-bold transition-all" />
                        </div>
                        <div className="md:col-span-2 pt-4">
                            <button type="submit" className="w-full py-4 bg-[var(--primary)] text-white text-xs font-black uppercase tracking-[0.2em] shadow-md hover:bg-gray-900 transition-all italic">Confirm & Authorize Staff Account</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Directory Table */}
            <div className="bg-white border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
                    <h3 className="font-bold text-[10px] uppercase tracking-[0.2em] italic text-gray-900">Personnel Directory</h3>
                    <button onClick={fetchStaff} className="text-[9px] font-bold text-[var(--primary)] uppercase tracking-widest hover:underline">Sync Active List</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-50">
                                <th className="px-8 py-5 text-[9px] uppercase font-black text-gray-600 tracking-[0.2em]">Full Identity</th>
                                <th className="px-8 py-5 text-[9px] uppercase font-black text-gray-600 tracking-[0.2em]">Credentials</th>
                                <th className="px-8 py-5 text-[9px] uppercase font-black text-gray-600 tracking-[0.2em]">Verification Type</th>
                                <th className="px-8 py-5 text-[9px] uppercase font-black text-gray-600 tracking-[0.2em]">Security Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                <tr><td colSpan={4} className="p-20 text-center text-gray-400 font-bold uppercase tracking-widest text-[10px]">Accessing Secure Records...</td></tr>
                            ) : staff.map((s, i) => (
                                <tr key={i} className="hover:bg-gray-50/30 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-sm bg-gray-50 border border-gray-100 flex items-center justify-center font-bold text-xs text-[var(--primary)] shadow-inner uppercase italic">{s.name[0]}</div>
                                            <div>
                                                <p className="font-bold text-sm text-gray-900">{s.name}</p>
                                                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-tight">{s.role}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-xs font-bold text-gray-900">{s.email}</p>
                                        <p className="text-[9px] text-gray-500 uppercase font-bold tracking-tighter mt-1">{s.phone}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="space-y-1">
                                            <span className="px-2 py-1 bg-blue-50 text-blue-600 text-[8px] font-black uppercase tracking-widest border border-blue-100">
                                                {s.idProofType || "SYSTEM"}
                                            </span>
                                            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1">ID: {s.idProofNumber || "N/A"}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-1.5 h-1.5 rounded-full ${!s.isFirstLogin ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-orange-500'}`} />
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${!s.isFirstLogin ? 'text-gray-900' : 'text-orange-500 italic'}`}>
                                                {!s.isFirstLogin ? 'ACTIVE' : 'ONBOARDING'}
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
