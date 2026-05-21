# Visual QA Report
Date: 2026-05-09
Status: PARTIAL VISUAL QA COMPLETED.

## 2026-05-21 GSC Credential Hygiene
- FIXED / VERIFIED LOCAL: `tools/gsc/oauth-client.json` was removed from Git tracking and remains a local ignored file.
- FIXED / VERIFIED LOCAL: `.gitignore` now ignores local GSC OAuth client/token credential JSON files.
- CREATED / VERIFIED LOCAL: `project-control/gsc-credential-hygiene-2026-05-21.md`.
- CREATED / VERIFIED LOCAL: `project-control/gsc-credential-hygiene-2026-05-21.csv`.
- NOT VISUALLY VERIFIED: no screenshots were taken because this was credential hygiene and documentation only.
- BLOCKED / OWNER ACTION: if the removed OAuth client was real, rotate or recreate it in Google Cloud before the next GSC API export.
- SAFETY: credential contents were not printed; no public page, CMS database row, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap, lawyer, lead, CRM, payment or admin setting changed.

## 2026-05-21 Family/Divorce CMS Operator Runbook
- CREATED / VERIFIED LOCAL: `project-control/family-divorce-cms-operator-runbook-2026-05-21.md`.
- CREATED / VERIFIED LOCAL: `project-control/family-divorce-cms-operator-runbook-2026-05-21.csv`.
- VERIFIED PLANNING: runbook covers `7` target pages and requires backup, update-existing-page-only execution, post-upload route/source/link checks and visual screenshots after approved upload.
- NOT VISUALLY VERIFIED: no screenshots were taken because this cycle created an operator runbook only and no public UI changed.
- BLOCKED: public screenshots remain pending until owner/legal/source approval, CMS backup, approved upload and route/content QA.
- SAFETY: no public page, CMS database row, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap, lawyer, lead, CRM, payment or admin setting changed.

## 2026-05-21 Family/Divorce Owner Review Packet
- CREATED / VERIFIED LOCAL: `project-control/family-divorce-owner-review-packet-2026-05-21.md`.
- CREATED / VERIFIED LOCAL: `project-control/family-divorce-owner-review-packet-2026-05-21.csv`.
- VERIFIED LOCAL: packet covers `7` locally merged upload candidates and all seven retain static QA `PASS`.
- FIXED / VERIFIED LOCAL: the packet records the resolved high-risk merge blockers for `/divorce-property-division/`, `/child-custody/` and `/child-support/`.
- NOT VISUALLY VERIFIED: no screenshots were taken because this cycle created a local owner review packet only and no public UI changed.
- BLOCKED: public screenshots remain pending until owner/legal/source approval, CMS backup, approved upload and route/content QA.
- SAFETY: no public page, CMS database row, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap, lawyer, lead, CRM, payment or admin setting changed.

## 2026-05-21 Family/Divorce Child-Support Merge Decisions And Draft Merge
- TOOLING FIXED / VERIFIED LOCAL: added `tools/resolve-family-divorce-child-support-merge.mjs`.
- TOOLING FIXED / VERIFIED LOCAL: added `tools/apply-family-divorce-child-support-draft-merges.mjs`.
- CONTENT FIXED / VERIFIED LOCAL: applied the four approved `/child-support/` draft merges.
- VERIFIED LOCAL: resolved all `35` current-live candidate rows for `/child-support/`: `4` merge, `25` covered/no action and `6` skip as UI/CTA/taxonomy/related-link fragments.
- VERIFIED LOCAL: all four approved insertion blocks are present in `content-drafts/child-support-public-body-he.md`.
- VERIFIED LOCAL: reran `tools/check-family-divorce-public-bodies.mjs`; all seven Family/Divorce public-body drafts passed static QA.
- VERIFIED: `/child-support/` passes static QA with `1,650` words, all required links, no internal markers, no fake-trust hits and disclaimer status `PASS`.
- FIXED: all three high-risk Family/Divorce merge blockers are now resolved locally.
- NOT VISUALLY VERIFIED: no screenshots were taken because this was a local content-draft edit only and no public UI changed.
- BLOCKED: owner/legal/source approval and actual WordPress editor/database backup are still required before CMS upload; GSC API/export remains required before URL migration or redirect/canonical/noindex/sitemap actions.
- SAFETY: no public page, CMS database row, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap, lawyer, lead, CRM, payment or admin setting changed.

## 2026-05-21 Family/Divorce Child-Custody Merge Decisions And Draft Merge
- TOOLING FIXED / VERIFIED LOCAL: added `tools/resolve-family-divorce-child-custody-merge.mjs`.
- TOOLING FIXED / VERIFIED LOCAL: added `tools/apply-family-divorce-child-custody-draft-merges.mjs`.
- CONTENT FIXED / VERIFIED LOCAL: applied the nine approved `/child-custody/` draft merges.
- VERIFIED LOCAL: resolved all `35` current-live candidate rows for `/child-custody/`: `9` merge, `20` covered/no action and `6` skip as UI/CTA/taxonomy/related-link fragments.
- VERIFIED LOCAL: all nine insertion IDs are present in `content-drafts/child-custody-public-body-he.md`.
- VERIFIED LOCAL: reran `tools/check-family-divorce-public-bodies.mjs`; all seven Family/Divorce public-body drafts passed static QA.
- VERIFIED: `/child-custody/` passes static QA with `1,748` words, all required links, no internal markers, no fake-trust hits and disclaimer status `PASS`.
- NOT VISUALLY VERIFIED: no screenshots were taken because this was a local content-draft edit only and no public UI changed.
- BLOCKED: owner/legal/source approval and actual WordPress editor/database backup are still required before CMS upload; `/child-support/` still needs merge decisions.
- SAFETY: no public page, CMS database row, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap, lawyer, lead, CRM, payment or admin setting changed.

## 2026-05-21 Family/Divorce Property-Division Draft Merge
- CONTENT FIXED / VERIFIED LOCAL: applied the six approved `/divorce-property-division/` draft merges.
- TOOLING FIXED / VERIFIED LOCAL: added `tools/apply-family-divorce-property-division-draft-merges.mjs`.
- VERIFIED LOCAL: all six insertion IDs are present in `content-drafts/divorce-property-division-public-body-he.md`.
- VERIFIED LOCAL: reran `tools/check-family-divorce-public-bodies.mjs`; all seven Family/Divorce public-body drafts passed static QA.
- VERIFIED: `/divorce-property-division/` passes static QA with `1,851` words, all required links, no internal markers, no fake-trust hits and disclaimer status `PASS`.
- NOT VISUALLY VERIFIED: no screenshots were taken because this was a local content-draft edit only and no public UI changed.
- BLOCKED: owner/legal/source approval and actual WordPress editor/database backup are still required before CMS upload.
- SAFETY: no public page, CMS database row, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap, lawyer, lead, CRM, payment or admin setting changed.

## 2026-05-21 Family/Divorce Property-Division Merge Decisions
- TOOLING FIXED / VERIFIED LOCAL: added `tools/resolve-family-divorce-property-division-merge.mjs`.
- VERIFIED LOCAL: resolved all `35` current-live candidate rows for `/divorce-property-division/`.
- VERIFIED: decision output is `6` merge into draft, `23` covered/no action and `6` skip as UI/CTA/taxonomy/related-link fragments.
- BLOCKED: `/divorce-property-division/` still needs six concise draft edits and static QA rerun before owner/legal/source approval or CMS upload.
- NOT VISUALLY VERIFIED: no screenshots were taken because this was content-merge planning only and no public UI changed.
- NEXT QA: after draft merges and approved CMS update, rerun content/route QA and capture screenshots.
- SAFETY: no public page, CMS database row, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap, lawyer, lead, CRM, payment or admin setting changed.

## 2026-05-21 Family/Divorce High-Risk Merge Review
- TOOLING FIXED / VERIFIED LOCAL: added `tools/prepare-family-divorce-merge-review.mjs`.
- VERIFIED LOCAL: generated `165` section-level merge-review rows for `/child-support/`, `/child-custody/` and `/divorce-property-division/`.
- VERIFIED: worksheet includes `60` draft base sections, `30` live sections marked `REVIEW_FOR_MERGE`, `46` marked `PARTIAL_OVERLAP_REVIEW` and `29` marked `COVERED_BY_DRAFT`.
- BLOCKED: these three pages should not be uploaded until review rows are resolved into keep/merge/rewrite/skip decisions.
- NOT VISUALLY VERIFIED: no screenshots were taken because this was content-merge planning only and no public UI changed.
- NEXT QA: after resolved merge decisions and approved CMS update, rerun content/route QA and capture screenshots.
- SAFETY: no public page, CMS database row, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap, lawyer, lead, CRM, payment or admin setting changed.

## 2026-05-21 Family/Divorce Live vs Draft Comparison
- TOOLING FIXED / VERIFIED LOCAL: added `tools/compare-family-divorce-live-vs-drafts.mjs`.
- VERIFIED LOCAL: compared seven live public text snapshots against seven clean public-body drafts.
- VERIFIED: live snapshots total `19,236` words; drafts total `11,673` words; net draft reduction is `-7,563` words.
- BLOCKED: no blind overwrite; all seven pages require merge review before upload.
- HIGH PRIORITY MERGE REVIEW: `/child-support/`, `/child-custody/` and `/divorce-property-division/`.
- NOT VISUALLY VERIFIED: no screenshots were taken because this was text comparison only and no public UI changed.
- NEXT QA: after merge review and approved CMS update, rerun live route/content QA and capture screenshots.
- SAFETY: no public page, CMS database row, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap, lawyer, lead, CRM, payment or admin setting changed.

