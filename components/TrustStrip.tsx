export default function TrustStrip() {
  const badges = [
    { t: 'Direct insurance billing', s: 'We submit the paperwork. You pay your co-pay only.' },
    { t: 'Alberta Fee Guide', s: 'Standard rates. No surprise invoices, ever.' },
    { t: 'Free on-site parking', s: "And we're a 7-minute walk from the LRT." },
  ];

  return (
    <section className="bg-wc-bg pb-10 pt-0">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-wc-line rounded-2xl bg-white border border-wc-line overflow-hidden shadow-sm">
          {badges.map((b) => (
            <div key={b.t} className="flex gap-4 items-start p-6">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-wc-accent-soft text-wc-accent flex-shrink-0">
                ✓
              </div>
              <div>
                <h4 className="font-display font-semibold text-sm text-wc-ink">{b.t}</h4>
                <p className="text-xs text-wc-ink-soft mt-1 leading-relaxed">{b.s}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
