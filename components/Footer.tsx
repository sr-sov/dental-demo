export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-wc-bg-alt border-t border-wc-line py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          
          {/* Logo & Description */}
          <div className="md:col-span-6 space-y-4">
            <a href="#top" className="flex items-center gap-2 font-serif text-lg font-semibold text-wc-ink">
              <svg width="20" height="20" viewBox="0 0 32 32" fill="none" className="text-wc-ink">
                <circle cx="16" cy="16" r="15" stroke="currentColor" strokeWidth="1.3" />
                <path d="M16 8 C 11 8, 9 12, 11 17 C 13 21, 16 22, 16 22 C 16 22, 19 21, 21 17 C 23 12, 21 8, 16 8 Z" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinejoin="round" />
                <path d="M16 13 V 21" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
              <span>Prairie Oak</span>
            </a>
            <p className="text-xs leading-relaxed text-wc-ink-soft max-w-sm">
              Prairie Oak Dental Studio is a locally-owned practice in south Calgary. We strictly adhere to the Alberta Dental Association Fee Guide to keep care accessible.
            </p>
          </div>

          {/* Quick links */}
          <div className="md:col-span-3 space-y-3">
            <h5 className="font-display text-[10px] font-bold tracking-wider text-wc-muted uppercase">
              Clinic
            </h5>
            <ul className="space-y-2 text-xs font-semibold text-wc-ink-soft">
              <li><a href="#services" className="hover:text-wc-ink transition">Care Paths</a></li>
              <li><a href="#why" className="hover:text-wc-ink transition">Comfort Menu</a></li>
              <li><a href="#about" className="hover:text-wc-ink transition">About Dr. Sarah</a></li>
              <li><a href="#faq" className="hover:text-wc-ink transition">Patient FAQ</a></li>
            </ul>
          </div>

          {/* Contact info */}
          <div className="md:col-span-3 space-y-3">
            <h5 className="font-display text-[10px] font-bold tracking-wider text-wc-muted uppercase">
              Get in Touch
            </h5>
            <ul className="space-y-2 text-xs font-semibold text-wc-ink-soft">
              <li><a href="tel:+15875550142" className="hover:text-wc-accent transition">📞 (587) 555-0142</a></li>
              <li><a href="sms:+15875550142" className="hover:text-wc-accent transition">💬 Text Us: (587) 555-0142</a></li>
              <li><a href="#visit" className="hover:text-wc-ink transition">📍 14025 Macleod Trail SE</a></li>
            </ul>
          </div>

        </div>

        {/* Legal Row */}
        <div className="mt-12 pt-6 border-t border-wc-line flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-semibold text-wc-muted uppercase tracking-wider">
          <div>
            © {currentYear} Prairie Oak Dental Studio. All rights reserved.
          </div>
          <div className="flex gap-4">
            <a href="#privacy" className="hover:text-wc-ink transition">Privacy Policy</a>
            <a href="#terms" className="hover:text-wc-ink transition">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
