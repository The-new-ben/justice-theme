# Family Law Live Repair Operator Packet - 2026-05-22

Status: READY FOR OPERATOR PREP / PUBLIC EXECUTION BLOCKED / NO PUBLIC CHANGES

This packet converts the live Family/Divorce safety findings into an execution checklist for an owner/operator. It does not authorize CMS edits, redirects, canonical changes, noindex changes, slug changes, sitemap changes, taxonomy changes, media uploads, lawyer-card changes, lead/CRM changes, wp-admin setting changes, database writes or uPress deployment.

## Source Evidence

- `project-control/family-law-live-safety-check-2026-05-22.md`
- `project-control/family-law-live-safety-check-2026-05-22.csv`
- `project-control/family-law-live-repair-diagnostics-2026-05-22.md`
- `project-control/family-law-live-repair-diagnostics-2026-05-22.csv`
- `project-control/family-law-visible-repair-field-map-2026-05-22.md`
- `project-control/family-law-visible-repair-field-map-2026-05-22.csv`
- `project-control/family-law-live-repair-cms-backup-template-2026-05-22.md`
- `project-control/family-law-live-repair-cms-backup-template-2026-05-22.csv`
- `project-control/family-law-live-repair-owner-approval-2026-05-22.md`
- `project-control/family-law-live-repair-owner-approval-2026-05-22.csv`
- `project-control/family-law-live-repair-readiness-gate-2026-05-22.md`
- `project-control/family-law-live-repair-readiness-gate-2026-05-22.csv`
- `project-control/family-law-live-publish-safety-review-2026-05-22.md`
- `project-control/family-divorce-gsc-workflow-handoff-2026-05-22.md`
- `project-control/family-divorce-cms-operator-runbook-2026-05-21.md`
- `project-control/family-divorce-upload-readiness-dashboard-2026-05-21.md`

## Live Defects To Repair

VERIFIED LIVE READ-ONLY:

- `/lawyer-divorce-guide-proceedings-costs-rights/` returns HTTP 200 and is indexable/self-canonical.
- `/divorce-lawyer/` returns HTTP 200 and is indexable/self-canonical.
- `/divorce-agreement/` returns HTTP 200 but exposes raw `justice_pdf_download` and `justice_contact_form` shortcodes.
- `divorce-agreement-template-2025.pdf` was not found at the tested upload paths.
- The six checked Family/Divorce HTML pages currently have more than one detected H1 and need body/template review.

## Required Repair Order

1. Export actual WordPress rollback material for every affected page before editing.
2. Run the focused Family/Divorce GSC workflow before any canonical, redirect, noindex, slug or sitemap decision.
3. Owner chooses the divorce-lawyer canonical target after GSC evidence.
4. Repair `/divorce-agreement/` first because it has visible broken shortcode text and a broken PDF promise.
5. Repair H1/template issues on the six checked pages without changing URLs.
6. Rerun `node tools/check-family-law-live-safety.mjs --reportDate=YYYY-MM-DD`.
7. Capture desktop and mobile screenshots only after approved public repairs are live and stable.

## Allowed First Repairs After Approval

Allowed after explicit owner approval plus rollback backup:

- Update existing public pages only.
- Remove or replace raw shortcode text on `/divorce-agreement/`.
- Upload and verify the PDF asset, or remove the PDF download promise until a verified PDF exists.
- Convert unintended body H1s to H2/H3, or remove body-level H1s if the theme already renders the page title as H1.
- Preserve current URLs while fixing visible content/template defects.
- Rerun read-only route, canonical, robots, H1 and shortcode checks.

Not allowed in this packet:

- Creating duplicate Family/Divorce pages.
- Changing slugs.
- Redirecting either divorce-lawyer candidate.
- Noindexing either divorce-lawyer candidate.
- Changing canonicals before GSC and owner decision.
- Removing URLs from sitemap.
- Editing protected old source URLs or protected assets.
- Adding unverified legal claims, ratings, reviews, guarantees, fake trust badges or AggregateRating/Review schema.

