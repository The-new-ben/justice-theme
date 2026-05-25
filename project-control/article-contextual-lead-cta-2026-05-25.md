# Article Contextual Lead CTA - 2026-05-25

## What Changed
- Added a shared article lead-context helper in `inc/template-tags.php`.
- Updated both public article templates:
  - `single.php` for regular posts.
  - `single-articles.php` for the custom `articles` post type.
- Added restrained styling for the contextual article CTA in `assets/css/main.css`.

## Why This Matters
The owner raised a valid SEO and conversion concern: article pages should not feel like generic marketing before the legal content. The change keeps the legal article content first, preserves the editorial note, and turns the lead path into a contextual post-content action.

For example, divorce/family-law article signals now map into the same `family-law` lead path instead of being treated as unrelated topics. Other mapped lead paths include criminal, real estate, medical malpractice, personal injury, traffic, labor, inheritance and Thailand/international.

## Revenue Impact
- More qualified lead handoff from article readers to the homepage `#ask-lawyer` form.
- Better attribution through `utm_source=article_contextual_cta`, `utm_medium`, `utm_campaign`, `utm_term`, and `source_keyword`.
- Realized revenue remains NIS 0 until a real lawyer payment, invoice, subscription, lead delivery and follow-up are completed.

## Research Basis
- Google Search Central guidance emphasizes helpful, reliable, people-first content and warns against search-engine-first content.
- Google's SEO Starter Guide emphasizes useful content and site organization that helps users and search engines understand pages.
- Applied here: no lead box is inserted before the article body; the conversion path is contextual, modest, and tied to the legal topic.

Sources:
- https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- https://developers.google.com/search/docs/fundamentals/seo-starter-guide

## Verification
- `php -l inc/template-tags.php` passed.
- `php -l single.php` passed.
- `php -l single-articles.php` passed.
- Pending after deployment: verify an `articles` page and a regular post show a contextual post-content CTA and that the generated link carries the article lead context.

## Safety
- Repo template/CSS/docs only.
- No live CMS database edit.
- No public content migration.
- No competitor lawyer/profile import.
- No competitor photo, review, rating, contact detail or profile text copy.
- No payment, invoice, refund, recurring billing, email, redirect, canonical/noindex, sitemap, taxonomy, GSC, GA4 or provider setting changed.
