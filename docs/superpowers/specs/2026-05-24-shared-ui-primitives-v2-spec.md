---
title: "Shared UI Primitives v2 — Theme-Portable Primitives with Semantic Tokens"
date: "2026-05-24"
author: "Brainstorming"
UI Surface: yes
Register: product
Scene: "A developer building a new landing page section, reaching for a Button or Card component instead of re-writing the same Tailwind classes for the fifth time."
Data Surface: no
---

# Spec: Shared UI Primitives v2 — Theme-Portable Primitives with Semantic Tokens

## Background

The Prairie Oak landing page repeats the same Tailwind patterns across 13+ section components: the same `mx-auto max-w-7xl px-6 lg:px-8` wrapper, the same eyebrow + h2 + lede heading block (9 verbatim instances), the same icon-circle (5+ instances), the same accordion mechanics (FAQ and Services). The v1 spec correctly identified that primitives are needed but mis-cut the abstractions: it missed the most-repeated pattern (the eyebrow), missed the highest-complexity repetition (the accordion), proposed `Input` and `Badge` despite only one consumer each, and hardcoded the Warm Clinical palette directly into the primitive layer. That last point is the load-bearing problem — primitives that reference `bg-wc-bg` can't move to a different project without being rewritten, which defeats the goal of a reusable template library.

v2 rebuilds the spec around three corrections:

1. **Cut the right primitives** based on actual repetition counts (7, not 6).
2. **Decouple primitives from any specific palette** via a semantic-token layer.
3. **Validate the API in the same PR** by refactoring two real consumers and adding a styleguide route.

## Goals

- Extract 7 reusable primitives covering the patterns with ≥3 verbatim instances in the codebase.
- Rename color tokens from project-specific (`wc-*`) to semantic names (`surface`, `foreground`, `accent`, etc.) so primitives are theme-portable.
- Prove the API holds by refactoring `Comfort.tsx` and `FaqSection.tsx` to consume primitives.
- Ship a `/styleguide` route that renders every variant — both as validation and as the reference for future contributors.
- Keep `components/ui/` extraction-ready: any future move to a registry, package, or monorepo workspace should be a copy operation, not a rewrite.

## Non-Goals

- **Refactoring other sections** (Hero, About, Services, TrustStrip, Reviews, Insurance, Location, Emergency, FinalCta, Footer, Navbar, BookingForm). They get the token rename but keep their bespoke JSX. PRIMITIVES.md flags follow-up candidates.
- **`Input` and `Badge` primitives.** One consumer each today; deferred until a second appears.
- **`Accordion` group primitive.** Single-open behavior stays in parent state (`useState<number | null>`). Extracted when a third consumer of multi-item disclosure appears.
- **Distribution mechanism** (registry CLI, npm package, monorepo). Pattern-neutral by design; choose later.
- **Dark mode wiring.** Token contract is dark-mode-friendly, but `@media (prefers-color-scheme: dark)` mappings are deferred.
- **Spacing, radius, motion tokens.** Only color tokens get the semantic treatment in v1.
- **Test framework.** No runner exists in the repo. Spec does not add one.
- **Compound components** (`Card.Header`, `Card.Body`) and **polymorphic `as` on every primitive.** `as` is only on Section and Card where the audit showed real demand.

## Approaches Considered

### Reuse model

- **A — Fork-template (one theme).** Each new project forks/copies this repo as-is. DESIGN.md and primitives travel together with the Warm Clinical palette locked in. Rejected: clones with a different brand language require rewriting tokens, defeating the "every project improves the library" goal.
- **B — Theme-swap with semantic tokens** *(chosen)*. Primitives reference semantic names; each project rewires tokens to its own brand. Same primitives, different palettes. Improvements accumulate across brands.
- **C — Copy-paste / shadcn-style registry.** Each project owns its primitives, copy-paste from a registry repo. No shared theme. Rejected for *this* spec because (a) improvements wouldn't accumulate without a registry CLI and (b) building the registry is its own project. The four portability rules below keep this option open as a future move.

### Token layering

- **A — Single layer (rename `wc-*` once)** *(chosen)*. Replace `wc-*` with semantic names in `globals.css` and every component file. No permanent abstraction layer to maintain.
- **B — Two-layer (keep `wc-*`, add semantic as aliases).** Less churn now, permanent indirection forever. Rejected.

### Primitive scope

