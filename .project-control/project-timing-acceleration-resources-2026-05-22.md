# Project Timing and Acceleration Resources - 2026-05-22

Status: VERIFIED PLANNING / ESTIMATE ONLY / GSC AND CMS EXECUTION BLOCKED / NO PUBLIC CHANGES

## Executive Answer

VERIFIED PLANNING:
- The project should continue cluster-by-cluster, not by waiting for a complete legacy-site audit.
- The first useful public content progress should be Family/Divorce current-URL repair and current-URL updates, not broad clean-slug migration.
- Family/Divorce is the right first cluster because it has the strongest draft, metadata, owner-review, GSC-workflow, rollback and live-repair control layer.

ESTIMATE:
- First narrow Family/Divorce visible repair: about `0.5-1 operator day` after owner approval, actual CMS rollback backup and focused GSC/accepted substitute are ready.
- Complete Family/Divorce controlled current-URL upload package: about `2-4 operator days` after owner/legal/source decisions, GSC evidence and rollback backup are ready.
- Criminal Law first controlled current-URL upload package: about `1.5-3 operator days` after owner/legal/source review, GSC evidence and rollback backup.
- Medical Malpractice first controlled current-URL upload package: about `1-2 operator days` after CMS identity, privacy/source review, GSC evidence and rollback backup.
- All priority clusters to controlled upload-ready state, not full perfect migration: about `2-4 focused weeks` if owner/GSC/CMS gates are available.
- Same work under current blocker pattern: about `4-8+ calendar weeks`.
- Full legacy-site audit, consolidation and migration of weak/old content: about `6-12+ weeks`, and should not be a prerequisite for first staged publishing.

## Definitions

VISIBLE REPAIR:
- Small current-URL fixes to obvious live defects such as broken shortcode display, visible formatting defects, PDF-link decisions and H1/body defects.
- No new slug, redirect, canonical/noindex, sitemap or taxonomy change.

CURRENT-URL CONTENT UPDATE:
- Replace or improve body/metadata on an existing live URL after owner approval and backup.
- Still no broad URL migration.

SEO MIGRATION:
- Clean English slug, redirect, canonical/noindex, sitemap, taxonomy and large internal-link changes.
- Requires focused GSC evidence and separate owner approval.

FULL LEGACY CLEANUP:
- Sitewide old article review, merge/delete/redirect decisions, protected-asset decisions and broad internal-link repair.
- This is the long project; it should run behind staged cluster publication.

## Timing Table

| Workstream | Best practical estimate | Slower/blocker estimate | Current blocker |
|---|---:|---:|---|
| Owner setup: GSC OAuth/API, CMS backup path, approval lane | 0.5-1 owner day | 1-2+ weeks if asynchronous | Owner/GSC/CMS access |
| Family/Divorce visible current-URL repair | 0.5-1 operator day | 2-4 days | Owner approval, rollback backup, focused GSC or accepted substitute |
| Family/Divorce complete current-URL upload package | 2-4 operator days | 1-2+ weeks | Owner/legal/source review, rollback backup, GSC export |
| Criminal Law first current-URL upload package | 1.5-3 operator days | 1-2 weeks | Owner/legal/source worksheet, GSC export, rollback backup |
| Medical Malpractice first current-URL upload package | 1-2 operator days | 1-2 weeks | CMS identity, privacy/source review, GSC export, rollback backup |
| Traffic Law controlled package | 2-4 operator days | 1-2+ weeks | Cluster package and GSC evidence |
| Real Estate controlled package | 2-4 operator days | 1-2+ weeks | Cluster package and GSC evidence |
| Personal Injury/Damages controlled package | 2-5 operator days | 1-3 weeks | Cluster package, protected current URLs and GSC evidence |
| Inheritance/Wills controlled package | 2-4 operator days | 1-2+ weeks | Adjacent Family/Divorce boundary and GSC evidence |
| Employment controlled package | 2-5 operator days | 1-3 weeks | Existing URL split and GSC evidence |
| All priority clusters controlled upload-ready | 2-4 focused weeks | 4-8+ calendar weeks | Owner/GSC/CMS and legal/source review bottlenecks |
| Full legacy audit and migration | 6-12+ weeks | 12+ weeks | Full inventory, GSC scale, legal/source review and migration QA |

