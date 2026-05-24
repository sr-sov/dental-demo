# Prairie Oak Dental Studio — Developer Lessons & Technical Gotchas

This file documents technical gotchas, environment fixes, compile bottlenecks, and CLI workarounds encountered during development.

---

## 2026-05-24 — Next.js 16/Turbopack Bus Error (Core Dumped) inside Git Worktrees

*   **Problem:** Running `npm run build` or `npx next build` inside the nested project-local worktree directory `.worktrees/feat-calendly-integration` instantly crashed with a `Bus error (core dumped)` with exit code 135.
*   **Root Cause:** Next.js 16 (Turbopack) attempts to infer the workspace root by climbing up the parent directory tree until it finds the root `package-lock.json` and `.git` repository folder. In a nested local worktree setup, it climbed out into `/home/soverwatch/dental-demo` and scanned the entire root folder recursively—including all other nested active worktrees' massive `node_modules` directories and `.next` build caches—rapidly exceeding memory mapping capacities.
*   **Fix:** Create and run git worktrees in the **isolated global directory** (`~/.config/superpowers/worktrees/dental-demo/feat-calendly-integration`) completely outside the project's physical tree, which isolates files and avoids parent-climbing workspace root inference crashes entirely.

---

## 2026-05-24 — Multi-line Git Commit Hooks Blocking on Leading Spaces

*   **Problem:** Git commits hung indefinitely during pre-commit/commit-msg hook execution when committing from the command line.
*   **Root Cause:** The repository's `.git/hooks/commit-msg` bash script validates required headers (e.g. `Verified:`, `Ref:`, `Agent:`) using the strict regex pattern `^\${field}:[[:space:]]+\\S`. When commit messages were written with leading indentation spaces (e.g., inside multi-line strings), the hooks failed to parse the fields, and the terminal session blocked indefinitely instead of throwing a clean exit code.
*   **Fix:** Avoid all leading spaces/indentations on metadata lines when executing multi-line commits:
    ```bash
    git commit -m "chore: description

    Verified: details
    Ref: ad-hoc
    Agent: Antigravity"
    ```
