# Live Legal-Help Conversion Surface Audit - 2026-05-26

Status: VERIFIED_LEGAL_HELP_SURFACES

Base URL: https://jus-tice.co.il

Scope: read-only live route QA for public visitor-facing legal-help pages. This checks customer-first surface signals, internal business-language leakage, detectable legal-help CTAs and associated/synonymous pages for future linkage review.

Safety: no login, CMS publish, database edit, URL change, redirect, canonical/noindex, sitemap, taxonomy, lead, lawyer, supplier, product, payment, invoice, email, WhatsApp, GSC, GA4, wp-admin or uPress action was performed.

## Page Results

| Path | Status | HTTP | Role | User Help Markers | CTA Links | Internal Markers | Issues |
| --- | --- | ---: | --- | ---: | ---: | --- | --- |
| / | VERIFIED | 200 | homepage | 14 | 104 | - | - |
| /lawyers/ | VERIFIED | 200 | lawyer-directory | 7 | 135 | - | - |
| /find-lawyer-how-to-find-good-attorney/ | VERIFIED | 200 | selection-guide | 7 | 39 | - | - |
| /national-insurance-attorney/ | VERIFIED | 200 | practice-lawyer-match | 9 | 36 | - | - |
| /bituach-leumi-appeal-guide/ | VERIFIED | 200 | guide-calculator | 9 | 36 | - | - |
| /criminal-defense-attorney/ | VERIFIED | 200 | practice-lawyer-match | 11 | 41 | - | - |
| /medical-malpractice-lawyer/ | VERIFIED | 200 | practice-lawyer-match | 7 | 36 | - | - |
| /real-estate-lawyer-guide/ | VERIFIED | 200 | guide-practice | 6 | 39 | - | - |

## Associated / Potentially Synonymous Pages

| Page | Role | Associated Pages | Recommended Linkage Review |
| --- | --- | --- | --- |
| / | homepage | /lawyers/ <br> /find-lawyer-how-to-find-good-attorney/ <br> /national-insurance-attorney/ | Keep intent split clear before new internal links or content expansions. |
| /lawyers/ | lawyer-directory | /find-lawyer-how-to-find-good-attorney/ <br> practice pages | Keep intent split clear before new internal links or content expansions. |
| /find-lawyer-how-to-find-good-attorney/ | selection-guide | /lawyers/ <br> homepage lawyer search | Keep intent split clear before new internal links or content expansions. |
| /national-insurance-attorney/ | practice-lawyer-match | /bituach-leumi-appeal-guide/ (split: lawyer-match vs guide/calculator) | Keep intent split clear before new internal links or content expansions. |
| /bituach-leumi-appeal-guide/ | guide-calculator | /national-insurance-attorney/ (split: guide/calculator vs lawyer-match) | Keep intent split clear before new internal links or content expansions. |
| /criminal-defense-attorney/ | practice-lawyer-match | /lawyers/ <br> criminal articles | Keep intent split clear before new internal links or content expansions. |
| /medical-malpractice-lawyer/ | practice-lawyer-match | /lawyers/ <br> medical malpractice articles | Keep intent split clear before new internal links or content expansions. |
| /real-estate-lawyer-guide/ | guide-practice | /lawyers/ <br> real-estate attorney pages <br> purchase-tax/seller-tax tools if approved | Keep intent split clear before new internal links or content expansions. |

## Interpretation

- No internal revenue/business-plan markers were found in the sampled public surfaces.
- Every sampled route returned the expected path, had title/H1 signals, contained legal-help language and exposed detectable user CTAs.
- The Bituach Leumi pair should remain split by intent: `/national-insurance-attorney/` for lawyer matching and `/bituach-leumi-appeal-guide/` for guide/calculator intent unless owner/SEO approves a different strategy.
