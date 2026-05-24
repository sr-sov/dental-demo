---
title: "Production Hardening — Security Headers, CI Gates, Quality Budgets"
date: "2026-05-24"
author: "Brainstorming"
UI Surface: no
Register: product
Scene: "A lead dev reviewing a PR before merge, wanting confidence that the site won't regress on performance, accessibility, or security."
Data Surface: no
---

# Spec: Production Hardening — Security Headers, CI Gates, Quality Budgets

## Background

We'd been shipping without any quality enforcement. The site looked good, Lighthouse was probably fine, but there was no proof, no gate, no config. We kicked around a few ideas for what "production-ready" actually means for a single-page marketing site — we're not building a SaaS, so we don't need complex infra. But we do need confidence that a future change won't crater performance or introduce basic security gaps.

## Approaches Considered

**Option A — Minimal:** Add a `next.config.ts` with security headers and call it done. No CI, no budgets, no enforcement. We rejected this because it solves nothing long-term. Headers are table stakes.

**Option B — Production hardening:** `next.config.ts` with security headers and image optimization, `vercel.json` for Vercel-level headers, Lighthouse CI with 90+ budgets on performance/a11y/SEO/best-practices, Playwright for cross-browser smoke tests, GitHub Actions running both on PR. A bit more setup but each piece is standard and well-documented.

**Option C — Full observability:** Everything in Option B plus Vercel Analytics, Speed Insights, Sentry, Datadog RUM. We rejected this as overkill for a marketing site. No user sessions to debug, no transactions to trace.

We landed on **Option B**.

## Design Decisions

### Security headers
Standard OWASP-recommended set: HSTS (2yr preload), X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy (blocking camera/mic/geo). Applied at both Next.js level (`next.config.ts`) and Vercel level (`vercel.json`) since Vercel respects its own headers over framework ones in certain edge cases.

### Image optimization
`next.config.ts` enables AVIF and WebP formats. The site already uses `next/image` with `fill` and `object-cover`, so this is just flipping the format switch.

### Lighthouse CI
Using `@lhci/cli` with 3-run median aggregation. Budgets at 90+ for all four categories. `temporary-public-storage` for upload so PR comments get a comparison link. The `lighthouserc.js` is JS export so we can tweak budgets without config-format headaches.

### Playwright
Five projects in the matrix: Chromium, Firefox, WebKit (desktop) + Pixel 5 and iPhone 13 (mobile). The `webServer` config handles build+serve so the test runner doesn't need a separate start step. Tests live in `e2e/` and start as basic smoke tests (page loads, sections render, nav works).

### CI flow
Lighthouse runs on PR only (slower, blocking). Playwright runs on both push to main and PR (faster, also blocking). Both use `npm ci` and the standard action setup — nothing custom.

## What We're Building

```
next.config.ts          → security headers + image format config
vercel.json             → Vercel-level security headers
lighthouserc.js         → Lighthouse budget config (90+ thresholds)
playwright.config.ts    → cross-browser test matrix
.github/workflows/
  lighthouse.yml        → LHCI on PR
  playwright.yml        → Playwright on push + PR
```

No runtime code changes. No UI changes. This is infrastructure that lives beside the app.
