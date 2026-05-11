# Traffic Law Content Upload Readiness Batch

Date: 2026-05-11
Status: VERIFIED / REVIEW ONLY / NO PUBLIC EXECUTION
Batch size: 38 URL candidates reviewed
Project area: Content audit / SEO structure / cannibalization / URL migration / category cleanup / internal links / sitemap planning

This is a larger cluster-level readiness batch. It maps the traffic-law candidate set into pillar, support, merge/rewrite, boundary, legacy and exclude lanes before any upload or public content change. It does not approve content publishing, title/H1/meta changes, URL changes, redirects, noindex, canonical changes, sitemap changes, taxonomy edits, internal-link edits, related-card edits, schema changes, lawyer-card changes, CRM/review work or CMS/database writes.

## Batch Goal

Move the traffic-law cluster closer to a clean content-upload state:
- which page is the pillar.
- which pages support the pillar.
- which pages should be expanded.
- which pages should be merged or rewritten.
- which URLs are future migration candidates.
- which pages should be kept out of traffic-law because they are personal-injury, criminal, business-license, professional-license or unrelated false positives.
- which internal links must exist after approval.
- which sitemap entries should eventually be included or withheld.

## Evidence Used

VERIFIED:
- `project-control/content-master-inventory.csv`
- `project-control/url-migration-map.csv`
- `project-control/internal-link-map.csv`
- `project-control/traffic-law-support-review.csv`
- `project-control/gsc-targeted-query-pass-3-2026-05-11.csv`
- `project-control/traffic-criminal-wrong-page-decision-packet-2026-05-11.md`
- `project-control/traffic-drunk-driving-source-audit-2026-05-11.md`

NOT VERIFIED:
- GA4 conversion and landing-page data for the traffic cluster.
- Full GSC API export for every traffic-law variant.
- Authenticated WordPress taxonomy/menu/postmeta state.
- Legal/source review of traffic-law articles and case-law summaries.
- Owner approval for any redirect, category change or content upload.

## Batch Results

VERIFIED / REVIEWED:
- 38 traffic-adjacent URL candidates were reviewed.
- 1 current pillar candidate.
- 10 traffic-law support or source candidates.
- 7 traffic/criminal or traffic/evidence case-law support candidates.
- 7 personal-injury/car-accident boundary pages that should not be merged blindly into traffic defense.
- 1 outdated/legacy traffic item.
- 12 false-positive or non-traffic pages that should be excluded from the traffic-law category strategy.

## Recommended Traffic-Law Structure

Primary pillar candidate:
- `https://jus-tice.co.il/traffic-lawyer/`

Core support candidates:
- `https://jus-tice.co.il/driving-under-the-influence/`
- `https://jus-tice.co.il/dui-refusal-blood-breath-urine-test/`
- `https://jus-tice.co.il/yanshuf-breathalyzer-test/`
- `https://jus-tice.co.il/blood-alcohol-content-breathalyzer/`
- `https://jus-tice.co.il/speeding/`
- `https://jus-tice.co.il/medical-institute-for-road-safety/`
- `https://jus-tice.co.il/medical-fitness-tests-for-driving-marvad-info/`
- `https://jus-tice.co.il/standards-of-medical-fitness-to-drive/`
- `https://jus-tice.co.il/driver-with-36-valid-points-or-more-will-be-disqualified-from-holding-a-drivers-license/`

Support or case-law review candidates:
- traffic evidence / Ein Hanetz ruling.
- driving while disqualified / forfeiture ruling.
- fatal road accident criminal negligence pages.
- traffic amendment / hit-and-run legal update.
- drunk-driving testing audit report.

Boundary clusters:
- Personal injury / road accident compensation pages should be mapped under car-accident or personal-injury, not traffic-defense.
- Criminal drug/sex/human/cyber trafficking pages are false positives for this cluster.
- Business-license, professional-license and real-estate license pages are false positives for this cluster.

## Canonical Category Recommendation

Recommended canonical category:
- `traffic-law`