## What Is Already Ready Enough To Save Time

VERIFIED:
- Family/Divorce has `7/7` public-body drafts passing static QA.
- Family/Divorce has live public text/metadata backups, but not actual CMS rollback material.
- Family/Divorce has owner review, field map, repair operator packet, CMS backup template, GSC workflow handoff and readiness gate.
- Criminal Law has a first-upload owner/source/legal worksheet and metadata review layer.
- Medical Malpractice has separate source/legal/privacy review gates.
- GSC tooling exists for priority exports and validation, but real exports remain blocked until owner OAuth/access setup.
- The content upload governance checklist now defines the master gate before any public action.

NOT VERIFIED:
- Real Search Console exports for current priority clusters.
- Actual WordPress rollback backup for pages to be edited.
- Final owner/legal/source approval rows.
- Public post-update screenshots, because no public update was executed in this cycle.

## GSC API Value

VERIFIED PLANNING:
- GSC API access is worth setting up.
- It should reduce the query/page evidence work by roughly `30-50%` compared with browser-only filtering, especially for cannibalization, protected URL detection and post-upload monitoring.

What it saves:
- Manual browser export time for each keyword family.
- Repeating the same page/query filters cluster by cluster.
- Guesswork about which old URLs have impressions, clicks or wrong-query visibility.
- Risk of overwriting or redirecting a weak-looking page that is actually carrying valuable traffic.

Minimum access needed:
- Search Console verified property access for `https://jus-tice.co.il/`.
- Google Cloud project with Search Console API enabled.
- OAuth desktop-client JSON stored outside Git.
- Read-only OAuth scope: `https://www.googleapis.com/auth/webmasters.readonly`.
- Local token path outside Git.

## Acceleration Resources

Highest leverage:
- Owner completes GSC API setup and grants/uses read-only Search Console access.
- One CMS operator follows the rollback template, captures before/after screenshots and updates only approved current URLs.
- One source/legal reviewer reviews high-risk legal claims, deadlines, eligibility, costs, procedures and outcome-sensitive text.
- Codex/repo operator keeps maps, drafts, checks, CSVs, slug maps and upload gates synchronized.

Expected savings:
- GSC API: `30-50%` less evidence-gathering time.
- Dedicated CMS operator: saves the largest amount of calendar time because backups, editor saves and screenshots stop blocking strategy work.
- Limited high-risk legal/source review: keeps momentum while avoiding freezing every general informational page.

## What Can Wait

CAN WAIT:
- Full audit of every legacy article before first staged upload.
- Clean English slug migration for every page.
- Broad redirect/canonical/noindex/sitemap execution.
- Full taxonomy/category cleanup.
- Large internal-link rewrites outside the active cluster.
- Full lawyer card, review, reputation, CRM and schema automation.
- Full legal review of every general informational article before any upload.

## What Must Not Be Skipped

MUST NOT SKIP:
- Current URL inventory and CMS identity.
- Strong-page and protected-asset review.
- Anti-cannibalization check for every target page.
- English slug map, even if migration waits.
- Page role: pillar, support, merge, hold or protected.
- Owner/source/legal decision row.
- Focused GSC evidence or explicit owner-approved substitute.
- Actual WordPress rollback backup before editor save.
- Public post-update QA: HTTP status, final URL, title, H1, canonical, robots, content, links and screenshots.

## Recommendation

RECOMMENDED:
- Continue with Family/Divorce first.
- Do not wait for the full sitewide audit.
- Do first public work as current-URL repair/current-URL updates only.
- Hold clean slugs, redirects, canonicals/noindex, sitemap and taxonomy execution until focused GSC evidence is reviewed.
- Treat weak old pages pragmatically: protect pages with evidence or owner value, but do not let weak/duplicated legacy content freeze the staged cluster rollout.

BLOCKED PUBLIC EXECUTION:
- This timing estimate does not approve CMS upload, URL migration, redirect, canonical/noindex, sitemap, taxonomy, internal-link write, lawyer card, lead/CRM, payment, GA4/GSC setting, wp-admin or uPress action.