## 2026-05-21 Family/Divorce Live Target Backup
- TOOLING FIXED / VERIFIED LOCAL: added `tools/export-family-divorce-live-targets.mjs`.
- VERIFIED LIVE / READ ONLY: all seven Family/Divorce target pages returned `200`, stayed on their own final paths and exported as `PASS`.
- GENERATED: `reports/family-divorce-live-target-backup-2026-05-21/` with a manifest and seven public-text snapshots.
- VERIFIED: captured `19,236` words of current live public text before any CMS overwrite/update.
- NOT VISUALLY VERIFIED: no screenshots were taken because this cycle captured text/metadata snapshots and did not change public UI.
- NOT A DB BACKUP: WordPress editor/database export is still required before CMS edits.
- NEXT QA: compare these snapshots against the approved replacement drafts, then capture screenshots only after an approved staging/public update.
- SAFETY: no public page, CMS database row, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap, lawyer, lead, CRM, payment or admin setting changed.

## 2026-05-21 Family/Divorce Live Pre-Upload Guard
- TOOLING FIXED / VERIFIED LOCAL: added `tools/check-family-divorce-live-preupload.mjs`.
- VERIFIED LIVE / READ ONLY WITH BLOCKERS: checked `25` Family/Divorce URLs and generated `reports/family-divorce-live-preupload-2026-05-21.csv`.
- VERIFIED LIVE: `13` protected source/asset URLs remain reachable.
- LIVE PRESENT REVIEW: all `7` clean upload targets return `200` on their own final paths and self-canonicalize; current live content must be backed up before overwrite/update.
- BLOCKED LIVE: `5` protected source URLs return initial `301` to homepage and should not be lost during Family/Divorce upload planning.
- NOT VISUALLY VERIFIED: no screenshots were taken because this cycle was route/SEO pre-upload QA only and no public content changed.
- NEXT QA: after redirect cleanup or GSC-confirmed mapping decisions, rerun the checker and only then capture screenshots for the updated Family/Divorce pages.
- SAFETY: no public page, CMS database row, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap, lawyer, lead, CRM, payment or admin setting changed.

## 2026-05-21 Family/Divorce Public Body Static QA
- TOOLING FIXED / VERIFIED LOCAL: added `tools/check-family-divorce-public-bodies.mjs`.
- VERIFIED LOCAL: all seven public-body drafts passed static checks for minimum length, required Family/Divorce links, internal markers, fake trust/review/outcome-promise terms and disclaimer signals.
- FIXED: `content-drafts/divorce-lawyer-public-body-he.md` had one caution sentence adjusted to avoid an outcome-promise phrase.
- NOT VISUALLY VERIFIED: no public screenshots were taken because no CMS/public upload happened.
- NOT LEGAL VERIFIED: static QA does not replace owner/legal/source review.
- SAFETY: no public page, CMS database row, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap, lawyer, lead, CRM, payment or admin setting changed.

## 2026-05-21 Trust Route Early Render QA
- CODE FIXED / NOT LIVE VERIFIED: `/contact/`, `/about/` and `/editorial-policy/` now render at `template_redirect` priority `-999999`.
- CODE FIXED / NOT LIVE VERIFIED: trust-route output now sends `X-Justice-Route-Guard: trust-route-early-render`.
- VERIFIED LOCAL: PHP lint passed for `functions.php` and `inc/trust-routes.php`; JS syntax passed for the traffic-priority and trust-route checkers; task-board CSV parse and `git diff --check` passed with normal Windows line-ending warnings only.
- NOT VISUALLY VERIFIED: public screenshots are not useful until uPress pull/cache clear and the routes stop returning initial `301` to homepage.
- NEXT QA: after deploy, `/contact/` and `/about/` should return initial `200`, stay on their own final paths and remain indexable.
- BLOCKED: if initial `301` remains after deploy, inspect server/CDN/host-panel/early-plugin redirect rules.
- SAFETY: no CMS page, database row, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, payment or admin setting changed.

## 2026-05-21 Protected Practice Route Early Render QA
- CODE FIXED / NOT LIVE VERIFIED: controlled practice routes now render at `template_redirect` priority `-999999` and exit before later redirect plugins.
- CODE FIXED / NOT LIVE VERIFIED: `/site-map/` renderer now runs at `template_redirect` priority `-999999`.
- VERIFIED LOCAL: `php -l inc/practice-landing.php`, `php -l inc/html-sitemap.php` and `php -l functions.php` passed.
- NOT VISUALLY VERIFIED: public screenshots are still blocked until uPress pull/cache clear and route final-path checks pass.
- NEXT QA: after deploy, `/medical-malpractice-lawyer/`, `/real-estate-lawyer-guide/`, `/inheritance-lawyer/` and `/site-map/` should return initial `200`; if not, inspect server/CDN/plugin redirect rules.
- SAFETY: no CMS page, database row, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, payment or admin setting changed.

## 2026-05-21 Public Route Home Redirect Triage
- TOOLING FIXED / VERIFIED LOCAL: `tools/check-live-traffic-priority.mjs` now records `initialHttp` and `redirectLocation` before following redirects.
- VERIFIED LIVE: `/`, `/articles/`, `/family-law/`, `/lawyers/?area=family-law`, `/criminal-defense-attorney/` and `/traffic-lawyer/` returned initial `200`.
- BLOCKED LIVE: `/site-map/`, `/medical-malpractice-lawyer/`, `/real-estate-lawyer-guide/`, `/inheritance-lawyer/`, `/contact/` and `/about/` returned initial `301` to the homepage.
- NOT VISUALLY VERIFIED: screenshots are not useful for the blocked six because they resolve to homepage HTML.
- NEXT QA: after deployment/cache clear or redirect-rule cleanup, rerun `node tools/check-live-traffic-priority.mjs`; capture screenshots only for routes that return initial `200` and stay on their own final path.
- SAFETY: no CMS page, database row, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, payment or admin setting changed.

## 2026-05-21 Real Estate Guide Redirect Guard QA
- BLOCKED LIVE: `/real-estate-lawyer-guide/` currently redirects to the homepage before the controlled guide template renders.
- BLOCKED LIVE: `/real-estate-lawyer-guide` currently redirects to `http://jus-tice.co.il/real-estate-attorney`.
- CODE FIXED / NOT LIVE VERIFIED: `inc/routing-guards.php` now blocks WordPress-level guide-route redirects to `/` and `/real-estate-attorney`.
- TOOLING FIXED: `tools/check-live-traffic-priority.mjs` now flags route checks when final path does not match the expected path.
- ROUTE QA BACKLOG: the tightened checker also flags `/site-map/`, `/medical-malpractice-lawyer/`, `/inheritance-lawyer/`, `/contact/` and `/about/` as current homepage-fallback final-path failures.
- VERIFIED LOCAL: `php -l inc/routing-guards.php`, `php -l functions.php`, and `node --check tools/check-live-traffic-priority.mjs` passed.
- NOT VISUALLY VERIFIED: no browser screenshot was useful before deploy because the public route still resolves away from the guide page.
- NEXT QA: after uPress pull/cache clear, rerun the traffic checker and capture a visual screenshot only after the URL stays on `/real-estate-lawyer-guide/`.
- SAFETY: no CMS page, database row, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap, lawyer, lead, payment or admin setting changed.

## 2026-05-21 Real Estate Public Edit Package Live Check
- VERIFIED LIVE / READ ONLY: `/real-estate-attorney/` returned `200`, stayed on its own URL and self-canonicalized.
- VERIFIED LIVE / READ ONLY: `/lawyer-for-buying-or-selling-a-house/`, `/registration-of-real-estate-israel/`, `/land-appreciation-tax/`, `/real-estate-lawyer-cost-2025/` and `/real-estate-appraiser/` returned `200` and self-canonicalized.
- VERIFIED SOURCE: sampled support pages currently showed `0` links to `/real-estate-attorney/`, confirming the planned support-to-hub link batch is still needed.
- BLOCKED LIVE: `/real-estate-lawyer-guide/` returned `200` but resolved to homepage URL/canonical, so it is not visually/SEO safe for promotion yet.
- CREATED: `project-control/real-estate-public-edit-package-2026-05-21.md`.
- CREATED: `project-control/real-estate-public-edit-package-2026-05-21.csv`.
- NOT PUBLISHED: this was a read-only live check and repo documentation package only.
- SAFETY: no public CMS body/title/H1/meta, URL, redirect, canonical, noindex, taxonomy, sitemap, lawyer, lead, payment or admin setting changed.

## 2026-05-21 Recommendation Token Safety Checker QA
- TOOLING FIXED / VERIFIED LOCAL: added `tools/check-recommendation-token-safety.mjs`.
- VERIFIED LOCAL: `node --check tools/check-recommendation-token-safety.mjs` passed.
- VERIFIED LOCAL: `node tools/check-recommendation-token-safety.mjs` passed.
- VERIFIED LOCAL: checker reports PASS for private token CPT, hashed token storage, noindex token form, honeypot, draft-only recommendation creation, `first_party`, `confirmed`, `draft_review`, no submission-level `approved_public`, source-filtered public guard and no Review/AggregateRating schema.
- NOT LIVE VERIFIED: this is static source QA only, not authenticated admin or browser form QA.
- SAFETY: no public page, CMS database row, Google API, outbound client message, public schema, redirect, sitemap or payment changed.

