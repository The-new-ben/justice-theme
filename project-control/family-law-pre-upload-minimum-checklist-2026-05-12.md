# Family / Divorce Minimum Pre-Upload Checklist

Date: 2026-05-12
Status: IN PROGRESS / REVIEW ONLY / NO PUBLIC CHANGES

This checklist defines the minimum safe gate before Family/Divorce moves from planning into controlled public draft import or upload. It does not approve public changes.

## Current Position

LATEST 2026-05-21 UPDATE:
- `tools/export-family-divorce-live-targets.mjs` now exports public text snapshots and metadata for the seven live Family/Divorce target pages before overwrite/update.
- VERIFIED LIVE / READ ONLY: all seven target pages exported as `PASS`, capturing `19,236` words in `reports/family-divorce-live-target-backup-2026-05-21/`.
- STILL REQUIRED: actual WordPress editor/database export before any CMS update; the snapshot is public text backup only.
- `tools/check-family-divorce-live-preupload.mjs` now provides a live read-only pre-upload guard for the seven clean Family/Divorce target slugs and protected P0 source URLs.
- VERIFIED LIVE / READ ONLY WITH BLOCKERS: `25` URLs checked; `13` pass, `7` are live-present-review target pages, and `5` protected sources redirect to homepage.
- GENERATED: `reports/family-divorce-live-preupload-2026-05-21.csv`.
- BLOCKED: the five homepage-redirecting protected sources need restore/update-in-place/documented 301 decisions after GSC API confirmation before Family/Divorce URL migration is approved.
- `tools/check-family-divorce-public-bodies.mjs` now provides repeatable static QA for the seven Family/Divorce public-body drafts.
- VERIFIED LOCAL: all seven public-body drafts passed the checker after one `/divorce-lawyer/` wording cleanup.
- GENERATED: `reports/family-divorce-public-body-static-qa-2026-05-21.csv`.
- STILL BLOCKED: this does not replace owner/legal/source approval, CMS backup, GSC API export before URL actions or post-upload live QA.

