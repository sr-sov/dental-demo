import Image from 'next/image';

export default function Location() {
  const hours = [
    { d: 'Monday', h: '8 am – 6 pm' },
    { d: 'Tuesday', h: '8 am – 6 pm' },
    { d: 'Wednesday', h: '8 am – 8 pm' },
    { d: 'Thursday', h: '8 am – 8 pm' },
    { d: 'Friday', h: '8 am – 4 pm' },
    { d: 'Saturday', h: '9 am – 3 pm' },
    { d: 'Sunday', h: 'Emergency only' },
  ];

  return (
    <section className="bg-wc-bg py-14 lg:py-20" id="visit">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-16">
          
          {/* Studio info and Hours */}
          <div className="lg:col-span-6 space-y-8">
            <div>
              <span className="font-display text-xs font-semibold tracking-wider text-wc-accent uppercase block mb-3">
                Visit us
              </span>
              <h2 className="font-serif text-3xl font-medium tracking-tight text-wc-ink md:text-4xl text-pretty leading-tight">
                South Calgary, by the ridge.
              </h2>
            </div>

            <div className="space-y-6">
              {/* Address */}
              <div className="flex gap-4 items-start">
                <div className="text-xl mt-0.5">📍</div>
                <div>
                  <h4 className="font-display font-semibold text-sm text-wc-ink">
                    14025 Macleod Trail SE
                  </h4>
                  <p className="text-xs text-wc-muted mt-1 leading-relaxed">
                    Calgary, AB T2Y 0G6 · Free on-site parking
                  </p>
                </div>
              </div>

              {/* Hours Grid */}
              <div className="flex gap-4 items-start">
                <div className="text-xl mt-0.5">🕒</div>
                <div className="flex-1 max-w-sm">
                  <h4 className="font-display font-semibold text-sm text-wc-ink mb-3">
                    Studio Hours
                  </h4>
                  <dl className="grid grid-cols-2 gap-y-2 text-xs">
                    {hours.map((item) => (
                      <div key={item.d} className="contents">
                        <dt className="text-wc-ink-soft font-medium">{item.d}</dt>
                        <dd className="text-wc-muted text-right">{item.h}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Stylized Location Map Photo */}
          <div className="lg:col-span-6 relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border border-wc-line">
            <Image
              src="/office_map.png"
              alt="Map showing clinic location at 14025 Macleod Trail SE, South Calgary"
              fill
              className="object-cover"
            />
          </div>

        </div>
      </div>
    </section>
  );
}
