import Image from 'next/image';

interface HeroProps {
  ctaText: string;
}

export default function Hero({ ctaText }: HeroProps) {
  return (
    <section className="bg-wc-bg py-10 lg:py-16" id="top">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
        {/* Text Content */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-wc-muted uppercase">
            <span className="h-[1px] w-5 bg-wc-muted block" />
            Dental care · South Calgary
          </div>
          <h1 className="font-serif text-4xl font-medium tracking-tight text-wc-ink sm:text-5xl lg:text-6xl text-pretty leading-[1.05]">
            A calmer kind of dental visit.
          </h1>
          <p className="text-base sm:text-lg leading-relaxed text-wc-ink-soft max-w-xl">
            Modern dentistry that treats you like a person, not a procedure. Weighted blankets, direct billing, same-day emergencies.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="#book"
              className="rounded-xl bg-wc-accent px-5 py-3.5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(217,119,87,0.25)] hover:brightness-[1.05] transition active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-wc-accent flex justify-between items-center gap-2"
            >
              <span>{ctaText}</span>
              <span>➔</span>
            </a>
            <a
              href="tel:+15875550142"
              className="rounded-xl bg-white border border-wc-line px-5 py-3.5 text-sm font-semibold text-wc-ink hover:bg-wc-bg-alt/50 transition focus-visible:outline-2 focus-visible:outline-wc-accent flex justify-between items-center gap-2"
            >
              <span className="flex items-center gap-2 text-wc-accent">
                📞 (587) 555-0142
              </span>
              <span className="text-xs text-wc-muted">Same-day</span>
            </a>
          </div>
          <div className="flex items-center gap-2 text-xs text-wc-ink-soft">
            <span className="text-wc-gold text-lg">★★★★★</span>
            <span><b>4.9</b> · 312 reviews from south Calgary</span>
          </div>
        </div>

        {/* Real Photo above fold with preload */}
        <div className="lg:col-span-5 relative w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-xl border border-wc-line">
          <Image
            src="/hero_reception.png"
            alt="Cozy residential-style dental reception area featuring warm wood walls and a fireplace nook"
            fill
            preload
            fetchPriority="high"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
