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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 border border-gray-100 shadow-sm">
                <div>
                    <h2 className="font-bold text-lg font-display uppercase italic tracking-tight text-gray-900 leading-tight">Product Inventory</h2>
                    <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-1">Manage architectural hardware & stock</p>
                </div>
                <button
                    onClick={() => isCreating ? resetForm() : setIsCreating(true)}
                    className={`w-full sm:w-auto px-6 py-2 font-bold text-[10px] uppercase tracking-[0.2em] border transition-all ${isCreating ? "bg-red-50 border-red-100 text-red-600 hover:bg-red-600 hover:text-white" : "bg-[var(--primary)] border-[var(--primary)] text-white hover:bg-white hover:text-[var(--primary)]"}`}
                >
                    {isCreating ? "Discard Changes" : "Create New Listing"}
                </button>
            </div>

            {/* Editor */}
            {isCreating && (
                <div className="bg-white border border-gray-100 p-6 sm:p-10 animate-in slide-in-from-top-4 duration-500 shadow-lg">
                    <form onSubmit={handleSubmit} className="space-y-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                            {/* Left Column: Basic Info */}
                            <div className="space-y-8">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--primary)] pb-4 border-b border-gray-50">Core Specifications</h3>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Product Name</label>
                                    <input
                                        type="text" required
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 outline-none text-sm focus:border-[var(--primary)] transition-all text-gray-900"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g. Minimalist Brass Pull Handle"
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
                                            <option>Hardware</option>
                                            <option>Fittings</option>
                                            <option>Security</option>
                                            <option>Kitchen</option>
                                            <option>Decor</option>
                                        </select>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-600">List Status</label>
                                        <select
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-100 outline-none text-sm focus:border-[var(--primary)] text-gray-900"
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
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Retail Price (INR)</label>
                                        <input
                                            type="number" required
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-100 outline-none text-sm focus:border-[var(--primary)] text-gray-900"
                                            value={formData.price}
                                            onChange={e => setFormData({ ...formData, price: e.target.value })}
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Inventory Level</label>
                                        <input
                                            type="number" required
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-100 outline-none text-sm focus:border-[var(--primary)] text-gray-900"
                                            value={formData.stock}
                                            onChange={e => setFormData({ ...formData, stock: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Media */}
                            <div className="space-y-8">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--primary)] pb-4 border-b border-gray-50">Asset Management</h3>

                                <FileUpload
                                    label="Product Visuals (Images)"
                                    maxFiles={10 - formData.images.length}
                                    maxSize={50 * 1024 * 1024} // 50MB
                                    onUploadComplete={(urls) => setFormData(prev => ({ ...prev, images: [...prev.images, ...urls] }))}
                                />

                                <FileUpload
                                    label="Product Demos (Videos)"
                                    accept="video/*"
                                    maxFiles={1 - formData.videos.length} // Max 1 video total
                                    maxSize={50 * 1024 * 1024} // 50MB
                                    onUploadComplete={(urls) => setFormData(prev => ({ ...prev, videos: [...prev.videos, ...urls] }))}
                                />

                                {/* Preview Grid */}
                                {(formData.images.length > 0 || formData.videos.length > 0) && (
                                    <div className="grid grid-cols-4 gap-2 border border-gray-100 p-2 bg-gray-50 shadow-inner">
                                        {formData.images.map((url, i) => (
                                            <div key={i} className="relative aspect-square group shadow-sm border border-gray-200">
                                                <img src={url} className="w-full h-full object-cover" alt="Preview" />
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
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Technical Description</label>
                            <textarea
                                rows={3} required
                                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 outline-none text-sm focus:border-[var(--primary)] text-gray-900"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Describe craftsmanship, material, and utility..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Key Features (Comma Separated)</label>
                                <textarea
                                    rows={3}
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 outline-none text-sm focus:border-[var(--primary)] text-gray-900"
                                    value={formData.features}
                                    onChange={e => setFormData({ ...formData, features: e.target.value })}
                                    placeholder="e.g. Solid Brass, Hand-polished, Saltwater Resistant"
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Why Choose Us (Comma Separated)</label>
                                <textarea
                                    rows={3}
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 outline-none text-sm focus:border-[var(--primary)] text-gray-900"
                                    value={formData.whyChoose}
                                    onChange={e => setFormData({ ...formData, whyChoose: e.target.value })}
                                    placeholder="e.g. Lifetime Warranty, Architectural Grade, Sustainable Sourcing"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gray-900 text-white py-5 font-black uppercase tracking-[0.3em] text-xs hover:bg-[var(--primary)] transition-all shadow-xl"
                        >
                            {editingId ? "Save Inventory Changes" : "Authorize Production & Publish"}
                        </button>
                    </form>
                </div>
            )}

            {/* Catalog List */}
            <div className="bg-white border border-gray-100 overflow-hidden shadow-sm">
                <div className="px-8 py-6 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
                    <h3 className="font-bold text-sm uppercase tracking-[0.2em] italic text-gray-900">Current Catalog</h3>
                    <div className="flex gap-4">
                        <button onClick={fetchProducts} className="text-[9px] font-bold text-gray-600 uppercase tracking-widest hover:text-[var(--primary)] transition-colors">Refresh Data</button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-50">
                                <th className="px-8 py-5 text-[9px] uppercase font-black text-gray-600 tracking-[0.2em]">Asset / Identity</th>
                                <th className="px-8 py-5 text-[9px] uppercase font-black text-gray-600 tracking-[0.2em]">Stock Status</th>
                                <th className="px-8 py-5 text-[9px] uppercase font-black text-gray-600 tracking-[0.2em]">Price Point</th>
                                <th className="px-8 py-5 text-[9px] uppercase font-black text-gray-600 tracking-[0.2em]">Market Status</th>
                                <th className="px-8 py-5 text-[9px] uppercase font-black text-gray-600 tracking-[0.2em] text-right">Commands</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                <tr><td colSpan={5} className="p-20 text-center text-gray-600 text-[10px] font-bold uppercase tracking-widest animate-pulse">Syncing Inventory...</td></tr>
                            ) : products.length === 0 ? (
                                <tr><td colSpan={5} className="p-20 text-center text-gray-600 text-[10px] font-bold uppercase tracking-widest">No Products in Registry.</td></tr>
                            ) : (
                                products.map((p) => (
                                    <tr key={p._id} className="hover:bg-gray-50/30 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-6">
                                                <div className="relative w-14 h-14 bg-gray-50 border border-gray-100 overflow-hidden">
                                                    {p.images && p.images[0] ? (
                                                        <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover transition-all" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-[8px] text-gray-300">VOID</div>
                                                    )}
                                                    {p.isFeatured && <div className="absolute top-0 right-0 w-3 h-3 bg-[var(--primary)] shadow-sm" />}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm text-gray-900 tracking-tight">{p.name}</p>
                                                    <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest mt-1.5">{p.category}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-1.5 h-1.5 rounded-full ${p.stock > 10 ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : p.stock > 0 ? 'bg-orange-400' : 'bg-red-500'}`} />
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${p.stock === 0 ? 'text-red-500' : 'text-gray-500'}`}>
                                                    {p.stock === 0 ? 'Out of Stock' : `${p.stock} Units`}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-sm font-bold text-gray-900 tabular-nums">₹{p.price.toLocaleString()}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-2 py-1 text-[8px] font-black uppercase tracking-[0.2em] rounded-[2px] border ${p.status === 'published' ? 'bg-green-50 border-green-100 text-green-600' : 'bg-yellow-50 border-yellow-100 text-yellow-600'}`}>
                                                {p.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex justify-end gap-6">
                                                <button onClick={() => handleEdit(p)} className="text-[10px] font-bold text-gray-600 hover:text-[var(--primary)] uppercase tracking-widest transition-colors">Edit</button>
                                                <button onClick={() => handleDelete(p._id)} className="text-[10px] font-bold text-red-300 hover:text-red-500 uppercase tracking-widest transition-colors">Archive</button>
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
