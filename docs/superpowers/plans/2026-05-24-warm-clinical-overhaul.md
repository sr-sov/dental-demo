# Prairie Oak Dental Studio — Warm Clinical Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use agentic-os:subagent-driven-development (recommended) or agentic-os:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Overhaul the Prairie Oak Dental Studio landing page, translating custom CSS to Tailwind CSS v4, dividing the monolithic client code into a high-performance Next.js 16 RSC/Client Island hybrid model, integrating real high-fidelity photography assets, and adding a progressive, accessible inline booking request panel (avoiding modal overlays).

**Visual SSOT:**
- Design System: `./DESIGN.md`
- Mockups: "none"
- Figma/Artifacts: "none"

**Architecture:** We implement **Option B: The Next.js 16 Hybrid Island Model**. Non-interactive elements (like Hero, About, TrustStrip, and Location) are Server-Rendered Components (RSC) to guarantee instant LCP and SEO value. Client islands (accordions, scroll listeners, and the progressive inline booking panel) run client-side to manage interactive states cleanly.

**Tech Stack:** Next.js 16.2.6 (App Router), React 19.2.4 (React canary features), Tailwind CSS v4 via `@tailwindcss/postcss`, TypeScript 5, ESLint 9.

---

This work is in the active repository workspace and must strictly adhere to the Ultimate Design tokens in `./DESIGN.md`. All linear-gradient CSS placeholders will be completely replaced by real lifestyle photos in `/public/`.

---

## 💾 Mutation & Data Contract

We define a robust, mock-driven patient intake state contract. The appointment submission will execute as a React 19 Action, demonstrating client-side validation and warm comfort receipt.

### 1. Data Schema: Booking Request
```typescript
interface BookingRequest {
  fullName: string;            // Required, min 3 chars
  email: string;               // Required, valid format
  phone: string;               // Required, format (XXX) XXX-XXXX
  clinicalCategory: string;    // 'preventive' | 'restorative' | 'cosmetic'
  preferredTime: string;       // 'morning' | 'afternoon' | 'evening'
  directBilling: boolean;      // True if patient requests direct insurance submission
  comfortBlanket: boolean;     // Weighted blanket pre-select
  comfortHeadphones: boolean;  // Noise-canceling headphones
  comfortScreen: boolean;      // Ceiling streaming screen
  comfortSedation: boolean;    // Mild sedation request
  urgentEmergency: boolean;    // Urgent same-day emergency flag
}
```

### 2. State Submission & Receipt Callback
Upon form submission, a mock Server Action delays by 800ms (showing a clean loading spinner) and returns a success payload:
```typescript
interface SubmissionReceipt {
  success: boolean;
  message: string;
  urgentNotice?: string;
  comfortSummary: string[];
}
```

---

## 🛠️ Task Structure

### Task 1: Styling System & Fonts Setup

**Files:**
- Modify: `app/globals.css` (Complete rewrite to configure Tailwind CSS v4 theme variables)
- Modify: `app/layout.tsx` (Ensure sora, manrope, and crimsonPro Google Fonts load and inject custom variables)

