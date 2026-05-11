# Traffic / Drunk-Driving Source Audit

Date: 2026-05-11
Status: VERIFIED / REVIEW ONLY / NO PUBLIC EXECUTION
Project area: Traffic law / GSC wrong-page remediation / technical SEO

This audit checks the current drunk-driving support page, the traffic-law pillar and the wrong-page will-revocation URL before any public content, title, internal-link or URL action. It does not approve publishing, rewriting, title/H1/meta changes, URL changes, redirects, noindex, canonical changes, sitemap changes, menu changes, related-card changes, schema changes, lawyer-card changes, CRM/review work or CMS/database writes.

## Pages Checked

VERIFIED LIVE:
- `https://jus-tice.co.il/driving-under-the-influence/`
- `https://jus-tice.co.il/traffic-lawyer/`
- `https://jus-tice.co.il/revocation-of-a-will-and-reviving-previous-will/`

VERIFIED FILES:
- `project-control/content-master-inventory.csv`
- `project-control/internal-link-map.csv`
- `project-control/traffic-law-support-review.csv`
- `project-control/gsc-targeted-query-pass-3-2026-05-11.csv`
- `project-control/traffic-criminal-wrong-page-decision-packet-2026-05-11.md`

NOT VERIFIED:
- GA4 landing-page and lead data.
- Full GSC API export for every drunk-driving and license-suspension variant.
- Authenticated WordPress postmeta, Rank Math schema settings, menu settings and manual related-link fields.
- Legal/source review of the current traffic-law content.

## Key Finding

VERIFIED: the wrong-page will-revocation URL does not visibly target drunk-driving intent in its title/H1/body signal. Its live page has strong will/inheritance signals and zero visible `נהיגה בשכרות` term matches in the fetched text.

TECHNICAL HYPOTHESIS / NEEDS REVIEW: the will-revocation page source contains sitewide `SiteNavigationElement` JSON-LD entries for traffic pages, including `driving-under-the-influence` and `traffic-lawyer`, using `http://` URLs. This does not prove why GSC mapped the drunk-driving query to the will page, but it is now a concrete technical SEO item to audit before editing content.

## Page-by-page Notes

### 1. Current drunk-driving support page

URL:
- `https://jus-tice.co.il/driving-under-the-influence/`

VERIFIED:
- Live HTTP status: `200`.
- Live title: `נהיגה בשכרות | Jus-Tice.co.il`.
- Live H1: `נהיגה בשכרות`.
- Live canonical: self-canonical.
- Live robots: `follow, index`.
- Inventory word count: `516`.
- Live visible word-count estimate: `1068`.
- The page contains visible drunk-driving/alcohol/traffic terms.

DECISION:
- This is the current correct support URL to review first.
- Do not create `/drunk-driving/` as a duplicate page.
- Do not migrate to `/drunk-driving/` until owner approval, redirect planning and internal-link planning are complete.

RECOMMENDED:
- Prepare a no-URL-change expansion outline for this URL.
- Add practical sections only after source/legal review: what the offense is, who it affects, breathalyzer/blood/urine tests, refusal, administrative suspension, penalties, when to contact a traffic lawyer, documents to prepare, FAQ, official sources and related pages.

### 2. Traffic-law pillar

URL:
- `https://jus-tice.co.il/traffic-lawyer/`

VERIFIED:
- Live HTTP status: `200`.
- Live title: `עורך דין תעבורה | עורכי דין לענייני תעבורה | Jus-Tice.co.il`.
- Live H1: `עורך דין תעבורה`.
- Live canonical: self-canonical.
- Live robots: `follow, index`.
- Inventory word count: `1399`.
- Live visible word-count estimate: `1969`.
- Inventory shows outgoing links to drunk-driving, refusal/testing, medical road-safety, speeding and breathalyzer support pages.

DECISION:
- This remains the current no-URL-change traffic-law pillar candidate.
- It needs a stronger service/user journey structure before being treated as final.

RECOMMENDED:
- Review the page with design/content together: legal field explanation, support article links, lawyer-card readiness, lead CTA, mobile section hierarchy and related content.
- Add internal links only after the support-page roles are approved.

### 3. Wrong-page will-revocation URL

URL:
- `https://jus-tice.co.il/revocation-of-a-will-and-reviving-previous-will/`

VERIFIED:
- Live HTTP status: `200`.
- Live title: `ביטול צוואה וקיום צוואה קודמת בה חלוקה שווה | Jus-Tice.co.il`.
- Live H1: `ביטול צוואה וקיום צוואה קודמת בה חלוקה שווה`.
- Live canonical: self-canonical.
- Live robots: `follow, index`.
- Inventory word count: `11861`.
- Live visible word-count estimate: `12828`.
- Live fetched text has `0` visible matches for `נהיגה בשכרות`.
- Live fetched text has strong will/inheritance signals.

DECISION:
- Protect this page as inheritance/wills content.
- Do not optimize this page for traffic-law or drunk-driving terms.

RECOMMENDED:
- Audit the source of sitewide navigation/schema output before making any content change.
- Keep this URL out of traffic-law internal-link planning unless a real contextual reason exists.

## Technical SEO Finding

VERIFIED LIVE:
- `SiteNavigationElement` appears `86` times in the fetched source for the checked pages.
- The will-revocation page source includes schema entries pointing to `http://jus-tice.co.il/driving-under-the-influence/` and `http://jus-tice.co.il/traffic-lawyer/`.
- The checked theme files do not directly define `SiteNavigationElement`, so the source is likely WordPress/plugin/menu schema output and must be confirmed before changing code.

RISK:
- Sitewide navigation schema may be adding broad unrelated topical signals to every article page.
- The schema still contains `http://` first-party URLs, while canonical/live URLs are `https://`.

RECOMMENDED:
- Add a schema/navigation-source audit task before any technical SEO change.
- Confirm whether Rank Math, WordPress menu schema, a plugin, or stored CMS settings are generating these entries.
- Do not remove schema blindly; first compare homepage, pillar, article and category outputs.

## Decision Summary

VERIFIED:
- The drunk-driving page exists and is the correct current support candidate, but it is thin.
- The traffic-lawyer page exists and links to several support pages, including drunk-driving.
- The will page is not visibly about drunk driving and should not be changed to chase the wrong GSC match.
- A sitewide navigation/schema signal is now a real audit target.

BLOCKED:
- `/drunk-driving/` creation.
- URL migration.
- 301 redirects.
- Title/H1/meta edits.
- Public content rewrite.
- Related-card, menu, breadcrumb, sitemap, canonical, noindex or schema changes.
- Lawyer-card, lead-form, CRM/review or CMS/database writes.

Next action:
- Create a no-URL-change drunk-driving expansion outline for owner/legal review, and separately open a technical schema/navigation-source audit.
