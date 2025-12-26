import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Pricing from "@/components/common/Pricing";

const services = [
    {
        title: "Residential Architecture",
        desc: "Bespoke architectural solutions for standalone villas, apartments, and farmhouses.",
        details: ["Site Analysis", "Conceptual Design", "Municipal Approvals", "Structural Engineering"],
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
        )
    },
    {
        title: "Interior Design",
        desc: "Transforming empty shells into premium, high-functional living and working environments.",
        details: ["Space Planning", "Material Selection", "3D Visualization", "Custom Furniture"],
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
        )
    },
    {
        title: "Commercial Design",
        desc: "Strategic design for retail outlets, corporate offices, and hospitality centers.",
        details: ["Brand Integration", "Lighting Design", "Acoustics", "Facility Management"],
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
        )
    },
    {
        title: "Turnkey Projects",
        desc: "End-to-end project management from soil testing to the final handing over of keys.",
        details: ["Project Scheduling", "Vendor Management", "Quality Assurance", "Cost-Control"],
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
        )
    }
];

const steps = [
    { num: "01", title: "Consultation", desc: "Understanding your vision, budget, and requirements." },
    { num: "02", title: "Design Concept", desc: "Developing initial layouts, mood boards, and 3D renders." },
    { num: "03", title: "Execution", desc: "Precision construction and interior work managed by experts." },
    { num: "04", title: "Handover", desc: "Final quality checks and walkthrough of your new space." }
];

export default function ServicesPage() {
    return (
        <main className="min-h-screen bg-[var(--bg)]">
            <Navbar />

            <section className="py-20 md:py-32 bg-white border-b">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-[10px] md:text-sm uppercase tracking-[0.3em] text-[var(--accent)] font-bold mb-6">Expertise</h2>
                    <h1 className="text-4xl md:text-7xl font-bold leading-tight">Our Services</h1>
                    <p className="mt-8 text-gray-500 max-w-2xl mx-auto leading-relaxed">
                        We offer a comprehensive range of design and architectural services tailored to meet the highest standards of luxury and functionality.
                    </p>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                        {services.map((item) => (
                            <div key={item.title} className="bg-white p-8 md:p-12 shadow-sm border border-gray-100 group hover:border-[var(--accent)] transition-all">
                                <div className="text-[var(--accent)] mb-8 transition-transform group-hover:scale-110 duration-500">{item.icon}</div>
                                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                                <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-8">{item.desc}</p>
                                <ul className="space-y-3">
                                    {item.details.map((detail) => (
                                        <li key={detail} className="flex items-center gap-3 text-xs md:text-sm font-bold text-gray-400">
                                            <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full" />
                                            {detail}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section className="py-16 md:py-24 bg-[var(--primary)] text-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16 md:mb-20">
                        <h2 className="text-[10px] md:text-sm uppercase tracking-widest text-[var(--accent)] font-bold mb-2">The Roadmap</h2>
                        <h3 className="text-3xl md:text-4xl font-bold">Our Process</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                        {steps.map((step) => (
                            <div key={step.num} className="relative group">
                                <div className="text-4xl md:text-6xl font-black text-white opacity-10 mb-6 transition-opacity group-hover:opacity-100 group-hover:text-[var(--accent)]">{step.num}</div>
                                <h4 className="text-lg md:text-xl font-bold mb-4">{step.title}</h4>
                                <p className="text-sm text-gray-400 leading-relaxed">{step.desc}</p>
                                {step.num !== "04" && (
                                    <div className="hidden lg:block absolute top-[40px] left-[100px] w-full h-[1px] bg-white/10" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Pricing />

            {/* Final CTA */}
            <section className="py-20 md:py-32 bg-white text-center">
                <div className="max-w-4xl mx-auto px-6">
                    <h3 className="text-3xl md:text-5xl font-bold mb-8">Ready to transform your vision?</h3>
                    <button className="bg-[var(--accent)] text-white px-10 py-5 font-bold hover:bg-opacity-90 transition-all uppercase tracking-widest text-sm shadow-xl">
                        Book a Free Consultation
                    </button>
                    <p className="mt-8 text-xs text-gray-400 uppercase tracking-widest animate-pulse">Available for project sites across India</p>
                </div>
            </section>

            <Footer />
        </main>
    );
}
