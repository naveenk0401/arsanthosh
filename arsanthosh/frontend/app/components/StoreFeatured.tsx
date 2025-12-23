const items = [
    {
        name: "Luxury Door Handles",
        category: "Fittings",
        price: "₹4,500",
        image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=400&auto=format&fit=crop"
    },
    {
        name: "Smart Bio-Locks",
        category: "Security",
        price: "₹18,200",
        image: "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=400&auto=format&fit=crop"
    },
    {
        name: "Designer Cabinet Knobs",
        category: "Hardware",
        price: "₹850",
        image: "https://images.unsplash.com/photo-1518481612222-68bbe828eba1?q=80&w=400&auto=format&fit=crop"
    },
    {
        name: "Brushed Gold Faucets",
        category: "Kitchen",
        price: "₹7,800",
        image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400&auto=format&fit=crop"
    }
];

export default function StoreFeatured() {
    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-[10px] md:text-sm uppercase tracking-widest text-[var(--accent)] font-bold mb-2">Premium Hardware</h2>
                    <h3 className="text-3xl md:text-4xl font-bold">Featured Store Items</h3>
                    <div className="w-16 md:w-20 h-1 bg-[var(--accent)] mx-auto mt-4" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {items.map((item) => (
                        <div key={item.name} className="group">
                            <div className="relative aspect-square bg-gray-50 overflow-hidden mb-4 rounded-sm">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute top-4 left-4 bg-white px-2 py-1 text-[9px] font-bold uppercase tracking-widest shadow-sm">
                                    {item.category}
                                </div>
                                <button className="absolute bottom-4 right-4 bg-black text-white p-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all translate-y-0 md:translate-y-2 md:group-hover:translate-y-0 duration-300">
                                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                                </button>
                            </div>
                            <h4 className="font-bold text-base md:text-lg">{item.name}</h4>
                            <p className="text-[var(--accent)] font-bold text-sm md:text-base">{item.price}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-12 md:mt-16 text-center">
                    <button className="bg-[var(--primary)] text-white px-8 md:px-10 py-3.5 md:py-4 font-bold hover:bg-black transition-colors uppercase tracking-widest text-xs md:text-sm">
                        Shop the Collection
                    </button>
                </div>
            </div>
        </section>
    );
}
