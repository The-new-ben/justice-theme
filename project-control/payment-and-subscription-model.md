# Payment And Subscription Model

Date: 2026-05-10  
Status: MODEL DRAFT - no billing code or live payment changes executed

## Current Position

Existing planning exists in `project-control/payment-subscription-architecture.md`. This file translates it into a product model that connects to SEO, mini-sites, leads and reporting.

## Suggested Plans

Free profile:
- basic listing.
- name, practice areas, city, contact request.
- no paid placement claim.

Pro profile:
- richer profile.
- article connections.
- phone/WhatsApp tracking.
- basic monthly report.

Featured listing:
- higher visibility in approved relevant areas.
- must be marked honestly if paid/featured.
- no "recommended" or "best" claim unless independently justified.

Lead partner:
- lead routing by practice area/city.
- CRM status reporting.
- lead quality feedback loop.

Mini-site package:
- full profile page.
- custom sections.
- content cluster links.
- FAQ.
- source-approved bio.
- conversion tracking.

Content/SEO package:
- article briefs/drafts.
- legal/editorial review gate.
- internal links to profile and clusters.
- no duplicate content.

AI intake/CRM package:
- structured intake forms.
- lead classification.
- lawyer dashboard/reporting.
- no legal advice automation without legal/product approval.

Review / reputation package:
- Google review link and manual source verification.
- Jus-Tice review collection after moderation workflow exists.
- profile completeness score.
- review-source disclosure.
- reputation dashboard.
- monthly reputation report.
- AI review summary/reply drafts only after policy approval.

Status: STRATEGY ADDED / NOT IMPLEMENTED. See `project-control/reputation-product-roadmap.md`.

## Billing Method

Recommended implementation options later:
- WooCommerce Subscriptions if WordPress-native billing is chosen.
- External invoice/manual billing for early pilot lawyers.
- Stripe integration only after plan/pricing/legal terms are approved.

Status: BLOCKED OWNER DECISION. Do not implement payments yet.

## SEO/Trust Impact

Paid products must not distort SEO architecture:
- Pillar/support content remains public-value first.
- Featured placements must not replace relevance.
- Lawyer cards must clearly separate profile information from editorial/legal content.
- Paid links/placements should be handled carefully if any outbound lawyer-site links are added.

## Approval Gates

Before payment implementation:
1. Owner approves plan names/prices.
2. Legal/ethical advertising review.
3. Terms and privacy policy update.
4. Refund/cancellation policy.
5. Lead-quality definitions.
6. GA4 events and CRM fields confirmed.
7. Review/reputation policy approved if review features are included in paid plans.
8. Paid placement disclosure approved so reputation signals are not confused with advertising.

## 2026-05-11 Reputation Monetization Addendum

Status: ACCEPTED / NOT IMPLEMENTED.

Reviews and reputation should be sold as workflow and visibility value, not as fake trust:
- setup Google review/profile link;
- help lawyer complete source-backed profile fields;
- provide review request tools after real interactions;
- moderate first-party reviews;
- show source-disclosed ratings only when verified;
- provide dashboard/reporting;
- offer AI-assisted response drafts with human approval.

Never sell:
- fake reviews;
- guaranteed 5-star ratings;
- "top lawyer" status;
- undisclosed paid ranking;
- review schema/rich results as a guaranteed outcome.
