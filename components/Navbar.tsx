'use client';

import { useState, useEffect } from 'react';

interface NavbarProps {
  ctaText: string;
}

export default function Navbar({ ctaText }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToForm = (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileOpen(false);
    document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' });
  };

  const navLinks = [
    { name: 'Services', href: '#services' },
    { name: 'Why us', href: '#why' },
    { name: 'About', href: '#about' },
    { name: 'Reviews', href: '#reviews' },
    { name: 'Visit', href: '#visit' },
  ];

  return (
    <header
      className="sticky top-0 z-40 w-full transition-all duration-200"
      style={{
        backgroundColor: scrolled ? 'rgba(246, 241, 232, 0.92)' : 'transparent',
        borderBottom: scrolled ? '1px solid #E5DCC8' : '1px solid transparent',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
      }}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4 py-3">
          {/* Logo */}
          <a href="#top" className="flex items-center gap-2 font-serif text-lg font-medium text-wc-ink focus-visible:outline-2 focus-visible:outline-wc-accent">
            <svg width="20" height="20" viewBox="0 0 32 32" fill="none" className="text-wc-ink">
              <circle cx="16" cy="16" r="15" stroke="currentColor" strokeWidth="1.3" />
              <path d="M16 8 C 11 8, 9 12, 11 17 C 13 21, 16 22, 16 22 C 16 22, 19 21, 21 17 C 23 12, 21 8, 16 8 Z" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinejoin="round" />
              <path d="M16 13 V 21" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            <span>Prairie Oak</span>
          </a>

          {/* Desktop Navigation Link Items */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((l) => (
              <a 
                key={l.name} 
                href={l.href} 
                className="font-display font-medium text-sm text-wc-ink/80 hover:text-wc-ink transition focus-visible:outline-2 focus-visible:outline-wc-accent"
              >
                {l.name}
              </a>
            ))}
          </nav>

          {/* Right side CTAs */}
          <div className="flex items-center gap-4">
            <a 
              href="tel:+15875550142" 
              className="hidden lg:flex items-center gap-2 font-display text-sm font-semibold text-wc-ink/90 hover:text-wc-ink transition focus-visible:outline-2 focus-visible:outline-wc-accent"
            >
              📞 (587) 555-0142
            </a>

            <button
              onClick={scrollToForm}
              className="rounded-xl bg-wc-accent px-4 py-2 text-sm font-semibold text-white shadow-[0_6px_18px_rgba(217,119,87,0.25)] hover:brightness-[1.05] transition active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-wc-accent cursor-pointer"
            >
              {ctaText}
            </button>

            {/* Hamburger menu button for small viewport */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex items-center justify-center h-10 w-10 md:hidden rounded-lg hover:bg-wc-bg-alt/50 transition cursor-pointer"
              aria-expanded={mobileOpen}
              aria-label="Toggle mobile navigation menu"
            >
              {mobileOpen ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M4 7h16M4 12h16M4 17h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu dropdown sheet */}
      <div
        className={`overflow-hidden transition-all duration-300 md:hidden bg-wc-bg border-b border-wc-line ${
          mobileOpen ? 'max-h-[500px] opacity-100 py-3' : 'max-h-0 opacity-0'
        }`}
        style={{ transitionProperty: 'max-height, opacity' }}
      >
        <nav className="flex flex-col px-6">
          {navLinks.map((l) => (
            <a
              key={l.name}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="flex justify-between items-center py-4 border-b border-wc-line text-base font-medium text-wc-ink"
            >
              <span>{l.name}</span>
              <span className="text-wc-muted">➔</span>
            </a>
          ))}
          <a
            href="tel:+15875550142"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 py-4 text-wc-accent font-semibold text-base"
          >
            📞 (587) 555-0142
          </a>
        </nav>
      </div>
    </header>
  );
}
