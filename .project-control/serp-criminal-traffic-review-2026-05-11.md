# Criminal + Traffic SERP Evidence Pass

Date: 2026-05-11  
Status: VERIFIED / REVIEW ONLY / NO URL CHANGE

This pass adds live web/SERP evidence to the criminal-law and traffic-law decision packets. It does not approve publishing, URL changes, redirects, noindex, canonical changes, sitemap changes, menu changes or CMS edits.

## Method

VERIFIED:
- Searched current web results for the criminal and traffic keyword groups already flagged by GSC and the content inventory.
- Compared result types, competitor patterns, official/public source availability, and Jus-Tice duplicate risk.
- Recorded the findings in `project-control/serp-criminal-traffic-review-2026-05-11.csv`.

NOT VERIFIED:
- Exact Google Search Console API exports.
- GA4 landing-page/conversion data.
- Full browser top-10 screenshot archive for each keyword.
- Final official/legal source list for article drafting.

## Criminal-Law Findings

VERIFIED:
- `עורך דין פלילי` SERP is commercial and specialist-heavy. Competing pages are mostly criminal-defense firm/service pages with urgency, experience, consultation CTA, and sections for investigation, arrest, indictment and offense types.
- `דין פלילי` is broader and can easily cannibalize `עורך דין פלילי` if treated as a separate pillar with the same intent.
- `חקירה במשטרה`, `כתב אישום`, and `מעצר ימים` are valid support intents, but old Jus-Tice content must be compared before any new clean URLs are created.
- `עבירות סמים` already has a Jus-Tice asset (`/drug-offenses-criminal-lawyer/`) visible in SERP samples, so a new `/drug-offenses/` page would be risky without a keep/expand/migrate decision.

Decision impact:
- Keep `/criminal-lawyer/` as the strategic pillar target.
- Do not create support pages blindly.
- Compare old Hebrew criminal-lawyer pages, existing support pages and case-law pages first.
- Build the future criminal cluster as pillar plus spokes only after owner approval and redirect/internal-link planning.

## Traffic-Law Findings

VERIFIED:
- `עורך דין תעבורה` SERP is commercial and service-driven. Competitors emphasize saving the license, traffic court, drunk driving, speeding, accidents, administrative suspension, and consultation CTAs.
- `נהיגה בשכרות` has a clear dedicated-support pattern. It should connect to the traffic pillar and breathalyzer content.
- `/traffic-lawyer/` already exists and should be expanded as the pillar candidate instead of creating a competing traffic pillar.
- `/driving-under-the-influence/` already exists, so `/drunk-driving/` is a migration/rename question, not a new article task.
- `פסילה מנהלית` and `שלילת רישיון נהיגה` need more review because the intent can split between driver-license, professional-license, administrative and court-suspension meanings.

Decision impact:
- Keep `/traffic-lawyer/` as the pillar candidate.
- Review/expand `/driving-under-the-influence/` before any `/drunk-driving/` decision.
- Keep `/license-suspension/` as a candidate only after clearer source/GSC/content evidence.
- Do not optimize the will-revocation page for drunk-driving queries; that remains a wrong-page signal to fix later through content and internal-link planning.

## Source Notes

Representative sources/results reviewed in this pass included:
- Criminal-law competitors: `zeliglaw.co.il`, `yairochayon.co.il`, `nativ-law.co.il`, `tomernave.co.il`, `sheves-law.co.il`, `adato.co.il`, `flanter-law.co.il`.
- Traffic-law competitors: `shaviv-law.com`, `b-taavura.co.il`, `uliel.co.il`, `atr-law.co.il`, `kenig.org.il`, `ranraichman.com`.
- Public/official-style references surfaced in search: `gov.il`, `kolzchut.org.il`, Knesset documents, public driving/alcohol safety PDFs.

NOT VERIFIED:
- Some official source URLs must be reopened and checked in-browser before article drafting because search results surfaced public/official material but not every exact legal source page was validated.

## Recommended Next Action

1. Update the two decision packets with this SERP pass.
2. Choose the first owner-approval packet:
   - criminal pillar cleanup, or
   - traffic pillar expansion.
3. Before execution, prepare:
   - old/new URL map,
   - redirect map,
   - internal-link map,
   - source/legal review checklist,
   - content-quality review,
   - mobile/template notes.

## Safety

BLOCKED:
- URL changes.
- Redirects.
- Noindex/canonical/sitemap changes.
- Public content rewrites.
- Deleting or replacing old content.
- New duplicate support pages.
- CMS writes.
