# Lighthouse Performance Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use agentic-os:subagent-driven-development (recommended) or agentic-os:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Land LHCI median performance score ≥ 0.92 (clearing the 0.90 threshold with headroom) and eliminate the Run #1 cold-cache cliff (0.71 → ≥ 0.90) by re-encoding three heavy `/public` images to WebP, trimming the font critical path from 13 to 9 woff2 files, removing a near-invisible compositor overlay over the LCP element, and deleting one unused 743 KB asset.

**Spec:** `docs/superpowers/specs/2026-05-24-lighthouse-perf-fix-design.md` (commit `7ceba40`).

**Visual SSOT:**
- Design System: `./DESIGN.md`
- Mockups: `none` (pure performance pass — spec mandates zero visual regression vs. current build)
- Figma/Artifacts: `none`

**Architecture:** Four scoped, independently-revertable changes on the performance axis only. Each phase has its own verification gate. No design-system, data-layer, or routing changes. The dominant lever is pre-encoding `/public` images to WebP so the Next.js image pipeline doesn't do CPU-bound PNG/JPEG→WebP transformation on first cold-cache request — that single change is expected to fix both the 0.89 ceiling and the 0.71 Run #1 cliff.

**Tech Stack:** Next.js 16.2.6 (App Router) · React 19.2.4 · Tailwind CSS v4 · `next/font/google` · `sharp` (new devDep, one-shot encoding) · `@lhci/cli` 0.14.

---

This work is in a dedicated worktree (`feature/client-revisions`) branched from `main`. All four phases must preserve visual fidelity vs. the current build at Hero / About / Location sections — DESIGN.md is the SSOT and is NOT modified in this work.

**Important factual correction discovered during planning:** `/public/hero_reception.png`, `dr_sarah.png`, `office_map.png`, and `treatment_comfort.png` have `.png` extensions but are actually **baseline JPEGs at 1024×1024** (verified with `file public/*.png`). The original spec assumed `~2400×1600` master output dimensions for the hero — that was based on incorrect dimension assumptions. **The implementation re-encodes at the existing source dimensions (no resize, just format conversion).** Output will still drop ~80%+ in bytes at WebP q82 because the source JPEGs are saved at very high quality. This is a faithful execution of the spec's intent (drop the byte cost of the LCP image and eliminate on-demand transformation); only the dimension number changes.

---

### Task 1: Add `sharp` Dependency and Image Optimization Script

Add `sharp` to `devDependencies` and create a single-purpose, idempotent Node script that re-encodes the three referenced `/public` images to WebP. This task does NOT yet generate the WebP files — it only sets up the tooling. Generation happens in Task 2.

**Files:**
- Modify: `package.json`
- Create: `scripts/optimize-images.mjs`
- Modify (regenerated): `package-lock.json`

**References:**
- `.agents/skills/impeccable/reference/optimize.md`

- [ ] **Step 1: Add `sharp` to devDependencies**

  Edit `package.json`. Add `"sharp": "^0.33.5"` to the `devDependencies` block (alphabetical order — between `eslint-config-next` and `tailwindcss`):

  ```json
  "devDependencies": {
    "@lhci/cli": "^0.14",
    "@playwright/test": "^1.52",
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.2.6",
    "sharp": "^0.33.5",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
  ```

- [ ] **Step 2: Install the dependency**

  Run: `npm install`
  Expected: `package-lock.json` updates; `node_modules/sharp/` populates; no errors. Sharp ships with prebuilt libvips binaries for Linux — no native compile needed in WSL2.

