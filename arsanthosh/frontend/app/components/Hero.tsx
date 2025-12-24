"use client";

import { useState } from "react";
import BookingModal from "./BookingModal";

export default function Hero() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  return (
    <section className="relative h-[85vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/hero_interior_design.png"
          alt="Luxury Interior"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 text-white w-full">
        <h2 className="text-[10px] md:text-sm uppercase tracking-[0.3em] text-[var(--accent)] font-bold mb-4">Architecture | Interiors | Products</h2>
        <h1 className="text-[28px] sm:text-5xl md:text-8xl font-bold leading-tight max-w-4xl">
          Designing Spaces <br className="hidden md:block" />
          <span className="text-[var(--accent)]">That Inspire Life</span>
        </h1>

        <p className="mt-6 md:mt-8 text-sm md:text-xl text-gray-200 max-w-2xl leading-relaxed font-light">
          Ar.Santhosh blends creativity, technology, and practicality <br className="hidden md:block" />
          to turn your architectural dreams into functional reality.
        </p>

        <div className="mt-8 md:mt-12 flex flex-col sm:flex-row gap-4 sm:gap-6">
          <button
            onClick={() => setIsBookingOpen(true)}
            className="bg-[var(--accent)] text-white px-8 md:px-10 py-4 md:py-5 font-bold hover:bg-opacity-90 transition-all uppercase tracking-widest text-[10px] md:text-sm"
          >
            Consult Now
          </button>
          <button className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 md:px-10 py-4 md:py-5 font-bold hover:bg-white/20 transition-all uppercase tracking-widest text-[10px] md:text-sm">
            View Gallery
          </button>
        </div>

        <BookingModal isOpen={isBookingOpen} onCloseAction={() => setIsBookingOpen(false)} />
      </div>
    </section>
  );
}
