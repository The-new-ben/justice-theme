# National Insurance Owner Approval Packet

Date: 2026-05-11
Status: REVIEW ONLY / OWNER APPROVAL REQUIRED / NO URL CHANGE

This packet converts the national-insurance inventory, practice-area data, content-quality audit, URL-migration draft and GSC notes into an owner decision framework. It does not approve or execute public content rewrites, URL changes, redirects, canonical changes, sitemap changes, noindex actions, taxonomy/menu changes, related-card changes, lawyer-card changes or CMS writes.

## Recommended Approval Decision

RECOMMENDED:
- Approve a no-URL-change national-insurance planning batch.
- Treat `/practice-areas/national-insurance/` as an existing empty practice-area hub candidate, not as an approved pillar page.
- Treat `/national-insurance-lawyer/` as a strategic future slug only, not a current verified public URL and not an approved migration target.
- Protect the old Hebrew calculator URL until calculator/tool strategy, source/legal review and traffic-risk review are complete.
- Treat work accident as a boundary topic between personal injury, employment law and national insurance.
- Treat old regulation/law-text pages as source/legal support or law-text cleanup candidates, not as pillars by word count alone.
- Require direct GSC/SERP evidence before title/H1/meta, URL, content-body, internal-link, related-card or sitemap decisions.

Why:
- `category-map.csv` and the practice-area export show an existing `ביטוח לאומי` term with slug `national-insurance`, but it has count `0`.
- `url-migration-map.csv` currently proposes moving the old calculator URL to `/national-insurance-lawyer/`, but the status is `PROPOSED_ENGLISH_SLUG_NEEDS_REVIEW`.
- The calculator is useful but tool-like, not automatically a lawyer-service pillar.
- The old national-insurance disability regulations page is very long, but outdated and not a user-facing service pillar by default.
- GSC evidence for `תאונת עבודה` currently shows no visible rows in the checked pass, so work-accident/national-insurance demand remains NOT VERIFIED.

## Current Evidence

VERIFIED:
- `project-control/category-map.csv`.
- `project-control/exports/all-practice-areas-export.csv`.
- `project-control/content-master-inventory.csv`.
- `project-control/content-quality-audit.csv`.
- `project-control/url-migration-map.csv`.
- `project-control/gsc-keyword-page-map.csv`.

NOT VERIFIED:
- Direct GSC browser/API query rows for `עורך דין ביטוח לאומי`, `ביטוח לאומי`, `ועדה רפואית ביטוח לאומי`, `נכות כללית`, `קצבת נכות`, `תאונת עבודה ביטוח לאומי`, `פגיעה בעבודה`, `עורך דין תאונת עבודה`, `דמי ביטוח לאומי`, or `ביטוח אבטלה`.
- Fresh SERP review for national-insurance lawyer, medical committee, disability benefit, work injury and social-security benefit variants.
- GA4 landing-page, lead and conversion data.
- Source/legal review for National Insurance Institute procedures, medical committees, disability benefits, work injury, unemployment, official forms and calculators.
- Owner approval for primary URL, title/H1/meta changes, redirect/canonical/sitemap decisions, content rewrites, related-card logic or menu/taxonomy changes.
- Verified lawyer-directory mapping for national-insurance, work-accident, disability, employment and personal-injury lawyers.

## Available Inventory Evidence

VERIFIED:
- Practice area `/practice-areas/national-insurance/`: term ID `717`, name `ביטוח לאומי`, slug `national-insurance`, count `0`, description `קצבאות, ועדות רפואיות, נכות כללית, תאונות עבודה וערעורים.`
- `category-map.csv` marks the practice area as `REVIEW_EMPTY_TERM` and proposes `national-insurance-lawyer`.
- Old calculator URL: ID `11757`, title `מחשבון דמי ביטוח לאומי ובריאות`, `1,778` words, quality `5/10`, recommended `KEEP_OR_SUPPORT_PILLAR_REVIEW`, traffic risk `UNKNOWN`.
- `url-migration-map.csv` proposes old calculator URL -> `/national-insurance-lawyer/`, status `PROPOSED_ENGLISH_SLUG_NEEDS_REVIEW`, with redirect/canonical/internal-link/sitemap work marked `YES_AFTER_APPROVAL`.
- Old regulations URL: ID `6048`, title `תקנות הביטוח הלאומי (קביעת דרגת נכות לנפגעי עבודה), תשט"ז-1956`, `24,883` words, quality `4/10`, outdated, recommended `REWRITE`, status `NEEDS_EDITORIAL_SLUG_MAPPING`.
- `/income-protection-insurance/`: ID `2429`, `778` words, quality `2/10`, thin/outdated, recommended `REWRITE`, cluster `outdated-corona-legacy`.
- COVID unemployment-insurance page: ID `2086`, `591` words, quality `4/10`, thin/outdated, recommended `REWRITE`, cluster `outdated-corona-legacy`.
- `/pension-insurance-complete-guide/`: ID `11762`, `5,325` words, quality `6/10`, recommended `REVIEW_CLASSIFY`, currently not approved as national-insurance content.
- GSC checked row for `תאונת עבודה`: `0` clicks, `0` impressions, classification `NO_VISIBLE_SIGNAL`, status `GSC_BROWSER_VERIFIED_ZERO_ROWS`.

