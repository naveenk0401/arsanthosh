"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../context/CartContext";
import { products } from "../../data/products";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import Link from "next/link";

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const product = products.find(p => p.id === resolvedParams.id);
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();
    const router = useRouter();

    if (!product) {
        return (
            <main className="min-h-screen bg-[var(--bg)] flex flex-col">
                <Header />
                <div className="flex-1 flex flex-col items-center justify-center p-6">
                    <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
                    <Link href="/store" className="text-[var(--accent)] font-bold uppercase text-xs hover:underline">Return to Store</Link>
                </div>
                <Footer />
            </main>
        );
    }

    const handleAddToCart = () => {
        addToCart(product, quantity);
    };

    const handleBuyNow = () => {
        addToCart(product, quantity);
        router.push("/checkout/payment");
    };

    return (
        <main className="min-h-screen bg-[var(--bg)]">
            <Header />

            <div className="max-w-7xl mx-auto px-6 py-12 md:py-24">
                <div className="flex flex-col md:flex-row gap-12 lg:gap-24">
                    {/* Left Side: Image */}
                    <div className="flex-1">
                        <div className="aspect-square bg-white rounded-sm overflow-hidden shadow-2xl sticky top-32">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Right Side: Details */}
                    <div className="flex-1 flex flex-col">
                        <nav className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-8">
                            <Link href="/store" className="hover:text-black">Store</Link>
                            <span>/</span>
                            <span className="text-[var(--accent)]">{product.category}</span>
                        </nav>

                        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">{product.name}</h1>
                        <p className="text-2xl font-bold text-[var(--accent)] mb-8">{product.price}</p>

                        <div className="space-y-6 mb-12">
                            <p className="text-gray-500 leading-relaxed text-sm md:text-base">
                                {product.longDesc || product.desc}
                            </p>

                            {product.specs && (
                                <div className="grid grid-cols-2 gap-y-4 pt-8 border-t border-gray-100">
                                    {Object.entries(product.specs).map(([label, value]) => (
                                        <div key={label}>
                                            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">{label}</p>
                                            <p className="text-sm font-medium">{value}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="mt-auto space-y-6">
                            <div className="flex items-center gap-6">
                                <p className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Quantity</p>
                                <div className="flex items-center border border-gray-200">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-12 h-12 flex items-center justify-center hover:bg-gray-50 transition-colors"
                                    >
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" /></svg>
                                    </button>
                                    <span className="w-12 text-center font-bold text-sm">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-12 h-12 flex items-center justify-center hover:bg-gray-50 transition-colors"
                                    >
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={handleAddToCart}
                                    className="flex-1 bg-white border-2 border-black text-black py-4 font-bold uppercase tracking-widest text-xs hover:bg-black hover:text-white transition-all shadow-lg flex items-center justify-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                    Add to Cart
                                </button>
                                <button
                                    onClick={handleBuyNow}
                                    className="flex-1 bg-black text-white py-4 font-bold uppercase tracking-widest text-xs hover:bg-[var(--accent)] transition-all shadow-lg"
                                >
                                    Buy Now
                                </button>
                            </div>
                        </div>

                        <div className="mt-12 py-8 border-t border-gray-100 flex items-center gap-8">
                            <div className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Secure Payment</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Hassle-free Returns</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
