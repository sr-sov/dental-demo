# UI Primitives

Theme-portable primitives with semantic tokens. Each primitive is self-contained, imports only from `@/lib/cn` and React, references no project-specific names or hex codes.

## Portability Rules

1. **Self-contained.** Each primitive imports only from `lib/cn` and from React. No imports from other primitives, no imports from `@/components/*` outside `ui/`.
2. **Token-only theming.** No hex codes inside primitive code. The token contract in `globals.css` is the entire theming surface.
3. **Co-located variants.** Each primitive's `cva` (or equivalent) definition lives in the same file as the component — moving the file moves the styling.
4. **No project-name references.** Nothing in `components/ui/` mentions "Prairie Oak", "dental", or "Calgary."

## Usage

### Section

```tsx
import { Section } from '@/components/ui';

<Section id="about">
  {children}
</Section>

<Section variant="alt" size="compact">
  {children}
</Section>

<Section variant="emphasis" as="footer">
  {children}
</Section>
```

### SectionHeader

```tsx
import { SectionHeader } from '@/components/ui';

<SectionHeader
  eyebrow="Eyebrow label"
  lede="Optional sub-paragraph below the heading."
>
  Heading text
</SectionHeader>

<SectionHeader align="center" as="h1" action={<Button href="/cta">Action</Button>}>
  Centered with CTA
</SectionHeader>
```

### Button

```tsx
import { Button } from '@/components/ui';

<Button>Primary md</Button>
<Button variant="secondary" size="sm">Small secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button href="/page">Link button</Button>
<Button disabled>Disabled</Button>
```

### TextLink

```tsx
import { TextLink } from '@/components/ui';

<TextLink href="/page">Internal link</TextLink>
<TextLink href="https://example.com" external>External link</TextLink>
```

### IconBadge

```tsx
import { IconBadge } from '@/components/ui';

<IconBadge size="md" tone="soft"><svg>…</svg></IconBadge>
<IconBadge size="lg" tone="solid"><svg>…</svg></IconBadge>
<IconBadge tone="subtle">✓</IconBadge>
```

### Card

```tsx
import { Card } from '@/components/ui';

<Card variant="default" padding="md">
  {children}
</Card>

<Card variant="elevated" interactive>
  Hover lifts
</Card>

<Card variant="emphasis">
  Dark background card
</Card>
```

### Disclosure

```tsx
'use client';
import { useState } from 'react';
import { Disclosure } from '@/components/ui';

function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <>
      <Disclosure
        summary="Question?"
        open={open === 0}
        onOpenChange={(o) => setOpen(o ? 0 : null)}
      >
        Answer.
      </Disclosure>
    </>
  );
}
```
