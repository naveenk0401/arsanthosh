"use client";

const renders = [
    { title: "Minimalist Living Room", type: "Panoramic VR", image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=800&auto=format&fit=crop" },
    { title: "Modern Master Bedroom", type: "3D Render", image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=800&auto=format&fit=crop" },
    { title: "Executive Office Suite", type: "Walkthrough", image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=800&auto=format&fit=crop" }
];

export default function ThreeDGallery() {
    return (
        <section className="py-16 md:py-24 bg-[#fcfcfc]">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 md:mb-16 gap-6">
                    <div className="max-w-2xl">
                        <h2 className="text-[10px] md:text-sm uppercase tracking-[0.3em] text-[var(--accent)] font-bold mb-4">Immersion</h2>
                        <h3 className="text-3xl md:text-4xl font-bold">3D Room Previews</h3>
                        <p className="mt-6 text-gray-500 text-sm md:text-base leading-relaxed">
                            Experience your space before it's built. Our advanced 3D visualization and VR walkthroughs
                            allow you to feel the proportions, lighting, and materials of your future project.
                        </p>
                    </div>
                    <button className="text-[10px] md:text-xs font-bold border-2 border-gray-900 px-8 py-3 uppercase tracking-widest hover:bg-black hover:text-white transition-all">
                        Request 3D Render
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {renders.map((item, index) => (
                        <div key={index} className="relative group overflow-hidden rounded-sm shadow-lg aspect-square">
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8">
                                <span className="text-[9px] font-bold text-[var(--accent)] uppercase tracking-widest mb-2">{item.type}</span>
                                <h4 className="text-white font-bold text-lg md:text-xl">{item.title}</h4>
                                <div className="mt-4 flex items-center gap-2 text-white group-hover:text-[var(--accent)] transition-colors">
                                    <span className="text-[10px] uppercase font-bold tracking-widest">Enter VR View</span>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
