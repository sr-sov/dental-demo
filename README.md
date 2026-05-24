# Prairie Oak Dental Studio — Calgary, AB

[![Lighthouse CI](https://github.com/sr-sov/dental-demo/actions/workflows/lighthouse.yml/badge.svg)](https://github.com/sr-sov/dental-demo/actions/workflows/lighthouse.yml)
[![Playwright E2E](https://github.com/sr-sov/dental-demo/actions/workflows/playwright.yml/badge.svg)](https://github.com/sr-sov/dental-demo/actions/workflows/playwright.yml)

**Live:** [dental-demo-ruddy-two.vercel.app](https://dental-demo-ruddy-two.vercel.app)

---

A warm, community-focused boutique dental landing page built from brief to live deployment in under a day. AI-assisted from research through design tokens, spec-driven implementation, and Lighthouse-gated CI. Designed to feel like a modern Alberta home — warm wood textures, natural light, cozy fireplace — not a sterile clinic.

## Lighthouse Scores

CI-verified, 3-run median. Updated every PR.

| Mobile | Desktop |
|--------|---------|
| ![Mobile](docs/lighthouse/lighthouse-mobile.jpg) | ![Desktop](docs/lighthouse/lighthouse-desktop.jpg) |

**Current thresholds:** Performance 90+ · Accessibility 90+ · Best Practices 79+ · SEO 90+

## Features

- **Calendly inline scheduling** — 3-step booking wizard (intake → schedule → confirmation) with postMessage error handling, theme-aware skeleton loader, and same-day emergency embed in dark theme
- **WCAG 2.1 AA accessibility** — skip-to-content, `aria-live` regions, keyboard-nav accordions, `prefers-reduced-motion` guards, `role="region"` landmarks on all 11 sections, decorative elements hidden from screen readers
- **JSON-LD structured data** — full `Dentist` schema with opening hours, address, phone, aggregate rating (4.9 / 312 reviews), and price range
- **SEO foundation** — dynamic `sitemap.xml`, `robots.txt`, Open Graph image generation (1200×630), Twitter cards, `en_CA` locale metadata
- **7 reusable UI primitives** — Button, Card, Disclosure, Section, SectionHeader, IconBadge, TextLink, PhoneLink — all polymorphic with variant/size props
- **CI/CD pipeline** — Lighthouse CI (90+ gates on perf/a11y/SEO), Playwright E2E (Chrome + Firefox + WebKit), GitHub Actions on every PR
- **Vercel Analytics** — production-ready with conditional loading (no console errors in local dev)

## Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19, Tailwind CSS v4, `next/font` |
| Language | TypeScript 5 (strict mode) |
| Scheduling | Calendly inline embed |
| Testing | Playwright (3 browsers), Lighthouse CI |
| Hosting | Vercel |

## Quick Start

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run lint       # ESLint (0 errors)
npm run test:e2e   # Playwright
npm run test:lighthouse  # LHCI (requires lighthouserc.js)
```

## Project Story

Prairie Oak Dental Studio was founded by **Dr. Sarah Al-Hussaini** after years in high-volume corporate clinics. The site translates her philosophy into digital form: comfort-first, transparent pricing (Alberta Dental Fee Guide), direct insurance billing, and same-day emergency guarantees.

Built AI-native from brief to deployment: Claude Code for vertical research and brand architecture, Hermes for spec-driven implementation orchestration, and a disciplined agentic loop — plan → design tokens → build → test → deploy — across 56+ commits and 7+ PRs.
