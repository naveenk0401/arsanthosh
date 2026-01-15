"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface SocialLinks {
    instagramUrl: string;
    youtubeUrl: string;
}

export default function Footer() {
    const [socialLinks, setSocialLinks] = useState<SocialLinks | null>(null);

    useEffect(() => {
        const fetchSocialLinks = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings/social-links`);
                const result = await response.json();
                if (result.status === "success") {
                    setSocialLinks(result.data);
                }
            } catch (error) {
                console.error("Failed to fetch social links:", error);
            }
        };

        fetchSocialLinks();
    }, []);

    return (
        <footer className="bg-[var(--primary)] text-white pt-16 pb-12 md:pb-8">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 mb-12">
                    {/* Company Info */}
                    <div className="space-y-4">
                        <img src="/logo.jpg" alt="Architect Santhosh" className="h-16 w-auto object-contain mb-4" />
                        <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
                            Transforming spaces into elegant experiences. Premium interior
                            design and hardware solutions for modern homes and offices.
                        </p>
                        {/* Social Links */}
                        <div className="flex gap-4 pt-2">
                            {socialLinks?.instagramUrl && (
                                <a
                                    href={socialLinks.instagramUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#E4405F] transition-all hover:scale-110"
                                    aria-label="Instagram"
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                    </svg>
                                </a>
                            )}
                            {socialLinks?.youtubeUrl && (
                                <a
                                    href={socialLinks.youtubeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#FF0000] transition-all hover:scale-110"
                                    aria-label="YouTube"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                    </svg>
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] text-gray-500">Links</h4>
                        <ul className="space-y-2 text-xs md:text-sm text-gray-300">
                            <li><Link href="/" className="hover:text-[var(--accent)] transition-colors">Home</Link></li>
                            <li><Link href="/about" className="hover:text-[var(--accent)] transition-colors">About Us</Link></li>
                            <li><Link href="/services" className="hover:text-[var(--accent)] transition-colors">Services</Link></li>
                            <li><Link href="/portfolio" className="hover:text-[var(--accent)] transition-colors">Portfolio</Link></li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] text-gray-500">Resources</h4>
                        <ul className="space-y-2 text-xs md:text-sm text-gray-300">
                            <li><Link href="/store" className="hover:text-[var(--accent)] transition-colors">Product Store</Link></li>
                            <li><Link href="/blog" className="hover:text-[var(--accent)] transition-colors">Latest News</Link></li>
                            <li><Link href="/faq" className="hover:text-[var(--accent)] transition-colors">FAQs</Link></li>
                            <li><Link href="/contact" className="hover:text-[var(--accent)] transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>


                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] text-gray-500">Contact Us</h4>
                        <div className="text-xs md:text-sm text-gray-300 space-y-3">
                            <p className=" leading-relaxed">Balaji Nagar, muthanampalyam<br />Tirupur, Tamil Nadu</p>
                            <p>Email: contact@arsanthosh.com</p>
                            <p>Phone: +91 9843237459</p>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] md:text-xs text-gray-500 text-center md:text-left">
                    <p>© {new Date().getFullYear()} Architect Santhosh. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
