# Homepage Intent Structured Data - 2026-05-21

## Goal
Help Google and other crawlers understand the homepage money-intent pyramid as a visible list of the site's main legal paths.

## Research Used
Google Search Central says structured data should describe visible page content, should not be misleading, and JSON-LD is the recommended format when possible. It also notes that multiple visible items on one page can be marked up when they help Google understand the page.
Sources:
- https://developers.google.com/search/docs/appearance/structured-data/sd-policies
- https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data

## Change
The homepage money-intent pyramid now prints an `ItemList` JSON-LD block for the six visible intent cards:
- Criminal law
- Family and divorce
- Real estate
- Medical malpractice
- Labor law
- Personal injury and accidents

Each item uses the same visible card title, description and safe destination URL already rendered on the homepage. No ratings, reviews, rankings or unsupported claims were added.

## Verification Plan
- PHP syntax check for `template-parts/sections/homepage-intent-pyramid.php`.
- `git diff --check`.
- After deployment, inspect the live homepage JSON-LD and confirm an `ItemList` with six items exists.

## Completion Assessment
Homepage structured-data readiness moves from 55% to 62%. This does not create revenue by itself, but it strengthens the homepage as the SEO root for the practice-area money paths.
