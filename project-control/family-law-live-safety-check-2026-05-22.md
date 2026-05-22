# Family Law Live Safety Check - 2026-05-22

## Status

- VERIFIED LIVE READ-ONLY: this checker fetches public URLs only.
- VERIFIED ROWS: 0/11.
- BLOCKED / REVIEW ROWS: 11/11.
- CRITICAL BLOCKERS: 8.
- SAFETY: no CMS write, redirect, canonical/noindex, sitemap, taxonomy, media, CRM, wp-admin or uPress action was made.

## Blockers

- FAM-LIVE-PILLAR-LONG / CRITICAL: h1_count_3 | Review and repair before Family upload is marked live-safe.
- FAM-LIVE-PILLAR-CLEAN / CRITICAL: h1_count_2 | Review and repair before Family upload is marked live-safe.
- FAM-LIVE-AGREEMENT / CRITICAL: h1_count_2;raw_shortcodes_justice_pdf_download|justice_contact_form | Review and repair before Family upload is marked live-safe.
- FAM-LIVE-CHILD-SUPPORT / MEDIUM: h1_count_3 | Review and repair before Family upload is marked live-safe.
- FAM-LIVE-CHILD-CUSTODY / MEDIUM: h1_count_2 | Review and repair before Family upload is marked live-safe.
- FAM-LIVE-MEDIATION / MEDIUM: h1_count_3 | Review and repair before Family upload is marked live-safe.
- FAM-LIVE-PDF-1 / CRITICAL: http_404 | Upload/verify the PDF asset or remove the public PDF promise.
- FAM-LIVE-PDF-2 / CRITICAL: http_404 | Upload/verify the PDF asset or remove the public PDF promise.
- FAM-LIVE-PDF-3 / CRITICAL: http_404 | Upload/verify the PDF asset or remove the public PDF promise.
- FAM-LIVE-CANONICAL-CONFLICT / CRITICAL: indexable_self_canonical_pillar_count_2 | Run focused GSC export and owner URL decision before any redirect/canonical/noindex action.
- FAM-LIVE-PDF-ASSET-GATE / CRITICAL: no_working_pdf_candidate_found | Upload/verify PDF or remove PDF CTA before final upload.

## Next

1. Owner decides the divorce-lawyer canonical URL only after focused GSC export.
2. Repair `/divorce-agreement/` raw shortcode rendering and PDF asset before treating the page as final.
3. Rerun this checker after any approved public repair.