## 2026-05-21 First-Party Recommendation Token Intake QA
- CODE FIXED / NOT LIVE VERIFIED: owner/admin can create a one-time first-party recommendation link for a lawyer profile.
- CODE FIXED / NOT LIVE VERIFIED: public token URL renders a standalone Hebrew `noindex,nofollow` intake form and saves valid submissions as draft recommendations only.
- VERIFIED LOCAL: `php -l inc/lawyer-recommendations.php` passed.
- VERIFIED LOCAL: `php -l inc/lawyer-onboarding.php` passed.
- VERIFIED LOCAL: `git diff --check` passed with normal Windows line-ending warnings only.
- NOT AUTHENTICATED VERIFIED: WordPress admin create-link button and admin notice were not visually checked because no authenticated admin session was available.
- NOT LIVE VERIFIED: token form rendering/submission and public-profile display were not tested on the public server in this cycle.
- SAFETY: no live CMS database row, Google API, Google import, outbound client message, public review schema, AggregateRating, payment, redirect or sitemap changed.

## 2026-05-21 First-Party Recommendation Display Guard QA
- CODE FIXED / NOT LIVE VERIFIED: public recommendation queries now require `recommendation_source_type=first_party` in addition to linked lawyer ID, `approved_public` moderation and `confirmed` permission.
- VERIFIED LOCAL: `php -l inc/lawyer-recommendations.php` passed.
- NOT LIVE VERIFIED: public profile behavior still requires uPress pull/cache refresh and a real approved first-party recommendation record.
- NOT AUTHENTICATED VERIFIED: the WordPress admin source-type selector was not visually checked because no authenticated admin session was available.
- SAFETY: no Google API, Google review import, outbound message, public review schema, CMS database row, recommendation/lawyer/customer record or public page content was changed.

## 2026-05-21 Lawyer Platform Owner Walkthrough Live Boundary Check
- VERIFIED LIVE: `/`, `/lawyer-plans/`, `/lawyer-registration/`, `/lawyer-dashboard/` and `/lawyers/` returned `200`.
- VERIFIED LIVE: `/legal-tools/` resolved to the homepage, so direct LegalTech archive promotion remains blocked until real archive/tool records are verified.
- VERIFIED SOURCE: homepage HTML contains `legaltech-tools`, `AI Console`, `ask-lawyer` and `data-lead-message`.
- VERIFIED SOURCE: homepage HTML has no direct `/legal-tools/` archive link and no page-level `noindex`.
- VERIFIED PRIVATE: unauthenticated Lawyer Onboarding, Lawyer Prospects and Outreach Links admin URLs redirect to WordPress login.
- NOT VERIFIED: no authenticated admin screenshot was captured in this cycle because no WordPress admin session was available.
- SAFETY: read-only public/private boundary QA only; no CMS, database, payment, lawyer, lead, prospect, product, redirect, sitemap, taxonomy or outreach change was made.

## 2026-05-11 Criminal Law Primary URL Live Check
- VERIFIED LIVE: `/criminal-defense-attorney/` returns `200 OK`, self-canonicalizes, is indexable and has criminal-lawyer title/H1 signals.
- VERIFIED LIVE: `/criminal-defense-attorney-roles-and-responsibilities/` returns `200 OK`, self-canonicalizes and behaves as a support page.
- BLOCKED / ROUTE RISK: `/criminal-lawyer/`, the old Hebrew broad criminal-lawyer URL and the sampled legacy deep criminal-law URL currently redirect to the homepage.
- CREATED: `project-control/criminal-law-primary-live-url-check-2026-05-11.csv`.
- CREATED: `project-control/criminal-law-primary-redirect-check-2026-05-11.csv`.
- SAFETY: no public content, URL, redirect, sitemap, canonical, taxonomy, menu, lawyer, CRM, review, plugin setting, wp-admin setting or database row was changed.

## 2026-05-11 Lawyer REST Public Guard Post-Pull QA
- VERIFIED LIVE: public pages now report deployment marker `2026-05-11-lawyer-rest-public-guard-v1` in page meta.
- VERIFIED LIVE: `/lawyers/` returned HTTP `200`, `0` lawyer cards and no placeholder phone hits.
- VERIFIED LIVE: anonymous `/wp-json/wp/v2/justice_lawyer?per_page=20` returned HTTP `200`, `X-WP-Total: 0`, no placeholder phone hits and no sensitive meta-key hits.
- VERIFIED LIVE: anonymous `/wp-json/wp/v2/justice_lawyer/19139` returned HTTP `404`.
- REVIEW: static `deployment-marker.txt` still reports `2026-05-11-branding-polish-v3`, so page-meta marker is the reliable live marker for this check.
- REVIEW: the sampled old profile route ends at the homepage with HTTP `200` and no lawyer/placeholder exposure instead of the expected generic noindex `404`; this needs routing/permalink review.
- CREATED: `project-control/live-lawyer-rest-public-guard-2026-05-11.csv`.
- SAFETY: no CMS records, lawyer records, URLs, redirects, taxonomy, sitemap, content, menu, CRM, review or wp-admin settings were changed.

## 2026-05-11 Lawyer REST Public Guard QA
- VERIFIED LIVE BASELINE: `/lawyers/` returned HTTP `200`, marker `2026-05-11-branding-polish-v3`, `0` lawyer cards and no placeholder phone hits.
- VERIFIED LIVE RISK: anonymous `/wp-json/wp/v2/justice_lawyer?per_page=20` returned HTTP `200`, `X-WP-Total: 10`, `11` placeholder phone hits and `50` sensitive meta-key hits.
- VERIFIED LIVE RISK: anonymous `/wp-json/wp/v2/justice_lawyer/19139` returned HTTP `200` before this patch is live.
- CODE FIXED / NOT LIVE VERIFIED: anonymous lawyer REST output is now gated to public-approved profiles only, direct unapproved IDs return 404, and public responses strip sensitive custom meta.
- CODE FIXED / NOT LIVE VERIFIED: unapproved lawyer profile routes are marked as 404 before SEO/head output and forced to generic noindex/nofollow signals.
- CREATED: `project-control/live-lawyer-rest-public-guard-2026-05-11-before-pull.csv`.
- NEXT QA: after uPress pull/cache refresh, rerun `tools/check-live-lawyer-rest-public-guard.ps1` and verify marker `2026-05-11-lawyer-rest-public-guard-v1`.
- SAFETY: no CMS records, lawyer records, URLs, redirects, taxonomy, sitemap, content, menu, CRM, review or wp-admin settings were changed.

## 2026-05-11 Logo/Favicon Polish V3 QA
- CODE FIXED: duplicate fallback favicon output was removed from `header.php`; fallback logic remains centralized in `inc/seo.php` and respects WordPress Site Icon when present.
- CODE FIXED: premium brand CSS cache version moved to `4.3.1`; theme version moved to `1.0.4`; deployment marker moved to `2026-05-11-branding-polish-v3`.
- VERIFIED LOCAL: `assets/css/premium-pass-4.css` no longer contains negative `letter-spacing` declarations in the new brand/trust polish rules.
- VERIFIED LOCAL: `git diff --check` passed with only normal Windows LF-to-CRLF warnings.
- VERIFIED LOCAL: PHP lint passed for all PHP files using the owner-provided local PHP zip extracted to a temporary runtime.
- NOT LIVE VERIFIED: public source still reports `justice-deployment-marker` as `2026-05-11-media-sitemap-https-v1`, so uPress pull/cache refresh is required before browser-tab and mobile favicon visual QA.
- SAFETY: no public content, URL slug, redirect, canonical, sitemap, title/H1/meta, taxonomy, menu, lawyer, CRM, review, wp-admin option or CMS/database row was changed.

## 2026-05-11 GSC Cyber / Privacy / National Insurance Evidence Screenshots
- VERIFIED: browser GSC access was used for the cyber/privacy and national-insurance gap pass on the URL-prefix property `https://jus-tice.co.il/`.
- EVIDENCE: `project-control/visual-evidence/gsc-gap-query-cyber-lawyer-2026-05-11.png`.
- EVIDENCE: `project-control/visual-evidence/gsc-gap-query-privacy-lawyer-2026-05-11.png`.
- VERIFIED: `עורך דין סייבר` maps weakly to `/cybercrime-lawyer-roll/`; privacy lawyer and the checked national-insurance service/hub rows showed no visible primary signal.
- BLOCKED: GSC screenshot capture timed out for the national-insurance rows after the cyber/privacy screenshots; text metrics and rows were still recorded in `project-control/gsc-cyber-national-gap-pass-2026-05-11.csv`.
- SAFETY: this is GSC evidence capture only; no public cyber/privacy, national-insurance, title/H1/meta, URL, redirect, sitemap, canonical, taxonomy, menu, lawyer, CRM, review or plugin state was changed.

