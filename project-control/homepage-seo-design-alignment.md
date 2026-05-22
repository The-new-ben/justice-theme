# Homepage SEO And Design Alignment Review

Date: 2026-05-10  
Status: STRATEGY ADDED - no live template or content changes executed

## Principle

SEO and design must be planned together. The homepage is not only a visual landing page; it is the main entity page for Jus-Tice and the gateway that tells users and Google how the legal portal is organized.

## Target Role

The homepage should communicate:
- what Jus-Tice is: a Hebrew legal portal, legal information library, lawyer directory and intake platform.
- who it helps: people with legal problems, people researching before contacting a lawyer, and lawyers considering joining.
- how users move: problem -> practice-area hub -> article/pillar -> lawyer directory or lead form.
- why it is trustworthy: careful public language, no fake recommendations, visible disclaimers, real contact options and clear editorial structure.

## Required Above-The-Fold Structure

Recommended content/design order:
1. Brand/logo and clean primary navigation.
2. H1 that states the platform value in Hebrew.
3. Short explanation of how to find information or a lawyer.
4. Primary CTA to `/lawyers/`.
5. Secondary CTA to legal guides/articles.
6. Search or guided-entry component by legal issue, practice area and city.

## Required Homepage Link Targets

These links must be visible in normal HTML, not only loaded by script:
- `/lawyers/`
- `/divorce-lawyer/`
- `/family-lawyer/` or the approved family-law hub
- `/criminal-lawyer/`
- `/real-estate-lawyer/`
- `/medical-malpractice-lawyer/`
- `/personal-injury-lawyer/`
- `/traffic-lawyer/`
- `/employment-lawyer/`
- `/inheritance-lawyer/`

Status: PLANNED. Existing homepage links need template/content review before final launch.

## Design Sections That Support SEO

The homepage should include:
- Legal field hubs with concise Hebrew descriptions.
- Lawyer directory entry with no fake ranking/recommendation claims.
- Article library entry that distinguishes guides, court rulings, Q&A and updates.
- Lead/intake CTA that explains the next step without implying legal advice is already being provided.
- Lawyer onboarding CTA separated from the consumer journey.
- Trust/disclosure block explaining editorial limits and public-information purpose.
- Mobile-first layout with the same content and headings as desktop.

## Current Risk

NOT VERIFIED:
- Whether every major pillar link is live and points to the approved canonical URL.
- Whether mobile shows the same content and headings as desktop.
- Whether homepage cards ever show irrelevant/latest-only related content.
- Whether live sitemap/canonical signals match the homepage hub strategy.

## Next Action

Before changing live content:
1. Compare homepage template sections to this alignment checklist.
2. Confirm approved pillar URLs exist or are intentionally planned.
3. Add missing links through stable CMS/template fields.
4. Verify on mobile and desktop.
5. Add GA4 events to hero CTA, search, directory click and lawyer onboarding click.

Source notes:
- Google mobile-first guidance says mobile pages should contain equivalent primary content and headings to desktop pages.
- Google link guidance prefers crawlable `<a href>` links for internal discovery.

## 2026-05-10 Live Alignment Check

Evidence:
- `project-control/visual-evidence/integrated-home-desktop-2026-05-10.png`
- `project-control/visual-evidence/integrated-home-mobile-2026-05-10.png`
- `project-control/visual-evidence/integrated-visual-qa-2026-05-10.json`

LIVE VERIFIED:
- Homepage renders as a legal portal entry, not a plain blog.
- H1 is public-facing and user-oriented.
- Search/guided-entry component is visible.
- Primary CTA and lead/WhatsApp CTA are visible.
- Topic strip and homepage links include `/lawyers/`, `/divorce-lawyer/`, `/criminal-lawyer/`, `/real-estate-lawyer/`, `/medical-malpractice-lawyer/`, `/lawyer-registration/` and `/legal-tools/`.

GAPS:
- Missing or not detected in homepage links: `/personal-injury-lawyer/`, `/traffic-lawyer/`, `/employment-lawyer/`, `/inheritance-lawyer/`.
- Mobile first viewport is visually impressive but the sticky WhatsApp/lead CTA competes with the guided search area.
- Title still appeared live as a recommendation-heavy legacy title during this pass; `inc/seo.php` now has a code fix to override archive/search/plugin title leaks and homepage contextual title after deployment.

Status:
- VISUAL VERIFIED for current homepage.
- PARTIAL CUSTOMER-READY.
- Next safe action is no-URL-change homepage link/template refinement after deployment verification.

## 2026-05-11 Line-By-Line Review Overlay

Evidence:
- `project-control/homepage-line-by-line-review-2026-05-11.md`.
- `project-control/homepage-line-by-line-review-2026-05-11.csv`.

VERIFIED:
- Live title: `עורכי דין בישראל | מדריך עורכי דין, מאמרים משפטיים וייעוץ`.
- Live H1: `צריכים עורך דין או הכוונה משפטית? התחילו כאן`.
- Prior GSC evidence still makes the homepage the current broad legal portal / find-a-lawyer entry.
- Live scrape matches the shorter `front-page.php` flow more than the richer `page-home.php` flow.

