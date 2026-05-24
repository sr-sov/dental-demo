---
date: 2026-05-24
agent: antigravity/opencode
tags: [infrastructure, ci, security, quality]
related-spec: docs/superpowers/specs/2026-05-24-production-hardening-spec.md
status: completed
---

## Objectives

Add production-grade security headers, CI quality gates (Lighthouse, Playwright), and cross-browser test infrastructure to the Prairie Oak Dental site.

## Context

The codebase had no CI, no security headers, no Lighthouse enforcement, and no testing infrastructure. Everything was manual — deploy and hope.

## What I Built

### Security headers (`next.config.ts`, `vercel.json`)
- HSTS (2-year preload), X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy
- Image format optimization (AVIF + WebP) in next.config

### Lighthouse CI (`lighthouserc.js`, `.github/workflows/lighthouse.yml`)
- 3-run median aggregation with 90+ budgets on performance, accessibility, best-practices, SEO
- Runs on PR via GitHub Actions

### Playwright E2E (`playwright.config.ts`, `.github/workflows/playwright.yml`)
- 5-project matrix: Chromium, Firefox, WebKit, Pixel 5, iPhone 13
- Runs on push to main + PR

### Dependencies
- `@playwright/test` ^1.52
- `@lhci/cli` ^0.14

## Decisions

- **Vercel + Next.js dual headers**: Vercel respects its own headers over framework headers in edge cases, so both layers get the same set
- **temporary-public-storage** for Lighthouse upload: no paid account needed, still get PR comparison links
- **No visual regression (Percy/Chromatic)**: over-maintenance for a static marketing site that rarely changes

## Dead Ends

None. Straightforward config work.
