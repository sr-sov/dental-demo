# Prairie Oak Dental Studio — Calgary, AB

Prairie Oak Dental Studio is a warm, community-focused boutique dental clinic located in South Calgary. Designed to look and feel like a modern Alberta home—featuring warm wood textures, natural light, and a cozy reception fireplace—our studio strips away the sterile, intimidating atmosphere traditionally associated with dentistry. 

We treat oral health as a long-term relationship, not a series of transactional procedures.

---

## 📖 The Owner's Story

Prairie Oak Dental Studio was founded by **Dr. Sarah Al-Hussaini** after years of working in high-volume, corporate-owned clinics. Frustrated by an environment where patients felt like numbers on a spreadsheet and appointments were rushed to maximize billing, Dr. Al-Hussaini set out to build a patient-first practice. 

Here, patient comfort, transparent clinical communication, and administrative convenience are our primary metrics of success.

---

## ✨ Core Value Propositions

We do not compete on being the lowest-priced clinic in Calgary; we charge standard rates aligned with the **Alberta Dental Fee Guide**. Instead, we deliver an unrivaled patient experience through:

1. **Anxiety-Free Comfort Menu**: We proactively offer patients complimentary comfort options during treatment, including:
   - Weighted blankets
   - Noise-canceling headphones
   - Streaming entertainment on ceiling-mounted screens
   - Mild sedation options for nervous appointments
2. **True Direct Billing (Assignment of Benefits)**: We handle all insurance paperwork on behalf of the patient. We bill Alberta Blue Cross, Sun Life, Manulife, Canada Life, and other major providers directly. Patients only pay their specific co-pay out-of-pocket on the day of treatment.
3. **Same-Day Emergency Guarantee**: We reserve dedicated emergency slots in our schedule every single day. If you are experiencing sudden oral pain, a broken tooth, or a lost filling, we guarantee to see you the exact same day to get you out of discomfort.

---

## 🎯 Target Patient Profiles

- **The Busy Professional**: Demands highly efficient care, real-time online scheduling that respects their time, and instant clarity on whether their corporate insurance matches our direct billing system.
- **The High-Anxiety Resident**: Has avoided the dentist for 5 to 10 years due to a past traumatic experience. Self-conscious about their oral health, they need an empathetic, judgment-free environment to get back on track.
- **The Emergency Patient**: A local resident experiencing sudden, severe dental pain. Typically on a mobile device looking for an immediate phone number and a direct promise of same-day relief.

---

## 🦷 Clinical Service Categories

To keep our digital footprint clean and highly scannable, we group our clinical offerings into three consumer-friendly categories:

### 1. General Dentistry & Prevention
- Comprehensive oral checkups, dental exams, and digital X-rays.
- Professional cleanings, scaling, and personalized hygiene plans.
- Pediatric checkups designed to create a fun, positive foundation for children.

### 2. Restorative & Same-Day Emergency Care
- Natural-looking, tooth-colored (composite) fillings.
- Root canal therapy and immediate pain relief protocols.
- Durable dental crowns, bridges, and implant restorations.

### 3. Cosmetic Transformations & Aligners
- Professional in-office laser teeth whitening and custom take-home kits.
- Porcelain veneers to correct chips, minor gaps, or uneven spacing.
- Invisalign® clear aligner therapy for subtle adult orthodontic corrections.

---

## 🎨 Visual Identity & Brand Guidelines

- **Primary Colors**: Clean dental white backgrounds paired with a primary deep slate blue for high-end professionalism. Supported by soft earth tones (such as warm taupe or soft prairie sage) to lower heart rates and feel organic.
- **CTA Accents**: A vibrant orange or gold is reserved exclusively for high-visibility action buttons (e.g., "Request an Appointment" or "Call Now for Emergency Care").
- **Photography Style**: Real human smiles, natural lighting, and lifestyle images showcasing comfortable environments. No generic, impossibly white stock-photo models.
- **Typography**: Clean, contemporary sans-serif fonts (e.g., Geist Sans) for high readability across all mobile and desktop viewports.

---

## 💻 Tech Stack & Developer Guidelines

The Prairie Oak Dental Studio landing page is built on a highly optimized, modern React/Next.js stack:

- **Framework**: [Next.js 16.2.6](https://nextjs.org/) (App Router)
- **Runtime & UI**: React 19.2.4 (React canary built-in features)
- **Styling**: Tailwind CSS v4 (configured via `@tailwindcss/postcss` in `globals.css` with `@theme inline`; there is no `tailwind.config.ts`)
- **TypeScript**: Version 5 with `strict: true` and path alias `@/*` mapping to the repository root
- **Linter**: ESLint 9 with flat configuration (`eslint.config.mjs`) extending `eslint-config-next/core-web-vitals` and TypeScript defaults

---

## ⚠️ Next.js 16 & React 19 Guidelines (SSOT for Developers/Agents)

To maintain codebase integrity and avoid common footguns, developers (and AI agents) must strictly adhere to Next.js 16 conventions:

1. **Routing & Middleware**:
   - `middleware.ts` is **deprecated** in Next.js 16. Use `proxy.ts` for intercepting requests and setting up rewrites/matchers. Refer to `node_modules/next/dist/docs/03-api-reference/03-file-conventions/proxy.md` for exact conventions.
2. **Image Optimization**:
   - `<Image priority>` is **deprecated**. Use `<Image preload>` for high-priority above-the-fold images to optimize LCP.
3. **Async Contexts**:
   - Dynamic APIs like `params`, `searchParams`, `cookies()`, and `draftMode()` are **asynchronous**. You **must await** them in Server Components and Route Handlers.
   - Example in a Server Component:
     ```tsx
     interface PageProps {
       params: Promise<{ id: string }>;
     }
     export default async function Page({ params }: PageProps) {
       const { id } = await params;
       // ...
     }
     ```
4. **Form Hooks**:
   - Use `useActionState` instead of the deprecated `useFormState` hook for React 19 form actions and server actions.
5. **Linting**:
   - Use `npm run lint` which executes raw `eslint`. Note that `next lint` has been removed in Next.js 16.

---

## 🛠️ Developer Commands

| Task | Command | Description |
|---|---|---|
| **Development** | `npm run dev` | Spins up the development server on `http://localhost:3000` |
| **Production Build** | `npm run build` | Builds the production bundle of the application |
| **Production Start**| `npm run start` | Serves the production build locally |
| **Linting** | `npm run lint` | Runs ESLint analysis using flat ESLint 9 rules |

No test runner is installed by default. If a test runner (Vitest/Jest/Playwright) is added, register the script under `package.json` before verifying.
