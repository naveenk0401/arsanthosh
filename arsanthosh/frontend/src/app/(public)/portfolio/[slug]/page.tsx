"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/utils/api";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function SingleProjectPage() {
    const params = useParams();
    const slug = params.slug as string;
    const [project, setProject] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProject = async () => {
            setIsLoading(true);
            const response = await api.get(`/projects/slug/${slug}`);
            if (response.success) {
                setProject(response.data);
            }
            setIsLoading(false);
        };

        if (slug) fetchProject();
    }, [slug]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-12 h-12 bg-gray-200 rounded-full mb-4"></div>
                    <div className="h-4 w-32 bg-gray-100 rounded"></div>
                </div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center px-4">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Project Not Found</h1>
                <p className="text-gray-500 mb-6">The project you are looking for does not exist.</p>
                <Link href="/portfolio" className="px-6 py-3 bg-black text-white text-sm font-bold uppercase tracking-widest hover:bg-[var(--primary)] transition-colors">
                    Back to Portfolio
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Hero Section */}
            <div className="relative h-[60vh] md:h-[80vh] w-full">
                <div className="absolute inset-0 bg-gray-900">
                    {project.images && project.images[0] && (
                        <img 
                            src={project.images[0]} 
                            alt={project.title} 
                            className="w-full h-full object-cover opacity-80"
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />
                </div>
                <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 lg:p-20 text-white">
                    <div className="max-w-7xl mx-auto">
                        <span className="inline-block px-3 py-1 bg-[var(--accent)] text-white text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
                            {project.category}
                        </span>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-display leading-tight mb-4">
                            {project.title}
                        </h1>
                        <p className="text-lg md:text-xl text-gray-300 max-w-2xl font-light">
                            {project.location} • {project.status}
                        </p>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
                    
                    {/* Left Column: Story & Process */}
                    <div className="lg:col-span-8 space-y-16">
                        
                        {/* Description */}
                        <section>
                            <h2 className="text-sm font-bold text-[var(--primary)] uppercase tracking-[0.2em] mb-6">The Vision</h2>
                            <div className="prose prose-lg text-gray-600 leading-relaxed whitespace-pre-line">
                                {project.description}
                            </div>
                        </section>

                        {/* Why Choose Us */}
                        {project.whyChooseUs && (
                            <section className="bg-gray-50 p-8 border-l-4 border-[var(--primary)]">
                                <h3 className="text-lg font-bold text-gray-900 mb-3">Why This Project Stands Out</h3>
                                <p className="text-gray-600 italic">{project.whyChooseUs}</p>
                            </section>
                        )}

                        {/* Process Timeline */}
                        {project.process && project.process.length > 0 && (
                            <section>
                                <h2 className="text-sm font-bold text-[var(--primary)] uppercase tracking-[0.2em] mb-8">How We Worked</h2>
                                <div className="space-y-8 border-l border-gray-200 ml-3 pl-8 relative">
                                    {project.process.map((step: any, idx: number) => (
                                        <div key={idx} className="relative">
                                            <span className="absolute -left-[39px] top-1 w-5 h-5 rounded-full bg-white border-4 border-[var(--primary)]"></span>
                                            <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                                            <p className="text-gray-600">{step.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Gallery Grid */}
                        {project.images && project.images.length > 1 && (
                            <section>
                                <h2 className="text-sm font-bold text-[var(--primary)] uppercase tracking-[0.2em] mb-8">Visual Journey</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {project.images.slice(1).map((img: string, idx: number) => (
                                        <div key={idx} className="aspect-[4/3] bg-gray-100 overflow-hidden group">
                                            <img
                                                src={img}
                                                alt={`${project.title} ${idx + 2}`}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Right Column: Specs & Testimonial */}
                    <div className="lg:col-span-4 space-y-12">
                        
                        {/* Project Specs */}
                        <div className="bg-gray-900 text-white p-8 md:p-10">
                            <h3 className="text-sm font-bold text-[var(--accent)] uppercase tracking-[0.2em] mb-8">Project Config</h3>
                            
                            <div className="space-y-6">
                                {project.budgetDetails && (
                                    <div className="pb-6 border-b border-gray-800">
                                        <div className="text-xs text-gray-400 uppercase tracking-widest mb-1">Budget Efficiency</div>
                                        <div className="text-xl font-bold">{project.budgetDetails}</div>
                                    </div>
                                )}
                                
                                {project.timeline && (
                                    <div className="pb-6 border-b border-gray-800">
                                        <div className="text-xs text-gray-400 uppercase tracking-widest mb-1">Timeline</div>
                                        <div className="text-xl font-bold">{project.timeline}</div>
                                    </div>
                                )}

                                {project.completionDate && (
                                    <div className="pb-6 border-b border-gray-800">
                                        <div className="text-xs text-gray-400 uppercase tracking-widest mb-1">Completion</div>
                                        <div className="text-xl font-bold">{new Date(project.completionDate).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</div>
                                    </div>
                                )}

                                {project.materials && project.materials.length > 0 && (
                                    <div>
                                        <div className="text-xs text-gray-400 uppercase tracking-widest mb-3">Key Materials</div>
                                        <div className="flex flex-wrap gap-2">
                                            {project.materials.map((mat: string, idx: number) => (
                                                <span key={idx} className="px-3 py-1 bg-gray-800 text-[10px] font-bold uppercase tracking-wider text-gray-300">
                                                    {mat}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Testimonial */}
                        {project.clientTestimonial && project.clientTestimonial.comment && (
                            <div className="bg-[var(--primary)]/10 p-8 md:p-10 border border-[var(--primary)]/20">
                                <svg className="w-8 h-8 text-[var(--primary)] mb-6 opacity-50" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M14.017 21L14.017 18C14.017 16.896 14.321 16.062 14.929 15.498C15.536 14.934 16.035 14.502 16.425 14.202C17.155 13.626 17.525 12.876 17.535 11.952L17.535 5L22 5L22 13C22 14.932 21.143 16.488 19.429 17.668C17.715 18.848 15.911 19.959 14.017 21ZM5 21L5 18C5 16.896 5.304 16.062 5.912 15.498C6.52 14.934 7.019 14.502 7.409 14.202C8.139 13.626 8.509 12.876 8.519 11.952L8.519 5L12.984 5L12.984 13C12.984 14.932 12.127 16.488 10.413 17.668C8.699 18.848 6.895 19.959 5 21Z" />
                                </svg>
                                <blockquote className="text-lg font-medium text-gray-900 italic mb-6">
                                    "{project.clientTestimonial.comment}"
                                </blockquote>
                                <div>
                                    <div className="font-bold text-gray-900">{project.clientTestimonial.name}</div>
                                    <div className="text-xs text-gray-500 uppercase tracking-widest">{project.clientTestimonial.role}</div>
                                    <div className="flex gap-1 mt-2">
                                        {[...Array(5)].map((_, i) => (
                                            <svg key={i} className={`w-4 h-4 ${i < project.clientTestimonial.rating ? 'text-yellow-500' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* CTA */}
                        <div className="bg-black text-white p-8 md:p-10 text-center">
                            <h3 className="text-xl font-bold mb-2">Inspired by this project?</h3>
                            <p className="text-gray-400 mb-8 font-light">Let's create something extraordinary together.</p>
                            <Link href="/contact" className="inline-block px-8 py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-[var(--accent)] hover:text-white transition-colors w-full">
                                Start Confirmation
                            </Link>
                        </div>

                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
