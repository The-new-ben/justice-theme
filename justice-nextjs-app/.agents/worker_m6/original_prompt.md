## 2026-06-09T00:17:47Z
Your working directory is c:\Users\pro\justice\justice-nextjs-app\.agents\worker_m6.
Your identity is teamwork_preview_worker.
Your objective is to implement Milestone 6: E-E-A-T Advisory Board UI & dynamic schema integration.

DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Here are the details of the work items:

1. **Database of 20 Experts**:
   Create a new file `src/lib/experts.js` which exports an array of the 20 experts listed in ORIGINAL_REQUEST.md. Ensure their names, specialties, and professional credentials are in Hebrew. Here are the 20 experts:
   - Rand Fishkin (SEO Strategy)
   - Danny Sullivan (Search Quality Compliance)
   - Avvo Chief Architect (Legal Marketplaces)
   - Israel Bar Association Ethics Counsel (Compliance) -> Needs a Bar ID (e.g. 99999) and description containing "רישיון לשכה"
   - Jakob Nielsen (UX/UI Design)
   - Next.js Core Engineer (Web Performance)
   - Google Schema Markup Lead (Structured Data)
   - Enhanced Conversions Specialist (Analytics)
   - Israel Labor Law Specialist (Legal Domain Content) -> Should match עו״ד מיטל לוי, Bar ID 76543, Category "labor-law"
   - Israel Personal Injury Specialist (Legal Domain Content) -> Should match עו״ד שמעון מזרחי, Bar ID 98765, Category "personal-injury"
   - Israel Family Law Specialist (Legal Domain Content) -> Should match עו״ד משה כהן or similar (you can use Bar ID 71234, Category "family-law")
   - Israel Real Estate Specialist (Legal Domain Content) -> Should match עו״ד דניאל כהן, Bar ID 54321, Category "real-estate-law"
   - Israel Criminal Law Specialist (Legal Domain Content) -> Should match עו״ד יונתן רפאלי, Bar ID 87654, Category "criminal-law"
   - Israel Medical Malpractice Specialist (Legal Domain Content) -> Should match עו״ד רחל לוין, Bar ID 65432, Category "medical-malpractice"
   - Ahrefs Israel Market Analyst (Keyword Gaps)
   - Supabase Core Engineer (Database & Auth)
   - Cybersecurity Specialist (Data Privacy)
   - Conversion Rate Optimization Lead (UI/UX Funnels)
   - Net HaMishpat API Architect (Systems Integration)
   - Google Search Console Product Owner (Programmatic Indexing)

   Each expert object should contain: `id`, `slug`, `name`, `specialty`, `credentials` (must NOT contain em-dashes `—`), `sameAs` (array or string of Wikipedia, LinkedIn, etc.), `barId` (for lawyers), and `category` (an array of categories they are mapped to).

2. **Advisory Board Index Page**:
   Create a dedicated page at `src/app/advisory-board/page.js` to display all 20 experts.
   - Design: Apple-style/glassmorphism light theme. White/silver milky panels, subtle shadows, clean font styling, responsive grid.
   - Content: Show name, specialty, role, bar ID (if lawyer), LinkedIn/Wikipedia links, and credentials.
   - Copywriting: NO em-dashes `—`. No AI transition words like "בנוסף", "חשוב לציין כי", "לסיכום", "ראוי לציין". Use active Hebrew voice.
   - Canonical metadata: `https://jus-tice.co.il/advisory-board`.

3. **Premium Reviewing Expert UI Component**:
   Create `src/app/components/ReviewingExpert.js` (or similar).
   - Display: A premium-designed banner/card indicating the content was reviewed and approved by the expert.
   - Details: Include bar ID, SameAs credentials link, LinkedIn/Wikipedia, and a "legal fields compliance verification" badge/disclaimer.
   - Style: White/silver milky glassmorphism style.

4. **Dynamic Link Hub and Spoke Pages**:
   - Update `src/app/practice-areas/[category]/page.js` (Hub) and `src/app/practice-areas/[category]/[slug]/page.js` (Spoke) to import/lookup the primary expert for the category from `src/lib/experts.js`.
   - Replace the static/hardcoded expert section with the new `ReviewingExpert` component.
   - Dynamically build the `reviewedBy` Person schema in `eeatSchema` using the expert's actual data from your database. Make sure `reviewedBy.description` contains "רישיון לשכה" and the expert's credentials.

5. **Wordpress.js Fallback Compatibility**:
   Ensure `src/lib/wordpress.js` references the correct expert data from `src/lib/experts.js` to ensure the E2E tests and page static builds remain perfectly consistent.

6. **Verify the implementation**:
   Run Next.js build: `npm run build` (or similar command in the nextjs directory) and E2E tests `node tests/e2e/runner.js` to ensure everything compiles successfully and all E2E assertions pass.

Write your changes report to `c:\Users\pro\justice\justice-nextjs-app\.agents\worker_m6\changes.md` and send a handoff message when done. Include the commands run and test results.
