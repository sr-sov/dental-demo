# PDDR 0001: Prairie Oak Dental Studio — Calendly Online Scheduling Architecture

## Context
Prairie Oak Dental Studio operates as a premium, community-oriented south Calgary boutique clinic that treats oral health as a relationship rather than transactional procedures. The practice's unique value is anchored by:
1.  An **Anxiety-Free Comfort Menu** (weighted blankets, ceiling streaming screens, sedation) designed to alleviate dental anxiety.
2.  A **Same-Day Promise** guarantee to instantly treat emergency toothaches.

The practice owner, Dr. Sarah, wanted to introduce online Calendly scheduling. However, raw Calendly embeds do not support collecting complex clinical/comfort intake options, and creating multiple popup redirects disrupts the serene user flow.

## Decision
We implemented a **two-pronged, dynamic online scheduling architecture** utilizing the official Calendly inline widget JavaScript API and styling:

1.  **Dynamic 3-Step Wizard (`components/BookingForm.tsx`):**
    *   *Step 1 (Custom Comfort Intake):* Collects standard contact data and checks off Anxiety-Free Comfort Menu preferences.
    *   *Step 2 (Instant Embed Prefill):* Renders the custom `<CalendlyEmbed>` inline, dynamically mapping and serializing the user's name, email, phone, and direct billing choices to prefill Calendly custom answer fields automatically.
    *   *Step 3 (Boutique Success Page):* Intercepts successful Calendly postMessage schedule events to display a customized confirmation screen with high-end badges confirming their reserved comfort options.
2.  **Instant Same-Day Embed (`components/Emergency.tsx`):**
    *   Renders a desktop 2-column grid layout inside the dark slate Same-Day Promise banner, mounting the `<CalendlyEmbed theme="dark" />` side-by-side with Calgary urgent call CTAs. Points to a dedicated same-day emergency event type.

## Rationale
*   **Zero Double-Entry Friction:** Prefilling names and comfort preferences dynamically into Calendly's inline iframe maintains user comfort and speeds up intake.
*   **Emotional Reassurance:** Visually displaying reserved comfort badges (e.g. Weighted Blanket, Ceiling Screen) on Step 3 provides immediate peace of mind for high-anxiety patients before they step foot in the clinic.
*   **Operational Control:** Separating general checkup bookings (24h minimum notice, up to 30 days out) from Same-Day Emergency slots (15-min notice, same-day only availability buffers) in the dashboard prevents practitioners' schedule conflicts.

## Implications for Future Work
*   **Aesthetic Continuity:** Any modifications to the `<CalendlyEmbed>` loading skeleton or wrappers must strictly respect the `DESIGN.md` Midnight Slate (`wc-deep`), Neutral Taupe (`wc-bg-alt`), and Pulsing Easing styling tokens.
*   **Data Serialization Contract:** Mapped custom answer values pass into Calendly's first custom field query parameter (`a1`). Any change in Calendly's dashboard question ordering must update this mapping accordingly to prevent frontend data ingestion mismatch.
