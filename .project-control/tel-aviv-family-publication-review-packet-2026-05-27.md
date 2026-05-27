# Tel Aviv Family Publication Review Packet - 2026-05-27

Status: TEL_AVIV_FAMILY_PUBLICATION_REVIEW_BLOCKED_FOCUSED_GSC_LEGAL_OWNER
Target: /divorce-lawyer-tel-aviv/

Scope: private publication-readiness packet only. This does not create or publish a page, edit CMS, change title/H1/meta/body/internal links, alter redirects/canonicals/noindex/sitemaps/taxonomies, contact anyone, create CRM records, invoice, charge, email, or deploy.

## Source Chain

- Draft packet (2026-05-27): TEL_AVIV_FAMILY_LOCAL_DRAFT_PACKET_READY_FOR_PRIVATE_EDITOR_REVIEW_NO_PUBLIC_CHANGE
- Internal overlap review (2026-05-27): TEL_AVIV_FAMILY_INTERNAL_OVERLAP_READY_WITH_GSC_REVIEW_NO_PUBLIC_CHANGE
- GSC cache review (2026-05-27): TEL_AVIV_FAMILY_GSC_CACHE_REVIEW_READY_FOCUSED_EXPORT_REQUIRED_NO_PUBLIC_CHANGE
- Evidence-fill packet (2026-05-27): DIVORCE_TEL_AVIV_EVIDENCE_FILL_READY_NO_PUBLIC_CHANGE
- Directory coverage QA (2026-05-27): DIRECTORY_COVERAGE_QA_FOUND_FILTER_ALIAS_GAP_NO_PUBLIC_CHANGE

## Review Gates

| ID | Gate | Status | Evidence | Required Before Publication |
| --- | --- | --- | --- | --- |
| TA-PUB-01 | target_private_status | PASS_PRIVATE_404 | /divorce-lawyer-tel-aviv/ is 404; evidence packet target status is 404. | Confirm target is not already public 200 immediately before any owner-approved CMS work. |
| TA-PUB-02 | canonical_lawyer_directory_coverage | REVIEW_COVERAGE_PRESENT_NOT_FINAL | /lawyers/?city=tel-aviv&area=family-law has 3 visible cards; paid card count is not a public-quality claim. | Owner/admin verifies profile readiness, source-gated facts, availability and no unsupported paid/sponsored claims. |
| TA-PUB-03 | focused_gsc_exact_local_evidence | BLOCKED_FOCUSED_EXPORT_REQUIRED | Local GSC cache has 0 exact local rows; focused export template has 60 rows. | Fill focused GSC export for last 16 months and last 90 days for target, pillar, protected associated pages and legacy/profile URLs. |
| TA-PUB-04 | pillar_protection | PASS_PROTECT_PILLAR | Broad divorce-lawyer cache rows: 84; primary pillar remains /divorce-lawyer/. | Keep broad how-to-choose, cost, process and general divorce-lawyer intent on the pillar. |
| TA-PUB-05 | associated_route_overlap | PASS_WITH_PROTECTED_ROUTES | 11 associated routes mapped; 5 high-risk routes protected. | Exclude custody, child support, mediation, settlement, template and cost intent unless legal/editor review explicitly approves a reference. |
| TA-PUB-06 | legal_editor_review | BLOCKED_REVIEWER_REQUIRED | No legal/editor reviewer approval is recorded in the private source chain. | Legal/editor reviewer must approve title, H1, intro, checklist, CTA, FAQ candidates, disclaimers and source boundaries. |
| TA-PUB-07 | owner_publication_approval | BLOCKED_OWNER_APPROVAL_REQUIRED | All source packets record 0 public/CMS/SEO approvals. | Owner must approve exact scope, target URL, directory link, protected associated pages and post-publication review workflow. |
| TA-PUB-08 | future_owner_email_requirements | REFERENCE_ONLY_NO_EMAIL | No public page was published or updated in this cycle, so no owner email is triggered. | If a future public update is approved and deployed, first check instruction emails, then send Hebrew review URL, summary and cannibalization list. |
| TA-PUB-09 | no_live_action_boundary | PASS_NO_LIVE_ACTION | This packet writes private repo artifacts only and records 0 public/CMS/CRM/contact/payment/email/uPress approvals. | Re-run boundary guard after generation and before commit. |

## Fillable Gate Template

Use .project-control/tel-aviv-family-publication-gate-template-2026-05-27.csv before any public work.

| ID | Gate | Required Value | Current Blocker | Public Go If Blank |
| --- | --- | --- | --- | --- |
| TA-GATE-01 | focused_gsc_last_16_months | Exact query/page rows for target, pillar, protected associated pages and legacy/profile URLs. | Focused export not filled. | no |
| TA-GATE-02 | focused_gsc_last_90_days | Recent query/page rows to confirm no active cannibalization or stale legacy dominance. | Focused export not filled. | no |
| TA-GATE-03 | lawyer_coverage_readiness | Owner/admin confirms visible Tel Aviv family-law profiles are source-gated, appropriate and available for the local page. | Visible card count exists, but readiness is not final publication proof. | no |
| TA-GATE-04 | legal_editor_copy_review | Reviewer approves exact title, H1, intro, checklist, CTA, FAQ candidates and disclaimers. | No reviewer sign-off recorded. | no |
| TA-GATE-05 | owner_publication_scope | Owner approves exact route, content scope, internal-link plan and post-publication review workflow. | No owner publication approval recorded. | no |

## Decision

The Tel Aviv divorce-lawyer page has enough private structure for legal/editor review, but not enough evidence for publication. The next owner-visible step is to fill focused GSC exports and legal/editor/owner approval fields; the route should stay private until those rows are complete.
