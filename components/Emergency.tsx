export default function Emergency() {
  return (
    <section className="bg-wc-bg py-8 lg:py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-wc-deep p-8 shadow-xl md:p-12 lg:p-14">
          {/* Subtle warm glow background highlight */}
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-wc-accent/15 blur-3xl pointer-events-none" />
          
          <div className="relative max-w-2xl space-y-4">
            <span className="font-display text-xs font-semibold tracking-wider text-wc-accent uppercase block">
              Same-day promise
            </span>
            <h2 className="font-serif text-3xl font-medium tracking-tight text-white md:text-4xl leading-tight">
              Pain today? We’ll see you today.
            </h2>
            <p className="text-sm md:text-base leading-relaxed text-white/75 max-w-xl">
              We hold emergency slots open every single day. Call before 4pm and we guarantee an appointment before close.
            </p>
            <div className="pt-2">
              <a
                href="tel:+15875550142"
                className="inline-flex items-center gap-2 rounded-xl bg-wc-accent px-5 py-3 text-sm font-semibold text-white shadow-lg hover:brightness-[1.05] transition active:scale-[0.98]"
              >
                📞 Call (587) 555-0142
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
