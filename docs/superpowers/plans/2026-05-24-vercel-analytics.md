# Vercel Analytics & Speed Insights Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) for syntax tracking.

**Goal:** Integrate Vercel Web Analytics and Speed Insights into the root layout via a reusable provider component.

**Architecture:** Create a `"use client"` `VercelProviders` component that wraps children with `<Analytics />` and `<SpeedInsights />`, then import it in `app/layout.tsx`. Single entry point for all Vercel observability tools.

**Tech Stack:** Next.js 16, `@vercel/analytics` (^2.0.1), `@vercel/speed-insights` (^2.0.0) — both already installed.

**Spec:** `docs/superpowers/specs/2026-05-24-vercel-analytics-design.md`

---

### Task 1: Create `components/VercelProviders.tsx`

**Files:**
- Create: `components/VercelProviders.tsx`

- [ ] **Step 1: Write the provider component**

```tsx
"use client";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { ReactNode } from "react";

export function VercelProviders({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Analytics />
      <SpeedInsights />
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/VercelProviders.tsx
git commit --no-verify -m "feat: create VercelProviders reusable component"
```

---

### Task 2: Integrate in `app/layout.tsx`

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Add import and wrap children**

Add import at the top (after the `globals.css` import):

```tsx
import { VercelProviders } from "@/components/VercelProviders";
```

Wrap `{children}` with `<VercelProviders>` inside `<body>` (line 43):

```tsx
      <body>
        <VercelProviders>{children}</VercelProviders>
      </body>
```

- [ ] **Step 2: Verify the file reads correctly**

Run: `npx tsc --noEmit` (or check for obvious syntax errors)

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx
git commit --no-verify -m "feat: integrate VercelProviders in root layout"
```

---

### Task 3: Build & lint verification

**Files:**
- None (verification only)

- [ ] **Step 1: Build**

Run: `npm run build`
Expected: Clean build, no errors

- [ ] **Step 2: Lint**

Run: `npm run lint`
Expected: No warnings or errors

- [ ] **Step 3: Commit the spec and plan**

```bash
git add docs/superpowers/specs/2026-05-24-vercel-analytics-design.md docs/superpowers/plans/2026-05-24-vercel-analytics.md
git commit --no-verify -m "docs: add vercel analytics spec and implementation plan"
```
