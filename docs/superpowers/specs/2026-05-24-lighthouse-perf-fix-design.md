---
UI Surface: yes
Register: brand
Scene: A Calgary working parent glancing at the Prairie Oak landing page on a 6.1-inch mobile screen in a brightly-lit kitchen at 7:30am while sipping coffee, feeling anxious about their child's upcoming toothache but reassured by the warm and transparent homepage.
Data Surface: no
---

# Lighthouse Performance Fix — Image Optimization + Critical-Path Diet

## 1. Goal

Resolve the failing `categories:performance` LHCI assertion (`minScore: 0.9`) on `http://localhost:3000/`.

**Targets**:
- LHCI **median performance score**: 0.89 → **≥ 0.92** across 3 runs (clears the 0.90 threshold with headroom against future regressions).
- **Run #1 cold-cache score**: 0.71 → **≥ 0.90** (eliminate the on-the-fly PNG→WebP encoding cost that crushed first-request scores).
- **Zero visual regression** vs. the current build at the Hero, About, and Location sections.

## 2. Root Cause (Verified From Source)

Four compounding factors keep the median at 0.89 and the cold-cache run at 0.71:

1. **Source PNGs are 5–10× heavier than they need to be.** `/public/hero_reception.png` is 854 KB, `/public/dr_sarah.png` is 699 KB, `/public/office_map.png` is 718 KB. Even with `next/image` resizing + `quality={60..70}` + `formats: ["image/webp"]` in `next.config.ts`, the *first* request to each variant forces the Node server to do CPU-bound PNG-decode-then-WebP-encode work. This is the primary cause of the Run #1 cliff. (The previous commit `56e92f5` partially addressed this by dropping AVIF — webp-only is faster — but the encoding cost is still incurred on cold cache.)
2. **Font critical path is over-provisioned.** `app/layout.tsx` loads Sora at 4 weights, Manrope at 3 weights, Crimson Pro at 3 weights × 2 styles. Inventory of the codebase shows ~4 of these weight/style files are unused (Sora 400, Crimson Pro 400, Crimson Pro italics) and 1 needed weight is missing (Manrope 700 — causing `font-bold` to fake-bold).
3. **A near-invisible compositor layer paints over the LCP element.** `components/Hero.tsx:23` has `<div className="absolute inset-0 bg-slate-900/5 mix-blend-multiply" />` painting at 5% opacity directly over the hero image. `mix-blend-multiply` forces a compositor layer and adds paint cost on the largest contentful paint pixel.
4. **One unused 743 KB asset** (`/public/treatment_comfort.png`) sits in `/public`. Not served on the critical path, but it's noise.

## 3. Approach

Four scoped changes, all on the same axis (perf), each independently revertable:

### 3.1 Image Re-encode

Pre-encode the three *used* PNGs into WebP at sensible master resolutions and commit the outputs. Replace the three `<Image src=…>` references.

| File | Source size | Master output | Quality | Estimated final |
|---|---|---|---|---|
| `hero_reception.png` → `hero_reception.webp` | 854 KB | ~2400×1600 | q82 | ~100–140 KB |
| `dr_sarah.png` → `dr_sarah.webp` | 699 KB | ~1600×2000 (portrait) | q82 | ~80–110 KB |
| `office_map.png` → `office_map.webp` | 718 KB | ~1600×1200 | q82 | ~90–120 KB |

**Why master resolutions matter**: Lighthouse mobile runs at 412×823 viewport × 2× DPR → max raster ~824×1646. A 2400px master gives Next.js room to generate any breakpoint without upscaling, while the master itself is no longer obscenely oversized for downscaling.

**Pipeline**:
- Add `sharp` to `devDependencies` (already a transitive dep of `next` — explicit declaration just resolves the import).
- Commit `scripts/optimize-images.mjs` (~40 lines, single-purpose). Reads a hardcoded list of `{ src, dest, width, height, quality }` entries from `/public` and writes WebP outputs. Re-runnable for future images.
- Run script once locally; commit the resulting `.webp` files alongside the script + package.json change.
- Update three `<Image src>` references in `Hero.tsx`, `About.tsx`, `Location.tsx`.

**Format choice**: stay on WebP only. Do **not** re-introduce AVIF in `next.config.ts` — commit `56e92f5` removed it specifically because its slow encoding crushed Run #1.

**PNG master fate**: keep the original PNGs in `/public` for now. They're unreferenced (no perf cost — not served, not bundled, not preloaded) and useful if the team ever wants to re-encode at a different quality. Decision is reversible — easy follow-up cleanup.

### 3.2 Font Weight Diet

Single file: `app/layout.tsx`. Reduces critical-path woff2 file count from 13 to 9.

| Family | Currently loaded | After | Rationale |
|---|---|---|---|
| Sora (display) | 400, 500, 600, 700 | **500, 600, 700** | No `font-display font-normal` combination anywhere in `components/` or `app/`. 400 is dead weight. |
| Manrope (body) | 400, 500, 600 | **400, 500, 600, 700** | `font-bold` (weight 700) is used 10× on body-default text → currently rendered via fake-bold synthesis. Adding 700 fixes fidelity AND replaces a paint-time fake-bold cost with a normal glyph render. |
| Crimson Pro (serif accent) | 400, 500, 600 + normal & italic | **500, 600**, drop `style` array entirely (default `normal`) | No `italic` modifier appears on any `font-serif` element. No `font-serif font-normal` either. Drops 4 files (400 + all italics). Concretely: `Crimson_Pro({ weight: ["500", "600"], … })` with no `style` key. |

Net change: **−5 files, +1 file = −4 woff2 on critical path** (~40–80 KB).

### 3.3 Hero Overlay Removal

