import Link from "next/link";

export default function AboutIntro() {
    return (
        <section className="py-16 md:py-24 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    <div className="relative">
                        <div className="aspect-[4/5] bg-gray-100 overflow-hidden rounded-sm">
                            <img
                                src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=800&auto=format&fit=crop"
                                alt="Architect Santhosh Studio"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="absolute -bottom-6 -right-6 bg-[var(--accent)] text-white p-8 hidden md:block">
                            <p className="text-4xl font-bold">10+</p>
                            <p className="text-[10px] uppercase tracking-widest font-bold">Years of Excellence</p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div>
                            <h2 className="text-[10px] md:text-sm uppercase tracking-[0.3em] text-[var(--accent)] font-bold mb-4">About Me</h2>
                            <h3 className="text-3xl md:text-5xl font-bold leading-tight">
                                We create experiences, <br />
                                <span className="text-[var(--accent)]">Not just spaces.</span>
                            </h3>
                            <p className="mt-6 text-gray-500 text-sm md:text-base leading-relaxed">
                                Blending creativity, technology, and practicality, we turn dreams into functional reality.
                                We are a full-service Architecture and Interior Design studio dedicated to creating beautiful,
                                functional, and future-ready spaces.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-8 pt-4">
                            <div>
                                <h4 className="font-bold text-gray-900 mb-2">Our Vision</h4>
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    To redefine modern architectural boundaries with sustainable and aesthetic solutions.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 mb-2">Our Mission</h4>
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    Delivering premium quality design and hardware solutions tailored to every unique lifestyle.
                                </p>
                            </div>
                        </div>

                        <div className="pt-4">
                            <Link href="/about" className="text-xs md:text-sm font-bold border-b-2 border-[var(--primary)] pb-1 uppercase tracking-widest hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors inline-block">
                                Learn More About Us
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
