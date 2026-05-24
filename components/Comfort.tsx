import { Section, SectionHeader, Card } from '@/components/ui';

export default function Comfort() {
  const items = [
    { t: 'Weighted blankets', s: 'Gravity grounded, calm shoulders. Yours to keep on during the visit.' },
    { t: 'Noise-cancelling headphones', s: 'Bring your own playlist, or borrow ours.' },
    { t: 'Ceiling-mounted streaming', s: "Pick a show. We'll work below." },
    { t: 'Mild sedation, on request', s: 'For longer visits or higher anxiety. Talk to us — no judgment.' },
  ];

  return (
    <Section id="why">
      <SectionHeader
        eyebrow="Why patients stay"
        lede="Everything below is included on every visit, no questions asked."
        className="mb-10"
      >
        Comfort isn&rsquo;t an upgrade. It&rsquo;s the floor.
      </SectionHeader>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((c, i) => (
          <Card key={c.t} interactive>
            <span className="font-display text-xs font-semibold text-foreground-subtle block mb-4">
              0{i + 1}
            </span>
            <h3 className="font-serif text-lg font-semibold text-foreground mb-2 leading-snug">{c.t}</h3>
            <p className="text-xs text-foreground-muted leading-relaxed">{c.s}</p>
          </Card>
        ))}
      </div>
    </Section>
  );
}
