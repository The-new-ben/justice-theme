# Bituach Leumi GSC Owner Paste Gate - 2026-05-28

Status: BITUACH_LEUMI_GSC_OWNER_PASTE_GATE_READY_NO_API_NO_PUBLIC_CHANGE

Scope: no-API Search Console evidence gate for the two existing Bituach Leumi routes. This prepares the owner/admin to paste non-private GSC query metrics before any public metadata/body/internal-link decision. It does not call GSC APIs, publish CMS content, change titles/H1/meta/body, change internal links, change redirects/canonicals/noindex/sitemaps/taxonomies, create leads, contact lawyers/clients, invoice, charge payment, mark paid revenue, use paid LLM APIs or deploy uPress.

Related artifacts:

- `.project-control/bituach-leumi-content-revenue-packet-2026-05-28.md`
- `.project-control/bituach-leumi-owner-copy-approval-rows-2026-05-28.md`
- `.project-control/bituach-leumi-route-intent-review-2026-05-26.md`

## Why This Exists

The two live routes have a documented cannibalization risk:

- `/national-insurance-attorney/` should own lawyer-match intent.
- `/bituach-leumi-appeal-guide/` should own guide/checklist/calculator intent.

Before any public CMS copy or metadata edit, the owner needs real Search Console query evidence. This template converts the blocker into a clean owner/admin action without giving Codex GSC access and without using an API.

## Owner Export Instructions

For each route, open Google Search Console > Performance > Search results:

1. Set date range to the last 3 months and export Queries for the exact page URL.
2. Repeat with the last 16 months if the page has low data.
3. Filter page exactly:
   - `https://jus-tice.co.il/national-insurance-attorney/`
   - `https://jus-tice.co.il/bituach-leumi-appeal-guide/`
4. Copy the top 10-20 queries per URL into `.project-control/bituach-leumi-gsc-owner-paste-template-2026-05-28.csv`.
5. Do not paste user names, emails, phone numbers, CRM notes, lawyer names, client notes or screenshots with private account data.

Required columns:

- `route`
- `date_range`
- `query`
- `clicks`
- `impressions`
- `ctr`
- `position`
- `intent_bucket`
- `owner_note`

Allowed intent buckets:

- `lawyer_match`
- `appeal_guide`
- `mixed`
- `irrelevant`
- `unknown`

## Decision Rules

| Rule | Evidence | Decision |
| --- | --- | --- |
| GSC-01 | `/national-insurance-attorney/` mostly receives lawyer/representative queries. | Keep route as lawyer-match page and proceed to owner/legal copy review. |
| GSC-02 | `/bituach-leumi-appeal-guide/` mostly receives appeal/how/process/document queries. | Keep route as guide/checklist page and proceed to owner/legal copy review. |
| GSC-03 | Both routes share the same top queries with meaningful clicks or impressions. | Hold public edits; refine intent split, internal links and title/H1 rows before CMS action. |
| GSC-04 | Guide route receives most lawyer-match queries. | Strengthen cross-link to attorney route and review metadata before any body rewrite. |
| GSC-05 | Attorney route receives mostly guide queries. | Keep commercial CTA but adjust title/H1/opening away from generic appeal-guide wording. |
| GSC-06 | One or both routes have low/no data. | Use SERP/manual review plus official-source quality; do not make technical SEO changes from weak GSC evidence alone. |

## Query Classification Guide

Lawyer-match examples:

- עורך דין ביטוח לאומי
- עורך דין ערעור ביטוח לאומי
- עורך דין ועדה רפואית
- עורך דין נכות כללית
- ייצוג ביטוח לאומי

Appeal-guide examples:

- ערעור ביטוח לאומי
- איך מערערים על ביטוח לאומי
- ערעור ועדה רפואית
- טופס ערעור ביטוח לאומי
- כמה זמן יש לערער על ביטוח לאומי

Mixed examples:

- ביטוח לאומי נכות
- נכות כללית ביטוח לאומי
- ועדה רפואית ביטוח לאומי

Irrelevant examples:

- Queries about unrelated benefits, unrelated cities, unrelated lawyers, or terms that do not match current page scope.

## After Owner Paste

When the filled CSV exists:

1. Review top-query overlap between both routes.
2. Count intent buckets per route.
3. Compare evidence against the proposed copy rows.
4. Produce a pass/hold recommendation.
5. Keep all public work blocked until owner/legal approval remains explicit.

## Current Completion Assessment

- GSC owner paste gate: 100% prepared.
- Actual GSC evidence pasted: 0%, pending owner/admin export.
- Public CMS edits: 0%, intentionally not performed.
- SEO-control changes: 0%, intentionally not performed.
- Revenue proof: 0%, still blocked by verified specialists, consented controlled lead, invoice/reference and private payment evidence.
- Readiness to make a data-backed BTL copy decision: 58% now, because the structure exists but GSC rows are still blank.