## 2026-05-11 GSC Homepage And Directory Evidence Screenshots
- VERIFIED: browser GSC access was used for the homepage and lawyer-directory evidence pass on the URL-prefix property `https://jus-tice.co.il/`.
- EVIDENCE: `project-control/visual-evidence/gsc-homepage-page-query-2026-05-11.png`.
- EVIDENCE: `project-control/visual-evidence/gsc-lawyers-page-query-2026-05-11.png`.
- EVIDENCE: `project-control/visual-evidence/gsc-query-lawyer-singular-pages-2026-05-11.png`.
- EVIDENCE: `project-control/visual-evidence/gsc-query-lawyers-plural-pages-2026-05-11.png`.
- EVIDENCE: `project-control/visual-evidence/gsc-query-find-lawyer-pages-2026-05-11.png`.
- VERIFIED: the homepage has broad lawyer/find-lawyer visibility, while `/lawyers/` returned no visible query rows in the reverse check.
- SAFETY: this is GSC evidence capture only; no public homepage, directory, title/H1/meta, URL, redirect, sitemap, canonical, taxonomy, menu, lawyer, CRM, review or plugin state was changed.

## 2026-05-11 GSC Targeted Evidence Screenshot - Pass 2
- VERIFIED: browser GSC access was used for the second targeted query pass on the URL-prefix property `https://jus-tice.co.il/`.
- EVIDENCE: `project-control/visual-evidence/gsc-targeted-drunk-driving-pages-2026-05-11.png`.
- VERIFIED: screenshot captures the Pages-tab evidence for `עורך דין נהיגה בשכרות`, showing `/revocation-of-a-will-and-reviving-previous-will/` as the visible GSC page for that filtered query.
- SAFETY: this is evidence capture only; no public content, URL, redirect, sitemap, canonical, document, taxonomy, menu, lawyer, CRM, review or plugin state was changed.

## 2026-05-11 GSC Targeted Evidence Screenshot
- VERIFIED: browser GSC access works for the URL-prefix property `https://jus-tice.co.il/`.
- EVIDENCE: `project-control/visual-evidence/gsc-targeted-child-support-pages-2026-05-11.png`.
- EVIDENCE: `project-control/visual-evidence/gsc-targeted-child-support-pages-2026-05-11-full.png`.
- EVIDENCE: `project-control/visual-evidence/gsc-targeted-child-support-pages-table-2026-05-11.png`.
- VERIFIED: screenshot captures the Pages-tab evidence for `מזונות ילדים`, showing the old calculator URL as the visible GSC page for that filtered query.
- SAFETY: this is evidence capture only; no public content, URL, redirect, sitemap, canonical, document, taxonomy, menu, lawyer, CRM, review or plugin state was changed.

## 2026-05-11 Media/Image Sitemap HTTPS QA
- FIXED LIVE: public media URLs now normalize to HTTPS in attachment helpers, image srcsets, rendered post content and Rank Math image sitemap callbacks.
- WHY: after theme link cleanup, the remaining findings were 69 sitemap image URLs and 2 public content image `src` attributes.
- VERIFIED SOURCE: Rank Math documents image sitemap filters `rank_math/sitemap/urlimages` and `rank_math/sitemap/xml_img_src`.
- VERIFIED LOCAL: PHP lint passed for 128 PHP files; `git diff --check` returned only normal Windows LF-to-CRLF warnings.
- LIVE DEPLOYMENT VERIFIED: uPress Git log shows commit `a74a28b` (`Normalize media sitemap URLs to HTTPS`) as live HEAD and public marker returns `2026-05-11-media-sitemap-https-v1`.
- SOURCE VERIFIED: `project-control/public-http-internal-link-scan-2026-05-11-after-media-sitemap-https.csv` records 42 `VERIFIED` resources and 0 `REVIEW` findings.
- FIXED LIVE: the prior 69 sitemap-image findings and 2 content-image findings dropped to 0 in the bounded after-scan.
- SAFETY: output-level normalization only; no media library, content body, URL slug, redirect, sitemap inclusion, canonical, taxonomy, lawyer, CRM, review or plugin state was changed.

## 2026-05-11 Theme Term-Link HTTPS QA
- FIXED LIVE: theme-owned taxonomy term links now render through a shared first-party HTTPS helper.
- LIVE DEPLOYMENT VERIFIED: uPress Git log showed commit `005af18` (`Normalize theme term links to HTTPS`) as live HEAD.
- LIVE VERIFIED: static deployment marker returned `2026-05-11-theme-term-link-https-v1`.
- AFFECTED VISUAL SURFACES: breadcrumbs, homepage quick topic links, practice-area cards, article/category term chips, article archive sidebar terms, lawyer mini-site area chips, fallback header dropdown terms and related-content fallback links.
- SOURCE QA BASELINE: `project-control/public-http-internal-link-scan-2026-05-11-classified-before-theme-fix.csv`.
- REVIEW FINDING: before deployment, 54 findings were classified into the `THEME_DISPLAY_FIX` lane.
- SOURCE QA AFTER: `project-control/public-http-internal-link-scan-2026-05-11-after-theme-term-link-https.csv`.
- VERIFIED: after deployment, `THEME_DISPLAY_FIX` findings dropped to 0.
- REVIEW REMAINS: 69 sitemap/media findings and 2 content-media findings remain outside the theme display lane.
- VERIFIED LOCAL: PHP lint passed for 128 PHP files; `git diff --check` returned only normal Windows LF-to-CRLF warnings.
- NEXT QA: inspect the remaining media/sitemap/content findings as their own lane; do not treat them as visual template bugs.
- SAFETY: source-level output normalization only; no visible copy, content body, URL slug, redirect, sitemap setting, canonical, taxonomy, lawyer, CRM, review or plugin state was changed.

## 2026-05-11 Public First-Party HTTP Scan QA
- VERIFIED TOOLING: `tools/check-public-http-internal-links.ps1` produced `project-control/public-http-internal-link-scan-2026-05-11.csv`.
- REVIEW FINDING: the bounded public scan found 199 remaining first-party `http://jus-tice.co.il` references.
- REVIEW FINDING: 122 findings are in rendered HTML pages and 77 are in sitemap child XML.
- REVIEW FINDING: 118 findings are internal page/category/article URLs and 81 are media upload URLs.
- NOT FIXED YET: this is a source-level scan, not a visual design change or migration action.
- NEXT QA: classify finding ownership, apply only approved display-level fixes first, then rerun the scanner and capture screenshots if visible navigation/template areas change.
- SAFETY: no content, URL, redirect, sitemap setting, canonical, taxonomy, lawyer, CRM, review or plugin state was changed.

## 2026-05-11 Public Template HTTPS Link QA
- LIVE DEPLOYMENT VERIFIED: uPress Git log showed commit `3b99fbb` (`Normalize public template links to HTTPS`) as live HEAD.
- LIVE VERIFIED: static deployment marker returned `2026-05-11-public-link-https-normalization-v1`.
- SOURCE VERIFIED: `project-control/live-related-content-qa-2026-05-11-after-public-link-https.csv` captures the after-pull QA pass.
- VERIFIED: all sampled rows passed as `VERIFIED`.
- FIXED LIVE: sampled related-card URLs now render as `https://jus-tice.co.il/...` instead of `http://jus-tice.co.il/...`.
- VERIFIED STABLE: general lawyer-selection fallback, criminal-law semantic cards, real-estate semantic cards and family-divorce semantic cards still pass source/card cluster checks.
- SAFETY: source-level QA only; no public content body, URL slug, redirect, sitemap, canonical, taxonomy, lawyer, CRM, review or plugin state was changed.

## 2026-05-11 Related Content International Filter QA
- LIVE DEPLOYMENT VERIFIED: uPress Git log showed commit `4868db2` (`Filter international real estate related cards`) as live HEAD.
- LIVE VERIFIED: static deployment marker returned `2026-05-11-related-international-filter-v1`.
- SOURCE VERIFIED: `project-control/live-related-content-qa-2026-05-11-after-international-filter.csv` captures the after-pull QA pass.
- VERIFIED: all sampled rows passed as `VERIFIED`.
- FIXED LIVE: `/real-estate-lawyer-cost-2025/` no longer shows the Greece pricing article in related cards.
- VERIFIED REPLACEMENT: the real-estate sample now shows local/legal real-estate related cards, including rental agreement, Israeli price forecast, and building-rights roof ownership content.
- VERIFIED STABLE: general lawyer-selection fallback, criminal-law semantic cards and family-divorce semantic cards still pass the same source/card cluster checks.
- SAFETY: source-level QA only; no public content body, URL, redirect, sitemap, canonical, taxonomy, lawyer, CRM, review or plugin state was changed.

## 2026-05-11 Related Content Fallback QA After Live Pull
- LIVE DEPLOYMENT VERIFIED: uPress Git log showed commit `40ee1c4` (`Expose related fallback QA attributes`) as live HEAD.
- LIVE VERIFIED: static deployment marker returned `2026-05-11-related-fallback-qa-v1`.
- SOURCE VERIFIED: `project-control/live-related-content-qa-2026-05-11-after-fallback-attrs.csv` captures the after-pull QA pass.
- VERIFIED: all sampled rows passed as `VERIFIED`.
- FIXED LIVE: `/find-lawyer-how-to-find-good-attorney/` now exposes a fallback related section with `related_mode=fallback` and `detected_source_cluster=lawyer_selection`.
- FIXED LIVE: `/drug-offenses-criminal-lawyer/` now exposes semantic criminal-law related cards with `data-related-cluster-match="match"`.
- VERIFIED STABLE: real-estate and family-divorce sampled pages still expose semantic related sections with matching source/card clusters.
- EDITORIAL REVIEW STILL NEEDED: the technical cluster gate can still allow broad same-cluster cards, such as international real-estate content under a local real-estate cost page; fix those through manual related URLs/content metadata.
- SAFETY: no screenshots/content edits were required for this source-level QA pass, and no public content body, URL, redirect, sitemap, canonical, taxonomy, lawyer, CRM, review or plugin state was changed.

