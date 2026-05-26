# Practice Taxonomy Money Page SEO - 2026-05-21

## Why This Was Done

The homepage now points its real-estate and labor-law guide/title actions to indexable practice-area hubs:

- `/practice-areas/real-estate-law/`
- `/practice-areas/labor-law/`

Those pages were technically reachable, but their visible H1s were too thin for competitive money searches:

- Real estate showed only `מקרקעין`
- Labor law showed only `עבודה`

That is weak for users and for Google because the homepage is now treating these pages as important category hubs.

## Research Used

Google Search Central says Google understands site structure from internal links, and important category or product pages should be reachable from prominent links such as homepage/category links. Google also says title links can be influenced by the page title element and prominent headings.

Sources:

- https://developers.google.com/search/docs/specialty/ecommerce/help-google-understand-your-ecommerce-site-structure
- https://developers.google.com/search/docs/appearance/title-link
- https://developers.google.com/search/docs/fundamentals/seo-starter-guide

## Repo Change

Files changed:

- `taxonomy-practice-areas.php`
- `inc/seo.php`

What changed:

- Added safe theme-level SEO overrides for `real-estate-law` and `labor-law`.
- Real estate hub now uses:
  - H1: `עורך דין מקרקעין ונדל״ן`
  - SEO title: `עורך דין מקרקעין ונדל״ן | מדריכים, מאמרים ועורכי דין`
  - Meta description focused on apartment purchase, sale, sale agreement, land registry, betterment tax and urban renewal.
- Labor-law hub now uses:
  - H1: `עורך דין דיני עבודה`
  - SEO title: `עורך דין דיני עבודה | זכויות עובדים, פיטורים ושימוע`
  - Meta description focused on dismissal, hearing, employee rights, salary, employment contract and pension.
- The generic taxonomy template still works normally for all other practice areas.
- No WordPress database value or CMS term was edited.

## Verification

Before deploy:

- `php -l taxonomy-practice-areas.php` passed.
- `php -l inc/seo.php` passed.
- `git diff --check` passed with only expected line-ending warnings.

Deployment:

- Commit `ae0b038` was pushed to `main`.
- uPress Git Manager pulled the theme.
- uPress Git log shows `ae0b038 Improve practice taxonomy money pages` as `HEAD -> main, origin/main`.

Live checks after deploy:

| URL | Status | H1 | Title | Noindex |
| --- | --- | --- | --- | --- |
| `https://jus-tice.co.il/practice-areas/real-estate-law/` | 200 | `עורך דין מקרקעין ונדל״ן` | `עורך דין מקרקעין ונדל״ן | מדריכים, מאמרים ועורכי דין` | No |
| `https://jus-tice.co.il/practice-areas/labor-law/` | 200 | `עורך דין דיני עבודה` | `עורך דין דיני עבודה | זכויות עובדים, פיטורים ושימוע` | No |

## Honest Completion Assessment

Material advancement:

- The homepage now sends authority to two stronger, indexable money pages instead of thin generic taxonomy labels.
- This improves SEO intent alignment for real-estate and labor-law lead demand.

Still blocked:

- No revenue earned yet.
- We still need real GSC/Analytics movement.
- Grow approval and product/payment mapping are still waiting.
- The pages still need deeper support articles and internal links to compete with established portals.

Estimated completion:

- Real-estate practice hub readiness: 42% -> 49%.
- Labor-law practice hub readiness: 38% -> 47%.
- Homepage-to-money-hub SEO chain: 78% -> 82%.

Owner-visible:

- Visit `/practice-areas/real-estate-law/` and `/practice-areas/labor-law/`.
- The top page headline and browser title should now use the stronger lawyer-search language.
