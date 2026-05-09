# Current Status - Jus-Tice.co.il
Date: 2026-05-09
Deployment model: GitHub repo sync to live WordPress. Do not build ZIP packages unless explicitly requested.

## VERIFIED
- Repo is available at `C:\Users\janana\jutice-theme` and tracks `origin/main`.
- Live homepage at https://jus-tice.co.il responds and is serving the Jus-Tice portal UI.
- Live `/lawyers/` responds and displays `justice_lawyer` profiles.
- Live `/lawyers/` currently includes `עו"ד מאיה רוטנברג`, but also still shows multiple demo profiles.
- Live profile links currently use Hebrew URL slugs; example observed: `/lawyers/%D7%A2%D7%95%D7%93-%D7%9E%D7%90%D7%99%D7%94-%D7%A8%D7%95%D7%98%D7%A0%D7%91%D7%A8%D7%92/`.
- Live homepage DOM snapshot did not show obvious casino/gambling terms in this check.
- Google Search Console URL opened to the public/about screen; `jus-tice.co.il` property access was NOT VERIFIED in this browser check.
- Local theme has required WordPress files: `style.css`, `index.php`, `functions.php`, `header.php`, `footer.php`.
- `assets/images/logo.png` exists in repo.
- Hero search form in local repo submits to the `justice_lawyer` archive with `area`, `city`, and `keyword` params.
- `latest-articles.php` no longer needs regular `post` content for homepage article feed in the intended architecture.

## FIXED IN THIS PASS
- Added tracked `page-home.php` because the live homepage is assigned to the `page-home.php` page template, not only `front-page.php`.
- Removed failed package artifacts from the previous interrupted ZIP attempt.
- Added a canonical source candidate at `justice-core/justice-core.php` for repo review.
- Fixed taxonomy ownership in legacy plugin folders: `city` now attaches to `justice_lawyer`; `practice-areas` now attaches to `articles`, `justice_lawyer`, and `post`.
- Fixed duplicate `</main>` in `archive-justice_lawyer.php`.
- Fixed one remaining English lead-form label: "Short description" -> Hebrew.
- Added canonical `justice-core/v1` REST aliases in the new `justice-core` candidate for health, site-state, plugin-registry, content inventory, spam candidates, duplicate titles, lawyers, and leads.
- Fixed lead REST reporting in the new `justice-core` candidate to read canonical lead meta keys (`visitor_name`, `visitor_phone`, `legal_area`, `source_url`).
- Homepage featured-lawyer section now queries only `advocate-maya-rotenberg` and does not show fake/demo lawyer cards.
- Lawyer profile meta model now includes initial mini-site fields for video, social links, homepage feature flag, review count, and average rating.
- `single-justice_lawyer.php` is now a richer lawyer mini-site template with hero, CTAs, video support, practice areas, related content, reviews placeholder, social links, and lead form.
- `lawyer-card.php` is now a richer premium card and avoids fake ratings or unsupported "top lawyer" claims.
- Homepage featured lawyer section now has a fallback lookup for live posts still using the Hebrew title while slug migration is pending.
- Seeder now assigns `advocate-maya-rotenberg` to the Maya Rotenberg seed/profile and generates English-only slugs for future seed profiles.
- Admin lawyer meta boxes now expose video URL, social URLs, homepage feature flag, approved review count, and approved average rating.
- Lawyer mini-site now reads additional CMS fields for headline, subheadline, approach, services, process, credentials, media links, FAQs, testimonials and final CTA.
- Homepage templates now include an editable WordPress page-content band through `template-parts/sections/home-page-content.php`, with a basic spam keyword guard.
- Self-serve/passive-income platform direction documented in `project-control/self-serve-lawyer-platform-plan.md`.
- Breadcrumbs fixed in repo: generic single posts no longer render breadcrumbs twice, and lawyer/article/archive breadcrumb hierarchy is explicit.
- Final URL decision documented: Hebrew content/UI with short clean English slugs only.
- URL strategy files created/updated: `url-strategy.md`, `slug-normalization-rules.md`, `url-migration-map.csv`, and legacy `url-slug-migration-plan.md`.
- Strategic goals file created at `project-control/strategic-goals.md`.
- Hebrew-slug audit file created at `project-control/url-hebrew-audit.csv`.
- SEO goal files updated around English-slug pillar architecture: `topic-clusters.csv`, `internal-link-opportunities.csv`, `cannibalization-map.csv`, `keyword-serp-plan.md`, `serp-research-log.csv`, and `title-audit.csv`.
- Legal pillar CMS controls added in `inc/pillar-pages.php`.
- Draft seeding added for the first pillar pages: `/divorce-lawyer/`, `/criminal-lawyer/`, `/real-estate-lawyer/`, and `/medical-malpractice-lawyer/`.
- Draft seeding added for the first 5 SEO article starters: divorce, criminal, traffic, real estate, and labor law. These are intentionally draft-only and marked for legal/editorial review.
- Practice-area taxonomy pages upgraded into richer hubs with lawyer cards, article cards, LegalTech tools, and related practice links.
- Lawyer self-registration funnel added. `/lawyer-registration/` can collect lawyer details and create draft/pending `justice_lawyer` profiles for review.
- Lawyer onboarding review workflow documented in `project-control/lawyer-onboarding-workflow.md`.
- Lawyer registration now sends an admin email and adds a WordPress admin review queue at `Lawyer Onboarding`.
- Owner CRM overview added at `Justice CRM` in WordPress admin for leads and LegalTech requests.
- Core practice-area term seeder added for the 10 main legal areas with Hebrew names and English slugs.
- Bundled `assets/images/logo.png` now renders as header/footer fallback when no custom logo is configured.
- Lawyer seeders hardened across all plugin candidates: demo profiles use canonical practice-area slugs where available, remain draft/unverified/inactive, are not homepage-featured, are not lead-routed, and are marked `SEED_DATA`.
- Added first LegalTech product layer in code: CMS-backed legal tools, private tool requests, homepage gateway, archive/single templates, and starter tools for AI intake, demand letter, family agreement, and real-estate contract review.
- Added `project-control/legaltech-platform-roadmap.md` to document the broader document automation, AI console, lawyer-review and passive-income product plan.

