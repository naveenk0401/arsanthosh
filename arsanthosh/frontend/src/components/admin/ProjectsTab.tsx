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
        features: "", // Comma separated
        budgetDetails: "",
        timeline: "",
        materials: "", // Comma separated
        whyChooseUs: "",
        process: "", // Newline separated steps
        clientName: "",
        clientRole: "",
        clientComment: "",
        clientRating: 5
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

        // Validate Images
        const imageArray = formData.images.split(",").map(url => url.trim()).filter(url => url);
        if (imageArray.length < 4 || imageArray.length > 10) {
            alert("Please provide between 4 and 10 images.");
            return;
        }

        // Parse Process Steps
        const processSteps = formData.process.split("\n").filter(step => step.trim()).map((step, index) => ({
            title: `Phase ${index + 1}`,
            description: step.trim()
        }));

        // Format data for backend
        const payload = {
            ...formData,
            images: imageArray,
            features: formData.features.split(",").map(f => f.trim()).filter(f => f),
            materials: formData.materials.split(",").map(m => m.trim()).filter(m => m),
            process: processSteps,
            clientTestimonial: {
                name: formData.clientName,
                role: formData.clientRole,
                comment: formData.clientComment,
                rating: Number(formData.clientRating)
            }
        };

        const response = await api.post("/projects", payload);
        if (response.success) {
            alert("Project created successfully!");
            setIsCreating(false);
            setFormData({
                title: "", category: "Residential Architecture", description: "",
                location: "", status: "Completed", images: "", features: "",
                budgetDetails: "", timeline: "", materials: "", whyChooseUs: "",
                process: "", clientName: "", clientRole: "", clientComment: "", clientRating: 5
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
                            {/* Left Column: Core Info */}
                            <div className="space-y-8">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--primary)] pb-4 border-b border-gray-50">Core Identity</h3>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Project Title</label>
                                    <input type="text" required className="w-full px-5 py-4 bg-gray-50 border border-gray-100 outline-none text-sm focus:border-[var(--primary)] text-gray-900" 
                                    value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Modern Villa" />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Category</label>
                                        <select className="w-full px-5 py-4 bg-gray-50 border border-gray-100 outline-none text-sm focus:border-[var(--primary)] text-gray-900" 
                                        value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                                            <option>Residential Architecture</option>
                                            <option>Commercial Architecture</option>
                                            <option>Interior Design</option>
                                            <option>Landscape Design</option>
                                            <option>Renovation</option>
                                        </select>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Status</label>
                                        <select className="w-full px-5 py-4 bg-gray-50 border border-gray-100 outline-none text-sm focus:border-[var(--primary)] text-gray-900" 
                                        value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                                            <option>Completed</option>
                                            <option>In Progress</option>
                                            <option>Planning</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Location</label>
                                    <input type="text" className="w-full px-5 py-4 bg-gray-50 border border-gray-100 outline-none text-sm focus:border-[var(--primary)] text-gray-900" 
                                    value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} placeholder="City, State" />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                     <div className="space-y-4">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Budget Details</label>
                                        <input type="text" className="w-full px-5 py-4 bg-gray-50 border border-gray-100 outline-none text-sm focus:border-[var(--primary)] text-gray-900" 
                                        value={formData.budgetDetails} onChange={e => setFormData({ ...formData, budgetDetails: e.target.value })} placeholder="e.g. ₹50 Lakhs" />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Timeline</label>
                                        <input type="text" className="w-full px-5 py-4 bg-gray-50 border border-gray-100 outline-none text-sm focus:border-[var(--primary)] text-gray-900" 
                                        value={formData.timeline} onChange={e => setFormData({ ...formData, timeline: e.target.value })} placeholder="e.g. 8 Months" />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Why Choose Us?</label>
                                    <textarea rows={3} className="w-full px-5 py-4 bg-gray-50 border border-gray-100 outline-none text-sm focus:border-[var(--primary)] text-gray-900" 
                                    value={formData.whyChooseUs} onChange={e => setFormData({ ...formData, whyChooseUs: e.target.value })} placeholder="Unique selling point..." />
                                </div>
                            </div>

                            {/* Right Column: Details & Assets */}
                            <div className="space-y-8">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--primary)] pb-4 border-b border-gray-50">Deep Details</h3>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Image URLs (4-10 Required)</label>
                                    <textarea rows={3} className="w-full px-5 py-4 bg-gray-50 border border-gray-100 outline-none text-sm focus:border-[var(--primary)] text-gray-900" 
                                    value={formData.images} onChange={e => setFormData({ ...formData, images: e.target.value })} placeholder="url1, url2, url3..." />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Work Process (One step per line)</label>
                                    <textarea rows={4} className="w-full px-5 py-4 bg-gray-50 border border-gray-100 outline-none text-sm focus:border-[var(--primary)] text-gray-900" 
                                    value={formData.process} onChange={e => setFormData({ ...formData, process: e.target.value })} placeholder="Phase 1: Concept...&#10;Phase 2: Design..." />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Materials Used (CSV)</label>
                                    <input type="text" className="w-full px-5 py-4 bg-gray-50 border border-gray-100 outline-none text-sm focus:border-[var(--primary)] text-gray-900" 
                                    value={formData.materials} onChange={e => setFormData({ ...formData, materials: e.target.value })} placeholder="Teak, Marble, Glass..." />
                                </div>
                                
                                <div className="p-6 bg-gray-50 border border-gray-100 space-y-4">
                                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Client Testimonial</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input type="text" placeholder="Client Name" className="p-3 border text-xs" value={formData.clientName} onChange={e => setFormData({...formData, clientName: e.target.value})} />
                                        <input type="text" placeholder="Role (e.g. Owner)" className="p-3 border text-xs" value={formData.clientRole} onChange={e => setFormData({...formData, clientRole: e.target.value})} />
                                    </div>
                                    <textarea placeholder="Client Comment" rows={2} className="w-full p-3 border text-xs" value={formData.clientComment} onChange={e => setFormData({...formData, clientComment: e.target.value})} />
                                    <div className="flex items-center gap-2">
                                        <label className="text-[10px] font-bold">Rating:</label>
                                        <input type="number" min="1" max="5" className="p-2 border w-16 text-xs" value={formData.clientRating} onChange={e => setFormData({...formData, clientRating: Number(e.target.value)})} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Full Description</label>
                            <textarea rows={4} required className="w-full px-5 py-4 bg-gray-50 border border-gray-100 outline-none text-sm focus:border-[var(--primary)] text-gray-900" 
                            value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Detailed project story..." />
                        </div>

                        <button type="submit" className="w-full bg-gray-900 text-white py-5 font-black uppercase tracking-[0.3em] text-xs hover:bg-[var(--primary)] transition-all shadow-xl">
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
