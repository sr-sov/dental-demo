import Image from 'next/image';

interface HeroProps {
  ctaText: string;
}

export default function Hero({ ctaText }: HeroProps) {
  return (
    <section className="bg-surface py-10 lg:py-16" id="top" role="region" aria-label="A calmer kind of dental visit">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
        {/* Text Content */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-foreground-subtle uppercase">
            <span className="h-[1px] w-5 bg-foreground-subtle block" aria-hidden="true" />
            Dental care · South Calgary
          </div>
          <h1 className="font-serif text-4xl font-medium tracking-tight text-foreground sm:text-5xl lg:text-6xl text-pretty leading-[1.05]">
            A calmer kind of dental visit.
          </h1>
          <p className="text-base sm:text-lg leading-relaxed text-foreground-muted max-w-xl">
            Modern dentistry that treats you like a person, not a procedure. Weighted blankets, direct billing, same-day emergencies.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="#book"
              className="rounded-xl bg-accent px-5 py-3.5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(217,119,87,0.25)] hover:brightness-[1.05] transition active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-accent flex justify-between items-center gap-2"
            >
              <span>{ctaText}</span>
              <span aria-hidden="true">➔</span>
            </a>
            <a
              href="tel:+15875550142"
              className="rounded-xl bg-white border border-line px-5 py-3.5 text-sm font-semibold text-foreground hover:bg-surface-alt/50 transition focus-visible:outline-2 focus-visible:outline-accent flex justify-between items-center gap-2"
            >
              <span className="flex items-center gap-2 text-accent">
                <span aria-hidden="true">📞</span> (587) 555-0142
              </span>
              <span className="text-xs text-foreground-subtle">Same-day</span>
            </a>
          </div>
          <div className="flex items-center gap-2 text-xs text-foreground-muted">
            <span className="text-gold text-lg" aria-hidden="true">★★★★★</span>
            <span><b>4.9</b> · 312 reviews from south Calgary</span>
          </div>
        </div>

        {/* Real Photo above fold with preload */}
        <div className="lg:col-span-5 relative w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-xl border border-line">
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
