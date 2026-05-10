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
