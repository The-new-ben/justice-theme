# Medical Malpractice Owner Approval Packet

Date: 2026-05-11
Status: REVIEW ONLY / OWNER APPROVAL REQUIRED / NO URL CHANGE

This packet converts the medical-malpractice inventory, GSC browser evidence, content-quality audit, cannibalization map and URL conflict map into an owner decision framework. It does not approve or execute public content rewrites, URL changes, redirects, canonical changes, sitemap changes, noindex actions, document/media changes, taxonomy/menu changes, lawyer-card changes, review/rating changes or CMS writes.

## Recommended Approval Decision

RECOMMENDED:
- Approve a no-URL-change medical-malpractice primary-selection, duplicate-same-URL review, source/legal review and internal-link planning batch.
- Treat `/medical-malpractice-lawyer/` as the current clean commercial pillar candidate, but not as approved for title/content/URL execution yet.
- Protect the old Hebrew birth-malpractice page because it has visible GSC impressions for birth and pregnancy malpractice queries.
- Protect the fee article because it is the visible GSC page for the main `עורך דין רשלנות רפואית` query.
- Split medical-malpractice, birth injury, pregnancy/birth malpractice, surgery, anesthesia and general tort/personal-injury intent before any merge or redirect.
- Exclude unrelated international/real-estate contamination from the medical cluster during manual review.

Why:
- `medical-malpractice-lawyer` has `27` conflict rows and `2` exact current records pointing at the same public URL.
- `/medical-malpractice-lawyer/` has two public REST records: ID `11607` with `5,135` words and quality `6/10`, and ID `1130` with `3,287` words and quality `8/10`.
- GSC browser evidence shows `עורך דין רשלנות רפואית` has large query demand, but the visible Pages-tab row is a fee article with `145` impressions, not the clean pillar.
- GSC browser evidence shows `רשלנות רפואית בלידה` maps to an old Hebrew birth-malpractice page with `661` impressions.
- GSC browser evidence shows `רשלנות רפואית בהריון` also maps to the birth-malpractice page with `419` impressions, indicating overlap/cannibalization risk.

## Current Evidence

VERIFIED:
- `project-control/slug-conflict-review.csv`.
- `project-control/content-master-inventory.csv`.
- `project-control/content-quality-audit.csv`.
- `project-control/gsc-keyword-page-map.csv`.
- `project-control/cannibalization-map.csv`.
- `project-control/topic-clusters.csv`.
- `project-control/internal-link-map.csv`.

NOT VERIFIED:
- Full GSC API export.
- GA4 landing-page, lead and conversion data.
- Fresh SERP review for every medical-malpractice subtopic.
- Source/legal review of medical, causation, limitation, expert-opinion, court and damages claims.
- Owner approval for primary URL, merge, redirect, title/H1/meta or sitemap/canonical decisions.
- Verified lawyer-directory mapping for real medical-malpractice lawyers.

## Query Evidence From GSC Browser Pass

VERIFIED:
- `עורך דין רשלנות רפואית`: visible Pages tab showed `https://jus-tice.co.il/articles/שכר-טרחה-עורך-דין-רשלנות-רפואית/` with `145` impressions, `0` clicks, `0%` CTR and average position `49.5`.
- `עורך דין רשלנות רפואית`: notes record total query impressions around `1.34K`, so the visible row is only part of the query picture and needs a deeper export/manual pass.
- `רשלנות רפואית בלידה`: `https://jus-tice.co.il/עורך-דין-רשלנות-רפואית-בלידה-מומלץ/` has `661` impressions, `0` clicks, `0%` CTR and average position `40.5`.
- `רשלנות רפואית בהריון`: the same birth-malpractice page has `419` impressions, `0` clicks, `0%` CTR and average position `65.9`.
- `עורך דין נזיקין`: only a low-sample old verdict/category-style page was visible, with `2` impressions and average position `48`.

Interpretation:
- The clean medical-malpractice pillar exists, but GSC does not yet prove it is the current primary query owner.
- The fee article and birth-malpractice Hebrew URL have migration risk and must be protected until comparison and redirect planning are approved.
- Pregnancy and birth malpractice are overlapping now; they need either a clear parent/child structure or a controlled merge/support plan.
- General tort/personal-injury intent should not be merged into medical malpractice without a separate owner decision.

## Page Decisions For Approval

### 1. Clean Medical-Malpractice Pillar Candidate

Current URL:
- `https://jus-tice.co.il/medical-malpractice-lawyer/`

Current facts:
- Exact clean URL exists.
- Public REST ID `11607`: title `עורך דין רשלנות רפואית | עו”ד רשלנות רפואית`, `5,135` words, quality score `6/10`, no internal links detected by the heuristic.
- Public REST ID `1130`: title `מומחים לענייני רשלנות רפואית`, `3,287` words, quality score `8/10`, internal links detected.
- The exact URL duplicate/same-public-URL condition must be understood before editing anything.

