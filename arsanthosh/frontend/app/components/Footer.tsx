import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-[var(--primary)] text-white pt-16 pb-12 md:pb-8">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 mb-12">
                    {/* Company Info */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold tracking-tight">Architect Santhosh</h3>
                        <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
                            Transforming spaces into elegant experiences. Premium interior
                            design and hardware solutions for modern homes and offices.
                        </p>
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
                            <p>Email: hello@arsanthosh.com</p>
                            <p>Phone: +91 98765 43210</p>
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