## Page-Specific Repair Notes

| Target | Current blocker | Repair posture | Verification after repair |
|---|---|---|---|
| `/divorce-agreement/` | Raw shortcodes, missing PDF, H1 count `2` | Highest priority visible repair. Either restore functioning shortcode rendering or replace with approved static CTA/download markup. Do not promise a PDF until the file returns HTTP 200 with PDF content type. | No raw `justice_*` text, one intended H1, PDF link 200 if present, self-canonical unless separately approved. |
| `/divorce-lawyer/` | H1 count `2`; duplicate pillar conflict with long URL | H1 repair is allowed after backup; canonical/redirect/noindex decision is blocked until focused GSC and owner decision. | One intended H1; self-canonical only if owner selects this as canonical. |
| `/lawyer-divorce-guide-proceedings-costs-rights/` | H1 count `3`; duplicate pillar conflict with clean URL | H1 repair is allowed after backup; canonical/redirect/noindex decision is blocked until focused GSC and owner decision. | One intended H1; canonical/robots behavior must match owner decision after GSC. |
| `/child-support/` | H1 count `3` | Template/body heading repair only. No URL/canonical/sitemap changes. | One intended H1; no raw shortcode or broken visible block. |
| `/child-custody/` | H1 count `2` | Template/body heading repair only. No URL/canonical/sitemap changes. | One intended H1; no raw shortcode or broken visible block. |
| `/divorce-mediation/` | H1 count `3` | Template/body heading repair only. No URL/canonical/sitemap changes. | One intended H1; no raw shortcode or broken visible block. |

## Owner Decisions Required

Required before public repair execution:

- `APPROVE_VISIBLE_REPAIR_ONLY`: authorize shortcode/PDF/H1 repairs on current URLs only.
- `HOLD_PUBLIC_REPAIR`: do not touch production; keep documenting only.
- `LEGAL_SOURCE_REVIEW_REQUIRED`: hold any page with legal/source concern.

Required before SEO consolidation:

- `CANONICAL_DIVORCE_LAWYER_KEEP_CLEAN_URL`: keep `/divorce-lawyer/` as the canonical pillar.
- `CANONICAL_DIVORCE_LAWYER_KEEP_LONG_URL`: keep `/lawyer-divorce-guide-proceedings-costs-rights/` as the canonical pillar.
- `HOLD_PENDING_GSC`: no canonical/redirect/noindex/sitemap decision yet.

The practical default remains `HOLD_PENDING_GSC` until the owner runs the focused Family/Divorce GSC export.

## Minimum Operator QA

After each approved repair:

- HTTP status is `200`.
- Final path is unchanged.
- No accidental redirect to homepage.
- Canonical and robots are unchanged unless a separate owner-approved SEO decision exists.
- Exactly one intended H1 is detected.
- No raw shortcode text appears in visible HTML.
- If a PDF link remains, it returns HTTP `200` and a PDF content type.
- Hebrew text renders without replacement characters.
- No fake reviews, ratings, recommendations or guaranteed-result claims appear.
- Desktop and mobile screenshots show readable content with no CTA/header overlap.
- `node tools/check-family-law-live-safety.mjs --reportDate=YYYY-MM-DD` is rerun and attached to project-control.

## Current Readiness Impact

- Family/Divorce content-body package remains high readiness after owner/legal/source approval and backup.
- Live repair readiness is medium: the defects are concrete and measurable, but execution still requires owner approval and CMS backup.
- SEO migration readiness remains blocked until focused GSC export and owner canonical/redirect decisions.
- Upload approval remains blocked: this packet prepares repair execution only.

## Safety

No public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, media asset, lawyer, lead, CRM, payment, GA4/GSC setting, wp-admin setting or uPress deployment was changed.
