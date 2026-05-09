# Decisions Log

## D001 — Use emoji icons instead of dashicons for practice area cards
- **Date:** 2026-05-08
- **Reason:** Dashicons only load in WP admin by default. Emoji render everywhere without extra HTTP requests.
- **Alternative considered:** Enqueue dashicons on frontend → adds 40KB CSS load for 6 icons.

## D002 — Topic clusters query both practice-areas and category taxonomies
- **Date:** 2026-05-08
- **Reason:** Old content uses WP categories; new content uses practice-areas taxonomy. Query both until migration is complete.

## D003 — Project structured as legal marketplace, not just a theme
- **Date:** 2026-05-08
- **Reason:** Business owner invested money; goal is commercial dominance, not just a pretty site.

## D004 — Lawyer CPT goes in justice-core plugin, not theme
- **Date:** 2026-05-08
- **Reason:** CPTs must survive theme changes. Plugin-based CPT registration is WordPress best practice.

## D005 — Legal advertising compliance research BEFORE any lawyer-related features
- **Date:** 2026-05-08
- **Reason:** Israeli Bar Association has specific advertising rules (2018 amendment). Building paid profiles, reviews, or ratings without compliance creates legal risk for the site owner.

## D006 — No content deletion or redirects until content inventory is complete
- **Date:** 2026-05-08
- **Reason:** The site has 200+ indexed pages. Premature deletion or redirection can cause massive ranking loss. Map first, act second.
