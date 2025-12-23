export default function Awards() {
    const awards = [
        { title: "Best Interior Design", year: "2023", org: "IAA Awards" },
        { title: "Young Architect", year: "2021", org: "Design Forum" },
        { title: "Sustainable Studio", year: "2022", org: "Green Build" },
        { title: "Innovation Lead", year: "2020", org: "Architect Connect" }
    ];

    return (
        <section className="py-16 md:py-24 bg-white border-t border-gray-50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-[10px] md:text-sm uppercase tracking-widest text-[var(--accent)] font-bold mb-2">Recognition</h2>
                    <h3 className="text-2xl md:text-4xl font-bold">Awards & Certifications</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {awards.map((award) => (
                        <div key={award.title} className="text-center p-8 bg-gray-50 rounded-sm border border-gray-100 hover:border-[var(--accent)] transition-colors group">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:bg-[var(--accent)] group-hover:text-white transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                            </div>
                            <h4 className="font-bold text-gray-900 group-hover:text-[var(--accent)] transition-colors uppercase tracking-widest text-[10px] md:text-xs mb-2">{award.title}</h4>
                            <p className="text-xs text-gray-400">{award.org} | {award.year}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
