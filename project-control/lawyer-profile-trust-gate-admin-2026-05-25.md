# Lawyer Profile Trust Gate Admin - 2026-05-25

## Why This Was Needed

The owner and investor review exposed a real trust risk: a public-basic lawyer profile can look too polished before its photo, education, articles, reviews or source facts are verified. That is dangerous for outreach, investor demo credibility and future lawyer conversion.

## What Changed

- Added a new `Trust gate` column to the `justice_lawyer` admin list.
- Added owner filters for `Needs trust review`, `Hold before promotion`, `Missing source URL`, `Blocked/unverified media`, `Maya source review`, and `Trust ready`.
- Profiles are flagged before promotion when they contain risky signals:
  - current Maya Rotenberg profile identity needs manual source review;
  - seed/demo-like source or internal notes;
  - missing public source URL on imported/public-basic cards;
  - thumbnail exists but is not verified/owned/safe to show;
  - credential text exists without a source note or public source;
  - rating/review values exist but reviews are not enabled/approved.
- Positive signals are also shown, including source link present, verified profile, paid/active plan, safe photo, or initials/avatar fallback.

## Operational Use

Before putting any lawyer into homepage/sponsored/promoted positioning:

1. Open wp-admin -> Lawyers.
2. Filter by `Hold before promotion` and resolve those first.
3. Use `Maya source review` for the specific profile the owner flagged.
4. Only treat `Trust ready` as safe for outreach or premium presentation.

## Honest Limits

- This does not create or verify real facts for any lawyer.
- This does not add competitor photos, copied reviews, ratings, contact details, or biographies.
- This does not create revenue or payment proof.
- It is a control gate so the owner can stop unsafe profiles before they embarrass the demo or outreach process.

## Verification

- Pending live verification after commit, push, and uPress Pull Git.
- Expected live proof: admin lawyer list exposes the new `Trust gate` column/filter; public homepage/profile visual protections from the previous cycle remain intact.

