# Live Journey Health Snapshot - 2026-05-18 17:41 Asia/Jerusalem

## Purpose

The owner asked for repeated hands-on checking of the public user journey, lawyer customer journey, Googlebot journey, indexing signals, and technical crawl paths. This snapshot records the latest live post-fix state after the medical-malpractice crawl fixes and clean-slug review.

This cycle made no public CMS/database or deployable theme change.

## Research basis

- Google title/snippet guidance: pages should have clear, unique title/snippet signals that match the visible page content.
- Google LocalBusiness/Organization guidance: the primary telephone/contact data should be consistent and represent the primary customer contact method.
- Google crawlable-link guidance: important pages should be reachable through real crawlable links.

Sources reviewed:

- https://developers.google.com/search/docs/appearance/snippet
- https://developers.google.com/search/docs/advanced/appearance/good-titles-snippets
- https://developers.google.com/search/docs/appearance/structured-data/local-business
- https://developers.google.com/search/docs/crawling-indexing/links-crawlable

## Live checks run

| Journey | Tool | Result | Notes |
| --- | --- | --- | --- |
| Public user journey | `tools/check-live-journeys.mjs` | PASS | Homepage lead path, lawyer directory and sample article path returned 200. |
| Lawyer customer journey | `tools/check-live-journeys.mjs` | PASS | `/lawyer-registration/` and `/lawyer-registration/?plan_interest=pro` returned 200. |
| Googlebot journey | `tools/check-live-journeys.mjs` | PASS | `sitemap_index.xml` and `robots.txt` returned 200. |
| Commercial route journey | `tools/check-live-traffic-priority.mjs` | PASS | Homepage, sitemap, articles, family, medical malpractice, real estate, criminal, traffic, inheritance, contact and about paths passed. |
| Technical reachability | `tools/check-live-reachability.mjs` | PASS | DNS, homepage, HTML sitemap, REST API, robots, XML sitemap, phone/WhatsApp, canonical all passed. |
| Breadcrumb schema | `tools/check-live-breadcrumb-schema.mjs` | PASS | Checked 1,299 URLs; 0 needed review. |

## Key live confirmations

- Homepage returned 200 and exposes `0525101555`.
- WhatsApp target remains `972525101555`.
- No legacy/mock phone numbers were detected on the homepage.
- `/site-map/` returned 200 and remains linked from the homepage/footer.
- `/medical-malpractice-lawyer/` remains 200 after the support-link fix.
- `/family-law/`, `/traffic-lawyer/`, `/criminal-defense-attorney/`, `/inheritance-lawyer/`, and `/real-estate-lawyer-guide/` all pass the commercial-route checker.
- `/contact/` and `/about/` are currently 200.
- Breadcrumb schema is currently clean across the 1,299 URL scan.

## Current traffic-risk interpretation

The immediate technical blockers found earlier are not reproducing in this snapshot. The next traffic recovery work should move from "basic crawl breakage" into evidence-led content/GSC work:

1. Pull GSC page-level clicks and impressions for the medical-malpractice birth/pregnancy/diagnosis candidates.
2. Continue corona legacy review with GSC/backlink evidence before pruning.
3. Compare homepage and money-page title/snippet clarity against the query map before changing public copy.
4. Keep running this journey snapshot after each public deploy and at least every few cycles.

## Safety statement

Read-only live audit and repo documentation only. No public CMS database row, article body, stored WordPress title/H1/meta, URL slug, redirect, noindex, canonical, taxonomy term, sitemap setting, lawyer profile, lead record, payment setting, GA4/GSC setting, wp-admin setting or WordPress database value was changed.
