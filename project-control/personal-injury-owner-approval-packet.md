# Personal Injury And Damages Owner Approval Packet

Date: 2026-05-11
Status: REVIEW ONLY / OWNER APPROVAL REQUIRED / NO URL CHANGE

This packet converts the personal-injury/damages inventory, GSC browser evidence, content-quality audit, topic-cluster data and slug-conflict map into an owner decision framework. It does not approve or execute public content rewrites, URL changes, redirects, canonical changes, sitemap changes, noindex actions, taxonomy/menu changes, homepage changes, related-card changes, lawyer-card changes or CMS writes.

## Recommended Approval Decision

RECOMMENDED:
- Approve a no-URL-change personal-injury/damages primary-selection, car-accident subcluster, tort-law support and source/legal review planning batch.
- Treat `/personal-injury-lawyer/` as a strategic future commercial slug only, not an approved current public URL or migration target.
- Treat `/tort-lawyer/` as the current thin local damages/service candidate that needs comparison before expansion.
- Treat `/car-accident-auto-injury-lawyer/` as the current visible car-accident candidate, not an approved final slug.
- Do not create `/personal-injury-lawyer/`, `/car-accident-lawyer/` or redirects until GSC/SERP review, source/legal review, side-by-side comparison and owner approval are complete.
- Separate local Israeli damages/lawyer intent from US personal-injury content, insurance content, medical-malpractice content, traffic/criminal accident content and national-insurance/work-accident content.

Why:
- `cluster-pillar-review.csv` lists `personal-injury-lawyer` as the strategic target slug, but no current public URL was verified for it.
- The heuristic selected `/punitive-damage/` as the personal-injury pillar by word count only. That page is not a safe commercial service pillar.
- `/tort-lawyer/` exists but is thin at `507` words with quality `4/10`.
- GSC browser evidence for `עורך דין נזיקין` is low-sample and maps to an old verdict/category-style URL, not a clean service page.
- GSC browser evidence for `תאונת דרכים` maps mostly to `/car-accident-auto-injury-lawyer/`, while the future `/car-accident-lawyer/` slug has a conflict group and no exact current URL.

## Current Evidence

VERIFIED:
- `project-control/content-master-inventory.csv`.
- `project-control/content-quality-audit.csv`.
- `project-control/gsc-keyword-page-map.csv`.
- `project-control/gsc-content-priorities.csv`.
- `project-control/slug-conflict-review.csv`.
- `project-control/cluster-pillar-review.csv`.
- `project-control/topic-clusters.csv`.
- `project-control/cannibalization-map.csv`.
- `project-control/targeted-gsc-query-queue.csv`.

NOT VERIFIED:
- Full GSC API export.
- GA4 landing-page, lead and conversion data.
- Fresh SERP review for `עורך דין נזיקין`, `נזקי גוף`, `תאונת דרכים`, `עורך דין תאונות דרכים`, `תאונת עבודה` and support variants.
- Source/legal review for damages, tort law, traffic-accident compensation, compulsory insurance and work-accident claims.
- Owner approval for primary URL, title/H1/meta changes, redirect/canonical/sitemap decisions, content rewrites, related-card logic or menu/taxonomy changes.
- Verified lawyer-directory mapping for damages, personal injury, car accident and work accident lawyers.

## Query Evidence From GSC Browser Pass

VERIFIED:
- `עורך דין נזיקין`: old verdict/category-style URL `https://jus-tice.co.il/תחומי-התמחות/עוד-נזיקין-פסקי-דין/` has `2` impressions, `0` clicks, `0%` CTR and average position `48`.
- `תאונת דרכים`: `/car-accident-auto-injury-lawyer/` has `79` impressions, `0` clicks, `0%` CTR and average position `57.6`.
- `תאונת דרכים`: old law-text URL for the Road Accident Victims Compensation Law has `4` impressions.
- `תאונת דרכים`: `/compulsory-motor-vehicle-insurance/` has `1` impression.
- `עורך דין תאונות דרכים`: `/car-accident-auto-injury-lawyer/` has `2` impressions, `0` clicks, `0%` CTR and average position `82.5`.
- `תאונת עבודה`: exact checked filter returned `0` visible rows.
- `gsc-content-priorities.csv` also records `תאונת דרכים` at `84` impressions on `/car-accident-auto-injury-lawyer/`, and a separate fatal/criminal accident row at `124` impressions tied to the same current page.

