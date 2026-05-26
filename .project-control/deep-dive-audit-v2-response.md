# Deep-Dive Audit V2 Response
Date: 2026-05-10

## Summary
The V2 audit is materially useful and mostly accepted. The strongest finding is not visual polish; it is trust integrity: old demo lawyer records can appear public and look real. The repo now has a public visibility gate so customer-facing lawyer pages prefer approved/verified real profiles and block seed/demo/testing profiles from rendering.

## Findings Response
| Finding | Status | Code verified | Live verified | Action |
|---|---|---:|---:|---|
| Fictional lawyers shown as real | ACCEPTED / CODE FIXED | YES | NO | Added `justice_theme_lawyer_profile_is_public_approved()` and used it on lawyer archive and single lawyer pages. Existing database records still need wp-admin cleanup. |
| Duplicate taxonomy names | ACCEPTED | NO | NO | Requires live taxonomy inventory and merge map before changing terms. |
| English text on Hebrew pages | PARTIALLY ACCEPTED | YES | NO | Search/404 were already Hebrew in repo; remaining legacy templates still need a full i18n sweep. |
| "Archive" in lawyer OG description | ACCEPTED / CODE FIXED | YES | NO | Added explicit lawyer-directory meta description and OG tags. |
| Hebrew URL slugs for lawyers | ACCEPTED | PARTIAL | NO | Maya slug migration exists in repo; live Permalink Manager conflict still blocks verification. |
| Legacy CPTs active | ACCEPTED | NO | NO | Must not deregister until active plugin and live content ownership are verified. |
| No filter bar on `/lawyers/` | PARTIALLY ACCEPTED | YES | NO | Filter bar exists in repo; live may be behind or using a different route/template. |
| No logo image | ACCEPTED | PARTIAL | PARTIAL | Fallback brand/favicon exist in repo; final old logo upload still needs wp-admin/media work. |
| Herzliya shown in English | ACCEPTED / CODE FIXED | YES | NO | Lawyer card city-label fallback now maps `herzliya` to `הרצליה`. |
| Mixed http links | ACCEPTED | PARTIAL | NO | Some links already repaired; full crawl still required. |
| Profile view counter on GET | ALREADY FIXED | YES | NO | Bot/admin/feed/preview traffic is skipped in repo. |
| `?page_id=` menu URLs | ACCEPTED | PARTIAL | NO | Menu seed/repair exists, but live menu assignment still needs wp-admin verification. |

## What Was Implemented Now
- Public lawyer visibility helper in `inc/template-tags.php`.
- Lawyer archive filters public results to approved profiles only.
- Single lawyer template returns a 404 for unapproved/demo public profiles, while still allowing admins with edit permission to view.
- Lawyer directory now has explicit Hebrew meta/OG output to avoid "Archive" leakage.
- Lawyer card city fallback now includes a clean Hebrew `הרצליה` mapping.

## Still Needs Live/Admin Work
- Draft/unpublish or delete old demo lawyer records from wp-admin after backup.
- Remove/update Maya Permalink Manager custom rule so `/lawyers/advocate-maya-rotenberg/` becomes canonical.
- Merge duplicate practice/category terms only after a taxonomy inventory and redirect plan.
- Verify whether `/lawyers/` is using the CPT archive template or a page/template route.
