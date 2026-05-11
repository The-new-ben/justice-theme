# Personal Injury / Damages Side-By-Side Review - 2026-05-11

Status: VERIFIED / REVIEW ONLY / NO PUBLIC EXECUTION

## Purpose

This file compares the existing personal-injury, damages, tort-law, road-accident and insurance pages before any rewrite, merge, URL migration, redirect, canonical, sitemap, related-card, internal-link, menu, title/H1/meta or CMS action.

Data used:
- `project-control/content-master-inventory.csv`
- `project-control/content-quality-audit.csv`
- `project-control/url-migration-map.csv`
- `project-control/internal-link-map.csv`
- `project-control/gsc-content-priorities.csv`
- `project-control/personal-injury-owner-approval-packet.md`
- `project-control/personal-injury-source-legal-checklist-2026-05-11.md`
- `project-control/personal-injury-page-decision-matrix-2026-05-11.md`

## Live URL Verification

VERIFIED on 2026-05-11:
- `https://jus-tice.co.il/tort-lawyer/` returns `200`.
- `https://jus-tice.co.il/punitive-damage/` returns `200`.
- `https://jus-tice.co.il/car-accident-auto-injury-lawyer/` returns `200`.
- `https://jus-tice.co.il/israel-road-accident-compensation-law/` returns `200`.
- `https://jus-tice.co.il/compulsory-motor-vehicle-insurance/` returns `200`.
- `https://jus-tice.co.il/personal-injury-law/` returns `200`.
- `https://jus-tice.co.il/tort-reform/` returns `200`.
- `https://jus-tice.co.il/outline-of-tort-law/` returns `200`.
- `https://jus-tice.co.il/deep-pocket/` returns `200`.

REVIEW / MIGRATION RISK:
- Tested old Hebrew damages/category URL variants currently return `301` to the homepage.
- Because the 404-to-homepage plugin is still active, this does not prove that the old URL is safe, deleted, or ready to redirect.
- The old GSC-visible damages/category URL must remain protected until exact URL capture, 404 routing cleanup and owner-approved redirect mapping are complete.

## Executive Decision

VERIFIED:
- `/tort-lawyer/` is the current local damages/service candidate, but it is thin and not ready to be treated as a finished pillar.
- `/car-accident-auto-injury-lawyer/` is the current GSC-visible road-accident candidate, but the content is thin/outdated and appears to lean into fatal/criminal accident defense language rather than a practical injury-compensation guide.
- `/punitive-damage/` is a very long specialist article and must not become the broad personal-injury pillar only because of word count.
- `/personal-injury-law/` is US/international content and should stay outside the Israeli damages-service cluster.
- `/israel-road-accident-compensation-law/` and `/compulsory-motor-vehicle-insurance/` are support pages for a car-accident cluster, not primary commercial service pages.
- `/tort-reform/`, `/outline-of-tort-law/` and `/deep-pocket/` are informational/concept support assets.

BLOCKED:
- No public execution is approved from this comparison.

## Side-By-Side Summary

| Current URL | Words | Quality | Current Role | Evidence | Recommended Action |
|---|---:|---:|---|---|---|
| `/tort-lawyer/` | 507 | 4 | Current damages/tort service candidate | Current 200 page; thin; no direct GSC row recorded; old damages/category GSC row remains unresolved | EXPAND_AFTER_PRIMARY_APPROVAL |
| `/car-accident-auto-injury-lawyer/` | 590 | 2 | Current GSC-visible car-accident candidate | 84 impressions for road-accident query in priorities file; 2 impressions for road-accident-lawyer query; thin/outdated | PROTECT_REWRITE_OR_MIGRATE_AFTER_MAP |
| `/punitive-damage/` | 57,276 | 6 | Specialist punitive-damages support | Huge content volume; intent is narrow legal concept, not broad service page | PROTECT_SUPPORT_NOT_PRIMARY |
| `/personal-injury-law/` | 8,005 | 6 | US/international personal-injury content | Title/content are US-focused; should not compete with Israeli damages pages | SEPARATE_INTERNATIONAL_CLUSTER |
| `/tort-reform/` | 7,072 | 6 | Informational tort reform support | Long informational page; no internal links in audit | SUPPORT_CURRENTNESS_REVIEW |
| `/outline-of-tort-law/` | 1,443 | 5 | Tort-law overview support | Informational overview; no internal links in audit | SUPPORT_OR_MERGE_REVIEW |
| `/deep-pocket/` | 507 | 4 | Narrow tort concept support | Thin concept page; no internal links in audit | EXPAND_OR_MERGE_REVIEW |
| `/israel-road-accident-compensation-law/` | 524 | 4 | Road-accident compensation-law support | Thin/outdated but has source relevance and two outgoing internal links | SOURCE_BACKED_SUPPORT_REWRITE_REVIEW |
| `/compulsory-motor-vehicle-insurance/` | 714 | 2 | Compulsory-insurance support | Thin/outdated; 1 road-accident query impression in prior evidence | SUPPORT_REWRITE_REVIEW |
| Old Hebrew damages/category URL | Unknown | Unknown | GSC-visible old URL / route risk | 2 impressions at average position 48 in prior GSC evidence; tested variants redirect to homepage | EXACT_URL_RECHECK_BEFORE_REDIRECT |

