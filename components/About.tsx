import Image from 'next/image';

export default function About() {
  return (
    <section className="bg-wc-bg py-14 lg:py-20" id="about">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-16">
          
          {/* candid photo of Dr. Sarah */}
          <div className="lg:col-span-5 relative w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-xl border border-wc-line">
            <Image
              src="/dr_sarah.png"
              alt="Dr. Sarah Al-Hussaini smiling in a naturally lit modern dental studio"
              fill
              className="object-cover"
            />
          </div>

          {/* Dr. Sarah Bio text */}
          <div className="lg:col-span-7 space-y-6">
            <span className="font-display text-xs font-semibold tracking-wider text-wc-accent uppercase block">
              About Dr. Sarah
            </span>
            <h2 className="font-serif text-3xl font-medium tracking-tight text-wc-ink md:text-4xl text-pretty leading-tight">
              I started this clinic because I wanted to slow things down.
            </h2>
            <p className="text-sm md:text-base leading-relaxed text-wc-ink-soft">
              After eight years in high-volume corporate clinics, I opened Prairie Oak so I could spend the time each patient actually needs.
            </p>
            <p className="text-sm md:text-base leading-relaxed text-wc-ink-soft">
              We’re a small, locally-owned team. We won’t hand you a printed treatment plan until we’ve walked through every line of it with you.
            </p>
            
            <div className="rounded-2xl bg-wc-bg-alt p-5 border border-wc-line max-w-md">
              <h4 className="font-display font-semibold text-sm text-wc-ink">
                Dr. Sarah Al-Hussaini
              </h4>
              <p className="text-xs text-wc-muted mt-1 leading-relaxed">
                DDS, University of Alberta · ADAC member
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
