# Medical Malpractice Current-URL Upload Readiness

Date: 2026-05-11  
Status: VERIFIED / REVIEW ONLY / NO PUBLIC CHANGES

This batch converts the medical-malpractice owner packet, inventory scan and source/legal checklist into a practical current-URL upload-readiness queue. It does not approve public copy, CMS writes, URL changes, redirects, noindex/canonical changes, sitemap changes, internal-link execution, schema, lawyer cards, review/rating blocks or lead-form changes.

## Batch Scope

VERIFIED:
- `19` inventory candidates were scanned using medical/malpractice/doctor/hospital/birth/patient/negligence/surgery/pregnancy signals.
- `23` URL or URL-reference items were advanced into decision roles because the owner packet also identifies old Hebrew GSC-visible URLs, a fee article, a large report-style page and a duplicate same-public-URL condition.
- Existing control files now cover the first malpractice layer:
  - `project-control/medical-malpractice-owner-approval-packet.md`
  - `project-control/medical-malpractice-owner-approval-packet.csv`
  - `project-control/medical-malpractice-source-legal-checklist-2026-05-11.md`
  - `project-control/medical-malpractice-source-legal-checklist-2026-05-11.csv`

NOT VERIFIED:
- Full GSC API export.
- GA4 landing-page, lead and conversion data.
- Legal/medical review of public copy.
- Which CMS record is authoritative for `/medical-malpractice-lawyer/`.
- Final primary/support/redirect decisions for old Hebrew pages.
- Real medical-malpractice lawyer availability and profile quality.

## Main Decision

RECOMMENDED:
- Treat `/medical-malpractice-lawyer/` as the current clean commercial pillar candidate only after duplicate same-public-URL review.
- Protect the visible GSC fee article and old Hebrew birth/pregnancy malpractice page until comparison and redirect/canonical/sitemap planning are approved.
- Use current support pages for birth injury, surgery, anesthesia, definition/common-errors and records/evidence work instead of creating duplicate clean slugs immediately.
- Separate medical malpractice from traffic medical-fitness/Marvad, criminal negligence, US medical-malpractice and generic personal-injury/tort work.

BLOCKED:
- No redirect or noindex of the fee article.
- No redirect or noindex of the old Hebrew birth/pregnancy page.
- No new `/birth-malpractice/`, `/pregnancy-malpractice/`, `/diagnosis-malpractice/` or `/surgery-malpractice/` pages until the split plan is approved.
- No review/rating/schema or lawyer-card trust signals until data is real and compliance-reviewed.

## Page Architecture

### Pillar Candidate

`/medical-malpractice-lawyer/`
- Role: commercial medical-malpractice lawyer pillar.
- Risk: two public REST records share the same public URL.
- Upload posture: duplicate identity review first, then side-by-side merge plan.
- Sitemap posture: include only after one authoritative CMS state, legal/source review, internal links and self-canonical are verified.

### Protected Query Assets

`REFERENCE:MEDMAL-FEE-GSC-001`
- Role: fee/cost support page currently visible for the main lawyer query in GSC evidence.
- Upload posture: protect and compare before any redirect or canonical decision.

`REFERENCE:MEDMAL-BIRTH-HEBREW-GSC-001`
- Role: old Hebrew birth/pregnancy malpractice page carrying visible subtopic demand.
- Upload posture: protect and compare before English slug split or migration.

`REFERENCE:MEDMAL-REPORT-LARGE-001`
- Role: very large report-style page, source/copyright/indexation review.
- Upload posture: do not promote as pillar by word count alone.

### Support Pages

Birth injury / birth malpractice:
- `/birth-injury/`
- `/birth-injury-lawyer/`
- `/birth-injury-causes/`
- `/brain-damage-at-birth/`
- `/malpractice-cerebral-palsy/`

Surgery / anesthesia:
- `/anesthesia-medical-malpractice/`
- `/surgical-errors-medical-malpractice/`
- `/personal-injury/medical-malpractice/surgery/`

Definition / common errors:
- `/what-is-medical-malpractice-definition-examples/`
- `/medical-malpractice-common-errors-doctors-hospitals/`
- `/medical-malpractice-vs-negligence-differences-israel/`

