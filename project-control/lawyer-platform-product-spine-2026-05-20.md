# Lawyer Platform Product Spine - 2026-05-20

## Owner direction

The lawyer product must become a guided business system, not a long form plus messy wp-admin cleanup.

The target flow:

1. Lawyer lands on Jus-Tice.
2. Lawyer goes through a smart wizard.
3. The wizard collects identity, license, practice fit, cities, profile material, services, process, FAQs, media and reputation assets.
4. AI helps draft profile copy, FAQs, service descriptions and content ideas.
5. Nothing public changes until owner/license/ethics review.
6. Lawyer enters the dashboard and sees what is missing, what is live, what creates value and what to improve next.
7. Paid lawyers can later receive approved supplier offers and services through the platform.

## Research signal

- WordPress.com launched a native AI Assistant in 2026, but it is mainly a WordPress.com Business/Commerce editor and media workflow. It is useful inspiration, not a complete replacement for this self-hosted custom commercial flow.
- WordPress AI plugins such as AI Engine can provide chatbots, AI forms, content generation, embeddings and editor copilots. These are useful as optional engine pieces, but the core lawyer onboarding and approval workflow should stay inside Jus-Tice code.
- Google Business Profile APIs support reading/responding to reviews, insights and push notifications, but only for properly authorized business locations. For lawyers, the safe path is manual Google links first, then OAuth/API later when a lawyer grants access.
- Din has public supplier categories such as translation/notary/apostille and office-room listings for lawyers. This is a second revenue track: suppliers pay for access to lawyers, while lawyers pay for platform growth.

## Product decision

Do not wait for a generic "WordPress AI upgrade".

Build the first-party Jus-Tice lawyer operating system:

- Public wizard for acquisition.
- Lawyer dashboard for value and retention.
- Admin review queue for license/ethics/publication.
- Reputation system for Google links and first-party recommendations.
- Supplier pipeline for monetizing lawyer-service providers.
- AI later as a controlled assistant, not as the owner of publication decisions.

## Code shipped in this cycle

- Added `assets/js/lawyer-registration-wizard.js`.
  - Enhances the existing lawyer registration form into four guided steps.
  - Keeps the original backend submission intact.
  - Keeps no-JavaScript fallback intact because the original form still exists in the HTML.
- Updated `inc/enqueue.php`.
  - Loads the wizard only on `/lawyer-registration/`.
- Added `inc/lawyer-suppliers.php`.
  - New admin-only `justice_supplier` content type.
  - Tracks supplier category, contact, service area, source URL, status, revenue model, priority, offer summary and owner note.
  - Does not publish suppliers publicly.
- Updated `functions.php`.
  - Loads the supplier module.
- Updated `assets/css/premium-pass-3.css`.
  - Adds professional wizard layout and mobile behavior.

## Linear coordination

- `HAD-73` - Build AI-assisted lawyer onboarding wizard.
- `HAD-74` - Build lawyer supplier marketplace revenue pipeline.

## Completion assessment

- Lawyer onboarding UX: 35% -> 48%.
- Zero-owner-interference onboarding: 25% -> 35%.
- Supplier marketplace revenue track: 0% -> 18%.
- Admin money-system cleanup: 35% -> 40%.
- Automated AI profile drafting: 0% -> 10% defined, not built.

## Where the owner can notice after merge/deploy

- `/lawyer-registration/` should show a more professional step-by-step wizard instead of one long raw form.
- wp-admin should show a new `Suppliers` area under the lawyer onboarding/admin menu.

## Blockers

- Meshulam/Grow KYC/account recovery is still needed for automated recurring payments.
- AI drafting needs API/provider decision and prompt safety work.
- Supplier public exposure should wait for commercial terms and disclosure rules.
