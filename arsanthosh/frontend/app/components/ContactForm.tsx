export default function ContactForm() {
    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="max-w-4xl mx-auto px-6">
                <div className="text-center mb-10 md:mb-12">
                    <h2 className="text-2xl md:text-4xl font-bold mb-4">Let&apos;s Discuss Your Project</h2>
                    <p className="text-xs md:text-base text-[var(--muted)] px-4 md:px-0">Fill out the form below and we&apos;ll get back to you within 24 hours.</p>
                </div>

                <form className="space-y-4 md:space-y-6 bg-gray-50 p-6 md:p-12 border border-gray-100 rounded-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-500">Full Name</label>
                            <input
                                type="text"
                                placeholder="John Doe"
                                className="w-full px-4 py-3 bg-white border border-gray-100 outline-none focus:border-[var(--accent)] transition-colors text-sm"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-500">Email Address</label>
                            <input
                                type="email"
                                placeholder="john@example.com"
                                className="w-full px-4 py-3 bg-white border border-gray-100 outline-none focus:border-[var(--accent)] transition-colors text-sm"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-500">Service Required</label>
                        <select className="w-full px-4 py-3 bg-white border border-gray-100 outline-none focus:border-[var(--accent)] transition-colors appearance-none text-sm">
                            <option>Home Interior Design</option>
                            <option>Office Interior Design</option>
                            <option>Modular Kitchen</option>
                            <option>Hardware Store Inquiry</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-500">Your Message</label>
                        <textarea
                            rows={4}
                            placeholder="Tell us about your project or inquiry..."
                            className="w-full px-4 py-3 bg-white border border-gray-100 outline-none focus:border-[var(--accent)] transition-colors text-sm"
                        />
                    </div>

                    <button className="w-full bg-[var(--primary)] text-white py-4 font-bold hover:bg-black transition-all uppercase tracking-widest text-xs md:text-sm">
                        Send Inquiry
                    </button>
                </form>
            </div>
        </section>
    );
}
