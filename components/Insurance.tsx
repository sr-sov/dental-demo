export default function Insurance() {
  const insurers = [
    'Alberta Blue Cross', 'Sun Life', 'Manulife', 'Canada Life',
    'Pacific Blue Cross', 'Great-West Life', 'Green Shield', 'Desjardins',
  ];

  return (
    <section className="bg-surface py-14 lg:py-20" id="insurance">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-10">
          <span className="font-display text-xs font-semibold tracking-wider text-accent uppercase block mb-3">
            We bill them directly
          </span>
          <h2 className="font-serif text-3xl font-medium tracking-tight text-foreground md:text-4xl text-pretty max-w-2xl leading-tight">
            Your wallet stays in your bag.
          </h2>
          <p className="text-sm text-foreground-muted mt-2 leading-relaxed">
            We submit to all major providers. You only pay your co-pay on the day of treatment.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {insurers.map((name) => (
            <span
              key={name}
              className="font-display text-xs font-semibold px-4 py-2.5 rounded-full bg-white border border-line text-foreground-muted shadow-xs"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
