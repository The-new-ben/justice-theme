# GSC Credential Hygiene - 2026-05-21

Status: FIXED IN REPO / LOCAL SECRET ROTATION RECOMMENDED / NO PUBLIC CHANGES

## What Was Found

`tools/gsc/oauth-client.json` existed as a tracked Git file. This conflicts with the project rule that Google Search Console OAuth credentials must stay outside Git.

I did not print or copy the credential contents.

## What Changed

FIXED:
- Removed `tools/gsc/oauth-client.json` from Git tracking with `git rm --cached`.
- Left the local file in the workspace so local tooling is not broken.
- Updated `.gitignore` to ignore local OAuth client JSON, token JSON and common Google credential JSON names under `tools/gsc/`.
- Updated `tools/gsc/README.md` with credential-safety notes.

## Required Owner Action

RECOMMENDED:
- Create a new OAuth Desktop client in Google Cloud before using GSC API exports.
- Delete or rotate the old OAuth client if the tracked file contained a real secret.
- Keep the new downloaded JSON outside the repo if possible, or place it at `tools/gsc/oauth-client.json` only as a local ignored file.

## Verification

VERIFIED LOCAL:
- `git ls-files tools/gsc/oauth-client.json` should return no tracked file after this commit.
- `tools/gsc/oauth-client.json` remains local and ignored.

## Safety

No public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, CRM, payment, GA4/GSC setting, wp-admin setting or uPress deployment was changed.
