'use client';

import CalendlyEmbed from './CalendlyEmbed';

export default function Emergency() {
  return (
    <section className="bg-surface py-8 lg:py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-surface-emphasis p-8 shadow-xl md:p-12 lg:p-14">
          {/* Subtle warm glow background highlight */}
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-accent/15 blur-3xl pointer-events-none" />

          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Urgent Guarantee Details */}
            <div className="lg:col-span-5 space-y-4">
              <span className="font-display text-xs font-semibold tracking-wider text-accent uppercase block">
                Same-day promise
              </span>
              <h2 className="font-serif text-3xl font-medium tracking-tight text-white md:text-4xl leading-tight">
                Pain today? We&rsquo;ll see you today.
              </h2>
              <p className="text-sm md:text-base leading-relaxed text-white/75">
                We hold emergency slots open every single day. Call before 4pm
                and we guarantee an appointment before close, or book an
                emergency slot online instantly.
              </p>
              <div className="pt-2">
                <a
                  href="tel:+158****0142"
                  className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white shadow-lg hover:brightness-[1.05] transition active:scale-[0.98]"
                >
                  📞 Call (587) 555-0142
                </a>
              </div>
            </div>

            {/* Right Column: Instant Emergency Scheduling Calendar */}
            <div className="lg:col-span-7 w-full h-[500px]">
              <CalendlyEmbed
                url="https://calendly.com/prairie-oak/emergency-care"
                theme="dark"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
