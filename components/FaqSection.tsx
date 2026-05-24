'use client';

import { useState } from 'react';

interface FaqItem {
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    q: "I haven't been to the dentist in years. Will I be lectured?",
    a: "No. We mean it. We start with a no-judgement conversation, take a look at where you're at, and build a plan you're comfortable with — even if that means just the cleaning today, more another time.",
  },
  {
    q: 'How does direct billing work, exactly?',
    a: 'We submit the claim to your insurance during your visit. The provider pays us directly. You only pay your portion (usually 0–20%) on the day. No paperwork on your end.',
  },
  {
    q: 'Do you take new patients right now?',
    a: 'Yes. We hold space for new-patient visits every week and same-day emergency slots every day. Online intake takes about 4 minutes from your phone.',
  },
  {
    q: "My kid has never been to the dentist. What's the visit like?",
    a: "First visits for kids are 30 minutes, mostly play — counting teeth, riding the chair up and down, picking a sticker. No drilling, no sharp tools. We want them excited for the next one.",
  },
];

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-surface-alt py-14 lg:py-20" id="faq" role="region" aria-label="Frequently asked questions">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start lg:gap-16">
          {/* FAQ Head */}
          <div className="lg:col-span-5 space-y-4">
            <span className="font-display text-xs font-semibold tracking-wider text-accent uppercase block">
              Common questions
            </span>
            <h2 className="font-serif text-3xl font-medium tracking-tight text-foreground md:text-4xl text-pretty leading-tight">
              The things people usually ask, up front.
            </h2>
            <p className="text-sm leading-relaxed text-foreground-muted max-w-md">
              If yours isn’t here, our Calgary front desk replies to texts within an hour during the day.
            </p>
            <div className="pt-2">
              <a
                href="sms:+15875550142"
                className="inline-flex items-center gap-2 font-display font-semibold text-sm text-foreground border-b border-foreground pb-0.5 hover:gap-4 transition"
              >
                Text us a question <span aria-hidden="true">➔</span>
              </a>
            </div>
          </div>

          {/* FAQ List */}
          <div className="lg:col-span-7 divide-y divide-line border-t border-b border-line">
            {FAQS.map((f, i) => {
              const isOpen = open === i;
              return (
                <div key={f.q} className="py-4">
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full flex items-center justify-between text-left gap-4 py-2 font-serif text-lg font-semibold text-foreground focus-visible:outline-accent cursor-pointer"
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                  >
                    <span>{f.q}</span>
                    <span 
                      aria-hidden="true"
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-surface/40 text-foreground transition-transform duration-200 motion-reduce:transition-none"
                      style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0)' }}
                    >
                      ➕
                    </span>
                  </button>

                  <div
                    id={`faq-panel-${i}`}
                    className="overflow-hidden transition-all duration-300 motion-reduce:transition-none"
                    style={{
                      maxHeight: isOpen ? '200px' : '0',
                      opacity: isOpen ? 1 : 0,
                    }}
                  >
                    <p className="text-sm leading-relaxed text-foreground-muted pt-2 pb-4 pr-10">
                      {f.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
