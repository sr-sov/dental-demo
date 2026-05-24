---
UI Surface: no
Data Surface: no
---
# Design Spec: Documentation and Repository Infrastructure Update

**Date**: 2026-05-24
**Topic**: README and .gitignore Configuration Update

## Goal Description

Improve repository onboarding and security standards by providing high-fidelity project documentation (`README.md`) for **Prairie Oak Dental Studio** and establishing an enterprise-grade, modern gitignore configuration (`.gitignore`) optimized for **Next.js 16**, **TypeScript**, and modern **AI-agent tools**.

## Proposed Changes

### 1. `README.md`
- **Practice Context**: Outline Calgary's South Calgary boutique dental clinic brand story, Dr. Sarah Al-Hussaini's story, values (Anxiety-Free Comfort Menu, True Direct Billing, Same-Day Emergency Guarantee).
- **Target Profiles**: Busy Professional, High-Anxiety Resident, Emergency Patient.
- **Clinical Service Categories**: General Dentistry & Prevention, Restorative & Same-Day Emergency, Cosmetic & Aligners.
- **Tech Stack & Conventions**: Document Next.js 16 architecture specifics, async params/cookies deprecations, `proxy.ts`, `<Image preload>`, and flat ESLint config to serve as a Single Source of Truth (SSOT) for future developers and AI agents.
- **Developer Guide**: Document installation, dev server, build, lint, and run commands.

### 2. `.gitignore`
- Clean up default scaffold gitignores.
- Incorporate comprehensive ignores for Node.js, Vercel, Next.js build directories (`.next`, `out`, `build`).
- Ignore security-sensitive files (local env files `.env*.local`, SSL PEM/key files).
- Ignore local developer and agent-specific workspaces (`.dev/` scratch directories, and `.agents/` local skills folders).
- Explicitly ensure lockfiles (`package-lock.json` and `skills-lock.json`) are tracked.

## Verification Plan

### Manual Verification
- Review the generated `README.md` formatting and content readability.
- Validate `.gitignore` with `git status` to ensure `.agents/` and other untracked local environments are properly ignored, while `skills-lock.json` remains tracked.