Interpretation:
- The cluster has weak broad service demand in the checked GSC rows, but the architecture problem is still real: no clean personal-injury pillar is verified, a punitive-damages article was chosen by word-count heuristic, and car-accident signals sit on a non-final URL.
- Car accident should be planned as a subcluster that touches both personal injury and traffic law.
- Work accident currently has no visible row in the checked pass and should not be over-prioritized from GSC evidence until variant filters are checked.

## Page Decisions For Approval

### 1. Strategic Personal-Injury Pillar

Future candidate:
- `/personal-injury-lawyer/`

Current facts:
- Listed as strategic target in `cluster-pillar-review.csv`.
- Exact current public URL was not verified.
- Current heuristic selected `/punitive-damage/` by word count only.

Recommended action:
- STRATEGIC FUTURE SLUG / PRIMARY SELECTION REQUIRED / NO URL CHANGE.

Blocked:
- No creation, migration, redirect, canonical, sitemap, title/H1/meta or menu change until owner approval.

### 2. Current Damages / Tort Lawyer Candidate

Current URL:
- `https://jus-tice.co.il/tort-lawyer/`

Current facts:
- Public REST ID `344`.
- Title: `תביעת נזיקין | עו”ד נזיקין ופיצויים`.
- Word count: `507`.
- Quality score: `4/10`.
- Marked thin, no internal links, recommended action `EXPAND`.

Recommended action:
- EXPAND/COMPARE AS CURRENT LOCAL SERVICE CANDIDATE.

Blocked:
- No rewrite, title/H1/meta change, migration or redirect until compared with old category/verdict pages and source/legal requirements.

### 3. Punitive Damages Article

Current URL:
- `https://jus-tice.co.il/punitive-damage/`

Current facts:
- Public REST ID `7473`.
- Title: `פיצויים עונשיים | מהו פיצוי עונשי?`.
- Word count: `57,276`.
- Quality score: `6/10`.
- Chosen as heuristic pillar by word count only.
- No internal links in quality audit.

Recommended action:
- PROTECT / SUPPORT OR SPECIALIST GUIDE REVIEW / NOT PRIMARY BY DEFAULT.

Blocked:
- Do not use this as the personal-injury commercial pillar without owner approval.

### 4. Tort Law Support Pages

Current URLs:
- `https://jus-tice.co.il/tort-reform/`
- `https://jus-tice.co.il/outline-of-tort-law/`
- `https://jus-tice.co.il/deep-pocket/`

Current facts:
- `/tort-reform/`: `7,072` words, quality `6/10`, no internal links, recommended `KEEP_OR_MAKE_PILLAR_REVIEW`.
- `/outline-of-tort-law/`: `1,443` words, quality `5/10`, no internal links, recommended `KEEP_OR_SUPPORT_PILLAR_REVIEW`.
- `/deep-pocket/`: `507` words, quality `4/10`, thin, no internal links, recommended `EXPAND`.

Recommended action:
- SUPPORT STRUCTURE REVIEW.

Blocked:
- No internal-link generation, merge, redirect or rewrite until primary URL is approved.

### 5. US Personal-Injury Content

Current URL:
- `https://jus-tice.co.il/personal-injury-law/`

Current facts:
- Public REST ID `9339`.
- Title: `עורך דין נזקי גוף ארה”ב | תביעה לנזקי גוף בארצות הברית: כל מה שצריך לדעת`.
- Word count: `8,005`.
- Quality score: `6/10`.
- Recommended action `REVIEW_CLASSIFY`.

Recommended action:
- SEPARATE INTERNATIONAL/US INTENT.

Blocked:
- Do not merge into the Israeli personal-injury lawyer pillar without explicit owner approval.

### 6. Car Accident Current Candidate

Current URL:
- `https://jus-tice.co.il/car-accident-auto-injury-lawyer/`

Current facts:
- Public REST ID `3222`.
- Title: `עורך דין תאונות דרכים`.
- Word count: `590`.
- Quality score: `2/10`.
- Marked thin and outdated, no internal links, recommended action `REWRITE`.
- GSC: `79-84` impressions for `תאונת דרכים`, and `2` impressions for `עורך דין תאונות דרכים`.

Recommended action:
- PROTECT / COMPARE / REWRITE REVIEW.

Blocked:
- Do not migrate to `/car-accident-lawyer/`, redirect, canonicalize or rewrite until owner approval.

### 7. `/car-accident-lawyer/` Slug Conflict

Future candidate:
- `/car-accident-lawyer/`

Current facts:
- `slug-conflict-review.csv` shows `car-accident-lawyer` has `4` conflict rows.
- Exact current slug count is `0`.
- Highest word-count candidate is an old compensation/case-style URL, not automatically a public guide.

Recommended action:
- SELECT PRIMARY AND PLAN REDIRECTS LATER.

