# Lead Area Vocabulary Safety - 2026-05-22

Status: VERIFIED

Scope: repo-local static verification for public lead-area vocabulary, validation, classifier aliases, CRM labels, routing fallback, and public form rendering.

This check prevents public lead forms from drifting away from the accepted lead_area values used by lead validation, classifier normalization, CRM display, and lawyer routing.

## Results

| Check | Status | Risk | Evidence |
| --- | --- | --- | --- |
| LEAD-AREA-CANONICAL-OPTIONS | VERIFIED | CRITICAL | Canonical public lead-area option helper exists with all accepted commercial/legal area slugs. |
| LEAD-AREA-VALUES-DERIVED | VERIFIED | CRITICAL | Accepted public lead_area values are derived from canonical option keys. |
| LEAD-AREA-RENDERER | VERIFIED | HIGH | Shared select-option renderer loops over canonical lead-area options. |
| LEAD-AREA-ASK-FORM | VERIFIED | HIGH | Ask-lawyer form uses the shared lead-area renderer and has no hardcoded legal-area options. |
| LEAD-AREA-GLOBAL-FORM | VERIFIED | HIGH | Reusable lead form uses the shared lead-area renderer and has no hardcoded legal-area options. |
| LEAD-AREA-INCLUDE-ORDER | VERIFIED | HIGH | Lead spam guard loads before lead UI, CRM, classifier, and routing files. |
| LEAD-AREA-NORMALIZER-ALIASES | VERIFIED | CRITICAL | Legacy and shorthand lead_area aliases normalize into canonical routing slugs. |
| LEAD-AREA-LABELS | VERIFIED | HIGH | CRM/display label helper covers canonical public lead-area slugs. |
| LEAD-AREA-ROUTING-FALLBACK | VERIFIED | CRITICAL | Lead routing prefers AI-detected area, falls back to legal_area, and searches lawyers by area. |
| LEAD-AREA-CRM-FALLBACK | VERIFIED | HIGH | CRM display falls back through ai_detected_area, legal_area, lead_area and formats through the label helper. |
| LEAD-AREA-HOMEPAGE-INTENT | VERIFIED | MEDIUM | Homepage intent cards use canonical lead-area slugs in lawyer-directory links. |

## Upload Notes

- FIXED: public lead-area options now have one canonical renderer and one accepted-value source.
- VERIFIED: both lead forms call the shared renderer instead of owning separate legal-area option blocks.
- VERIFIED: legacy aliases still normalize into the canonical routing slugs before CRM/routing usage.
- NOT VERIFIED LIVE: submit a controlled lead after deployment and verify legal_area, ai_detected_area, CRM label, and assigned-lawyer routing.
- BLOCKED: no wp-admin, database, email, uPress, GSC, redirect plugin, or public production action was performed by this repo-local check.
