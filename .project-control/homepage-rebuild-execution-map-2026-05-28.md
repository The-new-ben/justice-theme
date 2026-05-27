# Homepage Rebuild Execution Map

Date: 2026-05-28
Status: internal execution map only; not a public page update.

## Goal

Rebuild the homepage as a premium legal-help index that can create leads and support lawyer subscription conversion. The homepage should behave like a working legal marketplace entry point, not a generic WordPress page.

## Current Blocker

The latest pushed mobile-menu fix is still not live. Production serves:

- Marker: `2026-05-27-footer-trust-path-v1`
- Theme version: `1.1.66`

Expected after uPress Pull Git:

- Marker: `2026-05-27-mobile-menu-stable-toggle-v1`
- Theme version: `1.1.67`

No homepage rebuild should be reported as live until the deployment marker and visual QA pass.

## Competitor Mechanisms To Apply

Sources already logged in `.project-control/competitor-skill-source-log-2026-05-27.md`.

### LawReviews

Apply:

- Search by legal field, area, or lawyer name near the top.
- Popular legal fields immediately after first action.
- Long-form "how to choose a lawyer" content supporting the broad `lawyer` search intent.
- Real trust proof only: reviews, ratings, counts, and lawyer proof must be real or absent.

Avoid:

- Copying review language, profile text, or review counts.
- Displaying fake stars or fabricated lawyer proof.

### din.co.il

Apply:

- Dense legal index structure: fields, cities, guides, lawyer archive, content links.
- Homepage should route users into the right section quickly.
- Articles and lawyer index should reinforce each other.

Avoid:

- Creating many thin city/practice pages without anti-cannibalization checks.
- Exposing stale or broken URLs.

### Lawhive

Apply:

- Clear first intake question: what can we help with?
- Explain process and expected next step.
- Show status/update reassurance without promising legal advice or outcomes.
- Use realistic human/legal-help imagery.

Avoid:

- Promising flat fees, case management, dedicated lawyer, or fixed service unless verified in CRM/payment/legal operations.

### Enloya

Apply:

- Separate public client path and lawyer/supplier path.
- Make lawyer monetization visible but secondary.
- Keep "how it works" short and operational.

Avoid:

- Showing unverified country/count/service claims.

## Existing Homepage Inventory

Templates:

- `front-page.php`: currently public-first and includes hero, intake, ask-lawyer, legal-service flow, legal-help router, lawyer revenue strip, intent pyramid, practice grid, guide, lawyer cards, providers/tools, CTA, articles, trust.
- `page-home.php`: older alternate section order; still includes city grid, featured pillars, topic clusters, newsletter.

High-value sections already present:

- `template-parts/sections/hero.php`
- `template-parts/sections/customer-intake-strip.php`
- `template-parts/sections/ask-lawyer.php`
- `template-parts/sections/homepage-legal-help-router.php`
- `template-parts/sections/homepage-lawyer-revenue-strip.php`
- `template-parts/sections/find-lawyer-guide.php`
- `template-parts/layout/site-footer.php`

Risk:

- The homepage has many sections and can feel assembled instead of intentionally sequenced.
- `front-page.php` and `page-home.php` are not identical, so a live page-assignment change can alter section order.
- The owner sees the current site as too default/simple; next pass must improve hierarchy and visual confidence, not add more text.

## Target Homepage Order For First Code Pass

1. Header with stable mobile menu, WhatsApp, lawyer secondary action.
2. Hero with field/city/search/intake and realistic legal-help image.
3. Immediate "what happened?" router with 5 to 6 high-intent legal situations.
4. Popular fields and city shortcuts using existing approved routes only.
5. How choosing a lawyer works: preserve/enrich existing guide, keep homepage broad.
6. Ask-lawyer lead form and WhatsApp path.
7. Real lawyer/profile cards only; if not verified, use neutral directory CTA instead.
8. Lawyer-side monetization strip: profile/plans/manual invoice path, secondary.
9. Recent useful guides.
10. Trust/footer path with process, contact, privacy, disclaimers, city/field/lawyer links.

## CMS/Data Connections To Preserve

- Lawyer archive: `get_post_type_archive_link( 'justice_lawyer' )` with fallback `/lawyers/`.
- Ask-lawyer form posts to `admin-post.php` with existing `lead_area`, `lead_city`, `lead_urgency`, `lead_message`, and consent fields.
- WhatsApp surfaces must keep `data-whatsapp-surface` and UTM attributes.
- Lawyer registration path: `/lawyer-registration/`.
- Lawyer plans path: `/lawyer-plans/`.
- Lawyer dashboard path: `/lawyer-dashboard/`.
- Article/archive path: `/articles/`.
- Existing public-safe helper: `justice_theme_safe_public_link()`.
- Existing lead prefill helpers: `justice_theme_ask_lawyer_fallback_url()`, `justice_theme_render_lead_area_options()`.

## Image Requirements

Every major homepage surface must have reserved image dimensions or explicit aspect ratio.

Minimum:

- Hero: realistic legal-help image, not abstract decoration.
- Ask-lawyer visual: must load with stable dimensions.
- Lawyer cards: real photo, initials, or explicit fact-gated placeholder.
- Open Graph/thumbnail plan: one homepage social image and one default legal-help thumbnail.

Do not publish fake lawyer portraits as real people.

## Revenue Requirements

Public user path:

- Search/browse.
- WhatsApp or lead form.
- CRM capture or handoff record.
- Consent and routing hold rules remain active.

Lawyer path:

- Profile/account creation.
- Plan comparison.
- Manual invoice/payment fallback while Grow/Meshulam KYC is blocked.
- No promise of lead quantity or ranking.

## QA Gates Before Marking Live

- Deployment marker matches expected version.
- Mobile menu button does not move when opened at 390px width.
- Homepage has no horizontal overflow at 390px.
- Header, hero, form, footer, WhatsApp links, and lawyer CTAs are visible.
- No internal/business-plan text exposed publicly.
- No fake ratings, fake reviews, fake lawyer claims, fake customer counts.
- No redirect/canonical/noindex/sitemap/taxonomy changes.
- Desktop and mobile screenshots saved.
- Live review URL recorded.

## First Implementation Action After uPress Pull

If marker `2026-05-27-mobile-menu-stable-toggle-v1` is live:

1. Run mobile menu QA and record result.
2. Reorder/consolidate homepage sections so the first three screens are:
   - hero/search/intake,
   - public situation router,
   - ask-lawyer/WhatsApp or popular fields.
3. Keep lawyer revenue strip lower and secondary.
4. Verify desktop/mobile.
5. Commit, push, uPress Pull Git, and only then email if live.

## Honesty Statement

This artifact advances the homepage rebuild into an executable map. It is not a live homepage change, not a published CMS update, not a payment test, and not a new customer or lawyer acquisition.
