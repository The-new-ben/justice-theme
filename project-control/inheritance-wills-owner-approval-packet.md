# Inheritance And Wills Owner Approval Packet

Date: 2026-05-11
Status: REVIEW ONLY / OWNER APPROVAL REQUIRED / NO URL CHANGE

This packet converts the inheritance/wills inventory, GSC browser evidence, content-quality audit, topic-cluster data and slug-conflict map into an owner decision framework. It does not approve or execute public content rewrites, URL changes, redirects, canonical changes, sitemap changes, noindex actions, taxonomy/menu changes, document/media handling, related-card changes, lawyer-card changes or CMS writes.

## Recommended Approval Decision

RECOMMENDED:
- Approve a no-URL-change inheritance/wills primary-selection, will-guide, will-contest, probate/inheritance-order and document/media-risk planning batch.
- Treat `/inheritance-lawyer/` as a strategic future commercial slug only, not an approved public URL or migration target.
- Treat `/inheritance/`, `/will-and-testament/`, `/will-probate-objection/`, `/what-is-a-probate-order/`, `/inheritance-order/` and `/revocation-of-a-will-and-reviving-previous-will/` as current comparison candidates, not approved pillars.
- Protect old Hebrew case-law and legacy will/inheritance URLs that already receive GSC impressions.
- Do not create `/will/`, `/will-contest/`, `/inheritance-lawyer/` or redirects until the side-by-side comparison, GSC/SERP pass, source/legal review, document strategy and owner approval are complete.
- Separate lawyer-service intent (`עורך דין ירושה`, `עורך דין צוואות וירושות`) from informational/procedure intent (`צוואה`, `צו ירושה`, `צו קיום צוואה`, `התנגדות לצוואה`).

Why:
- The strategic inheritance/wills pillar target in `cluster-pillar-review.csv` is `/inheritance-lawyer/`, but that target was not found as a current public URL.
- The `will` target slug has `10` conflict rows and `0` exact current clean `/will/` URLs.
- GSC browser evidence maps broad `צוואה` demand mostly to case-law, an old Hebrew wills/inheritance page, support pages and even an uploaded DOCX file, not to a clean approved pillar.
- GSC browser evidence maps `התנגדות לצוואה` almost entirely to a case-law URL with `120` impressions.
- Several existing clean English support URLs are thin or outdated and need rewrite/review before they become the public structure.

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

NOT VERIFIED:
- Full GSC API export.
- GA4 landing-page, lead and conversion data.
- Fresh SERP review for each inheritance/wills subtopic.
- Source/legal review for wills, probate, inheritance order, will contest, estate administration, international inheritance and document/template claims.
- Owner approval for primary URL, title/H1/meta changes, document/media handling, redirect/canonical/sitemap decisions, content rewrites or menu/taxonomy changes.
- Verified lawyer-directory mapping for inheritance, wills and estate lawyers.

## Query Evidence From GSC Browser Pass

VERIFIED:
- `צוואה`: case-law URL `https://jus-tice.co.il/psakdin/התנגדות-לצוואה-בשל-השפעה-בלתי-הוגנת/` has `126` impressions, `0` clicks, `0%` CTR and average position `39.6`.
- `צוואה`: old Hebrew URL `https://jus-tice.co.il/עורך-דין-צוואות-וירושות/` has `43` impressions and is a URL migration risk.
- `צוואה`: specific probate/cancel-order case page has `14` impressions.
- `צוואה`: uploaded document URL `https://jus-tice.co.il/wp-content/uploads/2020/09/צוואה.docx` has `6` impressions and needs a document strategy before any handling decision.
- `צוואה`: `/what-is-a-probate-order/` has `5` impressions.
- `צוואה`: `/revocation-of-a-will-and-reviving-previous-will/` has `3` impressions.
- `התנגדות לצוואה`: case-law URL `https://jus-tice.co.il/psakdin/התנגדות-לצוואה-בשל-השפעה-בלתי-הוגנת/` has `120` impressions, `0` clicks, `0%` CTR and average position `31`.
- `עורך דין ירושה`: exact filter returned `0` visible rows in the checked GSC browser pass.
- Wrong-page signal: `נהיגה בשכרות` and `עורך דין נהיגה בשכרות` map to `/revocation-of-a-will-and-reviving-previous-will/` in low-sample rows, so that will page must not be optimized for traffic-law intent.