- **A — Lean 5.** Section, SectionHeader, Button, TextLink, IconBadge. Defers Card and Disclosure. Rejected: leaves the accordion duplicated.
- **B — Core 7** *(chosen)*. Adds Card and Disclosure. Covers every pattern with 3+ verbatim instances.
- **C — Full 9.** Adds Input and Badge despite one consumer each. Rejected as premature.

### RSC policy

- **A — Neutral by default, opt-in client** *(chosen)*. Primitives ship without `'use client'`. They work in both server and client trees because they contain only markup + Tailwind classes — no hooks, no browser APIs. The single exception is Disclosure, which uses `useState`. Button accepts `onClick` as a standard HTML attr; server callers don't pass it.
- **B — All primitives client-only.** Rejected: ships primitive code to the browser even for purely static pages.
- **C — Split Button into Button (RSC) + ActionButton (client).** Rejected: two names for one design concept.

### Variant runtime

- **A — `cva` + `tailwind-merge`** *(chosen)*. Typed variants, dedupe on `className` overrides, ~3 KB, shadcn idiom.
- **B — `tailwind-variants`.** More powerful but overkill.
- **C — Hand-rolled `clsx` + ternaries.** Gets tangled fast; no variant type inference.

### Distribution

Pattern-neutral. The spec doesn't commit to registry/package/monorepo. Whichever pattern the agency picks later, extraction is a copy operation as long as the four portability rules hold (see Design §3).

## Design

### 1. Token contract — semantic tokens replace `wc-*`

The current `app/globals.css` defines colors as `--color-wc-bg`, `--color-wc-ink`, etc. — names tied to the Warm Clinical brand. Primitives that reference these can't move to a different project without renaming.

v2 replaces those names with role-based semantic names. The hex values stay the same — only the variable names change. Tailwind v4's `@theme` directive then auto-generates `bg-surface`, `text-foreground`, etc.

```css
@import "tailwindcss";

@theme {
  --color-surface: #F6F1E8;          /* page background */
  --color-surface-alt: #EFE7D7;      /* alternating section background */
  --color-surface-raised: #FFFFFF;   /* cards, inputs */
  --color-surface-emphasis: #142233; /* dark bands (Emergency, FinalCta) */
  --color-foreground: #1F2E40;       /* primary text */
  --color-foreground-muted: #445567; /* body paragraphs */
  --color-foreground-subtle: #7A8593;/* captions */
  --color-line: #E5DCC8;             /* all borders */
  --color-accent: #D97757;           /* primary CTAs, focus rings */
  --color-accent-soft: #F4DDD2;      /* icon backdrops */
  --color-gold: #C9A464;             /* premium badges, stars */

  /* fonts unchanged */
  --font-display: var(--font-display);
  --font-body: var(--font-body);
  --font-serif: var(--font-serif);
}
```

Project #2 keeps `globals.css` structure and DESIGN.md §1, edits hex values, primitives keep working. **No mapping table to maintain.**

### 2. Primitive specifications

Each primitive is one file. Variants are typed via `cva`. Class merging via `cn()` from `lib/cn.ts`. No primitive imports another primitive.

#### `Section` — wrapper

| Prop | Type | Default | Notes |
|---|---|---|---|
| `id` | `string` | — | Anchor id for in-page nav |
| `as` | `'section' \| 'header' \| 'footer' \| 'aside' \| 'div'` | `'section'` | Element override |
| `variant` | `'default' \| 'alt' \| 'emphasis'` | `'default'` | `default` → `bg-surface`; `alt` → `bg-surface-alt`; `emphasis` → `bg-surface-emphasis text-surface-raised` |
| `size` | `'default' \| 'compact' \| 'tight'` | `'default'` | `default` → `py-14 lg:py-20`; `compact` → `py-10 lg:py-16`; `tight` → `py-8 lg:py-12` |
| `className` | `string` | — | Escape hatch; merged via `twMerge` |

Always wraps children in an inner `<div className="mx-auto max-w-7xl px-6 lg:px-8">`. RSC: neutral.

#### `SectionHeader` — eyebrow + heading + lede + optional action

| Prop | Type | Default | Notes |
|---|---|---|---|
| `eyebrow` | `string` | — | Small uppercase label above heading |
| `as` | `'h1' \| 'h2' \| 'h3'` | `'h2'` | Heading element |
| `align` | `'left' \| 'center'` | `'left'` | Text alignment |
| `lede` | `string` | — | Optional sub-paragraph below heading |
| `action` | `ReactNode` | — | Optional CTA rendered to the right of the heading block on desktop |
| `className` | `string` | — | Applied to the outer wrapper |
| `children` | `ReactNode` | — | Heading text |

