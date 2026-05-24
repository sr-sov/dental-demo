---
title: "Prairie Oak Dental Studio — Vercel Analytics & Speed Insights"
date: "2026-05-24"
author: "Antigravity"
UI Surface: no
Data Surface: no
---

# Design Spec: Vercel Analytics & Speed Insights Integration

Integrate Vercel Web Analytics and Speed Insights into the Prairie Oak Dental Studio landing page via a thin, reusable provider component.

## Design Decisions

- **Both Analytics and Speed Insights** — page views/visitors (Web Analytics) and Core Web Vitals monitoring (Speed Insights)
- **Reusable provider component** — `components/VercelProviders.tsx` as a `"use client"` wrapper, keeping the root layout clean and establishing a reusable component for future projects
- **No environment variables or config** — both packages work out of the box on Vercel; they are no-ops in local dev
- **Skip LHCI setup** — owned by the `production-hardening` worktree to avoid merge conflicts

## Architecture

```
app/layout.tsx
  └── <VercelProviders>
        ├── {children}
        ├── <Analytics />      (invisible — injects tracking script)
        └── <SpeedInsights />  (invisible — reports CWV)
```

- `VercelProviders` is the single integration point for all Vercel observability tools
- Located at `components/VercelProviders.tsx` for reusability across projects
- No state, props, or lifecycle beyond what the libraries provide internally

## Files Changed

| File | Action | Details |
|---|---|---|
| `components/VercelProviders.tsx` | **Create** | Client component wrapping children + Analytics + SpeedInsights |
| `app/layout.tsx` | **Edit** | Import `VercelProviders`, wrap `{children}` |

## Testing

- **Build:** `npm run build` passes
- **Lint:** `npm run lint` passes
- **Functional:** Deploy a Vercel preview, confirm Analytics dashboard populates and Speed Insights reports are received
- **No unit tests** — third-party libraries, no custom logic

## Out of Scope

- LHCI / Lighthouse CI (owned by `production-hardening` worktree)
- Custom event tracking or analytics beyond default page-view / CWV
- Any visible UI changes to the page
