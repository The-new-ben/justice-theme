# Family Law Competitor Gap Analysis - 2026-05-22

Status: VERIFIED RESEARCH / VERIFIED LOCAL / PUBLIC EXECUTION BLOCKED / NO PUBLIC CHANGES

This packet compares the current Jus-Tice Family Law / Divorce upload package against current competitor evidence and existing repo QA. It is a preparation artifact only. It does not approve publishing, redirects, canonicals, noindex changes, sitemap changes, taxonomy changes, lawyer-card changes, lead/CRM changes or wp-admin execution.

## Inputs Reviewed

Internal Jus-Tice evidence:
- `reports/family-divorce-public-body-static-qa-2026-05-21.csv`: 7/7 planned public-body drafts pass static QA.
- `reports/family-law-live-safety-check-2026-05-22.csv`: live Family/Divorce URLs remain blocked by H1 defects, raw shortcodes, missing PDF asset and two self-canonical divorce-pillar candidates.
- `project-control/family-law-visible-repair-field-map-2026-05-22.md`: exact visible repair map exists but requires owner approval and CMS rollback backup.
- `project-control/family-law-live-repair-readiness-gate-2026-05-22.md`: 8/8 live repair gates remain blocked.
- `project-control/family-divorce-upload-readiness-dashboard-2026-05-21.md`: body package is high readiness but public CMS execution and SEO consolidation remain blocked.

External competitor evidence checked on 2026-05-22:
- Search result set for family/divorce lawyer, costs, process, mediation, child support/custody and agreement intent.
- `https://www.stroosky-law.co.il/`
- `https://www.hhlaw.org.il/`
- `https://gertelaw.co.il/divorce-agreement/`
- `https://rotenberglaw.co.il/`
- `https://www.sayag-law.co.il/cost-divorce-how-much/`
- `https://www.midrag.co.il/Content/Price/20515` (search-result evidence only; direct fetch returned 403)

## Executive Decision

The Family/Divorce cluster should not be uploaded yet. The draft bodies are strong enough for owner review, but the current live surface is not clean enough and competitors expose several elements that should be added or tightened before this becomes the first controlled upload cluster.

Highest-value improvements before upload:
1. FIXED PLANNING REQUIRED: add a concise cost/fee comparison section to the approved draft package, including service types, what affects price and what to ask in the first meeting. Avoid exact promises unless owner approves ranges.
2. FIXED PLANNING REQUIRED: turn the process section into a clearer step-by-step path: initial consultation, conflict-settlement request, agreement/mediation path, court/rabbinical route, urgent motions, approval/enforcement.
3. FIXED PLANNING REQUIRED: make the documents section more operational: first-call checklist, financial documents, children-related documents, prior agreements, urgent-risk documents.
4. FIXED PLANNING REQUIRED: strengthen agreement pages: clauses, approval process, when agreement is unsafe, modification/cancellation risk and PDF/template policy.
5. BLOCKED LIVE QA: repair live H1/raw-shortcode/PDF issues before treating the cluster as upload-safe.
6. BLOCKED SEO DECISION: run real focused GSC export before deciding between `/divorce-lawyer/` and `/lawyer-divorce-guide-proceedings-costs-rights/`.
7. BLOCKED LAWYER CONNECTION: connect Maya Rotenberg/lawyer cards only after the mini-site route, schema and source facts are verified live.

## Competitor Pattern Summary

