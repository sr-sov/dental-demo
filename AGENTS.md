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
