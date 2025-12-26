"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { api } from "@/utils/api";

export default function AdminLoginForm() {
    const [formData, setFormData] = useState({ email: "", password: "", adminToken: "" });
    const { login } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        // Note: adminToken is passed to help identify role on login if needed, 
        // though backend usually handles this via email/role check.
        const response = await api.post("/auth/login", {
            email: formData.email,
            password: formData.password
        });

        if (response.success) {
            const data = response.data as any;
            login(data.user, data.token);
            router.push("/admin");
        } else {
            setError(response.error?.message || "Invalid credentials");
            setIsLoading(false);
        }
    };

    return (
        <>
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 mb-6 text-[10px] font-bold uppercase tracking-widest text-center">
                    {error}
                </div>
            )}

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
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Security Token (Optional)</label>
                    <input
                        type="text"
                        className="w-full px-4 py-3 bg-[#222222] border border-gray-700 text-white outline-none focus:border-[var(--accent)] transition-colors"
                        placeholder="XXXX-XXXX-XXXX"
                        value={formData.adminToken}
                        onChange={(e) => setFormData({ ...formData, adminToken: e.target.value })}
                    />
                </div>

                <button
                    disabled={isLoading}
                    className="w-full bg-[var(--accent)] text-white py-4 font-bold hover:bg-opacity-90 transition-all uppercase tracking-widest text-sm disabled:opacity-50"
                >
                    {isLoading ? "Verifying..." : "Access System"}
                </button>
            </form>
        </>
    );
}
