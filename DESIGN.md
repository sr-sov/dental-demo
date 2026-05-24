# Prairie Oak Dental Studio — Warm Clinical Design System

A modern, highly accessible, and premium design system tailored to Calgary's premier boutique dental clinic. Strips away clinical anxiety by leveraging residential warmth, clean typography, and a strict, professional slate-and-taupe two-chord color palette.

---

## 1. Color Palette

Our palette is carefully optimized for emotional comfort, visual hierarchy, and AA/AAA accessibility compliance.

### Theme Colors (Ground-Up Tailwind CSS v4 Mappings)
*   **Neutral Taupe Backdrop (`wc-bg`):** `#F6F1E8`
    *   *Usage:* Global canvas background. Simulates warm plaster and residential wood.
*   **Tinted Contrast (`wc-bg-alt`):** `#EFE7D7`
    *   *Usage:* Light structural background offsets, section alternates.
*   **Clinical Dental White (`wc-surface`):** `#FFFFFF`
    *   *Usage:* Content cards, review container backdrops, form inputs.
*   **Midnight Slate (`wc-deep`):** `#142233`
    *   *Usage:* High-contrast bands, dark footers, primary urgent CTA containers.
*   **Text Slate (`wc-ink`):** `#1F2E40`
    *   *Usage:* Headers, subtitles, maximum readability body text.
*   **Soft Secondary Gray (`wc-ink-soft`):** `#445567`
    *   *Usage:* Sub-captions, long-form paragraph body text.
*   **Muted Gray (`wc-muted`):** `#7A8593`
    *   *Usage:* Border lines, icon containers, secondary elements.
*   **Clay Orange Accent (`wc-accent`):** `#D97757`
    *   *Usage:* Primary call-to-action buttons, active states, focus indicator outline rings.
*   **Highlight Soft Orange (`wc-accent-soft`):** `#F4DDD2`
    *   *Usage:* Icon backdrop highlights, light alert cards.
*   **Warm Gold (`wc-gold`):** `#C9A464`
    *   *Usage:* Trust badges, stars, premium indicators.

---

## 2. Typography

We pair approachable geometric display fonts with highly legible body copy and premium human-centered serif accents.

*   **Display Font:** `Sora` (mapped to `var(--font-display)`)
    *   *Scale:*
        *   `lg:text-7xl` (72px, leading: 0.95) — Main Hero Heading
        *   `lg:text-4xl` (40px, leading: 1.05) — Major Section Headers
        *   `lg:text-2xl` (24px, leading: 1.1) — Card Titles
*   **Body Font:** `Manrope` (mapped to `var(--font-body)`)
    *   *Scale:*
        *   `text-base` (16px, leading: 1.5) — Primary readable paragraphs
        *   `text-sm` (14px, leading: 1.6) — Captions, tables, sub-texts
*   **Headline Accent Font:** `Crimson Pro` (mapped to `var(--font-serif)`)
    *   *Usage:* Used selectively on display headings to inject a high-end, bespoke boutique vibe (e.g. `font-serif italic font-medium`).

---

## 3. Spatial & Spacing System

Strict vertical rhythm and horizontal alignments are maintained using an 8px base grid system.

*   **Page Margins:**
    *   Mobile: `px-6` (24px)
    *   Tablet: `px-12` (48px)
    *   Desktop: `px-16` (64px)
*   **Section Gaps:**
    *   Mobile/Tablet: `py-14` (56px)
    *   Desktop: `py-20` (80px)
*   **Component Offsets:**
    *   Grid items: `gap-4` (16px) or `gap-6` (24px)
    *   Inner card padding: `p-6` (24px) or `p-8` (32px)

---

## 4. Interactive Components & Focus States

To comply with the Web Interface Guidelines, all interactive widgets follow standard usability patterns:

### Buttons (`.wc-btn`)
*   **Primary Accent Button:** `bg-wc-accent text-white font-semibold rounded-xl px-4 py-2.5 transition duration-150 active:scale-[0.98] hover:brightness-[1.05]`
*   **Secondary Ghost Button:** `bg-wc-surface border border-wc-line text-wc-ink font-semibold rounded-xl px-4 py-2.5 hover:bg-wc-bg-alt/50 transition`

### Focus Ring Indicator (`:focus-visible`)
*   Never use pure `outline-none` / `outline: none` without focus replacements.
*   Standard focus style across all buttons, anchors, and inputs:
    `focus-visible:outline-2 focus-visible:outline-wc-accent focus-visible:outline-offset-2`

### Accordions (FAQ & Service details)
*   Must define matching `aria-expanded` and `aria-controls` bindings.
*   Smooth CSS transition on `max-height` and opacity to prevent harsh visual jumps.
*   Interruptible CSS layout transitions.