Recommended action:
- COMPARE AS PRIMARY / DUPLICATE-SAME-URL REVIEW / NO URL CHANGE.

Blocked:
- No title/H1/meta, body, canonical, sitemap, redirect, URL or CMS changes until duplicate identity and owner approval are resolved.

### 2. Fee Article Owning Visible Main Query Row

Current URL:
- `https://jus-tice.co.il/articles/שכר-טרחה-עורך-דין-רשלנות-רפואית/`

Current facts:
- Public REST ID `6861`.
- Word count `989`.
- Quality score `4/10`.
- GSC visible row for `עורך דין רשלנות רפואית`: `145` impressions, average position `49.5`.

Recommended action:
- PROTECT / COMPARE / SUPPORT OR MERGE LATER.

Blocked:
- Do not redirect, noindex, delete, canonicalize away or rewrite until the clean pillar and fee-intent role are approved.

### 3. Birth-Malpractice Old Hebrew Query Owner

Current URL:
- `https://jus-tice.co.il/עורך-דין-רשלנות-רפואית-בלידה-מומלץ/`

Current facts:
- Public REST ID `11834`.
- Word count `6,739`.
- Quality score `6/10`.
- GSC: `661` impressions for `רשלנות רפואית בלידה`.
- Also receives `419` impressions for `רשלנות רפואית בהריון`.

Recommended action:
- PROTECT / COMPARE / SPLIT OR MERGE AFTER REVIEW.

Blocked:
- No English slug migration, redirect, noindex, canonical change or rewrite until birth/pregnancy intent is approved.

### 4. Birth Injury And Birth-Malpractice Support Pages

Current URLs:
- `/birth-injury/`: `1,723` words, quality `5/10`.
- `/birth-injury-lawyer/`: `1,690` words, quality `5/10`.
- `/birth-injury-causes/`: `1,014` words, quality `4/10`.
- `/malpractice-cerebral-palsy/`: `858` words, quality `4/10`.

Recommended action:
- SUPPORT REVIEW / DO NOT DUPLICATE.

Blocked:
- No new birth-injury or cerebral-palsy pages until the existing URLs are compared and assigned to parent/support roles.

### 5. Surgery, Anesthesia And Hospital Support Pages

Current URLs:
- `/anesthesia-medical-malpractice/`: `2,878` words, quality `6/10`.
- `/surgical-errors-medical-malpractice/`: `855` words, quality `4/10`.
- `/personal-injury/medical-malpractice/surgery/`: existing nested surgery path, needs manual URL strategy review.
- Old Hebrew `רשלנות רפואית בניתוח`: `661` words, quality `4/10`.

Recommended action:
- SUPPORT REVIEW / SOURCE-LEGAL CHECK / INTERNAL-LINK PLAN.

Blocked:
- No merge, redirect or clean slug decision until surgery/anesthesia subtopic intent is mapped.

### 6. General Explanation And Practical Support Pages

Current URLs:
- `/what-is-medical-malpractice-definition-examples/`: `1,415` words, quality `5/10`.
- `/medical-malpractice-common-errors-doctors-hospitals/`: `698` words, quality `6/10`, thin and marked `EXPAND`.
- Old Hebrew practical pages exist for documents, first steps, expert witnesses, common types, costs and hospital negligence.

Recommended action:
- KEEP AS SUPPORT / EXPAND AFTER SOURCE REVIEW.

Blocked:
- No public rewrite or title/H1/meta update until source/legal review and internal-link map are approved.

### 7. Very Large Report-Style Page

Current URL:
- `https://jus-tice.co.il/הקטנת-הוצאות-תביעות-רשלנות-רפואית/`

Current facts:
- Public REST ID `6715`.
- Word count `118,502`.
- Quality score `6/10`.
- Highest-word-count item in the conflict group.

Recommended action:
- SOURCE / COPYRIGHT / QUALITY / INDEXATION REVIEW.

Blocked:
- Do not merge, delete, noindex or redirect based on word count alone.

### 8. Medical Malpractice vs Personal Injury Boundary

Current issue:
- `עורך דין נזיקין` has only low-sample GSC evidence and maps to old verdict/category-style content.
- `personal-injury` cluster has no approved clean primary yet.
- Medical malpractice overlaps with personal injury, tort and damages, but it should remain a distinct YMYL medical/legal cluster.

Recommended action:
- SEPARATE MEDICAL MALPRACTICE FROM GENERAL TORT/PERSONAL INJURY DECISIONS.

Blocked:
- Do not make `/medical-malpractice-lawyer/` carry all tort/personal-injury intent.
- Do not create or redirect a personal-injury pillar from this packet.

## Source And Legal Review Checklist