Blocked:
- No creation, migration, redirects, canonicals, noindex or sitemap decisions until approved.

### 8. Road Accident Compensation Law Support

Current URL:
- `https://jus-tice.co.il/israel-road-accident-compensation-law/`

Current facts:
- Public REST ID `1108`.
- Title: `תאונת דרכים: מהו חוק הפיצויים לנפגעי תאונות דרכים?`.
- Word count: `524`.
- Quality score: `4/10`.
- Marked thin and outdated, has internal links, recommended action `REWRITE`.

Recommended action:
- SOURCE/LEGAL SUPPORT REVIEW.

Blocked:
- No rewrite or redirect until the car-accident primary is approved and official sources are checked.

### 9. Compulsory Motor Insurance Support

Current URL:
- `https://jus-tice.co.il/compulsory-motor-vehicle-insurance/`

Current facts:
- Public REST ID `6506`.
- Title: `ביטוח חובה`.
- Word count: `714`.
- Quality score: `2/10`.
- Marked thin and outdated, no internal links, recommended action `REWRITE`.
- GSC: `1` impression for `תאונת דרכים`.

Recommended action:
- REWRITE REVIEW AS SUPPORT ONLY.

Blocked:
- No rewrite or internal links until car-accident and insurance/legal boundaries are approved.

### 10. Work Accident Intent

Future candidate:
- `/work-accident-lawyer/`

Current facts:
- `targeted-gsc-query-queue.csv` lists work-accident variants as recheck items.
- Current checked exact and broad rows returned `0` visible rows.
- Work accident may overlap personal injury, employment law and national insurance.

Recommended action:
- RECHECK BEFORE PRIORITIZATION.

Blocked:
- Do not create a work-accident page from current evidence alone.

## Source And Legal Review Checklist

Required before public rewrites:
- Israeli tort/damages sources for general legal explanations.
- Road Accident Victims Compensation Law and official/public process sources where relevant.
- Compulsory motor insurance sources where relevant.
- National Insurance/work-accident sources before any work-accident page.
- Medical-malpractice boundaries to avoid duplicate medical content.
- Traffic-law/criminal boundaries for fatal accidents and driving offenses.
- Clear disclaimer that content is general information and not legal advice.

## Internal-Link Direction

Recommended planning only:
- Personal-injury service page -> car accident, work accident, tort law overview, compensation law, insurance and relevant lawyer profiles.
- Car accident page -> personal-injury service page, traffic-law page, compensation law, compulsory insurance and relevant lawyer profiles.
- Tort support pages -> personal-injury service page, official sources and related guide pages.
- US/international personal-injury content -> separate international cluster, not the Israeli service pillar.

Blocked:
- No internal links, related cards, menus, breadcrumbs or homepage sections should be changed from this packet alone.

## Sitemap, Canonical, Robots And Redirect Position

Do not change now:
- Sitemap inclusion.
- Canonicals.
- Robots rules.
- 301 redirects.
- Slugs.
- Related-card logic.

Future migration must map:
- old URL -> new URL.
- current car-accident URL -> approved final car-accident URL.
- personal injury/tort primary URL.
- support URLs.
- traffic-law boundary URLs.
- medical/national-insurance boundary URLs.
- canonical target.
- sitemap inclusion.
- internal links to update.

## Owner Questions

OWNER APPROVAL REQUIRED:
1. Should the local broad service page target be `/personal-injury-lawyer/`, `/tort-lawyer/`, or another approved existing URL?
2. Should `/car-accident-auto-injury-lawyer/` be rewritten in place first, or later migrated to `/car-accident-lawyer/` with a redirect map?
3. Should `/punitive-damage/` remain a specialist support article rather than a broad pillar?
4. Should US personal-injury content remain separate from Israeli personal-injury content?
5. Should work-accident content be handled under personal injury, employment law, national insurance, or a separate cluster?
6. Which lawyer profiles should connect to damages, personal injury and car accident pages?

## Blocked Actions

BLOCKED until explicit owner approval:
- Public content rewrites.
- Title/H1/meta updates.
- URL or slug changes.
- 301 redirects.
- Canonical changes.
- Sitemap inclusion/exclusion changes.
- Robots/noindex changes.
- Menu, taxonomy, breadcrumb, related-card or homepage changes.
- Lawyer-card/profile wiring.
- CMS writes or database changes.

## Next Approved Work

