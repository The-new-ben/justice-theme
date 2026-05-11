# Content Architecture Decisions

Date: 2026-05-10  
Status: DECISION DRAFT - based on REST export + GSC browser sessions + GA4 browser session

## Global Rules

ACCEPTED:
- Hebrew content and UI.
- Short clean English public slugs.
- No URL changes until migration maps, redirects, sitemap/canonical plan and owner approval exist.
- New public legal content should currently live under Articles, not new CPT sprawl.
- Existing useful content should be merged or connected, not destroyed.
- High-impression old URLs are protected until reviewed.

## Broad Lawyer / Directory

Decision:
- MAKE `/lawyers/` the primary directory page for plural lawyer intent.
- USE homepage as the brand/entity/legal-portal page and route users to `/lawyers/` plus practice pillars.

Evidence:
- `עורך דין`: 10.4K impressions, 9 clicks, 0.1% CTR, average position 50.6, scattered across unrelated/specific pages.
- `עורכי דין`: 2.49K impressions, 4 clicks, 0.2% CTR, average position 29.7, scattered across lawyer-marketing and specific pages.

Recommended action:
- NEEDS_TITLE_UPDATE for homepage and `/lawyers/`.
- NEEDS_INTERNAL_LINKING from homepage, footer, articles and pillars.
- NEEDS_GA4_EVENTS on lawyer-directory actions.

No URL change required.

2026-05-11 homepage line-by-line review addendum:
- VERIFIED: `project-control/homepage-line-by-line-review-2026-05-11.md` and `.csv` now document the live homepage section order, user signal, Google signal, business signal and execution risks.
- VERIFIED: the live homepage scrape matches the shorter `front-page.php` flow more than `page-home.php`; authoritative homepage structure must be decided before implementation.
- REVIEW: broad homepage strategy is right, but practice quick links, taxonomy cards, latest articles, empty lawyer showcase, city filters, `http://` links and `?page_id=` links need controlled follow-up.
- BLOCKED: no homepage content, template, title/H1/meta, menu, URL, redirect, canonical, sitemap, lawyer, CRM or CMS action is approved by this review alone.

2026-05-11 homepage section-order proposal addendum:
- VERIFIED: `project-control/homepage-section-order-proposal-2026-05-11.md`, `.csv` and `project-control/homepage-curated-pillar-link-map-2026-05-11.csv` now define the approval-gated homepage order and link/fallback map.
- VERIFIED: `/family-lawyer/`, `/criminal-lawyer/`, `/personal-injury-lawyer/`, `/employment-lawyer/` and `/inheritance-lawyer/` resolve to the homepage in the live URL check, so they should not be promoted as homepage pillar targets until approved.
- REVIEW: use safe current hubs or filtered directory fallbacks for those clusters while content/URL decisions are still pending.
- BLOCKED: no homepage link/template/CMS implementation is approved by this proposal alone.

## Family Law / Divorce

Decision:
- `/divorce-lawyer/` remains the planned clean pillar, but the old Hebrew divorce URL is a high-risk traffic/information asset.
- Do not publish a weaker duplicate or redirect the old URL until old/new content is compared and merged.

Evidence:
- `עורך דין גירושין`: old Hebrew URL has 960 impressions.
- `גישור גירושין`: Google sees a DOCX and legacy pages more than a clean `/divorce-mediation/` article.
- `עורך דין לענייני משפחה`: weak evidence, no clear primary page yet.

Recommended action:
- MAKE_PILLAR: `/divorce-lawyer/`.
- SUPPORT_PILLAR: `/consensual-divorce/`, `/divorce-mediation/`, `/child-support/`, `/child-custody/`, `/divorce-property-division/`, `/family-dispute-resolution/`.
- REDIRECT_LATER only after merge and approval.

## Criminal Law

Decision:
- `/criminal-lawyer/` should become the criminal-law pillar.
- Existing old Hebrew criminal service page and legacy criminal category pages must be protected until merge/redirect planning.

Evidence:
- `עורך דין פלילי`: old Hebrew criminal Tel Aviv page owns most visible impressions.
- `דין פלילי`: split across old Hebrew service URL, deep legacy category URL, homepage and English support article.

Recommended action:
- MAKE_PILLAR: `/criminal-lawyer/`.
- SUPPORT_PILLAR: `/criminal-law/`, `/police-investigation/`, `/indictment/`, `/pretrial-detention/`, `/drug-offenses/`, `/sex-offenses/`, `/white-collar-crime/`.
- Add internal links from old criminal pages to the pillar after content comparison.

