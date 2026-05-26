# Homepage Section Order And Curated Pillar-Link Proposal - 2026-05-11

Status: VERIFIED / PROPOSED / NEEDS OWNER APPROVAL

## Purpose

This file converts the homepage line-by-line review into an approval-gated structure plan. It does not change the live site.

Goal:
- Keep the homepage as the broad legal portal / find-a-lawyer entry.
- Stop relying on random taxonomy order, latest-only articles, empty states or unapproved clean slugs.
- Make the homepage support the content architecture, lawyer directory, legal guides, intake flow and lawyer business funnel together.

Evidence inputs:
- `project-control/homepage-line-by-line-review-2026-05-11.md`
- `project-control/homepage-line-by-line-review-2026-05-11.csv`
- `project-control/gsc-homepage-directory-page-query-pass-2026-05-11.md`
- `project-control/homepage-seo-design-alignment.md`
- `project-control/homepage-seo-strategy.md`
- `project-control/content-architecture-decisions.md`

## Current Operating Decision

VERIFIED:
- The live homepage currently behaves like the shorter `front-page.php` flow.
- `page-home.php` has richer strategic sections, but those sections are not fully visible on the public scrape.
- Several clean pillar slugs are not safe to promote yet because they resolve to the homepage or need owner-approved content decisions.

Recommended short-term decision:
- Keep `front-page.php` as the authoritative live homepage template for the next controlled batch.
- Do not switch the live homepage to `page-home.php` blindly.
- Pull only approved strategic pieces from `page-home.php` into the live structure after owner approval.

## Live URL Safety Check

VERIFIED in this pass:
- `/lawyers/` returns `200` and stays on `/lawyers/`.
- `/divorce-lawyer/` returns `200` and stays on `/divorce-lawyer/`.
- `/family-lawyer/` resolves to the homepage, so use `/family-law/` until approved.
- `/criminal-lawyer/` resolves to the homepage, so use `/criminal-law/` until approved.
- `/real-estate-lawyer/` returns `200` and stays on `/real-estate-lawyer/`.
- `/medical-malpractice-lawyer/` returns `200` and stays on `/medical-malpractice-lawyer/`.
- `/personal-injury-lawyer/` resolves to the homepage, so use `/personal-injury-law/` or a filtered directory fallback until approved.
- `/traffic-lawyer/` returns `200` and stays on `/traffic-lawyer/`.
- `/employment-lawyer/` resolves to the homepage, so use a filtered directory or future approved page.
- `/inheritance-lawyer/` resolves to the homepage, so use a filtered directory or future approved page.
- `/cyber-lawyer/` returns `200`, but it remains approval-gated by the cyber/privacy packet.
- `/practice-areas/national-insurance/` returns `200`, but prior GSC evidence showed the hub is not yet a strong service page.

## Proposed Homepage Section Order

1. Header / primary navigation
   - Purpose: stable clean links to homepage, `/lawyers/`, articles, major approved hubs, lead form and lawyer registration.
   - Change later: replace `?page_id=` links after target confirmation.

2. Hero search and primary CTAs
   - Purpose: immediate legal-help positioning and search by issue, field and city.
   - Change later: align city values with `/lawyers/` city slugs.

3. Curated major legal-field hubs
   - Purpose: replace random/top-count taxonomy quick links with owner-approved cluster priorities.
   - Include only URLs that are safe or have approved fallbacks.

4. Lawyer directory entry
   - Purpose: strengthen `/lawyers/` as the future primary directory URL while homepage remains the broad entity page.
   - Needs: no fake ratings, no fake verified badges, no empty/demo cards.

5. Find-a-lawyer guide summary
   - Purpose: keep the strong educational signal without letting a very long guide bury the core navigation.
   - Later: move full guide depth to a dedicated `/find-lawyer/` page if approved.

6. Curated important legal guides by cluster
   - Purpose: replace latest-only articles with manually prioritized guides that match the content architecture.
   - Source: content inventory, GSC maps and approved cluster packets.

7. Real lawyer mini-site proof block
   - Purpose: demonstrate the lawyer product only if there is a real approved profile.
   - Rule: show Maya Rotenberg only after owner/legal/profile approval; otherwise hide the block.

8. Ask-lawyer / lead intake
   - Purpose: convert uncertain users into structured lead submissions.
   - Needs: CRM delivery and GA4 event verification.

9. Trust / disclosure / editorial limits
   - Purpose: build trust without fake recommendations or unsupported claims.
   - Rule: dynamic counts are safer than hard-coded claims.

10. Lawyer onboarding CTA
   - Purpose: separate B2B lawyer funnel from consumer legal-help journey.
   - Needs: payment/product roadmap alignment.

11. LegalTech / tools entry
   - Purpose: show future product depth only when routes and tools are real.
   - Rule: do not expose dead tools, fake prices or non-working flows.

12. Bottom CTA / footer
   - Purpose: repeat directory, lead form and phone/contact paths.
   - Needs: phone ownership and click tracking verification.

## Curated Pillar-Link Direction

Use on homepage only after owner approval:
- `עורך דין גירושין` -> `/divorce-lawyer/`
- `דיני משפחה` -> `/family-law/` for now, not `/family-lawyer/`
- `משפט פלילי` -> `/criminal-law/` for now, not `/criminal-lawyer/`
- `עורך דין מקרקעין` -> `/real-estate-lawyer/`
- `רשלנות רפואית` -> `/medical-malpractice-lawyer/`
- `נזיקין ותאונות` -> `/personal-injury-law/` or directory fallback for now, not `/personal-injury-lawyer/`
- `עורך דין תעבורה` -> `/traffic-lawyer/`
- `דיני עבודה` -> `/lawyers/?area=labor-law` until `/employment-lawyer/` is approved
- `ירושה וצוואות` -> `/lawyers/?area=inheritance-law` until `/inheritance-lawyer/` is approved
- `ביטוח לאומי` -> keep as planned/review only; do not make a homepage pillar until hub depth is approved
- `סייבר ופרטיות` -> keep approval-gated by cyber/privacy owner packet

## What Not To Do Yet

BLOCKED:
- Do not switch homepage templates.
- Do not expose unapproved clean slugs that resolve to the homepage.
- Do not add fake lawyer reviews, ratings or verified badges.
- Do not show an empty lawyer showcase as a proof point.
- Do not rely on latest articles as the main homepage content strategy.
- Do not publish LegalTech cards for routes/products that are not real.
- Do not change title, H1, meta, menu, sitemap, canonical or redirects in this batch.

## Approval Gates

OWNER APPROVAL REQUIRED:
- Authoritative homepage template decision.
- Final section order.
- Curated pillar links and fallbacks.
- Whether to show/hide the lawyer mini-site block.
- Whether to add city grid, topic clusters, LegalTech, newsletter or lawyer CTA to live homepage.

TECHNICAL VERIFICATION REQUIRED:
- `/lawyers/` filters for city and practice area.
- CRM/form delivery.
- GA4 events: `search_submit`, `generate_lead`, `phone_click`, `lawyer_card_click`, `lawyer_signup_start`.
- Mobile visual QA after any approved template change.

## Next Safe Work

1. Owner approves or edits the proposed section order.
2. Owner approves the curated pillar link map and fallbacks.
3. Build a no-public-change implementation checklist for the selected homepage batch.
4. Only then edit templates/CMS and run desktop/mobile visual QA.