## 2026-05-11 Live Plugin Includes Visibility QA
- VERIFIED LIVE VISIBLE: uPress File Manager opened the active plugin `includes/` folder at `/wp-content/plugins/ultra-justice-engine/includes/`.
- EVIDENCE: `project-control/visual-evidence/upress-plugin-filesystem-ultra-includes-2026-05-11.png`.
- VERIFIED VISIBLE COUNT: live active plugin `includes/` listing shows 15 files.
- VERIFIED PARITY GAP: repo has `ultra-justice-engine/includes/cpt-legal-tools.php`, but the live active plugin listing did not show it.
- BLOCKED: byte-level visual/download parity is not possible in the Codex in-app browser because uPress file downloads are unsupported.
- SAFETY: no plugin state or file content was changed.

## 2026-05-11 Robots Static File QA
- FIXED LIVE: the public root `robots.txt` no longer returns an empty body.
- VERIFIED BEFORE FIX: `/robots.txt?codex_check=...` returned HTTP 200, `Content-Type: text/plain`, and length 0, while `/?robots=1` returned a valid WordPress robots body with the sitemap directive.
- VERIFIED LIVE AFTER FIX: `/robots.txt?codex_verify=...` returns HTTP 200 and includes `Sitemap: https://jus-tice.co.il/sitemap_index.xml`.
- VERIFIED SAFETY: the live robots file has no global `Disallow: /` and does not block `/wp-content/themes`, so public rendering assets remain crawlable.
- VERIFIED SITEMAP CONTEXT: sitemap index and sampled child sitemaps return XML with zero first-party HTTP loc values.

## 2026-05-11 Native 404 Redirect QA
- CODE FIXED / DEPLOYED: native 404 guard is live with marker `2026-05-11-native-404-before-redirect-v1` and uPress commit `cbbba45`.
- LIVE VERIFIED BLOCKED: fake public URL checks still return `301 Location: https://jus-tice.co.il` instead of the Hebrew 404 template.
- LIVE VERIFIED BLOCKED: invalid `?p=99999999` and `/index.php/not-a-real-index-path-.../` also redirect to the homepage.
- DIAGNOSTIC CLUE: no `X-Redirect-By` and no `X-Justice-Route-Guard` response header appeared on the 301, which points to a redirect source outside the normal theme guard path.
- VERIFIED SOURCE: uPress plugin manager shows active `All 404 Redirect to Homepage`; screenshot evidence: `project-control/visual-evidence/all-404-redirect-plugin-active-upress-2026-05-11.png`.
- NEXT QA: after owner-approved plugin deactivation, capture desktop/mobile screenshots for a real fake URL and verify HTTP 404, Hebrew copy, no homepage hero, and noindex/no-follow headers.

## 2026-05-11 Rank Math Sitemap Cache Bypass QA
- CODE FIXED / LIVE VERIFIED: Rank Math sitemap caching is disabled while sitemap HTTPS normalization is being verified.
- WHY IT MATTERS: after deployment was verified, child sitemap XML still exposed stale HTTP locs; this blocks a clean URL migration and GSC sitemap submission.
- PRE-PATCH LIVE CHECK: `articles-sitemap2.xml?nocache=1` returned 200 HTTP locs and zero HTTPS locs.
- LIVE VERIFIED: after uPress pull for marker `2026-05-11-rankmath-sitemap-cache-bypass-v1`, sampled child sitemaps returned zero first-party HTTP locs and HTTPS locs only.
- COUNTS: page 0/11, articles1 0/201, articles2 0/200, practice-areas 0/40, category 0/16 HTTP/HTTPS.

## 2026-05-11 uPress Pull And Post-Pull SEO QA
- VERIFIED LIVE: uPress Git Manager was accessible, Git Status was clean, and Git Pull brought live theme to `c992fd2`.
- VERIFIED LIVE: static deployment marker now returns `2026-05-11-robots-sitemap-directive-v1`; homepage source includes the same marker.
- VERIFIED LIVE PARTIAL: homepage source uses the WordPress/RealFaviconGenerator manifest and does not duplicate the theme fallback manifest.
- BLOCKED / NOT FIXED BY PULL: `robots.txt` still returns HTTP 200 with empty body.
- BLOCKED / NOT FIXED BY PULL: `articles-sitemap2.xml` still exposes 200 `http://jus-tice.co.il` loc values and zero HTTPS loc values.
- NEXT QA: inspect robots source and clear Rank Math sitemap cache/settings before resubmitting sitemaps or treating sitemap HTTPS as fixed.

## 2026-05-11 Robots Sitemap Directive QA
- CODE LIVE / OUTPUT BLOCKED: robots.txt should include `Sitemap: https://jus-tice.co.il/sitemap_index.xml`, but the public response is still empty after deployment.
- WHY IT MATTERS: the verified sitemap index returns XML, while `/sitemap.xml` and `/wp-sitemap.xml` currently redirect to the homepage.
- LIVE CHECK NEEDED: inspect the static/server/plugin robots source, then verify `robots.txt` returns 200, includes the sitemap index directive, and does not block public rendering assets.

## 2026-05-11 Sitemap HTTPS QA
- CODE LIVE / OUTPUT BLOCKED: supported sitemap generators have theme hooks for first-party HTTPS normalization, but Rank Math child sitemap output still exposes HTTP locs after deployment.
- WHY IT MATTERS: sitemap mixed-protocol signals were found in live checks and should be cleared before URL migration or GSC sitemap resubmission.
- LIVE CHECK NEEDED: clear Rank Math sitemap cache/settings, then re-run public checks for `page-sitemap.xml`, `articles-sitemap1.xml`, `articles-sitemap2.xml`, and `practice-areas-sitemap.xml`; record `http_loc_count`.

## 2026-05-11 Branding Manifest QA
- CODE FIXED / NOT LIVE VERIFIED: theme now has `assets/images/site.webmanifest` as a fallback for mobile bookmark/install branding, using existing 192x192 and 512x512 square icons.
- PARTIAL LIVE VERIFIED: current public source already includes the RealFaviconGenerator manifest from `/wp-content/uploads/fbrfg/site.webmanifest`, so the theme fallback should remain suppressed while that admin icon stack is active.
- VERIFIED LOCALLY: icon dimensions exist for 16, 32, 48, 180, 192 and 512 pixels; full logo source is non-square and remains unsuitable as a raw Site Icon without cropping.
- LIVE CHECK NEEDED: after uPress pull/cache clear, verify marker `2026-05-11-branding-manifest-v1`, confirm no duplicate manifest links while WordPress Site Icon exists, and confirm the fallback manifest URL is available if the admin icon stack is removed.

## 2026-05-11 Lawyer Directory Approved Query QA
- CODE FIXED / NOT LIVE VERIFIED: `/lawyers/` now queries only profiles that pass the public approval gate, so result counts and pagination should match visible public cards.
- WHY IT MATTERS: seed/demo/unapproved lawyer records should not produce misleading totals or empty pages after the visible card filter is applied.
- LIVE CHECK NEEDED: after uPress pull/cache clear, verify `/lawyers/`, `/lawyers/?area=family-law`, `/lawyers/?area=criminal-law`, and one city filter on desktop/mobile with marker `2026-05-11-lawyer-directory-approved-query-v1`.

## 2026-05-11 Breadcrumb Visual Polish
- CODE FIXED / NOT LIVE VERIFIED: breadcrumb markup and styling were upgraded into a more premium navigation band with pill links, a current-page chip, subtle accent line, and mobile horizontal scrolling.
- CODE FIXED / NOT LIVE VERIFIED: RTL separator behavior was updated for the new visual separator.
- LIVE CHECK NEEDED: after uPress pull/cache clear, verify breadcrumbs on desktop/mobile for a single article, `/articles/`, `/lawyers/`, `/family-law/`, a search page and a real 404 route.

## 2026-05-11 Navigation Area Fallback QA
- CODE FIXED / NOT LIVE VERIFIED: header topic-strip fallbacks now keep personal injury/damages and inheritance users inside the lawyer directory if the clean pillar pages are not published.
- CODE FIXED / NOT LIVE VERIFIED: footer specialization links now expose medical malpractice, employment, traffic and inheritance filters, reducing the visual/SEO gap between homepage hubs and footer navigation.
- LIVE CHECK NEEDED: after uPress pull/cache clear, verify homepage header/footer on desktop and mobile, then spot-check `/lawyers/?area=personal-injury-law`, `/lawyers/?area=medical-malpractice-law`, `/lawyers/?area=privacy-cyber-law`, `/lawyers/?area=tax-law`, and `/lawyers/?area=inheritance-law`.

## 2026-05-11 Lead Area Vocabulary QA
- CODE FIXED / NOT LIVE VERIFIED: public lead forms now submit clean legal-area slugs that match the content/directory architecture.
- CODE FIXED / NOT LIVE VERIFIED: CRM display should show Hebrew area labels after classification instead of raw legacy values such as `damages` or `medical_malpractice`.
- LIVE CHECK NEEDED: after uPress pull/cache clear, submit one controlled homepage lead with `רשלנות רפואית` or `נזיקין ותאונות`, then verify `legal_area`, `ai_detected_area`, and CRM area display.

