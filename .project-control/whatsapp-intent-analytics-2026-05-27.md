# WhatsApp Intent Analytics - 2026-05-27

## Active goal
Stop guessing whether visitors want legal help. Every public WhatsApp entry point should expose which surface created the intent: homepage hero, site header, ask-lawyer form, footer, floating button or lawyer card.

## What changed
- Added `whatsapp_surface` to the existing `whatsapp_click` analytics event.
- Added `data-whatsapp-surface` markers to the homepage hero, site header, ask-lawyer form, footer quick action and floating WhatsApp button.
- Reused the shared public WhatsApp URL helper inside the ask-lawyer section, so public WhatsApp links are normalized in one place.
- Bumped the deployment marker to `2026-05-27-whatsapp-intent-analytics-v1`.

## Why this matters for revenue
This does not create money by itself. It makes the next live iteration measurable:
- If hero WhatsApp gets clicks, homepage demand exists.
- If ask-lawyer WhatsApp gets clicks after form interaction, users want guided intake.
- If footer/floating clicks dominate, the site needs simpler above-the-fold wording.
- If lawyer-card WhatsApp clicks dominate, the directory path matters more than the public-help pitch.

## Verification
Pending after code checks:
- PHP lint for edited templates.
- JavaScript syntax check for analytics file.
- `git diff --check`.
- Live marker check after uPress Pull Git.

## Not changed
- No CMS/database content was published.
- No redirects, canonicals, noindex, sitemaps, taxonomies or URL migrations changed.
- No lead, lawyer, supplier, invoice, payment or customer WhatsApp message was created.
- No paid LLM API was used.

## Blockers
- uPress Pull Git is required before the public site can emit the new marker and analytics metadata.
- Grow/Meshulam readiness remains unresolved for real payment collection.

## Readiness to profit
Estimated readiness after this step: 46%.

## Honesty statement
This is measurement infrastructure, not revenue. It helps prove demand once live traffic interacts with WhatsApp, but it does not by itself bring a paying client or lawyer.
