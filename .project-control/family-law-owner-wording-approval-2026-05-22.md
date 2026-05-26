# Family Law Owner Wording Approval Packet - 2026-05-22

Status: FIXED PLANNING / VERIFIED LOCAL / OWNER DECISION PENDING / PUBLIC EXECUTION BLOCKED / NO PUBLIC CHANGES

This packet converts the Family/Divorce draft enhancement readiness gate into explicit owner wording decisions. It is narrower than a content upload approval. Approval here can authorize drafting work inside existing repo draft files only. It does not approve public CMS edits, URL changes, redirects, canonical changes, noindex changes, sitemap changes, taxonomy changes, media or PDF changes, lawyer-card changes, lead or CRM changes, GSC/GA4 changes, wp-admin setting changes or uPress deployment.

## Inputs Reviewed

- `project-control/family-law-draft-enhancement-queue-2026-05-22.csv`
- `project-control/family-law-draft-enhancement-readiness-2026-05-22.md`
- `project-control/family-law-draft-enhancement-readiness-2026-05-22.csv`
- `project-control/family-law-competitor-gap-analysis-2026-05-22.csv`
- `reports/family-divorce-public-body-static-qa-2026-05-21.csv`
- `project-control/lead-area-vocabulary-safety-2026-05-22.csv`
- `project-control/maya-lawyer-mini-site-readiness-2026-05-22.csv`

## Owner Decision Summary

Recommended safe decision for the next manual step:

- `APPROVE_CONSERVATIVE_COST_MODULE_OR_EDIT_WORDING_OR_HOLD` for `/divorce-lawyer/`.
- `APPROVE_PROCESS_PATH_MODULE_OR_EDIT_WORDING_OR_HOLD` for `/divorce-lawyer/` and `/family-dispute-resolution/`.
- `APPROVE_DOCUMENT_CHECKLIST_MODULE_OR_EDIT_WORDING_OR_HOLD` for `/divorce-lawyer/`, `/divorce-property-division/`, `/child-support/` and `/child-custody/`.
- `APPROVE_MEDIATION_RISK_MODULE_OR_EDIT_WORDING_OR_HOLD` for `/divorce-mediation/`.
- `APPROVE_CHILDREN_DECISION_TABLES_OR_EDIT_WORDING_OR_HOLD` for `/child-support/` and `/child-custody/`.
- Keep agreement/PDF, CTA/lawyer matching, Maya fact language and GSC/canonical decisions blocked until their separate live QA dependencies are satisfied.

If there is any legal/source concern in a module, use `LEGAL_SOURCE_REVIEW_REQUIRED` for that module and keep it out of the draft edit batch.

## Approve Now Only If These Conditions Are True

- Owner explicitly approves or edits wording direction for the five ready modules.
- Edits stay inside existing repo draft files listed in the CSV.
- Drafts keep conservative legal language with no outcome, timeline, cost, calculator or consultation guarantees.
- Agreement/template/PDF promises remain blocked until the live PDF and shortcode defects are repaired or the promise is removed.
- CTA/lawyer matching language remains blocked until lead routing and Maya route/schema QA pass.
- No public CMS, URL, redirect, canonical, noindex, sitemap, taxonomy, media, lawyer-card, lead, CRM, GSC/GA4, wp-admin or uPress action happens from this approval.
- After any approved draft edit, `tools/check-family-divorce-public-bodies.mjs` is rerun before upload readiness is updated.

## Decisions To Record

