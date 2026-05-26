# Medical Malpractice Support-to-Hub Map - 2026-05-18

## Goal

Turn existing medical-malpractice traffic into lawyer-lead intent by connecting high-impression support pages to the recovered commercial hub:

`https://jus-tice.co.il/medical-malpractice-lawyer/`

This is a planning artifact only. It does not edit public content, redirects, taxonomy, or WordPress data.

## Research Basis

- Google says internal links should be crawlable and anchor text should help users and Google understand the destination page.
- Google's SEO starter guidance says useful content and clear navigation help users and search engines understand important pages.
- Competitor review for Israeli medical-malpractice searches shows the winning commercial pages repeatedly organize content around birth malpractice, cerebral palsy, medical experts, costs, examples, hospitals, diagnosis/treatment errors, and claim process.

Sources:
- https://developers.google.com/search/docs/crawling-indexing/links-crawlable
- https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- https://yairlaw.co.il/
- https://www.bilaw.co.il/
- https://www.gn-law.co.il/
- https://www.mishpati.co.il/find-lawyer/medical-malpractice

## Live Technical Check

Googlebot-style fetch passed for the hub and sampled support URLs:

- `/medical-malpractice-lawyer/` - 200, indexable, self-canonical.
- `/cerebral-palsy/` - 200, indexable, self-canonical.
- `/what-is-medical-malpractice-definition-examples/` - 200, indexable, self-canonical.
- `/malpractice-cerebral-palsy/` - 200, indexable, self-canonical.
- `/medical-malpractice-common-errors-doctors-hospitals/` - 200, indexable, self-canonical.
- `/anesthesia-medical-malpractice/` - 200, indexable, self-canonical.

## Priority Link Targets

| Priority | Source URL | GSC evidence | Target hub | Anchor direction | Reason |
|---|---|---:|---|---|---|
| P0 | Hebrew slug: birth malpractice lawyer recommended | 27,275 impressions | `/medical-malpractice-lawyer/` | factual birth-malpractice lawyer help | Highest visible topic; remove or avoid "recommended" language before public edits. |
| P0 | Hebrew slug: leading medical malpractice lawyers worldwide | 19,549 impressions, 15 clicks | `/medical-malpractice-lawyer/` | medical-malpractice lawyer comparison | Trust-claim risk; convert into factual selection/checklist language. |
| P0 | `/medical-malpractice-in-the-united-states/` | 10,267 impressions, 18 clicks | `/medical-malpractice-lawyer/` | medical-malpractice claim guidance | Keep as jurisdictional/support content; do not let it outrank Israeli commercial hub. |
| P0 | Hebrew slug: reducing medical-malpractice claim costs | 9,670 impressions, 22 clicks | `/medical-malpractice-lawyer/` | medical-malpractice lawyer fees and claim costs | Strong commercial/pricing intent. |
| P0 | Hebrew slug: medical experts for court list | 8,191 impressions, 144 clicks | `/medical-malpractice-lawyer/` | medical expert opinion for malpractice claim | Very high clicks; likely useful pre-lead education. |
| P0 | `/cerebral-palsy/` | 7,104 impressions, 21 clicks | `/medical-malpractice-lawyer/` | cerebral palsy birth malpractice | High injury-specific intent; connect carefully without implying every case is malpractice. |
| P0 | `/what-is-medical-malpractice-definition-examples/` | 4,998 impressions | `/medical-malpractice-lawyer/` | what counts as medical malpractice | Needs merge review; good top-of-funnel explainer. |
| P0 | `/malpractice-cerebral-palsy/` | 4,887 impressions | `/medical-malpractice-lawyer/` | malpractice and cerebral palsy | Needs content review; overlap with cerebral palsy page. |
| P0 | Hebrew slug: birth malpractice cases and legal treatment | 4,882 impressions | `/medical-malpractice-lawyer/` | birth malpractice case review | Needs content review; likely support-to-hub candidate. |
| P0 | `/articles/medical-malpractice-examples/` Hebrew slug | 4,642 impressions, 5 clicks | `/medical-malpractice-lawyer/` | medical malpractice examples | Examples/case-law intent; should guide users to commercial evaluation. |
| P0 | `/medical-malpractice-common-errors-doctors-hospitals/` | 4,067 impressions | `/medical-malpractice-lawyer/` | hospital and doctor treatment mistakes | Needs content review; connects to diagnosis/treatment errors. |
| P0 | `/anesthesia-medical-malpractice/` | 3,296 impressions, 2 clicks | `/medical-malpractice-lawyer/` | anesthesia malpractice lawyer | Specific high-intent subtopic. |
| P0 | Hebrew slug: medical-malpractice lawyer fees | 2,985 impressions | `/medical-malpractice-lawyer/` | medical-malpractice lawyer fee | Pricing intent; should support conversion without promises. |
| P0 | Hebrew slug: plastic surgery malpractice lawyer | 2,309 impressions | `/medical-malpractice-lawyer/` | plastic surgery malpractice lawyer | Specific subpractice; remove "recommended" language before public edit. |
| P0 | Hebrew slug: hospital malpractice | 1,478 impressions | `/medical-malpractice-lawyer/` | hospital malpractice claim | Good support page if factual and source-backed. |

## Anchor Rules Before Public Editing

Use descriptive, varied anchors. Avoid fake or unsupported trust claims.

Allowed anchor patterns:

- `עורך דין רשלנות רפואית`
- `בדיקת תביעת רשלנות רפואית`
- `תביעת רשלנות רפואית בלידה`
- `רשלנות רפואית ושיתוק מוחין`
- `חוות דעת מומחה בתביעת רשלנות רפואית`
- `שכר טרחה בתביעת רשלנות רפואית`
- `רשלנות רפואית בהרדמה`

Avoid unless owner/legal approves exact substantiation:

- `מומלץ`
- `מובילים`
- `הטוב ביותר`
- `ייעוץ חינם`
- `הצלחה מובטחת`
- `פיצוי מקסימלי`

## Safe Implementation Sequence

1. Back up each live source page before any CMS edit.
2. Review whether the source page already links to `/medical-malpractice-lawyer/`.
3. Add one contextual link near the relevant discussion, not a repeated footer-style block.
4. Use one factual anchor variant per page.
5. Do not change slugs, canonicals, redirects, titles, H1s, taxonomies, or noindex directives in this pass.
6. Re-run Googlebot fetch checks for each edited source and for `/medical-malpractice-lawyer/`.
7. Watch GSC query/page mapping weekly; the hub should gain relevance for commercial terms while support pages retain informational queries.

## Owner Approval Needed Before Public Edit

- Confirm that `/medical-malpractice-lawyer/` is the commercial hub to strengthen.
- Confirm whether Jus-Tice currently has or wants lawyer supply for medical-malpractice leads.
- Confirm that trust-claim language should be rewritten to factual comparison/checklist language.

## Safety

No public CMS/database row, article body, title/H1/meta, URL slug, redirect, canonical, noindex, taxonomy, sitemap setting, lawyer profile, lead record, payment setting, GA4/GSC setting, wp-admin setting or uPress deployment was changed.
