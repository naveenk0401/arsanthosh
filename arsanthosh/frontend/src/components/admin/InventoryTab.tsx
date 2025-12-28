"use client";

import { useEffect, useState } from "react";
import { api } from "@/utils/api";

export default function InventoryTab() {
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

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

    const getStockLevelColor = (stock: number) => {
        if (stock <= 0) return "text-red-600 bg-red-50 border-red-100";
        if (stock < 5) return "text-orange-600 bg-orange-50 border-orange-100";
        return "text-green-600 bg-green-50 border-green-100";
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center bg-white p-6 border border-gray-100 shadow-sm">
                <div>
                    <h2 className="font-bold text-lg font-display uppercase italic tracking-tight text-gray-900 leading-tight">Inventory Control</h2>
                    <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-1">Real-time stock monitoring & logistics</p>
                </div>
                <button onClick={fetchProducts} className="px-6 py-2 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-[var(--primary)] transition-colors shadow-sm">
                    Sync Inventory
                </button>
            </div>

            <div className="bg-white border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-50">
                                <th className="px-8 py-5 text-[9px] uppercase font-black text-gray-600 tracking-[0.2em]">Live Product</th>
                                <th className="px-8 py-5 text-[9px] uppercase font-black text-gray-600 tracking-[0.2em]">Category</th>
                                <th className="px-8 py-5 text-[9px] uppercase font-black text-gray-600 tracking-[0.2em]">Pricing</th>
                                <th className="px-8 py-5 text-[9px] uppercase font-black text-gray-600 tracking-[0.2em]">Stock Levels</th>
                                <th className="px-8 py-5 text-[9px] uppercase font-black text-gray-600 tracking-[0.2em]">Quality Control</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                <tr><td colSpan={5} className="p-20 text-center text-gray-400 font-bold uppercase tracking-widest text-[10px]">Accessing Inventory Logs...</td></tr>
                            ) : products.length === 0 ? (
                                <tr><td colSpan={5} className="p-20 text-center text-gray-400 font-bold uppercase tracking-widest text-[10px]">No Products Found</td></tr>
                            ) : products.map((p, i) => (
                                <tr key={i} className="hover:bg-gray-50/30 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            {p.images?.[0] ? (
                                                <img src={p.images[0]} alt="" className="w-10 h-10 object-cover border border-gray-100 shadow-sm grayscale hover:grayscale-0 transition-all" />
                                            ) : (
                                                <div className="w-10 h-10 bg-gray-50 border border-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-400">N/A</div>
                                            )}
                                            <p className="font-bold text-sm text-gray-900">{p.name}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 uppercase font-bold text-gray-500 text-[10px] tracking-widest">
                                        {p.category}
                                    </td>
                                    <td className="px-8 py-6 font-bold text-sm text-gray-900 italic">
                                        ₹{p.price.toLocaleString()}
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black border ${getStockLevelColor(p.stock)}`}>
                                            {p.stock} UNITS
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="space-y-1">
                                            <p className="text-[8px] font-bold text-orange-500 uppercase tracking-widest flex justify-between">Damaged: <span>{p.damagedCount || 0}</span></p>
                                            <p className="text-[8px] font-bold text-blue-500 uppercase tracking-widest flex justify-between">Returned: <span>{p.returnedCount || 0}</span></p>
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
