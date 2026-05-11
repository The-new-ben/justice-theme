# Homepage Line-By-Line SEO / Design Review - 2026-05-11

Status: VERIFIED / REVIEW ONLY / NO PUBLIC CHANGE

## Scope

This pass reviews the live homepage as a combined SEO, user-experience, business and design surface.

Checked:
- Live public homepage `https://jus-tice.co.il/`.
- Live public `/lawyers/` directory page.
- `front-page.php`.
- `page-home.php`.
- Homepage section templates under `template-parts/sections/`.
- Existing GSC homepage/directory evidence.
- Existing homepage strategy and design-alignment documents.

No content, template, URL, title, H1, meta, menu, redirect, canonical, sitemap, CMS, CRM, lawyer-card or public link change was executed.

## Current Live Homepage Signals

VERIFIED:
- Live title: `עורכי דין בישראל | מדריך עורכי דין, מאמרים משפטיים וייעוץ`.
- Live meta description presents Jus-Tice as a lawyer directory, legal article portal and smart matching/intake surface.
- Live H1: `צריכים עורך דין או הכוונה משפטית? התחילו כאן`.
- GSC evidence already shows the homepage is the current broad legal portal / lawyer-finding page with `26` clicks, `5,459` impressions, CTR `0.5%`, average position `17.1`.
- `/lawyers/` returned `No data` in the last visible GSC reverse page-to-query check.

Interpretation:
- Google is already associating the homepage with broad lawyer/search/directory intent.
- The homepage should remain the broad entity/legal-help entry while `/lawyers/` is strengthened carefully.
- The page is not ready for blind content rewriting because section order, directory depth, fake/demo risk and internal-link consistency still need approval.

## Template Reality Check

VERIFIED:
- The live public homepage scrape matches the shorter `front-page.php` flow more than the richer `page-home.php` flow.
- `front-page.php` includes: hero, practice areas, find-lawyer guide, featured lawyer, latest articles, ask-lawyer, trust, CTA.
- `page-home.php` includes additional strategic sections that were not visible in the live heading scrape: editable homepage content, city grid, LegalTech tools, featured pillars, topic clusters, lawyer CTA and newsletter.

Risk:
- If we plan SEO/design against `page-home.php` but the live homepage uses `front-page.php`, we may optimize the wrong surface.

Recommended action:
- Before public homepage changes, decide which homepage template is authoritative.
- Prefer one controlled homepage structure that includes portal identity, lawyer directory, practice pillars, articles, lead flow and lawyer onboarding.

## Section Review

### 1. Header / Navigation

VERIFIED:
- Header links include homepage, `/lawyers/`, filtered lawyer-directory links, `/articles/`, `#ask-lawyer`, lawyer registration and phone.
- Public scrape still showed two `?page_id=` links.

Google signal:
- Good crawlable links to directory and article archive.
- Query-string page links are weaker than clean stable navigation.

User signal:
- Users can reach lawyers and articles quickly.
- `?page_id=` links may feel unfinished if visible in status bars or if copied.

Recommended action:
- REVIEW: replace page-id navigation with clean URLs after confirming targets and redirects.
- BLOCKED: no menu/header change without approval.

### 2. Hero / Search

VERIFIED:
- H1 is clear and user-oriented.
- Hero search submits to `/lawyers/`.
- CTA links point to `/lawyers/` and `/articles/`.

Google signal:
- Strong broad legal-help and lawyer-directory signal.

User signal:
- Clear first step: search by legal field, city and issue.

Issue:
- Hero city dropdown values appear to be Hebrew city names, while `/lawyers/` filter code expects city slugs such as `tel-aviv`.
- This may send users to a filtered directory URL that does not match the city taxonomy slug.

Recommended action:
- FIX LATER: align hero city values with the directory filter contract.
- Add GA4 events for hero search, directory CTA and article CTA.

### 3. Hero Quick Links

VERIFIED:
- Quick links are generated from top `practice-areas` taxonomy terms.
- Live heading scrape showed items such as `real-estate-law`, duplicated `נזיקין`, and broad taxonomy labels not necessarily matching approved pillar priorities.

Google signal:
- Crawlable topic links, but taxonomy-driven order may not match the approved pillar strategy.

User signal:
- Useful if terms are clean; confusing if raw slugs or duplicate labels appear.

Recommended action:
- Replace random/top-count quick links with a curated list of approved major legal hubs.
- Avoid sending users to weak or unapproved category pages.

### 4. Practice Areas Grid

VERIFIED:
- Uses `hide_empty => false` and the first 12 top-level practice-area terms.
- This can expose empty or low-quality terms.

Google signal:
- Broad topical relevance, but not tightly controlled.

User signal:
- Good concept, but raw/duplicate labels reduce trust.

Recommended action:
- Make this grid editorially controlled.
- Prioritize the approved cluster list: family/divorce, criminal, real estate, medical malpractice, personal injury, traffic, employment, inheritance, national insurance, cyber/privacy only after approval.

### 5. Find-Lawyer Guide

VERIFIED:
- Strong educational section with steps, FAQ and trust guidance.
- It covers lawyer selection, license checks, experience, fees, reviews and dissatisfaction handling.

Google signal:
- Supports broad “how to find a lawyer” and legal portal relevance.

User signal:
- Useful, practical and confidence-building.

