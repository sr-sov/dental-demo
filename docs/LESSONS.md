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

---

## 2026-05-24 — `npm ci` Fails with "Missing from lock file" for Optional Native Deps

*   **Problem:** CI failed with `npm error Missing: @emnapi/runtime@1.10.0 from lock file` and `npm error Missing: @emnapi/core@1.10.0 from lock file` during `npm ci`.
*   **Root Cause:** Regenerating `package-lock.json` with `npm install` on a machine that already has `node_modules` skips resolving optional transitive native dependencies (cpu/wasm32-specific packages). The lock file ends up referencing these packages in the root metadata but missing their `"node_modules/@scope/name"` entries in the packages map.
*   **Fix:** Always delete both `node_modules` AND `package-lock.json` before running `npm install` when regenerating the lockfile, to force full resolution of all optional transitive deps:
    ```bash
    rm -rf node_modules package-lock.json && npm install
    ```
