# Bituach Leumi Route Intent Review - 2026-05-26

Status: READY_FOR_OWNER_SEO_REVIEW_NOT_UPLOAD

Scope: repo-local anti-cannibalization review for two already-published public routes. This report does not publish or update CMS content, change titles/H1s, redirects, canonicals, noindex, sitemaps, taxonomies, lawyer routing, leads, payments or public database rows.

Source live audit: FOUND (.reports/live-public-business-language-2026-05-26.json) for 2026-05-26.

## Why This Exists

The live public business-language audit found no sampled internal revenue/business-plan leakage, but it did find that `/national-insurance-attorney/` and `/bituach-leumi-appeal-guide/` share the same title and H1. That creates a user-intent and SEO cannibalization risk, especially because the Bituach Leumi route is also part of the first paid-lead loop.

The owner already made the correct call: visitor-facing pages must explain legal help for the reader, not why the page creates revenue for Jus-Tice.

## Live Duplicate Evidence

- Duplicate ID: DUP-001
- Routes: /national-insurance-attorney/ | /bituach-leumi-appeal-guide/
- Shared live title from audit: ערעור ביטוח לאומי: בדיקת כדאיות לפני החלטה | Jus-Tice
- Shared live H1 from audit: ערעור על החלטת ביטוח לאומי: בדיקת כדאיות לפני שהמועד נסגר

## Proposed Route Split

| Route | Role | Query Family | Proposed Title | Proposed H1 | Status |
| --- | --- | --- | --- | --- | --- |
| /national-insurance-attorney/ | practice_landing_lawyer_match | עורך דין ביטוח לאומי; עורך דין לערעור ביטוח לאומי; עורך דין ועדה רפואית | עורך דין ביטוח לאומי: מציאת עורך דין לערעור או ועדה רפואית | Jus-Tice | עורך דין ביטוח לאומי לערעור, ועדה רפואית או בדיקת זכויות | READY_FOR_OWNER_SEO_REVIEW_NOT_UPLOAD |
| /bituach-leumi-appeal-guide/ | pillar_guide_and_tool_entry | ערעור ביטוח לאומי; ערעור ועדה רפואית; איך מערערים על החלטת ביטוח לאומי | ערעור ביטוח לאומי: מדריך בדיקה לפני ועדה רפואית או החלטה | Jus-Tice | ערעור ביטוח לאומי: מה לבדוק לפני שמגישים ערעור | READY_FOR_OWNER_SEO_REVIEW_NOT_UPLOAD |

## Route Notes

### /national-insurance-attorney/

- User intent: User is already looking for a Bituach Leumi lawyer, legal representation, appeal handling, medical committee help, or rights review.
- Public copy posture: Lead with legal-help matching, urgency, documents to prepare, and how to choose counsel. Keep business/revenue rationale out of all visitor-facing copy.
- Primary CTA: Submit case details to find a relevant Bituach Leumi lawyer.
- Internal link posture: Link to the appeal guide/calculator as a preliminary self-check before contacting a lawyer.
- Allowed now: Prepare draft metadata and link copy locally only.
- Blocked: No CMS title/H1 upload, no canonical, no redirect, no noindex, no slug, no sitemap, no taxonomy, no router or lawyer-profile changes.

### /bituach-leumi-appeal-guide/

- User intent: User wants to understand whether and how to appeal a Bituach Leumi decision before choosing the next step.
- Public copy posture: Lead with user education, 60-day timing awareness where legally correct, evidence checklist, appeal-worth calculator, and a clean handoff to help.
- Primary CTA: Start with the appeal worth-it calculator, then request lawyer review if the case looks time-sensitive or document-heavy.
- Internal link posture: Link to the attorney landing after explaining appeal steps and evidence needs.
- Allowed now: Prepare draft metadata, section outline, and calculator entry text locally only.
- Blocked: No CMS title/H1 upload, no canonical, no redirect, no noindex, no slug, no sitemap, no taxonomy, no live calculator or request-flow changes.


## Review Decisions

| Item | Finding | Recommendation | Owner Decision Needed | Status |
| --- | --- | --- | --- | --- |
| duplicate_live_title_h1 | The two Bituach Leumi routes currently share the same live title and H1 in the sampled audit. | Keep both routes only if the practice landing owns lawyer-match intent and the guide owns appeal-education/tool intent. | Approve metadata split and internal-link posture before any CMS edit. | OPEN_REVIEW |
| public_language_boundary | The owner correctly rejected internal revenue-style titles on public pages. | Use only user-facing legal-help language in titles, H1s, intros, CTAs and snippets. Keep commercial strategy inside private repo reports, Linear and owner-only admin. | None for the rule; approval only needed for the actual public replacement copy. | RULE_CONFIRMED |
| seo_control_boundary | This packet is a review artifact only and does not justify SEO control changes by itself. | Do not alter canonical, redirect, noindex, sitemap, taxonomy or slug without owner approval and GSC/SERP evidence. | Yes, if any technical SEO action is later proposed. | BLOCKED_FOR_TECHNICAL_SEO |
| next_public_edit_scope | The safest first edit is metadata/H1 disambiguation plus contextual internal links, not a full rewrite. | Draft the final public copy from these roles: /national-insurance-attorney/=practice_landing_lawyer_match; /bituach-leumi-appeal-guide/=pillar_guide_and_tool_entry. | Approve exact title/H1/link text and confirm whether GSC supports both URLs. | NEXT_STEP_DEFINED |

## Implementation Guardrails

1. Do not expose owner/investor/revenue logic on public legal-help pages.
2. Do not use "best", "recommended" or outcome-promise phrasing unless compliance has approved the exact wording.
3. Do not change URL, redirect, canonical, noindex, sitemap or taxonomy from this packet alone.
4. Do not publish this metadata until owner approval and, ideally, GSC/SERP confirmation that both routes should stay live.
5. Keep the guide-to-lawyer flow natural: first understand the appeal, then ask for matched legal help if needed.

## Completion Assessment

- Bituach Leumi duplicate-intent documentation: 100%.
- Public metadata replacement readiness: 70%, pending owner/GSC approval.
- Live page correction: 0%, intentionally not performed in this repo-only cycle.
- First-paid-lead loop impact: improves trust and SEO clarity, but real revenue remains blocked by specialist supply, consented lead release and payment proof.
