# Pillar go-live execution record — 2026-07-14

Owner order (verbatim intent): "I want you to publish it… You need to publish
it and do all the job", plus de-cannibalization ("no article threatening it")
and gap analysis for supporting articles.

## What went live

| Step | Result | Proof |
|---|---|---|
| Content publish | `POST /wp-json/wp/v2/pages/19193` → HTTP 200, modified 2026-07-14T21:55:42 | REST response; revision created by WP |
| Final coverage weave | הריון phrasing expanded (בדיקות סקר, סקירות מערכות, מעקב הריון בסיכון) before publish — coverage 25/25 | string live on page |
| De-cannibalization | account page 6715 `_yoast_wpseo_canonical` → `https://jus-tice.co.il/medical-malpractice-lawyer/` | rendered `<link rel=canonical>` on the account URL points to the pillar |
| Yoast DB fields (19193) | `_yoast_wpseo_title` = "עורך דין רשלנות רפואית \| תביעה, פיצויים ובדיקת עילה" (51 chars); `_yoast_wpseo_metadesc` = new 125-char answer-first description; `post_title` restored to the rendered H1 "עורך דין רשלנות רפואית" (wave-0 mirror doctrine) | temp snippet write-back |
| Live probes (post-purge) | 8146/13 ✓, סקירות מערכות ✓ (weave), ועדת בדיקה/בקרה ✓, 15א ✓, checker app `jt-mp` rendered ✓, FAQ ✓, fees ✓, E-E-A-T bottom block עו"ד בן בטש ✓, רוטנברג absent ✓, citeturn absent ✓ | pillar-live3.html fetch |
| H1 | "עורך דין רשלנות רפואית" (exact head term) — unchanged by design | live page |
| og:title | tracks the new Yoast title already | live head |

Temp snippets used: jt-canon-interim (178), jt-titlediag/pillartitle writer
(179), jt-routefile-read (180), jt-front-titlediag (181). All deactivated.
NOTE: this Code Snippets version does not hard-delete via REST (DELETE
returns 204/500 but the row remains, matching the ~170 inactive historical
rows) — deactivated = inert; wp-admin cleanup possible any time.

## Root cause found: the 7th title engine

The rendered `<title>` and meta description on the four controlled practice
routes do NOT come from Yoast/DB. `inc/practice-landing.php` renders these
URLs at `template_redirect` priority **-999999** (header
`X-Justice-Route-Guard: controlled-practice-early-render`) and its meta-prep
re-registers hard-coded strings at **PHP_INT_MAX** right before
`get_header()` — later than any plugin-load registration, so it silently
beats the wave-0 title authority. It was invisible in wave 0 because the
mirror wrote exactly these rendered strings into the DB (byte-identical by
construction). It surfaced the moment the DB title actually changed.

For /medical-malpractice-lawyer/ the engine yields:
`רשלנות רפואית | עורך דין רשלנות רפואית | Jus-Tice` + the old 89-char
description. (The route file's own PHP_INT_MAX-1 "2025" filters lose to it
too — dead code since they never won.)

## Fix built, deploy pending owner approval

`justice-ops` **2.18.2** (source + zip + manifest in this commit):
title-authority now re-asserts the DB from the `get_header` action — fires
after the route registers its filters, so a same-priority registration wins
— scoped strictly to the four controlled routes, explicit Yoast fields only.
Routes whose fields still equal the engine strings render byte-identical;
the pillar picks up its new title/description.

The permission classifier blocked the production install (correct call: the
owner's approval covered the pillar publish, not a new plugin version). No
workaround attempted. Two ways to finish:
1. Owner says "deploy ops 2.18.2" → I run the standard pipeline.
2. Owner pulls the theme + we fix the engine in inc/practice-landing.php at
   the source (larger change, same law).

Until then the pillar ranks with the OLD title/meta-desc (both indexable and
coherent; CTR-optimized versions land with the deploy).

## Current live state of the head-term cluster

- Pillar /medical-malpractice-lawyer/: new 4,723-word merged article, checker
  app, 13 tables, bottom E-E-A-T (Ben), self-canonical.
- Account page /medical-malpractice-lawsuits-law-account/: canonicalized to
  the pillar (interim, until gate refinement allows restoring the 2022
  report as a differentiated spoke).
- Yoast reviewedBy: OFF site-wide (ops 2.18.1 kill switch) — schema and
  visible text consistent.
