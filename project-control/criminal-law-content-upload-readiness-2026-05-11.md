# Criminal Law Content Upload Readiness Batch

Date: 2026-05-11
Status: VERIFIED / REVIEW ONLY / NO PUBLIC EXECUTION
Batch size: 50 URL candidates reviewed
Project area: Content audit / SEO structure / cannibalization / URL migration / category cleanup / internal links / sitemap planning

This is a larger cluster-level readiness batch for the criminal-law content system. It maps the current criminal-law universe into pillar, support, merge/rewrite, source/reference, boundary and exclude lanes before any public upload or URL action.

This does not approve content publishing, title/H1/meta changes, URL changes, redirects, noindex, canonical changes, sitemap changes, taxonomy edits, internal-link edits, related-card edits, schema changes, lawyer-card changes, CRM/review work or CMS/database writes.

## Batch Goal

Move the criminal-law cluster closer to a clean content-upload state:
- choose the likely criminal-law pillar lane.
- separate broad criminal-lawyer intent from support topics.
- prevent `criminal-lawyer`, `criminal-defense-attorney`, Tel Aviv criminal lawyer, "famous lawyer" and role/cost articles from competing blindly.
- map support pages for police investigation, indictment, detention, drug offenses, sex offenses, economic/white-collar crimes, criminal records and victim/criminal-procedure boundaries.
- identify foreign-law, source/reference and case-law material that should not be treated as core Israeli lawyer-service content.
- define internal-link, sitemap and redirect posture before any upload.

## Evidence Used

VERIFIED:
- `project-control/content-master-inventory.csv`
- `project-control/url-migration-map.csv`
- `project-control/internal-link-map.csv`
- `project-control/criminal-law-support-review.csv`
- `project-control/criminal-law-support-decision-packet.md`
- `project-control/content-decision-evidence-overlay.csv`
- `project-control/gsc-keyword-page-map.csv`
- `project-control/gsc-targeted-query-pass-2-2026-05-11.csv`
- `project-control/gsc-targeted-query-pass-3-2026-05-11.csv`
- `project-control/traffic-criminal-wrong-page-decision-packet-2026-05-11.md`

NOT VERIFIED:
- GA4 conversion and landing-page value for criminal-law pages.
- Full GSC API export for every criminal-law query variant.
- Authenticated WordPress taxonomy/menu/postmeta state.
- Legal/source review of old criminal-law articles and case-law summaries.
- Owner approval for any redirect, category change or content upload.

## Batch Results

VERIFIED / REVIEWED:
- 220 raw criminal-adjacent candidates were found in the inventory scan.
- 50 higher-value candidates were mapped in this readiness batch.
- 1 current clean-ish primary candidate: `/criminal-defense-attorney/`.
- 1 strategic future pillar target: `/criminal-lawyer/`.
- 1 old GSC-visible criminal-lawyer URL must be protected before migration.
- 13 broad criminal-lawyer/commercial support and cannibalization candidates were reviewed.
- 7 police, records and source candidates were reviewed.
- 4 indictment/procedure candidates were reviewed.
- 6 detention/arrest candidates were reviewed.
- 9 offense-type candidates were reviewed.
- 5 sex/trafficking/cyber-criminal candidates were reviewed.
- 5 foreign-law, victim-rights, defamation and boundary candidates were separated from the core upload batch.

## Main SEO Finding

VERIFIED: the criminal-law cluster has a real pillar gap.

GSC evidence shows:
- `עורך דין פלילי` has 267 impressions on the old Hebrew criminal-lawyer URL.
- `דין פלילי` has 275 impressions on the same old Hebrew criminal URL, plus a legacy deep URL.
- the homepage appears weakly for criminal-lawyer intent.
- `/criminal-defense-attorney-roles-and-responsibilities/` appears with only 1 impression in the checked broad query pass.
- `/criminal-lawyer/` is a strategic target but is not approved as a live migration destination yet.

Decision impact:
- do not publish or redirect to `/criminal-lawyer/` yet.
- do not delete or noindex old Hebrew criminal pages.
- do not let the homepage keep carrying criminal-lawyer intent.
- select the primary through owner/legal review, then approve a redirect/internal-link/sitemap plan.

## Recommended Criminal-Law Structure

Strategic primary target for owner review:
- `https://jus-tice.co.il/criminal-lawyer/`

Current primary candidate to compare:
- `https://jus-tice.co.il/criminal-defense-attorney/`

Protected old GSC-visible URL:
- old Hebrew criminal-lawyer URL shown in GSC for `עורך דין פלילי` and `דין פלילי`.

Core support candidates:
- `https://jus-tice.co.il/%D7%94%D7%9B%D7%A0%D7%94-%D7%9C%D7%97%D7%A7%D7%99%D7%A8%D7%94-%D7%91%D7%9E%D7%A9%D7%98%D7%A8%D7%94/`
- `https://jus-tice.co.il/articles/%D7%9E%D7%97%D7%99%D7%A7%D7%AA-%D7%9B%D7%AA%D7%91-%D7%90%D7%99%D7%A9%D7%95%D7%9D-%D7%97%D7%96%D7%A8%D7%94-%D7%9E%D7%9B%D7%AA%D7%91-%D7%90%D7%99%D7%A9%D7%95%D7%9D-%D7%91%D7%99%D7%98%D7%95%D7%9C/`
- `https://jus-tice.co.il/detention-before-charge-or-trial/`
- `https://jus-tice.co.il/detention-days/`
- `https://jus-tice.co.il/drug-offenses-criminal-lawyer/`
- `https://jus-tice.co.il/economic-crimes-white-collar-lawyer/`
- `https://jus-tice.co.il/tax-offenses-criminal-lawyer/`
- `https://jus-tice.co.il/sex-crime-lawyer/`
- `https://jus-tice.co.il/sexual-offenses/`
- `https://jus-tice.co.il/criminal-defenses/`
- `https://jus-tice.co.il/expungement-of-criminal-records/`