## 2026-05-11 Lawyer Directory Filter Alias QA
- CODE FIXED / NOT LIVE VERIFIED: clean public filter aliases now map to the existing seeded taxonomy slugs in `archive-justice_lawyer.php`.
- WHY IT MATTERS: homepage/header links such as `/lawyers/?area=personal-injury-law` and `/lawyers/?area=medical-malpractice-law` should not lead to empty directory states if the underlying term is still `torts` or `medical-malpractice`.
- LIVE CHECK NEEDED: after uPress pull/cache clear, verify `/lawyers/?area=personal-injury-law`, `/lawyers/?area=medical-malpractice-law`, `/lawyers/?area=labor-law`, and `/lawyers/?area=employment-law` show the intended Hebrew title/filter chip and no broken layout.

## 2026-05-11 Search And 404 Visual Polish
- CODE FIXED: shared legal search form styling was upgraded in `assets/css/main.css` for desktop/mobile, including card chrome, focus states, and full-width mobile buttons.
- CODE FIXED: search headers now keep query text readable and accent-highlighted without layout breakage.
- CODE FIXED: no-results and 404 states now render as polished customer-facing cards; `404.php` inline styles were replaced with reusable classes.
- NOT LIVE VERIFIED: requires uPress pull/cache clear, then desktop/mobile screenshots for a normal search, a no-results search, and a real 404 route.

## 2026-05-11 Related Content Live QA
- LIVE VERIFIED: sampled public article pages render related content in semantic mode.
- VERIFIED: public sampled bodies did not show internal markers such as `NOT VERIFIED`, source-audit labels or developer/owner notes.
- EVIDENCE: `project-control/visual-evidence/related-content-live-qa-2026-05-11.json` and `related-content-*-2026-05-11.png`.
- PARTIAL QUALITY: general and criminal article samples still show off-intent related cards (`ai-for-law-firms`, `business-license`, `australia-lawyers`). The real-estate sample includes a weak Cyprus pricing match.
- DOCUMENTED / NOT EXECUTED: `project-control/related-content-cms-update-batch-001.csv` now lists exact CMS metadata values to fix these four sampled pages without editing article bodies.
- CODE FIXED / NOT LIVE VERIFIED: article internal review/status panels are now editor-only in `single-articles.php`; requires uPress pull/cache clear and source check for marker `2026-05-11-public-article-note-guard-v1`.
- CODE FIXED V2 / NOT LIVE VERIFIED: taxonomy fallback now has an inferred cluster gate, intended to prevent those off-intent related cards after the next pull. Verify against marker `2026-05-11-related-cluster-gate-v1`.
- CODE FIXED V3 / NOT LIVE VERIFIED: related sections/cards now expose source/card cluster QA attributes. After pull, inspect `data-related-cluster-match` on each card and flag any mismatch for editorial review.

## 2026-05-10 Third-Party Mobile CTA Check
- LIVE VERIFIED ISSUE: the remaining green lower-right mobile overlay is `a.whatsapp-button`, a fixed WhatsApp lead banner, not a chat iframe.
- VISUAL EVIDENCE BEFORE FIX: `project-control/visual-evidence/mobile-third-party-cta-before-2026-05-10.png`.
- CODE FIXED: mobile CSS now compacts the third-party WhatsApp banner into a 54x54px round icon-only button and hides its extra logo/text.
- VISUAL VERIFIED BY LIVE CSS SIMULATION: `project-control/visual-evidence/mobile-chat-widget-css-test-final-2026-05-10.png`; computed live test size was 54x54px, bottom-right, with the WhatsApp icon visible.
- NOT LIVE VERIFIED AFTER CODE FIX: requires uPress pull/cache clear and fresh mobile homepage/article/directory screenshots.

## 2026-05-09 Live Homepage Screenshot Check
- VERIFIED: Live homepage returned HTTP 200.
- VERIFIED: Desktop screenshot captured locally at `project-control/visual-evidence/homepage-desktop.png`.
- VERIFIED: Mobile screenshot captured locally at `project-control/visual-evidence/homepage-mobile.png`.
- VERIFIED: The live homepage is not showing the latest `brand-lockup--justice` code wordmark yet.
- NOT VERIFIED: Upress/GitHub pull status.
- BLOCKED: Authenticated Upress pull could not be completed through the public web fetch context.

## 2026-05-10 Live Pull Recheck
- VERIFIED: Live homepage returned HTTP 200.
- VERIFIED: Latest repo visual layer is live: `brand-lockup--justice`, `hero__visual`, and `article-card__placeholder--legal` were found in public HTML.
- FIXED IN REPO: Wordmark direction was corrected with `direction: ltr` and `unicode-bidi: isolate` because the live RTL page displayed the fallback as `Tice dot Jus` instead of `Jus dot Tice`.
- VERIFIED: New screenshots captured at `project-control/visual-evidence/homepage-after-pull-desktop.png` and `project-control/visual-evidence/homepage-after-pull-mobile.png`.

## 2026-05-10 Header Recheck
- VERIFIED: Live homepage returned HTTP 200.
- VERIFIED: `brand-lockup--justice` is present live.
- VERIFIED: Public HTML includes `/legal-tools/` and `/lawyer-registration/` links.
- VERIFIED: Dummy logo text is not present.
- NOT VERIFIED: Admin-only content draft importer cannot be verified from public homepage HTML, as expected.

## 2026-05-10 Header Topic Strip
- FIXED IN REPO: Added a dark premium topic strip below the main header with Hebrew labels and short English target slugs for divorce, criminal, real estate, medical malpractice, family law and AI intake.
- VERIFIED: PHP lint passed locally for 120 PHP files after the header change.
- VERIFIED: Live homepage HTML contains `site-header__topic-strip`, `/divorce-lawyer/`, `/legal-tools/ai-intake/`, and `brand-lockup--justice`.
- VERIFIED: Desktop screenshot captured at `project-control/visual-evidence/homepage-topic-strip-desktop.png`.
- VERIFIED: Mobile screenshot captured at `project-control/visual-evidence/homepage-topic-strip-mobile.png`.
- VERIFIED: Red-dot Jus-Tice wordmark is visible in desktop/mobile screenshots.
- VERIFIED: Topic strip is visible in desktop/mobile screenshots.

## 2026-05-10 Lead/SEO Live Recheck
- VERIFIED: Live homepage returned HTTP 200.
- VERIFIED: Live `/lawyers/?area=family-law` returned HTTP 200.
- VERIFIED: Canonical tags are present in public HTML.
- NOT VERIFIED: Homepage public HTML did not show `admin-post.php` or `justice_submit_lead`, so the ask-lawyer form wiring from commit `e511c00` is not yet verified live.
- NOT VERIFIED: Filtered lawyer-directory URL did not show `noindex`, so the filter robots hardening from commit `e511c00` is not yet verified live.
- BLOCKED: This appears to require Upress pull/cache verification or direct WordPress theme-file inspection.

## Visual Findings
- STILL BROKEN: Header main navigation above the topic strip still feels sparse on desktop.
- FIXED: The fallback Jus-Tice logo and red dot are visible live.
- STILL BROKEN: Homepage still has very little real imagery. The repo now has a CSS visual layer, but live has not pulled it yet.
- RISK: Homepage shows many article cards with weak gray image placeholders; this still reads too basic.
- RISK: The practice-area grid is large and somewhat repetitive; it needs stronger hierarchy.
- FIXED IN REPO / NOT LIVE VERIFIED: Header/footer dummy fallback was replaced with the code wordmark and blinking red dot.
- GOOD: Maya Rotenberg appears as the only featured lawyer card on the screenshot.
- GOOD: Lead/LegalTech sections exist and the page has more business depth than a basic blog.
- GOOD: After the live pull recheck, article placeholders are visually richer and the hero has a visible legal-tech layer.
- PARTIAL FIX: Header navigation now has a visible legal-topic strip, but the full primary/mega menu is still not final.
- VERIFIED LIVE: Header fallback menu labels, topic-strip links, LegalTech/lawyer-registration links and the red-dot wordmark are present in public HTML/screenshots.

## Public HTML Checks
- VERIFIED: homepage loads.
- VERIFIED: `/lawyers/` loads.
- VERIFIED: `/articles/` was requested but full visual review not completed.

## Issues From Text Extract
- Homepage header/menu appears thin in text extraction: contact/about only visible near top.
- Homepage has many noisy practice-area terms.
- "Content is protected !!" appears in public HTML.
- Lawyer directory displays city slugs.

## Required Visual QA Pages
- Homepage
- `/lawyers/`
- single lawyer profile
- `/articles/`
- single article
- practice-area page
- search page
- 404 page

## Next
- Run desktop and mobile browser QA after repo changes are ready.

## 2026-05-10 Related Content QA Gate
- CODE FIXED: article-page related content now uses semantic selection: manual URLs, same `content_cluster`, then same `practice-areas`.
- CODE FIXED: unrelated global latest-post fallback was removed from the single-article related block.
- NOT LIVE VERIFIED: after uPress pull/cache clear, recheck at least one family-law article, one criminal-law article and one real-estate article to confirm related cards are relevant and mobile layout stays stable.