Classes:
- Eyebrow: `font-display text-xs font-semibold tracking-wider text-accent uppercase block mb-3`
- Heading: `font-serif text-3xl font-medium tracking-tight text-foreground md:text-4xl text-pretty leading-tight`
- Lede: `text-sm text-foreground-muted mt-2 leading-relaxed`

RSC: neutral.

#### `Button` — anchor or button

| Prop | Type | Default | Notes |
|---|---|---|---|
| `variant` | `'primary' \| 'secondary' \| 'ghost'` | `'primary'` | |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | |
| `href` | `string` | — | When set, renders `<a>`; otherwise `<button>` |
| *(spread)* | `ComponentPropsWithoutRef<'a' | 'button'>` | — | Standard attrs including `onClick`, `type`, `disabled` |

Variants:
- `primary` → `bg-accent text-surface-raised shadow-[0_10px_30px_color-mix(in_oklab,var(--color-accent)_25%,transparent)]`
- `secondary` → `bg-surface-raised border border-line text-foreground hover:bg-surface-alt/50`
- `ghost` → `bg-transparent border border-current/20 text-current` (works on dark sections)

Always-on: `rounded-xl font-semibold transition active:scale-[0.98] hover:brightness-[1.05] focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2`

Sizes: `sm` → `px-4 py-2 text-sm`, `md` → `px-5 py-3 text-sm`, `lg` → `px-5 py-3.5 text-sm`

No `asChild`. RSC: neutral — `onClick` is preserved as a standard prop; server contexts simply don't fire it.

#### `TextLink` — underlined link with arrow animation

| Prop | Type | Default | Notes |
|---|---|---|---|
| `href` | `string` | — | Required |
| `external` | `boolean` | `false` | When `true`, adds `target="_blank" rel="noopener noreferrer"` |
| *(spread)* | `ComponentPropsWithoutRef<'a'>` | — | |
| `children` | `ReactNode` | — | Link text |

Classes: `inline-flex items-center gap-2 font-display font-semibold text-sm text-foreground border-b border-foreground pb-0.5 hover:gap-4 transition focus-visible:outline-2 focus-visible:outline-accent`

Renders children followed by ` ➔`. RSC: neutral.

#### `IconBadge` — circle with icon

| Prop | Type | Default | Notes |
|---|---|---|---|
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | `sm` → `h-7 w-7`, `md` → `h-8 w-8`, `lg` → `h-9 w-9` |
| `tone` | `'soft' \| 'solid' \| 'subtle'` | `'soft'` | `soft` → `bg-accent-soft text-accent`; `solid` → `bg-accent text-surface-raised`; `subtle` → `bg-surface/40 text-foreground` |
| `className` | `string` | — | |
| `children` | `ReactNode` | — | Icon or text glyph |

Always-on: `flex items-center justify-center rounded-full flex-shrink-0`. RSC: neutral.

#### `Card` — surface container

| Prop | Type | Default | Notes |
|---|---|---|---|
| `variant` | `'default' \| 'elevated' \| 'inset' \| 'emphasis'` | `'default'` | See below |
| `padding` | `'sm' \| 'md' \| 'lg'` | `'md'` | `sm` → `p-5`, `md` → `p-6`, `lg` → `p-8` |
| `interactive` | `boolean` | `false` | Adds `hover:translate-y-[-2px] hover:shadow-md transition-all duration-200` |
| `as` | `keyof JSX.IntrinsicElements` | `'div'` | |
| `className` | `string` | — | |
| `children` | `ReactNode` | — | |

Variants:
- `default` → `rounded-2xl bg-surface-raised border border-line shadow-sm`
- `elevated` → `rounded-2xl bg-surface-raised border border-line shadow-xl`
- `inset` → `rounded-2xl bg-surface-alt border border-line` (the About credential card)
- `emphasis` → `rounded-3xl bg-surface-emphasis text-surface-raised shadow-xl` (Emergency, StickyEmergencyBar dark pill)

RSC: neutral.

#### `Disclosure` — controlled accordion item

