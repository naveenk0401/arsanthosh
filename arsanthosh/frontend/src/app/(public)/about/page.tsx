import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AboutIntro from "@/components/common/AboutIntro";
import Awards from "@/components/common/Awards";
import Reviews from "@/components/common/Reviews";

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-[var(--bg)]">
            <Navbar />

            <section className="py-20 md:py-32 bg-white border-b">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-[10px] md:text-sm uppercase tracking-[0.3em] text-[var(--accent)] font-bold mb-6">Our Journey</h2>
                    <h1 className="text-4xl md:text-7xl font-bold leading-tight">About Architect Santhosh</h1>
                    <p className="mt-8 text-gray-500 max-w-2xl mx-auto leading-relaxed">
                        Redefining luxury through architectural excellence and innovative design solutions since 2014.
                    </p>
                </div>
            </section>

            <AboutIntro />
            <Awards />
            <Reviews />

            <Footer />
        </main>
    );
}
