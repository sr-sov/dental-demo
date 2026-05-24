'use client';

import { useState } from 'react';
import { Disclosure } from '@/components/ui';

const ITEMS = [
  { q: 'What is this?', a: 'A controlled accordion item. Parent owns the state.' },
  { q: 'Is it keyboard accessible?', a: 'Yes. The button is focusable and toggleable via Enter/Space.' },
  { q: 'Does it animate?', a: 'Smooth max-height and opacity transition on open/close.' },
];

export function DisclosureDemo() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-line border-t border-b border-line">
      {ITEMS.map((item, i) => (
        <Disclosure
          key={item.q}
          summary={item.q}
          open={open === i}
          onOpenChange={(o) => setOpen(o ? i : null)}
        >
          {item.a}
        </Disclosure>
      ))}
    </div>
  );
}
