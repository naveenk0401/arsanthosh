"use client";

import { useState } from "react";

export default function AdminLoginForm() {
    const [formData, setFormData] = useState({ email: "", password: "", adminToken: "" });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Admin Login data:", formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Admin Email</label>
                <input
                    type="email"
                    required
                    className="w-full px-4 py-3 bg-[#222222] border border-gray-700 text-white outline-none focus:border-[var(--accent)] transition-colors"
                    placeholder="admin@arsanthosh.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Password</label>
                <input
                    type="password"
                    required
                    className="w-full px-4 py-3 bg-[#222222] border border-gray-700 text-white outline-none focus:border-[var(--accent)] transition-colors"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Security Token</label>
                <input
                    type="text"
                    required
                    className="w-full px-4 py-3 bg-[#222222] border border-gray-700 text-white outline-none focus:border-[var(--accent)] transition-colors"
                    placeholder="XXXX-XXXX-XXXX"
                    value={formData.adminToken}
                    onChange={(e) => setFormData({ ...formData, adminToken: e.target.value })}
                />
            </div>

            <button className="w-full bg-[var(--accent)] text-white py-4 font-bold hover:bg-opacity-90 transition-all uppercase tracking-widest text-sm">
                Access System
            </button>
        </form>
    );
}