Include only:
- traffic lawyer service page.
- traffic offenses.
- drunk driving.
- refusal/testing/breathalyzer.
- speeding.
- driver-license suspension/points.
- medical fitness to drive / Marvad.
- traffic enforcement evidence.
- fatal/criminal road accident pages only if marked as traffic-criminal boundary.

Exclude or move out:
- personal-injury compensation pages.
- business licensing.
- lawyer licensing.
- medical professional licensing.
- real-estate license/use cases.
- human/sex/cyber/drug trafficking.
- unrelated intoxication/criminal-sex-offense case-law pages.

## URL Strategy

Keep current URLs for planning:
- `/traffic-lawyer/`
- `/driving-under-the-influence/`
- `/dui-refusal-blood-breath-urine-test/`
- `/yanshuf-breathalyzer-test/`
- `/speeding/`
- `/medical-institute-for-road-safety/`

Future clean slugs for owner review only:
- `/drunk-driving/` - blocked until deciding whether to migrate `/driving-under-the-influence/`.
- `/breathalyzer-test/` - possible consolidation target for breathalyzer/yanshuf/testing pages.
- `/license-suspension/` - possible consolidation target for points, suspension, disqualification and administrative suspension.
- `/traffic-evidence/` - possible support hub for Ein Hanetz/enforcement evidence case law.
- `/fatal-road-accident-offenses/` - possible traffic-criminal boundary support.

Do not execute any of these future slugs without:
- old URL -> 301 -> new URL.
- sitemap update.
- internal-link update.
- canonical consistency.
- GSC risk review.
- owner/legal approval.

## Internal-Link Plan

After approval, the minimum internal-link map should include:
- `/traffic-lawyer/` -> drunk driving, refusal/testing, breathalyzer, speeding, Marvad, license suspension/points, traffic evidence and fatal-road-accident boundary support.
- every support page -> `/traffic-lawyer/`.
- drunk-driving page -> refusal/testing, breathalyzer/yanshuf, license suspension and traffic-lawyer.
- breathalyzer/yanshuf/testing pages -> drunk-driving and traffic-lawyer.
- speeding page -> traffic-lawyer and license suspension/points.
- Marvad pages -> traffic-lawyer and license suspension/medical fitness pages.
- fatal-road-accident criminal pages -> traffic-lawyer and criminal-lawyer, but only after criminal/traffic boundary approval.
- personal-injury car-accident pages -> personal-injury/car-accident pillar, not broad traffic-lawyer unless the context is traffic defense.

## Sitemap Plan

Include after approval:
- traffic pillar.
- only expanded, source-reviewed support pages.
- useful case-law pages if they have clear editorial framing and are not thin/duplicative.

Hold out of sitemap until review:
- thin support pages under 600 words.
- future clean slugs that resolve poorly or are not migrated.
- outdated Corona/temporary regulation pages.
- false-positive category pages.
- duplicate case-law pages that are merged into a support guide.

## Content Upload Readiness

READY FOR OWNER REVIEW:
- traffic-law cluster role map.
- category cleanup concept.
- URL strategy lanes.
- internal-link requirements.
- sitemap posture.

NOT READY FOR PUBLIC UPLOAD:
- final traffic pillar rewrite.
- drunk-driving expansion.
- breathalyzer/testing consolidation.
- license-suspension support page.
- Marvad consolidation.
- traffic/criminal fatal accident boundary.
- personal-injury car-accident separation.

BLOCKED:
- content upload.
- URL migration.
- redirect execution.
- taxonomy/category edits.
- sitemap changes.
- internal-link edits.
- related-card edits.
- title/H1/meta changes.
- legal/source-sensitive traffic claims.

## Next High-Value Batch

Prepare a no-URL-change content outline for:
1. `/traffic-lawyer/`
2. `/driving-under-the-influence/`
3. breathalyzer/refusal support group
4. license-suspension/points support group

Then owner/legal review can approve the first controlled upload batch without URL changes.