## 2026-05-10 Integrated Visual QA Pass
- VERIFIED: Desktop and mobile screenshots captured for homepage, articles archive, one article, lawyer directory, sample lawyer profile URL, family practice page, search and 404 test.
- EVIDENCE JSON: `project-control/visual-evidence/integrated-visual-qa-2026-05-10.json`.
- EVIDENCE PNGS: `project-control/visual-evidence/integrated-*-2026-05-10.png`.
- LIVE VERIFIED GOOD: homepage has a strong legal portal first impression, visible red-dot Jus-Tice identity, topic strip, hero visual, guided search and lead CTA.
- LIVE VERIFIED GOOD: article and archive pages use Hebrew H1s and breadcrumbs.
- LIVE VERIFIED WEAK: `/articles/` title is still `Articles Archive | Jus-Tice.co.il`.
- LIVE VERIFIED WEAK: `/lawyers/` title is still `עורכי דין Archive | Jus-Tice.co.il`.
- LIVE VERIFIED WEAK: search title is still `You searched for גירושין | Jus-Tice.co.il`.
- CODE FIXED: `inc/seo.php` now adds contextual Hebrew titles through core and common SEO-plugin title filters; live verification pending deployment.
- LIVE VERIFIED BROKEN: sample lawyer profile Hebrew URL returns homepage-style content with status 200 and homepage canonical.
- LIVE VERIFIED BROKEN: fake 404 URL returns/finalizes as homepage with status 200.
- LIVE VERIFIED RISK: `/practice-areas/family-law/` finalizes to `http://jus-tice.co.il/family-law/`, so HTTPS/canonical consistency needs review.
- LIVE VERIFIED MOBILE RISK: WhatsApp/lead CTA and accessibility button overlap content on several mobile pages.

## 2026-05-10 Post-Upress Pull Homepage/Directory Verification

- LIVE VERIFIED: homepage now serves marker `2026-05-10-contextual-title-v1`.
- LIVE VERIFIED: homepage title is now Hebrew and portal-oriented: `עורכי דין בישראל | מדריך עורכי דין, מאמרים משפטיים וייעוץ`.
- LIVE VERIFIED: `/lawyers/` title is now `מדריך עורכי דין בישראל | Jus-Tice`; the `Archive` leak is gone.
- VISUAL VERIFIED: screenshots captured:
  - `project-control/visual-evidence/homepage-post-pull-safe-links-desktop-2026-05-10.png`
  - `project-control/visual-evidence/homepage-post-pull-safe-links-mobile-2026-05-10.png`
  - `project-control/visual-evidence/lawyers-post-pull-title-fixed-desktop-2026-05-10.png`
  - `project-control/visual-evidence/lawyers-post-pull-title-fixed-mobile-2026-05-10.png`
- LIVE VERIFIED GOOD: rendered topic strip now includes broader lawyer-intent links for real estate, medical malpractice, personal injury, labor and inheritance.
- LIVE VERIFIED FOLLOW-UP ISSUE: traffic topic link still rendered as `/traffic-law/`, which redirects to homepage.
- LIVE VERIFIED FOLLOW-UP ISSUE: LegalTech/AI intake URLs redirect to homepage.
- CODE FIXED / NOT LIVE VERIFIED: traffic fallback now points to `/lawyers/?area=traffic-law`, and LegalTech/AI links fall back to `/#ask-lawyer` until real tool pages exist.

## 2026-05-10 Follow-Up Fallback + Intake Verification

- LIVE VERIFIED: topic strip traffic link now renders as `/lawyers/?area=traffic-law`.
- LIVE VERIFIED: topic strip AI/intake link now renders as `/#ask-lawyer`.
- LIVE VERIFIED: homepage ask-lawyer form now shows email, legal area, city/region and urgency fields.
- LIVE VERIFIED: old hidden `general` area and `normal` urgency values are gone from the public form.
- LIVE VERIFIED: source keyword is now neutral portal language.
- VISUAL VERIFIED: screenshots captured:
  - `project-control/visual-evidence/ask-lawyer-enriched-desktop-2026-05-10.png`
  - `project-control/visual-evidence/ask-lawyer-enriched-mobile-2026-05-10.png`
- NOT VERIFIED: actual CRM lead record creation still requires a controlled test with wp-admin/CRM review.

## 2026-05-10 Mobile Floating Action Fix

- LIVE VERIFIED BEFORE FIX: mobile homepage screenshot shows the Pojo accessibility tab sitting across the hero area and the theme WhatsApp button competing with the lower mobile lead/chat CTA.
- VISUAL EVIDENCE BEFORE FIX: `project-control/visual-evidence/mobile-floating-actions-before-2026-05-10.png`.
- CODE FIXED: `.whatsapp-float` is smaller on mobile, raised above the bottom CTA zone, and given a lower z-index than before.
- CODE FIXED: mobile body gets bottom safe-space padding so fixed controls are less likely to cover footer/form content.
- CODE FIXED: `#pojo-a11y-toolbar` gets a mobile top-side position and constrained overlay height instead of floating across the middle of content.
- VERIFIED: `git diff --check` passed.
- NOT LIVE VERIFIED: requires uPress pull/cache refresh and fresh mobile screenshots after deployment.

## 2026-05-10 Branding Pull Verification

- LIVE VERIFIED: homepage now serves marker `2026-05-10-branding-v1`.
- LIVE VERIFIED: theme fallback icon assets return HTTP 200.
- LIVE VERIFIED: WordPress/media/plugin icon tags remain active, and theme fallback tags are not duplicated while the WordPress Site Icon exists.
- VISUAL VERIFIED: screenshots captured:
  - `project-control/visual-evidence/homepage-branding-post-pull-desktop-2026-05-10.png`
  - `project-control/visual-evidence/homepage-branding-post-pull-mobile-2026-05-10.png`
- VISUAL VERIFIED GOOD: header logo remains visible and slightly more compact on mobile and desktop.
- VISUAL VERIFIED PARTIAL: theme WhatsApp float is smaller/raised after the pull.
- STILL LOOKS BAD: third-party green chat/lead bubble still overlaps lower mobile hero cards and should be handled in the next UX pass.
- NOT VERIFIED: wp-admin Site Icon/Custom Logo selected media items and Google search-result favicon refresh.

## 2026-05-10 Homepage Mobile Floating CTA Final Verification

- LIVE VERIFIED: after uPress pull/cache clear, public CSS contains the homepage-only hide rule for `.whatsapp-float` and third-party `a.whatsapp-button`.
- VISUAL VERIFIED: `project-control/visual-evidence/homepage-mobile-after-floating-hide-2026-05-10.png`.
- FIXED: mobile homepage search form and hero CTAs are no longer covered by floating WhatsApp bubbles.
- VERIFIED: computed mobile width stayed at 390px with no horizontal overflow.
- PARTIAL: non-home mobile floating controls remain enabled and need separate article/directory QA before marking the whole floating-contact system customer-ready.

## 2026-05-11 Inner-Page Mobile Floating QA

- LIVE VERIFIED BEFORE FIX: mobile QA was run at 390px on `/find-lawyer-how-to-find-good-attorney/`, `/articles/`, `/lawyers/`, and `/family-law/`.
- EVIDENCE BEFORE: `project-control/visual-evidence/mobile-inner-page-qa-2026-05-11.json`.
- VISUAL EVIDENCE BEFORE: `mobile-inner-article-2026-05-11.png`, `mobile-inner-articles-2026-05-11.png`, `mobile-inner-lawyers-2026-05-11.png`, `mobile-inner-practice-family-2026-05-11.png`.
- FOUND: article, articles archive and lawyer directory had no horizontal overflow and no bottom-zone floating collision.
- FOUND: `/family-law/` had horizontal overflow (`scrollWidth` 434 vs `clientWidth` 390), the practice hero text overran its mobile grid column, and duplicate floating WhatsApp controls were visible.
- CODE FIXED: mobile CSS now clips page-level horizontal overflow, constrains practice-hub description/grid children, hides the duplicate theme `.whatsapp-float` on non-home mobile pages, keeps one compact third-party WhatsApp button, and uses a stronger mobile selector for the Pojo accessibility launcher.
- VISUAL VERIFIED BY LIVE CSS SIMULATION: `project-control/visual-evidence/mobile-inner-page-qa-2026-05-11-final-css.json`.
- VISUAL EVIDENCE AFTER CSS SIMULATION: `mobile-inner-article-2026-05-11-final-css.png`, `mobile-inner-articles-2026-05-11-final-css.png`, `mobile-inner-lawyers-2026-05-11-final-css.png`, `mobile-inner-practice-family-2026-05-11-final-css.png`.
- VERIFIED AFTER CSS SIMULATION: all four sampled mobile pages report no horizontal overflow and no duplicate WhatsApp controls.
- LIVE VERIFIED AFTER CODE FIX: after uPress pull/cache clear, homepage and `/family-law/` serve marker `2026-05-11-mobile-inner-qa-v1`, and public CSS contains the inner-page mobile fix.
- EVIDENCE LIVE: `project-control/visual-evidence/mobile-inner-page-qa-2026-05-11-live.json`.
- VISUAL EVIDENCE LIVE: `mobile-inner-article-2026-05-11-live.png`, `mobile-inner-articles-2026-05-11-live.png`, `mobile-inner-lawyers-2026-05-11-live.png`, `mobile-inner-practice-family-2026-05-11-live.png`.
- LIVE VERIFIED: `/find-lawyer-how-to-find-good-attorney/`, `/articles/`, `/lawyers/`, and `/family-law/` all report `scrollWidth = 390`, `clientWidth = 390`, and `overflowX = false` at 390px mobile width.
- LIVE VERIFIED: duplicate theme `.whatsapp-float` is hidden on sampled inner pages, while one compact third-party WhatsApp button remains available.

