# Calendly Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use agentic-os:subagent-driven-development (recommended) or agentic-os:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a reusable, premium Calendly inline embed scheduling system in the Prairie Oak Dental Studio landing page (creating a 3-step intake-to-booking card in the main booking block, and an instant same-day calendar embed inside the emergency banner), fully styled to fit the Warm Clinical Design System.

**Visual SSOT:**
- Design System: `./DESIGN.md`
- Mockups: none
- Figma/Artifacts: none

**Architecture:** Use a highly flexible, reusable `<CalendlyEmbed>` component with single-script-load safeguards, theme-aware loading skeleton indicators, and postMessage scheduled-event detection. Integrate prefill data serialization (including contact info and Comfort Menu preferences) in `<BookingForm>`, and deploy a dark-themed instant scheduler in a desktop dual-column layout inside `<Emergency>`.

**Tech Stack:** Next.js 16.2.6 (App Router), React 19.2.4, TypeScript 5, Tailwind CSS v4.

---

This work is in a dedicated worktree and must strictly adhere to the Warm Clinical Design tokens in `./DESIGN.md`.

---

## Data Surface Contract (Mock-Only)
*   **Intake Data Collected:** Full Name, Phone, Email, Care Path, Comfort Menu checkboxes.
*   **Prefill Mapping Strategy:**
    *   `name` ➔ `formData.fullName`
    *   `email` ➔ `formData.email`
    *   `phone` ➔ `formData.phone`
    *   `customAnswers.a1` ➔ Combined string listing direct billing status and all checked comfort choices (e.g., *"Direct Billing: Yes | Comfort: Weighted Blanket, Ceiling Screen"*).

---

## File Structure

