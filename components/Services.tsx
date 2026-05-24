'use client';

import { useState } from 'react';

interface Service {
  cat: string;
  title: string;
  tag: string;
  items: string[];
}

const SERVICES: Service[] = [
  {
    cat: '01',
    title: 'General & Preventive',
    tag: 'For every six months',
    items: ['Checkups & digital X-rays', 'Cleanings & hygiene plans', "Kids’ first visits"],
  },
  {
    cat: '02',
    title: 'Restorative & Same-Day',
    tag: 'When something hurts',
    items: ['Tooth-coloured fillings', 'Root canals & pain relief', 'Crowns, bridges, implants'],
  },
  {
    cat: '03',
    title: 'Cosmetic & Aligners',
    tag: "When you’re ready",
    items: ['In-office laser whitening', 'Porcelain veneers', 'Invisalign® clear aligners'],
  },
];

export default function Services() {
  const [expanded, setExpanded] = useState<number | null>(null);

  const scrollToForm = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="bg-surface-alt py-14 lg:py-20" id="services">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-10">
          <span className="font-display text-xs font-semibold tracking-wider text-accent uppercase block mb-3">
            Care, three ways
          </span>
          <h2 className="font-serif text-3xl font-medium tracking-tight text-foreground md:text-4xl text-pretty max-w-2xl leading-tight">
            Whatever brought you in, there’s a path.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:items-start">
          {SERVICES.map((s, i) => {
            const open = expanded === i;
            return (
              <div
                key={s.title}
                className="rounded-2xl bg-white border border-line overflow-hidden transition-all duration-200"
                style={{
                  boxShadow: open ? '0 14px 36px rgba(0,0,0,0.06)' : 'none',
                }}
              >
                <button
                  onClick={() => setExpanded(open ? null : i)}
                  className="w-full text-left p-6 relative flex flex-col justify-between items-stretch cursor-pointer focus-visible:outline-accent"
                  aria-expanded={open}
                  aria-controls={`service-panel-${i}`}
                >
                  <div className="flex justify-between items-baseline mb-3">
                    <span className="font-display text-xs font-semibold text-accent">{s.cat}</span>
                    <span className="text-xs italic text-foreground-subtle">{s.tag}</span>
                  </div>
                  <div className="font-serif text-xl font-semibold text-foreground pr-10">
                    {s.title}
                  </div>
                  <div 
                    className="absolute top-6 right-6 h-8 w-8 rounded-full bg-surface/40 flex items-center justify-center text-foreground transition-transform duration-200"
                    style={{ transform: open ? 'rotate(45deg)' : 'rotate(0)' }}
                  >
                    ➕
                  </div>
                </button>

                <div
                  id={`service-panel-${i}`}
                  className="overflow-hidden transition-all duration-300"
                  style={{
                    maxHeight: open ? '320px' : '0',
                    borderTop: open ? '1px solid #E5DCC8' : '1px solid transparent',
                  }}
                >
                  <ul className="p-6 space-y-3">
                    {s.items.map((it) => (
                      <li key={it} className="text-sm font-medium text-foreground-muted flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent flex-shrink-0" />
                        {it}
                      </li>
                    ))}
                  </ul>
                  <button 
                    onClick={scrollToForm} 
                    className="inline-flex items-center gap-2 mx-6 mb-6 font-display font-semibold text-xs text-foreground border-b border-foreground pb-0.5 hover:gap-4 transition cursor-pointer"
                  >
                    Learn more & book ➔
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