| Approval ID | Queue IDs | Target | Recommended owner decision | Allowed if approved | Must remain blocked |
|---|---|---|---|---|---|
| FLW-APPROVAL-001 | `FL-DRAFT-ENH-001` | `/divorce-lawyer/` | `APPROVE_CONSERVATIVE_COST_MODULE_OR_EDIT_WORDING_OR_HOLD` | Draft conservative cost-framing module after approval | Exact fee promises, guaranteed prices, free consultation claims and public CMS edits |
| FLW-APPROVAL-002 | `FL-DRAFT-ENH-002` | `/divorce-lawyer/`; `/family-dispute-resolution/` | `APPROVE_PROCESS_PATH_MODULE_OR_EDIT_WORDING_OR_HOLD` | Draft process-path module after approval | Outcome guarantees, timeline guarantees and public CMS edits |
| FLW-APPROVAL-003 | `FL-DRAFT-ENH-003` | `/divorce-lawyer/`; `/divorce-property-division/`; `/child-support/`; `/child-custody/` | `APPROVE_DOCUMENT_CHECKLIST_MODULE_OR_EDIT_WORDING_OR_HOLD` | Draft document checklist after approval | Any promise that documents are sufficient or that review results are known |
| FLW-APPROVAL-004 | `FL-DRAFT-ENH-005` | `/divorce-mediation/` | `APPROVE_MEDIATION_RISK_MODULE_OR_EDIT_WORDING_OR_HOLD` | Draft good-fit and unsafe-case decision block after approval | Language minimizing violence, coercion, asset concealment or child-risk exceptions |
| FLW-APPROVAL-005 | `FL-DRAFT-ENH-006` | `/child-support/`; `/child-custody/` | `APPROVE_CHILDREN_DECISION_TABLES_OR_EDIT_WORDING_OR_HOLD` | Draft parent decision tables after approval | Calculator claims, exact support predictions and custody outcome promises |
| FLW-APPROVAL-006 | `FL-DRAFT-ENH-004` | `/consensual-divorce/`; `/divorce-agreement/` | `HOLD_PENDING_LIVE_QA_AND_PDF_ASSET` | Planning only | PDF/template promises, shortcode repair and agreement page publication |
| FLW-APPROVAL-007 | `FL-DRAFT-ENH-007` | Seven first-cluster URLs | `HOLD_PENDING_LEAD_AND_MAYA_ROUTE_QA` | Planning only | Lawyer matching CTA, lead-routing claims, immediate response claims and lawyer-card changes |
| FLW-APPROVAL-008 | `FL-DRAFT-ENH-009` | `/divorce-lawyer/`; lawyer-card sections | `HOLD_PENDING_MAYA_FACT_QA` | Planning only | Awards, rankings, reviews, unverified credentials and lawyer profile claims |
| FLW-APPROVAL-009 | `FL-DRAFT-ENH-010`; `FL-DRAFT-ENH-011` | Cluster structure and affected live Family/Divorce URLs | `HOLD_PENDING_GSC_AND_CMS_ROLLBACK` | Read-only review only | Redirects, canonical/noindex decisions, sitemap changes, taxonomy changes and live repair |

## Exact Approval Language

Use this text if approving the five ready draft modules:

`I approve repo draft wording work only for the Family/Divorce cost, process, document checklist, mediation risk and children decision-table modules listed in the May 22 owner wording packet. This approval does not authorize public CMS edits, URL changes, redirects, canonical changes, noindex changes, sitemap changes, taxonomy changes, PDF/media changes, lawyer-card changes, lead/CRM changes, GSC/GA4 changes, wp-admin setting changes or uPress deployment. Agreement/PDF, CTA/lawyer matching, Maya fact language and GSC/canonical decisions remain blocked.`

Use this text if holding:

`Hold Family/Divorce wording work. Continue repo-only planning and do not edit draft body copy or WordPress production content.`

## Still Blocked After This Approval

- Public CMS upload or repair.
- Agreement/template/PDF language until PDF/media and live shortcode state are resolved.
- Lawyer matching CTA until lead QA and Maya route/schema QA pass.
- Maya fact language until public profile facts are verified.
- Canonical/noindex/redirect/sitemap/taxonomy decisions until focused GSC export and owner approval exist.
- Category hierarchy changes.
- Related-card and internal-link writes.
- Full upload readiness until draft edits pass static QA and live visible repairs are verified.

## Verification Required After Approved Draft Edits

- Draft edits are limited to the exact existing files in `project-control/family-law-owner-wording-approval-2026-05-22.csv`.
- `tools/check-family-divorce-public-bodies.mjs` is rerun and project-control docs are updated.
- No blocked module is silently included in the edit batch.
- Project-control docs use `VERIFIED`, `FIXED`, `BLOCKED` or `NOT VERIFIED` labels.

## Safety

No public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, media/PDF asset, lawyer card, lead, CRM, payment, GA4/GSC setting, wp-admin setting or uPress deployment was changed.
