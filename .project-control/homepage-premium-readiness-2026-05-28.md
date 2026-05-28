# Homepage Premium Readiness Gate

Date: 2026-05-28.
Scope: local-only governance artifact and read-only live checker for the Jus-Tice homepage.

## Project Manager Check

- Active goals: make the homepage a premium legal-help and lawyer-revenue surface, keep About and mobile-menu fixes protected, and turn competitor research into repeatable checks.
- Sub-goals: public legal-help entry, lawyer-search SEO intent, mobile conversion stability, lawyer registration/plan visibility, URL/canonical safety, and Core Web Vitals discipline.
- Completed this cycle: added `.project-control/scripts/check-homepage-premium-readiness.ps1` and tied the gate to live homepage signals and source-backed standards.
- Incomplete / internal-only / not published: this does not rebuild the homepage, generate images, publish CMS content, alter redirects/canonicals/noindex/sitemaps, or test a real payment.
- Blockers: real first paid lawyer proof, invoice/payment settlement proof, and Grow/Meshulam KYC/payment status are still not resolved.
- Estimated readiness to profit: route and homepage conversion surfaces are strong, but proven revenue remains 0% until a real paid lawyer/invoice/payment is verified.
- Honesty statement: this artifact is internal governance and live read-only checking only. It is not a public homepage rebuild and it does not prove ranking, Lighthouse scores, CRM completion, invoices, payments, or revenue.

## Research Sources Used

- din.co.il: https://www.din.co.il/
- LawReviews: https://www.lawreviews.co.il/
- Lawhive: https://lawhive.com/
- Google Core Web Vitals: https://developers.google.com/search/docs/appearance/core-web-vitals
- Chrome Lighthouse: https://developer.chrome.com/docs/lighthouse
- WordPress template hierarchy: https://developer.wordpress.org/themes/basics/template-hierarchy/
- WooCommerce Subscriptions payment gateways: https://woocommerce.com/document/subscriptions/payment-gateways/

## Competitor Mechanisms Converted Into Requirements

- Din-style legal index: homepage must route by legal area and lawyer-search intent without replacing dedicated practice/city pages.
- LawReviews-style trust: selection guidance and profile/review proof must be real; no fabricated ratings, counts, or testimonials.
- Lawhive-style service clarity: homepage must explain what happens after inquiry and expose an immediate contact/intake path.
- Marketplace revenue path: lawyer registration, plans, and dashboard/payment proof surfaces must remain reachable from homepage/mobile paths.
- Mobile-first conversion: menu must stay stable, expose WhatsApp/intake first, and put lawyer CTAs second.
- Performance quality: homepage rebuilds must reserve visual dimensions and run Lighthouse/Core Web Vitals checks before being called premium.

## New Gate Coverage

The checker verifies:

- homepage returns a successful HTTP status,
- canonical points to the homepage,
- robots does not include noindex,
- title/H1 preserve broad lawyer/legal-help intent,
- latest live deployment marker and version are present,
- public lead CTA exists,
- mobile menu conversion actions exist,
- lawyer registration/plans/revenue status paths exist,
- process clarity or lawyer-selection guide signals exist,
- primary navigation does not use legacy `page_id` links,
- image dimension signals exist for layout-stability discipline.

## Verification Run

Command: `.project-control/scripts/check-homepage-premium-readiness.ps1`

Result on 2026-05-28T05:08:45Z:

- Pass: true.
- Status: 200.
- Title: `עורכי דין בישראל | מדריך עורכי דין, מאמרים משפטיים וייעוץ`.
- H1: `צריכים עזרה משפטית? התחילו ממה שקרה לכם עכשיו`.
- Canonical: `https://jus-tice.co.il/`.
- Robots: `index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1`.
- Failures: 0.
- Warnings: 0.
- Primary navigation legacy `page_id` links: 0.
- Image dimension signal: 6 rendered images, 6 with explicit width and height.

Supporting checks also passed this cycle:

- `.project-control/scripts/check-live-deploy.ps1`: live marker `2026-05-28-mobile-menu-stable-in-place-v1`, theme version `1.1.85`, and mobile menu conversion surface present.
- `.project-control/scripts/check-homepage-revenue-paths.ps1`: homepage, lawyers directory, lawyer registration, lawyer plans, About, and Contact routes passed required revenue tokens.
- `.project-control/scripts/check-live-route-matrix.ps1`: 8 route checks passed. One expected warning remains for `https://jus-tice.co.il/?page_id=315`, which returns 200 and declares canonical `https://jus-tice.co.il/about/`.

## What This Enables Next

Use the new gate before and after any homepage rebuild. The homepage can now be rebuilt from code/CMS-connected templates with a measurable minimum instead of subjective "looks premium" review only.

Next safe build target:

1. Preserve current approved homepage content and keywords around lawyers and choosing a lawyer.
2. Rework first viewport into a premium legal-help operating surface.
3. Add reserved-dimension real/generated visuals with a human legal-help context.
4. Keep public user path first and lawyer revenue path secondary.
5. Run route matrix, homepage revenue path, mobile-menu browser QA, homepage premium readiness, and Lighthouse before deployment.

## Not Changed

- No public CMS/database content was published.
- No redirects, canonicals, noindex, sitemaps, or taxonomies were changed.
- No paid LLM API was used.
- No real lead, invoice, Meshulam/Grow payment, or WooCommerce payment was created.
