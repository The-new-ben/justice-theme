# Inheritance/Wills Support-To-Hub Map - 2026-05-18

## Goal

Build the next safe execution map for the recovered `/inheritance-lawyer/` route: which live inheritance/wills pages should support it, which pages need owner/editor review, and which false positives must not be promoted into the inheritance money cluster.

No public CMS content was changed in this pass.

## Research Basis

- Google says important pages should be reachable through crawlable links and that anchor text should help users and Google understand the linked page.
- Google title-link guidance says Google can use the page title, main visual title, headings, prominent text, on-page anchor text and inbound anchor text to understand a page.
- Current Israeli inheritance/wills competitors cluster around inheritance orders, probate orders, wills, objections to wills, estate administration, heir disputes, estate division, capacity, undue influence, bank accounts, family farms and cross-border inheritance.

Sources:
- https://developers.google.com/search/docs/crawling-indexing/links-crawlable
- https://developers.google.com/search/docs/appearance/title-link
- https://www.yerusha.org.il/
- https://ygoldlaw.co.il/
- https://ody.co.il/
- https://guykamri-law.co.il/
- https://www.the-lawyer.co.il/

## Commercial Hub

- Target hub: `/inheritance-lawyer/`
- Live status: HTTP 200, indexable, H1 `עורך דין ירושה וצוואות`
- Role: commercial/legal-service destination for users who need a lawyer, not just general reading.

## Priority Support Pages

| Priority | URL | Evidence | Role | Safe next action |
| --- | --- | --- | --- | --- |
| P0 | `/inheritance/` | 15,808 impressions, 2 clicks, position 49.3 | Broad inheritance explainer | Add one factual contextual link to `/inheritance-lawyer/` after owner approval. |
| P0 | `/what-is-a-probate-order/` | 15,131 impressions, 0 clicks, position 51.9; currently clustered as family-law in GSC file | Probate-order intent | Reclassify in planning as inheritance/wills support and add factual hub link after approval. |
| P0 | `/will-probate-objection/` | 14,894 impressions, 11 clicks, position 59.4 | Objection to will / probate dispute | Add careful hub link with non-alarmist anchor text after legal/editorial approval. |
| P0 | `/international-inheritance-wills-lawyer/` | 14,123 impressions, 129 clicks, position 48.0; currently clustered as family-law in GSC file | Cross-border inheritance/wills | Keep live and support the hub, but do not let international intent outrank Israeli local-service intent. |
| P0 | `/inheritance-order/` | 11,447 impressions, 7 clicks, position 46.8 | Inheritance order | Add factual hub link; this is one of the cleanest support pages. |
| P1 | `/revocation-of-a-will-and-reviving-previous-will/` | 3,414 impressions, 9 clicks, position 56.7 | Will revocation/court dispute | Review content before linking because top queries are noisy. |
| P1 | `/will-and-testament/` | 1,484 impressions, 0 clicks, position 66.5 | Wills explainer | Improve title/meta/content later; can support hub after review. |
| P1 | `/maximize-an-inheritance/` | 293 impressions, 0 clicks, position 56.4 | Practical inheritance checklist | Possible support page, but lower priority than order/probate/objection pages. |

## Blockers And Risks

- `/will/` is HTTP 404/noindex live. The migration map shows many old inheritance court-ruling pages collapsed into `will` with `TARGET_SLUG_CONFLICT_NEEDS_REVIEW`. Do not recover or redirect `/will/` blindly.
- GSC rows include false positives because English "will" appears in non-inheritance slugs, especially `/how-much-will-a-criminal-defense-lawyer-cost/` and `/driver-with-36-valid-points-or-more-will-be-disqualified-from-holding-a-drivers-license/`. These must be excluded from inheritance planning.
- Several old Hebrew court-case URLs have GSC clicks/impressions and inheritance topics, but they are not clean evergreen service pages. They need case-law rewrite/merge decisions before public changes.
- Download files such as `/wp-content/uploads/2021/02/inheritance_he-1.doc` and `/wp-content/uploads/2020/09/צוואה.docx` appear in GSC. They may be useful assets, but they should not outrank the hub or become primary traffic destinations.

## Approved Public Edit Batch Candidate

Do only after owner approval for CMS edits:

1. `/inheritance/` -> link to `/inheritance-lawyer/` with a natural anchor such as `עורך דין ירושה וצוואות`.
2. `/inheritance-order/` -> link to `/inheritance-lawyer/` with anchor around getting legal help for inheritance order disputes or complex applications.
3. `/what-is-a-probate-order/` -> link to `/inheritance-lawyer/` around probate-order legal review.
4. `/will-probate-objection/` -> link to `/inheritance-lawyer/` around representation in objection or defense of a will.
5. `/will-and-testament/` -> link to `/inheritance-lawyer/` around drafting/checking a will, but avoid unsupported claims like "best" or "recommended".

## Live Verification

Googlebot-style live checks passed:

- `/inheritance-lawyer/` - 200, indexable, H1 `עורך דין ירושה וצוואות`
- `/inheritance/` - 200, indexable
- `/inheritance-order/` - 200, indexable
- `/will-and-testament/` - 200, indexable
- `/will-probate-objection/` - 200, indexable
- `/what-is-a-probate-order/` - 200, indexable
- `/maximize-an-inheritance/` - 200, indexable
- `/revocation-of-a-will-and-reviving-previous-will/` - 200, indexable
- `/international-inheritance-wills-lawyer/` - 200, indexable

Blocker:

- `/will/` - 404 and noindex. Needs route-history/duplicate-slug review before any recovery.

## Safety

Planning and live read-only audit only. No public CMS database row, article body, stored WordPress title/H1/meta, URL slug, redirect, taxonomy term, sitemap setting, lawyer profile, lead record, payment setting, GA4/GSC setting, wp-admin setting, or WordPress database value was changed.
