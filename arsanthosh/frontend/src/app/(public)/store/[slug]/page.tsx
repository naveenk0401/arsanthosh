"use client";

import { useState, use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { api } from "@/utils/api";

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = use(params);
    const [product, setProduct] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState("");
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);

    const { addToCart } = useCart();
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        fetchProduct();
    }, [resolvedParams.slug]);

    const fetchProduct = async () => {
        setIsLoading(true);
        const response: any = await api.get(`/products/slug/${resolvedParams.slug}`);
        if (response.success) {
            setProduct(response.data);
        }
        setIsLoading(false);
    };

    if (isLoading) {
        return (
            <main className="min-h-screen bg-[var(--bg)] flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-gray-100 border-t-[var(--accent)] rounded-full animate-spin" />
                </div>
                <Footer />
            </main>
        );
    }

    if (!product) {
        return (
            <main className="min-h-screen bg-[var(--bg)] flex flex-col">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center p-6">
                    <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
                    <Link href="/store" className="text-[var(--accent)] font-bold uppercase text-xs hover:underline">Return to Store</Link>
                </div>
                <Footer />
            </main>
        );
    }

    const handleAddToCart = () => {
        addToCart({
            id: product.slug, // Map slug to id for cart compatibility
            name: product.name,
            price: `₹${product.price.toLocaleString()}`,
            numericPrice: product.price,
            image: product.images?.[0] || "",
            category: product.category,
            desc: product.description
        }, quantity);
    };

    const handleBuyNow = () => {
        handleAddToCart();
        router.push("/checkout/payment");
    };

    const submitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            router.push("/login");
            return;
        }

        setIsSubmittingReview(true);
        const response = await api.post("/reviews", {
            productId: product._id,
            rating: reviewRating,
            comment: reviewComment
        });

        if (response.success) {
            alert("Review submitted successfully!");
            setReviewComment("");
            setReviewRating(5);
            fetchProduct(); // Refresh reviews
        } else {
            alert(response.error?.message || "Failed to submit review");
        }
        setIsSubmittingReview(false);
    };

    return (
        <main className="min-h-screen bg-[var(--bg)]">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-12 md:py-24">
                <div className="flex flex-col md:flex-row gap-12 lg:gap-24">
                    {/* Left Side: Image */}
                    <div className="flex-1">
                        <div className="aspect-square bg-white rounded-sm overflow-hidden shadow-2xl sticky top-32">
                            <img
                                src={product.images?.[0] || "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop"}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Right Side: Details */}
                    <div className="flex-1 flex flex-col">
                        <nav className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-8">
                            <Link href="/store" className="hover:text-black">Store</Link>
                            <span>/</span>
                            <span className="text-[var(--accent)]">{product.category}</span>
                        </nav>

                        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">{product.name}</h1>

                        <div className="flex items-center gap-4 mb-8">
                            <p className="text-2xl font-bold text-[var(--accent)]">Rs. {product.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                            <div className="flex items-center gap-1">
                                <div className="flex text-[var(--accent)] text-sm">
                                    {"★".repeat(Math.round(product.averageRating || 0))}
                                    {"☆".repeat(5 - Math.round(product.averageRating || 0))}
                                </div>
                                <span className="text-xs font-bold text-gray-500">({product.numReviews || 0} reviews)</span>
                            </div>
                        </div>

                        <div className="space-y-6 mb-12">
                            <p className="text-gray-500 leading-relaxed text-sm md:text-base">
                                {product.description}
                            </p>
                        </div>


                        {/* Actions */}
                        <div className="mt-8 space-y-6">
                            <div className="flex items-center gap-6">
                                <p className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Quantity</p>
                                <div className="flex items-center border border-gray-200">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-12 h-12 flex items-center justify-center hover:bg-gray-50 transition-colors"
                                    >
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" /></svg>
                                    </button>
                                    <span className="w-12 text-center font-bold text-sm">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-12 h-12 flex items-center justify-center hover:bg-gray-50 transition-colors"
                                    >
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={handleAddToCart}
                                    className="flex-1 bg-white border-2 border-black text-black py-4 font-bold uppercase tracking-widest text-xs hover:bg-black hover:text-white transition-all shadow-lg flex items-center justify-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                    Add to Cart
                                </button>
                                <button
                                    onClick={handleBuyNow}
                                    className="flex-1 bg-black text-white py-4 font-bold uppercase tracking-widest text-xs hover:bg-[var(--accent)] transition-all shadow-lg"
                                >
                                    Buy Now
                                </button>
                            </div>
                        </div>

                        <div className="mt-12 py-8 border-t border-gray-100 flex items-center gap-8">
                            <div className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Secure Payment</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Hassle-free Returns</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Detailed Info Section */}
                <div className="mt-24 space-y-16 max-w-4xl mx-auto">
                    {product.features?.length > 0 && (
                        <div>
                            <h3 className="text-xl font-bold mb-8 text-center uppercase tracking-widest text-[var(--accent)]">Key Features</h3>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                                {product.features.map((f: string, i: number) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                                        <div className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full mt-1.5 shrink-0" />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {product.whyChoose?.length > 0 && (
                        <div>
                            <h3 className="text-xl font-bold mb-8 text-center uppercase tracking-widest text-[var(--accent)]">Why Choose This Piece</h3>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                                {product.whyChoose.map((w: string, i: number) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                                        <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                        {w}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>



                {/* Reviews Section - Full Width */}
                <div className="mt-24 pt-12 border-t border-gray-100 max-w-2xl mx-auto">
                    <h3 className="text-2xl font-bold mb-10 text-center">Customer Reviews</h3>

                    {/* Write Review Form */}
                    <div className="bg-gray-50 p-6 rounded-sm mb-12">
                        <h4 className="font-bold text-sm mb-4">Write a Review</h4>
                        {user ? (
                            <form onSubmit={submitReview} className="space-y-4">
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest block mb-2">Rating</label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setReviewRating(star)}
                                                className={`text-lg ${reviewRating >= star ? "text-[var(--accent)]" : "text-gray-300"}`}
                                            >
                                                ★
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest block mb-2">Comment</label>
                                    <textarea
                                        className="w-full p-3 text-sm border border-gray-200 outline-none focus:border-[var(--accent)] bg-white"
                                        rows={3}
                                        placeholder="Share your thoughts..."
                                        value={reviewComment}
                                        onChange={(e) => setReviewComment(e.target.value)}
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSubmittingReview}
                                    className="px-6 py-3 bg-black text-white text-[10px] font-bold uppercase tracking-widest hover:bg-[var(--accent)] transition-colors disabled:opacity-50"
                                >
                                    {isSubmittingReview ? "Submitting..." : "Post Review"}
                                </button>
                            </form>
                        ) : (
                            <div className="text-center py-4">
                                <p className="text-sm text-gray-500 mb-2">Please login to write a review.</p>
                                <Link href="/login" className="text-[var(--accent)] font-bold uppercase text-[10px] hover:underline">
                                    Login Now
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Reviews List */}
                    {product.reviews && product.reviews.length > 0 ? (
                        <div className="space-y-6">
                            {product.reviews.map((review: any) => (
                                <div key={review._id} className="bg-gray-50 p-6 rounded-sm border border-gray-100">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <span className="text-sm font-bold block">{review.userName}</span>
                                            <span className="text-[10px] text-gray-400">{new Date(review.createdAt || Date.now()).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex text-[var(--accent)] text-sm">
                                            {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                                        </div>
                                    </div>
                                    <p className="text-gray-600 italic leading-relaxed">"{review.comment}"</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-400 italic">No reviews yet. Be the first to review!</p>
                    )}
                </div>

                {/* Related Products */}
                {product.relatedProducts && product.relatedProducts.length > 0 && (
                    <div className="mt-24 pt-24 border-t border-gray-100">
                        <h2 className="text-2xl font-bold mb-10 text-center">You Might Also Like</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {product.relatedProducts.map((related: any) => (
                                <Link href={`/store/${related.slug}`} key={related._id} className="group flex flex-col items-center text-center">
                                    <div className="relative aspect-square w-full bg-white overflow-hidden rounded-sm shadow-sm mb-6">
                                        <img
                                            src={related.images?.[0] || "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop"}
                                            alt={related.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    </div>
                                    <h3 className="text-sm font-bold mb-1 group-hover:text-[var(--accent)] transition-colors">{related.name}</h3>
                                    <p className="text-[var(--accent)] font-bold text-xs">₹{related.price.toLocaleString()}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </main >
    );
}