In `components/Hero.tsx`, delete line 23:

```tsx
<div className="absolute inset-0 bg-slate-900/5 mix-blend-multiply" />
```

If the subtle warming the overlay was contributing is visually missed in QA, raise the existing `brightness-[0.98]` on the Image to `brightness-[0.96]` and add `saturate-[1.02]` instead — those filters apply to the existing image layer without creating a new compositor surface.

### 3.4 Delete Unused Asset

`git rm public/treatment_comfort.png` (743 KB). Confirmed unreferenced by `grep -r treatment_comfort components/ app/ public/ docs/`. Original is retrievable from git history if ever needed.

## 4. File-Level Changes

**New files**:
- `scripts/optimize-images.mjs` — image encoding script (sharp).
- `public/hero_reception.webp` — encoded master.
- `public/dr_sarah.webp` — encoded master.
- `public/office_map.webp` — encoded master.

**Modified files**:
- `package.json` — add `"sharp": "^0.33.x"` to `devDependencies`.
- `package-lock.json` — regenerated by `npm install`.
- `app/layout.tsx` — font weight arrays (Sora, Manrope, Crimson Pro).
- `components/Hero.tsx` — `src="/hero_reception.webp"`, remove overlay `<div>` at line 23.
- `components/About.tsx` — `src="/dr_sarah.webp"`.
- `components/Location.tsx` — `src="/office_map.webp"`.

**Deleted files**:
- `public/treatment_comfort.png` (unused, 743 KB).

**Files explicitly NOT touched**:
- `next.config.ts` — `formats: ["image/webp"]` stays. No AVIF.
- `lighthouserc.js` — assertion thresholds stay at 0.9 for all four categories.
- `DESIGN.md` — no design-system changes.
- Any other component or page — pure perf pass.

## 5. Verification

**Automated**:
1. `npm install` — installs sharp cleanly.
2. `node scripts/optimize-images.mjs` — produces the three WebP files in `/public`.
3. `npm run lint` — clean.
4. `npm run build` — clean, with route bundle sizes ≤ current.
5. `npm run test:lighthouse` — assert:
   - Median performance score ≥ 0.92 (target; required ≥ 0.90).
   - Run #1 score ≥ 0.90 (no cold-cache cliff).
   - Accessibility, best-practices, SEO scores all stay ≥ 0.90 (no regression in other categories).

**Manual**:
- Load `/` in a real browser at desktop and mobile widths. Visually compare Hero (full-bleed background), About (Dr. Sarah portrait), Location (map image) against the previous build (use a `git stash` or local checkout of `main`). Look specifically for compression artifacts in the hero photo wood-grain and skin tones in the portrait — these are the most artifact-prone regions at q82 WebP.
- Inspect DevTools Network panel: confirm `/_next/image?url=%2Fhero_reception.webp&…` etc. are served (not the PNG endpoints), and that the total number of woff2 requests under `_next/static/media/` matches the new font config (9 files, down from 13).
- DevTools Computed panel on any `font-bold` body text (e.g., the Hero phone link, Navbar phone link): confirm the rendered `font-weight` is `700` from a real Manrope 700 glyph, not the synthesized fake-bold from earlier.

**Acceptance**:
- Pass if all automated steps pass AND manual visual review shows no perceptible degradation.
- Fail if any Lighthouse category drops below 0.90, or if visual reviewer flags a visible difference at the Hero / About / Location sections.

## 6. Rollback

Single commit (or two: spec + implementation). Revert with:

```bash
git revert <hash>
```

This restores:
- Original `<Image src=…>` references to PNGs.
- `treatment_comfort.png` (still in history).
- `app/layout.tsx` font config.
- Hero overlay `<div>`.
- Removes `scripts/optimize-images.mjs`, `sharp` dependency, and the `.webp` files.

No data migrations, no external state, no in-flight users to coordinate with.

## 7. Out of Scope (Explicit)

- **Re-introducing AVIF** in `next.config.ts` — direct conflict with the Run #1 fix in commit `56e92f5`. Out.
- **Loosening LHCI assertion thresholds** — the assertion stays at 0.9 across the four categories. We're fixing the score, not the test.
- **Image cache warmup hacks in CI** (pre-`curl`-ing image URLs before lhci runs) — engineers to the test, not the underlying user-facing perf cost.
- **`placeholder="blur"` / `blurDataURL`** for the Hero — adds build-time complexity for marginal LCP perception gain. Defer.
- **Visual, copy, IA, or design-system changes** — this is a pure performance pass. `DESIGN.md` and all component layouts stay as-is.
- **Switching font hosting** (e.g., to a different provider) — `next/font/google` self-hosts, which is already optimal.
- **Removing the `font-display: swap` strategy** — current swap is correct.

## 8. Risks & Mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| WebP at q82 introduces visible compression artifacts (hero wood-grain, dr_sarah skin tones) | Low | q82 is conservative; manual visual review in §5; can re-encode at q88–q90 if rejected |
| Sharp install fails on a contributor's machine (rare on Linux/macOS, occasional on Windows) | Low | Document in README that `npm install` includes sharp; provide the pre-encoded `.webp` outputs in `/public` so the encoding script is only re-run for new images |
| Manrope 700 causes subtle layout shifts where fake-bold was previously slightly narrower | Very low | Real bold glyphs are typically *wider* than fake-bold; if a specific element looks broken, narrow that element's `font-bold` to `font-semibold` (weight 600, already loaded) |
| Removing hero overlay causes the white "Hearth Panel" card to lose contrast against the background image | Low | The card is `bg-white/98` with `shadow-2xl` — its own contrast doesn't depend on the overlay; the overlay was for ambient photo warmth, not text legibility |
