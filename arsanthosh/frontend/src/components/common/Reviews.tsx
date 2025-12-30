const reviews = [
    {
        name: "Anita Sharma",
        role: "Homeowner",
        text: "Ar.Santhosh transformed our boring villa into a masterpiece. Their attention to detail in the modular kitchen is unmatched!",
        rating: 5
    },
    {
        name: "Vikram Mehta",
        role: "CEO, TechSpace",
        text: "The office interior design they provided is not only beautiful but also boosted our team's productivity. Highly recommend!",
        rating: 5
    },
    {
        name: "Priya Gopal",
        role: "Designer",
        text: "The premium hardware collection at their store is exquisite. I found unique handles that I couldn't find anywhere else.",
        rating: 4
    }
];

export default function Reviews() {
    return (
        <section className="py-16 md:py-24 bg-[var(--bg)]">
            <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-2xl md:text-3xl font-bold mb-10 md:mb-12 text-center">What Our Clients Say</h2>

                <div className="relative w-full overflow-hidden">
                    <div className="flex w-max animate-scroll hover:[animation-play-state:paused]">
                        {[...reviews, ...reviews].map((review, index) => (
                            <div key={index} className="w-[300px] md:w-[400px] px-4 flex-shrink-0">
                                <div className="bg-white p-6 md:p-8 border border-gray-100 shadow-sm flex flex-col justify-between rounded-sm h-full">
                                    <div>
                                        <div className="flex text-[var(--accent)] mb-4">
                                            {[...Array(review.rating)].map((_, i) => (
                                                <svg key={i} className="w-3.5 h-3.5 md:w-4 md:h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                                            ))}
                                        </div>
                                        <p className="text-xs md:text-sm text-[var(--muted)] italic mb-6 leading-relaxed">
                                            &quot;{review.text}&quot;
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3 md:gap-4">
                                        <div className="w-8 h-8 md:w-10 md:h-10 bg-[var(--accent)] rounded-full flex items-center justify-center text-white font-bold text-xs md:text-sm">
                                            {review.name[0]}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-xs md:text-sm">{review.name}</h4>
                                            <p className="text-[10px] md:text-xs text-[var(--muted)]">{review.role}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