## Real Estate

Decision:
- `/real-estate-lawyer/` should become the real-estate lawyer pillar.
- `/real-estate-lawyer-cost-2025/` is a valuable support asset, not the main pillar.

Evidence:
- `עורך דין מקרקעין`: 153 impressions, 0 clicks, average position 15.8, mostly homepage.
- `/real-estate-lawyer-cost-2025/`: 2 clicks, 3.85K impressions, 0.1% CTR; queries focus on sale/purchase apartment lawyer costs.
- `קניית דירה`: 885 impressions, mostly the cost page.
- `חוזה מכר`: 31 impressions, only the cost page visible.

Recommended action:
- MAKE_PILLAR: `/real-estate-lawyer/`.
- KEEP_AS_SUPPORT: `/real-estate-lawyer-cost-2025/`.
- SUPPORT_PILLAR: `/buying-apartment/`, `/real-estate-purchase-agreement/`, `/land-registry/`, `/construction-defects/`.

## Medical Malpractice

Decision:
- `/medical-malpractice-lawyer/` should become the malpractice pillar.
- Birth/pregnancy malpractice need careful split/merge planning because one old Hebrew URL currently absorbs both intents.

Evidence:
- `עורך דין רשלנות רפואית`: 1.34K impressions; visible page mapping points to a narrow fee article.
- `רשלנות רפואית בלידה`: 661 impressions on old Hebrew birth-malpractice URL.
- `רשלנות רפואית בהריון`: 419 impressions also on the same old Hebrew birth-malpractice URL.

Recommended action:
- MAKE_PILLAR: `/medical-malpractice-lawyer/`.
- PROTECT old birth-malpractice URL.
- SUPPORT_PILLAR: `/birth-malpractice/`, `/pregnancy-malpractice/`, `/diagnosis-malpractice/`, `/surgery-malpractice/`.
- Do not split birth/pregnancy into thin duplicates; define intent boundaries first.

## Personal Injury / Damages

Decision:
- `/personal-injury-lawyer/` is strategically needed but current GSC evidence is weak.

Evidence:
- `עורך דין נזיקין`: only 2 impressions visible, mapped to an old Hebrew/taxonomy verdict page.
- `תאונת דרכים`: `/car-accident-auto-injury-lawyer/` owns 79 of 84 visible impressions and may be closer to fatal accident/criminal-punishment intent.
- Work-accident exact variants showed no visible rows.

Recommended action:
- MAKE_PILLAR strategically, but not as first GSC-priority batch.
- Review `/car-accident-auto-injury-lawyer/` before deciding whether it stays, becomes support, or redirects later.

## Traffic Law

Decision:
- `/traffic-lawyer/` should become the traffic pillar, but current GSC evidence is weak and noisy.

Evidence:
- `עורך דין תעבורה`: 15 impressions, mostly homepage and a narrow traffic-evidence ruling.
- `נהיגה בשכרות`: wrong-page match to a will-revocation page.
- `שלילת רישיון`: current visible result is about medical/professional license suspension, not traffic driver's license.

Recommended action:
- MAKE_PILLAR: `/traffic-lawyer/`.
- SUPPORT_PILLAR: `/drunk-driving/`, `/license-suspension/`, `/traffic-accident/`.
- Separate traffic driver's-license intent from medical/professional-license intent.

## Inheritance / Wills

Decision:
- `/inheritance-lawyer/`, `/will/`, and `/will-contest/` are strong strategic candidates, but old case-law pages currently carry the visible impressions.

Evidence:
- `עורך דין ירושה`: no visible exact rows.
- `צוואה`: 201 impressions split across psakdin case pages, old Hebrew wills/inheritance page, DOCX, and English pages.
- `התנגדות לצוואה`: 121 impressions, mostly old case pages.

Recommended action:
- MAKE_PILLAR: `/inheritance-lawyer/`.
- SUPPORT_PILLAR: `/will/`, `/will-contest/`.
- Merge case-law usefulness into practical guides by linking and summarizing, not deleting case pages blindly.

## High-Traffic Media URLs

Decision:
- Do not delete PDFs/DOCX files solely because they are not strategic.

