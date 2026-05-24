import Image from 'next/image';
import { PhoneLink } from '@/components/ui';

interface HeroProps {
  ctaText: string;
}

export default function Hero({ ctaText }: HeroProps) {
  return (
    <section className="relative min-h-[80vh] flex items-center bg-surface-alt overflow-hidden" id="top">
      {/* Full-bleed background photo */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero_reception.webp"
          alt="Cozy residential-style dental reception area featuring warm wood walls and a fireplace nook"
          fill
          preload
          fetchPriority="high"
          sizes="100vw"
          quality={60}
          className="object-cover brightness-[0.98]"
        />
      </div>

      {/* Foreground Content Panel */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 w-full py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* The "Hearth Panel" — Asymmetric Solid Content Container */}
          <div className="lg:col-span-7 bg-white/98 shadow-2xl rounded-3xl p-8 lg:p-12 border border-line/40 max-w-2xl">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-foreground-subtle uppercase">
                <span className="h-[1px] w-5 bg-foreground-subtle block" />
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
                  className="rounded-xl bg-accent px-5 py-3.5 text-base font-bold text-white shadow-[0_10px_30px_rgba(217,119,87,0.25)] hover:brightness-[1.05] transition active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-accent flex justify-between items-center gap-2"
                >
                  <span>{ctaText}</span>
                  <span>➔</span>
                </a>
                <PhoneLink
                  number="+158****0142"
                  display="(587) 555-0142"
                  className="rounded-xl bg-white border border-line px-5 py-3.5 text-sm font-semibold text-foreground hover:bg-surface-alt/50 transition focus-visible:outline-2 focus-visible:outline-accent flex justify-between items-center gap-2"
                >
                  <span className="text-xs text-foreground-subtle">Same-day</span>
                </PhoneLink>
              </div>
              <div className="flex items-center gap-2 text-xs text-foreground-muted">
                <span className="text-gold text-lg">★★★★★</span>
                <span><b>4.9</b> · 312 reviews from south Calgary</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
