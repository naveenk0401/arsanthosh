import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import TrustBar from "@/app/components/Trustbar";

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-[var(--bg)]">
            <Header />

            {/* Hero / Header Section */}
            <section className="py-20 md:py-32 bg-white">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-[10px] md:text-sm uppercase tracking-[0.3em] text-[var(--accent)] font-bold mb-6">Our Journey</h2>
                    <h1 className="text-4xl md:text-7xl font-bold leading-tight max-w-5xl mx-auto">
                        We don’t just design spaces; <br />
                        <span className="text-[var(--accent)]">We create experiences.</span>
                    </h1>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <h3 className="text-2xl md:text-3xl font-bold">Our Philosophy</h3>
                                <div className="w-16 h-1 bg-[var(--accent)]" />
                            </div>
                            <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                                Founded on the principles of precision, creativity, and sustainability,
                                Architect Santhosh Studio has been at the forefront of architectural innovation for over a decade.
                                We believe that every brick and beam should serve a purpose beyond structural integrity.
                            </p>
                            <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                                Our design philosophy centers on the user experience. By blending modern technology
                                with timeless aesthetics, we ensure that our designs are not only visually stunning
                                but also deeply functional and future-ready.
                            </p>

                            <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <div className="p-6 bg-white shadow-sm border border-gray-100 rounded-sm">
                                    <h4 className="font-bold text-gray-900 mb-3 uppercase tracking-widest text-[10px]">What makes us different</h4>
                                    <p className="text-xs text-gray-500 leading-relaxed">
                                        Personalized attention to every detail, from the macro site planning to the micro hardware choice.
                                    </p>
                                </div>
                                <div className="p-6 bg-white shadow-sm border border-gray-100 rounded-sm">
                                    <h4 className="font-bold text-gray-900 mb-3 uppercase tracking-widest text-[10px]">Our Expertise</h4>
                                    <p className="text-xs text-gray-500 leading-relaxed">
                                        A multi-disciplinary team of architects, interior designers, and hardware specialists.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="relative group">
                            <div className="aspect-[3/4] overflow-hidden rounded-sm shadow-2xl">
                                <img
                                    src="https://images.unsplash.com/photo-1574360523441-11c34a65495c?q=80&w=800&auto=format&fit=crop"
                                    alt="Ar.Santhosh Design Process"
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                            </div>
                            <div className="absolute -top-10 -left-10 w-40 h-40 bg-[var(--accent)] opacity-10 rounded-full blur-3xl -z-10" />
                            <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-[var(--primary)] opacity-5 rounded-full blur-3xl -z-10" />
                        </div>
                    </div>
                </div>
            </section>

            <TrustBar />

            {/* Team / Vision Section */}
            <section className="py-16 md:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-[10px] md:text-sm uppercase tracking-widest text-[var(--accent)] font-bold mb-2">Our Core</h2>
                        <h3 className="text-3xl md:text-4xl font-bold">Vision & Mission</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-center md:text-left">
                        <div className="space-y-6 p-8 md:p-12 bg-gray-50">
                            <div className="w-16 h-16 bg-[var(--primary)] text-white rounded-full flex items-center justify-center mx-auto md:mx-0">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            </div>
                            <h4 className="text-2xl font-bold uppercase tracking-tight">Our Vision</h4>
                            <p className="text-gray-500 leading-relaxed">
                                To lead the industry as the most creative and technologically progressive design studio in the region,
                                setting new standards for modern living and commercial excellence.
                            </p>
                        </div>
                        <div className="space-y-6 p-8 md:p-12 bg-[#1a1a1a] text-white">
                            <div className="w-16 h-16 bg-[var(--accent)] text-white rounded-full flex items-center justify-center mx-auto md:mx-0">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            </div>
                            <h4 className="text-2xl font-bold uppercase tracking-tight text-[var(--accent)]">Our Mission</h4>
                            <p className="text-gray-400 leading-relaxed">
                                To empower our clients through functional design, meticulous execution, and the provision
                                of premium products that elevate the everyday inhabitant experience.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
