# Money Topic Link Canonical Cleanup - 2026-05-21

## Why This Was Done

After strengthening the homepage-linked real-estate and labor-law hubs, I checked whether other public template areas were still pointing at future or dead money-topic slugs.

I found three important future slugs that are not live today:

| URL | Live status before change | Current safe target |
| --- | --- | --- |
| `/real-estate-lawyer/` | 404 | `/practice-areas/real-estate-law/` |
| `/employment-lawyer/` | 404 | `/practice-areas/labor-law/` |
| `/personal-injury-lawyer/` | 404 | `/tort-lawyer/` |

I also found that `/medical-malpractice-lawyer/` is a live indexable controlled route, but some templates used `justice_theme_safe_public_link()` for it. That helper only checks published WP posts, so it could fall back to a filtered lawyer-directory URL instead of the live medical-malpractice hub.

## Research Used

Google Search Central says internal links should point to the canonical/preferred URL, and the same preferred URL should be used in internal links, sitemaps and canonical signals where possible. Google also says crawlable links with descriptive anchor text help users and Google understand the site.

Sources:

- https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- https://developers.google.com/search/docs/crawling-indexing/links-crawlable

## Repo Change

Files changed:

- `template-parts/layout/site-header.php`
- `template-parts/layout/site-footer.php`
- `template-parts/sections/featured-pillars.php`
- `template-parts/sections/topic-clusters.php`
- `template-parts/sections/homepage-intent-pyramid.php`
- `inc/not-found-rescue.php`
- `inc/city-practice-pages.php`
- `inc/pillar-article-seed.php`

What changed:

- Public real-estate links now point to `/practice-areas/real-estate-law/`.
- Public labor-law links now point to `/practice-areas/labor-law/`.
- Public personal-injury/torts links now point to `/tort-lawyer/`.
- Public medical-malpractice guide links now point directly to `/medical-malpractice-lawyer/`.
- Draft seed content now uses the current safe targets, so future draft generation does not create links to known dead/future slugs.

What did not change:

- No new public page was created.
- No redirect was added.
- No WordPress database value was changed.
- No CMS menu/database menu was edited.
- No payment, Grow, outreach or lawyer/customer data changed.

## Verification

Before deploy:

- PHP lint passed for:
  - `template-parts/layout/site-header.php`
  - `template-parts/layout/site-footer.php`
  - `template-parts/sections/featured-pillars.php`
  - `template-parts/sections/topic-clusters.php`
  - `template-parts/sections/homepage-intent-pyramid.php`
  - `inc/not-found-rescue.php`
  - `inc/city-practice-pages.php`
  - `inc/pillar-article-seed.php`
- `git diff --check` passed with only expected line-ending warnings.

Deployment:

- Commit `4c276b4` was pushed to `main`.
- uPress Git Manager pulled the theme.
- uPress Git log shows `4c276b4 Point money topic links to live hubs` as `HEAD -> main, origin/main`.

Live checks after deploy:

- Homepage no-cache response returned 200.
- Homepage includes:
  - `/practice-areas/real-estate-law/`
  - `/practice-areas/labor-law/`
  - `/tort-lawyer/`
  - `/medical-malpractice-lawyer/`
- Homepage no-cache response no longer includes:
  - `/real-estate-lawyer/`
  - `/employment-lawyer/`
  - `/personal-injury-lawyer/`
- Lost visitor route `/not-found-help/` returned 200 with `X-Justice-Route: not-found-rescue`.
- Lost visitor no-cache response includes the new real-estate, labor and tort hub links.

## Residual Finding

The homepage still exposes some older taxonomy term links through related-term output:

- `/practice-areas/real-estate/`
- `/practice-areas/personal-injury/`
- `/practice-areas/israeli-labor-law/`

Those URLs returned 200 in the live check, so I did not treat them as emergency 404 fixes. They should be reviewed later as a taxonomy alias/duplicate cleanup task.

## Honest Completion Assessment

Material advancement:

- The public navigation and homepage supporting sections now send users and Google toward current indexable money hubs instead of dead/future slugs or noindex filtered-directory fallbacks.

Still blocked:

- No revenue earned yet.
- GSC/Analytics impact is not visible yet.
- Grow approval/product mapping and actual paid lawyers remain blocked.
- Legacy taxonomy alias cleanup is still pending.

Estimated completion:

- Public money-link hygiene moved from 74% to 83%.
- Homepage-to-money-hub SEO chain moved from 82% to 85%.
- Overall first paid-lawyer readiness remains around 84% because payment approval and sales are still the bottleneck.

Owner-visible:

- Header topic strip, homepage practice cards, footer practice links and `/not-found-help/` should now guide users to the current live hubs for real estate, labor, torts and medical malpractice.
