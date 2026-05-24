<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:lockfile-rules -->
# Lockfile Regeneration Rules

When you need to regenerate `package-lock.json` (e.g., after resolving a merge conflict), you MUST delete BOTH `node_modules` and `package-lock.json` before running `npm install`:

```bash
rm -rf node_modules package-lock.json && npm install
```

If you only delete the lockfile and keep `node_modules`, optional transitive native dependencies (`@emnapi/*`, etc.) may be skipped during resolution. The resulting lockfile will reference them in package metadata but lack their `"node_modules/@scope/name"` entries, causing `npm ci` to fail on CI.

After regeneration, verify with:
```bash
node -e "const fs = require('fs'); const lock = JSON.parse(fs.readFileSync('package-lock.json','utf8')); const p = lock.packages; const missing = ['@emnapi/core','@emnapi/runtime'].filter(n => !p['node_modules/'+n]); if (missing.length) { console.error('MISSING from lockfile:', missing); process.exit(1) } else { console.log('Lockfile OK — all native deps resolved') }"
```
<!-- END:lockfile-rules -->

<!-- BEGIN:worktree-rules -->
# Worktree Placement

Use sibling-level dirs OUTSIDE the project tree:
```bash
git worktree add ~/dental-demo-feat-X -b feat-X
```
Nested worktrees (`.worktrees/`) may crash Turbopack `npm run build` with Bus error. If it happens, `git worktree move .worktrees/feat-X ~/dental-demo-feat-X`.
<!-- END:worktree-rules -->

<!-- BEGIN:lighthouse-ci -->
# Lighthouse CI — CI-First

Never run `lhci autorun` locally in WSL2 (Chrome port conflicts). Push branch → open PR → check Checks tab.

Best-practices assertion at 0.85 (not 0.9) — Calendly iframe causes unavoidable `inspector-issues` + `third-party-cookies`. This is a known, accepted tradeoff.

`VercelProviders` MUST guard behind `process.env.VERCEL` or `errors-in-console` fails from 404 script injection.

**Workflow YAML pitfall:** When extracting scores with Python in the `run:` block, use `python3 <<EOF` heredoc, NOT `python3 -c "..."`. YAML `|` blocks preserve indent literally, causing IndentationError in Python. Always add `shopt -s nullglob` before globbing `.lighthouseci/lhr-*.json` to handle missing files gracefully.
<!-- END:lighthouse-ci -->

<!-- BEGIN:lint-rules -->
# ESLint — Third-Party Noise

`.agents/` scripts produce 118+ lint warnings. Already excluded via `globalIgnores` in `eslint.config.mjs`. If fresh clone lacks it, add:
```js
".agents/**",
```
Verify: `npm run lint` exits 0 with zero warnings.
<!-- END:lint-rules -->
