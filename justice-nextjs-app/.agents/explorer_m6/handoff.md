# Handoff Report — Explorer Milestone 6

## 1. Observation
- **Codebase Routing**: Hub pages are located at `src/app/practice-areas/[category]/page.js` and Spoke pages are located at `src/app/practice-areas/[category]/[slug]/page.js`. Both routes use `generateStaticParams()` to load dynamic paths.
- **Offline Fallback Definition**: In `src/lib/wordpress.js`, the `OFFLINE_DB` object (starting at line 144) defines local mock records for hubs (e.g. `labor-law`, `real-estate-law`) and dynamic spokes.
- **Advisory Board & E-E-A-T Schema**: Inside `src/app/practice-areas/[category]/page.js` (lines 48-69), we directly observed the reviewedBy structured data being built as a `Person` schema:
  ```javascript
  const expertSchema = {
    '@context': 'https://schema.org',
    '@type': 'LegalArticle',
    'headline': hub.title,
    'author': { '@type': 'Organization', 'name': 'JUS-TICE' },
    'reviewedBy': {
      '@type': 'Person',
      'name': hub.expert.name,
      'description': `רישיון לשכה ${hub.expert.barId} - ${hub.expert.credentials}`,
      'url': hub.expert.bioUrl,
      'sameAs': hub.expert.linkedin
    }
  };
  ```
- **E2E Testing Rules**: In `tests/e2e/tests.js`, we observed test validations for sitemaps (`sitemap.xml` size and path checks), routing redirects, E-E-A-T reviewedBy schemas, and copywriting constraints.
  - Line 76: `assert.ok(!html.includes('—'), ...)` checks that there are no em-dashes.
  - Line 83: `assert.ok(!cleanText.includes(tell), ...)` checks for forbidden AI transition tells (e.g. `בנוסף`, `לסיכום`).
  - Line 97: `assert.ok(found, ...)` checks that the HTML contains at least one Israeli law citation (e.g. `חוק פיצויי פיטורים`).
- **Test execution command**: Run command `node tests/e2e/runner.js` launched a dynamic dev server on port 49675. The tests successfully executed and validated API routes, leads, checkout, reviews caching, and sitemaps.

## 2. Logic Chain
- Since the portal is designed with an offline-first philosophy, any changes to dynamic content (like adding 20 experts) must be defined both in the production headless CMS and in local fallback files.
- The sitemaps, schemas, and routes are dynamically compiled from this content; hence, expanding `OFFLINE_DB` or introducing a new `experts-db.json` file will automatically populate the sitemap entries and dynamic parameters when static HTML pages compile.
- If we update the page rendering templates to load list arrays from `experts-db.json` based on the matching `specialties` slug field, we can dynamically link multiple legal advisors to their respective practice category Hub and Spoke pages.
- Correspondingly, updating the `reviewedBy` schema object in the `LegalArticle` structured data to accept an array of mapped expert `Person` profiles maintains compliance with Google's E-E-A-T guidelines while scaling validation rules.

## 3. Caveats
- We operated under `CODE_ONLY` network restrictions, meaning live GraphQL endpoint requests to the WordPress remote site could not be queried or tested. Live behaviors are assumed based on the design of local fallbacks inside `src/lib/wordpress.js`.
- The Next.js dev server compilation on Windows using Webpack dev tools occasionally triggers transient module eval errors on `/` (TypeErrors relating to client/server icons cache during hot reloading), which the E2E runner handles through automated retry loops.

## 4. Conclusion
- A dual-layer integration strategy is the ideal route: defining a custom post type `justice_expert` in WordPress for live sync, and storing a fallback database in `src/lib/experts-db.json` inside the repository.
- Detailed implementation mappings have been drafted and documented in the analysis report at `c:\Users\pro\justice\justice-nextjs-app\.agents\explorer_m6\analysis.md`.

## 5. Verification Method
- **Analysis Verification**: Inspect the structured analysis report generated at `c:\Users\pro\justice\justice-nextjs-app\.agents\explorer_m6\analysis.md`.
- **Code Trace**: Open `src/lib/wordpress.js` to inspect the structure of the categories fallbacks, and open `tests/e2e/tests.js` to view E-E-A-T and copywriting assertions.
- **Project Test Execution**: Run `node tests/e2e/runner.js` to verify that the E2E validation test suite compiles and runs on the target workspace environment.
