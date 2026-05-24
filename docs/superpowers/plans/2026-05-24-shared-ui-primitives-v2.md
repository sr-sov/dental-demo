# Shared UI Primitives v2 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use agentic-os:subagent-driven-development (recommended) or agentic-os:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extract 7 reusable primitives with semantic tokens, rename `wc-*`→`semantic` tokens, refactor Comfort + FaqSection, ship a styleguide.

**Visual SSOT:**
- Design System: `./DESIGN.md`
- Mockups: none
- Figma/Artifacts: none

**Architecture:** Mechanical token rename across the entire codebase, then autonomous primitive files (RSC-neutral except Disclosure), then refactor two section components, then wire a `/styleguide` route for visual validation.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS v4, `cva` + `clsx` + `tailwind-merge` (~5 KB).

**Context:** This work is in a dedicated worktree at `.worktrees/ui-primitives`. The codebase is a single-page Prairie Oak Dental landing page with 15 section components. Primitives go in `components/ui/`, the `cn()` helper in `lib/cn.ts`.

---

### Task 1: Install dependencies

**Files:**
- Modify: `package.json`

- [x] **Step 1: Install cva, clsx, tailwind-merge**

```bash
npm install class-variance-authority@^0.7 clsx@^2 tailwind-merge@^2
```

Expected output: Added packages, no errors.

---

### Task 2: Create `lib/cn.ts`

**Files:**
- Create: `lib/cn.ts`

- [x] **Step 1: Write the helper**

```ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

### Task 3: Rename tokens in `app/globals.css`

**Files:**
- Modify: `app/globals.css`

- [x] **Step 1: Replace entire file with semantic token names**

See `app/globals.css` — all `wc-*` color variables renamed to `surface`, `surface-alt`, `surface-raised`, `surface-emphasis`, `foreground`, `foreground-muted`, `foreground-subtle`, `line`, `accent`, `accent-soft`, `gold`. Unused `--color-wc-surface-accent` and `--color-wc-accent-glow` removed. `@apply` directives updated. Zero `wc-` substrings remain.

---

### Task 4: Rename tokens across all component files + `app/page.tsx`

**Files:**
- Modify: All 15 files in `components/*.tsx`, `app/page.tsx`

- [x] **Step 1: Mechanical find-and-replace**

Run (longest match first to avoid partial collisions):

```bash
sed -i \
  -e 's/wc-bg-alt/surface-alt/g' \
  -e 's/wc-surface-accent/surface-accent/g' \
  -e 's/wc-accent-soft/accent-soft/g' \
  -e 's/wc-ink-soft/foreground-muted/g' \
  -e 's/wc-accent/accent/g' \
  -e 's/wc-ink/foreground/g' \
  -e 's/wc-muted/foreground-subtle/g' \
  -e 's/wc-bg/surface/g' \
  -e 's/wc-surface/surface-raised/g' \
  -e 's/wc-deep/surface-emphasis/g' \
  -e 's/wc-line/line/g' \
  -e 's/wc-gold/gold/g' \
  components/*.tsx app/page.tsx
```

Verify: `rg 'wc-' components/ app/page.tsx app/globals.css` returns nothing.

---

### Task 5: Create `Section` primitive

**Files:**
- Create: `components/ui/Section.tsx`

- [x] **Step 1: Write Section component**

```tsx
import { cn } from '@/lib/cn';

type SectionVariant = 'default' | 'alt' | 'emphasis';
type SectionSize = 'default' | 'compact' | 'tight';
type SectionTag = 'section' | 'header' | 'footer' | 'aside' | 'div';

interface SectionProps {
  id?: string;
  as?: SectionTag;
  variant?: SectionVariant;
  size?: SectionSize;
  className?: string;
  children?: React.ReactNode;
}

const variantClasses: Record<SectionVariant, string> = {
  default: 'bg-surface',
  alt: 'bg-surface-alt',
  emphasis: 'bg-surface-emphasis text-surface-raised',
};

const sizeClasses: Record<SectionSize, string> = {
  default: 'py-14 lg:py-20',
  compact: 'py-10 lg:py-16',
  tight: 'py-8 lg:py-12',
};

export function Section({
  id,
  as: Tag = 'section',
  variant = 'default',
  size = 'default',
  className,
  children,
}: SectionProps) {
  return (
    <Tag id={id} className={cn(variantClasses[variant], sizeClasses[size], className)}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {children}
      </div>
    </Tag>
  );
}
```

References: typography (font tokens in variant text), color (surface/surface-alt/surface-emphasis), spacing (padding/max-width).

---

### Task 6: Create `SectionHeader` primitive

**Files:**
- Create: `components/ui/SectionHeader.tsx`

- [x] **Step 1: Write SectionHeader component**

```tsx
import { cn } from '@/lib/cn';

type HeadingTag = 'h1' | 'h2' | 'h3';
type Align = 'left' | 'center';

interface SectionHeaderProps {
  eyebrow?: string;
  as?: HeadingTag;
  align?: Align;
  lede?: string;
  action?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

export function SectionHeader({
  eyebrow,
  as: Tag = 'h2',
  align = 'left',
  lede,
  action,
  className,
  children,
}: SectionHeaderProps) {
  return (
    <div className={cn(align === 'center' && 'text-center', className)}>
      {eyebrow && (
        <span className="font-display text-xs font-semibold tracking-wider text-accent uppercase block mb-3">
          {eyebrow}
        </span>
      )}
      <div className={cn(action && 'flex flex-col md:flex-row md:items-end md:justify-between gap-4')}>
        <div>
          <Tag className="font-serif text-3xl font-medium tracking-tight text-foreground md:text-4xl text-pretty leading-tight">
            {children}
          </Tag>
          {lede && (
            <p className="text-sm text-foreground-muted mt-2 leading-relaxed">
              {lede}
            </p>
          )}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
    </div>
  );
}
```

References: typography (eyebrow, heading, lede), color (accent, foreground, foreground-muted), spacing (mb-3, mt-2, gap-4).

---

### Task 7: Create `Button` primitive

**Files:**
- Create: `components/ui/Button.tsx`

- [x] **Step 1: Write Button component**

```tsx
import { cn } from '@/lib/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-surface-raised shadow-[0_10px_30px_color-mix(in_oklab,var(--color-accent)_25%,transparent)]',
  secondary: 'bg-surface-raised border border-line text-foreground hover:bg-surface-alt/50',
  ghost: 'bg-transparent border border-current/20 text-current',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-3 text-sm',
  lg: 'px-5 py-3.5 text-sm',
};

const alwaysOn =
  'rounded-xl font-semibold transition active:scale-[0.98] hover:brightness-[1.05] focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 inline-flex items-center justify-center gap-2';

interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children?: React.ReactNode;
}

type ButtonAsButton = ButtonBaseProps &
  Omit<React.ComponentPropsWithoutRef<'button'>, keyof ButtonBaseProps> & { href?: undefined };
type ButtonAsLink = ButtonBaseProps &
  Omit<React.ComponentPropsWithoutRef<'a'>, keyof ButtonBaseProps> & { href: string };
type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button({ variant = 'primary', size = 'md', className, children, ...props }: ButtonProps) {
  const classes = cn(alwaysOn, variantClasses[variant], sizeClasses[size], className);

  if ('href' in props && props.href) {
    const { href, ...rest } = props as ButtonAsLink;
    return <a href={href} className={classes} {...rest}>{children}</a>;
  }

  const { href: _omit, ...buttonProps } = props as ButtonAsButton;
  return <button className={classes} {...buttonProps}>{children}</button>;
}
```

No `'use client'`. RSC-neutral — server callers pass `href` for `<a>` links, client callers pass `onClick`.

References: color (accent, surface-raised, line, foreground, surface-alt), interaction (focus-visible, active:scale, hover:brightness, transition), typography (font-semibold, text-sm).

---

### Task 8: Create `TextLink` primitive

**Files:**
- Create: `components/ui/TextLink.tsx`

- [x] **Step 1: Write TextLink component**

```tsx
import { cn } from '@/lib/cn';

interface TextLinkProps extends React.ComponentPropsWithoutRef<'a'> {
  href: string;
  external?: boolean;
  children?: React.ReactNode;
}

export function TextLink({ href, external = false, className, children, ...props }: TextLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        'inline-flex items-center gap-2 font-display font-semibold text-sm text-foreground border-b border-foreground pb-0.5 hover:gap-4 transition focus-visible:outline-2 focus-visible:outline-accent',
        className,
      )}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...props}
    >
      {children} ➔
    </a>
  );
}
```

References: typography (font-display, font-semibold), color (foreground, accent), interaction (hover:gap-4, focus-visible).

---

### Task 9: Create `IconBadge` primitive

**Files:**
- Create: `components/ui/IconBadge.tsx`

- [x] **Step 1: Write IconBadge component**

```tsx
import { cn } from '@/lib/cn';

type IconBadgeSize = 'sm' | 'md' | 'lg';
type IconBadgeTone = 'soft' | 'solid' | 'subtle';

const sizeClasses: Record<IconBadgeSize, string> = { sm: 'h-7 w-7', md: 'h-8 w-8', lg: 'h-9 w-9' };
const toneClasses: Record<IconBadgeTone, string> = {
  soft: 'bg-accent-soft text-accent',
  solid: 'bg-accent text-surface-raised',
  subtle: 'bg-surface/40 text-foreground',
};

interface IconBadgeProps {
  size?: IconBadgeSize;
  tone?: IconBadgeTone;
  className?: string;
  children?: React.ReactNode;
}

export function IconBadge({ size = 'md', tone = 'soft', className, children }: IconBadgeProps) {
  return (
    <span className={cn('flex items-center justify-center rounded-full flex-shrink-0', sizeClasses[size], toneClasses[tone], className)}>
      {children}
    </span>
  );
}
```

References: color (accent-soft, accent, surface-raised, surface/40, foreground), spacing (h-7/8/9 w-7/8/9, rounded-full).

---

### Task 10: Create `Card` primitive

**Files:**
- Create: `components/ui/Card.tsx`

- [x] **Step 1: Write Card component**

```tsx
import { cn } from '@/lib/cn';

type CardVariant = 'default' | 'elevated' | 'inset' | 'emphasis';
type CardPadding = 'sm' | 'md' | 'lg';

const variantClasses: Record<CardVariant, string> = {
  default: 'rounded-2xl bg-surface-raised border border-line shadow-sm',
  elevated: 'rounded-2xl bg-surface-raised border border-line shadow-xl',
  inset: 'rounded-2xl bg-surface-alt border border-line',
  emphasis: 'rounded-3xl bg-surface-emphasis text-surface-raised shadow-xl',
};
const paddingClasses: Record<CardPadding, string> = { sm: 'p-5', md: 'p-6', lg: 'p-8' };

interface CardProps {
  variant?: CardVariant;
  padding?: CardPadding;
  interactive?: boolean;
  as?: React.ElementType;
  className?: string;
  children?: React.ReactNode;
}

export function Card({ variant = 'default', padding = 'md', interactive = false, as: Tag = 'div', className, children }: CardProps) {
  return (
    <Tag className={cn(variantClasses[variant], paddingClasses[padding], interactive && 'hover:translate-y-[-2px] hover:shadow-md transition-all duration-200', className)}>
      {children}
    </Tag>
  );
}
```

References: color (surface-raised, surface-alt, surface-emphasis, line), spacing (rounded-2xl/3xl, p-5/6/8), motion (hover:translate-y, transition-all duration-200).

---

### Task 11: Create `Disclosure` primitive

**Files:**
- Create: `components/ui/Disclosure.tsx`

- [x] **Step 1: Write Disclosure component**

```tsx
'use client';

import { useId } from 'react';
import { cn } from '@/lib/cn';

interface DisclosureProps {
  summary: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  id?: string;
  className?: string;
  children?: React.ReactNode;
}

export function Disclosure({ summary, open, onOpenChange, id: externalId, className, children }: DisclosureProps) {
  const generatedId = useId();
  const panelId = externalId ?? generatedId;

  return (
    <div className={cn('py-4', className)}>
      <button
        onClick={() => onOpenChange(!open)}
        className="w-full flex items-center justify-between text-left gap-4 py-2 font-serif text-lg font-semibold text-foreground focus-visible:outline-accent cursor-pointer"
        aria-expanded={open}
        aria-controls={panelId}
      >
        <span>{summary}</span>
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-surface/40 text-foreground transition-transform duration-200 flex-shrink-0"
          style={{ transform: open ? 'rotate(45deg)' : 'rotate(0)' }}
        >➕</span>
      </button>
      <div id={panelId} className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: open ? '200px' : '0', opacity: open ? 1 : 0 }}
      >
        <div className="text-sm leading-relaxed text-foreground-muted pt-2 pb-4 pr-10">{children}</div>
      </div>
    </div>
  );
}
```

Only primitive with `'use client'`. Controlled — parent owns state via `useState<number | null>`.

References: interaction (aria-expanded, aria-controls, focus-visible, click toggle), motion (transition-transform, transition-all, rotate).

---

### Task 12: Create barrel export

**Files:**
- Create: `components/ui/index.ts`

- [x] **Step 1: Write barrel re-exports**

```ts
export { Section } from './Section';
export { SectionHeader } from './SectionHeader';
export { Button } from './Button';
export { TextLink } from './TextLink';
export { IconBadge } from './IconBadge';
export { Card } from './Card';
export { Disclosure } from './Disclosure';
```

Named exports only. Consumer import: `import { Section, Card } from '@/components/ui'`.

---

### Task 13: Refactor `Comfort.tsx`

**Files:**
- Modify: `components/Comfort.tsx`

- [x] **Step 1: Replace bespoke markup with primitives**

```tsx
import { Section, SectionHeader, Card } from '@/components/ui';

export default function Comfort() {
  const items = [/* ... */];
  return (
    <Section id="why">
      <SectionHeader eyebrow="Why patients stay" lede="Everything below is included on every visit, no questions asked." className="mb-10">
        Comfort isn&rsquo;t an upgrade. It&rsquo;s the floor.
      </SectionHeader>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((c, i) => (
          <Card key={c.t} interactive>
            <span className="font-display text-xs font-semibold text-foreground-subtle block mb-4">0{i + 1}</span>
            <h3 className="font-serif text-lg font-semibold text-foreground mb-2 leading-snug">{c.t}</h3>
            <p className="text-xs text-foreground-muted leading-relaxed">{c.s}</p>
          </Card>
        ))}
      </div>
    </Section>
  );
}
```

Inner card content stays bespoke (not enough repetition to extract).

---

### Task 14: Refactor `FaqSection.tsx`

**Files:**
- Modify: `components/FaqSection.tsx`

- [x] **Step 1: Replace bespoke markup with primitives**

```tsx
'use client';
import { useState } from 'react';
import { Section, SectionHeader, TextLink, Disclosure } from '@/components/ui';

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);
  const FAQS = [/* ... */];
  return (
    <Section variant="alt" id="faq">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start lg:gap-16">
        <div className="lg:col-span-5 space-y-4">
          <SectionHeader eyebrow="Common questions" lede="If yours isn't here, our Calgary front desk replies to texts within an hour during the day.">
            The things people usually ask, up front.
          </SectionHeader>
          <TextLink href="sms:+15875550142">Text us a question</TextLink>
        </div>
        <div className="lg:col-span-7 divide-y divide-line border-t border-b border-line">
          {FAQS.map((f, i) => (
            <Disclosure key={f.q} summary={f.q} open={open === i} onOpenChange={(o) => setOpen(o ? i : null)}>
              {f.a}
            </Disclosure>
          ))}
        </div>
      </div>
    </Section>
  );
}
```

Grid stays bespoke — primitives compose into a macro-layout but don't dictate it.

---

### Task 15: Create styleguide route

**Files:**
- Create: `app/styleguide/page.tsx`
- Create: `app/styleguide/DisclosureDemo.tsx`

- [x] **Step 1: Create client wrapper for Disclosure demo**

```tsx
// app/styleguide/DisclosureDemo.tsx
'use client';
import { useState } from 'react';
import { Disclosure } from '@/components/ui';

