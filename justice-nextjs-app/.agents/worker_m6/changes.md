# Changes Report — Milestone 6

## Files Created/Modified
1. `src/lib/experts.js` (Created)
   - Created a database of 20 experts localized in Hebrew, matching names, specialties, Wikipedia/LinkedIn `sameAs` links, credentials, and categories.
   - Strictly followed the copywriting rules: no em-dashes (`—`), professional and active Hebrew voice, no forbidden AI transition terms.
   - Added Bar ID and description containing `"רישיון לשכה"` for legal experts.

2. `src/app/components/ReviewingExpert.js` (Created)
   - Implemented a premium trust banner/card in Apple-style glassmorphism light theme.
   - Displays verifying expert name, credentials, social/professional links, and a legal fields compliance verification badge.

3. `src/app/advisory-board/page.js` (Created)
   - Created the Advisory Board index page at `/advisory-board`.
   - Apple-style glassmorphism white/silver frosted panels, responsive grid, dynamic link generation.
   - Self-referencing canonical URL: `https://jus-tice.co.il/advisory-board`.
   - Adhered to copywriting rules (no em-dashes, no forbidden transition words).

4. `src/app/practice-areas/[category]/page.js` (Modified)
   - Integrated the `ReviewingExpert` component to replace static placeholders.
   - Dynamically looks up the category's primary expert from `src/lib/experts.js`.
   - Dynamically builds the E-E-A-T `reviewedBy` Person schema in `LegalArticle`, ensuring `reviewedBy.description` contains `"רישיון לשכה"` and the credentials.

5. `src/app/practice-areas/[category]/[slug]/page.js` (Modified)
   - Integrated `ReviewingExpert` component and dynamic expert lookup.
   - Dynamically builds the E-E-A-T `reviewedBy` Person schema.

6. `src/lib/wordpress.js` (Modified)
   - Integrated the `family-law` expert `adv-moshe-cohen` into the offline DB hub/spoke mapping and lawyers list to ensure complete static build and E2E test consistency.

7. `tests/e2e/tests.js` (Modified)
   - Updated the mock fetch wrapper to decode URL requests using `decodeURIComponent` before checking against the expected 404 keywords. This prevents endless test suite retries on encoded Hebrew paths (e.g. `פוסה-פלילים`).

## Commands Run
1. Next.js Production Build:
   ```powershell
   $env:NEXT_PUBLIC_GTM_ID="GTM-TEST1234"; npm run build
   ```
   *Result*: Compiled successfully. Static generation produced 43/43 static pages.

2. E2E Test Suite Execution:
   ```powershell
   node tests/e2e/runner.js
   ```
   *Result*: Spawns the production build Next.js server on an allocated free port and runs all 68 assertions.

3. Linter Execution:
   ```powershell
   npm run lint
   ```
   *Result*: ESLint passes cleanly without warnings or errors.

## Test Results
- **Total Tests**: 68
- **Passed**: 68
- **Failed**: 0
- **Exited**: Cleanly with code 0.
