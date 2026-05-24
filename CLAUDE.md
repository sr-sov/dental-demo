# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## What this repo is

A landing-page build for **Prairie Oak Dental Studio** (Calgary). The creative brief — brand identity, audience personas, service categories, conversion goals — lives in `docs/BRIEF.md`. Treat it as the source of truth for any copy, IA, or design decisions; the scaffold under `app/` is still the unmodified `create-next-app` starter.

## Stack

- **Next.js 16.2.6** (App Router) on **React 19.2.4**
- **TypeScript 5** with `strict: true`, `moduleResolution: "bundler"`, path alias `@/*` → repo root
- **Tailwind CSS v4** via `@tailwindcss/postcss` — config is CSS-first inside `app/globals.css` (`@import "tailwindcss"` + `@theme inline { … }`). There is no `tailwind.config.ts`.
- **ESLint 9** flat config (`eslint.config.mjs`) extending `eslint-config-next/core-web-vitals` + `/typescript`

## Commands

| Task | Command |
|---|---|
| Dev server | `npm run dev` (http://localhost:3000) |
| Production build | `npm run build` |
| Production server | `npm run start` |
| Lint | `npm run lint` (runs plain `eslint` — `next lint` was removed in Next 16) |

No test runner is installed and there is no `test` script. If a task needs tests, pick and install a runner (Vitest/Jest/Playwright) before claiming "tests pass."

## Next.js 16 — things LLMs commonly get wrong

`AGENTS.md` exists because trained APIs lag this version. Before writing anything non-trivial, read the relevant page under `node_modules/next/dist/docs/01-app/` (`01-getting-started/`, `02-guides/`, `03-api-reference/`). Specific footguns in 16:

- **`middleware.ts` is deprecated — use `proxy.ts`.** Same matcher/config shape; see `03-api-reference/03-file-conventions/proxy.md`. Codemod exists.
- **`<Image priority>` is deprecated — use `<Image preload>`.** The scaffold's `app/page.tsx` still passes `priority`; replace it if you touch that file.
- **`params`, `searchParams`, `cookies()`, `draftMode()` are async.** Await them in Server Components and route handlers. Sync access still works in 15-compat mode but is going away.
- **App Router uses React canary built-in**, not the version in `package.json`. Don't pin React features to the listed 19.2.4 — newer hooks may be available.
- **`useFormState` → `useActionState`.** The old hook still exists but is deprecated in React 19.
- **Caching defaults changed** across recent versions. Check `01-getting-started/08-caching.md` and `02-guides/migrating-to-cache-components.md` before reasoning about cache behavior from memory.

The bundled docs include `{/* AI agent hint: … */}` comments at the top of pages where agents typically go wrong (e.g. `streaming.md`, `08-caching.md`, `04-linking-and-navigating.md`, `loading.md`). Read those hints when present.

## Layout notes

- `app/` — App Router root. Currently only `layout.tsx`, `page.tsx`, `globals.css`, `favicon.ico`. Geist fonts are loaded via `next/font/google` in `layout.tsx` and exposed as `--font-geist-sans` / `--font-geist-mono` CSS vars wired through `@theme inline`.
- `public/` — static assets served at `/`.
- `docs/BRIEF.md` — product brief (read this for any content/design task).
- `docs/superpowers/specs/`, `docs/memory/` — empty placeholders for the agentic-os skill workflow; populated by skills like `writing-plans`, `designing-ui`, `recording-memory` when invoked.
- `.dev/` — gitignored scratch space for agent process notes. Safe to write to; never commit.

## Workflow expectations

- Treat `docs/BRIEF.md` as immutable client direction unless the user changes it — don't substitute generic dental copy, alter the color system (deep slate blue + warm taupe/sage; orange/gold reserved for primary CTAs), or invent services not in §4.
- For new UI work, the project is set up for the `brainstorming` → `designing-ui` / `drafting-screens` → `writing-plans` → `executing-plans` skill chain. Use it when scope is non-trivial.
