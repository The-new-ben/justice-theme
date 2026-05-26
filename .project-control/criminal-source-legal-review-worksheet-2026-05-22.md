# Criminal Source / Legal Review Worksheet - 2026-05-22

## Status
- VERIFIED PLANNING: this worksheet converts the Criminal first-upload draft and metadata set into page-level owner/legal/source review rows.
- REVIEW ONLY: this is an approval surface, not publication approval.
- PUBLIC EXECUTION BLOCKED: no CMS upload, page body edit, title/H1/meta edit, URL slug migration, redirect, canonical/noindex change, sitemap change, taxonomy edit, related-card/internal-link write, lawyer-card change, schema expansion, lead/CRM change, wp-admin setting or uPress deployment is approved by this file.
- UPLOAD APPROVAL: `0/6` rows are approved for upload.

## Batch Completed
- Cluster: `criminal-law`.
- First-upload pages reviewed: `5`.
- Cluster-wide safety gate rows: `1`.
- Worksheet rows created: `6`.
- Inputs used:
  - `project-control/criminal-first-upload-metadata-package-2026-05-22.csv`
  - `project-control/criminal-owner-review-packet-2026-05-22.csv`
  - `project-control/criminal-law-source-legal-checklist-2026-05-11.md`
  - `project-control/criminal-law-source-legal-checklist-2026-05-11.csv`
  - five tracked Criminal content drafts in `content-drafts/`
- Scope: first upload-review package only. Wider Criminal/Traffic support pages, protected pages and route migration remain separate decisions.

## Source Anchor Map
VERIFIED SOURCE ANCHORS already recorded in the Criminal source/legal checklist:
- Knesset Criminal Procedure Law source anchor.
- Knesset Criminal Procedure amendment source around suspect notice / hearing context.
- Public Defender representation service.
- Public Defender suspect-investigation position PDF.
- Israeli Courts research PDF on criminal detentions.
- State Comptroller criminal-detention report page.
- State Comptroller criminal-file closure report page.
- Knesset Dangerous Drugs Ordinance source anchor.
- Israel Police / gov.il cannabis fine cancellation service.

Additional source anchors recorded in the 2026-05-22 draft closure:
- State Attorney conditional-arrangement page.
- Israel Police cannabis fine cancellation / request-trial service.
- Public Defender representation service.
- State Attorney prosecution guidance page.

NOT VERIFIED FOR PUBLICATION:
- Currentness of every procedure, threshold, deadline, eligibility rule, penalty reference or public-defense condition.
- Exact rights wording for investigation, detention, hearing, indictment or drug-offense contexts.
- Any statement that a specific strategy will close a case, avoid indictment or secure release.
- Any penalty range, probability, "best lawyer", "recommended lawyer", rating, review or success claim.
- Current GSC traffic risk for URL migration, redirect, canonical/noindex or sitemap decisions.

## Review Rows

| Review ID | Page / Scope | Risk | Allowed after review | Blocked before review | Upload status |
|---|---|---|---|---|---|
| CRIM-SRC-REVIEW-001 | `/criminal-defense-attorney/` | HIGH | General criminal-process overview, cautious lawyer-consultation framing, document checklist, support-page navigation. | Best/top/recommended lawyer claims, guarantees, specific strategy advice, penalty ranges, fake trust signals, clean `/criminal-lawyer/` migration. | NOT_APPROVED_FOR_UPLOAD |
| CRIM-SRC-REVIEW-002 | Police investigation current Hebrew URL | HIGH | Rights-aware preparation, status distinctions, documents to preserve, cautious consultation language. | Scripts for interrogation answers, concealment/obstruction advice, guarantees about silence/cooperation, exact rights wording without review. | NOT_APPROVED_FOR_UPLOAD |
| CRIM-SRC-REVIEW-003 | `/detention-before-charge-or-trial/` | VERY_HIGH | General detention-stage explanation, family/document checklist, urgent-consultation framing. | Exact time limits, release-condition promises, court strategy advice, blind merge with `/detention-days/`, clean `/pretrial-detention/` migration. | NOT_APPROVED_FOR_UPLOAD |
| CRIM-SRC-REVIEW-004 | `/articles/%D7%9E%D7%97%D7%99%D7%A7%D7%AA-%D7%9B%D7%AA%D7%91-%D7%90%D7%99%D7%A9%D7%95%D7%9D-%D7%97%D7%96%D7%A8%D7%94-%D7%9E%D7%9B%D7%AA%D7%91-%D7%90%D7%99%D7%A9%D7%95%D7%9D-%D7%91%D7%99%D7%98%D7%95%D7%9C/` | HIGH | General indictment / hearing / investigation-material overview, document checklist, cautious cancellation/conditional-arrangement framing. | Promising cancellation or withdrawal, exact hearing/deadline claims without review, treating case-specific indictment pages as general guides, clean `/indictment/` migration. | NOT_APPROVED_FOR_UPLOAD |
| CRIM-SRC-REVIEW-005 | `/drug-offenses-criminal-lawyer/` | VERY_HIGH | General offense-category explanation, cannabis-fine limits as a specific workflow, investigation and document preparation. | Penalty thresholds without review, implying every cannabis/drug case is only a fine, obstruction advice, traffic drug-driving merge, duplicate `/drug-offenses/` page. | NOT_APPROVED_FOR_UPLOAD |
| CRIM-SRC-REVIEW-006 | Cluster-wide disclaimer / lead / schema gate | VERY_HIGH | Clear informational disclaimer, current-url internal links, conservative WebPage/Article/Breadcrumb schema after approval. | Legal-advice framing, emergency guaranteed-response claims, fake Review/AggregateRating schema, public lawyer-card claims, collecting sensitive facts without safe intake review. | NOT_APPROVED_FOR_UPLOAD |

## Minimum Page-Level Gate
Before any row can become `APPROVE_CURRENT_URL_UPDATE`, it must have:
1. Owner decision for the page role: approve current URL, edit required, hold, or legal/source review required.
2. Legal/source review of factual and legal claims.
3. Current URL confirmation and WordPress rollback evidence for the exact CMS record.
4. Focused GSC export review before any URL migration, redirect, canonical/noindex or sitemap decision.
5. Current-URL-only execution plan; no clean slug, redirect, canonical/noindex, sitemap or taxonomy action in this phase.
6. Conservative schema and disclaimer check; no fake ratings, reviews, guarantees, or unsupported lawyer availability.
7. Post-update QA plan for HTTP status, final path, title, H1, canonical, robots, body text, internal links and desktop/mobile rendering.

## Ready
- VERIFIED: five Criminal first-upload drafts exist.
- VERIFIED: five metadata rows exist for title, H1, meta, OG, breadcrumb, taxonomy, internal links, schema and robots policy.
- VERIFIED: this worksheet isolates allowed claims, blocked claims, risk level, review gate and upload status per row.
- READY FOR OWNER/LEGAL REVIEW: the owner can mark each row approve, edit, hold or legal/source review required without changing the public site.

## Blocked
- BLOCKED: owner/legal/source approval for all rows.
- BLOCKED: focused Criminal GSC export before URL migration, redirect, canonical, noindex and sitemap decisions.
- BLOCKED: actual WordPress editor/database rollback backup before CMS execution.
- BLOCKED: public visual QA until approved CMS updates exist.

## Safety
No public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, media asset, lawyer, lead, CRM, payment, GA4/GSC API call, wp-admin setting or uPress deployment was changed.
