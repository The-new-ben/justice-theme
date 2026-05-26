# Medical Malpractice Support Link Fix - 2026-05-18

## Purpose

The live medical-malpractice money route is now reachable, but a follow-up journey check found theme-owned support links pointing to clean slugs that currently return 404.

This cycle fixes the theme-owned crawl path without changing public CMS article bodies, stored titles, URL slugs, redirects, noindex settings, taxonomy terms, or database rows.

## Research basis

- Google's crawlable-link guidance says important pages should be reachable through real `<a href>` links and that anchor text helps people and Google understand linked pages.
- Current Israeli medical-malpractice competitors cluster their pages around birth injury, pregnancy/birth care, diagnosis/treatment mistakes, surgery, anesthesia, expert medical opinions, causation, damages and limitation periods.

Sources reviewed:

- https://developers.google.com/search/docs/crawling-indexing/links-crawlable
- https://www.lotan-law.co.il/
- https://www.solarlaw.co.il/
- https://www.gutmanadv-law.co.il/
- https://www.medicallawyer.co.il/

## Live issue found

Googlebot-style checks:

| URL | Status | Decision |
| --- | ---: | --- |
| `/medical-malpractice-lawyer/` | 200 | Keep as commercial hub. |
| `/birth-malpractice/` | 404 | Stop linking publicly until route-history review. |
| `/pregnancy-malpractice/` | 404 | Stop linking publicly until route-history review. |
| `/diagnosis-malpractice/` | 404 | Stop linking publicly until route-history review. |
| `/birth-injury/` | 200 | Use as live birth-injury support. |
| `/anesthesia-medical-malpractice/` | 200 | Use as live anesthesia support. |
| `/surgical-errors-medical-malpractice/` | 200 | Use as live surgery support. |
| `/what-is-medical-malpractice-definition-examples/` | 200 | Use as live definition/examples support. |

## Implemented

Updated theme-owned support links in:

- `inc/practice-landing.php`
- `template-parts/sections/topic-clusters.php`
- `inc/pillar-pages.php`
- `inc/related-content.php`

Added traffic-priority checker guard:

- `tools/check-live-traffic-priority.mjs` now fails the medical-malpractice route if public HTML contains `/birth-malpractice/`, `/pregnancy-malpractice/`, or `/diagnosis-malpractice/`.

Updated deployment marker:

- `2026-05-18-medmal-support-links-v1`

## Verification plan

Before deployment:

- PHP lint for modified PHP files.
- Node syntax checks for modified live checkers.
- Static scan for the three blocked clean slugs in public theme output surfaces.
- `git diff --check`.

After uPress pull:

- `node tools/check-live-traffic-priority.mjs`
- `node tools/check-live-html-sitemap.mjs`
- `node tools/check-live-owner-phone.mjs`
- targeted Googlebot fetch for `/medical-malpractice-lawyer/`

## Remaining work

- Do not recover or redirect `/birth-malpractice/`, `/pregnancy-malpractice/`, or `/diagnosis-malpractice/` blindly.
- Review GSC and route history for the older Hebrew birth/pregnancy malpractice page that owns visible demand.
- Decide whether clean English slugs should become new controlled routes, redirects to existing live pages, or remain unavailable.

## Safety statement

This is a theme-owned crawl-path correction. It removes live public links to known 404 support URLs and replaces them with verified live support URLs. It does not change any CMS content record, URL slug, redirect, canonical, noindex rule, taxonomy assignment, lawyer profile, lead/payment setting, GA4/GSC setting, or WordPress database value.
