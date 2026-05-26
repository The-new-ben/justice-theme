# Supplier Marketplace Prospect Research And Exposure Rules - 2026-05-22

## Status

VERIFIED_RESEARCH / VERIFIED_PLANNING / READY_FOR_OWNER_ENTRY / NOT LIVE VERIFIED / NO OUTREACH

This packet completes the next T370 repo-side step: a first 30-prospect supplier research list, a safer outreach script and strict dashboard exposure rules.

It does not create live `justice_supplier` records, publish a supplier page, contact vendors, expose offers to lawyers, change lead routing, change payment settings, change URLs, touch wp-admin, or deploy to uPress.

## Operating Decision

Supplier monetization should stay admin-only until the owner has manually verified:

- The supplier is real and reachable from its own public site or approved public contact channel.
- The supplier actually serves Israeli lawyers or law-firm operations.
- The category has real lawyer demand or is strategically useful for paid lawyers.
- Commercial terms and disclosure language are written.
- No lawyer details are sent without a separate owner-reviewed consent step.

The public-source rows below are prospect discovery evidence, not endorsements.

## Public Source Research Base

VERIFIED_RESEARCH sources reviewed on 2026-05-22:

- PsakDin public provider/profile pages for legal translation, legal support services and notary-adjacent work.
- Din public office rental pages for lawyer office and meeting-room listings by region.
- Public company/service pages for legal marketing, legal tech, legal courier and expert/private-investigation providers.

Important: do not scrape competitor listings into outreach automation. Use the source URL to identify a candidate, then verify the supplier through its own site, phone, email, LinkedIn or owner-approved channel before changing status from `research` to `outreach`.

## 30 Prospect Import Queue

Full CSV: `project-control/supplier-marketplace-prospect-research-2026-05-22.csv`

Summary by category:

| Category | Count | First action |
| --- | ---: | --- |
| translation_notary | 8 | Verify direct contact channel and service area |
| office_space | 6 | Use Din as source pool, then contact listing owners manually |
| legal_marketing | 5 | Verify legal advertising compliance posture before outreach |
| legal_tech | 5 | Verify law-firm fit, privacy posture and integration model |
| courier_filing | 3 | Verify court filing coverage and service documentation |
| expert_witness | 3 | Verify credentials, conflict handling and legal-process fit |

## Dashboard Exposure Rules

RULE 1 - Admin-only default:
Every supplier starts as internal CRM data only. No dashboard offer, public card, public page, email campaign, WhatsApp message or automatic matching is allowed at `research`, `outreach`, `contacted` or `negotiating` status.

RULE 2 - Minimum status:
A supplier can be considered for lawyer-dashboard exposure only when `supplier_partnership_status = approved`.

RULE 3 - Owner evidence:
Before approval, owner notes must include direct contact verification, service category, service area, commercial model, response-time expectation and why this supplier is useful for lawyers.

RULE 4 - Disclosure:
If the revenue model is `monthly_listing`, `lead_fee`, `affiliate` or `sponsorship`, the lawyer-facing UI must disclose commercial placement. Do not use "recommended" for paid placement.

RULE 5 - Safe labels:
Allowed early labels: "Provider option", "Vetted service option", "Checked provider after owner review". Avoid "best", "recommended", "official partner" or "exclusive" unless a formal policy and evidence exist.

RULE 6 - No automatic data transfer:
Lawyer dashboard supplier requests stay inside Jus-Tice until the owner approves an introduction. A supplier never receives lawyer name, phone, email, profile URL or case facts automatically.

RULE 7 - Category minimum:
Do not expose a public marketplace category until at least 3 suppliers in that category are approved, or until the owner explicitly approves a single-provider pilot with disclosure.

RULE 8 - Sensitive categories:
Expert witnesses, medical experts, private investigators, finance/payment providers and legal-tech vendors require extra review for conflicts, privacy, professional licensing and claim language.

RULE 9 - No public SEO page yet:
Do not create supplier category pages, indexable supplier URLs, schema, redirects, canonical/noindex rules or sitemap entries until the owner approves the marketplace disclosure policy.

RULE 10 - Measurable pilot:
The first live exposure should be a private dashboard pilot for logged-in lawyers only. Success metrics: request count, response time, supplier follow-up quality, lawyer satisfaction and owner workload.

## Safer Outreach Script

Subject:

Provider pilot for Israeli lawyers on Jus-Tice

Message:

Hi {{name}},

I am building Jus-Tice, a platform for Israeli lawyers and legal clients.

We are preparing a small, reviewed provider network for services lawyers already need, including {{category}}.

This is not an open directory and we are not publishing suppliers automatically. First we verify fit, service area, response time and commercial terms. Only then can a provider be considered for owner-reviewed lawyer introductions.

Would you be open to a short call to check whether your service fits law firms and whether a pilot makes sense?

Ben

Follow-up:

Quick follow-up. The first provider list will stay limited by category and will not be exposed publicly before quality and disclosure rules are ready.

If selling to Israeli lawyers is relevant for you, send the best contact person and I will explain the pilot.

## Owner Entry Workflow

1. Open wp-admin `Suppliers`.
2. Add only candidates the owner wants to evaluate.
3. Set `supplier_partnership_status = research`.
4. Copy the source URL into `supplier_source_url`.
5. Leave contact fields empty until direct contact is verified outside competitor source pages.
6. Add owner note: source reviewed, direct contact pending, category fit, risk notes.
7. Move to `outreach` only after direct contact verification.
8. Move to `approved` only after commercial/disclosure review.

## What Can Wait

- Public supplier pages.
- Public supplier marketplace navigation.
- Affiliate tracking.
- Sponsored-category UI.
- Automated supplier matching.
- Supplier CRM import automation.
- Supplier schema.
- Indexable supplier URLs.

## What Must Not Be Skipped

- Direct contact verification before outreach.
- Owner approval before any lawyer introduction.
- Commercial disclosure for paid placement.
- No automatic sharing of lawyer request data.
- Conflict/licensing/privacy review for sensitive categories.
- Clear internal source URL on every supplier record.

## Completion Assessment

- Supplier strategy: 55% -> 68%.
- Supplier CRM: 45% -> 52%.
- Supplier demand capture: 35% unchanged.
- Supplier outreach readiness: 50% -> 72%.
- Supplier revenue live: 0% unchanged.

## Next Step

Owner should choose the first 10 candidates from the CSV and manually add them to wp-admin `Suppliers` as `research` records after direct source/contact verification.