| Pattern | Competitor evidence | Jus-Tice current state | Gap | Required action before upload |
|---|---|---|---|---|
| Costs and fees | Cost-focused pages appear in current search results; Sayag and Midrag target cost intent; Gertel agreement guide includes cost-table framing. | Draft has a cost section and cost FAQ, but it is mostly qualitative. | Medium-high. Users and SERP expect concrete cost framing. | Add owner-approved price-range table or conservative "what affects cost" table. Keep no guarantee language. |
| Court/process explanation | Stroosky navigation separates rabbinical/family court, civil divorce, pregnancy divorce and conflict-settlement meeting; HHLaw has process and claim pages. | Draft explains routes but can be easier to scan. | Medium. Structure should be more procedural. | Add "step-by-step process" section and separate agreement/mediation/litigation paths. |
| FAQs | Competitor pages and directories often include FAQ sections; Jus-Tice draft has FAQ. | FAQ exists in draft; live/schema verification is blocked. | Medium. Needs implementation QA. | Preserve FAQ, verify FAQPage schema only after deploy and route cleanup. |
| Documents and templates | Gertel agreement guide advertises downloadable/supporting documents; Midrag/Sayag answer practical cost questions. | Draft has document checklist; `/divorce-agreement/` live has raw shortcode and missing PDF candidate. | Critical for agreement page. | Do not promise PDF until asset is live; add document checklist and template policy. |
| Mediation | HHLaw has dedicated mediation navigation; Rotenberg positions mediation as a family-law differentiator. | Dedicated `/divorce-mediation/` draft exists and passes static QA; live has H1 issue. | Medium. Content exists, live quality blocked. | Repair live H1 after approval; add "when mediation is unsafe" decision block. |
| Children/custody/support | HHLaw and Rotenberg both surface custody, shared custody, child support and visitation/time arrangements. | `/child-support/` and `/child-custody/` drafts pass static QA; live H1 issues remain. | Medium. Coverage exists, execution blocked. | Repair H1 structure and add clearer parent decision tables. |
| Agreements | Stroosky and HHLaw split financial agreements, divorce agreements and related family agreements; Gertel is deep on agreement approval and change risk. | Consensual divorce and agreement topics exist, but `/divorce-agreement/` live has shortcode/PDF defects. | High. Agreement intent is commercially important. | Fix agreement page first; add clauses/approval/change-risk table. |
| Lawyer connection | Direct law-firm competitors show named lawyer authority; directories show lawyer listings/reviews. | Maya mini-site readiness exists, but public route remains blocked; family page can link to lawyer directory after verified. | High. Jus-Tice needs to convert informational users to lawyer matching. | Add lawyer-card/CTA only after Maya route and approved lawyer data are live verified. |
| Strong CTAs | Competitors use consultation booking, phone/WhatsApp and "contact now" patterns. | Draft has general Jus-Tice help section and internal links; lead/form/live routing still requires deploy QA. | Medium-high. Conversion path is weaker than direct firms. | Add restrained CTA blocks: "match me with family lawyer", "prepare questions", "urgent risk warning". |
| Page structure | Competitors use deep navigation, topic clusters, cost pages, guide pages and FAQ blocks. | 7-page cluster is organized and static-QA pass; live site has duplicate-H1 and canonical conflict blockers. | High until live cleanup. | Keep current seven-page first cluster, but block upload until live visible repair and GSC decision. |
| E-E-A-T | Rotenberg and other law firms show named authority and experience; directories show reviews. | Authority governance exists; Maya Person schema path exists but is not live verified. | Medium-high. | Use only verified facts; do not invent awards/reviews. |
| Tools/calculators | Midrag/directory-style competitors exploit cost tools; existing competitor analysis marked calculators as an opportunity. | No verified family calculator/tool in first upload package. | Opportunity, not first-upload blocker. | Backlog a child-support/cost estimator as post-upload enhancement, not a prerequisite. |

## Missing Elements To Add To Draft Package

Must add or tighten before upload:
- Cost module: fee types, what changes cost, possible external expenses, first-meeting cost questions.
- Process module: agreement path vs mediation vs contested court/rabbinical path.
- Document checklist module: first consultation, assets/debts, children, existing agreements, urgent-risk documents.
- Agreement module: mandatory topics, approval, enforcement/change risk, template/PDF caution.
- CTA module: lawyer matching, urgent-risk warning, consultation preparation checklist.

Should add after first upload or after live QA:
- FAQPage schema verification.
- Lawyer-card module connected to Maya Rotenberg or directory filters.
- Child-support/cost calculator.
- City/practice expansion pages.
- Review/testimonial module only when verified and approved.

Must not do yet:
- Do not publish.
- Do not redirect.
- Do not delete.
- Do not change canonicals/noindex/sitemap/taxonomy.
- Do not add unverified lawyer claims, rankings, awards or reviews.
- Do not promise a PDF/template until the file and legal copy are approved.

## Recommended Controlled Upload Sequence

1. Owner reviews this competitor gap packet and the visible repair approval packet.
2. Operator captures real WordPress rollback backup for current Family/Divorce URLs.
3. Repair only visible defects on current live URLs: duplicate H1s, raw shortcode output and missing PDF promise.
4. Run `node tools/check-family-law-live-safety.mjs --reportDate=YYYY-MM-DD`.
5. Run `node tools/extract-family-law-live-repair-diagnostics.mjs --reportDate=YYYY-MM-DD`.
6. Run focused GSC export before divorce-pillar URL consolidation.
7. Add approved cost/process/doc/agreement/CTA enhancements to the seven existing-page drafts.
8. Owner approves each page row.
9. Update existing CMS pages only; no new clean slugs, redirects or deletes in this first cluster upload.
10. Capture desktop/mobile screenshots after live checks pass.

## Decision

VERIFIED RESEARCH: Competitors cover costs, court/process, FAQs, document/template guidance, mediation, children/custody/support, agreements and lawyer conversion more explicitly than the current upload package.

FIXED PLANNING: Jus-Tice has a strong seven-page cluster base and repeatable QA, but the first upload should add the practical modules above and repair live defects before owner approval.

BLOCKED PUBLIC EXECUTION: Family/Divorce remains blocked until owner approval, CMS rollback backup, visible live repair, real GSC evidence and post-repair QA.

SAFETY: no public CMS record, page body, title, H1, meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, media asset, lawyer card, lead, CRM, payment, GSC/GA4 setting, wp-admin setting or uPress deployment changed.
