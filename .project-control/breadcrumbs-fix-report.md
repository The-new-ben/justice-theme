# Breadcrumbs Fix Report
Date: 2026-05-10

## LIVE VERIFIED PROBLEM
- `/articles/` and a single article screenshot show breadcrumbs as a visible numbered ordered list.
- This looks like raw browser output, not a premium portal component.
- Mobile article screenshot shows the same numbering and weak spacing.

## FIXED IN CODE
- Added breadcrumb styling in `assets/css/premium-pass-3.css`.
- Added list reset, horizontal layout, premium background band, ellipsis, link styling and mobile overflow behavior.
- Updated `assets/css/rtl.css` so RTL overrides do not reintroduce list markers or flip the separator.

## CODE VERIFIED
- PHP lint passed for 120 files after this pass.
- CSS syntax was checked by `git diff --check`.

## LIVE VERIFICATION STATUS
- NEEDS LIVE VERIFICATION after uPress pulls the commit and cache clears.

## PAGES TO RECHECK
- Homepage: breadcrumbs should not show.
- `/articles/`: breadcrumb should be a clean one-line path.
- `/find-lawyer-how-to-find-good-attorney/`: breadcrumb should be clean on desktop/mobile.
- `/lawyers/`: breadcrumb should be clean above archive title.
- One lawyer profile: breadcrumb should show Home > Lawyers > Practice Area > Profile.
