export default function Pricing() {
    const packages = [
        {
            name: "Basic Consultation",
            price: "₹4,999",
            features: ["Space Assessment", "Color Palette Suggestion", "2D Furniture Layout", "Online Support"],
            accent: "gray-100"
        },
        {
            name: "Premium Interior",
            price: "₹1,499/sq.ft",
            features: ["Full 3D Rendering", "Material Procurement", "On-site Supervision", "Custom Carpentry"],
            accent: "[var(--accent)]",
            featured: true
        },
        {
            name: "Architectural Design",
            price: "₹2,99,000+",
            features: ["Blueprint Planning", "Structural Analysis", "Municipal Approvals", "Project Management"],
            accent: "gray-900"
        }
    ];

    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16 md:mb-20">
                    <h2 className="text-[10px] md:text-sm uppercase tracking-widest text-[var(--accent)] font-bold mb-2">Transparency</h2>
                    <h3 className="text-3xl md:text-4xl font-bold">Pricing Packages</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {packages.map((pkg) => (
                        <div key={pkg.name} className={`relative p-8 md:p-12 border ${pkg.featured ? "border-[var(--accent)]" : "border-gray-100"} flex flex-col items-center text-center rounded-sm shadow-sm`}>
                            {pkg.featured && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[var(--accent)] text-white px-4 py-1 text-[9px] font-bold uppercase tracking-widest">Most Popular</div>
                            )}
                            <h4 className="text-lg md:text-xl font-bold mb-4 uppercase tracking-tight">{pkg.name}</h4>
                            <div className="text-3xl md:text-4xl font-black text-[var(--primary)] mb-8">{pkg.price}</div>

                            <ul className="space-y-4 mb-10 text-gray-500 text-xs md:text-sm w-full">
                                {pkg.features.map(f => (
                                    <li key={f} className="flex items-center justify-center gap-2">
                                        <svg className="w-4 h-4 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            <button className={`w-full py-4 text-[10px] font-bold uppercase tracking-widest transition-all ${pkg.featured ? "bg-[var(--accent)] text-white hover:bg-opacity-90" : "bg-gray-100 text-gray-900 hover:bg-gray-200"}`}>
                                Get Started
                            </button>
                        </div>
                    ))}
                </div>
                <p className="mt-12 text-center text-[10px] text-gray-400 uppercase tracking-widest">*Prices may vary based on site location and project complexity</p>
            </div>
        </section>
    );
}