VERIFIED:
- Family/Divorce is the first recommended cluster for staged publishing.
- `58` URL or URL-reference items are in the current-url readiness queue.
- `82` planned internal-link/control rows are mapped.
- `13` owner-review decisions are packaged.
- The main duplicate divorce-lawyer group has now been checked across `6` live URLs; all returned `200` and self-canonicalized.
- The large Hebrew duplicate `/עורך-דין-לענייני-גירושין/` is strong enough to mine before final `/divorce-lawyer/` upload.
- The `/divorce-lawyer/` section-level merge outline now defines `20` target sections before any public copy import.
- The `/divorce-lawyer/` owner-review draft package now defines `15` owner decision rows before final merged draft preparation.
- The `/divorce-lawyer/` related-content boundary plan now defines `20` allowed/blocked related-card rows before any public upload.
- The Family/Divorce taxonomy/category plan now defines `22` first-wave decisions before any public upload.
- The Family/Divorce disclaimer/CTA policy now defines `20` page, CTA, trust-language and schema-safety rules before any public upload.
- The Family/Divorce protected-asset strategy now defines `16` document, tool, case-law and QA rows before any public upload.
- Divorce PDF, mediation DOCX, child-support calculator, custody article, custody PDF and custody case-law assets are planning-protected.
- The Family/Divorce first-upload package now defines `20` wave and wait-list rows for owner review.
- The `/divorce-lawyer/` final draft package now defines `36` cleanup, metadata, section and upload-control rows.
- The existing Hebrew draft is about `5,691` words and has now been reduced into a CMS-clean public body draft.
- `content-drafts/divorce-lawyer-public-body-he.md` contains a `2,374`-word public Hebrew body for `/divorce-lawyer/`.
- The clean public body scan found no internal planning notes and no fake-trust/rating language.
- `project-control/family-divorce-controlled-upload-qa-package-2026-05-12.csv` now defines `32` pre-upload, upload, post-upload, GSC follow-up and rollback QA rows.
- `project-control/family-divorce-wave-1b-support-review-package-2026-05-12.csv` now reviews all `6` Wave 1B support drafts, totaling `27,277` words.
- `content-drafts/consensual-divorce-public-body-he.md` contains a `1,875`-word public Hebrew body for `/consensual-divorce/`.
- The clean consensual-divorce body scan found no internal planning notes and no fake-trust/rating language.
- `content-drafts/divorce-mediation-public-body-he.md` contains a `2,059`-word public Hebrew body for `/divorce-mediation/`.
- The clean divorce-mediation body scan found no internal planning notes, no fake-trust/rating language and all required Family/Divorce related paths.
- `content-drafts/divorce-property-division-public-body-he.md` contains a `1,874`-word public Hebrew body for `/divorce-property-division/`.
- The clean divorce-property-division body scan found no internal planning notes, no fake-trust/rating language and all required Family/Divorce related paths.
- `content-drafts/family-dispute-resolution-public-body-he.md` contains a `1,992`-word public Hebrew body for `/family-dispute-resolution/`.
- The clean family-dispute-resolution body scan found no internal planning notes, no fake-trust/rating language and all required Family/Divorce related paths.
- `content-drafts/child-support-public-body-he.md` contains a `1,729`-word public Hebrew body for `/child-support/`.
- The clean child-support body scan found no internal planning notes, no fake-trust/rating language, no fixed calculator promise and all required Family/Divorce related paths.
- `content-drafts/child-custody-public-body-he.md` contains a `1,693`-word public Hebrew body for `/child-custody/`.
- The clean child-custody body scan found no internal planning notes, no fake-trust/rating language, no custody-result promises and all required Family/Divorce related paths.
- `project-control/family-divorce-wave-1b-support-approval-package-2026-05-12.csv` now defines a `16`-row owner/legal/source approval gate for all six Wave 1B support bodies.
- The six clean support bodies total `11,222` words across `435` lines and passed the strict scan for internal markers, fake trust, fake ratings, recommendation-label terms and guaranteed-result language.
- `project-control/family-divorce-first-upload-decision-brief-2026-05-12.csv` now defines a `10`-row owner decision brief for the first controlled upload scope.
- The current recommendation is Wave 1A only: approve and upload `/divorce-lawyer/` first after owner/legal/source approval and controlled QA.
- `project-control/family-divorce-divorce-lawyer-metadata-package-2026-05-12.csv` now defines a `20`-row metadata approval package for `/divorce-lawyer/`.
- Live `/divorce-lawyer/` returned `200` and self-canonicalized before the metadata package was created.
- The recommended `/divorce-lawyer/` metadata keeps the slug and canonical unchanged and blocks Review/AggregateRating/fake trust/fake rating claims.
- `project-control/family-divorce-divorce-lawyer-cms-upload-field-map-2026-05-12.csv` now defines a `24`-row practical CMS upload field map for `/divorce-lawyer/`.
- The CMS field map combines backup, body, metadata, taxonomy, related links, schema safety and post-upload QA into one operator worksheet.
- `project-control/family-divorce-wave-1b-support-metadata-package-2026-05-12.csv` now defines a `6`-row metadata package for all six Wave 1B support pages.
- All six Wave 1B support URLs returned `200` and self-canonicalized during the metadata check.
- The live pre-upload guard now confirms all seven clean target slugs already return `200` and self-canonicalize, so current live content must be backed up before any overwrite/update.
- The live pre-upload guard now confirms `5` protected Family/Divorce source URLs redirect to homepage and must be resolved or intentionally mapped before URL migration.
- Public text snapshots now preserve the current live target-page content for side-by-side comparison before approved overwrite/update.

NOT VERIFIED:
- GSC API export.
- Live post-upload QA, because upload has not happened.

VERIFIED:
- Side-by-side comparison of the old Hebrew divorce URL against `/divorce-lawyer/` exists at `project-control/family-divorce-divorce-pillar-side-by-side-2026-05-12.md`.

## Minimum Gates

