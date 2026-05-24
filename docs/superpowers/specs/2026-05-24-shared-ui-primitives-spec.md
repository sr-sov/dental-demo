---
title: "Shared UI Primitives — Button, Section, Card, Heading, Input, Badge"
date: "2026-05-24"
author: "Brainstorming"
UI Surface: yes
Register: product
Scene: "A developer building a new landing page section, reaching for a Button or Card component instead of re-writing the same Tailwind classes for the fifth time."
Data Surface: no
---

# Spec: Shared UI Primitives — Button, Section, Card, Heading, Input, Badge

## Background

Every section component in the codebase repeats the same patterns. The `max-w-7xl mx-auto px-6 lg:px-8 py-14 lg:py-20` wrapper appears verbatim in 10+ components. Buttons are inline `<a>` and `<button>` elements with the same classes copied around. The h2 + accent-underline heading pattern is hand-written in 8 places. This isn't a design system problem — we have that in DESIGN.md and `globals.css` — it's a component-hierarchy problem. We have no primitives.

## Approaches Considered

**Option A — Inline forever:** Keep repeating classes. Zero effort, zero reuse. Rejected because it's tech debt that compounds with every new section.

**Option B — Extract six primitives:** Button, Section (wrapper), Card, Heading, Input, Badge. Each owns a single concern with a typed interface. Components compose them instead of repeating markup. This gives us a `components/ui/` directory that becomes the template library — reusable across projects.

**Option C — Integrate shadcn/ui:** Pull in the full CLI-based component system. Rejected because we already have a custom design system (Tailwind v4 `@theme` tokens). shadcn would fight our tokens, require adapters, and pull in Radix dependencies we don't need for a marketing site.

We landed on **Option B**.

## Design Decisions

### Component boundaries

| Component | Props | Responsibilities |
|---|---|---|
| `Button` | `variant` (primary/secondary/ghost), `size` (sm/md/lg), `asChild`, `href` (optional), plus standard HTML button/anchor attrs | Renders `<a>` when `href` provided, `<button>` otherwise. Applies `--color-wc-accent` variants using Tailwind theme tokens. Includes hover brighten, active scale, focus-visible ring. |
| `Section` | `id`, `variant` (default/alt/dark), `className`, `children` | Renders `<section>` with id, max-w-7xl container, responsive padding, and bg color from theme. |
| `Card` | `variant` (default/elevated), `padding` (sm/md/lg), `className`, `children` | Renders `<div>` with surface bg, border, rounded corners, optional shadow. |
| `Heading` | `as` (h1/h2/h3/h4), `align` (center/left), `showAccent`, `className`, `children` | Renders the heading tag with responsive text sizing. When `showAccent`, appends the decorative underline bar. |
| `Input` | `label`, `name`, `error`, `type`, plus standard input attrs | Renders `<label>` + `<input>` + optional error message. Applies focus ring and error border from theme. |
| `Badge` | `variant` (gold/outline), `children` | Renders a small pill with icon + label. Used in TrustStrip, Insurance. |

### File structure

```
components/
  ui/
    Button.tsx
    Section.tsx
    Card.tsx
    Heading.tsx
    Input.tsx
    Badge.tsx
    index.ts          ← barrel re-exports
```

No change to existing section components yet. This PR creates the primitives. A follow-up can refactor sections to consume them.

### Styling approach
All styling uses Tailwind utility classes referencing `wc-*` theme tokens. No CSS modules, no `styled-jsx`, no inline `style` objects. This keeps the design system as the single source of truth.

### TypeScript
Each component is typed with an explicit Props interface. We use `ComponentPropsWithoutRef` from React to extend native element attributes where appropriate (e.g., `Button` extends anchor/button attrs, `Input` extends input attrs).

## What We're Building

```
components/ui/
  Button.tsx        → variant, size, asChild, href
  Section.tsx       → id, variant, responsive wrapper
  Card.tsx          → variant, padding, surface container
  Heading.tsx       → as, align, showAccent, responsive sizing
  Input.tsx         → label, error, input attrs
  Badge.tsx         → variant, icon+label pill
  index.ts          → barrel export
```

No data changes. No section refactors. Pure additive — new primitives that nothing yet consumes.
