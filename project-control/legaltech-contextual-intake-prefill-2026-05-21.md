# LegalTech Contextual Intake Prefill - 2026-05-21

## Why This Moved Next

The homepage LegalTech/product section is now visible, but its fallback path still lands on the generic homepage lead form while `/legal-tools/` remains gated. That creates avoidable friction: a visitor who clicked "demand letter" or "real estate contract review" should not have to restate that context from zero.

## Research Insight

Baymard's form-field research says forms convert better when irrelevant effort is removed, smart defaults are used, and prefilled values stay editable instead of becoming static text. For Jus-Tice, the useful translation is simple: when a user chooses a LegalTech product card, carry that product context into the intake form while keeping the field open for editing.

Source:
- https://baymard.com/learn/input-fields

## What Changed

- Added safe lead prefill helpers in `inc/lead-spam-guard.php`.
- Homepage and generic lead forms can now read `lead_area` and `lead_message` from a request, sanitize them, and display them as editable values.
- LegalTech cards now keep SEO-clean fallback links to `#ask-lawyer`, but attach data attributes for legal area, starter message, source keyword and UTM context.
- Existing analytics JavaScript now applies those data attributes to the homepage lead form on click and tracks `legaltech_tool_click`.

## Verification

- `php -l inc/lead-spam-guard.php` passed.
- `php -l template-parts/sections/ask-lawyer.php` passed.
- `php -l template-parts/forms/lead-form.php` passed.
- `php -l template-parts/sections/legaltech-tools.php` passed.
- `node --check assets/js/analytics-events.js` passed.
- `git diff --check` passed with only existing Windows line-ending warnings.
- Deployment and live checks are next in this cycle.

## Owner Impact

The owner can notice this on the homepage LegalTech section: choosing a product now prepares the lead form with the likely legal area and an editable starter message. This should make LegalTech/product clicks more likely to become useful leads.

## Safety

Repo theme code/docs only. No public CMS database page edited, no product record created, no 301 redirect package touched, no Grow action taken, no card charged, no payment setting changed, no lawyer/lead/prospect/order record created and no outreach sent.
