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
        <div className="space-y-8">
            {/* Header / Actions */}
            <div className="flex justify-between items-center bg-white p-6 border border-gray-100 shadow-sm rounded-sm">
                <div>
                    <h2 className="font-bold text-lg font-display">Projects</h2>
                    <p className="text-xs text-gray-400 mt-1">Manage your portfolio items</p>
                </div>
                <button
                    onClick={() => setIsCreating(!isCreating)}
                    className={`px-4 py-2 font-bold text-xs uppercase tracking-widest border transition-all ${isCreating ? "bg-red-500 border-red-500 text-white hover:bg-red-600" : "bg-[var(--primary)] border-[var(--primary)] text-white hover:bg-black hover:border-black"}`}
                >
                    {isCreating ? "Cancel" : "Add New Project"}
                </button>
            </div>

            {/* Create Form */}
            {isCreating && (
                <div className="bg-white p-8 border border-gray-100 shadow-md rounded-sm animate-in slide-in-from-top-4 duration-300">
                    <h3 className="font-bold text-sm uppercase tracking-widest text-gray-400 mb-6">New Project Details</h3>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Project Title</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 outline-none text-sm focus:border-black"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g. Modern Villa in Coimbatore"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Category</label>
                                <select
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 outline-none text-sm focus:border-black"
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
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Location</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 outline-none text-sm focus:border-black"
                                    value={formData.location}
                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                    placeholder="City, State"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Project Status</label>
                                <select
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 outline-none text-sm focus:border-black"
                                    value={formData.status}
                                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option>Completed</option>
                                    <option>Ongoing</option>
                                    <option>Upcoming</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Description</label>
                            <textarea
                                rows={4}
                                required
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 outline-none text-sm focus:border-black"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Describe the project..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Image URLs (Comma Separated)</label>
                            <textarea
                                rows={2}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 outline-none text-sm focus:border-black font-mono text-xs"
                                value={formData.images}
                                onChange={e => setFormData({ ...formData, images: e.target.value })}
                                placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                            />
                            <p className="text-[10px] text-gray-400">Paste direct image links here. For now, use an external image host.</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Key Features (Comma Separated)</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 outline-none text-sm focus:border-black"
                                value={formData.features}
                                onChange={e => setFormData({ ...formData, features: e.target.value })}
                                placeholder="e.g. Sustainable Materials, Smart Home, 3000 sqft"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-black text-white py-4 font-bold uppercase tracking-widest text-xs hover:bg-gray-800 transition-colors"
                        >
                            Create Project
                        </button>
                    </form>
                </div>
            )}

            {/* List */}
            <div className="bg-white border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
                    <h2 className="font-bold text-lg font-display">All Projects</h2>
                    <button onClick={fetchProjects} className="text-xs font-bold text-[var(--primary)] uppercase tracking-widest hover:underline">Refresh List</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-6 py-4 text-[10px] uppercase font-bold text-gray-500 tracking-wider">Project</th>
                                <th className="px-6 py-4 text-[10px] uppercase font-bold text-gray-500 tracking-wider">Category</th>
                                <th className="px-6 py-4 text-[10px] uppercase font-bold text-gray-500 tracking-wider">Status</th>
                                <th className="px-6 py-4 text-[10px] uppercase font-bold text-gray-500 tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                <tr><td colSpan={4} className="p-12 text-center text-gray-400 text-sm">Loading projects...</td></tr>
                            ) : projects.length === 0 ? (
                                <tr><td colSpan={4} className="p-12 text-center text-gray-400 text-sm">No projects found.</td></tr>
                            ) : (
                                projects.map((p) => (
                                    <tr key={p._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                {p.images && p.images[0] ? (
                                                    <img src={p.images[0]} alt={p.title} className="w-12 h-12 object-cover bg-gray-100" />
                                                ) : (
                                                    <div className="w-12 h-12 bg-gray-100 flex items-center justify-center text-[10px] text-gray-400">No Img</div>
                                                )}
                                                <div>
                                                    <p className="font-bold text-sm text-gray-900">{p.title}</p>
                                                    <p className="text-xs text-gray-400">{p.location || "No location"}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-xs font-medium text-gray-600">
                                            {p.category}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-[9px] font-bold uppercase tracking-widest rounded-sm ${p.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                                    p.status === 'Ongoing' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                {p.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDelete(p._id)}
                                                className="text-[10px] font-bold text-red-500 hover:text-red-700 uppercase tracking-widest"
                                            >
                                                Delete
                                            </button>
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
