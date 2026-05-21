# Homepage LegalTech Product Gateway - 2026-05-21

## Goal
Make the homepage more connected to money-producing products, not only articles and lawyer directory links.

## Research
- Google Search Central says Google understands site structure by analyzing relationships between pages through navigation and cross-page links. It also says linking important products from the homepage helps Google understand their importance.
- LegalZoom's official help content shows a product model around attorney-drafted templates, document creation, customization, e-signature, and account storage.
- FindLaw's Premium Profile marketing frames lawyer directory monetization around visibility, client contact paths, and search-result optimization.

Sources:
- https://developers.google.com/search/docs/specialty/ecommerce/help-google-understand-your-ecommerce-site-structure
- https://help.legalzoom.com/docs/creating-documents
- https://www.findlaw.com/lawyer-marketing/services/legal-directory-advertising/findlaw-premium-profile/

## Implemented
- Added the existing `legaltech-tools` section to `front-page.php`, after featured lawyers and before the lawyer acquisition CTA.
- Updated `justice_theme_public_path_is_published()` so future published `justice_legal_tool` CMS records can be treated as safe public destinations.
- Kept the `/legal-tools/` archive itself on the safe fallback path for now, because the current live route still redirects to the homepage before this deploy.

## Why This Matters
The homepage now exposes the LegalTech/document-intake product path as part of the main pyramid:

1. User finds a legal topic.
2. User sees lawyers and trust.
3. User sees tools/documents/intake as a product path.
4. Lawyer customers see the acquisition CTA after the user-facing value layer.

This supports three goals at once: qualified user demand, future legal-form/tool revenue, and better homepage internal linking.

## Verification
- `php -l front-page.php` passed.
- `php -l inc\template-tags.php` passed.
- `git diff --check` passed with only the existing Windows line-ending warning.
- Pre-deploy live check confirmed `/legal-tools/` currently redirects to the homepage, so the archive route was not promoted as safe yet.

## Honest Assessment
This does not create revenue by itself and it does not seed or publish any LegalTech CMS products. It makes the public homepage ready to show the product layer and keeps future CMS LegalTech links safer when real tool pages are published.

## Owner-Visible After Deploy
Homepage, below featured lawyers and above the lawyer acquisition section.

## Safety
Repo theme code/docs only. No public CMS database edit, no product record creation, no payment setting change, no Grow action, no 301 package change, no lawyer/prospect/lead/order record created, and no outreach sent.