## 2026-05-11 404 Plugin Deactivation QA Prep

- SOURCE VERIFIED: screenshot evidence exists at `project-control/visual-evidence/all-404-redirect-plugin-active-upress-2026-05-11.png`.
- CREATED: `project-control/404-plugin-deactivation-checklist.md`.
- CREATED: `tools/check-404-routing.ps1`.
- VERIFIED BASELINE: the checker confirms valid public pages and crawl files still pass.
- BLOCKED BASELINE: fake URL and invalid `?p=99999999` still return 301-to-homepage while `All 404 Redirect to Homepage` remains active.
- NOT YET VISUAL VERIFIED: post-deactivation real Hebrew 404 screenshot still requires owner approval to deactivate the plugin and rerun live QA.

## 2026-05-11 uPress Plugin Manager Read-Only Evidence

- VISUAL VERIFIED: `Ultra Justice Engine` appears in the uPress plugin manager as active.
- VISUAL VERIFIED: `All 404 Redirect to Homepage` appears in the uPress plugin manager as active.
- EVIDENCE: `project-control/visual-evidence/upress-plugin-manager-ultra-justice-engine-active-2026-05-11.png`.
- EVIDENCE: `project-control/visual-evidence/upress-plugin-manager-all-404-active-2026-05-11.png`.
- SAFETY: screenshots were captured after filtering the plugin table only; no plugin state was changed.

## 2026-05-11 uPress Plugin Filesystem Read-Only Evidence

- VISUAL VERIFIED: `/wp-content/plugins/ultra-justice-engine/` exists in the uPress File Manager.
- VISUAL VERIFIED: `/wp-content/plugins/ultra-justice-engine/ultra-justice-engine.php` exists, with `includes/` in the same plugin folder.
- VISUAL VERIFIED: filtering `/wp-content/plugins/` for `justice-core` returned 0 items.
- EVIDENCE: `project-control/visual-evidence/upress-plugin-filesystem-ultra-justice-engine-active-2026-05-11.png`.
- EVIDENCE: `project-control/visual-evidence/upress-plugin-filesystem-ultra-main-file-2026-05-11.png`.
- EVIDENCE: `project-control/visual-evidence/upress-plugin-filesystem-no-justice-core-2026-05-11.png`.
- SAFETY: screenshots were captured through read-only file navigation and filtering; no plugin file or plugin state was changed.

## 2026-05-11 Live Public Template Source QA

- SOURCE VERIFIED: `project-control/live-public-template-qa-2026-05-11.csv` captures the sampled public checks.
- VERIFIED: homepage source returns HTTP 200, a Hebrew portal title, active favicon/manifest tags, the traffic fallback link `/lawyers/?area=traffic-law`, and the AI/intake fallback `/#ask-lawyer`.
- VERIFIED: `/lawyers/`, `/articles/`, and Hebrew search for `גירושין` return HTTP 200 with Hebrew titles and no sampled English default strings such as `Search results for:`, `Previous`, `Next`, or `Archive` in the document title.
- VERIFIED: `/find-lawyer-how-to-find-good-attorney/` exposes semantic related-content QA attributes and 3 related cluster-match markers.
- VERIFIED: filtered lawyer directory URLs for `personal-injury-law`, `medical-malpractice-law`, `employment-law`, `labor-law`, and `traffic-law` stay on `/lawyers/` and do not redirect to homepage.
- FOUND LIVE: `personal-injury-law`, `medical-malpractice-law`, and `employment-law` filter pages have specific H1s but generic SEO titles.
- FIXED LIVE: `inc/seo.php` now normalizes lawyer-directory area aliases before title generation; see the after-pull QA section below.
- SAFETY: no public content, URLs, redirects, sitemap settings, canonical settings, taxonomy terms, lawyer records, CRM records, review data, plugin state or database rows were changed.

## 2026-05-11 Live Public Template Source QA After Pull

- LIVE DEPLOYMENT VERIFIED: uPress Git log shows commit `3b07267` (`Fix lawyer filter SEO alias titles`) as the live HEAD.
- SOURCE VERIFIED: `project-control/live-public-template-qa-2026-05-11-after-pull.csv` captures the after-pull verification pass.
- VERIFIED: all sampled rows passed as `VERIFIED`.
- FIXED LIVE: `/lawyers/?area=personal-injury-law` now has the specific title `עורך דין נזיקין | מצאו עורך דין מתאים`.
- FIXED LIVE: `/lawyers/?area=medical-malpractice-law` now has the specific title `עורך דין רשלנות רפואית | מצאו עורך דין מתאים`.
- FIXED LIVE: `/lawyers/?area=employment-law` now has the specific title `עורך דין דיני עבודה | מצאו עורך דין מתאים`.
- VERIFIED: homepage fallback links, search Hebrew labels, article related-content QA attributes and main archive title checks remained stable.
- SAFETY: no public content, URLs, redirects, sitemap settings, canonical settings, taxonomy terms, lawyer records, CRM records, review data, plugin state or database rows were changed.

## 2026-05-11 Related Content Source QA Before URL Inference Fix

- SOURCE VERIFIED: `project-control/live-related-content-qa-2026-05-11-before-url-inference.csv` captures the pre-fix related-content QA pass.
- REVIEW: `/find-lawyer-how-to-find-good-attorney/` returned `data-related-source-cluster="unknown"` and off-topic related cards.
- REVIEW: `/drug-offenses-criminal-lawyer/` returned `data-related-source-cluster="unknown"` and off-topic related cards.
- VERIFIED: `/real-estate-lawyer-cost-2025/` returned `real_estate` source/card cluster matches.
- VERIFIED: `/mutual-divorce-agreement-2025/` returned `family_divorce` source/card cluster matches.
- FIXED IN CODE / NOT LIVE VERIFIED: cluster inference now includes public permalink and request URI signals so clean public slugs can drive related-card filtering.
- SAFETY: no public content, URLs, redirects, sitemap settings, canonical settings, taxonomy terms, lawyer records, CRM records, review data, plugin state or database rows were changed.

## 2026-05-11 GSC Targeted Evidence Screenshot - Pass 2

- VERIFIED: browser GSC access still works for the URL-prefix property `https://jus-tice.co.il/`.
- EVIDENCE: `project-control/visual-evidence/gsc-targeted-pass2-custody-sole-mother-2026-05-11.png`.
- EVIDENCE: `project-control/visual-evidence/gsc-targeted-pass2-custody-sole-mother-table-2026-05-11.png`.
- EVIDENCE: `project-control/visual-evidence/gsc-targeted-pass2-drunk-driving-wrong-page-2026-05-11.png`.
- EVIDENCE: `project-control/visual-evidence/gsc-targeted-pass2-drunk-driving-wrong-page-table-2026-05-11.png`.
- VERIFIED: `משמורת בלעדית לאם` screenshot captures the old Hebrew case-law URL as the visible Pages-tab result with `107` impressions and average position `9.6`.
- VERIFIED: `נהיגה בשכרות` screenshot captures the wrong-page match to the will-revocation URL.
- SAFETY: this is evidence capture only; no public content, URL, redirect, sitemap, canonical, document, taxonomy, menu, lawyer, CRM, review or plugin state was changed.

## 2026-05-11 GSC Targeted Evidence Screenshot - Pass 3

- VERIFIED: browser GSC access still works for the URL-prefix property `https://jus-tice.co.il/`.
- EVIDENCE: `project-control/visual-evidence/gsc-targeted-pass3-indictment-netanyahu-url-2026-05-11.png`.
- EVIDENCE: `project-control/visual-evidence/gsc-targeted-pass3-drunk-driving-lawyer-wrong-page-2026-05-11.png`.
- VERIFIED: `כתב אישום` screenshot captures the specific Netanyahu indictment page plus homepage as visible Pages-tab results.
- VERIFIED: `עורך דין נהיגה בשכרות` screenshot captures the wrong-page match to the will-revocation URL.
- SAFETY: this is evidence capture only; no public content, URL, redirect, sitemap, canonical, document, taxonomy, menu, lawyer, CRM, review or plugin state was changed.

## 2026-05-11 GSC Cyber / Privacy Support Evidence

- VERIFIED: browser GSC access still works for the URL-prefix property `https://jus-tice.co.il/`.
- VERIFIED TEXT EVIDENCE: `פגיעה בפרטיות` maps to an old Hebrew privacy-injury URL with `38` impressions.
- VERIFIED TEXT EVIDENCE: `הגנת הפרטיות` maps to the same old Hebrew privacy-injury URL with `7` impressions.
- VERIFIED TEXT EVIDENCE: `שיימינג` maps once to `/changing-or-canceling-a-prenuptial-agreement/`, a wrong-page signal.
- VERIFIED TEXT EVIDENCE: `מתקפת סייבר`, `לשון הרע באינטרנט`, and `מחיקת מידע` returned no visible rows.
- BLOCKED: screenshot capture timed out for this pass, so no new screenshot artifact was saved.
- SAFETY: this is evidence capture only; no public content, URL, redirect, sitemap, canonical, document, taxonomy, menu, lawyer, CRM, review or plugin state was changed.
