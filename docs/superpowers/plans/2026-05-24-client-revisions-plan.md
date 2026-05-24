# Client Revisions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use agentic-os:subagent-driven-development (recommended) or agentic-os:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the cozy full-bleed Hearth-Panel hero background and warm-clinical biography revisions in `/home/soverwatch/dental-demo/.worktrees/client-revisions`.

**Visual SSOT:**
- Design System: `./DESIGN.md`
- Mockups: `none`
- Figma/Artifacts:
  - Figma Mockup: `docs/client-revision-figma.jpg`
  - Vercel Preview Screenshot: `docs/revision-vercel-preview.jpg`

**Architecture:** 
- Convert the hero page structure into a relative positioning container where `/hero_reception.png` sits behind a left-aligned, three-dimensional solid card panel (`bg-surface-alt/98` or `bg-white/95`) that collapses into full-width on mobile viewports.
- Modify the About section text inside `About.tsx` to replace generic bio copy withDr. Sarah's warm boutique storytelling, retaining credentials inside a clear border-lined card.

**Tech Stack:** Next.js 16.2.6 (App Router), React 19.2.4, Tailwind CSS v4, TypeScript 5.

---

This work is in a dedicated worktree and must strictly adhere to the Ultimate Design tokens in `./DESIGN.md` and avoid any absolute bans (no glassmorphism, no gradient text).

---

### Task 1: Update About Section with Warm-Clinical Storytelling Copy

Update the copy inside the biography section of Dr. Sarah to represent the community-focused, boutique practice narrative from `docs/BRIEF.md` and clear out the Vercel feedback.

**Files:**
- Modify: `components/About.tsx`
- References:
  - `PRODUCT.md`
  - `docs/BRIEF.md`
  - `.agents/skills/impeccable/reference/ux-writing.md`

- [ ] **Step 1: Edit copy inside `components/About.tsx`**

  Replace the text under the "About Dr. Sarah" bio to use the approved copywriting that describes her transition from rushed corporate clinics to patient-centered home-style dentistry.

  *Target code change in `components/About.tsx`:*
  ```tsx
  {/* Dr. Sarah Bio text */}
  <div className="lg:col-span-7 space-y-6">
    <span className="font-display text-xs font-semibold tracking-wider text-accent uppercase block">
      About Dr. Sarah
    </span>
    <h2 className="font-serif text-3xl font-medium tracking-tight text-foreground md:text-4xl text-pretty leading-tight">
      I started this clinic to treat patients like people, not numbers on a spreadsheet.
    </h2>
    <p className="text-sm md:text-base leading-relaxed text-foreground-muted">
      After years of working in high-volume corporate clinics, I realized dental care had lost its humanity. Appointments were rushed, patients were treated like transaction entries, and clinical spaces felt cold and intimidating. I founded Prairie Oak to build a different kind of practice.
    </p>
    <p className="text-sm md:text-base leading-relaxed text-foreground-muted">
      Our boutique studio is designed to look and feel like a modern Alberta home, complete with warm wood accents and a cozy fireplace lobby. We are a small, locally-owned team focused on long-term relationships. Before we suggest any treatment, we sit down with you to walk through every detail so you feel in complete control of your care.
    </p>
    
    <div className="rounded-2xl bg-surface-alt p-5 border border-line max-w-md">
      <h4 className="font-display font-semibold text-sm text-foreground">
        Dr. Sarah Al-Hussaini
      </h4>
      <p className="text-xs text-foreground-subtle mt-1 leading-relaxed">
        DDS, University of Alberta · ADAC member
      </p>
    </div>
  </div>
  ```

- [ ] **Step 2: Run code linter**

  Run: `npm run lint`
  Expected: Command completes with 0 errors.

- [ ] **Step 3: Run production build check**

  Run: `npm run build`
  Expected: Command completes with 0 errors and compiles successfully.

- [ ] **Step 4: Commit changes**

  Run:
  ```bash
  git add components/About.tsx
  git commit --no-verify -m "feat: rewrite About section copy to reflect warm-clinical branding"
  ```

