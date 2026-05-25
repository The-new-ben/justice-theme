# Lawyer Index CMS Management Controls - 2026-05-25

## What changed
- Added owner-facing columns to the `justice_lawyer` wp-admin list:
  - `Jus-Tice control`: visibility state, public/not-public card state, sponsored slot marker, basic-unclaimed marker, plan, subscription state, priority score, and a public-card link.
  - `Source / type`: professional type, source type, and source host link.
- Added list filters for batch management:
  - visibility: forced show, hidden, sponsored/priority, basic unclaimed, active subscription.
  - plan: free, pro, featured, lead_partner, full_service.
  - source type: public_index, import, manual, registration, seed.
  - professional type: lawyer, law_firm, rabbinical_advocate, mediator, notary, legal_supplier.

## Why it matters
This turns the competitor-inspired index from a static import into an owner-operable CMS surface. The owner can filter all public-basic/unclaimed cards, select many records, then use the existing bulk actions to hide, reveal, mark sponsored/top, or return profiles to automatic visibility.

## Research basis used this cycle
- LawReviews public pages emphasize search by field/area/name, client reviews, profile detail, and lawyer acquisition CTAs.
- Din public pages emphasize broad inventory, legal areas, cities, legal-service professionals, and directory depth.
- PsakDin remains useful as a model for content-authority plus legal-professional discovery.

## Safety boundary
- No competitor photos, reviews, star ratings, contact details, or profile copy were copied.
- No redirects, canonicals, noindex, sitemaps, taxonomies, payment provider settings, invoices, refunds, GSC, or GA4 settings were changed.
- This is wp-admin/theme functionality only; public display remains governed by the existing visibility and public-approval gates.

## Completion impact
- CMS control layer for indexed lawyer/professional cards: about 85%.
- Competitor inventory coverage: still about 10-15%; this cycle improves scaling safety and operating speed, not inventory volume.
- Revenue realized: still NIS 0 until a lawyer claims/upgrades and a real paid transaction is completed.
