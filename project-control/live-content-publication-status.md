# Live Content Publication Status

Date: 2026-05-10  
Decision: PUBLICATION PAUSED AFTER CONTENT-SAFETY CORRECTION
Deployment model: GitHub/uPress pulls the repo into the live WordPress theme.

## VERIFIED
- The repo now contains a narrow one-time publisher in `inc/live-content-publication.php`.
- The publisher targets only the first family-law cluster and only the exact approved repo draft files.
- Public URLs use short English slugs while Hebrew titles, H1s and body content remain Hebrew.
- Existing root page content is backed up into post meta before it is replaced.
- The publisher adds SEO title, SEO description, AEO summary, GEO summary, cluster meta, connected lawyer slug, source-audit meta and a public legal disclaimer.
- The publisher adds internal cluster links across the full family-law topic group.
- Automatic publication is now disabled.
- The manual publisher is now blocked unless the cannibalization CSV approves the page and internal markers are absent.

## CODE FIXED
- `functions.php` now loads `inc/live-content-publication.php`.
- `inc/seo.php` now respects page-level `seo_title` and `seo_description` fields and exposes AEO/GEO summaries as meta tags.
- `inc/schema.php` now emits Article schema for repo-published legal content pages, not only the `articles` CPT.
- `assets/css/premium-pass-3.css` now styles the public cluster navigation, lawyer CTA and legal disclaimer blocks.

## PROPOSED PUBLIC LINKS - NOT APPROVED FOR PUBLICATION YET
These are the proposed URLs, but they are currently blocked from publication pending merge/cannibalization review:

1. https://jus-tice.co.il/divorce-lawyer/
2. https://jus-tice.co.il/consensual-divorce/
3. https://jus-tice.co.il/divorce-mediation/
4. https://jus-tice.co.il/child-support/
5. https://jus-tice.co.il/child-custody/
6. https://jus-tice.co.il/divorce-property-division/
7. https://jus-tice.co.il/family-dispute-resolution/

## CLUSTER / HIERARCHY
- Pillar: `/divorce-lawyer/`
- Supporting pages:
  - `/consensual-divorce/`
  - `/divorce-mediation/`
  - `/child-support/`
  - `/child-custody/`
  - `/divorce-property-division/`
  - `/family-dispute-resolution/`
- Every page receives a visible "מסלול קריאה באשכול משפחה וגירושין" internal-link module.
- Every page is connected to `advocate-maya-rotenberg` through `connected_lawyer_slug`.
- Every page uses the `Legal Pillar Page` template for hero, lead form, related topics and lawyer-directory connection.

## NOT VERIFIED LIVE
- The pages are intentionally paused and must not go live until the workflow gates pass.
- Search Console data is not yet used for traffic-risk scoring.
- Human legal review and source review are still owner/lawyer review items.

## LIVE RECHECK - 2026-05-10
- Commit pushed: `8e28528`.
- Result: STILL NOT LIVE.
- Public checks for all seven intended URLs returned HTTP 200 only after redirecting to the homepage.
- The public HTML did not contain the new `justice-public-cluster`, `owner_approved_live_review`, or `justice:aeo-summary` markers.
- Meaning: GitHub has the publication package, but uPress/live WordPress has not pulled/executed it yet, or cache is still serving the old state.

## LIVE RECHECK - 2026-05-10 13:42 Asia/Jerusalem
- Result: UNSAFE PAGES ARE LIVE.
- All seven proposed URLs returned HTTP 200 at their own URL.
- Public HTML contained publication markers and internal-note markers.
- Emergency fix added in repo: on next uPress pull, `inc/live-content-publication.php` restores backed-up content where possible or moves generated pages to draft.
- This is reversible: old content backups are stored in post meta, and newly generated pages are drafted rather than deleted.

## LIVE RECHECK - 2026-05-10 13:52 Asia/Jerusalem
- Result: STILL UNSAFE LIVE.
- Commit `e17e0fa` is pushed to GitHub, but the public site still serves all seven unsafe pages.
- All seven pages still expose internal markers and publication markers.
- Conclusion: uPress/live WordPress has not pulled/executed the emergency quarantine yet, or cache is still serving old generated content.
- Required action: pull latest in uPress immediately, then open any public page once so the emergency quarantine runs.

## LIVE RECHECK - 2026-05-10 14:12 Asia/Jerusalem
- Result: STILL UNSAFE LIVE.
- Public checks again returned HTTP 200 for all seven family-law URLs.
- All seven still expose internal markers and publication markers.
- Browser/uPress automation is not available in this session; direct authenticated uPress/wp-admin action remains required.

## NEXT ACTION
1. Compare every proposed page against existing live content.
2. Merge with existing pages where the same intent already exists.
3. Update `publication-cannibalization-check.csv`.
4. Approve only pages that are clean, public-facing and non-duplicative.
5. Only then run the wp-admin publisher.
