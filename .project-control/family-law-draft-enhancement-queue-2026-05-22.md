# Family Law Draft Enhancement Queue - 2026-05-22

Status: FIXED PLANNING / VERIFIED LOCAL / OWNER WORDING REQUIRED / PUBLIC EXECUTION BLOCKED / NO PUBLIC CHANGES

This packet converts the Family Law competitor gap analysis into a draft-by-draft enhancement queue for the first controlled Family/Divorce upload cluster. It is an owner/operator planning artifact only. It does not approve publishing, live CMS edits, redirects, canonicals, noindex changes, sitemap changes, taxonomy changes, lawyer-card changes, media/PDF changes, lead/CRM changes, wp-admin actions or uPress deployment.

## Inputs Reviewed

- `project-control/family-law-competitor-gap-analysis-2026-05-22.md`
- `project-control/family-law-competitor-gap-analysis-2026-05-22.csv`
- `reports/family-divorce-public-body-static-qa-2026-05-21.csv`
- `reports/family-law-live-safety-check-2026-05-22.csv`
- `project-control/family-law-visible-repair-field-map-2026-05-22.md`
- `project-control/family-law-live-repair-readiness-gate-2026-05-22.md`
- Existing draft files under `content-drafts/`

## Execution Boundary

Allowed next repo task:
- Edit the seven existing `content-drafts/*-public-body-he.md` files only after owner-approved wording is supplied for cost, process, document checklist, agreement/template policy and CTA language.
- Rerun local static QA before any owner upload review.

Still blocked:
- Public CMS upload or repair.
- URL, redirect, canonical, noindex, sitemap or taxonomy decisions.
- Live lawyer card or Maya Rotenberg CTA expansion before profile route/schema/facts are verified.
- PDF/template promise before the actual asset and legal wording are approved.
- Review/rating/award/ranking claims unless independently verified and approved.

## Queue Summary

| Queue ID | Priority | Target URL | Target draft/source | Enhancement scope | Status |
|---|---|---|---|---|---|
| FL-DRAFT-ENH-001 | CRITICAL | `/divorce-lawyer/` | `content-drafts/divorce-lawyer-public-body-he.md` | Cost module: fee types, cost drivers, external expenses, first-meeting questions | FIXED PLANNING / BLOCKED OWNER WORDING |
| FL-DRAFT-ENH-002 | CRITICAL | `/divorce-lawyer/` and `/family-dispute-resolution/` | two public-body drafts | Process module: consultation, conflict-settlement request, agreement, mediation, litigation, urgent motions, approval/enforcement | FIXED PLANNING / READY FOR DRAFT EDIT AFTER OWNER WORDING |
| FL-DRAFT-ENH-003 | HIGH | `/divorce-lawyer/`, `/divorce-property-division/`, `/child-support/`, `/child-custody/` | four public-body drafts | Document checklist module: assets, debts, children, income, prior agreements, urgent-risk documents | FIXED PLANNING / READY FOR DRAFT EDIT AFTER OWNER WORDING |
| FL-DRAFT-ENH-004 | CRITICAL | `/consensual-divorce/` and `/divorce-agreement/` | `content-drafts/consensual-divorce-public-body-he.md` plus live repair packet | Agreement/template policy: clauses, approval, enforcement, change/cancellation risk, PDF caution | BLOCKED LIVE QA / BLOCKED PDF ASSET |
| FL-DRAFT-ENH-005 | HIGH | `/divorce-mediation/` | `content-drafts/divorce-mediation-public-body-he.md` | Mediation decision block: good-fit cases, unsafe cases, when to move to court route | FIXED PLANNING / READY FOR DRAFT EDIT AFTER OWNER WORDING |
| FL-DRAFT-ENH-006 | HIGH | `/child-support/` and `/child-custody/` | two public-body drafts | Parent decision tables: child support factors, custody/time-arrangement risks, urgent practical questions | FIXED PLANNING / READY FOR DRAFT EDIT AFTER OWNER WORDING |
| FL-DRAFT-ENH-007 | HIGH | all seven first-cluster URLs | all seven public-body drafts | Restrained CTA module: lawyer matching, urgent-risk warning, consultation prep checklist | BLOCKED LEAD QA / BLOCKED LAWYER ROUTE QA |
| FL-DRAFT-ENH-008 | MEDIUM | all seven first-cluster URLs | all seven public-body drafts | FAQ retention and post-upload FAQPage schema verification | BLOCKED POST UPLOAD LIVE QA |
| FL-DRAFT-ENH-009 | HIGH | `/divorce-lawyer/` and later lawyer-card sections | Maya mini-site readiness packet plus relevant public-body drafts | E-E-A-T and lawyer connection: use verified facts only; no unapproved rankings/reviews | BLOCKED MAYA LIVE QA |
| FL-DRAFT-ENH-010 | MEDIUM | all seven first-cluster URLs | cluster structure and upload dashboard | Internal structure: keep seven-page cluster, avoid thin standalone pages, keep anti-cannibalization review tied to GSC | BLOCKED GSC EXPORT |
| FL-DRAFT-ENH-011 | CRITICAL | affected live Family/Divorce URLs | live repair field map and readiness gate | Visible repair dependency: duplicate H1s, raw shortcode, missing PDF promise, divorce-pillar canonical conflict | BLOCKED OWNER APPROVAL / BLOCKED CMS ROLLBACK |
| FL-DRAFT-ENH-012 | LOW | post-upload enhancement backlog | future tools roadmap | Child-support or cost estimator | NOT FIRST UPLOAD BLOCKER |