Interpretation:
- The site has a national-insurance taxonomy placeholder and several related legacy/tool/legal-text pages, but no approved user-facing national-insurance lawyer pillar.
- `/national-insurance-lawyer/` should remain a strategic future slug until the owner approves the role and migration plan.
- Work accident should not be moved blindly; it may belong to personal injury, employment law, national insurance, or a carefully linked overlap page.

## 2026-05-11 Direct GSC Browser Evidence

VERIFIED:
- `project-control/gsc-cyber-national-gap-pass-2026-05-11.md`.
- `project-control/gsc-cyber-national-gap-pass-2026-05-11.csv`.

Screenshot limitation:
- BLOCKED: after the cyber/privacy screenshots, GSC screenshot capture timed out for national-insurance rows. Text metrics and rows were still visible in the browser UI and recorded.

Query findings:
- `עורך דין ביטוח לאומי`: `0` clicks, `0` impressions, `No data`.
- `ביטוח לאומי`: `0` clicks, `2` impressions, position `72`; visible URLs were `/returning-resident-rights-determining-tax-rate/` and a low-sample case-law URL.
- `ועדה רפואית ביטוח לאומי`: `0` clicks, `0` impressions, `No data`.
- `קצבת נכות`: `0` clicks, `1` impression, position `76`; visible URL was `/cerebral-palsy-rights/`.

Page findings:
- `/practice-areas/national-insurance/`: reverse page-to-query check returned `0` clicks, `0` impressions and `No data`.

Interpretation:
- There is no verified national-insurance lawyer-service signal in GSC from this pass.
- The existing empty practice-area hub is not GSC-visible and should not be promoted as a primary page yet.
- The broad national-insurance and disability-benefit rows are too small and too weak to guide a URL migration.
- `/national-insurance-lawyer/` remains a future strategic slug only.
- No title, H1, meta, body, URL, redirect, canonical, sitemap, internal-link, related-card, taxonomy, menu or CMS action is approved by this evidence.

## Page Decisions For Approval

### 1. Existing Practice Area

Current URL:
- `https://jus-tice.co.il/practice-areas/national-insurance/`

Recommended action:
- KEEP AS EMPTY HUB CANDIDATE / REVIEW BEFORE INDEXING OR PROMOTION.

Blocked:
- No menu, homepage, sitemap, noindex/canonical, breadcrumb, related-card, lawyer-card or CMS change until owner approval.

### 2. Strategic Clean Slug

Future candidate:
- `/national-insurance-lawyer/`

Recommended action:
- STRATEGIC FUTURE SLUG / MIGRATION MAP REQUIRED.

Blocked:
- Do not create, migrate, redirect, canonicalize or add to sitemap until content role, GSC/SERP evidence and old-to-new mapping are approved.

### 3. National Insurance Calculator

Current URL:
- Old Hebrew URL for `מחשבון דמי ביטוח לאומי ובריאות`

Recommended action:
- PROTECT / CALCULATOR OR SUPPORT TOOL REVIEW.

Blocked:
- Do not redirect this calculator to `/national-insurance-lawyer/` until owner approves whether it remains a tool page, supports the pillar, or is rebuilt.

### 4. National Insurance Disability Regulations

Current URL:
- Old Hebrew URL for `תקנות הביטוח הלאומי (קביעת דרגת נכות לנפגעי עבודה), תשט"ז-1956`

Recommended action:
- LAW-TEXT / SOURCE SUPPORT REVIEW / NOT PRIMARY BY DEFAULT.