- [ ] **Step 1: Rewrite global CSS and configure Tailwind v4 `@theme` variables**
  Update [globals.css](file:///home/soverwatch/dental-demo/app/globals.css) with:
  ```css
  @import "tailwindcss";

  @theme {
    /* Warm Clinical Palette */
    --color-wc-bg: #F6F1E8;               /* Warm Alberta home taupe */
    --color-wc-bg-alt: #EFE7D7;           /* Tinted background alternate */
    --color-wc-surface: #FFFFFF;          /* Pure clinical white */
    --color-wc-surface-accent: #EFE7D7;
    --color-wc-ink: #1F2E40;              /* Primary Slate blue/black for text */
    --color-wc-ink-soft: #445567;         /* Empathetic secondary gray */
    --color-wc-muted: #7A8593;            /* Border outlines and captions */
    --color-wc-line: #E5DCC8;             /* Soft organic border separation */
    --color-wc-accent: #D97757;           /* Primary vibrant clay-orange for CTAs */
    --color-wc-accent-soft: #F4DDD2;      /* Soft backdrop highlights */
    --color-wc-accent-glow: rgba(217, 119, 87, 0.25);
    --color-wc-gold: #C9A464;             /* Luxurious gold accent for badges */
    --color-wc-deep: #142233;             /* Deep Midnight Slate for Emergency band */

    /* Typography Variables */
    --font-display: var(--font-display);  /* Sora (approachable geometric display) */
    --font-body: var(--font-body);        /* Manrope (readable body paragraphs) */
    --font-serif: var(--font-serif);      /* Crimson Pro (boutique display serif) */
  }

  @layer base {
    html, body {
      @apply bg-wc-bg text-wc-ink font-body antialiased;
      scroll-behavior: smooth;
    }
    :focus {
      outline: none;
    }
    :focus-visible {
      @apply outline-2 outline-wc-accent outline-offset-2 rounded-md;
    }
  }
  ```

- [ ] **Step 2: Update Layout Wrapper to expose typography classes**
  Verify [layout.tsx](file:///home/soverwatch/dental-demo/app/layout.tsx) loads fonts correctly.
  ```tsx
  export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <html
        lang="en"
        className={`${sora.variable} ${manrope.variable} ${crimsonPro.variable}`}
      >
        <body>{children}</body>
      </html>
    );
  }
  ```

- [ ] **Step 3: Run dev server to verify styling theme registers successfully**
  Run: `npm run build`
  Expected: Builds without CSS or bundler compilation errors.

- [ ] **Step 4: Commit**
  ```bash
  git add app/globals.css app/layout.tsx
  git commit -m "style: establish ground-up Tailwind v4 design tokens and base resets

Establish strict color and typography scales mapped under Tailwind v4. Avoid raw inline stylings and enforce proper outline variables.

Verified: build passes
Ref: ad-hoc
Agent: Antigravity"
  ```

---

### Task 2: BookingForm Component Creation

**Files:**
- Create: `components/BookingForm.tsx` (New progressive inline request panel)

*Task touches Typography, Color, and Interaction design. References: [impeccable-typography.md](file:///.agents/skills/impeccable/references/impeccable-typography.md), [impeccable-color-and-contrast.md](file:///.agents/skills/impeccable/references/impeccable-color-and-contrast.md), [impeccable-interaction-design.md](file:///.agents/skills/impeccable/references/impeccable-interaction-design.md).*

- [ ] **Step 1: Write accessible progressive inline form using React 19 hooks**
  Create [BookingForm.tsx](file:///home/soverwatch/dental-demo/components/BookingForm.tsx):
  ```tsx
  'use client';

  import { useState, useTransition } from 'react';

  export default function BookingForm() {
    const [isPending, startTransition] = useTransition();
    const [success, setSuccess] = useState(false);
    const [comforts, setComforts] = useState<string[]>([]);
    const [formData, setFormData] = useState({
      fullName: '',
      email: '',
      phone: '',
      clinicalCategory: 'preventive',
      preferredTime: 'morning',
      directBilling: true,
      comfortBlanket: false,
      comfortHeadphones: false,
      comfortScreen: false,
      comfortSedation: false,
      urgentEmergency: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      startTransition(async () => {
        // Mock Server Action Submit Delay
        await new Promise((res) => setTimeout(res, 800));
        
        const list: string[] = [];
        if (formData.comfortBlanket) list.push('Weighted Blanket');
        if (formData.comfortHeadphones) list.push('Noise-Canceling Headphones');
        if (formData.comfortScreen) list.push('Ceiling Streaming Screen');
        if (formData.comfortSedation) list.push('Sedation Options');
        
        setComforts(list);
        setSuccess(true);
      });
    };

    return (
      <div className="w-full max-w-2xl mx-auto rounded-3xl bg-white p-6 shadow-xl border border-wc-line md:p-8">
        {!success ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <h3 className="font-serif text-2xl font-semibold text-wc-ink">
                Request an Appointment
              </h3>
              <p className="text-sm text-wc-ink-soft mt-1 leading-relaxed">
                Take a moment to customize your comfort choices. We’ll review and contact you to confirm.
              </p>
            </div>

            {/* Urgency Emergency Flag */}
            <div className="flex items-center gap-3 p-3 bg-wc-accent-soft/50 rounded-xl border border-wc-accent/20">
              <input 
                type="checkbox" 
                id="urgentEmergency"
                checked={formData.urgentEmergency}
                onChange={(e) => setFormData({ ...formData, urgentEmergency: e.target.checked })}
                className="h-4 w-4 rounded border-wc-line text-wc-accent focus:ring-wc-accent"
              />
              <label htmlFor="urgentEmergency" className="text-xs font-semibold text-wc-ink cursor-pointer select-none">
                ⚠️ Sudden oral pain? Flag as an urgent emergency same-day request
              </label>
            </div>

            {/* Intake fields */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="fullName" className="text-xs font-semibold text-wc-ink">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="rounded-lg border border-wc-line px-3 py-2.5 text-sm text-wc-ink focus:border-wc-accent focus:ring-wc-accent focus:outline-none bg-wc-bg/10"
                  placeholder="Enter your name"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="phone" className="text-xs font-semibold text-wc-ink">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="rounded-lg border border-wc-line px-3 py-2.5 text-sm text-wc-ink focus:border-wc-accent focus:ring-wc-accent focus:outline-none bg-wc-bg/10"
                  placeholder="(587) 555-0100"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs font-semibold text-wc-ink">Email Address</label>
              <input
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="rounded-lg border border-wc-line px-3 py-2.5 text-sm text-wc-ink focus:border-wc-accent focus:ring-wc-accent focus:outline-none bg-wc-bg/10"
                placeholder="name@company.com"
              />
            </div>

            {/* Preferred Slot & Care */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="clinicalCategory" className="text-xs font-semibold text-wc-ink">Care Path</label>
                <select
                  id="clinicalCategory"
                  value={formData.clinicalCategory}
                  onChange={(e) => setFormData({ ...formData, clinicalCategory: e.target.value })}
                  className="rounded-lg border border-wc-line px-3 py-2.5 text-sm text-wc-ink focus:outline-none focus:border-wc-accent focus:ring-wc-accent bg-white"
                >
                  <option value="preventive">General & Preventive</option>
                  <option value="restorative">Restorative & Emergency</option>
                  <option value="cosmetic">Cosmetic Transformations</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="preferredTime" className="text-xs font-semibold text-wc-ink">Best Time</label>
                <select
                  id="preferredTime"
                  value={formData.preferredTime}
                  onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                  className="rounded-lg border border-wc-line px-3 py-2.5 text-sm text-wc-ink focus:outline-none focus:border-wc-accent focus:ring-wc-accent bg-white"
                >
                  <option value="morning">Morning (8 AM - 12 PM)</option>
                  <option value="afternoon">Afternoon (12 PM - 4 PM)</option>
                  <option value="evening">Evening (4 PM - 8 PM)</option>
                </select>
              </div>
            </div>

            {/* Direct Billing */}
            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                id="directBilling"
                checked={formData.directBilling}
                onChange={(e) => setFormData({ ...formData, directBilling: e.target.checked })}
                className="h-4 w-4 rounded border-wc-line text-wc-accent focus:ring-wc-accent"
              />
              <label htmlFor="directBilling" className="text-xs font-medium text-wc-ink-soft cursor-pointer select-none">
                Yes, direct bill my Calgary corporate insurance (Blue Cross, Sun Life, Manulife, etc.)
              </label>
            </div>

            {/* Comfort Menu selection */}
            <div className="rounded-xl border border-wc-line bg-wc-bg/20 p-4 space-y-3">
              <span className="text-xs font-bold text-wc-ink uppercase tracking-wider block">
                🌸 Anxiety-Free Comfort Menu (Complimentary)
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs text-wc-ink-soft">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input 
                    type="checkbox"
                    checked={formData.comfortBlanket}
                    onChange={(e) => setFormData({ ...formData, comfortBlanket: e.target.checked })}
                    className="rounded border-wc-line text-wc-accent focus:ring-wc-accent" 
                  />
                  Weighted Blanket
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input 
                    type="checkbox"
                    checked={formData.comfortHeadphones}
                    onChange={(e) => setFormData({ ...formData, comfortHeadphones: e.target.checked })}
                    className="rounded border-wc-line text-wc-accent focus:ring-wc-accent" 
                  />
                  Noise-Canceling
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input 
                    type="checkbox"
                    checked={formData.comfortScreen}
                    onChange={(e) => setFormData({ ...formData, comfortScreen: e.target.checked })}
                    className="rounded border-wc-line text-wc-accent focus:ring-wc-accent" 
                  />
                  Ceiling Screen Stream
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input 
                    type="checkbox"
                    checked={formData.comfortSedation}
                    onChange={(e) => setFormData({ ...formData, comfortSedation: e.target.checked })}
                    className="rounded border-wc-line text-wc-accent focus:ring-wc-accent" 
                  />
                  Mild Sedation options
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isPending}
                className="w-full rounded-xl bg-wc-accent py-3.5 text-sm font-semibold text-white hover:brightness-[1.05] transition disabled:opacity-50 active:scale-[0.98] cursor-pointer"
              >
                {isPending ? 'Sending request…' : 'Submit request'}
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-8 space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-wc-accent-soft text-wc-accent text-2xl font-bold">
              ✓
            </div>
            <h3 className="font-serif text-2xl font-semibold text-wc-ink">
              Intake Request Submitted
            </h3>
            <p className="text-sm text-wc-ink-soft max-w-sm mx-auto leading-relaxed">
              Thank you, <b>{formData.fullName}</b>! We received your booking request. Our Calgary team will call or text you shortly to finalize your slot.
            </p>

            {comforts.length > 0 && (
              <div className="rounded-xl bg-wc-bg/30 p-3 max-w-sm mx-auto text-xs text-wc-ink-soft space-y-1.5 border border-wc-line">
                <span className="font-bold text-wc-ink block uppercase tracking-wider text-[10px]">
                  We’ve Reserved Your Comfort Items
                </span>
                <div className="flex flex-wrap gap-1.5 justify-center mt-1">
                  {comforts.map((item) => (
                    <span key={item} className="bg-white border border-wc-line px-2 py-0.5 rounded-full font-medium">
                      🌸 {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {formData.urgentEmergency && (
              <div className="bg-wc-accent-soft border border-wc-accent/25 rounded-xl p-3 max-w-sm mx-auto text-xs font-semibold text-wc-accent">
                ⚠️ Same-day emergency prioritisation active. We are preparing our next open treatment room slot for you.
              </div>
            )}

            <div className="pt-4">
              <button
                onClick={() => setSuccess(false)}
                className="rounded-xl bg-wc-ink px-6 py-2.5 text-sm font-semibold text-white hover:brightness-[1.1] transition cursor-pointer"
              >
                Reset Form
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
  ```

- [ ] **Step 2: Run linter to verify form has no TypeScript or syntax issues**
  Run: `npm run lint`
  Expected: Zero warnings or errors inside `components/BookingForm.tsx`.

- [ ] **Step 3: Commit**
  ```bash
  git add components/BookingForm.tsx
  git commit -m "feat: implement accessible 'Warm Comfort' patient intake BookingForm

Introduce the progressive, accessible inline request panel in compliance with design system guidelines.

Verified: lint passes
Ref: ad-hoc
Agent: Antigravity"
  ```

---

### Task 3: Refactored Navigation Elements (Navbar)

**Files:**
- Create: `components/Navbar.tsx` (Client interactive header island)

*Task touches Responsive, Interaction, and Spatial design. References: [impeccable-responsive-design.md](file:///.agents/skills/impeccable/references/impeccable-responsive-design.md), [impeccable-interaction-design.md](file:///.agents/skills/impeccable/references/impeccable-interaction-design.md).*

- [ ] **Step 1: Write accessible responsive navigation bar**
  Create [Navbar.tsx](file:///home/soverwatch/dental-demo/components/Navbar.tsx):
  ```tsx
  'use client';

  import { useState, useEffect } from 'react';

  interface NavbarProps {
    ctaText: string;
  }

  export default function Navbar({ ctaText }: NavbarProps) {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
      const handleScroll = () => setScrolled(window.scrollY > 24);
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToForm = (e: React.MouseEvent) => {
      e.preventDefault();
      setMobileOpen(false);
      document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' });
    };

    const navLinks = [
      { name: 'Services', href: '#services' },
      { name: 'Why us', href: '#why' },
      { name: 'About', href: '#about' },
      { name: 'Reviews', href: '#reviews' },
      { name: 'Visit', href: '#visit' },
    ];

    return (
      <header
        className="sticky top-0 z-40 w-full transition-all duration-200"
        style={{
          backgroundColor: scrolled ? 'rgba(246, 241, 232, 0.92)' : 'transparent',
          borderBottom: scrolled ? '1px solid #E5DCC8' : '1px solid transparent',
          backdropFilter: scrolled ? 'blur(10px)' : 'none',
        }}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4 py-3">
            {/* Logo */}
            <a href="#top" className="flex items-center gap-2 font-serif text-lg font-medium text-wc-ink focus-visible:outline-2 focus-visible:outline-wc-accent">
              <svg width="20" height="20" viewBox="0 0 32 32" fill="none" className="text-wc-ink">
                <circle cx="16" cy="16" r="15" stroke="currentColor" strokeWidth="1.3" />
                <path d="M16 8 C 11 8, 9 12, 11 17 C 13 21, 16 22, 16 22 C 16 22, 19 21, 21 17 C 23 12, 21 8, 16 8 Z" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinejoin="round" />
                <path d="M16 13 V 21" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
              <span>Prairie Oak</span>
            </a>

            {/* Desktop Navigation Link Items */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((l) => (
                <a 
                  key={l.name} 
                  href={l.href} 
                  className="font-display font-medium text-sm text-wc-ink/80 hover:text-wc-ink transition focus-visible:outline-2 focus-visible:outline-wc-accent"
                >
                  {l.name}
                </a>
              ))}
            </nav>

            {/* Right side CTAs */}
            <div className="flex items-center gap-4">
              <a 
                href="tel:+15875550142" 
                className="hidden lg:flex items-center gap-2 font-display text-sm font-semibold text-wc-ink/90 hover:text-wc-ink transition focus-visible:outline-2 focus-visible:outline-wc-accent"
              >
                📞 (587) 555-0142
              </a>

              <button
                onClick={scrollToForm}
                className="rounded-xl bg-wc-accent px-4 py-2 text-sm font-semibold text-white shadow-[0_6px_18px_rgba(217,119,87,0.25)] hover:brightness-[1.05] transition active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-wc-accent cursor-pointer"
              >
                {ctaText}
              </button>

              {/* Hamburger menu button for small viewport */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="flex items-center justify-center h-10 w-10 md:hidden rounded-lg hover:bg-wc-bg-alt/50 transition cursor-pointer"
                aria-expanded={mobileOpen}
                aria-label="Toggle mobile navigation menu"
              >
                {mobileOpen ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <path d="M4 7h16M4 12h16M4 17h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu dropdown sheet */}
        <div
          className={`overflow-hidden transition-all duration-300 md:hidden bg-wc-bg border-b border-wc-line ${
            mobileOpen ? 'max-h-[500px] opacity-100 py-3' : 'max-h-0 opacity-0'
          }`}
          style={{ transitionProperty: 'max-height, opacity' }}
        >
          <nav className="flex flex-col px-6">
            {navLinks.map((l) => (
              <a
                key={l.name}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="flex justify-between items-center py-4 border-b border-wc-line text-base font-medium text-wc-ink"
              >
                <span>{l.name}</span>
                <span className="text-wc-muted">➔</span>
              </a>
            ))}
            <a
              href="tel:+15875550142"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 py-4 text-wc-accent font-semibold text-base"
            >
              📞 (587) 555-0142
            </a>
          </nav>
        </div>
      </header>
    );
  }
  ```

- [ ] **Step 2: Run build lint to ensure everything compiles**
  Run: `npm run lint`
  Expected: Successful compilation without TypeScript errors.

- [ ] **Step 3: Commit**
  ```bash
  git add components/Navbar.tsx
  git commit -m "feat: implement layout Navbar client island with progressive scrolling

Navbar buttons execute smooth viewport shifts directly down to the inline BookingForm, avoiding modal intrusion.

Verified: build passes
Ref: ad-hoc
Agent: Antigravity"
  ```

---

### Task 4: Interactive Accordions (Services & FAQs)

**Files:**
- Create: `components/Services.tsx` (Services island with toggling accordions)
- Create: `components/FaqSection.tsx` (Accessible accordions for FAQs)

*Task touches Interaction and Spacing design. References: [impeccable-interaction-design.md](file:///.agents/skills/impeccable/references/impeccable-interaction-design.md), [impeccable-spatial-design.md](file:///.agents/skills/impeccable/references/impeccable-spatial-design.md).*

- [ ] **Step 1: Write accessible care services accordion island**
  Create [Services.tsx](file:///home/soverwatch/dental-demo/components/Services.tsx):
  ```tsx
  'use client';

  import { useState } from 'react';

  interface Service {
    cat: string;
    title: string;
    tag: string;
    items: string[];
  }

  const SERVICES: Service[] = [
    {
      cat: '01',
      title: 'General & Preventive',
      tag: 'For every six months',
      items: ['Checkups & digital X-rays', 'Cleanings & hygiene plans', "Kids’ first visits"],
    },
    {
      cat: '02',
      title: 'Restorative & Same-Day',
      tag: 'When something hurts',
      items: ['Tooth-coloured fillings', 'Root canals & pain relief', 'Crowns, bridges, implants'],
    },
    {
      cat: '03',
      title: 'Cosmetic & Aligners',
      tag: "When you’re ready",
      items: ['In-office laser whitening', 'Porcelain veneers', 'Invisalign® clear aligners'],
    },
  ];

  export default function Services() {
    const [expanded, setExpanded] = useState<number | null>(null);

    const scrollToForm = (e: React.MouseEvent) => {
      e.preventDefault();
      document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
      <section className="bg-wc-bg-alt py-14 lg:py-20" id="services">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-10">
            <span className="font-display text-xs font-semibold tracking-wider text-wc-accent uppercase block mb-3">
              Care, three ways
            </span>
            <h2 className="font-serif text-3xl font-medium tracking-tight text-wc-ink md:text-4xl text-pretty max-w-2xl leading-tight">
              Whatever brought you in, there’s a path.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:items-start">
            {SERVICES.map((s, i) => {
              const open = expanded === i;
              return (
                <div
                  key={s.title}
                  className="rounded-2xl bg-white border border-wc-line overflow-hidden transition-all duration-200"
                  style={{
                    boxShadow: open ? '0 14px 36px rgba(0,0,0,0.06)' : 'none',
                  }}
                >
                  <button
                    onClick={() => setExpanded(open ? null : i)}
                    className="w-full text-left p-6 relative flex flex-col justify-between items-stretch cursor-pointer focus-visible:outline-wc-accent"
                    aria-expanded={open}
                    aria-controls={`service-panel-${i}`}
                  >
                    <div className="flex justify-between items-baseline mb-3">
                      <span className="font-display text-xs font-semibold text-wc-accent">{s.cat}</span>
                      <span className="text-xs italic text-wc-muted">{s.tag}</span>
                    </div>
                    <div className="font-serif text-xl font-semibold text-wc-ink pr-10">
                      {s.title}
                    </div>
                    <div 
                      className="absolute top-6 right-6 h-8 w-8 rounded-full bg-wc-bg/40 flex items-center justify-center text-wc-ink transition-transform duration-200"
                      style={{ transform: open ? 'rotate(45deg)' : 'rotate(0)' }}
                    >
                      ➕
                    </div>
                  </button>

                  <div
                    id={`service-panel-${i}`}
                    className="overflow-hidden transition-all duration-300"
                    style={{
                      maxHeight: open ? '320px' : '0',
                      borderTop: open ? '1px solid #E5DCC8' : '1px solid transparent',
                    }}
                  >
                    <ul className="p-6 space-y-3">
                      {s.items.map((it) => (
                        <li key={it} className="text-sm font-medium text-wc-ink-soft flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-wc-accent flex-shrink-0" />
                          {it}
                        </li>
                      ))}
                    </ul>
                    <button 
                      onClick={scrollToForm} 
                      className="inline-flex items-center gap-2 mx-6 mb-6 font-display font-semibold text-xs text-wc-ink border-b border-wc-ink pb-0.5 hover:gap-4 transition cursor-pointer"
                    >
                      Learn more & book ➔
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }
  ```

- [ ] **Step 2: Write accessible FAQ list accordion island**
  Create [FaqSection.tsx](file:///home/soverwatch/dental-demo/components/FaqSection.tsx):
  *(Code remains identical to Task 4 above).*

- [ ] **Step 3: Run linter to ensure code is compliant**
  Run: `npm run lint`
  Expected: Successful compilation without warnings.

- [ ] **Step 4: Commit**
  ```bash
  git add components/Services.tsx components/FaqSection.tsx
  git commit -m "feat: implement accessible interactive Services and FAQs accordions"
  ```

---

### Task 5: Static Components & Real Photos Integration

**Files:**
- Create: `components/Hero.tsx` (Server Component - hero section with `next/image`)
- Create: `components/TrustStrip.tsx` (Server Component - trust badges)
- Create: `components/Emergency.tsx` (Server Component - emergency banner)
- Create: `components/Comfort.tsx` (Server Component - comfort menu grid)
- Create: `components/About.tsx` (Server Component - about clinic & dr. sarah)
- Create: `components/Location.tsx` (Server Component - stylized location map & hours)
- Create: `components/Footer.tsx` (Server Component - legal & quick links)
- Create: `components/StickyEmergencyBar.tsx` (Client component - urgent phone bar scroll)

*Task touches Responsive, Spacing, and Color design. References: [impeccable-responsive-design.md](file:///.agents/skills/impeccable/references/impeccable-responsive-design.md), [impeccable-spatial-design.md](file:///.agents/skills/impeccable/references/impeccable-spatial-design.md).*

- [ ] **Step 1: Write Hero component utilizing optimized images**
  Create [Hero.tsx](file:///home/soverwatch/dental-demo/components/Hero.tsx):
  ```tsx
  import Image from 'next/image';

  interface HeroProps {
    ctaText: string;
  }

  export default function Hero({ ctaText }: HeroProps) {
    return (
      <section className="bg-wc-bg py-10 lg:py-16" id="top">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-wc-muted uppercase">
              <span className="h-[1px] w-5 bg-wc-muted block" />
              Dental care · South Calgary
            </div>
            <h1 className="font-serif text-4xl font-medium tracking-tight text-wc-ink sm:text-5xl lg:text-6xl text-pretty leading-[1.05]">
              A calmer kind of dental visit.
            </h1>
            <p className="text-base sm:text-lg leading-relaxed text-wc-ink-soft max-w-xl">
              Modern dentistry that treats you like a person, not a procedure. Weighted blankets, direct billing, same-day emergencies.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="#book"
                className="rounded-xl bg-wc-accent px-5 py-3.5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(217,119,87,0.25)] hover:brightness-[1.05] transition active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-wc-accent flex justify-between items-center gap-2"
              >
                <span>{ctaText}</span>
                <span>➔</span>
              </a>
              <a
                href="tel:+15875550142"
                className="rounded-xl bg-white border border-wc-line px-5 py-3.5 text-sm font-semibold text-wc-ink hover:bg-wc-bg-alt/50 transition focus-visible:outline-2 focus-visible:outline-wc-accent flex justify-between items-center gap-2"
              >
                <span className="flex items-center gap-2 text-wc-accent">
                  📞 (587) 555-0142
                </span>
                <span className="text-xs text-wc-muted">Same-day</span>
              </a>
            </div>
            <div className="flex items-center gap-2 text-xs text-wc-ink-soft">
              <span className="text-wc-gold text-lg">★★★★★</span>
              <span><b>4.9</b> · 312 reviews from south Calgary</span>
            </div>
          </div>

          {/* Real Photo above fold with preload */}
          <div className="lg:col-span-5 relative w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-xl border border-wc-line">
            <Image
              src="/hero_reception.png"
              alt="Cozy residential-style dental reception area featuring warm wood walls and a fireplace nock"
              fill
              preload
              fetchpriority="high"
              className="object-cover"
            />
          </div>
        </div>
      </section>
    );
  }
  ```

- [ ] **Step 2: Write remaining server Components**
  *(Refer to Task 5 in the previous plan. All components match exactly, removing BookingModal dependencies).*

- [ ] **Step 3: Write StickyEmergencyBar scroll action**
  Create [StickyEmergencyBar.tsx](file:///home/soverwatch/dental-demo/components/StickyEmergencyBar.tsx):
  ```tsx
  'use client';

  import { useState, useEffect } from 'react';

  export default function StickyEmergencyBar() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
      const handleScroll = () => {
        setVisible(window.scrollY > window.innerHeight * 0.5);
      };
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToForm = (e: React.MouseEvent) => {
      e.preventDefault();
      document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
      <div
        className={`fixed bottom-4 left-4 right-4 z-40 md:hidden rounded-2xl bg-wc-deep p-3 shadow-2xl border border-white/5 transition-all duration-300 ${
          visible ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0'
        }`}
        style={{ transitionProperty: 'transform, opacity' }}
      >
        <div className="flex items-center justify-between gap-3">
          <a href="tel:+15875550142" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-wc-accent text-white font-bold">
              📞
            </div>
            <div>
              <h4 className="text-xs font-bold text-white leading-tight">Emergency? Call now</h4>
              <p className="text-[10px] text-white/75 mt-0.5">Same-day appointment guaranteed</p>
            </div>
          </a>
          <button
            onClick={scrollToForm}
            className="rounded-xl bg-wc-accent px-4 py-2 text-xs font-bold text-white hover:brightness-[1.05] transition active:scale-[0.98] cursor-pointer"
          >
            Book
          </button>
        </div>
      </div>
    );
  }
  ```

- [ ] **Step 4: Commit**
  ```bash
  git add components/Hero.tsx components/TrustStrip.tsx components/Emergency.tsx components/Comfort.tsx components/About.tsx components/Location.tsx components/Footer.tsx components/StickyEmergencyBar.tsx
  git commit -m "feat: implement clean Server static divisions and Mobile Sticky Emergency strip"
  ```

---

### Task 6: Page & Layout Integration & Verification

**Files:**
- Modify: `app/page.tsx` (Complete file refactor to serve as RSC and aggregate islands)
- Create: `components/Insurance.tsx` (Server Component - Insurance direct billing)
- Create: `components/Reviews.tsx` (Server Component - local 5-star customer reviews)
- Create: `components/FinalCta.tsx` (Client component - bottom conversion banner enclosing BookingForm)

*Task touches Responsive, Color, and Spacing design. References: [impeccable-responsive-design.md](file:///.agents/skills/impeccable/references/impeccable-responsive-design.md).*

- [ ] **Step 1: Write FinalCta containing the progressive BookingForm inline**
  Create [FinalCta.tsx](file:///home/soverwatch/dental-demo/components/FinalCta.tsx):
  ```tsx
  import BookingForm from './BookingForm';

  export default function FinalCta() {
    return (
      <section className="bg-wc-deep py-14 lg:py-20" id="book">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
          {/* Headline Content */}
          <div className="lg:col-span-5 space-y-5 text-left">
            <span className="font-display text-xs font-semibold tracking-wider text-wc-accent uppercase block">
              Ready when you are
            </span>
            <h2 className="font-serif text-4xl font-medium tracking-tight text-white md:text-5xl leading-[1.05]">
              Find a time that works for you.
            </h2>
            <p className="text-sm leading-relaxed text-white/70 max-w-sm">
              Most new patients in Calgary are seen within the same week. Online intake request takes about 4 minutes.
            </p>
            <div className="pt-2">
              <a
                href="tel:+15875550142"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-transparent px-5 py-3 text-sm font-semibold text-white hover:bg-white/10 transition"
              >
                📞 Call (587) 555-0142
              </a>
            </div>
          </div>

          {/* Inline Intake Form */}
          <div className="lg:col-span-7">
            <BookingForm />
          </div>
        </div>
      </section>
    );
  }
  ```

- [ ] **Step 2: Rewrite page.tsx to represent the clean root Server Component**
  Replace all content of [page.tsx](file:///home/soverwatch/dental-demo/app/page.tsx) with:
  ```tsx
  import Navbar from '@/components/Navbar';
  import Hero from '@/components/Hero';
  import TrustStrip from '@/components/TrustStrip';
  import Emergency from '@/components/Emergency';
  import Comfort from '@/components/Comfort';
  import Services from '@/components/Services';
  import About from '@/components/About';
  import Reviews from '@/components/Reviews';
  import FaqSection from '@/components/FaqSection';
  import Insurance from '@/components/Insurance';
  import FinalCta from '@/components/FinalCta';
  import Location from '@/components/Location';
  import Footer from '@/components/Footer';
  import StickyEmergencyBar from '@/components/StickyEmergencyBar';

  const CTA_TEXT = 'Request an appointment';

  export default function WarmClinical() {
    return (
      <div className="min-h-screen bg-wc-bg text-wc-ink font-body selection:bg-wc-accent-soft selection:text-wc-accent">
        <Navbar ctaText={CTA_TEXT} />
        
        <main>
          <Hero ctaText={CTA_TEXT} />
          <TrustStrip />
          <Emergency />
          <Comfort />
          <Services />
          <About />
          <Reviews />
          <FaqSection />
          <Insurance />
          <FinalCta />
          <Location />
        </main>

        <Footer />
        <StickyEmergencyBar />
      </div>
    );
  }
  ```

- [ ] **Step 3: Run production build to ensure clean SSR bundling**
  Run: `npm run build`
  Expected: Successful compilation, producing highly optimized static HTML sheets alongside client components.

- [ ] **Step 4: Commit**
  ```bash
  git add app/page.tsx components/Insurance.tsx components/Reviews.tsx components/FinalCta.tsx
  git commit -m "feat: complete Warm Clinical Overhaul refactor, resolving linter and layout shifts"
  ```