Interpretation:
- Google is seeing inheritance/wills content, but the visible demand is attached to case-law, legacy Hebrew, support and media/document URLs rather than one clear commercial or public guide structure.
- The clean service-pillar decision remains open.
- A future `/will/` guide and `/will-contest/` guide may be strategically useful, but creating them now would risk duplicate or weaker content unless old pages are compared first.

## Page Decisions For Approval

### 1. Strategic Commercial Pillar

Future candidate:
- `/inheritance-lawyer/`

Current facts:
- `cluster-pillar-review.csv` lists `inheritance-lawyer` as the strategic target slug.
- Exact current public URL was not verified.
- The heuristic proposed `/most-recommended-family-lawyer/` as the cluster pillar by word count, but this is family-law recommendation content and not an approved inheritance/wills primary.

Recommended action:
- STRATEGIC FUTURE SLUG / PRIMARY SELECTION REQUIRED / NO URL CHANGE.

Blocked:
- No creation, migration, redirect, canonical, sitemap, title/H1/meta or menu change until owner approval.

### 2. Current Inheritance Guide Candidate

Current URL:
- `https://jus-tice.co.il/inheritance/`

Current facts:
- Public REST ID `3048`.
- Title: `מהי ירושה`.
- Word count: `705`.
- Quality score: `4/10`.
- Marked thin, no internal links, recommended action `EXPAND`.

Recommended action:
- EXPAND/COMPARE AS INFORMATIONAL SUPPORT OR HUB.

Blocked:
- No rewrite, merge, redirect or title/H1/meta change until compared with older Hebrew inheritance pages and legal sources.

### 3. Current Will Guide Candidate

Current URL:
- `https://jus-tice.co.il/will-and-testament/`

Current facts:
- Public REST ID `3017`.
- Title: `צוואה`.
- Word count: `682`.
- Quality score: `4/10`.
- Marked thin and outdated.
- Has internal links, but the role is not approved.

Recommended action:
- REWRITE/COMPARE AS WILL GUIDE CANDIDATE.

Blocked:
- Do not create or migrate `/will/` until this page, case-law pages, the old Hebrew wills/inheritance page and the DOCX URL are compared.

### 4. `/will/` Slug Conflict

Target slug:
- `/will/`

Current facts:
- `slug-conflict-review.csv` shows target slug `will` has `10` conflict rows.
- Exact current slug count is `0`.
- The heuristic proposed a long case-law URL by word count: post ID `6426`, `15,311` words.

Recommended action:
- OWNER REVIEW / SELECT PRIMARY AND PLAN REDIRECTS LATER.

Blocked:
- Do not create `/will/`, redirect old will URLs, canonicalize, noindex or delete old pages until approved.

### 5. Will Contest / Objection Guide Candidate

Current URL:
- `https://jus-tice.co.il/will-probate-objection/`

Current facts:
- Public REST ID `2970`.
- Title: `התנגדות לצוואה | הגשת התנגדות לצו קיום צוואה`.
- Word count: `618`.
- Quality score: `2/10`.
- Marked thin and outdated, no internal links.
- GSC shows `התנגדות לצוואה` is currently owned by a case-law page, not this guide candidate.

Recommended action:
- REWRITE/COMPARE AS `/will-contest/` OR SUPPORT CANDIDATE.

Blocked:
- No new `/will-contest/` page or migration until the current guide and case-law URLs are compared and approved.

### 6. Case-Law Page Owning Will Contest Demand

Current URL:
- `https://jus-tice.co.il/psakdin/התנגדות-לצוואה-בשל-השפעה-בלתי-הוגנת/`

