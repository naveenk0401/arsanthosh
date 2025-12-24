"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "../context/CartContext";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { totalItems, setIsCartOpen } = useCart();

  const isStorePage = pathname === "/store";

  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-base md:text-xl font-semibold tracking-tight">Architect Santhosh</Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-6 text-sm font-medium">
          <Link href="/about" className="hover:text-[var(--accent)] transition-colors">About</Link>
          <Link href="/services" className="hover:text-[var(--accent)] transition-colors">Services</Link>
          <Link href="/portfolio" className="hover:text-[var(--accent)] transition-colors">Portfolio</Link>
          <Link href="/store" className="hover:text-[var(--accent)] transition-colors font-bold text-[var(--accent)]">Store</Link>
          <Link href="/blog" className="hover:text-[var(--accent)] transition-colors">Blog</Link>
          <Link href="/contact" className="hover:text-[var(--accent)] transition-colors">Contact</Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          {isStorePage && (
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-gray-700 hover:text-black transition-colors"
              aria-label="View Cart"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-[var(--accent)] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                  {totalItems}
                </span>
              )}
            </button>
          )}

          <Link href="/login" className="hidden md:block border border-gray-200 px-6 py-2.5 text-sm font-bold hover:bg-gray-50 transition-colors uppercase tracking-wider">
            Login
          </Link>
          <Link href="/get-quote" className="bg-[var(--primary)] text-white px-3 md:px-6 py-2 md:py-2.5 text-[9px] md:text-sm font-bold hover:bg-black transition-colors uppercase tracking-wider whitespace-nowrap mr-1 md:mr-0">
            Get Quote
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 -mr-1 text-gray-900"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t p-6 space-y-4 shadow-xl">
          <nav className="flex flex-col gap-4">
            <Link href="/about" className="text-lg font-bold hover:text-[var(--accent)] transition-colors" onClick={() => setIsMenuOpen(false)}>About</Link>
            <Link href="/services" className="text-lg font-bold hover:text-[var(--accent)] transition-colors" onClick={() => setIsMenuOpen(false)}>Services</Link>
            <Link href="/portfolio" className="text-lg font-bold hover:text-[var(--accent)] transition-colors" onClick={() => setIsMenuOpen(false)}>Portfolio</Link>
            <Link href="/store" className="text-lg font-bold hover:text-[var(--accent)] transition-colors" onClick={() => setIsMenuOpen(false)}>Store</Link>
            <Link href="/blog" className="text-lg font-bold hover:text-[var(--accent)] transition-colors" onClick={() => setIsMenuOpen(false)}>Blog</Link>
            <Link href="/contact" className="text-lg font-bold hover:text-[var(--accent)] transition-colors" onClick={() => setIsMenuOpen(false)}>Contact</Link>
          </nav>
          <div className="pt-4 border-t flex flex-col gap-3">
            <Link
              href="/login"
              className="w-full text-center border py-3.5 font-bold uppercase tracking-widest text-sm"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
