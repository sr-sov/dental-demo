export default function Comfort() {
  const items = [
    { t: 'Weighted blankets', s: 'Gravity grounded, calm shoulders. Yours to keep on during the visit.' },
    { t: 'Noise-cancelling headphones', s: 'Bring your own playlist, or borrow ours.' },
    { t: 'Ceiling-mounted streaming', s: "Pick a show. We'll work below." },
    { t: 'Mild sedation, on request', s: 'For longer visits or higher anxiety. Talk to us — no judgment.' },
  ];

  return (
    <section className="bg-surface py-14 lg:py-20" id="why" role="region" aria-label="Comfort menu">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-10">
          <span className="font-display text-xs font-semibold tracking-wider text-accent uppercase block mb-3">
            Why patients stay
          </span>
          <h2 className="font-serif text-3xl font-medium tracking-tight text-foreground md:text-4xl text-pretty max-w-2xl leading-tight">
            Comfort isn’t an upgrade. It’s the floor.
          </h2>
          <p className="text-sm text-foreground-muted mt-2 leading-relaxed">
            Everything below is included on every visit, no questions asked.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((c, i) => (
            <div
              key={c.t}
              className="rounded-2xl bg-white border border-line p-6 shadow-sm hover:translate-y-[-2px] hover:shadow-md transition-all duration-200 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              <span className="font-display text-xs font-semibold text-foreground-subtle block mb-4">
                0{i + 1}
              </span>
              <h3 className="font-serif text-lg font-semibold text-foreground mb-2 leading-snug">
                {c.t}
              </h3>
              <p className="text-xs text-foreground-muted leading-relaxed">
                {c.s}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