Boundary / exclude:
- `/medical-malpractice-in-the-united-states/` is US/international context, not Israeli service pillar.
- `/standards-of-medical-fitness-to-drive/`, `/medical-institute-for-road-safety/` and `/medical-fitness-tests-for-driving-marvad-info/` belong to traffic/Marvad, not medical malpractice.
- `/criminal-negligence/` belongs to criminal law, not medical malpractice.
- `/legal-clinic/` is not a malpractice support page without manual review.

## Anti-Cannibalization Rules

VERIFIED / KEEP:
- `/medical-malpractice-lawyer/` owns commercial lawyer-hiring intent only after duplicate state is resolved.
- Fee/cost article should support the pillar, not compete with it.
- Birth/pregnancy content needs a parent/support split before new clean URLs.
- Surgery/anesthesia pages should support the pillar and each other, not become broad duplicate pillars.
- Definition/common-errors pages should be informational support only.

BLOCKED / DO NOT DO:
- Do not use word count alone to select the pillar.
- Do not create new clean subtopic pages before comparing current pages.
- Do not mix traffic medical-fitness pages into malpractice.
- Do not mix criminal negligence into malpractice.
- Do not show unsupported medical causation conclusions.
- Do not expose sensitive medical details in lead/review/testimonial content.

## Internal-Link Requirements Before Upload

Each approved medical-malpractice page should eventually have:
- one contextual link back to the approved pillar,
- links to relevant support pages only within the same malpractice cluster,
- a privacy-safe lead CTA,
- source/legal reference area,
- no fake ratings/reviews,
- no unsupported lawyer-ranking language,
- breadcrumbs that separate medical malpractice from personal injury, traffic/Marvad and criminal negligence.

## Related Content Rules

Allowed related content:
- same-cluster malpractice support pages,
- source-reviewed birth/surgery/anesthesia/definition pages,
- carefully labelled report/context pages,
- real medical-malpractice lawyer cards only after profile verification.

Blocked related content:
- traffic/Marvad medical-fitness pages,
- criminal negligence pages,
- US/international malpractice pages on Israeli service pages unless clearly labelled,
- general personal-injury pages that do not mention medical malpractice,
- fake top/recommended lawyer pages,
- reviews/ratings/testimonials exposing health details.

## Sitemap Posture

INCLUDE AFTER APPROVAL:
- `/medical-malpractice-lawyer/` after duplicate identity, legal/source review and canonical verification.
- Support pages only after they have unique value, safe source/legal wording and internal links.

HOLD OUT:
- unreviewed future slugs,
- traffic/Marvad medical-fitness pages,
- criminal-negligence page,
- US/international malpractice page from the Israeli service sitemap group,
- very large report page until source/copyright/indexation strategy is approved.

PROTECT:
- fee article,
- old birth/pregnancy GSC-visible page,
- old/report pages until migration map is approved.

## Next Safe Step

RECOMMENDED:
1. Create a current-URL internal-link map for the approved malpractice queue.
2. Package medical malpractice for owner upload review after internal-link planning.
3. If approved, compare `/medical-malpractice-lawyer/` duplicate records, fee article, birth/pregnancy page and support pages side-by-side.
4. Only then draft final public Hebrew copy or redirect/canonical/sitemap changes.

BLOCKED:
- No public content body, title, H1, meta, URL, slug, redirect, canonical, noindex, sitemap, taxonomy, category, menu, breadcrumb, internal-link, related-card, schema, lawyer-card, review/rating, CRM, wp-admin setting or database row change was executed by this batch.

## 2026-05-11 Internal-Link And Owner Package Addendum

VERIFIED:
- `project-control/medical-malpractice-no-url-internal-link-map-2026-05-11.md` and `.csv` now map `38` current-URL relationship/control rows for this queue.
- `project-control/medical-malpractice-owner-upload-review-package-2026-05-11.md` and `.csv` now package `8` owner-review decisions.
- The cluster has a review-only path from inventory and GSC evidence to source/legal gates, current URL roles, internal-link plan and owner upload review.

NEXT:
- Owner/legal review should approve planning only, then compare the duplicate pillar records, fee article, old birth/pregnancy page and support roles side-by-side before public copy or URL execution.

BLOCKED:
- No public content, title/H1/meta, URL migration, redirect, noindex, canonical, sitemap, taxonomy/category, menu, breadcrumb, internal-link, related-card, schema, lawyer-card, review/rating, CRM, wp-admin setting or CMS/database change was executed by the internal-link or owner-package addendum.