| Prop | Type | Default | Notes |
|---|---|---|---|
| `summary` | `ReactNode` | — | The visible heading (clickable) |
| `open` | `boolean` | — | **Controlled, required.** Parent owns state |
| `onOpenChange` | `(open: boolean) => void` | — | Required |
| `id` | `string` | auto | Used for `aria-controls`; auto-generated via `useId()` if not provided |
| `className` | `string` | — | Outer wrapper |
| `children` | `ReactNode` | — | Panel body, shown when `open` |

Renders a button with rotating `➕` icon, `aria-expanded`, `aria-controls`, smooth `max-height` + `opacity` transition on the panel.

RSC: **`'use client'`** — the only primitive that needs it, because of the onClick wiring and the `useId` hook.

**Controlled, not stateful.** Parents (FaqSection, Services) own a `useState<number | null>` and pass `open={current === i}` + `onOpenChange={(o) => setCurrent(o ? i : null)}` to each Disclosure. This is what enables single-open behavior without a heavier Accordion group component.

### 3. File structure & helper

```
app/
  globals.css                  — semantic tokens (renamed wc-* → semantic)
  styleguide/
    page.tsx                   — private styleguide route (noindex)
components/
  ui/
    Section.tsx                — RSC-neutral
    SectionHeader.tsx          — RSC-neutral
    Button.tsx                 — RSC-neutral
    TextLink.tsx               — RSC-neutral
    IconBadge.tsx              — RSC-neutral
    Card.tsx                   — RSC-neutral
    Disclosure.tsx             — 'use client'
    index.ts                   — barrel re-exports (named only, no default)
lib/
  cn.ts                        — twMerge + clsx helper
docs/
  PRIMITIVES.md                — one usage example per primitive
```

`lib/cn.ts`:

```ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

`components/ui/index.ts`:

```ts
export { Section } from './Section';
export { SectionHeader } from './SectionHeader';
export { Button } from './Button';
export { TextLink } from './TextLink';
export { IconBadge } from './IconBadge';
export { Card } from './Card';
export { Disclosure } from './Disclosure';
```

### Four portability rules

These rules keep `components/ui/` extraction-ready for any future distribution model. The acceptance criteria below enforce them.

1. **Self-contained.** Each primitive imports only from `lib/cn` and from React. No imports from other primitives, no imports from `@/components/*` outside `ui/`.
2. **Token-only theming.** No hex codes inside primitive code. The token contract in `globals.css` is the entire theming surface.
3. **Co-located variants.** Each primitive's `cva` definition lives in the same file as the component — moving the file moves the styling.
4. **No project-name references.** Nothing in `components/ui/` mentions "Prairie Oak", "dental", or "Calgary." A grep audit enforces this.

### New dependencies

```jsonc
// package.json
{
  "dependencies": {
    "class-variance-authority": "^0.7.x",
    "clsx": "^2.x",
    "tailwind-merge": "^2.x"
  }
}
```

~5 KB total in the bundle. No changes to `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, or `postcss.config.mjs`.

### 4. Validation strategy & migration

#### Step 1 — Token rename (mechanical)

Find-and-replace in `app/globals.css` and every `components/*.tsx` file. Longest match first to avoid partial collisions:

| Old token | New token |
|---|---|
| `wc-bg-alt` | `surface-alt` |
| `wc-bg` | `surface` |
| `wc-surface` | `surface-raised` |
| `wc-deep` | `surface-emphasis` |
| `wc-ink-soft` | `foreground-muted` |
| `wc-ink` | `foreground` |
| `wc-muted` | `foreground-subtle` |
| `wc-line` | `line` |
| `wc-accent-soft` | `accent-soft` |
| `wc-accent-glow` | (delete — single use; inline the rgba) |
| `wc-accent` | `accent` |
| `wc-gold` | `gold` |

Single commit. After this step, every existing component still renders identically — only token names changed.

#### Step 2 — Refactor `Comfort.tsx` (exercises Section + SectionHeader + Card)

```tsx
import { Section, SectionHeader, Card } from '@/components/ui';

export default function Comfort() {
  const items = [/* … */];
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
```

Inner card content stays bespoke — not enough repetition to extract.

#### Step 3 — Refactor `FaqSection.tsx` (exercises Disclosure + SectionHeader + TextLink)

```tsx
'use client';

import { useState } from 'react';
import { Section, SectionHeader, TextLink, Disclosure } from '@/components/ui';