const ITEMS = [
  { q: 'What is this?', a: 'A controlled accordion item.' },
  { q: 'Is it keyboard accessible?', a: 'Yes. Button is focusable via Tab, toggleable via Enter/Space.' },
  { q: 'Does it animate?', a: 'Smooth max-height and opacity transition.' },
];

export function DisclosureDemo() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-line border-t border-b border-line">
      {ITEMS.map((item, i) => (
        <Disclosure key={item.q} summary={item.q} open={open === i} onOpenChange={(o) => setOpen(o ? i : null)}>
          {item.a}
        </Disclosure>
      ))}
    </div>
  );
}
```

- [x] **Step 2: Create styleguide page**

```tsx
// app/styleguide/page.tsx
import { Section, SectionHeader, Button, TextLink, IconBadge, Card } from '@/components/ui';
import { DisclosureDemo } from './DisclosureDemo';

export const metadata = {
  title: 'Primitives Styleguide',
  robots: { index: false, follow: false },
};

export default function Styleguide() {
  return (
    <>
      {/* Section variants: default, alt, emphasis × default, compact, tight */}
      {/* Button: primary, secondary, ghost × sm, md, lg + link + disabled */}
      {/* TextLink: internal + external */}
      {/* IconBadge: sm/md/lg × soft/solid/subtle */}
      {/* Card: default, elevated, inset, emphasis + interactive */}
      {/* Disclosure: via DisclosureDemo client wrapper */}
    </>
  );
}
```

Server Component. Metadata marks it noindex. Disclosure rendered via the co-located client wrapper.

---

### Task 16: Create `app/robots.ts`

**Files:**
- Create: `app/robots.ts`

- [x] **Step 1: Write robots.ts**

```ts
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      disallow: '/styleguide',
    },
  };
}
```

---

### Task 17: Update `DESIGN.md` §1

**Files:**
- Modify: `DESIGN.md`

- [x] **Step 1: Rename token names in §1 color palette**

All `wc-bg`→`surface`, `wc-ink`→`foreground`, etc. No content changes — just the CSS variable names in the parenthesized labels. Also updates §4 button examples to use new token names for internal consistency.

---

### Task 18: Create `docs/PRIMITIVES.md`

**Files:**
- Create: `docs/PRIMITIVES.md`

- [x] **Step 1: Write documentation**

One usage example per primitive plus the four portability rules. See the file for the full content.

---

### Task 19: Build + lint verification

- [x] **Step 1: Run build**

```bash
npm run build
```

Expected: Routes `/`, `/robots.txt`, `/styleguide` all compile. No TypeScript errors.

- [x] **Step 2: Run lint**

```bash
npm run lint
```

Expected: Zero errors in `components/`, `app/`, `lib/`. Pre-existing warnings in `.agents/skills/impeccable/` are ignored.

- [x] **Step 3: Portability audit**

```bash
rg -r '' 'Prairie Oak|dental|Calgary' components/ui/   # → no matches
rg 'wc-' components/ui/ lib/ app/globals.css            # → no matches (already confirmed)
```
