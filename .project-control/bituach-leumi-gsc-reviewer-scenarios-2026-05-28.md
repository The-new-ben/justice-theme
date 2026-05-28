# Bituach Leumi GSC Reviewer Scenarios - 2026-05-28

Status: BITUACH_LEUMI_GSC_REVIEWER_SCENARIOS_READY_NO_API_NO_LIVE_ACTION

Scope: local scenario coverage for `.project-control/scripts/review-bituach-leumi-gsc-owner-paste.ps1`. This does not call GSC APIs, publish CMS content, change titles/H1/meta/body, change links, change redirects/canonicals/noindex/sitemaps/taxonomies, create leads, contact lawyers/clients, invoice, charge payment, mark paid revenue, use paid LLM APIs or deploy uPress.

## Why This Exists

The Bituach Leumi route split now depends on owner-pasted GSC rows. The reviewer must reliably distinguish:

- supported intent split,
- meaningful query overlap,
- route/query bucket mismatch,
- blank owner template.

Without scenario checks, a future pasted CSV could produce a false "pass" or a false "hold" before public copy review.

## Scenario Coverage

| Scenario | Expected Status | Purpose |
| --- | --- | --- |
| `pass_intent_split` | `BITUACH_LEUMI_GSC_OWNER_PASTE_REVIEW_PASS_INTENT_SPLIT_NO_LIVE_ACTION` | Attorney route has lawyer-match rows and guide route has appeal-guide rows. |
| `hold_overlap` | `BITUACH_LEUMI_GSC_OWNER_PASTE_REVIEW_HOLD_OVERLAP_NO_LIVE_ACTION` | Both routes share a meaningful query, so public edits stay blocked. |
| `hold_bucket_mismatch` | `BITUACH_LEUMI_GSC_OWNER_PASTE_REVIEW_HOLD_BUCKET_MISMATCH_NO_LIVE_ACTION` | Route buckets are reversed or mismatched, so public edits stay blocked. |
| `blank_owner_template` | `BITUACH_LEUMI_GSC_OWNER_PASTE_REVIEW_BLOCKED_WAITING_OWNER_EXPORT_NO_LIVE_ACTION` | Current template is still empty and must remain blocked. |

## Validation Command

```powershell
& '.project-control\scripts\check-bituach-leumi-gsc-reviewer-scenarios.ps1'
```

Expected result:

- `BITUACH_LEUMI_GSC_REVIEWER_SCENARIOS_PASS_NO_API_NO_LIVE_ACTION`
- 4/4 scenarios pass.
- `gsc_api_calls=0`
- `public_changes=0`
- `revenue_proof=0`

## Current Completion Assessment

- Scenario checker: 100% prepared.
- GSC reviewer confidence: 78%, because core pass/hold/blocked branches are now covered.
- Actual GSC evidence: 0%, pending owner/admin paste.
- Public CMS edits: 0%, intentionally not performed.
- Proven revenue: 0%, still blocked by live private evidence and payment proof.
