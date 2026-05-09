# LegalTech Platform Roadmap
Date: 2026-05-09

## VERIFIED
- The product direction is broader than a lawyer directory: intake, document automation, legal simulation, real estate/investment workflows, lawyer review, and paid self-serve membership.
- PsakDin has a public AI chat registration surface that positions the tool around case-law analysis, prediction/assessment, SMS verification, and a disclaimer that it is not legal advice.
- Comparable legal-tech products bundle intake, document drafting/review, attorney marketplace matching, direct booking, and paid templates.

## FIXED
- Added a CMS-backed `justice_legal_tool` content type for public LegalTech product pages.
- Added a private `justice_legal_request` content type for tool/intake requests.
- Added starter tool seeding for:
  - `ai-intake`
  - `demand-letter`
  - `family-agreement`
  - `real-estate-contract-review`
- Added public templates for `/legal-tools/` and individual tool pages.
- Added a homepage LegalTech gateway section connected to the CMS when tool posts exist.
- Added a form flow that can store LegalTech requests in WordPress admin.

## ASSUMPTION
- The active live plugin is still not verified. The new module was added to `justice-core`, `ultra-justice-engine`, and `ultra-justice` so whichever candidate is active can load the new content types after sync.

## BUSINESS MODEL
- Free AI/legal intake generates qualified leads.
- Paid document products create direct revenue.
- Lawyer-reviewed documents create high-value handoff opportunities.
- Lawyers can later pay for:
  - mini-site profile
  - featured placement
  - lead access
  - content publishing tools
  - document-review marketplace participation
  - subscription dashboard

## NEXT ACTIONS
1. Verify active plugin path on live.
2. Pull latest repo in Upress and visit `/wp-admin/` once to trigger starter LegalTech tool seeding.
3. Open `/legal-tools/` and each starter URL.
4. Submit one test request and verify it appears in WordPress admin under LegalTech Requests.
5. Add AI console UI and routing logic after the CPT/request foundation is verified.
6. Add payment architecture after pricing, tax, invoice, and lawyer-review workflow are defined.
