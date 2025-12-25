"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ThreeDGallery from "@/components/common/ThreeDGallery";

const categories = ["All", "Villas", "Offices", "Retail", "Luxury Interiors", "Renovations"];

const projects = [
    {
        title: "The Oasis Villa",
        category: "Villas",
        location: "Bengaluru",
        image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=800&auto=format&fit=crop"
    },
    {
        title: "Quantum Tech HQ",
        category: "Offices",
        location: "Tirupur",
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop"
    },
    {
        title: "Elysian Storefront",
        category: "Retail",
        location: "Chennai",
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop"
    },
    {
        title: "Sky Penthouse",
        category: "Luxury Interiors",
        location: "Hyderabad",
        image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=800&auto=format&fit=crop"
    },
    {
        title: "Heritage Reborn",
        category: "Renovations",
        location: "Coimbatore",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop"
    },
    {
        title: "Azure Marina Villa",
        category: "Villas",
        location: "Kochi",
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop"
    }
];

export default function PortfolioPage() {
    const [activeFilter, setActiveFilter] = useState("All");

    const filteredProjects = activeFilter === "All"
        ? projects
        : projects.filter(p => p.category === activeFilter);

    return (
        <main className="min-h-screen bg-[var(--bg)]">
            <Navbar />

            <section className="py-20 md:py-32 bg-white">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-[10px] md:text-sm uppercase tracking-[0.3em] text-[var(--accent)] font-bold mb-6">Our Work</h2>
                    <h1 className="text-4xl md:text-7xl font-bold leading-tight">Project Portfolio</h1>

                    <div className="mt-12 md:mt-16 flex flex-wrap justify-center gap-4 md:gap-8">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveFilter(cat)}
                                className={`text-[10px] md:text-xs font-bold uppercase tracking-widest pb-2 border-b-2 transition-all ${activeFilter === cat
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

            {/* Portfolio Grid */}
            <section className="py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                        {filteredProjects.map((project, index) => (
                            <div key={index} className="group cursor-pointer">
                                <div className="relative aspect-[3/4] overflow-hidden rounded-sm shadow-xl mb-6">
                                    <img
                                        src={project.image}
                                        alt={project.title}
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <div className="text-white text-center p-6 translate-y-4 group-hover:translate-y-0 transition-transform">
                                            <p className="text-[10px] uppercase font-bold tracking-[0.2em] mb-2">{project.category}</p>
                                            <h4 className="text-xl font-bold">{project.title}</h4>
                                            <p className="text-xs text-gray-300 mt-2">{project.location}</p>
                                            <div className="mt-6 w-10 h-0.5 bg-[var(--accent)] mx-auto" />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <h4 className="font-bold text-lg md:text-xl text-gray-900 group-hover:text-[var(--accent)] transition-colors">{project.title}</h4>
                                        <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">{project.location}</p>
                                    </div>
                                    <span className="text-[10px] font-bold text-[var(--accent)] group-hover:translate-x-1 transition-transform">VIEW PROJECT →</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredProjects.length === 0 && (
                        <div className="py-20 text-center text-gray-400">
                            No projects found in this category. More coming soon!
                        </div>
                    )}
                </div>
            </section>

            <ThreeDGallery />

            {/* Case Studies / Trust Section */}
            <section className="py-16 md:py-24 bg-white border-t">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <h3 className="text-3xl md:text-4xl font-bold">Concept to Reality</h3>
                            <p className="text-gray-500 leading-relaxed">
                                Every project we undertake is a unique journey. We document our process from hand-sketches to
                                3D visualization and finally the realized space.
                            </p>
                            <button className="bg-[var(--primary)] text-white px-8 py-4 font-bold hover:bg-black transition-all uppercase tracking-widest text-xs">
                                Download Portfolio PDF
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="aspect-square bg-gray-50 p-6 flex flex-col justify-center text-center">
                                <span className="text-4xl font-black text-[var(--accent)]">150+</span>
                                <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mt-2">Villas Designed</span>
                            </div>
                            <div className="aspect-square bg-gray-900 p-6 flex flex-col justify-center text-center">
                                <span className="text-4xl font-black text-[var(--accent)]">50+</span>
                                <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mt-2">Corparate Offices</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
