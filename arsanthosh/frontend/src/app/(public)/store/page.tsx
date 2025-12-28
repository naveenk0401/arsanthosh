"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { api } from "@/utils/api";

const categories = ["All", "Doors", "Cupboards", "TV Units", "Pooja Units", "Plywoods", "Kitchen Baskets", "Chimney", "Door Handles", "Fevicol Gums"];
const ITEMS_PER_PAGE = 12;

export default function StorePage() {
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("featured"); // featured, price-low, price-high
    const [currentPage, setCurrentPage] = useState(1);

    const { setIsCartOpen } = useCart();
    const router = useRouter();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setIsLoading(true);
        const response: any = await api.get("/products?limit=100");
        if (response.success) {
            setProducts(response.data);
        }
        setIsLoading(false);
    };

    // Filtering & Sorting Logic
    const filteredProducts = (products.length > 0 ? products : [])
        .filter(p => activeFilter === "All" || p.category === activeFilter)
        .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .sort((a, b) => {
            if (sortBy === "price-low") return a.price - b.price;
            if (sortBy === "price-high") return b.price - a.price;
            return 0; // featured (default)
        });

    // Pagination Logic
    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <main className="min-h-screen bg-[var(--bg)]">
            <Navbar />

            <section className="py-20 md:py-32 bg-white">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-[10px] md:text-sm uppercase tracking-[0.3em] text-[var(--accent)] font-bold mb-6">Interior Products</h2>
                    <h1 className="text-4xl md:text-7xl font-bold leading-tight">Premium Hardware Store</h1>

                    {/* Search & Filter Bar */}
                    <div className="mt-12 max-w-4xl mx-auto flex flex-col md:flex-row gap-4 items-center">
                        <div className="relative flex-1 w-full">
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 outline-none focus:border-[var(--accent)] text-sm transition-all"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                            <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                        <select
                            className="bg-gray-50 border border-gray-100 px-6 py-4 text-[10px] uppercase font-bold tracking-widest outline-none focus:border-[var(--accent)] w-full md:w-auto"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="featured">Featured</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                        </select>
                    </div>

                    <div className="mt-10 flex flex-wrap justify-center gap-4 md:gap-8 overflow-x-auto pb-4 scrollbar-hide">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => {
                                    setActiveFilter(cat);
                                    setCurrentPage(1);
                                }}
                                className={`text-[10px] md:text-xs font-bold uppercase tracking-widest pb-2 border-b-2 transition-all whitespace-nowrap ${activeFilter === cat
                                    ? "border-[var(--accent)] text-gray-900"
                                    : "border-transparent text-gray-400 hover:text-gray-600"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-6">
                    {paginatedProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-16">
                            {paginatedProducts.map((product) => (
                                <Link href={`/store/${product.slug}`} key={product._id} className="group flex flex-col items-center text-center">
                                    <div className="relative aspect-square w-full bg-white overflow-hidden rounded-sm shadow-md mb-8">
                                        <img
                                            src={product.images?.[0] || "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop"}
                                            alt={product.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute top-4 left-4 bg-white px-3 py-1 text-[9px] font-bold uppercase tracking-widest shadow-sm">
                                            {product.category}
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold mb-2 group-hover:text-[var(--accent)] transition-colors">{product.name}</h3>
                                    <p className="text-[var(--muted)] text-xs md:text-sm leading-relaxed mb-4 max-w-xs line-clamp-2">{product.description}</p>
                                    <p className="text-lg font-bold text-[var(--accent)]">Rs. {product.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                </Link>
                            ))}
                        </div>
                    ) : isLoading ? (
                        <div className="flex justify-center items-center py-40">
                            <div className="w-12 h-12 border-4 border-gray-100 border-t-[var(--accent)] rounded-full animate-spin" />
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <h3 className="text-xl font-bold text-gray-400">No products found matching your search.</h3>
                            <button onClick={() => { setSearchQuery(""); setActiveFilter("All"); }} className="mt-6 text-[var(--accent)] font-bold uppercase text-xs">Clear all filters</button>
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-20 flex justify-center items-center gap-4">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(p => p - 1)}
                                className="p-4 border border-gray-200 disabled:opacity-30 hover:bg-black hover:text-white transition-all"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                            </button>
                            <span className="text-xs font-bold uppercase tracking-widest px-6">Page {currentPage} of {totalPages}</span>
                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(p => p + 1)}
                                className="p-4 border border-gray-200 disabled:opacity-30 hover:bg-black hover:text-white transition-all"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                            </button>
                        </div>
                    )}
                </div>
            </section>

            <section className="py-20 md:py-32 bg-[var(--primary)] text-white text-center">
                <div className="max-w-4xl mx-auto px-6">
                    <h3 className="text-2xl md:text-3xl font-bold mb-6">Need a custom hardware solution?</h3>
                    <p className="text-gray-400 mb-10 text-sm md:text-base leading-relaxed">
                        We provide personalized catalog sourcing for large-scale residential and commercial projects.
                        Visit our studio for a physical experience of our premium collection.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <button className="border border-white/20 px-10 py-4 font-bold hover:bg-white/10 transition-all uppercase tracking-widest text-xs">Request Catalog</button>
                        <button className="bg-[var(--accent)] text-white px-10 py-4 font-bold hover:bg-opacity-90 transition-all uppercase tracking-widest text-xs">Book Studio Visit</button>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