- [ ] **Step 3: Create the optimization script**

  Create `scripts/optimize-images.mjs` with exactly this content:

  ```javascript
  #!/usr/bin/env node
  // Generates optimized WebP versions of the referenced /public images.
  // Idempotent: re-running produces byte-identical output for the same source bytes.
  // Re-run whenever a source image is added or replaced.

  import sharp from "sharp";
  import path from "node:path";
  import { fileURLToPath } from "node:url";

  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const PUBLIC = path.resolve(__dirname, "..", "public");

  // Only images that are actually referenced from components/ or app/.
  // No resize: sources are already at appropriate dimensions for the layout
  // (Lighthouse mobile renders at 412×823 × 2 DPR; 1024px sources downsample cleanly).
  const IMAGES = [
    { src: "hero_reception.png", dest: "hero_reception.webp", quality: 82 },
    { src: "dr_sarah.png",       dest: "dr_sarah.webp",       quality: 82 },
    { src: "office_map.png",     dest: "office_map.webp",     quality: 82 },
  ];

  let total = 0;
  for (const { src, dest, quality } of IMAGES) {
    const input = path.join(PUBLIC, src);
    const output = path.join(PUBLIC, dest);
    const info = await sharp(input)
      .webp({ quality, effort: 6 })
      .toFile(output);
    total += info.size;
    console.log(`OK  ${dest.padEnd(28)}  ${info.width}x${info.height}  ${info.size.toLocaleString()} bytes`);
  }
  console.log(`Total WebP bytes: ${total.toLocaleString()}`);
  ```

- [ ] **Step 4: Verify the script is syntactically valid (does not execute)**

  Run: `node --check scripts/optimize-images.mjs`
  Expected: Command exits 0 with no output.

