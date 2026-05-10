# Maya Rotenberg Reputation Prototype Plan
Date: 2026-05-10  
Status: PROTOTYPE PLAN - NOT IMPLEMENTED

## Goal

Use Maya Rotenberg's mini-site as the first proof of the reputation/review system, without inventing facts, reviews, scores or achievements.

## Public Source Findings From This Pass

Potential source-backed profile facts for later owner/legal review:
- Maya Rotenberg has public profiles/pages on her own site, Dun's 100 and Justia.
- Public pages associate her practice with divorce, family law, wills/inheritance, mediation and related family-law areas.
- Public pages list office/contact information and media/press references.
- Search did not verify a Google Business Profile rating or Place ID during this pass.

Sources to review before use:
- https://rotenberglaw.co.il/
- https://rotenberglaw.co.il/about
- https://www.duns100.co.il/en/Maya_Rotenberg_Law_Office
- https://lawyers.justia.com/lawyer/maya-rotenberg-1587080

## MVP Fields For Maya

Do first in admin/meta only:
- `google_place_id` - BLOCKED until verified.
- `google_maps_review_url` - BLOCKED until verified.
- `google_rating` - leave empty until verified.
- `google_review_count` - leave empty until verified.
- `google_reviews_last_verified` - leave empty until verified.
- `profile_completeness_score` - calculate internally only.
- `verification_status` - `source_verified` only after source audit approval.
- `review_display_enabled` - false until policy exists.
- `review_collection_enabled` - false until first-party workflow exists.

## Prototype Page Sections

Recommended non-fake public sections:
1. Professional overview.
2. Practice areas.
3. Connected family-law guides.
4. Review/reputation block:
   - If Google profile verified: "קראו חוות דעת ב-Google".
   - If not verified: omit rating and show no stars.
5. Profile completeness/trust block:
   - office/contact details.
   - practice areas.
   - source-reviewed links.
6. Articles connected to her expertise.
7. Q&A/family-law authority section later.
8. Inquiry CTA.
9. Disclosure:
   "חוות דעת מוצגות בהתאם למדיניות האתר. המידע אינו מהווה המלצה משפטית או תחליף לייעוץ משפטי."

## Do Not Publish

- fake review snippets.
- fake 5-star rating.
- "verified lawyer" unless verification policy is approved.
- "recommended" unless policy/legal review approves.
- public case/achievement claims unless source-audited.

## Work Plan

1. Verify whether a Google Business Profile exists.
2. Find/verify Google Place ID.
3. Add Google review link only if verified.
4. Add manual rating/count only if owner/legal approves source and display.
5. Keep source notes in `project-control/maya-rotenberg-public-source-audit.md`.
6. Add first review block as hidden/empty state until real data exists.

## Status

NEEDS LIVE/ADMIN WORK: Google Business Profile / Place ID verification.  
NOT IMPLEMENTED: no profile fields, ratings, reviews, source claims or schema were changed.
