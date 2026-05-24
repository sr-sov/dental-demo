# Design Spec: Prairie Oak Dental Studio — Calendly Integration

Provide Prairie Oak Dental Studio (Calgary) with a premium, seamless, online scheduling experience by integrating Calendly inline widgets. This integration preserves the practice's unique branding guidelines (Midnight Slate and Neutral Taupe) and its distinctive **Anxiety-Free Comfort Menu**, ensuring a warm, comforting customer journey.

---

## Technical Specifications

### UI Surface
*   **UI Surface:** Yes
*   **Register:** product (warm utility-first, dental comfort billing focus)
*   **Scene:** "A high-anxiety Calgary resident booking an urgent toothache opening on a mobile device at 7:30 PM, feeling reassured by same-day availability and comfort menu options."
*   **Data Surface:** mock-only (no local DB, data passes directly to Calendly's API via prefill fields)

---

## Proposed Changes

We will introduce a single reusable `<CalendlyEmbed>` component and integrate it in two distinct user touchpoints on the landing page: the main booking flow and the Same-Day emergency care section.

### 1. `components/`

#### [NEW] [CalendlyEmbed.tsx](file:///home/soverwatch/dental-demo/components/CalendlyEmbed.tsx)
A robust, flexible, and reusable component to abstract away Calendly widget integrations.
*   **Properties:**
    *   `url`: `string` (Calendly event URL)
    *   `prefill`: `object` containing optional `name`, `email`, `phone`, and `customAnswers` (string map)
    *   `theme`: `'light' | 'dark'` (for background and skeleton loader styling)
    *   `onBookingComplete`: `() => void`
*   **Behavior:**
    *   Dynamically injects Calendly's stylesheet and Javascript SDK (`widget.js`) exactly once.
    *   Displays a pulsing theme-aware skeleton loader matching Prairie Oak's neutral/midnight tokens until the iframe completes loading.
    *   Listens to the `window` message event from the Calendly iframe. Fired on `calendly.event_scheduled`, it triggers the local `onBookingComplete` callback.

#### [MODIFY] [BookingForm.tsx](file:///home/soverwatch/dental-demo/components/BookingForm.tsx)
Update the mock booking form to utilize a high-end 3-step scheduling wizard:
*   **Step 1 (Custom Comfort Intake):** Collects standard contact info plus the **Anxiety-Free Comfort Menu** (weighted blankets, headphones, etc.).
*   **Step 2 (Instant Calendly Embed):** Renders the custom `<CalendlyEmbed>` inline, prefilling the patient's name, email, phone, and mapped comfort selection string.
*   **Step 3 (Boutique Success Page):** Triggered when Calendly completes successfully. Displays a reassuring visual summary of their scheduled slot and their reserved comfort items in high-end design badges.

#### [MODIFY] [Emergency.tsx](file:///home/soverwatch/dental-demo/components/Emergency.tsx)
Transform the single-column banner into a premium, two-column responsive grid layout on desktop:
*   **Left Column:** Retains emergency copy, Calgary direct phone line, and guarantees.
*   **Right Column:** Directly embeds `<CalendlyEmbed>` with `theme="dark"` pointing to the clinic's dedicated same-day emergency event type. It allows emergency patients to see and book open emergency chairs instantly.

---

## Clinic Operational Guidelines (Calendly Dashboard Setup)

To support this integration without schedule conflicts, the clinic's administrative team will configure their Calendly dashboard as follows:
1.  **Shared Master Calendar:** Both Event Types map to Dr. Sarah's principal chair calendar, preventing double-bookings.
2.  **General Event Type Rules:** Minimum 24-hour notice, bookable up to 30 days out.
3.  **Emergency Event Type Rules:** Same-day booking only, minimum notice set to 15 minutes, with specific daily blocks reserved exclusively for urgent care.

---

## Verification Plan

### Automated Build & Lint Check
*   Run `npm run lint` and `npm run build` to verify compiling success of all TypeScript typings and React components.

### Manual Visual Verification
*   **Intake Flow:** Test submitting Step 1 and verify the form morphs smoothly into the inline scheduler.
*   **Prefill Verification:** Verify that the Calendly widget loads with the user's name and email automatically filled.
*   **Theme Consistency:** Confirm that the dark-themed embed inside `Emergency.tsx` fits perfectly into the Midnight Slate banner without color bleeding.
*   **Success Triggers:** Confirm that completing a booking triggers Step 3 (Success Screen) and displays the correct comfort badges.