Current facts:
- GSC: `126` impressions for `צוואה`.
- GSC: `120` impressions for `התנגדות לצוואה`.
- Classified as `CANNIBALIZATION_RISK` / `NEEDS_SUPPORTING_ARTICLE`.

Recommended action:
- PROTECT / USE AS SUPPORTING CASE-LAW EVIDENCE AFTER REVIEW.

Blocked:
- Do not redirect, noindex, delete, merge or rewrite away the ranking context until the public guide strategy is approved.

### 7. Old Hebrew Wills/Inheritance URL

Current URL:
- `https://jus-tice.co.il/עורך-דין-צוואות-וירושות/`

Current facts:
- GSC: `43` impressions for `צוואה`.
- Classified as `URL_MIGRATION_RISK`.

Recommended action:
- PROTECT / COMPARE BEFORE MIGRATION.

Blocked:
- No English-slug migration, redirect or canonical update until owner-approved mapping exists.

### 8. Document / Template URL Risk

Current URL:
- `https://jus-tice.co.il/wp-content/uploads/2020/09/צוואה.docx`

Current facts:
- GSC: `6` impressions for `צוואה`.
- Classified as `MEDIA_URL_REVIEW`.

Recommended action:
- DOCUMENT STRATEGY REQUIRED.

Blocked:
- Do not delete, replace, noindex, redirect or block the document until the document/media policy is approved.

### 9. Probate Order Support Candidate

Current URL:
- `https://jus-tice.co.il/what-is-a-probate-order/`

Current facts:
- Public REST ID `2963`.
- Title: `הגשת בקשה לצו קיום צוואה | עורך דין צו קיום צוואה`.
- Word count: `573`.
- Quality score: `4/10`.
- Marked thin, no internal links, recommended action `EXPAND`.
- GSC: `5` impressions for `צוואה`.

Recommended action:
- EXPAND AS SUPPORT AFTER SOURCE/LEGAL REVIEW.

Blocked:
- No title/meta/body or URL decision until official process sources and internal-link role are reviewed.

### 10. Inheritance Order Support Candidate

Current URL:
- `https://jus-tice.co.il/inheritance-order/`

Current facts:
- Public REST ID `2921`.
- Title: `צו ירושה | מה זה צו ירושה?| מדריך הגשת בקשה לצו ירושה`.
- Word count: `2,182`.
- Quality score: `5/10`.
- Marked outdated, has internal links, recommended action `REWRITE`.

Recommended action:
- REWRITE/EXPAND AS SUPPORT AFTER SOURCE/LEGAL REVIEW.

Blocked:
- No rewrite or migration until compared with old Hebrew `צו ירושה` pages and official source links.

### 11. Will Revocation Page

Current URL:
- `https://jus-tice.co.il/revocation-of-a-will-and-reviving-previous-will/`

Current facts:
- Public REST ID `2765`.
- Title: `ביטול צוואה וקיום צוואה קודמת בה חלוקה שווה`.
- Word count: `11,861`.
- Quality score: `4/10`.
- Marked outdated and missing internal links, recommended action `REWRITE`.
- GSC: low-sample `צוואה` impressions and wrong-page traffic-law matches.

Recommended action:
- PROTECT / REWRITE REVIEW / REMOVE WRONG-INTENT SIGNALS LATER.

Blocked:
- Do not optimize this page for traffic-law queries; do not redirect or rewrite before inheritance/wills comparison.

### 12. International Inheritance/Wills Page

Current URL:
- `https://jus-tice.co.il/international-inheritance-wills-lawyer/`

Current facts:
- Public REST ID `12401`.
- Title: `עורך דין בינלאומי ירושות צוואות ועיזבונות | מדריך ליורשים ישראלים בחו”ל`.
- Word count: `13,800`.
- Quality score: `3/10`.
- Marked no internal links, recommended action `REWRITE`.
- Current cluster notes classify it outside the clean inheritance-wills local service structure.