Blocked:
- Do not use this as a pillar by word count alone; do not rewrite or redirect until source/legal review.

### 5. Work Accident Boundary

Future candidate:
- `/work-accident-lawyer/`

Recommended action:
- BOUNDARY REVIEW: PERSONAL INJURY / EMPLOYMENT / NATIONAL INSURANCE.

Blocked:
- GSC currently shows no visible row for `תאונת עבודה`; do not create or migrate a work-accident page without deeper query evidence and approval.

### 6. Income Protection Insurance

Current URL:
- `https://jus-tice.co.il/income-protection-insurance/`

Recommended action:
- OUTDATED CORONA LEGACY REVIEW / POSSIBLE REWRITE OR SUPPORT.

Blocked:
- Do not merge with national-insurance content until private insurance vs public benefit intent is separated.

### 7. COVID Unemployment Insurance Page

Current URL:
- Existing `/articles/...ביטוח-אבטלה.../` URL.

Recommended action:
- LEGACY OUTDATED REVIEW / NOINDEX_OR_REDIRECT_LATER ONLY AFTER APPROVAL.

Blocked:
- Do not delete, noindex or redirect without owner approval and traffic-risk review.

### 8. Pension Insurance Boundary

Current URL:
- `https://jus-tice.co.il/pension-insurance-complete-guide/`

Recommended action:
- CLASSIFY SEPARATELY / NOT NATIONAL INSURANCE BY DEFAULT.

Blocked:
- Do not pull pension/insurance content into the national-insurance cluster without intent review.

## Source And Legal Review Checklist

Required before public rewrites:
- National Insurance Institute official pages and forms where relevant.
- Medical committee process sources.
- Disability benefit and work-injury public sources.
- Unemployment benefit public sources where relevant.
- Clear distinction between public national-insurance benefits and private insurance products.
- Practical checklist: documents to prepare, stages, deadlines, appeal routes and when to speak with a lawyer.
- Clear disclaimer that content is general information and not legal advice.

## Internal-Link Direction

Recommended planning only:
- Future national-insurance pillar -> medical committees, disability benefits, work injury, unemployment benefits, calculator/tool page, relevant lawyer profiles and official sources.
- Work-accident guide -> national-insurance pillar, personal-injury pillar, employment-law pillar and official work-injury sources after boundary approval.
- Calculator page -> national-insurance explainer/pillar only after owner approval and tool strategy.

Blocked:
- No internal links, related cards, menus, breadcrumbs, homepage sections or sitemap entries should be changed from this packet alone.

## Sitemap, Canonical, Robots And Redirect Position

Do not change now:
- Sitemap inclusion.
- Canonicals.
- Robots rules.
- 301 redirects.
- Slugs.
- Related-card logic.

Future migration must map:
- whether `/practice-areas/national-insurance/` remains taxonomy hub, becomes noindex, or supports a pillar.
- whether `/national-insurance-lawyer/` is created later.
- whether the calculator remains a tool page or redirects/supports a pillar.
- whether old law-text pages remain indexed, get rewritten, support, noindex later or redirect later.
- old URL -> new URL only if migration is approved.
- canonical target.
- sitemap inclusion.
- internal links to update.

## Owner Questions

OWNER APPROVAL REQUIRED:
1. Should `ביטוח לאומי` become its own priority cluster now, or wait until stronger GSC/SERP evidence exists?
2. Should `/national-insurance-lawyer/` be the future service pillar slug?
3. Should the calculator remain a standalone tool page or become support content under the pillar?
4. Should work-accident content be primarily personal injury, employment law, national insurance, or an overlap page?
5. Which lawyer profiles should connect to national insurance, work injury, disability benefits and medical committees?
6. Should outdated COVID/unemployment and income-protection pages be rewritten, merged, noindexed later or preserved until traffic is verified?

## Required Next Step After Approval

If approved, create a side-by-side comparison and direct evidence pass for:
- `/practice-areas/national-insurance/`
- old calculator URL
- old disability regulations URL
- `/income-protection-insurance/`
- COVID unemployment-insurance page
- `/pension-insurance-complete-guide/`
- future `/national-insurance-lawyer/`
- future `/work-accident-lawyer/`

Then produce a no-execution decision update covering:
- primary URL choice
- support/article roles
- official-source checklist
- internal-link map
- URL migration map
- sitemap/canonical/robots position
- owner approval gates