Support or case/source review candidates:
- Israel Police / investigation source pages.
- criminal procedure and prosecution-source pages.
- detention forms and long detention-source pages.
- public-defender/crime statistics/reference pages.
- specific case-law pages only if they receive editorial framing and do not become the primary service page.

Boundary clusters:
- traffic-criminal pages, including driving under drugs and fatal-road-accident offenses, need a shared boundary plan with traffic law.
- cyber-criminal pages should link to both criminal and cyber/privacy only after cluster approval.
- victim-rights pages should not replace defense-lawyer service pages.
- foreign-law and international criminal pages should be separated from Israeli criminal-lawyer commercial intent.
- defamation/police-complaint pages belong in a defamation/criminal-boundary lane, not the main criminal pillar.

## Canonical Category Recommendation

Recommended canonical category:
- `criminal-law`

Include only:
- criminal lawyer service page.
- police investigation.
- indictment and criminal proceedings.
- detention/arrest.
- drug offenses.
- sex offenses.
- economic and white-collar crimes.
- tax offenses where criminal-lawyer intent is explicit.
- criminal record deletion/expungement.
- core criminal defenses.
- selected case-law only when editorially framed.

Exclude or move out:
- international country-specific lawyer pages.
- US/foreign law explainer pages.
- generic law school/legal-career pages.
- source/report PDFs without practical Israeli user framing.
- victim-rights pages unless a separate victim-rights cluster is approved.
- traffic-law pages except approved boundary content.
- defamation pages unless a defamation/criminal-boundary cluster is approved.

## URL Strategy

Keep current URLs for planning:
- `/criminal-defense-attorney/`
- `/criminal-defense-attorney-roles-and-responsibilities/`
- `/drug-offenses-criminal-lawyer/`
- `/tax-offenses-criminal-lawyer/`
- `/economic-crimes-white-collar-lawyer/`
- `/sex-crime-lawyer/`
- `/sexual-offenses/`
- `/detention-before-charge-or-trial/`
- `/detention-days/`
- `/criminal-defenses/`
- `/expungement-of-criminal-records/`

Future clean slugs for owner review only:
- `/criminal-lawyer/`
- `/police-investigation/`
- `/indictment/`
- `/pretrial-detention/`
- `/drug-offenses/`
- `/white-collar-crime/`
- `/tax-offenses/`
- `/sex-offenses/`
- `/criminal-record-deletion/`
- `/suspect-rights/`
- `/closing-criminal-case/`

Do not execute any future slug without:
- old URL -> 301 -> new URL.
- sitemap update.
- internal-link update.
- canonical consistency.
- GSC risk review.
- owner/legal approval.

## Internal-Link Plan

After approval, the minimum internal-link map should include:
- criminal pillar -> police investigation, indictment, detention, drug offenses, sex offenses, white-collar/economic crime, tax offenses, criminal record deletion, criminal defenses and lawyer-cost/selection pages.
- each support page -> criminal pillar.
- police investigation -> suspect rights, criminal record deletion, indictment and detention.
- indictment -> criminal proceedings, criminal defenses, detention and criminal pillar.
- detention pages -> criminal pillar, indictment, police investigation and criminal defenses.
- drug offenses -> criminal pillar, drug trafficking and traffic/drugged-driving boundary.
- sex offenses -> criminal pillar, sex-crime lawyer page, trafficking/cybersex boundary.
- economic/white-collar/tax pages -> criminal pillar and each other.
- case-law pages -> only the specific support guide they illustrate, not all criminal pages.
- foreign-law pages -> international-law lane, not Israeli criminal-lawyer pillar.

## Sitemap Plan

Include after approval:
- selected criminal pillar.
- expanded, source-reviewed criminal support pages.
- high-quality offense-type support pages.
- useful case/source pages only if they have clear editorial framing and are not thin/duplicative.

Hold out of sitemap until review:
- thin support pages under 600 words.
- future clean slugs that are not migrated.
- foreign-law pages that duplicate Israeli intent.
- source reports without user-focused summaries.
- specific public-case pages that GSC maps to broad support queries by accident.
- duplicate "best/famous/top criminal lawyer" pages unless consolidated.

## Content Upload Readiness

READY FOR OWNER REVIEW:
- criminal-law cluster role map.
- category cleanup concept.
- URL strategy lanes.
- internal-link requirements.
- sitemap posture.
- 50-row candidate decision CSV.

NOT READY FOR PUBLIC UPLOAD:
- final criminal pillar rewrite.
- URL migration from old Hebrew criminal-lawyer page to `/criminal-lawyer/`.
- redirect plan.
- indictment guide.
- police investigation guide.
- detention guide consolidation.
- drug offenses slug decision.
- sex/economic/tax offense consolidation.
- criminal-record deletion rewrite.

BLOCKED:
- content upload.
- URL migration.
- redirect execution.
- taxonomy/category edits.
- sitemap changes.
- internal-link edits.
- related-card edits.
- title/H1/meta changes.
- legal/source-sensitive criminal-law claims.

## Next High-Value Batch

Prepare a no-URL-change owner review packet for:
1. current `/criminal-defense-attorney/` vs future `/criminal-lawyer/`.
2. old GSC-visible Hebrew criminal-lawyer URL protection and redirect conditions.
3. support outline queue for police investigation, indictment, detention and drug offenses.
4. exact internal-link map using only approved current URLs until migration is approved.