Recommended action:
- SEPARATE INTERNATIONAL INTENT / REWRITE REVIEW.

Blocked:
- Do not use this as the local inheritance-lawyer pillar without explicit owner approval and SERP evidence.

## Source And Legal Review Checklist

Required before public rewrites:
- Official Israeli government/court sources for inheritance order, probate order and will objection processes.
- Registrar of Inheritance Affairs sources where relevant.
- Court system process pages where relevant.
- Statutory references only after legal review.
- Clear disclaimer that content is general information and not legal advice.
- Privacy review for any case-law summaries and review of whether personal/sensitive facts should be summarized more carefully.

## Internal-Link Direction

Recommended planning only:
- Commercial inheritance/wills service page -> will guide, inheritance guide, inheritance order, probate order, will contest, will revocation and relevant lawyer profiles.
- Will guide -> commercial inheritance/wills service page, will contest, probate order, inheritance order and official sources.
- Will contest guide -> commercial inheritance/wills service page, case-law examples and official process sources.
- Case-law pages -> public guides only after review, with natural Hebrew anchors.
- Document/template URL -> public guide only after approved document strategy.

Blocked:
- No internal links, related cards, menus, breadcrumbs or homepage sections should be changed from this packet alone.

## Sitemap, Canonical, Robots And Redirect Position

Do not change now:
- Sitemap inclusion.
- Canonicals.
- Robots rules.
- 301 redirects.
- Slugs.
- Media/document availability.

Future migration must map:
- old URL -> new URL.
- old slug -> new slug.
- primary URL.
- support URLs.
- document/media treatment.
- category/hub mapping.
- canonical target.
- sitemap inclusion.
- internal links to update.

## Owner Questions

OWNER APPROVAL REQUIRED:
1. Should the inheritance/wills commercial pillar be a future `/inheritance-lawyer/`, or should another existing URL be strengthened first?
2. Should `/will-and-testament/` remain the current will guide candidate, or should a future `/will/` guide be planned after comparison?
3. Should `/will-probate-objection/` be rewritten as the will-contest guide, or should a future `/will-contest/` be created/migrated later?
4. How should the uploaded `צוואה.docx` be handled: keep, connect to guide, replace with gated/download page, noindex later, or redirect later?
5. Should international inheritance/wills content stay separate from Israeli local inheritance-lawyer intent?
6. Which inheritance/wills lawyer profiles should connect to this cluster?

## Blocked Actions

BLOCKED until explicit owner approval:
- Public content rewrites.
- Title/H1/meta updates.
- URL or slug changes.
- 301 redirects.
- Canonical changes.
- Sitemap inclusion/exclusion changes.
- Robots/noindex changes.
- Document/media deletion, replacement or redirect.
- Menu, taxonomy, breadcrumb, related-card or homepage changes.
- Lawyer-card/profile wiring.
- CMS writes or database changes.

## Next Approved Work

If owner approves this planning lane, the next safe work is:
1. Build a side-by-side comparison of `/inheritance/`, `/will-and-testament/`, `/will-probate-objection/`, `/what-is-a-probate-order/`, `/inheritance-order/`, `/revocation-of-a-will-and-reviving-previous-will/`, old Hebrew case-law URLs and old Hebrew service URLs.
2. Run deeper GSC browser checks for variants: `עורך דין צוואות וירושות`, `עורך דין צוואה`, `עורך דין ירושה`, `צו ירושה`, `צו קיום צוואה`, `התנגדות לצוואה`, `ביטול צוואה`, `ניהול עיזבון`.
3. Run SERP review for commercial, guide and procedure intents.
4. Create source/legal review checklist for each approved page.
5. Draft internal-link map only after primary/support roles are approved.
6. Prepare URL migration and redirect plan only after owner chooses target URLs.

## Safety

VERIFIED:
- This packet is documentation and CSV planning only.
- No live public content, URL, redirect, sitemap, canonical, noindex, document/media, menu, taxonomy, related-card, lawyer-card, CMS or database state was changed.
