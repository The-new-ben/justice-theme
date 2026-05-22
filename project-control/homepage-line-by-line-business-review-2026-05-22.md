# Homepage Line-By-Line Business Review - 2026-05-22

Status: VERIFIED LOCAL / REVIEW ONLY / NO PUBLIC CHANGES

## Purpose

This document completes T243 by reviewing the current `front-page.php` homepage stack section by section for SEO signal, legal-help user signal, lawyer-onboarding signal, CTA clarity, internal-link risk and mobile/business execution risk.

This review does not approve a homepage template edit, public copy edit, title/H1/meta change, URL change, redirect, canonical/noindex change, sitemap change, taxonomy change, lawyer-card change, lead/CRM change, payment change, wp-admin action or uPress deployment.

## Inputs Reviewed

VERIFIED LOCAL:

- `front-page.php`.
- `template-parts/sections/hero.php`.
- `template-parts/sections/customer-intake-strip.php`.
- `template-parts/sections/homepage-intent-pyramid.php`.
- `template-parts/sections/practice-areas-grid.php`.
- `template-parts/sections/find-lawyer-guide.php`.
- `template-parts/sections/featured-lawyers.php`.
- `template-parts/sections/legaltech-tools.php`.
- `template-parts/sections/lawyer-cta.php`.
- `template-parts/sections/latest-articles.php`.
- `template-parts/sections/ask-lawyer.php`.
- `template-parts/sections/trust-section.php`.
- `template-parts/sections/cta-section.php`.
- `project-control/homepage-competitor-aligned-strategy-2026-05-22.md`.
- `project-control/homepage-seo-strategy.md`.
- `project-control/homepage-seo-design-alignment.md`.

## Executive Finding

VERIFIED LOCAL: the homepage stack is not the blocker. It already matches the intended portal model: search, intake, field routing, education, lawyer product, articles, lead capture, trust and final CTA.

The next useful homepage work should be a no-URL-change copy/link QA batch, not a rebuild. The homepage should be tightened so every section has one job and no section leaks trust, SEO equity or conversion intent into weak or unapproved destinations.

Highest current risks:

- Featured lawyer area must not show fake, unapproved, unlabelled or over-promising profiles.
- Latest articles should eventually become curated cluster guides, because chronological selection can send homepage equity to weak or random pages.
- Practice-area and hero quick links currently rely on taxonomy count. This is useful for discovery but should later be replaced or constrained by approved commercial/SEO priority.
- Trust section is mostly numeric. It should later state editorial, sponsored-placement, review and no-advice boundaries more concretely.
- Hero/intake/ask-lawyer CTAs are directionally useful, but the exact live route, lead delivery and no-advice boundary still need owner-approved QA before public editing.

## Section Review

| Order | Template | Current job | Keep/change decision | Status |
|---:|---|---|---|---|
| 1 | `hero.php` | Broad portal and lawyer-directory entry with search, practice area, city and primary CTAs | Keep. Later verify H1/title/meta consistency, `/lawyers/` search behavior and quick-link destinations. Avoid stuffing homepage with every practice keyword. | KEEP_REFINE |
| 2 | `customer-intake-strip.php` | Bridges stressed users into lead, guide or directory paths | Keep. The section has a useful decision model. Later ensure no-advice/no-representation language is visible enough near the lead path. | KEEP_REFINE |
| 3 | `homepage-intent-pyramid.php` | Maps high-value legal issues to guides, directory filters and fallback supporting links | Keep. This is strategically important. Later align card order and fallback links to approved cluster order and published URL evidence. | KEEP_REFINE |
| 4 | `practice-areas-grid.php` | Broad discovery by top-level practice-area taxonomy | Keep for now. Later constrain or replace count-ordering with approved priority fields so old volume does not outrank money hubs. | HIGH_PRIORITY_REVIEW |
| 5 | `find-lawyer-guide.php` | Educational "how to choose a lawyer" authority section with FAQ/checklist structure | Keep. It supports trust and conversion. Later source-check cost and legal-process claims before public copy refresh. | KEEP_REFINE |
| 6 | `featured-lawyers.php` | Lawyer proof and Maya Rotenberg mini-site showcase when an approved profile exists; fallback lawyer acquisition CTA otherwise | High risk. Keep only because it checks public approval before showing the profile. Later add clear paid/featured/sponsored boundaries if used commercially. | HIGH_RISK_GATED |
| 7 | `legaltech-tools.php` | Product/intake gateway and lead prefill source | Keep gated. It uses safe fallback links, but the archive/tool URLs must remain blocked until actual tools and owner-approved product language are live. | KEEP_GATED |
| 8 | `lawyer-cta.php` | B2B lawyer acquisition path with manual approval and payment boundary | Keep. Language is mostly safe because it emphasizes profile, visibility, lead status and no guaranteed outcome. Later QA pricing/product links. | KEEP_REFINE |
| 9 | `latest-articles.php` | Recency/editorial proof from latest published articles | Replace later. Chronological feed is acceptable short term, but curated Family, Criminal and Medical guides should replace it after cluster governance clears. | REPLACE_LATER |
| 10 | `ask-lawyer.php` | Lead capture and routing form | Keep. It has nonce/spam/attribution and disclaimer logic. Later verify real delivery, consent text, area routing and GA4 events. | KEEP_REFINE |
| 11 | `trust-section.php` | Numeric trust/social proof block | High-priority copy review. Counts are useful, but trust should include process: editorial review, source limits, sponsored labels and no-advice boundary. | HIGH_PRIORITY_REVIEW |
| 12 | `cta-section.php` | Final consumer CTA, phone CTA and return-to-search CTA | Keep. Later separate consumer help from lawyer acquisition and verify phone number/source-of-truth before public refresh. | KEEP_REFINE |

## First Safe Homepage Batch

Recommended first batch if owner approves:

1. Prepare exact copy/link QA for the existing 12-section stack.
2. Keep all existing URLs stable.
3. Do not change title, H1, meta, redirects, canonicals, noindex, sitemap or taxonomy.
4. Verify every homepage link resolves to a published, intended destination before replacing any text or CTA.
5. Replace any unapproved "recommended", "best", fake-review, fake-ranking or guaranteed-lead language.
6. Keep `featured-lawyers.php` gated behind real public approval.
7. Define curated article/cluster slots, but do not deploy them until Family/Divorce and later clusters clear upload governance.
8. Verify desktop and mobile screenshots only after an approved public/template copy batch exists.

## Must Not Skip

- URL conflict check for every homepage destination.
- Approved canonical target for major commercial routes.
- No fake lawyer profiles, fake reviews, fake rankings or fake badges.
- No guaranteed legal outcome or guaranteed lead language.
- Clear no-advice/no-representation boundary in intake and lead flows.
- Owner approval before public CMS/template execution.
- Rollback plan before any live homepage edit.

## Can Wait

- Full homepage redesign.
- Schema expansion.
- GA4 event expansion.
- Final article curation.
- LegalTech product expansion.
- Paid-placement labeling implementation, unless paid/featured profiles are about to go live.
- Full mobile visual QA, until there is an approved public-facing change to test.

## Recommended Next Action

NEXT: owner-approved no-URL-change homepage copy/link QA. It should focus on hero/search, intent pyramid, practice-area priority, featured lawyer boundaries, latest-articles replacement plan, trust copy and final CTA wording.

BLOCKED PUBLIC EXECUTION: no homepage public change is approved by this review.