## Cannibalization Findings

VERIFIED:
- The broad service lane is unresolved. `/tort-lawyer/` is current and clean enough to compare, but it is too thin to act as the final pillar without approved expansion.
- `/personal-injury-lawyer/` remains a future clean slug only. Creating it now could duplicate `/tort-lawyer/` and split signals.
- `/car-accident-auto-injury-lawyer/` should be protected because it has the visible road-accident query signal, even though its content quality is weak.
- `/car-accident-lawyer/` remains a future clean slug only. It should not be created or redirected to until the current GSC-visible page is mapped.
- `/punitive-damage/` and `/tort-reform/` are long enough to confuse heuristic pillar selection, but their intent is not broad lawyer-service intent.
- `/personal-injury-law/` is a separate international page and should not be used as an Israeli service-pillar source.

## Content Quality Findings

VERIFIED:
- Thin current pages: `/tort-lawyer/`, `/car-accident-auto-injury-lawyer/`, `/israel-road-accident-compensation-law/`, `/compulsory-motor-vehicle-insurance/`, `/deep-pocket/`.
- Outdated-risk current pages: `/car-accident-auto-injury-lawyer/`, `/israel-road-accident-compensation-law/`, `/compulsory-motor-vehicle-insurance/`.
- Long but not automatically primary: `/punitive-damage/`, `/tort-reform/`, `/personal-injury-law/`.
- Live page heading samples show much of the visible section structure is template/editorial/related-content scaffolding, not a strong practical Kol-Zchut-style legal-help structure.
- Several sampled pages show related-content headings/cards that may drift toward medical malpractice or general legal cards; related content should later be rebuilt from the approved cluster map, not latest/random logic.

## Role Proposal

Planning only:

1. Broad Israeli damages service candidate:
   - `/tort-lawyer/`
   - future alternative after approval: `/personal-injury-lawyer/`

2. Car-accident subcluster:
   - current protected candidate: `/car-accident-auto-injury-lawyer/`
   - future alternative after migration map: `/car-accident-lawyer/`
   - support: `/israel-road-accident-compensation-law/`
   - support: `/compulsory-motor-vehicle-insurance/`

3. Tort-law informational support:
   - `/tort-reform/`
   - `/outline-of-tort-law/`
   - `/deep-pocket/`
   - `/punitive-damage/`

4. International boundary:
   - `/personal-injury-law/`

5. Old URL / route-risk lane:
   - old Hebrew damages/category URL from GSC evidence, exact URL still needs capture and route verification.

## Immediate Non-Public Recommendations

REVIEW:
- Decide whether the broad service pillar should be expanded in place at `/tort-lawyer/` or planned as a future `/personal-injury-lawyer/` migration.
- Protect `/car-accident-auto-injury-lawyer/` until its current traffic and content can be mapped to a final approved car-accident URL.
- Keep `/punitive-damage/` specialist and do not optimize it for broad "personal injury lawyer" or "tort lawyer" hiring intent.
- Keep `/personal-injury-law/` in an international cluster with clear separation from Israeli law.
- Rebuild thin pages with source/legal review before public rewrite, especially car accident, compensation law and compulsory insurance pages.
- Treat current homepage redirects from old Hebrew/category URL variants as a routing problem, not as an approved SEO migration.

BLOCKED:
- No slug changes.
- No redirects.
- No canonicals.
- No sitemap changes.
- No internal-link edits.
- No content edits.
- No CMS writes.

## Next Safe Step

Create an approval-gated internal-link plan for this cluster, or run deeper GSC/SERP checks for damages, bodily injury, road-accident lawyer and work-accident variants before choosing primary/support URLs.

