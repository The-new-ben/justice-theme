# Bituach Leumi GSC Owner Paste Review - 2026-05-28

Status: BITUACH_LEUMI_GSC_OWNER_PASTE_REVIEW_BLOCKED_WAITING_OWNER_EXPORT_NO_LIVE_ACTION

Scope: local review of the owner-paste Search Console template for the two Bituach Leumi routes. This review does not call GSC APIs, publish CMS content, change titles/H1/meta/body, change internal links, change redirects/canonicals/noindex/sitemaps/taxonomies, create leads, contact lawyers/clients, invoice, charge payment, mark paid revenue, use paid LLM APIs or deploy uPress.

Input template: `.project-control/bituach-leumi-gsc-owner-paste-template-2026-05-28.csv`

Reviewer script: `.project-control/scripts/review-bituach-leumi-gsc-owner-paste.ps1`

## Current Result

The template exists and is structurally valid, but it still contains only placeholder query rows. The Bituach Leumi copy decision remains blocked until owner/admin pastes real non-private Google Search Console query rows for:

- `/national-insurance-attorney/`
- `/bituach-leumi-appeal-guide/`

## Review Counts

| Metric | Value |
| --- | ---: |
| Template rows | 16 |
| Required routes | 2 |
| Rows per route | 8 |
| Filled query rows | 0 |
| GSC API calls | 0 |
| Public CMS changes | 0 |
| SEO-control changes | 0 |
| Revenue proof | 0 |

## Decision State

| Gate | Status | Reason | Next Action |
| --- | --- | --- | --- |
| GSC evidence available | BLOCKED | The CSV still contains placeholder `PASTE_QUERY_*` rows. | Owner/admin exports and pastes non-private query rows from Search Console. |
| Route split review | BLOCKED | No real query buckets can be evaluated yet. | Run the reviewer after paste. |
| Public metadata/body/link edit | BLOCKED | Owner/GSC/legal approval is incomplete. | Do not edit CMS. |
| Revenue readiness | BLOCKED | No verified specialists, consented controlled lead, invoice/reference or private payment evidence was added. | Continue private BTL proof path separately. |

## How To Use After Paste

Run:

```powershell
& '.project-control\scripts\review-bituach-leumi-gsc-owner-paste.ps1'
```

Possible statuses:

- `BITUACH_LEUMI_GSC_OWNER_PASTE_REVIEW_BLOCKED_WAITING_OWNER_EXPORT_NO_LIVE_ACTION`
- `BITUACH_LEUMI_GSC_OWNER_PASTE_REVIEW_HOLD_OVERLAP_NO_LIVE_ACTION`
- `BITUACH_LEUMI_GSC_OWNER_PASTE_REVIEW_HOLD_BUCKET_MISMATCH_NO_LIVE_ACTION`
- `BITUACH_LEUMI_GSC_OWNER_PASTE_REVIEW_PASS_INTENT_SPLIT_NO_LIVE_ACTION`

Even a pass does not authorize public publication. It only means the pasted GSC rows support the route split enough for owner/legal review.

## Completion Assessment

- GSC paste reviewer: 100% prepared.
- Actual GSC evidence: 0%, pending owner/admin paste.
- Data-backed Bituach Leumi public copy decision: 60%, because the review mechanism exists but evidence is still blank.
- Public CMS publication: 0%, intentionally not performed.
- Proven revenue: 0%, still blocked by live private evidence and payment proof.