*   **[NEW] [components/CalendlyEmbed.tsx](file:///home/soverwatch/dental-demo/components/CalendlyEmbed.tsx):** Dynamic widget script manager, themeable frame wrapper, visual loader, and scheduling listener.
*   **[MODIFY] [components/BookingForm.tsx](file:///home/soverwatch/dental-demo/components/BookingForm.tsx):** 3-step intake-to-scheduling wizard with prefill mappings and custom success screen.
*   **[MODIFY] [components/Emergency.tsx](file:///home/soverwatch/dental-demo/components/Emergency.tsx):** Same-Day Promise block transformed into desktop 2-column container with dark-themed calendar embed.

---

## Tasks

### Task 1: Isolated Worktree Setup & Baseline Verification

**Context:** setting up the clean workspace environment.
**References:** none

- [ ] **Step 1: Announce and create isolated worktree**
  Announce using `using-git-worktrees` skill. Run the following command from the repository root:
  ```bash
  git worktree add .worktrees/feat-calendly-integration -b feat-calendly-integration
  ```
- [ ] **Step 2: Change to the worktree workspace and install dependencies**
  ```bash
  cd .worktrees/feat-calendly-integration && npm install
  ```
- [ ] **Step 3: Run a baseline compiler build check**
  Ensure the starting codebase compiles cleanly without error.
  ```bash
  npm run build
  ```
  Expected output: Clean build completion with no TypeScript or Next.js build errors.
- [ ] **Step 4: Commit baseline check**
  ```bash
  git add .
  git commit -m "chore: initialize calendly-integration worktree and verify baseline

  Verified: Created worktree and successfully verified compilation baseline.
  Ref: ad-hoc
  Agent: Antigravity"
  ```

---

### Task 2: Implement Reusable `<CalendlyEmbed>` Component

**Context:** building the core modular component.
**References:** `references/impeccable-color-and-contrast.md`, `references/impeccable-motion-design.md`, `references/impeccable-interaction-design.md`

- [ ] **Step 1: Create the component file**
  Create [components/CalendlyEmbed.tsx](file:///home/soverwatch/dental-demo/components/CalendlyEmbed.tsx) and implement the dynamic script-loading system, support for `'light' | 'dark'` themes, custom pulsing theme loaders, and postMessage event handlers:
  ```typescript
  'use client';

  import { useEffect, useState } from 'react';

  interface CalendlyEmbedProps {
    url: string;
    prefill?: {
      name?: string;
      email?: string;
      phone?: string;
      customAnswers?: Record<string, string>;
    };
    theme?: 'light' | 'dark';
    onBookingComplete?: () => void;
  }

  export default function CalendlyEmbed({
    url,
    prefill,
    theme = 'light',
    onBookingComplete,
  }: CalendlyEmbedProps) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      // Dynamic Script Loading with Safe Singleton Check
      const scriptId = 'calendly-embed-script';
      let script = document.getElementById(scriptId) as HTMLScriptElement;

      const initWidget = () => {
        if (window.Calendly) {
          window.Calendly.initInlineWidget({
            url,
            parentElement: document.getElementById(`calendly-container-${url}`),
            prefill: prefill ? {
              name: prefill.name,
              email: prefill.email,
              phone: prefill.phone,
              customAnswers: prefill.customAnswers,
            } : undefined,
          });
          setIsLoading(false);
        }
      };

      if (!script) {
        // Create script
        script = document.createElement('script');
        script.id = scriptId;
        script.src = 'https://assets.calendly.com/assets/external/widget.js';
        script.async = true;
        document.body.appendChild(script);

        // Create style
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://assets.calendly.com/assets/external/widget.css';
        document.head.appendChild(link);

        script.onload = () => {
          initWidget();
        };
      } else {
        if (window.Calendly) {
          initWidget();
        } else {
          script.addEventListener('load', initWidget);
        }
      }

      // Calendly postMessage event listener for success trigger
      const handleCalendlyMessage = (e: MessageEvent) => {
        if (e.data.event === 'calendly.event_scheduled') {
          if (onBookingComplete) {
            onBookingComplete();
          }
        }
      };

      window.addEventListener('message', handleCalendlyMessage);

      return () => {
        window.removeEventListener('message', handleCalendlyMessage);
        if (script) {
          script.removeEventListener('load', initWidget);
        }
      };
    }, [url, prefill, onBookingComplete]);

    return (
      <div className="relative w-full h-[600px] rounded-2xl overflow-hidden border border-wc-line bg-transparent">
        {/* Warm-Clinical Skeleton Pulsing Loader */}
        {isLoading && (
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center gap-3 animate-pulse transition-opacity duration-300 ${
              theme === 'dark' ? 'bg-wc-deep text-white/50' : 'bg-wc-surface text-wc-ink-soft'
            }`}
          >
            <div className={`h-12 w-12 rounded-full ${theme === 'dark' ? 'bg-white/10' : 'bg-wc-bg-alt/50'} flex items-center justify-center`}>
              🌸
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider">
              Securely Loading Dr. Sarah's Schedule...
            </span>
          </div>
        )}

        {/* Embedded IFrame Target Container */}
        <div
          id={`calendly-container-${url}`}
          className="w-full h-full"
          data-testid="calendly-widget"
        />
      </div>
    );
  }
  ```
- [ ] **Step 2: Run a lint check to verify compilation**
  ```bash
  npm run lint
  ```
  Expected output: Zero linter warnings or errors for the new file.
- [ ] **Step 3: Commit the new component**
  ```bash
  git add components/CalendlyEmbed.tsx
  git commit -m "feat: implement reusable CalendlyEmbed component with themeable skeleton loader

  Verified: Compiled successfully; verified dynamic script manager singleton logic.
  Ref: ad-hoc
  Agent: Antigravity"
  ```

---

### Task 3: Refactor Main `<BookingForm>` to 3-step Wizard

**Context:** modifying existing request form to handle the dynamic wizard flow.
**References:** `references/impeccable-motion-design.md`, `references/impeccable-interaction-design.md`, `references/impeccable-ux-writing.md`

- [ ] **Step 1: Modify components/BookingForm.tsx**
  Open [components/BookingForm.tsx](file:///home/soverwatch/dental-demo/components/BookingForm.tsx). Replace the form rendering logic to handle:
  *   State `step`: `'intake' | 'schedule' | 'success'`
  *   Step 1 collects comfort data. When submitted, we transition `step` to `'schedule'`.
  *   Step 2 displays our `<CalendlyEmbed>` with user prefilled variables mapped.
  *   Step 3 displays a boutique Prairie Oak confirmation window with custom comfort badges.

  Implement the changes:
  ```typescript
  'use client';

  import { useState } from 'react';
  import CalendlyEmbed from './CalendlyEmbed';

  export default function BookingForm() {
    const [step, setStep] = useState<'intake' | 'schedule' | 'success'>('intake');
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

    const handleContinueToSchedule = (e: React.FormEvent) => {
      e.preventDefault();
      
      const list: string[] = [];
      if (formData.comfortBlanket) list.push('Weighted Blanket');
      if (formData.comfortHeadphones) list.push('Noise-Canceling Headphones');
      if (formData.comfortScreen) list.push('Ceiling Streaming Screen');
      if (formData.comfortSedation) list.push('Sedation Options');
      
      setComforts(list);
      setStep('schedule');
    };

    // Serialize Comfort Selections for Calendly Custom Answer Prefill
    const serializePrefillAnswers = () => {
      const answers: Record<string, string> = {};
      const selections = [...comforts];
      if (formData.directBilling) {
        selections.unshift('Direct Insurance Billing Requested');
      }
      if (formData.urgentEmergency) {
        selections.unshift('URGENT Same-Day Slot Requested');
      }
      
      // Map serialized comfort choices to 'a1' (Calendly's first custom field placeholder)
      answers.a1 = selections.join(' | ') || 'None';
      return answers;
    };

    return (
      <div className="w-full max-w-2xl mx-auto rounded-3xl bg-white p-6 shadow-xl border border-wc-line md:p-8 transition-all duration-300">
        {step === 'intake' && (
          <form onSubmit={handleContinueToSchedule} className="space-y-5">
            <div>
              <h3 className="font-serif text-2xl font-semibold text-wc-ink">
                Request an Appointment
              </h3>
              <p className="text-sm text-wc-ink-soft mt-1 leading-relaxed">
                Customize your complimentary comfort preferences first. Next, you will select your exact time slot instantly.
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

            {/* Continue Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full rounded-xl bg-wc-accent py-3.5 text-sm font-semibold text-white hover:brightness-[1.05] transition active:scale-[0.98] cursor-pointer"
              >
                Choose Your Time Slot ➔
              </button>
            </div>
          </form>
        )}

        {step === 'schedule' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-wc-line">
              <div>
                <span className="text-xs font-semibold text-wc-accent uppercase tracking-wider">Step 2 of 2</span>
                <h3 className="font-serif text-xl font-semibold text-wc-ink">Instant Scheduling</h3>
              </div>
              <button
                onClick={() => setStep('intake')}
                className="text-xs font-semibold text-wc-ink hover:text-wc-accent transition cursor-pointer"
              >
                ⬅ Back to details
              </button>
            </div>
            
            <CalendlyEmbed
              url="https://calendly.com/prairie-oak/general-care" // Demo general booking URL
              prefill={{
                name: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                customAnswers: serializePrefillAnswers(),
              }}
              theme="light"
              onBookingComplete={() => setStep('success')}
            />
          </div>
        )}

        {step === 'success' && (
          <div className="text-center py-8 space-y-4 animate-fade-in">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-wc-accent-soft text-wc-accent text-2xl font-bold">
              ✓
            </div>
            <h3 className="font-serif text-2xl font-semibold text-wc-ink">
              Appointment Secured!
            </h3>
            <p className="text-sm text-wc-ink-soft max-w-sm mx-auto leading-relaxed">
              Thank you, <b>{formData.fullName}</b>! Your time slot has been successfully scheduled. We have pre-registered your details and comfort preferences.
            </p>

            {comforts.length > 0 && (
              <div className="rounded-xl bg-wc-bg/30 p-4 max-w-sm mx-auto text-xs text-wc-ink-soft space-y-2.5 border border-wc-line">
                <span className="font-bold text-wc-ink block uppercase tracking-wider text-[10px]">
                  🌸 Comfort Options Reserved For Your Visit:
                </span>
                <div className="flex flex-wrap gap-1.5 justify-center">
                  {comforts.map((item) => (
                    <span key={item} className="bg-white border border-wc-line px-2.5 py-1 rounded-full font-medium">
                      🌸 {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {formData.directBilling && (
              <div className="bg-wc-bg-alt/50 border border-wc-line rounded-xl p-3 max-w-sm mx-auto text-xs font-medium text-wc-ink-soft">
                💳 Direct Insurance Billing has been flagged. Please bring your insurance card to your appointment.
              </div>
            )}

            <div className="pt-4">
              <button
                onClick={() => {
                  setFormData({
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
                  setStep('intake');
                }}
                className="rounded-xl bg-wc-ink px-6 py-2.5 text-sm font-semibold text-white hover:brightness-[1.1] transition cursor-pointer"
              >
                Book Another Appointment
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
  ```
- [ ] **Step 2: Run build compiling tests**
  ```bash
  npm run lint
  ```
- [ ] **Step 3: Commit BookingForm updates**
  ```bash
  git add components/BookingForm.tsx
  git commit -m "feat: refactor BookingForm to dynamic 3-step scheduling wizard prefilled into Calendly

  Verified: Verified JSX syntax, prefill state serialization, and custom success badge layouts.
  Ref: ad-hoc
  Agent: Antigravity"
  ```

---

### Task 4: Integrate Inline Emergency Scheduler inside `<Emergency>`

**Context:** adapting the urgent promise banner for responsive desktop inline scheduling.
**References:** `references/impeccable-responsive-design.md`, `references/impeccable-color-and-contrast.md`

- [ ] **Step 1: Modify components/Emergency.tsx**
  Open [components/Emergency.tsx](file:///home/soverwatch/dental-demo/components/Emergency.tsx). Wrap the existing layout inside a standard responsive grid container. If the viewport is desktop (`lg:`), split into equal halves: the left half holds the copy and guarantees; the right half mounts `<CalendlyEmbed>` with the `theme="dark"` styling and the dedicated emergency scheduling endpoint:
  ```typescript
  import CalendlyEmbed from './CalendlyEmbed';

  export default function Emergency() {
    return (
      <section className="bg-wc-bg py-8 lg:py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-wc-deep p-8 shadow-xl md:p-12 lg:p-14">
            {/* Subtle warm glow background highlight */}
            <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-wc-accent/15 blur-3xl pointer-events-none" />
            
            <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Urgent Guarantee Details */}
              <div className="lg:col-span-5 space-y-4">
                <span className="font-display text-xs font-semibold tracking-wider text-wc-accent uppercase block">
                  Same-day promise
                </span>
                <h2 className="font-serif text-3xl font-medium tracking-tight text-white md:text-4xl leading-tight">
                  Pain today? We’ll see you today.
                </h2>
                <p className="text-sm md:text-base leading-relaxed text-white/75">
                  We hold emergency slots open every single day. Call before 4pm and we guarantee an appointment before close, or book an emergency slot online instantly.
                </p>
                <div className="pt-2">
                  <a
                    href="tel:+15875550142"
                    className="inline-flex items-center gap-2 rounded-xl bg-wc-accent px-5 py-3 text-sm font-semibold text-white shadow-lg hover:brightness-[1.05] transition active:scale-[0.98]"
                  >
                    📞 Call (587) 555-0142
                  </a>
                </div>
              </div>

              {/* Right Column: Instant Emergency Scheduling Calendar */}
              <div className="lg:col-span-7 w-full h-[500px]">
                <CalendlyEmbed
                  url="https://calendly.com/prairie-oak/emergency-care" // Dedicated emergency event URL
                  theme="dark"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
  ```
- [ ] **Step 2: Validate compilation**
  ```bash
  npm run build
  ```
- [ ] **Step 3: Commit same-day promise changes**
  ```bash
  git add components/Emergency.tsx
  git commit -m "feat: transform Emergency section into 2-column banner with dark-themed Calendly embed

  Verified: Successfully compiled and integrated dark-themed embed container within midnight-slate banner.
  Ref: ad-hoc
  Agent: Antigravity"
  ```

---

### Task 5: End-to-End Visual Verification

**Context:** final validation and cleanup of the worktree.
**References:** none

- [ ] **Step 1: Start local development server**
  ```bash
  npm run dev
  ```
- [ ] **Step 2: Perform visual verification**
  *   Open the browser to check scheduling layout transitions on both elements.
  *   Confirm loading skeletons pulse correctly with theme color synchronization.
  *   Validate mobile grid stacking wraps cleanly without breaking elements.
- [ ] **Step 3: Run final lint, styling, and compilation checks**
  Ensure code quality and standards are met in full.
  ```bash
  npm run lint
  ```
  ```bash
  npm run build
  ```
- [ ] **Step 4: Report findings and merge instructions**
  Prepare PR and cleanup details using `finishing-a-development-branch` guidelines.
