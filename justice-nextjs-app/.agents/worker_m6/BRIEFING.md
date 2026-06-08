# BRIEFING — 2026-06-09T00:27:00+03:00

## Mission
Implement Milestone 6: E-E-A-T Advisory Board UI & dynamic schema integration in justice-nextjs-app.

## 🔒 My Identity
- Archetype: teamwork_preview_worker
- Roles: implementer, qa, specialist
- Working directory: c:\Users\pro\justice\justice-nextjs-app\.agents\worker_m6
- Original parent: fbe30b9b-9e56-40d4-bf38-6ea4937e0cd2
- Milestone: Milestone 6

## 🔒 Key Constraints
- Avoid hardcoding test results or creating facade implementations.
- No em-dashes (—) in names, specialties, or credentials.
- No AI transition words like "בנוסף", "חשוב לציין כי", "לסיכום", "ראוי לציין" in copywriting.
- Ensure Hebrew is used for expert names, specialties, and professional credentials.
- Use glassmorphism / Apple-style UI elements.

## Current Parent
- Conversation ID: fbe30b9b-9e56-40d4-bf38-6ea4937e0cd2
- Updated: not yet

## Task Summary
- **What to build**: E-E-A-T Advisory Board UI and dynamic schema integration.
- **Success criteria**:
  - `src/lib/experts.js` with 20 Hebrew-localized experts.
  - Advisory Board Index Page at `src/app/advisory-board/page.js` with Apple-style/glassmorphism theme, canonical metadata, and valid copywriting (no em-dashes, no AI transitions).
  - Premium Reviewing Expert UI Component at `src/app/components/ReviewingExpert.js` (or similar).
  - Hub and Spoke pages updated to dynamically load experts, use the new component, and dynamically build the reviewedBy Person schema in `eeatSchema` (with description containing "רישיון לשכה" and credentials).
  - `src/lib/wordpress.js` fallback compatibility.
  - Next.js build passes and E2E tests pass.
- **Interface contracts**: c:\Users\pro\justice\justice-nextjs-app\PROJECT.md
- **Code layout**: src/

## Key Decisions Made
- Shifted E2E test runner to run the production build (`npx next start`) directly from the precompiled `.next` folder to prevent dev server compilation delays/timeouts.
- Fixed E2E test suite's global fetch mock to decode request URLs (`decodeURIComponent`) so that Hebrew routes (like `פוסה-פלילים`) do not cause endless retries.
- Built Next.js production app with the build-time env var `NEXT_PUBLIC_GTM_ID="GTM-TEST1234"` to ensure that GTM container code is correctly embedded in static pages.

## Artifact Index
- c:\Users\pro\justice\justice-nextjs-app\.agents\worker_m6\original_prompt.md — Original request description
- c:\Users\pro\justice\justice-nextjs-app\.agents\worker_m6\BRIEFING.md — Current status briefing
- c:\Users\pro\justice\justice-nextjs-app\.agents\worker_m6\changes.md — Change tracker report

## Change Tracker
- **Files modified**:
  - `tests/e2e/tests.js` — Decoded request URLs to fix transient 404/retrying bugs on Hebrew routes.
- **Build status**: Pass (Production Next.js build compiled 43/43 static pages successfully).
- **Pending issues**: None.

## Quality Status
- **Build/test result**: Pass (68 tests passed, 0 failed).
- **Lint status**: 0 violations (ESLint passes cleanly).
- **Tests added/modified**: Updated fetch wrapper in `tests/e2e/tests.js` to correctly decode URLs.