Evidence:
- `06102016_1.pdf`: 99 clicks, 928 impressions, 10.7% CTR, position 8.1.
- Greece lawyer PDF: 19 clicks, 1.39K impressions.
- Italy lawyer PDF: 9 clicks, 1.35K impressions.

Recommended action:
- Identify source, legal/copyright fit, and strategic relevance.
- Consider HTML wrapper pages only if useful.
- Do not redirect/remove before owner review.

## Next Controlled Execution Batches

ADDED 2026-05-11:
- Use `slug-conflict-review.csv`, `editorial-slug-mapping-review.csv`, and `cluster-pillar-review.csv` as the current review queues before approving URL/content work.
- The largest conflict groups are `child-support`, `medical-malpractice-lawyer`, `criminal-lawyer`, `child-custody`, `will`, `pretrial-detention`, and `divorce-lawyer`.
- Strategic clean pillar targets are currently found for family divorce, medical malpractice and traffic.
- Strategic clean pillar targets still need confirmation or creation/mapping for criminal law, real estate, personal injury, employment, inheritance and cyber/privacy.
- These files are REVIEW ONLY; they do not approve redirect execution or content replacement.

Batch 1 - No URL changes:
- Homepage and `/lawyers/` title/H1/meta/internal-link review.
- GA4 conversion events.
- Sitemap verification.

Batch 2 - Content architecture:
- Compare old criminal/divorce/real-estate/malpractice pages against planned pillars.
- Decide merge candidates.
- Prepare title/meta updates without slug changes where possible.

Batch 3 - Controlled migration planning:
- Fill URL migration map.
- Fill redirect map.
- Prepare internal link/canonical/sitemap updates.
- Owner approval before live redirects.

## Integrated Design / SEO Decision Layer

ADDED 2026-05-10:
- Content architecture is not only titles and slugs. Every pillar/support decision must include the template sections, related-content block, lawyer cards, lead CTA, mobile behavior, schema, sitemap and analytics events that make the page understandable to users and Google.
- Related content must be selected semantically by cluster, pillar and intent. Random latest-post blocks are not acceptable on major legal pages.
- Faceted lawyer-directory filters should be useful for users but noindex/canonical by default unless a curated hub page has enough unique value to be indexable.
- Mini-sites are part of the content architecture: lawyer profiles should link to the same pillar/support clusters that define the article strategy.
- Before any final launch batch, pass `project-control/integrated-launch-checklist.md`.

Status: ACCEPTED RULE / NOT LIVE EXECUTED.

## Homepage Controlled Implementation Addendum

ADDED 2026-05-11:
- `project-control/homepage-controlled-implementation-checklist-2026-05-11.md` and `.csv` define the first safe homepage execution path.
- The first batch must be no-URL-change, reversible and owner-approved.
- The batch may only touch approved homepage template/link/empty-state/UX cleanup after preflight and QA gates.
- The batch must not change public URLs, redirects, canonical tags, sitemap, robots/noindex, title/H1/meta, menus, CMS/database state, CRM/review behavior or fake trust signals.

Status: VERIFIED / REVIEW ONLY / BLOCKED UNTIL OWNER APPROVAL.

## Cyber / Privacy Source-Legal Gate Addendum

ADDED 2026-05-11:
- `project-control/cyber-privacy-source-legal-checklist-2026-05-11.md` and `.csv` define source and legal-review gates for the cyber/privacy cluster.
- Cyber lawyer, cybercrime, privacy/data breach, online defamation/reputation, Google removal and police-record/data-deletion must be classified separately before public rewrites or migration decisions.
- Official/public source anchors are now mapped, but legal review is still required before publishing advice-like claims.

Status: VERIFIED / REVIEW ONLY / BLOCKED UNTIL OWNER AND LEGAL REVIEW.

## Cyber / Privacy Page Decision Matrix Addendum

ADDED 2026-05-11:
- `project-control/cyber-privacy-page-decision-matrix-2026-05-11.md` and `.csv` classify cyber/privacy pages before execution.
- `/cyber-lawyer/` remains the current primary candidate only after owner/legal review.
- Existing support/boundary/context pages are protected from accidental pillar promotion, random merge, or blind redirect.
- Old Hebrew privacy and case-law URLs remain migration-risk/protected until exact URL checks and source/legal review are complete.

Status: VERIFIED / REVIEW ONLY / BLOCKED UNTIL OWNER AND LEGAL REVIEW.
