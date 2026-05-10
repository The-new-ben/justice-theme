# Integrated Launch Checklist

Date: 2026-05-10  
Status: MASTER CHECKLIST V1 - no launch actions executed

## Rule

Do not finalize content without checking design.  
Do not finalize design without checking content.  
Do not finalize URLs without checking internal links.  
Do not finalize internal links without checking clusters.  
Do not finalize clusters without checking GSC.  
Do not finalize pages without checking mobile, accessibility, schema, sitemap and analytics.

## Launch Layers

Layer 1 - Inventory and data:
- full content inventory exists.
- GSC/GSC-browser evidence added where available.
- GSC traffic risk marked UNKNOWN where not available.

Layer 2 - Content clusters:
- pillar/support roles assigned.
- no duplicate public pages.
- old useful content mapped before merge/rewrite.

Layer 3 - URL strategy:
- old URL -> new URL map.
- redirect map.
- no URL changes without approval.

Layer 4 - Template/design:
- homepage, article, category, lawyer directory, lawyer profile, search, 404 and footer reviewed.
- related-content block is semantic.
- logo and favicon/search-branding are final or explicitly marked temporary.

Layer 5 - Internal links:
- support -> pillar.
- pillar -> support.
- article -> lawyer/directory where relevant.
- no orphan important pages.

Layer 6 - Mobile/accessibility:
- mobile content equivalent to desktop.
- no horizontal overflow.
- keyboard/focus/forms checked.

Layer 7 - Schema/sitemap/canonical:
- schema matches visible content.
- sitemap contains canonical approved URLs.
- filter/query duplicates handled.
- robots/htaccess reviewed.
- favicon URL is stable, crawlable and aligned with WordPress Site Icon.

Layer 8 - Analytics:
- GA4 key events configured.
- GSC monitoring cadence documented.
- conversion and engagement reports ready.

Layer 9 - Business funnel:
- lawyer product ladder defined.
- lead routing fields connected.
- paid placement/trust rules approved.
- review/reputation product rules approved before any public ratings.

Layer 10 - Reviews/reputation:
- no fake reviews or ratings.
- Google Place ID and rating/count source verified.
- first-party review moderation workflow approved.
- privacy/confidentiality review policy exists.
- paid placement disclosure exists.
- `AggregateRating` schema disabled unless approved.
- Maya prototype contains no unsourced reputation claims.

## Current Status

PARTIAL:
- inventory, GSC maps, URL maps and content decisions exist.
- integrated design/content layer now has baseline docs.

BLOCKED / NOT VERIFIED:
- live admin sitemap/plugin settings.
- live event QA.
- live mobile screenshots after latest deployment.
- owner pricing/legal/advertising decisions.
- wp-admin Custom Logo and Site Icon selected media item.

## Next Controlled Batch

No URL/content migrations. Next safe batch is:
1. Verify homepage and `/lawyers/` design/SEO alignment.
2. Verify related-content output on one article/pillar page.
3. Verify mobile article/lawyer pages.
4. Update title/H1/meta recommendations without publishing changes.
5. Prepare owner approval list for first no-URL-change content/template improvements.
6. Verify final logo/favicon in browser tab, mobile header, footer and Google-search readiness.
7. Review the reputation module docs before adding any rating/review UI to lawyer cards or mini-sites.