Risks:
- Some claims around costs, “free” consultation, reviews and recommendations need source/compliance review.
- This section is long and may push important directory/practice navigation down the page on mobile.

Recommended action:
- KEEP, but tighten for mobile and add official/source links where claims are made.
- Consider moving some long FAQ content to a dedicated `/find-lawyer/` guide and summarizing on homepage.

### 6. Featured Lawyer / Mini-Site Block

VERIFIED:
- The template avoids fake lawyer cards and only shows a profile if public-approved.
- Live scrape showed the empty state: “profile will be shown after approval”.

Google signal:
- Good safety behavior, but weak as a live trust signal.

User signal:
- Empty-state text can feel unfinished.

Business signal:
- The mini-site product is visible to lawyers, but it is not yet a strong proof point.

Recommended action:
- Either show approved Maya Rotenberg content after final approval, or hide the empty block from public homepage until a real approved profile exists.

### 7. Latest Articles

VERIFIED:
- Live latest articles were mostly family-law/divorce items.
- Article card titles render as section-level headings in the homepage scrape.

Google signal:
- Fresh content signal, but not necessarily aligned to homepage pillar hierarchy.

User signal:
- Easy to find articles, but “latest” is not the same as “most useful”.

Risks:
- Latest-only logic can show irrelevant or unbalanced topics.
- Heading hierarchy becomes noisy because every card title appears as an H2 in the public scrape.

Recommended action:
- Replace or supplement latest articles with curated “important legal guides” grouped by cluster.
- Review article-card heading level on homepage.

### 8. Ask-Lawyer / Lead Form

VERIFIED:
- Public form posts to `wp-admin/admin-post.php` with nonce and spam fields.
- The section includes legal disclaimer language.

Google signal:
- Clear conversion and legal-help intent.

User signal:
- Strong next step for people who do not know which lawyer they need.

NOT VERIFIED:
- Whether submissions are reaching the intended CRM/email workflow.
- Whether GA4 lead events are firing.

Recommended action:
- Verify form delivery and tracking before scaling traffic.
- Keep disclaimers visible.

### 9. Trust / Stats

VERIFIED:
- Trust section counts articles and practice areas dynamically.
- City count and years-active text include hard-coded values.

Google signal:
- Supports portal scale.

User signal:
- Builds confidence if accurate.

Risk:
- Hard-coded trust numbers need source verification.

Recommended action:
- Keep dynamic counts.
- Verify or soften hard-coded “20+ cities” and “10+ years” language.

### 10. Bottom CTA / Contact

VERIFIED:
- CTA directs to `/lawyers/`, phone and hero search.
- Public scrape showed phone `036161535`.

Google signal:
- Reinforces lawyer directory and contact pathways.

User signal:
- Clear, but phone source/ownership was not verified in this pass.

Recommended action:
- Verify the public phone number and GA4 phone-click event.

### 11. Missing Strategic Sections

VERIFIED:
- The richer `page-home.php` sections were not visible in the live heading scrape:
  - city grid,
  - LegalTech tools,
  - featured pillars,
  - topic clusters,
  - lawyer onboarding CTA,
  - newsletter.

Recommended action:
- Decide whether these belong on the public homepage now.
- Do not expose LegalTech or newsletter blocks until routes/forms/products are real and tracked.
- Do expose curated pillar/topic cluster links after approved URL strategy.

### 12. Technical Link Hygiene

VERIFIED:
- Live scrape found `117` homepage links.
- Live scrape found `10` first-party `http://jus-tice.co.il` links.
- Live scrape found two `?page_id=` links.
- Live scrape found repeated `#` placeholder links.

Interpretation:
- This is a homepage technical/content hygiene follow-up, not a URL migration decision.

Recommended action:
- Classify whether the `http://` links come from editable homepage content, article cards, category links or legacy content.
- Fix only through approved source/template/content lane after ownership is clear.

## Overall Homepage Status

VERIFIED:
- The homepage speaks to users looking for legal help better than a generic landing page.
- The homepage already sends legal portal / lawyer directory / legal guide signals.
- The H1, title and meta are broadly aligned with legal-service intent.
- Hero search, lawyer directory CTA, articles and lead form create a real user journey.

IN PROGRESS:
- Content hierarchy is not fully aligned with the approved pillar/cluster map.
- Practice-area and quick-link sections are still too taxonomy-driven.
- Latest-article logic is not semantic enough.
- Lawyer mini-site proof is not visible yet because the block is empty.

NOT VERIFIED:
- Mobile section order in this pass.
- CRM/lead delivery.
- GA4 events.
- Phone ownership.
- Whether all linked filtered directory pages should be indexable.
- Competitor-aligned homepage benchmark in this pass.

BLOCKED:
- No public homepage rewrite.
- No template switch.
- No menu/header changes.
- No link cleanup.
- No title/H1/meta update.
- No CMS or database update.
- No lawyer-card, rating, badge or recommendation display.

## Next Safe Work

1. Decide whether `front-page.php` or `page-home.php` is the authoritative homepage structure.
2. Build an owner-approved homepage section order.
3. Create a curated homepage pillar-link map from approved topic clusters.
4. Verify hero city filter values against `/lawyers/` filter code.
5. Verify visible fake/demo/placeholder blocks and hide or replace only after approval.
6. Verify form delivery and analytics events.
7. Run mobile visual QA after any approved homepage template change.