If owner approves this planning lane, the next safe work is:
1. Review the approval-gated internal-link map for `/tort-lawyer/`, `/car-accident-auto-injury-lawyer/`, `/israel-road-accident-compensation-law/`, `/compulsory-motor-vehicle-insurance/`, `/punitive-damage/`, `/tort-reform/`, `/outline-of-tort-law/`, `/deep-pocket/` and the future clean slugs.
2. Run deeper GSC browser checks for variants: `עורך דין נזיקין`, `נזקי גוף`, `תביעת נזיקין`, `פיצויים`, `תאונת דרכים`, `עורך דין תאונות דרכים`, `תאונת עבודה`, `עורך דין תאונת עבודה`.
3. Run SERP review for broad damages, car accident and work accident intents.
4. Create source/legal review checklist for each approved page.
5. Move selected internal-link rows from `PLANNED_NEEDS_OWNER_APPROVAL` to approved implementation only after primary/support roles are approved.
6. Prepare URL migration and redirect plan only after owner chooses target URLs.

## Safety

VERIFIED:
- This packet is documentation and CSV planning only.
- No live public content, URL, redirect, sitemap, canonical, noindex, menu, taxonomy, related-card, lawyer-card, CMS or database state was changed.

## 2026-05-11 Source / Legal Checklist Addendum

CREATED:
- `project-control/personal-injury-source-legal-checklist-2026-05-11.md`.
- `project-control/personal-injury-source-legal-checklist-2026-05-11.csv`.

VERIFIED:
- Official/public source anchors were mapped for tort law, road-accident bodily-injury compensation, police accident confirmation, National Insurance work injury, Ministry of Labor work-accident reporting and personal-accident boundary topics.
- Direct public URL checks returned 200 for `/tort-lawyer/`, `/punitive-damage/`, `/car-accident-auto-injury-lawyer/`, `/israel-road-accident-compensation-law/`, `/compulsory-motor-vehicle-insurance/`, `/personal-injury-law/`, `/tort-reform/`, `/outline-of-tort-law/` and `/deep-pocket/`.
- The checklist separates Israeli damages/service intent from road-accident support, work-accident boundary, personal-accident benefits and US personal-injury content.

BLOCKED:
- No public content rewrite, title/H1/meta change, URL migration, redirect, canonical, sitemap, noindex, internal-link, related-card, menu, lawyer-card, CRM/review, wp-admin option or CMS/database action is approved by this addendum.

## 2026-05-11 Page Decision Matrix Addendum

CREATED:
- `project-control/personal-injury-page-decision-matrix-2026-05-11.md`.
- `project-control/personal-injury-page-decision-matrix-2026-05-11.csv`.

VERIFIED:
- The matrix classifies `/tort-lawyer/` as the current thin service candidate that must be compared before expansion.
- The matrix classifies `/car-accident-auto-injury-lawyer/` as the protected current GSC-visible car-accident candidate.
- The matrix classifies `/punitive-damage/`, `/tort-reform/`, `/outline-of-tort-law/`, `/deep-pocket/`, `/israel-road-accident-compensation-law/` and `/compulsory-motor-vehicle-insurance/` as support/specialist pages, not broad commercial pillars.
- The matrix classifies `/personal-injury-law/` as separate US/international content.
- The matrix keeps `/personal-injury-lawyer/`, `/car-accident-lawyer/` and `/work-accident-lawyer/` future-only until owner-approved primary selection and migration mapping.

BLOCKED:
- No public rewrite, URL migration, redirect, canonical, sitemap, title/H1/meta, internal link, related-card, menu, lawyer-card, CRM/review, wp-admin option or CMS/database action is approved by this addendum.

## 2026-05-11 Side-By-Side Review Addendum

CREATED:
- `project-control/personal-injury-side-by-side-review-2026-05-11.md`.
- `project-control/personal-injury-side-by-side-review-2026-05-11.csv`.

VERIFIED:
- `/tort-lawyer/` remains the current local damages/service candidate, but it is thin and should not be treated as a finished pillar without approved expansion.
- `/car-accident-auto-injury-lawyer/` remains the current GSC-visible car-accident candidate, but it is thin/outdated and should not be migrated to `/car-accident-lawyer/` without a full redirect/canonical/sitemap/internal-link map.
- `/punitive-damage/` is a specialist punitive-damages page and must not become the broad personal-injury pillar by word count alone.
- `/personal-injury-law/` is US/international content and must stay separate from Israeli damages/service intent.
- `/tort-reform/`, `/outline-of-tort-law/`, `/deep-pocket/`, `/israel-road-accident-compensation-law/` and `/compulsory-motor-vehicle-insurance/` are support or merge-review assets.
- Old Hebrew damages/category URL variants tested in this pass currently 301 to the homepage, so exact old URL capture and 404 routing cleanup are still required before redirect decisions.

