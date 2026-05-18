# Corona Legacy Content Audit - 2026-05-18

## Purpose

The owner flagged corona/COVID-era articles as a possible quality and traffic risk. This audit converts that concern into a safe editorial queue before any public CMS action.

No public WordPress content, URL, redirect, category, sitemap, noindex setting, database row, or GSC setting was changed in this cycle.

## Research basis

- Google Search Central's people-first content guidance says content should be useful, reliable, and written to help people rather than mainly to attract search traffic.
- Google Search Central's core update guidance warns against reactive "quick fix" changes and says durable site-quality improvements may take time to be reflected.
- Google's outdated-content help is for content that has been removed or materially changed, not a blanket reason to delete old pages.

Sources reviewed:

- https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- https://developers.google.com/search/docs/appearance/core-updates
- https://support.google.com/webmasters/answer/7041154

## Repo scan result

Data source: `project-control/url-migration-map.csv`.

Query basis: rows whose title, URL, or topic cluster matched corona/COVID/emergency-regulation terms.

Found 48 corona-adjacent candidates:

| Current cluster | Count | Interpretation |
| --- | ---: | --- |
| outdated-corona-legacy | 29 | Main stale-content cleanup lane. |
| employment-law | 7 | Some pages may become evergreen employment-law guides. |
| needs-classification | 4 | Needs manual review before promotion or pruning. |
| cyber-privacy | 2 | Potential evergreen privacy/surveillance pages. |
| criminal-law | 2 | Route/intent review needed; do not auto-prune. |
| real-estate | 2 | Likely false positives from old mapping context. |
| traffic-law | 1 | Likely narrow historical traffic-law update. |
| medical-malpractice | 1 | Potential health/legal informational page, not automatically disposable. |

## Live sample check

Googlebot-style header checks returned HTTP 200 for three representative evergreen-or-commercial candidates:

- `https://jus-tice.co.il/coronavirus-employers-guide/`
- `https://jus-tice.co.il/income-protection-insurance/`
- `https://jus-tice.co.il/research-report-n156-persistent-symptoms/`

Interpretation: at least some corona-era URLs are still live and crawlable, so cleanup must be page-by-page. Blanket deletion or broad redirects are not safe.

## Recommended action model

### P0: Refresh into evergreen commercial support

Use when the page still maps to a paid-intent legal cluster.

Examples:

- `coronavirus-employers-guide` -> refresh as an evergreen employer guide around termination, unpaid leave, workplace emergencies, and employer representation; link to `/labor-lawyer/`.
- `income-protection-insurance` -> keep insurance/disability intent; remove stale corona framing where it weakens the page.
- `self-employed-and-freelancer` -> consider refresh into freelancer/self-employed rights and benefits guide only if current legal basis is verified.

### P1: Preserve as historical/legal precedent with disclaimers

Use when the article has legal/historical value but current practical advice is outdated.

Examples:

- emergency regulations from March 2020.
- police/movement restriction instructions.
- court operation during corona.
- specific old government/health emergency updates.

Required editorial treatment:

- add a clear "historical update" notice.
- state that the page is not current legal guidance.
- add a link to the current evergreen legal hub where relevant.
- avoid using these pages as homepage or menu priority pages.

### P2: Owner-approved prune/noindex/redirect review

Use only when a page has no current value, no meaningful traffic/backlinks, and no legal archive value.

Before any action:

- check last 16 months of GSC clicks/impressions.
- check backlinks if a backlink tool is available.
- confirm whether there is a highly equivalent current page.
- choose one of: update, noindex, 410, or precise 301.
- never redirect stale corona pages broadly to homepage or unrelated money pages.

## Immediate safe decision

Do not mass-delete, mass-noindex, or mass-redirect the corona group.

Start with a small owner-approved public batch:

1. Refresh `coronavirus-employers-guide` into an evergreen employer/employment-law support page.
2. Refresh `income-protection-insurance` only if it supports a current insurance/disability or employment-adjacent intent.
3. Hold pure 2020 emergency regulation updates as historical until GSC/backlink evidence proves they should be pruned.

## Next checks

- Pull GSC clicks/impressions for all 48 candidates.
- Run live indexability checks for the 29 `outdated-corona-legacy` rows.
- Mark each row as `REFRESH`, `HISTORICAL_ARCHIVE`, `NOINDEX_REVIEW`, `REDIRECT_REVIEW`, or `KEEP_OUT_OF_COMMERCIAL_CLUSTER`.
- Keep commercial hubs clean: corona pages should not dilute `/labor-lawyer/`, `/traffic-lawyer/`, `/criminal-defense-attorney/`, or privacy hubs unless the intent is current and useful.

## Safety statement

This cycle created an editorial control layer only. It intentionally avoids public CMS changes because stale legal content can still carry historical, traffic, backlink, or trust value, and Google guidance favors meaningful people-first improvement over reactive mass pruning.