## NOT VERIFIED
- Active live plugin path and name.
- Whether live WordPress activates `ultra-justice`, `ultra-justice-engine`, or another Justice plugin.
- WordPress version, PHP version, active plugin list, and debug log.
- Whether GitHub sync deploys only the theme directory or also plugin directories.
- Whether `justice-core/` is recognized on live; it has not been activated live.
- Visual rendering quality after current local changes; no browser QA cycle has been run in this pass.
- Live homepage does not yet show Maya Rotenberg at the time of browser verification.
- Live `/lawyers/advocate-maya-rotenberg/` currently redirects to the homepage, indicating the live slug is not migrated yet.
- GSC property visibility, sitemap status, and performance data are NOT VERIFIED.
- The new homepage lawyer section was not visible before adding `page-home.php` because the live page assignment uses `page-template-page-home`.
- Lawyer self-registration and a front-end lawyer dashboard MVP are built in code. Billing, AI console, self-edit workflow and full approval automation are still NOT BUILT.
- Live `/legal-tools/` is NOT VERIFIED until GitHub/Upress sync is pulled and WordPress rewrites/cache are refreshed.
- Starter LegalTech tool posts are NOT VERIFIED on live; seeding runs on an admin dashboard visit after plugin code is active.
- SERP research is PARTIAL. Initial web sampling was recorded, but manual top-10 capture, People Also Ask, autocomplete, and GSC data are still NOT VERIFIED.
- Legal pillar draft pages are NOT VERIFIED on live; they seed only after Upress pulls the commit and an admin dashboard visit runs.
- Draft SEO article starters are NOT VERIFIED live; they seed only after Upress pulls the commit, the `articles` CPT exists, and an admin dashboard visit runs.
- Practice-area hub rendering is NOT VERIFIED on live after this pass.
- Lawyer registration page and submission handler are NOT VERIFIED live until latest code is pulled and `/wp-admin/` runs the page seeder.
- Lawyer dashboard page is NOT VERIFIED live; it seeds `/lawyer-dashboard/` after Upress pull and an admin dashboard visit.
- Lawyer onboarding admin queue and email notification are NOT VERIFIED live.
- Justice CRM admin overview is NOT VERIFIED live.
- Practice-area term seeding is NOT VERIFIED live; it runs after Upress pull and an admin dashboard visit, if the taxonomy is active.
- Header/footer logo fallback is NOT VERIFIED live after this pass.
- Hardened lawyer seeding is NOT VERIFIED live; it requires Upress pull and the active plugin/admin seeder path.

## STILL BROKEN / RISK
- Repo still contains duplicate plugin-like folders: `ultra-justice/`, `ultra-justice-engine/`, and new `justice-core/`.
- Do not delete the legacy plugin folders until live active plugin path is verified; otherwise GitHub sync could remove the currently active plugin and break CPTs.
- Live lawyer cards show city slugs such as `tel-aviv` in the public extract, which means terms or assigned values may not be user-facing Hebrew in every place.
- Live archive still exposes multiple demo lawyers publicly; this must be cleaned or moved to draft/private from WP admin/API after active plugin and content ownership are verified.
- Existing public demo lawyers on live may predate the hardened seeder and require manual/API cleanup after backup.
- The 5 article starters are not publication-ready; they are scaffolds for controlled content production, not finished legal articles.
- Existing live Hebrew slugs need a controlled English-slug migration with 301 redirects; repo changes prevent future seed slugs but do not automatically fix already-published URLs unless an approved migration runs.
- Live homepage extract shows "Content is protected !!", likely from a content-protection/accessibility/plugin layer; source and impact are NOT VERIFIED.
- Spam source remains NOT VERIFIED. Homepage may be hiding spam by querying only `articles`, but database cleanup is still required.

## NEXT BEST ACTION
1. Verify the exact GitHub sync target and active plugin path.
2. Decide whether `justice-core/` will replace `ultra-justice-engine/` on live or whether the legacy active folder must be renamed in a controlled migration.
3. Use admin/API access to set Maya Rotenberg's live slug to `advocate-maya-rotenberg` and draft/unpublish demo lawyers after backup.
4. Run PHP lint on changed files.
5. Pull latest repo in Upress and visit `/wp-admin/` once to trigger LegalTech starter tool seeding.
6. Verify `/legal-tools/`, `/legal-tools/ai-intake/`, and one test LegalTech request in admin.
7. Commit only repo-safe changes; do not create ZIPs.
8. Export live URL/slug inventory before changing any Hebrew slugs; fill `url-migration-map.csv`, then create approved 301 redirects for every changed URL.
9. Pull latest in Upress and visit `/wp-admin/` once to seed draft pillar pages, then review/publish `/divorce-lawyer/` first.
