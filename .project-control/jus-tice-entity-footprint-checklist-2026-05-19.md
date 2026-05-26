# Jus-Tice Entity Footprint Checklist - 2026-05-19

## Purpose

Build the public authority footprint around Jus-Tice so Google, users, lawyers, and AI systems can understand that Jus-Tice is a real legal portal/business entity, not only a collection of articles.

This supports:

- E-E-A-T for legal/YMYL content.
- Google Business / Maps visibility where eligible.
- Organization schema `sameAs` expansion.
- Lawyer trust and commercial conversion.
- Safer social profile growth without inventing unverified claims.

## Research Signal

Google Business Profile guidelines require the profile to represent the business accurately as it is known in the real world. Service-area businesses can create a profile, but virtual offices are not allowed unless staffed during business hours. Google says local ranking is based mainly on relevance, distance, and prominence.

For structured data, Schema.org `Organization.sameAs` should point to reference pages that unambiguously identify the organization. Do not output social/profile URLs in schema until those profiles are live and verified.

Sources:

- Google Business Profile representation guidelines: https://support.google.com/business/answer/3038177
- Google local ranking guidance: https://support.google.com/business/answer/7091
- Schema.org Organization sameAs: https://schema.org/Organization

## Locked Public Entity Data

| Field | Value | Status |
|---|---|---|
| Public name | Jus-Tice / Jus-Tice.co.il | Use consistently |
| Website | `https://jus-tice.co.il/` | Verified |
| Phone | `0525101555` | Owner supplied |
| Country | Israel | Verified |
| Category | Legal services / legal portal | Needs Google category selection |
| Address | Not approved for public use yet | Owner decision needed |
| Service area | Israel | Needs owner confirmation |
| Logo | Current scales/favicon direction | Needs final brand asset approval |

## Execution Order

### 1. Entity Data Lock

Before opening profiles, decide:

- Exact public business name.
- Whether Jus-Tice has a staffed public address or should be treated as service-area/online-first.
- Business email.
- Final logo/favicon asset.
- Short Hebrew and English business descriptions.
- Service categories and priority practice areas.

### 2. Google Business Profile

Owner/admin task:

- Create or claim the profile from a Google account controlled by the business.
- Use the real business name only.
- Use the real phone `0525101555`.
- Link to `https://jus-tice.co.il/`.
- If there is no staffed public office, do not invent a public address.
- Choose the closest allowed category.
- Add service areas only if accurate.
- Add logo, cover image, and real screenshots/photos where allowed.
- Add services matching the website language: lawyer matching, legal guides, legal portal, legal intake.
- Do not add fake offices, fake reviews, fake opening hours, or "best/top" claims.

Blockers:

- Google may require verification.
- If address/service-area eligibility is unclear, pause for owner decision.

### 3. LinkedIn Company Page

Recommended first social/entity profile:

- Create `Jus-Tice` company page.
- Link website.
- Use same logo/name/description.
- Add Israeli legal portal positioning.
- Add first posts from approved website content only.
- Link from LinkedIn back to the website.

Why first: LinkedIn is a strong professional corroboration point for lawyers and business development.

### 4. Optional Social Profiles

Create only after owner approves:

- X/Twitter: short updates, legal-tech and legal-guide distribution.
- Facebook: Israeli audience and lawyer/client trust surface.
- YouTube: future short legal explainer videos.

Do not create abandoned profiles. Empty social accounts can look weaker than no account.

### 5. Website Trust Pages

Before adding social links to schema:

- `/about/`
- `/about/editorial-policy/`
- `/about/ben-batash/` after verified owner data.
- Enhanced Maya lawyer profile with verified external links.
- Contact page with the same phone and safe contact path.

### 6. Schema Rollout

Only after profiles are live and verified:

- Add `sameAs` to the homepage Organization / LegalService schema.
- Include only official profiles controlled by Jus-Tice.
- Keep profile URLs stable.
- Re-run Rich Results / schema validation.

## Do Not Do

- Do not create fake physical locations.
- Do not expose a residential/private address without explicit owner approval.
- Do not add `sameAs` links before profiles exist.
- Do not create fake reviews or testimonials.
- Do not claim "best", "leading", "top", or guaranteed outcomes.
- Do not use lawyer names in social bios unless their role and approval are verified.
- Do not store credentials or recovery codes in the repo.

## Linear Coordination

- Parent: HAD-59.
- Entity footprint issue: HAD-61.
- This checklist should be attached to HAD-61 and used as the implementation gate.

## Done Criteria

- Owner confirms exact entity data.
- Google Business Profile created/claimed or blocker documented.
- LinkedIn company page created or blocker documented.
- Optional profiles approved or rejected.
- Organization sameAs list prepared but not deployed until profiles are live.
- Schema validation plan documented.
- No unverified public claims added.
