"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { totalItems, setIsCartOpen } = useCart();
  const { user, logout } = useAuth();

  const isStorePage = pathname?.startsWith("/store");

  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="block">
          <div className="flex flex-col items-center">
            <img src="/logo.jpg" alt="Architect Santhosh" className="h-10 w-auto object-contain mb-0.5" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-black">Architect Santhosh</span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-6 text-sm font-medium">
          <Link href="/about" className="hover:text-[var(--accent)] transition-colors">About</Link>
          <Link href="/services" className="hover:text-[var(--accent)] transition-colors">Services</Link>
          <Link href="/portfolio" className="hover:text-[var(--accent)] transition-colors">Portfolio</Link>
          <Link href="/store" className="hover:text-[var(--accent)] transition-colors">Store</Link>
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


          {user ? (
            <div className="hidden md:flex flex-col items-center group cursor-pointer relative" onClick={logout}>
              <div className="w-8 h-8 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center group-hover:bg-[var(--primary)] group-hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span className="text-[9px] font-bold uppercase tracking-widest mt-1 text-gray-500 group-hover:text-black transition-colors">
                {user.name.split(' ')[0]}
              </span>
              {/* Tooltip for logout */}
              <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-black text-white text-[8px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                Click to Logout
              </div>
            </div>
          ) : (
            <Link href="/login" className="hidden md:flex flex-col items-center group">
              <div className="w-8 h-8 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center group-hover:bg-[var(--accent)] group-hover:text-white transition-colors text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span className="text-[9px] font-bold uppercase tracking-widest mt-1 text-gray-500 group-hover:text-[var(--accent)] transition-colors">
                Login
              </span>
            </Link>
          )}

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
          <div className="pt-4 border-t">
            {user ? (
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white border border-gray-100 rounded-full flex items-center justify-center text-[var(--primary)]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest">{user.name}</p>
                    <p className="text-[10px] text-gray-400 capitalize">{user.role}</p>
                  </div>
                </div>
                <button
                  onClick={() => { logout(); setIsMenuOpen(false); }}
                  className="text-[10px] font-bold uppercase tracking-widest text-red-500 hover:underline"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center justify-center gap-3 w-full border border-gray-100 py-4 group"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 group-hover:bg-[var(--accent)] group-hover:text-white transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className="text-sm font-bold uppercase tracking-widest">Sign In</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
