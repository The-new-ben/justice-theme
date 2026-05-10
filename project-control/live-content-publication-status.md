# Live Content Publication Status

Date: 2026-05-10  
Decision: OWNER APPROVED LIVE REVIEW  
Deployment model: GitHub/uPress pulls the repo into the live WordPress theme.

## VERIFIED
- The repo now contains a narrow one-time publisher in `inc/live-content-publication.php`.
- The publisher targets only the first family-law cluster and only the exact approved repo draft files.
- Public URLs use short English slugs while Hebrew titles, H1s and body content remain Hebrew.
- Existing root page content is backed up into post meta before it is replaced.
- The publisher adds SEO title, SEO description, AEO summary, GEO summary, cluster meta, connected lawyer slug, source-audit meta and a public legal disclaimer.
- The publisher adds internal cluster links across the full family-law topic group.

## CODE FIXED
- `functions.php` now loads `inc/live-content-publication.php`.
- `inc/seo.php` now respects page-level `seo_title` and `seo_description` fields and exposes AEO/GEO summaries as meta tags.
- `inc/schema.php` now emits Article schema for repo-published legal content pages, not only the `articles` CPT.
- `assets/css/premium-pass-3.css` now styles the public cluster navigation, lawyer CTA and legal disclaimer blocks.

## PUBLIC LINKS TO REVIEW AFTER uPRESS PULL
These are the intended live review URLs:

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
- The pages are not live until this commit is pushed and uPress pulls it.
- Search Console data is not yet used for traffic-risk scoring.
- Human legal review and source review are still owner/lawyer review items, even though the owner approved live review.

## NEXT ACTION
1. Push this commit to `origin/main`.
2. Pull latest in uPress if automatic sync does not run.
3. Open the seven URLs above.
4. If a page still shows old content, clear cache and reload.
5. Review legal wording, titles, source confidence and internal links.
6. After review, refine content directly in WordPress or in repo drafts and run a controlled republish.
