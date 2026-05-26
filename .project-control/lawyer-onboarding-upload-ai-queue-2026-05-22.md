# Lawyer Onboarding Upload and AI Queue - 2026-05-22

Status: FIXED CODE / VERIFIED LOCAL / NOT LIVE VERIFIED / NO PUBLIC AUTO-PUBLISH

## Summary

FIXED:
- The lawyer registration form now supports optional profile photo, logo, public-safe document and intro-video uploads.
- Submitted upload attachments are stored against the draft lawyer profile and marked `pending_upload_review = 1`.
- Registration now stores `account_continuation_status` so the owner can distinguish logged-in account continuation from submissions that still need an invite/claim step.
- A deterministic AI-assistant profile draft scaffold is generated from the submitted profile answers and stored in `profile_ai_draft_sections`.
- The Lawyer Onboarding admin queue now surfaces upload-review and AI-draft-review flags and provides nonce-protected mark-reviewed actions.

VERIFIED LOCAL:
- `php -l inc/lawyer-onboarding.php` passed.
- `php -l page-lawyer-registration.php` passed.
- `node --check assets/js/lawyer-registration-wizard.js` passed.
- `git diff --check` passed.

NOT LIVE VERIFIED:
- No live registration form submission was performed.
- No live file upload was performed.
- No WordPress admin queue screenshot was captured.
- No public lawyer profile was changed.

## Files Changed

- `page-lawyer-registration.php`
- `inc/lawyer-onboarding.php`
- `assets/js/lawyer-registration-wizard.js`
- `assets/css/premium-pass-3.css`
- `project-control/lawyer-onboarding-workflow.md`

## Safety Rules

MUST NOT SKIP:
- Uploaded assets remain owner-review material only.
- Uploaded files do not publish, route to profile display or become lead assets automatically.
- The generated draft scaffold is not public copy; it is owner/legal/ethics review material.
- Sensitive identity or private license documents should not be uploaded to the normal WordPress media library. License verification should use the existing bar-number field and owner verification workflow.

BLOCKED PUBLIC EXECUTION:
- No live CMS page, lawyer profile, attachment display, public mini-site section, lead routing, payment, outreach, GA4/GSC, URL, redirect, canonical, noindex, sitemap, taxonomy, wp-admin setting or uPress action is approved by this change.

## Next Verification

1. Pull latest code to staging/uPress.
2. Submit a test registration with no files and verify the draft still works.
3. Submit a test registration with one public-safe image and one small PDF brochure.
4. Confirm the draft lawyer profile stores attachment IDs, upload notes, account-continuation status and AI draft scaffold.
5. Open Lawyer Onboarding admin and verify upload/AI review badges and mark-reviewed actions.
6. Confirm nothing appears publicly until the owner explicitly edits/publishes the lawyer profile.