BLOCKED:
- No public rewrite, URL migration, redirect, canonical, sitemap, title/H1/meta, internal link, related-card, menu, lawyer-card, CRM/review, wp-admin option or CMS/database action is approved by this addendum.

## 2026-05-11 Internal-Link Plan Addendum

CREATED:
- `project-control/personal-injury-internal-link-plan-2026-05-11.md`.
- `project-control/personal-injury-internal-link-plan-2026-05-11.csv`.

VERIFIED:
- The plan maps approval-gated links across `/tort-lawyer/`, `/car-accident-auto-injury-lawyer/`, `/israel-road-accident-compensation-law/`, `/compulsory-motor-vehicle-insurance/`, `/punitive-damage/`, `/tort-reform/`, `/outline-of-tort-law/`, `/deep-pocket/` and `/personal-injury-law/`.
- `/tort-lawyer/` remains the current broad damages/service candidate for link planning only.
- `/car-accident-auto-injury-lawyer/` remains the protected current car-accident candidate for link planning only.
- `/personal-injury-lawyer/` and `/car-accident-lawyer/` remain future-only migration notes until owner approval, redirect mapping, canonical/sitemap planning and internal-link updates are approved together.

BLOCKED:
- No public rewrite, URL migration, redirect, canonical, sitemap, title/H1/meta, internal link, related-card, menu, breadcrumb, lawyer-card, CRM/review, wp-admin option or CMS/database action is approved by this addendum.

## 2026-05-11 SERP Review Addendum

CREATED:
- `project-control/serp-personal-injury-damages-review-2026-05-11.md`.
- `project-control/serp-personal-injury-damages-review-2026-05-11.csv`.

VERIFIED:
- Public SERP patterns for `עורך דין נזיקין`, `נזקי גוף` and `תביעת נזיקין` support a deep damages service/guide structure rather than several thin duplicate pages.
- Public SERP patterns for `תאונת דרכים` and `עורך דין תאונות דרכים` support a dedicated car-accident injury subcluster with compensation, compulsory-insurance and source-backed support pages.
- Public SERP patterns for `תאונת עבודה` and `עורך דין תאונת עבודה` overlap national insurance, employment law and personal injury, so `/work-accident-lawyer/` remains future-only.
- `/tort-lawyer/` and `/car-accident-auto-injury-lawyer/` remain protected current candidates until owner/legal review approves a target URL strategy.

BLOCKED:
- No public rewrite, URL migration, redirect, canonical, sitemap, title/H1/meta, internal link, related-card, menu, breadcrumb, lawyer-card, CRM/review, wp-admin option or CMS/database action is approved by this addendum.

## 2026-05-11 Owner Decision Summary Addendum

CREATED:
- `project-control/personal-injury-owner-decision-summary-2026-05-11.md`.
- `project-control/personal-injury-owner-decision-summary-2026-05-11.csv`.

VERIFIED:
- The summary converts the source checklist, page matrix, side-by-side review, internal-link plan and SERP review into concise owner decisions.
- Recommended current working primary: `/tort-lawyer/`, with no URL change.
- Recommended protected car-accident candidate: `/car-accident-auto-injury-lawyer/`, with in-place review before migration.
- Future-only slugs remain `/personal-injury-lawyer/`, `/car-accident-lawyer/` and `/work-accident-lawyer/`.
- Support pages and internal links remain approval-gated and not live.

BLOCKED:
- No public rewrite, URL migration, redirect, canonical, sitemap, title/H1/meta, internal link, related-card, menu, breadcrumb, lawyer-card, CRM/review, wp-admin option or CMS/database action is approved by this addendum.

## 2026-05-11 Rewrite Outline Queue Addendum

CREATED:
- `project-control/personal-injury-rewrite-outline-queue-2026-05-11.md`.
- `project-control/personal-injury-rewrite-outline-queue-2026-05-11.csv`.

VERIFIED:
- `/tort-lawyer/` is queued as current primary-service refresh outline only.
- `/car-accident-auto-injury-lawyer/` is queued as protected car-accident refresh outline only.
- Road-accident law, compulsory insurance, punitive damages, tort overview, tort reform and deep-pocket pages are queued as support/specialist outline candidates.
- `/personal-injury-law/`, `/work-accident-lawyer/` and old Hebrew/taxonomy damages URLs remain boundary/research items.

BLOCKED:
- No public rewrite, URL migration, redirect, canonical, sitemap, title/H1/meta, internal link, related-card, menu, breadcrumb, lawyer-card, CRM/review, wp-admin option or CMS/database action is approved by this addendum.
