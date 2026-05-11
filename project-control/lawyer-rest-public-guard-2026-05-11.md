# Lawyer REST Public Guard - 2026-05-11

Status: CODE FIXED / NOT LIVE VERIFIED

## Why This Was Prioritized

The full-review intake created a P0 trust gate around demo/seed lawyer exposure. A live read-only check found that the visible lawyer archive is safer than before, but the public WordPress REST endpoint still exposes published `justice_lawyer` records and their custom meta to anonymous visitors.

This is a trust and privacy risk because the REST response included seed-style lawyer records, phone/WhatsApp/email metadata, profile-view counters and placeholder `555` phone patterns.

## Read-Only Live Baseline Before This Patch

Checked:
- `https://jus-tice.co.il/lawyers/`
- `https://jus-tice.co.il/lawyers/?area=family-law`
- `https://jus-tice.co.il/lawyers/?area=criminal-law`
- `https://jus-tice.co.il/wp-json/wp/v2/justice_lawyer?per_page=20`
- sampled direct lawyer profile routes

Findings:
- VERIFIED: `/lawyers/` returned `200`, marker `2026-05-11-branding-polish-v3`, title `מדריך עורכי דין בישראל | Jus-Tice`, and `0` `lawyer-card` blocks.
- VERIFIED: family-law and criminal-law directory filters returned `200` and were `noindex`, which is acceptable for filtered directory URLs.
- VERIFIED RISK: public REST endpoint returned `200` with `X-WP-Total: 10`.
- VERIFIED RISK: REST sample exposed published seed-style lawyer IDs `19139` and `19138`.
- VERIFIED RISK: REST sample exposed custom meta including `phone`, `email`, `whatsapp`, `profile_views`, `firm_name`, `bar_number`, `plan_type`, `priority_score`, `source_type`, `profile_status` and `internal_notes`.
- VERIFIED RISK: REST sample exposed placeholder phone patterns such as `03-5557788`, `0535557788`, `09-5555566` and `0545555566`.
- REVIEW: `advocate-maya-rotenberg` redirected through Permalink Manager to the old Hebrew URL and ended with HTTP `404`, but the HTML head still included lawyer-profile title/description/canonical/index signals. This should be made generic/noindex before the head renders.

## Code Fix

Files changed:
- `functions.php`
- `inc/lawyer-rest-guards.php`

Implementation:
- Added `inc/lawyer-rest-guards.php`.
- Anonymous REST collection requests for `justice_lawyer` are filtered to profiles that pass `justice_theme_lawyer_profile_is_public_approved()`.
- Anonymous direct REST requests for unapproved lawyer profile IDs return a `404` REST error.
- Anonymous approved lawyer REST responses remove `meta`, `acf` and `guid` to avoid exposing phone/email/internal/admin fields through REST.
- Unapproved public lawyer profile routes are marked as `404` during the `wp` phase, before template head/SEO output.
- Blocked lawyer profile routes force a generic Hebrew title/description, remove Rank Math canonical output and force noindex/nofollow robots directives.
- Deployment marker changed to `2026-05-11-lawyer-rest-public-guard-v1`.

## Verification

VERIFIED locally:
- `functions.php` passes PHP lint.
- `inc/lawyer-rest-guards.php` passes PHP lint.
- All `130` PHP files pass PHP syntax checks with the local PHP runtime.
- CREATED: `tools/check-live-lawyer-rest-public-guard.ps1`.
- CREATED BASELINE: `project-control/live-lawyer-rest-public-guard-2026-05-11-before-pull.csv`.

Before-pull checker result:
- REVIEW: deployment marker is still pre-fix.
- VERIFIED: `/lawyers/` remains `200` with `0` lawyer cards and no placeholder phone hits in HTML.
- REVIEW: REST collection returns `X-WP-Total: 10`, `11` placeholder phone hits and `50` sensitive meta-key hits.
- REVIEW: direct REST seed ID `19139` returns `200`, with placeholder phone and sensitive meta hits.
- REVIEW: one old profile route check aborted during redirect/response handling; this remains a post-pull browser/source QA item.

NOT LIVE VERIFIED:
- Requires GitHub push, uPress pull/cache refresh, then live public REST and profile-route checks.

## Post-Pull Expected Results

After uPress pulls the commit:
- `deployment-marker.txt` should return `2026-05-11-lawyer-rest-public-guard-v1`.
- `/wp-json/wp/v2/justice_lawyer?per_page=20` should return `X-WP-Total: 0` if there are no approved public lawyers, or approved-only rows if real profiles are approved.
- Public REST response body must not expose `phone`, `email`, `whatsapp`, `profile_views`, `internal_notes` or placeholder `555` phone patterns.
- `/wp-json/wp/v2/justice_lawyer/19139` and other seed IDs should return `404` to anonymous users unless explicitly approved.
- Old unapproved profile URLs should not output lawyer-specific title/description/canonical/index signals.
- `/lawyers/` should remain a valid public directory page.

## Safety

No CMS records were changed.
No lawyer records were drafted, edited, deleted or migrated.
No URL redirects were created.
No taxonomy, sitemap, canonical or content changes were executed.
