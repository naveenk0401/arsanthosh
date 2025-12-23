"use client";

import { useState } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

const categories = ["All", "Fittings", "Security", "Hardware", "Kitchen", "Decor"];

const products = [
    {
        name: "Luxury Door Handles",
        category: "Fittings",
        price: "₹4,500",
        image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=400&auto=format&fit=crop",
        desc: "Handcrafted brass door handles with a sleek obsidian finish."
    },
    {
        name: "Smart Bio-Locks",
        category: "Security",
        price: "₹18,200",
        image: "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=400&auto=format&fit=crop",
        desc: "Advanced biometric security with remote access control."
    },
    {
        name: "Designer Cabinet Knobs",
        category: "Hardware",
        price: "₹850",
        image: "https://images.unsplash.com/photo-1518481612222-68bbe828eba1?q=80&w=400&auto=format&fit=crop",
        desc: "Minimalist knobs for a contemporary kitchen aesthetic."
    },
    {
        name: "Brushed Gold Faucets",
        category: "Kitchen",
        price: "₹7,800",
        image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400&auto=format&fit=crop",
        desc: "High-grade stainless steel faucets with premium gold plating."
    },
    {
        name: "Modern Pendant Light",
        category: "Decor",
        price: "₹12,400",
        image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=400&auto=format&fit=crop",
        desc: "Statement lighting for dining areas and grand hallways."
    },
    {
        name: "Hidden Door Hinges",
        category: "Hardware",
        price: "₹1,200",
        image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=400&auto=format&fit=crop",
        desc: "Concealed 3D adjustable hinges for seamless door design."
    }
];

export default function StorePage() {
    const [activeFilter, setActiveFilter] = useState("All");

    const filteredProducts = activeFilter === "All"
        ? products
        : products.filter(p => p.category === activeFilter);

    const handleEnquiry = (productName: string) => {
        const phoneNumber = "919876543210";
        const message = `Hello! I'm interested in the *${productName}* from your store. Could you provide more details and availability?`;
        window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, "_blank");
    };

    return (
        <main className="min-h-screen bg-[var(--bg)]">
            <Header />

            <section className="py-20 md:py-32 bg-white">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-[10px] md:text-sm uppercase tracking-[0.3em] text-[var(--accent)] font-bold mb-6">Interior Products</h2>
                    <h1 className="text-4xl md:text-7xl font-bold leading-tight">Premium Hardware Store</h1>
                    <p className="mt-8 text-gray-500 max-w-2xl mx-auto leading-relaxed">
                        Carefully curated interior products and hardware solutions to style your dream space effortlessly.
                    </p>

                    <div className="mt-12 md:mt-16 flex flex-wrap justify-center gap-4 md:gap-8 overflow-x-auto pb-4 scrollbar-hide">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveFilter(cat)}
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-16">
                        {filteredProducts.map((product, index) => (
                            <div key={index} className="group flex flex-col items-center text-center">
                                <div className="relative aspect-square w-full bg-white overflow-hidden rounded-sm shadow-md mb-8">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute top-4 left-4 bg-white px-3 py-1 text-[9px] font-bold uppercase tracking-widest shadow-sm">
                                        {product.category}
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold mb-2 group-hover:text-[var(--accent)] transition-colors">{product.name}</h3>
                                <p className="text-[var(--muted)] text-xs md:text-sm leading-relaxed mb-4 max-w-xs">{product.desc}</p>
                                <p className="text-lg font-bold text-[var(--accent)] mb-6">{product.price}</p>

                                <button
                                    onClick={() => handleEnquiry(product.name)}
                                    className="bg-[var(--primary)] text-white px-8 py-3.5 font-bold hover:bg-black transition-all uppercase tracking-widest text-[10px] shadow-lg flex items-center gap-3"
                                >
                                    <span>Send Enquiry</span>
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.319 1.592 5.548 0 10.058-4.51 10.06-10.059 0-2.689-1.047-5.215-2.948-7.115-1.9-1.9-4.425-2.947-7.114-2.948-5.551 0-10.06 4.509-10.062 10.059 0 2.132.563 3.991 1.57 5.807l-1.015 3.703 3.845-.371-3.354-1.062zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.496.099-.198.05-.371-.025-.52-.075-.148-.669-1.611-.916-2.205-.24-.579-.48-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" /></svg>
                                </button>
                            </div>
                        ))}
                    </div>
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
