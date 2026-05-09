# English-Only URL / Slug Migration Plan
Date: 2026-05-09
Status: PLANNED - do not run blindly

## Rule

All public URLs and slugs must be English / ASCII only.

Hebrew is correct for:
- page titles
- headings
- breadcrumbs labels
- menu labels
- article content
- lawyer names and visible profile content

Hebrew is not allowed for:
- post slugs
- page slugs
- term slugs
- CPT rewrite slugs
- media filenames where possible
- menu URL paths

## Why This Matters

- Cleaner SEO architecture.
- Easier sharing, tracking, redirects, and debugging.
- Avoids duplicate encoded Hebrew URLs.
- Prevents breadcrumb/title/path confusion.
- Makes city/practice filtering stable: `/lawyers/?area=family-law&city=tel-aviv`.

## Current Verified English Slugs

- `articles`
- `lawyers`
- `practice-areas`
- `city`
- `advocate-maya-rotenberg`
- city filters such as `tel-aviv`, `jerusalem`, `haifa`
- practice terms in docs such as `family-law`, `criminal-law`, `traffic-law`

## NOT VERIFIED

- Live post/page slugs.
- Live term slugs.
- Live media filenames.
- Existing indexed URLs in Google.
- Existing redirects.
- Whether Hebrew slugs already receive traffic.

## Migration Rules

1. Export current URL inventory first.
2. Create a mapping CSV before changing anything.
3. Do not change titles to English; only slugs.
4. Every changed live URL gets a 301 redirect from old encoded/Hebrew URL to new English URL.
5. Avoid duplicate URL/title/breadcrumb patterns:
   - URL: English slug only.
   - H1: Hebrew title.
   - Breadcrumb label: Hebrew title/category label.
6. Flush rewrite rules after CPT/taxonomy slug changes.
7. Submit updated sitemap after migration.
8. Watch GSC for 404s and redirect errors.

## Required Mapping File

Create `project-control/url-slug-map.csv` with:

```
id,type,old_url,old_slug,new_slug,new_url,title,redirect_required,status,verified
```

## Suggested Slug Standards

Practice areas:
- family-law
- divorce-law
- criminal-law
- traffic-law
- real-estate-law
- labor-law
- inheritance-law
- tort-law
- medical-malpractice
- national-insurance
- immigration-law
- tax-law
- cyber-privacy-law

Pages:
- about
- contact
- join
- lawyer-registration
- editorial-policy
- advertising-disclosure
- privacy
- terms
- accessibility
- questions-and-answers
- legal-magazine

Lawyer profiles:
- advocate-maya-rotenberg
- Use `advocate-{first-name}-{last-name}` in English transliteration.

Articles:
- Use topic transliteration or English legal topic:
  - divorce-agreement
  - child-custody
  - child-support
  - prenuptial-agreement
  - property-division-divorce

## Breadcrumb Fixes

FIXED in repo:
- `single.php` no longer prints breadcrumbs a second time.
- `inc/breadcrumbs.php` now has explicit paths for:
  - articles
  - lawyer profiles
  - practice-area taxonomy
  - lawyer archive

Still required:
- Visual QA to confirm breadcrumbs do not overlap or duplicate on live.
- Confirm breadcrumb schema uses final canonical URLs after slug migration.

## Next Action

Do not bulk rename slugs until live inventory is available. First run the content inventory endpoint or WP-CLI export, then fill `url-slug-map.csv`.
