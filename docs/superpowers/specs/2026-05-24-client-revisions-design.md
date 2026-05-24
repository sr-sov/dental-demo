---
UI Surface: yes
Register: brand
Scene: A Calgary working parent glancing at the Prairie Oak landing page on a 6.1-inch mobile screen in a brightly-lit kitchen at 7:30am while sipping coffee, feeling anxious about their child's upcoming toothache but reassured by the warm and transparent homepage.
Data Surface: no
---

# Client Revisions: Cozy Hearth Hero & Warm-Clinical Storytelling Spec

Implement design revisions requested by the client to enhance the visual storytelling and branding of Prairie Oak Dental Studio.

## 1. Goal Description
The objective is to refine the homepage to better reflect the premium, anxiety-free, and home-like atmosphere of the South Calgary practice. The client has requested two major revisions:
1. **Cozy Full-Bleed Hero (Revision 1)**: Convert the split-screen Hero section into a full-bleed layout where the cozy dental reception photo (`/hero_reception.png`) covers the entire background. The text and action controls are housed in an asymmetric, high-contrast, physical solid panel to guarantee perfect visual legibility, AA/AAA compliance, and premium boutique appeal.
2. **Warm-Clinical Storytelling Copy (Revision 2)**: Rephrase the biography section under "About Dr. Sarah" in `components/About.tsx` to align exactly with the core values and origin story defined in `docs/BRIEF.md` (moving away from generic dental jargon toward relationship-focused boutique care).

---

## 2. Proposed Changes

### Component 1: Hero Section

#### [MODIFY] [Hero.tsx](file:///home/soverwatch/dental-demo/components/Hero.tsx)
- Set the `/hero_reception.png` as a full-bleed, responsive background image using Next.js `<Image preload fetchPriority="high" fill className="object-cover" />` on the container.
- Introduce a subtle dark overlay (`bg-slate-900/10`) to ground the image.
- Render the text, primary CTA, emergency number, and reviews inside a left-aligned, three-dimensional solid card panel (`bg-surface-alt/98` or `bg-white/95`) with rounded corners (`rounded-3xl`) and shadow depth (`shadow-2xl`). This represents the "Hearth Panel" (acting like a plaster fireplace wall) which overlays the background image on larger viewports.
- Ensure the Hearth Panel collapses beautifully into a full-width background block on mobile viewports so typography remains perfectly readable on small screens.

---

### Component 2: About Dr. Sarah Section

#### [MODIFY] [About.tsx](file:///home/soverwatch/dental-demo/components/About.tsx)
- Rephrase the copy under "About Dr. Sarah" to incorporate the client's brand history and values:
  - **Eyebrow**: `ABOUT DR. SARAH`
  - **Heading**: *"I started this clinic to treat patients like people, not numbers on a spreadsheet."*
  - **Bio Paragraph 1**: *"After years of working in high-volume corporate clinics, I realized dental care had lost its humanity. Appointments were rushed, patients were treated like transaction entries, and clinical spaces felt cold and intimidating. I founded Prairie Oak to build a different kind of practice."*
  - **Bio Paragraph 2**: *"Our boutique studio is designed to look and feel like a modern Alberta home, complete with warm wood accents and a cozy fireplace lobby. We are a small, locally-owned team focused on long-term relationships. Before we suggest any treatment, we sit down with you to walk through every detail so you feel in complete control of your care."*
  - **Credentials Card**: Retain the clean credentials block (`Dr. Sarah Al-Hussaini` / `DDS, University of Alberta · ADAC member`).

---

## 3. Verification Plan

### Automated Tests
- Run `npm run lint` to verify that no TypeScript or ESLint errors are introduced.
- Run `npm run build` to verify that Next.js production building and page generation compilation is successful.

### Manual Verification
- Deploy to local development server (`npm run dev`) and test responsiveness on mobile (using the 6.1-inch viewport defined in the Scene), tablet, and desktop viewports to ensure perfect visual balance and 100% typography contrast legibility.