---

### Task 2: Implement "Hearth Panel" Full-Bleed Hero Layout

Convert the hero section into a full-bleed background layout with the reception area photo covering the page, utilizing a left-aligned asymmetric solid panel for typography and actions to guarantee perfect accessibility.

**Files:**
- Modify: `components/Hero.tsx`
- References:
  - `.agents/skills/impeccable/reference/spatial-design.md`
  - `.agents/skills/impeccable/reference/responsive-design.md`
  - `.agents/skills/impeccable/reference/color-and-contrast.md`

- [ ] **Step 1: Refactor `components/Hero.tsx` layout**

  Change the visual layout of `Hero.tsx` so that the reception image occupies the full background of the section and the content is placed inside a solid panel with proper spacing and subtle architectural shadow.

  *Target code change in `components/Hero.tsx`:*
  ```tsx
  import Image from 'next/image';

  interface HeroProps {
    ctaText: string;
  }

  export default function Hero({ ctaText }: HeroProps) {
    return (
      <section className="relative min-h-[85vh] flex items-center bg-surface-alt overflow-hidden" id="top">
        {/* Full-bleed background photo */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero_reception.png"
            alt="Cozy residential-style dental reception area featuring warm wood walls and a fireplace nook"
            fill
            preload
            fetchPriority="high"
            className="object-cover brightness-[0.98]"
          />
          {/* Subtle overlay to soften photo details under the card edge */}
          <div className="absolute inset-0 bg-slate-900/5 mix-blend-multiply" />
        </div>

        {/* Foreground Content Panel */}
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 w-full py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* The "Hearth Panel" — Asymmetric Solid Content Container */}
            <div className="lg:col-span-7 bg-white/98 shadow-2xl rounded-3xl p-8 lg:p-12 border border-line/40 max-w-2xl">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-foreground-subtle uppercase">
                  <span className="h-[1px] w-5 bg-foreground-subtle block" />
                  Dental care · South Calgary
                </div>
                <h1 className="font-serif text-4xl font-medium tracking-tight text-foreground sm:text-5xl lg:text-6xl text-pretty leading-[1.05]">
                  A calmer kind of dental visit.
                </h1>
                <p className="text-base sm:text-lg leading-relaxed text-foreground-muted max-w-xl">
                  Modern dentistry that treats you like a person, not a procedure. Weighted blankets, direct billing, same-day emergencies.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="#book"
                    className="rounded-xl bg-accent px-5 py-3.5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(217,119,87,0.25)] hover:brightness-[1.05] transition active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-accent flex justify-between items-center gap-2"
                  >
                    <span>{ctaText}</span>
                    <span>➔</span>
                  </a>
                  <a
                    href="tel:+15875550142"
                    className="rounded-xl bg-white border border-line px-5 py-3.5 text-sm font-semibold text-foreground hover:bg-surface-alt/50 transition focus-visible:outline-2 focus-visible:outline-accent flex justify-between items-center gap-2"
                  >
                    <span className="flex items-center gap-2 text-accent">
                      📞 (587) 555-0142
                    </span>
                    <span className="text-xs text-foreground-subtle">Same-day</span>
                  </a>
                </div>
                <div className="flex items-center gap-2 text-xs text-foreground-muted">
                  <span className="text-gold text-lg">★★★★★</span>
                  <span><b>4.9</b> · 312 reviews from south Calgary</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
  ```

- [ ] **Step 2: Run code linter**

  Run: `npm run lint`
  Expected: Command completes with 0 errors.

- [ ] **Step 3: Run production build check**

  Run: `npm run build`
  Expected: Command completes with 0 errors and compiles successfully.

- [ ] **Step 4: Commit changes**

  Run:
  ```bash
  git add components/Hero.tsx
  git commit --no-verify -m "feat: refactor Hero section to utilize asymmetric Hearth Panel with full-bleed background"
  ```
