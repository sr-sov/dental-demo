---
date: 2026-05-24
agent: antigravity/gemini-3.5-flash
tags: [feature, refactor, dynamic-embed]
related-commits: ["710fc76", "b7f50a1", "3029c0c", "af40350", "22bac11", "39cdabb"]
related-spec: docs/superpowers/specs/2026-05-24-calendly-integration-design.md
status: completed
---

# Chronological Narrative Log: Prairie Oak Dental Studio — Calendly Integration

## Objectives
Introduce a reusable, premium online scheduling integration using Calendly inline widgets in the Prairie Oak Dental Studio Next.js 16 landing page. The solution must capture Dr. Sarah's custom Anxiety-Free Comfort Menu options seamlessly, prevent schedule conflicts, and provide a dark-themed same-day urgent booking calendar inside the emergency promise banner.

## Context
The landing page repository is an App Router Next.js 16/React 19 structure utilizing strict HSL tokens in `DESIGN.md` (Midnight Slate, Neutral Taupe, Clay Orange) and custom components under `components/` (BookingForm, Emergency, etc.). 

## Chronological Journey & What I Tried

### 1. Planning & Spec Approval
*   **Design SSOT & Visual Discovery:** Established that the existing design system in `./DESIGN.md` would be used as-is.
*   **Reconciling Comfort Preferences:** Formulated a two-pronged strategy:
    *   Main booking card: dynamic 3-step intake-to-scheduling wizard prefilling Name, Email, and Comfort selections into Calendly's custom answers.
    *   Emergency banner: responsive desktop 2-column grid layout with a dark-themed inline embed pointing to dedicated same-day emergency slots.
*   **Finalization:** Created and successfully committed the Design Spec and Implementation Plan directly in the main workspace.

### 2. Isolated Git Worktree & WSL2 Turbopack Crash Fix
*   **Worktree Setup:** Attempted to set up the isolated worktree inside `.worktrees/feat-calendly-integration`.
*   **The SWC/Turbopack Crash Gotcha:** Running compilation checks crashed instantly with a `Bus error (core dumped)` with exit code 135.
*   **Root Cause Analysis:** Discovered that under WSL2/Node 24, Turbopack climbs up parent trees to infer workspace roots from `package-lock.json` and `.git` references. Because multiple massive worktrees are nested inside the parent project folder, Turbopack recursively scanned all parent worktrees' `node_modules`, leading to memory map/stack alignment crashes.
*   **Resolution:** Relocated the git worktree to the isolated **global directory** (`~/.config/superpowers/worktrees/dental-demo/feat-calendly-integration`), completely decoupling it from nested parent structures.
*   **Result:** Compiled 100% cleanly in under 3 seconds!

### 3. Implementation of Components
*   **`<CalendlyEmbed>`:** Built the core module with dynamic script singleton checks, dark/light theme skeleton loaders, strictly typed Window variables, and success postMessage scheduled detectors.
*   **`<BookingForm>`:** Refactored to a 3-step wizard with smooth transitions, comfort intake options, custom prefilled query strings, and custom badge confirmation successes.
*   **`<Emergency>`:** Refactored to a desktop 2-column container with dark inline embeds next to Calgary urgent care hotlines.

### 4. Quality Control & Pull Request
*   **Compilation & Lints:** Verified with `npm run lint` and `npm run build` — both completed with **0 errors**.
*   **PR Created:** Successfully pushed the branch and created Pull Request [#5](https://github.com/sr-sov/dental-demo/pull/5).
*   **Cleanup:** Successfully pruned the global worktree and verified the main workspace remains pristine.

---

## Dead Ends Encountered
*   *Nested Worktree Compilation:* Attempted configuration changes in `next.config.ts` (e.g. `turbopack.root`) inside the nested worktree to stop parent scanning, but Node 24 still crashed with Bus error. Global directory relocation was the only 100% reliable fix.
*   *Leading Spaces in Commits:* Multi-line git commits with leading indentation spaces hung in commit-msg validation hooks. Committing with clean header margins resolved it instantly.