MUST PASS BEFORE PUBLIC UPLOAD:
1. Compare `/divorce-lawyer/` with the old Hebrew divorce article.
2. Decide whether the old Hebrew divorce article is merged, kept, canonicalized later or redirected later.
3. Decide document strategy for divorce PDF and mediation DOCX.
4. Decide child-support calculator relationship to `/child-support/`.
5. Decide custody article/PDF/case-law relationship to `/child-custody/`.
6. Confirm exact support-page roles for consensual divorce, mediation, child support, custody, property division and family dispute resolution.
7. Confirm no duplicate H1/title intent across the cluster.
8. Confirm internal links from the 82-row map are ready for execution only after final content approval.
9. Confirm related-content boundaries avoid broad family-law, lawyer-ranking, Maya profile and trust/review claims.
10. Confirm no fake ratings, badges, recommendations or lawyer-trust claims.
11. Confirm disclaimers are present on sensitive legal informational content.
12. Confirm sitemap posture: include only after clean content, source review, internal links and self-canonical checks.
13. Confirm no redirects or noindex actions touch protected old URLs/documents without explicit approval.
14. Confirm broken-link and 404 checks are planned immediately after upload.
15. Confirm GSC monitoring plan exists for affected old and new URLs.
16. Approve `/divorce-lawyer/` owner-review draft package.
17. Prepare final merged draft/update package after approval or GSC API export.
18. Approve `/divorce-lawyer/` manual related-content allowlist and blocked related-card categories.
19. Approve first-wave taxonomy/category rules and verify actual `practice-areas` assignments after any draft import or public update.
20. Approve first-wave disclaimer/CTA rules and verify visible disclaimers, safe CTAs and no fake trust/schema signals after any preview or public update.
21. Approve protected document/tool/case URL rules and verify protected assets after any preview or public update.
22. Run GSC API export for protected Family/Divorce assets before any redirect, noindex, deletion, canonical or sitemap removal action.
23. Approve first-upload scope: Wave 1A only, or Wave 1A plus Wave 1B support pages.
24. Create CMS-clean `/divorce-lawyer/` public body file with internal notes removed and one final FAQ block.
25. Approve the CMS-clean `/divorce-lawyer/` public body after owner/legal/source review before upload.
26. Use the controlled upload QA package before and after any approved CMS update.
27. Prepare clean public bodies for Wave 1B support pages only after internal-note cleanup and page-specific risk review.
28. Approve the CMS-clean `/consensual-divorce/` public body after owner/legal/source review before upload.
29. Create CMS-clean `/divorce-mediation/` public body file with internal notes, source-audit notes, Maya/profile notes and LegalTech notes removed.
30. Approve the CMS-clean `/divorce-mediation/` public body after owner/legal/source review before upload.
31. Create CMS-clean `/divorce-property-division/` public body file with internal notes, source-audit notes, Maya/profile notes and LegalTech notes removed.
32. Approve the CMS-clean `/divorce-property-division/` public body after owner/legal/source review before upload.
33. Create CMS-clean `/family-dispute-resolution/` public body file with internal notes, source-audit notes, Maya/profile notes and LegalTech notes removed.
34. Approve the CMS-clean `/family-dispute-resolution/` public body after owner/legal/source review before upload.
35. Create CMS-clean `/child-support/` public body file with internal notes, source-audit notes, Maya/profile notes and LegalTech notes removed.
36. Approve the CMS-clean `/child-support/` public body after owner/legal/source review before upload.
37. Create CMS-clean `/child-custody/` public body file with internal notes, source-audit notes, Maya/profile notes and LegalTech notes removed.
38. Approve the CMS-clean `/child-custody/` public body after owner/legal/source review before upload.
39. Prepare a Wave 1B support-body approval package that groups the six clean bodies into approve/edit/hold decisions.
40. Approve the Wave 1B support-body upload scope after owner/legal/source review before any support page goes public.
41. Prepare a first-upload owner decision brief that states the safest upload scope and blocked alternatives.
42. Approve the first public Family/Divorce upload scope before any CMS/public change.
43. Prepare exact `/divorce-lawyer/` title/H1/meta/canonical/taxonomy package before any CMS edit.
44. Approve exact `/divorce-lawyer/` metadata package before any title/H1/meta/public upload change.
45. Prepare practical `/divorce-lawyer/` CMS upload field map before any operator edits WordPress.
46. Approve the `/divorce-lawyer/` CMS upload field map together with the clean body and metadata package before execution.
47. Prepare exact Wave 1B support-page metadata package before any support upload.
48. Approve Wave 1B support-page metadata together with support copy and upload scope before execution.
49. Run the Family/Divorce live pre-upload guard and export the current public-state report before any CMS update.
50. Backup/export the seven live target pages before any overwrite/update because they are already live and indexable.
51. Resolve or explicitly map the five protected source homepage redirects before URL migration, redirect, canonical/noindex or sitemap decisions.
52. Compare approved replacement bodies against the public live target snapshots and keep/merge any stronger current-live sections before upload.
53. Export actual WordPress editor/database content before CMS execution; the public text snapshot is not sufficient as rollback backup.

## Current Recommendation

RECOMMENDED:
- Move Family/Divorce into a controlled pre-upload comparison cycle.
- Do not wait for the full sitewide audit.
- Do not publish yet.
- Do not redirect or noindex anything yet.

BLOCKED:
- Public Hebrew copy, CMS import, title/H1/meta change, URL migration, redirect, noindex, canonical, sitemap, taxonomy/category, menu, breadcrumb, internal-link, related-card, schema, lawyer-card, Maya profile, review/rating, CRM, wp-admin setting or database row changes remain blocked until the checklist is approved.