const FAQS = [/* … */];

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
```

The grid stays bespoke — primitives compose into a macro-layout but don't dictate it. This validates Disclosure (the highest-risk primitive) in its real shape.

#### Step 4 — Styleguide route at `/styleguide`

`app/styleguide/page.tsx` renders one Section per primitive with every variant. Disclosure's demo lives in a co-located client wrapper (`app/styleguide/DisclosureDemo.tsx`) since the page itself is a Server Component.

```tsx
// app/styleguide/page.tsx
export const metadata = {
  title: 'Primitives Styleguide',
  robots: { index: false, follow: false },
};

export default function Styleguide() {
  return (
    <>
      <Section>
        <SectionHeader as="h1" eyebrow="Section">Section variants</SectionHeader>
        {/* show variant=default, alt, emphasis × size=default, compact, tight */}
      </Section>
      {/* one Section per primitive, every variant rendered */}
    </>
  );
}
```

Plus an entry in `app/robots.ts` disallowing `/styleguide`. The route is production-accessible but non-indexed and not linked from anywhere on the site.

### 5. Acceptance criteria

- [ ] 7 primitive files exist in `components/ui/` with the props/variants in §2
- [ ] `lib/cn.ts` exports the `cn()` helper
- [ ] `app/globals.css` `@theme` block uses semantic token names only — zero `wc-*` references anywhere in the repo
- [ ] Every existing `components/*.tsx` file compiles and renders identically after the token rename
- [ ] `components/Comfort.tsx` and `components/FaqSection.tsx` consume primitives as shown in §4
- [ ] `app/styleguide/page.tsx` renders every variant of every primitive (Disclosure via a co-located client wrapper)
- [ ] `app/robots.ts` and page metadata mark `/styleguide` as noindex
- [ ] `docs/PRIMITIVES.md` contains one minimal usage example per primitive plus the four portability rules
- [ ] `DESIGN.md` §1 reflects the new token names (rename-only, no content changes)
- [ ] `npm run build` and `npm run lint` pass
- [ ] Grep audit: no `"Prairie Oak"`, `"dental"`, or `"Calgary"` string inside `components/ui/`
- [ ] Grep audit: no `wc-` substring inside `components/ui/`, `lib/`, or `app/globals.css`

### Testing posture

No automated test framework is added in v1.

- **Visual validation**: open `/styleguide` in the browser. Every variant must render correctly on light and dark backgrounds.
- **Refactor validation**: open `/` and visually compare Comfort and FAQ before/after the refactor — they should be pixel-identical or very close. Any visual drift is a primitive bug, not an acceptable design change.
- **Bundle check**: `npm run build` reports per-route JS bundle sizes. After the change, `/` should not significantly grow — primitives are RSC-neutral; the only new client JS is Disclosure (used in FAQ).
- **A11y check**: tab through `/styleguide`. Every Button shows a focus ring; every Disclosure summary is keyboard-toggleable; FAQ's single-open behavior still works after refactor.

If/when a runner is added later (Vitest is the likely pick for Next 16), primitives are pure presentational and testable with React Testing Library.

## What We're Building

```
app/globals.css                — semantic tokens (renamed)
app/styleguide/page.tsx        — every variant, every primitive
app/robots.ts                  — disallow /styleguide

components/ui/Section.tsx      — wrapper with variant (default/alt/emphasis) + size + as
components/ui/SectionHeader.tsx— eyebrow + heading + lede + optional action
components/ui/Button.tsx       — anchor-or-button, variant + size, no asChild
components/ui/TextLink.tsx     — underlined link with arrow animation
components/ui/IconBadge.tsx    — circle with icon, size + tone variants
components/ui/Card.tsx         — surface container, 4 variants incl. emphasis
components/ui/Disclosure.tsx   — controlled accordion item, 'use client'
components/ui/index.ts         — named-only barrel re-exports

lib/cn.ts                      — twMerge + clsx helper

components/Comfort.tsx         — refactored to consume primitives
components/FaqSection.tsx      — refactored to consume primitives

docs/PRIMITIVES.md             — per-primitive examples + portability rules
DESIGN.md §1                   — token names updated (rename only)

package.json                   — cva, clsx, tailwind-merge added
```

Three new dependencies (~5 KB). One mechanical token rename. Seven new primitive files. Two refactored sections. One new private route. One new doc.

No section refactor beyond Comfort and FaqSection. No Input or Badge primitive. No registry, package, or monorepo extraction. No dark mode. No spacing/radius/motion tokens. No tests.

The primitives ship with all four portability rules enforced by acceptance criteria, so a future move to any distribution model is a copy operation.
