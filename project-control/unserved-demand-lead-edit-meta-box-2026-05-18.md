# Unserved Demand Lead Edit Meta Box - 2026-05-18

## Why This Exists

The owner is receiving real demand in areas where Jus-Tice does not yet have a paying lawyer partner, such as Thailand-related legal requests. If those calls stay only in phone history or memory, they cannot become SEO priorities, lawyer recruitment proof, or subscription revenue.

Current intake best practice from legal CRM systems is to keep lead source, practice area, stage/status, urgency, follow-up deadline, and conversion/revenue status together on the lead record. This cycle applies that to the Jus-Tice `justice_lead` workflow without changing the public site.

## Implemented

- Added a `Jus-Tice Unserved Demand` meta box to the admin edit screen for each `justice_lead`.
- Made the following fields editable directly on the lead record:
  - Service status.
  - Unserved reason.
  - Revenue status.
  - Urgency.
  - Source channel.
  - Requested area.
  - Country / jurisdiction.
  - City.
  - Language.
  - Follow-up deadline.
  - Source URL.
  - Recruitment priority.
  - Owner next action.
- Added nonce, autosave protection, and edit capability checks.
- Added allowlists for service status, unserved reason, revenue status, urgency, and source channel.
- Mirrored saved `matter_urgency` to the existing `urgency` meta field so older lead views and reports remain compatible.

## Business Value

This turns an unsupported request into a managed business object:

1. Capture the exact request.
2. Mark why Jus-Tice could not serve it yet.
3. Set the next follow-up action.
4. Group it later into proof for recruiting a paying partner lawyer.
5. Preserve source/channel data for SEO and marketing decisions.

The key shift: "I got a call for a Thailand lawyer" becomes "we received N Thailand-lawyer requests from phone/organic/form, with high urgency count and follow-up status, so we can sell a Thailand/international-law partner seat."

## Safety

- Admin-only.
- No public form behavior changed.
- No live WordPress database rows changed.
- No lawyer profile, payment, URL, redirect, canonical, noindex, sitemap, GA4, GSC, or uPress deployment changed.
- No user-facing promise to clients or lawyers was added.

## Verification

- PHP lint clean: `inc/unserved-demand.php`.
- PHP lint clean: `inc/lead-routing.php`.
- PHP lint clean: `functions.php`.
- Git whitespace check clean.
- Live journey checker passed for homepage lead path, lawyer directory, sample article, lawyer registration, plan-intent registration, sitemap index, and robots.txt.

## Sources Consulted

- Clio lead management best practices for law firms: source/stage/response tracking.
- Lawmatics intake pipeline guidance: structured pipeline stages and matter intake fields.
