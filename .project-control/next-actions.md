# Next Actions — Jus-Tice.co.il
**Date:** 2026-05-10
**Process:** Read this file at the start of every work session. Pick the top unblocked task. Update status when done.

---

### ACTION-BTL-HELD-LEAD-TRIAGE-001: Show held Bituach Leumi paid-handoff blockers without PII
**Status:** FIXED LIVE / LINEAR DONE
**Why:** after priming Bituach Leumi revenue hints, the owner still needs a single safe place to see which held WhatsApp/TalkTo/manual leads are blocked by consent, partner terms, owner release or billing proof before first paid handoff.
**Actions:**
1. DONE: add owner-only `Held Bituach Leumi lead triage` panel under the Bituach Leumi specialist supply area in Justice CRM.
2. DONE: query held `national-insurance` / `qualified_appeal_lead` leads without creating or editing production lead records.
3. DONE: show no-PII readiness fields: lead ID, source channel, revenue model, suggested price, consent status, partner terms, owner release/billing gate and next safe action.
4. DONE: include a copyable no-PII held-lead action list for owner/team handoff.
5. DONE: linted, committed, pushed, ran uPress Pull Git, verified marker `2026-05-26-btl-held-lead-triage-v1`, and verified Justice CRM renders the panel.
6. VERIFIED: homepage and `/national-insurance-attorney/` return 200; uPress Git log shows `d26f6a00 Add BTL held lead triage` as `HEAD -> main, origin/main`.
7. BLOCKED: do not release any real held lead until client permission, accepted partner terms, owner release and payment/invoice proof are recorded.

### ACTION-BTL-HELD-LEAD-REVENUE-HINT-001: Prime Bituach Leumi revenue metadata before routing
**Status:** FIXED LIVE / LINEAR DONE / CRM DATA TEST DEFERRED
**Why:** manual WhatsApp/TalkTo/legacy Bituach Leumi leads should stay held until consent and partner terms are clear, but the CRM still needs the specific revenue product, suggested fee and billing-not-ready status visible immediately.
**Actions:**
1. DONE: add a pre-routing save hook after classifier, before router.
2. DONE: for `national-insurance` leads, set `lead_revenue_model=qualified_appeal_lead`, default `suggested_lead_price_ils=249`, and default `qualified_lead_billing_status=not_ready` when missing.
3. DONE: preserve routing safety; do not remove `routing_hold`, do not mark ready-to-bill, do not notify anyone and do not invoice.
4. DONE: linted, committed, pushed, ran uPress Pull Git, and verified live marker `2026-05-26-btl-held-lead-revenue-hint-v1`.
5. VERIFIED: homepage and `/national-insurance-attorney/` return 200; uPress Git log shows `67e0ff7c Prime BTL revenue hints before routing` as `HEAD -> main, origin/main`.
6. DEFERRED: do not create/edit a real production lead just to test metadata. Inspect Justice CRM behavior later with an owner-approved safe test lead or an existing safe held record.
7. BLOCKED: still no first paid lead until client permission, three routable specialists, accepted partner terms, invoice/payment proof and owner release are recorded.

### ACTION-MANAGED-LEGAL-SERVICE-FULFILLMENT-001: Add private fulfillment gate for packaged legal services
**Status:** FIXED LIVE / LINEAR DONE / OWNER EMAIL SENT
**Why:** the owner wants to start infrastructuring the Lawhive-style managed legal-service path, but public launch must stay blocked until ethics, engagement, lawyer-of-record and payment gates are clear.
**Actions:**
1. DONE: add owner-only fulfillment meta for `justice_legal_request`: package, mode, status, managing lawyer, engagement letter, ethics review, price, payment status, case reference and owner note.
2. DONE: add a `Managed service fulfillment gate` metabox on LegalTech requests.
3. DONE: add a Justice CRM `Managed legal-service fulfillment preflight` panel.
4. DONE: keep the revenue-stream map honest: AI-native managed legal services are started privately, but public product copy remains blocked.
5. DONE: commit, push, uPress Pull Git and verify live marker `2026-05-26-managed-service-fulfillment-v1`.
6. DONE: verify the CRM admin panel renders; `wp-admin -> Justice CRM` shows `Managed legal-service fulfillment preflight` and the ethics/Bar blocker text.
7. BLOCKED: no public legal-service package, checkout, AI drafting, client portal, lawyer handoff, payment or email can go live before ethics/Bar engagement review and owner approval.
8. DONE: created Linear issue `HAD-90`, marked Done.
9. DONE: send Hebrew significant-progress email after checking instruction-subject mail.

### ACTION-HOMEPAGE-CUSTOMER-FIRST-001: Demote lawyer acquisition on the public homepage
**Status:** FIXED LIVE / OWNER EMAIL SENT / LINEAR DONE
**Why:** the public homepage should read as a legal-help site for users. The prior early lawyer pricing/lead-partner strip exposed too much business-side intent immediately after the user intake path.
**Actions:**
1. DONE: inspect live homepage copy and confirm early public phrases including `הצטרפות למסלול לידים`, `לקוחות מחפשים עורך דין עכשיו`, `פניות מדידות`, `המסלול העסקי`, `שותף לידים` and visible price marks.
2. DONE: compare competitor hierarchy; Din and PsakDin keep the public homepage focused on legal content, lawyer search and contact paths, with advertising/join paths secondary.
3. DONE: remove `homepage-lawyer-revenue-strip` from `front-page.php` and `page-home.php`.
4. DONE: rewrite `lawyer-cta.php` as a quieter lawyer profile-review section, without lead-partner/pricing-first language.
5. DONE: lint, commit, deploy via uPress Pull Git and verify live homepage no longer exposes the early lawyer pricing strip.
6. DONE: send Hebrew owner email because this is a public-facing homepage change; included review URL, associated/cannibalizing pages and concise review.
7. VERIFIED: live marker `2026-05-26-homepage-customer-first-v1`; homepage no longer exposes early lawyer lead/pricing language and now shows only a quieter profile-review path for lawyers lower in the page.
8. DONE: created Linear issue `HAD-89`, marked Done, and linked the live homepage.

### ACTION-PUBLIC-ARTICLE-MOBILE-CTA-DEDUP-001: Remove repeated legal-help CTA on mobile article pages
**Status:** FIXED LIVE / OWNER EMAIL SENT
**Why:** owner saw on mobile that an article shows the same "need help / press this button" style message twice while scrolling. Repetition feels spammy and hurts trust.
**Actions:**
1. DONE: inspect live article HTML and confirm the article body CTA and sidebar CTA use the same contextual message.
2. DONE: compare competitor pattern; LawReviews connects article readers to relevant lawyer lists without stacking identical CTA copy twice.
3. DONE: mark duplicate sidebar CTA-only blocks in `single-articles.php`.
4. DONE: hide duplicate sidebar CTA blocks on mobile while preserving main CTA, connected lawyer profile cards and family-law cluster navigation.
5. DONE: lint, commit, deploy via uPress Pull Git and verify live article/mobile behavior.
6. DONE: send Hebrew owner email because this is a public-facing change; included review URL, associated/cannibalizing pages and concise review.

### ACTION-INTERNAL-ARTIFACT-WEB-BLOCK-001: Block project-control and report artifacts from public static access
**Status:** FIXED LIVE / GUARD ADDED / LEGACY TOOL MIGRATION BACKLOG
**Why:** verification found internal repo control docs reachable under `/wp-content/themes/justice-theme/project-control/*.md`; even without client phone, these files are not public website content.
**Actions:**
1. DONE: add Apache/LiteSpeed deny `.htaccess` files to `project-control/`, `reports/`, `content-master/`, `content-drafts/`, and `mnt/`.
2. DONE: live verification showed nested `.htaccess` was ignored for `project-control/*.md` and `reports/*.json`, so add a theme-root rewrite deny rule.
3. DONE: live verification showed the theme-root `.htaccess` rule was also ignored.
4. DONE: moved `project-control`, `reports`, `content-master`, `content-drafts`, `mnt`, and emergency master artifacts to dot-prefixed private paths and updated live PHP readers.
5. DONE: pulled Git in uPress and verified the old public URLs return 404 while dot-prefixed URLs return 403.
6. DONE: monitor future tools/scripts so they do not recreate public artifact directories; `.gitignore` now blocks committing those public paths.
7. DONE: added `tools/check-private-artifact-boundaries.mjs`, which fails if public artifact roots reappear, tracked files are added under those roots, or ignore coverage is missing.
8. VERIFIED LOCAL: `node --check tools/check-private-artifact-boundaries.mjs` passed; `node tools/check-private-artifact-boundaries.mjs --reportDate=2026-05-26` returned `PASS`.
9. DOCUMENTED: `.project-control/private-artifact-boundary-guard-2026-05-26.md` and `.csv` list the current boundary state and `600` legacy tool references that require review/migration before old scripts are rerun.
10. DONE: created Linear issue `HAD-91`, marked Done, and included the repo artifact paths and verification.
11. DONE: migrated the first high-risk criminal/traffic tooling pair to dot-private paths: `tools/build-criminal-traffic-readiness-dashboard.mjs` and `tools/build-criminal-gsc-decision-map.mjs`.
12. VERIFIED LOCAL: syntax checks passed; the criminal/traffic readiness dashboard generated only under `.project-control` and `.reports`; the boundary guard returned `PASS` and public-root references dropped from `600` to `563`.
13. GENERATED: `.project-control/private-artifact-script-migration-2026-05-26.md` and `.csv`.
14. NEXT: continue with Family/Divorce, Medical Malpractice and supplier/content packet tools, then rerun with `--fail-on-legacy-writers` only after the remaining legacy writers are migrated.
15. DONE: migrated the Family/Divorce GSC, protected-URL review, live-repair readiness and draft-merge tools to dot-private paths.
16. VERIFIED LOCAL: syntax checks passed; Family/Divorce GSC map and protected-URL packet generated only private outputs; the boundary guard returned `PASS` and public-root references dropped from `563` to `512`.
17. GENERATED: `.project-control/private-artifact-script-migration-family-divorce-2026-05-26.md` and `.csv`.
18. NEXT: continue with Medical Malpractice and supplier/content packet tools before enabling strict `--fail-on-legacy-writers`.
19. DONE: migrated the Medical Malpractice readiness, GSC decision, owner-decision and duplicate-identity tools to dot-private paths.
20. VERIFIED LOCAL: syntax checks passed; the full Medical Malpractice planning chain generated only private outputs; the boundary guard returned `PASS` and public-root references dropped from `512` to `440`.
21. GENERATED: `.project-control/private-artifact-script-migration-medical-malpractice-2026-05-26.md` and `.csv`.
22. NEXT: continue with supplier/content packet tools before enabling strict `--fail-on-legacy-writers`.

### ACTION-WHATSAPP-TALKTO-CONSENT-CRM-001: Build consent-safe intake for WhatsApp, TalkTo and legacy leads
**Status:** OWNER RELEASE GATE DEPLOYED LIVE / PROVIDER ROUTE BLOCKED
**Why:** inbound WhatsApp/TalkTo leads can become paid lawyer/supplier handoffs, but only after permission, case details and commercial terms are recorded.
**Actions:**
1. DONE: add source channels for WhatsApp Business, WhatsApp export, TalkTo chatbot and legacy CSV imports.
2. DONE: add consent statuses: fresh inbound needs details, explicit match consent, owner verified consent, legacy needs re-permission and do not contact.
3. DONE: store source thread/import ID, source page URL, consent basis, consent checked timestamp and permission next step on each private lead.
4. DONE: block router release unless consent status is explicit/verified and owner/admin verified the evidence.
5. DONE: document the architecture in `.project-control/lead-consent-import-architecture-2026-05-26.md`.
6. DONE: deploy and verify the admin bridge appears under `wp-admin -> Justice CRM -> Manual WhatsApp / client lead bridge`.
7. DONE: build pasted CSV/import staging with dedupe fingerprint and re-permission status.
8. DONE: deploy/pull and verify the staging panel appears in Justice CRM.
9. DONE: build the re-permission queue and owner-approved Hebrew/English opt-in message templates before importing old untreated leads in bulk.
10. DONE: deploy/pull and verify the new marker is live; code-level safety confirms held lead contact buttons are permission-gated.
11. DONE: build supplier/lawyer terms and anonymized bidding/preview rules before PII release.
12. DONE: deploy/pull and verify the Anonymized partner preview / terms queue appears in Justice CRM.
13. DONE: add audit export for consent evidence, no-PII preview status, partner terms and billing proof.
14. DONE: deploy/pull and verify the owner-only no-PII lead audit CSV export link appears in Justice CRM.
15. DONE: design official WhatsApp Business/TalkTo webhook mapping after provider route and permission text are approved.
16. DONE: deploy/pull and verify the owner-only WhatsApp / TalkTo connector readiness panel appears in Justice CRM.
17. DONE: add owner handoff release gate for leads that already have explicit/verified client permission, accepted partner terms and a recorded minimum paid fee.
18. DONE: commit, deploy/pull and verify the owner-only Owner handoff release queue appears in Justice CRM.
19. BLOCKED: do not enable live webhook ingestion until provider route, signature/shared-secret method, pause control and permission text are approved.
20. BLOCKED: do not contact old leads, release PII to suppliers/lawyers, or charge money until opt-in, partner terms, billing proof and owner release are recorded.

### ACTION-UK-WHATSAPP-LEAD-SUPPLIER-HANDOFF-001: Process first UK-law WhatsApp lead through the private CRM bridge
**Status:** FIXED CLASSIFICATION / VERIFIED MAILBOX / BLOCKED LIVE CRM ENTRY UNTIL OWNER APPROVES REAL LEAD CREATION
**Why:** the owner sent a real WhatsApp lead from the `uk-lawyer` page and wants it handled through the system, including supplier/lawyer matching and paid handoff discipline.
**Actions:**
1. DONE: logged into `info@jus-tice.co.il` Outlook in the browser and confirmed the exact email subject.
2. DONE: extracted the WhatsApp attachment through the Microsoft mail API after the browser download path was blocked.
3. FOUND: the client asked for consultation on `עורך דין אנגליה` from `https://jus-tice.co.il/uk-lawyer/`, but did not provide case details after the automated prompt.
4. DONE: add `uk-law` to the lead-area vocabulary and classifier so this demand does not fall into generic or Thailand/international handling.
5. NEXT: after deployment, create one private CRM lead in `wp-admin -> Justice CRM -> Manual WhatsApp / client lead bridge` with `handoff_path=supplier_marketplace` or `lawyer_and_supplier`, `legal_area=uk-law`, routing hold on, and source reference to the Outlook email.
6. BLOCKED: do not release to paid lawyer routing, contact suppliers, send client messages, create invoices or charge money until owner confirms consent and the first UK-law supplier/lawyer partner terms.
7. VERIFY: after CRM entry, confirm it appears in the uncovered/supplier review queue and does not trigger public output.

### ACTION-MAYA-LAWYER-CMS-ACTIVATION-PACKET-001: Refresh Maya live status and prepare owner/operator CMS activation packet
**Status:** FIXED PLANNING / VERIFIED LOCAL / VERIFIED LIVE READ-ONLY PARTIAL / BLOCKED PUBLIC CMS ACTIVATION / NO PUBLIC CMS CHANGE
**Why:** the Maya Rotenberg mini-site remains high-value, but current public evidence shows the approved English profile route is not live and anonymous REST returns no Maya slug record. The next safe step is a precise activation packet, not a blind profile creation or redirect.
**Actions:**
1. DONE: reran `tools/check-maya-lawyer-live-readonly.mjs` for `2026-05-24`.
2. GENERATED: `project-control/maya-lawyer-live-readonly-2026-05-24.md` and `.csv`.
3. GENERATED: `reports/maya-lawyer-live-readonly-2026-05-24.csv` and `.json`.
4. DONE: created `tools/build-maya-lawyer-cms-activation-packet.mjs`.
5. GENERATED: `project-control/maya-lawyer-cms-activation-packet-2026-05-24.md` and `.csv`.
6. GENERATED: `reports/maya-lawyer-cms-activation-packet-2026-05-24.csv` and `.json`.
7. VERIFIED LOCAL: node syntax passed for both Maya scripts.
8. VERIFIED LIVE READ-ONLY PARTIAL: `justice_lawyer` REST type exists, but `/lawyers/advocate-maya-rotenberg/` remains HTTP `404`, no canonical, `noindex, follow`, 404 title/H1 and REST slug count `0`.
9. FIXED PLANNING: activation packet has `9` rows covering current blocker, existing profile confirmation, rollback capture, public approval signals, opt-in slug migration, mini-site bootstrap fields, public sources and post-activation QA.
10. BLOCKED PUBLIC CMS ACTIVATION: owner/operator must confirm the existing profile candidate, capture rollback, approve exact profile/source fields and rerun live QA before any public CMS, slug, redirect, canonical/noindex, taxonomy, sitemap, lead, CRM or uPress action.
11. NEXT: after owner approval, operator confirms the existing `justice_lawyer` record in wp-admin or WP-CLI, repairs that record only, then reruns the live checker and captures desktop/mobile screenshots.

### ACTION-ROUTE-DEPLOY-LIVE-SCREENSHOT-CLOSURE-001: Close T416/T418/T419 with current live route and screenshot evidence
**Status:** FIXED / VERIFIED LOCAL / VERIFIED LIVE READ-ONLY / VERIFIED SCREENSHOTS / NO PUBLIC CMS CHANGE
**Why:** the prior route deploy gate was blocked by stale `/family-law/` breadcrumb schema and missing screenshots; current public read-only checks now prove the route package is deployed and visually captured.
**Actions:**
1. DONE: reran live traffic, trust and controlled breadcrumb checkers for `2026-05-24`.
2. DONE: captured desktop/mobile screenshots for `/family-law/`, `/medical-malpractice-lawyer/`, `/real-estate-lawyer-guide/`, `/inheritance-lawyer/`, `/contact/` and `/about/`.
3. DONE: updated `tools/build-route-deploy-verification-gate.mjs` to verify screenshot PNG presence and dimensions.
4. GENERATED: `project-control/route-deploy-verification-gate-2026-05-24.md` and `.csv`.
5. GENERATED: `reports/route-deploy-verification-gate-2026-05-24.csv` and `.json`.
6. VERIFIED LOCAL: `node --check tools/build-route-deploy-verification-gate.mjs` passed.
7. VERIFIED LIVE READ-ONLY: traffic checker `12/12` PASS; trust checker `3/3` PASS; controlled breadcrumb checker `4/4` PASS.
8. VERIFIED SCREENSHOTS: `12/12` PNG files exist with expected desktop/mobile dimensions under `project-control/visual-evidence/route-deploy-2026-05-24/`.
9. FIXED: task-board rows `T416`, `T418` and `T419` are completed in repo control docs.
10. NEXT: monitor after header, breadcrumb, route template, redirect plugin or uPress cache changes; Maya lawyer route remains a separate blocked profile/CMS task.

### ACTION-MAYA-LAWYER-LIVE-READONLY-QA-001: Add focused live smoke checker for Maya lawyer mini-site
**Status:** FIXED / VERIFIED LIVE READ-ONLY PARTIAL / BLOCKED LIVE QA / NOT SCREENSHOT VERIFIED / NO PUBLIC CMS CHANGE
**Why:** the Maya mini-site readiness packet required live route/canonical/robots/schema/profile checks, but there was no focused read-only checker capturing the current public failure mode.
**Actions:**
1. DONE: created `tools/check-maya-lawyer-live-readonly.mjs`.
2. DONE: generated `project-control/maya-lawyer-live-readonly-2026-05-22.md`.
3. DONE: generated `project-control/maya-lawyer-live-readonly-2026-05-22.csv`.
4. GENERATED: `reports/maya-lawyer-live-readonly-2026-05-22.csv`.
5. GENERATED: `reports/maya-lawyer-live-readonly-2026-05-22.json`.
6. VERIFIED LOCAL: `node --check tools/check-maya-lawyer-live-readonly.mjs` passed.
7. VERIFIED LIVE READ-ONLY PARTIAL: anonymous REST type discovery exposes `justice_lawyer`.
8. BLOCKED LIVE QA: `/lawyers/advocate-maya-rotenberg/` returns HTTP `404`, has no canonical, exposes `noindex, follow`, renders the 404 page and the anonymous Maya slug lookup returns `0` records.
9. NEXT: after owner-approved profile route/cache/CMS setup, rerun this checker; require HTTP 200, self-canonical, index/follow, one public Maya profile record, Attorney/Person schema and desktop/mobile screenshots.

### ACTION-FAMILY-LAW-OWNER-WORDING-APPROVAL-001: Prepare owner wording approval packet for Family/Divorce draft modules
**Status:** FIXED PLANNING / VERIFIED LOCAL / OWNER DECISION PENDING / BLOCKED PUBLIC EXECUTION / NO PUBLIC CMS CHANGE
**Why:** the readiness gate identified five draft modules ready for owner wording review; the next safe step is a precise approval packet before any legal body-copy edit.
**Actions:**
1. DONE: reviewed `project-control/family-law-draft-enhancement-readiness-2026-05-22.csv` and the draft enhancement queue.
2. DONE: created `project-control/family-law-owner-wording-approval-2026-05-22.md`.
3. DONE: created `project-control/family-law-owner-wording-approval-2026-05-22.csv`.
4. FIXED PLANNING: separated ready cost, process, document checklist, mediation risk and children decision-table modules from blocked agreement/PDF, CTA/lawyer matching, Maya fact and GSC/live repair dependencies.
5. VERIFIED LOCAL: owner wording CSV parses with `9` rows.
6. BLOCKED OWNER DECISION: do not edit Family/Divorce draft body copy until owner records approve/edit/hold decisions for the five ready modules.
7. BLOCKED PUBLIC EXECUTION: do not publish, repair, redirect, delete or change canonicals/noindex/sitemap/taxonomy from this approval packet.
8. NEXT: owner records approve/edit/hold wording decisions; then edit only the listed existing draft files and rerun `tools/check-family-divorce-public-bodies.mjs`.

### ACTION-FAMILY-LAW-DRAFT-ENHANCEMENT-READINESS-001: Add generated readiness gate for draft enhancement queue
**Status:** FIXED / VERIFIED LOCAL / BLOCKED OWNER WORDING / BLOCKED PUBLIC EXECUTION / NO PUBLIC CMS CHANGE
**Why:** the draft enhancement queue needs repeatable validation so future runs do not edit legal copy against missing draft files or stale planning artifacts.
**Actions:**
1. DONE: created `tools/check-family-law-draft-enhancement-readiness.mjs`.
2. DONE: generated `project-control/family-law-draft-enhancement-readiness-2026-05-22.md`.
3. DONE: generated `project-control/family-law-draft-enhancement-readiness-2026-05-22.csv`.
4. GENERATED: `reports/family-law-draft-enhancement-readiness-2026-05-22.csv`.
5. GENERATED: `reports/family-law-draft-enhancement-readiness-2026-05-22.json`.
6. FIXED: normalized queue row `FL-DRAFT-ENH-007` so strict CSV parsing sees all `12` columns.
7. VERIFIED LOCAL: node syntax passed; checker reviewed `12` rows with `0` missing repo artifacts.
8. VERIFIED LOCAL: readiness distribution is `5` ready for owner wording, `6` blocked by external/live dependencies and `1` backlog item.
9. NEXT: owner approves cost/process/document/agreement/CTA wording; then edit seven existing public-body drafts only and rerun static QA.

### ACTION-FAMILY-LAW-DRAFT-ENHANCEMENT-QUEUE-001: Map Family/Divorce competitor gaps to draft edit queue
**Status:** FIXED PLANNING / VERIFIED LOCAL / BLOCKED OWNER WORDING / BLOCKED PUBLIC EXECUTION / NO PUBLIC CMS CHANGE
**Why:** the competitor gap packet identified practical additions, but the next safe step is a controlled draft-by-draft queue before anyone edits legal copy or uploads content.
**Actions:**
1. DONE: reviewed the Family Law competitor gap analysis and current Family/Divorce QA blockers.
2. DONE: created `project-control/family-law-draft-enhancement-queue-2026-05-22.md`.
3. DONE: created `project-control/family-law-draft-enhancement-queue-2026-05-22.csv`.
4. FIXED PLANNING: mapped cost, process, document, agreement/template, mediation, children, CTA, FAQ/schema, E-E-A-T, structure, live repair and calculator backlog items to exact draft/source targets.
5. VERIFIED LOCAL: queue CSV parses with `12` rows.
6. BLOCKED OWNER WORDING: do not edit body copy until owner approves cost/process/document/agreement/CTA wording.
7. BLOCKED PUBLIC EXECUTION: do not publish, repair, redirect, delete or change canonicals/noindex/sitemap/taxonomy from this queue.
8. NEXT: after owner wording approval, edit the seven existing public-body drafts only, rerun `tools/check-family-divorce-public-bodies.mjs`, then update upload readiness for owner review.

### ACTION-FAMILY-LAW-COMPETITOR-GAP-001: Compare Family/Divorce cluster against current competitors
**Status:** FIXED PLANNING / VERIFIED RESEARCH / VERIFIED LOCAL / BLOCKED PUBLIC EXECUTION / NO PUBLIC CMS CHANGE
**Why:** the Family/Divorce cluster is the first controlled upload candidate, but owner review needs a practical competitor gap matrix before upload decisions.
**Actions:**
1. DONE: reviewed current Family/Divorce readiness and live safety artifacts.
2. DONE: checked current competitor evidence for family/divorce lawyer, cost, process, agreement, mediation, child support/custody and directory intent.
3. DONE: created `project-control/family-law-competitor-gap-analysis-2026-05-22.md`.
4. DONE: created `project-control/family-law-competitor-gap-analysis-2026-05-22.csv`.
5. VERIFIED RESEARCH: competitors are stronger on explicit cost framing, process navigation, agreement/template guidance, named lawyer authority and direct CTAs.
6. VERIFIED LOCAL: Jus-Tice has a strong seven-page draft base, but public execution remains blocked by live visible defects, missing PDF asset, owner/legal approval, CMS rollback backup and focused GSC evidence.
7. NEXT: add approved cost/process/document/agreement/CTA enhancements to drafts, then repair visible live defects only after owner approval and rollback backup; do not publish, redirect, delete or change canonicals/noindex/sitemap.

### ACTION-ROUTE-DEPLOY-VERIFICATION-GATE-001: Consolidate critical route deploy QA and block stale breadcrumbs
**Status:** FIXED / VERIFIED LOCAL / VERIFIED LIVE READ-ONLY / VERIFIED SCREENSHOTS / NO PUBLIC CMS CHANGE
**Why:** T416, T418 and T419 were code-fixed but still scattered as deploy-blocked tasks. The live routes now need one gate that proves traffic/trust routes pass and catches stale breadcrumb schema before promotion.
**Actions:**
1. DONE: updated `functions.php` and `deployment-marker.txt` to marker `2026-05-22-route-deploy-verification-gate-v1`.
2. DONE: added controlled-route Yoast BreadcrumbList filter in `inc/breadcrumbs.php`.
3. DONE: updated `tools/check-controlled-route-breadcrumb-safety.mjs`; local checker now returns `11/11 VERIFIED`.
4. DONE: updated `tools/check-live-trust-routes.mjs` to write CSV and capture route guard headers.
5. DONE: created `tools/check-live-controlled-route-breadcrumbs.mjs`.
6. DONE: created `tools/build-route-deploy-verification-gate.mjs`.
7. GENERATED: `project-control/route-deploy-verification-gate-2026-05-22.md` and `.csv`.
8. GENERATED: `reports/route-deploy-verification-gate-2026-05-22.csv` and `.json`.
9. VERIFIED LIVE READ-ONLY: 2026-05-22 traffic checker `12/12` PASS; trust checker `3/3` PASS.
10. FIXED / VERIFIED LIVE READ-ONLY: 2026-05-24 controlled breadcrumb checker now returns `4/4` PASS; `/family-law/` no longer exposes the stale article BreadcrumbList.
11. VERIFIED SCREENSHOTS: 2026-05-24 route screenshot set has `12/12` PNG files for the six critical routes.
12. FIXED: route task-board rows `T416`, `T418` and `T419` are completed.
13. NEXT: rerun the route gate after any header, breadcrumb, route template, redirect plugin or uPress cache change.

### ACTION-MAYA-LAWYER-MINI-SITE-READINESS-001: Prepare Maya lawyer mini-site readiness gate
**Status:** FIXED / VERIFIED LOCAL / BLOCKED LIVE QA / NO PUBLIC CMS CHANGE
**Why:** the priority-page CMS workflow is blocked by the readiness gate, while the Maya lawyer mini-site remains a high-value repo-side task that can be made safer before any public profile action.
**Actions:**
1. DONE: updated `single-justice_lawyer.php` so related-article lookup includes `justice_theme_authority_verified_person_slug_for_post()`.
2. DONE: created `tools/check-maya-lawyer-mini-site-readiness.mjs`.
3. DONE: generated `project-control/maya-lawyer-mini-site-readiness-2026-05-22.md`.
4. DONE: generated `project-control/maya-lawyer-mini-site-readiness-2026-05-22.csv`.
5. GENERATED: `reports/maya-lawyer-mini-site-readiness-2026-05-22.csv`.
6. GENERATED: `reports/maya-lawyer-mini-site-readiness-2026-05-22.json`.
7. FIXED / VERIFIED LOCAL: PHP lint, node syntax and readiness generation passed.
8. VERIFIED LOCAL: readiness report produced `13` checks with `12` verified source checks, `1` blocked live route check and `1` not-verified screenshot check.
9. BLOCKED LIVE QA: `/lawyers/advocate-maya-rotenberg/` still needs deployment/uPress cache control, HTTP/canonical/robots/schema/content verification and screenshots.
10. NEXT: after deploy/cache clear, verify the Maya public route, related articles, anonymous REST behavior, JSON-LD and desktop/mobile screenshots before any redirect/profile migration/public upload decision.

### ACTION-PRIORITY-PAGES-CMS-READINESS-GATE-001: Add generated go/no-go gate for priority page CMS repair
**Status:** FIXED / VERIFIED LOCAL / BLOCKED PUBLIC EXECUTION / NO PUBLIC CMS CHANGE
**Why:** the repair packet, rollback template and owner approval worksheet are useful individually, but public execution needs one consolidated go/no-go report before anyone touches WordPress.
**Actions:**
1. DONE: created `tools/build-priority-page-cms-repair-readiness-gate.mjs`.
2. DONE: generated `project-control/priority-pages-cms-repair-readiness-gate-2026-05-22.md`.
3. DONE: generated `project-control/priority-pages-cms-repair-readiness-gate-2026-05-22.csv`.
4. GENERATED: `reports/priority-pages-cms-repair-readiness-gate-2026-05-22.csv`.
5. GENERATED: `reports/priority-pages-cms-repair-readiness-gate-2026-05-22.json`.
6. VERIFIED LOCAL: node syntax passed and gate generation completed.
7. VERIFIED LOCAL: gate reviewed `51` source rows and produced `7` gate rows.
8. BLOCKED: readiness result is `BLOCKED_NOT_READY_FOR_PUBLIC_CMS_REPAIR`; all `7` gates are blocked with `28` blocked markers and `17` pending markers.
9. NOT LIVE VERIFIED: no public CMS edit, REST write, redirect, canonical/noindex, sitemap, taxonomy, GSC/GA4, screenshot or uPress action happened.
10. NEXT: owner records approve/hold language; if approved, operator captures rollback and repairs only duplicate body H1s on article IDs `19261` and `19279`, then reruns priority live QA.

### ACTION-PRIORITY-PAGES-CMS-OWNER-APPROVAL-001: Prepare owner approval worksheet for priority page CMS repairs
**Status:** FIXED / VERIFIED LOCAL / OWNER DECISION PENDING / BLOCKED PUBLIC EXECUTION / NO PUBLIC CMS CHANGE
**Why:** the repair packet and rollback worksheet are ready, but public execution still needs a precise owner decision that cannot be mistaken for clean-slug creation or SEO migration approval.
**Actions:**
1. DONE: created `project-control/priority-pages-cms-owner-approval-2026-05-22.md`.
2. DONE: created `project-control/priority-pages-cms-owner-approval-2026-05-22.csv`.
3. FIXED PLANNING: worksheet allows only `APPROVE_ARTICLE_H1_REPAIR_ONLY` for `/criminal-lawyer-cost/` article ID `19261` and `/plea-bargain/` article ID `19279`, after rollback capture.
4. BLOCKED PLANNING: `/medical-malpractice-diagnosis-errors/`, `/joint-custody/`, `/medication-errors-malpractice/` and `/divorce-pension-split/` remain held for GSC/source/legal/cannibalization decisions.
5. BLOCKED PLANNING: page publisher use remains held because it writes to `wp/v2/pages`, not the live article CPT repair targets.
6. VERIFIED LOCAL: owner approval CSV parses with `11` rows.
7. NOT LIVE VERIFIED: no public CMS edit, REST write, redirect, canonical/noindex, sitemap, taxonomy, GSC/GA4, screenshot or uPress action happened.
8. NEXT: owner records approve/hold language; if approved, operator captures rollback from the rollback template, repairs only duplicate body H1s on article IDs `19261` and `19279`, then reruns priority live QA.

### ACTION-PRIORITY-PAGES-CMS-ROLLBACK-CAPTURE-001: Prepare pre-edit rollback worksheet for priority page repairs
**Status:** FIXED / VERIFIED LOCAL / BLOCKED PUBLIC EXECUTION / NO PUBLIC CMS CHANGE
**Why:** the repair packet identifies what to fix, but the operator still needs a precise backup/capture worksheet before touching WordPress editor fields.
**Actions:**
1. DONE: created `project-control/priority-pages-cms-rollback-capture-template-2026-05-22.md`.
2. DONE: created `project-control/priority-pages-cms-rollback-capture-template-2026-05-22.csv`.
3. FIXED PLANNING: documented required capture fields for article IDs `19261` and `19279` before duplicate body/content H1 repair.
4. FIXED PLANNING: documented related-asset capture requirements for article ID `8271`, article ID `5405`, page ID `19215`, and pension-related article IDs `8252`, `7048`, `11205`.
5. BLOCKED PLANNING: clean-slug creation, redirect, canonical/noindex, sitemap, taxonomy and internal-link actions remain blocked until owner approval and source/GSC/legal decisions.
6. VERIFIED LOCAL: rollback capture CSV parses with `10` rows.
7. NOT LIVE VERIFIED: no public CMS edit, REST write, redirect, canonical/noindex, sitemap, taxonomy, GSC/GA4, screenshot or uPress action happened.
8. NEXT: owner/operator records approval scope and rollback storage path, captures the required fields, then repairs only approved duplicate body H1s on article IDs `19261` and `19279`.

### ACTION-PRIORITY-PAGES-CMS-REPAIR-PACKET-001: Prepare controlled CMS repair packet for six priority slugs
**Status:** FIXED / VERIFIED LOCAL / BLOCKED PUBLIC EXECUTION / NO PUBLIC CMS CHANGE
**Why:** live QA now identifies the actual source for the two working priority URLs and confirms the four missing clean slugs have no public object. The next public step needs exact operator instructions so repairs do not create duplicates or modify the wrong content type.
**Actions:**
1. DONE: created `project-control/priority-pages-cms-repair-packet-2026-05-22.md`.
2. DONE: created `project-control/priority-pages-cms-repair-packet-2026-05-22.csv`.
3. VERIFIED LIVE READ-ONLY SOURCE MAP: `/criminal-lawyer-cost/` maps to public `articles` CPT ID `19261`.
4. VERIFIED LIVE READ-ONLY SOURCE MAP: `/plea-bargain/` maps to public `articles` CPT ID `19279`.
5. FIXED PLANNING: first safe repair is duplicate body/content H1 cleanup on article IDs `19261` and `19279`, after rollback capture.
6. BLOCKED PLANNING: four 404 clean slugs remain blocked until owner approval, focused GSC where needed, source/legal review and anti-cannibalization decisions.
7. VERIFIED LOCAL RISK: `reports/semrush/build-priority-pages.js` writes to `wp/v2/pages`; do not use it to repair live `articles` CPT records.
8. VERIFIED LOCAL: repair packet CSV parses with `10` rows.
9. NOT LIVE VERIFIED: no public CMS edit, REST write, redirect, canonical/noindex, sitemap, taxonomy, GSC/GA4, screenshot or uPress action happened.
10. NEXT: owner/operator captures rollback material, then repairs only duplicate body H1s on article IDs `19261` and `19279`; keep the four 404 clean slugs blocked until explicit object decisions are approved.

### ACTION-PRIORITY-PAGES-CUSTOM-REST-SOURCE-DIAGNOSTICS-001: Identify priority slugs through public custom REST collections
**Status:** FIXED / VERIFIED LIVE READ-ONLY / BLOCKED PUBLIC QA / NO PUBLIC CMS CHANGE
**Why:** the six priority slugs were invisible through normal `wp/v2/pages` and `wp/v2/posts`, but the two HTTP `200` URLs could still be custom content records. Repair should target the real content source, not guess.
**Actions:**
1. DONE: updated `tools/check-priority-pages-live-readonly.mjs` to discover and check the priority public content collections `pages`, `posts` and `articles`.
2. DONE: regenerated `project-control/priority-pages-live-readonly-2026-05-22.md`.
3. DONE: regenerated `project-control/priority-pages-live-readonly-2026-05-22.csv`.
4. GENERATED: `reports/priority-pages-live-readonly-2026-05-22.csv`.
5. GENERATED: `reports/priority-pages-live-readonly-2026-05-22.json`.
6. VERIFIED LIVE READ-ONLY: `/criminal-lawyer-cost/` is public `articles` CPT ID `19261`.
7. VERIFIED LIVE READ-ONLY: `/plea-bargain/` is public `articles` CPT ID `19279`.
8. BLOCKED LIVE READ-ONLY: `/medical-malpractice-diagnosis-errors/`, `/joint-custody/`, `/medication-errors-malpractice/` and `/divorce-pension-split/` have no public hit in `pages`, `posts` or `articles`.
9. VERIFIED LOCAL: node syntax and live read-only checker passed; checker output remains `0/6 VERIFIED`.
10. NOT SCREENSHOT VERIFIED: no screenshots were captured because Playwright is not installed in this repo environment.
11. NEXT: after rollback capture, repair duplicate body/content H1s on article IDs `19261` and `19279`; for the four missing slugs, restore/create the correct `articles` records or approved content objects before any redirect/canonical decision.

### ACTION-PRIORITY-PAGES-H1-REST-DIAGNOSTICS-001: Add exact duplicate-H1 and REST visibility diagnostics
**Status:** FIXED / VERIFIED LIVE READ-ONLY / BLOCKED PUBLIC QA / NO PUBLIC CMS CHANGE
**Why:** the first post-publish QA showed duplicate H1s and four 404s, but repair needs exact evidence about whether the duplicate H1 is template/body content and whether the six slugs exist through normal public WordPress REST page/post lookup.
**Actions:**
1. DONE: updated `tools/check-priority-pages-live-readonly.mjs` with H1 source, class, id and context extraction.
2. DONE: added read-only public REST probes for `wp/v2/pages?slug=...` and `wp/v2/posts?slug=...`.
3. DONE: regenerated `project-control/priority-pages-live-readonly-2026-05-22.md`.
4. DONE: regenerated `project-control/priority-pages-live-readonly-2026-05-22.csv`.
5. GENERATED: `reports/priority-pages-live-readonly-2026-05-22.csv`.
6. GENERATED: `reports/priority-pages-live-readonly-2026-05-22.json`.
7. VERIFIED LIVE READ-ONLY: `/criminal-lawyer-cost/` and `/plea-bargain/` each have one template H1 with class `single-article__title` and one duplicate body/content H1.
8. VERIFIED LIVE READ-ONLY: all six target slugs return `200/0` from public `wp/v2/pages` and `200/0` from public `wp/v2/posts`.
9. BLOCKED LIVE READ-ONLY: the four missing priority slugs still return `404`, missing canonical and `noindex`.
10. VERIFIED LOCAL: node syntax and live read-only checker passed; checker output remains `0/6 VERIFIED`.
11. NOT SCREENSHOT VERIFIED: no screenshots were captured because Playwright is not installed in this repo environment.
12. NEXT: in wp-admin, first identify the actual content type/source for the two HTTP `200` URLs and the four missing slugs, then capture rollback material before repairing duplicate body H1s or restoring missing objects.

### ACTION-PRIORITY-PAGES-LIVE-READONLY-QA-001: Verify six recently published priority pages
**Status:** VERIFIED LIVE READ-ONLY / BLOCKED PUBLIC QA / NO PUBLIC CMS CHANGE
**Why:** commit `c2c317f` reported six priority cluster pages published via WP REST API; before treating them as complete, the public URLs need read-only verification for status, H1, canonical/noindex, internal links, schema and encoding.
**Actions:**
1. DONE: created `tools/check-priority-pages-live-readonly.mjs`.
2. DONE: created `project-control/priority-pages-live-readonly-2026-05-22.md`.
3. DONE: created `project-control/priority-pages-live-readonly-2026-05-22.csv`.
4. GENERATED: `reports/priority-pages-live-readonly-2026-05-22.csv`.
5. GENERATED: `reports/priority-pages-live-readonly-2026-05-22.json`.
6. VERIFIED LIVE READ-ONLY: `/criminal-lawyer-cost/` returns `200` but is BLOCKED by duplicate H1s.
7. VERIFIED LIVE READ-ONLY: `/plea-bargain/` returns `200` but is BLOCKED by duplicate H1s.
8. BLOCKED LIVE READ-ONLY: `/medical-malpractice-diagnosis-errors/`, `/joint-custody/`, `/medication-errors-malpractice/` and `/divorce-pension-split/` return `404` with no canonical and `noindex`.
9. VERIFIED LOCAL: node syntax and live read-only checker passed; checker output is `0/6 VERIFIED`.
10. NOT SCREENSHOT VERIFIED: no screenshots were captured because Playwright is not installed in this repo environment.
11. NEXT: before any repair, capture CMS rollback material for the six slugs; then fix the four missing/404 pages and duplicate H1 template/body issue on the two live pages; rerun live QA and capture screenshots in a browser-capable environment.

### ACTION-WP-REST-PUBLISHER-SAFETY-001: Require explicit opt-in before priority-page publisher writes to WordPress
**Status:** FIXED / VERIFIED LOCAL / NOT LIVE VERIFIED / NO PUBLIC CMS CHANGE THIS CYCLE
**Why:** `reports/semrush/build-priority-pages.js` was introduced as a WP REST publisher for six priority cluster pages; repo scripts that can publish live pages must default to no-write behavior and must not contain machine-specific credential paths.
**Actions:**
1. DONE: changed `reports/semrush/build-priority-pages.js` so normal execution is dry-run only.
2. DONE: added explicit `--publish` requirement before any WP REST lookup or write.
3. DONE: removed the hardcoded local app-password JSON path.
4. DONE: required `WP_APP_PASSWORD_PATH` for publish mode, pointing to a local credential file outside Git.
5. DONE: added publish-mode credential preflight before the first page upsert loop.
6. DONE: created `tools/check-wp-rest-publisher-safety.mjs`.
7. DONE: created `project-control/wp-rest-publisher-safety-2026-05-22.md`.
8. DONE: created `project-control/wp-rest-publisher-safety-2026-05-22.csv`.
9. VERIFIED LOCAL: node syntax checks, default dry-run and publisher safety checker passed with `10/10 VERIFIED`.
10. VERIFIED LOCAL: `--publish` without `WP_APP_PASSWORD_PATH` exits before a page loop/write.
11. NOT LIVE VERIFIED: no live WordPress write, screenshot, GSC/GA4 action, redirect, canonical/noindex or sitemap action was executed.
12. NEXT: if owner approves future publishing, capture rollback material first, run with `--publish` only from an authorized operator shell, then run live URL/content/schema/screenshot checks for all six pages.

### ACTION-LEAD-AREA-VOCABULARY-SAFETY-001: Centralize public lead-area options for forms, validation and routing
**Status:** FIXED / VERIFIED LOCAL / NOT LIVE VERIFIED / NO PUBLIC CMS CHANGE
**Why:** public lead forms, validation, classifier aliases, CRM labels and routing all depend on the same legal-area slug vocabulary; duplicated form option blocks increase the risk of misrouted leads and inconsistent reporting.
**Actions:**
1. DONE: added `justice_theme_lead_area_options()` in `inc/lead-spam-guard.php` as the canonical public lead-area option set.
2. DONE: changed `justice_theme_lead_area_values()` to derive accepted values from the canonical option keys.
3. DONE: added `justice_theme_render_lead_area_options()` for public lead-area `<select>` rendering.
4. DONE: updated `template-parts/forms/lead-form.php` to use the shared renderer.
5. DONE: updated `template-parts/sections/ask-lawyer.php` to use the shared renderer with its shorter placeholder.
6. DONE: created `tools/check-lead-area-vocabulary-safety.mjs`.
7. DONE: created `project-control/lead-area-vocabulary-safety-2026-05-22.md`.
8. DONE: created `project-control/lead-area-vocabulary-safety-2026-05-22.csv`.
9. VERIFIED LOCAL: PHP lint, node syntax check and lead-area vocabulary checker passed with `11/11 VERIFIED`.
10. NOT LIVE VERIFIED: live form rendering and lead routing still require deployment/pull, cache clear and a controlled test submission.
11. NEXT: after deploy, submit controlled leads for `medical-malpractice-law` and `personal-injury-law`, then verify `legal_area`, `ai_detected_area`, CRM label and assigned-lawyer routing.

### ACTION-CONTROLLED-ROUTE-BREADCRUMB-SAFETY-001: Bind protected practice-route breadcrumbs to route config
**Status:** FIXED / VERIFIED LOCAL / NOT LIVE VERIFIED / NO PUBLIC CMS CHANGE
**Why:** T418 protected the money routes from redirect-plugin collapse, but the visible breadcrumb and BreadcrumbList schema still needed to be protected from stale WordPress query ownership or 404 fallbacks.
**Actions:**
1. DONE: updated `inc/breadcrumbs.php` with a controlled practice route breadcrumb slug map.
2. DONE: updated `inc/breadcrumbs.php` so controlled route breadcrumbs use `justice_theme_get_practice_landing_config()`.
3. DONE: placed the controlled route breadcrumb fallback before article/page/archive/404 query fallbacks.
4. DONE: created `tools/check-controlled-route-breadcrumb-safety.mjs`.
5. DONE: created `project-control/controlled-route-breadcrumb-safety-2026-05-22.md`.
6. DONE: created `project-control/controlled-route-breadcrumb-safety-2026-05-22.csv`.
7. VERIFIED LOCAL: `php -l inc/breadcrumbs.php`, node syntax check and controlled-route breadcrumb checker passed with `10/10 VERIFIED`.
8. NOT LIVE VERIFIED: public breadcrumb UI and BreadcrumbList schema still require uPress pull, cache clear and live route/screenshot verification.
9. NEXT: after deploy, rerun traffic-priority and breadcrumb-schema checks on `/family-law/`, `/medical-malpractice-lawyer/`, `/real-estate-lawyer-guide/` and `/inheritance-lawyer/`.

### ACTION-AUTHORITY-PERSON-PROFILE-SCHEMA-GATE-001: Gate lawyer schema and add verified Maya Person schema
**Status:** FIXED / VERIFIED LOCAL / NOT LIVE VERIFIED / BEN ENTITY BLOCKED
**Why:** T315 still needed the Maya profile enrichment path and a guard against schema leakage from unapproved lawyer/demo profiles.
**Actions:**
1. DONE: updated `inc/authority.php` with a verified-person resolver for approved lawyer profiles.
2. DONE: updated `inc/schema.php` so `justice_lawyer` schema is gated behind public profile approval.
3. DONE: updated `inc/schema.php` with a verified Person schema output path that uses the central authority registry.
4. DONE: updated `inc/schema.php` so lawyer schema `sameAs` URLs can use website, source URL, social URLs and `profile_public_sources`.
5. DONE: updated `tools/check-eeat-authority-safety.mjs` from `6` checks to `11` checks.
6. DONE: created `project-control/authority-person-profile-schema-gate-2026-05-22.md`.
7. DONE: created `project-control/authority-person-profile-schema-gate-2026-05-22.csv`.
8. VERIFIED LOCAL: PHP lint passed for `inc/authority.php` and `inc/schema.php`; node syntax and authority safety checker passed with `11/11 VERIFIED`.
9. BLOCKED: Ben remains outside the verified person registry and `/about/ben-batash/` was not created until owner supplies verified facts, external links and role wording.
10. NEXT: after deploy/pull/cache clear, resolve the Maya redirect loop, then validate live Maya JSON-LD/Rich Results and screenshots.

### ACTION-LAWYER-ONBOARDING-UPLOAD-AI-QUEUE-001: Add uploads, account continuation and AI draft queue to lawyer onboarding
**Status:** COMPLETED / FIXED CODE / VERIFIED LOCAL / NOT LIVE VERIFIED / NO PUBLIC AUTO-PUBLISH
**Why:** T369 required the onboarding wizard to move beyond a guided form toward account continuation, file/photo/video upload, AI draft generation and owner approval queue.
**Actions:**
1. DONE: updated `page-lawyer-registration.php` with multipart form handling and optional profile photo, logo, public-safe document and intro-video fields.
2. DONE: updated `inc/lawyer-onboarding.php` with upload handling, attachment metadata, `pending_upload_review`, `account_continuation_status`, AI-assistant draft scaffold storage and admin mark-reviewed actions.
3. DONE: updated `assets/js/lawyer-registration-wizard.js` so the new asset fields stay in the trust-assets wizard step.
4. DONE: updated `assets/css/premium-pass-3.css` for file-field notes.
5. DONE: created `project-control/lawyer-onboarding-upload-ai-queue-2026-05-22.md`.
6. DONE: created `project-control/lawyer-onboarding-upload-ai-queue-2026-05-22.csv`.
7. VERIFIED LOCAL: PHP lint passed for changed PHP, node check passed for wizard JS and `git diff --check` passed.
8. NOT LIVE VERIFIED: live form submission, upload handling and admin queue screenshots still require authenticated/staging WordPress.
9. NEXT: deploy/pull to staging or uPress, submit a no-file registration and a public-safe file registration, then verify draft profile metadata and Lawyer Onboarding review actions.

### ACTION-EEAT-AUTHORITY-SAFETY-HARDENING-001: Remove unsafe named-author fallback paths
**Status:** FIXED / VERIFIED LOCAL / NOT LIVE VERIFIED / NO PUBLIC CMS CHANGE
**Why:** T315 had a safer authority registry, but active legacy code still allowed hardcoded person schema/byline output outside the verified reviewer path.
**Actions:**
1. DONE: updated `inc/schema.php` so Article schema author defaults to the organization authority helper.
2. DONE: updated `inc/schema.php` so `reviewedBy` uses only `justice_theme_authority_article_reviewer_schema()`.
3. DONE: updated `inc/eeat.php` so legacy E-E-A-T automatic Person schema/byline injection is disabled by default.
4. DONE: created `tools/check-eeat-authority-safety.mjs`.
5. DONE: created `project-control/eeat-authority-safety-hardening-2026-05-22.md`.
6. DONE: created `project-control/eeat-authority-safety-hardening-2026-05-22.csv`.
7. VERIFIED LOCAL: PHP lint passed for changed PHP files and checker returned `6/6 VERIFIED`.
8. NOT LIVE VERIFIED: live article JSON-LD, Rich Results and public screenshots still require deploy/pull and cache clear.
9. NEXT: build `/about/editorial-policy/`, Ben entity page and Maya profile enrichment only after owner-approved facts and external links.

### ACTION-SUPPLIER-MARKETPLACE-PROSPECT-RESEARCH-001: Complete first 30 supplier research queue and exposure rules
**Status:** COMPLETED / VERIFIED RESEARCH / VERIFIED LOCAL CSV / READY FOR OWNER ENTRY / NO OUTREACH
**Why:** T370 needed the supplier marketplace pipeline to move from generic categories into an owner-usable first prospect queue with strict rules before any lawyer-dashboard or public exposure.
**Actions:**
1. DONE: created `project-control/supplier-marketplace-prospect-research-2026-05-22.md`.
2. DONE: created `project-control/supplier-marketplace-prospect-research-2026-05-22.csv`.
3. DONE: updated `project-control/supplier-marketplace-outreach-playbook-2026-05-20.md`.
4. DONE: updated `project-control/lawyer-platform-product-spine-2026-05-20.md`.
5. VERIFIED RESEARCH: reviewed current public PsakDin, Din and provider/company pages for translation/notary, office-space, legal-marketing, legal-tech, courier/filing and expert/private-investigation candidates.
6. VERIFIED LOCAL: CSV parses with `30` rows and expected category counts.
7. VERIFIED PLANNING: no supplier can appear in the lawyer dashboard until status is `approved`, owner evidence exists, paid placement disclosure is written and lawyer data sharing stays owner-reviewed.
8. NOT LIVE VERIFIED: no live Supplier CPT record, dashboard offer, public supplier page or outreach message was created.
9. NEXT OWNER ACTION: choose the first 10 candidates, verify direct source/contact outside competitor listings, then manually enter approved research records in wp-admin `Suppliers`.

### ACTION-PROJECT-TIMING-ACCELERATION-001: Maintain content upload timing and acceleration estimate
**Status:** COMPLETED / VERIFIED PLANNING / ESTIMATE ONLY / PUBLIC EXECUTION BLOCKED / NO PUBLIC CHANGES
**Why:** T247 needed a blocker-aware answer to the overall content upload timing question so the project can keep momentum without treating full legacy migration as a prerequisite for Family/Divorce publication.
**Actions:**
1. DONE: created `project-control/project-timing-acceleration-resources-2026-05-22.md`.
2. DONE: created `project-control/project-timing-acceleration-resources-2026-05-22.csv`.
3. DONE: updated the upload governance and owner action queue references.
4. VERIFIED PLANNING: first narrow Family/Divorce visible repair is about `0.5-1 operator day` after owner approval, actual CMS rollback backup and focused GSC or owner-approved substitute.
5. VERIFIED PLANNING: complete Family/Divorce controlled current-URL upload package is about `2-4 operator days` after owner/legal/source decisions, GSC evidence and rollback backup.
6. VERIFIED PLANNING: all priority clusters to controlled upload-ready state are about `2-4 focused weeks` if owner/GSC/CMS gates are available, or `4-8+ calendar weeks` under current blocker pattern.
7. BLOCKED PUBLIC EXECUTION: the estimate does not approve CMS upload, URL migration, redirect, canonical/noindex, sitemap, taxonomy, internal-link write, lawyer card, lead/CRM, payment, GA4/GSC setting, wp-admin or uPress action.
8. NEXT: owner completes GSC OAuth/API setup and selects whether to start with Family/Divorce visible repair or broader current-URL body updates after approval and rollback backup.

### ACTION-GOOGLE-BUSINESS-MARKETING-ECOSYSTEM-001: Complete Google Business marketing ecosystem strategy
**Status:** COMPLETED / VERIFIED RESEARCH / VERIFIED PLANNING / ACCOUNT EXECUTION BLOCKED / NO PUBLIC CHANGES
**Why:** T246 required one strategy connecting Google Business Profile, GA4 events, lead tracking, lawyer onboarding funnel, campaign readiness and off-site visibility before any account or public implementation work.
**Actions:**
1. DONE: created `project-control/google-business-marketing-ecosystem-strategy-2026-05-22.md`.
2. DONE: created `project-control/google-business-marketing-ecosystem-strategy-2026-05-22.csv`.
3. DONE: updated `project-control/google-reviews-integration-plan.md`.
4. DONE: updated `project-control/google-reviews-reputation-system-2026-05-20.md`.
5. DONE: updated `project-control/reputation-product-roadmap.md`.
6. DONE: updated `project-control/ga4-analytics-review.md`.
7. DONE: updated `project-control/lawyer-acquisition-first-wave-2026-05-20.md`.
8. VERIFIED RESEARCH: reviewed official Google Business Profile guidance for profile edits, local ranking, review requests/replies, performance metrics, Performance API and Reviews API.
9. VERIFIED PLANNING: safest MVP remains source-verified/manual GBP data and review links, with first-party recommendations kept separate from Google content.
10. BLOCKED ACCOUNT EXECUTION: no Google Business Profile setting, GA4 setting, GSC setting, OAuth/API connection, review import, SMS/email outreach, public review display, schema, CRM, wp-admin or uPress action is approved.
11. NEXT: create owner-private GBP evidence checklist outside Git if account screenshots/exports are involved; repo-side next safe task is GA4 event/UTM implementation planning for GBP and reputation flows.

### ACTION-HOMEPAGE-LINE-BY-LINE-BUSINESS-REVIEW-001: Complete section-by-section homepage business and SEO review
**Status:** COMPLETED / VERIFIED LOCAL / VERIFIED PLANNING / PUBLIC EXECUTION BLOCKED / NO PUBLIC CHANGES
**Why:** T243 required a line-by-line homepage review for Google signal, user legal-help signal, lawyer onboarding signal, links, CTAs and mobile/business structure after the competitor-aligned strategy pass.
**Actions:**
1. DONE: created `project-control/homepage-line-by-line-business-review-2026-05-22.md`.
2. DONE: created `project-control/homepage-line-by-line-business-review-2026-05-22.csv`.
3. DONE: updated `project-control/homepage-seo-strategy.md`.
4. DONE: updated `project-control/homepage-seo-design-alignment.md`.
5. VERIFIED LOCAL: reviewed `front-page.php` and the 12 included section templates.
6. VERIFIED PLANNING: homepage stack is directionally correct and should not be rebuilt before a smaller copy/link QA batch.
7. VERIFIED PLANNING: highest risks are featured-lawyer approval/labeling, chronological latest-article leakage, taxonomy-count ordering, trust-process copy and lead/route QA.
8. BLOCKED PUBLIC EXECUTION: no homepage template, copy, title/H1/meta, URL, redirect, canonical/noindex, sitemap, taxonomy, lawyer card, lead/CRM, payment, wp-admin or uPress action is approved.
9. NEXT: if owner approves, prepare exact no-URL-change copy/link QA for hero/search, intent pyramid, practice-area priority, featured lawyer boundaries, latest-articles replacement plan, trust copy and final CTA wording.

### ACTION-HOMEPAGE-COMPETITOR-ALIGNED-STRATEGY-001: Complete competitor-aligned homepage strategy pass
**Status:** COMPLETED / VERIFIED RESEARCH / VERIFIED LOCAL / PUBLIC EXECUTION BLOCKED / NO PUBLIC CHANGES
**Why:** The homepage already has a strong portal stack, but T244 required current competitor alignment so later homepage edits follow proven legal portal patterns without copying or adding clutter.
**Actions:**
1. DONE: created `project-control/homepage-competitor-aligned-strategy-2026-05-22.md`.
2. DONE: created `project-control/homepage-competitor-aligned-strategy-2026-05-22.csv`.
3. DONE: updated `project-control/homepage-seo-strategy.md`.
4. DONE: updated `project-control/homepage-seo-design-alignment.md`.
5. VERIFIED RESEARCH: reviewed current Din, PsakDin, Mishpati and Justia source pages/search results.
6. VERIFIED LOCAL: `front-page.php` already has the right broad structure; next work should refine section jobs, not rebuild.
7. RECOMMENDED: keep search-first directory entry, curated commercial priority, editorial proof, measured lawyer value and clear paid-placement boundaries.
8. BLOCKED PUBLIC EXECUTION: no homepage template, copy, title/H1/meta, URL, redirect, canonical/noindex, sitemap, taxonomy, lawyer card, lead/CRM, payment, wp-admin or uPress action is approved.
9. NEXT: owner-approved no-URL-change copy/link QA for hero, trust/disclaimer, curated guides, featured lawyers fallback and lawyer CTA.

### ACTION-LAWYER-PROSPECT-PRIVATE-LIST-VALIDATOR-001: Validate owner-filled first-20 lawyer prospect CSV outside Git
**Status:** COMPLETED / FIXED TOOLING / VERIFIED LOCAL / PRIVATE DATA NOT STORED / NO OUTREACH
**Why:** T366 was blocked on the owner creating a private first-20 lawyer prospect list. The repo should not contain real lawyer names, phone numbers, emails or contact-source notes, so the useful repo-side work is a validator that checks the private file without committing private data.
**Actions:**
1. DONE: created `tools/validate-lawyer-prospect-private-list.ps1`.
2. DONE: created `project-control/lawyer-prospect-private-list-validator-2026-05-22.md`.
3. DONE: created `project-control/lawyer-prospect-private-list-validator-2026-05-22.csv`.
4. DONE: generated sanitized validation report `reports/lawyer-prospect-private-list-template-validation-2026-05-22.csv`.
5. DONE: updated `project-control/lawyer-acquisition-first-wave-2026-05-20.md`.
6. VERIFIED LOCAL: blank first-wave template passed validation in `-TemplateMode` with `20` rows, `0` errors and `0` warnings.
7. VERIFIED PRIVACY: the script blocks filled private CSV paths inside the repo by default and report output includes row numbers/issue codes only.
8. BLOCKED OWNER ACTION: owner still needs to fill the real first-20 list outside Git and manually enter validated prospects in WordPress admin.
9. BLOCKED PUBLIC EXECUTION: no prospect record, lawyer record, lead record, payment setting, CRM action or outreach message was created.

### ACTION-CONTENT-UPLOAD-GOVERNANCE-CHECKLIST-001: Convert staged publishing strategy into a hard upload gate
**Status:** COMPLETED / VERIFIED PLANNING / BLOCKED PUBLIC EXECUTION / NO PUBLIC CHANGES
**Why:** Cluster-by-cluster publishing is the right operating model, but it needs one non-ambiguous gate so faster Family/Divorce, Criminal and Medical work does not accidentally approve URL migration, redirects, canonicals/noindex, sitemap, taxonomy or internal-link changes.
**Actions:**
1. DONE: created `project-control/content-upload-governance-checklist-2026-05-22.md`.
2. DONE: created `project-control/content-upload-governance-checklist-2026-05-22.csv`.
3. DONE: updated `project-control/priority-owner-action-queue-2026-05-22.md`.
4. DONE: updated `project-control/cluster-by-cluster-publishing-strategy-2026-05-12.md`.
5. VERIFIED PLANNING: checklist defines `15` gates from cluster selection through rollback/hold.
6. VERIFIED PLANNING: checklist keeps current-URL visible repair/current-URL updates separate from later clean English slug migration.
7. VERIFIED PLANNING: Family/Divorce remains first, with only narrow current-URL visible repair as the first safe public-action candidate after owner approval, rollback backup, focused GSC and post-repair QA.
8. BLOCKED PUBLIC EXECUTION: `0` clusters are approved for upload by this checklist.
9. NEXT: use this checklist during the Family/Divorce owner review after GSC OAuth/export and before any public CMS work.

### ACTION-CRIMINAL-SOURCE-LEGAL-REVIEW-WORKSHEET-001: Add page-level review gate for Criminal first-upload drafts
**Status:** COMPLETED / VERIFIED PLANNING / READY FOR OWNER LEGAL SOURCE REVIEW / EXECUTION BLOCKED / NO PUBLIC CHANGES
**Why:** The Criminal first-upload draft and metadata set is complete, but it needed a page-level owner/legal/source worksheet like the Medical Malpractice gate before any current-URL CMS update can be considered.
**Actions:**
1. DONE: created `project-control/criminal-source-legal-review-worksheet-2026-05-22.md`.
2. DONE: created `project-control/criminal-source-legal-review-worksheet-2026-05-22.csv`.
3. DONE: linked the worksheet from `project-control/criminal-first-upload-metadata-package-2026-05-22.md`.
4. DONE: linked the worksheet from `project-control/criminal-owner-review-packet-2026-05-22.md`.
5. VERIFIED PLANNING: worksheet covers `/criminal-defense-attorney/`, the police-investigation current URL, `/detention-before-charge-or-trial/`, the current indictment article, `/drug-offenses-criminal-lawyer/` and a cluster-wide disclaimer/lead/schema gate.
6. VERIFIED PLANNING: `0/6` rows are approved for upload.
7. VERIFIED PLANNING: rows isolate allowed claims, blocked claims, source status, risk level and required pre-upload checks.
8. BLOCKED: owner/legal/source review, WordPress rollback backup and focused GSC remain required before public CMS work.
9. BLOCKED PUBLIC EXECUTION: this does not approve CMS upload, URL migration, redirects, canonicals/noindex, sitemap, taxonomy, internal-link writes, lawyer, lead, CRM or uPress action.
10. NEXT: owner marks each Criminal row `APPROVE_CURRENT_URL_UPDATE`, `EDIT_REQUIRED`, `HOLD` or `LEGAL_REVIEW_REQUIRED`.

### ACTION-GSC-OWNER-EXECUTION-PACKET-001: Prepare one ordered owner command packet for GSC setup/export/validation
**Status:** COMPLETED / VERIFIED PLANNING / READY FOR OWNER SETUP / PUBLIC EXECUTION BLOCKED / NO PUBLIC CHANGES
**Why:** The GSC setup guide, preflight, priority runner and output validator now exist, but the owner needs one ordered command path that avoids partial or out-of-order execution before upload decisions.
**Actions:**
1. DONE: created `project-control/gsc-owner-execution-packet-2026-05-22.md`.
2. DONE: created `project-control/gsc-owner-execution-packet-2026-05-22.csv`.
3. DONE: linked the packet from `project-control/gsc-api-setup-guide.md`.
4. DONE: linked the packet from `tools/gsc/README.md`.
5. VERIFIED PLANNING: packet covers credential storage outside Git, `GSC_OAUTH_CLIENT_PATH`, `GSC_TOKEN_PATH`, preflight, priority dry run, real read-only export and strict output validation.
6. VERIFIED PLANNING: success state is `VERIFIED_EXPORT_OUTPUTS_READY_FOR_OWNER_REVIEW`.
7. BLOCKED: real export still requires owner OAuth setup and Search Console access to `https://jus-tice.co.il/`.
8. BLOCKED PUBLIC EXECUTION: this does not approve CMS upload, URL migration, redirects, canonicals/noindex, sitemap, taxonomy, internal-link writes, lawyer, lead, CRM or uPress action.
9. NEXT: owner follows the packet commands; if validator passes, review Family/Divorce visible repair approval and CMS rollback evidence before any public action.

### ACTION-GSC-PRIORITY-OUTPUT-VALIDATOR-001: Validate priority GSC export outputs before upload decisions
**Status:** COMPLETED / FIXED TOOLING / VERIFIED LOCAL / BLOCKED UNTIL REAL GSC EXPORT / NO PUBLIC CHANGES
**Why:** After OAuth setup, the next failure mode is using missing, malformed or baseline-only Search Console artifacts as if they were real focused export evidence. A strict output validator makes the owner/operator gate fast and explicit before CMS upload or URL decisions.
**Actions:**
1. DONE: created `tools/gsc/check-priority-gsc-export-output.ps1`.
2. DONE: created `project-control/gsc-priority-export-output-validator-2026-05-22.md`.
3. DONE: created `project-control/gsc-priority-export-output-validator-2026-05-22.csv`.
4. DONE: updated `tools/gsc/README.md`.
5. DONE: updated `project-control/gsc-api-setup-guide.md`.
6. VERIFIED LOCAL: validator ran for Family/Divorce, Criminal Law and Medical Malpractice.
7. VERIFIED LOCAL: current result is `BLOCKED_EXPORT_VALIDATION` with `21` blocked rows because real focused export folders are still missing.
8. VERIFIED LOCAL: existing decision-map CSVs parse, but their summaries are blocked as baseline/cache/dashboard maps, not `FOCUSED_GSC_EXPORT`.
9. NEXT: after owner OAuth setup, run `.\tools\gsc\run-priority-cluster-gsc-exports.ps1`, then `.\tools\gsc\check-priority-gsc-export-output.ps1 -WriteReport`. Do not treat decision maps as upload evidence until the validator returns `VERIFIED_EXPORT_OUTPUTS_READY_FOR_OWNER_REVIEW`.

### ACTION-GSC-OAUTH-PREFLIGHT-001: Add local GSC OAuth preflight checker
**Status:** COMPLETED / FIXED TOOLING / VERIFIED LOCAL / OWNER OAUTH BLOCKED / NO PUBLIC CHANGES
**Why:** The next owner-controlled blocker is GSC OAuth setup. A preflight checker reduces setup failures by validating credential paths, token hygiene, Node dependencies and priority-runner wiring before any OAuth browser or Search Console API call.
**Actions:**
1. DONE: created `tools/gsc/check-gsc-oauth-preflight.ps1`.
2. DONE: created `project-control/gsc-oauth-preflight-runbook-2026-05-22.md`.
3. DONE: created `project-control/gsc-oauth-preflight-runbook-2026-05-22.csv`.
4. DONE: updated `tools/gsc/README.md`.
5. DONE: updated `project-control/gsc-api-setup-guide.md`.
6. VERIFIED LOCAL: running without credential env vars returns `BLOCKED_PRECHECK` for missing OAuth and token paths.
7. VERIFIED LOCAL: running with local ignored paths and `-RunPriorityDryRun` returns `VERIFIED_PRECHECK_READY`.
8. VERIFIED LOCAL: dry-run wiring covered Family/Divorce, Criminal Law and Medical Malpractice and opened no OAuth browser, made no API call and changed no public site data.
9. NEXT: owner creates/saves OAuth Desktop credentials outside Git, sets `GSC_OAUTH_CLIENT_PATH` and `GSC_TOKEN_PATH`, runs the preflight, then runs the priority cluster export.

### ACTION-PRIORITY-OWNER-ACTION-QUEUE-001: Consolidate upload-blocking owner/operator gates
**Status:** COMPLETED / VERIFIED LOCAL / BLOCKED BEFORE CONTENT UPLOAD / NO PUBLIC CHANGES
**Why:** Family/Divorce, Criminal Law and Medical Malpractice now have multiple planning packets, GSC runners and review gates. The next useful acceleration is a single owner/operator queue that tells exactly what must happen before any content upload, URL migration, redirect, canonical/noindex, sitemap or internal-link action.
**Actions:**
1. DONE: created `tools/build-priority-owner-action-queue.mjs`.
2. DONE: generated `reports/priority-owner-action-queue-2026-05-22.csv`.
3. DONE: generated `reports/priority-owner-action-queue-2026-05-22.json`.
4. DONE: created `project-control/priority-owner-action-queue-2026-05-22.md`.
5. DONE: created `project-control/priority-owner-action-queue-2026-05-22.csv`.
6. VERIFIED LOCAL: Node syntax check passed.
7. VERIFIED LOCAL: queue generation produced `10` owner/operator action rows from `139` reviewed source rows.
8. BLOCKED: all `10/10` action rows remain blocked until owner/operator prerequisites clear.
9. NEXT: owner completes read-only GSC OAuth setup outside Git, runs the priority cluster export runner, then reviews Family/Divorce visible-repair approval and CMS rollback evidence before any public action.

### ACTION-GSC-PRIORITY-CLUSTER-RUNNER-001: Add one-command runner for priority GSC exports
**Status:** COMPLETED / FIXED TOOLING / VERIFIED LOCAL DRY RUN / OWNER OAUTH BLOCKED / NO PUBLIC CHANGES
**Why:** Family/Divorce, Criminal Law and Medical Malpractice all need focused GSC data before URL, redirect, canonical, noindex, sitemap and upload decisions. Running them one by one is slower and easier to miss, so a single priority runner reduces operator friction after OAuth setup.
**Actions:**
1. DONE: created `tools/gsc/run-priority-cluster-gsc-exports.ps1`.
2. DONE: created `project-control/gsc-priority-cluster-export-runner-2026-05-22.md`.
3. DONE: created `project-control/gsc-priority-cluster-export-runner-2026-05-22.csv`.
4. DONE: updated `project-control/gsc-api-setup-guide.md`.
5. DONE: updated `tools/gsc/README.md`.
6. VERIFIED LOCAL: dry run completed for Family/Divorce, Criminal Law and Medical Malpractice without OAuth browser or GSC API call.
7. VERIFIED LOCAL: dry-run scope covers `7` Family/Divorce targets, `5` Criminal targets, `1` Medical Malpractice primary target and `67` query terms.
8. BLOCKED: full GSC export still requires owner OAuth setup and read-only Search Console access.
9. NEXT: after owner credentials are saved outside Git, run `.\tools\gsc\run-priority-cluster-gsc-exports.ps1`, then review generated decision maps before any public action.

### ACTION-FAMILY-LAW-LIVE-REPAIR-READINESS-GATE-001: Consolidate live repair go/no-go gate
**Status:** COMPLETED / VERIFIED LOCAL / BLOCKED NOT READY FOR CONTENT UPLOAD / NO PUBLIC CHANGES
**Why:** The Family/Divorce visible repair package now has safety checks, diagnostics, field map, backup template, owner worksheet and operator packet. The next useful control artifact is a single readiness gate showing whether the cluster is safe to upload or repair publicly.
**Actions:**
1. DONE: created `tools/build-family-law-live-repair-readiness-gate.mjs`.
2. DONE: generated `reports/family-law-live-repair-readiness-gate-2026-05-22.csv`.
3. DONE: generated `reports/family-law-live-repair-readiness-gate-2026-05-22.json`.
4. DONE: created `project-control/family-law-live-repair-readiness-gate-2026-05-22.md`.
5. DONE: created `project-control/family-law-live-repair-readiness-gate-2026-05-22.csv`.
6. DONE: linked the readiness gate from `project-control/family-law-live-repair-operator-packet-2026-05-22.md`.
7. VERIFIED LOCAL: Node syntax check passed and the gate generated `8` critical gate rows from `95` reviewed source rows.
8. VERIFIED LOCAL: all `8/8` gates are `BLOCKED`; the consolidated source artifacts contain `123` blocked markers and `31` pending markers.
9. BLOCKED: Family/Divorce is not upload-safe until owner approval, actual CMS rollback backup, focused GSC export, approved visible repair execution and post-repair QA are complete.
10. NEXT: owner records approval/hold, operator captures WordPress rollback material, then only approved current-URL visible repairs can be executed and rechecked.

### ACTION-FAMILY-LAW-LIVE-REPAIR-OWNER-APPROVAL-001: Prepare owner approval worksheet for visible repair
**Status:** COMPLETED / VERIFIED PLANNING / READY FOR OWNER REVIEW / PUBLIC EXECUTION BLOCKED / NO PUBLIC CHANGES
**Why:** The repair packet, field map and backup template are ready, but the owner still needs a narrow approval sheet that cannot be mistaken for full content upload, URL migration or SEO consolidation approval.
**Actions:**
1. DONE: created `project-control/family-law-live-repair-owner-approval-2026-05-22.md`.
2. DONE: created `project-control/family-law-live-repair-owner-approval-2026-05-22.csv`.
3. DONE: linked the approval worksheet from `project-control/family-law-live-repair-operator-packet-2026-05-22.md`.
4. VERIFIED LOCAL: CSV parses and contains `13` approval/gate rows.
5. VERIFIED PLANNING: worksheet covers the global visible-repair scope, backup requirement, `/divorce-agreement/` shortcode/PDF/H1 repairs, H1 repairs for both divorce-lawyer candidates and support pages, GSC-gated SEO consolidation, protected assets and post-repair QA.
6. VERIFIED PLANNING: owner approval language explicitly blocks URL migration, redirects, canonicals/noindex, sitemap, taxonomy, related-card writes, protected-asset handling, full content upload, lawyer, lead, CRM and uPress changes.
7. BLOCKED: no public CMS edit, PDF upload, URL change, redirect, canonical/noindex, sitemap, taxonomy, related-card, lawyer, lead or CRM action is approved by this worksheet.
8. NEXT: owner records approval or hold; if approved, operator captures actual CMS rollback material, repairs only approved visible current-URL defects, reruns safety/diagnostics scripts and captures screenshots.

### ACTION-FAMILY-LAW-LIVE-REPAIR-CMS-BACKUP-TEMPLATE-001: Prepare CMS rollback backup template for visible repair
**Status:** COMPLETED / VERIFIED PLANNING / READY FOR OPERATOR PREP / PUBLIC EXECUTION BLOCKED / NO PUBLIC CHANGES
**Why:** The visible repair field map is ready, but public execution must still be blocked until an operator captures exact rollback material from WordPress. This template defines the minimum backup evidence needed before touching live Family/Divorce pages.
**Actions:**
1. DONE: created `project-control/family-law-live-repair-cms-backup-template-2026-05-22.md`.
2. DONE: created `project-control/family-law-live-repair-cms-backup-template-2026-05-22.csv`.
3. DONE: linked the backup template from `project-control/family-law-live-repair-operator-packet-2026-05-22.md`.
4. VERIFIED LOCAL: CSV parses and contains `14` backup/checklist rows.
5. VERIFIED PLANNING: worksheet covers owner authorization, rollback storage hygiene, six affected current URLs, `/divorce-agreement/` shortcode/PDF media capture, divorce-lawyer SEO field freeze, visual baseline, post-repair QA, rollback method and repo-boundary safety.
6. VERIFIED PLANNING: per-page backup requires post ID, title, slug, permalink, body, SEO fields, canonical, robots, taxonomy, media, related fields, revision ID, screenshots, owner decision and rollback location.
7. BLOCKED: this does not approve public CMS edits, PDF uploads, URL changes, redirects, canonical/noindex changes, sitemap changes, taxonomy edits, internal-link rewrites, lawyer, lead or CRM action.
8. NEXT: owner approves or holds visible current-URL repairs; if approved, operator captures this rollback material first, repairs only approved visible defects, reruns safety/diagnostics scripts and captures screenshots.

### ACTION-FAMILY-LAW-VISIBLE-REPAIR-FIELD-MAP-001: Prepare exact field-level visible repair map
**Status:** COMPLETED / VERIFIED PLANNING / READY FOR OWNER REVIEW / PUBLIC EXECUTION BLOCKED / NO PUBLIC CHANGES
**Why:** The diagnostics identify live H1 and shortcode/PDF issues, but an operator needs exact field-level instructions before opening the CMS. This map tells which H1 to keep, which headings to demote/remove, and how to handle the broken agreement page CTA/PDF.
**Actions:**
1. DONE: created `project-control/family-law-visible-repair-field-map-2026-05-22.md`.
2. DONE: created `project-control/family-law-visible-repair-field-map-2026-05-22.csv`.
3. DONE: linked the field map from `project-control/family-law-live-repair-operator-packet-2026-05-22.md`.
4. VERIFIED LOCAL: CSV parses and contains `10` rows.
5. VERIFIED PLANNING: `8` rows are `BLOCKED_OWNER_APPROVAL`, `1` row is `BLOCKED_GSC_OWNER_DECISION`, and `1` row is `BLOCKED_UNTIL_REPAIR`.
6. VERIFIED PLANNING: field map covers `/divorce-agreement/`, `/divorce-lawyer/`, `/lawyer-divorce-guide-proceedings-costs-rights/`, `/child-support/`, `/child-custody/` and `/divorce-mediation/`.
7. BLOCKED: no public H1, shortcode, PDF, URL, canonical, redirect, noindex, sitemap, taxonomy, related-card, lawyer, lead or CRM action is approved.
8. NEXT: owner reviews visible repair approval; after approval and CMS rollback backup, operator repairs current URLs only, reruns safety/diagnostics scripts and captures screenshots.

### ACTION-FAMILY-LAW-LIVE-REPAIR-DIAGNOSTICS-001: Capture exact live repair diagnostics
**Status:** COMPLETED / FIXED TOOLING / VERIFIED LOCAL / VERIFIED LIVE READ-ONLY / PUBLIC EXECUTION BLOCKED
**Why:** The repair packet identified which pages are blocked, but the operator also needs exact live H1 texts, raw shortcode context, canonical/robots state and PDF candidate status before touching the CMS.
**Actions:**
1. DONE: created `tools/extract-family-law-live-repair-diagnostics.mjs`.
2. DONE: generated `reports/family-law-live-repair-diagnostics-2026-05-22.csv`.
3. DONE: generated `reports/family-law-live-repair-diagnostics-2026-05-22.json`.
4. DONE: created `project-control/family-law-live-repair-diagnostics-2026-05-22.md`.
5. DONE: created `project-control/family-law-live-repair-diagnostics-2026-05-22.csv`.
6. DONE: linked diagnostics from `project-control/family-law-live-repair-operator-packet-2026-05-22.md`.
7. VERIFIED LOCAL: Node syntax check passed.
8. VERIFIED LIVE READ-ONLY: fetched `6` Family/Divorce HTML pages and `3` PDF candidates.
9. VERIFIED LIVE READ-ONLY: diagnostics produced `9` rows, with `6` H1 issue rows, `1` raw-shortcode row and `0` working PDF candidates.
10. BLOCKED: this does not approve CMS repair, PDF upload, redirect, canonical/noindex, sitemap, taxonomy, related-card, lawyer, lead or CRM action.
11. NEXT: owner/operator uses the diagnostics after approval and rollback backup to repair `/divorce-agreement/` shortcode/PDF issues and H1/template issues; run focused GSC before divorce-lawyer canonical consolidation.

### ACTION-FAMILY-LAW-LIVE-REPAIR-OPERATOR-PACKET-001: Prepare controlled live repair packet
**Status:** COMPLETED / VERIFIED PLANNING / READY FOR OWNER OPERATOR REVIEW / PUBLIC EXECUTION BLOCKED / NO PUBLIC CHANGES
**Why:** The live safety checker identified concrete production defects, but the previous Family/Divorce upload runbook covered planned content upload, not repair of already-live shortcode/PDF/H1/canonical blockers. This packet separates visible current-URL repairs from SEO consolidation.
**Actions:**
1. DONE: created `project-control/family-law-live-repair-operator-packet-2026-05-22.md`.
2. DONE: created `project-control/family-law-live-repair-operator-packet-2026-05-22.csv`.
3. VERIFIED LOCAL: CSV parses and contains `20` operator rows.
4. VERIFIED PLANNING: `1` row is `READY_FOR_OPERATOR_PREP`; `19` rows remain `BLOCKED`.
5. VERIFIED PLANNING: visible repair work is limited to existing URLs after owner approval and CMS rollback backup.
6. VERIFIED PLANNING: `/divorce-agreement/` shortcode/PDF repair and H1/template repairs are separated from canonical/redirect/noindex/sitemap decisions.
7. BLOCKED: divorce-lawyer canonical consolidation remains blocked until focused Family/Divorce GSC export and owner decision.
8. BLOCKED: no public CMS edit, PDF upload, URL change, redirect, canonical/noindex, sitemap, taxonomy, related-card, lawyer, lead or CRM action is approved.
9. NEXT: owner chooses whether to approve visible current-URL repairs only; if approved, operator captures rollback material, repairs `/divorce-agreement/` and H1/template issues, reruns `tools/check-family-law-live-safety.mjs`, then captures screenshots.

### ACTION-FAMILY-LAW-LIVE-SAFETY-CHECKER-001: Add repeatable live-read-only Family Law safety checker
**Status:** COMPLETED / FIXED TOOLING / VERIFIED LOCAL / VERIFIED LIVE READ-ONLY / PUBLIC EXECUTION BLOCKED
**Why:** The Family/Divorce cluster now has already-live public pages with duplicate pillar risk, shortcode/PDF failure and H1/template hygiene issues. Before further upload, the blockers need a repeatable read-only checker so repairs can be verified consistently.
**Actions:**
1. DONE: created `tools/check-family-law-live-safety.mjs`.
2. DONE: generated `reports/family-law-live-safety-check-2026-05-22.csv`.
3. DONE: generated `reports/family-law-live-safety-check-2026-05-22.json`.
4. DONE: created `project-control/family-law-live-safety-check-2026-05-22.md`.
5. DONE: created `project-control/family-law-live-safety-check-2026-05-22.csv`.
6. VERIFIED LOCAL: Node syntax check passed.
7. VERIFIED LIVE READ-ONLY: checker fetched `6` public Family/Divorce HTML URLs and `3` PDF asset candidate URLs.
8. BLOCKED: checker produced `11/11` blocked-or-review rows and `8` critical blockers.
9. BLOCKED: `/lawyer-divorce-guide-proceedings-costs-rights/` and `/divorce-lawyer/` are both indexable self-canonical divorce-lawyer candidates.
10. BLOCKED: `/divorce-agreement/` exposes raw shortcodes and no tested PDF candidate works.
11. NEXT: run focused Family/Divorce GSC export, owner chooses canonical divorce-lawyer URL, then repair shortcode/PDF/H1 issues and rerun the checker before any further public upload, redirect, canonical/noindex or sitemap action.

### ACTION-FAMILY-LAW-LIVE-PUBLISH-SAFETY-001: Harden Family Law publisher and isolate live blockers
**Status:** COMPLETED / FIXED REPO SAFETY / VERIFIED LOCAL / VERIFIED LIVE READ-ONLY / PUBLIC EXECUTION BLOCKED
**Why:** A recent Family Law publishing artifact can create or update production WordPress pages and the live site now has two indexable divorce-lawyer URLs plus a divorce-agreement page with broken public shortcodes. This must be controlled before more cluster upload work.
**Actions:**
1. DONE: hardened `reports/semrush/publish-family-law-pages.js` so normal execution is dry-run only.
2. DONE: live writes now require `ALLOW_WP_PUBLISH=YES` and `WP_APP_PASSWORD_JSON`.
3. DONE: replaced hardcoded user-machine paths with repo-relative/env-driven paths.
4. DONE: created `project-control/family-law-live-publish-safety-review-2026-05-22.md`.
5. DONE: created `project-control/family-law-live-publish-safety-review-2026-05-22.csv`.
6. VERIFIED LOCAL: Node syntax check passed.
7. VERIFIED LOCAL: dry run reported the two Family pages without reading credentials or making a network request.
8. VERIFIED LIVE READ-ONLY: `9` public URLs/resources were checked.
9. BLOCKED: `/lawyer-divorce-guide-proceedings-costs-rights/` and `/divorce-lawyer/` are both live, indexable and self-canonical.
10. BLOCKED: `/divorce-agreement/` exposes raw shortcode output and the referenced PDF asset was not found at tested upload paths.
11. NEXT: owner decides the divorce-lawyer canonical URL strategy, then run focused GSC export before any redirect/canonical/noindex/slug action; separately repair the divorce-agreement shortcode/PDF issue before treating the page as final.

### ACTION-MEDICAL-MALPRACTICE-SOURCE-LEGAL-WORKSHEET-001: Prepare page-level source/legal/privacy review gate
**Status:** COMPLETED / VERIFIED PLANNING / READY FOR OWNER LEGAL SOURCE REVIEW / EXECUTION BLOCKED / NO PUBLIC CHANGES
**Why:** The Medical Malpractice metadata package needed a page-level source/legal/privacy worksheet before any upload approval. This reduces the risk of publishing unsupported medical causation, deadline, fee, expert-opinion, birth/pregnancy or sensitive health-data claims.
**Actions:**
1. DONE: created `project-control/medical-malpractice-source-legal-review-worksheet-2026-05-22.md`.
2. DONE: created `project-control/medical-malpractice-source-legal-review-worksheet-2026-05-22.csv`.
3. VERIFIED LOCAL: CSV parses and contains `10` review rows.
4. VERIFIED LOCAL: rows cover `9` first-upload metadata pages and `1` cluster-wide privacy/lead-form gate.
5. VERIFIED PLANNING: `0/10` rows are approved for upload.
6. VERIFIED PLANNING: each row defines source anchors, allowed-after-review language, blocked claims/actions, privacy risk, reviewer decision and next step.
7. BLOCKED: owner/legal/source/privacy review, duplicate `/medical-malpractice-lawyer/` CMS identity decision, focused GSC export and WordPress rollback backup are still required before public CMS work.
8. NEXT: owner assigns reviewers and marks rows `APPROVE_CURRENT_URL_UPDATE`, `EDIT_REQUIRED`, `HOLD`, `LEGAL_REVIEW_REQUIRED` or `PRIVACY_REVIEW_REQUIRED`; no upload until all blockers are cleared.

### ACTION-MEDICAL-MALPRACTICE-FIRST-UPLOAD-METADATA-PACKAGE-001: Prepare current-URL-only metadata package
**Status:** COMPLETED / VERIFIED PLANNING / READY FOR OWNER REVIEW / EXECUTION BLOCKED / NO PUBLIC CHANGES
**Why:** Medical Malpractice now has readiness, owner decision, GSC workflow, duplicate identity and operator-runbook artifacts, but it still needed field-level CMS values so owner/legal/source review can happen without ad hoc title, meta, breadcrumb, schema or internal-link decisions during upload.
**Actions:**
1. DONE: created `project-control/medical-malpractice-first-upload-metadata-package-2026-05-22.md`.
2. DONE: created `project-control/medical-malpractice-first-upload-metadata-package-2026-05-22.csv`.
3. VERIFIED LOCAL: CSV parses and contains `9` metadata rows.
4. VERIFIED LOCAL: `0/9` rows are upload-approved.
5. VERIFIED PLANNING: rows cover the duplicate pillar candidate, protected cost support, informational support, surgery/anesthesia support, birth-injury parent support and protected old birth/pregnancy asset.
6. VERIFIED PLANNING: rows keep current URLs only and block future clean slugs, redirects, canonicals/noindex, sitemap changes, taxonomy edits, related-card writes, schema expansion and CMS execution.
7. BLOCKED: owner/legal/source review, authoritative `/medical-malpractice-lawyer/` CMS identity decision, focused GSC export and WordPress rollback backup are still required before public CMS work.
8. NEXT: owner marks each row `APPROVE_CURRENT_URL_UPDATE`, `EDIT_REQUIRED`, `HOLD` or `LEGAL_REVIEW_REQUIRED`; do not upload until the duplicate identity and GSC gates are resolved.

### ACTION-MEDICAL-MALPRACTICE-CMS-IDENTITY-OPERATOR-RUNBOOK-001: Prepare inspection-only operator runbook for duplicate CMS identity
**Status:** COMPLETED / VERIFIED PLANNING / READY FOR OPERATOR PREP / EXECUTION BLOCKED / NO PUBLIC CHANGES
**Why:** The duplicate identity review identified the blocker, but the operator still needs exact inspection, backup and decision steps before any Medical Malpractice upload. This runbook converts the blocker into a controlled wp-admin/database verification workflow without authorizing public changes.
**Actions:**
1. DONE: created `project-control/medical-malpractice-cms-identity-operator-runbook-2026-05-22.md`.
2. DONE: created `project-control/medical-malpractice-cms-identity-operator-runbook-2026-05-22.csv`.
3. VERIFIED LOCAL: CSV contains `9` operator checklist rows.
4. VERIFIED PLANNING: runbook covers inspection authorization, rollback evidence for IDs `11607` and `1130`, served-record verification, field comparison, allowed owner decisions, GSC gate, source/legal gate and upload boundary.
5. VERIFIED PLANNING: runbook blocks editor saves, publishing, slug changes, redirects, canonical/noindex changes, sitemap changes, taxonomy edits, media changes, schema, lawyer-card changes and CRM changes.
6. BLOCKED: owner/operator must still verify wp-admin/database served-record state and choose an allowed authoritative-record decision before upload.
7. NEXT: owner/operator uses the runbook to record `KEEP_11607_AS_AUTHORITATIVE`, `KEEP_1130_AS_AUTHORITATIVE`, `MERGE_1130_ASSETS_INTO_11607` or `HOLD_PENDING_WP_ADMIN_DB_CHECK`; then focused GSC and source/legal gates remain required before public CMS work.

### ACTION-MEDICAL-MALPRACTICE-DUPLICATE-IDENTITY-REVIEW-001: Resolve planning evidence for `/medical-malpractice-lawyer/` duplicate CMS identity
**Status:** COMPLETED / FIXED / VERIFIED LOCAL / NOT FINAL UNTIL WP-ADMIN-DB CHECK / OWNER REVIEW BLOCKED / NO PUBLIC CHANGES
**Why:** Medical Malpractice upload is blocked by two local export records, IDs `11607` and `1130`, resolving to the same public URL. Before any body, title, metadata, internal-link, taxonomy or URL work, the owner/operator needs a focused comparison packet showing which record may be authoritative and what assets must not be lost.
**Actions:**
1. DONE: created `tools/build-medical-malpractice-duplicate-identity-review.mjs`.
2. DONE: generated `reports/medical-malpractice-duplicate-identity-review-2026-05-22.csv`.
3. DONE: generated `reports/medical-malpractice-duplicate-identity-review-2026-05-22.json`.
4. DONE: created `project-control/medical-malpractice-duplicate-identity-review-2026-05-22.md`.
5. DONE: created `project-control/medical-malpractice-duplicate-identity-review-2026-05-22.csv`.
6. VERIFIED LOCAL: `node --check tools/build-medical-malpractice-duplicate-identity-review.mjs` passed.
7. VERIFIED LOCAL: generated `8` evidence/decision rows for IDs `11607` and `1130`.
8. VERIFIED LOCAL: local export confirms both IDs share `http://jus-tice.co.il/medical-malpractice-lawyer/`, have `2` distinct content hashes, slug-conflict count `27`, exact current record count `2`, and proposed primary post ID `11607`.
9. VERIFIED LOCAL: ID `11607` is newer/longer but lower heuristic quality and has no detected media/outgoing links; ID `1130` is older/shorter but has higher heuristic quality, a featured image and outgoing links.
10. BLOCKED: wp-admin/database served-record state, rollback backup, owner decision, focused GSC export and source/legal review are still required before CMS upload.
11. NEXT: owner/operator chooses `KEEP_11607_AS_AUTHORITATIVE`, `KEEP_1130_AS_AUTHORITATIVE`, `MERGE_1130_ASSETS_INTO_11607`, or `HOLD_PENDING_WP_ADMIN_DB_CHECK`; do not upload Medical Malpractice until this is resolved.

### ACTION-MEDICAL-MALPRACTICE-OWNER-DECISION-PACKET-001: Build owner decision packet from readiness and GSC baseline maps
**Status:** COMPLETED / FIXED / VERIFIED LOCAL / NOT FINAL BASELINE / OWNER REVIEW BLOCKED / NO PUBLIC CHANGES
**Why:** The Medical Malpractice readiness dashboard is useful but too large for owner execution decisions. The next unblocked repo-only step is to convert it into a controlled owner decision packet that separates duplicate identity, protected pages, clean-slug blockers, source/legal gates, false positives and cannibalization before any CMS upload or URL migration.
**Actions:**
1. DONE: created `tools/build-medical-malpractice-owner-decision-packet.mjs`.
2. DONE: generated `reports/medical-malpractice-owner-decision-packet-2026-05-22.csv`.
3. DONE: generated `reports/medical-malpractice-owner-decision-packet-2026-05-22.json`.
4. DONE: created `project-control/medical-malpractice-owner-decision-packet-2026-05-22.md`.
5. DONE: created `project-control/medical-malpractice-owner-decision-packet-2026-05-22.csv`.
6. VERIFIED LOCAL: `node --check tools/build-medical-malpractice-owner-decision-packet.mjs` passed.
7. VERIFIED LOCAL: generated `69` owner decision rows: `8` owner gates, `23` current-URL review rows, `15` P0 support/protected rows, `12` clean-slug route blocker rows, `8` source/legal rows, `1` cannibalization row and `2` possible false-positive rows.
8. VERIFIED LOCAL: upload-approved rows remain `0`; all rows remain review-only until owner decisions, source/legal review, focused GSC export and WordPress rollback backup exist.
9. BLOCKED: no CMS upload, slug migration, redirect, canonical/noindex, sitemap, taxonomy, related-card/internal-link write, lawyer-card, schema or CRM change is approved.
10. NEXT: owner reviews the decision packet and marks rows `APPROVE_CURRENT_URL_UPDATE`, `EDIT_REQUIRED`, `HOLD`, `LEGAL_REVIEW_REQUIRED`, `PROTECT_ONLY` or `REMOVE_FROM_CLUSTER`; then run focused Medical Malpractice GSC export before URL decisions.

### ACTION-GSC-MEDICAL-MALPRACTICE-EXPORT-RUNNER-001: Prepare Medical Malpractice GSC export and decision maps
**Status:** COMPLETED / FIXED / VERIFIED LOCAL / NOT FINAL BASELINE / API EXECUTION BLOCKED UNTIL OWNER CREDENTIAL SETUP / NO PUBLIC CHANGES
**Why:** The Medical Malpractice readiness dashboard identified protected support pages, clean slug blockers, source/legal gates and duplicate pillar identity risk. Before any upload or URL migration, the cluster needs a focused read-only GSC export and decision-map workflow.
**Actions:**
1. DONE: created `tools/gsc/gsc-medical-malpractice-export.js`.
2. DONE: created `tools/gsc/run-medical-malpractice-gsc-export.ps1`.
3. DONE: created `tools/build-medical-malpractice-gsc-decision-map.mjs`.
4. DONE: created `project-control/gsc-medical-malpractice-export-runner-2026-05-22.md`.
5. DONE: created `project-control/gsc-medical-malpractice-export-runner-2026-05-22.csv`.
6. DONE: updated `tools/gsc/README.md`.
7. DONE: updated `project-control/gsc-api-setup-guide.md`.
8. DONE / NOT FINAL: generated `reports/medical-malpractice-gsc-decision-map-2026-05-22.csv`.
9. DONE / NOT FINAL: generated `reports/medical-malpractice-protected-url-decision-map-2026-05-22.csv`.
10. DONE / NOT FINAL: generated `reports/medical-malpractice-cannibalization-decision-map-2026-05-22.csv`.
11. DONE / NOT FINAL: generated `reports/medical-malpractice-gsc-decision-map-2026-05-22.json`.
12. DONE / NOT FINAL: created `project-control/medical-malpractice-gsc-decision-map-2026-05-22.md`.
13. DONE / NOT FINAL: created `project-control/medical-malpractice-gsc-decision-map-2026-05-22.csv`.
14. VERIFIED LOCAL: Node syntax checks passed for export and decision-map scripts.
15. VERIFIED LOCAL: PowerShell dry run passed without OAuth browser or GSC API call.
16. VERIFIED LOCAL: dry-run scope includes `1` primary target path, `73` protected/source paths, `10` route candidate paths, `8` boundary paths and `22` Medical Malpractice query terms.
17. VERIFIED LOCAL / NOT FINAL: baseline decision map generated `187` rows, `178` protected rows, `8` source/legal gate rows and `1` cannibalization row.
18. BLOCKED: real focused GSC export still requires owner credential setup and OAuth approval.
19. NEXT: after owner credentials, run `.\tools\gsc\run-medical-malpractice-gsc-export.ps1`, then review decision maps before any CMS upload, URL migration, redirect, canonical, noindex, sitemap, taxonomy or internal-link action.

### ACTION-MEDICAL-MALPRACTICE-READINESS-DASHBOARD-001: Consolidate Medical Malpractice upload-readiness evidence
**Status:** COMPLETED / FIXED / VERIFIED LOCAL / REVIEW ONLY / PUBLIC EXECUTION BLOCKED / NO PUBLIC CHANGES
**Why:** Family/Divorce and Criminal are prepared up to owner GSC/OAuth and CMS approval gates. The next high-value unblocked repo-only step is to prepare Medical Malpractice as the next controlled cluster without approving URL migrations or public changes.
**Actions:**
1. DONE: created `tools/build-medical-malpractice-readiness-dashboard.mjs`.
2. DONE: generated `reports/medical-malpractice-readiness-dashboard-2026-05-22.csv`.
3. DONE: generated `reports/medical-malpractice-readiness-dashboard-2026-05-22.json`.
4. DONE: created `project-control/medical-malpractice-readiness-dashboard-2026-05-22.md`.
5. DONE: created `project-control/medical-malpractice-readiness-dashboard-2026-05-22.csv`.
6. VERIFIED LOCAL: `node --check tools/build-medical-malpractice-readiness-dashboard.mjs` passed.
7. VERIFIED LOCAL: dashboard consolidates `249` rows across `9` lanes, including owner gates, current URL readiness, P0 support pages, clean slug route review, internal links, source/legal gates, content inventory, URL migration and cannibalization.
8. VERIFIED LOCAL: flagged `63` high/protected/unknown-GSC risk rows, `86` blocked or approval-gated rows, `4` clean-slug/route blockers, `8` source/legal blockers and `2` possible false-positive medical-malpractice cluster assignments.
9. BLOCKED: upload is not ready until duplicate `/medical-malpractice-lawyer/` CMS identity, focused GSC export, source/legal/privacy review, anti-cannibalization roles, internal links, redirects, canonicals and sitemap decisions are approved.
10. NEXT: prepare the focused Medical Malpractice GSC API export and owner-facing decision packet from this dashboard; do not publish or redirect yet.

### ACTION-CRIMINAL-GSC-DECISION-MAP-001: Prepare Criminal post-GSC decision maps
**Status:** COMPLETED / FIXED / VERIFIED LOCAL / NOT FINAL BASELINE / FOCUSED GSC EXPORT BLOCKED / NO PUBLIC CHANGES
**Why:** The Criminal GSC export runner needs an immediate parser that turns export rows into protected URL, wrong-page, cannibalization, redirect/canonical/noindex and sitemap review decisions before any migration or CMS execution.
**Actions:**
1. DONE: created `tools/build-criminal-gsc-decision-map.mjs`.
2. DONE: updated `tools/gsc/run-criminal-gsc-export.ps1` so the full read-only export automatically builds decision maps for the same report date.
3. DONE: generated `reports/criminal-gsc-decision-map-2026-05-22.csv`.
4. DONE: generated `reports/criminal-protected-url-decision-map-2026-05-22.csv`.
5. DONE: generated `reports/criminal-cannibalization-decision-map-2026-05-22.csv`.
6. DONE: generated `reports/criminal-gsc-decision-map-2026-05-22.json`.
7. DONE: created `project-control/criminal-gsc-decision-map-2026-05-22.md`.
8. DONE: created `project-control/criminal-gsc-decision-map-2026-05-22.csv`.
9. VERIFIED LOCAL: `node --check tools/build-criminal-gsc-decision-map.mjs` passed.
10. VERIFIED LOCAL: baseline run generated `5` target rows, `20` protected/support/route-risk rows and `8` cannibalization/wrong-page rows.
11. NOT VERIFIED FINAL: all generated rows are baseline-only until the focused owner-authorized Criminal GSC export runs.
12. BLOCKED: real focused GSC export still requires owner credential setup and OAuth approval.
13. NEXT: after owner credentials, run `.\tools\gsc\run-criminal-gsc-export.ps1`, then review `reports/criminal-gsc-decision-map-YYYY-MM-DD.csv`, `reports/criminal-protected-url-decision-map-YYYY-MM-DD.csv` and `reports/criminal-cannibalization-decision-map-YYYY-MM-DD.csv` before any URL, redirect, canonical, noindex or sitemap decision.

### ACTION-GSC-CRIMINAL-EXPORT-RUNNER-001: Prepare Criminal Law GSC export runner
**Status:** COMPLETED / FIXED / VERIFIED LOCAL / API EXECUTION BLOCKED UNTIL OWNER CREDENTIAL SETUP / NO PUBLIC CHANGES
**Why:** The Criminal first-upload package now has drafts, owner review, operator runbook and metadata. Before URL migration or redirect decisions, it needs a focused read-only GSC export for current targets, protected/support pages and Criminal query/page ownership.
**Actions:**
1. DONE: created `tools/gsc/gsc-criminal-export.js`.
2. DONE: created `tools/gsc/run-criminal-gsc-export.ps1`.
3. DONE: created `project-control/gsc-criminal-export-runner-2026-05-22.md`.
4. DONE: created `project-control/gsc-criminal-export-runner-2026-05-22.csv`.
5. DONE: updated `tools/gsc/README.md`.
6. DONE: updated `project-control/gsc-api-setup-guide.md`.
7. VERIFIED LOCAL: `node --check tools/gsc/gsc-criminal-export.js` passed.
8. VERIFIED LOCAL: `node tools/gsc/gsc-criminal-export.js --dry-run` passed without OAuth browser or GSC API call.
9. VERIFIED LOCAL: `.\tools\gsc\run-criminal-gsc-export.ps1 -DryRun` passed without OAuth browser or GSC API call.
10. VERIFIED LOCAL: dry-run scope includes `5` target paths, `20` protected/support paths and `27` Criminal query terms.
11. BLOCKED: real focused GSC export still requires owner credential setup and OAuth approval.
12. NEXT: after owner credentials, run `.\tools\gsc\run-criminal-gsc-export.ps1`, then review `criminal-law-query-page.csv`, `criminal-law-cannibalization.csv` and `criminal-law-protected-sources.csv` before any URL decision.

### ACTION-CRIMINAL-FIRST-UPLOAD-METADATA-PACKAGE-001: Prepare Criminal CMS metadata package
**Status:** COMPLETED / VERIFIED PLANNING / READY FOR OWNER REVIEW / EXECUTION BLOCKED / NO PUBLIC CHANGES
**Why:** The Criminal operator runbook requires approved field values before any CMS update. A metadata package prevents ad hoc title/meta/breadcrumb/link decisions during upload and keeps current URLs separate from later slug migration.
**Actions:**
1. DONE: created `project-control/criminal-first-upload-metadata-package-2026-05-22.md`.
2. DONE: created `project-control/criminal-first-upload-metadata-package-2026-05-22.csv`.
3. DONE: updated `project-control/criminal-cms-operator-runbook-2026-05-22.md` so operators use this package for approved field values.
4. VERIFIED PLANNING: package covers `5` Criminal first-upload current URLs.
5. VERIFIED PLANNING: rows include H1, SEO title, meta description, OG title, OG description, breadcrumb label, taxonomy label, primary/secondary current-URL links, schema policy and robots policy.
6. VERIFIED PLANNING: all future clean slugs are marked blocked until GSC and owner migration approval.
7. BLOCKED: all rows remain `BLOCKED_OWNER_LEGAL_SOURCE_APPROVAL`; none are upload-approved.
8. NEXT: owner reviews metadata row by row, then the CMS operator can apply approved current-URL-only values using the Criminal CMS operator runbook.

## ACTIVE SEO ARCHITECTURE SEQUENCE - 2026-05-10

### ACTION-CRIMINAL-CMS-OPERATOR-RUNBOOK-001: Prepare Criminal CMS operator runbook
**Status:** COMPLETED / VERIFIED LOCAL / READY FOR OPERATOR PREP / EXECUTION BLOCKED / NO PUBLIC CHANGES
**Why:** Once the owner approves any Criminal page, the operator needs a strict current-URL-only runbook that separates body upload from slug migration, redirects, canonicals, noindex, sitemap, taxonomy and related-card work.
**Actions:**
1. DONE: created `project-control/criminal-cms-operator-runbook-2026-05-22.md`.
2. DONE: created `project-control/criminal-cms-operator-runbook-2026-05-22.csv`.
3. VERIFIED LOCAL: runbook covers `5` Criminal first-upload current-URL targets.
4. VERIFIED LOCAL: CSV contains `11` operator checklist rows.
5. VERIFIED PLANNING: runbook requires owner/legal/source approval, actual WordPress editor/database rollback backup and post-upload route/indexability/link/visual QA.
6. VERIFIED PLANNING: runbook blocks duplicate clean-slug pages, slug changes, redirects, noindex, canonical migration, sitemap changes, taxonomy changes, related-card writes, protected URL edits and fake trust/rating claims.
7. BLOCKED: no CMS execution is approved until owner decisions are set to `APPROVE_CURRENT_URL_UPDATE` page by page.
8. NEXT: owner reviews the five Criminal rows; after approval, operator follows this runbook for approved current URLs only.

### ACTION-CRIMINAL-OWNER-REVIEW-PACKET-001: Prepare Criminal owner review packet
**Status:** COMPLETED / VERIFIED LOCAL / READY FOR OWNER REVIEW / PUBLIC EXECUTION BLOCKED / NO PUBLIC CHANGES
**Why:** Criminal first-upload draft coverage is now complete, but public CMS upload must still be gated by owner/legal/source approval, current-URL strategy, anti-cannibalization controls and rollback backup.
**Actions:**
1. DONE: created `tools/build-criminal-owner-review-packet.mjs`.
2. DONE: generated `reports/criminal-owner-review-packet-2026-05-22.csv`.
3. DONE: generated `reports/criminal-owner-review-packet-2026-05-22.json`.
4. DONE: created `project-control/criminal-owner-review-packet-2026-05-22.md`.
5. DONE: created `project-control/criminal-owner-review-packet-2026-05-22.csv`.
6. VERIFIED LOCAL: `node --check tools/build-criminal-owner-review-packet.mjs` passed.
7. VERIFIED LOCAL: generated packet covers `5` Criminal first-upload current-URL targets.
8. VERIFIED LOCAL: all `5` rows are `READY_FOR_OWNER_LEGAL_SOURCE_REVIEW_NOT_UPLOAD` and `PENDING_OWNER_DECISION`.
9. READY: owner can mark each page `APPROVE_CURRENT_URL_UPDATE`, `EDIT_REQUIRED`, `HOLD` or `LEGAL_REVIEW_REQUIRED`.
10. BLOCKED: no CMS upload, English slug migration, redirects, canonicals, noindex, sitemap, taxonomy, related-card/internal-link writes, lawyer cards, schema or CRM action is approved.
11. FIXED LATER: `ACTION-CRIMINAL-CMS-OPERATOR-RUNBOOK-001` prepared the execution-blocked operator runbook; owner review is still required before any CMS execution.

### ACTION-CRIMINAL-FIRST-UPLOAD-DRAFT-CLOSURE-001: Complete missing Criminal first-upload support drafts
**Status:** COMPLETED / FIXED / VERIFIED LOCAL / READY FOR OWNER REVIEW / PUBLIC EXECUTION BLOCKED / NO PUBLIC CHANGES
**Why:** The Criminal/Traffic readiness dashboard showed `2/5` missing Criminal first-upload drafts. Closing this gap is the highest-value unblocked repo-only step before owner review, because it prepares the Criminal cluster as a coherent current-URL upload package without touching live URLs or the CMS.
**Actions:**
1. DONE: created `content-drafts/indictment-supporting-he.md`.
2. DONE: created `content-drafts/drug-offenses-supporting-he.md`.
3. DONE: updated `tools/build-criminal-traffic-readiness-dashboard.mjs` so all five Criminal first-upload targets map to draft files.
4. DONE: regenerated `reports/criminal-traffic-readiness-dashboard-2026-05-22.csv`.
5. DONE: regenerated `reports/criminal-traffic-readiness-dashboard-2026-05-22.json`.
6. DONE: regenerated `project-control/criminal-traffic-readiness-dashboard-2026-05-22.md`.
7. DONE: regenerated `project-control/criminal-traffic-readiness-dashboard-2026-05-22.csv`.
8. DONE: created `project-control/criminal-first-upload-draft-closure-2026-05-22.md`.
9. DONE: created `project-control/criminal-first-upload-draft-closure-2026-05-22.csv`.
10. VERIFIED LOCAL: `node --check tools/build-criminal-traffic-readiness-dashboard.mjs` passed.
11. VERIFIED LOCAL: dashboard still consolidates `57` rows and Criminal first-upload draft coverage is now `5/5`, with `0` missing drafts.
12. READY: the Criminal current-URL first-upload package is ready for owner/legal/source review.
13. BLOCKED: no CMS upload, slug migration, redirects, canonicals, noindex, sitemap, taxonomy or internal-link writes are approved.
14. FIXED LATER: `ACTION-CRIMINAL-OWNER-REVIEW-PACKET-001` created the five-page owner/legal/source review packet.

### ACTION-CRIMINAL-TRAFFIC-READINESS-DASHBOARD-001: Consolidate next content-upload cluster evidence
**Status:** COMPLETED / VERIFIED LOCAL / REVIEW ONLY / PUBLIC EXECUTION BLOCKED / NO PUBLIC CHANGES
**Why:** Family/Divorce upload execution is blocked by owner GSC/OAuth and CMS approval. The next safe progress is to prepare Criminal/Traffic as a controlled cluster package without approving URL migrations or public changes.
**Actions:**
1. DONE: created `tools/build-criminal-traffic-readiness-dashboard.mjs`.
2. DONE: generated `reports/criminal-traffic-readiness-dashboard-2026-05-22.csv`.
3. DONE: generated `reports/criminal-traffic-readiness-dashboard-2026-05-22.json`.
4. DONE: created `project-control/criminal-traffic-readiness-dashboard-2026-05-22.md`.
5. DONE: created `project-control/criminal-traffic-readiness-dashboard-2026-05-22.csv`.
6. VERIFIED LOCAL: dashboard consolidates `57` rows: `5` criminal first-upload targets, `18` criminal P0 support/protection rows, `13` traffic support/boundary rows, `9` targeted GSC signal rows and the wrong-page decision packet.
7. FIXED LATER: `ACTION-CRIMINAL-FIRST-UPLOAD-DRAFT-CLOSURE-001` created indictment and drug-offenses drafts; current dashboard now shows `5/5` criminal first-upload drafts present and `0` missing.
8. VERIFIED LOCAL: `/criminal-defense-attorney/` is the first current-URL criminal publish candidate, but it is owner-review-ready only, not upload-approved.
9. BLOCKED: Criminal/Traffic public CMS upload, clean-slug migration, redirects, canonical/noindex, sitemap, taxonomy and related/internal-link writes remain unapproved.
10. NEXT: run owner/legal/source review on the five current-URL Criminal targets before any public upload.

### ACTION-FAMILY-DIVORCE-GSC-WORKFLOW-HANDOFF-001: Make focused GSC workflow date-safe and one-command
**Status:** COMPLETED / FIXED / VERIFIED LOCAL / API EXECUTION BLOCKED UNTIL OWNER CREDENTIAL SETUP / NO PUBLIC CHANGES
**Why:** The Family/Divorce GSC export handoff was ready, but the downstream decision-map and protected URL packet scripts still used hardcoded `2026-05-21` filenames. That could create stale or overwritten review files after a real export.
**Actions:**
1. DONE: updated `tools/build-family-divorce-gsc-decision-map.mjs` to support `--reportDate=YYYY-MM-DD`.
2. DONE: updated `tools/build-family-divorce-gsc-decision-map.mjs` to use the latest `family-divorce-live-preupload-YYYY-MM-DD.csv` by default or an explicit `--livePreupload=path`.
3. DONE: updated `tools/build-family-divorce-protected-url-review-packet.mjs` to support `--reportDate=YYYY-MM-DD` and `--input=path`.
4. DONE: created `tools/gsc/run-family-divorce-gsc-workflow.ps1`.
5. DONE: updated `tools/gsc/README.md` and `project-control/gsc-api-setup-guide.md` with the wrapper command and manual fallback commands.
6. DONE: created `project-control/family-divorce-gsc-workflow-handoff-2026-05-22.md`.
7. DONE: created `project-control/family-divorce-gsc-workflow-handoff-2026-05-22.csv`.
8. DONE: regenerated current-date baseline outputs under `2026-05-22`.
9. VERIFIED LOCAL: Node syntax checks passed for both downstream scripts.
10. VERIFIED LOCAL: `tools/gsc/run-family-divorce-gsc-workflow.ps1 -DryRun` passed without OAuth browser or GSC API call.
11. VERIFIED LOCAL: regenerated baseline still reports `18` protected rows, `5` protected conflicts and `40` cannibalization rows.
12. BLOCKED: real focused GSC export still requires owner credential setup and OAuth approval.
13. NEXT: after owner credentials, run `.\tools\gsc\run-family-divorce-gsc-workflow.ps1`, then review generated decision-map and protected URL packet before any URL action.

### ACTION-FAMILY-DIVORCE-PROTECTED-URL-OWNER-REVIEW-PACKET-001: Prepare protected URL owner review packet
**Status:** COMPLETED / VERIFIED LOCAL / NOT FINAL / FOCUSED GSC EXPORT BLOCKED / NO PUBLIC CHANGES
**Why:** The protected URL decision map identified `18` high-risk protected source/asset URLs. The owner needs one packet with explicit keep, restore, targeted-301 or hold options before any URL migration decision.
**Actions:**
1. DONE: created `tools/build-family-divorce-protected-url-review-packet.mjs`.
2. DONE: generated `reports/family-divorce-protected-url-owner-review-packet-2026-05-21.csv`.
3. DONE: generated `reports/family-divorce-protected-url-owner-review-packet-2026-05-21.json`.
4. DONE: created `project-control/family-divorce-protected-url-owner-review-packet-2026-05-21.md`.
5. DONE: created `project-control/family-divorce-protected-url-owner-review-packet-2026-05-21.csv`.
6. DONE: updated `tools/gsc/README.md`.
7. DONE: updated `project-control/gsc-api-setup-guide.md`.
8. VERIFIED LOCAL: `node --check tools/build-family-divorce-protected-url-review-packet.mjs` passed.
9. VERIFIED LOCAL: packet generated `18` rows: `5` P0 restore-or-targeted-301 conflicts, `1` P0 keep-asset-live row and `12` keep-live/review-later rows.
10. BLOCKED: all rows require focused GSC export before final owner URL decisions.
11. NEXT: after focused GSC export, rerun decision map and protected URL review packet, then owner marks `RESTORE_CURRENT_URL`, `TARGETED_301_TO_MAPPED_TARGET`, `KEEP_LIVE`, `MERGE_AND_301_AFTER_APPROVAL`, `KEEP_ASSET_LIVE` or `HOLD_FOR_MANUAL_REVIEW`.

### ACTION-FAMILY-DIVORCE-GSC-DECISION-MAP-BASELINE-001: Prepare post-GSC URL/cannibalization decision map
**Status:** COMPLETED / VERIFIED LOCAL / NOT FINAL / FOCUSED GSC EXPORT BLOCKED / NO PUBLIC CHANGES
**Why:** The focused GSC export is blocked by owner credentials, but the project can still prepare the parser and decision-map workflow so export data converts directly into protected URL, redirect, cannibalization and sitemap review rows.
**Actions:**
1. DONE: created `tools/build-family-divorce-gsc-decision-map.mjs`.
2. DONE: generated `reports/family-divorce-gsc-decision-map-2026-05-21.csv`.
3. DONE: generated `reports/family-divorce-protected-url-decision-map-2026-05-21.csv`.
4. DONE: generated `reports/family-divorce-cannibalization-decision-map-2026-05-21.csv`.
5. DONE: generated `reports/family-divorce-gsc-decision-map-2026-05-21.json`.
6. DONE: created `project-control/family-divorce-gsc-decision-map-2026-05-21.md`.
7. DONE: created `project-control/family-divorce-gsc-decision-map-2026-05-21.csv`.
8. DONE: updated `tools/gsc/README.md`.
9. DONE: updated `project-control/gsc-api-setup-guide.md`.
10. VERIFIED LOCAL: `node --check tools/build-family-divorce-gsc-decision-map.mjs` passed.
11. VERIFIED LOCAL: baseline run generated `7` target rows, `18` protected source/asset rows and `40` cannibalization rows.
12. VERIFIED LOCAL: all `18` protected source/asset URLs have cached GSC rows and are high-risk in the baseline.
13. BLOCKED: baseline input mode is `FALLBACK_EXISTING_GSC_CACHE_NOT_FINAL`; final decisions require the focused owner-authorized export.
14. NEXT: after owner credentials, run `node tools/gsc/gsc-family-divorce-export.js`, then rerun `node tools/build-family-divorce-gsc-decision-map.mjs --gscDir=reports/gsc/family-divorce-YYYY-MM-DD`.

### ACTION-FAMILY-DIVORCE-WAVE1B-METADATA-SYNC-001: Sync stale support metadata word counts
**Status:** COMPLETED / FIXED / VERIFIED LOCAL / NO PUBLIC CHANGES
**Why:** The upload readiness dashboard found `6` stale Wave 1B support metadata word-count fields after later merge work. This was a planning artifact, but it could confuse owner review and CMS upload status.
**Actions:**
1. DONE: created `tools/sync-family-divorce-wave1b-metadata-counts.mjs`.
2. FIXED: updated only the trusted early `words` column in `project-control/family-divorce-wave-1b-support-metadata-package-2026-05-12.csv`.
3. DONE: generated `reports/family-divorce-wave1b-metadata-word-count-sync-2026-05-21.csv`.
4. DONE: created `project-control/family-divorce-wave1b-metadata-word-count-sync-2026-05-21.md`.
5. DONE: created `project-control/family-divorce-wave1b-metadata-word-count-sync-2026-05-21.csv`.
6. VERIFIED LOCAL: `node --check tools/sync-family-divorce-wave1b-metadata-counts.mjs` passed.
7. VERIFIED LOCAL: sync script fixed `6` rows and skipped `0`.
8. VERIFIED LOCAL: reran `tools/check-family-divorce-upload-readiness.mjs`; Wave 1B metadata mismatches are now `0`.
9. VERIFIED: `7/7` target drafts still pass static QA and `7/7` target URLs still have live public backups.
10. BLOCKED: owner/legal/source approval and actual WordPress editor/database rollback material are still required before public CMS upload.
11. BLOCKED: GSC API export and protected-source redirect review are still required before URL migration, redirects, canonical/noindex or sitemap changes.
12. NEXT: run real GSC export after owner credentials, then convert output into protected URL/cannibalization decision map.

### ACTION-FAMILY-DIVORCE-UPLOAD-READINESS-DASHBOARD-001: Consolidate upload readiness gates
**Status:** COMPLETED / VERIFIED LOCAL / PUBLIC EXECUTION BLOCKED / NO PUBLIC CHANGES
**Why:** Family/Divorce had the content drafts, owner packet, metadata packages, runbook, live snapshots and GSC runner spread across many files. The operator needs one current readiness view before any CMS work.
**Actions:**
1. DONE: created `tools/check-family-divorce-upload-readiness.mjs`.
2. DONE: generated `reports/family-divorce-upload-readiness-2026-05-21.csv`.
3. DONE: generated `reports/family-divorce-upload-readiness-2026-05-21.json`.
4. DONE: created `project-control/family-divorce-upload-readiness-dashboard-2026-05-21.md`.
5. DONE: created `project-control/family-divorce-upload-readiness-dashboard-2026-05-21.csv`.
6. VERIFIED LOCAL: `node --check tools/check-family-divorce-upload-readiness.mjs` passed.
7. VERIFIED LOCAL: `node tools/check-family-divorce-upload-readiness.mjs` passed.
8. VERIFIED: `7/7` target drafts pass static QA and `7/7` target URLs have live public backups.
9. FIXED LATER: the `6` stale Wave 1B support metadata word counts were synced in `ACTION-FAMILY-DIVORCE-WAVE1B-METADATA-SYNC-001`.
10. BLOCKED: owner/legal/source approval and actual WordPress editor/database rollback material are still required before public CMS upload.
11. BLOCKED: GSC API export and protected-source redirect review are still required before URL migration, redirects, canonical/noindex or sitemap changes.
12. NEXT: run real GSC export after owner credentials, then convert output into protected URL/cannibalization decision map.

### ACTION-GSC-FAMILY-DIVORCE-EXPORT-RUNNER-001: Prepare focused Family/Divorce GSC export runner
**Status:** COMPLETED / FIXED / VERIFIED LOCAL / API EXECUTION BLOCKED UNTIL OWNER CREDENTIAL SETUP
**Why:** Family/Divorce URL migration, redirect, canonical/noindex and sitemap decisions need read-only Search Console query/page data, but credentials must stay outside Git and the export needs to be scoped to the first upload cluster.
**Actions:**
1. DONE: created `tools/gsc/gsc-family-divorce-export.js`.
2. FIXED: runner supports credential and token paths through `GSC_OAUTH_CLIENT_PATH` and `GSC_TOKEN_PATH`.
3. FIXED: runner supports `--dry-run` so local path/scope checks can run without reading credential contents, opening OAuth or calling the API.
4. VERIFIED LOCAL: `node --check tools/gsc/gsc-family-divorce-export.js` passed.
5. VERIFIED LOCAL: `node tools/gsc/gsc-family-divorce-export.js --dry-run` passed.
6. VERIFIED LOCAL: dry run reported `7` clean Family/Divorce upload targets, `18` protected source/asset paths and `18` query terms.
7. CREATED: `project-control/gsc-family-divorce-export-runner-2026-05-21.md`.
8. CREATED: `project-control/gsc-family-divorce-export-runner-2026-05-21.csv`.
9. UPDATED: `tools/gsc/README.md`.
10. UPDATED: `project-control/gsc-api-setup-guide.md`.
11. BLOCKED / OWNER ACTION: rotate or create the OAuth Desktop client if needed, set local credential/token paths, then run the real export.
12. NEXT: run `node tools/gsc/gsc-family-divorce-export.js` after owner credential setup and use outputs for Family/Divorce protected URL, cannibalization, redirect and sitemap decisions.

### ACTION-GSC-CREDENTIAL-HYGIENE-001: Remove tracked local OAuth client from Git
**Status:** COMPLETED / FIXED IN REPO / OWNER ROTATION RECOMMENDED / NO PUBLIC CHANGES
**Why:** `tools/gsc/oauth-client.json` was tracked in Git, conflicting with the credential-safety rule in the GSC API setup guide. Search Console credentials must stay local and ignored.
**Actions:**
1. FIXED: removed `tools/gsc/oauth-client.json` from Git tracking with `git rm --cached`.
2. FIXED: kept the local file in place so local tooling is not broken.
3. FIXED: updated `.gitignore` for OAuth client JSON, token JSON and common Google credential JSON names under `tools/gsc/`.
4. FIXED: updated `tools/gsc/README.md` with credential-safety instructions.
5. CREATED: `project-control/gsc-credential-hygiene-2026-05-21.md`.
6. CREATED: `project-control/gsc-credential-hygiene-2026-05-21.csv`.
7. VERIFIED LOCAL: the local credential file is now ignored after removal from tracking.
8. BLOCKED / OWNER ACTION: rotate or recreate the OAuth Desktop client in Google Cloud if the removed tracked file contained a real secret.
9. NEXT: after owner sets up/rotates credentials, run the first read-only Family/Divorce GSC API export.

### ACTION-FAMILY-DIVORCE-CMS-OPERATOR-RUNBOOK-001: Prepare seven-page CMS operator runbook
**Status:** COMPLETED / VERIFIED LOCAL / EXECUTION BLOCKED / NO PUBLIC CHANGES
**Why:** The owner review packet answers which pages need approval. The CMS operator also needs a single execution boundary that prevents accidental duplicate pages, URL migration, redirects, noindex/canonical changes or protected asset edits during body upload.
**Actions:**
1. DONE: created `project-control/family-divorce-cms-operator-runbook-2026-05-21.md`.
2. DONE: created `project-control/family-divorce-cms-operator-runbook-2026-05-21.csv`.
3. VERIFIED LOCAL: runbook covers `7` target pages and points each page to its approved-source draft file after approval.
4. VERIFIED PLANNING: runbook requires actual WordPress editor/database rollback material before each approved edit.
5. VERIFIED PLANNING: runbook blocks duplicate pages, slug changes, redirects, noindex changes, canonical changes, sitemap changes and protected asset edits.
6. BLOCKED: CMS execution still requires owner/legal/source approval and actual WordPress editor/database backup.
7. BLOCKED: URL migration, redirects, noindex, canonical and sitemap decisions still require GSC API/export and separate approval.
8. NEXT: owner reviews the seven packet rows; after approval, operator follows this runbook for only the approved pages.

### ACTION-FAMILY-DIVORCE-OWNER-REVIEW-PACKET-001: Prepare owner/legal/source review packet
**Status:** COMPLETED / VERIFIED LOCAL / READY FOR OWNER REVIEW / NO PUBLIC CHANGES
**Why:** The seven Family/Divorce upload candidates now have static QA, live public snapshots and resolved high-risk merge blockers. The next safe step is an explicit owner/legal/source decision packet before any CMS overwrite/update.
**Actions:**
1. DONE: created `project-control/family-divorce-owner-review-packet-2026-05-21.md`.
2. DONE: created `project-control/family-divorce-owner-review-packet-2026-05-21.csv`.
3. VERIFIED LOCAL: packet covers `7` target URLs and maps each one to its current public-body draft.
4. VERIFIED LOCAL: all `7` rows show static QA `PASS`.
5. VERIFIED LOCAL: packet records the resolved high-risk merge blockers for `/divorce-property-division/`, `/child-custody/` and `/child-support/`.
6. READY: owner can now mark each page `APPROVE`, `EDIT`, `HOLD` or `LEGAL_REVIEW_REQUIRED`.
7. BLOCKED: CMS upload still requires explicit owner/legal/source approval and actual WordPress editor/database backup.
8. BLOCKED: URL migration, redirects, noindex, canonical and sitemap decisions still require GSC API/export and separate approval.
9. NEXT: owner reviews the seven page rows, then CMS operator prepares editor/database backup for only the approved pages.

### ACTION-FAMILY-DIVORCE-CHILD-SUPPORT-MERGE-AND-DRAFT-001: Resolve and apply child-support merge rows
**Status:** COMPLETED / FIXED / VERIFIED LOCAL / NO PUBLIC CHANGES
**Why:** `/child-support/` was the last high-risk Family/Divorce page with unresolved live-candidate rows. Resolving and applying safe draft merges removes the final high-risk merge blocker before owner upload review.
**Actions:**
1. DONE: created `tools/resolve-family-divorce-child-support-merge.mjs`.
2. DONE: generated `reports/family-divorce-child-support-merge-decisions-2026-05-21.csv`.
3. DONE: created `project-control/family-divorce-child-support-merge-decisions-2026-05-21.md`.
4. DONE: created `project-control/family-divorce-child-support-merge-decisions-2026-05-21.csv`.
5. VERIFIED LOCAL: resolved all `35` current-live candidate rows for `/child-support/`: `4` merge, `25` covered/no action and `6` skip.
6. DONE: created `tools/apply-family-divorce-child-support-draft-merges.mjs`.
7. FIXED: applied four approved public-facing edits to `content-drafts/child-support-public-body-he.md`.
8. DONE: created `project-control/family-divorce-child-support-draft-merge-2026-05-21.md`.
9. DONE: created `project-control/family-divorce-child-support-draft-merge-2026-05-21.csv`.
10. VERIFIED LOCAL: all four approved insertion blocks are present in the edited draft.
11. VERIFIED LOCAL: reran `tools/check-family-divorce-public-bodies.mjs`; all seven Family/Divorce public-body drafts passed.
12. VERIFIED: `/child-support/` now passes static QA with `1,650` words, all required links, no internal markers, no fake-trust hits and disclaimer status `PASS`.
13. FIXED: high-risk merge rows are now resolved for `/child-support/`, `/child-custody/` and `/divorce-property-division/`.
14. NEXT: prepare the owner/legal/source review packet for the locally merged seven-page Family/Divorce upload candidates.
15. BLOCKED: do not upload any Family/Divorce page until owner/legal/source approval and actual WordPress editor/database backup are complete.

### ACTION-FAMILY-DIVORCE-CHILD-CUSTODY-MERGE-AND-DRAFT-001: Resolve and apply child-custody merge rows
**Status:** COMPLETED / FIXED / VERIFIED LOCAL / NO PUBLIC CHANGES
**Why:** `/child-custody/` was the remaining high-risk Family/Divorce page with the largest unresolved live-candidate set after property division. Resolving and applying safe draft merges reduces blind-overwrite risk.
**Actions:**
1. DONE: created `tools/resolve-family-divorce-child-custody-merge.mjs`.
2. DONE: generated `reports/family-divorce-child-custody-merge-decisions-2026-05-21.csv`.
3. DONE: created `project-control/family-divorce-child-custody-merge-decisions-2026-05-21.md`.
4. DONE: created `project-control/family-divorce-child-custody-merge-decisions-2026-05-21.csv`.
5. VERIFIED LOCAL: resolved all `35` current-live candidate rows for `/child-custody/`: `9` merge, `20` covered/no action and `6` skip.
6. DONE: created `tools/apply-family-divorce-child-custody-draft-merges.mjs`.
7. FIXED: applied nine approved public-facing edits to `content-drafts/child-custody-public-body-he.md`.
8. DONE: created `project-control/family-divorce-child-custody-draft-merge-2026-05-21.md`.
9. DONE: created `project-control/family-divorce-child-custody-draft-merge-2026-05-21.csv`.
10. VERIFIED LOCAL: all nine insertion IDs are present in the edited draft.
11. VERIFIED LOCAL: reran `tools/check-family-divorce-public-bodies.mjs`; all seven Family/Divorce public-body drafts passed.
12. VERIFIED: `/child-custody/` now passes static QA with `1,748` words, all required links, no internal markers, no fake-trust hits and disclaimer status `PASS`.
13. NEXT: resolve `/child-support/` high-risk merge rows.
14. BLOCKED: do not upload `/child-custody/` until owner/legal/source approval and actual WordPress editor/database backup are complete.

### ACTION-FAMILY-DIVORCE-PROPERTY-DIVISION-DRAFT-MERGE-001: Apply approved property-division draft edits
**Status:** COMPLETED / VERIFIED LOCAL / NO PUBLIC CHANGES
**Why:** The previous decision pass approved six concise `/divorce-property-division/` draft merges. Applying them locally moves this support page closer to controlled owner review without risking a blind overwrite.
**Actions:**
1. DONE: created `tools/apply-family-divorce-property-division-draft-merges.mjs`.
2. DONE: applied six approved public-facing edits to `content-drafts/divorce-property-division-public-body-he.md`.
3. DONE: created `project-control/family-divorce-property-division-draft-merge-2026-05-21.md`.
4. DONE: created `project-control/family-divorce-property-division-draft-merge-2026-05-21.csv`.
5. VERIFIED LOCAL: all six insertion IDs are present in the edited draft.
6. VERIFIED LOCAL: reran `tools/check-family-divorce-public-bodies.mjs`; all seven Family/Divorce public-body drafts passed.
7. VERIFIED: `/divorce-property-division/` now passes static QA with `1,851` words, all required links, no internal markers, no fake-trust hits and disclaimer status `PASS`.
8. NEXT: resolve `/child-custody/` and `/child-support/` high-risk merge rows.
9. BLOCKED: do not upload `/divorce-property-division/` until owner/legal/source approval and actual WordPress editor/database backup are complete.

### ACTION-FAMILY-DIVORCE-PROPERTY-DIVISION-MERGE-DECISIONS-001: Resolve property-division live merge rows
**Status:** COMPLETED / VERIFIED LOCAL / NO PUBLIC CHANGES
**Why:** `/divorce-property-division/` had the largest number of live-only candidate rows in the high-risk merge worksheet and should be resolved first before any CMS overwrite is approved.
**Actions:**
1. DONE: created `tools/resolve-family-divorce-property-division-merge.mjs`.
2. DONE: generated `reports/family-divorce-property-division-merge-decisions-2026-05-21.csv`.
3. DONE: created `project-control/family-divorce-property-division-merge-decisions-2026-05-21.md`.
4. DONE: created `project-control/family-divorce-property-division-merge-decisions-2026-05-21.csv`.
5. VERIFIED LOCAL: resolved all `35` current-live candidate rows for `/divorce-property-division/`.
6. VERIFIED: `6` rows require concise draft merges, `23` rows are covered/no action and `6` rows are UI/CTA/taxonomy/related-link fragments to skip.
7. NEXT: apply the six concise merges to `content-drafts/divorce-property-division-public-body-he.md`, then rerun public-body static QA.
8. BLOCKED: do not upload `/divorce-property-division/` until draft edits, static QA, owner/legal/source approval and CMS backup are complete.

### ACTION-FAMILY-DIVORCE-HIGH-RISK-MERGE-REVIEW-001: Prepare merge worksheet for highest-risk pages
**Status:** COMPLETED / VERIFIED LOCAL / NO PUBLIC CHANGES
**Why:** The live-vs-draft comparison showed the largest overwrite risk on `/child-support/`, `/child-custody/` and `/divorce-property-division/`. These pages need section-level review before CMS upload.
**Actions:**
1. DONE: created `tools/prepare-family-divorce-merge-review.mjs`.
2. DONE: generated `reports/family-divorce-high-risk-merge-review-2026-05-21.csv`.
3. DONE: created `project-control/family-divorce-high-risk-merge-review-2026-05-21.md`.
4. DONE: created `project-control/family-divorce-high-risk-merge-review-2026-05-21.csv`.
5. VERIFIED LOCAL: worksheet contains `165` rows across the three high-risk pages.
6. VERIFIED: `60` rows are draft base sections, `30` live sections require merge review, `46` live sections require partial-overlap review and `29` live sections appear covered by draft.
7. NEXT: resolve `REVIEW_FOR_MERGE` and `PARTIAL_OVERLAP_REVIEW` rows into keep/merge/rewrite/skip decisions, starting with `/divorce-property-division/`.
8. BLOCKED: do not upload these three pages as direct overwrites.

### ACTION-FAMILY-DIVORCE-LIVE-VS-DRAFT-COMPARE-001: Compare live snapshots against clean drafts before overwrite
**Status:** COMPLETED / VERIFIED LOCAL / NO PUBLIC CHANGES
**Why:** The seven target pages are already live and indexable. The clean drafts passed static QA, but upload approval needs proof that a CMS overwrite will not discard stronger current-live sections.
**Actions:**
1. DONE: created `tools/compare-family-divorce-live-vs-drafts.mjs`.
2. DONE: compared seven live public snapshots against seven clean public-body drafts.
3. GENERATED: `reports/family-divorce-live-vs-draft-comparison-2026-05-21.csv`.
4. DONE: created `project-control/family-divorce-live-vs-draft-comparison-2026-05-21.md`.
5. DONE: created `project-control/family-divorce-live-vs-draft-comparison-2026-05-21.csv`.
6. VERIFIED: live snapshots total `19,236` words; drafts total `11,673` words; draft reduction is `-7,563` words.
7. BLOCKED: no blind overwrite; all seven pages require page-by-page merge review.
8. HIGH PRIORITY MERGE REVIEW: `/child-support/`, `/child-custody/` and `/divorce-property-division/`.
9. NEXT: run side-by-side merge review and produce final keep/merge/rewrite decisions before CMS upload approval.

### ACTION-FAMILY-DIVORCE-LIVE-TARGET-BACKUP-001: Export public snapshots of live target pages before overwrite
**Status:** COMPLETED / VERIFIED LIVE READ ONLY / NO PUBLIC CHANGES
**Why:** The live pre-upload guard proved all seven Family/Divorce target slugs already exist and self-canonicalize. Before any CMS overwrite/update, the current live public content needs a local comparison snapshot.
**Actions:**
1. DONE: created `tools/export-family-divorce-live-targets.mjs`.
2. DONE: exported public text snapshots and metadata for `7` target pages.
3. GENERATED: `reports/family-divorce-live-target-backup-2026-05-21/manifest.csv`.
4. GENERATED: seven public-text snapshot files under `reports/family-divorce-live-target-backup-2026-05-21/`.
5. DONE: created `project-control/family-divorce-live-target-backup-2026-05-21.md`.
6. DONE: created `project-control/family-divorce-live-target-backup-2026-05-21.csv`.
7. VERIFIED LIVE: all seven pages returned `200`, stayed on their own final paths and exported as `PASS`.
8. VERIFIED: captured `19,236` words of current live public text.
9. LIMIT: this is not a WordPress database/editor backup; CMS export remains required before edits.
10. NEXT: compare approved replacement bodies against these snapshots and keep/merge any current-live sections that are stronger than the new drafts.

### ACTION-FAMILY-DIVORCE-LIVE-PREUPLOAD-GUARD-001: Check live Family/Divorce targets and protected sources before upload
**Status:** COMPLETED / VERIFIED LIVE READ ONLY WITH BLOCKERS / NO PUBLIC CHANGES
**Why:** Family/Divorce is the first staged upload cluster. Before updating live pages or planning redirects, the team needs a current public-state guard for target slugs and P0 traffic sources.
**Actions:**
1. DONE: created `tools/check-family-divorce-live-preupload.mjs`.
2. DONE: checked `25` live URLs: `7` clean targets, `17` protected P0 source URLs and `1` protected DOCX asset.
3. GENERATED: `reports/family-divorce-live-preupload-2026-05-21.csv`.
4. DONE: created `project-control/family-divorce-live-preupload-guard-2026-05-21.md`.
5. DONE: created `project-control/family-divorce-live-preupload-guard-2026-05-21.csv`.
6. VERIFIED LIVE: `13` protected source/asset URLs passed live reachability checks.
7. LIVE PRESENT REVIEW: all `7` clean target slugs already return `200` and self-canonicalize; backup/export current live content before any CMS update.
8. BLOCKED LIVE: `5` protected source URLs return initial `301` to homepage and need restore/update-in-place/documented 301 decisions after GSC API confirmation.
9. VERIFIED LOCAL: `node --check tools/check-family-divorce-live-preupload.mjs` passed.
10. NEXT: investigate the five homepage redirects before approving Family/Divorce URL migration, sitemap changes, canonical/noindex decisions or CMS overwrite.

### ACTION-FAMILY-DIVORCE-PUBLIC-BODY-STATIC-QA-001: Add repeatable static QA for Family/Divorce clean bodies
**Status:** COMPLETED / VERIFIED LOCAL / NO PUBLIC CHANGES
**Why:** Family/Divorce is the first staged content cluster, but upload readiness depends on several clean-body claims spread across docs. A repeatable local checker reduces risk before owner-approved CMS work.
**Actions:**
1. DONE: created `tools/check-family-divorce-public-bodies.mjs`.
2. DONE: checked `7` public-body draft files.
3. FIXED: removed one risky outcome-promise phrase from `content-drafts/divorce-lawyer-public-body-he.md`.
4. VERIFIED LOCAL: all seven drafts passed minimum words, required internal links, internal marker, fake trust/review/outcome-promise and disclaimer checks.
5. GENERATED: `reports/family-divorce-public-body-static-qa-2026-05-21.csv`.
6. DONE: created `project-control/family-divorce-public-body-static-qa-2026-05-21.md`.
7. DONE: created `project-control/family-divorce-public-body-static-qa-2026-05-21.csv`.
8. UPDATED: `project-control/family-law-pre-upload-minimum-checklist-2026-05-12.md`.
9. NEXT: owner/legal/source approval and CMS backup remain required before any upload; GSC API remains required before any URL migration or redirect/canonical/noindex action.

### ACTION-TRUST-ROUTE-EARLY-RENDER-001: Render trust routes before later redirect plugins
**Status:** CODE FIXED / VERIFIED LOCAL / NOT LIVE VERIFIED
**Why:** `/contact/` and `/about/` are lead/trust paths. The latest live route triage reported initial `301` redirects to the homepage even though virtual trust-route content already exists in the theme, so the route renderer needed the same early priority used for protected money routes.
**Actions:**
1. DONE: reviewed the existing virtual trust-route handler for `/contact/`, `/about/` and `/editorial-policy/`.
2. DONE: changed `inc/trust-routes.php` to render at `template_redirect` priority `-999999`.
3. DONE: added `X-Justice-Route-Guard: trust-route-early-render` to trust-route responses.
4. DONE: updated deployment marker to `2026-05-21-trust-route-early-render-v1`.
5. DONE: created `project-control/trust-route-early-render-2026-05-21.md`.
6. DONE: created `project-control/trust-route-early-render-2026-05-21.csv`.
7. VERIFIED LOCAL: `php -l functions.php`, `php -l inc/trust-routes.php`, `node --check tools/check-live-traffic-priority.mjs`, `node --check tools/check-live-trust-routes.mjs`, task-board CSV parse and `git diff --check` passed; `git diff --check` reported normal Windows line-ending warnings only.
8. PUSHED: commit `5576aa1` (`Render trust routes before redirects`) is on `main`.
9. AFTER DEPLOY: rerun `node tools/check-live-traffic-priority.mjs` and `node tools/check-live-trust-routes.mjs`.
10. BLOCKED: if `/contact/` or `/about/` still return initial `301` to `/` after deployment, inspect server/CDN/host-panel/early-plugin redirect rules because theme PHP is not getting control.

### ACTION-PROTECTED-PRACTICE-ROUTE-EARLY-RENDER-001: Render controlled money routes before later redirect plugins
**Status:** CODE FIXED / VERIFIED LOCAL / NOT LIVE VERIFIED
**Why:** The route triage proved several priority URLs are being redirected to the homepage before users or Google see route content. The repo-side mitigation is to render known controlled routes at a very early WordPress lifecycle point, while still recognizing server/CDN redirects may require admin cleanup.
**Actions:**
1. DONE: updated `inc/practice-landing.php` with a shared controlled route template resolver.
2. DONE: controlled practice routes now render at `template_redirect` priority `-999999` and exit before later redirect plugins.
3. DONE: controlled early route output sends `X-Justice-Route-Guard: controlled-practice-early-render`.
4. DONE: updated `inc/html-sitemap.php` so `/site-map/` renders at priority `-999999`.
5. DONE: updated deployment marker to `2026-05-21-protected-route-early-render-v1`.
6. DONE: created `project-control/protected-practice-route-early-render-2026-05-21.md`.
7. DONE: created `project-control/protected-practice-route-early-render-2026-05-21.csv`.
8. VERIFIED LOCAL: PHP lint passed for `inc/practice-landing.php`, `inc/html-sitemap.php` and `functions.php`.
9. NEXT: after uPress pull/cache clear, rerun `node tools/check-live-traffic-priority.mjs`.
10. BLOCKED: if `/site-map/`, `/medical-malpractice-lawyer/`, `/real-estate-lawyer-guide/` or `/inheritance-lawyer/` still show initial `301` to `/`, inspect server/CDN/plugin redirect rules because PHP theme code is not getting control.
11. UPDATED: `/contact/` and `/about/` are now handled by ACTION-TRUST-ROUTE-EARLY-RENDER-001; live verification remains blocked until uPress pull/cache clear.

### ACTION-PUBLIC-ROUTE-HOME-REDIRECT-TRIAGE-001: Record initial redirect blockers for priority public routes
**Status:** COMPLETED / VERIFIED LIVE / BLOCKED BY REDIRECT LAYER
**Why:** The stricter traffic checker exposed homepage fallback on several money/trust routes. The next useful step was to separate initial redirect failures from final HTTP `200` homepage HTML so deployment/server cleanup can target the right layer.
**Actions:**
1. DONE: updated `tools/check-live-traffic-priority.mjs` to record initial manual redirect status and location.
2. DONE: created `project-control/public-route-home-redirect-triage-2026-05-21.md`.
3. DONE: created `project-control/public-route-home-redirect-triage-2026-05-21.csv`.
4. GENERATED: `reports/traffic-priority-audit-2026-05-21-route-home-redirects.csv`.
5. VERIFIED LIVE: `6` priority URLs returned initial `200`: `/`, `/articles/`, `/family-law/`, `/lawyers/?area=family-law`, `/criminal-defense-attorney/`, `/traffic-lawyer/`.
6. BLOCKED LIVE: `6` priority URLs returned initial `301` to `/`: `/site-map/`, `/medical-malpractice-lawyer/`, `/real-estate-lawyer-guide/`, `/inheritance-lawyer/`, `/contact/`, `/about/`.
7. VERIFIED LOCAL: `node --check tools/check-live-traffic-priority.mjs` passed.
8. NEXT: after uPress pull/cache clear, rerun the checker. If the same initial `301` persists, remove the stale home-redirect rule from uPress/server/plugin/permalink manager.
9. BLOCKED: no content upload or support-link publication should depend on the blocked routes until each returns initial `200` on its own final path.

### ACTION-REAL-ESTATE-GUIDE-REDIRECT-GUARD-001: Guard recovered guide route from stale redirects
**Status:** CODE FIXED / NOT LIVE VERIFIED / BLOCKED LIVE BEFORE DEPLOY
**Why:** The real-estate public edit package excluded `/real-estate-lawyer-guide/` because the live URL resolves away from the controlled guide route. This must be repaired before the guide can join the real-estate internal-link/upload batch.
**Actions:**
1. DONE: created `project-control/real-estate-guide-redirect-guard-2026-05-21.md`.
2. DONE: created `project-control/real-estate-guide-redirect-guard-2026-05-21.csv`.
3. FIXED: `inc/routing-guards.php` blocks WordPress-level redirects from `/real-estate-lawyer-guide/` to `/` or `/real-estate-attorney`.
4. FIXED: `tools/check-live-traffic-priority.mjs` now requires route checks to finish on their expected final path.
5. VERIFIED LOCAL: `php -l inc/routing-guards.php` passed.
6. VERIFIED LOCAL: `php -l functions.php` passed.
7. VERIFIED LOCAL: `node --check tools/check-live-traffic-priority.mjs` passed.
8. NOT LIVE VERIFIED: public route still needs uPress pull/cache clear and post-deploy final-path check.
9. NEXT: after deploy, rerun `node tools/check-live-traffic-priority.mjs`; if the route still redirects before the new marker appears, inspect uPress/server/Redirection-plugin rules.
10. BLOCKED: do not include `/real-estate-lawyer-guide/` in CMS/internal-link publication until it returns `200` on its own final path.
11. ROUTE QA BACKLOG: the stricter checker also flags `/site-map/`, `/medical-malpractice-lawyer/`, `/inheritance-lawyer/`, `/contact/` and `/about/` as homepage-fallback final-path failures on the current live server.

### ACTION-REAL-ESTATE-PUBLIC-EDIT-PACKAGE-001: Prepare exact public edit package for Israeli real-estate hub
**Status:** COMPLETED / REVIEW ONLY / VERIFIED LIVE CHECKS
**Why:** T361/T351 had mapped the real-estate hub and support roles. The next useful non-CMS step was exact owner-approval text and link placement so a later upload can be done as one controlled batch.
**Actions:**
1. DONE: created `project-control/real-estate-public-edit-package-2026-05-21.md`.
2. DONE: created `project-control/real-estate-public-edit-package-2026-05-21.csv`.
3. VERIFIED LIVE: `/real-estate-attorney/` returned `200`, stayed on its own URL and self-canonicalized.
4. VERIFIED LIVE: five safe support URLs returned `200`, self-canonicalized and had `0` sampled links to `/real-estate-attorney/`.
5. BLOCKED LIVE: `/real-estate-lawyer-guide/` currently resolves to homepage URL/canonical and must not be used in the edit batch until route QA is repaired.
6. READY: exact Hebrew insert text is prepared for hub intro/navigation plus support-to-hub links from purchase/sale, registration, land-appreciation-tax, cost and appraiser pages.
7. HOLD: family-overlap real-estate pages and foreign-investment pages are excluded from the first Israeli real-estate lawyer batch.
8. NEXT: owner approves the exact insert package, then execute CMS edits one page at a time with before/after backups and post-upload fetch checks.
9. BLOCKED: no public CMS body/title/H1/meta, URL slug, redirect, canonical, noindex, taxonomy, sitemap, lawyer, lead, payment, GSC/GA4 or wp-admin setting was changed.

### ACTION-RECOMMENDATION-TOKEN-SAFETY-CHECKER-001: Add static safety checker for token intake
**Status:** COMPLETED / TOOLING FIXED / VERIFIED LOCAL
**Why:** Authenticated token QA is blocked by owner/admin access. The repo still needed a repeatable local guard so future recommendation, schema or SMS work cannot accidentally publish first-party submissions or add review schema too early.
**Actions:**
1. DONE: created `tools/check-recommendation-token-safety.mjs`.
2. DONE: created `project-control/recommendation-token-safety-checker-2026-05-21.md`.
3. DONE: created `project-control/recommendation-token-safety-checker-2026-05-21.csv`.
4. VERIFIED LOCAL: `node --check tools/check-recommendation-token-safety.mjs` passed.
5. VERIFIED LOCAL: `node tools/check-recommendation-token-safety.mjs` passed.
6. VERIFIED LOCAL: checker confirms token submissions are draft-only, first-party, confirmed, `draft_review`, and do not set `approved_public`.
7. VERIFIED LOCAL: checker confirms no `AggregateRating` or Review schema is added by the token flow.
8. NEXT: run this checker before uPress pull and before any future reputation/schema/SMS change.
9. BLOCKED: authenticated admin create-link QA, live token form QA, database write verification and email delivery verification still require owner/admin access.

### ACTION-FIRST-PARTY-RECOMMENDATION-TOKEN-INTAKE-001: Add owner-controlled recommendation intake links
**Status:** COMPLETED / CODE FIXED / NOT LIVE VERIFIED
**Why:** T367 needed a safe first-party recommendation intake flow after the display guard. The system must collect real recommendations as drafts without publishing, importing Google review text or sending client messages automatically.
**Actions:**
1. DONE: updated `inc/lawyer-recommendations.php`.
2. DONE: updated `inc/lawyer-onboarding.php`.
3. DONE: created `project-control/first-party-recommendation-token-intake-2026-05-21.md`.
4. DONE: created `project-control/first-party-recommendation-token-intake-2026-05-21.csv`.
5. VERIFIED LOCAL: `php -l inc/lawyer-recommendations.php` passed.
6. VERIFIED LOCAL: `php -l inc/lawyer-onboarding.php` passed.
7. VERIFIED LOCAL: token submissions create draft first-party recommendations only; public display still requires manual `approved_public`, `confirmed`, `first_party`, published post and profile display opt-in.
8. BLOCKED: authenticated admin create-link QA, live token form QA and public profile display QA require uPress pull/cache refresh plus owner/admin access.
9. NEXT: run one controlled owner QA path with a real approved lawyer profile and a safe first-party test recommendation.
10. BLOCKED: no Google API, Google OAuth, Google import, outbound client SMS/email, public Review schema, AggregateRating, live CMS record, redirect, sitemap or payment setting changed.

### ACTION-FIRST-PARTY-RECOMMENDATION-DISPLAY-GUARD-001: Restrict public recommendations to approved first-party sources
**Status:** COMPLETED / CODE FIXED / NOT LIVE VERIFIED
**Why:** T367 had a first-party recommendation CPT and profile display path, but public queries needed a stricter source guard so Google-linked/manual-imported records cannot accidentally become public recommendation content.
**Actions:**
1. DONE: updated `inc/lawyer-recommendations.php`.
2. DONE: created `project-control/public-recommendations-display-guard-2026-05-21.md`.
3. DONE: created `project-control/public-recommendations-display-guard-2026-05-21.csv`.
4. VERIFIED LOCAL: `php -l inc/lawyer-recommendations.php` passed.
5. VERIFIED: public recommendation queries now require linked lawyer ID, `approved_public`, `confirmed` permission and `recommendation_source_type=first_party` by default.
6. BLOCKED: live/public verification requires uPress pull/cache refresh and a real approved first-party recommendation test record.
7. NEXT: build recommendation request token/intake flow, then run authenticated owner QA.
8. BLOCKED: no Google API connection, Google review import, outbound SMS/email, public review schema, AggregateRating, CMS database row, recommendation/lawyer/customer record, payment setting, redirect, sitemap or outreach message was changed.

### ACTION-LAWYER-PLATFORM-OWNER-WALKTHROUGH-001: Complete live-aware owner guide for lawyer platform
**Status:** COMPLETED / VERIFIED DOCS / READ-ONLY LIVE CHECKS
**Why:** The owner walkthrough still described a PR-era state, while the live repo now includes Lawyer Onboarding command center, prospect follow-up views, Outreach Links handoff, reputation workflow and LegalTech lead-form prefill.
**Actions:**
1. DONE: updated `project-control/lawyer-platform-owner-walkthrough-2026-05-20.md`.
2. VERIFIED LIVE: `/`, `/lawyer-plans/`, `/lawyer-registration/`, `/lawyer-dashboard/` and `/lawyers/` returned `200`.
3. VERIFIED LIVE: `/legal-tools/` still resolves to the homepage, so direct LegalTech archive promotion remains blocked.
4. VERIFIED LIVE: homepage source contains `legaltech-tools`, `AI Console`, `ask-lawyer` and `data-lead-message`; it has no direct `/legal-tools/` archive link and no page-level `noindex`.
5. VERIFIED PRIVATE: unauthenticated access to Lawyer Onboarding, Lawyer Prospects and Outreach Links redirects to WordPress login.
6. COMPLETED: task-board item `T368`.
7. NEXT: owner should run one authenticated admin walkthrough, then either start the first controlled 10-20 lawyer outreach batch or keep preparing the reputation/public-profile display gate.
8. BLOCKED: no public CMS page, database row, lawyer, lead, prospect, product, payment, redirect, sitemap, taxonomy, title/H1/meta or outreach message was changed.

### ACTION-WAVE-1B-SUPPORT-METADATA-PACKAGE-001: Prepare metadata for six Family/Divorce support pages
**Status:** COMPLETED / REVIEW ONLY / VERIFIED PLANNING
**Why:** All six support bodies are clean, but support pages also need exact title/H1/meta/taxonomy boundaries before any future support upload.
**Actions:**
1. DONE: created `project-control/family-divorce-wave-1b-support-metadata-package-2026-05-12.md`.
2. DONE: created `project-control/family-divorce-wave-1b-support-metadata-package-2026-05-12.csv`.
3. VERIFIED LIVE: all six support URLs returned `200` and self-canonicalized.
4. VERIFIED: `6` metadata rows cover H1/title, meta description, OG posture, breadcrumb labels, taxonomy, related-link boundaries and schema/trust exclusions.
5. RECOMMENDED: preserve the current safe support metadata unless owner requests edits.
6. BLOCKED: support metadata execution and support upload remain blocked until owner/legal/source approval.
7. NEXT: owner approves support copy/metadata scope, or keep support blocked until `/divorce-lawyer/` passes controlled QA.
8. BLOCKED: no public content, draft import, title/H1/meta, URL migration, redirect, deletion, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, document/media, schema, lawyer-card, Maya profile, review/rating, CRM, wp-admin setting or CMS/database action was executed.

### ACTION-DIVORCE-LAWYER-CMS-FIELD-MAP-001: Prepare `/divorce-lawyer/` CMS upload field map
**Status:** COMPLETED / REVIEW ONLY / VERIFIED PLANNING
**Why:** The clean body and metadata package were ready for approval, but the first upload also needs a practical CMS field worksheet before any operator touches WordPress.
**Actions:**
1. DONE: created `project-control/family-divorce-divorce-lawyer-cms-upload-field-map-2026-05-12.md`.
2. DONE: created `project-control/family-divorce-divorce-lawyer-cms-upload-field-map-2026-05-12.csv`.
3. VERIFIED: `24` field/action rows cover backup, body, H1/title, SEO meta, OG, breadcrumb, canonical, robots, taxonomy, related links, schema safety, disclaimer, CTA, post-upload QA and GSC monitoring.
4. VERIFIED: field map keeps `/divorce-lawyer/` and the self-canonical unchanged.
5. BLOCKED: CMS execution remains blocked until owner approval of clean body, metadata and field map.
6. NEXT: owner approves or edits the three-piece upload packet; then run controlled upload QA before CMS edit.
7. BLOCKED: no public content, draft import, title/H1/meta, URL migration, redirect, deletion, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, document/media, schema, lawyer-card, Maya profile, review/rating, CRM, wp-admin setting or CMS/database action was executed.

### ACTION-DIVORCE-LAWYER-METADATA-PACKAGE-001: Prepare exact `/divorce-lawyer/` title/H1/meta package
**Status:** COMPLETED / REVIEW ONLY / VERIFIED PLANNING
**Why:** The first upload decision brief recommended Wave 1A only, but the exact metadata fields needed owner-review packaging before any CMS work.
**Actions:**
1. DONE: created `project-control/family-divorce-divorce-lawyer-metadata-package-2026-05-12.md`.
2. DONE: created `project-control/family-divorce-divorce-lawyer-metadata-package-2026-05-12.csv`.
3. VERIFIED: live `/divorce-lawyer/` returned `200` and self-canonicalized before any change.
4. VERIFIED: package recommends a tighter H1/title/meta while keeping `/divorce-lawyer/` and the canonical unchanged.
5. VERIFIED: taxonomy is limited to `family-law` and `divorce`; related links are limited to approved Family/Divorce support paths.
6. BLOCKED: Review/AggregateRating/fake-rating/fake-trust/recommendation language remains blocked.
7. NEXT: owner approves or edits the clean body plus this metadata package; then use the controlled upload QA package before any CMS edit.
8. BLOCKED: no public content, draft import, title/H1/meta, URL migration, redirect, deletion, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, document/media, schema, lawyer-card, Maya profile, review/rating, CRM, wp-admin setting or CMS/database action was executed.

### ACTION-FIRST-UPLOAD-DECISION-BRIEF-001: Prepare first Family/Divorce upload decision brief
**Status:** COMPLETED / REVIEW ONLY / VERIFIED PLANNING
**Why:** The cluster has clean copy and QA packages, but owner approval needs a short practical decision layer before any public upload.
**Actions:**
1. DONE: created `project-control/family-divorce-first-upload-decision-brief-2026-05-12.md`.
2. DONE: created `project-control/family-divorce-first-upload-decision-brief-2026-05-12.csv`.
3. VERIFIED: `10` decision rows cover Wave 1A first upload, support copy approval, lower-risk support path, protected assets, taxonomy, related links, schema/trust exclusions, GSC API and next action.
4. RECOMMENDED: first public upload should be Wave 1A only: `/divorce-lawyer/`.
5. BLOCKED: `FAM-UPLOAD-055` requires owner approval before any public Family/Divorce upload scope.
6. NEXT: owner approves or edits `content-drafts/divorce-lawyer-public-body-he.md`; if approval is not ready, prepare exact `/divorce-lawyer/` title/H1/meta package as repo-only work.
7. BLOCKED: no public content, draft import, title/H1/meta, URL migration, redirect, deletion, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, document/media, schema, lawyer-card, Maya profile, review/rating, CRM, wp-admin setting or CMS/database action was executed.

### ACTION-WAVE-1B-SUPPORT-APPROVAL-PACKAGE-001: Package six clean support bodies for owner review
**Status:** COMPLETED / REVIEW ONLY / VERIFIED PLANNING
**Why:** All six Wave 1B support bodies are clean, so the next useful gate is an owner/legal/source approval package before any support upload.
**Actions:**
1. DONE: created `project-control/family-divorce-wave-1b-support-approval-package-2026-05-12.md`.
2. DONE: created `project-control/family-divorce-wave-1b-support-approval-package-2026-05-12.csv`.
3. VERIFIED: package covers all six support bodies: `/consensual-divorce/`, `/divorce-mediation/`, `/divorce-property-division/`, `/family-dispute-resolution/`, `/child-support/` and `/child-custody/`.
4. VERIFIED: the six clean bodies total `11,222` words across `435` lines.
5. VERIFIED: strict scans found no internal planning notes, `TODO`/`TBD`, Maya/profile notes, LegalTech notes, fake-trust language, fake-rating language, recommendation-label terms or guaranteed-result claims.
6. FIXED: neutralized two harmless `מומלץ` wording hits in prior clean bodies so the strict scan is clean.
7. VERIFIED: `FAM-UPLOAD-052` is now planning-verified.
8. BLOCKED: `FAM-UPLOAD-053` requires owner/legal/source approval before support upload scope.
9. NEXT: owner chooses approve copy only, approve lower-risk support pages first, edit selected pages, hold all support until `/divorce-lawyer/`, or approve Wave 1B after pillar QA.
10. BLOCKED: no public content, draft import, title/H1/meta, URL migration, redirect, deletion, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, document/media, schema, lawyer-card, Maya profile, review/rating, CRM, wp-admin setting or CMS/database action was executed.

### ACTION-CHILD-CUSTODY-CMS-CLEAN-BODY-001: Create clean `/child-custody/` public body
**Status:** COMPLETED / REVIEW ONLY / PARTIAL VERIFIED
**Why:** The sixth Wave 1B support page needed a clean public body before any owner/legal/source review or CMS upload.
**Actions:**
1. DONE: created `content-drafts/child-custody-public-body-he.md`.
2. VERIFIED: clean public body is `1,693` words across `54` lines.
3. VERIFIED: scans found no internal planning notes, `TODO`/`TBD`, Maya/profile notes, LegalTech notes, fake-trust language, fake-rating language, custody-result promises or guaranteed-result claims.
4. VERIFIED: required Family/Divorce related paths were found for `/divorce-lawyer/`, `/child-support/`, `/consensual-divorce/`, `/divorce-mediation/`, `/divorce-property-division/` and `/family-dispute-resolution/`.
5. PARTIAL VERIFIED: `FAM-UPLOAD-050` is now partially verified because the clean file exists.
6. BLOCKED: `FAM-UPLOAD-051` requires owner/legal/source approval before any upload.
7. VERIFIED: all six Wave 1B support pages now have CMS-clean public bodies.
8. NEXT: review the six clean support bodies as one owner/legal/source approval batch, or return to `/divorce-lawyer/` for the first controlled upload decision if owner approval is ready.
9. BLOCKED: no public content, draft import, title/H1/meta, URL migration, redirect, deletion, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, document/media, schema, lawyer-card, Maya profile, review/rating, CRM, wp-admin setting or CMS/database action was executed.

### ACTION-CHILD-SUPPORT-CMS-CLEAN-BODY-001: Create clean `/child-support/` public body
**Status:** COMPLETED / REVIEW ONLY / PARTIAL VERIFIED
**Why:** The fifth Wave 1B support page needed a clean public body before any owner/legal/source review or CMS upload.
**Actions:**
1. DONE: created `content-drafts/child-support-public-body-he.md`.
2. VERIFIED: clean public body is `1,729` words across `49` lines.
3. VERIFIED: scans found no internal planning notes, `TODO`/`TBD`, Maya/profile notes, LegalTech notes, fake-trust language, fake-rating language, fixed calculator promises or guaranteed-result claims.
4. VERIFIED: required Family/Divorce related paths were found for `/divorce-lawyer/`, `/consensual-divorce/`, `/divorce-mediation/`, `/child-custody/`, `/divorce-property-division/` and `/family-dispute-resolution/`.
5. PARTIAL VERIFIED: `FAM-UPLOAD-048` is now partially verified because the clean file exists.
6. BLOCKED: `FAM-UPLOAD-049` requires owner/legal/source approval before any upload.
7. NEXT: `/child-custody/` clean body now exists; review all six Wave 1B clean support bodies or return to `/divorce-lawyer/` for the first controlled upload decision.
8. BLOCKED: no public content, draft import, title/H1/meta, URL migration, redirect, deletion, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, document/media, schema, lawyer-card, Maya profile, review/rating, CRM, wp-admin setting or CMS/database action was executed.

### ACTION-FAMILY-DISPUTE-RESOLUTION-CMS-CLEAN-BODY-001: Create clean `/family-dispute-resolution/` public body
**Status:** COMPLETED / REVIEW ONLY / PARTIAL VERIFIED
**Why:** The fourth Wave 1B support page needed a clean public body before any owner/legal/source review or CMS upload.
**Actions:**
1. DONE: created `content-drafts/family-dispute-resolution-public-body-he.md`.
2. VERIFIED: clean public body is `1,992` words across `87` lines.
3. VERIFIED: scans found no internal planning notes, `TODO`/`TBD`, Maya/profile notes, LegalTech notes, fake-trust language, fake-rating language or guaranteed-result claims.
4. VERIFIED: required Family/Divorce related paths were found for `/divorce-lawyer/`, `/consensual-divorce/`, `/divorce-mediation/`, `/child-support/`, `/child-custody/` and `/divorce-property-division/`.
5. PARTIAL VERIFIED: `FAM-UPLOAD-046` is now partially verified because the clean file exists.
6. BLOCKED: `FAM-UPLOAD-047` requires owner/legal/source approval before any upload.
7. NEXT: `/child-support/` and `/child-custody/` clean bodies now exist; review all six Wave 1B clean support bodies or return to `/divorce-lawyer/` for the first controlled upload decision.
8. BLOCKED: no public content, draft import, title/H1/meta, URL migration, redirect, deletion, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, document/media, schema, lawyer-card, Maya profile, review/rating, CRM, wp-admin setting or CMS/database action was executed.

### ACTION-DIVORCE-PROPERTY-DIVISION-CMS-CLEAN-BODY-001: Create clean `/divorce-property-division/` public body
**Status:** COMPLETED / REVIEW ONLY / PARTIAL VERIFIED
**Why:** The third Wave 1B support page needed a clean public body before any owner/legal/source review or CMS upload.
**Actions:**
1. DONE: created `content-drafts/divorce-property-division-public-body-he.md`.
2. VERIFIED: clean public body is `1,874` words across `89` lines.
3. VERIFIED: scans found no internal planning notes, `TODO`/`TBD`, Maya/profile notes, LegalTech notes, fake-trust language, fake-rating language or guaranteed-result claims.
4. VERIFIED: required Family/Divorce related paths were found for `/divorce-lawyer/`, `/consensual-divorce/`, `/divorce-mediation/`, `/child-support/`, `/child-custody/` and `/family-dispute-resolution/`.
5. PARTIAL VERIFIED: `FAM-UPLOAD-044` is now partially verified because the clean file exists.
6. BLOCKED: `FAM-UPLOAD-045` requires owner/legal/source approval before any upload.
7. NEXT: `/family-dispute-resolution/`, `/child-support/` and `/child-custody/` clean bodies now exist; review all six Wave 1B clean support bodies or return to `/divorce-lawyer/` for the first controlled upload decision.
8. BLOCKED: no public content, draft import, title/H1/meta, URL migration, redirect, deletion, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, document/media, schema, lawyer-card, Maya profile, review/rating, CRM, wp-admin setting or CMS/database action was executed.

### ACTION-DIVORCE-MEDIATION-CMS-CLEAN-BODY-001: Create clean `/divorce-mediation/` public body
**Status:** COMPLETED / REVIEW ONLY / PARTIAL VERIFIED
**Why:** The second Wave 1B support page needed a clean public body before any owner/legal/source review or CMS upload.
**Actions:**
1. DONE: created `content-drafts/divorce-mediation-public-body-he.md`.
2. VERIFIED: clean public body is `2,059` words across `77` lines.
3. VERIFIED: scans found no internal planning notes, `TODO`/`TBD`, Maya/profile notes, LegalTech notes, fake-trust language, fake-rating language or guaranteed-result claims.
4. VERIFIED: required Family/Divorce related paths were found for `/divorce-lawyer/`, `/consensual-divorce/`, `/child-support/`, `/child-custody/`, `/divorce-property-division/` and `/family-dispute-resolution/`.
5. PARTIAL VERIFIED: `FAM-UPLOAD-042` is now partially verified because the clean file exists.
6. BLOCKED: `FAM-UPLOAD-043` requires owner/legal/source approval before any upload.
7. NEXT: `/divorce-property-division/`, `/family-dispute-resolution/`, `/child-support/` and `/child-custody/` clean bodies now exist; review all six Wave 1B clean support bodies or return to `/divorce-lawyer/` for the first controlled upload decision.
8. BLOCKED: no public content, draft import, title/H1/meta, URL migration, redirect, deletion, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, document/media, schema, lawyer-card, Maya profile, review/rating, CRM, wp-admin setting or CMS/database action was executed.

### ACTION-CONSENSUAL-DIVORCE-CMS-CLEAN-BODY-001: Create clean `/consensual-divorce/` public body
**Status:** COMPLETED / REVIEW ONLY / PARTIAL VERIFIED
**Why:** The first Wave 1B support page needed a clean public body before any owner/legal/source review or CMS upload.
**Actions:**
1. DONE: created `content-drafts/consensual-divorce-public-body-he.md`.
2. VERIFIED: clean public body is `1,875` words across `79` lines.
3. VERIFIED: scans found no internal planning notes, `TODO`/`TBD`, Maya/profile notes, LegalTech notes, fake-trust language, fake-rating language or guaranteed-result claims.
4. PARTIAL VERIFIED: `FAM-UPLOAD-040` is now partially verified because the clean file exists.
5. BLOCKED: `FAM-UPLOAD-041` requires owner/legal/source approval before any upload.
6. NEXT: `/divorce-mediation/`, `/divorce-property-division/`, `/family-dispute-resolution/`, `/child-support/` and `/child-custody/` clean bodies now exist; review all six Wave 1B clean support bodies or return to `/divorce-lawyer/` for the first controlled upload decision.
7. BLOCKED: no public content, draft import, title/H1/meta, URL migration, redirect, deletion, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, document/media, schema, lawyer-card, Maya profile, review/rating, CRM, wp-admin setting or CMS/database action was executed.

### ACTION-FAMILY-DIVORCE-WAVE-1B-SUPPORT-REVIEW-001: Review support-page drafts as a batch
**Status:** COMPLETED / REVIEW ONLY / VERIFIED PLANNING
**Why:** `/divorce-lawyer/` is blocked by approval, so the next useful repo-only work is preparing the six support pages without touching the public site.
**Actions:**
1. DONE: created `project-control/family-divorce-wave-1b-support-review-package-2026-05-12.md`.
2. DONE: created `project-control/family-divorce-wave-1b-support-review-package-2026-05-12.csv`.
3. VERIFIED: `6` support drafts exist and total `27,277` words.
4. VERIFIED: all six drafts target clean English URLs and support `/divorce-lawyer/`.
5. PARTIAL VERIFIED / NOT APPROVED: all six support pages now have clean public bodies, but none are approved for public upload.
6. NEXT: review the six clean support bodies as one owner/legal/source approval batch, or return to `/divorce-lawyer/` for the first controlled upload decision.
7. BLOCKED: no public content, draft import, title/H1/meta, URL migration, redirect, deletion, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, document/media, schema, lawyer-card, Maya profile, review/rating, CRM, wp-admin setting or CMS/database action was executed.

### ACTION-DIVORCE-LAWYER-CONTROLLED-UPLOAD-QA-001: Prepare controlled upload QA package
**Status:** COMPLETED / REVIEW ONLY / VERIFIED PLANNING
**Why:** After the clean body is approved, the first upload needs a precise checklist so we do not accidentally change URLs, old assets, schema, taxonomy or related cards.
**Actions:**
1. DONE: created `project-control/family-divorce-controlled-upload-qa-package-2026-05-12.md`.
2. DONE: created `project-control/family-divorce-controlled-upload-qa-package-2026-05-12.csv`.
3. VERIFIED: `32` QA rows cover pre-upload approval, backup, body cleanliness, metadata, taxonomy, related cards, protected URLs/assets, canonical/indexability, mobile/desktop QA, GSC follow-up and rollback.
4. VERIFIED: `FAM-UPLOAD-037` is now planning-verified.
5. BLOCKED: `FAM-UPLOAD-038` cannot run until owner/legal/source approval and preview/public upload exist.
6. NEXT: owner/legal/source review approves or edits the clean body; after approval, use this package before and after the CMS update.
7. BLOCKED: no public content, draft import, title/H1/meta, URL migration, redirect, deletion, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, document/media, schema, lawyer-card, Maya profile, review/rating, CRM, wp-admin setting or CMS/database action was executed.

### ACTION-DIVORCE-LAWYER-CMS-CLEAN-BODY-001: Create clean `/divorce-lawyer/` public body
**Status:** COMPLETED / REVIEW ONLY / PARTIAL VERIFIED
**Why:** The final draft package was too editorial for direct upload. The first controlled Family/Divorce upload candidate needed a clean public body with internal notes removed.
**Actions:**
1. DONE: created `content-drafts/divorce-lawyer-public-body-he.md`.
2. VERIFIED: clean public body is `2,374` words across `92` lines.
3. VERIFIED: scans found no internal planning notes, `TODO`/`TBD`, fake-trust language, fake-rating language or guaranteed-result claims.
4. PARTIAL VERIFIED: `FAM-UPLOAD-035` is now partially verified because the clean file exists.
5. BLOCKED: `FAM-UPLOAD-036` requires owner/legal/source approval before any upload.
6. NEXT: approve the clean body or request edits; after approval, prepare controlled upload QA before any CMS/public change.
7. BLOCKED: no public content, draft import, title/H1/meta, URL migration, redirect, deletion, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, document/media, schema, lawyer-card, Maya profile, review/rating, CRM, wp-admin setting or CMS/database action was executed.

### ACTION-DIVORCE-LAWYER-FINAL-DRAFT-PACKAGE-001: Package final `/divorce-lawyer/` draft update
**Status:** COMPLETED / REVIEW ONLY / PARTIAL VERIFIED
**Why:** The current Hebrew draft is deep enough for a final copy pass, but it still includes internal notes and duplicate sections that must not be uploaded.
**Actions:**
1. DONE: created `project-control/family-divorce-divorce-lawyer-final-draft-package-2026-05-12.md`.
2. DONE: created `project-control/family-divorce-divorce-lawyer-final-draft-package-2026-05-12.csv`.
3. VERIFIED: `36` package rows cover CMS fields, internal-note removals, section actions, related-content controls, schema block and URL hold state.
4. PARTIAL VERIFIED: `FAM-UPLOAD-027` is now partially verified; final package exists and the clean public body file was created in the next action.
5. NEXT: owner/legal/source review of the clean body, then use the controlled upload QA package if upload is approved.
6. BLOCKED: no public content, draft import, title/H1/meta, URL migration, redirect, deletion, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, document/media, schema, lawyer-card, Maya profile, review/rating, CRM, wp-admin setting or CMS/database action was executed.

### ACTION-FAMILY-DIVORCE-FIRST-UPLOAD-PACKAGE-001: Package first upload scope for owner review
**Status:** COMPLETED / REVIEW ONLY
**Why:** Family/Divorce now has pillar, support, taxonomy, related-content, disclaimer and protected-asset planning. The next useful step is one practical upload sequence so the owner can choose Wave 1A only or Wave 1A plus support pages.
**Actions:**
1. DONE: created `project-control/family-divorce-first-upload-package-2026-05-12.md`.
2. DONE: created `project-control/family-divorce-first-upload-package-2026-05-12.csv`.
3. VERIFIED: `20` package rows define Wave 1A, Wave 1B, Wave 1C, wait-list, QA and GSC lanes.
4. VERIFIED: Wave 1A is `/divorce-lawyer/`; Wave 1B contains the six core support pages with drafts available but review required.
5. NEXT: prepare the final merged `/divorce-lawyer/` draft/update package as the next unblocked content task.
6. BLOCKED: no public content, draft import, title/H1/meta, URL migration, redirect, deletion, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, document/media, schema, lawyer-card, Maya profile, review/rating, CRM, wp-admin setting or CMS/database action was executed.

### ACTION-FAMILY-DIVORCE-PROTECTED-ASSETS-001: Plan first-wave protected document tool and case-law assets
**Status:** COMPLETED / REVIEW ONLY
**Why:** Family/Divorce can move faster cluster by cluster, but PDFs, DOCX files, calculator URLs and case-law assets with search visibility must stay protected during the first upload.
**Actions:**
1. DONE: created `project-control/family-divorce-protected-assets-strategy-2026-05-12.md`.
2. DONE: created `project-control/family-divorce-protected-assets-strategy-2026-05-12.csv`.
3. VERIFIED: `16` protected asset rows cover the divorce PDF, mediation DOCX, child-support calculator, 919/15 case-law, custody article, custody PDF, sole-mother custody case reference and post-upload QA gates.
4. VERIFIED: `FAM-UPLOAD-003`, `FAM-UPLOAD-004`, `FAM-UPLOAD-005` and `FAM-UPLOAD-006` are now planning-verified, not execution-approved.
5. NEXT: run GSC API export when access is available and include protected asset verification in the first Family/Divorce upload QA package.
6. BLOCKED: no public content, title/H1/meta, URL migration, redirect, deletion, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, document/media, schema, lawyer-card, Maya profile, review/rating, CRM, wp-admin setting or CMS/database action was executed.

### ACTION-FAMILY-DIVORCE-DISCLAIMER-CTA-001: Plan first-wave Family/Divorce disclaimers and safe CTAs
**Status:** COMPLETED / REVIEW ONLY
**Why:** The first Family/Divorce upload needs visible no-legal-advice disclaimers, safe lead language, urgent-risk caution and no fake trust/rating/recommendation claims.
**Actions:**
1. DONE: created `project-control/family-divorce-disclaimer-cta-policy-2026-05-12.md`.
2. DONE: created `project-control/family-divorce-disclaimer-cta-policy-2026-05-12.csv`.
3. VERIFIED: `20` policy rows define article disclaimers, CTA disclaimers, urgent-risk warnings, page-specific boundaries, Maya/profile limits and schema exclusions.
4. VERIFIED: `FAM-UPLOAD-016` is now planning-verified, while live disclaimer QA remains blocked until preview/upload exists.
5. NEXT: owner approves disclaimer/CTA rules with the Family/Divorce upload package; post-upload QA verifies visible disclaimers and no fake trust language.
6. BLOCKED: no public content, title/H1/meta, URL migration, redirect, deletion, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, schema, lawyer-card, Maya profile, review/rating, CRM, wp-admin setting or CMS/database action was executed.

### ACTION-FAMILY-DIVORCE-TAXONOMY-CATEGORY-001: Plan first-wave Family/Divorce taxonomy/category rules
**Status:** COMPLETED / REVIEW ONLY
**Why:** The first Family/Divorce upload must not drift into noisy legacy categories, duplicate term archives, city terms or unrelated practice-area slugs.
**Actions:**
1. DONE: created `project-control/family-divorce-taxonomy-category-plan-2026-05-12.md`.
2. DONE: created `project-control/family-divorce-taxonomy-category-plan-2026-05-12.csv`.
3. VERIFIED: `22` decision rows define allowed existing terms, held terms, blocked new term creation, metadata rules and post-upload taxonomy QA.
4. VERIFIED: first-wave upload should use existing `practice-areas` terms only: `family-law`, `divorce`, `child-support` and `child-custody`.
5. REVIEW: `prenuptial-agreement` has a slug collision risk and must not be used for `הסכם ממון` until the term map is reviewed.
6. NEXT: owner approves taxonomy/category rules with the Family/Divorce upload package; then post-import QA must verify actual term assignments.
7. BLOCKED: no public content, title/H1/meta, URL migration, redirect, deletion, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, schema, lawyer-card, Maya profile, review/rating, CRM, wp-admin setting or CMS/database action was executed.

### ACTION-FAMILY-DIVORCE-RELATED-CONTENT-BOUNDARY-001: Plan `/divorce-lawyer/` related-content allowlist
**Status:** COMPLETED / REVIEW ONLY
**Why:** The first divorce pillar upload must not show broad recommendation, trust, city, LegalTech, Maya/profile or protected document assets as related authority.
**Actions:**
1. DONE: created `project-control/family-divorce-related-content-boundary-plan-2026-05-12.md`.
2. DONE: created `project-control/family-divorce-related-content-boundary-plan-2026-05-12.csv`.
3. VERIFIED: `20` related-content decision rows now define allowed primary cards, secondary/deep support links, conditional freshness/legal gates and blocked related-card categories.
4. VERIFIED: primary related cards for first upload should be `/consensual-divorce/`, `/divorce-mediation/`, `/child-support/` and `/child-custody/` after owner/content/legal review.
5. NEXT: owner approves the related-content boundary with the draft package; then prepare the final merged `/divorce-lawyer/` update package or run GSC API export first.
6. BLOCKED: no public content, title/H1/meta, URL migration, redirect, deletion, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, schema, lawyer-card, Maya profile, review/rating, CRM, wp-admin setting or CMS/database action was executed.

### ACTION-FAMILY-DIVORCE-PILLAR-OWNER-REVIEW-001: Package `/divorce-lawyer/` owner-review draft/update gate
**Status:** COMPLETED / REVIEW ONLY
**Why:** The first Family/Divorce upload candidate needs owner approval gates before final merged draft preparation or public execution.
**Actions:**
1. DONE: created `project-control/family-divorce-pillar-owner-review-draft-package-2026-05-12.md`.
2. DONE: created `project-control/family-divorce-pillar-owner-review-draft-package-2026-05-12.csv`.
3. VERIFIED: `15` owner decision rows now cover primary URL, merge sources, support boundaries, legal/freshness/document gates, related-content boundary and redirect/canonical/sitemap hold.
4. VERIFIED: `/divorce-lawyer/` remains the first controlled upload candidate, but final Hebrew copy and CMS/public execution remain blocked.
5. NEXT: owner approves this package, or Codex prepares the final merged draft package after GSC API export is available.
6. BLOCKED: no public content, title/H1/meta, URL migration, redirect, deletion, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, schema, lawyer-card, Maya profile, review/rating, CRM, wp-admin setting or CMS/database action was executed.

### ACTION-FAMILY-DIVORCE-PILLAR-SECTION-MERGE-001: Create section-level merge outline for `/divorce-lawyer/`
**Status:** COMPLETED / REVIEW ONLY
**Why:** The clean divorce pillar cannot be uploaded safely until the duplicate-page material is mapped section by section.
**Actions:**
1. DONE: created `project-control/family-divorce-pillar-section-merge-outline-2026-05-12.md`.
2. DONE: created `project-control/family-divorce-pillar-section-merge-outline-2026-05-12.csv`.
3. VERIFIED: `20` target sections now specify source, merge candidates, support links, approval needs and exclusions.
4. VERIFIED: large Hebrew duplicate should feed the pillar; selection and definition pages should merge into the pillar; consultation remains support; broad generic divorce guide waits for process-role decision.
5. REVIEW: live related-content boundaries need cleanup before public upload because broad/recommendation-style items can undermine trust and anti-cannibalization.
6. NEXT: prepare the actual merged `/divorce-lawyer/` owner-review draft/update package, or run GSC API export first if credentials are ready.
7. BLOCKED: no public content, title/H1/meta, URL migration, redirect, deletion, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, schema, lawyer-card, Maya profile, review/rating, CRM, wp-admin setting or CMS/database action was executed.

### ACTION-FAMILY-DIVORCE-DUPLICATE-PAGE-COMPARISON-001: Compare duplicate divorce-lawyer pages before upload
**Status:** COMPLETED / REVIEW ONLY
**Why:** The first Family/Divorce upload cannot be SEO-safe while several live pages target the same divorce-lawyer intent.
**Actions:**
1. DONE: created `project-control/family-divorce-duplicate-page-comparison-2026-05-12.md`.
2. DONE: created `project-control/family-divorce-duplicate-page-comparison-2026-05-12.csv`.
3. VERIFIED LIVE: `6` URLs returned `200` and self-canonicalized.
4. VERIFIED: the large Hebrew duplicate `/עורך-דין-לענייני-גירושין/` is the strongest current section-source candidate and should be mined before enriching `/divorce-lawyer/`.
5. RECOMMENDED: merge the large duplicate plus selection/definition pages into `/divorce-lawyer/`; keep `/divorce-consultation-guide/` as support; hold `/divorce-everything-you-need-to-know/` until process-role review.
6. NEXT: create a section-level merge outline for `/divorce-lawyer/` before any public upload, then run GSC API export once owner provides access.
7. BLOCKED: no public content, title/H1/meta, URL migration, redirect, deletion, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, schema, lawyer-card, Maya profile, review/rating, CRM, wp-admin setting or CMS/database action was executed.

### ACTION-FAMILY-DIVORCE-PILLAR-COMPARISON-001: Compare divorce pillar against old Hebrew URL
**Status:** COMPLETED / REVIEW ONLY
**Why:** `/divorce-lawyer/` is the first upload candidate, but the old Hebrew URL currently has GSC visibility and must be handled deliberately.
**Actions:**
1. DONE: created `project-control/family-divorce-divorce-pillar-side-by-side-2026-05-12.md`.
2. DONE: created `project-control/family-divorce-first-upload-decision-table-2026-05-12.csv`.
3. VERIFIED LIVE: `/divorce-lawyer/` returns `200`, self-canonicalizes and is the best first repair/enrichment candidate.
4. VERIFIED LIVE: the old Hebrew divorce URL returns `200`, self-canonicalizes and has `960` GSC-browser impressions for `עורך דין גירושין`.
5. RECOMMENDED: merge useful old-page content into `/divorce-lawyer/`; keep old URL live short term; decide redirect/canonical after GSC API export and owner approval.
6. NEXT: compare the large duplicate `/עורך-דין-לענייני-גירושין/` and the selection/definition duplicate pages against the same pillar before final upload.
7. BLOCKED: no public content, title/H1/meta, URL migration, redirect, deletion, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, schema, lawyer-card, Maya profile, review/rating, CRM, wp-admin setting or CMS/database action was executed.

### ACTION-FAMILY-DIVORCE-EXECUTION-PLAN-001: Prepare first cluster execution plan and GSC setup guide
**Status:** COMPLETED / REVIEW ONLY
**Why:** Family/Divorce is now the first controlled upload cluster, and owner needs a simple GSC API guide before setup tomorrow.
**Actions:**
1. DONE: created `project-control/gsc-api-setup-guide.md`.
2. DONE: created `project-control/family-law-divorce-execution-plan-2026-05-12.md`.
3. VERIFIED: plan covers competitor research, current pages, old pages to keep/improve/merge, new pages needed, pillar/support structure, internal-link posture, English slug map, redirect/canonical notes, content gap analysis, upload/update checklist and publish/wait sequencing.
4. VERIFIED: GSC guide covers required access, OAuth credential setup, read-only scope, export fields, output files and credential safety.
5. NEXT: compare `/divorce-lawyer/` with the old Hebrew divorce URL and prepare the first upload decision table.
6. BLOCKED: no public content, title/H1/meta, URL migration, redirect, deletion, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, schema, lawyer-card, Maya profile, review/rating, CRM, wp-admin setting or CMS/database action was executed.

### ACTION-STAGED-CLUSTER-PUBLISHING-001: Switch content execution to cluster-by-cluster publishing gates
**Status:** COMPLETED / REVIEW ONLY
**Why:** The full-site audit pace is too slow for the current timeline; staged cluster publishing can move faster while preserving SEO safety.
**Actions:**
1. DONE: created `project-control/cluster-by-cluster-publishing-strategy-2026-05-12.md`.
2. DONE: created `project-control/family-law-pre-upload-minimum-checklist-2026-05-12.md`.
3. DONE: created `project-control/family-law-pre-upload-minimum-checklist-2026-05-12.csv`.
4. DONE: created `project-control/gsc-api-access-plan-2026-05-12.md`.
5. VERIFIED: recommended sequence is Family/Divorce first, then Criminal Law, Medical Malpractice, Traffic, Real Estate and Personal Injury/Damages.
6. VERIFIED: minimum safe gate requires old URL/document protection, anti-cannibalization, pillar/support roles, internal-link map, redirect/canonical/sitemap posture and monitoring before public upload.
7. NEXT: run the Family/Divorce pre-upload comparison cycle and set up GSC API export if access is available.
8. BLOCKED: no public content, title/H1/meta, URL migration, redirect, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, schema, lawyer-card, Maya profile, review/rating, CRM, wp-admin setting or CMS/database action was executed.

### ACTION-FAMILY-DIVORCE-OWNER-UPLOAD-REVIEW-001: Package family/divorce group for owner approval
**Status:** COMPLETED / REVIEW ONLY
**Why:** The family/divorce queue needs one owner-facing approval layer before any Hebrew drafting, draft import, internal-link execution, document strategy, sitemap/canonical change or CMS upload.
**Actions:**
1. DONE: created `project-control/family-divorce-owner-upload-review-package-2026-05-12.md`.
2. DONE: created `project-control/family-divorce-owner-upload-review-package-2026-05-12.csv`.
3. VERIFIED: `13` target decisions are ready for owner review.
4. VERIFIED: package combines old Hebrew divorce URL risk, PDF/DOCX document risk, child-support calculator risk, custody PDF/case risk, support-page roles, internal-link map, upload order, anti-cannibalization rules, family-law hub separation and Maya/compliance boundaries.
5. RECOMMENDED: approve planning only, then compare `/divorce-lawyer/`, the old Hebrew divorce article, the PDF/DOCX assets, child-support/custody protected URLs and support pages side-by-side.
6. NEXT: owner approves planning package or requests a one-page comparison first; otherwise continue the next priority cluster using the same controlled process.
7. BLOCKED: no public content, title/H1/meta, URL migration, redirect, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, schema, lawyer-card, Maya profile, review/rating, CRM, wp-admin setting or CMS/database action was executed.

### ACTION-FAMILY-DIVORCE-NO-URL-INTERNAL-LINK-MAP-001: Plan current-URL links for family/divorce upload group
**Status:** COMPLETED / REVIEW ONLY
**Why:** The family/divorce queue must be connected internally before public upload so the future changes are a coherent cluster rather than disconnected pages.
**Actions:**
1. DONE: created `project-control/family-divorce-no-url-internal-link-map-2026-05-12.md`.
2. DONE: created `project-control/family-divorce-no-url-internal-link-map-2026-05-12.csv`.
3. VERIFIED: `82` planned current-URL relationship/control rows were mapped.
4. VERIFIED: links connect the current divorce pillar candidate, six clean support pages, old GSC-visible URLs, PDF/DOCX assets, child-support/custody risks, property/dispute support pages and ranking/Maya/LegalTech boundaries without using unapproved future slugs or fake trust signals.
5. VERIFIED: relationship type, priority, anchor intent, placement guidance and execution status are documented.
6. NEXT: use the map inside the owner-review upload package and do not execute links until owner/legal review approves public copy and document strategy.
7. BLOCKED: no public content, title/H1/meta, URL migration, redirect, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, schema, lawyer-card, Maya profile, review/rating, CRM, wp-admin setting or CMS/database action was executed.

### ACTION-MEDICAL-MALPRACTICE-OWNER-UPLOAD-REVIEW-001: Package medical-malpractice group for owner approval
**Status:** COMPLETED / REVIEW ONLY
**Why:** The malpractice queue needs one owner-facing approval layer before any Hebrew drafting, internal-link execution, sitemap/canonical change or CMS upload.
**Actions:**
1. DONE: created `project-control/medical-malpractice-owner-upload-review-package-2026-05-11.md`.
2. DONE: created `project-control/medical-malpractice-owner-upload-review-package-2026-05-11.csv`.
3. VERIFIED: `8` target decisions are ready for owner review.
4. VERIFIED: package combines duplicate same-public-URL identity risk, protected fee/birth assets, source/legal gates, current-URL internal-link map, upload order, anti-cannibalization rules and blocked future slugs.
5. RECOMMENDED: approve planning only, then compare `/medical-malpractice-lawyer/` duplicate records, fee article and old birth/pregnancy page side-by-side.
6. NEXT: owner approves planning package or requests a one-page comparison first; otherwise continue the next priority cluster using the same controlled process.
7. BLOCKED: no public content, title/H1/meta, URL migration, redirect, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, schema, lawyer-card, review/rating, CRM, wp-admin setting or CMS/database action was executed.

### ACTION-MEDICAL-MALPRACTICE-NO-URL-INTERNAL-LINK-MAP-001: Plan current-URL links for medical-malpractice upload group
**Status:** COMPLETED / REVIEW ONLY
**Why:** The medical-malpractice queue must be connected internally before public upload so the future changes are a coherent cluster rather than disconnected pages.
**Actions:**
1. DONE: created `project-control/medical-malpractice-no-url-internal-link-map-2026-05-11.md`.
2. DONE: created `project-control/medical-malpractice-no-url-internal-link-map-2026-05-11.csv`.
3. VERIFIED: `38` planned current-URL relationship/control rows were mapped.
4. VERIFIED: links connect the current malpractice pillar candidate, protected fee/birth assets, anesthesia/surgery pages, definition/common-errors pages and birth-injury pages while excluding traffic/Marvad, criminal negligence, US malpractice and future slugs.
5. VERIFIED: relationship type, priority, anchor intent, placement guidance and execution status are documented.
6. NEXT: use the map inside the owner-review upload package and do not execute links until owner/legal review approves public copy.
7. BLOCKED: no public content, title/H1/meta, URL migration, redirect, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, schema, lawyer-card, review/rating, CRM, wp-admin setting or CMS/database action was executed.

### ACTION-MEDICAL-MALPRACTICE-CURRENT-URL-UPLOAD-READINESS-001: Consolidate medical-malpractice current-URL upload readiness
**Status:** COMPLETED / REVIEW ONLY
**Why:** The malpractice cluster has duplicate same-public-URL risk, old GSC-visible fee and birth/pregnancy pages, YMYL source risk, support-page overlap and traffic/criminal boundary contamination that must be resolved before public upload.
**Actions:**
1. DONE: created `project-control/medical-malpractice-current-url-upload-readiness-2026-05-11.md`.
2. DONE: created `project-control/medical-malpractice-current-url-upload-readiness-2026-05-11.csv`.
3. VERIFIED: `19` inventory candidates were scanned and `23` URL or URL-reference items were advanced into review roles.
4. VERIFIED: the queue separates pillar, duplicate state, protected GSC-visible assets, support pages, boundary exclusions, future-only slugs, sitemap posture and internal-link requirements.
5. DONE: prepared a no-URL current-link map for the malpractice queue and packaged it for owner upload review.
6. BLOCKED: no public content, title/H1/meta, URL migration, redirect, noindex, canonical, sitemap, taxonomy/category, menu, breadcrumb, internal-link, related-card, schema, lawyer-card, review/rating, CRM, wp-admin setting or CMS/database action was executed.

### ACTION-MEDICAL-MALPRACTICE-SOURCE-LEGAL-CHECKLIST-001: Add source/legal gates for medical-malpractice cluster
**Status:** COMPLETED / REVIEW ONLY
**Why:** Medical malpractice is high-risk YMYL content and cannot move toward public copy, schema, reviews, internal links or CMS upload without source anchors, privacy controls and legal-review gates.
**Actions:**
1. DONE: created `project-control/medical-malpractice-source-legal-checklist-2026-05-11.md`.
2. DONE: created `project-control/medical-malpractice-source-legal-checklist-2026-05-11.csv`.
3. VERIFIED: `8` page/topic gates were mapped for the commercial pillar, fee/cost support, birth/pregnancy, birth injury/cerebral palsy, surgery/anesthesia, definition/common errors, records/evidence/privacy and report/background content.
4. VERIFIED: official/public source anchors and limitations are documented.
5. VERIFIED: allowed claims, blocked claims, privacy-risk level, disclaimer requirements and review/schema restrictions are mapped.
6. NEXT: prepare a current-URL upload-readiness queue and then internal-link map for the medical-malpractice cluster.
7. BLOCKED: no public content, title/H1/meta, URL migration, redirect, noindex, canonical, sitemap, taxonomy/category, menu, breadcrumb, internal-link, related-card, schema, lawyer-card, review/rating, CRM, wp-admin setting or CMS/database action was executed.

### ACTION-FAMILY-DIVORCE-CURRENT-URL-UPLOAD-READINESS-001: Consolidate family/divorce current-URL upload readiness
**Status:** COMPLETED / REVIEW ONLY
**Why:** Family/divorce is one of the most upload-ready clusters, but the first public upload must protect old GSC-visible URLs, PDFs/DOCX files, child-support/custody risks, Maya profile claims and broad family-lawyer hub intent.
**Actions:**
1. DONE: created `project-control/family-divorce-current-url-upload-readiness-2026-05-11.md`.
2. DONE: created `project-control/family-divorce-current-url-upload-readiness-2026-05-11.csv`.
3. VERIFIED: `92` inventory candidates were scanned and `58` family/divorce URL or URL-reference items were advanced into review roles.
4. VERIFIED: divorce pillar, support pages, protected old assets, document risks, merge candidates, future-only slugs, sitemap posture and internal-link requirements are consolidated.
5. DONE: prepared a no-URL internal-link map and owner upload review package for the family/divorce queue.
6. BLOCKED: no public content, title/H1/meta, URL migration, redirect, noindex, canonical, sitemap, taxonomy/category, menu, breadcrumb, internal-link, related-card, schema, lawyer-card, Maya profile, review/rating, CRM, wp-admin setting or CMS/database action was executed.

### ACTION-TRAFFIC-LAW-OWNER-UPLOAD-REVIEW-001: Package first traffic-law group for owner approval
**Status:** COMPLETED / REVIEW ONLY
**Why:** The traffic-law outline/source/internal-link work needs one owner-facing approval layer before any Hebrew drafting or CMS upload.
**Actions:**
1. DONE: created `project-control/traffic-law-owner-upload-review-package-2026-05-11.md`.
2. DONE: created `project-control/traffic-law-owner-upload-review-package-2026-05-11.csv`.
3. VERIFIED: `5` target decisions are ready for owner review.
4. VERIFIED: package combines page role, current URL use, source/legal gates, internal-link map, upload order, anti-cannibalization rules and blocked future slugs.
5. RECOMMENDED: approve planning package only, then draft `/traffic-lawyer/` first under legal/source review.
6. NEXT: owner approves Option A planning package or requests one-page draft first; otherwise move to the next priority cluster.
7. BLOCKED: no public content, title/H1/meta, URL migration, redirect, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, schema, lawyer-card, CRM/review, wp-admin setting or CMS/database action was executed.

### ACTION-TRAFFIC-LAW-NO-URL-INTERNAL-LINK-MAP-001: Plan current-URL links for traffic-law upload group
**Status:** COMPLETED / REVIEW ONLY
**Why:** The traffic-law outline/source group must be connected internally before any content upload, so the future public changes are not disconnected articles.
**Actions:**
1. DONE: created `project-control/traffic-law-no-url-internal-link-map-2026-05-11.md`.
2. DONE: created `project-control/traffic-law-no-url-internal-link-map-2026-05-11.csv`.
3. VERIFIED: `31` planned current-URL relationships mapped.
4. VERIFIED: links connect traffic-law pillar, drunk driving, breathalyzer/refusal/testing, speeding/points/license risk and Marvad/medical fitness without using blocked future slugs.
5. VERIFIED: relationship type, priority, anchor direction, placement guidance and reason are documented.
6. NEXT: prepare an owner-review upload package for these five traffic-law targets or move to the next priority cluster.
7. BLOCKED: no public content, title/H1/meta, URL migration, redirect, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, schema, lawyer-card, CRM/review, wp-admin setting or CMS/database action was executed.

### ACTION-TRAFFIC-LAW-SOURCE-LEGAL-CHECKLIST-001: Add source/legal gates for traffic-law upload group
**Status:** COMPLETED / REVIEW ONLY
**Why:** The traffic-law outline group cannot move toward final Hebrew copy without source anchors, legal-claim limits, privacy/medical-risk flags and approval gates.
**Actions:**
1. DONE: created `project-control/traffic-law-source-legal-checklist-2026-05-11.md`.
2. DONE: created `project-control/traffic-law-source-legal-checklist-2026-05-11.csv`.
3. VERIFIED: `5` page/topic gates mapped for traffic-law pillar, drunk driving, breathalyzer/refusal/testing, speeding/points/license risk and Marvad/medical fitness.
4. VERIFIED: official/public source anchors and limitations are documented.
5. VERIFIED: allowed claims, blocked claims, privacy/medical-risk level, disclaimer requirement and approval status are mapped per page.
6. NEXT: prepare a no-URL-change internal-link map for the same five traffic-law targets.
7. BLOCKED: no public content, title/H1/meta, URL migration, redirect, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, schema, lawyer-card, CRM/review, wp-admin setting or CMS/database action was executed.

### ACTION-TRAFFIC-LAW-NO-URL-OUTLINES-001: Prepare traffic-law outline batch using current URLs only
**Status:** COMPLETED / REVIEW ONLY
**Why:** The traffic-law cluster has a current pillar candidate and support lanes, but public upload still needs page-level outlines, section structure, internal-link posture, sitemap posture and blockers before Hebrew copy or CMS updates.
**Actions:**
1. DONE: created `project-control/traffic-law-no-url-change-outline-queue-2026-05-11.md`.
2. DONE: created `project-control/traffic-law-no-url-change-outline-queue-2026-05-11.csv`.
3. VERIFIED: `5` outline targets prepared across `10` current URLs.
4. VERIFIED: current planning pillar is `/traffic-lawyer/`.
5. VERIFIED: first support groups are drunk driving, breathalyzer/refusal/testing, speeding/points/license risk and Marvad/medical fitness.
6. VERIFIED: `/drunk-driving/`, `/breathalyzer-test/`, `/license-suspension/`, `/traffic-evidence/` and `/fatal-road-accident-offenses/` remain blocked future-only slugs.
7. NEXT: prepare source/legal checklist or a no-URL-change internal-link map for these five traffic-law targets before public copy upload.
8. BLOCKED: no public content, title/H1/meta, URL migration, redirect, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, schema, lawyer-card, CRM/review, wp-admin setting or CMS/database action was executed.

### ACTION-CRIMINAL-LAW-OWNER-UPLOAD-REVIEW-001: Package first criminal-law group for owner approval
**Status:** COMPLETED / REVIEW ONLY
**Why:** The criminal-law outline/source/internal-link work needs one owner-facing approval layer before any Hebrew drafting or CMS upload.
**Actions:**
1. DONE: created `project-control/criminal-law-owner-upload-review-package-2026-05-11.md`.
2. DONE: created `project-control/criminal-law-owner-upload-review-package-2026-05-11.csv`.
3. VERIFIED: `5` target decisions are ready for owner review.
4. VERIFIED: package combines page role, current URL use, source/legal gates, internal-link map, upload order, anti-cannibalization rules and blocked future slugs.
5. RECOMMENDED: approve planning package only, then draft `/criminal-defense-attorney/` first under legal/source review.
6. NEXT: owner approves Option A planning package or requests one-page draft first; otherwise continue traffic-law outline/source/link sequence.
7. BLOCKED: no public content, title/H1/meta, URL migration, redirect, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, schema, lawyer-card, CRM/review, wp-admin setting or CMS/database action was executed.

### ACTION-CRIMINAL-LAW-NO-URL-INTERNAL-LINK-MAP-001: Plan current-URL links for first criminal-law upload group
**Status:** COMPLETED / REVIEW ONLY
**Why:** The first criminal-law outline/source group must be connected internally before any content upload, so the future public changes are not disconnected articles.
**Actions:**
1. DONE: created `project-control/criminal-law-no-url-internal-link-map-2026-05-11.md`.
2. DONE: created `project-control/criminal-law-no-url-internal-link-map-2026-05-11.csv`.
3. VERIFIED: `21` planned current-URL relationships mapped.
4. VERIFIED: links connect current criminal pillar, police investigation, indictment, detention, detention-days and drug offenses without using blocked future slugs.
5. VERIFIED: relationship type, priority, anchor direction, placement guidance and reason are documented.
6. NEXT: prepare an owner-review upload package for these five targets or repeat the outline/source/link sequence for the next priority cluster.
7. BLOCKED: no public content, title/H1/meta, URL migration, redirect, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, schema, lawyer-card, CRM/review, wp-admin setting or CMS/database action was executed.

### ACTION-CRIMINAL-LAW-SOURCE-LEGAL-CHECKLIST-001: Add source/legal gates for first criminal-law upload group
**Status:** COMPLETED / REVIEW ONLY
**Why:** The first criminal-law outline group cannot move toward final Hebrew copy without source anchors, legal-claim limits, confidentiality risk and approval gates.
**Actions:**
1. DONE: created `project-control/criminal-law-source-legal-checklist-2026-05-11.md`.
2. DONE: created `project-control/criminal-law-source-legal-checklist-2026-05-11.csv`.
3. VERIFIED: `5` page/topic gates mapped for current criminal pillar, police investigation, indictment, detention and drug offenses.
4. VERIFIED: official/public source anchors and limitations are documented.
5. VERIFIED: allowed claims, blocked claims, privacy/confidentiality risk, disclaimer requirement and approval status are mapped per page.
6. NEXT: prepare a no-URL-change internal-link map for the same five criminal-law targets.
7. BLOCKED: no public content, title/H1/meta, URL migration, redirect, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, schema, lawyer-card, CRM/review, wp-admin setting or CMS/database action was executed.

### ACTION-CRIMINAL-LAW-NO-URL-OUTLINES-001: Prepare first criminal-law outline batch using current URLs only
**Status:** COMPLETED / REVIEW ONLY
**Why:** The criminal-law primary is selected for planning, but public upload still needs page-level outlines, section structure, internal-link posture, sitemap posture and blockers before Hebrew copy or CMS updates.
**Actions:**
1. DONE: created `project-control/criminal-law-no-url-change-outline-queue-2026-05-11.md`.
2. DONE: created `project-control/criminal-law-no-url-change-outline-queue-2026-05-11.csv`.
3. VERIFIED: `5` outline targets prepared across `6` current URLs.
4. VERIFIED: current planning pillar is `/criminal-defense-attorney/`.
5. VERIFIED: first support lanes are police investigation, indictment, detention and drug offenses.
6. VERIFIED: `/criminal-lawyer/`, `/police-investigation/`, `/indictment/`, `/pretrial-detention/` and `/drug-offenses/` remain blocked future-only slugs.
7. NEXT: prepare source/legal checklist or a no-URL-change internal-link map for these five targets before public copy upload.
8. BLOCKED: no public content, title/H1/meta, URL migration, redirect, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, schema, lawyer-card, CRM/review, wp-admin setting or CMS/database action was executed.

### ACTION-CRIMINAL-LAW-PRIMARY-SELECTION-001: Select current criminal-law primary before migration
**Status:** COMPLETED / REVIEW ONLY
**Why:** `/criminal-lawyer/` is the desired English slug, but live route behavior must be checked before any URL migration, sitemap, menu or internal-link plan.
**Actions:**
1. DONE: created `project-control/criminal-law-primary-selection-2026-05-11.md`.
2. DONE: created `project-control/criminal-law-primary-selection-2026-05-11.csv`.
3. DONE: created `project-control/criminal-law-primary-live-url-check-2026-05-11.csv`.
4. DONE: created `project-control/criminal-law-primary-redirect-check-2026-05-11.csv`.
5. VERIFIED LIVE: `/criminal-defense-attorney/` returns `200 OK`, self-canonicalizes, is indexable and has criminal-lawyer title/H1 signals.
6. VERIFIED LIVE / BLOCKED: `/criminal-lawyer/`, the old Hebrew broad criminal-lawyer URL and a legacy deep criminal-law URL currently redirect to the homepage.
7. RECOMMENDED: use `/criminal-defense-attorney/` as the current no-URL-change planning primary.
8. BLOCKED: keep `/criminal-lawyer/` future-only until owner approval, route repair and redirect/canonical/internal-link/sitemap planning.
9. NEXT: prepare no-URL-change outline packet for the current criminal primary and the first four support pages: police investigation, indictment, detention and drug offenses.
10. BLOCKED: no public content, title/H1/meta, URL migration, redirect, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, schema, lawyer-card, CRM/review, wp-admin setting or CMS/database action was executed.

### ACTION-CRIMINAL-LAW-UPLOAD-READINESS-001: Map criminal-law cluster for content upload readiness
**Status:** COMPLETED / REVIEW ONLY
**Why:** The criminal-law cluster is a major pillar candidate, but broad criminal-lawyer GSC evidence is attached to an old Hebrew URL and multiple support/legacy pages. The cluster must be mapped before any upload, internal-link, sitemap or migration action.
**Actions:**
1. DONE: created `project-control/criminal-law-content-upload-readiness-2026-05-11.md`.
2. DONE: created `project-control/criminal-law-content-upload-readiness-2026-05-11.csv`.
3. VERIFIED: `220` raw criminal-adjacent inventory candidates were extracted and `50` higher-value candidates were reviewed.
4. VERIFIED: `/criminal-defense-attorney/` is the current clean-ish primary candidate; `/criminal-lawyer/` remains a future strategic pillar target only.
5. VERIFIED: the old Hebrew criminal-lawyer URL remains protected because GSC shows broad criminal-lawyer impressions there.
6. VERIFIED: support lanes are mapped for police investigation, indictment, detention, drug offenses, sex offenses, economic/white-collar crime, tax offenses, criminal records and criminal defenses.
7. CATEGORY CLEANUP: international/foreign-law, legal-career, victim-rights, defamation/police-complaint, traffic-criminal and cyber-criminal boundary pages must stay out of blind Israeli criminal-lawyer pillar consolidation.
8. NEXT: prepare owner-review primary selection for `/criminal-defense-attorney/` vs `/criminal-lawyer/`, then map no-URL-change outlines for police investigation, indictment, detention and drug offenses.
9. BLOCKED: no public content, title/H1/meta, URL migration, redirect, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, schema, lawyer-card, CRM/review, wp-admin setting or CMS/database action was executed.

### ACTION-TRAFFIC-LAW-UPLOAD-READINESS-001: Map traffic-law cluster for content upload readiness
**Status:** COMPLETED / REVIEW ONLY
**Why:** To move toward content upload safely, the full traffic-law cluster needs pillar/support, category, URL, redirect, internal-link and sitemap posture before rewriting or uploading individual pages.
**Actions:**
1. DONE: created `project-control/traffic-law-content-upload-readiness-2026-05-11.md`.
2. DONE: created `project-control/traffic-law-content-upload-readiness-2026-05-11.csv`.
3. VERIFIED: `38` traffic-adjacent URL candidates reviewed in one batch.
4. VERIFIED: `/traffic-lawyer/` is the current no-URL-change pillar candidate.
5. VERIFIED: drunk driving, refusal/testing, breathalyzer, speeding, Marvad, points/license suspension and traffic evidence are support lanes.
6. CATEGORY CLEANUP: personal-injury car-accident pages, business/professional/license false positives, trafficking pages and unrelated intoxication case-law must stay out of the canonical traffic-law category.
7. NEXT: prepare no-URL-change outlines for `/traffic-lawyer/`, `/driving-under-the-influence/`, the breathalyzer/testing group and the license-suspension/points group.
8. BLOCKED: no public content, title/H1/meta, URL, redirect, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, schema, lawyer-card, CRM/review, wp-admin setting or CMS/database action was executed.

### ACTION-TRAFFIC-DRUNK-DRIVING-SOURCE-AUDIT-001: Audit current drunk-driving source pages before content expansion
**Status:** COMPLETED / REVIEW ONLY
**Why:** GSC maps drunk-driving lawyer intent to a will-revocation page. Before editing any content or URL, the current support page, pillar page and wrong-page source must be compared.
**Actions:**
1. DONE: created `project-control/traffic-drunk-driving-source-audit-2026-05-11.md`.
2. DONE: created `project-control/traffic-drunk-driving-source-audit-2026-05-11.csv`.
3. VERIFIED LIVE: `/driving-under-the-influence/`, `/traffic-lawyer/` and `/revocation-of-a-will-and-reviving-previous-will/` return `200`, self-canonical and indexable pages.
4. VERIFIED: `/driving-under-the-influence/` is the current support candidate; do not create duplicate `/drunk-driving/` content yet.
5. VERIFIED: the will-revocation page has `0` visible drunk-driving matches in fetched text and should stay protected as inheritance/wills content.
6. REVIEW: sitewide `SiteNavigationElement` schema appears on the will page and includes traffic-law URLs using `http://`; source/generator is NOT VERIFIED.
7. NEXT: prepare a no-URL-change expansion outline for `/driving-under-the-influence/` and open a schema/navigation-source audit.
8. BLOCKED: no public content, title/H1/meta, URL, redirect, noindex, canonical, sitemap, menu, taxonomy, related-card, schema, lawyer-card, CRM/review, wp-admin setting or CMS/database action was executed.

### ACTION-TRAFFIC-CRIMINAL-WRONG-PAGE-DECISION-001: Convert GSC wrong-page evidence into protected decisions
**Status:** COMPLETED / REVIEW ONLY
**Why:** Targeted GSC evidence shows drunk-driving lawyer intent landing on a will-revocation page, while criminal support queries are either low-sample, specific-case, or not visibly owned. This needs a protected decision layer before any public content, internal-link or URL action.
**Actions:**
1. DONE: created `project-control/traffic-criminal-wrong-page-decision-packet-2026-05-11.md`.
2. DONE: created `project-control/traffic-criminal-wrong-page-decision-packet-2026-05-11.csv`.
3. VERIFIED: `עורך דין נהיגה בשכרות` maps to `https://jus-tice.co.il/revocation-of-a-will-and-reviving-previous-will/`, which should stay an inheritance/will page.
4. VERIFIED: `כתב אישום` maps to a specific Netanyahu indictment page and homepage, so it should not be treated as evidence for a general indictment primary page.
5. RECOMMENDED: audit `/driving-under-the-influence/`, `/traffic-lawyer/` and the will-revocation wrong-page source before drafting any public content expansion.
6. NEXT: prepare a no-URL-change drunk-driving outline only after owner/legal review confirms the correct current support URL.
7. BLOCKED: no public content, title/H1/meta, URL, redirect, noindex, canonical, sitemap, menu, taxonomy, related-card, lawyer-card, CRM/review, wp-admin setting or CMS/database action was executed.

### ACTION-LAWYER-SEED-PROFILE-CLEANUP-PLAN-001: Prepare owner-approved cleanup plan for published seed lawyer records
**Status:** COMPLETED / REVIEW ONLY
**Why:** The REST guard blocks public exposure after deployment, but the underlying WordPress database still contains published seed-style lawyer records that should not remain publish-status without verified source/contact/approval data.
**Actions:**
1. DONE: created `project-control/lawyer-seed-profile-cleanup-plan-2026-05-11.md`.
2. DONE: created `project-control/lawyer-seed-profile-cleanup-plan-2026-05-11.csv`.
3. VERIFIED LIVE BASELINE: public REST exposes `10` published `justice_lawyer` records, IDs `19130` through `19139`.
4. VERIFIED LIVE BASELINE: all `10` exported records have placeholder/seed-style contact signals and should be drafted/private unless real source approval is confirmed.
5. REVIEW FIRST: ID `19130` / Maya Rotenberg may be the intended prototype/client profile, so it must be reviewed separately before status changes.
6. NEXT: after backup and owner approval, draft/private all unverified seed profiles or replace them with real verified lawyer data; then rerun REST/profile checks.
7. BLOCKED: no CMS/database changes were executed.

### ACTION-LAWYER-REST-PUBLIC-GUARD-001: Stop anonymous REST exposure of seed lawyer profiles
**Status:** LIVE REST VERIFIED / PROFILE ROUTE REVIEW
**Why:** The visible lawyer archive is currently filtered, but anonymous REST requests still expose published seed-style lawyer records, contact metadata and placeholder phone patterns. This is a P0 trust/privacy issue before public marketing.
**Actions:**
1. VERIFIED LIVE BASELINE: `/lawyers/` returns `200` with `0` `lawyer-card` blocks and no placeholder phone hits.
2. VERIFIED LIVE BASELINE: `/wp-json/wp/v2/justice_lawyer?per_page=20` returns `200`, `X-WP-Total: 10`, `11` placeholder phone hits and `50` sensitive meta-key hits before this patch is live.
3. CODE FIXED: anonymous `justice_lawyer` REST collections are filtered to profiles that pass the existing public approval gate.
4. CODE FIXED: anonymous direct REST reads for unapproved lawyer IDs return `404`.
5. CODE FIXED: anonymous approved lawyer REST responses strip `meta`, `acf` and `guid`.
6. CODE FIXED: unapproved public lawyer profile routes are marked `404` before SEO/head output and forced to generic noindex/nofollow signals.
7. CREATED: `project-control/lawyer-rest-public-guard-2026-05-11.md`, `project-control/lawyer-rest-public-guard-2026-05-11.csv`, `tools/check-live-lawyer-rest-public-guard.ps1`, and `project-control/live-lawyer-rest-public-guard-2026-05-11-before-pull.csv`.
8. VERIFIED LOCAL: PHP lint passed for all `130` PHP files.
9. VERIFIED LIVE: after uPress pull, `/wp-json/wp/v2/justice_lawyer?per_page=20` returns `X-WP-Total: 0`, with no placeholder phone hits and no sensitive meta-key hits.
10. VERIFIED LIVE: direct anonymous REST request for seed ID `19139` returns `404`.
11. REVIEW: static `deployment-marker.txt` still reports the older branding marker, while page meta reports `2026-05-11-lawyer-rest-public-guard-v1`.
12. REVIEW: one sampled old lawyer profile route lands on the homepage with `200` instead of the expected generic noindex `404`, but it did not expose placeholder phone data or sensitive meta.
13. NEXT: review old lawyer profile routing/permalink behavior separately; existing published seed profiles still need owner-approved CMS cleanup or verified real-profile replacement.
14. BLOCKED: no CMS/database lawyer cleanup was performed.

### ACTION-FULL-REVIEW-REPORT-INTAKE-001: Convert owner full-review report into launch-readiness tasks
**Status:** COMPLETED / REVIEW ONLY
**Why:** The owner report identifies public trust, demo-data, Hebrew UI, policy, content-quality, taxonomy, URL, visual and competitor-parity risks that must stay visible in the roadmap without interrupting the current GSC/content architecture work.
**Actions:**
1. DONE: created `project-control/full-review-report-action-intake-2026-05-11.md`.
2. DONE: created `project-control/full-review-report-action-intake-2026-05-11.csv`.
3. VERIFIED: overlapping existing work was recognized instead of duplicated blindly, including lawyer trust gates, placeholder phone suppression, branding/favicons, hreflang/HTTPS normalization, Hebrew UI checks and the known 404 plugin blocker.
4. BLOCKED / P0: re-run live lawyer-directory/profile QA before public marketing; if any demo/seed/unapproved lawyer is visible as real, owner must approve draft/private/hide/demo-label remediation.
5. NEXT: keep this queue as a pre-marketing safety layer while continuing GSC/content architecture batches.
6. BLOCKED: no public lawyer record, content, title/H1/meta, URL, redirect, noindex, canonical, sitemap, taxonomy, menu, breadcrumb, related-card, lawyer-card, CRM/review or CMS write was executed from this report intake.

### ACTION-REAL-ESTATE-ROUTE-CMS-AUDIT-001: Plan audit for blocked real-estate future slugs
**Status:** COMPLETED / REVIEW ONLY
**Why:** The side-by-side review found unsafe future routes. Before any internal-link or migration plan, the route/CMS source of these URLs must be audited.
**Actions:**
1. DONE: created `project-control/real-estate-route-cms-audit-plan-2026-05-11.md`.
2. DONE: created `project-control/real-estate-route-cms-audit-plan-2026-05-11.csv`.
3. VERIFIED LIVE: `/real-estate-lawyer/` is an empty `200` route with `0` response bytes.
4. VERIFIED LIVE: `/buying-apartment/` and `/real-estate-purchase-agreement/` resolve to homepage content and homepage canonical.
5. BLOCKED: do not use those URLs in sitemap, internal links, related cards, breadcrumbs, menus, canonicals or redirects.
6. NEXT: owner/legal review approves wp-admin/CMS route lookup and then an approval-gated real-estate internal-link plan using only safe current URLs.
7. BLOCKED: no public content, title/H1/meta, route, URL, redirect, noindex, canonical, sitemap, homepage, menu, breadcrumb, related-card, lawyer-card, CRM/review or CMS writes until owner and legal review approve execution.

### ACTION-REAL-ESTATE-OWNER-DECISION-SUMMARY-001: Summarize owner decisions for real-estate cluster
**Status:** COMPLETED / REVIEW ONLY
**Why:** The real-estate cluster now has source/legal, page matrix and side-by-side evidence. The next safe layer is a concise owner decision summary before any internal-link, route, content or URL execution.
**Actions:**
1. DONE: created `project-control/real-estate-owner-decision-summary-2026-05-11.md`.
2. DONE: created `project-control/real-estate-owner-decision-summary-2026-05-11.csv`.
3. RECOMMENDED: `/real-estate-attorney/` as current no-URL-change working primary for planning only.
4. RECOMMENDED: `/real-estate-lawyer/`, `/buying-apartment/` and `/real-estate-purchase-agreement/` stay blocked future slugs until route/CMS audit and migration planning.
5. VERIFIED: `/real-estate-lawyer-cost-2025/` remains protected support; property-law, fee, buying, registry, tax, rental, contractor and international pages remain separated.
6. NEXT: owner/legal review approves a route/CMS audit and an approval-gated internal-link plan using only safe current URLs.
7. BLOCKED: no public content, title/H1/meta, URL, redirect, noindex, canonical, sitemap, homepage, menu, breadcrumb, related-card, lawyer-card, CRM/review or CMS writes until owner and legal review approve execution.

### ACTION-REAL-ESTATE-SIDE-BY-SIDE-001: Compare current real-estate pages side by side
**Status:** COMPLETED / REVIEW ONLY
**Why:** The page matrix selected roles, but the current pages and future slugs still needed direct comparison so commercial, cost, property-law, buying-apartment, registry, tax, rental, contractor/defect and international content are not mixed.
**Actions:**
1. DONE: created `project-control/real-estate-side-by-side-review-2026-05-11.md`.
2. DONE: created `project-control/real-estate-side-by-side-review-2026-05-11.csv`.
3. VERIFIED: `/real-estate-attorney/` remains the current no-URL-change commercial candidate.
4. VERIFIED: `/real-estate-lawyer-cost-2025/` remains protected support, not the broad pillar.
5. REVIEW: `/real-estate-lawyer/` currently behaves like an empty/broken `200` route and needs routing/CMS audit before use.
6. REVIEW: `/buying-apartment/` and `/real-estate-purchase-agreement/` resolve to homepage content/canonical and must not be linked, redirected or added to sitemap yet.
7. NEXT: create a real-estate internal-link plan only after owner/legal approval confirms page roles and route fixes.
8. BLOCKED: no public content, title/H1/meta, URL, redirect, noindex, canonical, sitemap, homepage, menu, breadcrumb, related-card, lawyer-card, CRM/review or CMS writes until owner and legal review approve execution.

### ACTION-REAL-ESTATE-PAGE-MATRIX-001: Classify real-estate pages page by page
**Status:** COMPLETED / REVIEW ONLY
**Why:** After the source/legal checklist, the real-estate cluster needed concrete page-level role decisions so current commercial pages, future clean slugs, cost support, registry/tax pages, rental pages and international property content are not mixed.
**Actions:**
1. DONE: created `project-control/real-estate-page-decision-matrix-2026-05-11.md`.
2. DONE: created `project-control/real-estate-page-decision-matrix-2026-05-11.csv`.
3. VERIFIED: `/real-estate-attorney/` remains the current no-URL-change commercial candidate.
4. VERIFIED: `/real-estate-lawyer/` remains a strategic future slug only.
5. VERIFIED: `/real-estate-lawyer-cost-2025/` remains protected high-impression support content.
6. VERIFIED: `/israeli_land_and_property_laws/`, fee pages, buying-apartment candidates, registry/tax/rental pages, contractor/defect support and international-property pages are separated before public execution.
7. NEXT: create a real-estate side-by-side comparison and approval-gated internal-link plan.
8. BLOCKED: no public content, title/H1/meta, URL, redirect, noindex, canonical, sitemap, homepage, menu, breadcrumb, related-card, lawyer-card, CRM/review or CMS writes until owner and legal review approve execution.

### ACTION-REAL-ESTATE-SOURCE-LEGAL-001: Create source/legal gate for Israeli real-estate pages
**Status:** COMPLETED / REVIEW ONLY
**Why:** The real-estate cluster mixes current commercial service intent, a future clean slug, overloaded cost support, registry/tax/contract pages, contractor-defect topics, rental intent and international property content. It needs source/legal gates before any rewrite, internal-link execution or URL migration.
**Actions:**
1. DONE: created `project-control/real-estate-source-legal-checklist-2026-05-11.md`.
2. DONE: created `project-control/real-estate-source-legal-checklist-2026-05-11.csv`.
3. VERIFIED: `/real-estate-attorney/` remains the current no-URL-change commercial candidate.
4. VERIFIED: `/real-estate-lawyer/` remains a future strategic slug only until redirect/canonical/sitemap/internal-link maps are approved.
5. VERIFIED: `/real-estate-lawyer-cost-2025/` remains protected as an overloaded support page with visible GSC impressions.
6. NEXT: create a real-estate page decision matrix and side-by-side comparison before any internal-link or migration planning.
7. BLOCKED: no public content, title/H1/meta, URL, redirect, noindex, canonical, sitemap, homepage, menu, breadcrumb, related-card, lawyer-card, CRM/review or CMS writes until owner and legal review approve execution.

### ACTION-PERSONAL-INJURY-OUTLINE-QUEUE-001: Queue personal-injury/damages rewrite outlines
**Status:** COMPLETED / REVIEW ONLY
**Why:** The owner decision summary points to a no-URL-change outline batch as the next safe planning layer, but public drafting/execution still needs owner/legal approval.
**Actions:**
1. DONE: created `project-control/personal-injury-rewrite-outline-queue-2026-05-11.md`.
2. DONE: created `project-control/personal-injury-rewrite-outline-queue-2026-05-11.csv`.
3. VERIFIED: `/tort-lawyer/` is queued as the current primary-service refresh outline only.
4. VERIFIED: `/car-accident-auto-injury-lawyer/` is queued as the protected car-accident refresh outline only.
5. VERIFIED: support, specialist, international and work-accident boundary items are separated and blocked from public execution.
6. NEXT: owner/legal review approves one outline-only draft package, or direct GSC browser checks are run before approval.
7. BLOCKED: no public content, title/H1/meta, URL, redirect, noindex, canonical, sitemap, menu, breadcrumb, related-card, lawyer-card, CRM/review or CMS writes until owner and legal review approve execution.

### ACTION-PERSONAL-INJURY-OWNER-DECISION-SUMMARY-001: Summarize owner decisions for personal-injury/damages
**Status:** COMPLETED / REVIEW ONLY
**Why:** The cluster now has source, page, side-by-side, internal-link and SERP evidence. The next safe layer is a concise owner decision summary before any public execution.
**Actions:**
1. DONE: created `project-control/personal-injury-owner-decision-summary-2026-05-11.md`.
2. DONE: created `project-control/personal-injury-owner-decision-summary-2026-05-11.csv`.
3. VERIFIED: recommended current working primary is `/tort-lawyer/` without URL changes.
4. VERIFIED: `/car-accident-auto-injury-lawyer/` remains protected and should be reviewed in place before any migration.
5. VERIFIED: `/personal-injury-lawyer/`, `/car-accident-lawyer/` and `/work-accident-lawyer/` remain future-only.
6. NEXT: owner/legal review can approve a no-URL-change outline batch, or request direct GSC browser checks before approval.
7. BLOCKED: no public content, title/H1/meta, URL, redirect, noindex, canonical, sitemap, menu, breadcrumb, related-card, lawyer-card, CRM/review or CMS writes until owner and legal review approve execution.

### ACTION-PERSONAL-INJURY-SERP-001: Run personal-injury/damages SERP review
**Status:** COMPLETED / REVIEW ONLY
**Why:** The internal-link plan needed current public SERP context before owner/legal approval chooses primary URLs, support roles and future migration targets.
**Actions:**
1. DONE: created `project-control/serp-personal-injury-damages-review-2026-05-11.md`.
2. DONE: created `project-control/serp-personal-injury-damages-review-2026-05-11.csv`.
3. VERIFIED: `עורך דין נזיקין`, `נזקי גוף` and `תביעת נזיקין` support a deep damages service/guide structure, not several thin duplicate pillars.
4. VERIFIED: `תאונת דרכים` and `עורך דין תאונות דרכים` support a dedicated car-accident injury subcluster that must stay separate from traffic/criminal accident-offense intent.
5. VERIFIED: `תאונת עבודה` and `עורך דין תאונת עבודה` remain boundary terms across personal injury, national insurance and employment law.
6. NEXT: use this evidence in owner/legal approval, or run direct GSC browser checks for damages, road-accident and work-accident variants.
7. BLOCKED: no public content, title/H1/meta, URL, redirect, noindex, canonical, sitemap, menu, breadcrumb, related-card, lawyer-card, CRM/review or CMS writes until owner and legal review approve execution.

### ACTION-PERSONAL-INJURY-INTERNAL-LINK-001: Plan personal-injury/damages internal links
**Status:** COMPLETED / REVIEW ONLY
**Why:** The side-by-side review confirmed page roles, but the cluster still needed a controlled internal-link map before any public content, related-card, menu, breadcrumb or template implementation.
**Actions:**
1. DONE: created `project-control/personal-injury-internal-link-plan-2026-05-11.md`.
2. DONE: created `project-control/personal-injury-internal-link-plan-2026-05-11.csv`.
3. VERIFIED: `/tort-lawyer/` remains the current broad service candidate for internal-link planning, but all rows require owner/legal approval before execution.
4. VERIFIED: `/car-accident-auto-injury-lawyer/` remains the protected current car-accident URL; `/car-accident-lawyer/` stays future-only.
5. VERIFIED: tort-law, punitive-damage, road-accident compensation and compulsory-insurance pages are mapped as support, not competing broad pillars.
6. NEXT: owner/legal review decides primary URL, car-accident migration timing and which planned rows can become approved CMS/template work.
7. BLOCKED: no public content, title/H1/meta, URL, redirect, noindex, canonical, sitemap, menu, breadcrumb, related-card, lawyer-card, CRM/review or CMS writes until owner and legal review approve execution.

### ACTION-PERSONAL-INJURY-SIDE-BY-SIDE-001: Compare current personal-injury/damages pages side by side
**Status:** COMPLETED / REVIEW ONLY
**Why:** The page decision matrix selected roles, but current pages still needed direct comparison so thin service pages, long specialist pages, support pages, international content and old URL routing risks are not mixed.
**Actions:**
1. DONE: created `project-control/personal-injury-side-by-side-review-2026-05-11.md`.
2. DONE: created `project-control/personal-injury-side-by-side-review-2026-05-11.csv`.
3. VERIFIED: `/tort-lawyer/` is the current broad service candidate but is thin and needs approved expansion before pillar use.
4. VERIFIED: `/car-accident-auto-injury-lawyer/` is the protected current GSC-visible car-accident candidate, not an approved final slug.
5. VERIFIED: `/punitive-damage/`, `/tort-reform/`, `/outline-of-tort-law/`, `/deep-pocket/`, `/israel-road-accident-compensation-law` and `/compulsory-motor-vehicle-insurance/` are support/specialist assets.
6. VERIFIED: `/personal-injury-law/` is US/international content and must stay separate from Israeli damages intent.
7. REVIEW: old Hebrew damages/category URL variants currently redirect to the homepage, so exact old URL and routing verification are still needed before any redirect plan.
8. NEXT: create a personal-injury internal-link plan with `PLANNED_NEEDS_OWNER_APPROVAL` statuses, or run deeper GSC/SERP checks for damages and accident variants.
9. BLOCKED: no public content, title/H1/meta, URL, redirect, noindex, canonical, sitemap, menu, related-card, lawyer-card, CRM/review or CMS writes until owner and legal review approve execution.

### ACTION-PERSONAL-INJURY-PAGE-MATRIX-001: Classify personal-injury/damages pages page by page
**Status:** COMPLETED / REVIEW ONLY
**Why:** After the source/legal gate, the personal-injury/damages cluster needed concrete page-level decisions so current service, support, specialist, international and future-slug roles are not mixed.
**Actions:**
1. DONE: created `project-control/personal-injury-page-decision-matrix-2026-05-11.md`.
2. DONE: created `project-control/personal-injury-page-decision-matrix-2026-05-11.csv`.
3. VERIFIED: `/tort-lawyer/` is the current thin service candidate and `/personal-injury-lawyer/` is future-only.
4. VERIFIED: `/car-accident-auto-injury-lawyer/` is protected as the current GSC-visible car-accident page and `/car-accident-lawyer/` is future-only.
5. VERIFIED: support/specialist pages are separated from broad service intent and `/personal-injury-law/` remains US/international separate.
6. NEXT: run side-by-side comparison or prepare approval-gated internal-link map after owner chooses primary/support roles.
7. BLOCKED: no public content, title/H1/meta, URL, redirect, noindex, canonical, sitemap, menu, related-card, lawyer-card, CRM/review or CMS writes until owner and legal review approve execution.

### ACTION-PERSONAL-INJURY-SOURCE-LEGAL-001: Create source/legal gate for damages, tort and accident boundaries
**Status:** COMPLETED / REVIEW ONLY
**Why:** The personal-injury/damages cluster mixes broad service intent, tort-law concepts, car-accident pages, insurance pages, work-accident boundaries, personal-accident benefits and US/international content. It needs source and legal-review gates before any rewrite or URL migration.
**Actions:**
1. DONE: created `project-control/personal-injury-source-legal-checklist-2026-05-11.md`.
2. DONE: created `project-control/personal-injury-source-legal-checklist-2026-05-11.csv`.
3. VERIFIED: direct public URL checks returned 200 for the main current personal-injury/damages pages.
4. VERIFIED: official/public source anchors were mapped for tort law, road accidents, police confirmation, work injury, work-accident reporting and personal-accident boundaries.
5. VERIFIED: `/car-accident-auto-injury-lawyer/` remains protected as the current visible car-accident candidate; `/car-accident-lawyer/` remains future-only.
6. NEXT: create a page decision matrix for the current and future personal-injury/damages URLs before any internal-link, rewrite or migration plan.
7. BLOCKED: no public content, title/H1/meta, URL, redirect, noindex, canonical, sitemap, menu, related-card, lawyer-card, CRM/review or CMS writes until owner and legal review approve execution.

### ACTION-BRANDING-POLISH-V3-001: Verify and correct latest logo/favicon polish
**Status:** COMPLETED / CODE FIXED / NOT LIVE VERIFIED
**Why:** The latest pulled branding commit improved logo/favicon polish, and a later v4.3 CSS commit landed during rebase; the combined state needed duplicate favicon removal, no negative letter-spacing, and aligned cache markers.
**Actions:**
1. DONE: removed duplicate fallback favicon tags from `header.php`.
2. DONE: kept fallback favicon/app-icon logic centralized in `inc/seo.php`, where it returns early when WordPress Site Icon exists.
3. DONE: removed negative letter-spacing from the new premium brand/trust polish CSS rules.
4. DONE: bumped premium brand CSS cache version to `4.3.1`, theme version to `1.0.4`, and marker to `2026-05-11-branding-polish-v3`.
5. VERIFIED LOCAL: `git diff --check` passed with only normal Windows LF-to-CRLF warnings.
6. VERIFIED LOCAL: PHP lint passed for all PHP files using the owner-provided local PHP zip extracted to a temporary runtime.
7. NEXT: after uPress pulls the commit and cache clears, verify browser tab favicon, mobile icon, page source, and visual header/footer logo behavior.
8. SAFETY: no content, URL, redirect, canonical, sitemap, title/H1/meta, menu, taxonomy, lawyer, CRM, review, wp-admin option or CMS/database action was executed.

### ACTION-CYBER-PRIVACY-OUTLINE-QUEUE-001: Build gated rewrite/outline queue for cyber/privacy pages
**Status:** COMPLETED / REVIEW ONLY
**Why:** The page decision matrix identified pages that may eventually need primary refresh, support outlines, section-first blocks or boundary review. The next safe step is to queue outlines without drafting or publishing.
**Actions:**
1. DONE: created `project-control/cyber-privacy-rewrite-outline-queue-2026-05-11.md`.
2. DONE: created `project-control/cyber-privacy-rewrite-outline-queue-2026-05-11.csv`.
3. VERIFIED: `/cyber-lawyer/` remains a blocked primary-service outline candidate until Hebrew role-page comparison and owner/legal review.
4. VERIFIED: section-first topics include Google/platform removal and data-breach reporting, with no new page approved.
5. VERIFIED: all queue rows block public execution.
6. NEXT: if owner/legal review approves, select one page for a controlled outline-only draft package; otherwise continue another cluster owner packet.
7. BLOCKED: no public content, title/H1/meta, URL, redirect, noindex, canonical, sitemap, menu, related-card, lawyer-card, CRM/review or CMS writes until owner and legal review approve execution.

### ACTION-CYBER-PRIVACY-PAGE-DECISION-MATRIX-001: Classify cyber/privacy pages page by page
**Status:** COMPLETED / REVIEW ONLY
**Why:** After the source/legal checklist, the cluster needed a concrete page-by-page decision layer so existing pages are protected, support assets are not mistaken for pillars, and no URL/content action happens blindly.
**Actions:**
1. DONE: created `project-control/cyber-privacy-page-decision-matrix-2026-05-11.md`.
2. DONE: created `project-control/cyber-privacy-page-decision-matrix-2026-05-11.csv`.
3. VERIFIED: direct 200 checks passed for the eight ASCII cyber/privacy URLs in the matrix.
4. VERIFIED: `/cyber-lawyer/` remains current primary candidate; `/cybercrime-lawyer-roll/`, `/cyber-laws/`, `/what-is-cyberattack/`, `/cyber-insurance/`, `/cybersex-trafficking/`, `/fbi-cyber-division/` and `/police-records-data-deletion/` are not approved as primary pillars.
5. VERIFIED: old Hebrew privacy and case-law URLs remain protected/review-only and require exact URL checks before migration decisions.
6. NEXT: either build owner-approved rewrite/outline queues for selected cyber/privacy pages, or continue another cluster owner packet while this waits for owner/legal approval.
7. BLOCKED: no public content, title/H1/meta, URL, redirect, noindex, canonical, sitemap, menu, related-card, lawyer-card, CRM/review or CMS writes until owner and legal review approve execution.

### ACTION-CYBER-PRIVACY-SOURCE-LEGAL-CHECKLIST-001: Create source/legal gate for cyber privacy and data-deletion boundaries
**Status:** COMPLETED / REVIEW ONLY
**Why:** The cyber/privacy cluster contains sensitive legal, criminal, privacy, data-removal and reputation topics. Before any rewrite, merge, URL migration, internal-link execution or CMS update, each topic needs source anchors and legal-review boundaries.
**Actions:**
1. DONE: created `project-control/cyber-privacy-source-legal-checklist-2026-05-11.md`.
2. DONE: created `project-control/cyber-privacy-source-legal-checklist-2026-05-11.csv`.
3. VERIFIED: official/public source anchors were mapped for privacy breach reporting, database obligations, information-security regulations, cyber reporting, CERT, police complaints, computer-law PDFs, defamation-law PDFs and Google removal process pages.
4. VERIFIED: cyber lawyer, cybercrime, privacy/data breach, online reputation/defamation, Google removal and police-record/data-deletion were separated into different intent lanes.
5. NEXT: use the source matrix to decide page-by-page whether `/cyber-lawyer/`, `/cybercrime-lawyer-roll/`, `/cyber-laws/`, `/what-is-cyberattack/`, the old privacy-injury URL and `/police-records-data-deletion/` should be kept, expanded, rewritten, merged, protected or mapped for later migration.
6. BLOCKED: no public content, title/H1/meta, URL, redirect, noindex, canonical, sitemap, menu, related-card, lawyer-card, CRM/review or CMS writes until owner and legal review approve execution.

### ACTION-HOMEPAGE-IMPLEMENTATION-CHECKLIST-001: Create controlled no-URL-change homepage implementation checklist
**Status:** COMPLETED / REVIEW ONLY
**Why:** The homepage section-order and pillar-link proposal needed an executable safety checklist before any public template, link or UX edits. The first homepage batch must be small, reversible and owner-approved.
**Actions:**
1. DONE: created `project-control/homepage-controlled-implementation-checklist-2026-05-11.md`.
2. DONE: created `project-control/homepage-controlled-implementation-checklist-2026-05-11.csv`.
3. VERIFIED: checklist keeps `front-page.php` as the short-term live template unless the owner approves otherwise.
4. VERIFIED: checklist blocks URL, redirect, canonical, sitemap, robots/noindex, title/H1/meta, menu, CMS/database, CRM, review/rating and fake-data changes.
5. VERIFIED: checklist defines preflight, implementation, QA, deploy and rollback gates.
6. NEXT: owner approves or edits the homepage checklist, section order and link map; otherwise continue review-only content architecture tasks such as source/legal checklists and deeper cluster comparisons.
7. BLOCKED: no public homepage content, template, title/H1/meta, URL, redirect, noindex, canonical, sitemap, menu, related-card, lawyer-card, CRM/review or CMS writes until owner-approved execution.

### ACTION-HOMEPAGE-SECTION-ORDER-001: Propose homepage section order and curated pillar links
**Status:** COMPLETED / REVIEW ONLY
**Why:** The line-by-line review showed the homepage needs a single authoritative structure and curated links before public changes. Several clean pillar slugs still resolve to the homepage, so homepage links must use safe approved targets or fallbacks.
**Actions:**
1. DONE: created `project-control/homepage-section-order-proposal-2026-05-11.md`.
2. DONE: created `project-control/homepage-section-order-proposal-2026-05-11.csv`.
3. DONE: created `project-control/homepage-curated-pillar-link-map-2026-05-11.csv`.
4. VERIFIED: current live URL checks were recorded for major homepage pillar candidates.
5. VERIFIED: `/family-lawyer/`, `/criminal-lawyer/`, `/personal-injury-lawyer/`, `/employment-lawyer/` and `/inheritance-lawyer/` must not be promoted blindly because they resolve to the homepage.
6. NEXT: owner approves or edits the proposed section order and pillar-link map; then create an implementation checklist for a controlled no-URL-change homepage batch.
7. BLOCKED: no public homepage content, template, title/H1/meta, URL, redirect, noindex, canonical, sitemap, menu, related-card, lawyer-card, CRM/review or CMS writes until owner-approved execution.

### ACTION-HOMEPAGE-LINE-BY-LINE-001: Review live homepage section by section
**Status:** COMPLETED / REVIEW ONLY
**Why:** The homepage is the current broad legal portal / lawyer-finding entry in GSC. Before any homepage content or design changes, the live sections must be reviewed together with the template structure, user signal, Google signal, business funnel and mock/fake data risk.
**Actions:**
1. DONE: created `project-control/homepage-line-by-line-review-2026-05-11.md`.
2. DONE: created `project-control/homepage-line-by-line-review-2026-05-11.csv`.
3. VERIFIED: live title/meta/H1 support broad legal-help and lawyer-directory intent.
4. VERIFIED: live scrape matches `front-page.php` more than the richer `page-home.php`; decide authoritative homepage template before public execution.
5. REVIEW: raw/uncurated practice-area labels, empty lawyer showcase, latest-only articles, `http://` links, `?page_id=` links and hero city-filter mismatch need controlled follow-up.
6. NEXT: create owner-approved homepage section order and curated pillar-link map, then verify mobile and GA4/CRM tracking before implementation.
7. BLOCKED: no public homepage content, template, title/H1/meta, URL, redirect, noindex, canonical, sitemap, menu, related-card, lawyer-card, CRM/review or CMS writes until owner-approved execution.

### ACTION-CYBER-PRIVACY-INTERNAL-LINK-001: Plan cyber/privacy links before public execution
**Status:** COMPLETED / REVIEW ONLY
**Why:** The cyber/privacy cluster now has GSC, SERP/source and side-by-side evidence. Before any public link/template/CMS change, the primary/support link structure must be mapped and owner-approved.
**Actions:**
1. DONE: created `project-control/cyber-privacy-internal-link-plan-2026-05-11.md`.
2. DONE: created `project-control/cyber-privacy-internal-link-plan-2026-05-11.csv`.
3. VERIFIED: `/cyber-lawyer/` is the current planned primary candidate only after owner approval.
4. VERIFIED: planned support links include `/cybercrime-lawyer-roll/`, `/cyber-laws/`, `/what-is-cyberattack/`, `/cyber-insurance/`, `/cybersex-trafficking/`, the old privacy-injury URL and `/police-records-data-deletion/`.
5. VERIFIED: all link rows are `PLANNED_NEEDS_OWNER_APPROVAL`.
6. NEXT: start homepage line-by-line SEO/design alignment from verified homepage evidence, or create the source/legal checklist for privacy/data deletion/defamation before execution.
7. BLOCKED: no public internal links, related cards, menus, breadcrumbs, content, title/H1/meta, URL, redirect, noindex, canonical, sitemap, lawyer-card, CRM/review or CMS writes until owner-approved execution.

### ACTION-CYBER-PRIVACY-SIDE-BY-SIDE-001: Compare existing cyber/privacy pages before execution
**Status:** COMPLETED / REVIEW ONLY
**Why:** The GSC and SERP/source passes showed that cyber/privacy has overlapping service, support, case-law, privacy and data-deletion assets. A side-by-side comparison is required before any rewrite, merge, redirect, internal-link, title/H1/meta or CMS execution.
**Actions:**
1. DONE: created `project-control/cyber-privacy-side-by-side-review-2026-05-11.md`.
2. DONE: created `project-control/cyber-privacy-side-by-side-review-2026-05-11.csv`.
3. DONE: updated the cyber/privacy owner-approval packet.
4. VERIFIED: `/cyber-lawyer/` is still the current service candidate, but it must be compared against the Hebrew `תפקידם של עורכי דין בתחום הסייבר` page and `/cybercrime-lawyer-roll/`.
5. VERIFIED: `/fbi-cyber-division/` and `/cyber-laws/` are not approved primary pages by word count alone.
6. VERIFIED: the old Hebrew privacy-injury URL remains protected and `/police-records-data-deletion/` remains a boundary page.
7. NEXT: create an approval-gated cyber/privacy internal-link plan, or move to homepage line-by-line SEO/design alignment from verified homepage evidence.
8. BLOCKED: no public content, title/H1/meta, URL, redirect, noindex, canonical, sitemap, taxonomy/menu, related-card, lawyer-card, CRM/review or CMS writes until owner-approved execution.

### ACTION-SERP-CYBER-PRIVACY-SOURCE-001: Run cyber/privacy SERP and official-source review
**Status:** COMPLETED / REVIEW ONLY
**Why:** The cyber/privacy GSC pass created partial evidence, but the cluster still needed SERP/source/legal context before any content, URL, redirect, internal-link, title/H1/meta or CMS execution.
**Actions:**
1. DONE: created `project-control/serp-cyber-privacy-review-2026-05-11.md`.
2. DONE: created `project-control/serp-cyber-privacy-review-2026-05-11.csv`.
3. DONE: updated the cyber/privacy owner-approval packet.
4. DONE: updated the content-decision evidence overlay for the cyber/privacy pillar candidate.
5. VERIFIED: cyber-lawyer/service intent exists as a planning lane, but `/cyber-lawyer/` is not GSC-proven enough for public execution.
6. VERIFIED: old Hebrew privacy-injury URL is protected because it already carries privacy-injury/privacy-protection impressions.
7. VERIFIED: shaming/online defamation and data deletion remain separate source/legal/boundary review topics.
8. NEXT: build a side-by-side comparison of `/cyber-lawyer/`, `/cybercrime-lawyer-roll/`, `/cyber-laws/`, `/what-is-cyberattack/`, old privacy-injury URL and `/police-records-data-deletion/`, or move to homepage line-by-line SEO/design alignment.
9. BLOCKED: no public content, title/H1/meta, URL, redirect, noindex, canonical, sitemap, taxonomy/menu, related-card, lawyer-card, CRM/review or CMS writes until owner-approved execution.

### ACTION-GSC-CYBER-PRIVACY-SUPPORT-PASS-001: Run remaining cyber/privacy support-term GSC evidence pass
**Status:** COMPLETED / REVIEW ONLY
**Why:** The previous cyber/privacy GSC pass covered service terms, but the owner packet still needed support and boundary checks for privacy invasion, online defamation, data deletion, shaming and cyberattack before any content or URL decision.
**Actions:**
1. DONE: created `project-control/gsc-cyber-privacy-support-pass-2026-05-11.md`.
2. DONE: created `project-control/gsc-cyber-privacy-support-pass-2026-05-11.csv`.
3. DONE: updated GSC keyword, cannibalization, priority and evidence-overlay maps.
4. DONE: updated the cyber/privacy owner-approval packet.
5. VERIFIED: `פגיעה בפרטיות` has `38` impressions and `הגנת הפרטיות` has `7` impressions, both on an old Hebrew privacy-injury URL that must be protected and compared.
6. VERIFIED: `שיימינג` has only `1` wrong-page impression on a prenup/family-law URL; do not edit that page for shaming intent.
7. VERIFIED: `מתקפת סייבר`, `לשון הרע באינטרנט`, and `מחיקת מידע` returned zero visible rows.
8. BLOCKED: screenshots timed out, so evidence is text-metric based.
9. NEXT: run SERP/source/legal review or move to homepage line-by-line SEO/design alignment from verified homepage evidence.
10. BLOCKED: no public content, title/H1/meta, URL, redirect, noindex, canonical, sitemap, taxonomy/menu, related-card, lawyer-card, CRM/review or CMS writes until owner-approved execution.

### ACTION-GSC-CYBER-NATIONAL-GAP-PASS-001: Run cyber/privacy and national-insurance GSC evidence pass
**Status:** COMPLETED / REVIEW ONLY
**Why:** After homepage/directory evidence, the remaining-gap queue prioritizes cyber/privacy and national-insurance service/support checks before owner-approved content or URL decisions.
**Actions:**
1. DONE: created `project-control/gsc-cyber-national-gap-pass-2026-05-11.md`.
2. DONE: created `project-control/gsc-cyber-national-gap-pass-2026-05-11.csv`.
3. DONE: captured cyber/privacy screenshots where GSC screenshot capture worked.
4. DONE: updated GSC keyword, cannibalization and priority maps.
5. DONE: updated cyber/privacy and national-insurance owner-approval packets.
6. VERIFIED: `עורך דין סייבר` maps weakly to `/cybercrime-lawyer-roll/` with `42` impressions; `/cyber-lawyer/` reverse check shows `No data`.
7. VERIFIED: `עורך דין ביטוח לאומי`, medical committee and the empty national-insurance hub show no visible GSC rows.
8. REVIEW: cyber and national-insurance remain planning/approval items, not execution items.
9. NEXT: continue remaining cyber/privacy support terms or start homepage line-by-line SEO/design alignment from verified homepage evidence.
10. BLOCKED: no public content, title/H1/meta, URL, redirect, noindex, canonical, sitemap, taxonomy/menu, related-card, lawyer-card, CRM/review or CMS writes until owner-approved execution.

### ACTION-GSC-HOMEPAGE-DIRECTORY-EVIDENCE-001: Run homepage and lawyer-directory GSC evidence pass
**Status:** COMPLETED / REVIEW ONLY
**Why:** The remaining-gap queue identified homepage broad intent and `/lawyers/` directory intent as the top unblocked GSC evidence gap before homepage/design or directory SEO changes.
**Actions:**
1. DONE: created `project-control/gsc-homepage-directory-page-query-pass-2026-05-11.md`.
2. DONE: created `project-control/gsc-homepage-directory-page-query-pass-2026-05-11.csv`.
3. DONE: captured browser evidence screenshots in `project-control/visual-evidence/`.
4. DONE: updated `project-control/gsc-keyword-page-map.csv`, `project-control/gsc-cannibalization-review.csv`, and `project-control/gsc-content-priorities.csv`.
5. VERIFIED: homepage page-to-query check shows `26` clicks, `5,459` impressions, CTR `0.5%`, and average position `17.1`.
6. VERIFIED: `/lawyers/` page-to-query check shows `0` clicks, `0` impressions and `No data`.
7. VERIFIED: broad `עורך דין`, `עורכי דין`, and `מציאת עורך דין` query-to-page checks currently point to the homepage as the best visible URL by clicks.
8. REVIEW: the homepage should remain the current broad legal portal/find-a-lawyer entry while `/lawyers/` gets indexability, internal-link, title/H1, sitemap and content-depth review.
9. NEXT: run the next remaining-gap pass for cyber/privacy and national-insurance checks.
10. BLOCKED: no public homepage, directory, title/H1/meta, URL, redirect, noindex, canonical, sitemap, taxonomy/menu, related-card, lawyer-card, CRM/review or CMS writes until owner-approved execution.

### ACTION-GSC-REMAINING-GAP-QUEUE-001: Create next GSC queue for cyber/privacy, national insurance, homepage and directory checks
**Status:** COMPLETED / REVIEW ONLY
**Why:** After the family/criminal/traffic passes, the highest remaining evidence gaps are cyber/privacy, national insurance, homepage broad intent, lawyer-directory intent and page-to-query diagnostics.
**Actions:**
1. DONE: created `project-control/gsc-remaining-gap-queue-2026-05-11.md`.
2. DONE: created `project-control/gsc-remaining-gap-queue-2026-05-11.csv`.
3. DONE: updated `project-control/targeted-gsc-query-queue.md`.
4. VERIFIED: the queue contains query-to-page checks for cyber/privacy, national-insurance and homepage/directory broad queries.
5. VERIFIED: the queue contains page-to-query checks for the homepage, `/lawyers/`, `/cyber-lawyer/`, `/practice-areas/national-insurance/` and the old national-insurance calculator URL.
6. NEXT: run GSC browser checks for homepage and `/lawyers/` first, then cyber/privacy and national-insurance service terms.
7. BLOCKED: no public content edits, title/H1/meta changes, URL changes, redirects, noindex, canonical changes, sitemap changes, taxonomy/menu edits, related-card edits, lawyer cards, CRM/review changes or CMS writes until explicit owner approval.

### ACTION-GSC-PASS2-PACKET-CARRY-FORWARD-001: Fold pass-2 risks into custody and traffic approval packets
**Status:** COMPLETED / REVIEW ONLY
**Why:** The second targeted GSC browser pass created owner-decision risks that must travel with the topic packets before any content, URL, redirect, canonical, sitemap, internal-link, related-card, menu, lawyer-card or CMS execution.
**Actions:**
1. DONE: updated `project-control/child-custody-owner-approval-packet.md`.
2. DONE: updated `project-control/child-custody-owner-approval-packet.csv`.
3. DONE: updated `project-control/traffic-law-owner-approval-packet.md`.
4. DONE: updated `project-control/traffic-law-owner-approval-packet.csv`.
5. VERIFIED: `משמורת בלעדית לאם` is now carried forward as an old-case-law migration-risk/support item with `107` impressions and average position `9.6`.
6. VERIFIED: `נהיגה בשכרות` and `עורך דין נהיגה בשכרות` are now carried forward as wrong-page traffic-law signals on `/revocation-of-a-will-and-reviving-previous-will/`.
7. VERIFIED: child-support modification/shared-custody zero-row filters remain source/SERP review items, not immediate GSC-driven execution items.
8. NEXT: continue remaining direct GSC/SERP gaps for cyber/privacy, national insurance, homepage, lawyer-directory and page-to-query checks.
9. BLOCKED: no public content edits, title/H1/meta changes, URL changes, redirects, noindex, canonical changes, sitemap changes, taxonomy/menu edits, related-card edits, lawyer cards, CRM/review changes or CMS writes until explicit owner approval.

### ACTION-NATIONAL-INSURANCE-OWNER-APPROVAL-001: Prepare national-insurance primary and boundary approval packet
**Status:** COMPLETED / REVIEW ONLY
**Why:** National insurance is a required strategic cluster, but the current inventory only verifies an empty practice-area hub, a calculator/tool page, old law-text content and boundary pages. The future `/national-insurance-lawyer/` slug is proposed only and must not be created or migrated without approval.
**Actions:**
1. DONE: created `project-control/national-insurance-owner-approval-packet.md`.
2. DONE: created `project-control/national-insurance-owner-approval-packet.csv`.
3. VERIFIED: practice area `ביטוח לאומי` exists at `/practice-areas/national-insurance/` with count `0`, description text and status `REVIEW_EMPTY_TERM`.
4. VERIFIED: `/national-insurance-lawyer/` is a proposed future target in `url-migration-map.csv`, not an approved current public pillar.
5. VERIFIED: old calculator page `מחשבון דמי ביטוח לאומי ובריאות` has `1,778` words, quality score `5/10`, and should be protected until calculator/tool strategy is approved.
6. VERIFIED: old national-insurance disability regulations page has `24,883` words, quality score `4/10`, is outdated, and should be source/legal support review rather than pillar by word count.
7. VERIFIED: `תאונת עבודה` checked GSC row has `0` clicks and `0` impressions; work accident remains a personal-injury/employment/national-insurance boundary topic.
8. RECOMMENDED: owner approval for no-URL-change national-insurance planning, direct GSC/SERP pass, source/legal review, calculator/tool role review, work-accident boundary review and internal-link planning.
9. NEXT: if owner approves, compare `/practice-areas/national-insurance/`, the calculator URL, old disability regulations URL, `/income-protection-insurance/`, COVID unemployment-insurance page, `/pension-insurance-complete-guide/`, future `/national-insurance-lawyer/` and future `/work-accident-lawyer/`.
10. BLOCKED: no public content edits, titles/H1/meta changes, URL changes, redirects, noindex, canonical changes, sitemap changes, taxonomy/menu edits, related-card edits, lawyer cards, CRM/review changes or CMS writes until explicit owner approval.

### ACTION-CYBER-PRIVACY-OWNER-APPROVAL-001: Prepare cyber/privacy primary and boundary approval packet
**Status:** COMPLETED / REVIEW ONLY
**Why:** Cyber/privacy has no verified current `/cyber-privacy-lawyer/` pillar, the heuristic chose an FBI cyber article by word count, and direct GSC evidence is not yet verified for cyber/privacy terms.
**Actions:**
1. DONE: created `project-control/cyber-privacy-owner-approval-packet.md`.
2. DONE: created `project-control/cyber-privacy-owner-approval-packet.csv`.
3. VERIFIED: `/cyber-lawyer/` exists with `6,405` words, quality score `8/10`, and internal links.
4. VERIFIED: strategic `/cyber-privacy-lawyer/` is not a verified current public URL.
5. VERIFIED: `/fbi-cyber-division/` has `21,917` words and quality `6/10`, but it is FBI/international-security support, not an approved local service pillar.
6. VERIFIED: `/cyber-laws/` has `13,956` words and quality `8/10`; `/cybersex-trafficking/` has `2,819` words and quality `8/10`, but both need role/boundary review.
7. NOT VERIFIED: direct GSC rows for `עורך דין סייבר`, `דיני סייבר`, `פגיעה בפרטיות`, `לשון הרע באינטרנט`, `שיימינג`, `מחיקת מידע` and related terms.
8. RECOMMENDED: owner approval for no-URL-change primary selection, cyber support review, privacy support review, criminal/cyber boundary review, source/legal review and direct GSC/SERP pass.
9. NEXT: if owner approves, compare `/cyber-lawyer/`, `/fbi-cyber-division/`, `/cyber-laws/`, `/cybercrime-lawyer-roll/`, `/what-is-cyberattack/`, `/cyber-insurance/`, `/cybersex-trafficking/`, the privacy overview article and `/police-records-data-deletion/`.
10. BLOCKED: no public content edits, titles/H1/meta changes, URL changes, redirects, noindex, canonical changes, sitemap changes, taxonomy/menu edits, related-card edits, lawyer cards or CMS writes until explicit owner approval.

### ACTION-PERSONAL-INJURY-OWNER-APPROVAL-001: Prepare personal-injury/damages primary and car-accident approval packet
**Status:** COMPLETED / REVIEW ONLY
**Why:** Personal injury/damages has no verified current `/personal-injury-lawyer/` pillar, the heuristic chose a punitive-damages article by word count, `/tort-lawyer/` is thin, and car-accident demand maps to a non-final current URL.
**Actions:**
1. DONE: created `project-control/personal-injury-owner-approval-packet.md`.
2. DONE: created `project-control/personal-injury-owner-approval-packet.csv`.
3. VERIFIED: strategic `/personal-injury-lawyer/` is not a verified current public URL; `/punitive-damage/` was selected by heuristic word count only.
4. VERIFIED: `/tort-lawyer/` exists with `507` words and quality score `4/10`.
5. VERIFIED: `/car-accident-auto-injury-lawyer/` has `590` words, quality score `2/10`, and carries `79-84` GSC impressions for `תאונת דרכים`.
6. VERIFIED: `/car-accident-lawyer/` has `4` conflict rows and `0` exact current clean URL rows.
7. VERIFIED: `עורך דין נזיקין` has only a low-sample old category/verdict row with `2` impressions; `תאונת עבודה` has no visible rows in the checked pass.
8. RECOMMENDED: owner approval for no-URL-change primary selection, car-accident comparison, tort-law support review, work-accident recheck, source/legal review and internal-link planning.
9. NEXT: if owner approves, compare `/tort-lawyer/`, `/personal-injury-law/`, `/punitive-damage/`, `/tort-reform/`, `/outline-of-tort-law/`, `/deep-pocket/`, `/car-accident-auto-injury-lawyer/`, `/israel-road-accident-compensation-law/` and `/compulsory-motor-vehicle-insurance/`.
10. BLOCKED: no public content edits, titles/H1/meta changes, URL changes, redirects, noindex, canonical changes, sitemap changes, taxonomy/menu edits, related-card edits, lawyer cards or CMS writes until explicit owner approval.

### ACTION-INHERITANCE-WILLS-OWNER-APPROVAL-001: Prepare inheritance/wills primary and document-risk approval packet
**Status:** COMPLETED / REVIEW ONLY
**Why:** Inheritance/wills has no verified current `/inheritance-lawyer/` pillar, the future `/will/` slug has multiple conflict rows, and GSC maps visible will demand to case-law, old Hebrew, support and document URLs.
**Actions:**
1. DONE: created `project-control/inheritance-wills-owner-approval-packet.md`.
2. DONE: created `project-control/inheritance-wills-owner-approval-packet.csv`.
3. VERIFIED: `will` has `10` conflict rows and `0` exact current clean `/will/` URLs.
4. VERIFIED: strategic `/inheritance-lawyer/` is not a verified current public URL; the heuristic selected `/most-recommended-family-lawyer/` by word count only.
5. VERIFIED: GSC browser evidence maps `צוואה` to a case-law page with `126` impressions, an old Hebrew wills/inheritance URL with `43` impressions, and `צוואה.docx` with `6` impressions.
6. VERIFIED: `התנגדות לצוואה` maps to a case-law URL with `120` impressions, while exact `עורך דין ירושה` showed no visible rows in the checked pass.
7. RECOMMENDED: owner approval for no-URL-change primary selection, side-by-side comparison, source/legal review, document/media strategy and internal-link planning.
8. NEXT: if owner approves, compare `/inheritance/`, `/will-and-testament/`, `/will-probate-objection/`, `/what-is-a-probate-order/`, `/inheritance-order/`, `/revocation-of-a-will-and-reviving-previous-will/`, old Hebrew service/case-law URLs and the DOCX document before any public content or URL decision.
9. BLOCKED: no public content edits, titles/H1/meta changes, URL changes, redirects, document/media deletion/replacement/noindex, canonical changes, sitemap changes, taxonomy/menu edits, related-card edits, lawyer cards or CMS writes until explicit owner approval.

### ACTION-REAL-ESTATE-OWNER-APPROVAL-001: Prepare real-estate primary and homepage-signal approval packet
**Status:** COMPLETED / REVIEW ONLY
**Why:** Real-estate service intent is currently carried by homepage and a cost article, while the strategic `/real-estate-lawyer/` slug is not an exact current URL and international property pages pollute the cluster.
**Actions:**
1. DONE: created `project-control/real-estate-owner-approval-packet.md`.
2. DONE: created `project-control/real-estate-owner-approval-packet.csv`.
3. VERIFIED: `/real-estate-attorney/` exists with `6,941` words and quality score `6/10`; exact `/real-estate-lawyer/` was not found in the current public inventory.
4. VERIFIED: homepage carries `עורך דין מקרקעין` with `136` impressions and `עורך דין מקרקעין ייעוץ חינם` with `135` impressions.
5. VERIFIED: `/real-estate-lawyer-cost-2025/` carries overloaded support demand, including `3.85K` impressions for `עורך דין מכירת דירה`, about `885` for `קניית דירה`, and `31` for `חוזה מכר`.
6. RECOMMENDED: owner approval for no-URL-change primary comparison, homepage routing review, support-page comparison, international-cluster cleanup and source/legal review.
7. NEXT: if owner approves, compare `/real-estate-attorney/`, `/real-estate-lawyer-cost-2025/`, `/lawyer-for-buying-or-selling-a-house/`, `/apartment/`, ID `11261`, registry/tax/contract support pages and international-property pages.
8. BLOCKED: no public content edits, titles/H1/meta changes, URL changes, redirects, homepage changes, noindex, canonical changes, sitemap changes, taxonomy/menu edits, related-card edits, lawyer cards or CMS writes until explicit owner approval.

### ACTION-MEDICAL-MALPRACTICE-OWNER-APPROVAL-001: Prepare medical-malpractice primary and YMYL review approval packet
**Status:** COMPLETED / REVIEW ONLY
**Why:** Medical malpractice is a high-risk YMYL commercial cluster with `27` conflict rows, same-public-URL duplicate records, old Hebrew pages with GSC impressions, and multiple thin/specialist support pages.
**Actions:**
1. DONE: created `project-control/medical-malpractice-owner-approval-packet.md`.
2. DONE: created `project-control/medical-malpractice-owner-approval-packet.csv`.
3. VERIFIED: `/medical-malpractice-lawyer/` has two public REST records: ID `11607` with `5,135` words and quality `6/10`, and ID `1130` with `3,287` words and quality `8/10`.
4. VERIFIED: `עורך דין רשלנות רפואית` visible GSC page is the fee article with `145` impressions, not the clean pillar.
5. VERIFIED: `רשלנות רפואית בלידה` has `661` impressions and `רשלנות רפואית בהריון` has `419` impressions on the old Hebrew birth-malpractice page.
6. RECOMMENDED: owner approval for no-URL-change duplicate identity review, side-by-side content comparison, source/legal review and internal-link planning.
7. NEXT: if owner approves, compare IDs `11607`, `1130`, fee article `6861`, birth-malpractice `11834`, and main support pages before any rewrite or URL decision.
8. BLOCKED: no public content edits, titles/H1/meta changes, URL changes, redirects, noindex, canonical changes, sitemap changes, taxonomy/menu edits, lawyer cards, review/rating/schema or CMS writes until explicit owner approval.

### ACTION-DIVORCE-FAMILY-OWNER-APPROVAL-001: Prepare divorce/family-law primary and document-risk approval packet
**Status:** COMPLETED / REVIEW ONLY
**Why:** Divorce/family is a core commercial cluster, but the main query is currently owned by an old Hebrew URL and document URLs also have GSC visibility.
**Actions:**
1. DONE: created `project-control/divorce-family-owner-approval-packet.md`.
2. DONE: created `project-control/divorce-family-owner-approval-packet.csv`.
3. VERIFIED: `/divorce-lawyer/` exists, has `3,205` words, and has a quality score of `8/10`.
4. VERIFIED: `עורך דין גירושין` has `960` impressions on the old Hebrew divorce-lawyer article.
5. VERIFIED: divorce/family document URLs have GSC visibility: PDF `45` impressions and DOCX `86` impressions for relevant queries.
6. RECOMMENDED: owner approval for no-URL-change comparison, document strategy, source/legal review and internal-link planning only.
7. NEXT: if owner approves, build side-by-side comparison and decide whether useful old content merges into `/divorce-lawyer/`, how to handle document URLs, and how Maya profile links into the cluster.
8. BLOCKED: no public content edits, titles/H1/meta changes, URL changes, redirects, document/media deletion, noindex, canonical changes, sitemap changes, homepage changes, taxonomy/menu edits, Maya profile edits, lawyer cards or CMS writes until explicit owner approval.

### ACTION-EMPLOYMENT-LAW-OWNER-APPROVAL-001: Prepare employment-law intent-split approval packet
**Status:** COMPLETED / REVIEW ONLY
**Why:** Employment law has weak primary ownership: service intent maps mostly to homepage, broad informational intent maps mostly to `/israeli-labor-law/`, and `/labor-lawyer/` is thin.
**Actions:**
1. DONE: created `project-control/employment-law-owner-approval-packet.md`.
2. DONE: created `project-control/employment-law-owner-approval-packet.csv`.
3. VERIFIED: `/labor-lawyer/` exists, has `689` words, and has a quality score of `4/10`.
4. VERIFIED: `עורך דין דיני עבודה` has `88` impressions, mostly homepage.
5. VERIFIED: `דיני עבודה` has `614` impressions, mostly `/israeli-labor-law/`.
6. RECOMMENDED: owner approval for no-URL-change primary selection, SERP review, source/legal review and internal-link planning only.
7. NEXT: if owner approves, build side-by-side comparison and decide whether `/labor-lawyer/` remains the service primary or `/employment-lawyer/` becomes the migration target later.
8. BLOCKED: no public content edits, titles/H1/meta changes, URL changes, redirects, homepage changes, noindex, canonical changes, sitemap changes, taxonomy/menu edits, lawyer cards or CMS writes until explicit owner approval.

### ACTION-CHILD-CUSTODY-OWNER-APPROVAL-001: Prepare child-custody document-risk approval packet
**Status:** COMPLETED / REVIEW ONLY
**Why:** Child custody has a clean candidate URL, but GSC shows broad custody demand on an older article and a PDF, plus high-position evidence on an old Hebrew case-law URL.
**Actions:**
1. DONE: created `project-control/child-custody-owner-approval-packet.md`.
2. DONE: created `project-control/child-custody-owner-approval-packet.csv`.
3. VERIFIED: `/child-custody/` exists, has `2,397` words, and remains the likely public guide candidate.
4. VERIFIED: `משמורת ילדים` has `611` impressions split between `what-is-child-custody/` and `ChildCustody.pdf`.
5. VERIFIED: `משמורת בלעדית לאם` maps to an old Hebrew case-law URL with `107` impressions and average position `9.6`.
6. RECOMMENDED: owner approval for no-URL-change comparison, source/legal review and document strategy only.
7. NEXT: if owner approves, build side-by-side comparison, document strategy, source/legal checklist and internal-link plan for the custody cluster.
8. BLOCKED: no public content edits, titles/H1/meta changes, URL changes, redirects, noindex, canonical changes, sitemap changes, robots/media/document changes, taxonomy/menu edits, lawyer cards or CMS writes until explicit owner approval.

### ACTION-CHILD-SUPPORT-OWNER-APPROVAL-001: Prepare child-support no-URL-change approval packet
**Status:** COMPLETED / REVIEW ONLY
**Why:** Child support is the largest active conflict group, but GSC shows the old calculator URL owns visible demand, so the next step must be owner approval for comparison and source/legal review, not content or URL execution.
**Actions:**
1. DONE: created `project-control/child-support-owner-approval-packet.md`.
2. DONE: created `project-control/child-support-owner-approval-packet.csv`.
3. VERIFIED: `/child-support/` exists, has `2,767` words, and remains the likely public guide candidate.
4. VERIFIED: `https://jus-tice.co.il/מחשבון-מזונות-ילדים/` receives the visible GSC child-support/calculation impressions from the checked filters.
5. VERIFIED: child-support has `30` conflict rows and requires source/legal review before calculator, formula, `בע"מ 919/15`, jurisdiction or support-page claims.
6. RECOMMENDED: owner approval for no-URL-change comparison and source/legal planning only.
7. NEXT: if owner approves, build side-by-side content-quality comparison, claim/source checklist and internal-link plan for the child-support cluster.
8. BLOCKED: no public content edits, titles/H1/meta changes, URL changes, redirects, noindex, canonical changes, sitemap changes, taxonomy/menu edits, calculator/tool claims, lawyer cards or CMS writes until explicit owner approval.

### ACTION-CRIMINAL-LAW-OWNER-APPROVAL-001: Prepare criminal-law primary-selection approval packet
**Status:** COMPLETED / REVIEW ONLY
**Why:** Criminal law is a high-value cluster, but it has heavier URL risk than traffic law because `/criminal-lawyer/` is not an exact current URL and old Hebrew URLs have GSC signal.
**Actions:**
1. DONE: created `project-control/criminal-law-owner-approval-packet.md`.
2. DONE: created `project-control/criminal-law-owner-approval-packet.csv`.
3. VERIFIED: existing clean `/criminal-defense-attorney/` is published, has `9,086` words, and already targets `עורך דין פלילי` in the title.
4. VERIFIED: `/criminal-lawyer/` remains a strategic future target, but migration is blocked by 13 conflict rows and old Hebrew GSC-signal URLs.
5. VERIFIED: support targets (`police-investigation`, `indictment`, `pretrial-detention`, `drug-offenses`) already have old/current assets and must not be duplicated.
6. RECOMMENDED: owner approval for primary selection and consolidation planning only; no URL migration yet.
7. NEXT: if owner approves, build content-quality comparison for primary candidates and a source/legal/internal-link checklist.
8. BLOCKED: no public content edits, titles/H1/meta changes, URL changes, redirects, noindex, canonical changes, sitemap changes, taxonomy/menu edits or CMS writes until explicit owner approval.

### ACTION-TRAFFIC-LAW-OWNER-APPROVAL-001: Prepare no-URL-change traffic-law approval packet
**Status:** COMPLETED / REVIEW ONLY
**Why:** Traffic law is the safest first execution candidate because `/traffic-lawyer/` already exists and the proposed first batch can expand current content without URL migration.
**Actions:**
1. DONE: created `project-control/traffic-law-owner-approval-packet.md`.
2. DONE: created `project-control/traffic-law-owner-approval-packet.csv`.
3. VERIFIED: `/traffic-lawyer/` is a published exact clean URL but thin at `1,399` words.
4. VERIFIED: `/driving-under-the-influence/`, `/yanshuf-breathalyzer-test/`, `/speeding/`, and `/driving-under-the-influence-of-drugs/` exist and should be reviewed/expanded before any duplicate clean slugs are created.
5. VERIFIED: drunk-driving lawyer intent currently has a wrong-page GSC signal on the will-revocation page; do not edit that will page for traffic intent.
6. RECOMMENDED: owner approval for no-URL-change expansion of `/traffic-lawyer/` first, then review/expand `/driving-under-the-influence/`.
7. NEXT: if owner approves, build content briefs, source/legal checklist, and internal-link map before CMS drafts.
8. BLOCKED: no public content edits, titles/H1/meta changes, URL changes, redirects, noindex, canonical changes, sitemap changes, taxonomy/menu edits or CMS writes until explicit owner approval.

### ACTION-CRIMINAL-TRAFFIC-SERP-001: Add SERP evidence to criminal and traffic decision packets
**Status:** COMPLETED / REVIEW ONLY
**Why:** The criminal and traffic support packets needed current SERP evidence before owner approval and before any content, URL, redirect or internal-link execution batch.
**Actions:**
1. DONE: created `project-control/serp-criminal-traffic-review-2026-05-11.md`.
2. DONE: created `project-control/serp-criminal-traffic-review-2026-05-11.csv`.
3. VERIFIED: criminal-law SERPs support `/criminal-lawyer/` as a strategic commercial pillar, while `דין פלילי` must not cannibalize it as an uncontrolled duplicate.
4. VERIFIED: criminal support terms (`חקירה במשטרה`, `כתב אישום`, `מעצר ימים`, `עבירות סמים`) are valid support intents but require old-content comparison and source/legal review first.
5. VERIFIED: traffic-law SERPs support expanding existing `/traffic-lawyer/` as the pillar, with drunk-driving, breathalyzer, speeding and license-suspension as support review paths.
6. VERIFIED: existing `/driving-under-the-influence/` must be reviewed before any `/drunk-driving/` clean-slug decision.
7. NEXT: prepare the first owner-approval packet for either criminal pillar cleanup or traffic pillar expansion.
8. BLOCKED: no URL changes, redirects, noindex, canonical changes, sitemap changes, public rewrites, deletions, taxonomy/menu edits or CMS writes from this SERP pass alone.

### ACTION-CRIMINAL-TRAFFIC-SUPPORT-PACKETS-001: Build review-only criminal and traffic support decision packets
**Status:** COMPLETED / REVIEW ONLY
**Why:** The targeted GSC passes exposed weak primary ownership, old URL risk, low-sample support terms and wrong-page traffic-law matches. These needed to become controlled decision packets before any article, URL or redirect work.
**Actions:**
1. DONE: created `project-control/criminal-law-support-decision-packet.md`.
2. DONE: created `project-control/criminal-law-support-review.csv`.
3. DONE: created `project-control/traffic-law-support-decision-packet.md`.
4. DONE: created `project-control/traffic-law-support-review.csv`.
5. VERIFIED: criminal-law support planning now compares `/criminal-lawyer/`, `/police-investigation/`, `/indictment/`, `/pretrial-detention/`, `/drug-offenses/`, old Hebrew criminal-lawyer URLs and existing criminal support articles.
6. VERIFIED: traffic-law support planning now compares `/traffic-lawyer/`, existing `/driving-under-the-influence/`, possible `/drunk-driving/`, possible `/license-suspension/`, wrong-page will-revocation GSC matches, and car-accident boundary pages.
7. VERIFIED: packets are review-only and explicitly block duplicate page creation, blind URL migration, redirects, noindex, canonical changes, sitemap changes, or public content replacement.
8. DONE: SERP review for the criminal and traffic terms was documented in `project-control/serp-criminal-traffic-review-2026-05-11.md` and `.csv`.
9. NEXT: choose the first owner-approval packet for either criminal pillar cleanup or traffic pillar expansion.
10. BLOCKED: no execution until owner approval, content-quality review, source/legal review, redirect map and internal-link batch are ready.

### ACTION-TARGETED-GSC-QUERY-QUEUE-001: Run targeted GSC filters for unresolved decision gaps
**Status:** IN PROGRESS / REVIEW ONLY
**Why:** The audit now needs precise browser GSC checks for unresolved topics before any URL/content/redirect decisions can be approved.
**Actions:**
1. DONE: created `project-control/targeted-gsc-query-queue.csv`.
2. DONE: created `project-control/targeted-gsc-query-queue.md`.
3. VERIFIED: queue rows cover child support, child custody, employment law, inheritance/wills, work/car accident, traffic/drunk-driving and criminal support spokes.
4. VERIFIED: each row defines expected primary URL, support URLs, known current signal, decision rules and required GSC tabs.
5. NEXT: run the first browser pass for `מזונות ילדים`, `חישוב מזונות`, `מחשבון מזונות`, `בעמ 919/15`, `משמורת ילדים`, `עורך דין דיני עבודה`, `דיני עבודה`, `עורך דין ירושה`, `עורך דין צוואות וירושות`, and `עורך דין תאונות דרכים`.
6. NEXT: update `gsc-keyword-page-map.csv`, `gsc-cannibalization-review.csv`, `gsc-content-priorities.csv`, `content-decision-evidence-overlay.csv`, and topic packets after each checked group.
7. BLOCKED: do not execute URL changes, redirects, noindex, canonical changes, sitemap changes, content rewrites, content deletion, menu changes or CMS writes from the query queue alone.
8. DONE: first browser pass completed and documented in `project-control/gsc-targeted-query-pass-2026-05-11.csv` and `project-control/gsc-targeted-query-pass-2026-05-11.md`.
9. VERIFIED: child-support/calculation variants map to old calculator URL; custody maps to `what-is-child-custody` plus a PDF; employment is split across homepage, `/labor-lawyer/`, `/israeli-labor-law/` and support pages.
10. DONE: second browser pass completed and documented in `project-control/gsc-targeted-query-pass-2-2026-05-11.csv` and `project-control/gsc-targeted-query-pass-2-2026-05-11.md`.
11. VERIFIED: `משמורת בלעדית לאם` maps to an old case-law URL with `107` impressions and average position `9.6`; this is a high-risk custody support/migration review item.
12. VERIFIED: `נהיגה בשכרות` and `עורך דין נהיגה בשכרות` map to `/revocation-of-a-will-and-reviving-previous-will/`, confirming wrong-page traffic-law evidence.
13. VERIFIED: `עבירות סמים` has only `2` impressions across a case-law page and an old criminal-lawyer URL; child-support modification variants, `בע"מ 919/15`, and `חקירה במשטרה` showed no visible rows.
14. DONE: pass-2 implications were folded into the child-custody and traffic-law owner-approval packets.
15. NEXT: continue with remaining direct GSC/SERP gaps for cyber/privacy, national-insurance, lawyer-directory and page-to-query checks.

### ACTION-CONTENT-DECISION-EVIDENCE-001: Overlay GSC/SERP evidence on first content decision batch
**Status:** IN PROGRESS / REVIEW ONLY
**Why:** The refreshed inventory and conflict queues need Search Console and SERP evidence before any pillar, merge, redirect, or English-slug migration decision.
**Actions:**
1. DONE: created `project-control/content-decision-evidence-overlay.csv`.
2. DONE: created `project-control/gsc-serp-first-evidence-pass.md`.
3. VERIFIED: existing `GSC_BROWSER_VERIFIED` rows were mapped to the first priority targets: `criminal-lawyer`, `divorce-lawyer`, `medical-malpractice-lawyer`, `real-estate-lawyer`, `divorce-mediation`, `traffic-lawyer`, `personal-injury-lawyer`, and `inheritance-lawyer` / will variants.
4. VERIFIED: old Hebrew/media/document URLs hold visible impressions for several topics, so migration risk is real and must be controlled.
5. NOT VERIFIED: direct GSC pass for `child-support` / `מזונות ילדים` variants is still missing.
6. NOT VERIFIED: direct GSC pass for employment-lawyer variants is still missing.
7. NEXT: run targeted GSC browser filters for `מזונות ילדים`, `חישוב מזונות`, `בעמ 919/15`, `משמורת ילדים`, `עורך דין דיני עבודה`, `דיני עבודה`, `עורך דין ירושה`, and `עורך דין צוואות וירושות`.
8. NEXT: use the overlay to update URL migration and redirect maps only as proposed plans after owner review.
9. BLOCKED: do not execute URL changes, redirects, noindex, canonical changes, sitemap changes, content rewrites, content deletion, menu changes or CMS writes from this overlay alone.

### ACTION-CHILD-SUPPORT-DECISION-001: Build child-support conflict decision packet
**Status:** IN PROGRESS / REVIEW ONLY
**Why:** `child-support` is the largest current target-slug conflict group and needs a clear primary/support/merge review before any migration or editorial rewrite.
**Actions:**
1. DONE: created `project-control/child-support-content-decision-packet.md`.
2. DONE: created `project-control/child-support-conflict-review.csv`.
3. VERIFIED: exact clean URL candidate exists at `https://jus-tice.co.il/child-support/`.
4. VERIFIED: the clean page is a public guide candidate with word count `2,767`, heuristic quality `8/10`, and internal links into the family-law cluster.
5. REVIEW: old long case-law/doctrine pages should be support or merge-review material, not automatic primary pages.
6. NOT VERIFIED: direct GSC traffic for `מזונות ילדים`, `חישוב מזונות`, `מחשבון מזונות`, `בעמ 919/15`, `מזונות משותפת`, `הפחתת מזונות`, and `שינוי מזונות`.
7. NEXT: run the targeted GSC filters, then update the child-support packet with clicks/impressions/CTR/position per URL.
8. BLOCKED: no redirect, slug, noindex, canonical, sitemap, or content-body action until owner approval and legal/source review.

### ACTION-PUBLIC-HTTP-SCAN-001: Classify remaining first-party HTTP references
**Status:** FIXED LIVE / MONITOR
**Why:** After sampled related-card links were fixed, a broader public scan still found old first-party `http://jus-tice.co.il` references in rendered HTML and sitemap media URLs. These must be classified before any URL migration or GSC sitemap submission.
**Actions:**
1. DONE: added `tools/check-public-http-internal-links.ps1`.
2. DONE: generated `project-control/public-http-internal-link-scan-2026-05-11.csv`.
3. VERIFIED: scanner is read-only and records source page, occurrence URL, occurrence type, attribute/context and notes.
4. REVIEW: bounded scan found 199 remaining first-party HTTP references: 122 from rendered HTML and 77 from sitemap child XML.
5. REVIEW: 118 findings are internal page/category/article URLs and 81 are `/wp-content/uploads/` media URLs.
6. DONE: extended the scanner with `suspected_source` and `remediation_lane` columns.
7. CREATED / REVIEW: `project-control/public-http-internal-link-scan-2026-05-11-classified-before-theme-fix.csv`.
8. REVIEW: classified pre-fix sample found 54 `THEME_DISPLAY_FIX` items, 69 `PLUGIN_OR_MEDIA_CONFIG_REVIEW` items, 2 `CONTENT_MEDIA_DISPLAY_OR_CMS_REVIEW` items and 35 `CLASSIFY_BEFORE_FIX` items.
9. CODE FIXED: theme-owned taxonomy/term link surfaces now use `justice_theme_public_term_link()` and first-party HTTPS normalization.
10. VERIFIED LOCAL: PHP lint passed for 128 PHP files; `git diff --check` returned only Windows LF-to-CRLF warnings.
11. DONE: pushed `005af18` and pulled in uPress.
12. VERIFIED LIVE: uPress Git log shows `005af18` as top commit and static marker returns `2026-05-11-theme-term-link-https-v1`.
13. VERIFIED AFTER-SCAN: `project-control/public-http-internal-link-scan-2026-05-11-after-theme-term-link-https.csv` records 36 verified resources and 71 remaining review findings.
14. FIXED LIVE: `THEME_DISPLAY_FIX` findings dropped from 54 before deployment to 0 after deployment.
15. VERIFIED SOURCE: Rank Math official docs list `rank_math/sitemap/urlimages` and `rank_math/sitemap/xml_img_src` for sitemap image URL handling.
16. FIXED LIVE: media URLs now normalize to HTTPS at render time in attachment helpers, srcset sources, post content output and Rank Math image sitemap callbacks.
17. VERIFIED LOCAL: PHP lint passed for 128 PHP files; `git diff --check` returned only Windows LF-to-CRLF warnings.
18. DONE: pushed `a74a28b`, pulled it in uPress, and verified marker `2026-05-11-media-sitemap-https-v1`.
19. VERIFIED AFTER-SCAN: `project-control/public-http-internal-link-scan-2026-05-11-after-media-sitemap-https.csv` records 42 `VERIFIED` resources and 0 `REVIEW` findings.
20. FIXED LIVE: the 69 `SEO_PLUGIN_SITEMAP_MEDIA` and 2 `CONTENT_MEDIA_OUTPUT` findings from the previous scan dropped to 0 in this bounded pass.
21. NEXT: keep this scanner in the pre-migration QA workflow and rerun before any GSC sitemap resubmission or URL migration batch.
22. SAFETY: do not run bulk database replacement, redirects, slug changes, noindex changes or sitemap removals from this scan alone.

### ACTION-HOMEPAGE-LINE-BY-LINE-001: Review homepage signal section by section
**Status:** QUEUED / FUTURE ACTION
**Why:** The homepage must communicate legal-help intent to users, broad legal-portal relevance to Google, and business value to lawyers considering joining.
**Actions:**
1. Review every homepage section, headline, CTA, link and card.
2. For each section, document the Google signal, user signal, lawyer/business signal, SEO fit and conversion fit.
3. Compare against strong legal portal/directory structures without copying text or design.
4. Produce a recommended section order, copy/heading direction, internal-link plan and mobile notes.
5. SAFETY: do not rewrite homepage content or templates until the current content inventory/technical SEO baseline is stable.

### ACTION-HOMEPAGE-COMPETITOR-STRATEGY-001: Build competitor-aligned homepage strategy
**Status:** QUEUED / FUTURE ACTION
**Why:** Jus-Tice needs homepage structure that matches or beats top legal portals: clear identity, directory, practice areas, legal guides, trust, lead CTA and lawyer onboarding.
**Actions:**
1. Research strong ranking legal sites and classify their homepage structure.
2. Extract structural patterns only: portal identity, hub links, directory flow, guide library, trust signals, CTA paths and onboarding.
3. Map the best patterns to Jus-Tice pillars and business model.
4. Add findings to homepage SEO/design strategy before template changes.

### ACTION-CONTENT-UPLOAD-SYSTEM-001: Treat content upload as one governed architecture
**Status:** QUEUED / FUTURE ACTION
**Why:** Article publishing must be controlled together with quality, slugs, pillars, links, homepage, menus, breadcrumbs, categories, lawyer cards, mobile UX, sitemap, redirects and GSC monitoring.
**Actions:**
1. Define the approval checklist for every content batch.
2. Require inventory, cannibalization check, slug check, internal-link plan, sitemap/canonical review and mobile/template QA before publishing.
3. Record decisions in content inventory, URL migration map, cannibalization map and internal link map.
4. Do not publish isolated articles outside this system.

### ACTION-BUSINESS-MARKETING-ECOSYSTEM-001: Plan Google Business, analytics and marketing visibility
**Status:** QUEUED / FUTURE ACTION
**Why:** The site needs measurement and off-site visibility: Google Business Profile strategy, GA4 events, lead tracking, lawyer funnel, campaigns and business presence beyond the website.
**Actions:**
1. Add Google Business Profile strategy for Jus-Tice and participating lawyers.
2. Verify GA4 events for lead, phone, WhatsApp, lawyer profile, article CTA, search and signup flows.
3. Map lawyer onboarding funnel and campaign readiness.
4. Keep this as planning until the current content/GSC/audit workflow is stable.

### ACTION-PROJECT-TIMING-RESOURCES-001: Maintain realistic timeline and acceleration needs
**Status:** QUEUED / FUTURE ACTION
**Why:** The owner needs realistic expectations for the full content architecture project.
**Current Estimate:**
1. Full content inventory: about 1-2 focused workdays if REST/export stays stable; faster with WP All Export or full CSV export.
2. Cannibalization mapping: about 2-4 focused workdays, depending on old-content volume and GSC query coverage.
3. URL migration planning: about 2-3 focused workdays after inventory and cannibalization groups are mapped.
4. Homepage/content/design alignment: about 1-2 focused workdays after priority clusters and business CTAs are clear.
5. Speed-up needs: full WP export, GSC/GA4 exports, approved pillar priority list, owner decisions on first money clusters, and stable admin/API access.

### ACTION-PUBLIC-LINK-HTTPS-001: Keep public frontend internal links on HTTPS
**Status:** FIXED LIVE - monitor with future template changes
**Why:** Related-content QA showed public card links still rendering `http://jus-tice.co.il/...` even after sitemap/canonical HTTPS work. Mixed-protocol internal links create crawl noise before controlled URL migration.
**Actions:**
1. DONE: added display-only helpers `justice_theme_public_url()` and `justice_theme_public_permalink()`.
2. DONE: wired major public template surfaces through those helpers, including article cards, lawyer cards, search cards, generic cards, LegalTech cards, practice pages, lawyer mini-site article links, dashboard links, topic-cluster links and schema URLs.
3. VERIFIED LOCAL: PHP lint passed for 128 PHP files; `git diff --check` returned only Windows LF-to-CRLF warnings.
4. LIVE DEPLOYMENT VERIFIED: uPress top commit is `3b99fbb` (`Normalize public template links to HTTPS`).
5. LIVE VERIFIED: marker `2026-05-11-public-link-https-normalization-v1` is public.
6. LIVE VERIFIED: `project-control/live-related-content-qa-2026-05-11-after-public-link-https.csv` has all sampled rows marked `VERIFIED`, and sampled related-card URLs are HTTPS.
7. SAFETY: this changed rendered output only; no stored URL, slug, redirect, sitemap inclusion rule, canonical setting, content body, CMS metadata, taxonomy, lawyer, CRM, review, plugin state, wp-admin setting or database row was changed.

### ACTION-PLUGIN-COLLISION-001: Keep Justice plugin migration controlled
**Status:** PARTIAL PARITY VERIFIED / MIGRATION NOT APPROVED
**Why:** The live site currently exposes `Ultra Justice Engine`, while the repo also contains `justice-core` and `ultra-justice`. Activating duplicate Justice plugins could create PHP fatal errors, duplicate CPT/taxonomy registration, or confused REST/content behavior.
**Actions:**
1. DONE: added `tools/check-justice-plugin-collision.ps1`.
2. VERIFIED LOCAL: `ultra-justice-engine/ultra-justice-engine.php` has plugin header `Ultra Justice Engine`, version `1.0.0`, REST namespace `ultra-justice-engine/v1`.
3. VERIFIED LOCAL: `justice-core/justice-core.php` has plugin header `Justice Core`, version `1.0.0`, REST namespace `justice-core/v1`.
4. VERIFIED LOCAL: `ultra-justice/ultra-justice.php` has plugin header `Ultra Justice`, version `1.0.0`, REST namespace `ultra-justice/v1`.
5. VERIFIED LOCAL RISK: `justice-core/` and `ultra-justice-engine/` share `UJE_*` constants and many `uje_*` functions.
6. DOCUMENTED: `project-control/justice-plugin-collision-review.md`.
7. DECISION: do not activate `justice-core/` while `ultra-justice-engine/` is active.
8. DONE: read-only uPress File Manager inspection confirmed `/wp-content/plugins/ultra-justice-engine/ultra-justice-engine.php` exists on live and `/wp-content/plugins/justice-core` returned 0 filtered items.
9. DOCUMENTED: `project-control/upress-plugin-filesystem-readonly-review.md`.
10. DONE: generated `project-control/ultra-justice-engine-repo-manifest.csv` with local file hashes and `project-control/ultra-justice-engine-live-visible-manifest.csv` from the uPress visible active-plugin listing.
11. PARTIAL VERIFIED: repo `ultra-justice-engine/` has 17 files and repo `includes/` has 16 files; live visible `includes/` listing shows 15 files.
12. VERIFIED PARITY GAP: `includes/cpt-legal-tools.php` exists in the repo plugin but was NOT VISIBLE in the live active plugin listing.
13. DOCUMENTED: `project-control/live-plugin-code-parity-review.md`.
14. CODE FIXED: added admin-only read-only route `GET /wp-json/justice-theme/v1/active-plugin-manifest` to produce an active-plugin manifest when authenticated as an administrator.
15. DOCUMENTED: `project-control/plugin-manifest-diagnostic-review.md`.
16. VERIFIED LIVE: uPress top commit `8111d12`, static marker `2026-05-11-plugin-manifest-diagnostic-v1`, and unauthenticated public diagnostic request returns HTTP 401.
17. BLOCKED: Codex browser cannot currently open `jus-tice.co.il/wp-admin/` or the WordPress-side diagnostic route due a browser network failure, while local unauthenticated checks still reach the route.
18. CODE FIXED: added `tools/export-plugin-manifest-diagnostic.ps1` and `tools/compare-plugin-manifests.ps1` for future Application Password export and live-vs-repo comparison.
19. NEXT: create/use a WordPress Application Password or authenticated WP admin session, run the export script, then run the comparison script.
20. SAFETY: no plugin activation, deactivation, deletion, installation, upload, rename, compression, file-manager edit, wp-admin setting, URL, redirect, content, taxonomy, sitemap, canonical, lawyer, CRM, review or database change was made.

### ACTION-ROUTING-404-HOMEPAGE-001: Identify and disable uncontrolled 404-to-homepage redirects
**Status:** VERIFIED SOURCE - owner approval needed before deactivation
**Why:** Arbitrary missing URLs and invalid query routes should return a real Hebrew 404. Redirecting every miss to the homepage hides broken URLs, confuses users, and creates crawl/SEO noise before controlled URL migration.
**Actions:**
1. DONE: confirmed fake paths were returning `301 Location: https://jus-tice.co.il` and then homepage 200.
2. DONE: added and deployed canonical/wp_redirect guards for non-root requests targeting the homepage.
3. DONE: added and deployed native-404 early template guard in commit `cbbba45` with marker `2026-05-11-native-404-before-redirect-v1`.
4. VERIFIED LIVE: marker is deployed and uPress Git log shows `cbbba45`.
5. VERIFIED LIVE BLOCKED: fake paths still return homepage 301 and do not expose `X-Justice-Route-Guard`.
6. VERIFIED LIVE CLUE: the 301 response has no `X-Redirect-By`, suggesting a direct header/server/plugin redirect source. Exact source NOT VERIFIED.
7. VERIFIED SOURCE: uPress plugin manager shows `All 404 Redirect to Homepage` active (`פעיל`); its own description says it redirects 404 links to the homepage or another page using 301 redirects.
8. DOCUMENTED: `project-control/redirect-404-source-review.md` and evidence screenshot `project-control/visual-evidence/all-404-redirect-plugin-active-upress-2026-05-11.png`.
9. NEXT: with owner approval, deactivate `All 404 Redirect to Homepage`, clear cache if needed, then verify fake URLs return HTTP 404, homepage returns 200, and key valid pages remain 200.
10. SAFETY: no URL migration, redirect rule, `.htaccess`, content, taxonomy, canonical, sitemap, lawyer, CRM, review, wp-admin option or database row was changed.

### ACTION-ROBOTS-STATIC-FILE-001: Replace empty static root robots.txt with verified sitemap-safe directives
**Status:** FIXED LIVE - monitor after cache/server changes
**Why:** The live root `robots.txt` was a zero-byte static file that shadowed WordPress' healthy generated robots output and prevented the verified sitemap index from being advertised to crawlers.
**Actions:**
1. DONE: confirmed public `https://jus-tice.co.il/robots.txt` returned HTTP 200 with zero-length body.
2. DONE: confirmed WordPress dynamic robots output at `/?robots=1` contained normal crawl rules and `Sitemap: https://jus-tice.co.il/sitemap_index.xml`.
3. DONE: confirmed uPress root File Manager listed physical `robots.txt` as size `—` and old backup `robots_ren1756059924.txt` as 196 B.
4. FIXED LIVE: edited root `robots.txt` in uPress File Manager to include wp-admin/feed/embed blocks, plugin private-file blocks, `Allow: /wp-admin/admin-ajax.php`, and the verified sitemap index directive.
5. VERIFIED LIVE: `robots.txt?codex_verify=...` returns HTTP 200, length 268, includes the sitemap index, has no global `Disallow: /`, and does not block theme/CSS assets.
6. VERIFIED LIVE: active sitemap index and sampled child sitemaps remain XML with zero first-party HTTP locs.
7. NEXT: monitor this file after server cache/plugin changes and submit `https://jus-tice.co.il/sitemap_index.xml` in GSC only after the owner approves the current technical SEO baseline.
8. SAFETY: no URL, redirect, `.htaccess`, content body, taxonomy, canonical, lawyer, CRM, review, wp-admin option or database row was changed.

### ACTION-RANKMATH-SITEMAP-CACHE-001: Bypass stale Rank Math sitemap cache during HTTPS baseline verification
**Status:** FIXED LIVE - monitor with robots baseline now fixed
**Why:** Latest theme code is live, but Rank Math child sitemap XML still emits stale `http://jus-tice.co.il` loc values. Sitemap HTTPS must be clean before GSC sitemap submission or URL migration.
**Actions:**
1. DONE: added the official Rank Math `rank_math/sitemap/enable_caching` filter with `__return_false`.
2. DONE: kept the existing first-party sitemap URL normalization hooks; no URL inventory, redirect, canonical or sitemap inclusion rule was changed.
3. DONE: deployment marker advanced to `2026-05-11-rankmath-sitemap-cache-bypass-v1`.
4. VERIFIED BEFORE PATCH: `articles-sitemap2.xml?nocache=1` still returned 200 HTTP loc values and zero HTTPS loc values.
5. VERIFIED LIVE: uPress Git log top commit is `4c7b45e`; public marker returns `2026-05-11-rankmath-sitemap-cache-bypass-v1`.
6. FIXED LIVE: sampled child sitemaps now show zero first-party HTTP locs and HTTPS locs only.
7. NEXT: recheck the same sitemap URLs after any Rank Math/settings/cache change and before GSC sitemap submission.
8. FIXED FOLLOW-UP: the separate empty root `robots.txt` blocker was fixed live in `ACTION-ROBOTS-STATIC-FILE-001`; continue monitoring after server/plugin/cache changes.

### ACTION-UPRESS-PULL-001: Verify and document self-service uPress Git pull
**Status:** VERIFIED LIVE - post-pull robots/sitemap follow-up needed
**Why:** Many completed repo fixes were blocked on live deployment. The owner asked Codex to find a way to pull Git from uPress directly.
**Actions:**
1. DONE: logged into uPress with owner-approved access and opened the `jus-tice.co.il` File Manager.
2. DONE: opened `ניהול GIT` under `/wp-content/themes/justice-theme`.
3. DONE: ran Git Status; uPress reported the theme working directory was clean.
4. DONE: ran Git Pull.
5. VERIFIED LIVE: uPress Git log top commit is `c992fd2` (`Document reviews compliance alias`).
6. VERIFIED LIVE: public static marker now returns `2026-05-11-robots-sitemap-directive-v1`, and homepage source includes the same marker.
7. BLOCKED: public `robots.txt` still returns empty output; inspect static/server/plugin robots source before making any robots/htaccess change.
8. BLOCKED: Rank Math child sitemap XML still exposes HTTP locs; clear Rank Math sitemap cache/resave sitemap or permalink settings, then recheck.

### ACTION-REVIEWS-COMPLIANCE-DOC-001: Keep review/reputation compliance package complete
**Status:** DOCUMENTED - implementation blocked pending legal/owner review
**Why:** Lawyer reviews, ratings and reputation signals are a major trust and monetization layer, but they create legal, privacy, Google-policy and advertising-risk issues if launched without strict rules.
**Actions:**
1. DONE: expanded `project-control/reviews-compliance-risk.md` from a pointer into an owner-facing compliance summary.
2. DONE: preserved `project-control/review-compliance-risk.md` as the canonical detailed compliance register.
3. DONE: documented non-negotiable rules, MVP compliance position, launch blockers and related planning files.
4. VERIFIED: the related review/reputation research, Google integration plan, rating-system spec, review-fields CSV, schema policy, roadmap and Maya prototype plan are present.
5. NEXT: before implementation, confirm legal/owner approval for review wording, paid placement disclosure, moderation workflow, first-party review collection, Google review source display and schema policy.
6. NOT IMPLEMENTED: no public rating/review UI, review schema, Google sync, lawyer profile edit or database/wp-admin change was made.

### ACTION-ROBOTS-SITEMAP-001: Advertise verified sitemap index in robots.txt
**Status:** CODE FIXED - live deployment/verification pending
**Why:** `sitemap_index.xml` is the verified active XML sitemap, while `/sitemap.xml` and `/wp-sitemap.xml` redirect to the homepage and should not be submitted.
**Actions:**
1. DONE: added a `robots_txt` filter that appends `Sitemap: https://jus-tice.co.il/sitemap_index.xml` when absent.
2. DONE: the filter respects WordPress public-indexing settings.
3. DONE: duplicate sitemap directives are avoided when the same URL is already present.
4. VERIFIED: PHP lint passed for 127 files and `git diff --check` passed.
5. NEXT: pull/deploy marker `2026-05-11-robots-sitemap-directive-v1`, then verify `https://jus-tice.co.il/robots.txt` includes the sitemap index and still does not block CSS/JS/public content.
6. NOT LIVE VERIFIED: no public deployment yet.

### ACTION-SITEMAP-HTTPS-001: Normalize plugin sitemap URLs to HTTPS
**Status:** CODE FIXED - live deployment/verification pending
**Why:** Live sitemap child files previously exposed many first-party `http://` URLs, creating mixed protocol signals and blocking a clean URL migration project.
**Actions:**
1. DONE: WordPress core sitemap entries still normalize first-party `loc` values to HTTPS.
2. DONE: added Yoast sitemap URL/entry filters for first-party HTTPS normalization.
3. DONE: added Rank Math sitemap URL/index/entry filters for first-party HTTPS normalization.
4. DONE: added AIOSEO sitemap index normalization for first-party HTTPS URLs.
5. VERIFIED: official plugin documentation was checked for the sitemap hooks before implementation.
6. VERIFIED: PHP lint passed for 127 files and `git diff --check` passed.
7. NEXT: pull/deploy marker `2026-05-11-sitemap-https-plugin-filters-v1`, clear sitemap/plugin cache if needed, then recheck `page-sitemap.xml`, `articles-sitemap1.xml`, `articles-sitemap2.xml`, and `practice-areas-sitemap.xml` for `http://jus-tice.co.il` locs.
8. NOT LIVE VERIFIED: no public deployment yet.

### ACTION-BRANDING-MANIFEST-001: Add stable mobile/search-branding manifest
**Status:** CODE FIXED - live deployment/verification pending
**Why:** Browser tabs, mobile bookmarks and search branding need stable, crawlable brand assets without depending on a database-side Site Icon update.
**Actions:**
1. DONE: added `assets/images/site.webmanifest` using the existing 192x192 and 512x512 Jus-Tice icon assets.
2. DONE: `inc/seo.php` outputs the manifest link only when WordPress has no Site Icon, matching the safe favicon fallback behavior.
3. VERIFIED: local icon dimensions include 16, 32, 48, 180, 192 and 512 square PNG assets; full logo source is 1781x1654.
4. VERIFIED: PHP lint passed for 127 files, manifest JSON validated, and `git diff --check` passed.
5. VERIFIED LIVE PARTIAL: current public source already has a RealFaviconGenerator manifest under `/wp-content/uploads/fbrfg/site.webmanifest`.
6. NEXT: pull/deploy marker `2026-05-11-branding-manifest-v1`, then verify the theme fallback manifest is suppressed while WordPress Site Icon exists, and appears only if the admin icon stack is absent.
7. NOT LIVE VERIFIED: no public deployment yet.

### ACTION-LAWYER-DIRECTORY-QUERY-001: Keep public lawyer archive counts/pagination approval-safe
**Status:** CODE FIXED - live deployment/verification pending
**Why:** The archive should not let seed/demo/unapproved lawyer records distort result counts, pagination or empty-directory states after the public approval gates are applied.
**Actions:**
1. DONE: candidate lawyer IDs are scanned through `justice_theme_lawyer_profile_is_public_approved()` before the visible archive query.
2. DONE: the visible archive query is limited to approved IDs and fails closed when no public-approved profiles exist.
3. DONE: result count now uses the approved query total instead of counting only the current page after PHP-side filtering.
4. VERIFIED: PHP lint passed for 127 files and `git diff --check` passed.
5. NEXT: pull/deploy marker `2026-05-11-lawyer-directory-approved-query-v1`, then verify `/lawyers/` and key filtered directory URLs on desktop/mobile.
6. NOT LIVE VERIFIED: no public deployment yet.

### ACTION-MAYA-TRUST-SAFETY-001: Require real approval signals for Maya public display
**Status:** CODE FIXED - live deployment/verification pending
**Why:** Maya Rotenberg is the mini-site prototype, but she must not be public-approved solely because a seed/demo profile uses her name or slug.
**Actions:**
1. DONE: seed/demo metadata is now checked before Maya can pass public approval.
2. DONE: Maya name/slug fallback now requires normal approval/source signals or explicit opt-in filter `justice_theme_allow_maya_name_public_profile_fallback`.
3. VERIFIED: Maya can still display when the profile has approved/verified/source-backed metadata, but seed/demo records cannot pass by name alone.
4. NEXT: pull/deploy marker `2026-05-11-maya-public-approval-hardening-v1`, then verify homepage featured-lawyer section and Maya profile behavior after the current live data state is known.
5. NOT LIVE VERIFIED: no public deployment yet.

### ACTION-LEGALTOOLS-SEED-SAFETY-001: Keep LegalTech tool-page seeding opt-in
**Status:** CODE FIXED - live deployment/verification pending
**Why:** LegalTech tools can be valuable product/SEO assets, but draft/product pages should not be published silently by admin-init before strategy, content, pricing, funnel and legal-review decisions are approved.
**Actions:**
1. DONE: `justice-core` LegalTech tool seeding requires `justice_core_enable_legal_tools_seed`.
2. DONE: `ultra-justice-engine` LegalTech tool seeding requires `ultra_justice_engine_enable_legal_tools_seed`.
3. DONE: `ultra-justice` LegalTech tool seeding requires `ultra_justice_enable_legal_tools_seed`.
4. VERIFIED: public LegalTech request submission handler remains unchanged; only automatic tool-page creation is gated.
5. NEXT: pull/deploy marker `2026-05-11-legal-tools-seed-gate-v1`, then verify existing LegalTech pages/request forms still render as expected and no admin load creates new tool pages unless explicitly enabled.
6. NOT LIVE VERIFIED: no public deployment yet.

### ACTION-LAWYER-PERFORMANCE-SAFETY-001: Keep profile view tracking opt-in
**Status:** CODE FIXED - live deployment/verification pending
**Why:** Profile analytics are useful later, but public lawyer mini-site page loads should not write metadata/transients by default while the directory is still being cleaned and URL/content migration is controlled.
**Actions:**
1. DONE: single lawyer profile view tracking now requires `justice_theme_enable_lawyer_profile_view_tracking`.
2. DONE: existing public approval gate, contact safety gate, article links and profile rendering remain unchanged.
3. VERIFIED: default request path no longer increments `profile_views` or creates the visitor throttle transient unless owner enables the filter.
4. NEXT: pull/deploy marker `2026-05-11-lawyer-profile-view-tracking-gate-v1`, then verify a lawyer profile renders normally and profile view writes remain disabled unless intentionally enabled.
5. NOT LIVE VERIFIED: no public deployment yet.

### ACTION-DEMO-LAWYER-SEED-SAFETY-001: Keep legacy demo lawyer seeders opt-in
**Status:** CODE FIXED - live deployment/verification pending
**Why:** The audit found public risk around seed/demo lawyers. Legacy seeding helpers must not recreate placeholder lawyer profiles, fake contact routes or Maya slug changes during ordinary wp-admin/REST use.
**Actions:**
1. DONE: `justice-core` admin-init demo lawyer seeding requires `justice_core_enable_demo_lawyer_auto_seed`.
2. DONE: `ultra-justice-engine` admin-init demo lawyer seeding requires `ultra_justice_engine_enable_demo_lawyer_auto_seed`.
3. DONE: `ultra-justice` admin-init demo lawyer seeding requires `ultra_justice_enable_demo_lawyer_auto_seed`.
4. DONE: `/seed-lawyers` and `/seed-reset` REST routes in all three copies require separate explicit opt-in filters in addition to admin capability.
5. VERIFIED: no default seed path can create/reset/import demo lawyer profiles without owner-approved filters.
6. NEXT: pull/deploy marker `2026-05-11-demo-lawyer-seed-gates-v1`, then verify live source marker and keep any real lawyer imports in the approved data/import workflow.
7. NOT LIVE VERIFIED: no public deployment yet.

### ACTION-REST-SAFETY-001: Keep REST write/deploy helper routes opt-in
**Status:** CODE FIXED - live deployment/verification pending
**Why:** REST inspection helps the audit, but REST writes and theme-file write helpers must not mutate content or code unless explicitly enabled.
**Actions:**
1. DONE: content REST write routes for `update-meta` and `trash-post` now require `uje_enable_rest_content_writes` or `uj_enable_rest_content_writes`.
2. DONE: legacy agent bridge routes now require `uje_enable_agent_bridge_rest` or `uj_enable_agent_bridge_rest`.
3. DONE: agent bridge theme file writes also require `uje_enable_agent_bridge_file_write` or `uj_enable_agent_bridge_file_write`.
4. VERIFIED: read-only audit/report routes remain admin-only and unchanged.
5. NEXT: pull/deploy marker `2026-05-11-rest-write-gates-v1`, then verify unauthenticated/public REST cannot access these tools and admin writes remain disabled unless opted in.
6. NOT LIVE VERIFIED: no public deployment yet.

### ACTION-ADMIN-SEED-SAFETY-001: Prevent automatic draft/page/term seeding during audit
**Status:** CODE FIXED - live deployment/verification pending
**Why:** The current mode is inventory, mapping and controlled approval. Opening wp-admin should not silently create draft pages, article drafts, taxonomy terms or lawyer funnel pages.
**Actions:**
1. DONE: added shared `justice_theme_admin_cms_write_enabled()` helper.
2. DONE: taxonomy practice/city seeding requires `justice_theme_enable_core_practice_terms_seed` / `justice_theme_enable_core_city_terms_seed`.
3. DONE: pillar page, pillar article and city/practice draft seeders require explicit opt-in filters.
4. DONE: lawyer registration, dashboard and plans page seeders require explicit opt-in filters.
5. VERIFIED: existing public fallback links and user-submitted workflows are unchanged.
6. NEXT: pull/deploy marker `2026-05-11-admin-seed-write-guard-v1`, then confirm wp-admin load does not create unapproved seed content.
7. NOT LIVE VERIFIED: no public deployment yet.

### ACTION-MENU-SAFETY-001: Keep permanent WordPress menu writes controlled
**Status:** CODE FIXED - live deployment/verification pending
**Why:** Menus define the public SEO/design hierarchy. During the content architecture project, a theme pull or public page request must not silently create or repair WordPress menu items.
**Actions:**
1. DONE: primary menu seeding moved off public `init` and now requires explicit opt-in filter `justice_theme_enable_primary_menu_seed`.
2. DONE: seeded-menu area URL repair now requires explicit opt-in filter `justice_theme_enable_seeded_menu_area_url_repair`.
3. VERIFIED: render-time public fallback links remain available, so frontend navigation can still expose core legal-portal links without writing CMS data.
4. NEXT: pull/deploy marker `2026-05-11-menu-cms-write-guard-v1`, then verify public menu still renders and no automatic menu write is needed.
5. NOT LIVE VERIFIED: no public deployment yet.

### ACTION-PUBLICATION-SAFETY-002: Keep family-law public cleanup render-only unless approved
**Status:** CODE FIXED - live deployment/verification pending
**Why:** Public pages must not expose internal notes, but the current content architecture project also says no silent CMS rewrites before inventory, GSC, URL migration and owner approval.
**Actions:**
1. DONE: family-law runtime guard still cleans visitor output when internal markers are detected.
2. DONE: runtime guard persistence now requires explicit opt-in filter `justice_theme_enable_family_cluster_runtime_guard_persistence`.
3. DONE: automatic editorial repair now requires explicit opt-in filter `justice_theme_enable_family_cluster_editorial_repair`.
4. DONE: automatic internal-notes draft sync now requires explicit opt-in filter `justice_theme_enable_family_cluster_internal_notes_sync`.
5. DONE: quarantine and auto-publication also use explicit opt-in filters before they can write live CMS data.
6. VERIFIED: no content bodies, URLs, redirects, wp-admin settings, sitemap, taxonomy, lawyer, lead/CRM or review records were changed by this repo patch.
7. NEXT: pull/deploy marker `2026-05-11-family-cluster-render-only-guard-v1`, then inspect one affected family-law URL for clean public rendering while confirming no automatic CMS write was required.
8. NOT LIVE VERIFIED: no public deployment yet.

### ACTION-URL-MIGRATION-SAFETY-001: Keep Maya slug/profile changes controlled
**Status:** CODE FIXED - live deployment/verification pending
**Why:** The current URL migration rule says "map first, approve, then migrate"; theme pulls must not silently change lawyer slugs or profile CMS fields.
**Actions:**
1. DONE: automatic Maya Rotenberg slug migration now requires explicit opt-in filter `justice_theme_enable_maya_slug_migration`.
2. DONE: automatic Maya mini-site field bootstrap now requires explicit opt-in filter `justice_theme_enable_maya_minisite_bootstrap`.
3. DONE: automatic Maya public-source metadata bootstrap now requires explicit opt-in filter `justice_theme_enable_maya_public_sources_bootstrap`.
4. VERIFIED: no URLs, redirects, lawyer records, profile fields, database rows or wp-admin settings were changed by this repo patch.
5. NEXT: pull/deploy marker `2026-05-11-controlled-maya-migration-guard-v1`, then confirm public source marker and keep Maya slug/profile changes on the approved migration map.
6. NOT LIVE VERIFIED: no public deployment yet.

### ACTION-DEPLOY-001: Make Codex-operated uPress pulls reliable
**Status:** PLAN CREATED - access still blocked unless session is authenticated
**Why:** Owner wants Codex to pull Git through uPress without manual intervention every time.
**Actions:**
1. DONE: created `project-control/deployment-access-plan.md`.
2. LIVE VERIFIED: owner-triggered uPress pull deployed marker `2026-05-11-mobile-inner-qa-v1`.
3. BLOCKED: direct uPress file-manager URL still opens the login screen in this Codex browser session.
4. RECOMMENDED SHORT TERM: owner logs into uPress once in the Codex browser with remember-me, then Codex can use the right-panel Git pull button.
5. RECOMMENDED DURABLE: request SSH/WP-CLI deployment access if uPress plan supports it.
6. FUTURE: secured deploy webhook only after explicit approval and security review; do not add a public `pull.php`.
7. RECHECKED 2026-05-11: controlled autonomous login attempt is still BLOCKED by browser form-fill limitations/security policy; do not bypass this with unsafe workarounds.

### ACTION-LAWYER-TRUST-001: Safe lawyer trust signals, contact routes and homepage feature
**Status:** CODE FIXED V3 - live deployment/verification pending
**Why:** Lawyer pages and homepage modules must not show fake ratings/testimonials/sponsorship/contact/verification signals, and profile view tracking should not write to the database on every page load.
**Actions:**
1. DONE: lawyer cards only show rating numbers when `review_display_enabled` is explicitly approved and rating/count data exists.
2. DONE: lawyer mini-sites only show rating summaries and testimonials when review display is explicitly approved.
3. DONE: sponsored profile label now requires an active subscription and is suppressed for seed-like profiles.
4. DONE: anonymous profile views are throttled with a one-day hashed visitor transient.
5. DONE: lawyer card/profile phone and WhatsApp links now suppress obvious placeholder/demo numbers before public display.
6. DONE: Attorney schema now uses the same safe public phone value.
7. DONE: homepage featured-lawyer module now renders only public-approved lawyer profiles and uses neutral section-level wording.
8. VERIFIED: PHP syntax passed for changed files.
9. NEXT: pull/deploy marker `2026-05-11-featured-lawyer-trust-v1`, then verify homepage, Maya profile and lawyer archive do not show unapproved review/rating/verification claims or fake contact routes.
10. NOT LIVE VERIFIED: no public deployment yet.

### ACTION-I18N-001: Remove English labels from public Hebrew surfaces
**Status:** CODE FIXED - live deployment/verification pending
**Latest V2:** CODE FIXED - public search cards now use a theme-side Hebrew label map; live deployment/verification pending.
**Why:** Hebrew visitors should not see English `Article`, `Articles`, `Practice Areas`, `Previous`, `Next`, or similar system labels on search/archive/404 pages.
**Actions:**
1. VERIFIED IN CODE: `404.php` body and CTA are Hebrew.
2. VERIFIED IN CODE: `search.php` H1 and pagination labels are Hebrew.
3. DONE: `articles` CPT labels are Hebrew in both plugin trees, preventing `Article` from leaking in search result cards.
4. DONE: `practice-areas` taxonomy labels are Hebrew in both plugin trees.
5. NEXT: pull/deploy marker `2026-05-11-hebrew-cpt-labels-v1`, then verify `/ ?s=גירושין` or a similar public search page does not show English content-type labels.
6. NOT LIVE VERIFIED: no public deployment yet.

7. DONE V2: search result cards now use `justice_theme_public_post_type_label()` so public cards remain Hebrew even if a legacy plugin label is English.
8. NEXT V2: pull/deploy marker `2026-05-11-public-label-map-v1`, then verify a public search page does not show English content-type labels.

### ACTION-UX-003: Search and 404 premium state polish
**Status:** CODE FIXED - live visual verification pending
**Why:** Public search, no-results, and 404 pages are customer-facing legal-portal states and should not look like plain browser/default WordPress output.
**Actions:**
1. DONE: shared legal search form now has premium responsive styling, focus states, and mobile stacking.
2. DONE: search header now visually highlights the query and keeps long Hebrew/English terms from breaking layout.
3. DONE: no-results content now renders as a clear card with consistent spacing.
4. DONE: 404 template no longer relies on inline styles; the panel and CTA use reusable theme classes.
5. VERIFIED: changed PHP file passed syntax check; CSS diff passed whitespace/conflict checks.
6. DONE: forced homepage-fallback 404 responses now emit a `X-Justice-Route-Guard` verification header and `X-Robots-Tag: noindex, nofollow`.
7. NEXT: pull/deploy marker `2026-05-11-forced-404-header-signal-v1`, then verify public search, no-results, and a true 404 on desktop/mobile.
8. NOT LIVE VERIFIED: no public deployment yet.

### ACTION-UX-004: Breadcrumb Premium Polish
**Status:** CODE FIXED - live visual verification pending
**Why:** Breadcrumbs are visible on customer-facing article, archive, lawyer, practice, search and 404 pages, and weak breadcrumbs reduce trust/navigation clarity.
**Actions:**
1. DONE: breadcrumb markup now includes stable home/current item classes and text wrappers.
2. DONE: breadcrumb band now uses premium compact styling, pill links, current-page emphasis, subtle accent line and mobile horizontal scrolling.
3. DONE: RTL separator behavior was updated for the new visual separator.
4. VERIFIED: PHP lint passed for 127 files and `git diff --check` passed.
5. NEXT: pull/deploy marker `2026-05-11-breadcrumb-polish-v1`, then visually check breadcrumbs on article, articles archive, lawyers archive, practice, search and 404 pages.
6. NOT LIVE VERIFIED: no public deployment yet.

### ACTION-HOMEPAGE-SEO-004: Expand homepage legal hub coverage
**Status:** CODE FIXED - live deployment/verification pending
**Why:** The homepage must support broad legal-portal relevance with visible entry points to all major lawyer-topic hubs, not only a subset of categories.
**Actions:**
1. DONE: featured pillar cards now include `עורך דין רשלנות רפואית` and `עורך דין נזיקין`.
2. DONE: topic clusters now include `רשלנות רפואית`, `נזיקין ותאונות`, `דיני עבודה`, and `ירושה וצוואות`.
3. DONE: new links use safe published-page checks and fall back to lawyer-directory/topic URLs when a clean English pillar slug is not live yet.
4. VERIFIED IN CODE: no URLs were migrated, redirected, deleted or published as new content.
5. NEXT: pull/deploy marker `2026-05-11-homepage-hub-coverage-v1`, then verify homepage desktop/mobile DOM includes the broad hub links.
6. NOT LIVE VERIFIED: no public deployment yet.

### ACTION-DIRECTORY-004: Normalize lawyer-directory filter aliases
**Status:** CODE FIXED - live deployment/verification pending
**Why:** Header/homepage/menu filter links must not land on empty directory states just because public clean slugs differ from legacy seeded taxonomy slugs.
**Actions:**
1. DONE: `personal-injury-law` now queries the existing `torts` taxonomy term.
2. DONE: `medical-malpractice-law` now queries the existing `medical-malpractice` taxonomy term.
3. DONE: `employment-law`, `employment` and `labor` normalize to `labor-law`.
4. DONE: dropdown labels are normalized for visitor-facing Hebrew labels.
5. NEXT: pull/deploy marker `2026-05-11-lawyer-filter-slug-alias-v1`, then verify `/lawyers/?area=personal-injury-law`, `/lawyers/?area=medical-malpractice-law`, and `/lawyers/?area=labor-law`.
6. NOT LIVE VERIFIED: no public deployment yet.

### ACTION-LEADS-004: Normalize lead legal-area vocabulary
**Status:** CODE FIXED - live lead test pending
**Why:** Lead intake, CRM, content clusters and lawyer-directory filters should use one legal-area vocabulary instead of mixed values like `damages`, `torts`, `medical_malpractice`, and `real_estate`.
**Actions:**
1. DONE: homepage ask-lawyer form now submits clean area slugs.
2. DONE: shared lead form now submits clean area slugs.
3. DONE: classifier normalizes legacy aliases and Hebrew `אחר` into canonical legal-area values.
4. DONE: existing non-canonical lead area values are normalized on lead save/classification.
5. DONE: CRM area column displays Hebrew labels when possible.
6. NEXT: pull/deploy marker `2026-05-11-lead-area-normalization-v1`, then submit one controlled lead with area `רשלנות רפואית` or `נזיקין ותאונות` and verify CRM metadata.
7. NOT LIVE VERIFIED: no public deployment/test lead yet.

### ACTION-NAV-004: Normalize legal-area navigation fallbacks
**Status:** CODE FIXED - live deployment/verification pending
**Why:** Header, footer and menu links must support the same canonical directory filters as the homepage/content-cluster strategy, otherwise users can land on stale paths or empty filtered states.
**Actions:**
1. DONE: header topic-strip fallbacks for personal injury/damages and inheritance now route to `/lawyers/?area=personal-injury-law` and `/lawyers/?area=inheritance-law`.
2. DONE: homepage inheritance pillar fallback now routes to `/lawyers/?area=inheritance-law` until the clean pillar page is published.
3. DONE: footer specialization links now include medical malpractice, employment, traffic and inheritance in addition to the existing major fields.
4. DONE: menu repair logic normalizes additional stale aliases for medical malpractice, employment and privacy/cyber filters.
5. DONE: lawyer-directory filter parsing now accepts extra public aliases for medical malpractice, privacy/cyber and tax filters, with privacy/cyber querying the existing `cyber-law` taxonomy slug.
6. NEXT: pull/deploy marker `2026-05-11-nav-area-fallback-normalization-v1`, then verify header/footer/menu links and filtered directory pages on desktop/mobile.
7. NOT LIVE VERIFIED: no public deployment yet.

### ACTION-BRAND-001: Logo + Favicon + Search Branding
**Status:** PARTIAL LIVE VERIFIED - wp-admin/search-result verification pending
**Why:** Browser tabs, mobile bookmarks and Google search results need a stable, professional icon and final brand state.
**Actions:**
1. DONE: Inspected owner-provided old logo asset.
2. DONE: Replaced dummy repo `assets/images/logo.png` with the provided Jus-Tice logo source.
3. DONE: Generated square favicon/app icon fallback assets in 16, 32, 48, 180, 192 and 512 sizes plus ICO.
4. DONE: Updated SVG favicon and theme fallback tags while preserving WordPress Site Icon priority.
5. DONE: Added `project-control/favicon-logo-task.md`.
6. VERIFIED: live currently outputs favicon tags and sampled live icon URLs return HTTP 200.
7. DONE: owner/uPress pull verified; public source now shows marker `2026-05-10-branding-v1`.
8. DONE: theme fallback icon assets return HTTP 200.
9. DONE: desktop/mobile screenshots captured after deployment.
10. VERIFIED: WordPress/media/plugin favicon tags are still active, so fallback tags are correctly suppressed while WordPress Site Icon exists.
11. NEXT: verify wp-admin Site Icon selected media item and clean up duplicate icon/plugin outputs if owner approves.
12. NOT VERIFIED: final browser tab/mobile bookmark appearance and Google search-result favicon refresh.

### ACTION-UX-002: Third-Party Mobile Chat Bubble Collision
**Status:** CODE FIXED - live deployment/visual verification pending
**Why:** Post-pull mobile screenshot shows the green third-party chat/lead bubble still covering lower hero cards even after the theme WhatsApp float was improved.
**Actions:**
1. DONE: confirmed in `homepage-branding-post-pull-mobile-2026-05-10.png`.
2. DONE: live DOM inspection identified the overlay as `a.whatsapp-button`, a fixed 255px-wide WhatsApp lead banner, not an iframe.
3. CODE FIXED: `assets/css/premium-pass-3.css` now compacts that injected mobile banner into a 54px circular WhatsApp icon and hides the extra logo/text.
4. VISUAL VERIFIED BY LIVE CSS SIMULATION: `mobile-chat-widget-css-test-final-2026-05-10.png` shows the compact state on the live mobile page after injecting the exact CSS.
5. NEXT: owner/uPress pull, clear cache, then capture fresh live mobile homepage/article/directory screenshots.
6. NOT LIVE VERIFIED: deployed public CSS still needs post-pull verification.

### ACTION-CONTENT-001: Semantic Related Articles
**Status:** CODE FIXED V3 - metadata batch prepared / deployment and live QA pending
**Why:** Related articles should support the reader's next legal step and the SEO cluster, not show random latest or unrelated legacy posts.
**Actions:**
1. DONE: replaced single-article related selection with manual URLs, same `content_cluster`, then same `practice-areas`.
2. DONE: removed broad legacy `post` fallback from related article cards.
3. DONE: added relevant practice-area fallback when no semantic card exists.
4. VERIFIED: PHP lint passed for 127 PHP files.
5. LIVE VERIFIED: representative live article pages now expose `data-related-mode="semantic"` and no public unsafe internal markers in the sampled body.
6. PARTIAL QUALITY: general/criminal samples still surface off-intent cards (`ai-for-law-firms`, `business-license`, `australia-lawyers`), and the real-estate sample includes a weak Cyprus pricing match.
7. CODE FIXED: internal article review/status blocks are now editor-only so public visitors do not see internal QA/source-audit status when meta fields exist.
8. CODE FIXED V2: taxonomy fallback now applies an inferred cluster gate so broad/shared practice terms cannot pull obviously off-topic cards.
9. DONE: created `project-control/related-content-cms-update-batch-001.csv` with concrete `content_cluster`, `parent_pillar_url`, and `manual_related_urls` values for four sampled priority pages.
10. DONE V3: manual related URL metadata now accepts comma/newline/pipe/semicolon separators, matching messy real CMS entry patterns.
11. DONE V3: related sections and cards expose safe QA attributes for source cluster, card cluster and cluster-match state.
12. NEXT: deploy/pull marker `2026-05-11-related-content-qa-attrs-v1`, then repeat live QA on general, criminal, family and real-estate article samples.
13. NEXT: with owner approval and wp-admin/REST write access, apply metadata batch 001.
14. NOT LIVE VERIFIED AFTER V3: requires uPress pull/cache clear and article-page DOM/source check for the new QA attributes.

### ACTION-SEO-001: Open GSC Indexing Drilldowns
**Status:** COMPLETED - first sample pass
**Why:** GSC shows 1.58K not indexed pages, including 785 crawled-currently-not-indexed and 38 duplicate canonical issues. We need example URLs before content/URL decisions.
**Actions:**
1. DONE: Opened GSC Page indexing examples for "Crawled - currently not indexed".
2. DONE: Opened examples for "Duplicate without user-selected canonical".
3. DONE: Opened examples for "Page with redirect".
4. DONE: Opened examples for "Alternate page with proper canonical tag" and "Not found (404)".
5. DONE: Recorded examples in `project-control/gsc-indexing-review.csv`.
6. DONE: classified sampled examples into media URL, legacy CPT, taxonomy/archive, redirect source, weak content, content candidate and technical issue in `project-control/gsc-indexing-example-classification.csv`.
7. DONE: created a no-URL-change remediation batch from the classified examples: media policy, legacy CPT comparison, and `/divorce-mediation-basics` merge review.
8. NEXT: prepare the first no-URL-change homepage + directory SEO batch from GSC evidence and live visual QA.

### ACTION-SEO-002: Verify Sitemap And HTTPS Migration Blockers
**Status:** PARTIAL - public endpoint verification completed; wp-admin/uPress settings still blocked
**Why:** Public sitemap URLs appear to return homepage-like HTML, and GSC reports 412 Non-HTTPS URLs. This can break a future URL migration.
**Actions:**
1. BLOCKED: Verify active sitemap generator in wp-admin/server.
2. DONE: Confirmed `sitemap_index.xml` is the active valid XML sitemap index.
3. DONE: Confirmed default `/sitemap.xml`, `/wp-sitemap.xml`, and `/post-sitemap.xml` redirect to the homepage, not XML.
4. DONE: Confirmed live child sitemaps contain many `http://` locs, matching the GSC Non-HTTPS risk.
5. DONE: Created `project-control/sitemap-live-verification.csv`.
6. CODE FIXED: theme-emitted first-party canonical, hreflang and Open Graph URLs now normalize to HTTPS.
7. CODE FIXED: common SEO-plugin canonical/Open Graph filters and WordPress core sitemap entries use the same first-party HTTPS normalization helper.
8. CODE FIXED: public frontend first-party links generated by WordPress URL helpers now normalize to HTTPS for home, post/page/CPT, taxonomy and attachment URLs.
9. PARTIAL ONLY: active plugin sitemap settings remain blocked because live child sitemaps previously exposed many `http://` locs outside the theme output path.
10. NEXT: pull/deploy marker `2026-05-11-public-link-https-normalization-v1`, then source-check homepage/article/practice/lawyer pages and recheck active sitemap children.
11. NEXT: inspect GSC Non-HTTPS examples and wp-admin sitemap/SEO plugin settings when access is available.
12. UPDATED: `project-control/sitemap-strategy.md` and `project-control/robots-htaccess-review.md`.

### ACTION-SEO-003: No-URL-Change Homepage + Directory SEO Batch
**Status:** CODE FIXED - live deployment/visual verification pending
**Why:** GSC shows broad `עורך דין` / `עורכי דין` intent is scattered. This can be improved before URL migration.
**Actions:**
1. DONE: Exported current homepage and `/lawyers/` title/H1/meta into `project-control/seo-title-h1-review.csv`.
2. DONE: Created batch evidence at `project-control/homepage-directory-seo-batch-001.md` and `.csv`.
3. DONE: Code-fixed homepage/header/topic-cluster links so planned pillar URLs are used only when published; otherwise they fall back to working hubs/directory filters.
4. DONE: Updated `project-control/internal-link-map.csv` with homepage-to-pillar link intent rows.
5. VERIFIED: no slugs or redirects were changed in this batch.
6. NEXT: deploy/pull latest code, clear cache, then visually verify homepage topic strip and `/lawyers/` title output.

### ACTION-SEO-004: Post-Deploy Homepage + Directory Verification
**Status:** PARTIAL LIVE VERIFIED - follow-up code fix pending deploy
**Why:** Code is fixed locally, but live site still needs deployment/cache refresh before the customer-facing links and titles can be called verified.
**Actions:**
1. DONE: Rechecked homepage rendered topic strip links in public HTML.
2. DONE: Rechecked homepage and `/lawyers/` title/H1/meta; both title fixes are live.
3. DONE: Captured homepage and `/lawyers/` desktop/mobile screenshots after owner Upress pull.
4. PARTIAL: Most topic links are safe, but traffic still fell back to `/traffic-law/` and LegalTech/AI links redirected home.
5. CODE FIXED: traffic fallback changed to `/lawyers/?area=traffic-law`; LegalTech/AI fallback changed to `/#ask-lawyer`.
6. NEXT: commit/push follow-up, owner pulls latest, then recheck rendered topic-strip and LegalTech links.

### ACTION-SEO-005: Verify Follow-Up Topic/LegalTech Fallbacks
**Status:** LIVE VERIFIED
**Why:** The live pull fixed titles and most links, but the latest fallback patch must be verified after another pull.
**Actions:**
1. DONE: Rechecked rendered topic-strip traffic link; it now uses `/lawyers/?area=traffic-law`.
2. DONE: Rechecked rendered AI intake link; it now uses `/#ask-lawyer`.
3. DONE: Rechecked public homepage form destination and enriched fields.
4. DONE: Updated visual QA and customer-facing QA.

### ACTION-LEADS-001: Verify Enriched Ask-Lawyer Intake Form
**Status:** LIVE VERIFIED - controlled CRM test pending
**Why:** LegalTech/AI fallback now points users to the homepage lead form when tool pages are not published, so the form must capture enough context to route the lead.
**Actions:**
1. DONE: Live-checked current form wiring; it posts to `admin-post.php` and includes spam/attribution fields.
2. DONE: Code-fixed the homepage form to ask for legal area, city/region, email and urgency.
3. DONE: Code-fixed homepage/directory source keyword fallback to neutral portal/directory language.
4. VERIFIED: PHP lint passed locally for 127 PHP files.
5. DONE: Live rechecked `/#ask-lawyer`; the enriched fields are public and hidden general/normal values are gone.
6. NEXT: submit one controlled test lead only when wp-admin/CRM verification is available.

### ACTION-LEADS-002: Controlled Lead Submission Test
**Status:** NEXT - requires CRM/admin verification
**Why:** The public form is now live, but a real end-to-end lead must be checked in the admin CRM before the lead funnel is called operational.
**Actions:**
1. Submit a clearly marked test lead from `/#ask-lawyer`.
2. Confirm the lead appears in the CRM/admin list with source, area, city/region, urgency and test-note metadata.
3. Verify a `justice_lead` record is created.
4. Verify legal area, city, urgency, source keyword and consent are saved.
5. Verify no duplicate email/CRM side effects.
6. Delete or mark the test lead internally after verification.

### ACTION-UX-001: Mobile Floating Action Collision
**Status:** CODE FIXED - live verification pending
**Why:** Mobile screenshots show the accessibility launcher and floating WhatsApp/lead controls covering important first-viewport and lower-page content.
**Actions:**
1. DONE: Captured before screenshot at `project-control/visual-evidence/mobile-floating-actions-before-2026-05-10.png`.
2. DONE: Reduced and raised the theme WhatsApp float on mobile.
3. DONE: Added mobile bottom safe space so fixed controls do not sit directly on footer/form content.
4. DONE: Moved the Pojo accessibility toolbar away from the middle of the mobile hero and limited the open overlay height.
5. VERIFIED: `git diff --check` passed.
6. NEXT: owner/uPress pulls latest code, cache is cleared, then capture fresh mobile homepage/article/directory screenshots.
7. NOT LIVE VERIFIED: current public site still shows the pre-fix layout until deployment.

---

## CRITICAL — DO FIRST (BLOCKED UNTIL DONE)

### ACTION-001: Establish Live Site Access
**Status:** BLOCKED — no SSH/WP-CLI access in current session  
**Why:** Almost everything else requires ability to run WP-CLI commands or wp-admin access  
**Actions:**
1. Confirm SSH access to server
2. Confirm WP-CLI is installed: `wp --version`
3. Confirm wp-admin credentials work
4. Run: `wp option get template` — confirm active theme
5. Run: `wp plugin list` — confirm no duplicate plugins
6. Run: `wp post list --post_type=post --post_status=publish --format=count` — count spam

### ACTION-002: Stop Spam on Homepage
**Status:** COMPLETED
**Why:** Casino/gaming content destroys credibility and risks Google penalty
**Actions:**
1. Changed `latest-articles.php` query from `array('articles','post')` to `array('articles')` — SAFE, no data loss. Spam posts no longer render on the homepage.
2. Owner still needs to run WP-CLI spam audit to delete the actual spam posts from the database (see spam-investigation.md).

### ACTION-003: Verify/Fix Justice Core Plugin
**Status:** COMPLETED (Pending User Upload)
**Why:** Theme depends on plugin for CPTs/taxonomies. Without working plugin = 404 everywhere
**Actions:**
1. A clean, conflict-free plugin (`jus-tice-engine.zip`) has been generated in the root directory.
2. The user must upload and activate `jus-tice-engine.zip` via wp-admin to register CPTs (`justice_lawyer`, `articles`, `justice_lead`) and the REST API.

---

## HIGH PRIORITY (After CRITICAL is resolved)

### ACTION-004: Fix Hero Search Form
**Status:** COMPLETED in code - live verification pending
**File:** `template-parts/sections/hero.php`  
**Issue:** Form action points to `home_url('/')`, GET params `practice_area` and `city` don't filter lawyers  
**Fix:** Change form action to `get_post_type_archive_link('justice_lawyer')` and change param names to `area` and `city` (matching the archive template filter)

```php
// BEFORE:
<form action="<?php echo esc_url( home_url( '/' ) ); ?>">
<select name="practice_area">

// AFTER:
<form action="<?php echo esc_url( get_post_type_archive_link( 'justice_lawyer' ) ); ?>">
<select name="area">
```

### ACTION-005: Upload Professional Logo
**Repo status:** PARTIAL - bundled fallback logo is now wired in header/footer; live Customizer upload is still optional.
**Status:** Design task — needs SVG or PNG  
**File:** WP Customizer → Site Identity → Logo  
**Spec:** Max height 44px, white text/graphic (shows on dark navy header)

### ACTION-006: Create 10 Practice Area Taxonomy Terms
**Status:** COMPLETED in code - live seeding pending admin visit
**Implementation:** `inc/taxonomy-seed.php` creates/updates the 10 core terms on `/wp-admin/` load when `practice-areas` taxonomy exists.
**Command:**
```bash
wp term create practice-areas "דיני משפחה" --slug=family-law --description="ייעוץ וייצוג בתחום הגירושין, הילדים, הירושות ודיני המשפחה"
wp term create practice-areas "משפט פלילי" --slug=criminal-law --description="הגנה פלילית, ייצוג בחקירות ובבתי משפט"
wp term create practice-areas "דיני תעבורה" --slug=traffic-law --description="ביטול דוחות, עבירות נהיגה, תאונות דרכים"
wp term create practice-areas "מקרקעין ונדלן" --slug=real-estate-law --description="עסקאות נדל\"ן, רישום טאבו, ליקויי בנייה"
wp term create practice-areas "דיני עבודה" --slug=labor-law --description="זכויות עובדים, פיטורים, הסכמי עבודה"
wp term create practice-areas "ירושה וצוואות" --slug=inheritance --description="צוואות, ירושות, ניהול עיזבון"
wp term create practice-areas "נזיקין" --slug=torts --description="תאונות, נזקי גוף, פיצויים"
wp term create practice-areas "רשלנות רפואית" --slug=medical-malpractice --description="שגיאות רפואיות, פגיעות בלידה, תביעות כנגד קופות חולים"
wp term create practice-areas "ביטוח לאומי" --slug=national-insurance --description="קצבאות, ועדות רפואיות, ערעורים"
wp term create practice-areas "הגירה ואזרחות" --slug=immigration --description="אשרות, אזרחות, איחוד משפחות"
```

### ACTION-007: Create Seed Lawyer Profiles (10 draft profiles)
**Status:** COMPLETED in code - live seeding / cleanup pending admin verification
**Implementation:** Existing seeders in `justice-core/`, `ultra-justice-engine/`, and `ultra-justice/` create 10 draft `justice_lawyer` profiles. Safety was hardened so generated profiles remain unverified, inactive, not featured, not lead-routed, and marked as seed/testing data.
**Rules:** All profiles DRAFT/PRIVATE. Not "verified". Source documented. No false endorsement.  
**See:** `project-control/lawyer-seed.csv` template/data file.
**Still needed live:** verify active plugin path, visit `/wp-admin/` after Upress pull if seeding is desired, then draft/unpublish any existing public demo lawyers. Maya Rotenberg remains the only client intended for homepage featuring.

### ACTION-008: Publish 5 Pillar Articles
**Status:** PARTIAL in code - 5 draft article starters seed after admin visit; publishing still pending legal/editorial review
**Required for:** SEO foundation, homepage not showing empty state  
**Titles (minimum viable):**
1. "עורך דין גירושין — מדריך מלא לבחירה, עלויות, הליך"
2. "עורך דין פלילי — מה לדעת לפני שבוחרים"
3. "עורך דין תעבורה — ביטול דוחות, עבירות ותאונות"
4. "עורך דין מקרקעין — כל מה שצריך לדעת לפני עסקה"
5. "עורך דין דיני עבודה — מדריך לעובד ולמעסיק"

---

**Implementation:** `inc/pillar-article-seed.php` seeds draft-only `articles` records with English slugs, Hebrew starter text, practice-area assignment, pillar URL metadata, and `needs_legal_review = 1`.
**Still needed:** expand each draft to publication quality, add real sources, assign author/reviewer, verify no cannibalization with page pillars, then publish manually after review.

## MEDIUM PRIORITY

### ACTION-009: Install Yoast SEO / RankMath
**Status:** BLOCKED in repo-only mode - requires wp-admin plugin install decision and live activation
- Generates XML sitemap automatically
- Adds canonical tags to all pages
- Adds `og:image` for social sharing
- Do NOT install both

### ACTION-010: Configure Customizer Contact Info
**Status:** BLOCKED in repo-only mode - requires live Customizer/admin access
- Set `justice_phone` — appears in header CTA and footer
- Set `justice_email` — appears in footer
- Set `justice_whatsapp` — appears in float button and lawyer profiles

### ACTION-011: Connect Google Search Console
**Status:** BLOCKED - requires verified Google account/property access
- Verify domain ownership
- Submit sitemap: `https://jus-tice.co.il/sitemap_index.xml`
- Set preferred country: Israel

### ACTION-012: Fix i18n in archive-justice_lawyer.php
**Status:** COMPLETED in code
**File:** `archive-justice_lawyer.php`  
**Issue:** Filter labels use raw Hebrew strings not wrapped in `esc_html_e()`  
**Lines to fix:**
```php
// Line ~108:
<label for="filter-area">תחום משפטי</label>
// Should be:
<label for="filter-area"><?php esc_html_e( 'תחום משפטי', 'justice-theme' ); ?></label>
```

---

## LOW PRIORITY (Phase 2)

- ACTION-013: Build lawyer self-registration page — COMPLETED in theme; live verification pending
- ACTION-014: Build lawyer dashboard — PARTIAL: front-end dashboard MVP added; live verification and self-edit/payment modules still planned
- ACTION-015: Integrate WooCommerce for plan subscriptions — PARTIAL: plan page and product-ID mapping hooks added; live WooCommerce install/product setup still blocked
- ACTION-016: Build lead intake AI classification — PARTIAL: rule-based lead classifier added; external AI and lawyer matching still planned
- ACTION-017: Build GSC weekly report automation — PARTIAL: GitHub Action and report generator added; secrets/Search Console access still required
- ACTION-018: Build city taxonomy + city × practice area pages — PARTIAL: city seeder, draft page seeder and template added; live verification and content approval still needed

---

## WORKFLOW RULES

1. Read this file first every session
2. Pick the HIGHEST priority unblocked task
3. Update status in `task-board.csv`
4. Make the smallest useful change
5. Test it
6. Commit with clear message
7. Update `changelog.md`
8. Update status here
9. Pick next task

---

## 2026-05-09 CORRECTIONS FROM OWNER FEEDBACK

### LOGO
**Status:** FIXED IN REPO / LIVE NOT VERIFIED
- The visible fallback must not use `assets/images/logo.png` because that file is a dummy placeholder.
- Header and footer now render a Jus-Tice code wordmark with a blinking red dot when no WordPress custom logo is configured.
- If the old final logo exists in the media library, use it later through WordPress Site Identity; until then the code wordmark is the safer fallback.

### CONTENT DEPTH
**Status:** ACTIVE PRIORITY
- The current seeded article starters are scaffolds only.
- Production target is 5,000-word-class pillar/supporting articles, not short SEO pages.
- Each major article must be built from SERP reverse engineering: intent, competing page types, related questions, price/process/risk sections, internal links, related lawyer mini-site blocks, sources, author/reviewer, and legal disclaimer.
- First full production candidate: `/divorce-lawyer/` and the connected Maya Rotenberg mini-site/content cluster.
- Repo drafts can now be imported into the CMS from `Tools > Jus-Tice Content Drafts`. Imports are draft-only and require legal/editorial review before publication.

---

## 2026-05-10 INTEGRATED SEO / DESIGN / CONTENT WORKFLOW

**Status:** ACTIVE PRIORITY - planning added, no live execution yet

Next safe batch before any URL/content migration:
1. Review homepage SEO/design alignment against `project-control/homepage-seo-design-alignment.md`.
2. Review one article template and one lawyer profile for semantic related-content behavior.
3. Confirm mobile-first template risks in `project-control/mobile-first-template-review.md`.
4. Confirm accessibility risks in `project-control/accessibility-review.md`.
5. Use `project-control/related-content-map.csv` to drive the first semantic related-content implementation plan.
6. Use `project-control/integrated-launch-checklist.md` before approving any batch that touches content, design, URLs, sitemap or redirects.
7. Deploy/pull the title cleanup in `inc/seo.php`, then recheck `/articles/`, `/lawyers/` and search titles for Hebrew output.
8. Recheck the live 404/routing guard and sample lawyer profile route, because both still returned homepage-style content with status 200 in the integrated visual QA pass.

**Do not execute yet:** URL changes, redirects, content deletions, public rewrites, payments, index/noindex changes.

---

## 2026-05-10 LIVE VERIFIED UPDATES

**Status:** LIVE VERIFIED / PARTIAL

- Homepage mobile floating WhatsApp overlap is fixed live: the homepage hides floating WhatsApp controls on mobile, and the guided search form/CTAs remain clear.
- Semantic related-content code is live on the tested article: `/find-lawyer-how-to-find-good-attorney/` exposes `data-related-mode="semantic"`.
- Next UX check: run mobile screenshots on one article, `/articles/`, `/lawyers/`, and one practice page to confirm non-home floating controls do not cover important content.
- Next content check: manually review related cards on one family, one criminal and one real-estate article for semantic relevance.

---

## 2026-05-10 REVIEWS / REPUTATION MODULE NEXT ACTIONS

**Status:** STRATEGY CREATED / NOT IMPLEMENTED

- Review and approve `project-control/review-compliance-risk.md` before any public review/rating UI.
- For Maya Rotenberg, verify Google Business Profile and Place ID manually before showing any Google rating/count.
- Add only source-disclosed "Read reviews on Google" MVP fields first; do not add stars or AggregateRating schema yet.
- Decide whether first-party Jus-Tice reviews should be a pilot feature, and approve moderation/privacy policy first.
- Add review/reputation fields to the lawyer CMS only after owner/legal approval.

## 2026-05-11 REVIEWS / REPUTATION NEXT ACTIONS

**Status:** STRATEGY DEEPENED / IMPLEMENTATION BLOCKED UNTIL APPROVAL

1. Owner/legal review: approve review policy, no-incentive rule, moderation workflow, paid placement disclosure and lawyer-reply policy.
2. Product approval: confirm MVP is manual Google review link + verified rating/count + profile completeness, not public star widgets.
3. Maya prototype: verify Google Business Profile and Place ID before showing any Google review link or rating.
4. CMS planning: add fields from `lawyer-review-fields.csv` only after the policy gate is approved.
5. Schema gate: keep AggregateRating/Review schema blocked until visible real reviews, policy approval and Rich Results Test workflow exist.
6. Future implementation: build first-party `justice_review` only as private/moderated content, not public comments.

## 2026-05-11 INNER MOBILE QA NEXT ACTIONS

**Status:** CODE FIXED / LIVE DEPLOYMENT PENDING

1. Pull latest `main` in uPress and clear cache.
2. Verify public source marker `2026-05-11-mobile-inner-qa-v1`.
3. Re-run mobile screenshots for `/find-lawyer-how-to-find-good-attorney/`, `/articles/`, `/lawyers/`, and `/family-law/` without local CSS injection.
4. Confirm `/family-law/` has no horizontal overflow at 390px.
5. Confirm only one compact mobile WhatsApp/contact control is visible on non-home pages.
6. Confirm the accessibility launcher does not create horizontal scroll and does not cover critical CTAs.

## 2026-05-11 404 ROUTING PLUGIN NEXT ACTIONS

**Status:** SOURCE VERIFIED / CHECKLIST READY / OWNER APPROVAL NEEDED

1. Review `project-control/404-plugin-deactivation-checklist.md`.
2. Confirm owner approval to deactivate `All 404 Redirect to Homepage`.
3. Before changing plugin state, run `tools/check-404-routing.ps1` and preserve the blocked baseline.
4. Deactivate the plugin only; do not delete it, edit `.htaccess`, change permalinks, add redirect rules or change URL migration settings.
5. Rerun `tools/check-404-routing.ps1`.
6. Expected fixed state: fake generated URL and invalid `?p=99999999` return HTTP 404 with no homepage redirect.
7. Confirm homepage, `/articles/`, `/lawyers/`, `robots.txt`, and `sitemap_index.xml` still pass.
8. Capture desktop and mobile screenshots of the fixed Hebrew 404 page.
9. If valid pages break, reactivate the plugin and document the regression.

## 2026-05-11 LIVE PLUGIN ARCHITECTURE NEXT ACTIONS

**Status:** LIVE REST SURFACE VERIFIED / FILESYSTEM PATH VERIFIED / MIGRATION NOT APPROVED

1. Use `tools/check-live-plugin-surface.ps1` before plugin migration work.
2. Treat `ultra-justice-engine/v1` as the active live Justice REST namespace.
3. Do not activate `justice-core/` while `ultra-justice-engine/` is active because both use `UJE_*` constants and `uje_*` functions.
4. VERIFIED: uPress File Manager confirms `/wp-content/plugins/ultra-justice-engine/ultra-justice-engine.php` exists and `/wp-content/plugins/justice-core` is not present in the filtered live plugin filesystem view.
5. NEXT: compare active live plugin code version against repo `ultra-justice-engine/` before assuming LegalTech CPT parity.
6. Investigate why `justice_legal_tool` and `justice_legal_request` are not exposed in current public `wp/v2/types`.
7. Keep LegalTech public routes marked NOT VERIFIED LIVE until active plugin code version is confirmed.
8. Plan a controlled plugin migration only after backup, parity diff, permalink flush plan and owner approval.

## 2026-05-11 LIVE PUBLIC TEMPLATE QA NEXT ACTIONS

**Status:** LIVE VERIFIED / MONITOR

1. Continue using `tools/check-live-public-template-qa.ps1` after each public template pull to catch title leaks, homepage fallback regressions, related-content QA attribute regressions and filtered directory redirects.
2. Keep the URL migration rule intact: do not redirect or rename these filter URLs during title/template fixes.
3. Expand the script later with one family-law article, one criminal-law article and one real-estate article when selecting the next related-content QA batch.
4. Use `project-control/live-public-template-qa-2026-05-11-after-pull.csv` as the current VERIFIED baseline.

## 2026-05-11 RELATED CONTENT URL INFERENCE NEXT ACTIONS

**Status:** FIXED LIVE / TECHNICAL QA VERIFIED / EDITORIAL CLEANUP CONTINUES

1. DONE: pulled `40ee1c4` through uPress and verified public marker `2026-05-11-related-fallback-qa-v1`.
2. DONE: reran `tools/check-live-related-content-qa.ps1`.
3. VERIFIED: `project-control/live-related-content-qa-2026-05-11-after-fallback-attrs.csv` has all sampled rows marked `VERIFIED`.
4. VERIFIED: `general_lawyer_selection` now uses `related_mode=fallback` with `detected_source_cluster=lawyer_selection`.
5. VERIFIED: `criminal_drug_offenses` now uses `related_mode=semantic` with `detected_source_cluster=criminal_law` and matched cards.
6. DONE: pulled `4868db2` through uPress and verified public marker `2026-05-11-related-international-filter-v1`.
7. VERIFIED: `project-control/live-related-content-qa-2026-05-11-after-international-filter.csv` has all sampled rows marked `VERIFIED`.
8. FIXED LIVE: the Greece real-estate pricing card was removed from `/real-estate-lawyer-cost-2025/` related results by classifying foreign-market real-estate content as `international`.
9. NEXT: fix editorially weak but technically same-cluster recommendations through CMS metadata/manual related URLs, not through URL changes.
10. Keep global/latest unrelated fallback blocked for important legal articles.

## 2026-05-11 CONTENT INVENTORY / URL MIGRATION NEXT ACTIONS

**Status:** VERIFIED PUBLIC EXPORT REFRESHED / MANUAL DECISIONS STILL NEEDED

1. VERIFIED: refreshed public REST export has `1,220` public content rows and `1,707` internal-link rows.
2. VERIFIED: rebuilt `content-quality-audit.csv`, `url-migration-map.csv`, `redirect-map.csv`, `cannibalization-map.csv`, `category-map.csv`, `topic-clusters.csv`, and `internal-link-map.csv`.
3. BLOCKED: menu export remains `401` through public REST; use authenticated admin/export access later before final menu/internal-link decisions.
4. NOT VERIFIED: GSC traffic metrics are not merged into the refreshed inventory yet; do not treat redirect risk as approved.
5. NEXT: manually review the `129` target-slug-conflict rows before any English slug migration.
6. NEXT: review the `481` needs-editorial-slug-mapping rows and decide KEEP / MERGE / REWRITE / REDIRECT_LATER only after GSC and SERP review.
7. NEXT: correct heuristic pillar candidates for clusters where the current best-by-word-count URL is clearly not the strategic pillar, especially criminal law, real estate, personal injury, inheritance, employment and needs-classification.
8. NEXT: overlay GSC query/page evidence for major terms before approving pillar URLs or redirects.
9. NEXT: keep homepage, menus, breadcrumbs, related content, sitemap and mobile template decisions tied to the approved cluster map.
10. DO NOT EXECUTE YET: URL changes, redirects, noindex, deletions, public rewrites, canonical changes or sitemap inclusion changes.

## 2026-05-26 QUALIFIED LEAD BILLING NEXT ACTIONS

**Status:** OWNER-ONLY HANDOFF ADDED / LIVE PAYMENT PROOF STILL NEEDED

1. Use `wp-admin -> Justice CRM -> Qualified lead billing queue -> Copy invoice/request packet` for each ready-to-bill lead.
2. Before sending a payment request, confirm the routed lawyer accepted qualified-lead terms, the agreed per-lead fee and a billing contact.
3. After sending the manual invoice/payment request, save the invoice/payment reference on the lead and set billing status to `Invoice sent`.
4. Mark a lead `Paid` only after an invoice/reference or payment evidence URL exists in the CRM.
5. For the first Bituach Leumi controlled lead, keep the packet, invoice reference and payment proof together before scaling the funnel.
6. Do not claim realized lead revenue until a real paid lead is recorded.

## 2026-05-26 PROSPECT ACTIVATION NEXT ACTIONS

**Status:** OWNER-ONLY ACTIVATION HANDOFF ADDED / REAL SPECIALISTS STILL NEEDED

1. Open each ready Bituach Leumi prospect under `wp-admin -> Lawyer Onboarding -> Lawyer Prospects`.
2. Copy the `Routable specialist activation packet` from the Manual Outreach Kit.
3. Use it to create or connect a `justice_lawyer` profile only after all readiness checks are complete.
4. Keep public cards fact-gated until license, profile facts, photos, contact details and claims are source-reviewed.
5. Enable `lead_routing_enabled=1` and `subscription_status=trialing/active/paid` only after owner approval, accepted lead terms and billing contact are recorded.
6. After three active routable specialists exist, run one controlled Bituach Leumi lead through the public route and use the qualified-lead invoice packet.

## 2026-05-26 BTL ACTIVATION GAP NEXT ACTIONS

**Status:** PRIVATE GAP BOARD ADDED / REAL ACTIVATION STILL NEEDED

1. Open `wp-admin -> Justice CRM -> Bituach Leumi specialist supply -> Verified-to-routable activation gap`.
2. If verified prospects exist but active routable lawyers are below 3, use each prospect's activation packet before creating or connecting a lawyer profile.
3. Confirm the final profile is published, has practice area `national-insurance`, has `lead_routing_enabled=1`, and has `subscription_status=trialing`, `active` or `paid`.
4. Do not count draft/private lawyer profiles as routable coverage; the public lead router will not use them.
5. Keep `Won / onboarding` prospects visible until the matching routable profile exists.
6. Only after three active routable specialists exist, run the first controlled Bituach Leumi lead and document invoice/payment proof.

## 2026-05-26 BTL FIRST TEST PREFLIGHT NEXT ACTIONS

**Status:** PRIVATE PREFLIGHT ADDED / REAL FIRST PAID LEAD STILL NEEDED

1. Open `wp-admin -> Justice CRM -> Bituach Leumi specialist supply -> First paid-lead routing preflight`.
2. Confirm at least three router-eligible lawyers appear; this now means the live router can actually use them and their monthly cap is not exhausted.
3. For every listed lawyer, confirm remaining capacity, billing/contact email, accepted lead terms and no-promise compliance notes before submitting a controlled lead.
4. If the panel says `Do not run yet`, fix coverage, cap or billing/contact details before using the public intake route.
5. When the preflight turns green, run one consented controlled Bituach Leumi lead only, then verify the lead appears in the qualified lead billing queue.
6. Send the manual invoice/payment request and record invoice/payment proof before marking the lead Paid.

## 2026-05-26 WHATSAPP CLIENT LEAD BRIDGE NEXT ACTIONS

**Status:** PRIVATE INTAKE BRIDGE ADDED / REAL CLIENT ENTRY STILL NEEDS OWNER APPROVAL

1. Open `wp-admin -> Justice CRM -> Manual WhatsApp / client lead bridge`.
2. Paste the client details from WhatsApp, email or phone into the bridge instead of leaving them in Gmail/WhatsApp.
3. Choose the handoff path: paid lawyer router, supplier marketplace review, or both.
4. Confirm client consent before checking `Release to paid lawyer routing now`.
5. Keep `Prepare a paid handoff billing record` checked when a lawyer/supplier has accepted a paid lead-fee model.
6. If the lead routes, use `Qualified lead billing queue` to send/record the manual invoice/payment request.
7. If no paid routable lawyer exists, use the `Prospect` action from the lead table or the supplier pipeline buttons to recruit/register a paid coverage partner.
8. Do not mark the lead Paid until invoice/payment reference or payment evidence is recorded.

## 2026-05-11 CONTENT DECISION BATCH NEXT ACTIONS

**Status:** VERIFIED REVIEW FILES CREATED / EXECUTION BLOCKED UNTIL EVIDENCE

1. Use `project-control/slug-conflict-review.csv` as the first URL conflict queue.
2. Use `project-control/editorial-slug-mapping-review.csv` to classify the `481` pages that still need topic/slug decisions.
3. Use `project-control/cluster-pillar-review.csv` to correct heuristic pillar choices before migration.
4. FIRST GSC/SERP PASS: review `criminal-lawyer`, `divorce-lawyer`, `child-support`, `medical-malpractice-lawyer`, and `real-estate-lawyer`.
5. CONFIRM: whether `/criminal-lawyer/`, `/real-estate-lawyer/`, `/personal-injury-lawyer/`, `/employment-lawyer/`, `/inheritance-lawyer/`, and `/cyber-privacy-lawyer/` should be created, updated, merged into, or mapped to an existing old URL.
6. CONFIRM: whether exact clean URLs like `/child-support/`, `/child-custody/`, `/divorce-lawyer/`, `/divorce-mediation/`, `/divorce-property-division/`, `/medical-malpractice-lawyer/`, and `/traffic-lawyer/` should become primary URLs after GSC review.
7. BLOCKED: no redirects, no URL changes, no noindex, no deletion, no canonical/sitemap changes until owner approval.

## 2026-05-11 TARGETED GSC PASS 2 NEXT ACTIONS

**Status:** VERIFIED / REVIEW ONLY

1. DONE: second targeted browser pass checked `מזונות משותפת`, `הפחתת מזונות`, `שינוי מזונות`, `הלכת המזונות החדשה`, `בע"מ 919/15`, `משמורת בלעדית לאם`, `חקירה במשטרה`, `עבירות סמים`, and `נהיגה בשכרות`.
2. VERIFIED: pass 2 is documented in `project-control/gsc-targeted-query-pass-2-2026-05-11.csv` and `project-control/gsc-targeted-query-pass-2-2026-05-11.md`.
3. VERIFIED: the child-support long-tail variants checked in pass 2 showed zero visible rows; do not create thin standalone pages from those filters.
4. VERIFIED: `משמורת בלעדית לאם` is a protected old Hebrew case-law URL with `107` impressions and average position `9.6`.
5. VERIFIED: `נהיגה בשכרות` is a wrong-page match to a will-revocation URL and should become a traffic-law support planning item later.
6. NEXT: run pass 3 for criminal/traffic variants: `זכויות חשוד`, `כתב אישום`, `מעצר ימים`, `סגירת תיק פלילי`, `עורך דין עבירות סמים`, `עורך דין נהיגה בשכרות`, `פסילה מנהלית`, and `שלילת רישיון נהיגה`.
7. BLOCKED: no URL changes, redirects, noindex, canonical changes, sitemap changes, content rewrites, content deletion, menu changes or CMS writes from this evidence alone.

## 2026-05-11 TARGETED GSC PASS 3 NEXT ACTIONS

**Status:** VERIFIED / REVIEW ONLY

1. DONE: third targeted browser pass checked `זכויות חשוד`, `כתב אישום`, `מעצר ימים`, `סגירת תיק פלילי`, `עורך דין עבירות סמים`, `עורך דין נהיגה בשכרות`, `פסילה מנהלית`, and `שלילת רישיון נהיגה`.
2. VERIFIED: pass 3 is documented in `project-control/gsc-targeted-query-pass-3-2026-05-11.csv` and `project-control/gsc-targeted-query-pass-3-2026-05-11.md`.
3. VERIFIED: most exact criminal/traffic support variants returned no visible rows; do not create thin standalone pages from those filters.
4. VERIFIED: `כתב אישום` maps to a specific Netanyahu indictment page and homepage, not a clean general support guide.
5. VERIFIED: `עורך דין נהיגה בשכרות` maps to a will-revocation page, confirming a wrong-page traffic-law match.
6. NEXT: build review-only criminal and traffic support decision packets from the GSC evidence, inventory and existing URL map.
7. BLOCKED: no URL changes, redirects, noindex, canonical changes, sitemap changes, content rewrites, content deletion, menu changes or CMS writes from this evidence alone.
## 2026-05-26 PUBLIC BUSINESS-LANGUAGE TITLE GATE NEXT ACTIONS

**Status:** CODE FIXED / DEPLOYMENT AND OLD-CONTENT REVIEW STILL NEEDED

1. After uPress pulls the commit, verify `deployment-marker.txt` shows `2026-05-26-public-business-language-title-gate-v1`.
2. In wp-admin staging or a controlled draft, try saving a future/published page with the title `למה ביטוח לאומי הוא מסלול הכנסה חשוב ל-Jus-Tice`; publication should be blocked.
3. Review any already-published Bituach Leumi page separately because this gate prevents future saves but does not rewrite existing CMS content.
4. If a bad page is already public, replace internal-revenue H1/title copy with user-help intent such as `ערעור על החלטת ביטוח לאומי: בדיקה ראשונית לפני פנייה לעורך דין`.
5. Keep internal business-plan language only in `.project-control`, Linear, private admin screens and owner-only reports.

## 2026-05-26 LIVE PUBLIC BUSINESS-LANGUAGE AUDIT NEXT ACTIONS

**Status:** SAMPLED PAGES CLEAN / BITUACH LEUMI DUPLICATE ROUTE REVIEW NEEDED

1. Keep running `node tools/check-live-public-business-language.mjs --reportDate=YYYY-MM-DD` after public page updates or suspicious screenshots.
2. Review `/national-insurance-attorney/` and `/bituach-leumi-appeal-guide/` together because they currently share identical live title/H1.
3. Do not change redirects, canonicals, slugs, noindex, sitemap or taxonomy from this audit alone.
4. Decide whether the two Bituach Leumi URLs should have distinct user intents, internal links, and CTAs, or whether one should become the canonical/supporting page later after owner approval and GSC evidence.
5. Keep the uPress deployment blocker for `b8f65e6c` open until the live marker changes to `2026-05-26-public-business-language-title-gate-v1`.

## 2026-05-26 BITUACH LEUMI ROUTE INTENT REVIEW NEXT ACTIONS

**Status:** REVIEW PACKET READY / NO PUBLIC EDIT APPROVED

1. Open `.project-control/bituach-leumi-route-intent-review-2026-05-26.md`.
2. Treat `/national-insurance-attorney/` as the proposed lawyer/practice-match page and `/bituach-leumi-appeal-guide/` as the proposed appeal guide/calculator page.
3. Owner/SEO should approve or revise the proposed Hebrew title/H1 split before any CMS metadata edit.
4. Check GSC/SERP evidence before deciding whether both URLs should remain distinct long term.
5. If approved, prepare a minimal public edit: metadata/H1 split plus contextual internal links only; avoid a full rewrite unless legal/source review is ready.
6. Do not change redirect, canonical, noindex, sitemap, taxonomy, slug, lawyer routing, lead routing, payment or public CMS body from this packet alone.

## 2026-05-26 ARTICLE DUPLICATE CTA GUARD NEXT ACTIONS

**Status:** CODE READY / LIVE PULL AND REVIEW NEEDED

1. After uPress pulls the commit, verify `deployment-marker.txt` returns `2026-05-26-article-duplicate-cta-guard-v1`.
2. Open a normal article on mobile and confirm the contextual help/request CTA appears once after the article.
3. Open a family-law article and confirm the sidebar can still show cluster navigation without repeating the same CTA title/text.
4. Open an article connected to a lawyer and confirm the connected-lawyer sidebar still appears as unique content.
5. Keep running `node tools/check-article-duplicate-cta-guard.mjs --reportDate=YYYY-MM-DD` after future article-template changes.
6. No CMS body/title/H1/URL/canonical/redirect/noindex/sitemap/taxonomy change is needed for this fix.

## 2026-05-26 SUPPLIER SMART-MATCH BID READINESS NEXT ACTIONS

**Status:** ADMIN INFRASTRUCTURE READY / REAL SUPPLIER TERMS STILL BLOCKED

1. After uPress pulls the commit, verify `deployment-marker.txt` returns `2026-05-26-supplier-smart-match-admin-v1`.
2. Open wp-admin `Suppliers` and review the new `Smart match` column on existing supplier records.
3. Open wp-admin `Justice CRM -> Supplier marketplace pipeline` and inspect the smart-match score plus `Safe bid packet` drawer.
4. For immigration/citizenship/relocation suppliers, do not send client PII in the first quote request; use the safe packet only after client consent and with anonymized facts.
5. Add or complete supplier records with category, provider type, credential status, bid model, revenue model, minimum price, source proof, contact route and SLA before any handoff.
6. Record accepted commercial terms and payment/invoice proof before marking supplier revenue as real.
7. Do not expose scoring, bids, commissions, supplier margins or investor/revenue language on public pages.
