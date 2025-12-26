"use client";

import { useEffect, useState } from "react";
import { api } from "@/utils/api";

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
        images: "", // Comma separated URLs
        videos: "", // Comma separated URLs
        features: "", // Comma separated
        whyChoose: "" // Comma separated
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setIsLoading(true);
        // Admin needs to see all products, including drafts
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
            images: (product.images || []).join(", "),
            videos: (product.videos || []).join(", "),
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
            images: "", videos: "", features: "", whyChoose: ""
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Format data for backend
        const payload = {
            ...formData,
            price: Number(formData.price),
            stock: Number(formData.stock),
            images: formData.images.split(",").map(url => url.trim()).filter(url => url),
            videos: formData.videos.split(",").map(url => url.trim()).filter(url => url),
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
            alert(editingId ? "Product updated successfully!" : "Product created successfully!");
            resetForm();
            fetchProducts();
        } else {
            alert(response.error?.message || "Failed to save product");
        }
    };

    const toggleFeatured = async (product: any) => {
        const response = await api.patch(`/products/${product._id}`, {
            isFeatured: !product.isFeatured
        });
        if (response.success) {
            fetchProducts();
        }
    };

    return (
        <div className="space-y-8">
            {/* Header / Actions */}
            <div className="flex justify-between items-center bg-white p-6 border border-gray-100 shadow-sm rounded-sm">
                <div>
                    <h2 className="font-bold text-lg font-display">Store Products</h2>
                    <p className="text-xs text-gray-400 mt-1">Manage your shop inventory and listings</p>
                </div>
                <button
                    onClick={() => isCreating ? resetForm() : setIsCreating(true)}
                    className={`px-4 py-2 font-bold text-xs uppercase tracking-widest border transition-all ${isCreating ? "bg-red-500 border-red-500 text-white hover:bg-red-600" : "bg-black border-black text-white hover:bg-[var(--accent)] hover:border-[var(--accent)]"}`}
                >
                    {isCreating ? "Cancel" : "Add New Product"}
                </button>
            </div>

            {/* Create/Edit Form */}
            {isCreating && (
                <div className="bg-white p-8 border border-gray-100 shadow-md rounded-sm animate-in slide-in-from-top-4 duration-300">
                    <h3 className="font-bold text-sm uppercase tracking-widest text-gray-400 mb-6">{editingId ? "Edit Product" : "New Product Details"}</h3>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Product Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 outline-none text-sm focus:border-black transition-all"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. Premium Brass Handle"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Category</label>
                                <select
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 outline-none text-sm focus:border-black cursor-pointer"
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
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Price (INR)</label>
                                <input
                                    type="number"
                                    required
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 outline-none text-sm focus:border-black"
                                    value={formData.price}
                                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Stock Count</label>
                                <input
                                    type="number"
                                    required
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 outline-none text-sm focus:border-black"
                                    value={formData.stock}
                                    onChange={e => setFormData({ ...formData, stock: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Publish Status</label>
                                <select
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 outline-none text-sm focus:border-black"
                                    value={formData.status}
                                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option value="draft">Draft (Hidden)</option>
                                    <option value="published">Published (Visible)</option>
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
                                placeholder="Write a detailed description..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Image URLs (Comma Separated)</label>
                                <textarea
                                    rows={2}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 outline-none text-sm focus:border-black font-mono text-xs"
                                    value={formData.images}
                                    onChange={e => setFormData({ ...formData, images: e.target.value })}
                                    placeholder="https://url1.jpg, https://url2.jpg"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Video URLs (Optional)</label>
                                <textarea
                                    rows={2}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 outline-none text-sm focus:border-black font-mono text-xs"
                                    value={formData.videos}
                                    onChange={e => setFormData({ ...formData, videos: e.target.value })}
                                    placeholder="Youtube or raw video link"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Key Features (Comma Separated)</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 outline-none text-sm focus:border-black"
                                    value={formData.features}
                                    onChange={e => setFormData({ ...formData, features: e.target.value })}
                                    placeholder="e.g. Rust-free, Easy installation"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Why Choose Us? (Comma Separated)</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 outline-none text-sm focus:border-black"
                                    value={formData.whyChoose}
                                    onChange={e => setFormData({ ...formData, whyChoose: e.target.value })}
                                    placeholder="e.g. 5-year warranty, Premium finish"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-sm">
                            <input
                                type="checkbox"
                                id="isFeatured"
                                className="w-4 h-4 border-gray-300 rounded text-black focus:ring-black"
                                checked={formData.isFeatured}
                                onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })}
                            />
                            <label htmlFor="isFeatured" className="text-xs font-bold uppercase tracking-widest cursor-pointer select-none">Feature this product on homepage</label>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-black text-white py-4 font-bold uppercase tracking-widest text-xs hover:bg-[var(--accent)] transition-all flex items-center justify-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                            {editingId ? "Update Product" : "Publish Product"}
                        </button>
                    </form>
                </div>
            )}

            {/* List */}
            <div className="bg-white border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
                    <h2 className="font-bold text-lg font-display">Inventory Collection</h2>
                    <button onClick={fetchProducts} className="text-xs font-bold text-[var(--primary)] uppercase tracking-widest hover:underline">Refresh List</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-6 py-4 text-[10px] uppercase font-bold text-gray-500 tracking-wider">Product</th>
                                <th className="px-6 py-4 text-[10px] uppercase font-bold text-gray-500 tracking-wider">Inventory</th>
                                <th className="px-6 py-4 text-[10px] uppercase font-bold text-gray-500 tracking-wider">Price</th>
                                <th className="px-6 py-4 text-[10px] uppercase font-bold text-gray-500 tracking-wider">Status</th>
                                <th className="px-6 py-4 text-[10px] uppercase font-bold text-gray-500 tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                <tr><td colSpan={5} className="p-12 text-center text-gray-400 text-sm">Loading products...</td></tr>
                            ) : products.length === 0 ? (
                                <tr><td colSpan={5} className="p-12 text-center text-gray-400 text-sm">No products in catalog.</td></tr>
                            ) : (
                                products.map((p) => (
                                    <tr key={p._id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="relative">
                                                    {p.images && p.images[0] ? (
                                                        <img src={p.images[0]} alt={p.name} className="w-12 h-12 object-cover bg-gray-50 border border-gray-100 rounded-sm" />
                                                    ) : (
                                                        <div className="w-12 h-12 bg-gray-50 flex items-center justify-center text-[10px] text-gray-400 border border-dashed rounded-sm">NONE</div>
                                                    )}
                                                    {p.isFeatured && (
                                                        <span className="absolute -top-2 -right-2 bg-yellow-400 text-white p-1 rounded-full shadow-sm">
                                                            <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                                        </span>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm text-gray-900 leading-tight">{p.name}</p>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{p.category}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className={`w-2 h-2 rounded-full ${p.stock > 10 ? 'bg-green-500' : p.stock > 0 ? 'bg-orange-500' : 'bg-red-500'}`} />
                                                <span className={`text-xs font-bold ${p.stock === 0 ? 'text-red-500' : 'text-gray-700'}`}>{p.stock} In Stock</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-bold text-gray-900">₹{p.price.toLocaleString()}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-[9px] font-bold uppercase tracking-widest rounded-sm ${p.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                {p.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleEdit(p)}
                                                    className="text-[10px] font-bold text-blue-600 hover:underline uppercase tracking-widest"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(p._id)}
                                                    className="text-[10px] font-bold text-red-500 hover:underline uppercase tracking-widest"
                                                >
                                                    Delete
                                                </button>
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
