# Justice 410 release gates

Updated: 2026-08-27

## Purpose

This workflow prevents an analytical 410 candidate from being mistaken for an
approved production deletion. It is deliberately stricter than a traffic-only
rule because Search Console cannot prove that a URL has no leads, revenue,
server-log demand, complete backlink equity, or unique legal information.

The unit of decision is one canonical public URL on the exact property
`https://jus-tice.co.il/`. The reviewed Search Console window is 2025-04-25
through 2026-08-23 (`final` data). Partial dates remain excluded.

## Source boundary

The analysis reads these files from the current external run directory under
`%USERPROFILE%\Documents\GSC-Data\jus-tice.co.il\...\analysis\`:

- `justice-410-candidates.csv`;
- `justice-page-migration-inventory.csv`;
- `justice-live-url-status.csv`;
- sampled GSC internal/external link targets;
- enriched page-pair evidence.

Raw GSC data, the property registry, OAuth files, tokens, workbooks and the
generated action matrix stay outside the repository. Never copy them into a
commit, ZIP or report payload.

## Current audit snapshot

The read-only refresh completed at `2026-08-27T03:45:58Z` and checked all
3,401 known public URLs with zero request errors. At the original-URL level it
found 1,976 HTTP 200 responses, 1,158 HTTP 301 responses, 11 HTTP 404
responses and 256 HTTP 410 responses. Following redirects produced 3,071
final HTTP 200 destinations, 74 final HTTP 404 destinations and 256 final HTTP
410 destinations; 54 redirect paths remain multi-hop debt.

The 75 analytical removal candidates are unique, all joined to both the live
audit and migration inventory, and all currently resolve directly to HTTP 200.
The release-gated decision matrix now contains:

- 18 `HOLD_PROTECTED_URL_REVIEW` rows;
- 56 `CANDIDATE_DELETE_410` rows;
- one `CANDIDATE_MERGE_UNIQUE_CONTENT_THEN_410` row;
- 19 rows with at least one failed inspectable data gate;
- zero `READY_FOR_EXPLICIT_RELEASE_APPROVAL` rows.

The highest-risk conflict is
`https://jus-tice.co.il/sex-offenses-process-criminal-law-account/`: it has two
full-range clicks, 216 impressions, a public inlink and a `KEEP_PROTECT`
signal, so the previous merge-and-retire recommendation is blocked. Other
examples that must not enter a batch deletion are
`https://jus-tice.co.il/non-compete-agreement-israel/` and
`https://jus-tice.co.il/sexual-offense-defense/`, both protected in the
migration inventory. `KEEP_REFRESH` is also treated as a blocking signal until
the conflict is resolved, rather than being silently overridden by the thin
page detector.

## Decision vocabulary

- `HOLD_PROTECTED_URL_REVIEW` — another authoritative analysis says keep or
  protect the URL. This conflict blocks release even if a duplicate detector
  nominated it.
- `HOLD_REBUILD_OR_RETIRE_AFTER_30D_TEST` — current/recent demand or a distinct
  topic requires a defined improvement test before retirement.
- `CANDIDATE_MERGE_UNIQUE_CONTENT_THEN_410` — an owner page exists, but unique
  legal information must be captured and verified before removal.
- `CANDIDATE_DELETE_410` — the current search/content evidence supports a 410
  hypothesis, not a live instruction.
- `execution_readiness=NOT_RELEASE_READY` — at least one mandatory evidence or
  approval gate is unresolved. This is the only readiness emitted by the
  current read-only workflow.

## Gates

The matrix records inspectable data gates for current HTTP 200 status, zero
full-range clicks, zero recent clicks, sampled GSC link evidence, public REST
inlinks and protection signals. A failing data gate blocks release.

The following external gates remain unresolved until evidence is supplied by
the relevant system or a documented human review:

1. CRM and lead-history check;
2. server-log demand check;
3. complete backlink audit beyond sampled GSC Links;
4. unique legal-information review or content capture;
5. recoverable backup;
6. sitemap and internal-link release plan;
7. separate, explicit production approval.

Removal from the sitemap and replacement of internal links must be part of the
same approved release. After deployment, verify the exact URL returns a real
410 without a redirect, soft-404 body, loop, or 200 fallback. Record the deploy
commit, timestamp and verification result.

## Rebuild the read-only matrix

```powershell
node tools/gsc/gsc-justice-live-url-audit.js `
  --run-dir="$env:USERPROFILE\Documents\GSC-Data\jus-tice.co.il\2025-04-25_2026-08-25"

node tools/gsc/gsc-justice-final-actions.js `
  --run-dir="$env:USERPROFILE\Documents\GSC-Data\jus-tice.co.il\2025-04-25_2026-08-25"

node --test tools/gsc/gsc-justice-final-actions.test.js
```

The first two commands refresh external analysis files only. They do not
change WordPress, Search Console, redirects, canonicals, robots, sitemaps or
public content.

## Release rule

Never infer approval from a high-confidence candidate label, zero clicks, a
thin word count, a missing sampled backlink, or a previous conversational
approval. A production 410 requires a separate explicit instruction naming the
approved release scope after the gate evidence has been reviewed.
