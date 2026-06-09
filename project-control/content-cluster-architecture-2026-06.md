# Content Cluster Architecture — hub & spoke (authoritative map)

Date: 2026-06-09
Status: IMPLEMENTED IN THEME CODE (branch `claude/hub-spoke-architecture`, off `main`)
Author: Claude Code

## Why this exists

The theme already had a heuristic related-content engine (`inc/related-content.php`) that
*infers* a cluster from page text. Inference is a good fallback, but ranking needs a
**deterministic** hub-and-spoke topology: each money pillar (hub) and the exact supporting
pages (spokes) that point to it, with **one parent per spoke** (anti-cannibalization) and
**≥2 sibling links** per spoke. That map did not exist as code — only as scattered research
in `project-control/*-support-to-hub-map-2026-05-18.csv`. This cycle turns that
GSC-verified research into one source-of-truth map plus automatic rendering.

This mirrors the proven method from the sister site `nad-lan.co.il`
(`skills/internal-linking-hub-spoke.md`): central map → deterministic link rendering →
breadcrumb hierarchy. The difference: nad-lan **stored** link blocks inside post content via
REST (needs idempotency markers, mutates the DB). Here the links are **rendered** from the
map at request time — no DB writes, no plugin upload, nothing to de-duplicate, and the topology
changes by editing one PHP array.

## Source of truth

`inc/content-clusters.php` → `justice_theme_content_clusters()`. Edit that array to change the
topology. Everything else (breadcrumbs, spoke backlinks, anchor text) reads from it.

Data origin: the seven `*-support-to-hub-map-2026-05-18.csv` files (real GSC clicks +
impressions). Boundary/hold rows (`BOUNDARY_*`, `HOLD_*`, `REVIEW_BEFORE_*`) are intentionally
**excluded** — those are flagged "do not route yet" pending an owner/route decision, so they do
not yet earn an internal link. Hebrew-encoded and `/articles/*`, `/psakdin/*` support URLs are
left out of the hardcoded map (brittle slugs); they are still caught by the heuristic engine.

## The map (7 money clusters)

| Cluster | Pillar (hub) slug | Spokes (one parent each) |
|---|---|---|
| Real estate | `real-estate-attorney` | real-estate-lawyer-guide, lawyer-for-buying-or-selling-a-house, registration-of-real-estate-israel, land-appreciation-tax, real-estate-lawyer-cost-2025, real-estate-appraiser, marital-property-agreement, spouse-property-registration-guide |
| Family / divorce | `family-law` | free-divorce-agreement-template, joint-custody-shared-parenting, child-custody-modification, divorce-costs-2025, living-apart-together-legal-rights, divorce-mediation-basics, cohabitation-property-rights-for-unmarried-couples, how-much-does-a-divorce-agreement-cost, divorce-everything-you-need-to-know, what-is-child-custody, trusted-divorce-attorney-guide, strategic-divorce-cost-planning, request-for-family-dispute-settlements |
| Criminal | `criminal-defense-attorney` | sex-crime-lawyer, sexual-offenses, drug-related-crime, how-much-will-a-criminal-defense-lawyer-cost, tax-investigation-guide, apply-for-police-criminal-information-certificates, what-is-money-laundering, economic-crimes-white-collar-lawyer, famous-criminal-defense-lawyer, leading-criminal-law-firm, lawyer-near-me-criminal-law |
| Medical malpractice | `medical-malpractice-lawyer` | what-is-medical-malpractice-definition-examples, medical-malpractice-in-the-united-states, medical-malpractice-common-errors-doctors-hospitals, anesthesia-medical-malpractice, cerebral-palsy, malpractice-cerebral-palsy |
| Traffic | `traffic-lawyer` | driving-under-the-influence, dui-refusal-blood-breath-urine-test, driving-under-the-influence-of-drugs, driver-with-36-valid-points-or-more-will-be-disqualified-from-holding-a-drivers-license |
| Employment | `labor-lawyer` | employment-contract, employer-worker-relationship, israeli-labor-law |
| Inheritance / wills | `inheritance-lawyer` | inheritance, inheritance-order, what-is-a-probate-order, will-and-testament, will-probate-objection, revocation-of-a-will-and-reviving-previous-will, maximize-an-inheritance, international-inheritance-wills-lawyer |

Anti-cannibalization corrections applied while building the map (GSC export false positives):
`how-much-will-a-criminal-defense-lawyer-cost` → criminal (not inheritance);
`driver-with-36-valid-points…` → traffic (not inheritance).

## What renders automatically (live, no DB writes)

1. **Spoke → pillar + siblings block.** `the_content` filter appends an `.cluster-backlink`
   block to any mapped spoke: "חלק מהמדריך: <pillar>" + "ראו גם באותו נושא: <sibling> · <sibling>".
   Anchor text is the target's **real live post title** (resolved via `get_page_by_path`),
   never fabricated. Only links that resolve to a live published post are output.
2. **Breadcrumb hierarchy.** Mapped spokes get `Home → <Pillar> → <Spoke>` (and the matching
   BreadcrumbList JSON-LD), instead of the old flat `Home → <Spoke>`. Pillars stay directly
   under Home. Unmapped pages are unchanged.
3. **Styling.** `.cluster-backlink` in `assets/css/premium-pass-4.css` — hairline border,
   cream surface, navy accent rule, RTL logical properties. Subtle, not loud.

## Files changed

| File | Change |
|---|---|
| `inc/content-clusters.php` | NEW — map + helpers + spoke backlink renderer + `the_content` filter |
| `inc/breadcrumbs.php` | Insert pillar parent crumb for mapped spokes (articles + pages) |
| `functions.php` | Load `inc/content-clusters.php` |
| `assets/css/premium-pass-4.css` | `.cluster-backlink` styling |

## Safety

- No database rows, post content, URLs, redirects, canonicals, noindex rules, sitemap
  settings, or plugin files changed. Pure theme render-layer.
- `the_content` filter is guarded: `is_singular() && in_the_loop() && is_main_query()` and
  skips admin. It cannot run in feeds, REST, or secondary loops.
- A spoke whose pillar is not (yet) a resolvable post still links to the pillar root URL; a
  sibling that does not resolve is silently skipped. No broken/empty links rendered.
- PHP lint clean on all touched files.

## How to verify after uPress pull (no login needed)

- Open `https://jus-tice.co.il/real-estate-lawyer-guide/` → bottom shows a "חלק מהמדריך:
  עורך דין מקרקעין" block linking to `/real-estate-attorney/` plus sibling links.
- Same page breadcrumb reads `עמוד הבית → <real-estate hub title> → <this page>`.
- View source → BreadcrumbList JSON-LD has 3 items for that spoke.

## Next steps (not done here)

- Pillar pages: confirm each hub renders its full spoke list (the page-legal-pillar template
  reads `pillar_supporting_topics`; align those lists with this map for the 7 hubs).
- Extend the map with the Hebrew-encoded high-traffic support URLs from the CSVs once their
  route/redirect status is confirmed.
- Wire the lawyer-cluster CTA (route each spoke to the matching lawyer directory filter) —
  the fallback targets already exist in `inc/related-content.php`.
