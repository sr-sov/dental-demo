'use client';
import { PhoneLink } from '@/components/ui';

import { useState, useEffect } from 'react';

export default function StickyEmergencyBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.5);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToForm = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      className={`fixed bottom-4 left-4 right-4 z-40 md:hidden rounded-2xl bg-surface-emphasis p-3 shadow-2xl border border-white/5 transition-all duration-300 motion-reduce:transition-none ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0'
      }`}
      style={{ transitionProperty: 'transform, opacity' }}
    >
      <div className="flex items-center justify-between gap-3">
<PhoneLink number="+158****0142" display="(587) 555-0142" className="flex items-center gap-3">
          <div aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-white font-bold">
            📞
          </div>
          <div>
            <h4 className="text-xs font-bold text-white leading-tight">Emergency? Call now</h4>
            <p className="text-[10px] text-white/75 mt-0.5">Same-day appointment guaranteed</p>
          </div>
        </PhoneLink>
        <button
          onClick={scrollToForm}
          className="rounded-xl bg-accent px-4 py-2 text-xs font-bold text-white hover:brightness-[1.05] transition active:scale-[0.98] cursor-pointer"
        >
          Book
        </button>
      </div>
    </div>
  );
}
