import Image from 'next/image';

export default function About() {
  return (
    <section className="bg-surface py-14 lg:py-20" id="about">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-16">
          
          {/* candid photo of Dr. Sarah */}
          <div className="lg:col-span-5 relative w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-xl border border-line">
            <Image
              src="/dr_sarah.png"
              alt="Dr. Sarah Al-Hussaini smiling in a naturally lit modern dental studio"
              fill
              className="object-cover"
            />
          </div>

          {/* Dr. Sarah Bio text */}
          <div className="lg:col-span-7 space-y-6">
            <span className="font-display text-xs font-semibold tracking-wider text-accent uppercase block">
              About Dr. Sarah
            </span>
            <h2 className="font-serif text-3xl font-medium tracking-tight text-foreground md:text-4xl text-pretty leading-tight">
              I started this clinic to treat patients like people, not numbers on a spreadsheet.
            </h2>
            <p className="text-sm md:text-base leading-relaxed text-foreground-muted">
              After years of working in high-volume corporate clinics, I realized dental care had lost its humanity. Appointments were rushed, patients were treated like transaction entries, and clinical spaces felt cold and intimidating. I founded Prairie Oak to build a different kind of practice.
            </p>
            <p className="text-sm md:text-base leading-relaxed text-foreground-muted">
              Our boutique studio is designed to look and feel like a modern Alberta home, complete with warm wood accents and a cozy fireplace lobby. We are a small, locally-owned team focused on long-term relationships. Before we suggest any treatment, we sit down with you to walk through every detail so you feel in complete control of your care.
            </p>
            
            <div className="rounded-2xl bg-surface-alt p-5 border border-line max-w-md">
              <h4 className="font-display font-semibold text-sm text-foreground">
                Dr. Sarah Al-Hussaini
              </h4>
              <p className="text-xs text-foreground-subtle mt-1 leading-relaxed">
                DDS, University of Alberta · ADAC member
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
