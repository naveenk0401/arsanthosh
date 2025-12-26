"use client";

import { useEffect, useState } from "react";
import { api } from "@/utils/api";
import FileUpload from "./FileUpload";

export default function ProductsTab() {
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        category: "Hardware",
        description: "",
        price: "",
        stock: "0",
        status: "draft",
        isFeatured: false,
        images: [] as string[],
        videos: [] as string[],
        features: "", // Comma separated
        whyChoose: "" // Comma separated
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setIsLoading(true);
        const response = await api.get("/products?status=all");
        if (response.success) {
            setProducts(response.data as any[]);
        }
        setIsLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;

        const response = await api.delete(`/products/${id}`);
        if (response.success) {
            setProducts(prev => prev.filter(p => p._id !== id));
        } else {
            alert("Failed to delete product");
        }
    };

    const handleEdit = (product: any) => {
        setEditingId(product._id);
        setIsCreating(true);
        setFormData({
            name: product.name,
            category: product.category,
            description: product.description,
            price: product.price.toString(),
            stock: product.stock.toString(),
            status: product.status,
            isFeatured: product.isFeatured || false,
            images: product.images || [],
            videos: product.videos || [],
            features: (product.features || []).join(", "),
            whyChoose: (product.whyChoose || []).join(", ")
        });
    };

    const resetForm = () => {
        setIsCreating(false);
        setEditingId(null);
        setFormData({
            name: "", category: "Hardware", description: "",
            price: "", stock: "0", status: "draft", isFeatured: false,
            images: [], videos: [], features: "", whyChoose: ""
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            ...formData,
            price: Number(formData.price),
            stock: Number(formData.stock),
            features: formData.features.split(",").map(f => f.trim()).filter(f => f),
            whyChoose: formData.whyChoose.split(",").map(f => f.trim()).filter(f => f)
        };

        let response;
        if (editingId) {
            response = await api.patch(`/products/${editingId}`, payload);
        } else {
            response = await api.post("/products", payload);
        }

        if (response.success) {
            alert(editingId ? "Inventory Updated!" : "Product Published!");
            resetForm();
            fetchProducts();
        } else {
            alert(response.error?.message || "Operation failed");
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Action Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#111111] p-6 border border-white/5">
                <div>
                    <h2 className="font-bold text-lg font-display uppercase italic italic tracking-tight">Product Inventory</h2>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Manage architectural hardware & stock</p>
                </div>
                <button
                    onClick={() => isCreating ? resetForm() : setIsCreating(true)}
                    className={`px-6 py-2 font-bold text-[10px] uppercase tracking-[0.2em] border transition-all ${isCreating ? "bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white" : "bg-[var(--accent)] border-[var(--accent)] text-white hover:bg-black hover:border-white/20"}`}
                >
                    {isCreating ? "Discard Changes" : "Create New Listing"}
                </button>
            </div>

            {/* Editor */}
            {isCreating && (
                <div className="bg-[#111111] border border-white/5 p-10 animate-in slide-in-from-top-4 duration-500">
                    <form onSubmit={handleSubmit} className="space-y-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                            {/* Left Column: Basic Info */}
                            <div className="space-y-8">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--accent)] pb-4 border-b border-white/5">Core Specifications</h3>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Product Name</label>
                                    <input
                                        type="text" required
                                        className="w-full px-5 py-4 bg-white/5 border border-white/10 outline-none text-sm focus:border-[var(--accent)] transition-all"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g. Minimalist Brass Pull Handle"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Category</label>
                                        <select
                                            className="w-full px-5 py-4 bg-white/5 border border-white/10 outline-none text-sm focus:border-[var(--accent)]"
                                            value={formData.category}
                                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        >
                                            <option>Hardware</option>
                                            <option>Fittings</option>
                                            <option>Security</option>
                                            <option>Kitchen</option>
                                            <option>Decor</option>
                                        </select>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">List Status</label>
                                        <select
                                            className="w-full px-5 py-4 bg-white/5 border border-white/10 outline-none text-sm focus:border-[var(--accent)]"
                                            value={formData.status}
                                            onChange={e => setFormData({ ...formData, status: e.target.value })}
                                        >
                                            <option value="draft">Draft (Private)</option>
                                            <option value="published">Published (Public)</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Retail Price (INR)</label>
                                        <input
                                            type="number" required
                                            className="w-full px-5 py-4 bg-white/5 border border-white/10 outline-none text-sm focus:border-[var(--accent)]"
                                            value={formData.price}
                                            onChange={e => setFormData({ ...formData, price: e.target.value })}
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Inventory Level</label>
                                        <input
                                            type="number" required
                                            className="w-full px-5 py-4 bg-white/5 border border-white/10 outline-none text-sm focus:border-[var(--accent)]"
                                            value={formData.stock}
                                            onChange={e => setFormData({ ...formData, stock: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Media */}
                            <div className="space-y-8">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--accent)] pb-4 border-b border-white/5">Asset Management</h3>

                                <FileUpload
                                    label="Product Visuals (Images)"
                                    onUploadComplete={(urls) => setFormData(prev => ({ ...prev, images: [...prev.images, ...urls] }))}
                                />

                                <FileUpload
                                    label="Product Demos (Videos)"
                                    accept="video/*"
                                    onUploadComplete={(urls) => setFormData(prev => ({ ...prev, videos: [...prev.videos, ...urls] }))}
                                />

                                {/* Preview Grid */}
                                {(formData.images.length > 0 || formData.videos.length > 0) && (
                                    <div className="grid grid-cols-4 gap-2 border border-white/5 p-2 bg-white/[0.01]">
                                        {formData.images.map((url, i) => (
                                            <div key={i} className="relative aspect-square group">
                                                <img src={url} className="w-full h-full object-cover border border-white/10" alt="Preview" />
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData(prev => ({ ...prev, images: prev.images.filter((_, idx) => idx !== i) }))}
                                                    className="absolute inset-0 bg-red-600/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Technical Description</label>
                            <textarea
                                rows={4} required
                                className="w-full px-5 py-4 bg-white/5 border border-white/10 outline-none text-sm focus:border-[var(--accent)]"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Describe craftsmanship, material, and utility..."
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-white text-black py-5 font-black uppercase tracking-[0.3em] text-xs hover:bg-[var(--accent)] hover:text-white transition-all shadow-xl"
                        >
                            {editingId ? "Save Inventory Changes" : "Authorize Production & Publish"}
                        </button>
                    </form>
                </div>
            )}

            {/* Catalog List */}
            <div className="bg-[#111111] border border-white/5 overflow-hidden">
                <div className="px-8 py-6 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
                    <h3 className="font-bold text-sm uppercase tracking-[0.2em] italic">Current Catalog</h3>
                    <div className="flex gap-4">
                        <button onClick={fetchProducts} className="text-[9px] font-bold text-gray-500 uppercase tracking-widest hover:text-white transition-colors">Refresh Data</button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/[0.01] border-b border-white/5">
                                <th className="px-8 py-5 text-[9px] uppercase font-black text-gray-500 tracking-[0.2em]">Asset / Identity</th>
                                <th className="px-8 py-5 text-[9px] uppercase font-black text-gray-500 tracking-[0.2em]">Stock Status</th>
                                <th className="px-8 py-5 text-[9px] uppercase font-black text-gray-500 tracking-[0.2em]">Price Point</th>
                                <th className="px-8 py-5 text-[9px] uppercase font-black text-gray-500 tracking-[0.2em]">Market Status</th>
                                <th className="px-8 py-5 text-[9px] uppercase font-black text-gray-500 tracking-[0.2em] text-right">Commands</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {isLoading ? (
                                <tr><td colSpan={5} className="p-20 text-center text-gray-600 text-[10px] font-bold uppercase tracking-widest animate-pulse">Syncing Inventory...</td></tr>
                            ) : products.length === 0 ? (
                                <tr><td colSpan={5} className="p-20 text-center text-gray-600 text-[10px] font-bold uppercase tracking-widest">No Products in Registry.</td></tr>
                            ) : (
                                products.map((p) => (
                                    <tr key={p._id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-6">
                                                <div className="relative w-14 h-14 bg-white/5 border border-white/10">
                                                    {p.images && p.images[0] ? (
                                                        <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-[8px] text-gray-600">VOID</div>
                                                    )}
                                                    {p.isFeatured && <div className="absolute -top-1 -right-1 w-3 h-3 bg-[var(--accent)] rounded-full border-2 border-[#111111]" />}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm text-white tracking-tight">{p.name}</p>
                                                    <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mt-1.5">{p.category}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-1.5 h-1.5 rounded-full ${p.stock > 10 ? 'bg-green-500' : p.stock > 0 ? 'bg-orange-500' : 'bg-red-600'}`} />
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${p.stock === 0 ? 'text-red-500' : 'text-gray-400'}`}>
                                                    {p.stock === 0 ? 'Out of Stock' : `${p.stock} Units`}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-sm font-bold text-white tabular-nums">₹{p.price.toLocaleString()}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-3 py-1 text-[8px] font-black uppercase tracking-[0.2em] rounded-[2px] ${p.status === 'published' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                                {p.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex justify-end gap-6">
                                                <button onClick={() => handleEdit(p)} className="text-[10px] font-bold text-gray-400 hover:text-[var(--accent)] uppercase tracking-widest transition-colors">Edit</button>
                                                <button onClick={() => handleDelete(p._id)} className="text-[10px] font-bold text-red-600/50 hover:text-red-500 uppercase tracking-widest transition-colors">Archive</button>
                                            </div>
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