- [ ] **Step 5: Run lint to confirm no project-level breakage**

  Run: `npm run lint`
  Expected: Command completes with 0 errors. (The script is `.mjs` and lives outside `app/` / `components/`; ESLint should not pick it up given the flat config's default ignore patterns.)

- [ ] **Step 6: Commit**

  ```bash
  git add package.json package-lock.json scripts/optimize-images.mjs
  git commit -m "$(cat <<'EOF'
  build: add sharp devDep and image optimization script

  Adds the tooling needed to pre-encode /public source images to WebP so
  the Next.js image pipeline does not pay PNG/JPEG -> WebP transformation
  cost on first cold-cache request. Script is idempotent and re-runnable.

  Verified: node --check on the script passes; npm run lint clean; sharp
  installed cleanly from prebuilt binaries (no native compile).
  Ref: ad-hoc
  Agent: Claude

  Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
  EOF
  )"
  ```

---

### Task 2: Generate WebP Outputs and Migrate `<Image>` References

Run the script from Task 1 to produce the three `.webp` files, then update the `<Image src>` references in `Hero.tsx`, `About.tsx`, and `Location.tsx`. Commit all of it as one atomic "image migration" change so the repo is never in a state where a `.webp` reference points to a missing file.

**Files:**
- Create: `public/hero_reception.webp`
- Create: `public/dr_sarah.webp`
- Create: `public/office_map.webp`
- Modify: `components/Hero.tsx:13` (src attribute only — overlay is removed in Task 4)
- Modify: `components/About.tsx:12` (src attribute only)
- Modify: `components/Location.tsx:67` (src attribute only)

**References:**
- `.agents/skills/impeccable/reference/optimize.md`

- [ ] **Step 1: Run the optimization script**

  Run: `node scripts/optimize-images.mjs`
  Expected output (sizes are approximate; exact byte counts will vary slightly):
  ```
  OK  hero_reception.webp           1024x1024  ~110,000 bytes
  OK  dr_sarah.webp                 1024x1024  ~90,000 bytes
  OK  office_map.webp               1024x1024  ~95,000 bytes
  Total WebP bytes: ~295,000
  ```

  Acceptance: each output file is < 200 KB AND the three files together are < 400 KB. If any output exceeds 200 KB, drop that image's quality from 82 to 78 and re-run.

- [ ] **Step 2: Verify the WebP files exist and have sane sizes**

  Run: `ls -la public/*.webp`
  Expected: Three files. Each between 40 KB and 200 KB.

  Run: `file public/*.webp`
  Expected: Each line reports `RIFF (little-endian) data, Web/P image, VP8`.

- [ ] **Step 3: Update Hero image source**

  In `components/Hero.tsx`, change line 13 from:
  ```tsx
          src="/hero_reception.png"
  ```
  to:
  ```tsx
          src="/hero_reception.webp"
  ```
  Do NOT touch any other attribute on the `<Image>` (preserve `fill`, `preload`, `fetchPriority="high"`, `sizes="100vw"`, `quality={60}`, `className`, and `alt`). The overlay `<div>` on line 23 is left intact for now — it is removed in Task 4 as part of a separate commit.

- [ ] **Step 4: Update About image source**

  In `components/About.tsx`, change line 12 from:
  ```tsx
              src="/dr_sarah.png"
  ```
  to:
  ```tsx
              src="/dr_sarah.webp"
  ```
  Preserve all other attributes (`fill`, `sizes="(max-width: 1024px) 100vw, 40vw"`, `quality={70}`, `alt`, `className`).

- [ ] **Step 5: Update Location image source**

  In `components/Location.tsx`, change line 67 from:
  ```tsx
              src="/office_map.png"
  ```
  to:
  ```tsx
              src="/office_map.webp"
  ```
  Preserve all other attributes (`fill`, `sizes="(max-width: 1024px) 100vw, 45vw"`, `quality={70}`, `alt`, `className`).

- [ ] **Step 6: Run lint**

  Run: `npm run lint`
  Expected: Command completes with 0 errors.

- [ ] **Step 7: Run production build**

  Run: `npm run build`
  Expected: Command completes with 0 errors. Look in the build output for the route bundle for `/`; size should be unchanged or smaller vs. the previous build (image references don't affect JS bundle size).

- [ ] **Step 8: Manual visual smoke test**

  Run: `npm run start` (in a separate terminal). Open `http://localhost:3000/` in a real browser.

  Verify:
  - **Hero section**: full-bleed reception photo renders, no obvious compression artifacts in the wood-grain or fireplace nook, no broken-image icon.
  - **About section**: Dr. Sarah portrait renders; skin tones and facial detail are preserved (q82 WebP is conservative but check the eye area and hair edges).
  - **Location section**: office map image renders correctly.
  - **DevTools → Network panel**: filter for `_next/image`. Confirm the optimized image URLs include `url=%2Fhero_reception.webp` (etc.), NOT `.png`. The Content-Type response header for each is `image/webp`.

  If any image looks visibly degraded, drop the offending image's quality from 82 to 88 in `scripts/optimize-images.mjs`, re-run Step 1, and re-test. **STOP HERE and flag the regression — do not proceed to Task 3 with a visible regression.**

  Stop the dev server (`Ctrl+C`) before continuing.

- [ ] **Step 9: Commit**

  ```bash
  git add public/hero_reception.webp public/dr_sarah.webp public/office_map.webp components/Hero.tsx components/About.tsx components/Location.tsx
  git commit -m "$(cat <<'EOF'
  perf: pre-encode /public images to WebP (q82) and migrate Image src refs

  Pre-encoded hero_reception, dr_sarah, and office_map to WebP at source
  dimensions (1024x1024) so the Next.js image pipeline no longer pays the
  PNG/JPEG -> WebP transformation cost on first cold-cache request. This
  is the primary lever for fixing the Run #1 Lighthouse score cliff
  (0.71) AND the steady-state 0.89 ceiling: the LCP byte cost drops ~80%
  and CPU-bound on-the-fly encoding is replaced with cheap byte streaming.

  Original PNG/JPEG sources are retained in /public (unreferenced) for
  future re-encoding at different quality. No design or layout changes.

  Verified: npm run lint clean; npm run build clean; manual visual smoke
  test on Hero/About/Location at desktop and mobile widths shows no
  compression artifacts; DevTools Network confirms WebP is served.
  Ref: ad-hoc
  Agent: Claude

  Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
  EOF
  )"
  ```

---

### Task 3: Trim Font Weight Inventory

Reduce critical-path font requests from 13 woff2 files to 9 by removing four unused weights/styles (Sora 400, Crimson Pro 400, Crimson Pro normal-italic, Crimson Pro 500-italic, Crimson Pro 600-italic) and ADDING Manrope 700 to replace fake-bolding currently happening on body text.

**Files:**
- Modify: `app/layout.tsx`

**References:**
- `.agents/skills/impeccable/reference/typography.md`

- [ ] **Step 1: Update font configuration**

  In `app/layout.tsx`, replace the three font declarations (lines 5–25) with:

  ```tsx
  const sora = Sora({
    subsets: ["latin"],
    weight: ["500", "600", "700"],
    variable: "--font-display",
    display: "swap",
  });

  const manrope = Manrope({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-body",
    display: "swap",
  });

  const crimsonPro = Crimson_Pro({
    subsets: ["latin"],
    weight: ["500", "600"],
    variable: "--font-serif",
    display: "swap",
  });
  ```

  Three precise changes:
  - **Sora**: `["400", "500", "600", "700"]` → `["500", "600", "700"]` (drop 400; nothing pairs `font-display` with `font-normal`).
  - **Manrope**: `["400", "500", "600"]` → `["400", "500", "600", "700"]` (add 700; `font-bold` is used 10× on body-default text and was being fake-bolded).
  - **Crimson Pro**: `["400", "500", "600"]` with `style: ["normal", "italic"]` → `["500", "600"]` with the `style` key **removed entirely** (defaults to `["normal"]`). No `font-serif italic` element exists in any component; no `font-serif font-normal` either.

- [ ] **Step 2: Run lint**

  Run: `npm run lint`
  Expected: Command completes with 0 errors.

- [ ] **Step 3: Run production build**

  Run: `npm run build`
  Expected: Command completes with 0 errors. Inspect the build output: the count of fingerprinted woff2 files under `.next/static/media/` should be lower than the previous build (concretely: previously 13 distinct woff2 files; now 9).

  Run: `ls .next/static/media/*.woff2 | wc -l`
  Expected: `9`

- [ ] **Step 4: Manual font fidelity check**

  Run: `npm run start` (in a separate terminal). Open `http://localhost:3000/` in a real browser.

  Verify in DevTools:
  - **Network panel** filtered to `font`: confirm exactly 9 woff2 files load on the initial page render.
  - **Elements panel** → select the Hero phone-link `<span class="... text-foreground font-bold">` (around `Hero.tsx:54`). Open the Computed tab. Confirm `font-family` resolves to Manrope and `font-weight` is `700` from a real glyph (not synthesized — Chrome reports `Rendered fonts: Manrope — Network resource` rather than `Manrope — Local file (synthetic bold)` in the Fonts subpanel).
  - **Visual**: scan the Hero, Navbar, About, Reviews sections. `font-bold` text should look subtly cleaner/darker than before (real bold glyphs vs. fake-bold stroke widening). No `font-serif` italic should appear anywhere (confirm none was relied on).

  If `font-bold` text looks structurally different (e.g., letter widths shift enough to wrap differently), inspect with Computed: if Chrome still shows synthetic-bold, the Manrope 700 file didn't load — re-run `npm run build` and clear the browser cache.

  Stop the dev server before committing.

- [ ] **Step 5: Commit**

  ```bash
  git add app/layout.tsx
  git commit -m "$(cat <<'EOF'
  perf: trim font weight inventory from 13 to 9 woff2 files

  Removed four unused weights/styles (Sora 400, Crimson Pro 400, all
  Crimson Pro italics) and added Manrope 700 to replace the silent
  fake-bolding that body `font-bold` text was incurring. Net change is
  -5/+1 = -4 woff2 files on the critical path (~40-80 KB saved).

  Side benefit: real Manrope 700 glyphs render cleaner than fake-bold
  on body copy at the Hero phone link, Navbar phone link, and review
  star counts. No design system or layout change.

  Verified: npm run lint clean; npm run build clean; .next/static/media
  now contains 9 woff2 files (was 13); DevTools Computed panel confirms
  font-bold body text uses real Manrope 700 glyphs, not synthetic bold.
  Ref: ad-hoc
  Agent: Claude

  Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
  EOF
  )"
  ```

---

### Task 4: Remove Hero Overlay and Delete Unused Asset

Two small, related "subtractive" cleanups in a single commit: remove the near-invisible `mix-blend-multiply` compositor layer painted over the LCP element in the Hero, and `git rm` the 743 KB unused asset.

**Files:**
- Modify: `components/Hero.tsx:22-23` (remove the overlay `<div>`)
- Delete: `public/treatment_comfort.png`

- [ ] **Step 1: Remove the Hero overlay div**

  In `components/Hero.tsx`, locate lines 22–23:
  ```tsx
          {/* Subtle overlay to soften photo details under the card edge */}
          <div className="absolute inset-0 bg-slate-900/5 mix-blend-multiply" />
  ```

  Delete both lines (the comment AND the `<div>`). The surrounding `<div className="absolute inset-0 z-0">` block (lines 11–24) should now contain only the `<Image>` element. Final state of that block:

  ```tsx
        {/* Full-bleed background photo */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero_reception.webp"
            alt="Cozy residential-style dental reception area featuring warm wood walls and a fireplace nook"
            fill
            preload
            fetchPriority="high"
            sizes="100vw"
            quality={60}
            className="object-cover brightness-[0.98]"
          />
        </div>
  ```

- [ ] **Step 2: Delete the unused asset**

  Run: `git rm public/treatment_comfort.png`
  Expected: file is staged for deletion.

  Quick paranoia check before continuing — confirm the file has no remaining references:
  Run: `grep -r "treatment_comfort" components/ app/ docs/ public/ 2>/dev/null`
  Expected: NO output (no matches). If any line is returned, STOP and investigate — the spec's premise was that this asset is unreferenced.

- [ ] **Step 3: Run lint**

  Run: `npm run lint`
  Expected: Command completes with 0 errors.

- [ ] **Step 4: Run production build**

  Run: `npm run build`
  Expected: Command completes with 0 errors.

- [ ] **Step 5: Manual visual check on the Hero**

  Run: `npm run start`. Open `http://localhost:3000/` in a real browser.

  Verify:
  - The Hero background photo still looks visually balanced. The overlay was at 5% opacity with `mix-blend-multiply`, so its absence should be barely perceptible — but check that the white "Hearth Panel" card on top of the photo still has clear visual separation from the background.
  - If the photo now feels too bright/dominant under the card, increase the existing `className="object-cover brightness-[0.98]"` on the Image to `brightness-[0.96]` and rebuild. Acceptance: the card-on-photo contrast feels equal-or-better than before.

  Stop the dev server.

- [ ] **Step 6: Commit**

  ```bash
  git add components/Hero.tsx
  git commit -m "$(cat <<'EOF'
  perf: drop Hero mix-blend overlay and delete unused public asset

  Removed the absolute-positioned <div class="bg-slate-900/5
  mix-blend-multiply"> that was painting a compositor layer directly
  over the LCP element at 5% opacity. The visual effect is functionally
  invisible at that opacity, but mix-blend-mode forces a new compositor
  surface and adds paint cost on the largest contentful paint pixel.
  Existing brightness-[0.98] on the Image itself provides any needed
  warming without a separate layer.

  Also git rm'd public/treatment_comfort.png (743 KB), confirmed
  unreferenced from any component, app, doc, or public-folder source.
  Net /public size drops by ~743 KB. File remains in git history if
  ever needed.

  Verified: npm run lint clean; npm run build clean; manual Hero render
  check shows the Hearth Panel still has clear contrast against the
  background; grep -r treatment_comfort returns no remaining refs.
  Ref: ad-hoc
  Agent: Claude

  Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
  EOF
  )"
  ```

---

### Task 5: Final Verification — Full LHCI Run

Run the actual Lighthouse CI assertion suite — the same command that was failing — and confirm the median performance score is now ≥ 0.92 with Run #1 stable at ≥ 0.90. This task does NOT produce code changes; it produces a documented pass-or-fail result.

**Files:** (none modified; documentation only)

- [ ] **Step 1: Clean build state**

  Run: `rm -rf .next && rm -rf .lighthouseci`
  Expected: Both directories are removed (or already absent).

  Run: `npm run build`
  Expected: Production build completes cleanly. Note final route bundle size for `/` and compare against the build output from Task 2 Step 7 (should be equal or smaller; no regression).

- [ ] **Step 2: Run the LHCI suite**

  Run: `npx lhci autorun`
  Expected output (3 runs, then assertions):
  ```
  Healthcheck passed!
  Started a web server with "npm run start"...
  Running Lighthouse 3 time(s) on http://localhost:3000
  Run #1...done.
  Run #2...done.
  Run #3...done.
  Done running Lighthouse!
  Checking assertions against 1 URL(s), 3 total run(s)
  No assertion failures.
  Uploading median LHR of http://localhost:3000/...success!
  ```

- [ ] **Step 3: Verify acceptance gates**

  From the LHCI output:
  - **All four categories** (`performance`, `accessibility`, `best-practices`, `seo`) report no assertion failure at `minScore: 0.9`.
  - **Performance median**: open the median LHR (uploaded link from the LHCI run output) and verify the Performance score ring shows ≥ 92.
  - **Run #1 individual score**: scroll the LHCI terminal output for the line `all values: X, Y, Z` under the performance assertion (if it had passed it won't print this — in that case open the JSON in `.lighthouseci/lhr-*.json` for the first run and check `categories.performance.score >= 0.90`).

  Acceptance:
  - `npx lhci autorun` exit code is `0`.
  - Performance median score ≥ 0.92.
  - Each individual run's performance score ≥ 0.90 (no cold-cache outlier under 0.90).
  - No regression in accessibility / best-practices / SEO scores (each ≥ their previous run's score).

  **If any of the above fails:**
  - If performance median ≥ 0.90 but < 0.92: pass the LHCI gate but flag the lack of headroom in the final summary.
  - If performance median < 0.90: STOP. Re-read the failing audits from the LHR JSON, identify which Phase did not deliver the expected savings, and report back with the audit names and savings numbers. Do NOT attempt to fix-forward without re-entering the brainstorming/spec loop.
  - If only Run #1 < 0.90 while runs #2 and #3 are ≥ 0.92: the cold-cache cliff isn't fully closed. Confirm by examining the first run's LHR `audits.uses-responsive-images` and `audits.efficient-animated-content`. The likely cause is residual Next.js image pipeline first-touch overhead; flag for follow-up.

- [ ] **Step 4: Document the result**

  No commit. Report back in the chat with:
  - Median performance score
  - Run-by-run scores (e.g., `0.93, 0.95, 0.94`)
  - LHCI median report URL
  - One-sentence assessment of whether headroom is sufficient

---

## Verification Summary (Plan-Level)

Per spec §5, the work is accepted when ALL of the following hold simultaneously:

- [x] `npm run lint` clean (verified at the end of each task)
- [x] `npm run build` clean (verified at the end of each task)
- [x] `npx lhci autorun` exits 0 (Task 5)
- [x] Median performance score ≥ 0.92 (Task 5)
- [x] No individual Lighthouse run scores < 0.90 in performance (Task 5)
- [x] Accessibility, best-practices, SEO scores ≥ their previous values (Task 5)
- [x] No visual regression at Hero / About / Location vs. pre-fix build (manual checks in Tasks 2, 3, 4)
- [x] `font-bold` body text renders real Manrope 700 glyphs, not synthetic bold (Task 3 Step 4)

## Rollback Procedure

Each task ends in its own commit. If any phase causes a regression that cannot be fixed in-place:

```bash
# Revert the most recent task's commit
git revert HEAD

# Or revert a specific task by hash from `git log --oneline`
git revert <task-N-hash>
```

The plan is structured so reverts are independent: reverting Task 4 (overlay + asset) does not require reverting Tasks 1–3. Original PNG sources (`hero_reception.png`, `dr_sarah.png`, `office_map.png`) remain in `/public` so a partial revert of Task 2 (image src refs only, keep the WebP files) is also possible by checking out the component files at `HEAD~N`.

## Out of Scope (Reaffirmed From Spec §7)

This plan does NOT:
- Re-introduce AVIF in `next.config.ts` (would re-introduce the Run #1 cliff per `56e92f5`).
- Loosen `minScore` in `lighthouserc.js`.
- Add a CI-side image cache warmup step.
- Introduce `placeholder="blur"` / blurDataURL on any `<Image>`.
- Change copy, layout, color, type scale, spacing, or any element of DESIGN.md.
- Switch font hosting away from `next/font/google`.
- Add or modify any test (Playwright, unit, integration). The only verification is LHCI + manual visual checks.
- Delete the original PNG/JPEG source files from `/public` (they remain unreferenced; future cleanup pass can handle).
