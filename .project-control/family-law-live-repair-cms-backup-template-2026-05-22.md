# Family Law Live Repair CMS Backup Template - 2026-05-22

Status: VERIFIED PLANNING / PUBLIC EXECUTION BLOCKED / NO PUBLIC CHANGES

Purpose: give the owner/operator an exact rollback-capture worksheet before any approved Family/Divorce visible repair is made in WordPress. This template supports current-URL repairs only. It does not authorize editor saves, redirects, canonical changes, noindex changes, slug changes, sitemap changes, taxonomy changes, media uploads, lawyer-card changes, lead/CRM changes, wp-admin setting changes, database writes or uPress deployment.

## When To Use This

Use this immediately after the owner chooses `APPROVE_VISIBLE_REPAIR_ONLY` and before opening any affected page for editing. If the owner decision is still `HOLD_PUBLIC_REPAIR`, this worksheet remains planning-only.

Affected current URLs:

- `/divorce-agreement/`
- `/divorce-lawyer/`
- `/lawyer-divorce-guide-proceedings-costs-rights/`
- `/child-support/`
- `/child-custody/`
- `/divorce-mediation/`

## Required Backup Fields Per Page

Capture all fields below before saving any editor change:

- WordPress post ID.
- Current post title.
- Current slug and full permalink.
- Current editor body/content in full.
- Public rendered URL and preview URL if available.
- SEO title.
- Meta description.
- Canonical URL.
- Robots/indexing setting.
- Category and taxonomy terms.
- Featured image ID/URL.
- Related-content/manual-link fields, if present.
- Schema/plugin SEO fields, if present.
- Revision ID and revision timestamp.
- Operator name and capture date/time.
- Rollback storage location.
- Desktop screenshot path before repair.
- Mobile screenshot path before repair.
- Owner decision value.
- Notes about any visible shortcode, PDF/media, or template issue.

Do not commit secrets, database dumps, admin cookies, app passwords, wp-config data, private client information or raw exports containing credentials. If a database export is needed, store it outside Git unless the owner explicitly approves a sanitized artifact.

## Page-Specific Capture Notes

### `/divorce-agreement/`

Extra required capture:

- Raw visible `justice_pdf_download` and `justice_contact_form` shortcode context.
- Any shortcode plugin/module status visible to the operator.
- PDF/media attachment ID, file name, public URL and content type if a PDF exists.
- Current CTA/download text before repair.

Blocked until:

- Owner approves visible current-URL repair.
- Backup is complete.
- Operator has a decision whether to restore shortcode rendering, replace with static CTA/download markup, or remove the PDF promise until a verified PDF exists.

### `/divorce-lawyer/`

Extra required capture:

- Current canonical and robots fields.
- Any custom H1/body heading field.
- Any related content or manual links pointing to support articles.

Blocked until:

- Owner approves visible H1 repair.
- Focused GSC and owner canonical decision exist before any SEO consolidation. H1 repair can be separate; canonical/redirect/noindex/sitemap cannot.

### `/lawyer-divorce-guide-proceedings-costs-rights/`

Extra required capture:

- Current canonical and robots fields.
- Any custom H1/body heading field.
- Any related content or manual links pointing to support articles.

Blocked until:

- Owner approves visible H1 repair.
- Focused GSC and owner canonical decision exist before any SEO consolidation. H1 repair can be separate; canonical/redirect/noindex/sitemap cannot.

### `/child-support/`, `/child-custody/`, `/divorce-mediation/`

Extra required capture:

- Current body heading structure.
- Any manual related links to divorce-lawyer, divorce-agreement, custody, child-support, mediation, property-division or prenup pages.
- Any lead CTA or lawyer-directory block currently rendered.

Blocked until:

- Owner approves visible H1/template repair.
- Backup is complete.

## Cluster-Wide Freeze Before Editing

Before any repair, record the current state for:

- Divorce-lawyer canonical choice: `HOLD_PENDING_GSC` unless owner decides otherwise after focused GSC export.
- Redirect state: no redirect changes approved.
- Noindex state: no noindex changes approved.
- Sitemap state: no sitemap inclusion/exclusion changes approved.
- Taxonomy/category state: no category hierarchy changes approved.
- Internal links: no bulk internal-link rewrite approved in this repair step.

## Post-Repair Verification Required

After approved current-URL repair only:

- Rerun `node tools/check-family-law-live-safety.mjs --reportDate=YYYY-MM-DD`.
- Rerun `node tools/extract-family-law-live-repair-diagnostics.mjs --reportDate=YYYY-MM-DD`.
- Verify the final URL remains unchanged.
- Verify HTTP status remains `200`.
- Verify canonical and robots are unchanged unless a separate owner SEO decision exists.
- Verify exactly one intended H1 on each repaired page.
- Verify no raw `justice_*` shortcode text is visible.
- Verify any remaining PDF link returns HTTP `200` and a PDF content type.
- Capture desktop and mobile screenshots.
- Update project-control with `VERIFIED`, `FIXED`, `BLOCKED` or `NOT VERIFIED` labels.

## Current Status

- VERIFIED PLANNING: backup fields and page-specific capture requirements are defined.
- BLOCKED: actual CMS rollback material is not captured in this repo.
- BLOCKED: public visible repair still requires owner approval plus completed backup.
- BLOCKED: divorce-lawyer SEO consolidation remains blocked until focused GSC and owner canonical decision.

## Safety

No public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, media asset, lawyer, lead, CRM, payment, GA4/GSC setting, wp-admin setting or uPress deployment was changed.
