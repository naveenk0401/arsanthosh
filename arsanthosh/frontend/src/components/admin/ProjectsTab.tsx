"use client";

import { useEffect, useState } from "react";
import { api } from "@/utils/api";

export default function ProjectsTab() {
    const [projects, setProjects] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: "",
        category: "Residential Architecture",
        description: "",
        location: "",
        status: "Completed",
        images: "", // Comma separated URLs
        features: "" // Comma separated
    });

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        setIsLoading(true);
        const response = await api.get("/projects");
        if (response.success) {
            setProjects(response.data as any[]);
        }
        setIsLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this project?")) return;

        const response = await api.delete(`/projects/${id}`);
        if (response.success) {
            setProjects(prev => prev.filter(p => p._id !== id));
        } else {
            alert("Failed to delete project");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Format data for backend
        const payload = {
            ...formData,
            images: formData.images.split(",").map(url => url.trim()).filter(url => url),
            features: formData.features.split(",").map(f => f.trim()).filter(f => f)
        };

        const response = await api.post("/projects", payload);
        if (response.success) {
            alert("Project created successfully!");
            setIsCreating(false);
            setFormData({
                title: "", category: "Residential Architecture", description: "",
                location: "", status: "Completed", images: "", features: ""
            });
            fetchProjects();
        } else {
            alert(response.error?.message || "Failed to create project");
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 border border-gray-100 shadow-sm">
                <div>
                    <h2 className="font-bold text-lg font-display uppercase italic tracking-tight text-gray-900 leading-tight">Portfolio Inventory</h2>
                    <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-1">Manage architectural projects & site data</p>
                </div>
                <button
                    onClick={() => setIsCreating(!isCreating)}
                    className={`w-full sm:w-auto px-6 py-2 font-bold text-[10px] uppercase tracking-[0.2em] border transition-all ${isCreating ? "bg-red-50 border-red-100 text-red-600 hover:bg-red-600 hover:text-white" : "bg-[var(--primary)] border-[var(--primary)] text-white hover:bg-white hover:text-[var(--primary)]"}`}
                >
                    {isCreating ? "Discard Changes" : "Create New Portfolio Entry"}
                </button>
            </div>

            {/* Editor */}
            {isCreating && (
                <div className="bg-white border border-gray-100 p-6 sm:p-10 animate-in slide-in-from-top-4 duration-500 shadow-lg">
                    <form onSubmit={handleSubmit} className="space-y-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                            {/* Left Column: Basic Info */}
                            <div className="space-y-8">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--primary)] pb-4 border-b border-gray-50">Core Identity</h3>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Project Title</label>
                                    <input
                                        type="text" required
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 outline-none text-sm focus:border-[var(--primary)] transition-all text-gray-900"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="e.g. Modern Villa in Coimbatore"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Category</label>
                                        <select
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-100 outline-none text-sm focus:border-[var(--primary)] text-gray-900"
                                            value={formData.category}
                                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        >
                                            <option>Residential Architecture</option>
                                            <option>Commercial Architecture</option>
                                            <option>Interior Design</option>
                                            <option>Landscape Design</option>
                                            <option>Renovation</option>
                                        </select>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Status</label>
                                        <select
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-100 outline-none text-sm focus:border-[var(--primary)] text-gray-900"
                                            value={formData.status}
                                            onChange={e => setFormData({ ...formData, status: e.target.value })}
                                        >
                                            <option>Completed</option>
                                            <option>In Progress</option>
                                            <option>Planning</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Site Location</label>
                                    <input
                                        type="text"
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 outline-none text-sm focus:border-[var(--primary)] text-gray-900"
                                        value={formData.location}
                                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                                        placeholder="City, State"
                                    />
                                </div>
                            </div>

                            {/* Right Column: Assets */}
                            <div className="space-y-8">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--primary)] pb-4 border-b border-gray-50">Media & Features</h3>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Featured Images (CSV URLs)</label>
                                    <textarea
                                        rows={3}
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 outline-none text-sm focus:border-[var(--primary)] text-gray-900"
                                        value={formData.images}
                                        onChange={e => setFormData({ ...formData, images: e.target.value })}
                                        placeholder="url1, url2, url3..."
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Key Features (CSV)</label>
                                    <input
                                        type="text"
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 outline-none text-sm focus:border-[var(--primary)] text-gray-900"
                                        value={formData.features}
                                        onChange={e => setFormData({ ...formData, features: e.target.value })}
                                        placeholder="Vaulted Ceilings, Sustainable Wood, Open Plan..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Design Statement / Description</label>
                            <textarea
                                rows={4} required
                                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 outline-none text-sm focus:border-[var(--primary)] text-gray-900"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Describe the architectural vision and execution..."
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gray-900 text-white py-5 font-black uppercase tracking-[0.3em] text-xs hover:bg-[var(--primary)] transition-all shadow-xl"
                        >
                            Authorize & Add To Portfolio
                        </button>
                    </form>
                </div>
            )}

            {/* Portfolio Grid */}
            <div className="bg-white border border-gray-100 overflow-hidden shadow-sm">
                <div className="px-8 py-6 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
                    <h3 className="font-bold text-sm uppercase tracking-[0.2em] italic text-gray-900">Project Registry</h3>
                    <button onClick={fetchProjects} className="text-[9px] font-bold text-gray-600 uppercase tracking-widest hover:text-[var(--primary)] transition-colors">Refresh Registry</button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-50">
                                <th className="px-8 py-5 text-[9px] uppercase font-black text-gray-600 tracking-[0.2em]">Project Identity</th>
                                <th className="px-8 py-5 text-[9px] uppercase font-black text-gray-600 tracking-[0.2em]">Typology</th>
                                <th className="px-8 py-5 text-[9px] uppercase font-black text-gray-600 tracking-[0.2em]">Location</th>
                                <th className="px-8 py-5 text-[9px] uppercase font-black text-gray-600 tracking-[0.2em]">Lifecycle</th>
                                <th className="px-8 py-5 text-[9px] uppercase font-black text-gray-600 tracking-[0.2em] text-right">Commands</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                <tr><td colSpan={5} className="p-20 text-center text-gray-600 text-[10px] font-bold uppercase tracking-widest animate-pulse">Scanning Archive...</td></tr>
                            ) : projects.length === 0 ? (
                                <tr><td colSpan={5} className="p-20 text-center text-gray-600 text-[10px] font-bold uppercase tracking-widest">No Projects Found.</td></tr>
                            ) : (
                                projects.map((p) => (
                                    <tr key={p._id} className="hover:bg-gray-50/30 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-6">
                                                <div className="w-14 h-14 bg-gray-50 border border-gray-100 overflow-hidden shadow-inner">
                                                    {p.images && p.images[0] ? (
                                                        <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-[8px] text-gray-300">N/A</div>
                                                    )}
                                                </div>
                                                <span className="font-bold text-sm text-gray-900 tracking-tight">{p.title}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{p.category}</span>
                                        </td>
                                        <td className="px-8 py-6 text-sm text-gray-600 italic">{p.location}</td>
                                        <td className="px-8 py-6">
                                            <span className={`px-2 py-1 text-[8px] font-black uppercase tracking-[0.2em] rounded-[2px] border ${p.status === 'Completed' ? 'bg-green-50 border-green-100 text-green-600' : 'bg-yellow-50 border-yellow-100 text-yellow-600'}`}>
                                                {p.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button onClick={() => handleDelete(p._id)} className="text-[10px] font-bold text-red-300 hover:text-red-500 uppercase tracking-widest transition-colors">Archive</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
