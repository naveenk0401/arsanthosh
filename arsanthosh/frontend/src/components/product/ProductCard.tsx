"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Product {
    _id: string;
    id?: string;
    name: string;
    price: number;
    category: string;
    images: string[];
}

export default function StoreFeatured() {
    const [featuredItems, setFeaturedItems] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products?isFeatured=true&limit=4`);
                const result = await response.json();
                if (result.status === "success") {
                    setFeaturedItems(result.data);
                }
            } catch (error) {
                console.error("Failed to fetch featured products:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFeaturedProducts();
    }, []);

    if (isLoading) return null; // Or a skeleton loader
    if (featuredItems.length === 0) return null;

    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-[10px] md:text-sm uppercase tracking-widest text-[var(--accent)] font-bold mb-2">Premium Hardware</h2>
                    <h3 className="text-3xl md:text-4xl font-bold">Featured Store Items</h3>
                    <div className="w-16 md:w-20 h-1 bg-[var(--accent)] mx-auto mt-4" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {featuredItems.map((item) => (
                        <Link href={`/store/${item._id}`} key={item._id} className="group">
                            <div className="relative aspect-square bg-gray-50 overflow-hidden mb-4 rounded-sm">
                                <img
                                    src={item.images[0] || "/placeholder.png"}
                                    alt={item.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute top-4 left-4 bg-white px-2 py-1 text-[9px] font-bold uppercase tracking-widest shadow-sm">
                                    {item.category}
                                </div>
                            </div>
                            <h4 className="font-bold text-base md:text-lg group-hover:text-[var(--accent)] transition-colors">{item.name}</h4>
                            <p className="text-[var(--accent)] font-bold text-sm md:text-base">Rs. {Number(item.price).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        </Link>
                    ))}
                </div>

                <div className="mt-12 md:mt-16 text-center">
                    <Link href="/store" className="bg-[var(--primary)] text-white px-8 md:px-10 py-3.5 md:py-4 font-bold hover:bg-black transition-colors uppercase tracking-widest text-xs md:text-sm inline-block">
                        Shop the Collection
                    </Link>
                </div>
            </div>
        </section>
    );
}
