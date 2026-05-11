# Family / Divorce Related Content Boundary Plan

Date: 2026-05-12
Status: VERIFIED / REVIEW ONLY / NO PUBLIC CHANGES

This plan closes the related-content risk for the first Family/Divorce upload candidate, `/divorce-lawyer/`.

It does not approve related-card changes, internal-link edits, CMS writes, URL changes, redirects, canonicals, noindex, sitemap changes, taxonomy edits, lawyer-card edits, review/rating blocks, Maya profile links, wp-admin settings or database changes.

## Why This Exists

VERIFIED RISK:
- The existing live semantic related-content system can match the broad `family_divorce` cluster.
- It can still surface editorially unsafe cards inside that cluster.
- A sampled family/divorce page showed a related card for `most-recommended-family-lawyer`, which uses recommendation/trust language that is not approved.
- For `/divorce-lawyer/`, related cards must support the user journey and SEO hierarchy without adding fake trust, ranking, city-doorway or LegalTech-product signals.

Decision:
- For the first `/divorce-lawyer/` upload, use a small manual related-content allowlist.
- Do not rely only on automatic semantic matching until the family/divorce trust-language exclusions are proven.

## Inputs Reviewed

VERIFIED:
- `project-control/family-law-divorce-execution-plan-2026-05-12.md`
- `project-control/family-divorce-no-url-internal-link-map-2026-05-12.csv`
- `project-control/family-divorce-pillar-section-merge-outline-2026-05-12.md`
- `project-control/family-divorce-pillar-owner-review-draft-package-2026-05-12.md`
- `project-control/family-law-pre-upload-minimum-checklist-2026-05-12.md`
- `project-control/live-related-content-qa-2026-05-11-after-international-filter.csv`

## Primary Related Cards For `/divorce-lawyer/`

APPROVE AFTER OWNER / CONTENT REVIEW:
1. `/consensual-divorce/`
2. `/divorce-mediation/`
3. `/child-support/`
4. `/child-custody/`

Why:
- These four pages match the natural next questions after a user lands on a divorce-lawyer pillar.
- They keep the page inside the Family/Divorce service journey.
- They do not introduce unverified rankings, ratings, fake badges or lawyer recommendations.

If the template supports more cards, add only after review:
5. `/divorce-property-division/`
6. `/family-dispute-resolution/`
7. `/divorce-consultation-guide/`

Conditional:
- `/divorce-costs-2025/` can appear only after freshness review.
- `/rabbinical-agreement-approval/` can appear as a deep support item only after source/legal review and should not outrank the core support pages.
- `/mutual-divorce-agreement-2025/` can appear only after date/freshness review and agreement-role review.

## Blocked Related Cards

BLOCKED BEFORE FIRST UPLOAD:
- `/most-recommended-family-lawyer/`
- `/the-recommended-family-lawyers/`
- `/top-experts-family-law/`
- `/trusted-divorce-attorney-guide/`
- `/petah-tikva-divorce-lawyer/` and other city-practice pages until the city matrix is approved.
- `/online-family-law-services/` and family LegalTech/product pages until the tools are real and reviewed.
- `/new-trends-ai-family-law/` and broad trend pages unless used as editorial context far below the conversion path.
- `/how-to-become-a-family-lawyer/` because it serves lawyer education intent, not user legal-help intent.
- Maya profile, Maya reputation, rating, review or badge pages until profile safety and real-data rules are approved.
- Future slugs such as `/divorce-agreement/`, `/prenuptial-agreement/` and `/family-lawyer/` until those pages are approved and live.
- Old Hebrew duplicate URLs, PDFs, DOCX files, calculators and case-law assets until the document/redirect/canonical strategy is approved.

## Placement Rules

For the first upload:
- Related cards should appear after the main user-help content, not before the user understands the divorce path.
- Primary support cards should use neutral anchors, not ranking/trust claims.
- Related cards should not include fake ratings, review counts, badges, verified labels, best/top/recommended language or unsupported lawyer-quality claims.
- Related cards should not route a user in legal crisis into a lawyer-career article, trend article, city doorway or placeholder profile.

Recommended first visible set:
- consensual divorce agreement
- divorce mediation
- child support
- custody / parental responsibility and parenting time

Secondary support links inside the body:
- property division in divorce
- family dispute resolution
- preparing for a first divorce-lawyer consultation

## Post-Upload Related-Content QA

MUST VERIFY AFTER PUBLIC UPLOAD OR DRAFT PREVIEW:
1. Related cards show only approved current clean URLs.
2. No recommendation, top, expert, trusted or fake-review language appears.
3. No fake ratings, review counts, badges or profile-completeness labels appear.
4. No city-practice page appears in the core related section.
5. No LegalTech/tool page appears unless the tool exists and is approved.
6. No Maya/rating/reputation page appears unless verified facts and profile policy are approved.
7. All related URLs return `200`.
8. All related URLs use `https://`.
9. No related URL is an old Hebrew duplicate, protected document, calculator or case-law asset unless explicitly approved.
10. Related card titles match the intended support topic and do not cannibalize the `/divorce-lawyer/` H1/title.

## Current Decision

VERIFIED:
- `/divorce-lawyer/` should not launch with uncontrolled automatic related cards.
- The first controlled upload should use a manual allowlist or an equivalent filter.
- The primary related set should be limited to approved Family/Divorce support pages.

BLOCKED:
- Public related-card execution remains blocked until owner approval, final draft review and post-upload QA plan.