## Recommended Draft Edit Batch

1. `content-drafts/divorce-lawyer-public-body-he.md`
   - Add the cost module.
   - Add the step-by-step process module.
   - Add a first-meeting preparation checklist.
   - Add a restrained CTA that routes to lawyer matching only after lead/form routing is verified.

2. `content-drafts/divorce-mediation-public-body-he.md`
   - Add a decision block for when mediation is useful and when it may be unsafe.
   - Keep language neutral and avoid outcome guarantees.

3. `content-drafts/child-support-public-body-he.md` and `content-drafts/child-custody-public-body-he.md`
   - Add parent decision tables.
   - Add document/preparation questions.
   - Avoid unsupported calculator promises.

4. `content-drafts/consensual-divorce-public-body-he.md`
   - Add agreement approval/change-risk/template policy.
   - Do not promise a PDF until the live asset and legal copy are approved.

5. `content-drafts/divorce-property-division-public-body-he.md` and `content-drafts/family-dispute-resolution-public-body-he.md`
   - Add document checklist cross-links and process routing language.

## Verification Plan After Draft Edits

Run local checks before any owner upload review:

1. `node --check tools/check-family-divorce-public-bodies.mjs`
2. `node tools/check-family-divorce-public-bodies.mjs --reportDate=2026-05-22`
3. `node --check tools/check-family-divorce-upload-readiness.mjs`
4. Rerun upload readiness only after draft edits are complete.
5. Review word counts, raw shortcode markers, H1 counts, internal links, and no-PDF-promise constraints.

Public checks remain separate and blocked until owner approval, CMS rollback backup, visible live repair and focused GSC export are complete.

## Decision

FIXED PLANNING: the competitor gap is now mapped to concrete draft targets, blockers and verification steps.

VERIFIED LOCAL: the queue CSV parses with 12 enhancement/dependency rows.

BLOCKED OWNER WORDING: the legal/commercial wording for costs, agreement/template policy, CTAs and lawyer connection must be approved before body-copy edits are made.

BLOCKED PUBLIC EXECUTION: no public CMS content, URL, redirect, canonical, noindex, sitemap, taxonomy, media/PDF, lawyer card, lead/CRM, GSC/GA4, wp-admin or uPress change is approved by this queue.

SAFETY: no public CMS record, page body, title, H1, meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, media asset, lawyer card, lead, CRM, payment, GSC/GA4 setting, wp-admin setting or uPress deployment changed.
