'use client';

import { useState } from 'react';
import { Section, SectionHeader, TextLink, Disclosure } from '@/components/ui';

interface FaqItem {
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    q: "I haven't been to the dentist in years. Will I be lectured?",
    a: "No. We mean it. We start with a no-judgement conversation, take a look at where you're at, and build a plan you're comfortable with — even if that means just the cleaning today, more another time.",
  },
  {
    q: 'How does direct billing work, exactly?',
    a: 'We submit the claim to your insurance during your visit. The provider pays us directly. You only pay your portion (usually 0–20%) on the day. No paperwork on your end.',
  },
  {
    q: 'Do you take new patients right now?',
    a: 'Yes. We hold space for new-patient visits every week and same-day emergency slots every day. Online intake takes about 4 minutes from your phone.',
  },
  {
    q: "My kid has never been to the dentist. What's the visit like?",
    a: "First visits for kids are 30 minutes, mostly play — counting teeth, riding the chair up and down, picking a sticker. No drilling, no sharp tools. We want them excited for the next one.",
  },
];

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section variant="alt" id="faq">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start lg:gap-16">
        <div className="lg:col-span-5 space-y-4">
          <SectionHeader
            eyebrow="Common questions"
            lede="If yours isn't here, our Calgary front desk replies to texts within an hour during the day."
          >
            The things people usually ask, up front.
          </SectionHeader>
          <TextLink href="sms:+15875550142">Text us a question</TextLink>
        </div>
        <div className="lg:col-span-7 divide-y divide-line border-t border-b border-line">
          {FAQS.map((f, i) => (
            <Disclosure
              key={f.q}
              summary={f.q}
              open={open === i}
              onOpenChange={(o) => setOpen(o ? i : null)}
            >
              {f.a}
            </Disclosure>
          ))}
        </div>
      </div>
    </Section>
  );
}
