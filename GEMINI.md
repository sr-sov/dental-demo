# GEMINI.md

This file provides instruction and guidelines to the Gemini/Antigravity AI agent when working in this repository.

## ⚠️ Crucial Git & Commit Hooks Protocol

1.  **NEVER use the `--no-verify` flag.** You must always allow the repository's git pre-commit hooks to run to validate file builds, TypeScript checks, and code lints before finalizing commits.
2.  **Commit Message Integrity:** Every commit must contain the required metadata trailers at the bottom of the message:
    ```text
    Verified: <concrete description of tests/build checks run>
    Ref: ad-hoc
    Agent: Antigravity
    ```
3.  **Descriptive Messages:** Avoid lean, single-line commit messages. Write rich, descriptive bodies detailing exactly what was created, updated, or refactored (e.g., sections, file hierarchies, and image assets), ensuring maximum visibility in the repository history.

## Stack Overview

-   **Next.js 16.2.6** (App Router) on **React 19.2.4**
-   **TypeScript 5** with path alias `@/*` mapping to the repository root
-   **Tailwind CSS v4** via `@tailwindcss/postcss` (configured inside `app/globals.css` with `@theme`)
-   **ESLint 9** flat configuration (`eslint.config.mjs`)

## Command Palette

| Task | Command |
|---|---|
| Development | `npm run dev` |
| Build check | `npm run build` |
| Code Linting | `npm run lint` (runs plain `eslint`) |

## Next.js 16 Specific Rules

-   **`middleware.ts` is deprecated:** Use `proxy.ts`. Refer to `node_modules/next/dist/docs/03-api-reference/03-file-conventions/proxy.md` for matcher shapes.
-   **`<Image priority>` is deprecated:** Use `<Image preload>` for above-fold LCP elements.
-   **Async Contexts:** Await dynamic APIs like `params`, `searchParams`, `cookies()`, and `draftMode()`.
-   **Form Hooks:** Use `useActionState` instead of the deprecated `useFormState` hook.