Before any rewrite or merge, verify:
- Limitation periods and exceptions.
- Expert medical opinion requirements.
- Causation, breach, damages and evidentiary burden.
- Medical-record collection and HMO/hospital record requests.
- Birth injury, pregnancy, surgery, anesthesia and diagnosis-specific legal differences.
- Court/official source links where appropriate.
- No unsupported success-rate, guaranteed compensation, best-lawyer or recommended-lawyer claims.
- No medical advice presented as diagnosis or treatment.
- Privacy and sensitive-health-information caution in lead forms and review/testimonial sections.

## Internal-Link Direction

Recommended later structure, pending owner approval:
- `/medical-malpractice-lawyer/` -> birth malpractice, surgery errors, anesthesia, diagnosis mistakes, documents checklist, expert opinion, fee/cost article, relevant lawyer directory.
- Birth/pregnancy support pages -> `/medical-malpractice-lawyer/` and each other only where intent is natural.
- Surgery/anesthesia support pages -> `/medical-malpractice-lawyer/` plus practical checklist/source pages.
- Fee article -> `/medical-malpractice-lawyer/` with natural Hebrew anchor text, not over-optimized.
- General tort/personal-injury pages -> medical malpractice only where medically relevant.

## Sitemap / Canonical / Redirect Position

BLOCKED:
- No sitemap inclusion/exclusion changes.
- No canonical changes.
- No redirects.
- No URL migration to English slug for old Hebrew pages.
- No noindex decisions.

Required before migration:
- Full URL inventory for all medical-malpractice pages.
- Side-by-side content comparison.
- GSC query/page export or browser pass for key subtopics.
- Source/legal review.
- Internal-link map.
- Redirect/canonical/sitemap plan.
- Owner approval.

## Owner Questions

1. Should `/medical-malpractice-lawyer/` be the commercial primary after duplicate-same-public-URL review?
2. Which public REST record is authoritative for the current `/medical-malpractice-lawyer/` URL: ID `11607`, ID `1130`, or a merged CMS state?
3. Should the fee article stay as a support page, merge into the pillar, or later redirect after content consolidation?
4. Should birth malpractice and pregnancy malpractice be separate support pages or one parent/child structure?
5. Which old Hebrew medical-malpractice URLs are worth preserving as support pages because they have specific intent?
6. Which pages need legal/medical source review before any public rewrite?
7. Should any medical-malpractice lawyer cards/profile pages be mapped before pillar expansion?

## Blocked Actions

BLOCKED until explicit approval:
- Public content body edits.
- Title/H1/meta edits.
- URL/slug changes.
- Redirects.
- Canonical changes.
- Sitemap changes.
- Noindex/robots changes.
- Deleting or moving old Hebrew pages.
- Merging the fee article or birth-malpractice article.
- Creating duplicate clean pages.
- Taxonomy/menu changes.
- Lawyer card/profile edits.
- Review/rating/schema changes.
- CMS, wp-admin, plugin-state or database writes.

## Next Approved Work

If owner approves this review-only packet, the next safe work is:
1. Build a side-by-side comparison of ID `11607`, ID `1130`, fee article ID `6861`, birth-malpractice ID `11834`, and main support pages.
2. Run deeper GSC browser export/manual evidence for `עורך דין רשלנות רפואית`, `רשלנות רפואית`, `רשלנות רפואית בלידה`, `רשלנות רפואית בהריון`, `רשלנות רפואית בניתוח`, and `עורך דין נזיקין`.
3. Create a source/legal review checklist for all YMYL medical/legal claims.
4. Create an internal-link map for the medical-malpractice cluster.
5. Draft a redirect/canonical/sitemap decision map only after owner approval.

## Safety

VERIFIED:
- This packet is documentation and planning only.
- No public content, URL, redirect, canonical, sitemap, noindex, taxonomy, menu, lawyer, review, CRM, plugin-state, wp-admin setting or database state was changed.

## 2026-05-11 Source / Legal Checklist Addendum

VERIFIED / REVIEW ONLY:
- Created `project-control/medical-malpractice-source-legal-checklist-2026-05-11.md`.
- Created `project-control/medical-malpractice-source-legal-checklist-2026-05-11.csv`.
- `8` source/legal gates now cover commercial pillar, fee/cost support, birth/pregnancy, birth injury/cerebral palsy, surgery/anesthesia/hospital error, definition/common-errors, records/evidence/privacy and report/background content.
- The checklist records source anchors, allowed claims, blocked claims, privacy-risk level, schema/review restrictions and legal-review status.

NEXT:
- Build a current-URL upload-readiness queue and internal-link map for the medical-malpractice cluster.

BLOCKED:
- No public content, title/H1/meta, URL, redirect, noindex, canonical, sitemap, taxonomy/menu, related-card, lawyer-card, review/rating/schema, CRM or CMS execution is approved by this addendum.
