# Gemini/Antigravity browser audit prompt: live WordPress site only

Owner instruction 2026-07-02: scope Gemini strictly to the LIVE site
jus-tice.co.il, driving a real Chrome browser. No code repos, no
imagining. Paste the block below as one message.

---- PROMPT STARTS BELOW THIS LINE ----

You are auditing the LIVE production website https://jus-tice.co.il
using a real Chrome browser that you control. This engagement has hard
boundaries:

SCOPE: ONLY the live WordPress site jus-tice.co.il, as a visitor in a
real browser. Out of scope: any code repository, the Next.js app, any
other domain, and wp-admin (do not attempt to log in anywhere).

METHOD: real browsing only. Every finding must come from something you
actually did in the browser: a page you loaded, a button you clicked, a
screenshot you took, a DevTools panel you read. If you did not see it
in the browser, it does not go in the report. No extrapolation from
memory of how WordPress sites usually behave.

ALLOWED ACTIONS: navigating, scrolling, clicking, filling public forms.
When a form requires personal details, use EXACTLY the name
TEST-GEMINI-AUDIT, phone 0500000000, email test-audit@example.com so
the owner can identify and delete the test entries. Submit at most one
test lead per distinct form. FORBIDDEN: logging in, registering as a
lawyer with real-looking data, payments, anything destructive, and
repeated spam submissions.

## The browse plan (do all of it, desktop AND mobile emulation)

1. HOMEPAGE: full scroll, desktop 1440px and mobile 390px. Check: hero
   renders, situational router works, the AI center panel, the virtual
   courtroom panel and its button "צפייה בהדמיה החזותית" (click it: does
   the visual simulation iframe load and function?), featured lawyers,
   practice areas, FAQ accordion, footer links. DevTools console: list
   every error/warning. Network tab: list every failed request (4xx/5xx)
   and every request over 1MB.
2. AI TOOLS at /legal-tools/: open, pick a tool (e.g. residential
   lease), fill the questionnaire, generate the free draft, then trigger
   the lead gate with the TEST-GEMINI-AUDIT details, upload nothing.
   Record: did each step visibly work, what feedback did the UI give,
   any console errors. Test language toggle EN/HE. Check the matched
   lawyers rail appears and its links work.
3. DIRECTORY at /lawyers/: browse, use the area filter links, open at
   least 3 lawyer profiles. On each: photo or initials, badges, rating
   display, contact buttons (do the tel:/WhatsApp links form correctly?),
   inquiry links.
4. FLAGSHIP PROFILE /lawyers/advocate-maya-rotenberg/: full-page
   screenshot desktop + mobile. Verify each module renders: portrait
   photo, headline, services, credentials, process, FAQs, office map
   iframe (does the Google map actually load and show the correct Tel
   Aviv location?), reviews panel state, CTA buttons, animations
   (respect and note prefers-reduced-motion). Compare its completeness
   to one din.co.il and one psakdin.co.il lawyer profile you also open
   in the browser: feature-by-feature table.
5. PILLARS + ARTICLES: open /criminal-defense-attorney/,
   /real-estate-attorney/, /divorce-lawyer/ and two articles from
   different areas. Verify: the cluster hub block ("מדריכים מקצועיים
   בנושא הזה") renders with working links, the spoke backlink block on
   articles, the reviewer/EEAT box (which reviewer, does the link
   work?), the article mesh CTA block, breadcrumbs. Check the browser
   tab titles against what the page is about.
6. TECHNICAL SWEEP on every page you visit: console errors, mixed
   content warnings, broken images (natural size 0), horizontal scroll
   on mobile (RTL overflow bugs), layout shifts you can see, and a
   DevTools Performance/Lighthouse run on homepage + one profile + one
   pillar (record LCP, CLS, TBT numbers).
7. SEARCH + 404: use the site search for "גירושין", open a result; then
   load a nonsense URL and describe the 404 page.
8. SCHEMA SPOT-CHECK: view-source on the flagship profile and one
   article; confirm presence of Attorney/Person/Article JSON-LD and
   report any obvious errors (this is source reading, mark it as such).

## Report format (one document)

- Executive summary: top 10 issues by user impact.
- Findings table: severity, exact URL, device (desktop/mobile), steps
  to reproduce, what you observed, screenshot reference, and VERIFIED
  (browser) for every row: anything else does not belong in the report.
- The din/psakdin profile comparison table from step 4.
- Performance numbers table from step 6.
- Test-data log: every form you submitted with TEST-GEMINI-AUDIT, where
  and when, so the owner can clean up.
- HONESTY STATEMENT: pages you did not visit, features you could not
  trigger, any place you inferred instead of observed, and the exact
  browser/viewport versions you used.

Do not change anything anywhere. Browse, observe, document, deliver.

---- PROMPT ENDS ABOVE THIS LINE ----
