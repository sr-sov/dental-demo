export default function Reviews() {
  const reviews = [
    {
      quote: "First dentist I've had in a decade who didn't make me feel ashamed for waiting. They handed me a blanket before I even sat down.",
      name: 'Megan T.',
      sub: 'Mahogany · New patient, 2025',
    },
    {
      quote: 'My six-year-old asked when his next cleaning was. I almost dropped my coffee. Worth every star.',
      name: 'Daniel R.',
      sub: 'Auburn Bay · Family patient',
    },
    {
      quote: 'Lost a filling on a Sunday night. They had me in by 9am Monday and I was out before lunch. Direct billed Sun Life on the spot.',
      name: 'Priya S.',
      sub: 'Seton · Emergency visit',
    },
    {
      quote: 'They actually explained what each line on the treatment plan was for. Felt like a conversation, not a sales pitch.',
      name: 'Owen K.',
      sub: 'Cranston · Returning patient',
    },
  ];

  return (
    <section className="bg-surface py-14 lg:py-20" id="reviews" role="region" aria-label="Patient reviews">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
          <div>
            <span className="font-display text-xs font-semibold tracking-wider text-accent uppercase block mb-3">
              What patients say
            </span>
            <h2 className="font-serif text-3xl font-medium tracking-tight text-foreground md:text-4xl text-pretty leading-tight">
              312 Google reviews. Here are a few.
            </h2>
          </div>
          <a
            href="https://google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-display font-semibold text-sm text-foreground border-b border-foreground pb-0.5 hover:gap-4 transition whitespace-nowrap"
          >
            Read all reviews ➔
          </a>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {reviews.map((r) => (
            <div
              key={r.name}
              className="flex flex-col justify-between rounded-2xl bg-white border border-line p-6 shadow-sm hover:translate-y-[-2px] hover:shadow-md transition-all duration-200 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              <div className="space-y-4">
                <div aria-hidden="true" className="text-gold text-sm">★★★★★</div>
                <p className="font-serif text-sm font-medium text-foreground leading-relaxed">
                  “{r.quote}”
                </p>
              </div>
              
              <div className="flex items-center gap-3 mt-6">
                <div aria-hidden="true" className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-soft text-accent text-xs font-bold font-display">
                  {r.name.split(' ').map((s) => s[0]).join('')}
                </div>
                <div>
                  <h4 className="font-display font-semibold text-xs text-foreground">
                    {r.name}
                  </h4>
                  <p className="text-[10px] text-foreground-subtle leading-normal mt-0.5">
                    {r.sub}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
