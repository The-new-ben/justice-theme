# WP REST Publisher Safety - 2026-05-22

Status: VERIFIED

Scope: repo-local static verification for the SEMrush priority-page publisher script.

This check prevents accidental live WordPress writes from a repo script by requiring explicit `--publish` plus a local credential path outside Git.

## Results

| Check | Status | Risk | Evidence |
| --- | --- | --- | --- |
| WP-REST-PUBLISH-DRY-RUN-DEFAULT | VERIFIED | CRITICAL | Publisher defaults to dry-run unless --publish is present. |
| WP-REST-PUBLISH-BLOCKS-BEFORE-REQUEST | VERIFIED | CRITICAL | Dry-run guard runs before the first WordPress REST lookup or write. |
| WP-REST-PUBLISH-NO-HARDCODED-CREDS | VERIFIED | CRITICAL | Publisher no longer contains the previous machine-specific app-password file path. |
| WP-REST-PUBLISH-ENV-CREDENTIAL | VERIFIED | HIGH | Publisher requires WP_APP_PASSWORD_PATH only when publishing is explicitly requested. |
| WP-REST-PUBLISH-AUTH-DEFERRED | VERIFIED | HIGH | Authorization header is assembled lazily from the explicit credential file, not at module load. |
| WP-REST-PUBLISH-CREDENTIAL-PREFLIGHT | VERIFIED | HIGH | Publish mode validates credentials once before any page upsert loop starts. |
| WP-REST-PUBLISH-HELP-TEXT | VERIFIED | MEDIUM | Operator help documents dry-run default and required publish credentials. |
| WP-REST-PUBLISH-DRY-RUN-RESULTS | VERIFIED | MEDIUM | Dry-run output returns structured per-page results without live writes. |
| WP-REST-PUBLISH-ERROR-EXIT | VERIFIED | MEDIUM | Publisher exits non-zero on runtime failure. |
| WP-REST-PUBLISH-TARGET-SITE | VERIFIED | MEDIUM | Publisher target host remains explicit and reviewable. |

## Upload Notes

- FIXED: `reports/semrush/build-priority-pages.js` is dry-run by default.
- FIXED: live publishing requires `--publish` and `WP_APP_PASSWORD_PATH` pointing to a local file outside Git.
- VERIFIED: no hardcoded machine-specific credential path remains in the publisher.
- NOT LIVE VERIFIED: no WordPress REST write, wp-admin action, public page update or screenshot was performed by this safety check.
- BLOCKED: any future publication still requires owner approval, rollback material, and post-publish live verification.