REVIEW:
- Decide whether `front-page.php` or `page-home.php` is the authoritative public homepage structure.
- Replace taxonomy-count-driven quick links with approved curated pillar links.
- Review raw/duplicate practice labels before final launch.
- Hide or replace the empty lawyer showcase unless an approved real profile is ready.
- Replace latest-only article logic with curated cluster guides.
- Classify remaining live first-party `http://` links, `?page_id=` links and placeholder `#` links.
- Verify hero city filter values against `/lawyers/` city slug filters.
- Verify CRM/form delivery and GA4 events.

BLOCKED:
- No public homepage/template/content/link/title/H1/meta/menu/CMS action was executed by this review.

## 2026-05-11 Section-Order Proposal Overlay

Evidence:
- `project-control/homepage-section-order-proposal-2026-05-11.md`.
- `project-control/homepage-section-order-proposal-2026-05-11.csv`.
- `project-control/homepage-curated-pillar-link-map-2026-05-11.csv`.

VERIFIED:
- `front-page.php` should remain the short-term authoritative live homepage template unless the owner approves a template switch.
- `page-home.php` should be treated as a source of future approved modules, not a blind replacement.
- Live URL checks show some clean pillar slugs are safe 200 targets and some still resolve to the homepage.

REVIEW:
- Use curated homepage hubs instead of taxonomy-count ordering.
- Use safe fallbacks for `family-lawyer`, `criminal-lawyer`, `personal-injury-lawyer`, `employment-lawyer` and `inheritance-lawyer` until those pages are approved.
- Keep LegalTech, newsletter and richer B2B sections gated until routes, products, forms and analytics are real.

BLOCKED:
- No public homepage order, link, template or CMS change was executed by this proposal.

## 2026-05-11 Controlled Implementation Checklist Overlay

Evidence:
- `project-control/homepage-controlled-implementation-checklist-2026-05-11.md`.
- `project-control/homepage-controlled-implementation-checklist-2026-05-11.csv`.

VERIFIED:
- The next homepage batch is now defined as a small, reversible, no-URL-change execution path.
- The checklist keeps design, SEO signal, internal links, fake-data risk, mobile QA and rollback in the same workflow.
- `front-page.php` remains the proposed short-term live template until the owner approves otherwise.

BLOCKED:
- No public homepage implementation may run until the owner approves the checklist, section order and link map.
- URL, redirect, canonical, sitemap, robots/noindex, title/H1/meta, menu, CMS/database, CRM, review/rating and fake-data changes remain out of scope.

## 2026-05-22 Competitor-Aligned Overlay

Evidence:
- `project-control/homepage-competitor-aligned-strategy-2026-05-22.md`.
- `project-control/homepage-competitor-aligned-strategy-2026-05-22.csv`.

VERIFIED:
- Competitor alignment supports the existing `front-page.php` direction.
- The next homepage batch should be no-URL-change refinement, not a new layout.

DESIGN RULE:
- Each homepage section must have one job:
  - hero/search: directory entry;
  - intent/practice cards: controlled commercial/legal-field routing;
  - articles: curated cluster proof;
  - lawyer CTA: paid profile/reporting path;
  - trust: editorial and sponsored-placement boundaries.

BLOCKED:
- No public template, copy, card, visual, link, title/H1/meta, taxonomy, sitemap, URL or CMS change was executed by this overlay.

## 2026-05-10 No-URL-Change Link Safety Batch

CODE FIXED:
- Header topic strip now includes the missing broad lawyer-intent links for personal injury, traffic, employment and inheritance.
- Header, featured pillar cards and topic-cluster links now use safe primary/fallback routing.
- Planned English pillar URLs are used only if WordPress has published content at that path.
- If the clean pillar does not exist yet, the link falls back to an existing hub or filtered lawyer directory.

LIVE VERIFIED BEFORE FIX:
- `/criminal-lawyer/`, `/real-estate-lawyer/`, `/personal-injury-lawyer/`, `/employment-lawyer/` and `/inheritance-lawyer/` currently redirect to the homepage.
- `/traffic-lawyer/`, `/divorce-lawyer/`, `/family-law/`, `/criminal-law/`, `/medical-malpractice-lawyer/`, `/personal-injury-law/` and `/inheritance/` returned 200 in the public check.

NOT LIVE VERIFIED:
- The safer rendered links require live deployment/cache refresh before visual verification.

Status:
- CODE FIXED.
- NOT LIVE VERIFIED.
- NO URL CHANGES.
- NO REDIRECTS.

## 2026-05-10 Post-Pull Verification

LIVE VERIFIED:
- Homepage now serves `2026-05-10-contextual-title-v1`.
- Homepage title is now `עורכי דין בישראל | מדריך עורכי דין, מאמרים משפטיים וייעוץ`.
- `/lawyers/` title is now `מדריך עורכי דין בישראל | Jus-Tice`.
- Topic strip renders the expanded legal-intent links.

VISUAL VERIFIED:
- `project-control/visual-evidence/homepage-post-pull-safe-links-desktop-2026-05-10.png`
- `project-control/visual-evidence/homepage-post-pull-safe-links-mobile-2026-05-10.png`
- `project-control/visual-evidence/lawyers-post-pull-title-fixed-desktop-2026-05-10.png`
- `project-control/visual-evidence/lawyers-post-pull-title-fixed-mobile-2026-05-10.png`

FOLLOW-UP CODE FIXED / NOT LIVE VERIFIED:
- Traffic fallback now avoids `/traffic-law/` because it redirects to homepage.
- LegalTech/AI links now fall back to `/#ask-lawyer` until actual `/legal-tools/` pages are published.
