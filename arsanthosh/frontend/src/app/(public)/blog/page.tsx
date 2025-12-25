import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const posts = [
    {
        title: "5 Trends for Modern Modular Kitchens in 2024",
        date: "Dec 15, 2023",
        category: "Kitchen Design",
        excerpt: "Discover how smart storage and bold color palettes are redefining the heart of the home.",
        image: "https://images.unsplash.com/photo-1556911220-e150213ff337?q=80&w=800&auto=format&fit=crop"
    },
    {
        title: "Maxmizing Small Spaces: A Minimalist Approach",
        date: "Nov 28, 2023",
        category: "Interior Tips",
        excerpt: "Learn the secrets of psychological space expansion using light, mirrors, and multifunctional furniture.",
        image: "https://images.unsplash.com/photo-1505691938895-1758d7eaa511?q=80&w=800&auto=format&fit=crop"
    },
    {
        title: "Choosing the Right Hardware for Your Premium Doors",
        date: "Oct 12, 2023",
        category: "Hardware Guide",
        excerpt: "A comprehensive guide on finish durability, lock security levels, and ergonomic handle design.",
        image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop"
    },
    {
        title: "The Impact of Lighting on Workplace Productivity",
        date: "Sep 05, 2023",
        category: "Commercial Design",
        excerpt: "How architectural lighting design can transform office energy and focus levels.",
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop"
    }
];

export default function BlogPage() {
    return (
        <main className="min-h-screen bg-[var(--bg)]">
            <Navbar />

            <section className="py-20 md:py-32 bg-white border-b">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-[10px] md:text-sm uppercase tracking-[0.3em] text-[var(--accent)] font-bold mb-6">Inspiration</h2>
                    <h1 className="text-4xl md:text-7xl font-bold leading-tight">Design Journal</h1>
                    <p className="mt-8 text-gray-500 max-w-2xl mx-auto leading-relaxed">
                        Insights, tips, and trends from the world of architecture and premium interior design.
                    </p>
                </div>
            </section>

            <section className="py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
                        {posts.map((post, index) => (
                            <div key={index} className="group cursor-pointer">
                                <div className="relative aspect-[16/9] overflow-hidden rounded-sm shadow-lg mb-8">
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                    />
                                    <div className="absolute top-4 right-4 bg-[var(--accent)] text-white px-4 py-1 text-[10px] font-bold uppercase tracking-widest">
                                        {post.category}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400">{post.date}</p>
                                    <h3 className="text-2xl font-bold group-hover:text-[var(--accent)] transition-colors leading-tight">{post.title}</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed">{post.excerpt}</p>
                                    <div className="pt-4">
                                        <span className="text-xs font-bold border-b-2 border-gray-900 pb-1 uppercase tracking-widest group-hover:text-[var(--accent)] group-hover:border-[var(--accent)] transition-all">Read Article</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination Placeholder */}
                    <div className="mt-20 flex justify-center gap-4">
                        <button className="w-10 h-10 border border-gray-200 flex items-center justify-center font-bold text-xs hover:bg-black hover:text-white transition-all rounded-sm">1</button>
                        <button className="w-10 h-10 border border-gray-200 flex items-center justify-center font-bold text-xs hover:bg-black hover:text-white transition-all rounded-sm">2</button>
                        <button className="w-10 h-10 border border-gray-200 flex items-center justify-center font-bold text-xs hover:bg-black hover:text-white transition-all rounded-sm">→</button>
                    </div>
                </div>
            </section>

            <section className="py-16 md:py-24 bg-gray-50">
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <h3 className="text-2xl md:text-3xl font-bold mb-6">Stay Inspired</h3>
                    <p className="text-gray-500 mb-10 text-sm leading-relaxed">Subscribe to our newsletter for bi-weekly design tips and project sneak peeks.</p>
                    <form className="flex flex-col sm:flex-row gap-4">
                        <input
                            type="email"
                            placeholder="Your email address"
                            className="flex-1 px-6 py-4 border border-gray-200 focus:outline-none focus:border-[var(--accent)] text-sm rounded-sm"
                        />
                        <button className="bg-[var(--primary)] text-white px-8 py-4 font-bold hover:bg-black transition-all uppercase tracking-widest text-xs">Subscribe</button>
                    </form>
                </div>
            </section>

            <Footer />
        </main>
    );
}
